"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Download, Inbox } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getApplications } from "@/lib/actions/jobs"
import { authClient } from "@/lib/auth-client"
import type { JobApplication, ApplicationStatus } from "@/types/applications"

// Converts an ISO date string (from MongoDB appliedAt) into a human readable relative time
function formatTimeAgo(dateString?: string): string {
  if (!dateString) return "Recently"
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`
    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`
  } catch {
    return dateString
  }
}

function getStatusBadgeConfig(status?: ApplicationStatus | string) {
  const normalized = status?.toLowerCase() || ""

  switch (normalized) {
    case "review":
    case "under review":
      return {
        label: "Review",
        className: "border-amber-500/50 bg-amber-500/10 text-amber-400",
      }
    case "shortlisted":
      return {
        label: "Shortlisted",
        className: "border-blue-500/50 bg-blue-500/10 text-blue-400",
      }
    case "interview":
    case "interview scheduled":
      return {
        label: "Interview",
        className: "border-purple-500/50 bg-purple-500/10 text-purple-400",
      }
    case "accepted":
    case "offered":
      return {
        label: "Accepted",
        className: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
      }
    case "applied":
    case "submitted":
    default:
      return {
        label: "Applied",
        className: "border-zinc-700/80 bg-zinc-800/40 text-zinc-300",
      }
  }
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[] | null>(null)
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active")

  // Client-side session from Better Auth
  const { data: session, isPending } = authClient.useSession()
  const userId = session?.user?.id

  useEffect(() => {
    if (!userId) return

    let isMounted = true

    // Query send userID /applications?userId=...
    getApplications(`applicantId=${userId}`)
      .then((data) => {
        if (isMounted) {
          setApplications(Array.isArray(data) ? data : [])
        }
      })
      .catch((error) => {
        console.error("Failed to load applications:", error)
        if (isMounted) {
          setApplications([])
        }
      })

    return () => {
      isMounted = false
    }
  }, [userId])

  // Derived loading state without cascading render issues
  const isLoading = isPending || (Boolean(userId) && applications === null)
  const appList = applications ?? []

  // Calculate dynamic statistics based on real applications loaded from database
  const totalApplied = appList.length
  const shortlisted = appList.filter(
    (app) => app.status?.toLowerCase() === "shortlisted"
  ).length
  const interviews = appList.filter((app) =>
    ["interview", "interview scheduled"].includes(app.status?.toLowerCase() || "")
  ).length
  const successRate =
    totalApplied > 0 ? `${Math.round(((shortlisted + interviews) / totalApplied) * 100)}%` : "0%"

  return (
    <div className="min-h-screen w-full bg-[#08090d] text-white p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* 1. Header Section */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            My Applications
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Track your job applications and interview progress in real-time.
          </p>
        </div>

        {/* Right Controls: Active/Archived pill & Export PDF */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Active / Archived Toggle */}
          <div className="inline-flex items-center rounded-xl border border-zinc-800 bg-[#0e1017] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("active")}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "active"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("archived")}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "archived"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Archived
            </button>
          </div>

          {/* Export PDF Button */}
          <Button
            type="button"
            className="h-9 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-medium text-xs sm:text-sm flex items-center gap-2 border-0 cursor-pointer transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </Button>
        </div>
      </header>

      {/* 2. Key Metrics Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applied */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-5 sm:p-6 flex flex-col justify-between">
          <span className="text-xs font-medium text-zinc-400">Total Applied</span>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-3">
            {totalApplied}
          </p>
        </div>

        {/* Shortlisted */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-5 sm:p-6 flex flex-col justify-between">
          <span className="text-xs font-medium text-zinc-400">Shortlisted</span>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-3">
            {shortlisted}
          </p>
        </div>

        {/* Interviews */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-5 sm:p-6 flex flex-col justify-between">
          <span className="text-xs font-medium text-zinc-400">Interviews</span>
          <p className="text-2xl sm:text-3xl font-bold text-amber-500 mt-3">
            {interviews}
          </p>
        </div>

        {/* Success Rate */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-5 sm:p-6 flex flex-col justify-between">
          <span className="text-xs font-medium text-zinc-400">Success Rate</span>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-3">
            {successRate}
          </p>
        </div>
      </section>

      {/* 3. Applications Table */}
      <section className="rounded-2xl border border-zinc-800/80 bg-[#0d0e14] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/80 text-[11px] font-semibold text-zinc-500 tracking-wider">
                <th scope="col" className="py-4 px-6">
                  Job Title
                </th>
                <th scope="col" className="py-4 px-6">
                  Company
                </th>
                <th scope="col" className="py-4 px-6">
                  Applied
                </th>
                <th scope="col" className="py-4 px-6">
                  Status
                </th>
                <th scope="col" className="py-4 px-6 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {isLoading ? (
                // Loading Skeleton Rows
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="h-9 w-9 rounded-lg bg-zinc-800/60" />
                        <div className="space-y-2">
                          <div className="h-4 w-36 bg-zinc-800/60 rounded" />
                          <div className="h-3 w-24 bg-zinc-800/40 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-28 bg-zinc-800/50 rounded" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-20 bg-zinc-800/50 rounded" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-6 w-16 bg-zinc-800/50 rounded-full" />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="h-4 w-12 bg-zinc-800/50 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : appList.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-[#12131b] text-zinc-400">
                        <Inbox className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium text-zinc-300">
                        No applications found
                      </p>
                      <p className="text-xs text-zinc-500 max-w-sm">
                        You haven&apos;t submitted any job applications yet. Browse jobs to discover opportunities.
                      </p>
                      <Button
                        render={<Link href="/browse-job" />}
                        className="mt-2 h-9 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs border-0"
                      >
                        Browse Jobs
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                appList.map((application) => {
                  const initial = (application.companyName || "C").trim().charAt(0).toUpperCase()
                  const badge = getStatusBadgeConfig(application.status)
                  const subtitle = [application.jobType, application.location].filter(Boolean).join(" • ")

                  return (
                    <tr
                      key={application._id || application.jobId}
                      className="hover:bg-zinc-900/40 transition-colors group"
                    >
                      {/* Job Title & Subtitle */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-700/60 bg-zinc-800/70 text-sm font-semibold text-zinc-300">
                            {initial}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white group-hover:text-zinc-200 transition-colors">
                              {application.jobTitle}
                            </p>
                            {subtitle && (
                              <p className="text-xs text-zinc-500 mt-0.5">
                                {subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="py-4 px-6 text-sm text-zinc-300 font-normal">
                        {application.companyName}
                      </td>

                      {/* Applied Date (dynamically formatted from ISO date string) */}
                      <td className="py-4 px-6 text-sm text-zinc-400">
                        {formatTimeAgo(application.appliedAt)}
                      </td>

                      {/* Status Pill Badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block text-xs font-medium px-3 py-1 rounded-full border ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/browse-job/${application.jobId}`}
                          className="text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
