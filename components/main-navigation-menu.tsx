"use client"

import { Calculator, Globe, LifeBuoy, Gamepad2, Microscope, Landmark, LucideIcon } from "lucide-react"

interface MenuItem {
  label: string
  icon: LucideIcon | string
  href: string
  color: string
  isTextIcon?: boolean
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
    isTextIcon: true
  },
  {
    label: "Hindi",
    icon: "अ",
    href: "#hindi",
    color: "text-orange-500",
    isTextIcon: true
  },
  {
    label: "Kannada",
    icon: "ಅ",
    href: "#kannada",
    color: "text-amber-600",
    isTextIcon: true
  },
  {
    label: "Tamil",
    icon: "அ",
    href: "#tamil",
    color: "text-fuchsia-600",
    isTextIcon: true
  },
  {
    label: "Malayalam",
    icon: "അ",
    href: "#malayalam",
    color: "text-cyan-600",
    isTextIcon: true
  },
  {
    label: "Sanskrit",
    icon: "ॐ",
    href: "#sanskrit",
    color: "text-amber-700",
    isTextIcon: true
  },
  {
    label: "English",
    icon: Globe,
    href: "#english",
    color: "text-purple-500"
  },
  {
    label: "Science",
    icon: Microscope,
    href: "#science",
    color: "text-emerald-600"
  },
  {
    label: "Social Studies",
    icon: Landmark,
    href: "#social-studies",
    color: "text-indigo-500"
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
  }
]

export default function MainNavigationMenu() {
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
    <nav
      className="w-44 shrink-0 sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto bg-white/15 backdrop-blur-md border-2 border-white/30 rounded-3xl shadow-lg p-3 flex flex-col gap-2"
      style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}
    >
      {menuItems.map((item) => {
        const isTextIcon = item.isTextIcon || false
        const isIconString = typeof item.icon === 'string'
        const Icon = isIconString ? null : (item.icon as LucideIcon)
        const textIcon = isIconString ? (item.icon as string) : null

        return (
          <button
            key={item.href}
            onClick={() => handleCategoryClick(item.href)}
            className={`
              w-full px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3
              bg-white/70 hover:bg-white/90 backdrop-blur-sm
              ${item.color} font-bold shadow-sm hover:shadow-md
            `}
            style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif', fontSize: '16px' }}
          >
            {isTextIcon && textIcon ? (
              <span className="text-xl">{textIcon}</span>
            ) : Icon ? (
              <Icon className="h-5 w-5" />
            ) : null}
            <span className="whitespace-nowrap">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
