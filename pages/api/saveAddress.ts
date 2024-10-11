import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../lib/db"; // Adjust the path based on your folder structure
import { getToken } from "next-auth/jwt";

const saveAddress = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const token = await getToken({ req }); // Get the JWT token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" }); // Return 401 if not authenticated
    }

    const userId = token.userId; // Get userId from the token
    const { address } = req.body; // Get the new address from the request body

    if (!address) {
      return res.status(400).json({ message: "Address is required" }); // Validate address input
    }

    try {
      const connection = await pool.getConnection();
      await connection.query(
        "UPDATE users SET adresse = ? WHERE id = ?",
        [address, userId]
      );
      connection.release();

      return res.status(200).json({ message: "Address updated successfully" }); // Return success message
    } catch (error) {
      console.error("Error updating address:", error);
      return res.status(500).json({ message: "Error updating address" }); // Return error message
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" }); // Return method not allowed if not POST
  }
};

export default saveAddress;
