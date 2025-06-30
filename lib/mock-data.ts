export type Role = "MANAGER" | "ADMIN"

export interface User {
  id: string
  name: string
  phone: string
  role: Role
  createdAt: Date
  updatedAt: Date
  address?: string
  latitude?: number
  longitude?: number
  passwordHash?: string
  email?: string
  emailVerified?: Date
  image?: string
}

export interface Currency {
  id: string
  code: string
  name: string
}

export interface Wallet {
  id: string
  currencyId: string
  balance: number
  updatedAt: Date
  currency: Currency
}

export interface DailyBalance {
  id: number
  date: Date
  currencyId: string
  balance: number
  currency: Currency
  branchId?: string
}

export interface ExchangeRate {
  id: number
  baseCurrencyId: string
  quoteCurrencyId: string
  rate: number
  createdAt: Date
  baseCurrency: Currency
  quoteCurrency: Currency
  userId: string
  user: User
}

export interface Exchange {
  id: number
  fromCurrencyId: string
  toCurrencyId: string
  fromAmount: number
  toAmount: number
  createdAt: Date
  fromCurrency: Currency
  toCurrency: Currency
  userId: string
  user: User
  exchangeRateId: number
  rate: ExchangeRate
}

export interface Branch {
  id: string
  name: string
  location: string
}

export interface BalancePeriodData {
  currencyId: string
  currency: Currency
  startBalance: number
  endBalance: number
  netChange: number
  changePercentage: number
  dailyData: { date: Date; balance: number }[]
}

// Mock Branches
export const mockBranches: Branch[] = [
  { id: "branch1", name: "Tashkent Central", location: "Tashkent" },
  { id: "branch2", name: "Samarkand Branch", location: "Samarkand" },
  { id: "branch3", name: "Bukhara Branch", location: "Bukhara" },
  { id: "MAIN", name: "Combined", location: "Combined" },
]

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user1",
    name: "John Manager",
    phone: "+998901234567",
    role: "ADMIN",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-12-29"),
    address: "Tashkent, Uzbekistan",
    email: "john@example.com",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user2",
    name: "Sarah Admin",
    phone: "+998907654321",
    role: "MANAGER",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-12-28"),
    address: "Tashkent, Uzbekistan",
    email: "sarah@example.com",
    image: "/placeholder.svg?height=40&width=40",
  },
]

// Mock Currencies
export const mockCurrencies: Currency[] = [
  { id: "curr1", code: "USD", name: "US Dollar" },
  { id: "curr2", code: "EUR", name: "Euro" },
  { id: "curr3", code: "KZT", name: "Kazakhstani Tenge" },
  { id: "curr4", code: "UZS", name: "Uzbek Som" },
  { id: "curr5", code: "RUB", name: "Russian Ruble" },
]

// Mock Wallets
export const mockWallets: Wallet[] = [
  {
    id: "wallet1",
    currencyId: "curr1",
    balance: 15420.5,
    updatedAt: new Date("2024-12-29T10:30:00"),
    currency: mockCurrencies[0],
  },
  {
    id: "wallet2",
    currencyId: "curr2",
    balance: 8750.25,
    updatedAt: new Date("2024-12-29T11:15:00"),
    currency: mockCurrencies[1],
  },
  {
    id: "wallet3",
    currencyId: "curr3",
    balance: 2890000.75,
    updatedAt: new Date("2024-12-29T09:45:00"),
    currency: mockCurrencies[2],
  },
  {
    id: "wallet4",
    currencyId: "curr4",
    balance: 125000000.0,
    updatedAt: new Date("2024-12-29T12:00:00"),
    currency: mockCurrencies[3],
  },
  {
    id: "wallet5",
    currencyId: "curr5",
    balance: 890000.5,
    updatedAt: new Date("2024-12-29T08:30:00"),
    currency: mockCurrencies[4],
  },
]

