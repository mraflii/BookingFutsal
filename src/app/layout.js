import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Alouh Futsal - Sistem Booking",
  description: "Aplikasi Booking Lapangan Futsal Alouh Futsal",
};

import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50`}>
        {children}
        <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-YOUR_DUMMY_KEY_PLEASE_CHANGE'} strategy="beforeInteractive" />
      </body>
    </html>
  );
}
