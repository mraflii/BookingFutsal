'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addBookingItem(prevState, formData) {
  const kode_booking = formData.get('kode_booking')
  const tanggal_main = formData.get('tanggal_main')
  const jam_main = formData.get('jam_main')
  const durasi = formData.get('durasi')

  if (!kode_booking || !tanggal_main || !jam_main || !durasi) {
    return { error: 'Semua field harus diisi.' }
  }

  try {
    // Get the price from the booking's lapangan
    const [bookingRows] = await db.query(`
      SELECT tb_daftar_lapangan.harga, tb_daftar_lapangan.harga_malam, tb_daftar_lapangan.harga_weekend 
      FROM tb_booking 
      JOIN tb_daftar_lapangan ON tb_booking.kode_lapangan = tb_daftar_lapangan.id_lapangan
      WHERE tb_booking.id_booking = ?
    `, [kode_booking])

    const lapangan = bookingRows[0]
    if (!lapangan) return { error: 'Lapangan tidak ditemukan.' }

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
    
    const averagePricePerHour = totalPrice / durasiInt

    await db.query(
      'INSERT INTO tb_list_booking (kode_booking, tanggal_main, jam_main, durasi, harga) VALUES (?, ?, ?, ?, ?)',
      [kode_booking, tanggal_main, jam_main, durasi, averagePricePerHour]
    )
    revalidatePath(`/booking/${kode_booking}`)
    return { success: 'Item booking berhasil ditambahkan.' }
  } catch (error) {
    console.error('Add booking item error:', error)
    return { error: 'Gagal menambah item booking.' }
  }
}

export async function editBookingItem(prevState, formData) {
  const id = formData.get('id')
  const kode_booking = formData.get('kode_booking')
  const tanggal_main = formData.get('tanggal_main')
  const jam_main = formData.get('jam_main')
  const durasi = formData.get('durasi')

  if (!id || !tanggal_main || !jam_main || !durasi) {
    return { error: 'Semua field harus diisi.' }
  }

  try {
    // Recalculate price
    const [bookingRows] = await db.query(`
      SELECT tb_daftar_lapangan.harga, tb_daftar_lapangan.harga_malam, tb_daftar_lapangan.harga_weekend 
      FROM tb_booking 
      JOIN tb_daftar_lapangan ON tb_booking.kode_lapangan = tb_daftar_lapangan.id_lapangan
      WHERE tb_booking.id_booking = ?
    `, [kode_booking])

    const lapangan = bookingRows[0]
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

    await db.query(
      'UPDATE tb_list_booking SET tanggal_main = ?, jam_main = ?, durasi = ?, harga = ? WHERE id_list_booking = ?',
      [tanggal_main, jam_main, durasi, averagePricePerHour, id]
    )
    revalidatePath(`/booking/${kode_booking}`)
    return { success: 'Item berhasil diperbarui.' }
  } catch (error) {
    console.error('Edit booking item error:', error)
    return { error: 'Gagal memperbarui item booking.' }
  }
}

export async function deleteBookingItem(prevState, formData) {
  const id = formData.get('id')
  const kode_booking = formData.get('kode_booking')

  if (!id) return { error: 'ID tidak valid' }

  try {
    await db.query('DELETE FROM tb_list_booking WHERE id_list_booking = ?', [id])
    revalidatePath(`/booking/${kode_booking}`)
    return { success: 'Item berhasil dihapus.' }
  } catch (error) {
    console.error('Delete booking item error:', error)
    return { error: 'Gagal menghapus item booking.' }
  }
}

export async function bayarBooking(prevState, formData) {
  const kode_booking = formData.get('kode_booking')
  const total = formData.get('total')
  const jenis_bayar = formData.get('jenis_bayar') || 'LUNAS'
  const sisa_bayar = formData.get('sisa_bayar') || '0'

  if (!kode_booking || !total) return { error: 'Data tidak lengkap.' }

  try {
    const waktu_bayar = new Date().toISOString().slice(0, 19).replace('T', ' ')
    
    // Check if tb_bayar record already exists (e.g. paying remaining balance)
    const [existing] = await db.query('SELECT * FROM tb_bayar WHERE id_bayar = ?', [kode_booking])
    if (existing.length > 0) {
      // Pelunasan
      await db.query(
        'UPDATE tb_bayar SET total_bayar = total_bayar + ?, waktu_bayar = ?, jenis_bayar = "LUNAS", sisa_bayar = 0 WHERE id_bayar = ?',
        [total, waktu_bayar, kode_booking]
      )
    } else {
      await db.query(
        'INSERT INTO tb_bayar (id_bayar, total_bayar, waktu_bayar, jenis_bayar, sisa_bayar) VALUES (?, ?, ?, ?, ?)',
        [kode_booking, total, waktu_bayar, jenis_bayar, sisa_bayar]
      )
    }

    revalidatePath(`/booking/${kode_booking}`)
    revalidatePath('/booking')
    revalidatePath('/jadwal')
    revalidatePath('/report')
    return { success: 'Pembayaran berhasil diproses.' }
  } catch (error) {
    console.error('Bayar error:', error)
    return { error: 'Gagal memproses pembayaran.' }
  }
}

export async function getMidtransToken(kode_booking, total, pelanggan) {
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY
    const clientKey = process.env.MIDTRANS_CLIENT_KEY || process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY

    // Jika API key belum diset di .env atau masih placeholder dummy, gunakan mode Simulasi / Sandbox Mock
    if (!serverKey || serverKey.includes('YOUR_DUMMY_KEY')) {
      return { 
        isSimulated: true,
        message: 'Menggunakan Simulasi Pembayaran Instan (Sandbox Testing)'
      }
    }

    const midtransClient = require('midtrans-client')
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: serverKey,
      clientKey: clientKey || ''
    })

    let parameter = {
      "transaction_details": {
        "order_id": kode_booking + '-' + Date.now(),
        "gross_amount": parseInt(total)
      },
      "customer_details": {
        "first_name": pelanggan
      }
    }

    const transaction = await snap.createTransaction(parameter)
    return { token: transaction.token }
  } catch (error) {
    console.error('Midtrans error:', error)
    // Fallback otomatis ke mode simulasi jika server midtrans menolak/unauthorized
    return { 
      isSimulated: true, 
      warning: 'Server Midtrans tidak merespon/kredensial belum valid. Mengalihkan ke Simulasi Pembayaran.' 
    }
  }
}
