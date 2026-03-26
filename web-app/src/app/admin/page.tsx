'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  LayoutDashboard, Users, Trophy, Heart, Settings, LogOut,
  TrendingUp, DollarSign, Activity, Play, CheckCircle
} from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('draws')
  const [adminEmail, setAdminEmail] = useState<string | null>(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalScores, setTotalScores] = useState(0)
  
  const [drawNumbers, setDrawNumbers] = useState<number[]>([])
  const [isSimulating, setIsSimulating] = useState(false)
  const [results, setResults] = useState({ match5: 0, match4: 0, match3: 0 })
  const [prizePool, setPrizePool] = useState(1250) 

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setAdminEmail(session.user.email || 'Admin')
        fetchStats()
      }
    }
    checkAdmin()
  }, [router])

  const fetchStats = async () => {
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: scoreCount } = await supabase.from('scores').select('*', { count: 'exact', head: true })
    setTotalUsers(userCount || 0)
    setTotalScores(scoreCount || 0)
    setPrizePool((userCount || 0) * 5) 
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const runSimulation = async () => {
    setIsSimulating(true)
    
    const numbers = new Set<number>()
    while (numbers.size < 5) {
      numbers.add(Math.floor(Math.random() * 45) + 1)
    }
    const drawnArray = Array.from(numbers).sort((a, b) => a - b)
    setDrawNumbers(drawnArray)

    const { data: allScores } = await supabase.from('scores').select('user_id, score')
    
    if (allScores) {
      const userEntries: Record<string, number[]> = {}
      allScores.forEach(s => {
        if (!userEntries[s.user_id]) userEntries[s.user_id] = []
        userEntries[s.user_id].push(s.score)
      })

      let m5 = 0, m4 = 0, m3 = 0

      Object.values(userEntries).forEach(scores => {
        const matchCount = scores.filter(score => drawnArray.includes(score)).length
        if (matchCount === 5) m5++
        if (matchCount === 4) m4++
        if (matchCount === 3) m3++
      })

      setResults({ match5: m5, match4: m4, match3: m3 })
    }
    setIsSimulating(false)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Platform Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
                <div className="bg-blue-100 p-4 rounded-xl text-blue-600"><Users size={24} /></div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Total Users</p>
                  <p className="text-3xl font-bold text-neutral-900">{totalUsers}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
                <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600"><DollarSign size={24} /></div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Prize Pool (Est)</p>
                  <p className="text-3xl font-bold text-neutral-900">${prizePool}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
                <div className="bg-pink-100 p-4 rounded-xl text-pink-600"><Activity size={24} /></div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Scores Logged</p>
                  <p className="text-3xl font-bold text-neutral-900">{totalScores}</p>
                </div>
              </div>
            </div>
          </div>
        )
      case 'draws':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Draw Management</h2>
                  <p className="text-neutral-500 mt-1">Simulate draws and calculate prize distributions.</p>
                </div>
                <button 
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Play size={20} /> {isSimulating ? 'Running...' : 'Run Simulation'}
                </button>
              </div>

              {drawNumbers.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Drawn Numbers</h3>
                  <div className="flex gap-4">
                    {drawNumbers.map((num, i) => (
                      <div key={i} className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
                  <div className="flex justify-between items-start mb-4">
                    <p className="font-semibold text-neutral-900">5-Number Match</p>
                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-bold">Jackpot (40%)</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-900 mb-1">{results.match5} <span className="text-sm text-neutral-500 font-normal">winners</span></p>
                  <p className="text-emerald-600 font-medium">${(prizePool * 0.40).toFixed(2)} total</p>
                </div>

                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
                  <div className="flex justify-between items-start mb-4">
                    <p className="font-semibold text-neutral-900">4-Number Match</p>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">35% Pool</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-900 mb-1">{results.match4} <span className="text-sm text-neutral-500 font-normal">winners</span></p>
                  <p className="text-emerald-600 font-medium">${(prizePool * 0.35).toFixed(2)} total</p>
                </div>

                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
                  <div className="flex justify-between items-start mb-4">
                    <p className="font-semibold text-neutral-900">3-Number Match</p>
                    <span className="bg-neutral-200 text-neutral-700 text-xs px-2 py-1 rounded-full font-bold">25% Pool</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-900 mb-1">{results.match3} <span className="text-sm text-neutral-500 font-normal">winners</span></p>
                  <p className="text-emerald-600 font-medium">${(prizePool * 0.25).toFixed(2)} total</p>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex font-sans">
      <aside className="w-64 bg-neutral-900 text-white flex flex-col hidden md:flex fixed h-full z-20">
        <div className="p-6">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2 mb-8">
            <Settings size={24} className="text-blue-400" />
            Admin<span className="text-neutral-400">Panel</span>
          </div>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}><LayoutDashboard size={20} /> Overview</button>
            <button onClick={() => setActiveTab('draws')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'draws' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}><Trophy size={20} /> Draws & Prizes</button>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-neutral-800">
          <p className="text-xs text-neutral-500 truncate mb-4">{adminEmail}</p>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2 text-neutral-400 hover:text-white transition-colors"><LogOut size={20} /> Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-8">
        {renderContent()}
      </main>
    </div>
  )
}