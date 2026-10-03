import db from '@/lib/db'
import Link from 'next/link'
import { Eye, FileBarChart2, Wallet, CalendarDays, TrendingUp } from 'lucide-react'
import ReportExportButton from './ReportExportButton'

export const metadata = { title: 'Laporan - Alouh Futsal' }

export default async function ReportPage() {
  let reports = []
  let totalPendapatan = 0
  let pendapatanBulanIni = 0

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  try {
    const [rows] = await db.query(`
      SELECT tb_booking.id_booking, tb_booking.pelanggan, tb_booking.kode_lapangan,
             tb_booking.waktu_booking, tb_daftar_lapangan.nama_lapangan,
             tb_bayar.total_bayar, tb_bayar.waktu_bayar
      FROM tb_booking
      LEFT JOIN tb_daftar_lapangan ON tb_daftar_lapangan.id_lapangan = tb_booking.kode_lapangan
      LEFT JOIN tb_bayar ON tb_bayar.id_bayar = tb_booking.id_booking
      WHERE tb_bayar.id_bayar IS NOT NULL
      ORDER BY tb_bayar.waktu_bayar DESC
    `)
    reports = rows
    totalPendapatan = rows.reduce((sum, r) => sum + Number(r.total_bayar || 0), 0)
    
    pendapatanBulanIni = rows.reduce((sum, r) => {
      const bayarDate = new Date(r.waktu_bayar)
      if (bayarDate.getMonth() === currentMonth && bayarDate.getFullYear() === currentYear) {
        return sum + Number(r.total_bayar || 0)
      }
      return sum
    }, 0)
    
  } catch (error) {
    console.error('Error fetching reports:', error)
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Laporan Keuangan</h1>
          <p className="text-slate-500 mt-1">Histori transaksi dan ringkasan pendapatan fustal.</p>
        </div>
        <ReportExportButton reports={reports} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-8 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
            <Wallet size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <FileBarChart2 size={24} className="text-white" />
              </div>
              <p className="font-bold tracking-wide text-emerald-50 uppercase text-sm">Total Pendapatan</p>
            </div>
            <p className="text-4xl font-extrabold tracking-tight mb-2">Rp {totalPendapatan.toLocaleString('id-ID')}</p>
            <div className="flex items-center gap-2 text-emerald-100 font-medium bg-white/10 w-fit px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              <TrendingUp size={14} />
              <span>{reports.length} transaksi selesai</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center border border-sky-100 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300">
              <CalendarDays size={24} className="text-sky-500 group-hover:text-white transition-colors duration-300" />
            </div>
            <p className="font-bold text-slate-500 uppercase tracking-wide text-sm">Bulan Ini</p>
          </div>
          <p className="text-3xl font-extrabold text-slate-800 tracking-tight">Rp {pendapatanBulanIni.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <th className="p-6 w-20 text-center rounded-tl-[2rem]">No</th>
                <th className="p-6">Kode Booking</th>
                <th className="p-6">Pelanggan</th>
                <th className="p-6">Lapangan</th>
                <th className="p-6">Waktu Transaksi</th>
                <th className="p-6">Total Bayar</th>
                <th className="p-6 text-center rounded-tr-[2rem]">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400">
                    Belum ada laporan pembayaran.
                  </td>
                </tr>
              ) : (
                reports.map((row, idx) => (
                  <tr key={row.id_booking} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-6">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">{row.id_booking}</span>
                    </td>
                    <td className="p-6 font-bold text-slate-800 text-lg">{row.pelanggan}</td>
                    <td className="p-6 font-medium text-slate-500">{row.nama_lapangan}</td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{row.waktu_bayar ? new Date(row.waktu_bayar).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'}) : '-'}</span>
                        <span className="text-xs font-medium text-slate-400">{row.waktu_bayar ? new Date(row.waktu_bayar).toLocaleTimeString('id-ID') : '-'}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center px-4 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-full border border-emerald-100">
                        Rp {Number(row.total_bayar).toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <Link href={`/booking/${row.id_booking}?pelanggan=${row.pelanggan}&kode_lapangan=${row.kode_lapangan}`} className="inline-flex p-2.5 text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md">
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
