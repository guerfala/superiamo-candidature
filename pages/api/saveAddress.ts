// pages/api/saveAddress.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import db from "../../lib/db"; // Adjust the import path based on your project structure

export default async function saveAddress(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { address } = req.body;

    // Validate and save address to the database
    try {
      // Assuming you have a function to save the address
      await db.query('UPDATE users SET adresse = ? WHERE email = ?', [address, session.user.email]);
      return res.status(200).json({ message: 'Address saved successfully' });
    } catch (error) {
      console.error("Error saving address:", error);
      return res.status(500).json({ message: 'Error saving address' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
