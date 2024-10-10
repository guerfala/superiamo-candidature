// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import pool from '../../../lib/db'; // Adjust the path based on your folder structure
import { RowDataPacket } from 'mysql2';
import { JWT } from 'next-auth/jwt';

interface CustomJWT extends JWT {
  firstName?: string;
  lastName?: string;
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
    async jwt({ token, user }) {
      if (user) {
        const nameParts = user.name?.split(" ") || ["", ""];

        (token as CustomJWT).firstName = nameParts[0] || "";
        (token as CustomJWT).lastName = nameParts.slice(1).join(" ") || "";
        (token as CustomJWT).email = user.email || "";

        const connection = await pool.getConnection();
        try {
          const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [user.email]);

          if (rows.length === 0) {
            await connection.query(
              'INSERT INTO users (nom, prenom, email) VALUES (?, ?, ?)',
              [(token as CustomJWT).firstName, (token as CustomJWT).lastName, user.email]
            );
          }
        } catch (error) {
          console.error('Database query error:', error);
        } finally {
          connection.release();
        }
      }
      return token as CustomJWT;
    },
    async session({ session, token }) {
      if (token) {
        const customToken = token as CustomJWT; // Type assertion here
        session.user = {
          ...session.user,
          firstName: customToken.firstName || "", // Use default value if undefined
          lastName: customToken.lastName || "",   // Use default value if undefined
          email: customToken.email || "",         // Email should always be present
        };
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
});
