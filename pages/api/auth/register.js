import bcrypt from "bcryptjs";
import dbConnect from "../../../lib/db";
import User from "../../../models/User";

const normalizePhone = (value = "") => value.replace(/[\s()-]/g, "");

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    await dbConnect();
    const { name, phone, email, password } = req.body || {};
    const cleanPhone = normalizePhone(phone);
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!name || !cleanPhone || !cleanEmail || !password)
      return res
        .status(400)
        .json({
          message: "Name, phone number, email and password are required",
        });
    if (!/^\+?[0-9]{8,15}$/.test(cleanPhone))
      return res
        .status(400)
        .json({ message: "Please enter a valid phone number" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    if (cleanEmail && !/^\S+@\S+\.\S+$/.test(cleanEmail))
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });

    const phoneExists = await User.findOne({ phone: cleanPhone });
    if (phoneExists)
      return res
        .status(400)
        .json({ message: "This phone number is already registered" });

    if (cleanEmail) {
      const emailExists = await User.findOne({ email: cleanEmail });
      if (emailExists)
        return res
          .status(400)
          .json({ message: "This email address is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      phone: cleanPhone,
      email: cleanEmail || undefined,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email || "",
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    if (error?.code === 11000)
      return res
        .status(400)
        .json({ message: "Phone number or email is already registered" });
    return res.status(500).json({ message: "Something went wrong" });
  }
        }
