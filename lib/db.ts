import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,    // Your database host
  user: process.env.DB_USER,    // Your database user
  password: process.env.DB_PASS, // Your database password
  database: process.env.DB_NAME, // Your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
