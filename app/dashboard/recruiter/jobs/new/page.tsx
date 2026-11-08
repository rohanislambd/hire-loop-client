"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Globe,
  MapPin,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { createJobs } from "@/lib/actions/jobs"

export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const
export type JobType = (typeof JOB_TYPES)[number]

export const JOB_CATEGORIES = [
  "Engineering & Tech",
  "Product & Design",
  "Marketing & Growth",
  "Operations & Finance",
  "Sales & Business",
]

export const SALARY_FREQUENCIES = ["per hour", "per month", "per year"]

export interface JobData {
  _id?: string
  title: string
  company: string
  category: string
  jobType: JobType | ""
  isRemote: boolean
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  frequency: string
  responsibilities: string
  qualifications: string
}

export default function PostNewJobPage() {
  const [jobTitle, setJobTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [category, setCategory] = useState("")
  const [jobType, setJobType] = useState<JobType | "">("")

  const [isRemote, setIsRemote] = useState(false)
  const [location, setLocation] = useState("")
  const [deadline, setDeadline] = useState("")
  const [minSalary, setMinSalary] = useState("")
  const [maxSalary, setMaxSalary] = useState("")

  const [frequency, setFrequency] = useState("")

  const [responsibilities, setResponsibilities] = useState("")
  const [qualifications, setQualifications] = useState("")

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    const jobData: JobData = {
      title: jobTitle,
      company: companyName,
      category,
      jobType,
      isRemote,
      location,
      deadline,
      minSalary,
      maxSalary,
      frequency,
      responsibilities,
      qualifications,
    }
    const result = await createJobs(jobData)
    console.log("Job created successfully:", result)
  }

  return (
    <div className="min-h-screen w-full bg-[#090a0f] text-white px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Top Header & Breadcrumb */}
        <div className="space-y-1">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium"
          >
            <Link
              href="/dashboard/recruiter/jobs"
              className="hover:text-zinc-200 transition-colors"
            >
              Manage Jobs
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
            <span className="text-[#8c84fc]">Create New Listing</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Post a New Job
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Fill in the position specifications to attract qualified talent across our network.
          </p>
        </div>

        <form onSubmit={handlePublish} className="space-y-8">
          {/* SECTION 1: Basic Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#5d63f6]" />
              <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
                1. Basic Information
              </h2>
            </div>

            <div className="space-y-4">
              {/* Job Title */}
              <div className="space-y-1.5">
                <label
                  htmlFor="jobTitle"
                  className="text-xs font-medium text-zinc-300"
                >
                  Job Title <span className="text-[#8c84fc]">*</span>
                </label>
                <div className="rounded-xl border border-zinc-800/80 bg-[#12131a] px-4 py-2.5 transition-colors focus-within:border-zinc-700">
                  <input
                    id="jobTitle"
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
                  />
                </div>
              </div>

              {/* Company Name & Job Category */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Company Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="companyName"
                    className="text-xs font-medium text-zinc-300"
                  >
                    Company Name <span className="text-[#8c84fc]">*</span>
                  </label>
                  <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800/80 bg-[#12131a] px-3.5 py-2.5 transition-colors focus-within:border-zinc-700">
                    <Building2 className="h-4 w-4 text-zinc-500 shrink-0" />
                    <input
                      id="companyName"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Company Name"
                      className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
                    />
                  </div>
                </div>

                {/* Job Category */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="jobCategory"
                    className="text-xs font-medium text-zinc-300"
                  >
                    Job Category <span className="text-[#8c84fc]">*</span>
                  </label>
                  <div className="relative flex items-center rounded-xl border border-zinc-800/80 bg-[#12131a] px-3.5 py-2.5 transition-colors focus-within:border-zinc-700">
                    <select
                      id="jobCategory"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={cn(
                        "w-full appearance-none bg-transparent text-sm outline-none pr-6 cursor-pointer",
                        !category ? "text-zinc-500" : "text-zinc-200"
                      )}
                    >
                      <option value="" disabled className="bg-[#12131a] text-zinc-500">
                        Select Job Category
                      </option>
                      {JOB_CATEGORIES.map((cat) => (
                        <option
                          key={cat}
                          value={cat}
                          className="bg-[#12131a] text-zinc-200"
                        >
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 h-4 w-4 text-zinc-500" />
                  </div>
                </div>
              </div>

              {/* Job Type Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Job Type <span className="text-[#8c84fc]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {JOB_TYPES.map((type) => {
                    const isSelected = jobType === type
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setJobType(type)}
                        className={cn(
                          "flex h-10 items-center justify-center rounded-xl border text-xs font-medium transition cursor-pointer select-none",
                          isSelected
                            ? "border-[#5d63f6]/60 bg-[#18192a] text-white shadow-sm ring-1 ring-[#5d63f6]/30"
                            : "border-zinc-800/80 bg-[#12131a] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                        )}
                      >
                        {type}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Location, Compensation & Timeline */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#5d63f6]" />
              <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
                2. Location, Compensation & Timeline
              </h2>
            </div>

            <div className="space-y-4">
              {/* Remote Work Allowed Switch Banner */}
              <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-[#12131a] p-4 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-zinc-200">
                      Remote Work Allowed (isRemote)
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Enable worldwide or distributed candidate applications
                    </p>
                  </div>
                </div>

                <Switch
                  checked={isRemote}
                  onCheckedChange={setIsRemote}
                  className="data-checked:bg-[#5d63f6]"
                />
              </div>

              {/* Location & Application Deadline */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Location */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="jobLocation"
                      className="text-xs font-medium text-zinc-300"
                    >
                      Job Location (location)
                    </label>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      Required
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800/80 bg-[#12131a] px-3.5 py-2.5 transition-colors focus-within:border-zinc-700">
                    <MapPin className="h-4 w-4 text-zinc-500 shrink-0" />
                    <input
                      id="jobLocation"
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. New York, USA"
                      className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
                    />
                  </div>
                </div>

                {/* Application Deadline */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="applicationDeadline"
                    className="text-xs font-medium text-zinc-300"
                  >
                    Application Deadline (deadline)
                  </label>
                  <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800/80 bg-[#12131a] px-3.5 py-2.5 transition-colors focus-within:border-zinc-700">
                    <Calendar className="h-4 w-4 text-zinc-500 shrink-0" />
                    <input
                      id="applicationDeadline"
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full bg-transparent text-sm text-zinc-200 outline-none [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {/* Salary & Frequency */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Min Salary */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="minSalary"
                    className="text-xs font-medium text-zinc-300"
                  >
                    Min Salary / Rate
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-zinc-800/80 bg-[#12131a] px-3.5 py-2.5 transition-colors focus-within:border-zinc-700">
                  
                    <input
                      id="minSalary"
                      type="number"
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                      placeholder="e.g. 25"
                      className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
                    />
                  </div>
                </div>

                {/* Max Salary */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="maxSalary"
                    className="text-xs font-medium text-zinc-300"
                  >
                    Max Salary / Rate
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-zinc-800/80 bg-[#12131a] px-3.5 py-2.5 transition-colors focus-within:border-zinc-700">
                  
                    <input
                      id="maxSalary"
                      type="number"
                      value={maxSalary}
                      onChange={(e) => setMaxSalary(e.target.value)}
                      placeholder="e.g. 40"
                      className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
                    />
                  </div>
                </div>

                {/* Frequency */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="salaryFrequency"
                    className="text-xs font-medium text-zinc-300"
                  >
                    Frequency
                  </label>
                  <div className="relative flex items-center rounded-xl border border-zinc-800/80 bg-[#12131a] px-3.5 py-2.5 transition-colors focus-within:border-zinc-700">
                    <select
                      id="salaryFrequency"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className={cn(
                        "w-full appearance-none bg-transparent text-sm outline-none pr-6 cursor-pointer",
                        !frequency ? "text-zinc-500" : "text-zinc-200"
                      )}
                    >
                      <option value="" disabled className="bg-[#12131a] text-zinc-500">
                        Select frequency
                      </option>
                      {SALARY_FREQUENCIES.map((freq) => (
                        <option
                          key={freq}
                          value={freq}
                          className="bg-[#12131a] text-zinc-200"
                        >
                          {freq}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 h-4 w-4 text-zinc-500" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: Responsibilities & Requirements */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#5d63f6]" />
              <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
                3. Responsibilities & Requirements
              </h2>
            </div>

            <div className="space-y-4">
              {/* Key Responsibilities */}
              <div className="space-y-1.5">
                <label
                  htmlFor="keyResponsibilities"
                  className="text-xs font-medium text-zinc-300"
                >
                  Key Responsibilities <span className="text-[#8c84fc]">*</span>
                </label>
                <div className="rounded-xl border border-zinc-800/80 bg-[#12131a] p-3.5 transition-colors focus-within:border-zinc-700">
                  <textarea
                    id="keyResponsibilities"
                    required
                    rows={4}
                    value={responsibilities}
                    onChange={(e) => setResponsibilities(e.target.value)}
                    className="w-full resize-y bg-transparent text-sm leading-relaxed text-zinc-200 placeholder:text-zinc-600 outline-none"
                    placeholder="List the primary daily tasks, responsibilities, and expected impact..."
                  />
                </div>
              </div>

              {/* Qualifications & Requirements */}
              <div className="space-y-1.5">
                <label
                  htmlFor="qualifications"
                  className="text-xs font-medium text-zinc-300"
                >
                  Qualifications & Requirements{" "}
                  <span className="text-[#8c84fc]">*</span>
                </label>
                <div className="rounded-xl border border-zinc-800/80 bg-[#12131a] p-3.5 transition-colors focus-within:border-zinc-700">
                  <textarea
                    id="qualifications"
                    required
                    rows={5}
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    className="w-full resize-y bg-transparent text-sm leading-relaxed text-zinc-200 placeholder:text-zinc-600 outline-none font-mono"
                    placeholder="• Required skills and years of experience&#10;• Education or domain expertise&#10;• Nice-to-have qualifications"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Action: Publish Job */}
          <div className="flex justify-end pt-2 pb-12">
            <Button
              type="submit"
              className="h-11 px-7 rounded-xl bg-[#5d63f6] hover:bg-[#4d53e8] text-white font-medium text-sm shadow-lg shadow-[#5d63f6]/25 flex items-center gap-2 border-0 transition-all cursor-pointer"
            >
              <span>Publish Job</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
