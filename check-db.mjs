import db from './src/lib/db.js';

async function check() {
  try {
    const [rows] = await db.query('SELECT id, username, password, level FROM tb_user');
    console.log("Users:", rows);
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
check();
