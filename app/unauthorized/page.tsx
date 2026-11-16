import React from "react"
import Link from "next/link"
import {
  ShieldAlert,
  LayoutDashboard,
  LogIn,
  Home,
  UserCheck,
} from "lucide-react"
import { getSessionFromServer } from "@/lib/core/serversession"

export default async function UnauthorizedPage() {
  const session = await getSessionFromServer()
  const user = session?.user
  const currentRole = user?.role || "seeker"
  const userDashboardUrl = user ? `/dashboard/${currentRole}` : "/sign-in"

  return (
    <div className="min-h-screen w-full bg-[#08090d] text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background soft ambient radial glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] bg-[#5d63f6]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-6">
        {/* Shield Alert Icon with glowing ring */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10 text-red-400 shadow-xl shadow-red-500/10 ring-8 ring-red-500/5">
          <ShieldAlert className="h-10 w-10 text-red-400" />
        </div>

        {/* 403 Badge & Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            <span>403 Error • Access Denied</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Unauthorized Access
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            You do not have the required permissions or assigned role to view this dashboard section.
          </p>
        </div>

        {/* Account & Role Context Card */}
        {user ? (
          <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0e15] p-4 text-left shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-zinc-800/60 pb-3">
              <span className="text-zinc-400 font-medium">Signed In As</span>
              <span className="inline-flex items-center gap-1 font-semibold text-zinc-200">
                <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="truncate max-w-[180px]">{user.name || user.email}</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Your Current Role</span>
              <span className="capitalize font-semibold text-[#8c84fc] bg-[#5d63f6]/10 border border-[#5d63f6]/20 px-2.5 py-0.5 rounded-lg">
                {currentRole}
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0e15] p-4 text-center text-xs text-zinc-400">
            You are not currently signed in. Please log in with an authorized account to continue.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {user ? (
            <Link
              href={userDashboardUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Go to My Dashboard ({currentRole})</span>
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold px-5 py-2.5 text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In with Proper Account</span>
            </Link>
          )}

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-[#12131b] hover:bg-zinc-800 hover:text-white text-zinc-300 font-medium px-4 py-2.5 text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Small Footnote */}
        <p className="text-[11px] text-zinc-500 pt-2">
          Need access or believe this is a mistake? Contact your team administrator or support.
        </p>
      </div>
    </div>
  )
}
