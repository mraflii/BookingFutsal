import db from '@/lib/db'
import BookingClient from './BookingClient'

export const metadata = { title: 'Data Booking - Alouh Futsal' }

export default async function BookingPage() {
  let bookings = []
  let lapangan = []

  try {
    const [rows] = await db.query(`
      SELECT tb_booking.*, tb_daftar_lapangan.nama_lapangan, tb_bayar.id_bayar,
             SUM(tb_list_booking.harga * tb_list_booking.durasi) AS total_harga
      FROM tb_booking
      LEFT JOIN tb_daftar_lapangan ON tb_booking.kode_lapangan = tb_daftar_lapangan.id_lapangan
      LEFT JOIN tb_list_booking ON tb_booking.id_booking = tb_list_booking.kode_booking
      LEFT JOIN tb_bayar ON tb_bayar.id_bayar = tb_booking.id_booking
      GROUP BY tb_booking.id_booking
      ORDER BY tb_booking.waktu_booking DESC
    `)
    bookings = rows

    const [lapRows] = await db.query('SELECT id_lapangan, nama_lapangan FROM tb_daftar_lapangan')
    lapangan = lapRows
  } catch (error) {
    console.error('Error fetching bookings:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Data Booking</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola semua data pemesanan lapangan futsal.</p>
      </div>
      <BookingClient initialData={bookings} lapangan={lapangan} />
    </div>
  )
}
