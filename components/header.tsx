import Image from "next/image"

import { SearchNormal1, Notification } from "iconsax-react"

export default function Header() {
  return (
    <div className="flex items-center justify-between w-full mb-6 bg-white">
      
      <div className="flex items-center gap-3">
        {/* profile avatar */}
        <div className="w-[44px] h-[44px] relative flex-shrink-0">
          <Image 
            src="/images/profile.jpg"
            alt="Emmanuel Israel"
            fill
            className="rounded-[28px] object-cover"
          />
        </div>

        <div>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            Good morning <span role="img" aria-label="sunny">🌤️</span>
          </p>
          <h1 className="text-xl font-bold text-foreground leading-tight">
            Emmanuel Israel
          </h1>
        </div>
      </div>

      {/* search bar and notification */}
      <div className="flex items-center gap-4">
        
        <div className="relative flex items-center">
          <SearchNormal1 
          size={20} color="#8C8C8C" variant="Linear"
          className="absolute left-3 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="pl-9 pr-12 py-2 w-64 bg-transparent border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
          />
          <span className="absolute right-3 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
            ⌘K
          </span>
        </div>

        {/* notification */}
        <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
          <Notification 
          size={20} color="#232323" variant="Linear"
          className="w-5 h-5" />
        </button>
      </div>

    </div>
  )
}