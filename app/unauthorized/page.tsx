import React from "react"
import Link from "next/link"
import {
  ShieldAlert,
  LayoutDashboard,
  Home,
  User,
  LogIn,
  Lock,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { getSessionFromServer } from "@/lib/core/serversession"

export default async function UnauthorizedPage() {
  const session = await getSessionFromServer()
  const user = session?.user
  const currentRole = user?.role || "seeker"
  const formattedRole =
    currentRole.charAt(0).toUpperCase() + currentRole.slice(1)
  const dashboardUrl = user ? `/dashboard/${currentRole}` : "/sign-in"

  return (
    <div className="min-h-screen w-full bg-[#08090d] text-white flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Main Unauthorized Card */}
        <div className="relative rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden">
          {/* Subtle Top Glow Accent */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-40 w-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Icon & Title */}
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-inner">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                <span>403 • Access Restricted</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Unauthorized Access
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto">
                You do not have the required permissions or assigned role to view this dashboard section.
              </p>
            </div>
          </div>

          {/* Account Context Box */}
          <div className="rounded-xl border border-zinc-800 bg-[#12131b] p-5 space-y-3.5 text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-zinc-500" />
                Account Status
              </span>
              <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-semibold px-2 py-0.5">
                Restricted
              </Badge>
            </div>

            {user ? (
              <div className="space-y-3">
                {/* User Row */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-zinc-400">Signed In As</span>
                  <span className="font-medium text-white truncate max-w-[200px]">
                    {user.name || user.email}
                  </span>
                </div>

                {/* Email Row */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-zinc-400">Account Email</span>
                  <span className="font-mono text-xs text-zinc-300 truncate max-w-[200px]">
                    {user.email}
                  </span>
                </div>

                {/* Current Role Row */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-xs sm:text-sm">
                  <span className="text-zinc-400">Current Role</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium text-purple-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    <span>{formattedRole}</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-2 text-xs text-zinc-400 space-y-1">
                <p>You are not currently signed in.</p>
                <p className="text-zinc-500">
                  Please log in with an authorized account to continue.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {user ? (
              <Link
                href={dashboardUrl}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold px-4 py-2.5 text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Go to My Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold px-4 py-2.5 text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In to Continue</span>
              </Link>
            )}

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-[#12131b] hover:bg-zinc-800 hover:text-white text-zinc-300 font-medium px-4 py-2.5 text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Help note */}
          <div className="text-center pt-1 border-t border-zinc-800/60">
            <p className="text-[11px] text-zinc-500">
              Need access or believe this is a mistake? Please contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
