import dbConnect from "../../../lib/db";
import Order from "../../../models/Order";
import User from "../../../models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id)
    return res.status(401).json({ message: "Please login first" });

  try {
    const user = await User.findById(session.user.id).select(
      "historyRetentionDays"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    const retentionDays = user.historyRetentionDays || 30;
    const retentionMs = retentionDays * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const historyOrders = await Order.find({
      user: session.user.id,
      isDeleted: true,
    }).sort({ createdAt: -1 });

    const expiredIds = [];
    const remaining = [];

    for (const order of historyOrders) {
      const expiry = new Date(order.createdAt).getTime() + retentionMs;
      if (expiry <= now) {
        expiredIds.push(order._id);
      } else {
        remaining.push(order);
      }
    }

    if (expiredIds.length) {
      await Order.deleteMany({
        _id: { $in: expiredIds },
        user: session.user.id,
        isDeleted: true,
      });
    }

    // Keep autoDeleteAt synchronized with the user's current setting.
    const needsSync = remaining.filter((order) => {
      const expected = new Date(
        new Date(order.createdAt).getTime() + retentionMs
      ).getTime();
      return (
        !order.autoDeleteAt ||
        new Date(order.autoDeleteAt).getTime() !== expected
      );
    });
    if (needsSync.length) {
      await Order.bulkWrite(
        needsSync.map((order) => ({
          updateOne: {
            filter: { _id: order._id },
            update: {
              $set: {
                autoDeleteAt: new Date(
                  new Date(order.createdAt).getTime() + retentionMs
                ),
              },
            },
          },
        }))
      );
    }

    return res.status(200).json({
      success: true,
      count: remaining.length,
      retentionDays,
      orders: remaining,
    });
  } catch (error) {
    console.error("My history error:", error);
    return res.status(500).json({ message: error.message });
  }
}
