// pages/api/saveUser.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/db'; // Adjust the path based on your folder structure

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const { nom, prenom, email } = req.body;

    if (!nom || !prenom || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const connection = await pool.getConnection();

      // Check if the user exists
      const [users] = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (Array.isArray(users) && users.length > 0) {
        // User exists, do not update nom and prenom
        return res.status(200).json({ message: 'User already exists. No updates made.' });
      } else {
        // User does not exist, insert new user
        await connection.query(
          'INSERT INTO users (nom, prenom, email) VALUES (?, ?, ?)',
          [nom, prenom, email]
        );
        return res.status(201).json({ message: 'User saved successfully' });
      }

      connection.release();
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
