# Implementation Plan: ตังค์ดี (Tang Dee) - Phase 1

**task_complexity:** medium
**date:** 2026-04-21

## 1. Plan Overview
แผนนี้ครอบคลุมการสร้างโครงสร้างพื้นฐาน, ระบบ Login, และหน้าสร้างกระเป๋าเงินแบบ Live Preview โดยใช้ทีมเอเจนต์ผู้เชี่ยวชาญ 5 ท่าน

## 2. Dependency Graph
- [Phase 1] -> [Phase 2]
- [Phase 1] -> [Phase 3]
- [Phase 2, 3] -> [Phase 4]
- [Phase 4] -> [Phase 5]

## 3. Execution Strategy
| Stage | Agent | Mode | Description |
|-------|-------|------|-------------|
| 1 | devops_engineer | Sequential | Scaffolding & Firebase Config |
| 2 | coder | Parallel | Authentication Logic |
| 3 | design_system_engineer | Parallel | Card Preview UI |
| 4 | data_engineer | Sequential | Firestore Integration |
| 5 | tester | Sequential | QA & Netlify Deploy |

## 4. Phase Details

### Phase 1: Foundation
- **Files:** `package.json`, `firebase.config.ts`, `src/app/layout.tsx`
- **Details:** Setup Next.js, Install firebase-admin, firebase SDK, Setup CSS Variables.
- **Validation:** `npm run dev` starts correctly.

### Phase 2: Auth Engine
- **Files:** `src/context/AuthContext.tsx`, `src/app/login/page.tsx`
- **Details:** Implement Google Auth provider, protected routes logic.
- **Validation:** Login success redirects to `/create-wallet`.

### Phase 3: Wallet UI (Live Preview)
- **Files:** `src/components/WalletCard.tsx`, `src/app/create-wallet/page.tsx`
- **Details:** Side-by-side layout, Real-time state update from form to card.
- **Validation:** Card visual updates when changing name/color in form.

### Phase 4: Firestore Data
- **Files:** `src/services/walletService.ts`
- **Details:** Save wallet data to `/users/{uid}/wallets`, error handling.
- **Validation:** Data appears in Firestore emulator/console after save.

### Phase 5: QA & Deploy
- **Files:** `netlify.toml`
- **Details:** E2E test, Netlify configuration.
- **Validation:** Live URL is accessible and functional.

## 5. Token & Cost Estimate
| Phase | Agent | Model | Est. Cost |
|-------|-------|-------|-----------|
| 1 | devops_engineer | Pro | $0.15 |
| 2 | coder | Pro | $0.20 |
| 3 | design_system_engineer | Pro | $0.25 |
| 4 | data_engineer | Pro | $0.15 |
| 5 | tester | Flash | $0.05 |
| **Total** | | | **~$0.80** |
