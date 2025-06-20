import { Metadata } from "next"
import { LearningModules } from "@/components/learning/learning-modules"
import { GraduationCap } from "lucide-react"

export const metadata: Metadata = {
  title: "Learning Area - StarCast",
  description: "Interactive space learning modules covering various astronomy topics",
}

export default function LearningPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-white/10">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Space Learning</h1>
              <p className="text-white/80 text-sm">Interactive lessons about space, astronomy, and space exploration</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Space Learning Modules</h2>
          <p className="text-lg text-white/80 text-center mb-12">
            Explore interactive lessons about space, astronomy, and space exploration
          </p>
          
          <LearningModules />
        </div>
      </main>
    </div>
  )
} 
