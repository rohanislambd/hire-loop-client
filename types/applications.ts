export const APPLICATION_STATUSES = [
  "Submitted",
  "Applied",
  "Under Review",
  "Review",
  "Shortlisted",
  "Interview",
  "Interview Scheduled",
  "Offered",
  "Accepted",
  "Rejected",
  "Withdrawn",
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export interface JobApplication {
  _id?: string
  jobId: string
  userId: string
  userName?: string
  email: string
  jobTitle: string
  companyName: string
  location?: string
  salaryRange?: string
  jobType?: string
  status: ApplicationStatus
  appliedAt: string
  updatedAt?: string
  notes?: string
}

export interface SeekerStats {
  totalApplied: number
  shortlisted: number
  interviews: number
  successRate: string
}
