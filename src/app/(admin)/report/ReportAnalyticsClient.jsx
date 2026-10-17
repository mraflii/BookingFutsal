'use client'

import React, { useState, useMemo } from 'react'
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieIcon, 
  Calendar, 
  Layers, 
  Sparkles,
  ArrowUpRight,
  Sun,
  Moon
} from 'lucide-react'

export default function ReportAnalyticsClient({ reports, rawItems = [] }) {
  const [filterPeriod, setFilterPeriod] = useState('monthly') // 'weekly' | 'monthly'

  // Hitung Data Pendapatan Berdasarkan Waktu
  const { chartData, maxRevenue } = useMemo(() => {
    const now = new Date()

    if (filterPeriod === 'weekly') {
      // 7 Hari Terakhir
      const days = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(now.getDate() - i)
        const dateKey = d.toISOString().slice(0, 10)
        const label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })
        days.push({ key: dateKey, label, total: 0, count: 0 })
      }

      reports.forEach(r => {
        if (!r.waktu_bayar) return
        const rKey = new Date(r.waktu_bayar).toISOString().slice(0, 10)
        const dayObj = days.find(d => d.key === rKey)
        if (dayObj) {
          dayObj.total += Number(r.total_bayar || 0)
          dayObj.count += 1
        }
      })

      const max = Math.max(...days.map(d => d.total), 1)
      return { chartData: days, maxRevenue: max }
    } else {
      // 6 Bulan Terakhir
      const months = []
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const label = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
        months.push({ key, label, total: 0, count: 0 })
      }

      reports.forEach(r => {
        if (!r.waktu_bayar) return
        const d = new Date(r.waktu_bayar)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const mObj = months.find(m => m.key === key)
        if (mObj) {
          mObj.total += Number(r.total_bayar || 0)
          mObj.count += 1
        }
      })

      const max = Math.max(...months.map(m => m.total), 1)
      return { chartData: months, maxRevenue: max }
    }
  }, [reports, filterPeriod])

  // Analisis Lapangan Terpopuler & Kontribusi Pendapatan
  const lapanganAnalytics = useMemo(() => {
    const stats = {}
    reports.forEach(r => {
      const name = r.nama_lapangan || 'Lapangan Lain'
      if (!stats[name]) {
        stats[name] = { name, total: 0, count: 0 }
      }
      stats[name].total += Number(r.total_bayar || 0)
      stats[name].count += 1
    })

    const totalRevAll = reports.reduce((sum, r) => sum + Number(r.total_bayar || 0), 0) || 1
    const list = Object.values(stats).map(item => ({
      ...item,
      percentage: Math.round((item.total / totalRevAll) * 100)
    }))

    // Urutkan dari total pendapatan tertinggi
    return list.sort((a, b) => b.total - a.total)
  }, [reports])

  // Analisis Siang vs Malam dari tb_list_booking
  const timeSlotAnalytics = useMemo(() => {
    let siangCount = 0
    let malamCount = 0
    let siangRevenue = 0
    let malamRevenue = 0

    rawItems.forEach(item => {
      const hour = parseInt((item.jam_main || '08').substring(0, 2))
      const sub = Number(item.subtotal || 0)
      if (hour >= 20) {
        malamCount += Number(item.durasi || 1)
        malamRevenue += sub
      } else {
        siangCount += Number(item.durasi || 1)
        siangRevenue += sub
      }
    })

    const totalHours = siangCount + malamCount || 1
    return {
      siang: {
        hours: siangCount,
        percentage: Math.round((siangCount / totalHours) * 100),
        revenue: siangRevenue
      },
      malam: {
        hours: malamCount,
        percentage: Math.round((malamCount / totalHours) * 100),
        revenue: malamRevenue
      }
    }
  }, [rawItems])

  // Rata-rata transaksi
  const avgTransaction = reports.length > 0 
    ? Math.round(reports.reduce((sum, r) => sum + Number(r.total_bayar || 0), 0) / reports.length) 
    : 0

  return (
    <div className="space-y-6 mb-8 animate-fade-in-up">
      {/* Top Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <BarChart3 size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rata-Rata Transaksi</p>
            <p className="text-xl font-black text-slate-800 mt-0.5">Rp {avgTransaction.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Layers size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Booking Sukses</p>
            <p className="text-xl font-black text-slate-800 mt-0.5">{reports.length} Transaksi</p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Sun size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sesi Siang (08-17)</p>
            <p className="text-xl font-black text-slate-800 mt-0.5">{timeSlotAnalytics.siang.hours} Jam ({timeSlotAnalytics.siang.percentage}%)</p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Moon size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sesi Malam (20-23)</p>
            <p className="text-xl font-black text-slate-800 mt-0.5">{timeSlotAnalytics.malam.hours} Jam ({timeSlotAnalytics.malam.percentage}%)</p>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik Pendapatan Berjalan (Bar Visual) */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="text-emerald-500" size={20} />
                  Grafik Tren Pendapatan
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Visualisasi omzet futsal per periode waktu</p>
              </div>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => setFilterPeriod('weekly')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${filterPeriod === 'weekly' ? 'bg-white shadow text-emerald-600' : 'hover:text-slate-900'}`}
                >
                  7 Hari Terakhir
                </button>
                <button
                  type="button"
                  onClick={() => setFilterPeriod('monthly')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${filterPeriod === 'monthly' ? 'bg-white shadow text-emerald-600' : 'hover:text-slate-900'}`}
                >
                  6 Bulan Terakhir
                </button>
              </div>
            </div>

            {/* Visualisasi Bar Chart */}
            <div className="h-64 flex items-end gap-3 sm:gap-6 pt-8 pb-2 border-b border-slate-100">
              {chartData.map((item, idx) => {
                const heightPercent = maxRevenue > 0 ? Math.max(Math.round((item.total / maxRevenue) * 100), 6) : 6
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip Hover */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-20">
                      Rp {item.total.toLocaleString('id-ID')} ({item.count} order)
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[42px] bg-slate-100 rounded-2xl flex flex-col justify-end overflow-hidden h-full">
                      <div 
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-2xl group-hover:from-emerald-600 group-hover:to-teal-500 transition-all duration-500 shadow-sm"
                      />
                    </div>

                    {/* Label Bawah */}
                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-700 mt-2 truncate w-full text-center">
                      {item.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-2">
            <span>* Skala proporsional terhadap nilai tertinggi (Rp {maxRevenue.toLocaleString('id-ID')})</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              Live Real-Time <ArrowUpRight size={14} />
            </span>
          </div>
        </div>

        {/* Breakdown Kontribusi Lapangan */}
        <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <PieIcon className="text-sky-500" size={20} />
                Pangsa Lapangan
              </h3>
              <span className="text-xs font-bold bg-sky-50 text-sky-600 px-2.5 py-1 rounded-full">
                {lapanganAnalytics.length} Lapangan
              </span>
            </div>

            <div className="space-y-4">
              {lapanganAnalytics.length === 0 ? (
                <p className="text-sm text-slate-400 py-6 text-center">Belum ada data lapangan.</p>
              ) : (
                lapanganAnalytics.map((lap, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-700 text-sm">{lap.name}</span>
                      <span className="font-black text-emerald-600 text-sm">{lap.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${
                          i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-sky-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${lap.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 font-medium">
                      <span>{lap.count} Pesanan</span>
                      <span className="font-bold text-slate-600">Rp {lap.total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sesi Favorit Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-sky-500/10 border border-indigo-100 flex items-center gap-3">
            <Sparkles className="text-indigo-600 shrink-0" size={22} />
            <p className="text-xs text-indigo-950 font-medium leading-relaxed">
              Sesi <b>{timeSlotAnalytics.malam.hours >= timeSlotAnalytics.siang.hours ? 'Malam' : 'Siang'}</b> menjadi jam paling diminati penyewa futsal.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
