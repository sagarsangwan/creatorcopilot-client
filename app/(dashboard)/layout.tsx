
import { redirect } from "next/navigation";
import DashboardLayoutProvider from "@/components/dashboard/dashboard-layout-provider";
import React from "react";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({ children }:{children:React.ReactNode}) {
  const session = await auth()

  if (!session?.user || !session.access_token) {
    redirect("/");
  }

  return <DashboardLayoutProvider >{children}</DashboardLayoutProvider>;
}
