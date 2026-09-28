import db from '@/lib/db'
import UserClient from './UserClient'
import { getSession } from '@/lib/session'

export const metadata = {
  title: 'Data User - Alouh Futsal'
}

export default async function UserPage() {
  let users = []
  const session = await getSession()
  
  try {
    const [rows] = await db.query('SELECT * FROM tb_user ORDER BY id DESC')
    users = rows
  } catch (error) {
    console.error('Error fetching data user:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Master Data User</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola data admin dan kasir yang memiliki akses ke sistem.</p>
        </div>
      </div>
      
      <UserClient initialData={users} currentUserId={session?.user?.id} />
    </div>
  )
}
