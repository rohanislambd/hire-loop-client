import React, { Suspense } from "react"

import { BrowseJobsClient } from "@/components/jobs/BrowseJobsClient"
import { getJobs } from "@/lib/api/jobs"
import type { JobPostItem } from "@/types/jobs"

const BrowseJobPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const search = await searchParams
  const urlSearch = new URLSearchParams(search as Record<string, string>)
  const query = urlSearch.toString()

  const jobs: JobPostItem[] = await getJobs(query)

  return (
    <Suspense>
      <BrowseJobsClient jobs={jobs} />
    </Suspense>
  )
}

export default BrowseJobPage
