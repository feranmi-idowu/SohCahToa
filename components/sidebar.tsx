"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  Home,
  Calculator,
  Repeat,
  Card,
  MessageQuestion,
} from "iconsax-react"

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Calculator", href: "/dashboard/calculator", icon: Calculator },
  { label: "Transactions", href: "/dashboard/transactions", icon: Repeat },
  { label: "Cards", href: "/dashboard/cards", icon: Card },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col py-6 px-4">

      {/* logo */}
      <div className="mb-10 px-2">
        <Image 
        src="/images/logo.png"
        alt="Company's Logo"
        width={108}
        height={44}
        />
      </div>

      {/* nav items */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const IconComponent = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? "bg-gray-100 text-brand"
                  : "text-gray-500 hover:bg-gray-50 hover:text-foreground"
                }`}
            >
              <IconComponent
                size={18}
                variant={isActive ? "Bold" : "Linear"}
                color={isActive ? "#FF6813" : "#6b7280"}
              />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* bottom  */}
      <div className="mt-auto">
        <Link
          href="/dashboard/support"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <MessageQuestion size={18} variant="Linear" color="#6b7280" />
          <span>Support</span>
        </Link>
      </div>

    </aside>
  )
}