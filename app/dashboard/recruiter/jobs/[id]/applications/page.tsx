
import { getJobById } from "@/lib/api/jobs"

import { JobApplicationsTable } from "@/components/recruiter/JobApplicationsTable"
import { getApplications } from "@/lib/api/application"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ApplicationsPage({ params }: PageProps) {
  const { id } = await params
  const [job, applications] = await Promise.all([
    getJobById(id),
    getApplications(`jobId=${id}`),
  ])

  return (
    <JobApplicationsTable
      job={job}
      jobId={id}
      initialApplications={applications || []}
    />
  )
}
