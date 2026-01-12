"use client"

import type React from "react"

import { useState } from "react"
import type { Post, Visual } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InlineEditableText } from "../inline-editable-text"
import { Badge } from "@/components/ui/badge"
import { Download, Plus, Copy, RotateCcw } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface VisualsPanelProps {
  post: Post
}

export function VisualsPanel({ post }: VisualsPanelProps) {
  const [visuals, setVisuals] = useState(post.visuals)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)

  const selectedVisual = visuals[selectedIndex]

  const handleSaveHeadline = (newValue: string) => {
    setVisuals((prev) =>
      prev.map((visual, idx) => (idx === selectedIndex ? { ...visual, headline: newValue } : visual)),
    )
  }

  const handleSaveSubtext = (newValue: string) => {
    setVisuals((prev) => prev.map((visual, idx) => (idx === selectedIndex ? { ...visual, subtext: newValue } : visual)))
  }

  const handleDuplicateSlide = () => {
    const duplicated = { ...selectedVisual, slide_index: visuals.length }
    setVisuals((prev) => [...prev, duplicated])
    setSelectedIndex(visuals.length)
    toast.success("Slide duplicated")
  }

  const handleAddSlide = () => {
    const newSlide: Visual = {
      slide_index: visuals.length,
      headline: "New Slide",
      subtext: "Click to edit",
      meta_data: {
        bgColor: "#0F172A",
        textColor: "#F1F5F9",
        align: "center",
      },
    }
    setVisuals((prev) => [...prev, newSlide])
    setSelectedIndex(visuals.length)
    toast.success("New slide added")
  }

  const handleReset = () => {
    setVisuals(post.visuals)
    setSelectedIndex(0)
    toast("Slides reset", {
      description: "All changes have been reverted",
    })
  }

  const handleDownloadAll = async () => {
    setIsDownloading(true)
    toast.success("Starting download...", {
      description: `Preparing ${visuals.length} images`,
    })

    // Simulate download process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast.success("Download complete!", {
      description: `${visuals.length} images downloaded`,
    })
    setIsDownloading(false)
  }

  // Get CTA icon component
  const CtaIcon = selectedVisual?.meta_data.ctaIcon
    ? (LucideIcons[selectedVisual.meta_data.ctaIcon as keyof typeof LucideIcons] as React.ComponentType<{
        className?: string
      }>)
    : null

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <Card>
        <CardContent className="flex flex-wrap gap-3 p-4">
          <Button onClick={handleDownloadAll} disabled={isDownloading} className="gap-2">
            <Download className="w-4 h-4" />
            {isDownloading ? "Downloading..." : "Download All"}
          </Button>
          <Button onClick={handleDuplicateSlide} variant="outline" className="gap-2 bg-transparent">
            <Copy className="w-4 h-4" />
            Duplicate Slide
          </Button>
          <Button onClick={handleAddSlide} variant="outline" className="gap-2 bg-transparent">
            <Plus className="w-4 h-4" />
            Add Slide
          </Button>
          <Button onClick={handleReset} variant="outline" className="gap-2 bg-transparent">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      {/* Main Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thumbnail Strip */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Slides ({visuals.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {visuals.map((visual, idx) => (
                <button
                  key={visual.slide_index}
                  onClick={() => setSelectedIndex(idx)}
                  className={cn(
                    "w-full aspect-square rounded-lg border-2 transition-all overflow-hidden",
                    selectedIndex === idx
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50",
                  )}
                  style={{
                    backgroundColor: visual.meta_data.bgColor,
                  }}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                    <p className="text-xs font-bold line-clamp-2 mb-1" style={{ color: visual.meta_data.textColor }}>
                      {visual.headline}
                    </p>
                    <p className="text-[0.6rem] line-clamp-1 opacity-70" style={{ color: visual.meta_data.textColor }}>
                      {visual.subtext}
                    </p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Preview and Editor */}
        <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Preview</CardTitle>
                <Badge variant="secondary">Slide {selectedIndex + 1}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="w-full aspect-square rounded-lg overflow-hidden relative"
                style={{
                  backgroundColor: selectedVisual?.meta_data.bgColor,
                }}
              >
                <div
                  className={cn(
                    "w-full h-full flex flex-col justify-center p-8 md:p-12",
                    selectedVisual?.meta_data.align === "center" && "items-center text-center",
                    selectedVisual?.meta_data.align === "left" && "items-start text-left",
                    selectedVisual?.meta_data.align === "right" && "items-end text-right",
                  )}
                >
                  <h2
                    className="text-2xl md:text-4xl lg:text-5xl font-bold text-balance mb-4"
                    style={{ color: selectedVisual?.meta_data.textColor }}
                  >
                    {selectedVisual?.headline}
                  </h2>
                  <p
                    className="text-base md:text-xl text-pretty opacity-90"
                    style={{ color: selectedVisual?.meta_data.textColor }}
                  >
                    {selectedVisual?.subtext}
                  </p>

                  {/* CTA Overlay */}
                  {selectedVisual?.meta_data.ctaType && selectedVisual.meta_data.ctaType !== "none" && (
                    <div className="absolute bottom-8 right-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur">
                      {CtaIcon && <CtaIcon className="w-4 h-4" />}
                      <span className="text-sm font-medium">{selectedVisual.meta_data.ctaType.replace("_", " ")}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editor Fields */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Edit Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Headline */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Headline</label>
                <InlineEditableText
                  value={selectedVisual?.headline || ""}
                  onSave={handleSaveHeadline}
                  fieldName="Headline"
                  postId={post.id}
                  maxLength={60}
                />
              </div>

              {/* Subtext */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Subtext</label>
                <InlineEditableText
                  value={selectedVisual?.subtext || ""}
                  onSave={handleSaveSubtext}
                  fieldName="Subtext"
                  postId={post.id}
                  maxLength={120}
                />
              </div>

              {/* Meta Info */}
              <div className="pt-4 border-t border-border space-y-3">
                <h4 className="text-sm font-semibold">Style Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Background</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border border-border"
                        style={{ backgroundColor: selectedVisual?.meta_data.bgColor }}
                      />
                      <code className="text-xs">{selectedVisual?.meta_data.bgColor}</code>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Text Color</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border border-border"
                        style={{ backgroundColor: selectedVisual?.meta_data.textColor }}
                      />
                      <code className="text-xs">{selectedVisual?.meta_data.textColor}</code>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Alignment</p>
                    <Badge variant="outline">{selectedVisual?.meta_data.align}</Badge>
                  </div>
                  {selectedVisual?.meta_data.ctaType && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">CTA Type</p>
                      <Badge variant="outline">{selectedVisual.meta_data.ctaType.replace("_", " ")}</Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
