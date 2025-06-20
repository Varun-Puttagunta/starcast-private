import { Home, Calendar, Globe, Satellite, Star, Newspaper } from "lucide-react"

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Events",
    icon: Calendar,
    href: "/events",
    color: "text-violet-500",
  },
  {
    label: "Earth Events",
    icon: Globe,
    color: "text-emerald-500",
    href: "/earth-events",
  },
  {
    label: "ISS Tracker",
    icon: Satellite,
    color: "text-orange-500",
    href: "/iss-tracker",
  },
  {
    label: "Space News",
    icon: Newspaper,
    color: "text-blue-500",
    href: "/space-news",
  },
] 
