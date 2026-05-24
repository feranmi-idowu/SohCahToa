

import Header from "@/components/header"
import TransactionTable from "@/components/transaction-table"
import BalanceCard from "@/components/balance-card"
import CardPanel from "@/components/card-panel"


export default function DashboardPage() {
  return (
    <div>
      <Header />
      <div className="flex gap-6">
        <div className="flex-1">
          <BalanceCard />
          <TransactionTable />
        </div>
        <CardPanel />
      </div>
    </div>
    
  )
}