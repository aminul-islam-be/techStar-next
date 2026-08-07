import crypto from "crypto";
import bcrypt from "bcryptjs";
import dbConnect from "../../../lib/db";
import User from "../../../models/User";
export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });
  try {
    await dbConnect();
    const { token, password } = req.body || {};
    if (!token || !password || password.length < 6)
      return res
        .status(400)
        .json({
          message:
            "Valid token and a password of at least 6 characters are required",
        });
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hash,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+password");
    if (!user)
      return res
        .status(400)
        .json({ message: "Reset link is invalid or expired" });
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
