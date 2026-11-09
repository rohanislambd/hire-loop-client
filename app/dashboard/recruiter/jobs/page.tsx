import React from "react"
import Link from "next/link"
import {
  Briefcase,
  ChevronRight,
  MoreVertical,
  Pencil,
  Plus,
  Users,
} from "lucide-react"

import { DeleteJobsDialog } from "@/app/components/DeleteJobsdialog"
import { JobLocationBadge, JobStatusBadge } from "@/components/jobs/JobBadges"
import { getJobs } from "@/lib/api/jobs"
import {
  formatCompensation,
  formatDeadline,
  getDeptConfig,
} from "@/lib/job-utils"
import { cn } from "@/lib/utils"
import { type JobPostItem } from "@/types/jobs"

// Re-export for backward compatibility
export type { JobPostItem }

export default async function ManageJobsPage() {
  const jobs: JobPostItem[] = await getJobs()

  return (
    <div className="min-h-screen w-full bg-[#090a0f] text-white px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-8xl space-y-6 sm:space-y-8">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium"
            >
              <span className="hover:text-zinc-300 transition-colors">
                Manage Jobs
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
              <span className="text-[#8c84fc]">Job Listings & Postings</span>
            </nav>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Manage Job Posts
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Review live listings, monitor applicants, and update job details across your organization.
            </p>
          </div>

          <Link
            href="/dashboard/recruiter/jobs/new"
            className="self-start sm:self-center inline-flex items-center gap-2 rounded-xl bg-[#5d63f6] hover:bg-[#4d53e8] px-4 py-2.5 text-xs sm:text-sm font-medium text-white shadow-md shadow-[#5d63f6]/30 transition-all cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>New Job Post</span>
          </Link>
        </div>

        {/* Empty State */}
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-[#0d0e15] p-8 sm:p-12 text-center shadow-xl">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-[#12131b] text-zinc-500 mb-4">
              <Briefcase className="h-6 w-6 text-zinc-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-zinc-200">
              No Job Posts Yet
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-sm">
              You haven&apos;t created any job listings yet. Create your first listing to start receiving candidate applications.
            </p>
            <Link
              href="/dashboard/recruiter/jobs/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5d63f6] hover:bg-[#4d53e8] px-4 py-2.5 text-xs sm:text-sm font-medium text-white shadow-md shadow-[#5d63f6]/30 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Post a New Job</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile / Tablet Card View (< lg screens) */}
            <div className="space-y-3.5 lg:hidden">
              {jobs.map((job) => {
                const dept = job.department || job.category || "Engineering"
                const deptConfig = getDeptConfig(dept)
                const Icon = deptConfig.icon

                return (
                  <div
                    key={job._id}
                    className="rounded-2xl border border-zinc-800/80 bg-[#0d0e15] p-4 sm:p-5 space-y-3.5 shadow-md"
                  >
                    {/* Header: Icon + Title & Department + Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                            deptConfig.iconClass
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-zinc-100 text-sm truncate">
                            {job.title}
                          </h3>
                          <p
                            className={cn(
                              "text-xs font-medium mt-0.5",
                              deptConfig.textClass
                            )}
                          >
                            {dept}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <JobStatusBadge status={job.status} />
                      </div>
                    </div>

                    {/* Company & Location */}
                    <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 border-t border-zinc-800/60">
                      <span className="font-medium text-zinc-200">
                        {job.company}
                      </span>
                      <JobLocationBadge
                        isRemote={job.isRemote}
                        location={job.location}
                      />
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="rounded-xl bg-[#12131b] border border-zinc-800/60 p-2.5">
                        <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
                          Compensation
                        </span>
                        <span className="font-medium text-zinc-200 mt-0.5 block truncate">
                          {formatCompensation(
                            job.minSalary,
                            job.maxSalary,
                            job.frequency,
                            job.currency
                          )}
                        </span>
                      </div>

                      <div className="rounded-xl bg-[#12131b] border border-zinc-800/60 p-2.5">
                        <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
                          Applicants
                        </span>
                        <span className="font-medium text-[#8c84fc] mt-0.5 flex items-center gap-1 truncate">
                          <Users className="h-3.5 w-3.5 shrink-0" />
                          <span>{job.applicantsCount ?? 0} Candidates</span>
                        </span>
                      </div>

                      <div className="rounded-xl bg-[#12131b] border border-zinc-800/60 p-2.5">
                        <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
                          Job Type
                        </span>
                        <span className="font-medium text-zinc-300 mt-0.5 block truncate">
                          {job.jobType || "Full-time"}
                        </span>
                      </div>

                      <div className="rounded-xl bg-[#12131b] border border-zinc-800/60 p-2.5">
                        <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
                          Deadline
                        </span>
                        <span className="font-medium text-zinc-200 mt-0.5 block truncate">
                          {formatDeadline(job.deadline)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/60">
                      <Link
                        href={`/dashboard/recruiter/jobs/${job._id}/edit`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#5d63f6]/40 bg-[#5d63f6]/10 py-2 text-xs font-medium text-[#a5b4fc] hover:bg-[#5d63f6]/20 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Update Listing</span>
                      </Link>

                      <DeleteJobsDialog job={job} />

                      <button
                        type="button"
                        title="More options"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-[#12131a] text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200 transition-colors cursor-pointer shrink-0"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Desktop Table View (>= lg screens) */}
            <div className="hidden lg:block w-full rounded-2xl border border-zinc-800/80 bg-[#0d0e15] shadow-2xl overflow-hidden">
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
                    {jobs.map((job) => {
                      const dept =
                        job.department || job.category || "Engineering"
                      const deptConfig = getDeptConfig(dept)
                      const Icon = deptConfig.icon

                      return (
                        <tr
                          key={job._id}
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
                              <div className="min-w-0 max-w-[200px]">
                                <div className="font-semibold text-zinc-100 group-hover:text-white transition-colors truncate">
                                  {job.title}
                                </div>
                                <div
                                  className={cn(
                                    "text-xs font-medium mt-0.5 truncate",
                                    deptConfig.textClass
                                  )}
                                >
                                  {dept}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Company & Location */}
                          <td className="px-5 py-4">
                            <div className="font-medium text-zinc-200 truncate max-w-[170px]">
                              {job.company}
                            </div>
                            <JobLocationBadge
                              isRemote={job.isRemote}
                              location={job.location}
                              className="mt-0.5 max-w-[170px]"
                            />
                          </td>

                          {/* Type */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center rounded-lg border border-zinc-800 bg-[#13141f] px-2.5 py-1 text-xs font-medium text-zinc-300">
                              {job.jobType || "Full-time"}
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
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#8c84fc]">
                              <Users className="h-4 w-4 shrink-0 text-[#8c84fc]" />
                              <span>{job.applicantsCount ?? 0} Candidates</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <JobStatusBadge status={job.status} />
                          </td>

                          {/* Deadline */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="font-medium text-zinc-200">
                              {formatDeadline(job.deadline)}
                            </div>
                            <div className="mt-0.5 text-xs text-zinc-500">
                              {job.postedAt || "Recently"}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/dashboard/recruiter/jobs/${job._id}/edit`}
                                className="flex items-center gap-1.5 rounded-lg border border-[#5d63f6]/40 bg-[#5d63f6]/10 px-3 py-1.5 text-xs font-medium text-[#a5b4fc] hover:bg-[#5d63f6]/20 transition-colors"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                <span>Update</span>
                              </Link>

                              <DeleteJobsDialog job={job} />

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
          </>
        )}
      </div>
    </div>
  )
}
