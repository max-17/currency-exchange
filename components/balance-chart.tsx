"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BalanceChartProps {
  data: {
    currencyId: string
    currency: { id: string; code: string; name: string }
    startBalance: number
    endBalance: number
    netChange: number
    changePercentage: number
    dailyData: { date: Date; balance: number }[]
  }
  period: "daily" | "weekly" | "monthly" | "custom"
}

export function BalanceChart({ data, period }: BalanceChartProps) {
  const formatCurrency = (amount: number, code: string) => {
    if (code === "UZS" || code === "KZT") {
      return new Intl.NumberFormat("ru-RU", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getBadgeVariant = () => {
    if (data.netChange > 0) return "default"
    if (data.netChange < 0) return "destructive"
    return "secondary"
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <span>{data.currency.code}</span>
            <span className="text-sm text-muted-foreground font-normal">{data.currency.name}</span>
          </div>
          <Badge variant={getBadgeVariant()} className="flex items-center gap-1">
            {data.netChange >= 0 ? "+" : ""}
            {formatCurrency(data.netChange, data.currency.code)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance Summary */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Начальный баланс</p>
            <p className="font-semibold">
              {formatCurrency(data.startBalance, data.currency.code)} {data.currency.code}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Конечный баланс</p>
            <p className="font-semibold">
              {formatCurrency(data.endBalance, data.currency.code)} {data.currency.code}
            </p>
          </div>
        </div>

        {/* Change Percentage */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Изменение</span>
          <span
            className={`font-medium ${
              data.netChange > 0 ? "text-green-600" : data.netChange < 0 ? "text-red-600" : "text-gray-600"
            }`}
          >
            {data.changePercentage >= 0 ? "+" : ""}
            {data.changePercentage.toFixed(2)}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
