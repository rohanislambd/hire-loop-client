
import { JobData } from "@/app/dashboard/recruiter/jobs/new/page"

export const createJobs = async (data: JobData) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`, {
        method: "POST",
        headers: {
             'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return res.json();
}