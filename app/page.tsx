"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Telescope, Globe, Satellite, Info, Star, Newspaper, GraduationCap } from "lucide-react"

export default function HomePage() {
  const tools = [
    {
      title: "Celestial Event Predictor",
      description: "AI-powered predictions for celestial events like meteor showers, eclipses, and more.",
      icon: Telescope,
      href: "/celestial-predictor",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      title: "Earth Events",
      description: "Track natural events occurring on Earth, from volcanic activity to storms.",
      icon: Globe,
      href: "/earth-events",
      gradient: "from-emerald-500 to-green-600"
    },
    {
      title: "ISS Tracker",
      description: "Real-time tracking of the International Space Station with path visualization.",
      icon: Satellite,
      href: "/satellites",
      gradient: "from-orange-500 to-red-600"
    },
    {
      title: "Space News",
      description: "Latest news and updates from the space industry and astronomical discoveries.",
      icon: Newspaper,
      href: "/space-news",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "Learning Area",
      description: "Interactive space learning modules covering the solar system, stars, telescopes, and more.",
      icon: GraduationCap,
      href: "/learning",
      gradient: "from-pink-500 to-rose-600"
    }
  ]

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Telescope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">StarCast</h1>
              <p className="text-white/80 text-sm">Space Tools</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Explore Our Space Tools</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <Card className="h-full bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 ease-out transform hover:scale-[1.02] hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4`}>
                      <tool.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{tool.title}</h3>
                    <p className="text-white/80 text-sm">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* About Section */}
          <div className="mt-24 text-center">
            <Link href="/about">
              <Card className="h-full bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 ease-out transform hover:scale-[1.02] hover:-translate-y-1 inline-block w-full">
                <CardContent className="p-6 flex flex-col items-center justify-center h-[156px]">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                  <p className="text-white/60 text-sm">Click to learn more about StarCast</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="mt-12 text-center">
            <p className="text-white/60 text-sm">
              More tools coming soon! Stay tuned for updates.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
