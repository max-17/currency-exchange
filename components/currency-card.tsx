"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit2, Check, X, ChevronDown, ChevronUp } from "lucide-react"
import type { Currency, ExchangeRate } from "@/lib/mock-data"

interface CurrencyCardProps {
  currency: Currency
  currentBalance: number
  dailyChange: number
  exchangeRates: ExchangeRate[]
}

export function CurrencyCard({ currency, currentBalance, dailyChange, exchangeRates }: CurrencyCardProps) {
  const [editingRates, setEditingRates] = useState<{ [key: number]: string }>({})
  const [isEditing, setIsEditing] = useState(false)
  const [showAllRates, setShowAllRates] = useState(false)

  const handleEditRate = (rateId: number, currentRate: number) => {
    setEditingRates({ ...editingRates, [rateId]: currentRate.toString() })
    setIsEditing(true)
  }

  const handleSaveRate = (rateId: number) => {
    // In a real app, this would save to the database
    console.log(`Saving rate ${rateId} with value ${editingRates[rateId]}`)
    const newRates = { ...editingRates }
    delete newRates[rateId]
    setEditingRates(newRates)
    if (Object.keys(newRates).length === 0) {
      setIsEditing(false)
    }
  }

  const handleCancelEdit = (rateId: number) => {
    const newRates = { ...editingRates }
    delete newRates[rateId]
    setEditingRates(newRates)
    if (Object.keys(newRates).length === 0) {
      setIsEditing(false)
    }
  }

  const formatCurrency = (amount: number, code: string) => {
    if (code === "UZS" || code === "KZT") {
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

  const isPositiveChange = dailyChange >= 0

  // Show only first 2 rates by default
  const displayedRates = showAllRates ? exchangeRates : exchangeRates.slice(0, 2)
  const hasMoreRates = exchangeRates.length > 2

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold">{currency.code}</span>
            <span className="text-xs text-muted-foreground">{currency.name}</span>
          </div>
          <Badge variant={isPositiveChange ? "default" : "destructive"} className="text-xs">
            {isPositiveChange ? "+" : ""}
            {formatCurrency(dailyChange, currency.code)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {/* Current Balance */}
        <div>
          <p className="text-xs text-muted-foreground">Current Balance</p>
          <p className="text-lg font-bold">
            {formatCurrency(currentBalance, currency.code)} {currency.code}
          </p>
        </div>

        {/* Exchange Rates */}
        {exchangeRates.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Exchange Rates</p>
            <div className="space-y-1">
              {displayedRates.map((rate) => (
                <div key={rate.id} className="flex items-center justify-between p-1.5 bg-muted/30 rounded text-xs">
                  <span>
                    1 {rate.baseCurrency.code} = {rate.quoteCurrency.code}
                  </span>
                  <div className="flex items-center gap-1">
                    {editingRates[rate.id] !== undefined ? (
                      <>
                        <Input
                          type="number"
                          step="0.01"
                          value={editingRates[rate.id]}
                          onChange={(e) => setEditingRates({ ...editingRates, [rate.id]: e.target.value })}
                          className="w-16 h-6 text-xs"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleSaveRate(rate.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleCancelEdit(rate.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="font-medium">{rate.rate}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleEditRate(rate.id, rate.rate)}
                          disabled={isEditing}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Show All/Show Less Button */}
              {hasMoreRates && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-6 text-xs"
                  onClick={() => setShowAllRates(!showAllRates)}
                >
                  {showAllRates ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Show All ({exchangeRates.length} rates)
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
