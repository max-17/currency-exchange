Currency Exchange Management System - Project Plan

1. Core Entities & Database
   Users (admins, managers, staff)
   Branches (exchange shops)
   Currencies (USD, EUR, etc.)
   Exchange Rates (with history log)
   Balances (transactions, adjustments)
   Transactions (exchange, deposits, withdrawals, corrections)

2. Key Features

🔹 For Managers (Branch Level)
View and manage branch-specific exchange rates.
Adjust balances for branch currencies.
View daily / weekly / monthly balance changes.
Track transactions and history logs.

🔹 For Admins (System Level)
Switch between branches from dashboard.
Manage users and assign them to branches.
Oversee all exchange rates across branches.
Custom Balance View: see sum of all branch balances by currency.
Approve / adjust balances globally.

1. Users & Roles

Admin
Manage all branches
View aggregated data (balances, rates, analytics)
Add/edit/remove branches, managers, currencies
Override balances and rates
Access to custom balance view (sum of all branches)
Manager
Manage their assigned branch only
Update branch-specific rates
Monitor branch balances and transactions
Generate branch-level reports

2. Core Features

Dashboard
Branch balance overview per currency
Daily change indicators (positive/negative)
Exchange rates list with ability to update each currency
For admin: branch switcher (top right)
Balances
Balance detail page showing:
Current balance per currency
Daily, weekly, monthly changes
For admin: aggregated balance across all branches
Admin can edit balances manually if needed
Exchange Rates
Historical records of currency rate changes
Branch-specific rates management
Admin can set global defaults
Transactions
Record buy/sell transactions per branch
Auto-update balances
History logs for auditing
Reports & Analytics
Daily, weekly, monthly balance trends
Exportable reports (CSV/PDF)
Admin: consolidated reports across branches

3. Database Schema (Prisma)

User (Admin/Manager)
Branch (linked to Managers)
Currency (ISO code, name, etc.)
Balance (per branch, per currency, tracked historically)
ExchangeRate (per branch, per currency, with history)
Transaction (buy/sell, amount, currency, branch)

4. Pages

Login Page
Dashboard (branch overview, rates, balances)
Balance Page (details + analytics)
Rates Page (update & view history)
Transactions Page
Reports Page
Admin Management (users, branches, global settings)

5. Tech Stack

Frontend: Next.js (App Router), TailwindCSS, ShadCN UI
Backend: Next.js API Routes / tRPC
Database: Noen + Prisma ORM
Auth: NextAuth.js (credentials/SSO)
Hosting: Vercel

6. Phases

Phase 1: Setup & Auth

Initialize Next.js project, configure DB
Implement auth & roles (Admin/Manager)

Phase 2: Branch & User Management

Admin can add/edit/delete branches and assign managers

Phase 3: Balances & Rates

Schema + API for balances and exchange rates
Dashboard UI for managers/admins

Phase 4: Transactions & History

Implement buy/sell transaction system
Auto-update balances
History tracking

Phase 5: Reports & Analytics

Charts for daily/weekly/monthly balance changes
Admin aggregated view

Phase 6: Polishing & Deployment

Role-based UI adjustments
Export features
Deploy to production

## Detailed Tasks (by page / component / feature)

### Pages

- Dashboard (`/dashboard`)

  - [ ] Finish component wiring for live data (replace mock data with real API)
  - [ ] Add branch switcher for Admins to toggle data scope
  - [ ] Implement pagination / lazy loading for exchange history
  - [ ] Add filtering by date / currency and export CSV
  - [ ] Accessibility audit and keyboard navigation

- Balance (`/dashboard/balance`)

  - [ ] Replace mock balance calculations with server-side queries
  - [ ] Implement aggregated balance view for Admins
  - [ ] Make `BalanceTransactionForm` submit to server and update UI (optimistic update)
  - [ ] Add validation and edge-case handling (e.g., insufficient funds)
  - [ ] Unit tests for balance calculations and chart rendering

- Managers (`/dashboard/managers`)

  - [x] Table UI with create/edit/delete flows
  - [ ] Implement server-side update (PATCH/PUT) and wire edit flow in `UserForm`
  - [ ] Add delete confirmation modal and error handling
  - [ ] Pagination, search and filters (by role, branch)
  - [ ] Audit log for user changes (who changed what)

- Profile (`/dashboard/profile`)

  - [ ] Implement profile editing, avatar upload, and change password
  - [ ] Add email verification flow and display verification status

- Stats (`/dashboard/stats`)
  - [ ] Implement charts (Recharts/Chart.js) for trends
  - [ ] Add filters (branch, currency, date range)
  - [ ] Export reports (CSV/PDF)

### Core Components

- `UserForm` (`components/user-form.tsx`)

  - [ ] Call `form.reset(defaultValues)` when `defaultValues` changes
  - [ ] Support both create and update (use `onSubmit` to call createUser/updateUser based on presence of `id`)
  - [ ] Add client-side validation messages and loading states
  - [ ] Write unit tests (react-hook-form + zod) for valid/invalid submissions

- `BalanceTransactionForm` (`components/balance-transaction-form.tsx`)

  - [ ] Wire to server actions and update `BalanceTransactionHistory` on success
  - [ ] Prevent double submissions and show success/failure toasts

- `ExchangeHistoryTable` (`components/exchange-history-table.tsx`)

  - [ ] Add server pagination / infinite scrolling
  - [ ] Add filters and CSV export

- `CurrencyExchangeForm` (`components/currency-exchange-form.tsx`)

  - [ ] Replace mock rate calculation with live lookup
  - [ ] Add rate caching and error handling for network failures

- Shared UI (`components/ui/*`)
  - [ ] Ensure all controls expose accessibility labels and aria attributes
  - [ ] Add unit tests for complex primitives (Select, Dialog behaviors)
  - [ ] Create Storybook stories for visual QA

### Backend / API

- Server actions (`/server/actions/*`)

  - [ ] Implement `createUser`, `updateUser`, `deleteUser` with proper validation
  - [ ] Add pagination and search for `getAllUsers`
  - [ ] Add transactions endpoints that update balances transactionally
  - [ ] Add audit logging for sensitive mutations

- Prisma Schema & Migrations
  - [ ] Add branch relations to Users and ExchangeRates if needed
  - [ ] Create migrations for any schema changes

### Testing & CI

- [ ] Unit tests (Jest + React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Add GitHub Actions pipeline: lint → test → build

### Developer Experience

- [ ] Add `README` setup steps for local DB, env vars, and seeding
- [ ] Add scripts: `dev`, `build`, `test`, `lint`, `format`
- [ ] Add `prettier` and `eslint` configs, and run auto-fix

### Security & Ops

- [ ] Ensure auth is enforced on all server actions and pages
- [ ] Rate limit sensitive APIs and add input validation
- [ ] Add monitoring (Sentry) and logging for errors

## Next steps I can take (pick one):

- Add `form.reset(defaultValues)` logic to `components/user-form.tsx` so the form updates when `defaultValues` changes (no remount needed).
- Implement `updateUser` server action and wire it to `UserForm` so editing saves changes.
- Add delete confirmation modal and optimistic UI for removing users.

Tell me which task you want me to implement first and I'll start right away.
