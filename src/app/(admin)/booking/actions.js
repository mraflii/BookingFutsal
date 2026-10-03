'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addBooking(prevState, formData) {
  const kode_booking = formData.get('kode_booking')
  const kode_lapangan = formData.get('kode_lapangan')
  const pelanggan = formData.get('pelanggan')
  
  // New fields for first item
  const tanggal_main = formData.get('tanggal_main')
  const jam_main = formData.get('jam_main')
  const durasi = formData.get('durasi')

  if (!kode_lapangan || !pelanggan || !tanggal_main || !jam_main || !durasi) {
    return { error: 'Semua field (Lapangan, Pelanggan, Tanggal, Jam, Durasi) harus diisi.' }
  }

  try {
    // Check if slot is already booked
    const [existing] = await db.query(`
      SELECT id_list_booking FROM tb_list_booking 
      JOIN tb_booking ON tb_booking.id_booking = tb_list_booking.kode_booking
      WHERE tb_booking.kode_lapangan = ? AND tb_list_booking.tanggal_main = ? AND tb_list_booking.jam_main = ?
    `, [kode_lapangan, tanggal_main, jam_main])

    if (existing.length > 0) {
      return { error: 'Slot jadwal tersebut sudah terisi. Silakan pilih jam lain.' }
    }

    const waktu_booking = new Date().toISOString().slice(0, 19).replace('T', ' ')
    
    // 1. Create header
    await db.query(
      'INSERT INTO tb_booking (id_booking, kode_lapangan, pelanggan, waktu_booking) VALUES (?, ?, ?, ?)',
      [kode_booking, kode_lapangan, pelanggan, waktu_booking]
    )

    // 2. Calculate dynamic price for the item
    const [lapanganRows] = await db.query('SELECT harga, harga_malam, harga_weekend FROM tb_daftar_lapangan WHERE id_lapangan = ?', [kode_lapangan])
    const lapangan = lapanganRows[0]
    
    let averagePricePerHour = 0
    if (lapangan) {
      const tgl = new Date(tanggal_main)
      const isWeekend = tgl.getDay() === 0 || tgl.getDay() === 6
      const startHour = parseInt(jam_main.substring(0, 2))
      const durasiInt = parseInt(durasi)
      let totalPrice = 0
      
      for (let i = 0; i < durasiInt; i++) {
        const currentHour = startHour + i
        let hourlyPrice = parseFloat(lapangan.harga)
        if (isWeekend && lapangan.harga_weekend) {
          hourlyPrice = parseFloat(lapangan.harga_weekend)
        } else if (currentHour >= 18 && lapangan.harga_malam) {
          hourlyPrice = parseFloat(lapangan.harga_malam)
        }
        totalPrice += hourlyPrice
      }
      averagePricePerHour = totalPrice / durasiInt
    }

    // 3. Insert item
    await db.query(
      'INSERT INTO tb_list_booking (kode_booking, tanggal_main, jam_main, durasi, harga) VALUES (?, ?, ?, ?, ?)',
      [kode_booking, tanggal_main, jam_main, durasi, averagePricePerHour]
    )

    revalidatePath('/booking')
    revalidatePath('/jadwal')
    return { success: 'Booking dan jadwal berhasil dibuat.' }
  } catch (error) {
    console.error('Add booking error:', error)
    return { error: 'Gagal membuat booking.' }
  }
}

export async function editBooking(prevState, formData) {
  const id = formData.get('id_booking')
  const kode_lapangan = formData.get('kode_lapangan')
  const pelanggan = formData.get('pelanggan')

  if (!id || !kode_lapangan || !pelanggan) {
    return { error: 'Semua field harus diisi.' }
  }

  try {
    await db.query(
      'UPDATE tb_booking SET kode_lapangan = ?, pelanggan = ? WHERE id_booking = ?',
      [kode_lapangan, pelanggan, id]
    )
    revalidatePath('/booking')
    return { success: 'Booking berhasil diperbarui.' }
  } catch (error) {
    console.error('Edit booking error:', error)
    return { error: 'Gagal memperbarui booking.' }
  }
}

export async function deleteBooking(prevState, formData) {
  const id = formData.get('id_booking')

  if (!id) return { error: 'ID tidak valid' }

  try {
    await db.query('DELETE FROM tb_list_booking WHERE kode_booking = ?', [id])
    await db.query('DELETE FROM tb_booking WHERE id_booking = ?', [id])
    revalidatePath('/booking')
    return { success: 'Booking berhasil dihapus.' }
  } catch (error) {
    console.error('Delete booking error:', error)
    return { error: 'Gagal menghapus booking.' }
  }
}
