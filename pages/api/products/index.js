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

    // ✅ প্রতিটি পণ্যের _id আছে কিনা চেক করুন
    const validProducts = products.filter(product => product._id);

    res.status(200).json({
      success: true,
      count: validProducts.length,
      products: validProducts,
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
}
