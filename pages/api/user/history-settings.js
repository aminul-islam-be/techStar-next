import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import Order from "../../../models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";

const ALLOWED_DAYS = [1, 7, 30];

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Please login first" });
  }

  try {
    const user = await User.findById(session.user.id).select(
      "historyRetentionDays"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.method === "GET") {
      return res.status(200).json({
        success: true,
        historyRetentionDays: user.historyRetentionDays || 30,
      });
    }

    if (req.method === "PUT") {
      const days = Number(req.body?.days);
      if (!ALLOWED_DAYS.includes(days)) {
        return res
          .status(400)
          .json({ message: "Retention must be 1, 7, or 30 days" });
      }

      user.historyRetentionDays = days;
      await user.save();

      // Expiry always uses the original order creation date/time.
      const historyOrders = await Order.find({
        user: session.user.id,
        isDeleted: true,
      }).select("_id createdAt");

      const ms = days * 24 * 60 * 60 * 1000;
      if (historyOrders.length) {
        await Order.bulkWrite(
          historyOrders.map((order) => ({
            updateOne: {
              filter: { _id: order._id },
              update: {
                $set: {
                  autoDeleteAt: new Date(
                    new Date(order.createdAt).getTime() + ms
                  ),
                },
              },
            },
          }))
        );
      }

      return res
        .status(200)
        .json({ success: true, historyRetentionDays: days });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("History settings error:", error);
    return res.status(500).json({ message: error.message });
  }
                       }
