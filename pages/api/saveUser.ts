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
      await connection.query(
        'UPDATE users SET nom = ?, prenom = ? WHERE email = ?',
        [nom, prenom, email]
      );
      connection.release();
      return res.status(201).json({ message: 'User saved successfully' });
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
