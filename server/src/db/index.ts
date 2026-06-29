import pg from 'pg'
import fs from 'fs'

const { Pool } = pg

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
})

export async function initDb(){
    const sql = fs.readFileSync('src/db/schema.sql', 'utf-8');
    await pool.query(sql);
    console.log('Schema applicato')
}

export default pool