"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Eye, Calendar, Star, Telescope, CloudSun } from "lucide-react"
import { LocationInput } from "@/components/location-input"
import { EventCard } from "@/components/event-card"
import { EventModal } from "@/components/event-modal"
import { WeatherDisplay } from "@/components/weather-display"
import { PredictionEngine } from "@/lib/prediction-engine"
import { getCelestialEvents } from "@/lib/celestial-data"
import { getWeatherData } from "@/lib/weather-api"

interface Location {
  lat: number
  lng: number
  name: string
}

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

interface WeatherData {
  temperature: number
  humidity: number
  cloudCover: number
  visibility: number
  conditions: string
}

export default function CelestialPredictorPage() {
  const [location, setLocation] = useState<Location | null>(null)
  const [events, setEvents] = useState<CelestialEvent[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CelestialEvent | null>(null)
  const [loading, setLoading] = useState(false)
  const [predictionEngine] = useState(new PredictionEngine())

  useEffect(() => {
    if (location) {
      loadEventsAndWeather()
    }
  }, [location])

  const loadEventsAndWeather = async () => {
    if (!location) return

    setLoading(true)
    try {
      const weatherData = await getWeatherData(location.lat, location.lng)
      setWeather(weatherData)

      const celestialEvents = await getCelestialEvents(location.lat, location.lng)

      const eventsWithPredictions = celestialEvents.map((event) => ({
        ...event,
        visibility: predictionEngine.predictVisibility(event, weatherData, location),
      }))

      eventsWithPredictions.sort((a, b) => {
        if (a.visibility.score !== b.visibility.score) {
          return b.visibility.score - a.visibility.score
        }
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })

      setEvents(eventsWithPredictions)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setLocation({
            lat: latitude,
            lng: longitude,
            name: "Current Location",
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Telescope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Celestial Event Predictor</h1>
              <p className="text-white/80 text-sm">AI-Powered Celestial Event Predictions</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!location && (
          <Card className="mb-8 bg-white/5 border-white/10 backdrop-blur-md">
            <CardContent className="p-12 text-center">
              <div className="mb-6">
                <Telescope className="h-16 w-16 text-white/60 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">Welcome to the Celestial Event Predictor</h2>
                <p className="text-white/80 text-lg max-w-2xl mx-auto">
                  Find out when and where to see celestial events.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <Eye className="h-8 w-8 text-white/60 mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">Visibility Predictions</h3>
                  <p className="text-sm text-white/80">Visibility scores to see how visible the event is</p>
                </div>
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-white/60 mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">Event Tracking</h3>
                  <p className="text-sm text-white/80">Identify meteor showers, eclipses, ISS passes, and more</p>
                </div>
                <div className="text-center">
                  <CloudSun className="h-8 w-8 text-white/60 mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">Weather Integration</h3>
                  <p className="text-sm text-white/80">Real time weather data for the best exeprience</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8 bg-white/5 border-white/10 backdrop-blur-md relative z-50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Your Location
            </CardTitle>
            <CardDescription className="text-white/80">
              Enter your location to get personalized celestial event predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LocationInput onLocationSelect={setLocation} onDetectLocation={handleLocationDetect} />
            {location && (
              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                <p className="text-white text-sm">
                  📍 {location.name} ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {weather && location && <WeatherDisplay weather={weather} location={location.name} />}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-white/20 border-r-2 border-white/20 border-b-2 border-white/20 border-l-2 border-white"></div>
            <p className="text-white/60 mt-4">Loading celestial events...</p>
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        )}

        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </main>
    </div>
  )
} 
