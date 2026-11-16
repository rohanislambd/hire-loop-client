"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Users,
  Search,
  ChevronRight,
  ArrowLeft,
  Mail,
  Eye,
  Briefcase,
  MapPin,
  ExternalLink,
  ChevronDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import type { JobApplication, ApplicationStatus } from "@/types/applications"
import type { JobPostItem } from "@/types/jobs"
import { cn } from "@/lib/utils"

const RECRUITER_STATUSES: ApplicationStatus[] = [
  "Submitted",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Offered",
  "Rejected",
]

function getStatusBadgeClass(status?: ApplicationStatus | string) {
  const normalized = status?.toLowerCase() || ""

  switch (normalized) {
    case "under review":
    case "review":
      return "border-amber-500/40 bg-amber-500/10 text-amber-400"
    case "shortlisted":
      return "border-blue-500/40 bg-blue-500/10 text-blue-400"
    case "interview scheduled":
    case "interview":
      return "border-purple-500/40 bg-purple-500/10 text-purple-400"
    case "offered":
    case "accepted":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
    case "rejected":
      return "border-red-500/40 bg-red-500/10 text-red-400"
    case "submitted":
    case "applied":
    default:
      return "border-zinc-700 bg-zinc-800/50 text-zinc-300"
  }
}

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return "Recently"
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  } catch {
    return dateString
  }
}

interface JobApplicationsTableProps {
  initialApplications: JobApplication[]
  job: JobPostItem | null
  jobId: string
}

