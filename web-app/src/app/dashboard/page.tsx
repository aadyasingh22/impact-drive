'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Heart, Trophy, Activity, CreditCard, LogOut, Plus, Target, Lock, Crown, TrendingUp } from 'lucide-react'
// PRD: Visualization - Import Chart components
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

  // PRD: Real-time validation - Fetch scores for premium users
  const fetchScores = async (uid: string) => {
    const { data, error } = await supabase
      .from('scores')
      .select('id, score, date')
      .eq('user_id', uid)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10) // Increased limit for better chart visualization

    if (data && !error) {
      setScores(data)
    }
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
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
    if (!userId || subscriptionStatus !== 'active') return
    
    const numScore = parseInt(score)
    if (numScore >= 1 && numScore <= 45 && scoreDate) {
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

  // Prepare data for Chart: Reverse to chronological order (oldest to newest)
  const chartData = [...scores].reverse().map(s => ({
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    pts: s.score
  }))

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-neutral-50 font-sans text-blue-600">Loading profile...</div>

  const isPremium = subscriptionStatus === 'active'

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <nav className="bg-white border-b border-neutral-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="text-xl font-bold tracking-tighter text-blue-900 flex items-center gap-2">
          <Target size={24} className="text-blue-600" />
          Impact<span className="text-blue-500">Drive</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-neutral-500">{userEmail}</span>
          <button onClick={handleSignOut} className="text-neutral-500 hover:text-red-600 transition-colors flex items-center gap-2 text-sm font-medium">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          {/* Performance Analytics & Tracking */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 relative overflow-hidden">
            {!isPremium && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-blue-600 text-white p-3 rounded-full mb-4 shadow-lg">
                  <Lock size={24} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Advanced Analytics Locked</h3>
                <p className="text-neutral-600 mb-6 max-w-sm">Upgrade to Premium to visualize your scoring trends and track every round.</p>
                <button onClick={() => router.push('/subscribe')} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                  Unlock Now
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Performance Trends</h2>
                <p className="text-neutral-500 mt-1">Stability scores over your last 10 rounds.</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <TrendingUp size={24} />
              </div>
            </div>

            {/* Visual Chart - PRD: Data Visualization */}
            {isPremium && scores.length > 1 && (
              <div className="h-[250px] w-full mb-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <YAxis domain={[0, 45]} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="pts" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <form onSubmit={handleScoreSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
              <input
                type="number"
                disabled={!isPremium}
                placeholder="Score"
                className="w-full sm:w-32 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
              <input
                type="date"
                disabled={!isPremium}
                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                value={scoreDate}
                onChange={(e) => setScoreDate(e.target.value)}
              />
              <button disabled={!isPremium} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
                Add Score
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scores.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100 hover:border-blue-200 transition-colors">
                  <span className="text-neutral-500 font-medium text-sm">{s.date}</span>
                  <span className="font-bold text-blue-900">{s.score} pts</span>
                </div>
              ))}
            </div>
          </section>

          {/* Monthly Draw Section */}
          <section className={`rounded-2xl p-8 shadow-lg text-white transition-all ${isPremium ? 'bg-gradient-to-br from-indigo-900 to-blue-900' : 'bg-neutral-200'}`}>
             <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${!isPremium && 'text-neutral-400'}`}>Monthly Draw Participation</h2>
              <Trophy size={28} className={isPremium ? "text-amber-400" : "text-neutral-300"} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <p className={`${isPremium ? 'text-blue-200' : 'text-neutral-400'} text-sm mb-1`}>Status</p>
                <p className={`text-xl font-semibold ${!isPremium && 'text-neutral-400'}`}>{isPremium ? 'Active Entry' : 'Subscription Required'}</p>
              </div>
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <p className={`${isPremium ? 'text-blue-200' : 'text-neutral-400'} text-sm mb-1`}>Winnings</p>
                <p className={`text-xl font-semibold ${!isPremium && 'text-neutral-400'}`}>$0.00</p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-pink-50 p-3 rounded-xl text-pink-600">
                <Heart size={24} />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">Charity Impact</h2>
            </div>
            <p className="text-sm text-neutral-500 mb-4">Supported Cause: <b>Global Education Fund</b></p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-pink-600">{isPremium ? '10%' : '0%'}</p>
              <span className="text-xs text-neutral-400 font-semibold uppercase">Contributed</span>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                <CreditCard size={24} />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">Membership</h2>
            </div>
            
            {isPremium ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                    <Crown size={12} /> Premium Member
                  </span>
                  <span className="text-neutral-400 text-xs font-medium italic">Active</span>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                   <p className="text-[10px] uppercase text-neutral-400 font-bold mb-1">Next Draw</p>
                   <p className="text-sm font-semibold text-neutral-700">April 15, 2026</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-neutral-500">Currently on Free Tier. Upgrade to participate in draws and track scores.</p>
                <button onClick={() => router.push('/subscribe')} className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-blue-100 hover:bg-blue-700 transition-all">
                  Join Premium
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}