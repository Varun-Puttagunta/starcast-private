"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, AlertTriangle, Flame, Cloud, Droplets, Wind, ChevronLeft, ChevronRight, MapPin, Filter } from "lucide-react"
import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Dynamically import the map components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

// Fix for default marker icons in react-leaflet
const iconConfig = {
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41] as [number, number],
  iconAnchor: [12, 41] as [number, number],
  popupAnchor: [1, -34] as [number, number],
  shadowSize: [41, 41] as [number, number]
}

// Create a client-side only icon instance
const getIcon = () => {
  if (typeof window !== 'undefined') {
    return L.icon(iconConfig)
  }
  return undefined
}

interface EarthEvent {
  id: string
  title: string
  description: string
  category: string
  coordinates: {
    latitude: number
    longitude: number
  }
  date: string
  status: string
  magnitude?: number
  sources: string[]
}

const categoryIcons: Record<string, any> = {
  wildfires: Flame,
  severeStorms: Cloud,
  volcanoes: AlertTriangle,
  floods: Droplets,
  drought: Wind,
  iceberg: AlertTriangle,
}

const categoryColors: Record<string, string> = {
  wildfires: "bg-red-500",
  severeStorms: "bg-blue-500",
  volcanoes: "bg-orange-500",
  floods: "bg-cyan-500",
  drought: "bg-yellow-500",
  iceberg: "bg-blue-500",
}

const transformCategoryName = (category: string) => {
  return category === 'sealakeice' ? 'iceberg' : category
}

