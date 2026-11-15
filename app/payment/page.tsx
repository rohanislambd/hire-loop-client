import React from "react"
import Link from "next/link"
import {
  ShieldCheck,
  Lock,
  Check,
  ArrowLeft,
  Sparkles,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>
}) {
  const { canceled } = await searchParams

  if (canceled) {
    console.log(
      "Order canceled -- continue to shop around and check out when you're ready."
    )
  }
  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-[#08090d] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/browse-job"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Browse Jobs</span>
          </Link>
        </div>

        {/* Main Simple Payment Card */}
        <div className="space-y-6 rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-6 shadow-2xl sm:p-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Secure Stripe Checkout</span>
            </div>

            <h1 className="flex items-center justify-center gap-2 text-2xl font-bold tracking-tight text-white">
              <span>HireLoop Pro Access</span>
              <Sparkles className="h-4 w-4 fill-amber-400 text-amber-400" />
            </h1>

            <p className="text-xs text-zinc-400 sm:text-sm">
              Unlock priority application placement and connect directly with
              hiring managers.
            </p>
          </div>

          {/* Price Box */}
          <div className="space-y-1 rounded-xl border border-zinc-800 bg-[#12131b] p-5 text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-extrabold tracking-tight text-white">
                $29.00
              </span>
              <span className="text-xs font-medium text-zinc-500">USD</span>
            </div>
            <p className="text-xs text-zinc-400">
              One-time payment • Instant activation
            </p>
          </div>

          {/* Key Benefits */}
          <div className="space-y-2.5 pt-1 text-xs text-zinc-300 sm:text-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span>Priority placement on all job applications</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span>Direct messaging with verified employers</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span>Real-time status tracking & interview alerts</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span>Full salary benchmarking & insights</span>
            </div>
          </div>

          {/* Pay Button */}
          <div className="pt-2">
            <form action="/api/checkout_sessions" method="POST">
                 <Button type="submit" className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-white text-sm font-semibold text-zinc-950 shadow-lg transition-all hover:bg-zinc-200 sm:text-base">
              <Lock className="h-4 w-4" />
              <span>Pay $29.00 with Stripe</span>
            </Button>
            </form>
         
          </div>

          {/* Security & Guarantees */}
          <div className="space-y-2 border-t border-zinc-800/80 pt-2 text-center text-[11px] text-zinc-500">
            <div className="flex items-center justify-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-zinc-400" />
              <span>Processed securely through Stripe</span>
            </div>
            <p>
              Your payment information is encrypted with 256-bit SSL security.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
