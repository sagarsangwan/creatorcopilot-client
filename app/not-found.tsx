import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"
import { auth } from "@/lib/auth"
import DashboardLayoutProvider from "@/components/dashboard/dashboard-layout-provider"

export default async function NotFound() {
  const session= await auth()
  const isLoggedIn = !!session?.user
   const NotFoundContent = (
    <div className="min-h-[70vh] flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <FileQuestion className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-xl font-semibold">Page Not Found</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or may have been removed.
          </p>
        </div>
        <Button asChild>
          <Link href={isLoggedIn ? "/history" : "/"}>
            {isLoggedIn ? "Back to Dashboard" : "Back to Home"}
          </Link>
        </Button>
      </div>
    </div>
  )
  if (isLoggedIn) {
    return <DashboardLayoutProvider>{NotFoundContent}</DashboardLayoutProvider>
  }

  return NotFoundContent
}
