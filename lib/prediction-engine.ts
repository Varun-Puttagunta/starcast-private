interface CelestialEvent {
  id: string
  name: string
  type: "meteor_shower" | "eclipse" | "iss_pass" | "planet_conjunction"
  date: string
  time: string
  duration: string
  description: string
}

interface WeatherData {
  temperature: number
  humidity: number
  cloudCover: number
  visibility: number
  conditions: string
}

interface Location {
  lat: number
  lng: number
  name: string
}

interface VisibilityPrediction {
  score: number
  confidence: number
  factors: string[]
}

export class PredictionEngine {
  predictVisibility(event: CelestialEvent, weather: WeatherData, location: Location): VisibilityPrediction {
    let score = 5
    let confidence = 70
    const factors: string[] = []

    if (weather.cloudCover <= 20) {
      score += 2
      factors.push("Clear skies (excellent)")
    } else if (weather.cloudCover <= 50) {
      score += 1
      factors.push("Partly cloudy (good)")
    } else if (weather.cloudCover <= 80) {
      score -= 1
      factors.push("Mostly cloudy (fair)")
    } else {
      score -= 3
      factors.push("Overcast skies (poor)")
    }

    if (weather.visibility >= 15) {
      score += 1
      factors.push("Excellent atmospheric visibility")
    } else if (weather.visibility >= 10) {
      factors.push("Good atmospheric visibility")
    } else if (weather.visibility >= 5) {
      score -= 1
      factors.push("Fair atmospheric visibility")
    } else {
      score -= 2
      factors.push("Poor atmospheric visibility")
    }

    if (weather.humidity <= 40) {
      score += 0.5
      factors.push("Low humidity (clear air)")
    } else if (weather.humidity >= 80) {
      score -= 0.5
      factors.push("High humidity (hazy conditions)")
    }

    switch (event.type) {
      case "meteor_shower":
        const moonPhase = this.getMoonPhase(event.date)
        if (moonPhase < 0.3) {
          score += 1
          factors.push("New moon phase (dark skies)")
          confidence += 10
        } else if (moonPhase > 0.7) {
          score -= 1
          factors.push("Full moon phase (bright skies)")
          confidence += 5
        }
        break

      case "iss_pass":
        confidence += 15
        factors.push("ISS orbital data (high accuracy)")

        const hour = Number.parseInt(event.time.split(":")[0])
        if (hour >= 18 || hour <= 6) {
          score += 1
          factors.push("Twilight viewing (optimal)")
        }
        break

      case "eclipse":
        confidence += 20
        factors.push("Eclipse timing (very accurate)")
        break

      case "planet_conjunction":
        confidence += 10
        factors.push("Planetary positions (accurate)")
        break
    }

    const lightPollution = this.estimateLightPollution(location)
    if (lightPollution < 3) {
      score += 1
      factors.push("Dark sky location (minimal light pollution)")
    } else if (lightPollution > 7) {
      score -= 2
      factors.push("Urban location (significant light pollution)")
    } else {
      factors.push("Suburban location (moderate light pollution)")
    }

    const season = this.getSeason(event.date, location.lat)
    if (season === "winter" && location.lat > 40) {
      score += 0.5
      factors.push("Winter season (longer nights)")
    }

    score = Math.max(1, Math.min(10, Math.round(score * 10) / 10))
    confidence = Math.max(50, Math.min(95, confidence))

    return {
      score,
      confidence,
      factors,
    }
  }

  private getMoonPhase(dateStr: string): number {
    const date = new Date(dateStr)
    const daysSinceNewMoon = (date.getTime() / (1000 * 60 * 60 * 24)) % 29.53
    return Math.abs(Math.sin((daysSinceNewMoon / 29.53) * 2 * Math.PI))
  }

  private estimateLightPollution(location: Location): number {
    const { lat, lng } = location

    const cities = [
      { lat: 40.7128, lng: -74.006, pollution: 9 },
      { lat: 34.0522, lng: -118.2437, pollution: 8 },
      { lat: 51.5074, lng: -0.1278, pollution: 8 },
      { lat: 35.6762, lng: 139.6503, pollution: 9 },
    ]

    let minDistance = Number.POSITIVE_INFINITY
    let pollution = 5

    cities.forEach((city) => {
      const distance = Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2))
      if (distance < minDistance) {
        minDistance = distance
        pollution = distance < 0.5 ? city.pollution : Math.max(3, city.pollution - distance * 2)
      }
    })

    return Math.max(1, Math.min(10, pollution))
  }

  private getSeason(dateStr: string, latitude: number): string {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1

    if (latitude > 0) {
      if (month >= 12 || month <= 2) return "winter"
      if (month >= 3 && month <= 5) return "spring"
      if (month >= 6 && month <= 8) return "summer"
      return "fall"
    } else {
      if (month >= 12 || month <= 2) return "summer"
      if (month >= 3 && month <= 5) return "fall"
      if (month >= 6 && month <= 8) return "winter"
      return "spring"
    }
  }
}

