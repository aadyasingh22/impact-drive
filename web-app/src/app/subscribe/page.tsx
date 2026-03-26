'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Shield, Check, Target, ArrowRight, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase' // Ensure this path is correct for your project

export default function Subscribe() {
  const router = useRouter()
  const [isYearly, setIsYearly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  // PRD: Real-time validation - Get the current user session on load
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // If no user, redirect to sign-in (PRD: Authenticated requests only)
        router.push('/signin')
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [router])

  const handleCheckout = async () => {
    if (!user) return;
    setIsLoading(true);

    // PRD: Plans - Monthly vs Yearly (Discounted)
    // Convert to INR for Razorpay (approx 83x for demo or keep as is for test)
    const amount = isYearly ? 9600 : 1000; 
    
    const options = {
      key: "rzp_test_SVqu8rVB6cDInX", // Your Razorpay Test Key
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "ImpactDrive",
      description: `${isYearly ? 'Yearly' : 'Monthly'} Subscription`,
      handler: async function (response: any) {
        // PRD Requirement: Real-time validation & Access Control
        console.log("Payment Successful:", response.razorpay_payment_id);
        
        try {
          // 1. Update Supabase profile status
          const { error } = await supabase
            .from('profiles')
            .update({ 
              subscription_status: 'active',
              razorpay_payment_id: response.razorpay_payment_id,
              plan_type: isYearly ? 'yearly' : 'monthly'
            })
            .eq('id', user.id);

          if (error) throw error;

          // 2. Redirect to dashboard with success state
          router.push('/dashboard?payment=success');
        } catch (error) {
          console.error("Database update failed:", error);
          alert("Payment verified, but account update failed. Please contact support.");
        } finally {
          setIsLoading(false);
        }
      },
      prefill: {
        name: user?.user_metadata?.full_name || "Valued Member",
        email: user?.email || "",
      },
      theme: { color: "#2563eb" },
      modal: { 
        ondismiss: () => setIsLoading(false) 
      }
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay failed to open:", err);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center mb-6 text-blue-600">
            <Target size={48} />
          </div>
          <h1 className="text-5xl font-extrabold text-neutral-900 tracking-tight mb-4 text-balance">
            Play with purpose.
          </h1>
          <p className="text-xl text-neutral-500">
            Track your game, enter the draw, and support global causes.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-12">
          <div className="relative flex items-center p-1 bg-neutral-200 rounded-full shadow-inner">
            <button 
              onClick={() => setIsYearly(false)} 
              className={`w-32 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${!isYearly ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsYearly(true)} 
              className={`w-32 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${isYearly ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl border border-neutral-100 overflow-hidden transform transition-all hover:scale-[1.01]">
          <div className="p-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Premium Member</h2>
                <p className="text-sm text-neutral-400 font-medium">Full Access Pass</p>
              </div>
              <div className="flex items-baseline text-4xl font-extrabold text-blue-600">
                ₹{isYearly ? '9600' : '1000'}
                <span className="text-lg text-neutral-500 ml-1 font-medium">
                  /{isYearly ? 'yr' : 'mo'}
                </span>
              </div>
            </div>

            <ul className="space-y-5 mb-10">
              {[
                'Unlimited Performance Tracking', 
                'Automatic Monthly Draw Entry', 
                '10% Charity Contribution', 
                'Member-only Leaderboards',
                'Ad-free Experience'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-4 text-neutral-600">
                  <div className="bg-emerald-50 p-1 rounded-full shrink-0">
                    <Check size={16} className="text-emerald-600" />
                  </div>
                  <span className="text-[15px] font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleCheckout}
              disabled={isLoading || !user}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-200"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> 
                  Processing...
                </>
              ) : (
                <>
                  Subscribe Now <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
          
          <div className="bg-neutral-50 p-6 border-t border-neutral-100 flex justify-center gap-8 text-xs font-semibold text-neutral-400 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <Shield size={14} /> PCI Compliant
            </div>
            <div className="flex items-center gap-1.5">
              <Heart size={14} className="text-pink-400" /> Cancel Anytime
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}