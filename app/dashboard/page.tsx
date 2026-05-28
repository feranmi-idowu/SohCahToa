

import Header from "@/components/header"
import TransactionTable from "@/components/transaction-table"
import BalanceCard from "@/components/balance-card"
import CardPanel from "@/components/card-panel"


export default function DashboardPage() {
  return (
    <div className="max-w-295 ">
      <Header />
      <div className=" px-6 pb-11.5 flex gap-6 box-border">
        <div className="flex-1 max-w-150">
          <BalanceCard />
          <TransactionTable />
        </div>
        <CardPanel />
      </div>
    </div>
    
  )
}