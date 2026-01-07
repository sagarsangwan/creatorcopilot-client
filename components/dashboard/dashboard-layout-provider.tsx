"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
  
}

export default function DashboardLayoutProvider({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0 border-r border-border">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle>
          <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
            </SheetTitle>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar  onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-7xl mx-auto p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
