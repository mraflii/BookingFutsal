'use server'

import db from '@/lib/db'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { sendVerificationEmail } from '@/lib/mailer'

export async function registerUser(prevState, formData) {
  const nama = formData.get('nama')
  const username = formData.get('username')
  const email = formData.get('email')
  const nohp = formData.get('nohp')
  const password = formData.get('password')

  if (!nama || !username || !email || !nohp || !password) {
    return { error: 'Semua kolom wajib diisi' }
  }

  if (password.length < 6) {
    return { error: 'Password minimal 6 karakter' }
  }

  try {
    const [existing] = await db.query(
      'SELECT id FROM tb_user WHERE username = ? OR email = ?',
      [username, email]
    )

    if (existing.length > 0) {
      return { error: 'Username atau Email sudah terdaftar, silakan pilih yang lain' }
    }

    const hashedPassword = crypto.createHash('md5').update(password).digest('hex')
    const uniqueId = `USR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    
    // Set is_verified = 1 immediately
    await db.query(
      'INSERT INTO tb_user (id, nama, username, email, nohp, password, level, is_verified, verify_token) VALUES (?, ?, ?, ?, ?, ?, ?, 1, NULL)',
      [uniqueId, nama, username, email, nohp, hashedPassword, '2']
    )

    return { 
      success: 'Pendaftaran berhasil! Silakan ke halaman Login untuk masuk.' 
    }
  } catch (error) {
    console.error('Register error:', error)
    return { error: 'Terjadi kesalahan server saat mendaftar.' }
  }
}
