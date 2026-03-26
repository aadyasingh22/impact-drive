'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Target, AlertCircle, Loader2 } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        // --- SIGN UP LOGIC ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        
        // After signup, we check if the user is the admin (unlikely for signup but good for logic)
        // Most new users go straight to /dashboard
        if (data.user?.email === 'aadya123@gmail.com') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      } else {
        // --- SIGN IN LOGIC ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error

        // Dynamic Routing: Admin vs. Standard User
        if (data.user?.email === 'aadya123@gmail.com') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-blue-600 drop-shadow-sm">
          <Target size={56} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-black text-neutral-900 tracking-tight uppercase">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-500 font-bold">
          {isSignUp ? 'Join the global impact club' : 'Sign in to manage your impact'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-2xl rounded-[2.5rem] border border-neutral-100 mx-4 sm:mx-0">
          <form className="space-y-6" onSubmit={handleAuth}>
            <div>
              <label htmlFor="email" className="block text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="mt-1.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="appearance-none block w-full px-5 py-4 border border-neutral-200 rounded-2xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 bg-white font-black transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="mt-1.5">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="appearance-none block w-full px-5 py-4 border border-neutral-200 rounded-2xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 bg-white font-black transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 p-4 border border-red-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-black text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-blue-100 text-base font-black text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} /> SYNCING...
                  </span>
                ) : (
                  isSignUp ? 'CREATE ACCOUNT' : 'SECURE SIGN IN'
                )}
              </button>
            </div>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
                <span className="px-3 bg-white text-neutral-400">
                  {isSignUp ? 'Already a member?' : 'New Player?'}
                </span>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError(null)
                }}
                className="text-sm font-black text-blue-600 hover:text-blue-800 transition-colors p-2 underline underline-offset-8 decoration-2 decoration-blue-100 hover:decoration-blue-600"
              >
                {isSignUp ? 'Log in instead' : 'Join ImpactDrive Now'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
            <Link href="/" className="group text-xs font-black text-neutral-400 hover:text-neutral-900 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Home
            </Link>
        </div>
      </div>
    </div>
  )
}