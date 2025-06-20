"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Home, Globe, Satellite, Star, Telescope, Newspaper, GraduationCap } from "lucide-react"
import { usePathname } from "next/navigation"
import React from "react"

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/celestial-predictor", label: "Celestial Event Predictor", icon: Telescope },
    { href: "/earth-events", label: "Earth Events", icon: Globe },
    { href: "/satellites", label: "ISS Tracker", icon: Satellite },
    { href: "/space-news", label: "Space News", icon: Newspaper },
    { href: "/learning", label: "Learning Area", icon: GraduationCap },
  ]

  return (
    <nav className="fixed top-6 right-6 z-50">
      <div className="bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-lg py-2 px-3">
        <div className="flex items-center gap-3">
          {navItems.map((item, index) => (
            <React.Fragment key={item.href}>
              {index > 0 && <div className="h-4 w-px bg-white/20" />}
              <Link 
                href={item.href} 
                className="relative text-white/80 hover:text-white transition-colors py-2 px-3 text-sm font-medium flex items-center gap-2 group"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {pathname === item.href && (
                  <div className="absolute inset-0 bg-white/10 rounded-full -z-10 transition-all duration-200 ease-out" />
                )}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-full -z-10 transition-all duration-200 ease-out" />
              </Link>
            </React.Fragment>
          ))}
          
          {session ? (
            <>
              <div className="h-4 w-px bg-white/20" />
              <Link 
                href="/saved-events" 
                className={`relative text-white/80 hover:text-white transition-colors py-2 px-3 text-sm font-medium group ${
                  pathname === "/saved-events" ? "text-white" : ""
                }`}
              >
                Saved Events
                {pathname === "/saved-events" && (
                  <div className="absolute inset-0 bg-white/10 rounded-full -z-10 transition-all duration-200 ease-out" />
                )}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-full -z-10 transition-all duration-200 ease-out" />
              </Link>
              <div className="h-4 w-px bg-white/20" />
              <Button 
                onClick={() => signOut()} 
                variant="ghost" 
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <div className="h-4 w-px bg-white/20" />
              <Button 
                onClick={() => signIn("google")} 
                variant="ghost" 
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
} 
