'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import { encrypt } from '@/lib/session'
import crypto from 'crypto'

export async function login(prevState, formData) {
  const username = formData.get('username')
  const password = formData.get('password')

  if (!username || !password) {
    return { error: 'Username and password are required' }
  }

  // The original PHP code used md5 hashing for passwords
  const hashedPassword = crypto.createHash('md5').update(password).digest('hex')

  try {
    const [rows] = await db.query(
      'SELECT id, username, level FROM tb_user WHERE username = ? AND password = ?',
      [username, hashedPassword]
    )

    if (rows.length > 0) {
      const user = rows[0]
      
      // Create session
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
      const session = await encrypt({ user, expires })
      
      // Save session in cookie
      ;(await cookies()).set('session', session, { expires, httpOnly: true })
      
    } else {
      return { error: 'Username atau password salah' }
    }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Terjadi kesalahan pada server' }
  }
  
  redirect('/dashboard')
}
