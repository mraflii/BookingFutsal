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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Master Data Lapangan</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola data lapangan yang tersedia untuk disewa.</p>
        </div>
      </div>
      
      <LapanganClient initialData={lapangan} />
    </div>
  )
}
