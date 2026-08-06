import dbConnect from "../../../lib/db";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await dbConnect();

    const orders = await Order.find({ isDeleted: true }).populate(
      "user",
      "historyRetentionDays"
    );
    const now = Date.now();
    const expiredIds = [];
    const updates = [];

    for (const order of orders) {
      const days = order.user?.historyRetentionDays || 30;
      const expiryMs =
        new Date(order.createdAt).getTime() + days * 24 * 60 * 60 * 1000;
      if (expiryMs <= now) {
        expiredIds.push(order._id);
      } else if (
        !order.autoDeleteAt ||
        new Date(order.autoDeleteAt).getTime() !== expiryMs
      ) {
        updates.push({
          updateOne: {
            filter: { _id: order._id },
            update: { $set: { autoDeleteAt: new Date(expiryMs) } },
          },
        });
      }
    }

    if (updates.length) await Order.bulkWrite(updates);

    let deletedCount = 0;
    if (expiredIds.length) {
      const result = await Order.deleteMany({
        _id: { $in: expiredIds },
        isDeleted: true,
      });
      deletedCount = result.deletedCount || 0;
    }

    return res.status(200).json({ success: true, deletedCount });
  } catch (error) {
    console.error("Cleanup orders error:", error);
    return res.status(500).json({ message: error.message });
  }
}
