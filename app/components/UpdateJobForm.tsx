"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Globe,
  MapPin,
  Pencil,
} from "lucide-react"

import {
  FormField,
  FormSectionHeader,
  InputWrapper,
} from "@/components/jobs/form-elements"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { updateJob } from "@/lib/actions/jobs"
import { cn } from "@/lib/utils"
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  SALARY_FREQUENCIES,
  type JobPostItem,
  type JobType,
} from "@/types/jobs"

interface UpdateJobFormProps {
  job: JobPostItem
  className?: string
}

function UpdateJobFormContent({
  job,
  onClose,
}: {
  job: JobPostItem
  onClose: () => void
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [jobTitle, setJobTitle] = useState(job.title || "")
  const [companyName, setCompanyName] = useState(job.company || "")
  const [category, setCategory] = useState(job.category || "")
  const [jobType, setJobType] = useState<JobType | "">(job.jobType || "")

  const [isRemote, setIsRemote] = useState(Boolean(job.isRemote))
  const [location, setLocation] = useState(job.location || "")
  const [deadline, setDeadline] = useState(job.deadline || "")
  const [minSalary, setMinSalary] = useState(job.minSalary || "")
  const [maxSalary, setMaxSalary] = useState(job.maxSalary || "")
  const [frequency, setFrequency] = useState(job.frequency || "")

  const [responsibilities, setResponsibilities] = useState(
    job.responsibilities || ""
  )
  const [qualifications, setQualifications] = useState(
    job.qualifications || ""
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!job._id) return

    try {
      setIsSubmitting(true)
      const updatedData: Partial<JobPostItem> & { _id: string } = {
        _id: job._id,
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

      const res = await updateJob(updatedData)
      if (res?.modifiedCount > 0 || res?.acknowledged) {
        toast.add({
          title: "Job Updated",
          description: "The job listing has been successfully updated",
        })
        onClose()
        router.refresh()
      } else {
        toast.add({
          title: "No changes",
          description: "No modifications were detected",
        })
        onClose()
      }
    } catch (error) {
      console.error("Update job error:", error)
      toast.add({
        title: "Update Failed",
        description: "Failed to update job. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      {/* SECTION 1: Basic Information */}
      <section className="space-y-4">
        <FormSectionHeader title="1. Basic Information" />

        <div className="space-y-4">
          {/* Job Title */}
          <FormField label="Job Title" required htmlFor={`title-${job._id}`}>
            <InputWrapper>
              <input
                id={`title-${job._id}`}
                name="title"
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
            <FormField
              label="Company Name"
              required
              htmlFor={`company-${job._id}`}
            >
              <InputWrapper>
                <Building2 className="h-4 w-4 text-zinc-500 shrink-0" />
                <input
                  id={`company-${job._id}`}
                  name="company"
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
            <FormField
              label="Job Category"
              required
              htmlFor={`category-${job._id}`}
            >
              <div className="relative flex items-center rounded-xl border border-zinc-800/80 bg-[#12131a] px-3.5 py-2.5 transition-colors focus-within:border-zinc-700">
                <select
                  id={`category-${job._id}`}
                  name="category"
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
                        ? "border-[#5d63f6]/60 bg-[#18192a] text-white shadow-sm ring-1 ring-[#5d63f6]/30 font-medium"
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
              htmlFor={`location-${job._id}`}
              hint="Required"
            >
              <InputWrapper>
                <MapPin className="h-4 w-4 text-zinc-500 shrink-0" />
                <input
                  id={`location-${job._id}`}
                  name="location"
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
              htmlFor={`deadline-${job._id}`}
            >
              <InputWrapper>
                <Calendar className="h-4 w-4 text-zinc-500 shrink-0" />
                <input
                  id={`deadline-${job._id}`}
                  name="deadline"
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
            <FormField
              label="Min Salary / Rate"
              htmlFor={`minSalary-${job._id}`}
            >
              <InputWrapper>
                <span className="text-sm font-medium text-zinc-400">€</span>
                <input
                  id={`minSalary-${job._id}`}
                  name="minSalary"
                  type="number"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
                />
              </InputWrapper>
            </FormField>

            {/* Max Salary */}
            <FormField
              label="Max Salary / Rate"
              htmlFor={`maxSalary-${job._id}`}
            >
              <InputWrapper>
                <span className="text-sm font-medium text-zinc-400">€</span>
                <input
                  id={`maxSalary-${job._id}`}
                  name="maxSalary"
                  type="number"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  placeholder="e.g. 40"
                  className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
                />
              </InputWrapper>
            </FormField>

            {/* Frequency */}
            <FormField
              label="Frequency"
              htmlFor={`frequency-${job._id}`}
            >
              <div className="relative flex items-center rounded-xl border border-zinc-800/80 bg-[#12131a] px-3.5 py-2.5 transition-colors focus-within:border-zinc-700">
                <select
                  id={`frequency-${job._id}`}
                  name="frequency"
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
            htmlFor={`responsibilities-${job._id}`}
          >
            <div className="rounded-xl border border-zinc-800/80 bg-[#12131a] p-3.5 transition-colors focus-within:border-zinc-700">
              <textarea
                id={`responsibilities-${job._id}`}
                name="responsibilities"
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
            htmlFor={`qualifications-${job._id}`}
          >
            <div className="rounded-xl border border-zinc-800/80 bg-[#12131a] p-3.5 transition-colors focus-within:border-zinc-700">
              <textarea
                id={`qualifications-${job._id}`}
                name="qualifications"
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

      {/* Bottom Action: Update Job (Left Aligned matching mockup) */}
      <div className="flex justify-start pt-2 pb-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 px-6 rounded-xl bg-[#5d63f6] hover:bg-[#4d53e8] text-white font-medium text-sm shadow-lg shadow-[#5d63f6]/25 flex items-center gap-2 border-0 transition-all cursor-pointer disabled:opacity-50"
        >
          <span>{isSubmitting ? "Updating..." : "Update Job"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

const UpdateJobForm = ({ job, className }: UpdateJobFormProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#5d63f6]/40 bg-[#5d63f6]/10 px-3 py-1.5 text-xs font-medium text-[#a5b4fc] transition-colors hover:bg-[#5d63f6]/20 cursor-pointer",
              className
            )}
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>Update</span>
          </button>
        }
      />

      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-[#090a0f] border-zinc-800 text-white p-6 sm:p-8">
        <DialogHeader className="space-y-1 text-left pb-2 border-b border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <span>Manage Jobs</span>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
            <span>Job Listings & Postings</span>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
            <span className="text-[#8c84fc]">Update Job Post</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Update Job Post
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-zinc-400">
            Modify position specifications, compensation range, and candidate requirements for this listing.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <UpdateJobFormContent
            key={job._id}
            job={job}
            onClose={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default UpdateJobForm
