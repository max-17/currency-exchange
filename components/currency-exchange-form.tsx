"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ArrowRightLeft, Check } from "lucide-react";
import { mockCurrencies, mockRates } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function CurrencyExchangeForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  type formSchema = {
    fromCurrencyId: string;
    toCurrencyId: string;
    fromAmount: string;
    toAmount: string;
  };

  function validateNum(value: string) {
    return Number.parseFloat(value) > 0 ? true : "must be positive number";
  }

  const form = useForm<formSchema>({
    defaultValues: {
      fromCurrencyId: "",
      toCurrencyId: "",
      fromAmount: "",
      toAmount: "",
    },
  });

  // Watch form values
  const fromCurrencyId = form.watch("fromCurrencyId");
  const toCurrencyId = form.watch("toCurrencyId");
  const fromAmount = form.watch("fromAmount");
  const toAmount = form.watch("toAmount");

  // Calculate current
  function getCurrentRate() {
    if (!fromCurrencyId || !toCurrencyId || fromCurrencyId === toCurrencyId)
      return null;
    const rate = mockRates.find(
      (r) =>
        r.baseCurrencyId === fromCurrencyId &&
        r.quoteCurrencyId === toCurrencyId
    );
    return rate?.rate;
  }
  const currentRate = getCurrentRate();

  // Only update the other field when one changes
  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (currentRate) {
      function calcToAmount() {
        if (!currentRate || !val) return "";
        const amount = Number.parseFloat(val);
        if (isNaN(amount)) return "";
        return (amount * currentRate).toFixed(2);
      }

      form.setValue("toAmount", calcToAmount(), {
        shouldValidate: false,
      });
    }
    form.trigger(["toAmount", "fromAmount"]);
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (currentRate) {
      function calcFromAmount() {
        if (!currentRate || !val) return "";
        const amount = Number.parseFloat(val);
        if (isNaN(amount)) return "";
        return (amount / currentRate).toFixed(2);
      }

      form.setValue("fromAmount", calcFromAmount(), {
        shouldValidate: false,
      });
    }
    form.trigger(["toAmount", "fromAmount"]);
  };

  // Reset success state when form changes
  useEffect(() => {
    if (isSuccess) setIsSuccess(false);
  }, [fromCurrencyId, toCurrencyId, fromAmount, toAmount, isSuccess]);

  function onSubmit(values: formSchema) {
    if (!currentRate || fromCurrencyId === toCurrencyId) {
      console.log({
        title: "Error",
        description: "Please select different currencies",
        variant: "destructive",
      });
      return;
    }

    console.log(values);

    setIsSuccess(true);
    setTimeout(() => {
      form.reset();
      setIsSuccess(false);
    }, 2000);
  }

  function swapCurrencies() {
    const from = form.getValues("fromCurrencyId");
    const to = form.getValues("toCurrencyId");
    if (!from || !to) return;
    // If swapping would make both selects the same, clear toCurrencyId
    form.setValue("fromCurrencyId", to, { shouldValidate: true });
    form.setValue("toCurrencyId", from, { shouldValidate: true });
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
                rules={{ required: "this field is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Currency</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("fromAmount", "", {
                          shouldValidate: false,
                        });
                        form.setValue("toAmount", "", {
                          shouldValidate: false,
                        });
                      }}
                      value={field.value}
                      disabled={isSuccess}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCurrencies.map((currency) => (
                          <SelectItem
                            key={currency.id}
                            value={currency.id}
                            style={
                              currency.id === toCurrencyId
                                ? { display: "none" }
                                : {}
                            }
                          >
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
                className="h-10 w-10"
                onClick={swapCurrencies}
                disabled={!fromCurrencyId || !toCurrencyId || isSuccess}
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
              {/* To Currency */}
              <FormField
                control={form.control}
                name="toCurrencyId"
                rules={{ required: "this field is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Currency</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("fromAmount", "", {
                          shouldValidate: false,
                        });
                        form.setValue("toAmount", "", {
                          shouldValidate: false,
                        });
                      }}
                      value={field.value}
                      disabled={isSuccess}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCurrencies.map((currency) => (
                          <SelectItem
                            key={currency.id}
                            value={currency.id}
                            style={
                              currency.id === fromCurrencyId
                                ? { display: "none" }
                                : {}
                            }
                          >
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
            {/* Exchange Rate Display */}
            {currentRate && (
              <div className="text-sm text-center py-1">
                <span className="font-medium">Current Rate:</span> 1{" "}
                {mockCurrencies.find((c) => c.id === fromCurrencyId)?.code} ={" "}
                {currentRate.toFixed(6)}{" "}
                {mockCurrencies.find((c) => c.id === toCurrencyId)?.code}
              </div>
            )}
            <div className="grid grid-cols-2 gap-8">
              {/* From Amount */}
              <FormField
                control={form.control}
                name="fromAmount"
                rules={{
                  required: "this field is required",
                  validate: validateNum,
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleFromAmountChange(e);
                        }}
                        disabled={isSuccess || !currentRate}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* To Amount */}
              <FormField
                control={form.control}
                name="toAmount"
                rules={{
                  required: "this field is required",
                  validate: validateNum,
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Converted Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleToAmountChange(e);
                        }}
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
              disabled={isSuccess || !currentRate || !fromAmount || !toAmount}
            >
              {isSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Validated
                </>
              ) : (
                "Validate Exchange"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
