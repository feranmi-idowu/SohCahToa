"use client"

import { useState, useEffect } from "react"
import {
  ExportCircle,
  ImportCircle,
  Repeat,
} from "iconsax-react"
import { PaginatedTransactions } from "@/lib/types"

type Tab = "all" | "fx" | "pta" | "bta" | "medicals"

const TABS: { label: string; value: Tab }[] = [
  { label: "All", value: "all" },
  { label: "FX", value: "fx" },
  { label: "PTA", value: "pta" },
  { label: "BTA", value: "bta" },
  { label: "Medicals", value: "medicals" },
]

export default function TransactionTable() {
  const [data, setData] = useState<PaginatedTransactions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState<Tab>("all")

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: "5",
          status: "all",
        })
        const res = await fetch(`/api/transactions?${params}`)
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError("Failed to load transactions")
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [page])

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground">
          FX transactions
        </h2>
        <button className="text-xs text-black-400 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-brand hover:text-brand transition-colors">
          See all
        </button>
      </div>

      {/* tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value)
              setPage(1)
            }}
            className={`text-xs px-4 py-1.5 rounded-full border transition-colors
              ${activeTab === tab.value
                ? "border-brand text-brand bg-orange-50"
                : "border-gray-200 text-black-400 hover:border-gray-300"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* when the transaction is loading */}
      {loading && (
        <div className="py-12 text-center text-gray-400 text-sm">
          Loading transactions...
        </div>
      )}

      {/* handle error */}
      {error && (
        <div className="py-12 text-center text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* empty state when there is no transaction */}
      {!loading && !error && data?.transactions.length === 0 && (
        <div className="py-12 text-center text-gray-400 text-sm">
          No transactions found
        </div>
      )}

      {/* transaction list */}
      {!loading && !error && data && data.transactions.length > 0 && (
        <div className="flex flex-col gap-1">
          {data.transactions.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {/* Icon and details */}
              <div className="flex items-center gap-4">

                {/* Icon Circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                  ${txn.type === "credit" ? "bg-green-50"  : "bg-orange-50"} {txn.type === "debit" ? "bg-blue-50" }`} 
                >
                  {txn.status === "pending" ? (
                    <ExportCircle   
                      size={18}
                      color={txn.type === "credit" ? "#16a34a" : "#F97316"}
                      variant="Linear"
                    />
                  ) : txn.type === "credit" ? (
                    <ImportCircle
                      size={18}
                      color="#16a34a"
                      variant="Linear"
                    />
                  ) : (
                    <Repeat
                      size={18}
                      color="#F97316"
                      variant="Linear"
                    />
                  )}
                </div>

                {/* each coresponding text */}
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {txn.recipient}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(txn.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    •{" "}
                    {new Date(txn.date).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>

              </div>

              {/* amounts */}
              <p className={`text-sm font-semibold
                ${txn.type === "credit" ? "text-green-600" : "text-foreground"}`}>
                {txn.type === "credit" ? "+" : "-"}${txn.amount.toFixed(2)}
              </p>

            </div>
          ))}
        </div>
      )}

      {/* pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            Page {page} of {data.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-brand hover:text-brand transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === data.totalPages}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-brand hover:text-brand transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  )
}