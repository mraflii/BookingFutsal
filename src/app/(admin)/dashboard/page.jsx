import db from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Trophy, Clock, ShieldCheck, Users, Ticket, Wallet, Activity, MapPin } from 'lucide-react'
import { getSession } from '@/lib/session'

async function getDashboardData() {
  try {
    const [lapangan] = await db.query('SELECT * FROM tb_daftar_lapangan')

    // Quick stats
    const [users] = await db.query("SELECT COUNT(*) as total FROM tb_user WHERE level = '2'")
    const [bookings] = await db.query('SELECT COUNT(*) as total FROM tb_booking')
    const [revenue] = await db.query('SELECT SUM(total_bayar) as total FROM tb_bayar')

    return {
      lapangan,
      stats: {
        users: users[0].total,
        bookings: bookings[0].total,
        revenue: revenue[0].total || 0
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return { lapangan: [], stats: { users: 0, bookings: 0, revenue: 0 } }
  }
}

export default async function DashboardPage() {
  const session = await getSession()
  const userLevel = session?.user?.level || '2'
  const { lapangan, stats } = await getDashboardData()

  // Tampilan untuk User Biasa (Level 2) - Tentang Website
  if (userLevel === '2') {
    return (
      <div className="space-y-16 pb-16 animate-fade-in-up">
        {/* Premium Hero Section */}
        <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 text-white shadow-2xl group">
          <Image 
            src="/login-bg.png" 
            alt="Futsal Background"
            fill
            className="object-cover opacity-30 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-40 transition-all duration-[2s] ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/20" />
          
          <div className="relative z-10 px-6 py-20 md:py-28 flex flex-col items-center text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-8 backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Booking Futsal Modern
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Tingkatkan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                Permainanmu.
              </span>
            </h1>
            
            <p className="text-slate-300 text-lg md:text-2xl mb-12 leading-relaxed max-w-3xl font-light">
              Fasilitas lapangan futsal premium dengan standar kualitas terbaik, 
              untuk Anda dan tim meraih kemenangan di setiap pertandingan.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link
                href="/booking"
                className="group/btn relative inline-flex items-center justify-center gap-3 bg-emerald-500 text-slate-950 px-10 py-5 rounded-2xl font-bold shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2 text-lg">
                  Mulai Booking
                  <ArrowRight size={22} className="group-hover/btn:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-0" />
              </Link>
            </div>
          </div>
        </div>

        {/* Premium Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="bg-white/50 backdrop-blur-xl rounded-[2.5rem] p-10 text-center shadow-sm border border-slate-200/60 hover:shadow-2xl hover:shadow-teal-500/5 hover:-translate-y-2 transition-all duration-500 group">
            <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-600 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
              <Activity size={36} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Pemesanan Mudah</h3>
            <p className="text-slate-500 leading-relaxed text-lg">
              Booking lapangan hanya dengan beberapa kali klik kapanpun dan dimanapun tanpa perlu datang ke lokasi.
            </p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-xl rounded-[2.5rem] p-10 text-center shadow-sm border border-slate-200/60 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-2 transition-all duration-500 group">
            <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-teal-50 to-emerald-100 text-teal-600 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-inner">
              <Clock size={36} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Buka Setiap Hari</h3>
            <p className="text-slate-500 leading-relaxed text-lg">
              Kami siap melayani hobi futsal Anda setiap hari. Buka mulai pukul 08:00 pagi hingga 03:00 dini hari.
            </p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-xl rounded-[2.5rem] p-10 text-center shadow-sm border border-slate-200/60 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-2 transition-all duration-500 group">
            <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
              <MapPin size={36} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Lokasi Strategis</h3>
            <p className="text-slate-500 leading-relaxed text-lg">
              Terletak di pusat kota yang mudah dijangkau dari berbagai arah, dilengkapi fasilitas parkiran yang luas.
            </p>
          </div>
        </div>

        {/* Premium List Lapangan */}
        <div className="px-2">
          <div className="flex flex-col items-center justify-center mb-12 text-center">
            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-4">Pilih Lapangan Anda</h2>
            <p className="text-slate-500 text-lg max-w-2xl">Jelajahi daftar lapangan premium kami dan tentukan arena yang tepat untuk pertandingan Anda berikutnya.</p>
          </div>
          
          {lapangan.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {lapangan.map((lap) => (
                <div key={lap.id_lapangan} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group flex flex-col md:flex-row hover:-translate-y-2">
                  <div className="relative w-full md:w-2/5 h-72 md:h-auto overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/50 z-10 hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 md:hidden" />
                    {lap.foto ? (
                      <img
                        src={`/assets/img/${lap.foto}`}
                        alt={lap.nama_lapangan}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-800">
                        <Trophy size={64} className="opacity-20" />
                      </div>
                    )}

                    <div className="absolute top-5 left-5 z-20">
                      <span className="px-4 py-1.5 bg-emerald-500/90 backdrop-blur-md text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg border border-emerald-400/30">
                        Tersedia
                      </span>
                    </div>
                  </div>
                  
                    <div className="p-8 md:p-10 flex-1 flex flex-col justify-center bg-white relative">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-3xl font-bold text-slate-800">{lap.nama_lapangan}</h3>
                        {lap.jenis_lantai && (
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                            {lap.jenis_lantai}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-slate-500 text-base mb-6 leading-relaxed">
                        {lap.fasilitas ? `Fasilitas: ${lap.fasilitas}` : `Nikmati pengalaman bermain terbaik dengan fasilitas lengkap dan kenyamanan maksimal di ${lap.nama_lapangan}.`}
                      </p>
                      
                      <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-slate-100 pt-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-end gap-2">
                            <div className="text-2xl font-black text-emerald-600">
                              Rp {Number(lap.harga).toLocaleString('id-ID')}
                            </div>
                            <span className="text-slate-400 text-sm font-medium mb-1">/jam (Reguler)</span>
                          </div>
                          
                          {(lap.harga_malam || lap.harga_weekend) && (
                            <div className="flex flex-col gap-1 mt-2">
                              {lap.harga_malam && (
                                <div className="text-xs font-semibold text-slate-500 flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                                  <span>Malam (18:00+)</span>
                                  <span className="text-amber-600 font-bold">Rp {Number(lap.harga_malam).toLocaleString('id-ID')}</span>
                                </div>
                              )}
                              {lap.harga_weekend && (
                                <div className="text-xs font-semibold text-slate-500 flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                                  <span>Weekend (Sab-Min)</span>
                                  <span className="text-indigo-600 font-bold">Rp {Number(lap.harga_weekend).toLocaleString('id-ID')}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <Link
                          href="/booking"
                          className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white hover:bg-emerald-500 font-bold text-center rounded-2xl transition-all duration-300 shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/20 relative overflow-hidden group/btn"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            Booking
                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                          </span>
                        </Link>
                      </div>
                    </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-200 border-dashed shadow-sm">
              <div className="inline-flex w-24 h-24 bg-slate-50 text-slate-400 rounded-full items-center justify-center mb-6 shadow-inner">
                <ShieldCheck size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Belum ada lapangan</h3>
              <p className="text-slate-500 max-w-sm mx-auto text-lg">Data lapangan belum tersedia. Silakan hubungi admin untuk informasi lebih lanjut.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Tampilan untuk Admin (Level 1) - Analitik
  return (
    <div className="space-y-8 pb-8 animate-fade-in-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 text-white shadow-2xl shadow-emerald-900/20">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative p-10 md:p-14 lg:px-16 lg:py-16 z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-50 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Sistem Booking Aktif
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Kelola Futsal <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-200">
                Lebih Mudah.
              </span>
            </h1>
            <p className="text-emerald-100/90 text-lg md:text-xl mb-10 leading-relaxed max-w-xl font-light">
              Pantau jadwal, kelola pemesanan, dan maksimalkan pendapatan lapangan futsal Anda dalam satu dashboard terpadu.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 bg-white text-emerald-800 px-8 py-4 rounded-2xl font-bold shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-1 hover:bg-emerald-50 transition-all duration-300"
              >
                Buat Booking Baru
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-1 gap-4 w-72">

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 flex items-center gap-5 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:bg-white/20 transition-all cursor-default">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-inner">
                <Clock className="text-white" size={26} />
              </div>
              <div>
                <div className="text-sm text-amber-100 font-medium">Jam Operasional</div>
                <div className="font-bold text-lg text-white">08:00 - 03:00</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-md transition-shadow">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Pelanggan</p>
            <p className="text-3xl font-bold text-slate-800">{stats.users}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-md transition-shadow">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Ticket size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Booking</p>
            <p className="text-3xl font-bold text-slate-800">{stats.bookings}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-md transition-shadow">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Wallet size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Pendapatan</p>
            <p className="text-2xl font-bold text-slate-800">Rp {Number(stats.revenue).toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {/* Courts Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-8 px-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Daftar Lapangan</h2>
            <p className="text-slate-500 text-sm mt-1">Pilih lapangan untuk melihat detail atau membuat pesanan.</p>
          </div>
          <Link href="/lapangan" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            Lihat Semua <ArrowRight size={16} />
          </Link>
        </div>

        {lapangan.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lapangan.map((lap) => (
              <div key={lap.id_lapangan} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 hover:shadow-2xl transition-all duration-500 group flex flex-col hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  {lap.foto ? (
                    <img
                      src={`/assets/img/${lap.foto}`}
                      alt={lap.nama_lapangan}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Trophy size={64} className="opacity-20" />
                    </div>
                  )}

                  <div className="absolute top-5 right-5 z-20">
                    <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md text-emerald-700 font-bold text-xs uppercase tracking-wider rounded-full shadow-lg">
                      Tersedia
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 z-20">
                    <span className="px-4 py-2 bg-emerald-500 text-white font-bold text-lg rounded-2xl shadow-lg">
                      Rp {Number(lap.harga).toLocaleString('id-ID')} <span className="text-emerald-100 text-sm font-medium">/jam</span>
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{lap.nama_lapangan}</h3>
                  <p className="text-slate-500 text-sm mb-8 flex-1 leading-relaxed">
                    Fasilitas lapangan futsal premium dengan standar kualitas rumput terbaik, pencahayaan terang, dan area istirahat yang nyaman.
                  </p>
                  <Link
                    href="/booking"
                    className="w-full py-4 px-4 bg-slate-50 text-slate-700 hover:text-white font-bold text-center rounded-2xl transition-all duration-300 flex justify-center items-center gap-2 border border-slate-200 hover:border-emerald-500 relative overflow-hidden group/btn"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Booking Lapangan
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-200 border-dashed shadow-sm">
            <div className="inline-flex w-20 h-20 bg-slate-50 text-slate-400 rounded-full items-center justify-center mb-6 shadow-inner">
              <ShieldCheck size={36} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Belum ada lapangan</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Data lapangan belum ditambahkan ke dalam sistem. Silakan tambah data di menu Lapangan.</p>
          </div>
        )}
      </div>
    </div>
  )
}
