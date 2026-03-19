const { Client } = require('pg');

const sql = `
ALTER TABLE public.attempts 
  ADD COLUMN IF NOT EXISTS attempt_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS correct_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_questions INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS auto_graded_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pending_review_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS coins_awarded INTEGER DEFAULT 0;

NOTIFY pgrst, reload_schema;
`;

async function tryConnect(port) {
  const client = new Client({
    connectionString: \`postgres://postgres:postgres@127.0.0.1:\${port}/postgres\`,
  });

  try {
    await client.connect();
    console.log(\`Connected to port \${port}\`);
    await client.query(sql);
    console.log('✅ Migration applied successfully.');
    await client.end();
    return true;
  } catch (err) {
    console.log(\`Failed on port \${port}: \${err.message}\`);
    return false;
  }
}

async function run() {
  const success = await tryConnect(54322) || await tryConnect(5432);
  if (!success) {
    console.error('Failed to connect to both ports.');
  }
}

run();
