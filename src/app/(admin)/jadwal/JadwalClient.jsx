'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Map, Clock, CheckCircle2, AlertCircle, XCircle, Plus, X, ArrowRight, Sparkles, User, Tag, CreditCard } from 'lucide-react'
import Swal from 'sweetalert2'
import { addBooking } from '../booking/actions'

const JAM_OPERASIONAL = [
  '08:00','09:00','10:00','11:00','12:00','13:00','14:00',
  '15:00','16:00','17:00','20:00','21:00',
  '22:00','23:00'
]

function generateKode() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${String(now.getFullYear()).slice(2)}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${Math.floor(100 + Math.random()*900)}`
}

export default function JadwalClient({ initialJadwal, lapanganList, currentUser = null, userLevel = '1' }) {
  const router = useRouter()
  const isCustomer = userLevel === '2'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [selectedLapangan, setSelectedLapangan] = useState(lapanganList[0]?.id_lapangan || '')

  // State for Booking Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSlot, setModalSlot] = useState(null)
  const [modalKode, setModalKode] = useState('')
  const [selectedDurasi, setSelectedDurasi] = useState('1')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

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
      const startIdx = JAM_OPERASIONAL.indexOf(booking.jam_main.substring(0, 5))
      if (startIdx !== -1) {
        for (let i = 0; i < parseInt(booking.durasi); i++) {
          const hourKey = JAM_OPERASIONAL[startIdx + i]
          if (hourKey) {
            map[hourKey] = {
              ...booking,
              isFirst: i === 0,
              isLast: i === (parseInt(booking.durasi) - 1)
            }
          }
        }
      }
    })
    return map
  }, [activeJadwal])

  // Current selected Lapangan object
  const currentLapangan = useMemo(() => {
    return lapanganList.find(l => l.id_lapangan === selectedLapangan) || lapanganList[0]
  }, [lapanganList, selectedLapangan])

  // Determine slot status
  const getSlotStatus = (slot) => {
    if (!slot) return 'TERSEDIA'
    if (slot.id_bayar) {
      if (slot.jenis_bayar === 'DP') return 'DP'
      return 'LUNAS'
    }
    
    if (slot.waktu_booking) {
      const bookingTime = new Date(slot.waktu_booking).getTime()
      const now = new Date().getTime()
      const diffMins = Math.floor((now - bookingTime) / 60000)
      if (diffMins > 15) {
        return 'KEDALUWARSA'
      }
      return 'DIPROSES'
    }
    
    return 'DIPROSES'
  }

  // Open booking modal for a specific hour slot
  const handleOpenBookingModal = (jam) => {
    setModalSlot(jam)
    setModalKode(generateKode())
    setSelectedDurasi('1')
    setError(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalSlot(null)
    setError(null)
  }

  // Estimate price
  const estimatedPrice = useMemo(() => {
    if (!currentLapangan || !modalSlot) return 0
    const tgl = new Date(selectedDate)
    const isWeekend = tgl.getDay() === 0 || tgl.getDay() === 6
    const startHour = parseInt(modalSlot.substring(0, 2))
    const durasiInt = parseInt(selectedDurasi) || 1
    let total = 0

    for (let i = 0; i < durasiInt; i++) {
      const h = startHour + i
      let hourly = parseFloat(currentLapangan.harga || 0)
      if (isWeekend && currentLapangan.harga_weekend) {
        hourly = parseFloat(currentLapangan.harga_weekend)
      } else if (h >= 18 && currentLapangan.harga_malam) {
        hourly = parseFloat(currentLapangan.harga_malam)
      }
      total += hourly
    }
    return total
  }, [currentLapangan, modalSlot, selectedDate, selectedDurasi])

  // Handle submit form
  const handleSubmitBooking = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.target)
    const result = await addBooking(null, formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setIsLoading(false)
      const kodeBookingCreated = modalKode
      handleCloseModal()
      
      Swal.fire({
        title: 'Booking Dibuat!',
        html: `Slot jam <b>${modalSlot}</b> berhasil dipesan.<br/><span class="text-emerald-600 font-medium">Lanjutkan pembayaran DP (50%) atau Lunas untuk mengonfirmasi jadwal.</span>`,
        icon: 'success',
        confirmButtonText: 'Lanjut ke Pembayaran DP',
        confirmButtonColor: '#10b981',
        customClass: { popup: 'rounded-[2rem]' }
      }).then(() => {
        router.push(`/booking/${kodeBookingCreated}`)
      })
    }
  }

  const inputClass = "w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800"

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
            <div className="w-4 h-4 rounded-md border-2 border-emerald-300 bg-emerald-50/50" />
            <span className="text-sm font-semibold text-slate-600">Tersedia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md border-2 border-emerald-500 bg-emerald-500" />
            <span className="text-sm font-semibold text-slate-600">Terisi (Lunas)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md border-2 border-sky-500 bg-sky-500" />
            <span className="text-sm font-semibold text-slate-600">Terisi (DP 50%)</span>
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

            let cardClasses = "relative p-4 rounded-2xl border-2 transition-all flex flex-col min-h-[8.5rem] overflow-hidden group "
            let icon = null
            
            if (status === 'TERSEDIA') {
              cardClasses += "bg-white border-slate-200/80 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1.5"
            } else if (status === 'LUNAS') {
              cardClasses += "bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/20"
              icon = <CheckCircle2 className="w-12 h-12 text-white/20 absolute -bottom-2 -right-2 pointer-events-none" />
            } else if (status === 'DP') {
              cardClasses += "bg-sky-500 border-sky-500 shadow-md shadow-sky-500/20"
              icon = <CheckCircle2 className="w-12 h-12 text-white/20 absolute -bottom-2 -right-2 pointer-events-none" />
            } else if (status === 'DIPROSES') {
              cardClasses += "bg-amber-50 border-amber-400"
              icon = <AlertCircle className="w-12 h-12 text-amber-500/20 absolute -bottom-2 -right-2 pointer-events-none" />
            } else if (status === 'KEDALUWARSA') {
              cardClasses += "bg-red-50/30 border-red-200"
              icon = <XCircle className="w-12 h-12 text-red-500/10 absolute -bottom-2 -right-2 pointer-events-none" />
            }

            return (
              <div key={jam} className={cardClasses}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`font-mono font-bold text-lg flex items-center gap-1.5 ${(status === 'LUNAS' || status === 'DP') ? 'text-white' : 'text-slate-800'}`}>
                    <Clock size={16} className={(status === 'LUNAS' || status === 'DP') ? 'text-white/70' : 'text-emerald-500'} />
                    {jam}
                  </div>
                  {status === 'TERSEDIA' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Tersedia
                    </span>
                  )}
                </div>

                {slot ? (
                  <div className="relative z-10 flex-1 flex flex-col justify-end">
                    {slot.isFirst && (
                      <>
                        <div className={`text-sm font-bold truncate ${(status === 'LUNAS' || status === 'DP') ? 'text-white' : 'text-slate-800'}`}>
                          {slot.pelanggan}
                        </div>
                        <div className={`text-xs font-semibold ${(status === 'LUNAS' || status === 'DP') ? 'text-white/80' : 'text-slate-500'}`}>
                          {status === 'DP' ? 'DP Terkonfirmasi' : `ID: ${slot.kode_booking}`}
                        </div>
                      </>
                    )}
                    {(!slot.isFirst && !slot.isLast) && (
                      <div className="flex-1 flex items-center justify-center">
                        <div className={`w-1 h-8 rounded-full ${status === 'LUNAS' ? 'bg-emerald-400' : status === 'DP' ? 'bg-sky-300' : 'bg-amber-300'}`} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative z-10 flex-1 flex flex-col justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenBookingModal(jam)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_12px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.35)] group-hover:scale-[1.02]"
                    >
                      <Plus size={14} className="stroke-[2.5]" />
                      <span>Booking Slot</span>
                      <ArrowRight size={13} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}

                {icon}
              </div>
            )
          })}
        </div>
      </div>

      {/* MODAL BOOKING DI HALAMAN JADWAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-fade-in-up">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50/60 to-teal-50/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Booking Slot Jadwal</h3>
                  <p className="text-xs font-semibold text-emerald-600">Isi data pemesan untuk slot ini</p>
                </div>
              </div>
              <button 
                onClick={handleCloseModal} 
                className="text-slate-400 hover:text-slate-700 transition-colors p-2 bg-white hover:bg-slate-100 rounded-full shadow-sm border border-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Form */}
            <div className="p-6">
              {error && (
                <div className="mb-5 p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 text-sm flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
                  {error}
                </div>
              )}

              {/* Highlight Info Slot */}
              <div className="mb-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600">
                    <Map size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lapangan</span>
                    <span className="text-xs font-bold text-slate-800 truncate block max-w-[130px]">{currentLapangan?.nama_lapangan}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600">
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jam & Tanggal</span>
                    <span className="text-xs font-bold text-slate-800 block">{modalSlot} ({selectedDate})</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <input type="hidden" name="kode_lapangan" value={selectedLapangan} />
                <input type="hidden" name="tanggal_main" value={selectedDate} />
                <input type="hidden" name="jam_main" value={modalSlot || ''} />

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Kode Booking (Otomatis)</label>
                  <input 
                    type="text" 
                    name="kode_booking" 
                    value={modalKode} 
                    readOnly 
                    className={`${inputClass} bg-slate-100/70 border-slate-200 text-slate-500 cursor-not-allowed font-mono text-sm shadow-inner`} 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <User size={14} className="text-emerald-500" /> Nama Pelanggan / Tim
                  </label>
                  <input 
                    type="text" 
                    name="pelanggan" 
                    defaultValue={isCustomer ? (currentUser?.username || '') : ''}
                    readOnly={isCustomer}
                    required 
                    autoFocus={!isCustomer}
                    placeholder="Contoh: FC Barcelona / Rafli" 
                    className={`${inputClass} ${isCustomer ? 'bg-slate-100/70 border-slate-200 text-slate-600 font-semibold cursor-not-allowed shadow-inner' : ''}`} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Durasi Sewa</label>
                    <select 
                      name="durasi" 
                      value={selectedDurasi} 
                      onChange={(e) => setSelectedDurasi(e.target.value)} 
                      required 
                      className={inputClass}
                    >
                      <option value="1">1 Jam</option>
                      <option value="2">2 Jam</option>
                      <option value="3">3 Jam</option>
                      <option value="4">4 Jam</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                      <Tag size={13} className="text-emerald-500" /> Total Biaya
                    </label>
                    <div className="w-full px-4 py-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/50 flex flex-col justify-center">
                      <span className="font-bold text-emerald-800 text-sm">Rp {Number(estimatedPrice).toLocaleString('id-ID')}</span>
                      <span className="text-[11px] font-semibold text-sky-600">Minimal DP 50%: Rp {Number(estimatedPrice * 0.5).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={handleCloseModal} 
                    className="w-1/3 py-3.5 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-[0_8px_16px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_24px_rgba(16,185,129,0.35)] transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Menyimpan...' : 'Konfirmasi Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

