import db from './src/lib/db.js';

async function check() {
  try {
    const [rows] = await db.query('SELECT id, nama, username, level, nohp FROM tb_user');
    console.log("Users in DB:");
    console.table(rows);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}

check();
