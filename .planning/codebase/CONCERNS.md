# Codebase Concerns

**Analysis Date:** 2026-04-21

## Tech Debt

**[Testing]:**
- Issue: Complete lack of automated tests (Unit, Integration, or E2E).
- Files: All files in `src/services/` and `src/components/`.
- Impact: High risk of regressions during refactoring, especially in complex atomic transaction logic.
- Fix approach: Introduce Vitest for unit tests and Playwright for E2E flows.

**[Search Implementation]:**
- Issue: Client-side filtering for transactions.
- Files: `src/services/transactionService.ts` (line 144).
- Impact: Performance will degrade as the number of transactions grows, as all transactions for the month are fetched before filtering.
- Fix approach: For personal finance (low volume), this is acceptable. For scale, consider Algolia or Firestore bundles.

## Security Considerations

**[Firestore Rules]:**
- Risk: Security rules must be carefully implemented to ensure users can only access their own `users/{uid}/wallets` and `transactions` where `uid == request.auth.uid`.
- Files: Not visible in codebase (likely in Firebase Console).
- Recommendations: Audit Firestore Rules to ensure strict UID-based isolation.

## Performance Bottlenecks

**[Large Transaction Lists]:**
- Problem: `subscribeToTransactions` fetches all transactions for a month.
- Files: `src/services/transactionService.ts`.
- Cause: Lack of pagination.
- Improvement path: Implement infinite scroll or pagination if users have hundreds of transactions per month.

## Fragile Areas

**[Atomic Transactions]:**
- Files: `src/services/transactionService.ts`.
- Why fragile: Complex logic involving manual balance calculation and multi-document updates.
- Safe modification: Ensure any changes to transaction types ('income', 'expense', 'transfer') are reflected in both the record creation and the balance update logic.

## Test Coverage Gaps

**[Transaction Logic]:**
- What's not tested: Atomic balance updates, fund transfers.
- Files: `src/services/transactionService.ts`.
- Risk: Calculating balances incorrectly could lead to data corruption in user wallets.
- Priority: High.

---

*Concerns audit: 2026-04-21*
