import db from '@/lib/db'
import { getSession } from '@/lib/session'
import BookingClient from './BookingClient'

export const metadata = { title: 'Data Booking - Alouh Futsal' }

export default async function BookingPage() {
  const session = await getSession()
  const user = session?.user
  const isCustomer = user?.level === '2'

  let bookings = []
  let lapangan = []

  try {
    let query = `
      SELECT tb_booking.*, tb_daftar_lapangan.nama_lapangan, 
             tb_bayar.id_bayar, tb_bayar.jenis_bayar, tb_bayar.sisa_bayar,
             SUM(tb_list_booking.harga * tb_list_booking.durasi) AS total_harga
      FROM tb_booking
      LEFT JOIN tb_daftar_lapangan ON tb_booking.kode_lapangan = tb_daftar_lapangan.id_lapangan
      LEFT JOIN tb_list_booking ON tb_booking.id_booking = tb_list_booking.kode_booking
      LEFT JOIN tb_bayar ON tb_bayar.id_bayar = tb_booking.id_booking
    `
    const params = []

    if (isCustomer && user?.username) {
      query += ` WHERE tb_booking.pelanggan = ? `
      params.push(user.username)
    }

    query += `
      GROUP BY tb_booking.id_booking
      ORDER BY tb_booking.waktu_booking DESC
    `

    const [rows] = await db.query(query, params)
    bookings = rows

    const [lapRows] = await db.query('SELECT id_lapangan, nama_lapangan FROM tb_daftar_lapangan')
    lapangan = lapRows
  } catch (error) {
    console.error('Error fetching bookings:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {isCustomer ? 'Pesanan Saya' : 'Data Booking'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isCustomer ? 'Kelola dan pantau status pesanan lapangan Anda.' : 'Kelola semua data pemesanan lapangan futsal.'}
        </p>
      </div>
      <BookingClient 
        initialData={bookings} 
        lapangan={lapangan} 
        userLevel={user?.level || '2'} 
        currentUser={user} 
      />
    </div>
  )
}
