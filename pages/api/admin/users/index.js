import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Please login first' });
  }

  if (session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  // GET: সব ইউজার দেখান
  if (req.method === 'GET') {
    try {
      const users = await User.find({})
        .select('-password') // পাসওয়ার্ড বাদ দিন
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: users.length,
        users,
      });
    } catch (error) {
      console.error('Users fetch error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // PUT: ইউজার রোল আপডেট করুন
  else if (req.method === 'PUT') {
    try {
      const { id, role } = req.body;

      if (!id || !role) {
        return res.status(400).json({ message: 'User ID and role are required' });
      }

      const validRoles = ['user', 'admin', 'vendor'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        success: true,
        message: 'User role updated successfully',
        user,
      });
    } catch (error) {
      console.error('User update error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE: ইউজার ডিলিট করুন
  else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      // নিজেকে ডিলিট করতে দেবেন না
      if (id === session.user.id) {
        return res.status(400).json({ message: 'You cannot delete your own account' });
      }

      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('User delete error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
