"use client"

import { useState, useEffect } from "react"
import {
  ExportCircle,
  ImportCircle,
  Repeat,
  Flag,
  CloseCircle,
  TickCircle
} from "iconsax-react"
import { PaginatedTransactions, Transaction } from "@/lib/types"

type Tab = "all" | "fx" | "pta" | "bta" | "medicals"

const TABS: { label: string; value: Tab }[] = [
  { label: "All", value: "all" },
  { label: "FX", value: "fx" },
  { label: "PTA", value: "pta" },
  { label: "BTA", value: "bta" },
  { label: "Medicals", value: "medicals" },
]

// Hardcoded role for now — in real app comes from auth context
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
    <div className="bg-white rounded-xl border border-gray-100 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground">
          FX transactions
        </h2>
        <button className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-brand hover:text-brand transition-colors">
          See all
        </button>
      </div>

      {/* Tabs */}
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

      {/* Loading State */}
      {loading && (
        <div className="py-12 text-center text-gray-400 text-sm">
          Loading transactions...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="py-12 text-center text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && data?.transactions.length === 0 && (
        <div className="py-12 text-center text-gray-400 text-sm">
          No transactions found
        </div>
      )}

      {/* Transaction List */}
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
                      variant="Bold"
                    />
                  ) : txn.type === "credit" ? (
                    <ImportCircle size={18} color="#16a34a" variant="Bold" />
                  ) : (
                    <ExportCircle size={18} color="#F97316" variant="Bold" />
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
                  <p className="text-xs text-gray-400 mt-0.5">
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

              {/* Amount */}
              <p className={`text-sm font-semibold
                ${txn.type === "credit" ? "text-green-600" : "text-foreground"}`}
              >
                {txn.type === "credit" ? "+" : "-"}${txn.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
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

      {/* Detail Panel — slides in when transaction selected */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setSelected(null)}
          />

          {/* Panel */}
          <div className="relative bg-white w-full max-w-sm h-full shadow-xl p-6 overflow-y-auto">

            {/* Panel Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-foreground">
                Transaction Details
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-foreground transition-colors"
              >
                <CloseCircle size={20} variant="Bold" />
              </button>
            </div>

            {/* Amount */}
            <div className={`rounded-xl p-4 mb-6 text-center
              ${selected.type === "credit" ? "bg-green-50" : "bg-orange-50"}`}
            >
              <p className={`text-3xl font-bold
                ${selected.type === "credit" ? "text-green-600" : "text-foreground"}`}
              >
                {selected.type === "credit" ? "+" : "-"}${selected.amount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-1">{selected.currency}</p>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-4 mb-6">
              {[
                { label: "Recipient", value: selected.recipient },
                { label: "Date", value: new Date(selected.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) },
                { label: "Time", value: new Date(selected.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) },
                { label: "Transaction ID", value: selected.id },
                { label: "Type", value: selected.type === "credit" ? "Money In" : "Money Out" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-start">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-xs font-medium text-foreground text-right max-w-[60%]">
                    {item.value}
                  </p>
                </div>
              ))}

              {/* Status Badge */}
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">Status</p>
                <span className={`text-xs px-2 py-1 rounded-full font-medium
                  ${selected.status === "completed"
                    ? "bg-green-50 text-green-600"
                    : selected.status === "pending"
                    ? "bg-yellow-50 text-yellow-600"
                    : "bg-red-50 text-red-600"
                  }`}
                >
                  {selected.status}
                </span>
              </div>
            </div>

            {/* Flag Error */}
            {flagError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-600 text-xs">{flagError}</p>
              </div>
            )}

            {/* Flag Button — Admin Only */}
            {USER_ROLE === "admin" && (
              <button
                onClick={() => handleFlag(selected)}
                disabled={flagLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-colors disabled:opacity-50
                  ${selected.isFlagged
                    ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
              >
                {selected.isFlagged ? (
                  <>
                    <TickCircle size={16} variant="Bold" color="#dc2626" />
                    {flagLoading ? "Removing flag..." : "Remove Flag"}
                  </>
                ) : (
                  <>
                    <Flag size={16} variant="Bold" color="#6b7280" />
                    {flagLoading ? "Flagging..." : "Flag Transaction"}
                  </>
                )}
              </button>
            )}

          </div>
        </div>
      )}

    </div>
  )
}