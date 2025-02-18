'use client'

import { useState, useEffect, useCallback } from 'react'
import type { JobWithCompany } from '@/types/jobs'
import JobCard from './JobCard'
import { supabase } from '@/lib/supabase'

const JOBS_PER_PAGE = 10

export default function JobList() {
  const [jobs, setJobs] = useState<JobWithCompany[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMoreJobs = useCallback(async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    try {
      const start = page * JOBS_PER_PAGE
      const end = start + JOBS_PER_PAGE - 1

      const { data: newJobs, error: supabaseError } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies!jobs_company_id_fkey(*)
        `)
        .order('posted_date', { ascending: false })
        .range(start, end)

      if (supabaseError) throw new Error(supabaseError.message)
      if (!newJobs) throw new Error('No data received')

      setJobs(prevJobs => {
        const existingIds = new Set(prevJobs.map(job => job.id))
        const uniqueNewJobs = newJobs.filter(job => !existingIds.has(job.id))
        return [...prevJobs, ...uniqueNewJobs]
      })

      setHasMore(newJobs.length === JOBS_PER_PAGE)
      setPage(p => p + 1)
      setError(null)
    } catch (err) {
      console.error('Error loading jobs:', err)
      setError(err instanceof Error ? err.message : 'Failed to load jobs')
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore])

  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return

    const scrollPosition = window.innerHeight + window.scrollY
    const threshold = document.documentElement.offsetHeight - 200

    if (scrollPosition >= threshold) {
      loadMoreJobs()
    }
  }, [loading, hasMore, loadMoreJobs])

  useEffect(() => {
    loadMoreJobs() // Load initial jobs
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll, loadMoreJobs]) // Add proper dependencies

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500 mb-2">{error}</p>
        <button 
          onClick={() => {
            setError(null)
            setHasMore(true)
            setPage(0)
            setJobs([])
            loadMoreJobs()
          }}
          className="text-blue-500 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-[1200px] mx-auto">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
      
      {loading && <div className="text-center py-4">Loading...</div>}
      {!hasMore && jobs.length > 0 && (
        <div className="text-center py-4 text-gray-500">No more jobs to load</div>
      )}
      {!loading && jobs.length === 0 && (
        <div className="text-center py-4">No jobs found</div>
      )}
    </div>
  )
} 