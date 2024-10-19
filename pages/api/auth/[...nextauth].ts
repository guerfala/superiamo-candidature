// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import pool from '../../../lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
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
        const nameParts = user.name?.split(" ") || ["", ""]; // Split name into parts
        (token as CustomJWT).firstName = nameParts[0] || ""; // Assign first name
        (token as CustomJWT).lastName = nameParts.slice(1).join(" ") || ""; // Assign last name
        (token as CustomJWT).email = user.email || ""; // Assign email
      }

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
        connection.release(); // Release the database connection
      }
      return token as CustomJWT; // Return the modified token
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
      return session; // Return the modified session
    },
    async redirect({ url, baseUrl }) {
      // Prevent redirect loops
      if (url === '/api/auth/callback/google') {
        return baseUrl; // Redirect to the base URL to avoid loops
      }
      return url.startsWith(baseUrl) ? url : baseUrl; // Allow internal redirects
    },
  },
  debug: process.env.NODE_ENV === 'development', // Enable debugging in development mode
});
