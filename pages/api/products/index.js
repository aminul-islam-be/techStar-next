import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const products = await Product.find({ isAvailable: true })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
}
