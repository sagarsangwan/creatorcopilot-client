"use client"

import { useEffect, useRef, useState } from "react"

export type JobStatusResponse = {
  status: "PENDING" | "STARTED" | "RETRY" | "SUCCESS" | "FAILURE"
  progress: number
  error?: string | null
}

export function useJobPolling(
  jobId: string | null,
  accessToken: string | null,
  onSuccess?: () => void
) {
  const [job, setJob] = useState<JobStatusResponse | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const stoppedRef = useRef(false)

  useEffect(() => {
    if (!jobId || !accessToken) return

    stoppedRef.current = false
    let delay = 2000

    const poll = async () => {
      if (stoppedRef.current) return

      try {
        const res = await fetch(
          `/api/v1/content/job/status/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        if (!res.ok) throw new Error("Failed to fetch job status")

        const data: JobStatusResponse = await res.json()
        setJob(data)

        // ✅ STOP CONDITIONS
        if (data.status === "SUCCESS") {
          stoppedRef.current = true
          onSuccess?.()
          return
        }

        if (data.status === "FAILURE") {
          stoppedRef.current = true
          return
        }

        delay = Math.min(delay + 1000, 5000)
      } catch (e) {
        console.error("Job polling error", e)
        delay = 5000
      }

      timerRef.current = setTimeout(poll, delay)
    }

    poll()

    return () => {
      stoppedRef.current = true
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [jobId, accessToken])

  return job
}
