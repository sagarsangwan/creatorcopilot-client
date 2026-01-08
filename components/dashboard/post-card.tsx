"use client"

import type { Post } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatRelativeTime } from "@/lib/data-utils"
import { ExternalLink, Trash2, AlertCircle } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { ContentSummarySchema } from "@/src/api-client"
import { platformOptions } from "./generate-blog-form"
interface PostCardProps {
  post: ContentSummarySchema
  onDelete?: (id: string) => void
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const statusColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    processing: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    generated: "bg-green-500/10 text-green-600 dark:text-green-400",
    failed: "bg-destructive/10 text-destructive",
  }

  const handleDelete = () => {
    onDelete?.(post.id)
    toast.success("Post deleted successfully")
  }

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base leading-tight line-clamp-2 flex-1">{post.title}</h3>
          <Badge className={statusColors[post.status]} variant="secondary">
            {post.status}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.platforms.map((platform) => (
            <Badge key={platform} variant="outline" className="text-xs">
              {platformOptions[platform]?.label}
            </Badge>
          ))}
        </div>
      </CardHeader> 

      <CardContent className="flex-1 space-y-3">
        {/* Jobs[0] Progress */}
        {post.status === "processing" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{post.jobs[0].progress}%</span>
            </div>
            <Progress value={post.jobs[0].progress} className="h-2" />
          </div>
        )}

        {/* Error Message */}
        {post.status === "failed" && post.jobs[0].error && (
          <div className="flex gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-xs text-destructive">{post.jobs[0].error}</p>
          </div>
        )}

        {/* Retries Badge */}
        {post.jobs[0].retries > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Retries:</span>
            <Badge variant="secondary" className="text-xs">
              {post.jobs[0].retries}
            </Badge>
          </div>
        )}

        {/* Timestamps */}
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{formatRelativeTime(post.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span>Updated:</span>
            <span>{formatRelativeTime(post.updated_at)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4 border-t">
        <Button asChild className="flex-1" size="sm">
          <Link href={`/history/${post.id}`}>
            <ExternalLink className="w-4 h-4 mr-2" />
            View Details
          </Link>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{post.title}&quot; ? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
