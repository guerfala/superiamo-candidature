// lib/db.ts
import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'localhost',
  user: 'root', // e.g., 'root'
  password: '',
  database: 'superiamo',
});

export default {
    query: async (sql: string, values: any[]) => {
      const [rows] = await pool.execute(sql, values);
      return rows;
    },
  };
