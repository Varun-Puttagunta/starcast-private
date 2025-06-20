import { SpaceNews } from "@/components/space-news"
import { Newspaper } from "lucide-react"

export default function SpaceNewsPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Space News</h1>
              <p className="text-white/80 text-sm">Latest updates from the space industry</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SpaceNews />
      </main>
    </div>
  )
} 
