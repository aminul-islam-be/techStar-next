import dbConnect from "../../../lib/db";
import Order from "../../../models/Order";
import User from "../../../models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";

const historyExpiryForUser = async (userId, createdAt) => {
  const user = await User.findById(userId).select("historyRetentionDays");
  const days = user?.historyRetentionDays || 30;
  return new Date(new Date(createdAt).getTime() + days * 24 * 60 * 60 * 1000);
};

export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id)
    return res.status(401).json({ message: "Please login first" });

  const isAdmin = session.user.role === "admin";
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const order = await Order.findById(id).populate("user", "name email");
      if (!order) return res.status(404).json({ message: "Order not found" });
      if (!isAdmin && order.user._id.toString() !== session.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      return res.status(200).json({ success: true, order });
    } catch (error) {
      console.error("Order fetch error:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  if (req.method === "PUT") {
    if (!isAdmin)
      return res.status(403).json({ message: "Access denied. Admin only." });
    try {
      const { status, paymentStatus, notes } = req.body;
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      if (status) order.status = status;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      if (notes !== undefined) order.notes = notes;
      await order.save();
      return res
        .status(200)
        .json({ success: true, message: "Order updated successfully", order });
    } catch (error) {
      console.error("Order update error:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      if (!isAdmin && order.user.toString() !== session.user.id) {
        return res
          .status(403)
          .json({
            message: "Access denied. You can only delete your own orders.",
          });
      }

      if (isAdmin) {
        if (order.adminDeleted)
          return res
            .status(400)
            .json({ message: "Order already in admin history" });
        order.adminDeleted = true;
        order.adminDeletedAt = new Date();
      } else {
        if (order.isDeleted)
          return res.status(400).json({ message: "Order already deleted" });
        order.isDeleted = true;
        order.deletedBy = "customer";
        order.deletedAt = new Date();
        order.autoDeleteAt = await historyExpiryForUser(
          session.user.id,
          order.createdAt
        );
      }

      await order.save();
      return res.status(200).json({
        success: true,
        message: isAdmin
          ? "Order moved to Order History"
          : "Order moved to My History",
        order,
      });
    } catch (error) {
      console.error("Order delete error:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  if (req.method === "PATCH" && req.body?.action === "cancel") {
    try {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      if (!isAdmin && order.user.toString() !== session.user.id) {
        return res
          .status(403)
          .json({
            message: "Access denied. You can only cancel your own orders.",
          });
      }
      if (order.status === "cancelled")
        return res.status(400).json({ message: "Order already cancelled" });
      if (order.isDeleted)
        return res
          .status(400)
          .json({ message: "Cannot cancel a deleted order" });

      order.status = "cancelled";
      order.isCancelled = true;
      order.cancelledAt = new Date();

      if (!isAdmin) {
        order.isDeleted = true;
        order.deletedBy = "customer";
        order.deletedAt = new Date();
        order.autoDeleteAt = await historyExpiryForUser(
          session.user.id,
          order.createdAt
        );
      }

      await order.save();
      return res
        .status(200)
        .json({
          success: true,
          message: "Order cancelled successfully",
          order,
        });
    } catch (error) {
      console.error("Order cancel error:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
    }
