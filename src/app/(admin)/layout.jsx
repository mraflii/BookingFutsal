import Link from 'next/link'
import { Calendar, LayoutDashboard, Ticket, Users, Map, FileBarChart, LogOut, Menu, Activity } from 'lucide-react'
import { getSession } from '@/lib/session'
import ActiveLink from './ActiveLink'

export default async function AdminLayout({ children }) {
  const session = await getSession()
  const user = session?.user

  return (
    <div className="flex h-screen bg-slate-50/50 text-slate-900 overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Sidebar - Desktop */}
      <aside className="w-72 bg-white/70 backdrop-blur-xl border-r border-slate-200/60 hidden md:flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-20 flex items-center px-8 border-b border-slate-200/60">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center mr-4 shadow-lg shadow-emerald-500/30">
            <Activity className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 tracking-tight">Alouh Futsal</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
          <ActiveLink href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <ActiveLink href="/jadwal" icon={<Calendar size={20} />} label="Jadwal Lapangan" />
          <ActiveLink href="/booking" icon={<Ticket size={20} />} label="Data Booking" />
          
          {user?.level === '1' && (
            <>
              <div className="pt-8 pb-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Master Data
              </div>
              <ActiveLink href="/lapangan" icon={<Map size={20} />} label="Data Lapangan" />
              <ActiveLink href="/user" icon={<Users size={20} />} label="Data User" />
              <ActiveLink href="/report" icon={<FileBarChart size={20} />} label="Laporan" />
            </>
          )}
        </div>

        <div className="p-5 border-t border-slate-200/60 bg-white/50">
          <div className="flex items-center gap-4 mb-5 px-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-600 font-bold border border-emerald-200/50 shadow-sm">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.username || 'User'}</p>
              <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wide truncate">
                {user?.level === '1' ? 'Administrator' : 'Pelanggan'}
              </p>
            </div>
          </div>
          <form action="/api/logout" method="POST">
            <button className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-300 border border-transparent hover:border-red-100">
              <LogOut size={18} />
              Keluar Sistem
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 md:hidden z-20 sticky top-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-800">Alouh Futsal</span>
          </div>
          <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
            <Menu size={22} />
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-10 bg-[#f8fafc] relative">
          {/* Subtle background pattern for main content area */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] pointer-events-none mix-blend-overlay"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}


