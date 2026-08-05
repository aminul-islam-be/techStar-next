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

    // ✅ শুধু active অর্ডার দেখাবে (যেগুলো deleted নয়)
    const orders = await Order.find({
      user: session.user.id,
      isDeleted: false,  // ← এই লাইনটি যোগ করুন
    })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('My orders error:', error);
    res.status(500).json({ message: error.message });
  }
}
