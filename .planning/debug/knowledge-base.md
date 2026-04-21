# GSD Debug Knowledge Base

Resolved debug sessions. Used by `gsd-debugger` to surface known-pattern hypotheses at the start of new investigations.

---

## fix-transaction-service-test — Fix failing transaction service tests due to incorrect 'doc' mock
- **Date:** 2026-04-21
- **Error patterns:** TypeError: Cannot read properties of undefined (reading 'includes'), doc, firebase, firestore, mock
- **Root cause:** The 'doc' mock implementation in 'transactionService.test.ts' assumes it will always be called with at least two arguments where the second argument is a string, but it is sometimes called with a single argument (a CollectionReference), making the second argument undefined.
- **Fix:** Updated the 'doc' mock implementation to handle variadic arguments by checking if the second argument is a string before calling '.includes()' or '.endsWith()'.
- **Files changed:** src/services/__tests__/transactionService.test.ts
---
