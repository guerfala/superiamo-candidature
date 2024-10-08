// pages/api/auth/[...nextauth].ts (or your sign-in logic)
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios'; // You might need to install axios


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
    async signIn({ user, account, profile }) {
      // This is where you'll handle saving the user info to your database
      try {
        const response = await axios.post('/api/users', {
          email: user.email,
          firstName: user.given_name,
          lastName: user.family_name,
          dateOfBirth: '', // Add if available
          address: '', // Add if available
          phoneNumber: '', // Add if available
        });

        console.log(response.data); // Log the response from your API
        return true; // Return true to allow sign in
      } catch (error) {
        console.error('Error saving user:', error);
        return false; // Return false to deny sign in
      }
    },
    async session({ session, user }) {
      // Here you can attach user data to the session
      return session;
    },
  },
});
