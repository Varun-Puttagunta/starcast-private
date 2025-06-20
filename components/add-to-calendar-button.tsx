"use client"

import { Button } from "./ui/button"
import { Calendar } from "lucide-react"

interface AddToCalendarButtonProps {
  eventName: string
  description: string
  startDate: string
  duration: string
}

export function AddToCalendarButton({
  eventName,
  description,
  startDate,
  duration
}: AddToCalendarButtonProps) {
  const formatGoogleCalendarDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '')
  }

  const getEndDate = (startDateStr: string, durationStr: string) => {
    const startDate = new Date(startDateStr)
    const durationMatch = durationStr.match(/(\d+)\s*(hour|min|minutes?|hours?)/i)
    
    if (durationMatch) {
      const value = parseInt(durationMatch[1])
      const unit = durationMatch[2].toLowerCase()
      
      if (unit.startsWith('hour')) {
        startDate.setHours(startDate.getHours() + value)
      } else if (unit.startsWith('min')) {
        startDate.setMinutes(startDate.getMinutes() + value)
      }
    }
    
    return startDate
  }

  const handleGoogleCalendar = () => {
    const endDate = getEndDate(startDate, duration)
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&details=${encodeURIComponent(description)}&dates=${formatGoogleCalendarDate(startDate)}/${formatGoogleCalendarDate(endDate.toISOString())}`
    window.open(url, '_blank')
  }

  const handleOutlookCalendar = () => {
    const endDate = getEndDate(startDate, duration)
    const url = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventName)}&body=${encodeURIComponent(description)}&startdt=${startDate}&enddt=${endDate.toISOString()}`
    window.open(url, '_blank')
  }

  const handleICalendar = () => {
    const endDate = getEndDate(startDate, duration)
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${eventName}`,
      `DESCRIPTION:${description}`,
      `DTSTART:${formatGoogleCalendarDate(startDate)}`,
      `DTEND:${formatGoogleCalendarDate(endDate.toISOString())}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n')

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = `${eventName.toLowerCase().replace(/\s+/g, '-')}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="flex-1 bg-purple-900/50 border-purple-400/50 text-purple-100 hover:bg-purple-800 hover:text-white hover:border-purple-300"
        onClick={handleGoogleCalendar}
      >
        <Calendar className="h-4 w-4 mr-2 text-purple-200" />
        Google Calendar
      </Button>
      <Button
        variant="outline"
        className="flex-1 bg-purple-900/50 border-purple-400/50 text-purple-100 hover:bg-purple-800 hover:text-white hover:border-purple-300"
        onClick={handleOutlookCalendar}
      >
        <Calendar className="h-4 w-4 mr-2 text-purple-200" />
        Outlook
      </Button>
      <Button
        variant="outline"
        className="flex-1 bg-purple-900/50 border-purple-400/50 text-purple-100 hover:bg-purple-800 hover:text-white hover:border-purple-300"
        onClick={handleICalendar}
      >
        <Calendar className="h-4 w-4 mr-2 text-purple-200" />
        iCal
      </Button>
    </div>
  )
} 
