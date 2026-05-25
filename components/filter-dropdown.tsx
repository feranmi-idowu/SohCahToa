"use client"

import { useState } from "react"

type FilterOption = {
  label: string
  value: string
  color?: string
}

type Props = {
  value: string
  onChange: (value: string) => void
  options: FilterOption[]
  placeholder?: string
}

export default function FilterDropdown({
  value,
  onChange,
  options,
  placeholder = "See all",
}: Props) {
  const [showMenu, setShowMenu] = useState(false)

  const activeOption = options.find((o) => o.value === value)
  const isFiltered = value !== "all"

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition-colors
          ${isFiltered
            ? "border-brand text-brand bg-orange-50"
            : "border-gray-200 text-gray-500 hover:border-brand hover:text-brand"
          }`}
      >
        {isFiltered ? `${activeOption?.label}` : placeholder}
        <span className="text-[10px]">▾</span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />

          <div className="absolute right-0 top-8 z-20 bg-white border border-gray-100 rounded-xl shadow-lg p-1 min-w-[140px]">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setShowMenu(false)
                }}
                className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors
                  ${value === option.value
                    ? "bg-orange-50 text-brand font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-foreground"
                  }`}
              >
                {option.color && (
                  <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${option.color}`} />
                )}
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}

    </div>
  )
}