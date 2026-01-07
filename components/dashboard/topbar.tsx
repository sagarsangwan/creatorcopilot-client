"use client"

import { Menu, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TokenWidget } from "../profile/token-widget"
import { UserMenu } from "../auth/UserMenu"

interface TopbarProps {
  
  onMenuClick: () => void
}

export function Topbar({  onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-3 md:px-6">
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="w-5 h-5" />
        </Button>
        <h2 className="text-lg md:text-xl font-semibold text-foreground">copilot</h2>
      </div>

      {/* Right: Token Widget + Notifications + User */}
      <div className="flex items-center gap-2 md:gap-4">
        <TokenWidget />

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        <UserMenu />
      </div>
    </header>
  )
}
