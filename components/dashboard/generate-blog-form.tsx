"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Sparkles, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { mockUsage, type Platform, type CtaType } from "@/lib/mock-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ContentGenerationRequest } from "@/src/api-client"
import { title } from "process"


const toneMapping = [
  { min: 0, max: 20, label: "Casual", description: "Relaxed, conversational, friendly"  ,"id":"casual" },
  { min: 21, max: 40, label: "Friendly", description: "Warm, approachable, engaging"    ,"id":"friendly" },
  { min: 41, max: 60, label: "Professional", description: "Polished, clear, credible"   ,"id":"professional" },
  { min: 61, max: 80, label: "Formal", description: "Structured, authoritative, precise","id":"formal" },
  { min: 81, max: 100, label: "Bold", description: "Confident, direct, impactful"       ,"id":"bold"  },
]

const audience = [
  { id: "entrepreneur", label: "Entrepreneurs", description: "Startup founders and business owners" },
  { id: "developer", label: "Developers", description: "Software engineers and tech professionals" },
  { id: "marketer", label: "Marketers", description: "Digital marketing and growth professionals" },
  { id: "creator", label: "Creators", description: "Content creators and influencers" },
  { id: "student", label: "Students", description: "Learners and early-career professionals" },
  { id: "executive", label: "Executives", description: "C-level and senior leadership" },
  { id: "general public", label: "General Public", description: "For general public" },
]

const contentGoals = [
  { id: "educate", label: "Educate", icon: "📚", description: "Teach something new" },
  { id: "inspire", label: "Inspire", icon: "✨", description: "Motivate and uplift" },
  { id: "promote", label: "Promote", icon: "📣", description: "Showcase a product/service" },
  { id: "engage", label: "Engage", icon: "💬", description: "Start a conversation" },
  { id: "entertain", label: "Entertain", icon: "🎭", description: "Provide enjoyment" },
  { id: "announce", label: "Announce", icon: "📢", description: "Share news or updates" },
]
interface PlatformInfo{id:string, label:string,description:string}
type PlatformDict = Record<string, PlatformInfo>
const platformOptions:PlatformDict = 
 { "linkedin":{ id: "linkedin", label: "LinkedIn", description: "Professional network, longer content" },
 "twitter/x": { id: "twitter/x", label: "X (Twitter)", description: "Short, punchy, conversation-driven" },
  "instagram":{ id: "instagram", label: "Instagram", description: "Visual-first, hashtag-optimized" }}

const ctaOptions = [
  { value: "none", label: "No CTA" },
  { value: "read_blog", label: "Read Blog" },
  { value: "visit_website", label: "Visit Website" },
  { value: "sign_up", label: "Sign Up" },
  { value: "learn_more", label: "Learn More" },
  { value: "watch_video", label: "Watch Video" },
  { value: "download", label: "Download" },
]

