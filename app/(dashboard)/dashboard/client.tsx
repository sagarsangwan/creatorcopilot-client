"use client"
import React from 'react'
import { mockPosts, mockUsage } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Zap, TrendingUp, Clock } from "lucide-react"
import { PostCard } from "@/components/dashboard/post-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { ContentListResponse } from "@/src/api-client"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
interface ClientDashboardProps{
  posts:ContentListResponse
}

function ClientDashboard({posts}:ClientDashboardProps) {
  console.log(posts)
  return (
     <div className="space-y-8">
         {/* Stats Grid */}
         {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           {stats.map((stat) => {
             const Icon = stat.icon
             return (
               <Card key={stat.title}>
                 <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                   <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                   <Icon className="w-4 h-4 text-muted-foreground" />
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold">{stat.value}</div>
                   <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                 </CardContent>
               </Card>
             )
           })}
         </div> */}

         {/* Recent Posts */}
         <div className="space-y-4">
           <div className="flex items-center justify-between">
             <h3 className="text-lg font-semibold">Recent Posts</h3>
             <Button variant="ghost" size="sm" asChild>
               <Link href="/history">View all</Link>
             </Button>
           </div>
          {posts.total>0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {posts.posts.map((post) => (
               <PostCard key={post.id} post={post} />
             ))}
           </div>:<div>hii</div>}
          
         </div>

         {/* Quick Actions */}
         <Card>
           <CardHeader>
             <CardTitle>Quick Actions</CardTitle>
           </CardHeader>
           <CardContent className="flex flex-col sm:flex-row gap-3">
             <Button asChild className="flex-1">
               <Link href="/generate/blog">Generate New Content</Link>
             </Button>
             <Button asChild variant="outline" className="flex-1 bg-transparent">
               <Link href="/history">View All Posts</Link>
             </Button>
           </CardContent>
         </Card>
       </div>
    
  )
}

export default ClientDashboard


// "use client"

// import { mockPosts, mockUsage } from "@/lib/mock-data"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { FileText, Zap, TrendingUp, Clock } from "lucide-react"
// import { PostCard } from "@/components/dashboard/post-card"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { useEffect, useState } from "react"
// import { ContentListResponse } from "@/src/api-client"
// import { useSession } from "next-auth/react"
// import { toast } from "sonner"
// export  function DashboardClientPage() {
//   const {data: session, status} = useSession()
//   const stats = [
//     {
//       title: "Total Posts",
//       value: mockPosts.length,
//       icon: FileText,
//       description: "Content pieces created",
//     },
//     {
//       title: "Tokens Used",
//       value: mockUsage.tokensUsedThisMonth.toLocaleString(),
//       icon: Zap,
//       description: "This month",
//     },
//     {
//       title: "Success Rate",
//       value: "67%",
//       icon: TrendingUp,
//       description: "Generated successfully",
//     },
//     {
//       title: "Avg. Time",
//       value: "3.2m",
//       icon: Clock,
//       description: "Per generation",
//     },
//   ]
//   const [posts, setPosts] = useState<ContentListResponse>({posts:[], total:0})
//   const [loading, setLoading] = useState<boolean>(false)
//   const [error, setError] = useState<string>("")
//   useEffect(() => {
//     const fetchLatestPosts = async () => {
//       if (status !== "authenticated") return;
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/?limit=3`,
//           {
//             headers: {
//               Authorization: `Bearer ${session?.access_token}`,
//             },
//           }
//         );
//         if (!res.ok) {
//           const errorBody = await res.json();
//           console.log(errorBody);
//           throw new Error(errorBody?.detail || "Failed to load details");
//         }
//         const result = await res.json();
//         console.log(result);
//         setPosts(result);
//       } catch (err) {
//         const msg =
//           err instanceof Error ? err.message : "Failed To Fetch Recent Posts";
//         setError(msg);
//         toast.error(msg);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLatestPosts();
//   }, [status, session]);
//   const recentPosts = mockPosts.slice(0, 3)
//   console.log(posts)
//   return (
    
//       <div className="space-y-8">
//         {/* Stats Grid */}
//         {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {stats.map((stat) => {
//             const Icon = stat.icon
//             return (
//               <Card key={stat.title}>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//                   <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
//                   <Icon className="w-4 h-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{stat.value}</div>
//                   <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
//                 </CardContent>
//               </Card>
//             )
//           })}
//         </div> */}

//         {/* Recent Posts */}
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold">Recent Posts</h3>
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/history">View all</Link>
//             </Button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {recentPosts.map((post) => (
//               <PostCard key={post.id} post={post} />
//             ))}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Quick Actions</CardTitle>
//           </CardHeader>
//           <CardContent className="flex flex-col sm:flex-row gap-3">
//             <Button asChild className="flex-1">
//               <Link href="/generate/blog">Generate New Content</Link>
//             </Button>
//             <Button asChild variant="outline" className="flex-1 bg-transparent">
//               <Link href="/history">View All Posts</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
    
//   )
// }
