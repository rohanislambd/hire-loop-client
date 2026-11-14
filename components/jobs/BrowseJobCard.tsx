import React from "react"
import {
  Banknote,
  Bookmark,
  Clock,
  Tag,
  Zap,
} from "lucide-react"

import { formatCompensation, getDeptConfig } from "@/lib/job-utils"
import { cn } from "@/lib/utils"
import type { JobPostItem } from "@/types/jobs"

interface BrowseJobCardProps {
  job: JobPostItem
}

export function BrowseJobCard({ job }: BrowseJobCardProps) {
  const dept = job.department || job.category || "Engineering"
  const deptConfig = getDeptConfig(dept)
  const Icon = deptConfig.icon

  const compensation = formatCompensation(
    job.minSalary,
    job.maxSalary,
    job.frequency,
    job.currency
  )

  return (
    <article className="group rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-5 transition-colors hover:border-zinc-700/80">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          {/* Department / Category Icon */}
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border",
              deptConfig.iconClass
            )}
          >
            <Icon className="h-5 w-5" />
          </div>

          {/* Title & Subtitle */}
          <div className="min-w-0 space-y-1">
            <h2 className="text-base sm:text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors truncate">
              {job.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 truncate">
              <span>{job.company}</span>
              <span className="mx-1.5 text-zinc-600">•</span>
              <span>
                {job.location}
                {job.isRemote ? " (Remote)" : ""}
              </span>
            </p>
          </div>
        </div>

        {/* Bookmark Button */}
        <button
          type="button"
          aria-label={`Bookmark ${job.title}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-800/70 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <Bookmark className="h-4 w-4" />
        </button>
      </div>

      {/* Metadata Pills */}
      <div className="mt-4 flex flex-wrap items-center gap-2 sm:pl-16">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-[#12131b] px-2.5 py-1 text-xs font-medium text-zinc-300">
          <Banknote className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
          <span>{compensation}</span>
        </span>

        {job.jobType && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-[#12131b] px-2.5 py-1 text-xs font-medium text-zinc-300 capitalize">
            <Clock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span>{job.jobType}</span>
          </span>
        )}

        {job.category && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-[#12131b] px-2.5 py-1 text-xs font-medium text-zinc-300">
            <Tag className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span>{job.category}</span>
          </span>
        )}

        {job.isRemote && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
            <Zap className="h-3.5 w-3.5 shrink-0" />
            <span>Remote Friendly</span>
          </span>
        )}
      </div>
    </article>
  )
}
