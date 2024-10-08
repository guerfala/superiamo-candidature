import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Extend the User interface with the necessary properties
declare module "next-auth" {
  interface User {
    id: string;            // Ensure id is included
    firstName?: string;   // Optional first name
    lastName?: string;    // Optional last name
    dateOfBirth?: string; // Optional date of birth
    address?: string;     // Optional address
    phoneNumber?: string; // Optional phone number
  }

  interface Session {
    user: User;          // User object now includes all specified fields
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
