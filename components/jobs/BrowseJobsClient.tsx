"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Briefcase, Search, SlidersHorizontal } from "lucide-react"

import { BrowseJobCard } from "@/components/jobs/BrowseJobCard"
import {
  type FilterOption,
  JobFilterGroup,
} from "@/components/jobs/JobFilterGroup"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  type JobPostItem,
} from "@/types/jobs"

interface BrowseJobsClientProps {
  jobs: JobPostItem[]
}

type FilterKey = "jobType" | "category"

export function BrowseJobsClient({ jobs }: BrowseJobsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  )
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Derive filters directly from URL search params (no redundant effect or state)
  const filters: Record<FilterKey, string> = {
    jobType: searchParams.get("jobType") || "",
    category: searchParams.get("category") || "",
  }

  const jobTypeOptions: FilterOption[] = JOB_TYPES.map((type) => ({
    label: type,
    value: type,
  }))

  const categoryOptions: FilterOption[] = JOB_CATEGORIES.map((category) => ({
    label: category,
    value: category,
  }))

  const isRemote = searchParams.get("isRemote") === "true"

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = (formData.get("searchField") as string)?.trim() || ""

    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }

    router.push(`/browse-job?${params.toString()}`)
  }

  const handleFilterChange = (key: FilterKey, value: string) => {
    const isSelected = filters[key] === value
    const newValue = isSelected ? "" : value

    const params = new URLSearchParams(searchParams.toString())
    if (newValue) {
      params.set(key, newValue)
    } else {
      params.delete(key)
    }

    router.push(`/browse-job?${params.toString()}`)
  }

  const handleRemoteChange = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    if (checked) {
      params.set("isRemote", "true")
    } else {
      params.delete("isRemote")
    }

    router.push(`/browse-job?${params.toString()}`)
  }

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("jobType")
    params.delete("category")
    params.delete("isRemote")
    router.push(`/browse-job?${params.toString()}`)
  }

  return (
    <div className="min-h-screen w-full bg-[#090a0f] text-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Search Bar */}
        <form
          onSubmit={handleSearch}
          className="rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-4 sm:p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-zinc-800/80 bg-[#12131a] px-3.5 py-2.5 transition-colors focus-within:border-zinc-700">
              <Search className="h-4 w-4 text-zinc-500 shrink-0" />
              <input
                type="text"
                name="searchField"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search by job title, keywords..."
                aria-label="Search jobs"
                className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 outline-none"
              />
            </div>

            <Button
              type="submit"
              className="h-11 px-6 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-sm border-0 cursor-pointer shrink-0"
            >
              Search Jobs
            </Button>
          </div>
        </form>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between lg:hidden">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMobileFilters((prev) => !prev)}
            className="rounded-xl border-zinc-800 bg-[#0d0e14] text-zinc-200 hover:bg-[#12131b] hover:text-white gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>{showMobileFilters ? "Hide Filters" : "Show Filters"}</span>
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Left Filter Sidebar */}
          <aside
            className={cn(
              "lg:col-span-3 rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-5 space-y-6",
              showMobileFilters ? "block" : "hidden lg:block"
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Filters</h2>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>

            <div className="space-y-6 divide-y divide-zinc-800/60">
              <JobFilterGroup
                idPrefix="job-type"
                title="Job Type"
                options={jobTypeOptions}
                selectedValue={filters.jobType}
                onSelect={(value) => handleFilterChange("jobType", value)}
              />

              <div className="pt-5">
                <JobFilterGroup
                  idPrefix="category"
                  title="Category"
                  options={categoryOptions}
                  selectedValue={filters.category}
                  onSelect={(value) => handleFilterChange("category", value)}
                />
              </div>

              <div className="pt-5 space-y-3">
                <h3 className="text-xs font-semibold tracking-wide text-zinc-300">
                  Work Mode
                </h3>
                <label
                  htmlFor="filter-remote-only"
                  className="flex items-center gap-2.5 cursor-pointer select-none group"
                >
                  <Checkbox
                    id="filter-remote-only"
                    checked={isRemote}
                    onCheckedChange={(checked) =>
                      handleRemoteChange(Boolean(checked))
                    }
                    className="border-zinc-700 bg-[#12131a] data-checked:bg-white data-checked:border-white data-checked:text-zinc-950"
                  />
                  <span className="text-xs sm:text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    Remote Only
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Job Listings Column */}
          <main className="lg:col-span-9 space-y-4">
            {/* Results Count Bar */}
            <div className="flex items-center justify-between">
              <h1 className="text-base sm:text-lg font-semibold text-white">
                Found {jobs.length} Professional Jobs
              </h1>
            </div>

            {/* Job Cards */}
            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-[#12131b] text-zinc-400 mb-4">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h2 className="text-base font-semibold text-zinc-200">
                  No matching jobs found
                </h2>
                <p className="mt-1 max-w-sm text-xs sm:text-sm text-zinc-400">
                  Try adjusting your search keywords or filters to discover more opportunities.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <BrowseJobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
