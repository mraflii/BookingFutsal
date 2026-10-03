'use client'

import { useActionState, useEffect, useState, Suspense } from 'react'
import { verifyOTP } from './actions'
import { KeyRound, Activity, ChevronRight, Mail } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

const initialState = {
  error: null,
}

function VerifyForm() {
  const [state, formAction, isPending] = useActionState(verifyOTP, initialState)
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') || ''

  return (
    <div className="min-h-screen flex w-full bg-slate-900 overflow-hidden font-sans">
      {/* Left Panel - Image & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-black flex-col justify-end p-12">
        <Image 
          src="/login-bg.png" 
          alt="Futsal Stadium"
          fill
          priority
          className="object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        
        <div className="relative z-10 space-y-6 max-w-xl animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.5)]">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold text-white tracking-tight leading-tight">
            Verifikasi <br/>
            <span className="text-emerald-400">Akun Anda.</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Satu langkah lagi untuk menyelesaikan pendaftaran Anda.
          </p>
        </div>
      </div>

      {/* Right Panel - OTP Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative overflow-hidden bg-slate-900">
        
        {/* Glow Effects for Mobile/Tablet Background */}
        <div className="absolute lg:hidden top-0 left-[-10%] w-full h-[50%] bg-emerald-600/20 blur-[100px] rounded-full" />
        <div className="absolute lg:hidden bottom-0 right-[-10%] w-full h-[50%] bg-teal-600/20 blur-[100px] rounded-full" />
        
        <div className="w-full max-w-md relative z-10 animate-fade-in">
          <div className="mb-10 lg:mb-14 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Cek Email Anda ✉️</h2>
            <p className="text-slate-400">Kami telah mengirimkan 6-digit kode verifikasi ke <strong>{emailParam || 'email Anda'}</strong>. Silakan masukkan kode tersebut di bawah ini.</p>
          </div>

          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3 animate-shake">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {state.error}
              </div>
            )}

            <input type="hidden" name="email" value={emailParam} />

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Kode Verifikasi (OTP)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-400 text-slate-500">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <input 
                    type="text" 
                    name="code" 
                    required
                    maxLength={6}
                    autoComplete="off"
                    className="block w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:bg-slate-800 transition-all shadow-inner text-2xl font-bold tracking-[1em]"
                    placeholder="------"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="group relative w-full flex justify-center items-center py-4 px-4 font-bold rounded-2xl text-slate-900 bg-emerald-400 hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-8 overflow-hidden shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]"
            >
              {isPending ? (
                <div className="flex items-center gap-2 relative z-10">
                  <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 relative z-10">
                  <span>Verifikasi Akun</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Alouh Futsal. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-400">Loading...</div>}>
      <VerifyForm />
    </Suspense>
  )
}
