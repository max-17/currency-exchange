"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BalanceChart } from "@/components/balance-chart"
import { BranchSelector } from "@/components/branch-selector"
import { getCurrentUser, mockCurrencies } from "@/lib/mock-data"

// Simplified balance data calculation
function getSimpleBalanceData(period: "daily" | "weekly" | "monthly", branchId?: string) {
  const baseBalances = {
    curr1: { start: 15000, end: 15420.5 },
    curr2: { start: 9000, end: 8750.25 },
    curr3: { start: 3200000, end: 2890000.75 },
    curr4: { start: 124500000, end: 125000000 },
    curr5: { start: 920000, end: 890000.5 },
  }

  // Adjust based on period
  const multiplier = period === "daily" ? 1 : period === "weekly" ? 1.2 : 1.5

  return mockCurrencies.map((currency) => {
    const base = baseBalances[currency.id as keyof typeof baseBalances] || { start: 1000, end: 1100 }
    const startBalance = base.start * multiplier
    const endBalance = base.end * multiplier
    const netChange = endBalance - startBalance
    const changePercentage = startBalance !== 0 ? (netChange / startBalance) * 100 : 0

    // Generate simple daily data
    const dailyData = Array.from({ length: period === "daily" ? 2 : period === "weekly" ? 7 : 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      balance: startBalance + (netChange * i) / (period === "daily" ? 1 : period === "weekly" ? 6 : 29),
    })).reverse()

    return {
      currencyId: currency.id,
      currency,
      startBalance,
      endBalance,
      netChange,
      changePercentage,
      dailyData,
    }
  })
}

export default function BalancePage() {
  const [selectedBranch, setSelectedBranch] = useState("branch1")
  const currentUser = getCurrentUser()
  const isAdmin = currentUser.role === "ADMIN"

  try {
    const dailyData = getSimpleBalanceData("daily", selectedBranch)
    const weeklyData = getSimpleBalanceData("weekly", selectedBranch)
    const monthlyData = getSimpleBalanceData("monthly", selectedBranch)

    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Balance</h1>
        </div>

        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dailyData.map((data) => (
                <BalanceChart key={data.currencyId} data={data} period="daily" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {weeklyData.map((data) => (
                <BalanceChart key={data.currencyId} data={data} period="weekly" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {monthlyData.map((data) => (
                <BalanceChart key={data.currencyId} data={data} period="monthly" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Balance</h1>
        </div>
        <div className="text-center py-10">
          <p className="text-muted-foreground">Unable to load balance data. Please try again later.</p>
        </div>
      </div>
    )
  }
}
