import React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  CheckCircle2,
  Receipt,
  ArrowRight,
  Briefcase,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { checkoutVerify } from "@/lib/actions/payment"
import { stripe } from "@/lib/stripe"

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ session_id?: string }>
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { session_id } = await searchParams

  if (!session_id) {
    return redirect("/payment")
  }

  // Retrieve Stripe checkout session with expanded payment intent
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  })

  const { status, customer_email, payment_intent, payment_status } = session

  if (status === "open") {
    return redirect("/")
  }

  if (status !== "complete" || payment_status !== "paid") {
    return redirect("/payment")
  }

  // Verify payment on backend database
  try {
    await checkoutVerify(session_id)
  } catch (error) {
    console.error("Payment verification error:", error)
  }

  // Extract transaction ID from payment_intent
  const transactionId =
    typeof payment_intent === "string"
      ? payment_intent
      : payment_intent?.id || session_id

  // Extract amount
  const amountPaid =
    typeof payment_intent === "object" && payment_intent?.amount
      ? (payment_intent.amount / 100).toFixed(2)
      : session.amount_total
      ? (session.amount_total / 100).toFixed(2)
      : "29.00"

  const currency =
    (typeof payment_intent === "object" && payment_intent?.currency
      ? payment_intent.currency.toUpperCase()
      : session.currency
      ? session.currency.toUpperCase()
      : "USD")

  // Extract formatted date
  const paymentTimestamp =
    typeof payment_intent === "object" && payment_intent?.created
      ? payment_intent.created * 1000
      : session.created * 1000

  const formattedDate = new Date(paymentTimestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const customerEmail =
    customer_email || session.customer_details?.email || "your registered email"

  return (
    <div className="min-h-screen w-full bg-[#08090d] text-white flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Main Success Receipt Card */}
        <div className="relative rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden">
          {/* Subtle Top Glow Accent */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-36 w-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Success Icon & Header */}
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-inner">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <Sparkles className="h-3 w-3 fill-emerald-400" />
                <span>Payment Confirmed</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Payment Successful!
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                Thank you for your purchase. Your HireLoop Pro access is now active.
              </p>
            </div>
          </div>

          {/* Transaction & Order Summary Box */}
          <div className="rounded-xl border border-zinc-800 bg-[#12131b] p-5 space-y-3.5 text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Receipt className="h-3.5 w-3.5 text-zinc-500" />
                Receipt Summary
              </span>
              <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold px-2 py-0.5">
                Paid Successfully
              </Badge>
            </div>

            {/* Transaction ID */}
            <div className="space-y-1">
              <span className="text-xs text-zinc-400">Transaction ID (Payment Intent)</span>
              <p className="font-mono text-xs sm:text-sm text-zinc-200 bg-[#0a0b10] border border-zinc-800 px-3 py-2 rounded-lg break-all select-all">
                {transactionId}
              </p>
            </div>

            {/* Plan / Item */}
            <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
              <span className="text-zinc-400">Purchased Plan</span>
              <span className="font-medium text-white">HireLoop Pro Membership</span>
            </div>

            {/* Amount Paid */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-zinc-400">Amount Paid</span>
              <span className="font-bold text-white text-base">
                ${amountPaid} <span className="text-xs font-normal text-zinc-400">{currency}</span>
              </span>
            </div>

            {/* Payment Date */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-zinc-400">Date & Time</span>
              <span className="text-zinc-300">{formattedDate}</span>
            </div>

            {/* Customer Email */}
            <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-zinc-800/80">
              <span className="text-zinc-400">Billed to</span>
              <span className="text-zinc-300 font-medium truncate max-w-[200px]">
                {customerEmail}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <Link href="/browse-job" className="block w-full">
              <Button className="w-full h-11 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all border-0">
                <Briefcase className="h-4 w-4" />
                <span>Browse & Apply to Jobs</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/dashboard/seeker/applications" className="block w-full">
              <Button
                variant="outline"
                className="w-full h-11 rounded-xl border-zinc-800 bg-[#12131b] hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Go to Applications Dashboard</span>
              </Button>
            </Link>
          </div>

          {/* Security & Support Note */}
          <div className="pt-2 border-t border-zinc-800/80 text-center space-y-1.5 text-[11px] text-zinc-500">
            <div className="flex items-center justify-center gap-1.5 text-zinc-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Verified Stripe Transaction</span>
            </div>
            <p>
              A confirmation email has been sent to{" "}
              <span className="text-zinc-400">{customerEmail}</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
