const { Client } = require('pg');
require('dotenv').config();

async function checkPolicies() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query(`
    select schemaname, tablename, policyname, roles, cmd, qual, with_check 
    from pg_policies 
    where tablename = 'quizzes';
  `);
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}
checkPolicies();
