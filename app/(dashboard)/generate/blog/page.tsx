import { GenerateBlogForm } from "@/components/dashboard/generate-blog-form";
import { auth } from "@/lib/auth";



export default async function GenerateBlogPage() {
  const session = await auth()
  return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Create New Content</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Transform your blog post into platform-optimized social content
          </p>
        </div>
        {session?.access_token && <GenerateBlogForm token={session?.access_token}/>}
        
      </div>
  )
}
