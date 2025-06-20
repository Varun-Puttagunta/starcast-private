"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudSun, Thermometer, Droplets, Eye, Wind } from "lucide-react"

interface WeatherData {
  temperature: number
  humidity: number
  cloudCover: number
  visibility: number
  conditions: string
}

interface WeatherDisplayProps {
  weather: WeatherData
  location: string
}

export function WeatherDisplay({ weather, location }: WeatherDisplayProps) {
  const getVisibilityQuality = (visibility: number) => {
    if (visibility >= 15) return { text: "Excellent", color: "text-green-400" }
    if (visibility >= 10) return { text: "Good", color: "text-yellow-400" }
    if (visibility >= 5) return { text: "Fair", color: "text-orange-400" }
    return { text: "Poor", color: "text-red-400" }
  }

  const getCloudCoverQuality = (cloudCover: number) => {
    if (cloudCover <= 20) return { text: "Clear", color: "text-green-400" }
    if (cloudCover <= 50) return { text: "Partly Cloudy", color: "text-yellow-400" }
    if (cloudCover <= 80) return { text: "Mostly Cloudy", color: "text-orange-400" }
    return { text: "Overcast", color: "text-red-400" }
  }

  const visibilityQuality = getVisibilityQuality(weather.visibility)
  const cloudCoverQuality = getCloudCoverQuality(weather.cloudCover)

  return (
    <Card className="mb-8 bg-white/5 border-white/10 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CloudSun className="h-5 w-5" />
          Current Weather Conditions
        </CardTitle>
        <p className="text-white/80 text-sm">{location}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Thermometer className="h-6 w-6 text-white/60 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{weather.temperature}°F</div>
            <div className="text-sm text-white/80">Temperature</div>
          </div>

          <div className="text-center">
            <Droplets className="h-6 w-6 text-white/60 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{weather.humidity}%</div>
            <div className="text-sm text-white/80">Humidity</div>
          </div>

          <div className="text-center">
            <Eye className="h-6 w-6 text-white/60 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{weather.visibility}mi</div>
            <div className={`text-sm ${visibilityQuality.color}`}>{visibilityQuality.text}</div>
          </div>

          <div className="text-center">
            <Wind className="h-6 w-6 text-white/60 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{weather.cloudCover}%</div>
            <div className={`text-sm ${cloudCoverQuality.color}`}>{cloudCoverQuality.text}</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <p className="text-white text-sm">
            <span className="font-semibold">Conditions:</span> {weather.conditions}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