export function EarthEvents() {
  const [allEvents, setAllEvents] = useState<EarthEvent[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEvent, setSelectedEvent] = useState<EarthEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [aiDescription, setAiDescription] = useState<string>("")
  const [generatingDescription, setGeneratingDescription] = useState(false)

  const EVENTS_PER_PAGE = 10

  // Filter events by selected categories
  const filteredEvents = allEvents.filter(event => 
    selectedCategories.length === 0 || selectedCategories.includes(event.category)
  )
  
  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE)
  
  // Get current events for the page
  const getCurrentEvents = () => {
    const startIndex = (currentPage - 1) * EVENTS_PER_PAGE
    const endIndex = startIndex + EVENTS_PER_PAGE
    return filteredEvents.slice(startIndex, endIndex)
  }

  // Get unique categories from all events
  const categories = Array.from(new Set(allEvents.map(event => event.category)))

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category)
      } else {
        return [...prev, category]
      }
    })
    setCurrentPage(1) // Reset to first page when filtering
  }

  const generateAIDescription = async (event: EarthEvent) => {
    setGeneratingDescription(true)
    setAiDescription("")
    
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventTitle: event.title,
          eventCategory: event.category,
          eventDate: event.date,
          eventStatus: event.status,
          coordinates: event.coordinates,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate description')
      }

      const data = await response.json()
      setAiDescription(data.description)
    } catch (error) {
      console.error('Error generating AI description:', error)
      setAiDescription("Unable to generate AI description at this time.")
    } finally {
      setGeneratingDescription(false)
    }
  }

  const handleEventSelect = (event: EarthEvent) => {
    setSelectedEvent(event)
    generateAIDescription(event)
    // Scroll to the bottom of the page with smooth animation
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      })
    }, 100)
  }

  useEffect(() => {
    const fetchEarthEvents = async () => {
      try {
        console.log('Fetching events from EONET API...')
        const response = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events', {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'StarCast-App'
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Received data:', data)
        
        if (!data.events || !Array.isArray(data.events)) {
          throw new Error('Invalid data format received from API')
        }

        const formattedEvents = data.events
          .map((event: any) => {
            try {
              if (!event.geometry || !event.geometry[0] || !event.categories || !event.categories[0]) {
                console.warn('Skipping malformed event:', event)
                return null
              }
              
              {/*sealakeice is an iceberg, change this so user can understand*/}
              return {
                id: event.id,
                title: event.title,
                description: event.description || "No description available",
                //*sealakeice is an iceberg, change this so user can understand

                category: event.categories[0].id.toLowerCase() === 'sealakeice' ? 'iceberg' : event.categories[0].id.toLowerCase(),
                coordinates: {
                  latitude: event.geometry[0].coordinates[1],
                  longitude: event.geometry[0].coordinates[0]
                },
                date: new Date(event.geometry[0].date).toLocaleDateString(),
                status: event.closed ? "Closed" : "Ongoing",
                sources: event.sources?.map((source: any) => source.url) || []
              }
            } catch (err) {
              console.warn('Error processing event:', err)
              return null
            }
          })
          .filter(Boolean)

        console.log('Formatted events:', formattedEvents)
        setAllEvents(formattedEvents)
        setError(null)
      } catch (error) {
        console.error("Error fetching Earth events:", error)
        setError(error instanceof Error ? error.message : 'Failed to load events')
      } finally {
        setLoading(false)
      }
    }

    fetchEarthEvents()
  }, [])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    setSelectedEvent(null) // Reset selected event when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Header with actual text */}
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Natural Events</h1>
                <p className="text-white/80 text-sm">Track Natural Events Around the Globe</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Loading message */}
          <div className="flex flex-col items-center justify-center py-16 mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-6"></div>
            <p className="text-white/80 text-xl font-medium mb-2">Retrieving Earth Events...</p>
            <p className="text-white/60 text-sm">Fetching data from NASA EONET API</p>
          </div>

          <div className="space-y-6">
            {/* Filter Card Skeleton */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-white/10 rounded animate-pulse" />
                  <div className="h-5 w-32 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="h-4 w-48 bg-white/10 rounded animate-pulse mt-2" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-9 w-24 bg-white/10 rounded animate-pulse" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Events List Skeleton */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-white/10 rounded animate-pulse" />
                  <div className="h-6 w-48 bg-white/10 rounded animate-pulse" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-md">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="h-5 w-48 bg-white/10 rounded animate-pulse" />
                            <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                          </div>
                          <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                          <div className="h-4 w-36 bg-white/10 rounded animate-pulse" />
                          <div className="h-4 w-28 bg-white/10 rounded animate-pulse" />
                        </div>
                        <div className="h-16 bg-white/10 rounded animate-pulse" />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Details Panel Skeleton */}
                <div className="relative">
                  <Card className="bg-white/5 border-white/10 backdrop-blur-md h-fit">
                    <CardHeader>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
                          <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                        </div>
                        <div className="h-6 w-64 bg-white/10 rounded animate-pulse" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="h-[200px] bg-white/10 rounded animate-pulse" />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="h-4 w-full bg-white/10 rounded animate-pulse" />
                            ))}
                          </div>
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="h-4 w-full bg-white/10 rounded animate-pulse" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Error Loading Events</h3>
            <p className="text-white/80">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-white/10 hover:bg-white/20"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (allEvents.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardContent className="p-8 text-center">
            <Globe className="h-12 w-12 text-white/60 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Events Found</h3>
            <p className="text-white/80">There are currently no active natural events to display.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Natural Events</h1>
              <p className="text-white/80 text-sm">Track Natural Events Around the Globe</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Category filters */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Events
              </CardTitle>
              <CardDescription className="text-white/80">
                Select event types to display
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => {
                  const Icon = categoryIcons[transformCategoryName(category)]
                  const color = categoryColors[transformCategoryName(category)]
                  return (
                    <Button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      variant="outline"
                      className={`transition-all duration-300 ease-out ${
                        selectedCategories.includes(category)
                          ? "bg-yellow-400 text-black border-yellow-400 shadow-md"
                          : "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10"
                      }`}
                    >
                      {Icon && <Icon className="h-4 w-4 mr-2" />}
                      {transformCategoryName(category)}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Events List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Globe className="h-6 w-6" />
                Natural Events
              </h2>
            </div>

            {getCurrentEvents().map((event) => {
              const Icon = categoryIcons[transformCategoryName(event.category)] || AlertTriangle
              const categoryColor = categoryColors[transformCategoryName(event.category)] || "bg-gray-500"
              const isSelected = selectedEvent?.id === event.id

              return (
                <Card 
                  key={event.id}
                  onClick={() => handleEventSelect(event)}
                  className={`bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] ${
                    isSelected ? 'scale-[1.02] ring-2 ring-white/20 bg-white/10' : ''
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{event.title}</CardTitle>
                        <CardDescription className="text-white/80">
                          {event.date}
                        </CardDescription>
                      </div>
                      <Badge className={`${categoryColor} text-white border-0`}>
                        {transformCategoryName(event.category)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Icon className="h-4 w-4" />
                      Status: {event.status}
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-white/10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {/* First page */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    className={`w-8 h-8 p-0 ${
                      currentPage === 1
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    1
                  </Button>

                  {/* Ellipsis and middle pages */}
                  {totalPages > 7 && currentPage > 4 && (
                    <span className="text-white/60 px-1">...</span>
                  )}

                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1
                    // Show current page and 1 page before and after
                    if (
                      pageNumber !== 1 &&
                      pageNumber !== totalPages &&
                      (pageNumber === currentPage ||
                        pageNumber === currentPage - 1 ||
                        pageNumber === currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={`page-${pageNumber}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-8 h-8 p-0 ${
                            currentPage === pageNumber
                              ? 'bg-white/20 text-white'
                              : 'text-white/80 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {pageNumber}
                        </Button>
                      )
                    }
                    return null
                  })}

                  {/* Ellipsis for later pages */}
                  {totalPages > 7 && currentPage < totalPages - 3 && (
                    <span className="text-white/60 px-1">...</span>
                  )}

                  {/* Last page */}
                  {totalPages > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      className={`w-8 h-8 p-0 ${
                        currentPage === totalPages
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {totalPages}
                    </Button>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Detailed View */}
          <div className="relative">
            <Card className={`bg-white/5 border-white/10 backdrop-blur-md h-fit transition-all duration-300 ${
              selectedEvent ? 'opacity-100 transform translate-y-0' : 'opacity-80 transform -translate-y-4'
            }`}>
              <CardHeader>
                {selectedEvent ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Badge className={`${categoryColors[transformCategoryName(selectedEvent.category)] || 'bg-gray-500'} text-white border-0`}>
                        {transformCategoryName(selectedEvent.category)}
                      </Badge>
                      <CardDescription className="text-white/80">
                        {selectedEvent.date}
                      </CardDescription>
                    </div>
                    <CardTitle className="text-xl text-white mt-2">{selectedEvent.title}</CardTitle>
                  </>
                ) : (
                  <>
                    <CardTitle className="text-white">Select an Event</CardTitle>
                    <CardDescription className="text-white/80">
                      Choose an event from the list to view details
                    </CardDescription>
                  </>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedEvent ? (
                  <div className="animate-fadeIn">
                    <div className="space-y-4">
                      {/* AI Generated Description */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <span className="text-blue-400">🤖</span>
                          AI Analysis
                        </h3>
                        {generatingDescription ? (
                          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                            <div>
                              <p className="text-white/80 font-medium">Generating AI Analysis...</p>
                              <p className="text-white/60 text-sm">Analyzing event data with Gemini AI</p>
                            </div>
                          </div>
                        ) : aiDescription ? (
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10 animate-fadeIn">
                            <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{aiDescription}</p>
                          </div>
                        ) : (
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-white/60 italic">Click on an event to generate an AI-powered analysis</p>
                          </div>
                        )}
                      </div>

                      {/* Sources */}
                      {selectedEvent.sources.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-white/80">Sources</h3>
                          <div className="space-y-1">
                            {selectedEvent.sources.map((source, index) => (
                              <a
                                key={index}
                                href={source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-sm text-blue-400 hover:text-blue-300 truncate"
                              >
                                {source}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interactive Map */}
                      <div>
                        <div className="h-[500px] w-full rounded-lg overflow-hidden border border-white/10">
                          <MapContainer
                            center={[selectedEvent.coordinates.latitude, selectedEvent.coordinates.longitude]}
                            zoom={4}
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={true}
                          >
                            <TileLayer
                              attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                              url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                              maxZoom={20}
                            />
                            <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                              url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
                              opacity={0.3}
                            />
                            <Marker
                              position={[selectedEvent.coordinates.latitude, selectedEvent.coordinates.longitude]}
                              icon={getIcon()}
                            >
                              <Popup>
                                <div className="text-black">
                                  <h4 className="font-semibold">{selectedEvent.title}</h4>
                                  <p className="text-sm">{selectedEvent.status}</p>
                                </div>
                              </Popup>
                            </Marker>
                          </MapContainer>
                        </div>
                        <div className="flex items-center justify-between text-sm text-white/80 mt-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {selectedEvent.coordinates.latitude.toFixed(2)}°N
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {selectedEvent.coordinates.longitude.toFixed(2)}°E
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-white/80 py-8">
                    Select an event to see detailed information
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 
