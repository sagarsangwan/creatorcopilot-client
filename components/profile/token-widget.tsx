"use client"

import { Zap } from "lucide-react"
import { mockUsage } from "@/lib/mock-data"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function TokenWidget() {
  const { tokensRemaining, tokensUsedThisMonth } = mockUsage
  const totalTokens = tokensRemaining + tokensUsedThisMonth
  const percentageUsed = (tokensUsedThisMonth / totalTokens) * 100

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background cursor-pointer">
            <Zap className="w-4 h-4 text-primary" />
            <div className="flex flex-col gap-0.5 min-w-[80px]">
              <span className="text-xs font-medium text-foreground">{tokensRemaining.toLocaleString()}</span>
              <Progress value={100 - percentageUsed} className="h-1" />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs space-y-1">
            <p className="font-medium">Token Usage</p>
            <p>Remaining: {tokensRemaining.toLocaleString()}</p>
            <p>Used this month: {tokensUsedThisMonth.toLocaleString()}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
