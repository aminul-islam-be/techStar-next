import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/authOptions';

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  if (req.method === 'GET') {
    try {
      const orders = await Order.find({ adminDeleted: true })
        .populate('user', 'name email')
        .sort({ adminDeletedAt: -1 });

      res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // ✅ Permanent Delete: ডেটাবেস থেকে সম্পূর্ণ মুছে ফেলবে
  else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      await Order.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'Order permanently deleted',
      });
    } catch (error) {
      console.error('Permanent delete error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
