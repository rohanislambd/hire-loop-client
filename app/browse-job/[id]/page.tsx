"use client"

import React, { use, useEffect, useState } from "react"
import Link from "next/link"
import {
  Banknote,
  MapPin,
  Clock,
  BarChart3,
  CheckCircle2,
  Bookmark,
  Tag,
  ArrowLeft,
  ShieldCheck,
  CircleDollarSign,
  Laptop,
  Umbrella,
  CodeXml,
  Boxes,
  PenTool,
  Terminal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { getJobById } from "@/lib/api/jobs"
import type { JobPostItem, JobApplication } from "@/types/jobs"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { applyToAJob } from "@/lib/actions/jobs"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function JobDetailsPage({ params }: PageProps) {
  const { id } = use(params)
  const [liveJob, setLiveJob] = useState<JobPostItem | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const user = session?.user
  useEffect(() => {
    if (!id) return
    let isMounted = true

    getJobById(id).then((data) => {
      if (isMounted && data) {
        setLiveJob(data)
      }
    })

    return () => {
      isMounted = false
    }
  }, [id])

  const handleApplyNow = async () => {
    if (!user) {
      router.push(`/sign-in?redirectTo=/browse-job/${id}`)
    } else if (user.role === "seeker") {
      const application: JobApplication = {
        jobId: id,
        userId: user.id,
        userName: user.name || "",
        email: user.email,
        jobTitle: job.title,
        companyName: job.company,
        location: job.location,
        salaryRange: job.salaryRange,
        jobType: job.jobType,
        status: "Submitted",
        appliedAt: new Date().toISOString(),
      }
      const result  = await applyToAJob(application)
      if(result.insertedId){
        console.log('Application submitted succesfully');
        router.push("/browse-job")
      }
    } else {
      console.log("user is not a job seeker")
    }
  }

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev)
  }

  // Parse responsibilities from backend string or fall back to mockup
  const responsibilities: string[] = liveJob?.responsibilities
    ? liveJob.responsibilities
        .split("\n")
        .map((line: string) => line.replace(/^[-*•]\s*/, "").trim())
        .filter(Boolean)
    : [
        "Lead the end-to-end design process for major platform features, from discovery to high-fidelity implementation.",
        "Collaborate with cross-functional partners to understand user needs and translate them into functional design requirements.",
        "Maintain and evolve our design system, ensuring consistency and accessibility across the entire product suite.",
        "Conduct user research and usability testing to validate design decisions and iterate based on feedback.",
      ]

  // Parse requirements/qualifications from backend string or fall back to mockup
  const requirementsBullets: string[] = liveJob?.qualifications
    ? liveJob.qualifications
        .split("\n")
        .map((line: string) => line.replace(/^[-*•]\s*/, "").trim())
        .filter(Boolean)
    : [
        "5+ years of experience designing complex B2B SaaS products or data-heavy applications.",
        "A strong portfolio showcasing your design process and problem-solving skills.",
      ]

  // Format salary
  const salaryRange =
    liveJob?.minSalary && liveJob?.maxSalary
      ? `$${liveJob.minSalary} – $${liveJob.maxSalary}${liveJob.frequency ? ` ${liveJob.frequency}` : ""}`
      : "$140k – $180k"

  // Format location
  const location = liveJob
    ? `${liveJob.location || "Remote"}${liveJob.isRemote ? " (Remote)" : ""}`
    : "Remote (US)"

  // Format job type
  const jobType = liveJob?.jobType
    ? liveJob.jobType.charAt(0).toUpperCase() + liveJob.jobType.slice(1)
    : "Full-time"

  // Unified job object matching the UI clone
  const job = {
    title: liveJob?.title || "Senior Product Designer",
    company: liveJob?.company || "CloudScale AI",
    isVerified: true,
    salaryRange,
    location,
    jobType,
    experience: "5+ Years",
    description:
      "At CloudScale AI, we are building the next generation of infrastructure monitoring tools. We are looking for a Senior Product Designer who is passionate about translating complex technical workflows into elegant, intuitive interfaces. You will be a key member of our design team, working closely with engineering and product leadership to define the vision for our core platform experience.",
    responsibilities:
      responsibilities.length > 0
        ? responsibilities
        : [
            "Lead the end-to-end design process for major platform features, from discovery to high-fidelity implementation.",
            "Collaborate with cross-functional partners to understand user needs and translate them into functional design requirements.",
            "Maintain and evolve our design system, ensuring consistency and accessibility across the entire product suite.",
            "Conduct user research and usability testing to validate design decisions and iterate based on feedback.",
          ],
    requirementsBadges: [
      { label: "Figma Expertise", icon: CodeXml },
      { label: "System Thinking", icon: Boxes },
      { label: "UI/UX Design", icon: PenTool },
      { label: "Basic Frontend", icon: Terminal },
    ],
    requirementsBullets:
      requirementsBullets.length > 0
        ? requirementsBullets
        : [
            "5+ years of experience designing complex B2B SaaS products or data-heavy applications.",
            "A strong portfolio showcasing your design process and problem-solving skills.",
          ],
    benefits: [
      { title: "Full Health & Dental", icon: ShieldCheck },
      { title: "Competitive 401k", icon: CircleDollarSign },
      { title: "Latest Hardware Stipend", icon: Laptop },
      { title: "Unlimited PTO", icon: Umbrella },
    ],
    companyOverview: {
      name: liveJob?.company || "CloudScale AI",
      size: "250 - 500 Employees",
      industry: liveJob?.category || "SaaS / Artificial Intelligence",
      websiteUrl: "#",
    },
  }

  return (
    <div className="min-h-screen w-full bg-[#090a0f] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Navigation Breadcrumb / Back Link */}
        <div>
          <Link
            href="/browse-job"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all jobs</span>
          </Link>
        </div>

        {/* 1. Top Header Card */}
        <section className="rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-6 sm:p-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Logo & Job Info */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-zinc-800/90 bg-[#12131b] shadow-inner">
                <Tag className="h-6 w-6 rotate-45 text-zinc-200" />
              </div>

              <div className="space-y-1">
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
                  <span className="font-medium text-zinc-300">
                    {job.company}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <div className="flex items-center gap-1.5 font-medium text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 fill-emerald-500/10 text-emerald-400" />
                    <span className="text-xs sm:text-sm">
                      Verified Employer
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 self-start sm:self-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleBookmark}
                aria-label="Save Job"
                className={cn(
                  "h-10 w-10 rounded-xl border-zinc-800 bg-[#12131b] text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white",
                  isBookmarked && "border-zinc-700 bg-zinc-800 text-white"
                )}
              >
                <Bookmark
                  className={cn(
                    "h-4 w-4",
                    isBookmarked && "fill-current text-white"
                  )}
                />
              </Button>

              <Button
                type="button"
                onClick={handleApplyNow}
                className="h-10 cursor-pointer rounded-xl border-0 bg-white px-6 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </section>

        {/* 2. Key Metrics Row */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {/* Salary Range */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-4 sm:p-5">
            <Banknote className="h-4 w-4 text-zinc-400" />
            <div>
              <p className="mt-3 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                SALARY RANGE
              </p>
              <p className="mt-1 text-sm font-semibold text-white sm:text-base">
                {job.salaryRange}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-4 sm:p-5">
            <MapPin className="h-4 w-4 text-zinc-400" />
            <div>
              <p className="mt-3 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                LOCATION
              </p>
              <p className="mt-1 text-sm font-semibold text-white sm:text-base">
                {job.location}
              </p>
            </div>
          </div>

          {/* Job Type */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-4 sm:p-5">
            <Clock className="h-4 w-4 text-zinc-400" />
            <div>
              <p className="mt-3 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                JOB TYPE
              </p>
              <p className="mt-1 text-sm font-semibold text-white sm:text-base">
                {job.jobType}
              </p>
            </div>
          </div>

          {/* Experience */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-4 sm:p-5">
            <BarChart3 className="h-4 w-4 text-zinc-400" />
            <div>
              <p className="mt-3 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                EXPERIENCE
              </p>
              <p className="mt-1 text-sm font-semibold text-white sm:text-base">
                {job.experience}
              </p>
            </div>
          </div>
        </section>

        {/* 3. Main Content: 2-Column Grid */}
        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* Left Column: Job Details */}
          <div className="space-y-8 rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-6 sm:p-8 lg:col-span-8">
            {/* Job Description */}
            <div className="space-y-3">
              <h2 className="text-base font-semibold text-white sm:text-lg">
                Job Description
              </h2>
              <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
                {job.description}
              </p>
            </div>

            <div className="h-px w-full bg-zinc-800/80" />

            {/* Responsibilities */}
            <div className="space-y-3">
              <h2 className="text-base font-semibold text-white sm:text-lg">
                Responsibilities
              </h2>
              <ul className="space-y-3 pt-1">
                {job.responsibilities.map((resp, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm leading-relaxed text-zinc-400"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-px w-full bg-zinc-800/80" />

            {/* Requirements */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-white sm:text-lg">
                Requirements
              </h2>

              {/* Requirement Skill Badges */}
              <div className="flex flex-wrap gap-2.5">
                {job.requirementsBadges.map((badge, index) => {
                  const Icon = badge.icon
                  return (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#12131b] px-3.5 py-2 text-xs font-medium text-zinc-300"
                    >
                      <Icon className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{badge.label}</span>
                    </div>
                  )
                })}
              </div>

              {/* Requirement Bullets */}
              <ul className="space-y-3 pt-2">
                {job.requirementsBullets.map((bullet, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm leading-relaxed text-zinc-400"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-px w-full bg-zinc-800/80" />

            {/* Benefits */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-white sm:text-lg">
                Benefits
              </h2>

              <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
                {job.benefits.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <div key={index} className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-[#14161f] text-zinc-300">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-zinc-200">
                        {benefit.title}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Company Overview */}
          <aside className="space-y-6 rounded-2xl border border-zinc-800/80 bg-[#0d0e14] p-6 lg:col-span-4">
            <h2 className="text-base font-semibold text-white sm:text-lg">
              Company Overview
            </h2>

            {/* Workplace Monitor Graphic matching the mockup */}
            <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-xl border border-zinc-800/80 bg-[#07080b]">
              <svg
                viewBox="0 0 320 200"
                className="h-full w-full object-cover"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Dark office wall & ambient light */}
                <rect width="320" height="200" fill="#0d0f14" />
                <circle
                  cx="160"
                  cy="50"
                  r="100"
                  fill="#1b2230"
                  fillOpacity="0.4"
                  filter="blur(30px)"
                />

                {/* Glass window grid panels */}
                <line
                  x1="40"
                  y1="0"
                  x2="40"
                  y2="160"
                  stroke="#1f2430"
                  strokeWidth="1.5"
                />
                <line
                  x1="100"
                  y1="0"
                  x2="100"
                  y2="160"
                  stroke="#1f2430"
                  strokeWidth="1.5"
                />
                <line
                  x1="220"
                  y1="0"
                  x2="220"
                  y2="160"
                  stroke="#1f2430"
                  strokeWidth="1.5"
                />
                <line
                  x1="280"
                  y1="0"
                  x2="280"
                  y2="160"
                  stroke="#1f2430"
                  strokeWidth="1.5"
                />
                <line
                  x1="0"
                  y1="90"
                  x2="320"
                  y2="90"
                  stroke="#1f2430"
                  strokeWidth="1.5"
                />

                {/* Subtle office ceiling light */}
                <rect
                  x="145"
                  y="10"
                  width="30"
                  height="4"
                  rx="2"
                  fill="#384357"
                />

                {/* Modern Desktop Display Setup */}
                <rect
                  x="75"
                  y="45"
                  width="170"
                  height="105"
                  rx="6"
                  fill="#11131a"
                  stroke="#2b313f"
                  strokeWidth="2"
                />
                <rect
                  x="80"
                  y="50"
                  width="160"
                  height="95"
                  rx="3"
                  fill="#090a0f"
                />

                <rect
                  x="90"
                  y="60"
                  width="45"
                  height="4"
                  rx="2"
                  fill="#2b3345"
                />
                <rect
                  x="90"
                  y="70"
                  width="140"
                  height="2"
                  rx="1"
                  fill="#1b202c"
                />
                <rect
                  x="90"
                  y="76"
                  width="110"
                  height="2"
                  rx="1"
                  fill="#1b202c"
                />
                <rect
                  x="90"
                  y="82"
                  width="125"
                  height="2"
                  rx="1"
                  fill="#1b202c"
                />

                <rect
                  x="90"
                  y="95"
                  width="65"
                  height="38"
                  rx="3"
                  fill="#121622"
                  stroke="#1e2536"
                  strokeWidth="1"
                />
                <rect
                  x="165"
                  y="95"
                  width="65"
                  height="38"
                  rx="3"
                  fill="#121622"
                  stroke="#1e2536"
                  strokeWidth="1"
                />

                <rect x="154" y="150" width="12" height="15" fill="#232733" />
                <rect
                  x="135"
                  y="165"
                  width="50"
                  height="4"
                  rx="2"
                  fill="#2b313f"
                />

                <line
                  x1="0"
                  y1="168"
                  x2="320"
                  y2="168"
                  stroke="#181c25"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Company Metadata Rows */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between border-b border-zinc-800/80 py-2">
                <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                  SIZE
                </span>
                <span className="text-sm font-medium text-zinc-200">
                  {job.companyOverview.size}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-zinc-800/80 py-2">
                <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                  INDUSTRY
                </span>
                <span className="text-right text-sm font-medium text-zinc-200">
                  {job.companyOverview.industry}
                </span>
              </div>
            </div>

            {/* Visit Website Action */}
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full cursor-pointer rounded-xl border-zinc-800 bg-[#12131b] text-sm font-medium text-zinc-200 transition-colors hover:bg-[#1a1c26] hover:text-white"
            >
              Visit Website
            </Button>
          </aside>
        </section>
      </div>
    </div>
  )
}
