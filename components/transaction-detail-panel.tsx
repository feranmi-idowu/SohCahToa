"use client"

import { useState, useEffect } from "react"
import {
  CloseCircle,
  Flag,
  TickCircle,
} from "iconsax-react"
import { Transaction } from "@/lib/types"

type Props = {
  transaction: Transaction
  onClose: () => void
  onFlag: (transaction: Transaction) => void
  flagLoading: boolean
  flagError: string
}



export default function TransactionDetailPanel({
  transaction,
  onClose,
  onFlag,
  flagLoading,
  flagError,
}: Props) {

  const [note, setNote] = useState(transaction.note || "")
  const [noteSaving, setNoteSaving] = useState(false)
  const [noteSaved, setNoteSaved] = useState(false)
  const [userRole, setUserRole] = useState<string>("")

  useEffect(() => {
    const role = localStorage.getItem("userRole") || ""
    setUserRole(role)
  }, [])

  useEffect(() => {
    setNote(transaction.note || "")
    setNoteSaved(false)
  }, [transaction.id])

  async function handleSaveNote() {
    if (!note.trim()) return

    setNoteSaving(true)
    setNoteSaved(false)

    try {
      const res = await fetch("/api/transactions/flag", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: transaction.id,
          note: note.trim(),
        }),
      })

      if (res.ok) {
        setNoteSaved(true)
        setTimeout(() => setNoteSaved(false), 2000)
      }
    } catch (err) {
      console.error("Failed to save note:", err)
    } finally {
      setNoteSaving(false)
    }
  } 
    const Details = [
        { label: "Recipient", value: transaction.recipient },
        { label: "Date", value: new Date(transaction.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric"})},
        { label: "Time", value: new Date(transaction.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })},
        { label: "Transaction ID", value: transaction.id },
        { label: "Type", value: transaction.type === "credit" ? "Money In" : "Money Out" },
    ]

  const isAdmin = userRole === "admin"

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm h-full shadow-xl p-6 overflow-y-auto">

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-foreground">
            Transaction Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-foreground transition-colors"
          >
            <CloseCircle size={20} variant="Bold" />
          </button>
        </div>

        <div className={`rounded-xl p-4 mb-6 text-center
          ${transaction.type === "credit" ? "bg-green-50" : "bg-orange-50"}`}
        >
          <p className={`text-3xl font-bold
            ${transaction.type === "credit" ? "text-green-600" : "text-foreground"}`}
          >
            {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400 mt-1">{transaction.currency}</p>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          {Details.map((item) => (
            <div key={item.label} className="flex justify-between items-start">
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="text-xs font-medium text-foreground text-right max-w-[60%]">
                {item.value}
              </p>
            </div>
          ))}

          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-400">Status</p>
            <span className={`text-xs px-2 py-1 rounded-full font-medium
              ${transaction.status === "completed"
                ? "bg-green-50 text-green-600"
                : transaction.status === "pending"
                ? "bg-yellow-50 text-yellow-600"
                : "bg-red-50 text-red-600"
              }`}
            >
              {transaction.status}
            </span>
          </div>
        </div>

        {isAdmin && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Internal Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add an internal note about this transaction..."
                rows={3}
                className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-brand text-foreground resize-none"
              />
              <button
                onClick={handleSaveNote}
                disabled={noteSaving || !note.trim()}
                className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:border-brand hover:text-brand disabled:opacity-40 transition-colors"
              >
                {noteSaving ? "Saving..." : noteSaved ? (
                  <>
                    <TickCircle size={14} color="#16a34a" variant="Bold" />
                    Saved!
                  </>
                ) : "Save Note"}
              </button>

              {transaction.note && (
                <div className="mt-2 p-2 rounded-lg bg-yellow-50 border border-yellow-100">
                  <p className="text-xs text-yellow-700">
                    Saved note: {transaction.note}
                  </p>
                </div>
              )}
            </div>

            {flagError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-600 text-xs">{flagError}</p>
              </div>
            )}

            <button
              onClick={() => onFlag(transaction)}
              disabled={flagLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-colors disabled:opacity-50
                ${transaction.isFlagged
                  ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
            >
              {transaction.isFlagged ? (
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

          </div>
        )}

        {!isAdmin && (
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Only admin access required to flag and annotate
            </p>
          </div>
        )}

      </div>
    </div>
  )
}