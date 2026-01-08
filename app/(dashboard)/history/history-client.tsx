"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { PostList } from "@/components/dashboard/post-list"
import { mockPosts } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Session } from '@auth/core/types'

import { toast } from 'sonner'
import { ContentSummarySchema,ContentListResponse } from '@/src/api-client/content-service'
import { fetchPosts } from '@/lib/actions/api-posts'
function HistoryClient({session}:{session:Session}) {
  const [posts, setPosts] = useState<ContentSummarySchema[]>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleDelete = (id: string) => {
    return
  }
   
    
    useEffect(() => {
      const loadData = async () => {
        if (!session?.access_token) return;
        
        try {
          setLoading(true);
          // Use the shared function
          const data = await fetchPosts(session.access_token, { limit: 3, offset: 0 });
          setPosts(data.posts);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Failed to load posts";
          toast.error(msg);
        } finally {
          setLoading(false);
        }
      };
  
      loadData();
    }, [session]);
  if (loading ) {
    return (<div>loading...</div>)
  }
  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">History</h1>
        <p className="text-muted-foreground mt-1">{error}</p>
      </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Content History</h2>
            <p className="text-sm text-muted-foreground mt-1">View and manage all your generated content</p>
          </div>
          <Button asChild>
            <Link href="/generate/blog">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>
        {/* Post List */}
        <PostList posts={posts} onDelete={handleDelete} />
      </div>
  )
}

export default HistoryClient
