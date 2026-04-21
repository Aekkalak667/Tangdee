# Testing Patterns

**Analysis Date:** 2026-04-21

## Test Framework

**Runner:**
- Not detected. No `jest`, `vitest`, or `playwright` configuration files found in root.

## Test File Organization

**Location:**
- No test files (`.test.ts`, `.spec.ts`) detected in `src/`.

## Missing Testing Gaps

**Unit Tests:**
- Critical logic in `src/services/transactionService.ts` (Atomic transactions) is currently untested.
- i18n dictionary loading in `src/lib/dictionary.ts` is untested.

**Integration Tests:**
- Firebase Auth and Firestore interaction needs integration testing.

**E2E Tests:**
- Core flows (Create Wallet -> Add Transaction -> Verify Balance) need E2E coverage.

## Recommended Setup

**Runner:** Vitest (fast, Next.js compatible).
**Assertion Library:** `chai` or Vitest built-in.
**Mocking:** `msw` for API/Firebase mocking or `firebase-testing-library` for local emulator testing.

---

*Testing analysis: 2026-04-21*
