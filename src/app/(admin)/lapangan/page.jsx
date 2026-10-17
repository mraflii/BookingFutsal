import db from '@/lib/db'
import LapanganClient from './LapanganClient'

export const metadata = {
  title: 'Data Lapangan - Alouh Futsal'
}

export default async function LapanganPage() {
  let lapangan = []
  
  try {
    const [rows] = await db.query('SELECT * FROM tb_daftar_lapangan ORDER BY id_lapangan DESC')
    lapangan = rows
  } catch (error) {
    console.error('Error fetching data lapangan:', error)
  }

  return (
    <div>
      <LapanganClient initialData={lapangan} />
    </div>
  )
}