// Extended Mock Daily Balances with historical data
export const mockDailyBalances: DailyBalance[] = [
  // Current day
  {
    id: 1,
    date: new Date("2024-12-29"),
    currencyId: "curr1",
    balance: 15420.5,
    currency: mockCurrencies[0],
    branchId: "branch1",
  },
  {
    id: 2,
    date: new Date("2024-12-29"),
    currencyId: "curr2",
    balance: 8750.25,
    currency: mockCurrencies[1],
    branchId: "branch1",
  },
  {
    id: 3,
    date: new Date("2024-12-29"),
    currencyId: "curr3",
    balance: 2890000.75,
    currency: mockCurrencies[2],
    branchId: "branch1",
  },
  {
    id: 4,
    date: new Date("2024-12-29"),
    currencyId: "curr4",
    balance: 125000000.0,
    currency: mockCurrencies[3],
    branchId: "branch1",
  },
  {
    id: 5,
    date: new Date("2024-12-29"),
    currencyId: "curr5",
    balance: 890000.5,
    currency: mockCurrencies[4],
    branchId: "branch1",
  },

  // Previous days (last 30 days)
  {
    id: 6,
    date: new Date("2024-12-28"),
    currencyId: "curr1",
    balance: 15000.0,
    currency: mockCurrencies[0],
    branchId: "branch1",
  },
  {
    id: 7,
    date: new Date("2024-12-28"),
    currencyId: "curr2",
    balance: 9000.0,
    currency: mockCurrencies[1],
    branchId: "branch1",
  },
  {
    id: 8,
    date: new Date("2024-12-28"),
    currencyId: "curr3",
    balance: 3200000.0,
    currency: mockCurrencies[2],
    branchId: "branch1",
  },
  {
    id: 9,
    date: new Date("2024-12-28"),
    currencyId: "curr4",
    balance: 124500000.0,
    currency: mockCurrencies[3],
    branchId: "branch1",
  },
  {
    id: 10,
    date: new Date("2024-12-28"),
    currencyId: "curr5",
    balance: 920000.0,
    currency: mockCurrencies[4],
    branchId: "branch1",
  },

  {
    id: 11,
    date: new Date("2024-12-27"),
    currencyId: "curr1",
    balance: 14800.0,
    currency: mockCurrencies[0],
    branchId: "branch1",
  },
  {
    id: 12,
    date: new Date("2024-12-27"),
    currencyId: "curr2",
    balance: 8900.0,
    currency: mockCurrencies[1],
    branchId: "branch1",
  },
  {
    id: 13,
    date: new Date("2024-12-27"),
    currencyId: "curr3",
    balance: 3150000.0,
    currency: mockCurrencies[2],
    branchId: "branch1",
  },
  {
    id: 14,
    date: new Date("2024-12-27"),
    currencyId: "curr4",
    balance: 124000000.0,
    currency: mockCurrencies[3],
    branchId: "branch1",
  },
  {
    id: 15,
    date: new Date("2024-12-27"),
    currencyId: "curr5",
    balance: 915000.0,
    currency: mockCurrencies[4],
    branchId: "branch1",
  },

  // Week ago
  {
    id: 16,
    date: new Date("2024-12-22"),
    currencyId: "curr1",
    balance: 14200.0,
    currency: mockCurrencies[0],
    branchId: "branch1",
  },
  {
    id: 17,
    date: new Date("2024-12-22"),
    currencyId: "curr2",
    balance: 8500.0,
    currency: mockCurrencies[1],
    branchId: "branch1",
  },
  {
    id: 18,
    date: new Date("2024-12-22"),
    currencyId: "curr3",
    balance: 3000000.0,
    currency: mockCurrencies[2],
    branchId: "branch1",
  },
  {
    id: 19,
    date: new Date("2024-12-22"),
    currencyId: "curr4",
    balance: 123000000.0,
    currency: mockCurrencies[3],
    branchId: "branch1",
  },
  {
    id: 20,
    date: new Date("2024-12-22"),
    currencyId: "curr5",
    balance: 900000.0,
    currency: mockCurrencies[4],
    branchId: "branch1",
  },

  // Month ago
  {
    id: 21,
    date: new Date("2024-11-29"),
    currencyId: "curr1",
    balance: 13500.0,
    currency: mockCurrencies[0],
    branchId: "branch1",
  },
  {
    id: 22,
    date: new Date("2024-11-29"),
    currencyId: "curr2",
    balance: 8000.0,
    currency: mockCurrencies[1],
    branchId: "branch1",
  },
  {
    id: 23,
    date: new Date("2024-11-29"),
    currencyId: "curr3",
    balance: 2800000.0,
    currency: mockCurrencies[2],
    branchId: "branch1",
  },
  {
    id: 24,
    date: new Date("2024-11-29"),
    currencyId: "curr4",
    balance: 120000000.0,
    currency: mockCurrencies[3],
    branchId: "branch1",
  },
  {
    id: 25,
    date: new Date("2024-11-29"),
    currencyId: "curr5",
    balance: 850000.0,
    currency: mockCurrencies[4],
    branchId: "branch1",
  },

  // Other branches data
  {
    id: 26,
    date: new Date("2024-12-29"),
    currencyId: "curr1",
    balance: 8500.0,
    currency: mockCurrencies[0],
    branchId: "branch2",
  },
  {
    id: 27,
    date: new Date("2024-12-29"),
    currencyId: "curr2",
    balance: 5200.0,
    currency: mockCurrencies[1],
    branchId: "branch2",
  },
  {
    id: 28,
    date: new Date("2024-12-29"),
    currencyId: "curr1",
    balance: 6200.0,
    currency: mockCurrencies[0],
    branchId: "branch3",
  },
  {
    id: 29,
    date: new Date("2024-12-29"),
    currencyId: "curr2",
    balance: 3800.0,
    currency: mockCurrencies[1],
    branchId: "branch3",
  },
]

