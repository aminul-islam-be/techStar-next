import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';
import Cart from '../../../models/Cart';
import Product from '../../../models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/authOptions';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({ message: 'Please login first' });
    }

    const userId = session.user.id;
    const { shippingAddress, paymentMethod = 'cash', notes = '' } = req.body;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
      return res.status(400).json({ message: 'Please provide shipping address' });
    }

    // কার্ট থেকে আইটেম নিন
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // ✅ Safety Check: শুধু valid product থাকা আইটেম নিন
    const validItems = cart.items.filter((item) => item.product);

    if (validItems.length === 0) {
      return res.status(400).json({ message: 'No valid products in cart' });
    }

    // স্টক চেক করুন
    for (const item of validItems) {
      const product = await Product.findById(item.product._id);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product ? product.name : 'product'}`,
        });
      }
    }

    // অর্ডার আইটেম তৈরি করুন
    const orderItems = validItems.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : '',
    }));

    // মোট দাম 계산
    const totalPrice = validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);

    // অর্ডার তৈরি করুন
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalPrice,
      totalItems,
      shippingAddress,
      paymentMethod,
      notes,
      status: 'pending',
      paymentStatus: 'pending',
    });

    // স্টক আপডেট করুন
    for (const item of validItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // কার্ট খালি করুন (শুধু valid items সরান)
    cart.items = cart.items.filter((item) => !item.product);
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    console.error('Order create error:', error);
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
        }
