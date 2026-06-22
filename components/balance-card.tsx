"use client"

import { useState } from "react"
import {
    Eye,
    WalletMinus,
    WalletAdd1,
    ImportCircle
} from "iconsax-react"
type FXTab = "bought" | "sold" | "others"


export default function BalanceCard() {
  const [activeTab, setActiveTab] = useState<FXTab>("bought")
  const [balanceVisible, setBalanceVisible] = useState(true)

  return (
        <div className="wit-full h-fit bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {(["bought", "sold", "others"] as FXTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm px-4 py-1.5 rounded-full border transition-colors capitalize
                    ${activeTab === tab
                      ? "border-brand text-brand bg-orange-50"
                      : "border-gray-200 text-black-400 hover:border-gray-300"
                    }`}
                >
                  FX {tab}
                </button>
              ))}
            </div>

            {/* currency */}
            <div className="flex items-center gap-2 bg-gray-800 text-white text-sm px-3 py-1.5 rounded-full">
              <span>🇺🇸</span> 
              <span>USD</span>
            </div>
          </div>

          <div className="min-w-[590] mb-6">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-black-400">Total FX units</p>
              <button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="text-black-400 hover:text-foreground transition-colors"
              >
                <Eye size={16} color="#697698" variant="Linear" />
              </button>
            </div>
            <p className="text-3xl font-bold text-foreground font-space-grotesk ">
              {balanceVisible ? "$ 67,048.00" : "$ ••••••"}
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-brand hover:bg-orange-50 transition-colors max-w-[80px] max-h-[80px]">
              <WalletMinus size={20} color="#697698" variant="Linear" />
              <span className="text-xs text-black-400 font-medium">Buy FX</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-brand hover:bg-orange-50 transition-colors max-w-[80px] max-h-[80px]">
              <WalletAdd1 size={20} color="#697698" variant="Linear" />
              <span className="text-xs text-black-400 font-medium">Sell FX</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-brand hover:bg-orange-50 transition-colors max-w-[80px] max-h-[80px]">
              <ImportCircle size={20} color="#697698" variant="Linear" />
              <span className="text-xs text-black-400 font-medium">Receive money</span>
            </button>
          </div>
        </div>
  )
}