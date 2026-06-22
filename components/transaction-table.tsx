"use client"

import { useState, useEffect } from "react"
import {
  ExportCircle,
  ImportCircle,
  Repeat,
  Flag,
} from "iconsax-react"
import { PaginatedTransactions, Transaction } from "@/lib/types"
import TransactionDetailPanel from "./transaction-detail-panel"
import FilterDropdown from "./filter-dropdown"

type Tab = "all" | "fx" | "pta" | "bta" | "medicals"

const TABS: { label: string; value: Tab }[] = [
  { label: "All", value: "all" },
  { label: "FX", value: "fx" },
  { label: "PTA", value: "pta" },
  { label: "BTA", value: "bta" },
  { label: "Medicals", value: "medicals" },
]

const USER_ROLE = "admin"

export default function TransactionTable() {
  const [data, setData] = useState<PaginatedTransactions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState<Tab>("all")
  const [selected, setSelected] = useState<Transaction | null>(null)
  const [flagLoading, setFlagLoading] = useState(false)
  const [flagError, setFlagError] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
 

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: "5",
          status: statusFilter,
        })
        const res = await fetch(`/api/transactions?${params}`, {cache: "no-store"})
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError("Failed to load transactions")
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [page, statusFilter])

  // Flag / Unflag transaction
  async function handleFlag(transaction: Transaction) {
    if (USER_ROLE !== "admin") return

    const newFlagState = !transaction.isFlagged
    setFlagError("")
    setFlagLoading(true)

    // Optimistic update — update UI immediately before API responds
    setSelected((prev) =>
      prev ? { ...prev, isFlagged: newFlagState } : null
    )
    setData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        transactions: prev.transactions.map((t) =>
          t.id === transaction.id
            ? { ...t, isFlagged: newFlagState }
            : t
        ),
      }
    })

    try {
      const res = await fetch("/api/transactions/flag", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: transaction.id,
          isFlagged: newFlagState,
        }),
      })

      // Rollback on failure
      if (!res.ok) {
        setSelected((prev) =>
          prev ? { ...prev, isFlagged: transaction.isFlagged } : null
        )
        setData((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            transactions: prev.transactions.map((t) =>
              t.id === transaction.id
                ? { ...t, isFlagged: transaction.isFlagged }
                : t
            ),
          }
        })
        setFlagError("Failed to update. Please try again.")
      }
    } catch (err) {
      // Rollback on network error
      setSelected((prev) =>
        prev ? { ...prev, isFlagged: transaction.isFlagged } : null
      )
      setFlagError("Network error. Please try again.")
    } finally {
      setFlagLoading(false)
    }
  }

  return (
    <div className="wit-full h-fit bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground">
          FX transactions
        </h2>
        <FilterDropdown
          value={statusFilter}
          onChange={(val) => {
          setStatusFilter(val)
          setPage(1)
          }}
          placeholder="See all"
          options={[
                      { label: "See all", value: "all" },
                      { label: "Completed", value: "completed", color: "bg-green-500" },
                      { label: "Pending", value: "pending", color: "bg-yellow-500" },
                      { label: "Flagged", value: "flagged", color: "bg-red-500" },
                    ]}
          />

      </div>

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
                : "border-gray-200 text-gray-400 hover:border-gray-300"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="py-12 text-center text-gray-400 text-sm">
          Loading transactions...
        </div>
      )}

      {error && (
        <div className="py-12 text-center text-red-500 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && data?.transactions.length === 0 && (
        <div className="py-12 text-center text-gray-400 text-sm">
          No transactions found
        </div>
      )}

      {!loading && !error && data && data.transactions.length > 0 && (
        <div className="flex flex-col gap-1">
          {data.transactions.map((txn) => (
            <div
              key={txn.id}
              onClick={() => setSelected(txn)}
              className={`flex items-center justify-between py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer
                ${selected?.id === txn.id ? "bg-orange-50 border border-brand/20" : ""}`}
            >
              {/* Left — Icon + Details */}
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                  ${txn.type === "credit" ? "bg-green-50" : "bg-orange-50"}`}
                >
                  {txn.status === "pending" ? (
                    <Repeat
                      size={18}
                      color={txn.type === "credit" ? "#16a34a" : "#F97316"}
                      variant="Linear"
                    />
                  ) : txn.type === "credit" ? (
                    <ImportCircle size={18} color="#16a34a" variant="Linear" />
                  ) : (
                    <ExportCircle size={18} color="#F97316" variant="Linear" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {txn.recipient}
                    </p>
                    {txn.isFlagged && (
                      <Flag size={12} color="#dc2626" variant="Bold" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 font-geist">
                    {new Date(txn.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}•{" "}
                    {new Date(txn.date).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>

              <p className={`text-sm font-semibold
                ${txn.type === "credit" ? "text-green-600" : "text-foreground"}`}
              >
                {txn.type === "credit" ? "+" : "-"}${txn.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}

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
      
      {selected && (
        <TransactionDetailPanel
          transaction={selected}
          onClose={() => setSelected(null)}
          onFlag={handleFlag}
          flagLoading={flagLoading}
          flagError={flagError}
        />
      )}
    </div>
  )
}