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

    // স্টক চেক করুন
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product ? product.name : 'product'}`,
        });
      }
    }

    // অর্ডার আইটেম তৈরি করুন
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : '',
    }));

    // অর্ডার তৈরি করুন
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalPrice: cart.totalPrice,
      totalItems: cart.totalItems,
      shippingAddress,
      paymentMethod,
      notes,
      status: 'pending',
      paymentStatus: 'pending',
    });

    // স্টক আপডেট করুন
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // কার্ট খালি করুন
    cart.items = [];
    cart.totalPrice = 0;
    cart.totalItems = 0;
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
