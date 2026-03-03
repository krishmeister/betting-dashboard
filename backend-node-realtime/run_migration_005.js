import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load credentials from .env file
dotenv.config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || '16036'),
    ssl: { rejectUnauthorized: false },
    multipleStatements: true
};

async function run() {
    let connection;
    try {
        console.log('Connecting to Aiven MySQL...');
        connection = await mysql.createConnection(config);
        console.log('✅ Connected.');

        const sqlPath = path.resolve('../database_migrations/005_coin_ledger.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing 005_coin_ledger.sql...');
        await connection.query(sql);
        console.log('✅ Migration 005 complete.');

        // Verify
        const [tables] = await connection.query("SHOW TABLES LIKE 'coin_transactions'");
        console.log('Verification:', tables.length > 0 ? '✅ coin_transactions table exists' : '❌ Table not found');

        const [cols] = await connection.query("SHOW COLUMNS FROM nodes LIKE 'current_balance'");
        console.log('Verification:', cols.length > 0 ? '✅ nodes.current_balance column exists' : '❌ Column not found');

    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        if (connection) await connection.end();
        console.log('Connection closed.');
    }
}

run();
