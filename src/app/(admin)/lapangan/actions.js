'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { writeFile, unlink } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const UPLOAD_DIR = path.join(process.cwd(), 'public/assets/img')

export async function addLapangan(prevState, formData) {
  const nama = formData.get('nama_lapangan')
  const harga = formData.get('harga')
  const harga_malam = formData.get('harga_malam') || null
  const harga_weekend = formData.get('harga_weekend') || null
  const jenis_lantai = formData.get('jenis_lantai') || null
  const fasilitas = formData.get('fasilitas') || null
  const file = formData.get('foto')

  if (!nama || !harga || !file || file.size === 0) {
    return { error: 'Semua field dan foto harus diisi.' }
  }

  // Validate image
  if (file.size > 500000) {
    return { error: 'Ukuran foto terlalu besar (Max 500KB)' }
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
  if (!validTypes.includes(file.type)) {
    return { error: 'Format foto tidak valid. Gunakan JPG, PNG, atau GIF.' }
  }

  try {
    // Check if name exists
    const [existing] = await db.query('SELECT id_lapangan FROM tb_daftar_lapangan WHERE nama_lapangan = ?', [nama])
    if (existing.length > 0) {
      return { error: 'Nama lapangan sudah ada.' }
    }

    // Process file
    const ext = file.name.split('.').pop()
    const filename = `${Math.floor(Math.random() * 90000) + 10000}-${uuidv4().substring(0, 8)}.${ext}`
    
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(UPLOAD_DIR, filename), buffer)

    // Save to DB
    const id_lapangan = 'LAP' + Math.floor(Math.random() * 90000)
    await db.query(
      'INSERT INTO tb_daftar_lapangan (id_lapangan, foto, nama_lapangan, harga, harga_malam, harga_weekend, jenis_lantai, fasilitas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id_lapangan, filename, nama, harga, harga_malam, harga_weekend, jenis_lantai, fasilitas]
    )
    
    revalidatePath('/lapangan')
    revalidatePath('/dashboard')
    return { success: 'Data lapangan berhasil ditambahkan.' }
  } catch (error) {
    console.error('Add lapangan error:', error)
    return { error: 'Terjadi kesalahan pada server saat menambah data.' }
  }
}

export async function editLapangan(prevState, formData) {
  const id = formData.get('id_lapangan')
  const nama = formData.get('nama_lapangan')
  const harga = formData.get('harga')
  const harga_malam = formData.get('harga_malam') || null
  const harga_weekend = formData.get('harga_weekend') || null
  const jenis_lantai = formData.get('jenis_lantai') || null
  const fasilitas = formData.get('fasilitas') || null
  const file = formData.get('foto')
  const oldFoto = formData.get('old_foto')

  if (!id || !nama || !harga) {
    return { error: 'Field nama dan harga harus diisi.' }
  }

  try {
    let filename = oldFoto

    // If new file is uploaded
    if (file && file.size > 0) {
      if (file.size > 500000) return { error: 'Ukuran foto terlalu besar (Max 500KB)' }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
      if (!validTypes.includes(file.type)) return { error: 'Format foto tidak valid.' }

      const ext = file.name.split('.').pop()
      filename = `${Math.floor(Math.random() * 90000) + 10000}-${uuidv4().substring(0, 8)}.${ext}`
      
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(path.join(UPLOAD_DIR, filename), buffer)

      // Try to delete old foto
      try {
        if (oldFoto) await unlink(path.join(UPLOAD_DIR, oldFoto))
      } catch (e) {
        console.warn('Could not delete old foto:', oldFoto)
      }
    }

    await db.query(
      'UPDATE tb_daftar_lapangan SET nama_lapangan = ?, harga = ?, harga_malam = ?, harga_weekend = ?, jenis_lantai = ?, fasilitas = ?, foto = ? WHERE id_lapangan = ?',
      [nama, harga, harga_malam, harga_weekend, jenis_lantai, fasilitas, filename, id]
    )

    revalidatePath('/lapangan')
    revalidatePath('/dashboard')
    return { success: 'Data lapangan berhasil diperbarui.' }
  } catch (error) {
    console.error('Edit lapangan error:', error)
    return { error: 'Terjadi kesalahan pada server saat memperbarui data.' }
  }
}

export async function deleteLapangan(prevState, formData) {
  const id = formData.get('id_lapangan')
  const foto = formData.get('foto')

  if (!id) return { error: 'ID tidak valid' }

  try {
    await db.query('DELETE FROM tb_daftar_lapangan WHERE id_lapangan = ?', [id])
    
    // Delete file
    try {
      if (foto) await unlink(path.join(UPLOAD_DIR, foto))
    } catch (e) {
      console.warn('Could not delete foto:', foto)
    }

    revalidatePath('/lapangan')
    revalidatePath('/dashboard')
    return { success: 'Data lapangan berhasil dihapus.' }
  } catch (error) {
    console.error('Delete lapangan error:', error)
    return { error: 'Gagal menghapus data lapangan.' }
  }
}
