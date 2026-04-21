# Architecture

**Analysis Date:** 2026-04-21

## Pattern Overview

**Overall:** Client-side Real-time Application (SPA) with Serverless Backend (Firebase).

**Key Characteristics:**
- **Real-time First:** Uses Firestore `onSnapshot` for immediate UI updates when data changes.
- **Atomic Transactions:** Uses Firestore `runTransaction` for critical operations like transfers to ensure data consistency between wallet balances and transaction records.
- **Context-Driven State:** Global state (Auth, Wallet, Language) managed via React Context.

## Layers

**UI Layer:**
- Purpose: Rendering the application and handling user interaction.
- Location: `src/app` (pages) and `src/components` (reusable units).
- Contains: React components, CSS Modules.
- Depends on: Context hooks and Service layer.

**Logic Layer (Services):**
- Purpose: Abstracting Firebase operations and business logic.
- Location: `src/services/`
- Contains: `walletService.ts`, `transactionService.ts`.
- Used by: Components and Context Providers.

**Data Layer (Context):**
- Purpose: Providing global state and real-time data sync.
- Location: `src/context/`
- Contains: `AuthContext.tsx`, `WalletContext.tsx`, `LanguageContext.tsx`.
- Depends on: Services.

## Data Flow

**Transaction Creation:**
1. User submits form in `src/app/add/page.tsx`.
2. Component calls `addTransactionWithUpdate` from `src/services/transactionService.ts`.
3. Service executes a Firestore Transaction:
   - Reads wallet balance.
   - Calculates new balance.
   - Writes transaction record and updates wallet balance atomically.
4. Real-time listener in `WalletContext.tsx` or `src/app/transactions/page.tsx` receives the update and refreshes UI.

**State Management:**
- `AuthContext`: Manages Firebase `User` object and redirect logic.
- `WalletContext`: Maintains a real-time list of wallets and total balance.
- `LanguageContext`: Manages current locale and dictionary access.

## Key Abstractions

**Seamless Card Pattern:**
- Purpose: Live preview of wallet appearance during creation.
- Examples: `src/components/wallet/CardPreview.tsx`.
- Pattern: Controlled component synced with form state.

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Responsibilities: Wrapping the app with Context Providers and standardizing the font (Prompt) and global styles.

## Error Handling

**Strategy:** Try-catch blocks in services with console logging; UI feedback via state.

## Cross-Cutting Concerns

**Logging:** Standard `console.error` in catch blocks.
**Validation:** Basic type checking via TypeScript; likely form validation in components.
**Authentication:** Guarded routes via `AuthContext` effects.

---

*Architecture analysis: 2026-04-21*
