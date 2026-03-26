import Link from 'next/link'
import { ArrowRight, Heart, Trophy, Target, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-blue-200">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tight text-blue-900">
          Impact<span className="text-blue-500">Drive</span>
        </div>
        <div className="flex gap-6 items-center font-medium">
          <Link href="/charities" className="hover:text-blue-600 transition-colors">Charities</Link>
          <Link href="/login" className="hover:text-blue-600 transition-colors">Sign In</Link>
          <Link href="/subscribe" className="bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md">
            Join the Club
          </Link>
        </div>
      </nav>

      <main>
        <section className="px-8 py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full w-fit text-sm font-semibold tracking-wide">
              <Sparkles size={16} />
              <span>A new way to play and give</span>
            </div>
            <h1 className="text-6xl font-extrabold tracking-tight leading-[1.1] text-neutral-950">
              Transform your game into global impact.
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed max-w-lg">
              Track your performance, enter monthly prize draws, and automatically support the causes you care about.
            </p>
            <div className="flex gap-4 items-center pt-4">
              <Link href="/subscribe" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all transform hover:-translate-y-1 shadow-lg flex items-center gap-2">
                Start Making an Impact <ArrowRight size={20} />
              </Link>
            </div>
          </div>
          <div className="relative h-[600px] rounded-3xl bg-gradient-to-br from-blue-900 to-indigo-900 overflow-hidden shadow-2xl flex items-center justify-center p-12 text-center">
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
             <div className="relative z-10 flex flex-col items-center gap-6 text-white">
                <Heart size={80} className="text-pink-400 animate-pulse" />
                <h2 className="text-4xl font-bold">Over $50,000 Raised</h2>
                <p className="text-blue-200 text-lg">Join a community of players making a real difference every single month.</p>
             </div>
          </div>
        </section>

        <section className="bg-white py-24 border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">How It Works</h2>
              <p className="text-xl text-neutral-500">Simple steps to rewards and charitable giving.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center gap-4 group">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-blue-600 group-hover:text-white duration-300">
                  <Target size={32} />
                </div>
                <h3 className="text-2xl font-semibold">1. Log Your Scores</h3>
                <p className="text-neutral-600 leading-relaxed">Play your usual rounds and enter your Stableford scores into our tracking engine.</p>
              </div>

              <div className="flex flex-col items-center text-center gap-4 group">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-amber-500 group-hover:text-white duration-300">
                  <Trophy size={32} />
                </div>
                <h3 className="text-2xl font-semibold">2. Win the Monthly Draw</h3>
                <p className="text-neutral-600 leading-relaxed">Match your numbers in our algorithm-powered monthly draw to win from the prize pool.</p>
              </div>

              <div className="flex flex-col items-center text-center gap-4 group">
                <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-pink-500 group-hover:text-white duration-300">
                  <Heart size={32} />
                </div>
                <h3 className="text-2xl font-semibold">3. Empower Charities</h3>
                <p className="text-neutral-600 leading-relaxed">A fixed percentage of your subscription goes directly to the charity you choose.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}