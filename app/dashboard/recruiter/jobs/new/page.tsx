"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Globe,
  MapPin,
} from "lucide-react"

import {
  FormField,
  FormSectionHeader,
  InputWrapper,
} from "@/components/jobs/form-elements"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { createJobs } from "@/lib/actions/jobs"
import { cn } from "@/lib/utils"
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  SALARY_FREQUENCIES,
  type JobData,
  type JobType,
} from "@/types/jobs"

// Re-export shared types/constants for zero-breaking-change backward compatibility
export {
  JOB_CATEGORIES,
  JOB_TYPES,
  SALARY_FREQUENCIES,
  type JobData,
  type JobType,
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
  const router = useRouter()

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
    if (result?.insertedId) {
      toast.add({
        title: "Job created",
        description: "The job has been successfully added",
      })
      router.push("/dashboard/recruiter/jobs")
    }
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
            <FormSectionHeader title="1. Basic Information" />

            <div className="space-y-4">
              {/* Job Title */}
              <FormField label="Job Title" required htmlFor="jobTitle">
                <InputWrapper>
                  <input
                    id="jobTitle"
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
                  />
                </InputWrapper>
              </FormField>

              {/* Company Name & Job Category */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Company Name */}
                <FormField label="Company Name" required htmlFor="companyName">
                  <InputWrapper>
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
                  </InputWrapper>
                </FormField>

                {/* Job Category */}
                <FormField label="Job Category" required htmlFor="jobCategory">
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
                </FormField>
              </div>

              {/* Job Type Selector */}
              <FormField label="Job Type" required>
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
              </FormField>
            </div>
          </section>

          {/* SECTION 2: Location, Compensation & Timeline */}
          <section className="space-y-4">
            <FormSectionHeader title="2. Location, Compensation & Timeline" />

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
                <FormField
                  label="Job Location (location)"
                  htmlFor="jobLocation"
                  hint="Required"
                >
                  <InputWrapper>
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
                  </InputWrapper>
                </FormField>

                {/* Application Deadline */}
                <FormField
                  label="Application Deadline (deadline)"
                  htmlFor="applicationDeadline"
                >
                  <InputWrapper>
                    <Calendar className="h-4 w-4 text-zinc-500 shrink-0" />
                    <input
                      id="applicationDeadline"
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full bg-transparent text-sm text-zinc-200 outline-none [color-scheme:dark]"
                    />
                  </InputWrapper>
                </FormField>
              </div>

              {/* Salary & Frequency */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Min Salary */}
                <FormField label="Min Salary / Rate" htmlFor="minSalary">
                  <InputWrapper>
                    <input
                      id="minSalary"
                      type="number"
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                      placeholder="e.g. 25"
                      className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
                    />
                  </InputWrapper>
                </FormField>

                {/* Max Salary */}
                <FormField label="Max Salary / Rate" htmlFor="maxSalary">
                  <InputWrapper>
                    <input
                      id="maxSalary"
                      type="number"
                      value={maxSalary}
                      onChange={(e) => setMaxSalary(e.target.value)}
                      placeholder="e.g. 40"
                      className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
                    />
                  </InputWrapper>
                </FormField>

                {/* Frequency */}
                <FormField label="Frequency" htmlFor="salaryFrequency">
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
                </FormField>
              </div>
            </div>
          </section>

          {/* SECTION 3: Responsibilities & Requirements */}
          <section className="space-y-4">
            <FormSectionHeader title="3. Responsibilities & Requirements" />

            <div className="space-y-4">
              {/* Key Responsibilities */}
              <FormField
                label="Key Responsibilities"
                required
                htmlFor="keyResponsibilities"
              >
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
              </FormField>

              {/* Qualifications & Requirements */}
              <FormField
                label="Qualifications & Requirements"
                required
                htmlFor="qualifications"
              >
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
              </FormField>
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
