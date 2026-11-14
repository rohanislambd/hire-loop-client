export const JOB_TYPES = ["full-time", "part-time", "contract", "Internship"] as const
export type JobType = (typeof JOB_TYPES)[number]

export const JOB_CATEGORIES = [
  "Engineering & Tech",
  "Product & Design",
  "Marketing & Growth",
  "Operations & Finance",
  "Sales & Business",
] as const

export const SALARY_FREQUENCIES = ["per hour", "per month", "per year"] as const

export interface JobData {
  _id?: string
  title: string
  company: string
  category: string
  jobType: JobType | ""
  isRemote: boolean
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  frequency: string
  responsibilities: string
  qualifications: string
}

export interface JobPostItem extends JobData {
  _id: string
  department?: string
  currency?: string
  applicantsCount?: number
  status?: "Active" | "Expired" | "Draft"
  postedAt?: string
}

export * from "./applications"

