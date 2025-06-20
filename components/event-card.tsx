"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Eye, Star, Zap, Globe, Satellite } from "lucide-react"
import { SaveEventButton } from "./save-event-button"

interface CelestialEvent {
  id: string
  name: string
  type: "meteor_shower" | "eclipse" | "iss_pass" | "planet_conjunction"
  date: string
  time: string
  duration: string
  description: string
  visibility: {
    score: number
    confidence: number
    factors: string[]
  }
  coordinates?: {
    altitude: number
    azimuth: number
  }
}

interface EventCardProps {
  event: CelestialEvent
  onClick: () => void
}

const eventIcons = {
  meteor_shower: Star,
  eclipse: Zap,
  iss_pass: Satellite,
  planet_conjunction: Globe,
}

const eventColors = {
  meteor_shower: "bg-yellow-500",
  eclipse: "bg-orange-500",
  iss_pass: "bg-blue-500",
  planet_conjunction: "bg-purple-500",
}

const getVisibilityColor = (score: number) => {
  if (score >= 8) return "bg-green-500"
  if (score >= 6) return "bg-yellow-500"
  if (score >= 4) return "bg-orange-500"
  return "bg-red-500"
}

const getVisibilityText = (score: number) => {
  if (score >= 8) return "Excellent"
  if (score >= 6) return "Good"
  if (score >= 4) return "Fair"
  return "Poor"
}

export function EventCard({ event, onClick }: EventCardProps) {
  const Icon = eventIcons[event.type]
  const eventColor = eventColors[event.type]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 ease-out transform hover:scale-[1.02] hover:-translate-y-1 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${eventColor}`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">{event.name}</CardTitle>
              <CardDescription className="text-white/80 capitalize">{event.type.replace("_", " ")}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Calendar className="h-4 w-4" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Clock className="h-4 w-4" />
            {event.time} ({event.duration})
          </div>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Eye className="h-4 w-4" />
            Confidence: {event.visibility.confidence}%
          </div>
        </div>

        <p className="text-sm text-white/80 line-clamp-2">{event.description}</p>

        <div className="flex gap-2">
          <SaveEventButton
            eventId={event.id}
            eventName={event.name}
            eventDate={event.date}
            description={event.description}
            type={event.type}
          />
          <Button onClick={onClick} className="flex-1 bg-white/10 hover:bg-white/20 text-white">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

