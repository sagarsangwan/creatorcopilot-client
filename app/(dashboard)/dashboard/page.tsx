import React from 'react'
import ClientDashboard from './client'
import { fetchPosts } from './action'
import { ContentListResponse } from '@/src/api-client'
import { auth } from '@/lib/auth'
async function page() {
  const session = await auth()
   if (session?.access_token) return <ClientDashboard session={session}/>
  return (
    <div>hii</div>
  )
  
}

export default page
