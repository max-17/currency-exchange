import { CurrencyExchangeForm } from "@/components/currency-exchange-form"

export default function CurrencyExchangePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Record Currency Exchange</h1>
      <CurrencyExchangeForm />
    </div>
  )
}
