'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, X, KeyRound, ShieldCheck, User } from 'lucide-react'
import Swal from 'sweetalert2'
import { addUser, editUser, deleteUser, resetPassword } from './actions'

const LEVEL_LABELS = { '1': 'Administrator', '2': 'Pelanggan' }

export default function UserClient({ initialData, currentUserId }) {
  const [modalType, setModalType] = useState(null)
  const [selectedData, setSelectedData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const closeModal = () => { setModalType(null); setSelectedData(null); setError(null) }
  const openModal = (type, data = null) => { setModalType(type); setSelectedData(data) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const formData = new FormData(e.target)
    let result

    if (modalType === 'add') result = await addUser(null, formData)
    else if (modalType === 'edit') result = await editUser(null, formData)
    else if (modalType === 'delete') result = await deleteUser(null, formData)
    else if (modalType === 'reset') result = await resetPassword(null, formData)

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

  const isSelf = selectedData && String(selectedData.id) === String(currentUserId)

  const inputClass = (disabled) =>
    `w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 font-medium ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Data User</h1>
          <p className="text-slate-500 mt-1">Kelola data pelanggan dan hak akses administrator.</p>
        </div>
        <button 
          onClick={() => openModal('add')}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-[0_8px_16px_rgba(16,185,129,0.2)] hover:shadow-[0_12px_24px_rgba(16,185,129,0.3)] hover:-translate-y-1"
        >
          <Plus size={20} /> Tambah User
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <th className="p-6 w-20 text-center rounded-tl-[2rem]">No</th>
                <th className="p-6">Nama Pengguna</th>
                <th className="p-6">Username</th>
                <th className="p-6">Level</th>
                <th className="p-6">No Handphone</th>
                <th className="p-6 w-48 text-center rounded-tr-[2rem]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {initialData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400">
                    Tidak ada data user.
                  </td>
                </tr>
              ) : (
                initialData.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-700 flex items-center justify-center font-bold shadow-sm border border-emerald-100/50 shrink-0">
                          {row.nama?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="font-bold text-slate-800 text-lg">{row.nama}</span>
                      </div>
                    </td>
                    <td className="p-6 font-medium text-slate-500">{row.username}</td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${row.level === '1' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                        {LEVEL_LABELS[row.level] || row.level}
                      </span>
                    </td>
                    <td className="p-6 font-medium text-slate-500">{row.nohp || '-'}</td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openModal('view', row)} className="p-2.5 text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md" title="Lihat"><Eye size={18} /></button>
                        <button onClick={() => openModal('edit', row)} className="p-2.5 text-amber-500 bg-amber-50 hover:bg-amber-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md" title="Edit"><Edit size={18} /></button>
                        <button onClick={() => openModal('reset', row)} className="p-2.5 text-slate-500 bg-slate-100 hover:bg-slate-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md" title="Reset Password"><KeyRound size={18} /></button>
                        <button onClick={() => openModal('delete', row)} className="p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md" title="Hapus"><Trash2 size={18} /></button>
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
                {modalType === 'add' && 'Tambah User Baru'}
                {modalType === 'edit' && 'Edit Data User'}
                {modalType === 'view' && 'Detail User'}
                {modalType === 'delete' && 'Hapus User'}
                {modalType === 'reset' && 'Reset Password'}
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

              <form onSubmit={handleSubmit} id="user-form" className="space-y-6">
                {(modalType === 'edit' || modalType === 'delete' || modalType === 'reset') && (
                  <input type="hidden" name="id" value={selectedData?.id} />
                )}
                
                {(modalType === 'delete' || modalType === 'reset') ? (
                  <div className="text-center py-6">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ${modalType === 'delete' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                      {modalType === 'delete' ? <Trash2 size={40} /> : <KeyRound size={40} />}
                    </div>
                    {isSelf ? (
                      <div className="p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 text-sm max-w-md mx-auto">
                        {modalType === 'delete' ? 'Anda tidak dapat menghapus akun yang sedang Anda gunakan.' : 'Anda tidak dapat mereset password akun yang sedang Anda gunakan.'}
                      </div>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-slate-800 mb-3">
                          {modalType === 'delete' ? 'Hapus User?' : 'Reset Password?'}
                        </p>
                        <p className="text-slate-500 text-lg leading-relaxed max-w-md mx-auto">
                          {modalType === 'delete'
                            ? <span>Apakah Anda yakin ingin menghapus user <b>{selectedData?.username}</b>? Tindakan ini tidak dapat dibatalkan.</span>
                            : <span>Yakin ingin mereset password user <b>{selectedData?.username}</b> menjadi <b>"password"</b>?</span>
                          }
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Nama Lengkap</label>
                      <input type="text" name="nama" defaultValue={selectedData?.nama} disabled={modalType === 'view'} required className={inputClass(modalType === 'view')} placeholder="Contoh: Muhammad Rafli" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Username</label>
                      <input type="text" name="username" defaultValue={selectedData?.username}
                        disabled={modalType === 'view' || (modalType === 'edit' && isSelf)}
                        required={modalType === 'add'}
                        className={inputClass(modalType === 'view' || (modalType === 'edit' && isSelf))}
                        placeholder="rafli123" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Level Akses</label>
                      <div className="relative">
                        <select name="level" defaultValue={selectedData?.level || ''} disabled={modalType === 'view'} required className={`${inputClass(modalType === 'view')} appearance-none`}>
                          <option value="" disabled hidden>Pilih Level</option>
                          <option value="1">Owner / Admin</option>
                          <option value="2">Pelanggan</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none text-slate-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">No. Handphone</label>
                      <input type="text" name="nohp" defaultValue={selectedData?.nohp} disabled={modalType === 'view'} className={inputClass(modalType === 'view')} placeholder="08123456789" />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Alamat Lengkap</label>
                      <textarea name="alamat" defaultValue={selectedData?.alamat} disabled={modalType === 'view'} rows={3} className={inputClass(modalType === 'view')} placeholder="Masukkan alamat lengkap" />
                    </div>
                    {modalType === 'add' && (
                      <div className="md:col-span-2 p-4 bg-amber-50 rounded-2xl text-amber-700 text-sm border border-amber-100 flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0"><KeyRound size={16} /></div>
                        <div>
                          <strong>Info:</strong> Password default untuk user baru adalah: <code className="bg-amber-100 px-2 py-0.5 rounded font-bold">password</code>
                        </div>
                      </div>
                    )}
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
                {modalType === 'view' ? 'Tutup' : 'Batal'}
              </button>
              
              {modalType !== 'view' && !isSelf && (
                <button 
                  form="user-form"
                  type="submit"
                  disabled={isLoading}
                  className={`px-8 py-3.5 rounded-2xl font-bold text-white transition-all shadow-lg flex items-center gap-2 hover:-translate-y-0.5 ${
                    modalType === 'delete' 
                      ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-red-500/30' 
                      : modalType === 'reset'
                      ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-800/30'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/30'
                  }`}
                >
                  {isLoading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>
                  ) : (
                    <>{modalType === 'delete' ? 'Ya, Hapus Data' : modalType === 'reset' ? 'Ya, Reset Password' : 'Simpan Data'}</>
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
