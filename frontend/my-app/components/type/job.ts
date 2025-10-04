import {RegisterPayload} from "@/data/urlRecruiter"
export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: "Full-time" | "Part-time" | "Contract" | "Remote"
  salary: string
  description: string
  requirements: string[]
  postedDate: string
  status: "Open" | "Closed" | "Draft"
  applicationsCount: number
}

export interface Application {
  id: string
  jobId: string
  candidateName: string
  email: string
  phone: string
  resume: string
  coverLetter: string
  appliedDate: string
  status: "Pending" | "Reviewed" | "Interview" | "Rejected" | "Hired"
  experience: string
  skills: string[]
}

export interface Meeting {
  job: number|null
  candidate: string|null
  recruiter: RegisterPayload|null 
  time: string|null
  
}

