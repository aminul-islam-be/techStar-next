import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/authOptions';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({ message: 'Please login first' });
    }

    // ✅ Customer এর deleted অর্ডার খুঁজুন (deletedBy: 'customer')
    const orders = await Order.find({
      user: session.user.id,
      isDeleted: true,
      deletedBy: 'customer',
    })
      .populate('user', 'name email')
      .sort({ deletedAt: -1 });

    // ✅ 30 দিনের বেশি পুরনো অর্ডার ফিল্টার করুন
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeHistory = orders.filter(order => {
      if (!order.autoDeleteAt) return true;
      return new Date(order.autoDeleteAt) > new Date();
    });

    res.status(200).json({
      success: true,
      count: activeHistory.length,
      orders: activeHistory,
    });
  } catch (error) {
    console.error('My history error:', error);
    res.status(500).json({ message: error.message });
  }
      }
