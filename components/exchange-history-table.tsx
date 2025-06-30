"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Exchange } from "@/lib/mock-data"

interface ExchangeHistoryTableProps {
  exchanges: Exchange[]
}

export function ExchangeHistoryTable({ exchanges }: ExchangeHistoryTableProps) {
  const formatCurrency = (amount: number, code: string) => {
    if (code === "UZS") {
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>User</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exchanges.map((exchange) => (
            <TableRow key={exchange.id}>
              <TableCell className="font-medium">#{exchange.id}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {formatCurrency(exchange.fromAmount, exchange.fromCurrency.code)} {exchange.fromCurrency.code}
                  </span>
                  <span className="text-xs text-muted-foreground">{exchange.fromCurrency.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {formatCurrency(exchange.toAmount, exchange.toCurrency.code)} {exchange.toCurrency.code}
                  </span>
                  <span className="text-xs text-muted-foreground">{exchange.toCurrency.name}</span>
                </div>
              </TableCell>
              <TableCell>{formatDate(exchange.createdAt)}</TableCell>
              <TableCell>
                <Badge variant="outline">{exchange.rate.rate}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{exchange.user.name}</span>
                  <span className="text-xs text-muted-foreground">{exchange.user.role}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
