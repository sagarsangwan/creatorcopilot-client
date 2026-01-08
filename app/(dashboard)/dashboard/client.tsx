"use client"
import { useEffect, useState } from "react"
import { ContentSummarySchema } from "@/src/api-client/content-service"
import { fetchPosts } from "@/lib/actions/api-posts" // Import your new function
import { toast } from "sonner"
import { Session } from '@auth/core/types'
import { PostCard } from "@/components/dashboard/post-card"

function ClientDashboard({ session }: { session: Session }) {
  const [posts, setPosts] = useState<ContentSummarySchema[]>([])
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Posts</h3>
        {loading ? (
          <div>Loading...</div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div>No posts found.</div>
        )}
      </div>
    </div>
  )
}

export default ClientDashboard
