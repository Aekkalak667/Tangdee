# Implementation Plan: ตังค์ดี (Tang Dee) - Phase 5: Wallets & Switching

**task_complexity:** medium
**date:** 2026-04-21

## 1. Plan Overview
แผนนี้จะสร้างระบบการเลือกดูข้อมูลแยกตามกระเป๋าเงิน โดยผู้ใช้สามารถสลับกระเป๋าในหน้า Wallet และดูผลลัพธ์ทันทีในหน้า Dashboard

## 2. Dependency Graph
- [Phase 1] -> [Phase 2]
- [Phase 1] -> [Phase 3]
- [Phase 2, 3] -> [Phase 4]

## 3. Execution Strategy
| Stage | Agent | Mode | Description |
|-------|-------|------|-------------|
| 1 | coder | Sequential | Global Active Wallet State |
| 2 | data_engineer | Parallel | Filtering logic for Dashboard |
| 3 | design_system_engineer | Parallel | 2-Column Grid UI |
| 4 | coder | Sequential | Flow Integration & Final Polish |

## 4. Phase Details

### Phase 1: State Management
- **Files:** `src/context/WalletContext.tsx` (Create new), `src/app/layout.tsx`
- **Details:** Add `activeWalletId` state, `setActiveWallet(id)` function. Default to 'all' or first wallet.
- **Validation:** State is accessible and persists across page reloads.

### Phase 2: Dashboard Filtering
- **Files:** `src/app/dashboard/page.tsx`, `src/services/transactionService.ts`
- **Details:** Use `activeWalletId` to filter transactions and balances. Update `subscribeToWallets` usage.
- **Validation:** Changing state manually updates Dashboard numbers.

### Phase 3: Wallet Page UI
- **Files:** `src/app/wallet/page.tsx`, `src/components/wallet/WalletGridItem.tsx`
- **Details:** Responsive 2-column grid. Highlight the active wallet. Use Apple-style typography.
- **Validation:** Page renders correctly with all user wallets.

### Phase 4: Integration
- **Files:** `src/app/wallet/page.tsx`
- **Details:** On click wallet item -> `setActiveWallet(id)` -> `router.push('/dashboard')`.
- **Validation:** Full flow works: Select wallet -> Dashboard updates -> Correct wallet info shown.

## 5. Token & Cost Estimate
| Phase | Agent | Model | Est. Cost |
|-------|-------|-------|-----------|
| 1 | coder | Pro | $0.15 |
| 2 | data_engineer | Pro | $0.15 |
| 3 | design_system_engineer | Pro | $0.20 |
| 4 | coder | Pro | $0.15 |
| **Total** | | | **~$0.65** |
