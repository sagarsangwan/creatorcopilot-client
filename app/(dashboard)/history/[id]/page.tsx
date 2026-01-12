
import PostDetailPage from './post-detail-page'
import { auth } from '@/lib/auth'
interface PageProps {
  params: Promise<{ id: string }>
}

async function page({ params }: PageProps) {
    const { id } = await params
    const session = await auth()
    console.log(id)
    if (session?.access_token) return <PostDetailPage id={id} session={session} />
  return (
    <div>
      hii
    </div>
  )
}

export default page
