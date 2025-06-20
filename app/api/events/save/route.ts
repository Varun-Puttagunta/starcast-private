import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  console.log('POST - Session:', session?.user?.email)

  if (!session?.user?.email) {
    console.log('POST - No authenticated user found')
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const body = await req.json()
    console.log('POST - Raw request body:', body)

    const { eventId, eventName, eventDate, description, type } = body
    console.log('POST - Parsed event data:', { eventId, eventName, eventDate, description, type })

    // Validate required fields
    if (!eventId || !eventName || !eventDate || !type) {
      const missingFields = []
      if (!eventId) missingFields.push('eventId')
      if (!eventName) missingFields.push('eventName')
      if (!eventDate) missingFields.push('eventDate')
      if (!type) missingFields.push('type')

      console.error('POST - Missing required fields:', missingFields)
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate event type
    const validTypes = ["meteor_shower", "eclipse", "iss_pass", "planet_conjunction"]
    if (!validTypes.includes(type)) {
      console.error('POST - Invalid event type:', type)
      return NextResponse.json(
        { error: `Invalid event type '${type}'. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate date format
    const parsedDate = new Date(eventDate)
    if (isNaN(parsedDate.getTime())) {
      console.error('POST - Invalid date format:', eventDate)
      return NextResponse.json(
        { error: `Invalid date format: '${eventDate}'. Please provide a valid date string` },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      console.log('POST - User not found in database')
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log('POST - Found user:', user.id)

    // Check if event already exists
    console.log('POST - Checking for existing event:', { userId: user.id, eventId })
    try {
      const existingEvent = await prisma.savedEvent.findUnique({
        where: {
          userId_eventId: {
            userId: user.id,
            eventId,
          },
        },
      })

      console.log('POST - Existing event check result:', existingEvent)

      if (existingEvent) {
        console.log('POST - Event already saved:', existingEvent)
        return NextResponse.json(
          { error: "Event already saved" },
          { status: 409 }
        )
      }
    } catch (error) {
      console.error('POST - Error checking for existing event:', {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        query: {
          where: {
            userId_eventId: {
              userId: user.id,
              eventId,
            },
          },
        }
      })
      throw error
    }

    // Log the data we're about to save
    console.log('POST - Attempting to save event with data:', {
      eventId,
      eventName,
      eventDate: parsedDate,
      description,
      eventType: type,
      userId: user.id,
    })

    try {
      const savedEvent = await prisma.savedEvent.create({
        data: {
          eventId,
          eventName,
          eventDate: parsedDate,
          description,
          eventType: type,
          userId: user.id,
        },
      })

      console.log('POST - Event saved successfully:', savedEvent)
      return NextResponse.json(savedEvent)
    } catch (error) {
      console.error('POST - Error creating event:', {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        data: {
          eventId,
          eventName,
          eventDate: parsedDate,
          description,
          eventType: type,
          userId: user.id,
        }
      })
      throw error
    }
  } catch (error) {
    console.error("POST - Full error object:", error)

    // Handle Prisma-specific errors
    if ((error as any).code && (error as any).meta && (error as any).message) {
      console.error("POST - Prisma error details:", {
        code: (error as any).code,
        meta: (error as any).meta,
        message: (error as any).message,
      })

      // Handle specific Prisma error codes
      switch ((error as any).code) {
        case 'P2002':
          return NextResponse.json(
            { error: "This event has already been saved" },
            { status: 409 }
          )
        case 'P2003':
          return NextResponse.json(
            { error: "Database relation error. Please try again later." },
            { status: 500 }
          )
        default:
          return NextResponse.json(
            { error: `Database error: ${(error as any).message}` },
            { status: 500 }
          )
      }
    }

    // Handle validation errors
    if ((error as any).name === 'PrismaClientValidationError') {
      console.error("POST - Prisma validation error:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      })
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      )
    }

    // Handle unknown errors
    console.error("POST - Unknown error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  console.log('DELETE - Session:', session?.user?.email)

  if (!session?.user?.email) {
    console.log('DELETE - No authenticated user found')
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const { eventId } = await req.json()
    console.log('DELETE - Received eventId:', eventId)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      console.log('DELETE - User not found in database')
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log('DELETE - Found user:', user.id)

    try {
      await prisma.savedEvent.delete({
        where: {
          userId_eventId: {
            userId: user.id,
            eventId,
          },
        },
      })

      console.log('DELETE - Event deleted successfully')
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('DELETE - Error deleting event:', {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        query: {
          where: {
            userId_eventId: {
              userId: user.id,
              eventId,
            },
          },
        }
      })
      throw error
    }
  } catch (error) {
    console.error("DELETE - Error removing saved event:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: "Failed to remove saved event" },
      { status: 500 }
    )
  }
} 
