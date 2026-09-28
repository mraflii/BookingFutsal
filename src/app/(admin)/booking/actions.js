'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addBooking(prevState, formData) {
  const kode_booking = formData.get('kode_booking')
  const kode_lapangan = formData.get('kode_lapangan')
  const pelanggan = formData.get('pelanggan')

  if (!kode_lapangan || !pelanggan) {
    return { error: 'Lapangan dan nama pelanggan harus diisi.' }
  }

  try {
    const waktu_booking = new Date().toISOString().slice(0, 19).replace('T', ' ')
    await db.query(
      'INSERT INTO tb_booking (id_booking, kode_lapangan, pelanggan, waktu_booking) VALUES (?, ?, ?, ?)',
      [kode_booking, kode_lapangan, pelanggan, waktu_booking]
    )
    revalidatePath('/booking')
    return { success: 'Booking berhasil dibuat.' }
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
