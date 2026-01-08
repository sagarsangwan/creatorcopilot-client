"use client"

import { PostCard } from "./post-card"
import { ContentSummarySchema } from "@/src/api-client/content-service"
interface PostListProps {
  posts: ContentSummarySchema[]
  onDelete?: (id: string) => void
}

export function PostList({ posts, onDelete }: PostListProps) {
  

  return (
    <div className="space-y-6">
     
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onDelete={onDelete} />
            ))}
          </div>

          
          
        </>
      
    </div>
  )
}
