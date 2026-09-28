const mysql = require('mysql2/promise');
const crypto = require('crypto');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_alouhfutsal'
  });

  const passwordHash = crypto.createHash('md5').update('admin123').digest('hex');

  // Check if admin user exists
  const [rows] = await connection.query("SELECT * FROM tb_user WHERE username = 'admin'");
  
  if (rows.length > 0) {
    await connection.query("UPDATE tb_user SET password = ? WHERE username = 'admin'", [passwordHash]);
    console.log("Admin password updated successfully to 'admin123'");
  } else {
    // Check if there is any user, if so update the first one or just insert a new admin
    console.log("No user with username 'admin' found. Creating one...");
    await connection.query(
      "INSERT INTO tb_user (nama, username, password, level, nohp, alamat) VALUES (?, ?, ?, ?, ?, ?)",
      ['Administrator', 'admin', passwordHash, '1', '08123456789', 'Jl. Admin']
    );
    console.log("Admin user created successfully.");
  }
  
  await connection.end();
}

main().catch(console.error);
