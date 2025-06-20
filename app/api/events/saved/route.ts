import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        savedEvents: {
          orderBy: {
            eventDate: "asc",
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user.savedEvents)
  } catch (error) {
    console.error("Error fetching saved events:", error)
    return NextResponse.json(
      { error: "Failed to fetch saved events" },
      { status: 500 }
    )
  }
} 
