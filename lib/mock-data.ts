// Mock data for CreatorCopilot dashboard

export type ContentStatus = "draft" | "processing" | "generated" | "failed"
export type JobStatus = "pending" | "started" | "retry" | "failure" | "success"
export type CtaType = "read_blog" | "visit_website" | "sign_up" | "learn_more" | "watch_video" | "download" | "none"
export type Platform = "linkedin" | "x" | "instagram"

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  image: string
  emailVerified: boolean
}

export interface Usage {
  plan: string
  tokensRemaining: number
  tokensUsedThisMonth: number
  lastJobTokens: number
}

export interface Asset {
  platform: Platform
  version: number
  is_active: boolean
  text: string
  meta_data: {
    hashtags: string[]
    first_comment: string
    character_count: number
    warnings: string[]
  }
}

export interface Visual {
  slide_index: number
  headline: string
  subtext: string
  meta_data: {
    bgColor: string
    textColor: string
    align: "left" | "center" | "right"
    ctaType?: CtaType
    ctaIcon?: string
  }
}

export interface Post {
  id: string
  title: string
  platforms: Platform[]
  status: ContentStatus
  created_at: string
  updated_at: string
  job: {
    status: JobStatus
    progress: number
    retries: number
    error?: string
    usage_metadata: {
      input_tokens: number
      output_tokens: number
      total_tokens: number
    }
  }
  assets: Asset[]
  visuals: Visual[]
}

export const mockUser: User = {
  id: "u_01",
  email: "sagar@example.com",
  first_name: "Sagar",
  last_name: "Sangwan",
  image: "/diverse-avatars.png",
  emailVerified: true,
}

export const mockUsage: Usage = {
  plan: "Starter",
  tokensRemaining: 12840,
  tokensUsedThisMonth: 7160,
  lastJobTokens: 420,
}

