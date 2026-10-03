import db from '@/lib/db'
import BookingItemClient from './BookingItemClient'
import { notFound } from 'next/navigation'

import { getSession } from '@/lib/session'

export async function generateMetadata({ params }) {
  return { title: `Booking ${(await params).id} - Alouh Futsal` }
}

export default async function BookingItemPage({ params, searchParams }) {
  const { id } = await params
  const sp = await searchParams
  const session = await getSession()
  const userLevel = session?.user?.level || '2'
  
  let items = []
  let bookingInfo = null

  try {
    const [bookingRows] = await db.query(`
      SELECT tb_booking.*, tb_daftar_lapangan.nama_lapangan, tb_bayar.id_bayar
      FROM tb_booking
      LEFT JOIN tb_daftar_lapangan ON tb_booking.kode_lapangan = tb_daftar_lapangan.id_lapangan
      LEFT JOIN tb_bayar ON tb_bayar.id_bayar = tb_booking.id_booking
      WHERE tb_booking.id_booking = ?
    `, [id])
    
    if (bookingRows.length === 0) return notFound()
    bookingInfo = bookingRows[0]

    const [rows] = await db.query(`
      SELECT tb_list_booking.*, tb_daftar_lapangan.harga, tb_daftar_lapangan.nama_lapangan,
             (tb_list_booking.harga * tb_list_booking.durasi) AS subtotal
      FROM tb_list_booking
      LEFT JOIN tb_booking ON tb_booking.id_booking = tb_list_booking.kode_booking
      LEFT JOIN tb_daftar_lapangan ON tb_daftar_lapangan.id_lapangan = tb_booking.kode_lapangan
      WHERE tb_list_booking.kode_booking = ?
      ORDER BY tb_list_booking.tanggal_main ASC
    `, [id])
    items = rows
  } catch (error) {
    console.error('Error fetching booking items:', error)
  }

  const total = items.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Detail Booking</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola item sesi bermain untuk booking ini.</p>
      </div>
      <BookingItemClient
        bookingInfo={bookingInfo}
        items={items}
        total={total}
        kode_booking={id}
        pelanggan={sp.pelanggan || bookingInfo?.pelanggan}
        kode_lapangan={sp.kode_lapangan || bookingInfo?.kode_lapangan}
        userLevel={userLevel}
      />
    </div>
  )
}
