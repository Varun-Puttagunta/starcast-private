"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SaveEventButton } from "@/components/save-event-button"
import { Card } from "@/components/ui/card"

interface SavedEvent {
  id: string
  eventId: string
  eventName: string
  eventDate: string
  description: string
  eventType: "meteor_shower" | "eclipse" | "iss_pass" | "planet_conjunction"
}

export default function SavedEventsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<SavedEvent[]>([])
  const [loading, setLoading] = useState(true)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      console.log('User not authenticated, redirecting to login')
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    const fetchSavedEvents = async () => {
      console.log('Fetching saved events, session status:', status)
      try {
        const response = await fetch("/api/events/saved")
        console.log('Fetch response status:', response.status)
        
        if (!response.ok) throw new Error("Failed to fetch saved events")
        const data = await response.json()
        console.log('Fetched events:', data)
        
        setEvents(data)
      } catch (error) {
        console.error("Error fetching saved events:", error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      console.log('Session found, fetching events')
      fetchSavedEvents()
    } else {
      console.log('No session found, not fetching events')
    }
  }, [session, status])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Your Saved Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <Card className="bg-white/5 border-white/10 backdrop-blur-md p-6">
              <p className="text-white/80">No saved events yet.</p>
            </Card>
          ) : (
            events.map((event) => (
              <Card
                key={event.id}
                className="bg-white/5 border-white/10 backdrop-blur-md p-6"
              >
                <h3 className="text-lg font-semibold mb-2 text-white">{event.eventName}</h3>
                <p className="text-white/80 mb-4">
                  {new Date(event.eventDate).toLocaleDateString()}
                </p>
                {event.description && (
                  <p className="text-white/80 mb-4">{event.description}</p>
                )}
                <SaveEventButton
                  eventId={event.eventId}
                  eventName={event.eventName}
                  eventDate={event.eventDate}
                  description={event.description}
                  type={event.eventType}
                  isSaved={true}
                />
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 
