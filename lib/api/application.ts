import { JobApplication } from "@/types/applications"
import { authFetch } from "../core/serversession"
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// get application data
export const getApplications = async (
  query = ""
): Promise<JobApplication[]> => {

  const api = `${BASE_URL}/applications?${query}`
  try {
    const res = await authFetch(api)
    if (!res.ok) {
      return []
    }
    return res.json()
  } catch (error) {
    console.log("getApplications error", error)
    return []
  }
}


