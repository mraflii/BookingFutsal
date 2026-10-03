import db from './src/lib/db.js';

async function run() {
  try {
    // Hapus semua data lapangan saat ini
    await db.query('DELETE FROM tb_daftar_lapangan');
    
    // Insert Lapangan Fiber (Swapped image)
    await db.query(
      "INSERT INTO tb_daftar_lapangan (id_lapangan, nama_lapangan, harga, foto) VALUES (?, ?, ?, ?)",
      ['LAP01', 'Lapangan Fiber', 150000, '46675-WhatsApp Image 2023-12-17 at 19.37.33.jpeg']
    );

    // Insert Lapangan Rumput (Swapped image)
    await db.query(
      "INSERT INTO tb_daftar_lapangan (id_lapangan, nama_lapangan, harga, foto) VALUES (?, ?, ?, ?)",
      ['LAP02', 'Lapangan Rumput', 120000, '25359-WhatsApp Image 2023-12-17 at 19.37.02.jpeg']
    );

    console.log("Berhasil setup 2 lapangan!");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}

run();
