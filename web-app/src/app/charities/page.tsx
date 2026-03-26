'use client'

import Link from 'next/link'
import { Heart, Globe, BookOpen, Droplets, ArrowLeft, Target } from 'lucide-react'

const charities = [
  {
    id: 1,
    name: "Clean Water Initiative",
    description: "Providing sustainable clean water solutions to communities in Sub-Saharan Africa.",
    impact: "10% of every subscription",
    icon: <Droplets className="text-blue-500" size={32} />,
    color: "bg-blue-50"
  },
  {
    id: 2,
    name: "Global Education Fund",
    description: "Building schools and providing digital learning tools for underprivileged children.",
    impact: "10% of every subscription",
    icon: <BookOpen className="text-emerald-500" size={32} />,
    color: "bg-emerald-50"
  },
  {
    id: 3,
    name: "Ocean Cleanup Project",
    description: "Developing advanced technologies to rid the world's oceans of plastic waste.",
    impact: "10% of every subscription",
    icon: <Globe className="text-cyan-500" size={32} />,
    color: "bg-cyan-50"
  }
]

export default function Charities() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 px-8 py-6 flex justify-between items-center sticky top-0 z-10">
        <Link href="/" className="text-2xl font-black tracking-tighter text-blue-900 flex items-center gap-2">
          <Target size={28} className="text-blue-600" />
          IMPACT<span className="text-blue-500">DRIVE</span>
        </Link>
        <Link href="/signup" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
          Join the Club
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tight mb-4">Our Partner Charities</h1>
          <p className="text-xl text-neutral-500 font-bold italic">Your game directly supports these global causes.</p>
        </div>

        {/* Charity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {charities.map((charity) => (
            <div key={charity.id} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-neutral-100 hover:shadow-2xl transition-all group flex flex-col items-center text-center">
              <div className={`${charity.color} w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner`}>
                {charity.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">{charity.name}</h3>
              <p className="text-neutral-500 font-bold leading-relaxed mb-8 flex-grow">
                {charity.description}
              </p>
              <div className="pt-6 border-t border-neutral-50 w-full">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Impact Commitment</p>
                <p className="text-sm font-black text-pink-600 uppercase tracking-tight">{charity.impact}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link href="/" className="group text-neutral-400 font-black text-xs uppercase tracking-widest hover:text-neutral-900 transition-all flex items-center justify-center gap-2">
            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}