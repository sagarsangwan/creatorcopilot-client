"use client"

import { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { toast } from "sonner"

interface InlineEditableTextProps {
  value: string
  onSave: (newValue: string) => void
  placeholder?: string
  fieldName: string
  postId: string
  multiline?: boolean
  maxLength?: number
}

export function InlineEditableText({
  value,
  onSave,
  placeholder = "Click to edit",
  fieldName,
  postId,
  multiline = false,
  maxLength,
}: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isDirty, setIsDirty] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [isEditing])

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue)
      toast.success("Changes saved", {
        description: `${fieldName} updated successfully`,
      })
      setIsDirty(false)
    }
    setIsEditing(false)
  }

  const handleDiscard = () => {
    setEditValue(value)
    setIsEditing(false)
    setIsDirty(false)
    toast("Changes discarded", {
      description: "Reverted to original value",
    })
  }

  const handleChange = (newValue: string) => {
    setEditValue(newValue)
    setIsDirty(newValue !== value)
  }

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => handleChange(e.target.value)}
          rows={multiline ? 8 : 3}
          maxLength={maxLength}
          className="w-full resize-none"
        />
        {maxLength && (
          <p className="text-xs text-muted-foreground text-right">
            {editValue.length} / {maxLength}
          </p>
        )}
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleSave} className="gap-2">
            <Check className="w-4 h-4" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleDiscard} className="gap-2 bg-transparent">
            <X className="w-4 h-4" />
            Discard
          </Button>
          {isDirty && <span className="text-xs text-muted-foreground ml-2">• Unsaved changes</span>}
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="group cursor-pointer p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-colors"
    >
      <p className="text-sm whitespace-pre-wrap text-pretty leading-relaxed">
        {value || <span className="text-muted-foreground italic">{placeholder}</span>}
      </p>
      <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        Click to edit
      </p>
    </div>
  )
}
