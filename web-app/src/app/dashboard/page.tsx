'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Heart, Trophy, Activity, CreditCard, LogOut, Plus, Target, Lock, Crown, TrendingUp, Loader2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type ScoreRecord = {
  id: string
  score: number
  date: string
}

export default function Dashboard() {
  const router = useRouter()
  const [score, setScore] = useState('')
  const [scoreDate, setScoreDate] = useState(new Date().toISOString().split('T')[0])
  const [scores, setScores] = useState<ScoreRecord[]>([])
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchScores = async (uid: string) => {
    const { data, error } = await supabase
      .from('scores')
      .select('id, score, date')
      .eq('user_id', uid)
      .order('date', { ascending: false })
      .limit(10)

    if (data && !error) {
      setScores(data)
    }
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/signin') // Updated to match your new route naming
        return
      }

      setUserId(session.user.id)
      setUserEmail(session.user.email || 'Member')

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', session.user.id)
        .single()

      setSubscriptionStatus(profile?.subscription_status || 'inactive')
      
      if (profile?.subscription_status === 'active') {
        fetchScores(session.user.id)
      }
      setIsLoading(false)
    }
    checkUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || subscriptionStatus !== 'active' || !score) return
    
    const numScore = parseInt(score)
    if (numScore >= 1 && numScore <= 100 && scoreDate) {
      setIsSubmitting(true)
      const { error: insertError } = await supabase.from('scores').insert({
        user_id: userId,
        score: numScore,
        date: scoreDate
      })

      if (!insertError) {
        setScore('')
        await fetchScores(userId)
      }
      setIsSubmitting(false)
    }
  }

  const chartData = [...scores].reverse().map(s => ({
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    pts: s.score
  }))

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 font-sans">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="text-neutral-500 font-medium">Syncing your impact data...</p>
    </div>
  )

  const isPremium = subscriptionStatus === 'active'

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-neutral-200 px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="text-2xl font-black tracking-tighter text-blue-900 flex items-center gap-2">
          <Target size={28} className="text-blue-600" />
          IMPACT<span className="text-blue-500">DRIVE</span>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:block text-right">
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Logged In As</p>
            <p className="text-sm font-bold text-neutral-800">{userEmail}</p>
          </div>
          <button onClick={handleSignOut} className="bg-neutral-100 p-2.5 rounded-xl text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          {/* Performance Analytics */}
          <section className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-neutral-100 relative overflow-hidden transition-all hover:shadow-md">
            {!isPremium && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                <div className="bg-blue-600 text-white p-4 rounded-2xl mb-6 shadow-xl rotate-3">
                  <Lock size={32} />
                </div>
                <h3 className="text-2xl font-black text-neutral-900 mb-3">Premium Performance Metrics</h3>
                <p className="text-neutral-500 mb-8 max-w-sm font-medium">Visual charts and historical tracking are reserved for our Premium members.</p>
                <button onClick={() => router.push('/subscribe')} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95">
                  UPGRADE TO UNLOCK
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Analytics Dashboard</h2>
                <p className="text-neutral-500 font-medium">Historical performance visualization</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                <TrendingUp size={28} />
              </div>
            </div>

            {isPremium && scores.length > 1 ? (
              <div className="h-[300px] w-full mb-10 bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12, fontWeight: 600}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12, fontWeight: 600}} dx={-10} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey="pts" stroke="#2563eb" strokeWidth={4} dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : isPremium && (
              <div className="bg-neutral-50 rounded-2xl py-20 text-center border-2 border-dashed border-neutral-200 mb-10">
                <p className="text-neutral-400 font-bold italic text-lg">Add at least 2 scores to generate your chart</p>
              </div>
            )}

            {/* Input Form with DARK FONT */}
            <form onSubmit={handleScoreSubmit} className="flex flex-col md:flex-row gap-4 mb-10 bg-neutral-100 p-3 rounded-2xl">
              <input
                type="number"
                disabled={!isPremium || isSubmitting}
                placeholder="Score"
                className="flex-1 md:flex-[0.3] bg-white border border-neutral-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none text-neutral-900 font-black placeholder-neutral-400 transition-all disabled:opacity-50"
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
              <input
                type="date"
                disabled={!isPremium || isSubmitting}
                className="flex-1 bg-white border border-neutral-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none text-neutral-900 font-black transition-all disabled:opacity-50"
                value={scoreDate}
                onChange={(e) => setScoreDate(e.target.value)}
              />
              <button 
                disabled={!isPremium || isSubmitting} 
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2 min-w-[160px]"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                Add Entry
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scores.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-neutral-100 hover:border-blue-300 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Activity size={16} />
                    </div>
                    <span className="text-neutral-400 font-bold text-xs uppercase tracking-tighter">{s.date}</span>
                  </div>
                  <span className="font-black text-blue-900 text-lg">{s.score} <span className="text-[10px] text-neutral-400">PTS</span></span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Charity Card */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-pink-100 p-4 rounded-2xl text-pink-600">
                <Heart size={28} />
              </div>
              <h2 className="text-xl font-black text-neutral-900 tracking-tight">Global Impact</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <p className="text-[10px] uppercase text-neutral-400 font-black mb-1 tracking-widest">Active Cause</p>
                <p className="text-sm font-bold text-neutral-800">Clean Water Initiative</p>
              </div>
              <div className="flex items-baseline gap-2 mt-6">
                <p className="text-5xl font-black text-pink-600">{isPremium ? '10%' : '0%'}</p>
                <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">Contribution</span>
              </div>
            </div>
          </section>

          {/* Membership Card */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600">
                <CreditCard size={28} />
              </div>
              <h2 className="text-xl font-black text-neutral-900 tracking-tight">Membership</h2>
            </div>
            
            {isPremium ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 shadow-md shadow-emerald-100">
                    <Crown size={12} /> Premium
                  </span>
                  <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest animate-pulse">● Active</span>
                </div>
                <div className="p-5 bg-neutral-900 rounded-2xl text-white shadow-xl">
                   <p className="text-[10px] uppercase text-neutral-500 font-black mb-2 tracking-widest">Prize Draw Date</p>
                   <div className="flex items-center justify-between">
                      <p className="text-lg font-black italic">APRIL 15</p>
                      <Trophy className="text-amber-400" size={24} />
                   </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-sm text-neutral-500 font-medium leading-relaxed text-center">Join 5,000+ players making a difference while they play.</p>
                <button onClick={() => router.push('/subscribe')} className="w-full bg-blue-600 text-white py-4 rounded-2xl text-sm font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                  UPGRADE NOW
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}