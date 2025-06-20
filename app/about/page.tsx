"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Github, Mail, Star } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">About StarCast</h1>
              <p className="text-white/80 text-sm">Learn more about the project</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Created by Varun Puttagunta</h2>
                
              </div>

              <div className="grid gap-8 mt-12">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">About the Project</h3>
                  <p className="text-white/80 leading-relaxed">
                  StarCast is a data visulization project the combines multiple space related tools in one place.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
                  <ul className="list-disc list-inside text-white/80 space-y-2">
                    <li>Celestial Event Predictor</li>
                    <li>Earth Events from Nasa API</li>
                    <li>Location of ISS</li>
                    <li>Tracking and calculating change of the ISS</li>
                    <li>User Accounts to save favorite events</li>
                    <li>Add events to calander</li>
                  </ul>
                </div>

                
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 