// Mock Exchange Rates
export const mockExchangeRates: ExchangeRate[] = [
  {
    id: 1,
    baseCurrencyId: "curr1",
    quoteCurrencyId: "curr2",
    rate: 0.92,
    createdAt: new Date("2024-12-29T08:00:00"),
    baseCurrency: mockCurrencies[0],
    quoteCurrency: mockCurrencies[1],
    userId: "user1",
    user: mockUsers[0],
  },
  {
    id: 2,
    baseCurrencyId: "curr1",
    quoteCurrencyId: "curr3",
    rate: 485.5,
    createdAt: new Date("2024-12-29T08:00:00"),
    baseCurrency: mockCurrencies[0],
    quoteCurrency: mockCurrencies[2],
    userId: "user1",
    user: mockUsers[0],
  },
  {
    id: 3,
    baseCurrencyId: "curr1",
    quoteCurrencyId: "curr4",
    rate: 12750.0,
    createdAt: new Date("2024-12-29T08:00:00"),
    baseCurrency: mockCurrencies[0],
    quoteCurrency: mockCurrencies[3],
    userId: "user1",
    user: mockUsers[0],
  },
  {
    id: 4,
    baseCurrencyId: "curr1",
    quoteCurrencyId: "curr5",
    rate: 95.5,
    createdAt: new Date("2024-12-29T08:00:00"),
    baseCurrency: mockCurrencies[0],
    quoteCurrency: mockCurrencies[4],
    userId: "user1",
    user: mockUsers[0],
  },
  {
    id: 5,
    baseCurrencyId: "curr2",
    quoteCurrencyId: "curr1",
    rate: 1.09,
    createdAt: new Date("2024-12-29T08:00:00"),
    baseCurrency: mockCurrencies[1],
    quoteCurrency: mockCurrencies[0],
    userId: "user1",
    user: mockUsers[0],
  },
  {
    id: 6,
    baseCurrencyId: "curr2",
    quoteCurrencyId: "curr3",
    rate: 528.2,
    createdAt: new Date("2024-12-29T08:00:00"),
    baseCurrency: mockCurrencies[1],
    quoteCurrency: mockCurrencies[2],
    userId: "user1",
    user: mockUsers[0],
  },
  {
    id: 7,
    baseCurrencyId: "curr3",
    quoteCurrencyId: "curr1",
    rate: 0.00206,
    createdAt: new Date("2024-12-29T08:00:00"),
    baseCurrency: mockCurrencies[2],
    quoteCurrency: mockCurrencies[0],
    userId: "user1",
    user: mockUsers[0],
  },
  {
    id: 8,
    baseCurrencyId: "curr3",
    quoteCurrencyId: "curr2",
    rate: 0.00189,
    createdAt: new Date("2024-12-29T08:00:00"),
    baseCurrency: mockCurrencies[2],
    quoteCurrency: mockCurrencies[1],
    userId: "user1",
    user: mockUsers[0],
  },
]

// Mock Exchanges
export const mockExchanges: Exchange[] = [
  {
    id: 1,
    fromCurrencyId: "curr1",
    toCurrencyId: "curr2",
    fromAmount: 1000.0,
    toAmount: 920.0,
    createdAt: new Date("2024-12-29T10:30:00"),
    fromCurrency: mockCurrencies[0],
    toCurrency: mockCurrencies[1],
    userId: "user1",
    user: mockUsers[0],
    exchangeRateId: 1,
    rate: mockExchangeRates[0],
  },
  {
    id: 2,
    fromCurrencyId: "curr2",
    toCurrencyId: "curr1",
    fromAmount: 500.0,
    toAmount: 545.0,
    createdAt: new Date("2024-12-29T11:15:00"),
    fromCurrency: mockCurrencies[1],
    toCurrency: mockCurrencies[0],
    userId: "user1",
    user: mockUsers[0],
    exchangeRateId: 5,
    rate: mockExchangeRates[4],
  },
  {
    id: 3,
    fromCurrencyId: "curr1",
    toCurrencyId: "curr3",
    fromAmount: 800.0,
    toAmount: 388400.0,
    createdAt: new Date("2024-12-29T09:45:00"),
    fromCurrency: mockCurrencies[0],
    toCurrency: mockCurrencies[2],
    userId: "user2",
    user: mockUsers[1],
    exchangeRateId: 2,
    rate: mockExchangeRates[1],
  },
  {
    id: 4,
    fromCurrencyId: "curr4",
    toCurrencyId: "curr1",
    fromAmount: 1275000.0,
    toAmount: 100.0,
    createdAt: new Date("2024-12-29T12:00:00"),
    fromCurrency: mockCurrencies[3],
    toCurrency: mockCurrencies[0],
    userId: "user1",
    user: mockUsers[0],
    exchangeRateId: 3,
    rate: mockExchangeRates[2],
  },
  {
    id: 5,
    fromCurrencyId: "curr5",
    toCurrencyId: "curr1",
    fromAmount: 9550.0,
    toAmount: 100.0,
    createdAt: new Date("2024-12-29T08:30:00"),
    fromCurrency: mockCurrencies[4],
    toCurrency: mockCurrencies[0],
    userId: "user2",
    user: mockUsers[1],
    exchangeRateId: 4,
    rate: mockExchangeRates[3],
  },
]

