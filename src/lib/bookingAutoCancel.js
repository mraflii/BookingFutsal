import db from '@/lib/db'

/**
 * Memeriksa dan membatalkan otomatis semua booking yang belum dibayar
 * setelah 1 jam (60 menit) dari waktu booking dibuat.
 * Menghapus relasi di tb_list_booking dan tb_booking agar jadwal kembali tersedia.
 */
export async function cleanupExpiredBookings() {
  try {
    // 1 Jam yang lalu
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ')

    // Cari booking yang belum memiliki record bayar di tb_bayar dan sudah lebih dari 1 jam
    const [expiredBookings] = await db.query(`
      SELECT tb_booking.id_booking 
      FROM tb_booking
      LEFT JOIN tb_bayar ON tb_bayar.id_bayar = tb_booking.id_booking
      WHERE tb_bayar.id_bayar IS NULL 
        AND tb_booking.waktu_booking <= ?
    `, [oneHourAgo])

    if (expiredBookings.length > 0) {
      const expiredIds = expiredBookings.map(b => b.id_booking)
      // Hapus detail list booking
      await db.query(
        `DELETE FROM tb_list_booking WHERE kode_booking IN (${expiredIds.map(() => '?').join(',')})`,
        expiredIds
      )
      // Hapus header booking
      await db.query(
        `DELETE FROM tb_booking WHERE id_booking IN (${expiredIds.map(() => '?').join(',')})`,
        expiredIds
      )
      return { canceledCount: expiredIds.length, expiredIds }
    }

    return { canceledCount: 0, expiredIds: [] }
  } catch (error) {
    console.error('Error auto-canceling expired bookings:', error)
    return { canceledCount: 0, error: error.message }
  }
}
