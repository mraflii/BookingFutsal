import db from '@/lib/db'
import { notFound } from 'next/navigation'
import PrintButton from './PrintButton'

export const metadata = {
  title: 'Invoice / Tiket Booking'
}

export default async function InvoicePage({ params }) {
  const { id } = await params
  
  const [bookingRows] = await db.query(`
    SELECT tb_booking.*, tb_daftar_lapangan.nama_lapangan, tb_bayar.id_bayar, tb_bayar.waktu_bayar, tb_bayar.total_bayar
    FROM tb_booking
    LEFT JOIN tb_daftar_lapangan ON tb_booking.kode_lapangan = tb_daftar_lapangan.id_lapangan
    LEFT JOIN tb_bayar ON tb_bayar.id_bayar = tb_booking.id_booking
    WHERE tb_booking.id_booking = ?
  `, [id])
  
  if (bookingRows.length === 0) return notFound()
  const booking = bookingRows[0]

  if (!booking.id_bayar) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-sm">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Belum Lunas</h1>
          <p className="text-slate-500 mb-4">Tiket ini belum bisa dicetak karena belum ada pembayaran.</p>
        </div>
      </div>
    )
  }

  const [items] = await db.query(`
    SELECT tb_list_booking.*, tb_daftar_lapangan.nama_lapangan,
           (tb_list_booking.harga * tb_list_booking.durasi) AS subtotal
    FROM tb_list_booking
    LEFT JOIN tb_booking ON tb_booking.id_booking = tb_list_booking.kode_booking
    LEFT JOIN tb_daftar_lapangan ON tb_daftar_lapangan.id_lapangan = tb_booking.kode_lapangan
    WHERE tb_list_booking.kode_booking = ?
    ORDER BY tb_list_booking.tanggal_main ASC
  `, [id])

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 font-sans print:bg-white print:p-0">
      
      {/* Tombol Print (Sembunyi saat diprint) */}
      <div className="max-w-2xl mx-auto mb-6 print:hidden flex justify-between items-center">
        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Alouh Futsal System</div>
        <PrintButton />
      </div>

      {/* Kontainer Kertas Tiket/Invoice */}
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl print:shadow-none overflow-hidden border border-slate-200 print:border-none">
        
        {/* Header Invoice */}
        <div className="bg-slate-900 p-8 text-white flex justify-between items-start print:bg-slate-900 print:text-black print:border-b-4 print:border-slate-800">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1 text-emerald-400">ALOUH FUTSAL</h1>
            <p className="text-slate-400 text-sm max-w-xs">Pusat Olahraga Futsal Premium. Buka setiap hari 08:00 - 03:00.</p>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">INVOICE / TIKET</div>
            <div className="text-2xl font-mono font-bold bg-white/10 px-3 py-1 rounded-lg border border-white/20">
              #{booking.id_booking}
            </div>
          </div>
        </div>

        {/* Info Pelanggan & Waktu */}
        <div className="p-8 border-b border-slate-100 border-dashed flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ditagihkan Kepada:</div>
            <div className="text-lg font-bold text-slate-800">{booking.pelanggan}</div>
            <div className="text-sm text-slate-500 mt-1">Status: <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">LUNAS</span></div>
          </div>
          <div className="md:text-right">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Transaksi:</div>
            <div className="text-sm font-bold text-slate-800 mb-1">
              {new Date(booking.waktu_booking).toLocaleDateString('id-ID', { year:'numeric', month:'long', day:'numeric' })}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-3 mb-1">Waktu Pembayaran:</div>
            <div className="text-sm font-medium text-slate-600">
              {new Date(booking.waktu_bayar).toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {/* Tabel Detail */}
        <div className="p-8">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Rincian Sewa Lapangan</div>
          
          <table className="w-full text-left mb-8">
            <thead>
              <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 border-b border-slate-100">Item / Waktu</th>
                <th className="pb-3 border-b border-slate-100 text-right">Durasi</th>
                <th className="pb-3 border-b border-slate-100 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-50 last:border-0">
                  <td className="py-4">
                    <div className="font-bold text-slate-800 mb-1">{item.nama_lapangan}</div>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                      <span className="font-medium">{new Date(item.tanggal_main).toLocaleDateString('id-ID', { weekday:'short', day:'numeric', month:'short' })}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <span className="font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 rounded">{item.jam_main}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right font-medium text-slate-600">{item.durasi} Jam</td>
                  <td className="py-4 text-right font-bold text-slate-800">Rp {Number(item.subtotal).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-500">Subtotal</span>
                <span className="text-sm font-bold text-slate-800">Rp {Number(booking.total_bayar).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-slate-500">Pajak (0%)</span>
                <span className="text-sm font-bold text-slate-800">Rp 0</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <span className="font-bold text-slate-800">Total Bayar</span>
                <span className="text-xl font-black text-emerald-600">Rp {Number(booking.total_bayar).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900 text-center p-6 text-white/50 text-xs print:bg-white print:text-slate-400 print:border-t print:border-slate-200">
          <p>Tunjukkan tiket ini (cetak atau dari layar HP) ke petugas saat Anda datang.</p>
          <p className="mt-1 font-mono">Verifikasi Sistem: {booking.id_bayar}</p>
        </div>

      </div>
    </div>
  )
}
