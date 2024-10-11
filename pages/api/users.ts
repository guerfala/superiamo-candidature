// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/db'; // Adjust the path based on your folder structure
import { verify } from 'jsonwebtoken';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const { id, firstName, lastName, dateDeNaissance, adresse, numeroDeTelephone, email } = req.body;

    // Optionally verify the token here
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
      // Verify the token (if needed)
      // const decoded = verify(token, process.env.JWT_SECRET); // If using JWT verification

      const connection = await pool.getConnection();
      await connection.query(
        'UPDATE users SET nom = ?, prenom = ?, dateDeNaissance = ?, adresse = ?, NumeroDeTelephone = ? WHERE id = ?',
        [lastName, firstName, dateDeNaissance, adresse, numeroDeTelephone, id]
      );

      connection.release();
      return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Database update error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
