"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, Minus, Check } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  mockCurrencies,
  addBalanceTransaction,
  type BalanceTransactionType,
} from "@/lib/mock-data";

const formSchema = z.object({
  type: z.enum(["ADD", "SUBTRACT"]),
  currencyId: z.string({
    required_error: "Пожалуйста, выберите валюту",
  }),
  amount: z.string().refine(
    (val) => {
      const num = Number.parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Сумма должна быть положительным числом" }
  ),
  description: z
    .string()
    .min(1, "Описание обязательно")
    .max(200, "Описание должно быть менее 200 символов"),
});

interface BalanceTransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionAdded?: () => void;
}

export function BalanceTransactionForm({
  open,
  onOpenChange,
  onTransactionAdded,
}: BalanceTransactionFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "ADD",
      currencyId: "",
      amount: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const transaction = addBalanceTransaction({
        type: values.type as BalanceTransactionType,
        currencyId: values.currencyId,
        amount: Number.parseFloat(values.amount),
        description: values.description,
        userId: "user1", // Current user
        branchId: "branch1", // Current branch
      });

      toast({
        title: "Успешно",
        description: `Баланс ${
          values.type === "ADD" ? "увеличен" : "уменьшен"
        } успешно`,
      });

      setIsSuccess(true);
      onTransactionAdded?.();

      // Reset form after short delay
      setTimeout(() => {
        form.reset({
          type: "ADD",
          currencyId: "",
          amount: "",
          description: "",
        });
        setIsSuccess(false);
      }, 1500);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обработать транзакцию баланса",
        variant: "destructive",
      });
    }
  }

  const transactionType = form.watch("type");

  // Reset form when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isSuccess) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {transactionType === "ADD" ? (
              <Plus className="h-5 w-5 text-green-600" />
            ) : (
              <Minus className="h-5 w-5 text-red-600" />
            )}
            {transactionType === "ADD"
              ? "Добавить к балансу"
              : "Вычесть из баланса"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Transaction Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип транзакции</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSuccess}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ADD">
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4 text-green-600" />
                            Добавить деньги
                          </div>
                        </SelectItem>
                        <SelectItem value="SUBTRACT">
                          <div className="flex items-center gap-2">
                            <Minus className="h-4 w-4 text-red-600" />
                            Вычесть деньги
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Currency */}
              <FormField
                control={form.control}
                name="currencyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Валюта</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSuccess}
                    >
                      <FormControl>
                        <SelectTrigger>
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

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
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
                      disabled={isSuccess}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Введите причину этой транзакции..."
                      className="resize-none"
                      {...field}
                      disabled={isSuccess}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSuccess}
              variant={transactionType === "ADD" ? "default" : "destructive"}
            >
              {isSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Транзакция завершена
                </>
              ) : (
                <>
                  {transactionType === "ADD" ? (
                    <Plus className="mr-2 h-4 w-4" />
                  ) : (
                    <Minus className="mr-2 h-4 w-4" />
                  )}
                  {transactionType === "ADD"
                    ? "Добавить к балансу"
                    : "Вычесть из баланса"}
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
