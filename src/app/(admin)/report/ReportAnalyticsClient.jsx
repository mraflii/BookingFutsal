'use client'

import React, { useState, useMemo, useRef } from 'react'
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3, 
  PieChart as PieIcon, 
  Calendar, 
  Layers, 
  Sparkles,
  ArrowUpRight,
  Sun,
  Moon,
  Info
} from 'lucide-react'

export default function ReportAnalyticsClient({ reports, rawItems = [] }) {
  // Filter range: '1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL'
  const [timeRange, setTimeRange] = useState('1M')
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const chartSvgRef = useRef(null)

  // 1. Ekstraksi dan kalkulasi rentang data waktu
  const chartData = useMemo(() => {
    if (!reports || reports.length === 0) return []

    // Kelompokkan pendapatan per hari: YYYY-MM-DD
    const dailyMap = {}
    reports.forEach(r => {
      if (!r.waktu_bayar) return
      const dateStr = new Date(r.waktu_bayar).toISOString().slice(0, 10)
      if (!dailyMap[dateStr]) {
        dailyMap[dateStr] = { dateStr, total: 0, count: 0 }
      }
      dailyMap[dateStr].total += Number(r.total_bayar || 0)
      dailyMap[dateStr].count += 1
    })

    const now = new Date()
    let startDate = new Date()

    if (timeRange === '1D') {
      // 24 jam / hari ini (jam-jam)
      const hoursMap = {}
      for (let h = 8; h <= 23; h++) {
        const hStr = `${String(h).padStart(2, '0')}:00`
        hoursMap[hStr] = { dateStr: hStr, label: hStr, total: 0, count: 0 }
      }
      const todayStr = now.toISOString().slice(0, 10)
      reports.forEach(r => {
        if (!r.waktu_bayar) return
        const d = new Date(r.waktu_bayar)
        if (d.toISOString().slice(0, 10) === todayStr) {
          const hStr = `${String(d.getHours()).padStart(2, '0')}:00`
          if (hoursMap[hStr]) {
            hoursMap[hStr].total += Number(r.total_bayar || 0)
            hoursMap[hStr].count += 1
          }
        }
      })
      return Object.values(hoursMap)
    }

    if (timeRange === '5D') {
      startDate.setDate(now.getDate() - 5)
    } else if (timeRange === '1M') {
      startDate.setMonth(now.getMonth() - 1)
    } else if (timeRange === '6M') {
      startDate.setMonth(now.getMonth() - 6)
    } else if (timeRange === '1Y') {
      startDate.setFullYear(now.getFullYear() - 1)
    } else {
      // ALL: Ambil tanggal paling awal
      const sortedDates = Object.keys(dailyMap).sort()
      if (sortedDates.length > 0) {
        startDate = new Date(sortedDates[0])
      } else {
        startDate.setMonth(now.getMonth() - 6)
      }
    }

    // Bangun deretan hari kontinu dari startDate s.d. today
    const points = []
    const cur = new Date(startDate)
    cur.setHours(0, 0, 0, 0)
    const end = new Date(now)
    end.setHours(23, 59, 59, 999)

    while (cur <= end) {
      const dStr = cur.toISOString().slice(0, 10)
      const label = cur.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: timeRange === '1Y' || timeRange === 'ALL' ? 'short' : 'short',
        year: timeRange === '1Y' || timeRange === 'ALL' ? '2-digit' : undefined
      })
      const fullLabel = cur.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })

      const existing = dailyMap[dStr]
      points.push({
        dateStr: dStr,
        label,
        fullLabel,
        total: existing ? existing.total : 0,
        count: existing ? existing.count : 0
      })

      cur.setDate(cur.getDate() + 1)
    }

    return points
  }, [reports, timeRange])

  // 2. Statistik grafik (Nilai awal, nilai akhir, min, max, delta persentase)
  const chartStats = useMemo(() => {
    if (chartData.length === 0) {
      return { totalPeriod: 0, firstVal: 0, lastVal: 0, delta: 0, percent: 0, isUp: true, max: 0, min: 0 }
    }

    const totalPeriod = chartData.reduce((acc, curr) => acc + curr.total, 0)
    const values = chartData.map(d => d.total)
    const max = Math.max(...values, 100000)
    const min = Math.min(...values, 0)

    // Perbandingan separuh awal vs separuh akhir atau titik awal vs akhir
    const half = Math.floor(chartData.length / 2)
    const firstHalfAvg = chartData.slice(0, Math.max(half, 1)).reduce((a, b) => a + b.total, 0)
    const secondHalfAvg = chartData.slice(Math.max(half, 1)).reduce((a, b) => a + b.total, 0)

    const delta = secondHalfAvg - firstHalfAvg
    const percent = firstHalfAvg > 0 ? ((delta / firstHalfAvg) * 100).toFixed(1) : (secondHalfAvg > 0 ? '+100.0' : '0.0')
    const isUp = delta >= 0

    return { totalPeriod, isUp, delta, percent, max, min }
  }, [chartData])

  // 3. Generate koordinat SVG Path (Smooth Bezier Line)
  const { pathD, areaD, pointsWithCoords } = useMemo(() => {
    if (chartData.length === 0) return { pathD: '', areaD: '', pointsWithCoords: [] }

    const width = 800
    const height = 240
    const paddingX = 10
    const paddingTop = 20
    const paddingBottom = 20

    const effectiveWidth = width - paddingX * 2
    const effectiveHeight = height - paddingTop - paddingBottom

    const max = chartStats.max
    const min = 0

    const pts = chartData.map((d, i) => {
      const x = paddingX + (i / Math.max(chartData.length - 1, 1)) * effectiveWidth
      const normY = max > min ? (d.total - min) / (max - min) : 0
      // Invert Y untuk SVG (0 di atas, height di bawah)
      const y = paddingTop + effectiveHeight - normY * effectiveHeight
      return { ...d, x, y }
    })

    if (pts.length === 1) {
      return {
        pathD: `M ${pts[0].x} ${pts[0].y} L ${width} ${pts[0].y}`,
        areaD: `M ${pts[0].x} ${pts[0].y} L ${width} ${pts[0].y} L ${width} ${height} L ${pts[0].x} ${height} Z`,
        pointsWithCoords: pts
      }
    }

    // Bangun cubic bezier path agar kurva sangat halus seperti Google Finance
    let linePath = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? i : i - 1]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = pts[i + 2] || p2

      // Control points
      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6

      linePath += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    }

    const lastPt = pts[pts.length - 1]
    const firstPt = pts[0]
    const areaPath = `${linePath} L ${lastPt.x} ${height} L ${firstPt.x} ${height} Z`

    return { pathD: linePath, areaD: areaPath, pointsWithCoords: pts }
  }, [chartData, chartStats.max])

  // Mouse interaction handling
  const handleMouseMove = (e) => {
    if (!chartSvgRef.current || pointsWithCoords.length === 0) return
    const rect = chartSvgRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const svgWidth = rect.width
    // Normalisasi ke skala viewBox 800
    const scaleX = 800 / svgWidth
    const adjustedMouseX = mouseX * scaleX

    // Cari titik terdekat
    let closest = pointsWithCoords[0]
    let minDist = Math.abs(adjustedMouseX - closest.x)

    for (let i = 1; i < pointsWithCoords.length; i++) {
      const dist = Math.abs(adjustedMouseX - pointsWithCoords[i].x)
      if (dist < minDist) {
        minDist = dist
        closest = pointsWithCoords[i]
      }
    }

    setHoveredPoint(closest)
  }

  const handleMouseLeave = () => {
    setHoveredPoint(null)
  }

  // Active display point (jika hover, pakai data hover; jika tidak, tampilkan titik terakhir / total)
  const activePoint = hoveredPoint || (pointsWithCoords.length > 0 ? pointsWithCoords[pointsWithCoords.length - 1] : null)

  // 4. Analisis Lapangan
  const lapanganAnalytics = useMemo(() => {
    const stats = {}
    reports.forEach(r => {
      const name = r.nama_lapangan || 'Lapangan Lain'
      if (!stats[name]) stats[name] = { name, total: 0, count: 0 }
      stats[name].total += Number(r.total_bayar || 0)
      stats[name].count += 1
    })

    const totalRevAll = reports.reduce((sum, r) => sum + Number(r.total_bayar || 0), 0) || 1
    return Object.values(stats)
      .map(item => ({
        ...item,
        percentage: Math.round((item.total / totalRevAll) * 100)
      }))
      .sort((a, b) => b.total - a.total)
  }, [reports])

  // 5. Analisis Siang vs Malam
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

  const avgTransaction = reports.length > 0 
    ? Math.round(reports.reduce((sum, r) => sum + Number(r.total_bayar || 0), 0) / reports.length) 
    : 0

  // Warna tema kurs dollar Google: Hijau neon / teal saat naik
  const lineColor = chartStats.isUp ? '#10b981' : '#f43f5e'
  const gradientStart = chartStats.isUp ? 'rgba(16, 185, 129, 0.28)' : 'rgba(244, 63, 94, 0.25)'
  const gradientEnd = chartStats.isUp ? 'rgba(16, 185, 129, 0.0)' : 'rgba(244, 63, 94, 0.0)'

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
        {/* Google Finance / Currency Style Interactive Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            {/* Header info ala Google Currency Chart */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    IDR / Pendapatan Futsal
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Pasar Terbuka
                  </span>
                </div>

                {/* Big Live Value Display */}
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Rp {(activePoint ? activePoint.total : chartStats.totalPeriod).toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs font-bold text-slate-400">IDR</span>
                </div>

                {/* Growth indicator & active date badge */}
                <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs">
                  <div className={`inline-flex items-center gap-1 font-bold ${chartStats.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {chartStats.isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span>{chartStats.isUp ? '+' : ''}{chartStats.percent}%</span>
                    <span className="text-slate-400 font-normal">
                      ({chartStats.isUp ? '+' : ''}Rp {Math.abs(chartStats.delta).toLocaleString('id-ID')})
                    </span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-medium">
                    {activePoint ? (activePoint.fullLabel || activePoint.dateStr) : 'Periode terpilih'}
                    {activePoint && activePoint.count > 0 && ` (${activePoint.count} booking)`}
                  </span>
                </div>
              </div>

              {/* Time Range Selector (Google Style Pills: 1D, 5D, 1M, 6M, 1Y, MAX) */}
              <div className="inline-flex items-center p-1 bg-slate-100/90 rounded-xl self-start md:self-auto text-xs font-bold">
                {[
                  { id: '1D', label: '1H' },
                  { id: '5D', label: '5H' },
                  { id: '1M', label: '1B' },
                  { id: '6M', label: '6B' },
                  { id: '1Y', label: '1T' },
                  { id: 'ALL', label: 'SEMUA' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setTimeRange(tab.id)
                      setHoveredPoint(null)
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      timeRange === tab.id
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Currency Graph Area (SVG) */}
            <div 
              className="relative w-full h-64 mt-4 select-none cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <svg 
                ref={chartSvgRef}
                viewBox="0 0 800 240" 
                preserveAspectRatio="none" 
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Linear gradient fill under curve */}
                  <linearGradient id="currencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={gradientStart} />
                    <stop offset="100%" stopColor={gradientEnd} />
                  </linearGradient>

                  {/* Filter glow for line */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={lineColor} floodOpacity="0.3" />
                  </filter>
                </defs>

                {/* Horizontal Guide Lines */}
                {[0.25, 0.5, 0.75].map((pct, i) => (
                  <line 
                    key={i}
                    x1="10" 
                    y1={240 * pct} 
                    x2="790" 
                    y2={240 * pct} 
                    stroke="#f1f5f9" 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                  />
                ))}

                {/* Area under the line */}
                {areaD && (
                  <path 
                    d={areaD} 
                    fill="url(#currencyGradient)" 
                  />
                )}

                {/* Main Curve Line */}
                {pathD && (
                  <path 
                    d={pathD} 
                    fill="none" 
                    stroke={lineColor} 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    filter="url(#glow)"
                  />
                )}

                {/* Vertical Crosshair Line when hovering */}
                {hoveredPoint && (
                  <g>
                    <line 
                      x1={hoveredPoint.x} 
                      y1="10" 
                      x2={hoveredPoint.x} 
                      y2="240" 
                      stroke="#94a3b8" 
                      strokeWidth="1.2" 
                      strokeDasharray="3 3" 
                    />
                    {/* Outer pulse circle */}
                    <circle 
                      cx={hoveredPoint.x} 
                      cy={hoveredPoint.y} 
                      r="6" 
                      fill={lineColor} 
                      opacity="0.3" 
                    />
                    {/* Inner solid circle */}
                    <circle 
                      cx={hoveredPoint.x} 
                      cy={hoveredPoint.y} 
                      r="3.5" 
                      fill="#ffffff" 
                      stroke={lineColor} 
                      strokeWidth="2.5" 
                    />
                  </g>
                )}
              </svg>

              {/* Tooltip Overlay */}
              {hoveredPoint && (
                <div 
                  className="absolute pointer-events-none transform -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white px-3 py-2 rounded-xl shadow-xl border border-slate-700/50 z-30 transition-all text-center min-w-[130px]"
                  style={{ 
                    left: `${(hoveredPoint.x / 800) * 100}%`,
                    top: Math.max(10, (hoveredPoint.y / 240) * 100 - 32) + '%'
                  }}
                >
                  <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                    {hoveredPoint.fullLabel || hoveredPoint.dateStr}
                  </p>
                  <p className="text-xs font-extrabold text-emerald-400 mt-0.5">
                    Rp {hoveredPoint.total.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[9px] text-slate-400">
                    {hoveredPoint.count} reservasi
                  </p>
                </div>
              )}
            </div>

            {/* Bottom X-Axis Date Ticks */}
            <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 mt-3 px-2 border-t border-slate-100 pt-2">
              {chartData.length > 0 && (
                <>
                  <span>{chartData[0].label}</span>
                  {chartData.length > 2 && (
                    <span>{chartData[Math.floor(chartData.length / 2)].label}</span>
                  )}
                  <span>{chartData[chartData.length - 1].label}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mt-4 pt-2 border-t border-slate-50 gap-2">
            <span className="flex items-center gap-1.5">
              <Info size={14} className="text-slate-400" />
              Arahkan kursor / sentuh grafik untuk melihat nominal per tanggal
            </span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              Google Finance Styled <ArrowUpRight size={14} />
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
                <p className="text-xs text-slate-400 italic text-center py-8">Belum ada data pendapatan lapangan.</p>
              ) : (
                lapanganAnalytics.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-slate-100/60 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">{item.name}</span>
                      <span className="text-xs font-extrabold text-slate-900">{item.percentage}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${idx === 0 ? 'bg-emerald-500' : 'bg-sky-500'}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{item.count} Kali Booking</span>
                      <span className="font-bold text-slate-700">Rp {item.total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="p-3 bg-emerald-50/60 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-medium">
              <Sparkles size={16} className="text-emerald-600 shrink-0" />
              <span>
                {lapanganAnalytics[0]?.name ? `${lapanganAnalytics[0].name} menjadi kontributor pendapatan terbesar.` : 'Menunggu data transaksi.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
