'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, X, Image as ImageIcon } from 'lucide-react'
import Swal from 'sweetalert2'
import { addLapangan, editLapangan, deleteLapangan } from './actions'

export default function LapanganClient({ initialData }) {
  const [modalType, setModalType] = useState(null) // 'add', 'edit', 'view', 'delete'
  const [selectedData, setSelectedData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const closeModal = () => {
    setModalType(null)
    setSelectedData(null)
    setError(null)
  }

  const openModal = (type, data = null) => {
    setModalType(type)
    setSelectedData(data)
  }

  const clientAction = async (formData) => {
    setIsLoading(true)
    setError(null)

    let result

    try {
      if (modalType === 'add') {
        result = await addLapangan(null, formData)
      } else if (modalType === 'edit') {
        result = await editLapangan(null, formData)
      } else if (modalType === 'delete') {
        result = await deleteLapangan(null, formData)
      }

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
    } catch (e) {
      setError('Gagal mengupload gambar. Pastikan ukuran file sesuai.')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Data Lapangan</h1>
          <p className="text-slate-500 mt-1">Kelola data dan harga sewa lapangan futsal Anda.</p>
        </div>
        <button 
          onClick={() => openModal('add')}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-[0_8px_16px_rgba(16,185,129,0.2)] hover:shadow-[0_12px_24px_rgba(16,185,129,0.3)] hover:-translate-y-1"
        >
          <Plus size={20} /> Tambah Lapangan
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <th className="p-6 w-20 text-center rounded-tl-[2rem]">No</th>
                <th className="p-6 w-40">Foto Lapangan</th>
                <th className="p-6">Nama Lapangan</th>
                <th className="p-6">Harga Sewa</th>
                <th className="p-6 w-48 text-center rounded-tr-[2rem]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {initialData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-400">
                    Belum ada data lapangan yang ditambahkan.
                  </td>
                </tr>
              ) : (
                initialData.map((row, idx) => (
                  <tr key={row.id_lapangan} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-6">
                      <div className="w-24 h-16 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm group-hover:shadow-md transition-all">
                        {row.foto ? (
                          <img src={`/assets/img/${row.foto}`} alt={row.nama_lapangan} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon size={24} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-6 font-bold text-slate-800 text-lg">{row.nama_lapangan}</td>
                    <td className="p-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-100">
                        Rp {Number(row.harga).toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openModal('view', row)}
                          className="p-2.5 text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => openModal('edit', row)}
                          className="p-2.5 text-amber-500 bg-amber-50 hover:bg-amber-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md"
                          title="Edit Data"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => openModal('delete', row)}
                          className="p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md"
                          title="Hapus Data"
                        >
                          <Trash2 size={18} />
                        </button>
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
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
            <div className="flex justify-between items-center p-6 lg:p-8 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                {modalType === 'add' && 'Tambah Lapangan Baru'}
                {modalType === 'edit' && 'Edit Lapangan'}
                {modalType === 'view' && 'Detail Lapangan'}
                {modalType === 'delete' && 'Hapus Lapangan'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 transition-colors p-2 bg-white hover:bg-slate-100 rounded-full shadow-sm border border-slate-200">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 lg:p-8 overflow-y-auto custom-scrollbar">
              {error && (
                <div className="mb-8 p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 text-sm flex items-start gap-3 animate-shake">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
                  {error}
                </div>
              )}

              <form action={clientAction} id="lapangan-form" className="space-y-6">
                {(modalType === 'edit' || modalType === 'delete') && (
                  <input type="hidden" name="id_lapangan" value={selectedData?.id_lapangan} />
                )}
                
                {modalType === 'delete' && (
                  <>
                    <input type="hidden" name="foto" value={selectedData?.foto} />
                    <div className="text-center py-6">
                      <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-100">
                        <Trash2 size={40} />
                      </div>
                      <p className="text-2xl font-bold text-slate-800 mb-3">Hapus Lapangan?</p>
                      <p className="text-slate-500 text-lg leading-relaxed max-w-md mx-auto">
                        Apakah Anda yakin ingin menghapus <b>{selectedData?.nama_lapangan}</b>? Tindakan ini tidak dapat dibatalkan.
                      </p>
                    </div>
                  </>
                )}

                {modalType !== 'delete' && (
                  <>
                    {modalType === 'edit' && <input type="hidden" name="old_foto" value={selectedData?.foto} />}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Nama Lapangan</label>
                        <input 
                          type="text" 
                          name="nama_lapangan" 
                          defaultValue={selectedData?.nama_lapangan}
                          disabled={modalType === 'view'}
                          required 
                          className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-70 text-slate-800 font-medium"
                          placeholder="Contoh: Lapangan Sintetis 1"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Jenis Lantai</label>
                        <select 
                          name="jenis_lantai" 
                          defaultValue={selectedData?.jenis_lantai || 'Rumput Sintetis'}
                          disabled={modalType === 'view'}
                          className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-70 text-slate-800 font-medium appearance-none"
                        >
                          <option value="Rumput Sintetis">Rumput Sintetis</option>
                          <option value="Vinyl">Vinyl</option>
                          <option value="Interlock">Interlock</option>
                          <option value="Semen">Semen</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Harga Reguler (Siang)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 font-bold">Rp</div>
                          <input 
                            type="number" 
                            name="harga" 
                            defaultValue={selectedData?.harga}
                            disabled={modalType === 'view'}
                            required 
                            className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-70 text-slate-800 font-medium"
                            placeholder="100000"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Harga Malam (18:00+)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 font-bold">Rp</div>
                          <input 
                            type="number" 
                            name="harga_malam" 
                            defaultValue={selectedData?.harga_malam}
                            disabled={modalType === 'view'}
                            className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-70 text-slate-800 font-medium"
                            placeholder="120000 (Opsional)"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Harga Weekend</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 font-bold">Rp</div>
                          <input 
                            type="number" 
                            name="harga_weekend" 
                            defaultValue={selectedData?.harga_weekend}
                            disabled={modalType === 'view'}
                            className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-70 text-slate-800 font-medium"
                            placeholder="150000 (Opsional)"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Fasilitas Tambahan</label>
                        <input 
                          type="text" 
                          name="fasilitas" 
                          defaultValue={selectedData?.fasilitas}
                          disabled={modalType === 'view'}
                          className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-70 text-slate-800 font-medium"
                          placeholder="Bola, Papan Skor, Rompi"
                        />
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                          {modalType === 'add' ? 'Upload Foto Lapangan' : (modalType === 'edit' ? 'Ubah Foto (Opsional)' : 'Foto Lapangan')}
                        </label>
                        
                        {modalType === 'view' ? (
                          <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-80 bg-slate-50 shadow-inner p-2">
                            {selectedData?.foto ? (
                              <img src={`/assets/img/${selectedData.foto}`} alt={selectedData.nama_lapangan} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <div className="p-12 text-center text-slate-400">Tidak ada foto</div>
                            )}
                          </div>
                        ) : (
                          <div className="relative">
                            <input 
                              type="file" 
                              name="foto" 
                              accept="image/*"
                              required={modalType === 'add'}
                              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 file:mr-5 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 transition-all cursor-pointer text-slate-500"
                            />
                          </div>
                        )}
                        {modalType === 'edit' && selectedData?.foto && (
                          <div className="mt-4 flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
                            <img src={`/assets/img/${selectedData.foto}`} alt="Current" className="w-20 h-14 object-cover rounded-lg shadow-sm" />
                            <span className="text-sm text-slate-500">Foto saat ini terpasang. Biarkan kosong jika tidak ingin mengubahnya.</span>
                          </div>
                        )}
                      </div>
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
                {modalType === 'view' ? 'Tutup' : 'Batal'}
              </button>
              
              {modalType !== 'view' && (
                <button 
                  form="lapangan-form"
                  type="submit"
                  disabled={isLoading}
                  className={`px-8 py-3.5 rounded-2xl font-bold text-white transition-all shadow-lg flex items-center gap-2 hover:-translate-y-0.5 ${
                    modalType === 'delete' 
                      ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-red-500/30' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/30'
                  }`}
                >
                  {isLoading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>
                  ) : (
                    <>{modalType === 'delete' ? 'Ya, Hapus Data' : 'Simpan Data'}</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
