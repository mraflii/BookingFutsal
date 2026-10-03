'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import { encrypt } from '@/lib/session'

export async function verifyOTP(prevState, formData) {
  const email = formData.get('email')
  const code = formData.get('code')

  if (!email || !code) {
    return { error: 'Data tidak lengkap.' }
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM tb_user WHERE email = ?',
      [email]
    )

    if (rows.length === 0) {
      return { error: 'Email tidak terdaftar.' }
    }

    const user = rows[0]

    if (user.is_verified === 1) {
      return { error: 'Akun sudah terverifikasi. Silakan login.' }
    }

    if (user.verify_token !== code) {
      return { error: 'Kode verifikasi tidak valid atau salah.' }
    }

    // Set verified
    await db.query(
      'UPDATE tb_user SET is_verified = 1, verify_token = NULL WHERE email = ?',
      [email]
    )

    // Auto login
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({ user, expires })
    ;(await cookies()).set('session', session, { expires, httpOnly: true })

  } catch (error) {
    console.error('Verify error:', error)
    return { error: 'Terjadi kesalahan sistem.' }
  }

  redirect('/dashboard')
}
