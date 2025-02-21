import type { Job, JobWithCompany } from '@/types/jobs'

interface JobCardProps {
  job: JobWithCompany
}

export default function JobCard({ job }: JobCardProps) {
  // Helper function to handle image URLs
  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return null
    try {
      // If it's already an absolute URL, return it as is
      new URL(url)
      return url
    } catch {
      // If it's a relative URL, add the base path in production
      const basePath = process.env.NODE_ENV === 'production' ? '/Daily-Tech-Job-Update' : ''
      return `${basePath}${url}`
    }
  }

  const logoUrl = getImageUrl(job.company?.logo_url)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString); // Just pass the date string directly
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC' // Keep UTC to prevent timezone conversion
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      {/* Job Title */}
      <h2 className="text-2xl font-medium text-gray-900 mb-4">
        {job.title}
      </h2>

      {/* Basic Info */}
      <div className="flex flex-wrap gap-6 mb-8 text-gray-600">
        {/* Company */}
        <div className="flex items-center gap-2">
          {logoUrl ? (
            <img 
              src={logoUrl}
              alt={job.company?.name || 'Company logo'}
              className="w-8 h-8 object-contain"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              {job.company?.name?.charAt(0) || 'C'}
            </div>
          )}
          <span>{job.company?.name || 'Company'}</span>
        </div>

        {/* Posted Date */}
        {job.posted_date && (
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(job.posted_date)}</span>
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{job.location}</span>
        </div>

        {/* Work Type */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>{job.work_type}</span>
        </div>
      </div>

      {/* Qualifications */}
      <div className="space-y-6 mb-8">
        {/* Required Qualifications */}
        {job.required_qualification && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Required Qualifications</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {job.required_qualification.split('\n').map((qual, index) => (
                <li key={index}>{qual.trim()}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Preferred Qualifications */}
        {job.preferred_qualification && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preferred Qualifications</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {job.preferred_qualification.split('\n').map((qual, index) => (
                <li key={index}>{qual.trim()}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Apply Button */}
      <a 
        href={job.application_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-3 bg-[#0066FF] text-white rounded-md hover:bg-blue-600 transition-colors font-medium text-center"
      >
        Apply Now
      </a>
    </div>
  )
} 