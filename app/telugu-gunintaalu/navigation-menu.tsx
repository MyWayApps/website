"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, Gamepad2, Search, Puzzle, ArrowLeft, Home } from "lucide-react"

const menuItems = [
  {
    href: "/telugu-gunintaalu/learn",
    label: "గుణింతాలు నేర్చుకుందాం",
    icon: BookOpen,
    color: "from-yellow-100 to-yellow-300 hover:from-yellow-200 hover:to-yellow-400",
    textColor: "text-yellow-800"
  },
  {
    href: "/telugu-gunintaalu/sequence",
    label: "వరుసలో పెడదాం",
    icon: Gamepad2,
    color: "from-teal-100 to-teal-300 hover:from-teal-200 hover:to-teal-400",
    textColor: "text-teal-700"
  },
  {
    href: "/telugu-gunintaalu/missing",
    label: "ఖాళీని పూరించు",
    icon: Search,
    color: "from-teal-100 to-teal-300 hover:from-teal-200 hover:to-teal-400",
    textColor: "text-teal-700"
  },
  {
    href: "/telugu-gunintaalu/match",
    label: "జంట వెతుకు",
    icon: Puzzle,
    color: "from-yellow-100 to-yellow-300 hover:from-yellow-200 hover:to-yellow-400",
    textColor: "text-yellow-700"
  }
]

export default function NavigationMenu() {
  const pathname = usePathname()

  const handleBackToHome = () => {
    window.location.href = "/#telugu"
  }

  return (
    <nav className="w-full bg-white/90 backdrop-blur-sm shadow-lg border-b-2 border-indigo-200 mb-6">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Back to Home Button */}
          <Button
            onClick={handleBackToHome}
            className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-indigo-300 font-bold px-4 py-2"
            variant="outline"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>

          {/* Navigation Menu Items */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname?.startsWith(item.href)
              
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`
                      px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2
                      ${isActive 
                        ? `bg-gradient-to-r ${item.color} shadow-md scale-105 ${item.textColor} font-bold` 
                        : `bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:${item.textColor}`
                      }
                    `}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? '' : 'opacity-70'}`} />
                    <span className="text-sm font-semibold whitespace-nowrap">{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* App Title */}
          <div className="text-indigo-800 font-bold text-lg hidden md:block">
            గుణింతాలు
          </div>
        </div>
      </div>
    </nav>
  )
}

