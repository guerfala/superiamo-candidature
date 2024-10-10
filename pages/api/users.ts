import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { firstName, lastName, email } = req.body;

    try {
      // Check if the user already exists
      const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

      if (rows.length > 0) {
        return res.status(200).json({ message: 'User already exists' });
      }

      // If user doesn't exist, insert new user
      const [result]: any = await pool.query(
        'INSERT INTO users (nom, prenom, email) VALUES (?, ?, ?)',
        [lastName || 'Unknown', firstName || 'Unknown', email] // Default values if undefined
      );

      const insertId = result.insertId;

      return res.status(201).json({ message: 'User created', userId: insertId });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
