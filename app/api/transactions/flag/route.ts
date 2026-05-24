import { NextRequest, NextResponse } from "next/server"
import { TRANSACTIONS } from "@/lib/mock-data"

export async function PATCH(request: NextRequest) {

   //Check auth cookie
  const accessToken = request.cookies.get("accessToken")?.value

  if (!accessToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  //  Read request body
  const body = await request.json()
  const { transactionId, isFlagged } = body

  if (!transactionId) {
    return NextResponse.json(
      { error: "Transaction ID is required" },
      { status: 400 }
    )
  }

  // Find the transaction
  const transaction = TRANSACTIONS.find(
    (t) => t.id === transactionId
  )

  if (!transaction) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 }
    )
  }

  // Update the transaction
  transaction.isFlagged = isFlagged
  transaction.status = isFlagged ? "flagged" : "completed"

  return NextResponse.json({
    success: true,
    transaction,
  })
}