import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/authOptions';

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Please login first' });
  }

  // Admin অথবা Order এর Owner (Customer) চেক করুন
  const isAdmin = session.user.role === 'admin';
  const { id } = req.query;

  // GET: একটি অর্ডার দেখুন (Admin অথবা Customer)
  if (req.method === 'GET') {
    try {
      const order = await Order.findById(id).populate('user', 'name email');
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Customer চেক: শুধু নিজের অর্ডার দেখতে পারবে
      if (!isAdmin && order.user._id.toString() !== session.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      res.status(200).json({ success: true, order });
    } catch (error) {
      console.error('Order fetch error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // PUT: অর্ডার আপডেট করুন (শুধু Admin)
  else if (req.method === 'PUT') {
    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    try {
      const { status, paymentStatus, notes } = req.body;

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (status) order.status = status;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      if (notes !== undefined) order.notes = notes;

      await order.save();

      res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        order,
      });
    } catch (error) {
      console.error('Order update error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE: অর্ডার ডিলিট করুন (শুধু Admin)
  else if (req.method === 'DELETE') {
    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    try {
      const order = await Order.findByIdAndDelete(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
      });
    } catch (error) {
      console.error('Order delete error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
                        }
