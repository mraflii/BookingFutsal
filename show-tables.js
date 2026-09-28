const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });

  const databases = ['keamanan', 'pemetaan', 'spk_desa_blankspot', 'test'];
  for (const db of databases) {
    try {
      const [rows] = await connection.query(`SHOW TABLES FROM ${db};`);
      console.log(`Tables in ${db}:`, rows.map(r => Object.values(r)[0]));
    } catch (e) {
      console.log(`Error checking ${db}:`, e.message);
    }
  }
  
  await connection.end();
}

main().catch(console.error);
