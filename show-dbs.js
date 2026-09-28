const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });

  const [rows] = await connection.query("SHOW DATABASES;");
  console.log("Databases:", rows);
  
  await connection.end();
}

main().catch(console.error);
