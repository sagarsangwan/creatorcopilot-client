import { useEffect, useRef, useState } from "react"

type JobStatus = {
  status: string
  progress: number
  error?: string | null
}

type JobPollingResult = {
  data: JobStatus | null
  isLoading: boolean
  isCompleted: boolean
  isFailed: boolean
}

export function useJobPolling(jobId: string | null): JobPollingResult {
  const [data, setData] = useState<JobStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const stoppedRef = useRef(false)

  useEffect(() => {
    if (!jobId) return

    stoppedRef.current = false
    let delay = 2000 // start fast

    const poll = async () => {
      if (stoppedRef.current) return

      setIsLoading(true)

      try {
        const res = await fetch(`/api/job/status/${jobId}`)
        if (!res.ok) throw new Error("Failed to fetch job status")

        const json: JobStatus = await res.json()
        setData(json)

        // STOP CONDITIONS
        if (json.status === "SUCCESS" || json.status === "FAILURE") {
          stoppedRef.current = true
          return
        }

        // adaptive backoff (2s → 3s → 4s → max 5s)
        delay = Math.min(delay + 1000, 5000)
      } catch (err) {
        console.error("Polling error", err)
        // keep polling, but slower
        delay = 5000
      } finally {
        setIsLoading(false)
        timeoutRef.current = setTimeout(poll, delay)
      }
    }

    poll()

    return () => {
      stoppedRef.current = true
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [jobId])

  return {
    data,
    isLoading,
    isCompleted: data?.status === "SUCCESS",
    isFailed: data?.status === "FAILURE",
  }
}
