"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Calculator, Globe, LifeBuoy, Gamepad2, Puzzle, LucideIcon } from "lucide-react"

interface MenuItem {
  label: string
  icon: LucideIcon | string
  href: string
  color: string
  isTelugu?: boolean
}

const menuItems: MenuItem[] = [
  {
    label: "Math",
    icon: Calculator,
    href: "#math",
    color: "text-blue-500"
  },
  {
    label: "Telugu",
    icon: "అ",
    href: "#telugu",
    color: "text-green-500",
    isTelugu: true
  },
  {
    label: "English",
    icon: Globe,
    href: "#english",
    color: "text-purple-500"
  },
  {
    label: "Life Skills",
    icon: LifeBuoy,
    href: "#life-skills",
    color: "text-amber-500"
  },
  {
    label: "Games",
    icon: Gamepad2,
    href: "#games-section",
    color: "text-pink-500"
  },
  {
    label: "Puzzles",
    icon: Puzzle,
    href: "#puzzles-section",
    color: "<text-teal-5></text-teal-5>00"
  }
]

export default function MainNavigationMenu() {
  const pathname = usePathname()

  const handleCategoryClick = (href: string) => {
    // Try to find element by the href
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      // If direct href doesn't work, try to find by subcategory text
      const subcategoryElements = document.querySelectorAll('h3')
      subcategoryElements.forEach((el) => {
        if (el.textContent?.toLowerCase().includes(href.replace('#', '').replace('-', ' '))) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    }
  }

  return (
    <nav className="w-full bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 backdrop-blur-sm shadow-lg border-b-2 border-blue-400 mb-6 sticky top-0 z-50" style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {menuItems.map((item) => {
            const isTelugu = item.isTelugu || false
            const Icon = typeof item.icon === 'string' ? null : item.icon
            
            return (
              <button
                key={item.href}
                onClick={() => handleCategoryClick(item.href)}
                className={`
                  px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-3
                  bg-white/60 hover:bg-white/80 backdrop-blur-sm
                  ${item.color} font-bold shadow-md hover:shadow-lg
                `}
                style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif', fontSize: '18px' }}
              >
                {isTelugu ? (
                  <span className="text-2xl">{item.icon}</span>
                ) : Icon ? (
                  <Icon className="h-5 w-5" />
                ) : null}
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

