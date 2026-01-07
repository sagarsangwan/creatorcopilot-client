import React from 'react'
import ClientDashboard from './client'
import { fetchPosts } from './action'
import { ContentListResponse } from '@/src/api-client'
async function page() {
  const posts:ContentListResponse = await fetchPosts({page:1,limit:3})
  return (
    <ClientDashboard posts={posts}/>
  )
  
}

export default page
