import React from "react"
import { getJobById } from "@/lib/api/jobs"
import { getApplications } from "@/lib/actions/jobs"
import { JobApplicationsTable } from "@/components/recruiter/JobApplicationsTable"
import type { JobApplication } from "@/types/applications"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ApplicationsPage({ params }: PageProps) {
  const { id } = await params
  const [job, dbApplications] = await Promise.all([
    getJobById(id),
    getApplications(`jobId=${id}`),
  ])

  // Provide initial demo applications if no candidates have applied to this specific job yet
  const initialApplications: JobApplication[] =
    dbApplications && dbApplications.length > 0
      ? dbApplications
      : [
          {
            _id: "demo-app-1",
            jobId: id,
            userId: "user-101",
            userName: "Sarah Jenkins",
            email: "sarah.jenkins@example.com",
            jobTitle: job?.title || "Software Engineer",
            companyName: job?.company || "TechCorp",
            location: "San Francisco, CA (Remote)",
            status: "Under Review",
            appliedAt: "2026-11-16T10:30:00.000Z",
            notes:
              "Strong portfolio in React & Next.js. 4 years of frontend engineering experience with clean code practices.",
          },
          {
            _id: "demo-app-2",
            jobId: id,
            userId: "user-102",
            userName: "David Chen",
            email: "david.chen@techmail.io",
            jobTitle: job?.title || "Software Engineer",
            companyName: job?.company || "TechCorp",
            location: "Austin, TX",
            status: "Shortlisted",
            appliedAt: "2026-11-15T14:15:00.000Z",
            notes:
              "Solid background in full-stack TypeScript, Node.js, and MongoDB. Experience designing scalable APIs.",
          },
          {
            _id: "demo-app-3",
            jobId: id,
            userId: "user-103",
            userName: "Emily Rodriguez",
            email: "emily.rodriguez@creative.dev",
            jobTitle: job?.title || "Software Engineer",
            companyName: job?.company || "TechCorp",
            location: "New York, NY",
            status: "Submitted",
            appliedAt: "2026-11-16T12:00:00.000Z",
            notes:
              "Top tier software engineer with high attention to UI/UX detail and test coverage.",
          },
        ]

  return (
    <JobApplicationsTable
      job={job}
      jobId={id}
      initialApplications={initialApplications}
    />
  )
}
