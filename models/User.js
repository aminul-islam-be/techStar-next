import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [100, "Name cannot be more than 100 characters"],
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
    unique: true,
    trim: true,
    index: true,
  },
  email: { type: String, trim: true, lowercase: true, sparse: true },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  profilePicture: { type: String, default: "" },
  permanentAddress: { type: String, default: "" },
  city: { type: String, default: "" },
  postalCode: { type: String, default: "" },
  country: { type: String, default: "Bangladesh" },
  office: { type: String, default: "" },
  study: {
    type: String,
    enum: ["", "School", "College", "University", "Madrasha"],
    default: "",
  },
  institutionName: { type: String, default: "" },
  role: { type: String, enum: ["user", "vendor", "admin"], default: "user" },
  isVerified: { type: Boolean, default: false },
  historyRetentionDays: { type: Number, enum: [1, 7, 30], default: 30 },
  resetPasswordToken: { type: String, default: "" },
  resetPasswordExpires: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
