import JobList from '@/components/JobList'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Daily Tech Job Update</h1>
      <JobList />
    </main>
  )
} 