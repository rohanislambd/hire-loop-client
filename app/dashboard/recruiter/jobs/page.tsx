"use client"

import React from "react"
import Link from "next/link"
import {
  ChevronRight,
  Code2,
  Globe,
  MapPin,
  Megaphone,
  MoreVertical,
  Palette,
  Pencil,
  Plus,
  ShieldCheck,
  Terminal,
  Trash2,
  Users,
} from "lucide-react"

import type { JobData } from "@/app/dashboard/recruiter/jobs/new/page"
import { cn } from "@/lib/utils"

export interface JobPostItem extends JobData {
  id: string
  department: string
  currency?: string
  applicantsCount: number
  status: "Active" | "Expired" | "Draft"
  postedAt: string
}

const DUMMY_JOBS: JobPostItem[] = [
  {
    id: "job-1",
    title: "Frontend Developer",
    department: "Engineering",
    category: "Engineering & Tech",
    company: "HirePulse Network",
    location: "New York, USA",
    isRemote: true,
    jobType: "Full-time",
    minSalary: "25",
    maxSalary: "40",
    frequency: "per hour",
    currency: "€",
    applicantsCount: 34,
    status: "Active",
    deadline: "2025-05-30",
    postedAt: "Posted 4d ago",
    responsibilities:
      "Develop responsive and accessible web applications using Next.js and Tailwind CSS.",
    qualifications:
      "3+ years of experience with React, TypeScript, and modern component systems.",
  },
  {
    id: "job-2",
    title: "Senior Product Designer",
    department: "Design",
    category: "Product & Design",
    company: "HirePulse Labs",
    location: "London, UK (Hybrid)",
    isRemote: false,
    jobType: "Full-time",
    minSalary: "90k",
    maxSalary: "115k",
    frequency: "per year",
    currency: "€",
    applicantsCount: 19,
    status: "Active",
    deadline: "2025-06-14",
    postedAt: "Posted 1w ago",
    responsibilities:
      "Lead product design initiatives, establish unified design tokens, and conduct user research.",
    qualifications:
      "5+ years product design experience with proven portfolio in SaaS products.",
  },
  {
    id: "job-3",
    title: "DevOps Specialist",
    department: "Infrastructure",
    category: "Engineering & Tech",
    company: "HirePulse Platform",
    location: "Berlin, Germany",
    isRemote: false,
    jobType: "Full-time",
    minSalary: "95k",
    maxSalary: "120k",
    frequency: "per year",
    currency: "€",
    applicantsCount: 12,
    status: "Active",
    deadline: "2025-06-30",
    postedAt: "Posted 2w ago",
    responsibilities:
      "Maintain multi-region Kubernetes clusters, CI/CD pipelines, and infrastructure observability.",
    qualifications:
      "Proficiency with Docker, Kubernetes, Terraform, and cloud-native monitoring systems.",
  },
  {
    id: "job-4",
    title: "Product Marketing Lead",
    department: "Marketing",
    category: "Marketing & Growth",
    company: "HirePulse Network",
    location: "EU/US",
    isRemote: true,
    jobType: "Full-time",
    minSalary: "80k",
    maxSalary: "105k",
    frequency: "per year",
    currency: "€",
    applicantsCount: 27,
    status: "Active",
    deadline: "2025-07-15",
    postedAt: "Posted 5d ago",
    responsibilities:
      "Drive go-to-market strategies, product messaging, launch campaigns, and user acquisition.",
    qualifications:
      "Proven track record in B2B growth marketing and data-driven product storytelling.",
  },
  {
    id: "job-5",
    title: "QA Automation Engineer",
    department: "Quality",
    category: "Engineering & Tech",
    company: "HirePulse Platform",
    location: "Dublin, Ireland (Hybrid)",
    isRemote: false,
    jobType: "Part-time",
    minSalary: "35",
    maxSalary: "50",
    frequency: "per hour",
    currency: "€",
    applicantsCount: 8,
    status: "Expired",
    deadline: "2025-05-01",
    postedAt: "Closed",
    responsibilities:
      "Design end-to-end automated testing pipelines, regression testing, and quality metrics.",
    qualifications:
      "Strong coding abilities with Playwright, Cypress, Jest, and continuous testing workflows.",
  },
]

const DEPARTMENT_CONFIGS: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>
    iconClass: string
    textClass: string
  }
