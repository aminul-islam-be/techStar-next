import crypto from "crypto";
import dbConnect from "../../../lib/db";
import User from "../../../models/User";
export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });
  try {
    await dbConnect();
    const { phone, email } = req.body || {};
    const cleanPhone = (phone || "").replace(/[\s()-]/g, "");
    const cleanEmail = (email || "").trim().toLowerCase();
    const user = await User.findOne({ phone: cleanPhone, email: cleanEmail });
    if (!user)
      return res
        .status(400)
        .json({ message: "Phone number and email do not match our records" });
    if (!process.env.RESEND_API_KEY || !process.env.RESET_FROM_EMAIL)
      return res
        .status(500)
        .json({
          message: "Password reset email service is not configured yet",
        });
    const raw = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(raw).digest("hex");
    user.resetPasswordToken = hash;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();
    const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const url = `${base}/auth/reset-password?token=${raw}`;
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESET_FROM_EMAIL,
        to: user.email,
        subject: "TechStar Password Reset",
        html: `<p>You requested a TechStar password reset.</p><p><a href="${url}">Reset your password</a></p><p>This link expires in 30 minutes.</p>`,
      }),
    });
    if (!emailRes.ok) {
      user.resetPasswordToken = "";
      user.resetPasswordExpires = null;
      await user.save();
      return res.status(500).json({ message: "Could not send reset email" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Reset link sent to your email" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Something went wrong" });
  }
      }
