const mysql = require('mysql2/promise');
const crypto = require('crypto');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_alouhfutsal'
  });

  console.log("Menambahkan data contoh...");

  // Tambah Lapangan
  await connection.query("DELETE FROM tb_daftar_lapangan");
  await connection.query(`
    INSERT INTO tb_daftar_lapangan (id_lapangan, nama_lapangan, harga, foto) VALUES
    ('LAP01', 'Lapangan Vinyl A', 100000, ''),
    ('LAP02', 'Lapangan Rumput Sintetis B', 120000, ''),
    ('LAP03', 'Lapangan Interlock C', 150000, '')
  `);
  
  // Tambah User Pelanggan Dummy
  const pwd = crypto.createHash('md5').update('password').digest('hex');
  await connection.query("DELETE FROM tb_user WHERE level = '2'");
  await connection.query(`
    INSERT INTO tb_user (nama, username, password, level, nohp, alamat) VALUES
    ('Budi Santoso', 'budi', ?, '2', '081234567890', 'Jl. Merdeka No 1'),
    ('Andi Wijaya', 'andi', ?, '2', '089876543210', 'Jl. Sudirman No 2')
  `, [pwd, pwd]);

  console.log("Data contoh (Lapangan & Pelanggan) berhasil ditambahkan!");
  await connection.end();
}

main().catch(console.error);
