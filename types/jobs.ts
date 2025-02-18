export interface Company {
  id: string
  name: string
  logo_url?: string | null
}

export interface Job {
  id: string
  job_id: string
  title: string
  company_id: string
  location: string | null
  work_type: string | null
  application_url: string
  posted_date: string | null
  required_qualification: string | null
  preferred_qualification: string | null
  job_description: string | null
}

export interface JobWithCompany extends Job {
  company?: Company
}

export interface JobsResponse {
  data: JobWithCompany[]
  error?: string
}