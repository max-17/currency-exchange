"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getBalanceTransactions } from "@/lib/mock-data"

interface BalanceTransactionHistoryProps {
  limit?: number
  currencyId?: string
  dateRange?: { from: Date; to: Date }
}

export function BalanceTransactionHistory({ limit, currencyId, dateRange }: BalanceTransactionHistoryProps) {
  let transactions = getBalanceTransactions(limit)

  if (currencyId) {
    transactions = transactions.filter((t) => t.currencyId === currencyId)
  }

  // Filter by date range if provided
  if (dateRange) {
    transactions = transactions.filter((t) => {
      const transactionDate = t.createdAt
      return transactionDate >= dateRange.from && transactionDate <= dateRange.to
    })
  }

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case "ADD":
        return "Добавление"
      case "SUBTRACT":
        return "Вычитание"
      case "CONVERSION_IN":
        return "Конвертация (вход)"
      case "CONVERSION_OUT":
        return "Конвертация (выход)"
      default:
        return type
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>История транзакций баланса</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Пользователь</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Валюта</TableHead>
                <TableHead>Описание</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Для выбранного диапазона дат не найдено ни одной транзакции баланса.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{transaction.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {transaction.user.role === "ADMIN" ? "Администратор" : "Менеджер"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          transaction.type === "ADD" || transaction.type === "CONVERSION_IN"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "ADD" || transaction.type === "CONVERSION_IN" ? "+" : "-"}
                        {formatCurrency(transaction.amount, transaction.currency.code)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{transaction.currency.code}</span>
                        <span className="text-xs text-muted-foreground">{transaction.currency.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{transaction.description}</span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
