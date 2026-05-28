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
  ArrowDown2,
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
    <aside className="max-w-65 min-h-screen bg-white border-r border-gray-100 flex flex-col py-6 px-4">
      <div className="mb-10 px-2">
        <Image 
        src="/images/logo.png"
        alt="Company's Logo"
        width={108}
        height={44}
        className="w-auto h-auto"
        loading="eager"
        />
      </div>
      
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const IconComponent = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? "bg-gray-100 text-brand": "text-gray-500 hover:bg-gray-50 hover:text-foreground"}`}
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

      <div className="mt-auto">
        <Link
          href="/dashboard/support"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <MessageQuestion size={18} variant="Linear" color="#6b7280" />
          <span>Support</span>
        </Link>
        <div className="flex items-center max-w-57 h-16 p-[10px_12px] rounded-[15px] border border-[#E4E4E7] shadow-[0px_2px_2px_0px_#2323230D] gap-[10px]" >
          <div className="flex items-center gap-3">
          <div className="w-11 h-11 relative shrink-0">
            <Image 
              src="/images/profile.jpg"
              alt="Emmanuel Israel"
              fill
              sizes="44px"
              loading="eager"
              className="rounded-[28px] w-auto h-auto object-cover"
            />
          </div>
          <div className="flex items-center flex-col">
            <p className="text-[14px] font-semibold text-[#1F1F1F] leading-tight">
              Emmanuel Israel
            </p>
            <p className="max-w-30 overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-normal leading-[120%] text-[#666666]">
              emmanuel.e.israel@gmail.com
            </p>
          </div>
          <div>
            <ArrowDown2 size={12} variant="Linear" color="#8C8C8C" />
          </div>
        </div>
        
        
        </div>
        
      </div>

    </aside>
  )
}