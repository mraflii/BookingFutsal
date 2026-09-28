import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Alouh Futsal - Sistem Booking",
  description: "Aplikasi Booking Lapangan Futsal Alouh Futsal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50`}>{children}</body>
    </html>
  );
}
