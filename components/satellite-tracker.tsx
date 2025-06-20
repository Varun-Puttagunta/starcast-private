"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Satellite, MapPin, Clock, Compass, ArrowUp, Users, Route, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { getCelestialEvents } from "@/lib/celestial-data"

// Fix for default marker icons in react-leaflet
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface ISSPosition {
  latitude: number
  longitude: number
  timestamp: number
}

interface Astronaut {
  name: string
  craft: string
}

interface ISSData {
  position: ISSPosition | null
  crew: Astronaut[]
}

interface TrackingInfo {
  start: {
    latitude: number
    longitude: number
    timestamp: number
  } | null
  change: {
    latitude: number
    longitude: number
    timeDiff: number
  } | null
}

export function SatelliteTracker() {
  const [issData, setISSData] = useState<ISSData>({
    position: null,
    crew: []
  })
  const [error, setError] = useState<string | null>(null)
  const [showPath, setShowPath] = useState(false)
  const [pathPositions, setPathPositions] = useState<[number, number][]>([])
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo>({
    start: null,
    change: null
  })
  const [userLat, setUserLat] = useState<string>("")
  const [userLng, setUserLng] = useState<string>("")
  const [locationLoading, setLocationLoading] = useState(false)
  const [nextISSPass, setNextISSPass] = useState<{ date: string, time: string, azimuth?: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [calcLog, setCalcLog] = useState<string[]>([])
  const [showLog, setShowLog] = useState(false)

  const togglePath = () => {
    setShowPath(!showPath)
    if (!showPath && issData.position) {
      // Starting to track
      setTrackingInfo({
        start: issData.position,
        change: null
      })
    } else {
      // Stopping tracking
      setTrackingInfo({
        start: null,
        change: null
      })
    }
  }

  const fetchISSData = async () => {
    try {
      const response = await fetch('/api/iss')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch ISS data')
      }

      setISSData({
        position: data.position,
        crew: data.crew
      })

      // Update tracking info if path is being shown
      if (showPath && trackingInfo.start) {
        setTrackingInfo(prev => ({
          start: prev.start,
          change: {
            latitude: data.position.latitude - prev.start!.latitude,
            longitude: data.position.longitude - prev.start!.longitude,
            timeDiff: data.position.timestamp - prev.start!.timestamp
          }
        }))
      }

      // Add new position to path
      setPathPositions(prev => {
        const newPath = [...prev, [data.position.latitude, data.position.longitude] as [number, number]]
        return newPath.slice(-50) as [number, number][]
      })

      setError(null)
    } catch (err) {
      setError('Failed to fetch ISS data')
      console.error('Error fetching ISS data:', err)
    }
  }

  const handleDetectLocation = () => {
    setLocationError(null)
    if (navigator.geolocation) {
      setLocationLoading(true)
      setCalcLog(log => [...log, "Detecting user location via browser geolocation..."])
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setUserLat(position.coords.latitude.toFixed(4))
          setUserLng(position.coords.longitude.toFixed(4))
          setLocationLoading(false)
          setCalcLog(log => [...log, `Location detected: lat ${position.coords.latitude}, lng ${position.coords.longitude}`])
          await fetchNextISSPass(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          setLocationError("Could not detect location.")
          setCalcLog(log => [...log, "Failed to detect location."])
          setLocationLoading(false)
        }
      )
    } else {
      setLocationError("Geolocation is not supported by your browser.")
      setCalcLog(log => [...log, "Geolocation not supported by browser."])
    }
  }

  const handleManualLocation = async () => {
    setLocationError(null)
    const lat = parseFloat(userLat)
    const lng = parseFloat(userLng)
    if (isNaN(lat) || isNaN(lng)) {
      setLocationError("Please enter valid coordinates.")
      setCalcLog(log => [...log, "Invalid manual coordinates entered."])
      return
    }
    setCalcLog(log => [...log, `Manual location set: lat ${lat}, lng ${lng}`])
    await fetchNextISSPass(lat, lng)
  }

  const fetchNextISSPass = async (lat: number, lng: number) => {
    setNextISSPass(null)
    setCalcLog(log => [...log, `Fetching celestial events for lat ${lat}, lng ${lng}...`])
    try {
      const events = await getCelestialEvents(lat, lng)
      setCalcLog(log => [...log, `Received ${events.length} events. Searching for next ISS pass...`])
      const nextPass = events.find(e => e.type === "iss_pass")
      if (nextPass) {
        setNextISSPass({ date: nextPass.date, time: nextPass.time, azimuth: nextPass.coordinates?.azimuth })
        setCalcLog(log => [...log, `Next ISS pass found: ${nextPass.date} at ${nextPass.time}, azimuth ${nextPass.coordinates?.azimuth?.toFixed(0)}°`])
      } else {
        setNextISSPass(null)
        setCalcLog(log => [...log, "No ISS pass found in the next 30 days."])
      }
    } catch (e) {
      setNextISSPass(null)
      setCalcLog(log => [...log, "Error fetching ISS pass."])
    }
  }

  useEffect(() => {
    fetchISSData()
    const interval = setInterval(fetchISSData, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatCoordinate = (value: number, type: 'latitude' | 'longitude') => {
    const direction = type === 'latitude' 
      ? (value >= 0 ? 'N' : 'S')
      : (value >= 0 ? 'E' : 'W')
    return `${Math.abs(value).toFixed(4)}° ${direction}`
  }

  const formatTimeDiff = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  function formatAzimuth(azimuth?: number) {
    if (azimuth === undefined) return "?"
    // Simple direction calculation
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"]
    const ix = Math.round(((azimuth % 360) / 45))
    return `${azimuth.toFixed(0)}° ${dirs[ix]}`
  }

  function formatLocalTime(date: string, time: string) {
    // date: YYYY-MM-DD, time: HH:mm
    try {
      const [year, month, day] = date.split("-").map(Number)
      const [hour, minute] = time.split(":").map(Number)
      const d = new Date(year, month - 1, day, hour, minute)
      return d.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })
    } catch {
      return `${date} ${time}`
    }
  }

  return (
    <div className="min-h-screen">
      {/* Persistent Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Satellite className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ISS Tracker</h1>
              <p className="text-white/80 text-sm">Track the International Space Station in Real-Time</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - ISS Information */}
          <div className="space-y-4">
            {error ? (
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Error Loading ISS Data</h3>
                  <p className="text-white/80">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-white/10 hover:bg-white/20"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* ISS Details Card */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">International Space Station</CardTitle>
                      <Badge className="bg-blue-500 text-white border-0">
                        Live Tracking
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!issData.position ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></span>
                        <div className="text-white/80 text-lg font-medium">Retrieving Data...</div>
                      </div>
                    ) : (
                      <>
                        <Button
                          onClick={togglePath}
                          className={`w-full transition-all duration-300 ease-out flex items-center justify-center gap-2 ${
                            showPath 
                              ? "bg-white/20 hover:bg-white/30 text-white border-0" 
                              : "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10"
                          }`}
                        >
                          <Route className="h-4 w-4" />
                          {showPath ? 'Stop Tracking Path' : 'Start Tracking Path'}
                        </Button>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm text-white/60">Latitude</div>
                            <div className="text-white flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {formatCoordinate(issData.position.latitude, 'latitude')}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-white/60">Longitude</div>
                            <div className="text-white flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {formatCoordinate(issData.position.longitude, 'longitude')}
                            </div>
                          </div>
                        </div>

                        {/* Tracking information */}
                        {showPath && trackingInfo.start && (
                          <div className="mt-4 p-4 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm">
                            <div className="text-sm font-medium text-white flex items-center gap-2 mb-4">
                              <Route className="h-4 w-4" />
                              Tracking Information
                            </div>
                            
                            <div className="space-y-4">
                              {/* Starting position */}
                              <div className="p-3 rounded bg-white/5">
                                <div className="text-sm font-medium text-white/80 mb-2">Starting Position</div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-white text-sm">
                                    Lat: {formatCoordinate(trackingInfo.start.latitude, 'latitude')}
                                  </div>
                                  <div className="text-white text-sm">
                                    Long: {formatCoordinate(trackingInfo.start.longitude, 'longitude')}
                                  </div>
                                </div>
                              </div>

                              {/* Current position */}
                              <div className="p-3 rounded bg-white/5">
                                <div className="text-sm font-medium text-white/80 mb-2">Current Position</div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-white text-sm">
                                    Lat: {formatCoordinate(issData.position!.latitude, 'latitude')}
                                  </div>
                                  <div className="text-white text-sm">
                                    Long: {formatCoordinate(issData.position!.longitude, 'longitude')}
                                  </div>
                                </div>
                              </div>

                              {/* Position change (subtract) */}
                              <div className="p-3 rounded bg-blue-500/10">
                                <div className="text-sm font-medium text-white/80 mb-2">Total Change</div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-white text-sm">
                                    Lat: {(issData.position!.latitude - trackingInfo.start.latitude).toFixed(4)}°
                                  </div>
                                  <div className="text-white text-sm">
                                    Long: {(issData.position!.longitude - trackingInfo.start.longitude).toFixed(4)}°
                                  </div>
                                </div>
                              </div>

                              {/* Time Elapsed */}
                              <div className="p-3 rounded bg-white/5">
                                <div className="text-sm font-medium text-white/80 mb-2">Time Elapsed</div>
                                <div className="text-white text-sm">
                                  {formatTimeDiff(issData.position!.timestamp - trackingInfo.start.timestamp)}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="text-sm text-white/60">Last Update</div>
                          <div className="text-white flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {new Date(issData.position.timestamp * 1000).toLocaleString()}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm text-white/60">Current Crew</div>
                          <div className="space-y-1">
                            {issData.crew.map((astronaut, index) => (
                              <div key={index} className="text-white flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {astronaut.name}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Location controls and ISS pass prediction */}
                        <div className="my-6 p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                            <Button
                              onClick={handleDetectLocation}
                              disabled={locationLoading}
                              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                            >
                              {locationLoading ? "Detecting..." : "Detect My Location"}
                            </Button>
                            <span className="text-white/60">or</span>
                            <input
                              type="number"
                              step="any"
                              placeholder="Latitude"
                              value={userLat}
                              onChange={e => setUserLat(e.target.value)}
                              className="px-3 py-2 rounded bg-black/30 border border-white/10 text-white w-32"
                            />
                            <input
                              type="number"
                              step="any"
                              placeholder="Longitude"
                              value={userLng}
                              onChange={e => setUserLng(e.target.value)}
                              className="px-3 py-2 rounded bg-black/30 border border-white/10 text-white w-32"
                            />
                            <Button
                              onClick={handleManualLocation}
                              className="bg-white/10 hover:bg-white/20 text-white"
                            >
                              Set Location
                            </Button>
                          </div>
                          {locationError && <div className="text-red-400 mb-2">{locationError}</div>}
                          {nextISSPass && (
                            <div className="text-white/80 mt-2">
                              <span className="font-semibold">Next ISS Pass:</span> {formatLocalTime(nextISSPass.date, nextISSPass.time)}
                              {typeof nextISSPass.azimuth === 'number' && (
                                <span className="ml-4">Direction: <span className="font-semibold">{formatAzimuth(nextISSPass.azimuth)}</span></span>
                              )}
                            </div>
                          )}
                          <div className="mt-4">
                            <button
                              className="text-xs text-blue-400 hover:underline mb-2"
                              onClick={() => setShowLog(v => !v)}
                            >
                              {showLog ? "Hide Calculation Log" : "Show Calculation Log"}
                            </button>
                            {showLog && (
                              <div className="bg-black/40 border border-white/10 rounded p-2 text-xs text-white/70 max-h-40 overflow-y-auto">
                                {calcLog.map((line, i) => (
                                  <div key={i} className="font-mono whitespace-pre-wrap">{line}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Right Column - Map */}
          <div className="space-y-4">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardContent className="p-0">
                <div className="h-[600px] rounded-lg overflow-hidden">
                  {!issData.position ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className="block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></span>
                      <div className="text-white/80 text-lg font-medium">Retrieving Data...</div>
                    </div>
                  ) : (
                    <MapContainer
                      center={[issData.position.latitude, issData.position.longitude]}
                      zoom={3}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                      />
                      {showPath && pathPositions.length > 1 && (
                        <Polyline
                          positions={pathPositions}
                          color="#3b82f6"
                          weight={2}
                          opacity={0.7}
                        />
                      )}
                      <Marker
                        position={[issData.position.latitude, issData.position.longitude]}
                        icon={icon}
                      >
                        <Popup>
                          <div className="text-black">
                            <h4 className="font-semibold">International Space Station</h4>
                            <p>Current Position</p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 
