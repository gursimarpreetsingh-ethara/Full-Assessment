import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Initialize connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Utility to execute queries easily
 * @param {string} text - SQL Query String
 * @param {Array} params - Array of parameters
 */
export const query = (text, params) => pool.query(text, params);
