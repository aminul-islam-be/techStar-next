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

  const isAdmin = session.user.role === 'admin';
  const { id } = req.query;

  // GET: অর্ডার দেখুন
  if (req.method === 'GET') {
    try {
      const order = await Order.findById(id).populate('user', 'name email');
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      if (!isAdmin && order.user._id.toString() !== session.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      res.status(200).json({ success: true, order });
    } catch (error) {
      console.error('Order fetch error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // PUT: অর্ডার আপডেট (শুধু Admin)
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

  // ✅ DELETE: Customer হলে My History, Admin হলে Admin's Order History
  else if (req.method === 'DELETE') {
    try {
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (!isAdmin && order.user.toString() !== session.user.id) {
        return res.status(403).json({ message: 'Access denied. You can only delete your own orders.' });
      }

      if (isAdmin) {
        if (order.adminDeleted) {
          return res.status(400).json({ message: 'Order already in admin history' });
        }
        order.adminDeleted = true;
        order.adminDeletedAt = new Date();
      } else {
        if (order.isDeleted) {
          return res.status(400).json({ message: 'Order already deleted' });
        }
        order.isDeleted = true;
        order.deletedBy = 'customer';
        order.deletedAt = new Date();
        order.autoDeleteAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }

      await order.save();

      res.status(200).json({
        success: true,
        message: isAdmin ? 'Order moved to Order History' : 'Order moved to My History',
        order,
      });
    } catch (error) {
      console.error('Order delete error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // ✅ CANCEL: শুধু Customer করতে পারবে, My History তে যাবে
  else if (req.method === 'PATCH' && req.body?.action === 'cancel') {
    try {
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      if (!isAdmin && order.user.toString() !== session.user.id) {
        return res.status(403).json({ message: 'Access denied. You can only cancel your own orders.' });
      }
      if (order.status === 'cancelled') {
        return res.status(400).json({ message: 'Order already cancelled' });
      }
      if (order.isDeleted) {
        return res.status(400).json({ message: 'Cannot cancel a deleted order' });
      }

      order.status = 'cancelled';
      order.isCancelled = true;
      order.cancelledAt = new Date();

      if (!isAdmin) {
        order.isDeleted = true;
        order.deletedBy = 'customer';
        order.deletedAt = new Date();
        order.autoDeleteAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }

      await order.save();
      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        order,
      });
    } catch (error) {
      console.error('Order cancel error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
        }