export const mockPosts: Post[] = [
  {
    id: "c_1001",
    title: "How I built CreatorCopilot with FastAPI + Next.js",
    platforms: ["linkedin", "x", "instagram"],
    status: "processing",
    created_at: "2026-01-03T10:15:00Z",
    updated_at: "2026-01-06T15:40:00Z",

    job: {
      status: "started",
      progress: 55,
      retries: 1,
      usage_metadata: {
        input_tokens: 610,
        output_tokens: 420,
        total_tokens: 1030,
      },
    },

    assets: [
      {
        platform: "linkedin",
        version: 2,
        is_active: true,
        text: "I just shipped CreatorCopilot – a platform that transforms your blog posts into platform-optimized social content automatically.\n\nBuilt with FastAPI + Next.js + async job queues, it generates captions, visuals, and CTAs tailored for LinkedIn, X, and Instagram.\n\nNo more manual copy-pasting. No more guessing what works on each platform. Just paste your blog URL and get ready-to-post content in minutes.\n\nWhat makes it different:\n• Real-time job tracking with WebSocket updates\n• Version control for each platform's content\n• Token-based pricing (no subscriptions)\n• Inline editing for fine-tuning\n\nThe stack:\n• FastAPI for async job processing\n• Next.js 14 App Router\n• Supabase for data + auth\n• AI SDK for content generation\n\nThis was a side project that turned into something I actually use daily. Happy to share the technical decisions behind it if anyone's interested.\n\n#BuildInPublic #Nextjs #FastAPI",
        meta_data: {
          hashtags: ["#Nextjs", "#FastAPI", "#BuildInPublic"],
          first_comment: "What platform should I add next? Thinking Threads or BlueSky...",
          character_count: 980,
          warnings: [],
        },
      },
      {
        platform: "instagram",
        version: 1,
        is_active: true,
        text: "Stop spending hours repurposing content 🚀\n\nI built CreatorCopilot to automate the boring parts of content creation.\n\nPaste your blog → Get platform-optimized posts for LinkedIn, X, and Instagram ✨\n\nBuilt with FastAPI + Next.js. Link in bio to try it!\n\n#coding #webdev #buildinpublic #saas #contentcreation",
        meta_data: {
          hashtags: ["#coding", "#webdev", "#buildinpublic", "#saas", "#contentcreation"],
          first_comment: "DM me if you want early access 👀",
          character_count: 320,
          warnings: [],
        },
      },
      {
        platform: "x",
        version: 1,
        is_active: true,
        text: "just shipped CreatorCopilot\n\npaste your blog → get LinkedIn/X/Instagram posts\n\nbuilt with FastAPI + Next.js\ntoken-based, no subscriptions\n\ntired of manual content repurposing so i automated it\n\ntrying it at creatorcopilot.com",
        meta_data: {
          hashtags: [],
          first_comment: "thread: why i chose FastAPI over Django 👇",
          character_count: 180,
          warnings: ["Character count optimal for engagement"],
        },
      },
    ],

    visuals: [
      {
        slide_index: 0,
        headline: "Automate your content workflow",
        subtext: "FastAPI + Next.js + async jobs",
        meta_data: {
          bgColor: "#0B1220",
          textColor: "#E5E7EB",
          align: "left",
        },
      },
      {
        slide_index: 1,
        headline: "The Problem",
        subtext: "Manual repurposing wastes time",
        meta_data: {
          bgColor: "#111827",
          textColor: "#F9FAFB",
          align: "center",
        },
      },
      {
        slide_index: 2,
        headline: "Read the Full Story",
        subtext: "Link in bio or comments",
        meta_data: {
          bgColor: "#0F172A",
          textColor: "#E5E7EB",
          align: "center",
          ctaType: "read_blog",
          ctaIcon: "BookOpen",
        },
      },
    ],
  },

  {
    id: "c_1002",
    title: "Why most AI content tools fail at consistency",
    platforms: ["linkedin", "x"],
    status: "failed",
    created_at: "2026-01-02T09:00:00Z",
    updated_at: "2026-01-06T14:10:00Z",

    job: {
      status: "failure",
      progress: 60,
      retries: 3,
      error: "Rate limited by provider. Try again in a few minutes.",
      usage_metadata: {
        input_tokens: 420,
        output_tokens: 0,
        total_tokens: 420,
      },
    },

    assets: [],
    visuals: [],
  },

  {
    id: "c_1003",
    title: "5 lessons from building my first SaaS",
    platforms: ["linkedin"],
    status: "generated",
    created_at: "2026-01-01T14:30:00Z",
    updated_at: "2026-01-02T09:15:00Z",

    job: {
      status: "success",
      progress: 100,
      retries: 0,
      usage_metadata: {
        input_tokens: 890,
        output_tokens: 650,
        total_tokens: 1540,
      },
    },

    assets: [
      {
        platform: "linkedin",
        version: 1,
        is_active: true,
        text: "5 lessons from building my first SaaS:\n\n1. Ship faster than you think you should\n2. Talk to users before writing code\n3. Pricing is a product decision, not a business one\n4. Marketing isn't optional\n5. Build for yourself first\n\nThe biggest mistake? Waiting too long to launch. I spent 3 months on features nobody asked for.\n\nNow I ship MVPs in 2 weeks and iterate based on feedback.",
        meta_data: {
          hashtags: ["#SaaS", "#StartupLessons"],
          first_comment: "What's the one lesson you wish you knew earlier?",
          character_count: 420,
          warnings: [],
        },
      },
    ],

    visuals: [
      {
        slide_index: 0,
        headline: "5 SaaS Lessons",
        subtext: "From 0 to paying customers",
        meta_data: {
          bgColor: "#1E293B",
          textColor: "#F1F5F9",
          align: "center",
        },
      },
      {
        slide_index: 1,
        headline: "Lesson 1",
        subtext: "Ship faster than comfortable",
        meta_data: {
          bgColor: "#0F172A",
          textColor: "#E2E8F0",
          align: "left",
        },
      },
    ],
  },
]

// Platform labels for UI
export const platformLabels: Record<Platform, string> = {
  linkedin: "LinkedIn",
  x: "X",
  instagram: "Instagram",
}

// Status labels for UI
export const statusLabels: Record<ContentStatus, string> = {
  draft: "Draft",
  processing: "Processing",
  generated: "Generated",
  failed: "Failed",
}

export const jobStatusLabels: Record<JobStatus, string> = {
  pending: "Pending",
  started: "In Progress",
  retry: "Retrying",
  failure: "Failed",
  success: "Complete",
}
