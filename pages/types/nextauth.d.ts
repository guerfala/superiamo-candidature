// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add the 'id' property
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string; // If you have an access token, include it
    };
  }

  interface User {
    id: string; // Ensure the User type also includes 'id'
    // Add other custom user properties here if needed
  }
}
