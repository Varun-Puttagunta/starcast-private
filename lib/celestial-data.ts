interface CelestialEvent {
  id: string
  name: string
  type: "meteor_shower" | "eclipse" | "iss_pass" | "planet_conjunction"
  date: string
  time: string
  duration: string
  description: string
  coordinates?: {
    altitude: number
    azimuth: number
  }
}

export async function getCelestialEvents(lat: number, lng: number): Promise<CelestialEvent[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const events: CelestialEvent[] = []
  const now = new Date()

  for (let i = 0; i < 30; i++) {
    const eventDate = new Date(now)
    eventDate.setDate(now.getDate() + i)

    if (Math.random() < 0.3) {
      const eventTypes = ["meteor_shower", "iss_pass", "planet_conjunction", "eclipse"] as const
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]

      const event = generateEventByType(randomType, eventDate, lat, lng)
      if (event) {
        events.push(event)
      }
    }
  }

  events.push(...getGuaranteedEvents(now, lat, lng))

  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function generateEventByType(
  type: "meteor_shower" | "eclipse" | "iss_pass" | "planet_conjunction",
  date: Date,
  lat: number,
  lng: number,
): CelestialEvent | null {
  const id = `${type}_${date.getTime()}_${Math.random().toString(36).substr(2, 9)}`
  const dateStr = date.toISOString().split("T")[0]

  switch (type) {
    case "meteor_shower":
      const meteorShowers = ["Perseids", "Geminids", "Leonids", "Quadrantids", "Lyrids", "Eta Aquariids"]
      const showerName = meteorShowers[Math.floor(Math.random() * meteorShowers.length)]

      return {
        id,
        name: `${showerName} Meteor Shower`,
        type: "meteor_shower",
        date: dateStr,
        time: `${22 + Math.floor(Math.random() * 4)}:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, "0")}`,
        duration: "2-4 hours",
        description: `The ${showerName} meteor shower peaks tonight, offering spectacular shooting stars across the night sky. Best viewing is typically after midnight when the radiant is highest.`,
        coordinates: {
          altitude: 45 + Math.random() * 30,
          azimuth: Math.random() * 360,
        },
      }

    case "iss_pass":
      return {
        id,
        name: "International Space Station Pass",
        type: "iss_pass",
        date: dateStr,
        time: `${18 + Math.floor(Math.random() * 4)}:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, "0")}`,
        duration: "3-5 minutes",
        description:
          "The International Space Station will be visible as a bright, fast-moving star crossing the sky. It appears brighter than most stars and moves steadily across the heavens.",
        coordinates: {
          altitude: 20 + Math.random() * 50,
          azimuth: Math.random() * 360,
        },
      }

    case "planet_conjunction":
      const planets = [
        ["Venus", "Jupiter"],
        ["Mars", "Saturn"],
        ["Venus", "Mars"],
        ["Jupiter", "Saturn"],
      ]
      const planetPair = planets[Math.floor(Math.random() * planets.length)]

      return {
        id,
        name: `${planetPair[0]} and ${planetPair[1]} Conjunction`,
        type: "planet_conjunction",
        date: dateStr,
        time: `${19 + Math.floor(Math.random() * 3)}:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, "0")}`,
        duration: "1-2 hours",
        description: `${planetPair[0]} and ${planetPair[1]} will appear very close together in the sky tonight, creating a beautiful celestial alignment. Use binoculars or a telescope for the best view.`,
        coordinates: {
          altitude: 30 + Math.random() * 40,
          azimuth: 180 + Math.random() * 120,
        },
      }

    case "eclipse":
      if (Math.random() < 0.1) {
        const eclipseTypes = ["Lunar Eclipse", "Solar Eclipse (Partial)"]
        const eclipseType = eclipseTypes[Math.floor(Math.random() * eclipseTypes.length)]

        return {
          id,
          name: eclipseType,
          type: "eclipse",
          date: dateStr,
          time: eclipseType.includes("Lunar") ? "21:30" : "14:20",
          duration: eclipseType.includes("Lunar") ? "2-3 hours" : "1-2 hours",
          description: `A ${eclipseType.toLowerCase()} will be visible from your location. ${eclipseType.includes("Solar") ? "Remember to use proper eclipse glasses for safe viewing." : "The moon will take on a reddish hue during totality."}`,
          coordinates: {
            altitude: eclipseType.includes("Lunar") ? 45 : 60,
            azimuth: eclipseType.includes("Lunar") ? 180 : 200,
          },
        }
      }
      return null

    default:
      return null
  }
}

function getGuaranteedEvents(now: Date, lat: number, lng: number): CelestialEvent[] {
  const events: CelestialEvent[] = []

  const perseidDate = new Date(now)
  perseidDate.setDate(now.getDate() + 3)

  events.push({
    id: "guaranteed_perseid",
    name: "Perseid Meteor Shower Peak",
    type: "meteor_shower",
    date: perseidDate.toISOString().split("T")[0],
    time: "23:30",
    duration: "3-4 hours",
    description:
      "The famous Perseid meteor shower reaches its peak tonight! This is one of the most reliable and spectacular meteor showers of the year, producing up to 60 meteors per hour under dark skies.",
    coordinates: {
      altitude: 60,
      azimuth: 45,
    },
  })

  const issDate = new Date(now)
  issDate.setDate(now.getDate() + 1)

  events.push({
    id: "guaranteed_iss",
    name: "ISS Bright Pass",
    type: "iss_pass",
    date: issDate.toISOString().split("T")[0],
    time: "19:45",
    duration: "4 minutes",
    description:
      "A bright pass of the International Space Station! The ISS will be easily visible as it crosses from southwest to northeast, reaching a maximum altitude of 70 degrees.",
    coordinates: {
      altitude: 70,
      azimuth: 225,
    },
  })

  return events
}

