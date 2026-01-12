"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { jobStatusLabels } from "@/lib/mock-data"
import { AlertCircle, Zap } from "lucide-react"
import { JobResponseSchema } from "@/src/api-client/content-service"

interface JobPanelProps {
  job: JobResponseSchema
}

export function JobPanel({ job }: JobPanelProps) {
  

  const statusColors: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    started: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    retry: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    failure: "bg-destructive/10 text-destructive",
    success: "bg-green-500/10 text-green-600 dark:text-green-400",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Job Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Status</p>
            <Badge className={statusColors[job.status]} variant="secondary">
              {jobStatusLabels[job.status]}
            </Badge>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Progress</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{job.progress}%</span>
              </div>
              <Progress value={job.progress} className="h-2" />
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Retries</p>
            <Badge variant="outline">{job.retries}</Badge>
          </div>
        </div>

        {/* Error Box */}
        {job.error && (
          <div className="flex gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive mb-1">Error Details</p>
              <p className="text-sm text-destructive/90">{job.error}</p>
            </div>
          </div>
        )}

        {/* Token Usage */}
        {job.usage_metadata&&(<div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold">Token Usage</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Input Tokens</p>
              <p className="text-lg font-semibold">{job.usage_metadata.prompt_tokens.toLocaleString()}</p>
            </div>

            <div className="p-3 rounded-lg border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Output Tokens</p>
              <p className="text-lg font-semibold">{job.usage_metadata.candidates_tokens.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Cached Tokens</p>
              <p className="text-lg font-semibold">{job?.usage_metadata?.cached_tokens?.toLocaleString()}</p>
            </div>

            <div className="p-3 rounded-lg border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Total Tokens</p>
              <p className="text-lg font-semibold">{job.usage_metadata.total_tokens.toLocaleString()}</p>
            </div>
          </div>
        </div>)}
        
      </CardContent>
    </Card>
  )
}
