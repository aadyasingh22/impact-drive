'use client'

import Link from 'next/link'
import { ArrowRight, Heart, Trophy, Target, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-blue-200">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter text-blue-900">
          IMPACT<span className="text-blue-500">DRIVE</span>
        </div>
        <div className="flex gap-8 items-center font-bold">
          <Link href="/charities" className="text-neutral-500 hover:text-blue-600 transition-colors text-sm">Charities</Link>
          
          {/* CORRECTED LINK: Changed /login to /signin */}
          <Link href="/signin" className="text-neutral-900 hover:text-blue-600 transition-colors text-sm">Sign In</Link>
          
          <Link href="/subscribe" className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl shadow-blue-100 text-sm font-black">
            Join the Club
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="px-8 py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-xl w-fit text-xs font-black tracking-widest uppercase">
              <Sparkles size={14} />
              <span>A new way to play and give</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.95] text-neutral-950">
              Transform your game into <span className="text-blue-600">global impact.</span>
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed max-w-lg font-bold">
              Track your performance, enter monthly prize draws, and automatically support the causes you care about.
            </p>
            <div className="flex gap-4 items-center pt-4">
              <Link href="/subscribe" className="bg-blue-600 text-white px-10 py-5 rounded-2xl text-lg font-black hover:bg-blue-700 transition-all transform hover:-translate-y-1 shadow-2xl shadow-blue-200 flex items-center gap-3 active:scale-95">
                Start Making an Impact <ArrowRight size={22} />
              </Link>
            </div>
          </div>

          {/* Visual Impact Card */}
          <div className="relative h-[550px] rounded-[40px] bg-gradient-to-br from-blue-900 via-indigo-950 to-black overflow-hidden shadow-2xl flex items-center justify-center p-12 text-center group">
             <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent group-hover:opacity-50 transition-opacity"></div>
             <div className="relative z-10 flex flex-col items-center gap-6 text-white">
                <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/10 shadow-inner">
                  <Heart size={80} className="text-pink-500 animate-pulse" />
                </div>
                <h2 className="text-5xl font-black tracking-tighter">Over $50,000 Raised</h2>
                <p className="text-blue-200 text-lg font-bold max-w-xs">Join a community of players making a real difference every single month.</p>
             </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="bg-white py-24 border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-black tracking-tight mb-4 text-neutral-900">How It Works</h2>
              <p className="text-xl text-neutral-500 font-bold italic">Simple steps to rewards and charitable giving.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="flex flex-col items-center text-center gap-6 group">
                <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-blue-100 duration-300">
                  <Target size={36} />
                </div>
                <h3 className="text-2xl font-black text-neutral-900">1. Log Your Scores</h3>
                <p className="text-neutral-700 leading-relaxed font-bold">Play your usual rounds and enter your Stableford scores into our tracking engine.</p>
              </div>

              <div className="flex flex-col items-center text-center gap-6 group">
                <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-all group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-xl group-hover:shadow-amber-100 duration-300">
                  <Trophy size={36} />
                </div>
                <h3 className="text-2xl font-black text-neutral-900">2. Win the Draw</h3>
                <p className="text-neutral-700 leading-relaxed font-bold">Match your numbers in our algorithm-powered monthly draw to win from the prize pool.</p>
              </div>

              <div className="flex flex-col items-center text-center gap-6 group">
                <div className="w-20 h-20 rounded-3xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-all group-hover:bg-pink-500 group-hover:text-white group-hover:shadow-xl group-hover:shadow-pink-100 duration-300">
                  <Heart size={36} />
                </div>
                <h3 className="text-2xl font-black text-neutral-900">3. Empower Charities</h3>
                <p className="text-neutral-700 leading-relaxed font-bold">A fixed percentage of your subscription goes directly to the charity you choose.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}