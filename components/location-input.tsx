"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Locate } from "lucide-react"
import { GEOCODING_API_BASE_URL } from "@/lib/api-config"

interface Location {
  lat: number
  lng: number
  name: string
}

interface LocationSuggestion {
  display_name: string
  lat: string
  lon: string
  type: string
  class: string
  address: {
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
    county?: string
    suburb?: string
    municipality?: string
  }
}

interface LocationInputProps {
  onLocationSelect: (location: Location) => void
  onDetectLocation: () => void
}

export function LocationInput({ onLocationSelect, onDetectLocation }: LocationInputProps) {
  const [locationInput, setLocationInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceTimeout = useRef<NodeJS.Timeout | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)

  const formatLocationName = (suggestion: LocationSuggestion) => {
    const addr = suggestion.address;
    const parts = [];

    // Add the main place name (city, town, village, etc.)
    const mainPlace = addr.city || addr.town || addr.village || addr.municipality || addr.suburb;
    if (mainPlace) parts.push(mainPlace);

    // Add county/state if different from main place
    if (addr.county && addr.county !== mainPlace) parts.push(addr.county);
    if (addr.state && addr.state !== addr.county) parts.push(addr.state);

    // Always add country
    if (addr.country) parts.push(addr.country);

    return parts.join(", ");
  }

  const fetchSuggestions = async (input: string) => {
    if (!input.trim() || input.length < 2) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      // First try with strict city search
      let response = await fetch(
        `${GEOCODING_API_BASE_URL}/search?q=${encodeURIComponent(input)}&format=json&limit=5&addressdetails=1&featuretype=city`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'StarCast Weather App'
          }
        }
      )

      let data = await response.json()
      
      // If no results, try a more general search
      if (data.length === 0) {
        response = await fetch(
          `${GEOCODING_API_BASE_URL}/search?q=${encodeURIComponent(input)}&format=json&limit=5&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'en',
              'User-Agent': 'StarCast Weather App'
            }
          }
        )
        data = await response.json()
      }

      // Filter and process results
      const validResults = data.filter((place: LocationSuggestion) => {
        const addr = place.address;
        return addr && (
          addr.city || addr.town || addr.village || addr.municipality || 
          addr.suburb || addr.county || addr.state
        );
      });

      // Sort results by relevance
      const sortedResults = validResults.sort((a: LocationSuggestion, b: LocationSuggestion) => {
        const aName = formatLocationName(a).toLowerCase();
        const bName = formatLocationName(b).toLowerCase();
        const query = input.toLowerCase();
        
        // Exact matches first
        if (aName.startsWith(query) && !bName.startsWith(query)) return -1;
        if (!aName.startsWith(query) && bName.startsWith(query)) return 1;
        
        // Then by string length (shorter names are usually more relevant)
        return aName.length - bName.length;
      });

      setSuggestions(sortedResults.slice(0, 5));
      setError(null)
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      setError('Error fetching location suggestions. Please try again.')
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    if (locationInput.trim()) {
      debounceTimeout.current = setTimeout(() => {
        fetchSuggestions(locationInput)
      }, 300)
    } else {
      setSuggestions([])
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [locationInput])

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    onLocationSelect({
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
      name: formatLocationName(suggestion)
    })
    setLocationInput("")
    setSuggestions([])
    setShowSuggestions(false)
  }

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1 relative" ref={inputRef}>
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            type="text"
            placeholder="Enter location (e.g., New York, Paris)"
            value={locationInput}
            onChange={(e) => {
              setLocationInput(e.target.value)
              setShowSuggestions(true)
              setError(null)
            }}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/60"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute w-full z-50 mt-1 py-2 bg-background border border-white/10 rounded-lg shadow-lg">
              {suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion.display_name}-${suggestion.lat}-${suggestion.lon}-${index}`}
                  className="px-4 py-2 hover:bg-white/10 cursor-pointer text-white/80 hover:text-white transition-colors"
                  onClick={() => handleLocationSelect(suggestion)}
                >
                  {formatLocationName(suggestion)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button
          onClick={() => {
            if (suggestions.length > 0) {
              handleLocationSelect(suggestions[0])
            }
          }}
          disabled={loading || !locationInput.trim() || suggestions.length === 0}
          className="bg-white/10 hover:bg-white/20 border-white/10"
        >
          {loading ? "..." : "Search"}
        </Button>
        <div className="h-full w-px bg-white/10"></div>
        <Button
          onClick={onDetectLocation}
          variant="outline"
          className="border-white/10 text-white bg-white/5 hover:bg-white/20 hover:text-white flex items-center gap-2 whitespace-nowrap"
        >
          <Locate className="h-4 w-4" />
          Use Current Location
        </Button>
      </div>

      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  )
}

