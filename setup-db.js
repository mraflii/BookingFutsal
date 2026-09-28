const mysql = require('mysql2/promise');
const crypto = require('crypto');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });

  console.log("Membuat database db_alouhfutsal...");
  await connection.query("CREATE DATABASE IF NOT EXISTS db_alouhfutsal;");
  await connection.query("USE db_alouhfutsal;");

  console.log("Membuat tabel tb_user...");
  await connection.query(`
    CREATE TABLE IF NOT EXISTS tb_user (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100) NOT NULL,
      username VARCHAR(50) NOT NULL,
      password VARCHAR(255) NOT NULL,
      level ENUM('1', '2') NOT NULL COMMENT '1: Admin, 2: Pelanggan',
      nohp VARCHAR(20),
      alamat TEXT
    );
  `);

  console.log("Membuat tabel tb_daftar_lapangan...");
  await connection.query(`
    CREATE TABLE IF NOT EXISTS tb_daftar_lapangan (
      id_lapangan VARCHAR(10) PRIMARY KEY,
      nama_lapangan VARCHAR(100) NOT NULL,
      harga DECIMAL(10,2) NOT NULL,
      foto VARCHAR(255)
    );
  `);

  console.log("Membuat tabel tb_booking...");
  await connection.query(`
    CREATE TABLE IF NOT EXISTS tb_booking (
      id_booking VARCHAR(20) PRIMARY KEY,
      kode_lapangan VARCHAR(10) NOT NULL,
      pelanggan VARCHAR(100) NOT NULL,
      waktu_booking DATETIME NOT NULL
    );
  `);

  console.log("Membuat tabel tb_list_booking...");
  await connection.query(`
    CREATE TABLE IF NOT EXISTS tb_list_booking (
      id_list_booking INT AUTO_INCREMENT PRIMARY KEY,
      kode_booking VARCHAR(20) NOT NULL,
      tanggal_main DATE NOT NULL,
      jam_main VARCHAR(10) NOT NULL,
      durasi INT NOT NULL,
      harga DECIMAL(10,2) NOT NULL
    );
  `);

  console.log("Membuat tabel tb_bayar...");
  await connection.query(`
    CREATE TABLE IF NOT EXISTS tb_bayar (
      id_bayar VARCHAR(20) PRIMARY KEY,
      total_bayar DECIMAL(10,2) NOT NULL,
      waktu_bayar DATETIME NOT NULL
    );
  `);

  console.log("Menghapus admin lama dan membuat admin baru...");
  const passwordHash = crypto.createHash('md5').update('admin123').digest('hex');
  await connection.query("DELETE FROM tb_user WHERE username = 'admin'");
  await connection.query(`
    INSERT INTO tb_user (nama, username, password, level, nohp, alamat) 
    VALUES ('Administrator', 'admin', ?, '1', '-', '-')
  `, [passwordHash]);

  console.log("Selesai! Database dan tabel berhasil dibuat/diperbarui. Username: admin, Password: admin123");
  await connection.end();
}

main().catch(console.error);
