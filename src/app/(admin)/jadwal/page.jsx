import db from '@/lib/db'
import { Calendar as CalendarIcon, Clock, Hourglass } from 'lucide-react'

export const metadata = { title: 'Jadwal Lapangan - Alouh Futsal' }

export default async function JadwalPage() {
  let jadwal = []

  try {
    const [rows] = await db.query(`
      SELECT tb_list_booking.*, tb_booking.pelanggan, tb_booking.waktu_booking,
             tb_daftar_lapangan.nama_lapangan
      FROM tb_list_booking
      JOIN tb_booking ON tb_booking.id_booking = tb_list_booking.kode_booking
      JOIN tb_daftar_lapangan ON tb_daftar_lapangan.id_lapangan = tb_booking.kode_lapangan
      ORDER BY tb_list_booking.tanggal_main ASC, tb_list_booking.jam_main ASC
    `)
    jadwal = rows
  } catch (error) {
    console.error('Error fetching jadwal:', error)
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Jadwal Lapangan</h1>
          <p className="text-slate-500 mt-1">Pantau seluruh jadwal bermain yang sudah terdaftar.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <th className="p-6 w-20 text-center rounded-tl-[2rem]">No</th>
                <th className="p-6">Pelanggan</th>
                <th className="p-6">Lapangan</th>
                <th className="p-6">Tanggal Main</th>
                <th className="p-6">Waktu Main</th>
                <th className="p-6 text-center rounded-tr-[2rem]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {jadwal.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400">
                    Belum ada jadwal yang terdaftar.
                  </td>
                </tr>
              ) : (
                jadwal.map((row, idx) => {
                  const isToday = row.tanggal_main?.toString().slice(0,10) === today
                  const isPast = row.tanggal_main?.toString().slice(0,10) < today
                  
                  return (
                    <tr key={row.id_list_booking} className={`hover:bg-slate-50/50 transition-colors group ${isToday ? 'bg-emerald-50/10' : ''}`}>
                      <td className="p-6 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-6 font-bold text-slate-800 text-lg">{row.pelanggan}</td>
                      <td className="p-6 font-medium text-slate-500">{row.nama_lapangan}</td>
                      <td className="p-6 font-medium text-slate-600">
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={16} className={isToday ? "text-emerald-500" : "text-slate-400"} />
                          {row.tanggal_main ? new Date(row.tanggal_main).toLocaleDateString('id-ID', { weekday:'short', day:'numeric', month:'long', year:'numeric' }) : '-'}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-slate-600 font-mono font-medium bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
                            <Clock size={14} className="text-slate-400" />
                            {row.jam_main}
                          </div>
                          <div className="flex items-center gap-1 text-sm font-semibold text-slate-500">
                            <Hourglass size={14} />
                            {row.durasi} Jam
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        {isToday
                          ? <span className="inline-flex items-center px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">Hari Ini</span>
                          : isPast
                          ? <span className="inline-flex items-center px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-xs font-bold border border-slate-200">Selesai</span>
                          : <span className="inline-flex items-center px-4 py-1.5 bg-sky-100 text-sky-700 rounded-full text-xs font-bold border border-sky-200">Mendatang</span>
                        }
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
