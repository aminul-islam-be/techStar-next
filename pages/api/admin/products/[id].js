import dbConnect from '../../../../lib/db';
import Product from '../../../../models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions';

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  const { id } = req.query;

  // GET: একটি পণ্য দেখুন
  if (req.method === 'GET') {
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ success: true, product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT: পণ্য আপডেট করুন
  else if (req.method === 'PUT') {
    try {
      const { name, description, price, category, stock, images, isAvailable } = req.body;

      const product = await Product.findByIdAndUpdate(
        id,
        { name, description, price, category, stock, images, isAvailable },
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE: পণ্য ডিলিট করুন
  else if (req.method === 'DELETE') {
    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
