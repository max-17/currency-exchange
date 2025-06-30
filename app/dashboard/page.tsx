import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CurrencyCard } from "@/components/currency-card"
import { ExchangeHistoryTable } from "@/components/exchange-history-table"
import {
  mockCurrencies,
  getWalletBalance,
  getDailyChange,
  getExchangeRatesForCurrency,
  mockExchanges,
} from "@/lib/mock-data"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Currency Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockCurrencies.map((currency) => {
          const currentBalance = getWalletBalance(currency.id)
          const dailyChange = getDailyChange(currency.id)
          const exchangeRates = getExchangeRatesForCurrency(currency.id)

          return (
            <CurrencyCard
              key={currency.id}
              currency={currency}
              currentBalance={currentBalance}
              dailyChange={dailyChange}
              exchangeRates={exchangeRates}
            />
          )
        })}
      </div>

      {/* Exchange History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Exchange History</h2>
          <Button asChild>
            <Link href="/currency-exchange">
              <Plus className="h-4 w-4 mr-2" />
              Create Exchange
            </Link>
          </Button>
        </div>
        <ExchangeHistoryTable exchanges={mockExchanges} />
      </div>
    </div>
  )
}
