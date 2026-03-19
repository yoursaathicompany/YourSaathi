const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
  const client = new Client({
    connectionString: 'postgres://postgres:postgres@127.0.0.1:5432/postgres',
  });

  try {
    await client.connect();
    console.log('Connected to Supabase Postgres locally.');
    
    const sqlPath = path.join(__dirname, 'supabase', 'migrations', '20260315000002_add_password.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await client.query(sql);
    console.log('✅ Migration applied successfully: added password_hash to public.users');
  } catch (err) {
    console.error('❌ Failed to apply migration:', err.message);
  } finally {
    await client.end();
  }
}

applyMigration();
