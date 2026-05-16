import pg from 'pg';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  try {
    const schema = fs.readFileSync('./db/schema.sql', 'utf8');
    const statements = schema.split(';');
    for (let stmt of statements) {
      if (stmt.trim()) {
        try {
          await pool.query(stmt);
        } catch (e) {
          // ignore errors like ENUM already exists
        }
      }
    }
    
    // Seed users
    const hash = await bcrypt.hash('password123', 10);
    await pool.query(`INSERT INTO users (name, email, password) VALUES ('Admin User', 'admin@example.com', $1) ON CONFLICT (email) DO NOTHING`, [hash]);
    await pool.query(`INSERT INTO users (name, email, password) VALUES ('Member User', 'member@example.com', $1) ON CONFLICT (email) DO NOTHING`, [hash]);
    
    console.log('Database seeded successfully');
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

seed();
