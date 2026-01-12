"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { statusLabels, platformLabels } from "@/lib/mock-data"
import { formatFullDate, formatRelativeTime } from "@/lib/data-utils"
import { RefreshCw, Copy, Trash2, AlertCircle, CheckCircle, Clock } from "lucide-react"
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
import { useRouter } from "next/navigation"
import { ContentDetailSchema } from "@/src/api-client/content-service"
import { Session } from "@auth/core/types"
import { useEffect } from "react"
import { Dispatch, SetStateAction } from 'react';
import { retryJobById } from "@/lib/actions/api-job-retry"
interface PostDetailHeaderProps {
  post: ContentDetailSchema
  session:Session
  job_id:string
  setLoading:Dispatch<SetStateAction<boolean>>
}

export function PostDetailHeader({ post, session, setLoading, job_id }: PostDetailHeaderProps) {
  const router = useRouter()

        const loadData = async () => {
          if (!session?.access_token) return;
          
          try {
            setLoading(true);
            const data = await retryJobById(session.access_token, job_id=job_id);
            toast.success(data.message, {
      description: "Your content generation has been queued.",
    })
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to load posts";
            toast.error(msg);
          } finally {
            setLoading(false);
          }
        };
    
        
    

  const statusColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    processing: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    generated: "bg-green-500/10 text-green-600 dark:text-green-400",
    failed: "bg-destructive/10 text-destructive",
  }

  const statusHelperText: Record<string, { icon: React.ReactNode; text: string }> = {
    draft: {
      icon: <Clock className="w-4 h-4" />,
      text: "This post is in draft mode. Generate content to proceed.",
    },
    processing: {
      icon: <Clock className="w-4 h-4 animate-spin" />,
      text: "Content is being generated. This may take a few minutes.",
    },
    generated: {
      icon: <CheckCircle className="w-4 h-4" />,
      text: "Content generated successfully. Review and edit as needed.",
    },
    failed: {
      icon: <AlertCircle className="w-4 h-4" />,
      text: "Generation failed. You can retry or regenerate the content.",
    },
  }

  const currentHelper = statusHelperText[post.status]

  const handleRetry = () => {
    loadData();
    
  }

  const handleRegenerate = () => {
    toast.success("Regenerating content...", {
      description: "This will create new versions of all assets.",
    })
  }

  const handleDuplicate = () => {
    toast.success("Post duplicated", {
      description: "A copy has been created in your history.",
    })
  }

  const handleDelete = () => {
    toast.success("Post deleted")
    setTimeout(() => {
      router.push("/history")
    }, 500)
  }

  return (
    <div className="space-y-4">
      {/* Title and Status */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-balance leading-tight mb-3">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={statusColors[post.status]} variant={"secondary"}>
              {post.status}
            </Badge>
            {post.platforms.map((platform) => (
              <Badge key={platform} variant="outline">
                {platformLabels[platform]}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {post.status === "failed" && (
            <Button onClick={loadData} variant={"default"}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          )}

          {post.status === "generated" && (
            <Button onClick={handleRegenerate} variant="outline" className="bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          )}

          <Button onClick={handleDuplicate} variant="outline" className="bg-transparent">
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="bg-transparent">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this post? This action cannot be undone.
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
        </div>
      </div>

      {/* Helper Text */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
        <div className="mt-0.5">{currentHelper.icon}</div>
        <p className="text-sm text-muted-foreground flex-1">{currentHelper.text}</p>
      </div>

      {/* Timestamps */}
      <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
        <div>
          <span className="font-medium">Created:</span> {formatFullDate(post.created_at)}
        </div>
        <div className="hidden sm:block">•</div>
        <div>
          <span className="font-medium">Updated:</span> {formatRelativeTime(post.updated_at)}
        </div>
      </div>
    </div>
  )
}
