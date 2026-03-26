import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initializing without a hardcoded apiVersion to avoid TypeScript mismatches
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { plan } = body

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `ImpactDrive ${plan === 'yearly' ? 'Yearly' : 'Monthly'} Subscription`,
              description: 'Premium performance tracking, monthly draw entry, and 10% charity contribution.',
            },
            unit_amount: plan === 'yearly' ? 9600 : 1000, // $96.00 or $10.00 in cents
            recurring: {
              interval: plan === 'yearly' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      // Redirect back to dashboard on success, or pricing on cancel
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/subscribe`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe Session Error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}