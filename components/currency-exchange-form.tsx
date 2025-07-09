"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowRightLeft, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

// Define types for our data
type Currency = {
  id: string
  code: string
  name: string
}

type ExchangeRate = {
  id: string
  baseCurrencyId: string
  quoteCurrencyId: string
  rate: number
}

// Mock data for currencies
const mockCurrencies: Currency[] = [
  { id: "1", code: "USD", name: "Доллар США" },
  { id: "2", code: "EUR", name: "Евро" },
  { id: "3", code: "GBP", name: "Британский фунт" },
  { id: "4", code: "JPY", name: "Японская йена" },
  { id: "5", code: "CAD", name: "Канадский доллар" },
]

// Mock data for exchange rates
const mockRates: ExchangeRate[] = [
  { id: "1", baseCurrencyId: "1", quoteCurrencyId: "2", rate: 0.92 },
  { id: "2", baseCurrencyId: "1", quoteCurrencyId: "3", rate: 0.78 },
  { id: "3", baseCurrencyId: "1", quoteCurrencyId: "4", rate: 149.5 },
  { id: "4", baseCurrencyId: "1", quoteCurrencyId: "5", rate: 1.36 },
  { id: "5", baseCurrencyId: "2", quoteCurrencyId: "1", rate: 1.09 },
  { id: "6", baseCurrencyId: "2", quoteCurrencyId: "3", rate: 0.85 },
  { id: "7", baseCurrencyId: "2", quoteCurrencyId: "4", rate: 162.73 },
  { id: "8", baseCurrencyId: "2", quoteCurrencyId: "5", rate: 1.48 },
  { id: "9", baseCurrencyId: "3", quoteCurrencyId: "1", rate: 1.28 },
  { id: "10", baseCurrencyId: "3", quoteCurrencyId: "2", rate: 1.18 },
  { id: "11", baseCurrencyId: "3", quoteCurrencyId: "4", rate: 191.67 },
  { id: "12", baseCurrencyId: "3", quoteCurrencyId: "5", rate: 1.74 },
  { id: "13", baseCurrencyId: "4", quoteCurrencyId: "1", rate: 0.0067 },
  { id: "14", baseCurrencyId: "4", quoteCurrencyId: "2", rate: 0.0061 },
  { id: "15", baseCurrencyId: "4", quoteCurrencyId: "3", rate: 0.0052 },
  { id: "16", baseCurrencyId: "4", quoteCurrencyId: "5", rate: 0.0091 },
  { id: "17", baseCurrencyId: "5", quoteCurrencyId: "1", rate: 0.74 },
  { id: "18", baseCurrencyId: "5", quoteCurrencyId: "2", rate: 0.68 },
  { id: "19", baseCurrencyId: "5", quoteCurrencyId: "3", rate: 0.57 },
  { id: "20", baseCurrencyId: "5", quoteCurrencyId: "4", rate: 110.15 },
]

// Form schema with validation
const formSchema = z
  .object({
    fromCurrencyId: z.string({
      required_error: "Пожалуйста, выберите валюту",
    }),
    toCurrencyId: z.string({
      required_error: "Пожалуйста, выберите валюту",
    }),
    fromAmount: z.string().refine(
      (val) => {
        const num = Number.parseFloat(val)
        return !isNaN(num) && num >= 0
      },
      { message: "Сумма должна быть положительным числом" },
    ),
    toAmount: z.string().refine(
      (val) => {
        const num = Number.parseFloat(val)
        return !isNaN(num) && num >= 0
      },
      { message: "Сумма должна быть положительным числом" },
    ),
  })
  .refine((data) => data.fromCurrencyId !== data.toCurrencyId, {
    message: "Нельзя выбрать одинаковую валюту",
    path: ["toCurrencyId"], // Show error on the toCurrency field
  })

