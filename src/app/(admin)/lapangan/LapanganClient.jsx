'use client'

import { useState, useMemo } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  Image as ImageIcon, 
  Sun, 
  Moon, 
  Sparkles, 
  Layers, 
  Search, 
  LayoutGrid, 
  Table as TableIcon,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react'
import Swal from 'sweetalert2'
import { addLapangan, editLapangan, deleteLapangan } from './actions'

export default function LapanganClient({ initialData }) {
  const [modalType, setModalType] = useState(null) // 'add', 'edit', 'view', 'delete'
  const [selectedData, setSelectedData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'table'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLantai, setSelectedLantai] = useState('ALL')
  const [imagePreview, setImagePreview] = useState(null)

  const closeModal = () => {
    setModalType(null)
    setSelectedData(null)
    setError(null)
    setImagePreview(null)
  }

  const openModal = (type, data = null) => {
    setModalType(type)
    setSelectedData(data)
    setImagePreview(data?.foto ? `/assets/img/${data.foto}` : null)
  }

  // Handle local image file selection preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
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
      setError('Gagal memproses data lapangan. Pastikan ukuran file foto maksimal 500KB.')
    }
    
    setIsLoading(false)
  }

  // Filter Data
  const filteredData = useMemo(() => {
    return initialData.filter(lap => {
      const matchSearch = (lap.nama_lapangan || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (lap.fasilitas || '').toLowerCase().includes(searchQuery.toLowerCase())
      const matchLantai = selectedLantai === 'ALL' || lap.jenis_lantai === selectedLantai
      return matchSearch && matchLantai
    })
  }, [initialData, searchQuery, selectedLantai])

  // Lantai list options
  const lantaiOptions = useMemo(() => {
    const set = new Set(initialData.map(l => l.jenis_lantai).filter(Boolean))
    return ['ALL', ...Array.from(set)]
  }, [initialData])

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Standard Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Data Lapangan</h1>
          <p className="text-slate-500 mt-1">Kelola data dan tarif sewa lapangan futsal Anda.</p>
        </div>
        <button 
          onClick={() => openModal('add')}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-[0_8px_16px_rgba(16,185,129,0.2)] hover:shadow-[0_12px_24px_rgba(16,185,129,0.3)] hover:-translate-y-1 active:translate-y-0 text-sm"
        >
          <Plus size={20} /> Tambah Lapangan
        </button>
      </div>

      {/* Bar Pencarian & Switcher Tampilan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 lg:p-5 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Cari nama lapangan, fasilitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Filter Lantai & Grid/Table Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
            {lantaiOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedLantai(opt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedLantai === opt 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt === 'ALL' ? 'Semua Lantai' : opt}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Grid vs Table View Mode */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-700'}`}
              title="Tampilan Grid Card"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-700'}`}
              title="Tampilan Tabel"
            >
              <TableIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Konten Lapangan (Grid Card atau Table) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData.length === 0 ? (
            <div className="col-span-full bg-white rounded-[2rem] p-12 text-center border border-slate-100 text-slate-400">
              <Layers size={48} className="mx-auto mb-3 text-slate-300" />
              <p className="font-bold text-slate-600 text-lg">Tidak ada lapangan yang sesuai.</p>
              <p className="text-sm mt-1">Coba ubah kata kunci pencarian atau filter lantai Anda.</p>
            </div>
          ) : (
            filteredData.map((row) => (
              <div 
                key={row.id_lapangan}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1"
              >
                {/* Image Container with Badges */}
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  {row.foto ? (
                    <img 
                      src={`/assets/img/${row.foto}`} 
                      alt={row.nama_lapangan} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                      <ImageIcon size={44} />
                      <span className="text-xs font-semibold mt-2">Belum ada foto</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Badges on Top */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-black text-slate-800 shadow-sm border border-white/40">
                      {row.id_lapangan}
                    </span>
                    <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-md shadow-emerald-500/30">
                      {row.jenis_lantai || 'Standar'}
                    </span>
                  </div>

                  {/* Bottom Title on Image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-black text-white drop-shadow-md">
                      {row.nama_lapangan}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  {/* Harga Sewa (Siang vs Malam) */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold text-amber-600 uppercase flex items-center gap-1">
                        <Sun size={13} /> Tarif Siang
                      </span>
                      <p className="text-lg font-black text-slate-800 mt-0.5">
                        Rp {Number(row.harga).toLocaleString('id-ID')}
                        <span className="text-xs font-medium text-slate-400"> /jam</span>
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-indigo-600 uppercase flex items-center gap-1">
                        <Moon size={13} /> Tarif Malam (20:00+)
                      </span>
                      <p className="text-lg font-black text-indigo-600 mt-0.5">
                        {row.harga_malam ? `Rp ${Number(row.harga_malam).toLocaleString('id-ID')}` : '-'}
                        {row.harga_malam && <span className="text-xs font-medium text-slate-400"> /jam</span>}
                      </p>
                    </div>
                  </div>

                  {/* Fasilitas */}
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Fasilitas Arena:</span>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      {row.fasilitas || 'Bola pertandingan, rompi tim, papan skor'}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button 
                      onClick={() => openModal('view', row)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                    >
                      <Eye size={15} /> Detail
                    </button>
                    <button 
                      onClick={() => openModal('edit', row)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition-all border border-amber-200/50"
                    >
                      <Edit size={15} /> Edit
                    </button>
                    <button 
                      onClick={() => openModal('delete', row)}
                      className="p-2.5 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all border border-red-100"
                      title="Hapus Lapangan"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Tabel Klasik yang Dipercantik */
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <th className="p-6 w-20 text-center">No</th>
                  <th className="p-6 w-36">Foto</th>
                  <th className="p-6">Nama & Spesifikasi</th>
                  <th className="p-6">Tarif Siang (08-17)</th>
                  <th className="p-6">Tarif Malam (20-23)</th>
                  <th className="p-6">Fasilitas</th>
                  <th className="p-6 text-center w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-slate-400">
                      Tidak ada data lapangan ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, idx) => (
                    <tr key={row.id_lapangan} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-6">
                        <div className="w-24 h-16 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                          {row.foto ? (
                            <img src={`/assets/img/${row.foto}`} alt={row.nama_lapangan} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon size={22} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="font-extrabold text-slate-800 text-base">{row.nama_lapangan}</p>
                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-bold">
                          {row.jenis_lantai || 'Standar'}
                        </span>
                      </td>
                      <td className="p-6">
                        <span className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-700 font-bold text-sm rounded-lg border border-amber-200/50">
                          Rp {Number(row.harga).toLocaleString('id-ID')}
                        </span>
                      </td>
                      <td className="p-6">
                        {row.harga_malam ? (
                          <span className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-lg border border-indigo-200/50">
                            Rp {Number(row.harga_malam).toLocaleString('id-ID')}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="p-6 text-xs text-slate-500 font-medium max-w-xs truncate">
                        {row.fasilitas || 'Standar'}
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => openModal('view', row)}
                            className="p-2.5 text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm"
                            title="Detail"
                          >
                            <Eye size={17} />
                          </button>
                          <button 
                            onClick={() => openModal('edit', row)}
                            className="p-2.5 text-amber-500 bg-amber-50 hover:bg-amber-500 hover:text-white rounded-xl transition-all shadow-sm"
                            title="Edit"
                          >
                            <Edit size={17} />
                          </button>
                          <button 
                            onClick={() => openModal('delete', row)}
                            className="p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                            title="Hapus"
                          >
                            <Trash2 size={17} />
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
      )}

      {/* MODAL POPUP */}
      {modalType && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
            <div className="flex justify-between items-center p-6 lg:p-8 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
                {modalType === 'add' && <><Plus className="text-emerald-500" /> Tambah Lapangan Baru</>}
                {modalType === 'edit' && <><Edit className="text-amber-500" /> Edit Lapangan</>}
                {modalType === 'view' && <><Eye className="text-blue-500" /> Detail Lapangan</>}
                {modalType === 'delete' && <><Trash2 className="text-red-500" /> Hapus Lapangan</>}
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
                      <p className="text-slate-500 text-base leading-relaxed max-w-md mx-auto">
                        Apakah Anda yakin ingin menghapus <b>{selectedData?.nama_lapangan}</b>? Semua data terkait lapangan ini akan ikut terhapus.
                      </p>
                    </div>
                  </>
                )}

                {modalType !== 'delete' && (
                  <>
                    {modalType === 'edit' && <input type="hidden" name="old_foto" value={selectedData?.foto} />}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Nama Lapangan</label>
                        <input 
                          type="text" 
                          name="nama_lapangan" 
                          defaultValue={selectedData?.nama_lapangan}
                          disabled={modalType === 'view'}
                          required 
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-70 text-slate-800 font-medium"
                          placeholder="Contoh: Lapangan Rumput Sintetis"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Jenis Lantai</label>
                        <select 
                          name="jenis_lantai" 
                          defaultValue={selectedData?.jenis_lantai || 'Rumput Sintetis'}
                          disabled={modalType === 'view'}
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-70 text-slate-800 font-medium appearance-none"
                        >
                          <option value="Rumput Sintetis">Rumput Sintetis</option>
                          <option value="Fiber / Vinyl">Fiber / Vinyl</option>
                          <option value="Interlock">Interlock</option>
                          <option value="Semen">Semen</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                          <Sun size={14} className="text-amber-500" /> Tarif Siang (Reguler)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-sm">Rp</div>
                          <input 
                            type="number" 
                            name="harga" 
                            defaultValue={selectedData?.harga}
                            disabled={modalType === 'view'}
                            required 
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-70 text-slate-800 font-medium"
                            placeholder="100000"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                          <Moon size={14} className="text-indigo-500" /> Tarif Malam (20:00+)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-sm">Rp</div>
                          <input 
                            type="number" 
                            name="harga_malam" 
                            defaultValue={selectedData?.harga_malam}
                            disabled={modalType === 'view'}
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-70 text-slate-800 font-medium"
                            placeholder="120000"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Fasilitas Lapangan</label>
                        <input 
                          type="text" 
                          name="fasilitas" 
                          defaultValue={selectedData?.fasilitas}
                          disabled={modalType === 'view'}
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-70 text-slate-800 font-medium"
                          placeholder="Contoh: Bola Standar FIFA, Rompi Tim 2 Warna, Papan Skor Digital"
                        />
                      </div>

                      {/* Photo Upload with Live Preview */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                          {modalType === 'add' ? 'Upload Foto Lapangan' : (modalType === 'edit' ? 'Ubah Foto (Opsional, Max 500KB)' : 'Foto Lapangan')}
                        </label>
                        
                        {/* Preview Box */}
                        {imagePreview && (
                          <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-56 bg-slate-50 mb-3 shadow-inner">
                            <img src={imagePreview} alt="Preview" className="w-full h-56 object-cover" />
                          </div>
                        )}

                        {modalType !== 'view' && (
                          <div className="relative">
                            <input 
                              type="file" 
                              name="foto" 
                              accept="image/*"
                              onChange={handleFileChange}
                              required={modalType === 'add'}
                              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 transition-all cursor-pointer text-slate-500 text-sm"
                            />
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
                className="px-6 py-3.5 rounded-2xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md text-sm"
                disabled={isLoading}
              >
                {modalType === 'view' ? 'Tutup' : 'Batal'}
              </button>
              
              {modalType !== 'view' && (
                <button 
                  form="lapangan-form"
                  type="submit"
                  disabled={isLoading}
                  className={`px-8 py-3.5 rounded-2xl font-bold text-white transition-all shadow-lg flex items-center gap-2 hover:-translate-y-0.5 text-sm ${
                    modalType === 'delete' 
                      ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-red-500/30' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/30'
                  }`}
                >
                  {isLoading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>
                  ) : (
                    <>{modalType === 'delete' ? 'Ya, Hapus Lapangan' : 'Simpan Lapangan'}</>
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
