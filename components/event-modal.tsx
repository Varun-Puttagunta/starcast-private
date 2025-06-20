"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Eye, Star, Zap, Globe, Satellite, Compass, Mountain } from "lucide-react"
import { AddToCalendarButton } from "./add-to-calendar-button"
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

interface EventModalProps {
  event: CelestialEvent
  onClose: () => void
}

const eventIcons = {
  meteor_shower: Star,
  eclipse: Zap,
  iss_pass: Satellite,
  planet_conjunction: Globe,
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

const getViewingTips = (type: string) => {
  const tips = {
    meteor_shower: [
      "Find a dark location away from city lights",
      "Allow 20-30 minutes for your eyes to adjust",
      "Look towards the radiant constellation",
      "Best viewing is typically after midnight",
    ],
    eclipse: [
      "Never look directly at the sun without proper filters",
      "Use eclipse glasses or indirect viewing methods",
      "Check the exact timing for your location",
      "Weather conditions are crucial for viewing",
    ],
    iss_pass: [
      "Look for a bright, fast-moving star",
      "The ISS appears brighter than most stars",
      "Passes typically last 2-5 minutes",
      "Best seen during twilight hours",
    ],
    planet_conjunction: [
      "Use binoculars or a telescope for best view",
      "Look towards the specified direction",
      "Planets appear as steady, bright points",
      "Best viewed during astronomical twilight",
    ],
  }
  return tips[type as keyof typeof tips] || []
}

export function EventModal({ event, onClose }: EventModalProps) {
  const Icon = eventIcons[event.type]
  const viewingTips = getViewingTips(event.type)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-black/90 border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Icon className="h-6 w-6 text-white/60" />
            <DialogTitle className="text-2xl">{event.name}</DialogTitle>
          </div>
          <DialogDescription className="text-white/80 capitalize text-lg">
            {event.type.replace("_", " ")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="h-5 w-5" />
                <span>
                  {event.time} ({event.duration})
                </span>
              </div>
              {event.coordinates && (
                <>
                  <div className="flex items-center gap-2 text-white/80">
                    <Compass className="h-5 w-5" />
                    <span>Azimuth: {event.coordinates.azimuth}°</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Mountain className="h-5 w-5" />
                    <span>Altitude: {event.coordinates.altitude}°</span>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-white/80" />
                <span className="text-white/80">Prediction Confidence: {event.visibility.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Description</h3>
            <p className="text-white/80 leading-relaxed">{event.description}</p>
          </div>

          {/* Visibility Factors */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Viewing Conditions</h3>
            <div className="grid gap-2">
              {event.visibility.factors.map((factor, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  {factor}
                </div>
              ))}
            </div>
          </div>

          {/* Viewing Tips */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Viewing Tips</h3>
            <div className="grid gap-2">
              {viewingTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-white/80">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <div className="flex gap-3">
              <SaveEventButton
                eventId={event.id}
                eventName={event.name}
                eventDate={event.date}
                description={event.description}
                type={event.type}
              />
              <AddToCalendarButton
                eventName={event.name}
                description={event.description}
                startDate={event.date}
                duration={event.duration}
              />
            </div>
            <Button onClick={onClose} className="bg-white/10 hover:bg-white/20">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

