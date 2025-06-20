import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch ISS position
    const positionResponse = await fetch('http://api.open-notify.org/iss-now.json')
    const positionData = await positionResponse.json()

    // Fetch crew data
    const crewResponse = await fetch('http://api.open-notify.org/astros.json')
    const crewData = await crewResponse.json()

    // Combine the data
    const data = {
      position: {
        latitude: parseFloat(positionData.iss_position.latitude),
        longitude: parseFloat(positionData.iss_position.longitude),
        timestamp: positionData.timestamp
      },
      crew: crewData.people.filter((person: any) => person.craft === "ISS")
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching ISS data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ISS data' },
      { status: 500 }
    )
  }
} 
