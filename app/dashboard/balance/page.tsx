"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BalanceChart } from "@/components/balance-chart";
import { BalanceTransactionForm } from "@/components/balance-transaction-form";
import { BalanceTransactionHistory } from "@/components/balance-transaction-history";
import { DateRangePicker } from "@/components/date-range-picker";
import { getCurrentUser, mockCurrencies } from "@/lib/mock-data";
import { subDays } from "date-fns";

// Simplified balance data calculation with date range
function getBalanceDataForDateRange(
  startDate: Date,
  endDate: Date,
  branchId?: string
) {
  const baseBalances = {
    curr1: { start: 15000, end: 15420.5 },
    curr2: { start: 9000, end: 8750.25 },
    curr3: { start: 3200000, end: 2890000.75 },
    curr4: { start: 124500000, end: 125000000 },
    curr5: { start: 920000, end: 890000.5 },
  };

  // Calculate days difference for trend simulation
  const daysDiff = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const multiplier = Math.max(1, daysDiff / 7); // Scale based on date range

  return mockCurrencies.map((currency) => {
    const base = baseBalances[currency.id as keyof typeof baseBalances] || {
      start: 1000,
      end: 1100,
    };
    const startBalance = base.start * multiplier;
    const endBalance = base.end * multiplier;
    const netChange = endBalance - startBalance;
    const changePercentage =
      startBalance !== 0 ? (netChange / startBalance) * 100 : 0;

    // Generate daily data for the date range
    const dailyData = Array.from(
      { length: Math.min(daysDiff, 30) },
      (_, i) => ({
        date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
        balance: startBalance + (netChange * i) / Math.max(1, daysDiff - 1),
      })
    );

    return {
      currencyId: currency.id,
      currency,
      startBalance,
      endBalance,
      netChange,
      changePercentage,
      dailyData,
    };
  });
}

export default function BalancePage() {
  const [selectedBranch, setSelectedBranch] = useState("branch1");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7), // Default to last 7 days
    to: new Date(),
  });

  const currentUser = getCurrentUser();
  const isAdmin = currentUser.role === "ADMIN";

  const handleTransactionAdded = () => {
    setRefreshKey((prev) => prev + 1);
    setShowTransactionForm(false);
  };

  const handleDateRangeChange = (
    range: { from: Date; to: Date } | undefined
  ) => {
    if (range?.from && range?.to) {
      setDateRange(range);
    }
  };

  try {
    const balanceData = getBalanceDataForDateRange(
      dateRange.from,
      dateRange.to,
      selectedBranch
    );

    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Баланс</h1>
          <div className="flex items-center gap-4">
            <DateRangePicker
              from={dateRange.from}
              to={dateRange.to}
              onSelect={handleDateRangeChange}
            />
            <Button onClick={() => setShowTransactionForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить транзакцию
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Current Balance Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {balanceData.map((data) => (
              <BalanceChart key={data.currencyId} data={data} period="custom" />
            ))}
          </div>

          {/* Transaction History */}
          <div>
            <BalanceTransactionHistory key={refreshKey} dateRange={dateRange} />
          </div>
        </div>

        {/* Transaction Form Dialog */}
        <BalanceTransactionForm
          open={showTransactionForm}
          onOpenChange={setShowTransactionForm}
          onTransactionAdded={handleTransactionAdded}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Баланс</h1>
        </div>
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            Не удалось загрузить данные баланса. Пожалуйста, попробуйте позже.
          </p>
        </div>
      </div>
    );
  }
}
