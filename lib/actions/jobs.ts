"use server"
import { JobData, JobPostItem } from "@/types/jobs"
import type { JobApplication } from "@/types/applications"
import { protectedMutation } from "../core/serversession"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const createJobs = async (data: JobData) => {
  const api = `${BASE_URL}/jobs`;
  const res = await  protectedMutation(api, "POST", data)
  return res.json()
}

// delete job

export const deleteJob = async (jobId: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: "DELETE",
  })
  return res.json()
}

// update jobs
export const updateJob = async (
  job: Partial<JobPostItem> & { _id: string }
) => {
  // Makes all properties of JobPostItem optional.
  const res = await fetch(`${BASE_URL}/jobs/${job._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(job),
  })
  return res.json()
}

// application post
export async function applyToAJob(data: JobApplication) {
   const api =`${BASE_URL}/applications`;
   const res = await protectedMutation(api, "POST", data )
  return res.json()
}


//application count

export const getApplicationsCount = async (query = ""): Promise<{ count: number }> => {
  const res = await fetch(`${BASE_URL}/applications/count?${query}`)
  return res.json()
}
