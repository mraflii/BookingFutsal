'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, X, ArrowLeft, CreditCard, CheckCircle, Ticket, Map, Clock, CalendarDays, Wallet, User } from 'lucide-react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { addBookingItem, editBookingItem, deleteBookingItem, bayarBooking } from './actions'

const JAM_OPTIONS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','00:00','01:00','02:00','03:00']

export default function BookingItemClient({ bookingInfo, items, total, kode_booking, pelanggan, kode_lapangan }) {
  const [modalType, setModalType] = useState(null)
  const [selectedData, setSelectedData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const isPaid = !!bookingInfo?.id_bayar

  const closeModal = () => { setModalType(null); setSelectedData(null); setError(null) }
  const openModal = (type, data = null) => { setModalType(type); setSelectedData(data) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const formData = new FormData(e.target)
    let result

    if (modalType === 'add') result = await addBookingItem(null, formData)
    else if (modalType === 'edit') result = await editBookingItem(null, formData)
    else if (modalType === 'delete') result = await deleteBookingItem(null, formData)
    else if (modalType === 'bayar') result = await bayarBooking(null, formData)

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

  const inputClass = "w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800"

  return (
    <div className="animate-fade-in-up">
      {/* Booking Info Header */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 lg:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/booking" className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all shadow-sm hover:shadow-md text-slate-500 hover:text-slate-700">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Kode Booking</p>
              <div className="flex items-center gap-3">
                <Ticket className="text-emerald-500" size={24} />
                <p className="font-mono font-extrabold text-slate-800 text-2xl tracking-tight">{kode_booking}</p>
              </div>
            </div>
          </div>
          <div>
            {isPaid
              ? <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl shadow-sm"><CheckCircle size={20} className="text-emerald-500" /> <span className="font-bold">Pembayaran Lunas</span></div>
              : <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-2xl shadow-sm"><Clock size={20} className="text-amber-500" /> <span className="font-bold">Menunggu Pembayaran</span></div>
            }
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><User size={14} /> Pelanggan</p>
            <p className="font-bold text-slate-800 text-lg">{bookingInfo?.pelanggan}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><Map size={14} /> Lapangan</p>
            <p className="font-bold text-slate-800 text-lg">{bookingInfo?.nama_lapangan}</p>
          </div>
          <div className="md:text-right">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2 md:justify-end"><Wallet size={14} /> Total Tagihan</p>
            <p className="font-extrabold text-emerald-600 text-2xl">Rp {total.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="text-emerald-500" size={24} /> 
            Daftar Jadwal Sesi Main
          </h2>
          {!isPaid && (
            <div className="flex gap-3 w-full sm:w-auto">
              <button onClick={() => openModal('add')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm hover:shadow-md">
                <Plus size={18} /> Tambah Sesi
              </button>
              {items.length > 0 && (
                <button onClick={() => openModal('bayar')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white px-5 py-3 rounded-2xl text-sm font-bold transition-all shadow-[0_4px_12px_rgba(14,165,233,0.3)] hover:shadow-[0_8px_20px_rgba(14,165,233,0.4)] hover:-translate-y-0.5">
                  <CreditCard size={18} /> Konfirmasi Bayar
                </button>
              )}
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <th className="p-6">Nama Lapangan</th>
                <th className="p-6">Tanggal Main</th>
                <th className="p-6">Waktu Main</th>
                <th className="p-6">Subtotal Tagihan</th>
                {!isPaid && <th className="p-6 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400">
                    <CalendarDays size={48} className="mx-auto mb-4 text-slate-200" />
                    Belum ada sesi jadwal main. Klik <b>"+ Tambah Sesi"</b> untuk menjadwalkan.
                  </td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.id_list_booking} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6 font-bold text-slate-700">{item.nama_lapangan}</td>
                    <td className="p-6 font-medium text-slate-600">{item.tanggal_main ? new Date(item.tanggal_main).toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) : '-'}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <span className="font-mono font-bold text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">{item.jam_main}</span>
                        <span className="font-medium text-slate-500 text-sm">{item.durasi} Jam</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center px-4 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-full border border-emerald-100">
                        Rp {Number(item.subtotal).toLocaleString('id-ID')}
                      </span>
                    </td>
                    {!isPaid && (
                      <td className="p-6">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openModal('edit', item)} className="p-2.5 text-amber-500 bg-amber-50 hover:bg-amber-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md" title="Edit Jadwal"><Edit size={18} /></button>
                          <button onClick={() => openModal('delete', item)} className="p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md" title="Hapus Jadwal"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
            {items.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50/80 border-t border-slate-200">
                  <td colSpan={3} className="p-6 font-extrabold text-slate-700 text-right uppercase tracking-widest text-sm">Total Tagihan:</td>
                  <td className="p-6 font-extrabold text-emerald-600 text-2xl">Rp {total.toLocaleString('id-ID')}</td>
                  {!isPaid && <td></td>}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* MODAL */}
      {modalType && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
            <div className="flex justify-between items-center p-6 lg:p-8 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                {modalType === 'add' && 'Tambah Sesi Main'}
                {modalType === 'edit' && 'Edit Sesi Main'}
                {modalType === 'delete' && 'Hapus Sesi Main'}
                {modalType === 'bayar' && 'Konfirmasi Pembayaran'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 transition-colors p-2 bg-white hover:bg-slate-100 rounded-full shadow-sm border border-slate-200">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 lg:p-8 overflow-y-auto custom-scrollbar">
              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 text-sm flex items-start gap-3 animate-shake">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} id="item-form" className="space-y-6">
                <input type="hidden" name="kode_booking" value={kode_booking} />
                {(modalType === 'edit' || modalType === 'delete') && <input type="hidden" name="id" value={selectedData?.id_list_booking} />}

                {modalType === 'bayar' && (
                  <>
                    <input type="hidden" name="total" value={total} />
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-6 text-center shadow-inner">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Total Tagihan Yang Harus Dibayar</p>
                      <p className="text-4xl font-extrabold text-emerald-600">Rp {total.toLocaleString('id-ID')}</p>
                    </div>
                    <p className="text-slate-600 text-lg leading-relaxed text-center">
                      Anda akan mengkonfirmasi pembayaran tunai untuk booking <b>{kode_booking}</b> atas nama <b>{pelanggan}</b>.
                    </p>
                  </>
                )}
                
                {modalType === 'delete' && (
                  <div className="text-center py-4">
                    <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-100"><Trash2 size={40} /></div>
                    <p className="text-2xl font-bold text-slate-800 mb-3">Hapus Jadwal?</p>
                    <p className="text-slate-500 text-lg leading-relaxed">
                      Hapus sesi tanggal <b>{selectedData?.tanggal_main}</b><br/>jam <b>{selectedData?.jam_main}</b>?
                    </p>
                  </div>
                )}
                
                {(modalType === 'add' || modalType === 'edit') && (
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Tanggal Main</label>
                      <input type="date" name="tanggal_main" defaultValue={selectedData?.tanggal_main?.split('T')[0]} required className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Jam Main</label>
                        <div className="relative">
                          <select name="jam_main" defaultValue={selectedData?.jam_main || '08:00'} required className={`${inputClass} appearance-none`}>
                            {JAM_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Durasi (Jam)</label>
                        <input type="number" name="durasi" defaultValue={selectedData?.durasi} min="1" max="12" required className={inputClass} placeholder="Contoh: 2" />
                      </div>
                    </div>
                  </div>
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
                form="item-form" 
                type="submit" 
                disabled={isLoading} 
                className={`px-8 py-3.5 rounded-2xl font-bold text-white transition-all shadow-lg flex items-center gap-2 hover:-translate-y-0.5 ${
                  modalType === 'delete' 
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-red-500/30' 
                    : modalType === 'bayar' 
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 shadow-[0_8px_20px_rgba(14,165,233,0.3)]' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/30'
                }`}
              >
                {isLoading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</> : <>{modalType === 'delete' ? 'Ya, Hapus Data' : modalType === 'bayar' ? 'Konfirmasi Bayar' : 'Simpan Data'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
