import { getUsers, getUserFactoryOnsite } from '@/lib/api/server'
import { UserFactoryOnsiteMatrix } from './components/UserFactoryOnsiteMatrix'

interface PageProps {
  searchParams: Promise<{
    year: string;
    department__name__in: string;
  }>
}

export default async function UserFactoryOnsitePage({ searchParams }: PageProps) {

  const params = await searchParams
  // Fetch users and onsite data in parallel
  const [usersData, onsiteData] = await Promise.all([
    getUsers(params),
    getUserFactoryOnsite(params)
  ])

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-2xl font-bold mb-6">User Factory Onsite Matrix</h1>
      
      <UserFactoryOnsiteMatrix 
        users={usersData.results}
        onsiteData={onsiteData}
      />
    </div>
  )

}