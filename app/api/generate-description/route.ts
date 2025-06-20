import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "AIzaSyBUtlziJBSiUuYh0L4Xvfnv9CIsiPc4eyE")

export async function POST(request: Request) {
  try {
    const { eventTitle, eventCategory, eventDate, eventStatus, coordinates } = await request.json()

    const prompt = `Generate a detailed, engaging description for this natural event:

Event: ${eventTitle}
Category: ${eventCategory}
Date: ${eventDate}
Status: ${eventStatus}
Location: ${coordinates.latitude}, ${coordinates.longitude}

Please provide:
1. A brief explanation of what this type of event is
2. Potential impacts and significance
3. Interesting facts about this specific event or location
4. Any relevant safety information

Keep it informative but accessible to the general public. Limit to 2-3 paragraphs.`

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const description = response.text() || "Unable to generate description."

    return NextResponse.json({ description })
  } catch (error) {
    console.error("Error generating description:", error)
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    )
  }
} 
