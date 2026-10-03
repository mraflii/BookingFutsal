import db from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token tidak valid' }, { status: 400 })
  }

  try {
    const [rows] = await db.query('SELECT id FROM tb_user WHERE verify_token = ? AND is_verified = 0', [token])

    if (rows.length === 0) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url))
    }

    await db.query('UPDATE tb_user SET is_verified = 1, verify_token = NULL WHERE id = ?', [rows[0].id])

    return NextResponse.redirect(new URL('/login?verified=true', request.url))
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
