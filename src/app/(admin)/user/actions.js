'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'
import { getSession } from '@/lib/session'

export async function addUser(prevState, formData) {
  const nama = formData.get('nama')
  const username = formData.get('username')
  const level = formData.get('level')
  const nohp = formData.get('nohp')
  const alamat = formData.get('alamat')
  const password = crypto.createHash('md5').update('password').digest('hex')

  if (!nama || !username || !level) {
    return { error: 'Nama, username, dan level harus diisi.' }
  }

  try {
    const [existing] = await db.query('SELECT id FROM tb_user WHERE username = ?', [username])
    if (existing.length > 0) {
      return { error: 'Username sudah digunakan.' }
    }

    await db.query(
      'INSERT INTO tb_user (nama, username, password, level, nohp, alamat) VALUES (?, ?, ?, ?, ?, ?)',
      [nama, username, password, level, nohp, alamat]
    )
    
    revalidatePath('/user')
    return { success: 'Data user berhasil ditambahkan.' }
  } catch (error) {
    console.error('Add user error:', error)
    return { error: 'Gagal menambah user.' }
  }
}

export async function editUser(prevState, formData) {
  const id = formData.get('id')
  const nama = formData.get('nama')
  const username = formData.get('username')
  const level = formData.get('level')
  const nohp = formData.get('nohp')
  const alamat = formData.get('alamat')

  if (!id || !nama || !level) {
    return { error: 'Nama dan level harus diisi.' }
  }

  try {
    if (username) {
      const [existing] = await db.query('SELECT id FROM tb_user WHERE username = ? AND id != ?', [username, id])
      if (existing.length > 0) {
        return { error: 'Username sudah digunakan oleh user lain.' }
      }
      
      await db.query(
        'UPDATE tb_user SET nama = ?, username = ?, level = ?, nohp = ?, alamat = ? WHERE id = ?',
        [nama, username, level, nohp, alamat, id]
      )
    } else {
       await db.query(
        'UPDATE tb_user SET nama = ?, level = ?, nohp = ?, alamat = ? WHERE id = ?',
        [nama, level, nohp, alamat, id]
      )
    }

    revalidatePath('/user')
    return { success: 'Data user berhasil diperbarui.' }
  } catch (error) {
    console.error('Edit user error:', error)
    return { error: 'Gagal memperbarui user.' }
  }
}

export async function deleteUser(prevState, formData) {
  const id = formData.get('id')
  const session = await getSession()
  
  if (!id) return { error: 'ID tidak valid' }
  
  if (session?.user?.id === parseInt(id)) {
      return { error: 'Anda tidak dapat menghapus akun Anda sendiri.' }
  }

  try {
    await db.query('DELETE FROM tb_user WHERE id = ?', [id])
    revalidatePath('/user')
    return { success: 'User berhasil dihapus.' }
  } catch (error) {
    console.error('Delete user error:', error)
    return { error: 'Gagal menghapus user.' }
  }
}

export async function resetPassword(prevState, formData) {
  const id = formData.get('id')
  const session = await getSession()
  
  if (!id) return { error: 'ID tidak valid' }
  
  if (session?.user?.id === parseInt(id)) {
      return { error: 'Anda tidak dapat mereset password Anda sendiri di sini.' }
  }

  const password = crypto.createHash('md5').update('password').digest('hex')

  try {
    await db.query('UPDATE tb_user SET password = ? WHERE id = ?', [password, id])
    revalidatePath('/user')
    return { success: 'Password berhasil direset menjadi "password".' }
  } catch (error) {
    console.error('Reset password error:', error)
    return { error: 'Gagal mereset password.' }
  }
}
