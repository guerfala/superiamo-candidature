// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    email: string;
    firstName?: string; // Optional because it may not be present
    lastName?: string;  // Optional because it may not be present
    dateDeNaissance?: string; // Use Date type if you want
    adresse?: string;
    numeroDeTelephone?: string;
  }

  interface Session {
    user: User;
  }
}
