"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"
import { toast } from "sonner"

interface SaveEventButtonProps {
  eventId: string
  eventName: string
  eventDate: string
  description?: string
  type: "meteor_shower" | "eclipse" | "iss_pass" | "planet_conjunction"
  isSaved?: boolean
}

export function SaveEventButton({ 
  eventId, 
  eventName, 
  eventDate,
  description = "",
  type,
  isSaved = false 
}: SaveEventButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [saved, setSaved] = useState(isSaved)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    console.log('Attempting to save event:', { eventId, eventName, eventDate, description, type })
    
    if (!session) {
      console.log('No session found, redirecting to login')
      router.push("/login")
      return
    }

    setIsLoading(true)
    try {
      if (!saved) {
        console.log('Sending POST request to save event')
        const response = await fetch("/api/events/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId,
            eventName,
            eventDate,
            description,
            type,
          }),
        })

        const data = await response.json()
        console.log('Save response:', data)

        if (!response.ok) {
          console.error('Save request failed:', {
            status: response.status,
            statusText: response.statusText,
            error: data.error,
            requestData: {
              eventId,
              eventName,
              eventDate,
              description,
              type,
            }
          })

          throw new Error(data.error || "Failed to save event")
        }

        toast.success("Event saved successfully!")
      } else {
        console.log('Sending DELETE request to remove event')
        const response = await fetch("/api/events/save", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventId }),
        })

        const data = await response.json()
        console.log('Delete response:', data)

        if (!response.ok) {
          console.error('Delete request failed:', {
            status: response.status,
            statusText: response.statusText,
            error: data.error,
            requestData: { eventId }
          })

          throw new Error(data.error || "Failed to remove saved event")
        }

        toast.success("Event removed from saved events")
      }

      setSaved(!saved)
      console.log('Event saved state updated:', !saved)
      router.refresh()
    } catch (error) {
      console.error("Error saving event:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      })
      
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      toast.error(errorMessage, {
        description: "Please try again or contact support if the problem persists"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSave}
      disabled={isLoading}
      className={`flex-1 transition-all duration-300 ease-out ${
        saved 
          ? "bg-white/20 hover:bg-white/30 text-white border-0" 
          : "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10"
      }`}
    >
      <Star className={`h-4 w-4 mr-2 ${saved ? "fill-white" : ""}`} />
      {isLoading ? "Loading..." : saved ? "Saved" : "Save Event"}
    </Button>
  )
} 
