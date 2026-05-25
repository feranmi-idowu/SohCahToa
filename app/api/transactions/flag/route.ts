import { NextRequest, NextResponse } from "next/server"
import { TRANSACTIONS } from "@/lib/mock-data"

export async function PATCH(request: NextRequest) {

  const accessToken = request.cookies.get("accessToken")?.value

  if (!accessToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const body = await request.json()
  const { transactionId, isFlagged, note} = body

  if (!transactionId) {
    return NextResponse.json(
      { error: "Transaction ID is required" },
      { status: 400 }
    )
  }

  const transaction = TRANSACTIONS.find(
    (t) => t.id === transactionId
  )

  if (!transaction) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 }
    )
  }

  if (typeof isFlagged === "boolean") {
    transaction.isFlagged = isFlagged
    transaction.status = isFlagged ? "flagged" : "completed"
  }

  if (typeof note === "string") {
    transaction.note = note
  }

  return NextResponse.json({
    success: true,
    transaction,
  })
}