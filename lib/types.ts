
export type TransactionStatus = "completed" | "pending" | "flagged"

export type Transaction = {
  id: string
  recipient: string
  amount: number
  currency: string
  status: TransactionStatus
  date: string
  type: "debit" | "credit"
  note?: string
  isFlagged: boolean
}

export type PaginatedTransactions = {
  transactions: Transaction[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type User = {
  id: string
  role: "admin" | "analyst"
}

export type LoginFormTypes =  {
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    marginClass?: string;
}