// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import pool from '../../../lib/db'; // Adjust the path based on your folder structure
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise'; // Import types correctly
import { JWT } from 'next-auth/jwt';

// Extend the JWT interface to include custom fields
interface CustomJWT extends JWT {
  userId?: number; // Add userId to the JWT interface
  firstName?: string;
  lastName?: string;
  accessToken?: string; // Add accessToken to the JWT interface
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        const nameParts = user.name?.split(" ") || ["", ""];
        (token as CustomJWT).firstName = nameParts[0] || "";
        (token as CustomJWT).lastName = nameParts.slice(1).join(" ") || "";
        (token as CustomJWT).email = user.email || "";
      }

      // Store access token when account is present (on sign-in)
      if (account) {
        (token as CustomJWT).accessToken = account.access_token; // Save access token
      }

      const connection = await pool.getConnection();
      try {
        const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [token.email]);

        if (rows.length === 0) {
          // Insert new user if they don't exist
          const [insertResult] = await connection.query<ResultSetHeader>(
            'INSERT INTO users (nom, prenom, email) VALUES (?, ?, ?)',
            [(token as CustomJWT).firstName, (token as CustomJWT).lastName, token.email]
          );

          (token as CustomJWT).userId = insertResult.insertId; // Save new user ID
        } else {
          (token as CustomJWT).userId = rows[0].id; // Retrieve existing user ID
        }
      } catch (error) {
        console.error('Database query error:', error);
      } finally {
        connection.release();
      }
      return token as CustomJWT;
    },
    async session({ session, token }) {
      if (token) {
        const customToken = token as CustomJWT; // Type assertion here
        session.user = {
          ...session.user,
          id: customToken.userId?.toString() || "", // Ensure userId is a string
          firstName: customToken.firstName || "",
          lastName: customToken.lastName || "",
          email: customToken.email || "",
          accessToken: customToken.accessToken || "", // Add access token to session
        };
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
});
