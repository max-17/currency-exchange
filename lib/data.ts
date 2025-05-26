// Mock data for currencies
// Define types for our data
type Currency = {
  id: string;
  code: string;
  name: string;
};

type ExchangeRate = {
  id: string;
  baseCurrencyId: string;
  quoteCurrencyId: string;
  rate: number;
};

export const mockCurrencies: Currency[] = [
  { id: "1", code: "USD", name: "US Dollar" },
  { id: "2", code: "EUR", name: "Euro" },
  { id: "3", code: "GBP", name: "British Pound" },
  { id: "4", code: "JPY", name: "Japanese Yen" },
  { id: "5", code: "CAD", name: "Canadian Dollar" },
];

// Mock data for exchange rates
export const mockRates: ExchangeRate[] = [
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
];
