"use client"

import React, { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ShieldCheck,
  Lock,
  Check,
  CreditCard,
  ArrowLeft,
  Sparkles,
  Zap,
  Loader2,
  CheckCircle2,
  HelpCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { authClient } from "@/lib/auth-client"

interface PlanOption {
  id: string
  name: string
  tagline: string
  price: number
  interval: "month" | "one-time" | "year"
  badge?: string
  features: string[]
}

const PLANS: PlanOption[] = [
  {
    id: "pro-seeker",
    name: "Seeker Pro Career Boost",
    tagline: "Accelerate your job search and stand out to top tech recruiters",
    price: 29,
    interval: "month",
    badge: "Most Popular",
    features: [
      "Priority Application Placement across all job posts",
      "Direct InMail messaging with hiring managers",
      "Instant interview alerts and live application tracking",
      "Full salary benchmarking and compensation insights",
      "Verified Pro Candidate badge on your profile",
    ],
  },
  {
    id: "featured-job",
    name: "Featured Job Listing",
    tagline: "Pin your job to the top of browse jobs for 30 days",
    price: 99,
    interval: "one-time",
    features: [
      "Pinned to top of search results for 30 days",
      "Promoted to 10,000+ active candidates via newsletter",
      "Company branding & direct application forwarding",
      "Dedicated candidate management dashboard",
    ],
  },
]

function PaymentContent() {
  const searchParams = useSearchParams()
  const initialPlanId = searchParams.get("plan") || "pro-seeker"

  const { data: session } = authClient.useSession()
  const user = session?.user

  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId)
  const [email, setEmail] = useState<string>(user?.email || "")
  const [name, setName] = useState<string>(user?.name || "")
  const [promoCode, setPromoCode] = useState<string>("")
  const [promoApplied, setPromoApplied] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const selectedPlan =
    PLANS.find((plan) => plan.id === selectedPlanId) || PLANS[0]

  const discountAmount = promoApplied ? 5 : 0
  const totalAmount = Math.max(0, selectedPlan.price - discountAmount)

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (promoCode.trim().toUpperCase() === "HIRE20" || promoCode.trim().toUpperCase() === "PROMO") {
      setPromoApplied(true)
    } else {
      alert("Invalid promotional code. Try 'HIRE20' for a $5 discount.")
    }
  }

  const handleProceedToStripe = async () => {
    setIsProcessing(true)

    try {
      // NOTE: When Stripe Checkout API is ready, call your backend endpoint here:
      // const res = await fetch("/api/checkout", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     planId: selectedPlan.id,
      //     email: email || user?.email,
      //     name: name || user?.name,
      //   }),
      // })
      // const { url } = await res.json()
      // window.location.href = url

      // Simulated redirect state for now:
      await new Promise((resolve) => setTimeout(resolve, 1500))
      alert(
        `[Stripe Checkout Demo]\n\nRedirecting to Stripe Checkout for "${selectedPlan.name}" ($${totalAmount}).\n\nStripe backend integration will be hooked up here!`
      )
    } catch (error) {
      console.error("Payment initiation error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#08090d] text-white px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/browse-job"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Browse Jobs</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit">
            <ShieldCheck className="h-4 w-4" />
            <span>256-bit SSL Encrypted & Secure</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Upgrade Your Experience
            </h1>
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-xs border-0">
              <Sparkles className="h-3 w-3 mr-1 fill-white" /> Pro
            </Badge>
          </div>
          <p className="text-sm text-zinc-400">
            Choose a plan to boost your career opportunities or promote high-impact job postings.
          </p>
        </div>

        {/* Main 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Plan Selection & Customer Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Plan Selector */}
            <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-5 sm:p-6 space-y-4">
              <h2 className="text-base font-semibold text-white">Select a Plan</h2>

              <div className="grid grid-cols-1 gap-3.5">
                {PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-white bg-[#141620] ring-1 ring-white/30"
                          : "border-zinc-800 bg-[#0e1017] hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-sm sm:text-base">
                              {plan.name}
                            </span>
                            {plan.badge && (
                              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {plan.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400">{plan.tagline}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-lg sm:text-xl font-bold text-white">
                            ${plan.price}
                          </span>
                          <span className="text-xs text-zinc-500">
                            /{plan.interval}
                          </span>
                        </div>
                      </div>

                      {/* Feature list preview */}
                      {isSelected && (
                        <div className="mt-4 pt-3.5 border-t border-zinc-800/80 space-y-2">
                          {plan.features.map((feat, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs text-zinc-300"
                            >
                              <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 2. Customer Information */}
            <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-5 sm:p-6 space-y-4">
              <h2 className="text-base font-semibold text-white">Account Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cust-name" className="text-xs text-zinc-400">
                    Full Name
                  </Label>
                  <Input
                    id="cust-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="border-zinc-800 bg-[#12131b] text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:border-zinc-600 h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cust-email" className="text-xs text-zinc-400">
                    Email Address
                  </Label>
                  <Input
                    id="cust-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="border-zinc-800 bg-[#12131b] text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:border-zinc-600 h-10"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method Notice */}
            <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-zinc-400" />
                  Payment via Stripe
                </span>
                <span className="text-xs text-zinc-500">Credit Card, Apple Pay, Google Pay</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Clicking &quot;Pay with Stripe&quot; will securely transfer you to Stripe Checkout. No payment details are stored on our servers.
              </p>
            </div>
          </div>

          {/* Right Column: Order Summary & Pay Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-6 space-y-6">
              <h2 className="text-base sm:text-lg font-semibold text-white">
                Order Summary
              </h2>

              {/* Selected Plan Details */}
              <div className="flex items-center justify-between py-3 border-b border-zinc-800/80">
                <div>
                  <p className="text-sm font-medium text-white">
                    {selectedPlan.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Billed {selectedPlan.interval === "one-time" ? "once" : selectedPlan.interval}
                  </p>
                </div>
                <span className="text-sm font-semibold text-white">
                  ${selectedPlan.price.toFixed(2)}
                </span>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <Label htmlFor="promo-code" className="text-xs text-zinc-400">
                  Promotional Code
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="promo-code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter HIRE20"
                    disabled={promoApplied}
                    className="border-zinc-800 bg-[#12131b] text-sm text-zinc-200 uppercase placeholder:normal-case placeholder:text-zinc-600 h-9"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={promoApplied || !promoCode}
                    className="h-9 px-3 rounded-lg border-zinc-800 bg-[#12131b] text-xs font-medium text-zinc-300 hover:text-white shrink-0"
                  >
                    {promoApplied ? "Applied" : "Apply"}
                  </Button>
                </div>
                {promoApplied && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="h-3 w-3" />
                    $5.00 promotional discount applied!
                  </p>
                )}
              </form>

              {/* Pricing Breakdown */}
              <div className="space-y-2.5 pt-2 border-t border-zinc-800/80 text-sm">
                <div className="flex items-center justify-between text-zinc-400 text-xs">
                  <span>Subtotal</span>
                  <span>${selectedPlan.price.toFixed(2)}</span>
                </div>

                {promoApplied && (
                  <div className="flex items-center justify-between text-emerald-400 text-xs">
                    <span>Discount (HIRE20)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-zinc-400 text-xs">
                  <span>Processing & Platform Fees</span>
                  <span className="text-emerald-400">FREE ($0.00)</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-base font-bold text-white">
                  <span>Total Due Today</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Pay Button */}
              <Button
                type="button"
                onClick={handleProceedToStripe}
                disabled={isProcessing}
                className="w-full h-12 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                    <span>Connecting to Stripe...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Pay ${totalAmount.toFixed(2)} with Stripe</span>
                  </>
                )}
              </Button>

              {/* Security & Guarantees */}
              <div className="space-y-2 pt-2 text-[11px] text-zinc-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span>Encrypted Stripe checkout with bank-level security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span>Instant plan activation upon successful payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span>Cancel anytime with 1 click from your dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#08090d] flex items-center justify-center text-zinc-400 text-sm">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500 mr-2" />
          Loading checkout...
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  )
}