export function GenerateBlogForm() {
  const router = useRouter()
   const [formData, setFormData] = useState<ContentGenerationRequest>({
    title:
      "Tired of a Messy Downloads Folder? I Built a Python Script to Fix It Forever",
    content: `We’ve all been there. You look at your Downloads folder and it’s a digital graveyard. PDFs mixed with cat memes, random .exe installers, and three different versions of the same .zip file. It’s a mess, it kills your productivity, and honestly, it’s just stressful.

I got tired of manually dragging and dropping files every Sunday, so I wrote a Python automation script to do it for me. It’s simple, it’s future-proof, and it works like a charm.

Why Automate Your File Management?
Managing files manually is a waste of time. By using a script for automated file organization, you get:

Instant Searchability: Know exactly where your PDFs or Images are.
Better Workflow: Spend less time clicking and more time doing.
A Clean Desktop: A decluttered digital space leads to a decluttered mind.
The “Future-Proof” Logic
The best part about this script? You don’t have to keep fixing it. If you download a new image, it checks if an “Images” folder exists. If it does, it drops the file in. If not, it creates the folder automatically. It’s set-it-and-forget-it.

The Python Code: Your Digital Janitor
Here is the script I use. You can copy-paste this and run it on your PC or Mac.

import os
import shutil
def organize_junk(folder_path):
    # Mapping extensions to category folders
    file_map = {
        'Images': ['.jpg', '.jpeg', '.png', '.gif', '.svg'],
        'Docs': ['.pdf', '.docx', '.txt', '.xlsx', '.pptx'],
        'Apps': ['.exe', '.msi', '.dmg', '.pkg'],
        'Zips': ['.zip', '.rar', '.7z', '.tar'],
        'Media': ['.mp4', '.mp3', '.mov', '.wav']
    }
if not os.path.exists(folder_path):
        print("Path not found!")
        return
    os.chdir(folder_path)
    for item in os.listdir():
        if os.path.isdir(item): continue # Skip folders
        ext = os.path.splitext(item)[1].lower()
        moved = False
        for folder, extensions in file_map.items():
            if ext in extensions:
                if not os.path.exists(folder): os.makedirs(folder)
                shutil.move(item, os.path.join(folder, item))
                moved = True
                break
        
        # Catch-all for unknown files
        if not moved and ext != '':
            if not os.path.exists('Others'): os.makedirs('Others')
            shutil.move(item, os.path.join('Others', item))
    print("Success! Folder organized.")
# Run it!
target = input("Paste folder path to clean: ")
organize_junk(target)`,
    tone: "professional",
    ctaLink:
      "https://medium.com/dev-genius/tired-of-a-messy-downloads-folder-i-built-a-python-script-to-fix-it-forever-3537e0cd9259",
    platforms: ["linkedin", "twitter/x"],
    audience: "general public",
    content_goal: "educate",
    job_type: "GENERATE_SOCIAL_POSTS",
    language: "en",
    ctaType: "none",
    version: 1,
  });
  const[showCta, setShowCta]=useState<boolean>(false)
  const updateField = (field: keyof ContentGenerationRequest, value: any) => {
  setFormData((prev) => {
    if (field === "platforms") {
      const currentPlatforms = prev.platforms || [];
      const newPlatforms = currentPlatforms.includes(value)
        ? currentPlatforms.filter((p) => p !== value) 
        : [...currentPlatforms, value]; 
      return { ...prev, [field]: newPlatforms };
    }
    
    return { ...prev, [field]: value };
  });
};
  const platformOptionsIds = Object.values(platformOptions).map((platform)=>{
    return platform.id
  })
 
  // const currentTone = toneMapping.find((t) => formData?.tone >= t.min && formData?.tone <= t.max)

  // const togglePersona = (id: string) => {
  //   setSelectedaudience((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  // }

  // const togglePlatform = (platform: Platform) => {
  //   setSelectedPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  // }

  const estimatedTokens = 850 // Mock calculation
  const canGenerate = formData.title && formData.content_goal && formData.platforms.length > 0
  
  const handleGenerate = () => {
    if (!canGenerate) return

    toast.success("Content generation started!", {
      description: "Your content is being generated. This may take a few minutes.",
    })

    setTimeout(() => {
      router.push("/history")
    }, 1000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form Section */}
      <div className="space-y-6">
       
        <div className="space-y-2">
          <Label htmlFor="title">Post Title</Label>
          <Input
            id="title"
            placeholder="e.g., How I built a SaaS in 30 days"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Best practice: 6-12 words for maximum engagement</p>
        </div>
        

        {/* Blog Content - Collapsible */}
        <Card>
          <CardHeader
           
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Blog Content</CardTitle>
                <CardDescription className="text-xs">Paste your blog post or key points (optional)</CardDescription>
              </div>
              
            </div>
          </CardHeader>
          
            <CardContent>
              <Textarea
                placeholder="Paste your blog content here for better context..."
                value={formData.content}
                onChange={(e) => updateField( "content",e.target.value)}
                rows={6}
                className="resize-none"
              />
            </CardContent>
          
        </Card>
        <div className="space-y-2">
                  <Label>Writing Tone</Label>
                  <div className="flex flex-wrap gap-2">
                    {toneMapping.map((tone) => (
                      <Button
                        key={tone.id}
                        variant={formData.tone === tone.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateField("tone", tone.id)}
                        className="capitalize"
                      >
                        {tone.label}
                      </Button>
                    ))}
                  </div>
                </div>
        {/* Tone Slider */}
        {/* <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Tone</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    Adjust the tone to match your brand voice and audience expectations
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Slider
            value={toneValue}
            onValueChange={setToneValue}
            max={100}
            step={1}
            className="w-full"
            aria-label="Tone selector"
          />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{currentTone?.label}</p>
              <p className="text-xs text-muted-foreground">{currentTone?.description}</p>
            </div>
            <span className="text-xs text-muted-foreground">{toneValue[0]}</span>
          </div>
        </div> */}

        {/* Audience audience */}
        <div className="space-y-3">
          <Label>Target Audience (select up to 3)</Label>
          <div className="flex flex-wrap gap-2">
            {audience.map((persona) => {
              
              return (
                <TooltipProvider key={persona.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        key={persona.id}
                        onClick={() => updateField("audience", persona.id)}
                        variant={formData.audience===persona.id?"default":"outline"}
                       
                      >
                        {persona.label}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{persona.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider> 
              )
            })}
          </div>
        </div>

        {/* Content Goal */}
        <div className="space-y-3">
          <Label>Content Goal</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {contentGoals.map((goal) => {
              const isSelected = formData.content_goal === goal.id
              return (
                <button
                  type="button"
                  key={goal.id}
                  
                  onClick={() => updateField("content_goal",goal.id)}
                  className={`p-4 rounded-lg text-left transition-all border-2 ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-card-foreground border-border hover:border-primary"
                  }`}
                >
                  <div className="text-2xl mb-2">{goal.icon}</div>
                  <p className="font-medium text-sm">{goal.label}</p>
                  <p className="text-xs opacity-80 mt-1">{goal.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Platform Selection */}
        <div className="space-y-3">
          <Label>Platforms</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {platformOptionsIds.map((platform) => {
              const isSelected = formData.platforms.includes(platformOptions[platform].id)

              return (
                <button
                  key={platformOptions[platform].id}
                  type="button"
                  onClick={() => updateField("platforms",platformOptions[platform].id)}
                  className={`p-4 rounded-lg text-left transition-all border-2 ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-card-foreground border-border hover:border-primary"
                  }`}
                >
                  <p className="font-semibold text-base mb-1">{platformOptions[platform].label}</p>
                  <p className="text-xs opacity-80">{platformOptions[platform].description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* CTA Section - Progressive Disclosure */}
        <Card>
          <CardHeader
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => setShowCta(!showCta)}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Call to Action</CardTitle>
                <CardDescription className="text-xs">Add a CTA to drive engagement (optional)</CardDescription>
              </div>
              {showCta ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </CardHeader>
          {showCta && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cta-type">CTA Type</Label>
                <Select value={formData.ctaType} onValueChange={(value) => updateField("ctaType", value as CtaType)}>
                  <SelectTrigger id="cta-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ctaOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.ctaType !== "none" && (
                <div className="space-y-2">
                  <Label htmlFor="cta-url">CTA URL (optional)</Label>
                  <Input
                    id="cta-url"
                    type="url"
                    placeholder="https://example.com"
                    value={formData?.ctaLink}
                    onChange={(e) => updateField("ctaLink",e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Generate Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={!canGenerate || mockUsage.tokensRemaining < estimatedTokens}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Content
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs space-y-1">
                <p className="font-medium">Estimated tokens: {estimatedTokens}</p>
                <p>Your balance: {mockUsage.tokensRemaining.toLocaleString()}</p>
                {!canGenerate && <p className="text-destructive">Complete required fields first</p>}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Preview Section */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>See how your content will look</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title Preview */}
            {formData.title && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Title</p>
                <h3 className="text-lg font-bold">{formData.title}</h3>
              </div>
            )}

            {/* Selected Platforms */}

              <div>
                <p className="text-xs text-muted-foreground mb-2">Platforms</p>
                <div className="flex flex-wrap gap-2">
                  {formData.platforms?.map((platform)=>(
                    <Badge key={platformOptions[platform]?.id} variant="outline">
                      {platformOptions[platform]?.label}
                    </Badge>
                  ))}
                  {/* {formData.platforms.map((platform) => (
                    <Badge key={platform} variant="outline">
                      {platformOptions.find((p) => p.value === platform)?.label}
                    </Badge>
                  ))} */}
                </div>
              </div>
            

            {/* Tone Preview */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Tone</p>
              <Badge variant="secondary">{formData.tone}</Badge>
            </div>

            {/* Audience Preview */}
           
              <div>
                <p className="text-xs text-muted-foreground mb-2">Target Audience</p>
                <div className="flex flex-wrap gap-2">
                  <Badge key={formData.audience} variant="outline">
                        {audience.find((a)=>a.id===formData.audience)?.label}
                      </Badge>
                  {/* {formData.audience.map((personaId) => {
                    const persona = audience.find((p) => p.id === personaId)
                    return (
                      <Badge key={personaId} variant="outline">
                        {persona?.label}
                      </Badge>
                    )
                  })} */}
                </div>
              </div>
            

            {/* Goal Preview */}
             
              <div>
                <p className="text-xs text-muted-foreground mb-2">Content Goal</p>
                <Badge variant="secondary">{contentGoals.find((g) => g.id === formData.content_goal)?.label}</Badge>
              </div>
            

            {/* CTA Preview */}
            {formData.ctaType !== "none" && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Call to Action</p>
                <Badge variant="outline">{ctaOptions.find((c) => c.value === formData.ctaType)?.label}</Badge>
              </div>
            )}

            {/* Empty State */}
            {!formData.title && !formData.content && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Start filling out the form to see a preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
