'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Target, AlertCircle, Loader2 } from 'lucide-react'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      
      // Role-Based Routing
      if (data.user?.email === 'aadya123@gmail.com') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
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
          Create Account
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-500 font-bold">
          Join the global impact club today
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-2xl rounded-[2.5rem] border border-neutral-100 mx-4 sm:mx-0">
          <form className="space-y-6" onSubmit={handleSignup}>
            <div>
              <label htmlFor="email" className="block text-xs font-black text-neutral-400 uppercase tracking-widest ml-1 text-left">
                Email Address
              </label>
              <div className="mt-1.5">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="appearance-none block w-full px-5 py-4 border border-neutral-200 rounded-2xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-900 bg-white font-black transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-black text-neutral-400 uppercase tracking-widest ml-1 text-left">
                Password
              </label>
              <div className="mt-1.5">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="appearance-none block w-full px-5 py-4 border border-neutral-200 rounded-2xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-900 bg-white font-black transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 p-4 border border-red-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                  <div className="ml-3 text-left">
                    <p className="text-sm font-black text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-blue-100 text-base font-black text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'JOIN IMPACTDRIVE'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <span className="text-xs uppercase font-black tracking-widest text-neutral-400">
              Already a member?{' '}
              <Link href="/signin" className="text-blue-600 hover:underline underline-offset-8 decoration-2 ml-1">
                Log in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}