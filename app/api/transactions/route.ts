import { NextRequest, NextResponse } from "next/server"
import { TRANSACTIONS } from "@/lib/mock-data"
import { PaginatedTransactions } from "@/lib/types"

export async function GET(request: NextRequest) {

  // query parameters from the URL
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "5")
  const status = searchParams.get("status") || "all"
  const sortBy = searchParams.get("sortBy") || "date"
  const sortOrder = searchParams.get("sortOrder") || "desc"

  // filter by status
  let filtered = [...TRANSACTIONS]

  if (status !== "all") {
    filtered = filtered.filter((t) => t.status === status)
  }

  // sortting
  filtered.sort((a, b) => {
    if (sortBy === "date") {
      return sortOrder === "desc"
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    }
    if (sortBy === "amount") {
      return sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount
    }
    return 0
  })

  // pagination
  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const transactions = filtered.slice(start, end)

  // paginated response
  const response: PaginatedTransactions = {
    transactions,
    total,
    page,
    pageSize,
    totalPages,
  }

  return NextResponse.json(response)
}