> = {
  Engineering: {
    icon: Code2,
    iconClass: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    textClass: "text-blue-400",
  },
  Design: {
    icon: Palette,
    iconClass: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    textClass: "text-amber-400",
  },
  Infrastructure: {
    icon: Terminal,
    iconClass: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
    textClass: "text-cyan-400",
  },
  Marketing: {
    icon: Megaphone,
    iconClass: "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-400",
    textClass: "text-fuchsia-400",
  },
  Quality: {
    icon: ShieldCheck,
    iconClass: "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
    textClass: "text-indigo-400",
  },
}

function formatCompensation(
  min: string,
  max: string,
  frequency: string,
  currency = "€"
) {
  const freqLower = frequency.toLowerCase()
  let freqShort = "mo"
  if (freqLower.includes("hour")) freqShort = "hr"
  else if (freqLower.includes("year")) freqShort = "yr"

  const formatVal = (v: string) => {
    if (v.toLowerCase().endsWith("k")) return `${currency}${v}`
    const num = Number(v)
    if (!isNaN(num) && num >= 1000) {
      return `${currency}${num / 1000}k`
    }
    return `${currency}${v}`
  }

  return `${formatVal(min)} - ${formatVal(max)} / ${freqShort}`
}

function formatDeadline(deadlineStr: string) {
  try {
    const d = new Date(deadlineStr)
    if (isNaN(d.getTime())) return deadlineStr
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  } catch {
    return deadlineStr
  }
}

export default function ManageJobsPage() {
  return (
    <div className="min-h-screen w-full bg-[#090a0f] text-white px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium"
            >
              <span>Manage Jobs</span>
              <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
              <span className="text-[#8c84fc]">Job Listings & Postings</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Manage Job Posts
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Review live listings, monitor applicants, and update job details across your organization.
            </p>
          </div>

          <Link
            href="/dashboard/recruiter/jobs/new"
            className="self-start sm:self-center inline-flex items-center gap-2 rounded-xl bg-[#5d63f6] hover:bg-[#4d53e8] px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-[#5d63f6]/30 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Job Post</span>
          </Link>
        </div>

        {/* Responsive Table Container */}
        <div className="w-full rounded-2xl border border-zinc-800/80 bg-[#0d0e15] shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/80 bg-[#12131b]/70 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  <th className="px-5 py-4">Job Title & Dept</th>
                  <th className="px-5 py-4">Company & Location</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Compensation</th>
                  <th className="px-5 py-4">Applicants</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Deadline</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-sm">
                {DUMMY_JOBS.map((job) => {
                  const deptConfig =
                    DEPARTMENT_CONFIGS[job.department] ??
                    DEPARTMENT_CONFIGS.Engineering
                  const Icon = deptConfig.icon

                  return (
                    <tr
                      key={job.id}
                      className="group hover:bg-[#151622]/50 transition-colors"
                    >
                      {/* Job Title & Dept */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                              deptConfig.iconClass
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
                              {job.title}
                            </div>
                            <div
                              className={cn(
                                "text-xs font-medium mt-0.5",
                                deptConfig.textClass
                              )}
                            >
                              {job.department}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Company & Location */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-zinc-200">
                          {job.company}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-400">
                          {job.isRemote ? (
                            <>
                              <Globe className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                              <span>Remote ({job.location})</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                              <span>{job.location}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-lg border border-zinc-800 bg-[#13141f] px-2.5 py-1 text-xs font-medium text-zinc-300">
                          {job.jobType}
                        </span>
                      </td>

                      {/* Compensation */}
                      <td className="px-5 py-4 font-medium text-zinc-200 whitespace-nowrap">
                        {formatCompensation(
                          job.minSalary,
                          job.maxSalary,
                          job.frequency,
                          job.currency
                        )}
                      </td>

                      {/* Applicants */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#8c84fc] whitespace-nowrap">
                          <Users className="h-4 w-4 shrink-0 text-[#8c84fc]" />
                          <span>{job.applicantsCount} Candidates</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {job.status === "Active" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                            Expired
                          </span>
                        )}
                      </td>

                      {/* Deadline */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-medium text-zinc-200">
                          {formatDeadline(job.deadline)}
                        </div>
                        <div className="mt-0.5 text-xs text-zinc-500">
                          {job.postedAt}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/recruiter/jobs/${job.id}/edit`}
                            className="flex items-center gap-1.5 rounded-lg border border-[#5d63f6]/40 bg-[#5d63f6]/10 px-3 py-1.5 text-xs font-medium text-[#a5b4fc] hover:bg-[#5d63f6]/20 transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Update</span>
                          </Link>
                          <button
                            type="button"
                            title="Delete job listing"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-[#12131a] text-zinc-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            title="More options"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-[#12131a] text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
