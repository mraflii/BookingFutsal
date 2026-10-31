'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, LayoutDashboard, Ticket, Users, Map, FileBarChart, LogOut, Menu, X, Activity } from 'lucide-react'
import ActiveLink from './ActiveLink'

export default function AdminSidebar({ user, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMenu = () => setMobileMenuOpen(false)

  const navLinks = (
    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
      <div onClick={closeMenu}>
        <ActiveLink href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
      </div>
      <div onClick={closeMenu}>
        <ActiveLink href="/jadwal" icon={<Calendar size={20} />} label="Jadwal Lapangan" />
      </div>
      <div onClick={closeMenu}>
        <ActiveLink href="/booking" icon={<Ticket size={20} />} label={user?.level === '1' ? 'Data Booking' : 'Pesanan Saya'} />
      </div>
      
      {user?.level === '1' && (
        <>
          <div className="pt-8 pb-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Master Data
          </div>
          <div onClick={closeMenu}>
            <ActiveLink href="/lapangan" icon={<Map size={20} />} label="Data Lapangan" />
          </div>
          <div onClick={closeMenu}>
            <ActiveLink href="/user" icon={<Users size={20} />} label="Data User" />
          </div>
          <div onClick={closeMenu}>
            <ActiveLink href="/report" icon={<FileBarChart size={20} />} label="Laporan" />
          </div>
        </>
      )}
    </div>
  )

  const userFooter = (
    <div className="p-5 border-t border-slate-200/60 bg-white/50">
      <div className="flex items-center gap-3.5 mb-4 px-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-600 font-bold border border-emerald-200/50 shadow-sm shrink-0">
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
        <button 
          type="submit"
          className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 border border-slate-200/60 hover:border-red-100"
        >
          <LogOut size={16} />
          Keluar Sistem
        </button>
      </form>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-50/50 text-slate-900 overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 hidden md:flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-16 flex items-center px-6 border-b border-slate-200/60">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center mr-3 shadow-md shadow-emerald-500/20 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 tracking-tight">Alouh Futsal</span>
        </div>

        {navLinks}
        {userFooter}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-white z-50 md:hidden flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-slate-800">Alouh Futsal</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Tutup Menu"
          >
            <X size={20} />
          </button>
        </div>

        {navLinks}
        {userFooter}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 md:hidden z-20 sticky top-0 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-800">Alouh Futsal</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Buka Menu"
          >
            <Menu size={22} />
          </button>
        </header>

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#f8fafc] relative">
          <div className="relative z-10 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