// Helper functions
export function getCurrentUser(): User {
  return mockUsers[0] // Return John Manager as current user
}

export function getWalletBalance(currencyId: string): number {
  const wallet = mockWallets.find((w) => w.currencyId === currencyId)
  return wallet?.balance || 0
}

export function getDailyStartBalance(currencyId: string): number {
  const dailyBalance = mockDailyBalances.find((db) => db.currencyId === currencyId)
  return dailyBalance?.balance || 0
}

export function getDailyChange(currencyId: string): number {
  const currentBalance = getWalletBalance(currencyId)
  const startBalance = getDailyStartBalance(currencyId)
  return currentBalance - startBalance
}

export function getExchangeRatesForCurrency(baseCurrencyId: string): ExchangeRate[] {
  return mockExchangeRates.filter((rate) => rate.baseCurrencyId === baseCurrencyId)
}

export function getBalanceDataForPeriod(
  period: "daily" | "weekly" | "monthly",
  branchId?: string,
): BalancePeriodData[] {
  const today = new Date("2024-12-29")
  let startDate: Date

  switch (period) {
    case "daily":
      startDate = new Date(today.getTime() - 24 * 60 * 60 * 1000) // 1 day ago
      break
    case "weekly":
      startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      break
    case "monthly":
      startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      break
  }

  return mockCurrencies.map((currency) => {
    let balances = mockDailyBalances.filter((db) => db.currencyId === currency.id)

    // Filter by branch if specified
    if (branchId && branchId !== "combined") {
      balances = balances.filter((db) => db.branchId === branchId)
    }

    // Get start and end balances
    const endBalance = balances.find((db) => db.date.toDateString() === today.toDateString())?.balance || 0
    const startBalance = balances.find((db) => db.date.toDateString() === startDate.toDateString())?.balance || 0

    const netChange = endBalance - startBalance
    const changePercentage = startBalance !== 0 ? (netChange / startBalance) * 100 : 0

    // Generate daily data for chart
    const dailyData = balances
      .filter((db) => db.date >= startDate && db.date <= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((db) => ({ date: db.date, balance: db.balance }))

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

export function getCombinedBalanceData(period: "daily" | "weekly" | "monthly"): BalancePeriodData[] {
  const today = new Date("2024-12-29")
  let startDate: Date

  switch (period) {
    case "daily":
      startDate = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      break
    case "weekly":
      startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case "monthly":
      startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
  }

  return mockCurrencies.map((currency) => {
    // Combine balances from all branches
    const allBalances = mockDailyBalances.filter((db) => db.currencyId === currency.id)

    // Group by date and sum balances
    const balancesByDate = new Map<string, number>()
    allBalances.forEach((db) => {
      const dateKey = db.date.toDateString()
      const currentSum = balancesByDate.get(dateKey) || 0
      balancesByDate.set(dateKey, currentSum + db.balance)
    })

    const endBalance = balancesByDate.get(today.toDateString()) || 0
    const startBalance = balancesByDate.get(startDate.toDateString()) || 0

    const netChange = endBalance - startBalance
    const changePercentage = startBalance !== 0 ? (netChange / startBalance) * 100 : 0

    // Generate daily data for chart
    const dailyData: { date: Date; balance: number }[] = []
    for (const [dateStr, balance] of balancesByDate.entries()) {
      const date = new Date(dateStr)
      if (date >= startDate && date <= today) {
        dailyData.push({ date, balance })
      }
    }
    dailyData.sort((a, b) => a.date.getTime() - b.date.getTime())

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
