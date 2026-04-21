---
phase: 06-reliability-performance
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [
  "package.json",
  "vitest.config.ts",
  "src/services/transactionService.ts",
  "src/services/walletService.ts",
  "src/app/transactions/page.tsx",
  "src/services/__tests__/transactionService.test.ts",
  "src/services/__tests__/walletService.test.ts"
]
autonomous: true
requirements: [TEST-01, DATA-01, UI-01]

must_haves:
  truths:
    - "Running 'npm test' executes Vitest and reports successful test outcomes."
    - "Scrolling to the bottom of the Transactions list triggers the loading of more records."
    - "Mathematical balance updates and transfers are verified by automated tests."
  artifacts:
    - path: "vitest.config.ts"
      provides: "Testing configuration"
    - path: "src/services/transactionService.ts"
      provides: "Paginated transaction fetching logic"
    - path: "src/services/__tests__/transactionService.test.ts"
      provides: "Unit tests for transaction logic"
  key_links:
    - from: "src/app/transactions/page.tsx"
      to: "src/services/transactionService.ts"
      via: "getTransactionsPaginated"
      pattern: "getTransactionsPaginated"
---

<objective>
Enhance application reliability with automated testing and improve performance with Firestore pagination and infinite scroll UI.

Purpose: Ensure mathematical correctness of financial operations and provide a smooth user experience for large datasets.
Output: Vitest setup, Service unit tests, Paginated Firestore service, and Infinite Scroll UI.
</objective>

<execution_context>
@$HOME/.gemini/get-shit-done/workflows/execute-plan.md
@$HOME/.gemini/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@src/services/transactionService.ts
@src/services/walletService.ts
@src/app/transactions/page.tsx
@package.json
</context>

<tasks>

<task type="auto" agent="tester">
  <name>Task 1: Setup Vitest and testing environment</name>
  <files>package.json, vitest.config.ts</files>
  <action>
    Install dev dependencies: `vitest`, `@vitest/ui`, `jsdom`, and `@testing-library/react`. 
    Create a `vitest.config.ts` file in the root directory configured for a Next.js environment (using `jsdom` for environment).
    Update `package.json` to include `"test": "vitest"` and `"test:ui": "vitest --ui"` scripts.
    Create a simple test file `src/__tests__/smoke.test.ts` to verify the setup works.
  </action>
  <verify>
    <automated>npm test -- --run</automated>
  </verify>
  <done>Vitest is configured and the smoke test passes.</done>
</task>

<task type="auto" agent="data_engineer">
  <name>Task 2: Implement Firestore Pagination logic</name>
  <files>src/services/transactionService.ts</files>
  <action>
    Implement `getTransactionsPaginated` in `src/services/transactionService.ts`.
    The function should accept: `uid`, `filters` (walletId, search), `limitCount`, and `lastDoc` (QueryDocumentSnapshot).
    Use `query`, `where`, `orderBy('date', 'desc')`, `limit(limitCount)`.
    If `lastDoc` is provided, use `startAfter(lastDoc)`.
    Return an object containing `transactions`, `lastDoc`, and `hasMore` boolean.
    Note: Maintain current search/filtering logic within the paginated query constraints.
  </action>
  <verify>
    <automated>MISSING — Wave 0 must create src/services/__tests__/pagination.test.ts first</automated>
  </verify>
  <done>A reusable paginated fetch function is available for the UI.</done>
</task>

<task type="auto" agent="tester" tdd="true">
  <name>Task 3: Unit Tests for service logic</name>
  <files>src/services/__tests__/transactionService.test.ts, src/services/__tests__/walletService.test.ts</files>
  <behavior>
    - Test `addTransactionWithUpdate`: Mock Firestore transaction. Verify that an 'income' type transaction increases the wallet balance by the exact amount, and 'expense' decreases it.
    - Test `transferFunds`: Mock Firestore transaction for two wallets. Verify that 'fromWallet' decreases and 'toWallet' increases by the transfer amount, and a transfer record is created.
    - Test Error Handling: Ensure appropriate errors are thrown if a wallet does not exist during a transaction or transfer.
  </behavior>
  <action>
    Create unit tests using Vitest. Use `vi.mock` to mock `firebase/firestore` functions like `runTransaction`, `doc`, `getDocs`, etc.
    Focus on mathematical correctness and edge cases (zero balance, missing documents).
  </action>
  <verify>
    <automated>npm test src/services/__tests__</automated>
  </verify>
  <done>Logic for balance updates and transfers is 100% verified by automated tests.</done>
</task>

<task type="auto" agent="coder">
  <name>Task 4: Update Transactions page with Infinite Scroll</name>
  <files>src/app/transactions/page.tsx, src/app/transactions/Transactions.module.css</files>
  <action>
    Refactor `TransactionsPage` to use `getTransactionsPaginated` instead of `subscribeToTransactions`.
    Maintain a `transactions` state (array) and append new data on scroll.
    Implement an `IntersectionObserver` (or use a 'Load More' button if preferred, but infinite scroll was requested) at the end of the list.
    When the end of the list is reached, fetch the next page using the `lastDoc` from the previous fetch.
    Reset the list and pagination state when filters (wallet, search) change.
    Update the UI to show a loading spinner during the fetch.
  </action>
  <verify>
    <automated>npm run build</automated>
  </verify>
  <done>Transactions list loads incrementally as the user scrolls, improving performance for large histories.</done>
</task>

</tasks>

<success_criteria>
1. Vitest is successfully integrated and `npm test` runs in the project.
2. transactionService provides efficient pagination using Firestore `startAfter`.
3. Critical financial logic (balance updates/transfers) is covered by unit tests.
4. The Transactions page supports infinite scrolling with no regression in filtering functionality.
</success_criteria>

<output>
After completion, create `.planning/phases/06-reliability-performance/06-01-SUMMARY.md`
</output>
