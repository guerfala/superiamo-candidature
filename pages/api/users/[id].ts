import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db'; // Adjust the path based on your folder structure
import { RowDataPacket } from 'mysql2'; // Import RowDataPacket for typing

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // Verify the token if needed
    // const decoded = verify(token, process.env.JWT_SECRET); // Uncomment if using JWT verification

    const { id } = req.query; // Get user ID from query

    // Handle GET request to fetch user data
    if (req.method === 'GET') {
      const connection = await pool.getConnection();
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );

      connection.release();

      if (rows.length > 0) {
        return res.status(200).json(rows[0]); // Return the user data
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    // Handle PUT request to update user data
    if (req.method === 'PUT') {
      const { nom, prenom, dateDeNaissance, adresse, numeroDeTelephone } = req.body;

      const connection = await pool.getConnection();
      const result = await connection.query(
        'UPDATE users SET nom = ?, prenom = ?, dateDeNaissance = ?, adresse = ?, NumeroDeTelephone = ? WHERE id = ?',
        [nom, prenom, dateDeNaissance, adresse, numeroDeTelephone, id]
      );
      console.log(result);

      connection.release();
      return res.status(200).json({ message: 'User updated successfully' });
    }

    // If method is not allowed
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default handler;
