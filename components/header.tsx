import Image from "next/image"

import { SearchNormal1, Notification } from "iconsax-react"

export default function Header() {
  return (
    <div className="flex items-center justify-between max-w-295  mb-6 bg-[#FAFAFA]">
      <div className="pl-2 m-4  flex items-center gap-3">
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
        <div>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            Good morning <span role="img" aria-label="sunny">🌤️</span>
          </p>
          <h1 className="text-xl font-bold text-foreground leading-tight">
            Emmanuel Israel
          </h1>
        </div>
      </div>

      <div className="flex items-center w-79.5 h-11 gap-4">
        <div className="max-w-63.5 relative flex items-center">
          <SearchNormal1 
          size={24} color="#8C8C8C" variant="Linear"
          className="absolute left-3 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="pl-9 pr-12 py-2 w-64 bg-transparent border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 font-geist"
          />
          <span className="absolute right-3 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 font-geist">
            ⌘K
          </span>
        </div>
        <button className=" text-gray-500 hover:text-gray-700 transition-colors rounded-[10px] px-2.5 py-1.5 border ">
          <Notification 
          size={24} color="#232323" variant="Linear"
          className="w-5 h-5" />
        </button>
      </div>

    </div>
  )
}