import { ImportCircle, ExportCircle } from "iconsax-react";

const CardTransaction = [
  { label: "Transfer to Ruth", date: "Fri, Apr 18, 2025 • 7:32PM", amount: "-$7.64", credit: false },
  { label: "Wallet to wallet", date: "Sat, Mar 2, 2025 • 8:12AM", amount: "-$14", credit: false },
  { label: "Transfer from Tochukwu", date: "Tue, Feb 7, 2025 • 11:50PM", amount: "$850.89", credit: true },
]

export default function CardPanel() {
    return (
    <div>
      
        <div className="w-fit h-fill grow max-w-121.5">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-sm font-semibold text-foreground mb-4 font-geist">Cards</p>

          {/* visa card */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl p-4 text-white mb-4">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs opacity-80 font-geist">Prepaid card</span>
              <span className="font-bold text-lg">VISA</span>
            </div>
            <div className="mb-4">
              <p className="text-sm opacity-80 font-geist">•••• •••• •••• 7093</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-60 font-geist">VALID THRU</p>
                <p className="text-sm font-medium font-geist">08/27</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold font-geist ">$3,048.00</p>
                <p className="text-xs opacity-80 font-geist">Emmanuel Israel</p>
              </div>
            </div>
          </div> 

          <div className="w-ful h-fit">
            <div className="flex items-center justify-between mb-3 pt-4">
            <p className="text-sm font-semibold text-foreground">
              Card transactions
            </p>
            <button className="text-xs text-brand font-medium">
              See all
            </button>
          </div>
 
          {CardTransaction.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2.5 border-b border-gray-50 w-fill h-fit">
              <div className="flex items-center gap-3 py-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${item.credit ? "bg-green-50" : "bg-orange-50"}`}
                >
                  {item.credit
                    ? <ImportCircle size={14} color="#16a34a" variant="Linear" />
                    : <ExportCircle size={14} color="#F97316" variant="Linear" />
                  }
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground font-geist">{item.label}</p>
                  <p className="text-xs text-gray-400 font-geist">{item.date}</p>
                </div>
              </div>
              <p className={`text-sm font-semibold ${item.credit ? "text-green-600" : "text-foreground"}`}>
                {item.amount}
              </p>
            </div>
          ))}
          </div>

          <div className="mt-7 w-116.5 h-62.4">
            <div className="flex items-center justify-between mb-10">
              <p className="text-sm font-semibold text-foreground">
                Card transaction flows
              </p>
              <p className="text-sm font-bold text-green-600 font-space-grotesk">+$3,048.00</p>
            </div>

            <div className="mb-9 px-4">
              <div className="flex justify-between mb-1">
                <p className="text-xs text-black-400">Money in</p>
                <p className="text-xs font-medium">$4,046.00</p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full w-full">
                <div className="h-2 bg-green-500 rounded-full w-3/4 " />
              </div>
            </div>

            <div className="mb-9 px-4">
              <div className="flex justify-between mb-1">
                <p className="text-xs text-black-400">Money out</p>
                <p className="text-xs font-medium">$1,046.00</p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full w-full ">
                <div className="h-2 bg-brand rounded-full w-1/4" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
)}