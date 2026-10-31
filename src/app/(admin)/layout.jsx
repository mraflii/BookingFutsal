import { getSession } from '@/lib/session'
import AdminSidebar from './AdminSidebar'

export default async function AdminLayout({ children }) {
  const session = await getSession()
  const user = session?.user

  return (
    <AdminSidebar user={user}>
      {children}
    </AdminSidebar>
  )
}



