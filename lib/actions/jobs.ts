
import { JobData, JobPostItem } from "@/types/jobs"
import type { JobApplication } from "@/types/applications"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const createJobs = async (data: JobData) => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers: {
             'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return res.json();
}


// delete job 

export const deleteJob = async(jobId: string)=> {
   const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
      method: "DELETE"
   }) 
   return res.json()
}


// update jobs
export const updateJob = async (job: Partial<JobPostItem> & { _id: string }) => {       
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
  const response = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return response.json()
}


// get application data
export const getApplications = async (query = ""): Promise<JobApplication[]> => {
  try {
    const res = await fetch(`${BASE_URL}/applications?${query}`, {
      cache: "no-store",
    })
    if (!res.ok) {
      return []
    }
    return res.json()
  } catch (error) {
    console.log("getApplications error", error)
    return []
  }
}

