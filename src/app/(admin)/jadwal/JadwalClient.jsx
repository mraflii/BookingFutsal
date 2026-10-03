'use client'

import { useState, useMemo } from 'react'
import { Calendar, Map, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

const JAM_OPERASIONAL = [
  '08:00','09:00','10:00','11:00','12:00','13:00','14:00',
  '15:00','16:00','17:00','18:00','19:00','20:00','21:00',
  '22:00','23:00'
]

export default function JadwalClient({ initialJadwal, lapanganList }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [selectedLapangan, setSelectedLapangan] = useState(lapanganList[0]?.id_lapangan || '')

  // Filter jadwal based on selected date and lapangan
  const activeJadwal = useMemo(() => {
    return initialJadwal.filter(j => 
      j.tanggal_main === selectedDate && 
      j.kode_lapangan === selectedLapangan
    )
  }, [initialJadwal, selectedDate, selectedLapangan])

  // Create a mapping of hour -> booking info
  const slotMap = useMemo(() => {
    const map = {}
    activeJadwal.forEach(booking => {
      // Find the starting hour index
      const startIdx = JAM_OPERASIONAL.indexOf(booking.jam_main.substring(0, 5))
      if (startIdx !== -1) {
        // Mark the start slot and subsequent slots based on duration
        for (let i = 0; i < parseInt(booking.durasi); i++) {
          const hourKey = JAM_OPERASIONAL[startIdx + i]
          if (hourKey) {
            map[hourKey] = {
              ...booking,
              isFirst: i === 0, // Flag to know if we should show the text here
              isLast: i === (parseInt(booking.durasi) - 1)
            }
          }
        }
      }
    })
    return map
  }, [activeJadwal])

  // Determine slot status
  const getSlotStatus = (slot) => {
    if (!slot) return 'TERSEDIA'
    if (slot.id_bayar) return 'LUNAS'
    
    // Check if expired (> 15 mins)
    if (slot.waktu_booking) {
      const bookingTime = new Date(slot.waktu_booking).getTime()
      const now = new Date().getTime()
      const diffMins = Math.floor((now - bookingTime) / 60000)
      if (diffMins > 15) {
        return 'KEDALUWARSA'
      }
      return 'DIPROSES' // Still within 15 mins
    }
    
    return 'DIPROSES'
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-auto flex-1">
          <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Pilih Tanggal</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
            />
          </div>
        </div>

        <div className="w-full md:w-auto flex-1">
          <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Pilih Lapangan</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Map className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <select
              value={selectedLapangan}
              onChange={(e) => setSelectedLapangan(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer appearance-none"
            >
              {lapanganList.map(lap => (
                <option key={lap.id_lapangan} value={lap.id_lapangan}>{lap.nama_lapangan}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid Kalender */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-10">
        
        {/* Legends */}
        <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md border-2 border-slate-200 bg-white" />
            <span className="text-sm font-semibold text-slate-600">Tersedia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md border-2 border-emerald-500 bg-emerald-500" />
            <span className="text-sm font-semibold text-slate-600">Terisi (Lunas)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md border-2 border-amber-500 bg-amber-50" />
            <span className="text-sm font-semibold text-slate-600">Diproses (Menunggu)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md border-2 border-red-500/50 bg-red-50/50" />
            <span className="text-sm font-semibold text-slate-600">Kedaluwarsa (15 Menit)</span>
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {JAM_OPERASIONAL.map((jam) => {
            const slot = slotMap[jam]
            const status = getSlotStatus(slot)

            let cardClasses = "relative p-4 rounded-2xl border-2 transition-all flex flex-col h-32 overflow-hidden group "
            let icon = null
            
            if (status === 'TERSEDIA') {
              cardClasses += "bg-white border-slate-100 hover:border-emerald-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            } else if (status === 'LUNAS') {
              cardClasses += "bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/20"
              icon = <CheckCircle2 className="w-12 h-12 text-white/20 absolute -bottom-2 -right-2" />
            } else if (status === 'DIPROSES') {
              cardClasses += "bg-amber-50 border-amber-400"
              icon = <AlertCircle className="w-12 h-12 text-amber-500/20 absolute -bottom-2 -right-2" />
            } else if (status === 'KEDALUWARSA') {
              cardClasses += "bg-red-50/30 border-red-200"
              icon = <XCircle className="w-12 h-12 text-red-500/10 absolute -bottom-2 -right-2" />
            }

            return (
              <div key={jam} className={cardClasses}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`font-mono font-bold text-lg ${status === 'LUNAS' ? 'text-white' : 'text-slate-800'}`}>
                    {jam}
                  </div>
                  {status === 'TERSEDIA' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      Tersedia
                    </span>
                  )}
                </div>

                {slot ? (
                  <div className="relative z-10 flex-1 flex flex-col justify-end">
                    {slot.isFirst && (
                      <>
                        <div className={`text-sm font-bold truncate ${status === 'LUNAS' ? 'text-white' : 'text-slate-800'}`}>
                          {slot.pelanggan}
                        </div>
                        <div className={`text-xs font-semibold ${status === 'LUNAS' ? 'text-emerald-100' : 'text-slate-500'}`}>
                          ID: {slot.kode_booking}
                        </div>
                      </>
                    )}
                    {(!slot.isFirst && !slot.isLast) && (
                      <div className="flex-1 flex items-center justify-center">
                        <div className={`w-1 h-8 rounded-full ${status === 'LUNAS' ? 'bg-emerald-400' : 'bg-amber-300'}`} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative z-10 flex-1 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href="/booking" className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline">
                      Booking Slot Ini
                    </Link>
                  </div>
                )}

                {icon}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
