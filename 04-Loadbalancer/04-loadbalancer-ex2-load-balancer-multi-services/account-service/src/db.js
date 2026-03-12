import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://bigbank:bigbank@localhost:5432/bigbank';
const pool = new Pool({ connectionString });

export async function initDb(){
    const client = await pool.connect();
    try {
        await client.query(`
        CREATE TABLE IF NOT EXISTS accounts (
            id SERIAL PRIMARY KEY,
            "userId" INTEGER NOT NULL,
            label VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL,
            balance DECIMAL(12,2) DEFAULT 100,
            "createdAt" TIMESTAMPTZ DEFAULT NOW()
            )
        `);
    } finally {
        client.release();
    }
}

export default pool;