export function CurrencyExchangeForm() {
  const [currentRate, setCurrentRate] = useState<number | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [lastModified, setLastModified] = useState<"from" | "to" | null>(null)

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromCurrencyId: "",
      toCurrencyId: "",
      fromAmount: "",
      toAmount: "",
    },
  })

  // Watch form values
  const fromCurrencyId = form.watch("fromCurrencyId")
  const toCurrencyId = form.watch("toCurrencyId")
  const fromAmount = form.watch("fromAmount")
  const toAmount = form.watch("toAmount")

  // Find and set exchange rate when currencies change
  useEffect(() => {
    if (fromCurrencyId && toCurrencyId && fromCurrencyId !== toCurrencyId) {
      // Find the exchange rate
      const rate = mockRates.find((r) => r.baseCurrencyId === fromCurrencyId && r.quoteCurrencyId === toCurrencyId)

      if (rate) {
        setCurrentRate(rate.rate)
      } else {
        // Check for inverse rate
        const inverseRate = mockRates.find(
          (r) => r.baseCurrencyId === toCurrencyId && r.quoteCurrencyId === fromCurrencyId,
        )

        if (inverseRate) {
          const rateValue = 1 / inverseRate.rate
          setCurrentRate(Number.parseFloat(rateValue.toFixed(6)))
        } else {
          setCurrentRate(null)
        }
      }
    } else {
      setCurrentRate(null)
    }
  }, [fromCurrencyId, toCurrencyId])

  // Calculate amounts when inputs change
  useEffect(() => {
    if (!currentRate || fromCurrencyId === toCurrencyId) return

    // Skip calculation if no amount is entered yet
    if (fromAmount === "" && toAmount === "") return

    // Calculate based on which field was last modified
    if (lastModified === "from" || (lastModified === null && fromAmount !== "")) {
      const amount = Number.parseFloat(fromAmount || "0")
      if (!isNaN(amount)) {
        const calculated = (amount * currentRate).toFixed(2)
        form.setValue("toAmount", calculated, { shouldValidate: false })
      }
    } else if (lastModified === "to" || (lastModified === null && toAmount !== "")) {
      const amount = Number.parseFloat(toAmount || "0")
      if (!isNaN(amount)) {
        const calculated = (amount / currentRate).toFixed(2)
        form.setValue("fromAmount", calculated, { shouldValidate: false })
      }
    }
  }, [currentRate, fromAmount, toAmount, lastModified, form, fromCurrencyId, toCurrencyId])

  // Reset success state when form changes
  useEffect(() => {
    if (isSuccess) {
      setIsSuccess(false)
    }
  }, [fromCurrencyId, toCurrencyId, fromAmount, toAmount, isSuccess])

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentRate || fromCurrencyId === toCurrencyId) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите разные валюты",
        variant: "destructive",
      })
      return
    }

    // Just show success message - no server action
    toast({
      title: "Успешно",
      description: "Обмен успешно проверен",
    })

    // Set success state
    setIsSuccess(true)

    // Log the data that would be submitted
    console.log({
      fromCurrencyId: values.fromCurrencyId,
      toCurrencyId: values.toCurrencyId,
      fromAmount: Number.parseFloat(values.fromAmount || "0"),
      toAmount: Number.parseFloat(values.toAmount || "0"),
      rate: currentRate,
    })

    // Reset form after short delay
    setTimeout(() => {
      form.reset({
        fromCurrencyId: "",
        toCurrencyId: "",
        fromAmount: "",
        toAmount: "",
      })
      setCurrentRate(null)
      setIsSuccess(false)
      setLastModified(null)
    }, 2000)
  }

  // Swap currencies
  function swapCurrencies() {
    const from = form.getValues("fromCurrencyId")
    const to = form.getValues("toCurrencyId")
    const fromAmt = form.getValues("fromAmount")
    const toAmt = form.getValues("toAmount")

    if (from && to) {
      form.setValue("fromCurrencyId", to, { shouldValidate: true })
      form.setValue("toCurrencyId", from, { shouldValidate: true })

      // Also swap the amounts
      form.setValue("fromAmount", toAmt, { shouldValidate: false })
      form.setValue("toAmount", fromAmt, { shouldValidate: false })

      // Keep the last modified field the same (but swapped)
      setLastModified(lastModified === "from" ? "to" : "from")
    }
  }

  // Handle amount input changes
  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("fromAmount", e.target.value, { shouldValidate: true })
    setLastModified("from")
  }

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("toAmount", e.target.value, { shouldValidate: true })
    setLastModified("to")
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end">
              {/* From Currency */}
              <FormField
                control={form.control}
                name="fromCurrencyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Из валюты</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isSuccess}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выберите валюту" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCurrencies.map((currency) => (
                          <SelectItem key={currency.id} value={currency.id}>
                            {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Swap Button */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 bg-transparent"
                onClick={swapCurrencies}
                disabled={!fromCurrencyId || !toCurrencyId || isSuccess || fromCurrencyId === toCurrencyId}
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>

              {/* To Currency */}
              <FormField
                control={form.control}
                name="toCurrencyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>В валюту</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isSuccess}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выберите валюту" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCurrencies.map((currency) => (
                          <SelectItem key={currency.id} value={currency.id}>
                            {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Exchange Rate Display - Show as soon as both currencies are selected */}
            {currentRate && fromCurrencyId !== toCurrencyId && (
              <div className="text-sm text-center py-1">
                <span className="font-medium">Текущий курс:</span> 1{" "}
                {mockCurrencies.find((c) => c.id === fromCurrencyId)?.code} = {currentRate.toFixed(6)}{" "}
                {mockCurrencies.find((c) => c.id === toCurrencyId)?.code}
              </div>
            )}

            <div className="grid grid-cols-2 gap-8">
              {/* From Amount - Now with custom onChange handler */}
              <FormField
                control={form.control}
                name="fromAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Сумма</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={handleFromAmountChange}
                        disabled={isSuccess || !currentRate}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* To Amount - Now editable with custom onChange handler */}
              <FormField
                control={form.control}
                name="toAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Конвертированная сумма</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={handleToAmountChange}
                        disabled={isSuccess || !currentRate}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSuccess || !currentRate || fromCurrencyId === toCurrencyId || !fromAmount || !toAmount}
            >
              {isSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Проверено
                </>
              ) : (
                "Проверить обмен"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
