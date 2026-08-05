import dbConnect from '../../../lib/db';
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
    const { productId, quantity = 1 } = req.body;

    // ✅ productId আছে কিনা চেক করুন
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // ✅ productId সঠিক ফরম্যাটে আছে কিনা চেক করুন
    if (typeof productId !== 'string' || productId.length < 10) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product && item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity,
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart,
    });
  } catch (error) {
    console.error('Cart add error:', error);
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
}
