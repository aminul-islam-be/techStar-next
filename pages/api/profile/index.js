import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
const normalizePhone = (v = "") => v.replace(/[\s()-]/g, "");
export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id)
    return res.status(401).json({ message: "Please login first" });
  try {
    if (req.method === "GET") {
      const user = await User.findById(session.user.id).select(
        "-password -resetPasswordToken -resetPasswordExpires"
      );
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json({ success: true, profile: user });
    }
    if (req.method === "PUT") {
      const {
        name,
        phone,
        email,
        profilePicture,
        permanentAddress,
        city,
        postalCode,
        country,
        office,
        study,
        institutionName,
      } = req.body || {};
      const cleanPhone = normalizePhone(phone);
      if (!name?.trim() || !cleanPhone)
        return res
          .status(400)
          .json({ message: "Name and phone number are required" });
      if (!/^\+?[0-9]{8,15}$/.test(cleanPhone))
        return res
          .status(400)
          .json({ message: "Please enter a valid phone number" });
      if (email && !/^\S+@\S+\.\S+$/.test(email.trim()))
        return res
          .status(400)
          .json({ message: "Please enter a valid email address" });
      if (
        !["", "School", "College", "University", "Madrasha"].includes(
          study || ""
        )
      )
        return res.status(400).json({ message: "Invalid study type" });
      if (
        await User.findOne({ phone: cleanPhone, _id: { $ne: session.user.id } })
      )
        return res
          .status(400)
          .json({
            message: "This phone number is already used by another account",
          });
      if (
        email &&
        (await User.findOne({
          email: email.trim().toLowerCase(),
          _id: { $ne: session.user.id },
        }))
      )
        return res
          .status(400)
          .json({
            message: "This email address is already used by another account",
          });
      const user = await User.findByIdAndUpdate(
        session.user.id,
        {
          $set: {
            name: name.trim(),
            phone: cleanPhone,
            email: email?.trim().toLowerCase() || undefined,
            profilePicture: profilePicture || "",
            permanentAddress: permanentAddress || "",
            city: city || "",
            postalCode: postalCode || "",
            country: country || "Bangladesh",
            office: office || "",
            study: study || "",
            institutionName: institutionName || "",
          },
        },
        { new: true, runValidators: true }
      ).select("-password -resetPasswordToken -resetPasswordExpires");
      return res
        .status(200)
        .json({
          success: true,
          message: "Profile updated successfully",
          profile: user,
        });
    }
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Profile API error:", error);
    if (error?.code === 11000)
      return res
        .status(400)
        .json({ message: "Phone number or email is already in use" });
    return res
      .status(500)
      .json({ message: error.message || "Something went wrong" });
  }
        }
