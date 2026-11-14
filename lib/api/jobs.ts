import type { JobPostItem } from "@/types/jobs"

export const getJobs = async (query = ""): Promise<JobPostItem[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?${query}`)
    if (!res.ok) {
      return []
    }
    return res.json()
  } catch (error) {
    console.log("getJobs error", error)
    return []
  }
}

export const getJobById = async (jobId: string): Promise<JobPostItem | null> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/${jobId}`, {
      cache: "no-store",
    })
    if (!res.ok) {
      return null
    }
    return res.json()
  } catch (error) {
    console.log("getJobById error", error)
    return null
  }
}
