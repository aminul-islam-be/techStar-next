import dbConnect from '../../../lib/db';
import Cart from '../../../models/Cart';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Please login first' });
    }

    const userId = session.user?.id || session.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User ID not found' });
    }

    let cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      cart = {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error('Cart get error:', error);
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
      }
