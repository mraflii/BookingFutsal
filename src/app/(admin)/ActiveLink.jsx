'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ActiveLink({ href, icon, label }) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
        isActive
          ? 'bg-emerald-500 shadow-[0_4px_12px_rgba(16,185,129,0.3)] text-white font-bold'
          : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 font-medium'
      }`}
    >
      {/* Glow effect on hover */}
      {!isActive && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
      
      <div className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'}`}>
        {icon}
      </div>
      <span className="relative z-10 text-sm tracking-wide">{label}</span>
      
      {/* Active Indicator Line */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
      )}
    </Link>
  )
}
