'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, X, Search, Ticket, User, Map, Clock } from 'lucide-react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { addBooking, editBooking, deleteBooking } from './actions'

const JAM_OPTIONS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','00:00','01:00','02:00','03:00']

function generateKode() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${String(now.getFullYear()).slice(2)}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${Math.floor(100 + Math.random()*900)}`
}

export default function BookingClient({ initialData, lapangan }) {
  const [modalType, setModalType] = useState(null)
  const [selectedData, setSelectedData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [kodeBooking, setKodeBooking] = useState('')

  const closeModal = () => { setModalType(null); setSelectedData(null); setError(null) }
  const openModal = (type, data = null) => { 
    setModalType(type); 
    setSelectedData(data);
    if (type === 'add') setKodeBooking(generateKode());
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const formData = new FormData(e.target)
    let result

    if (modalType === 'add') result = await addBooking(null, formData)
    else if (modalType === 'edit') result = await editBooking(null, formData)
    else if (modalType === 'delete') result = await deleteBooking(null, formData)

    if (result?.error) {
      setError(result.error)
    } else {
      closeModal()
      Swal.fire({
        title: 'Berhasil!',
        text: result.success,
        icon: 'success',
        confirmButtonColor: '#10b981',
        customClass: { popup: 'rounded-[2rem]' }
      })
    }
    setIsLoading(false)
  }

  const filtered = initialData.filter(b =>
    b.pelanggan?.toLowerCase().includes(search.toLowerCase()) ||
    b.id_booking?.toLowerCase().includes(search.toLowerCase()) ||
    b.nama_lapangan?.toLowerCase().includes(search.toLowerCase())
  )

  const inputClass = "w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800"

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Data Booking</h1>
          <p className="text-slate-500 mt-1">Kelola data pemesanan dan pembayaran lapangan.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-80 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              type="text" 
              placeholder="Cari ID, Pelanggan, atau Lapangan..." 
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" 
            />
          </div>
          <button 
            onClick={() => openModal('add')} 
            className="flex w-full sm:w-auto items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-[0_8px_16px_rgba(16,185,129,0.2)] hover:shadow-[0_12px_24px_rgba(16,185,129,0.3)] hover:-translate-y-1 whitespace-nowrap"
          >
            <Plus size={20} /> Booking Baru
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <th className="p-6 w-20 text-center rounded-tl-[2rem]">No</th>
                <th className="p-6">Kode Booking</th>
                <th className="p-6">Pelanggan & Lapangan</th>
                <th className="p-6">Status</th>
                <th className="p-6">Waktu Transaksi</th>
                <th className="p-6">Total Tagihan</th>
                <th className="p-6 text-center rounded-tr-[2rem]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400">
                    Tidak ada data booking yang sesuai dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={row.id_booking} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-6">
                      <span className="font-mono text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">{row.id_booking}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-emerald-500" />
                          <span className="font-bold text-slate-800">{row.pelanggan}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Map size={14} className="text-slate-400" />
                          <span className="font-medium text-slate-500">{row.nama_lapangan || '-'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      {row.id_bayar
                        ? <span className="inline-flex items-center px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>Lunas</span>
                        : <span className="inline-flex items-center px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></span>Belum Lunas</span>
                      }
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={16} className="text-slate-400" />
                        <span className="text-sm font-medium">{row.waktu_booking ? new Date(row.waktu_booking).toLocaleString('id-ID', {day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'}) : '-'}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center px-3 py-1 bg-slate-50 text-slate-800 font-bold text-sm rounded-lg border border-slate-200">
                        {row.total_harga ? `Rp ${Number(row.total_harga).toLocaleString('id-ID')}` : '-'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/booking/${row.id_booking}?pelanggan=${row.pelanggan}&kode_lapangan=${row.kode_lapangan}`} className="p-2.5 text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md" title="Atur Jadwal / Item">
                          <Ticket size={18} />
                        </Link>
                        <button onClick={() => openModal('edit', row)} disabled={!!row.id_bayar} className="p-2.5 text-amber-500 bg-amber-50 hover:bg-amber-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-50 disabled:hover:text-amber-500" title="Edit Data"><Edit size={18} /></button>
                        <button onClick={() => openModal('delete', row)} disabled={!!row.id_bayar} className="p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-50 disabled:hover:text-red-500" title="Hapus"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {modalType && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-fade-in-up">
            <div className="flex justify-between items-center p-6 lg:p-8 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                {modalType === 'add' && 'Buat Booking Baru'}
                {modalType === 'edit' && 'Edit Booking'}
                {modalType === 'delete' && 'Hapus Booking'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 transition-colors p-2 bg-white hover:bg-slate-100 rounded-full shadow-sm border border-slate-200">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 lg:p-8">
              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 text-sm flex items-start gap-3 animate-shake">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} id="booking-form" className="space-y-6">
                {(modalType === 'edit' || modalType === 'delete') && (
                  <input type="hidden" name="id_booking" value={selectedData?.id_booking} />
                )}
                {modalType === 'delete' ? (
                  <div className="text-center py-4">
                    <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-100"><Trash2 size={40} /></div>
                    <p className="text-2xl font-bold text-slate-800 mb-3">Hapus Booking?</p>
                    <p className="text-slate-500 text-lg leading-relaxed">
                      Hapus booking <b>{selectedData?.id_booking}</b> atas nama <b>{selectedData?.pelanggan}</b>?<br/>
                      <span className="text-red-500 font-medium">Semua jadwal item di dalamnya juga akan terhapus.</span>
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Kode Booking (Otomatis)</label>
                      <input type="text" name="kode_booking" defaultValue={modalType === 'add' ? kodeBooking : selectedData?.id_booking} readOnly className={`${inputClass} bg-slate-100/70 border-slate-200 text-slate-500 cursor-not-allowed font-mono shadow-inner`} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Pilih Lapangan</label>
                      <div className="relative">
                        <select name="kode_lapangan" defaultValue={selectedData?.kode_lapangan || ''} required className={`${inputClass} appearance-none`}>
                          <option value="" disabled hidden>-- Pilih Lapangan --</option>
                          {lapangan.map(l => <option key={l.id_lapangan} value={l.id_lapangan}>{l.nama_lapangan}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none text-slate-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Nama Pelanggan (Pemesan)</label>
                      <input type="text" name="pelanggan" defaultValue={selectedData?.pelanggan} required className={inputClass} placeholder="Contoh: Tim Futsal Jaya" />
                    </div>
                  </>
                )}
              </form>
            </div>
            <div className="p-6 lg:p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={closeModal} 
                className="px-6 py-3.5 rounded-2xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md" 
                disabled={isLoading}
              >
                Batal
              </button>
              <button 
                form="booking-form" 
                type="submit" 
                disabled={isLoading} 
                className={`px-8 py-3.5 rounded-2xl font-bold text-white transition-all shadow-lg flex items-center gap-2 hover:-translate-y-0.5 ${
                  modalType === 'delete' 
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-red-500/30' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/30'
                }`}
              >
                {isLoading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</> : <>{modalType === 'delete' ? 'Ya, Hapus' : 'Simpan Data'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
