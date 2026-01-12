"use client"

import { PostDetailHeader } from "@/components/dashboard/history/id/post-detail-header"
import { JobPanel } from "@/components/dashboard/history/id/job-panel"
import { AssetsPanel } from "@/components/dashboard/history/id/assets-panel"
import { VisualsPanel } from "@/components/dashboard/history/id/visuals-panel/visuals-panel"
import { mockPosts } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Session } from "@auth/core/types"
import { ContentDetailSchema } from "@/src/api-client/content-service"
import { useEffect, useState } from "react"
import { fetchPostById } from "@/lib/actions/api-post"
import { toast } from "sonner"
import { useJobPolling } from "@/lib/actions/useJobPolling"

interface PageProps{
    id:string,
    session:Session
}
export default  function PostDetailPage({id,session}:PageProps) {
  const [post, setPost] = useState<ContentDetailSchema|undefined>(undefined)
  const [loading, setLoading] = useState(false);
    console.log(post)
    useEffect(() => {
      const loadData = async () => {
        if (!session?.access_token) return;
        
        try {
          setLoading(true);
          // Use the shared function
          const data = await fetchPostById( session.access_token, id);
          setPost(data);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Failed to load posts";
          toast.error(msg);
        } finally {
          setLoading(false);
        }
      };
  
      loadData();
    }, [session]);
  //   const job = post?.jobs?.[0]

  //   const jobStatus = useJobPolling(
  // job?.id ?? null,
  // session?.access_token ?? null,
  // async () => {
  //   // 🔥 Job finished → re-fetch post ONCE
  //   const updated = await fetchPostById(session?.access_token, id)
  //   setPost(updated)
  // }
// )

   
    
    
  // const liveJob = job
  // ? {
  //     ...job,
  //     status: jobStatus?.status ?? job.status,
  //     progress: jobStatus?.progress ?? job.progress,
  //     // retries: jobStatus?.retries ?? job.retries,
  //     error: jobStatus?.error ?? job.error,
  //   }
  // : null

  if (loading ) {
    return (<div>loading...</div>)
  }
 if (!post) {
    return <div className="text-center p-10">Post not found.</div>;
  }
  return (
      <div className="space-y-6">
        Header
        <PostDetailHeader post={post} job_id={post.jobs[0].id} session={session} setLoading={setLoading} />

        <JobPanel job={post?.jobs[0]} />

        {/* Content Tabs */}
        <Tabs defaultValue="assets" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="assets">Assets ({post?.assets?.length})</TabsTrigger>
            <TabsTrigger value="visuals">Visuals ({post?.visuals?.length})</TabsTrigger> 
          </TabsList>

          <TabsContent value="assets" className="mt-6">
            {/* {post?.assets &&<AssetsPanel assets={post?.assets[0]} />} */}
            
          </TabsContent>

          <TabsContent value="visuals" className="mt-6">
            {/* <VisualsPanel post={post} /> */}
          </TabsContent>
        </Tabs>
      </div>
  )
}
