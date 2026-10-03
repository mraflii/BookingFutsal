'use client'

import { FileSpreadsheet } from 'lucide-react'

export default function ReportExportButton({ reports }) {
  const exportToCSV = () => {
    // Define CSV header
    let csvContent = 'No,Kode Booking,Pelanggan,Lapangan,Waktu Transaksi,Total Bayar (Rp)\n'
    
    // Add rows
    reports.forEach((row, idx) => {
      const date = row.waktu_bayar ? new Date(row.waktu_bayar).toLocaleString('id-ID') : '-'
      // Escape strings with quotes to handle commas in names
      csvContent += `${idx + 1},"${row.id_booking}","${row.pelanggan}","${row.nama_lapangan}","${date}",${row.total_bayar}\n`
    })

    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `Laporan_Futsal_${new Date().toISOString().slice(0,10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button 
      onClick={exportToCSV}
      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95"
    >
      <FileSpreadsheet size={18} />
      Export Excel (CSV)
    </button>
  )
}
