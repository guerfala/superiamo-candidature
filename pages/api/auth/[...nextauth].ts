import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import pool from '../../../lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { JWT } from 'next-auth/jwt';

interface CustomJWT extends JWT {
  userId?: number;
  firstName?: string;
  lastName?: string;
  accessToken?: string;
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

      if (account) {
        (token as CustomJWT).accessToken = account.access_token;
      }

      const connection = await pool.getConnection();
      try {
        const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [token.email]);

        if (rows.length === 0) {
          const [insertResult] = await connection.query<ResultSetHeader>(
            'INSERT INTO users (nom, prenom, email) VALUES (?, ?, ?)',
            [(token as CustomJWT).firstName, (token as CustomJWT).lastName, token.email]
          );

          (token as CustomJWT).userId = insertResult.insertId;
        } else {
          (token as CustomJWT).userId = rows[0].id;
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
        const customToken = token as CustomJWT;
        session.user = {
          ...session.user,
          id: customToken.userId?.toString() || "",
          firstName: customToken.firstName || "",
          lastName: customToken.lastName || "",
          email: customToken.email || "",
          accessToken: customToken.accessToken || "",
        };
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  // Add this line to specify NEXTAUTH_URL
  pages: {
    signIn: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
  },
});
