import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export default NextAuth({
  providers: [
    // Credentials (Email/Password)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'example@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();

        // Find user by email
        const user = await User.findOne({ email: credentials.email }).select('+password');

        if (!user) {
          throw new Error('No user found with this email');
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordCorrect) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),

    // Google Provider (Optional)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // GitHub Provider (Optional)
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account.provider === 'google' || account.provider === 'github') {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // Create new user for social login
          await User.create({
            name: user.name,
            email: user.email,
            password: await bcrypt.hash(Math.random().toString(36).slice(-8), 12),
            isVerified: true,
          });
        }
      }
      return true;
    },
  },

  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/login', // Redirect back to login on error
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
});