export function JobApplicationsTable({
  initialApplications,
  job,
  jobId,
}: JobApplicationsTableProps) {
  const [applications, setApplications] = useState<JobApplication[]>(initialApplications)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [selectedApplicant, setSelectedApplicant] = useState<JobApplication | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Handle local status update with instant UI feedback
  const handleStatusChange = (appId: string | undefined, newStatus: ApplicationStatus) => {
    if (!appId) return

    setApplications((prev) =>
      prev.map((app) =>
        (app._id || app.jobId) === appId ? { ...app, status: newStatus } : app
      )
    )

    if (selectedApplicant && (selectedApplicant._id || selectedApplicant.jobId) === appId) {
      setSelectedApplicant((prev) => (prev ? { ...prev, status: newStatus } : null))
    }

    toast.add({
      title: "Status Updated",
      description: `Applicant status set to "${newStatus}"`,
      type: "success",
    })

    // TODO: Connect database status update PATCH/POST API here later
  }

  // Filtered applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      (app.userName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.jobTitle || "").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "All" ||
      app.status?.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Quick KPI counts
  const totalCount = applications.length
  const underReviewCount = applications.filter(
    (a) => a.status === "Under Review" || a.status === "Review"
  ).length
  const shortlistedCount = applications.filter((a) => a.status === "Shortlisted").length
  const interviewCount = applications.filter(
    (a) => a.status === "Interview Scheduled" || a.status === "Interview"
  ).length
  const offeredCount = applications.filter(
    (a) => a.status === "Offered" || a.status === "Accepted"
  ).length

  return (
    <div className="min-h-screen w-full bg-[#08090d] text-white p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* 1. Header & Navigation */}
      <div className="space-y-4">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400 font-medium"
        >
          <Link
            href="/dashboard/recruiter/jobs"
            className="hover:text-zinc-200 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Manage Jobs</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
          <span className="text-zinc-300 truncate max-w-[180px] sm:max-w-xs">
            {job?.title || "Job Details"}
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
          <span className="text-[#8c84fc]">Applicant Review</span>
        </nav>

        {/* Job Title Banner */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-zinc-800/80 bg-[#0d0e15] p-5 sm:p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {job?.title || "Candidate Applications"}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Active Listing
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-zinc-400 flex-wrap pt-1">
              {job?.company && (
                <span className="flex items-center gap-1 text-zinc-300 font-medium">
                  <Briefcase className="h-3.5 w-3.5 text-zinc-500" />
                  {job.company}
                </span>
              )}
              {job?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  {job.location} {job.isRemote && "(Remote)"}
                </span>
              )}
              {job?.jobType && (
                <span className="rounded-md bg-[#13141f] border border-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300 font-medium">
                  {job.jobType}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/browse-job/${jobId}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-[#12131b] hover:bg-zinc-800 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white px-3.5 py-2 transition-colors cursor-pointer"
            >
              <span>View Job Post</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Candidate Metrics Row */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="rounded-xl border border-zinc-800/80 bg-[#0d0e15] p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-zinc-400">Total Applicants</span>
          <p className="text-2xl font-bold text-white mt-2">{totalCount}</p>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-[#0d0e15] p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-zinc-400">Under Review</span>
          <p className="text-2xl font-bold text-amber-400 mt-2">{underReviewCount}</p>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-[#0d0e15] p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-zinc-400">Shortlisted</span>
          <p className="text-2xl font-bold text-blue-400 mt-2">{shortlistedCount}</p>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-[#0d0e15] p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-zinc-400">Interviews</span>
          <p className="text-2xl font-bold text-purple-400 mt-2">{interviewCount}</p>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-[#0d0e15] p-4 flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-xs font-medium text-zinc-400">Offered</span>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{offeredCount}</p>
        </div>
      </section>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name or email..."
            aria-label="Search candidates"
            className="w-full rounded-xl border border-zinc-800/80 bg-[#0e1017] pl-9 pr-4 py-2 text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {["All", "Submitted", "Under Review", "Shortlisted", "Interview Scheduled", "Offered", "Rejected"].map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer",
                  statusFilter === status
                    ? "bg-[#5d63f6] text-white shadow-sm"
                    : "bg-[#0e1017] border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                )}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* 4. Applications Table */}
      <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0e15] shadow-xl overflow-hidden">
        {filteredApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-[#12131b] text-zinc-400">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-zinc-200">
              No Applications Found
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-sm">
              {searchQuery || statusFilter !== "All"
                ? "No candidates match your current search criteria or status filter."
                : "No candidate applications have been submitted for this job yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/80 bg-[#12131b]/70 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  <th scope="col" className="py-4 px-6">
                    Candidate
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Applied
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Current Status
                  </th>
                  <th scope="col" className="py-4 px-6">
                    Update Status
                  </th>
                  <th scope="col" className="py-4 px-6 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-sm">
                {filteredApplications.map((app) => {
                  const appId = app._id || app.jobId
                  const candidateName = app.userName || "Candidate"
                  const initial = candidateName.charAt(0).toUpperCase()

                  return (
                    <tr
                      key={appId}
                      className="hover:bg-[#151622]/50 transition-colors group"
                    >
                      {/* Candidate Name & Contact */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-700/60 bg-gradient-to-br from-zinc-800 to-zinc-900 text-sm font-semibold text-zinc-200 shadow-inner">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-white group-hover:text-zinc-100 transition-colors">
                              {candidateName}
                            </p>
                            <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                              <Mail className="h-3 w-3 text-zinc-500" />
                              <span className="truncate max-w-[200px]">{app.email}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Applied Date */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-xs text-zinc-300 font-medium">
                          {formatTimeAgo(app.appliedAt)}
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border",
                            getStatusBadgeClass(app.status)
                          )}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                          <span>{app.status}</span>
                        </span>
                      </td>

                      {/* Update Status Selector */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="relative inline-block w-44">
                          <select
                            value={app.status}
                            onChange={(e) =>
                              handleStatusChange(appId, e.target.value as ApplicationStatus)
                            }
                            aria-label={`Change status for ${candidateName}`}
                            className="w-full appearance-none rounded-xl border border-zinc-800 bg-[#12131b] px-3 py-1.5 pr-8 text-xs font-medium text-zinc-200 hover:border-zinc-700 focus:outline-none focus:border-[#5d63f6] transition-colors cursor-pointer"
                          >
                            {RECRUITER_STATUSES.map((st) => (
                              <option key={st} value={st} className="bg-[#12131b] text-white">
                                {st}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedApplicant(app)
                            setIsModalOpen(true)
                          }}
                          className="h-8 rounded-lg border-zinc-800 bg-[#12131b] hover:bg-zinc-800 text-xs font-medium text-zinc-300 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Review</span>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Candidate Review Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md border-zinc-800 bg-[#0d0e15] text-white p-6 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center justify-between">
              <span>Candidate Details</span>
              {selectedApplicant && (
                <span
                  className={cn(
                    "text-xs px-2.5 py-0.5 rounded-full border font-medium",
                    getStatusBadgeClass(selectedApplicant.status)
                  )}
                >
                  {selectedApplicant.status}
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Review applicant details and update application review status.
            </DialogDescription>
          </DialogHeader>

          {selectedApplicant && (
            <div className="space-y-4 pt-2">
              {/* Profile Box */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-zinc-800 bg-[#12131b]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-700/60 bg-zinc-800 text-base font-bold text-white">
                  {(selectedApplicant.userName || "C").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-white text-base">
                    {selectedApplicant.userName || "Candidate"}
                  </h4>
                  <a
                    href={`mailto:${selectedApplicant.email}`}
                    className="text-xs text-[#8c84fc] hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Mail className="h-3 w-3" />
                    <span>{selectedApplicant.email}</span>
                  </a>
                </div>
              </div>

              {/* Application Details Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-xl border border-zinc-800 bg-[#12131b] p-3">
                  <span className="text-zinc-500 uppercase text-[10px] font-semibold block">
                    Applied Position
                  </span>
                  <span className="font-medium text-zinc-200 mt-1 block truncate">
                    {selectedApplicant.jobTitle}
                  </span>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-[#12131b] p-3">
                  <span className="text-zinc-500 uppercase text-[10px] font-semibold block">
                    Submission Date
                  </span>
                  <span className="font-medium text-zinc-200 mt-1 block">
                    {new Date(selectedApplicant.appliedAt).toLocaleDateString()}
                  </span>
                </div>

                {selectedApplicant.salaryRange && (
                  <div className="rounded-xl border border-zinc-800 bg-[#12131b] p-3 col-span-2">
                    <span className="text-zinc-500 uppercase text-[10px] font-semibold block">
                      Salary Range
                    </span>
                    <span className="font-medium text-zinc-200 mt-1 block">
                      {selectedApplicant.salaryRange}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Update Select inside Dialog */}
              <div className="space-y-1.5 pt-1">
                <label
                  htmlFor="modal-status-select"
                  className="text-xs font-semibold text-zinc-400 block"
                >
                  Change Application Status:
                </label>
                <div className="relative">
                  <select
                    id="modal-status-select"
                    value={selectedApplicant.status}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedApplicant._id || selectedApplicant.jobId,
                        e.target.value as ApplicationStatus
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-zinc-800 bg-[#12131b] px-3.5 py-2 pr-8 text-xs font-medium text-zinc-200 hover:border-zinc-700 focus:outline-none focus:border-[#5d63f6] transition-colors cursor-pointer"
                  >
                    {RECRUITER_STATUSES.map((st) => (
                      <option key={st} value={st} className="bg-[#12131b] text-white">
                        {st}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-zinc-800">
                <a
                  href={`mailto:${selectedApplicant.email}`}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-white text-zinc-950 font-semibold text-xs py-2.5 hover:bg-zinc-200 transition-colors shadow-md"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Send Email</span>
                </a>

                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border-zinc-800 bg-[#12131b] hover:bg-zinc-800 text-zinc-300 text-xs py-2.5 px-4"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
