import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./db";
import User from "../models/User";

const normalizePhone = (value = "") => value.replace(/[\s()-]/g, "");

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Phone & Password",
      credentials: {
        phone: { label: "Phone Number", type: "tel" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const identifier = (credentials?.phone || "").trim();
        const phone = normalizePhone(identifier);

        // Customer login is phone + password. Email fallback is kept only so an
        // existing admin account created by the old version is not locked out.
        const user = await User.findOne({
          $or: [
            { phone },
            { phone: identifier },
            { email: identifier.toLowerCase() },
          ],
        }).select("+password");

        if (!user) throw new Error("No account found with this phone number");
        const valid = await bcrypt.compare(
          credentials?.password || "",
          user.password
        );
        if (!valid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          name: user.name,
          phone: user.phone,
          email: user.email || "",
          role: user.role,
          profilePicture: user.profilePicture || "",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
        token.email = user.email;
        token.profilePicture = user.profilePicture;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.phone = token.phone;
        session.user.email = token.email || "";
        session.user.profilePicture = token.profilePicture || "";
      }
      return session;
    },
  },
  pages: { signIn: "/auth/login" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};
