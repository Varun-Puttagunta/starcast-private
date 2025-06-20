"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Newspaper, ChevronLeft, ChevronRight, ExternalLink, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface NewsArticle {
  id: string
  title: string
  url: string
  imageUrl: string
  newsSite: string
  summary: string
  publishedAt: string
}

export function SpaceNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  const ARTICLES_PER_PAGE = 6

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://api.spaceflightnewsapi.net/v4/articles/?limit=${ARTICLES_PER_PAGE}&offset=${(currentPage - 1) * ARTICLES_PER_PAGE}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        // Transform the data to match our interface
        const transformedArticles = data.results.map((article: any) => ({
          id: article.id,
          title: article.title,
          url: article.url,
          imageUrl: article.image_url,
          newsSite: article.news_site,
          summary: article.summary,
          publishedAt: article.published_at
        }))
        setArticles(transformedArticles)
        setError(null)
      } catch (error) {
        console.error("Error fetching space news:", error)
        setError(error instanceof Error ? error.message : 'Failed to load news')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [currentPage])

  const handleImageError = (articleId: string) => {
    setImageErrors(prev => new Set(prev).add(articleId))
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        return "Date unavailable"
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    } catch (error) {
      return "Date unavailable"
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(ARTICLES_PER_PAGE)].map((_, i) => (
          <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-md">
            <div className="h-48 bg-white/5 rounded-t-lg animate-pulse" />
            <CardHeader>
              <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse"></div>
              <div className="h-3 w-1/4 bg-white/10 rounded animate-pulse mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-white/10 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-md">
        <CardContent className="p-8 text-center">
          <Newspaper className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Error Loading News</h3>
          <p className="text-white/80">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-white/10 hover:bg-white/20"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card 
            key={article.id}
            className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group"
          >
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-white/5">
                {!article.imageUrl || imageErrors.has(article.id) ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/5 text-white/20">
                    <ImageIcon className="h-12 w-12 mb-2" />
                    <span className="text-sm">No image available</span>
                  </div>
                ) : (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105 rounded-md"
                    onError={() => handleImageError(article.id)}
                    loading={currentPage === 1 ? "eager" : "lazy"}
                  />
                )}
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardDescription className="text-white/60">
                    {formatDate(article.publishedAt)}
                  </CardDescription>
                  <CardDescription className="text-white/60">
                    {article.newsSite}
                  </CardDescription>
                </div>
                <CardTitle className="text-white group-hover:text-white/90 line-clamp-2">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 line-clamp-3">{article.summary}</p>
                <div className="mt-4 flex items-center text-blue-400 text-sm">
                  Read more <ExternalLink className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </a>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-white/80 font-semibold mx-2 select-none">Page {currentPage}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 
