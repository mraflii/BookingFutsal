import db from '@/lib/db'
import JadwalClient from './JadwalClient'

export const metadata = { title: 'Cek Ketersediaan Jadwal - Alouh Futsal' }

export default async function JadwalPage() {
  let jadwal = []
  let lapangan = []

  try {
    const today = new Date().toISOString().slice(0, 10)
    
    // Get all bookings from today onwards
    const [rows] = await db.query(`
      SELECT tb_list_booking.id_list_booking, tb_list_booking.kode_booking, tb_list_booking.tanggal_main, 
             tb_list_booking.jam_main, tb_list_booking.durasi, tb_list_booking.harga,
             tb_booking.pelanggan, tb_booking.kode_lapangan, tb_booking.waktu_booking, tb_bayar.id_bayar
      FROM tb_list_booking
      JOIN tb_booking ON tb_booking.id_booking = tb_list_booking.kode_booking
      LEFT JOIN tb_bayar ON tb_bayar.id_bayar = tb_booking.id_booking
      WHERE tb_list_booking.tanggal_main >= ?
    `, [today])
    
    // Format tanggal_main so it serialize cleanly to JSON
    jadwal = rows.map(r => ({
      ...r,
      tanggal_main: r.tanggal_main ? r.tanggal_main.toISOString().slice(0, 10) : null
    }))

    const [lapRows] = await db.query('SELECT id_lapangan, nama_lapangan FROM tb_daftar_lapangan')
    lapangan = lapRows
  } catch (error) {
    console.error('Error fetching jadwal:', error)
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Cek Jadwal & Ketersediaan</h1>
          <p className="text-slate-500 mt-1">Lihat ketersediaan slot lapangan secara real-time.</p>
        </div>
      </div>

      <JadwalClient initialJadwal={jadwal} lapanganList={lapangan} />
    </div>
  )
}
