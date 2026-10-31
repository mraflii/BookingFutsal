import db from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Trophy, Clock, ShieldCheck, Users, Ticket, Wallet, Activity, MapPin, Sun, Moon } from 'lucide-react'
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
      <div className="space-y-8 pb-10 animate-fade-in-up">
        {/* Modern & Compact Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl group border border-slate-800">
          <Image
            src="/login-bg.png"
            alt="Futsal Background"
            fill
            priority
            className="object-cover opacity-25 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-35 transition-all duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-900/40" />

          <div className="relative z-10 px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Arena Futsal Modern & Nyaman
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 leading-tight">
                Tingkatkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">Permainanmu.</span>
              </h1>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-normal">
                Fasilitas lapangan futsal berstandar terbaik dengan rumput sintetis & fiber berkualitas untuk Anda dan tim meraih kemenangan di setiap pertandingan.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Mulai Booking Sekarang
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/jadwal"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 px-5 py-3 rounded-xl font-semibold text-sm backdrop-blur-sm transition-all duration-200"
                >
                  Lihat Jadwal
                </Link>
              </div>
            </div>

            {/* Quick Info Badges in Hero */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center md:text-left min-w-[130px]">
                <Clock className="w-5 h-5 text-emerald-400 mb-2 mx-auto md:mx-0" />
                <p className="text-xs text-slate-400 font-medium">Jam Operasional</p>
                <p className="text-sm font-bold text-white">08:00 - 03:00</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center md:text-left min-w-[130px]">
                <ShieldCheck className="w-5 h-5 text-teal-400 mb-2 mx-auto md:mx-0" />
                <p className="text-xs text-slate-400 font-medium">Standar Lapangan</p>
                <p className="text-sm font-bold text-white"> Fiber & Rumput</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights - Compact & Clean */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start gap-4 hover:border-slate-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Activity size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Pemesanan Instan</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Pilih jadwal, booking slot lapangan, dan upload bukti bayar dalam hitungan menit.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start gap-4 hover:border-slate-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Buka Hingga Dini Hari</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Siap melayani sparing malam hari mulai pukul 08:00 pagi hingga 03:00 subuh.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start gap-4 hover:border-slate-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MapPin size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Lokasi & Parkir Luas</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Akses mudah dijangkau kendaraan roda dua maupun roda empat dengan area parkir aman.
              </p>
            </div>
          </div>
        </div>

        {/* List Lapangan - Balanced Size */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Pilihan Lapangan</h2>
              <p className="text-slate-500 text-xs mt-0.5">Tersedia {lapangan.length} lapangan siap pakai dengan fasilitas lengkap.</p>
            </div>
            <Link
              href="/jadwal"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
            >
              Cek Kalender Jadwal <ArrowRight size={14} />
            </Link>
          </div>

          {lapangan.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lapangan.map((lap) => (
                <div
                  key={lap.id_lapangan}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex flex-col group"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    {lap.foto ? (
                      <img
                        src={`/assets/img/${lap.foto}`}
                        alt={lap.nama_lapangan}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-800">
                        <Trophy size={40} className="opacity-30" />
                      </div>
                    )}

                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 bg-emerald-500/90 backdrop-blur-md text-white font-bold text-[11px] rounded-lg shadow-sm">
                        Tersedia
                      </span>
                      {lap.jenis_lantai && (
                        <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white font-medium text-[11px] rounded-lg border border-white/10">
                          {lap.jenis_lantai}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-emerald-600 transition-colors">
                        {lap.nama_lapangan}
                      </h3>
                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
                        {lap.fasilitas ? `Fasilitas: ${lap.fasilitas}` : 'Fasilitas lapangan futsal berkualitas dengan pencahayaan terang dan ruang ganti.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Sun size={15} className="text-amber-500" />
                          <div className="leading-tight">
                            <span className="text-[10px] text-slate-400 block font-medium">Siang</span>
                            <span className="text-sm font-bold">Rp {Number(lap.harga).toLocaleString('id-ID')}</span>
                          </div>
                        </div>

                        {lap.harga_malam && (
                          <div className="flex items-center gap-1.5 text-slate-700 pl-3 border-l border-slate-100">
                            <Moon size={15} className="text-indigo-500" />
                            <div className="leading-tight">
                              <span className="text-[10px] text-indigo-500 block font-medium">Malam (20+)</span>
                              <span className="text-sm font-bold text-indigo-700">Rp {Number(lap.harga_malam).toLocaleString('id-ID')}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <Link
                        href="/booking"
                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                      >
                        Booking Sekarang
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm">
              <div className="inline-flex w-14 h-14 bg-slate-50 text-slate-400 rounded-full items-center justify-center mb-3">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Belum Ada Lapangan</h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">Data lapangan belum tersedia. Silakan cek kembali nanti.</p>
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

                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-2">
                    <div className="flex-1 bg-slate-900/85 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 shadow-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                          <Sun size={15} />
                        </div>
                        <div className="leading-tight">
                          <span className="text-[10px] uppercase font-bold text-slate-300 block">Siang</span>
                          <span className="text-xs font-black text-white">Rp {Number(lap.harga).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                      {lap.harga_malam && (
                        <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                            <Moon size={15} />
                          </div>
                          <div className="leading-tight">
                            <span className="text-[10px] uppercase font-bold text-indigo-200 block">Malam (20:00+)</span>
                            <span className="text-xs font-black text-indigo-300">Rp {Number(lap.harga_malam).toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-slate-800">{lap.nama_lapangan}</h3>
                    {lap.jenis_lantai && (
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        {lap.jenis_lantai}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm mb-6 flex-1 leading-relaxed">
                    {lap.fasilitas ? `Fasilitas: ${lap.fasilitas}` : `Fasilitas lapangan futsal premium dengan standar kualitas rumput terbaik, pencahayaan terang, dan area istirahat yang nyaman.`}
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
