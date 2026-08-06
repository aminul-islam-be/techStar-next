import dbConnect from "../../../lib/db";
import Order from "../../../models/Order";
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
    const orders = await Order.find({
      user: session.user.id,
      isDeleted: { $ne: true },
      adminDeleted: { $ne: true },
    }).sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("My orders error:", error);
    return res.status(500).json({ message: error.message });
  }
}
