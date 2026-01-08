import { auth } from "@/lib/auth";
import HistoryClient from "./history-client";

export default async function HistoryPage() {
  const session = await auth()

  if (session?.access_token) return <HistoryClient session={session}/>

  return(
    <div>
      not logged in
    </div>
  )
  
}
