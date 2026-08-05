import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await dbConnect();

    const result = await Order.deleteMany({
      isDeleted: true,
      autoDeleteAt: { $lte: new Date() },
    });

    res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
