# Implementation Plan: ตังค์ดี (Tang Dee) - Phase 2: Dashboard

**task_complexity:** medium
**date:** 2026-04-21

## 1. Plan Overview
แผนนี้จะสร้างหน้า Dashboard ที่รวบรวมข้อมูลจากทุกกระเป๋าเงินมาแสดงผลแบบภาพรวม พร้อมระบบเลื่อนสไลด์ดู Wallet แต่ละใบ

## 2. Dependency Graph
- [Phase 1] -> [Phase 3]
- [Phase 2] -> [Phase 3]
- [Phase 3] -> [Phase 4]

## 3. Execution Strategy
| Stage | Agent | Mode | Description |
|-------|-------|------|-------------|
| 1 | data_engineer | Parallel | Real-time aggregate logic |
| 2 | design_system_engineer | Parallel | Carousel & Card Components |
| 3 | coder | Sequential | Dashboard Page Integration |
| 4 | design_system_engineer | Sequential | Spending Bar & Visual Polish |

## 4. Phase Details

### Phase 1: Data Logic
- **Files:** `src/services/walletService.ts`
- **Details:** Implement `subscribeToWallets(uid, callback)` using `onSnapshot`.
- **Validation:** Logs updated wallet array whenever Firestore data changes.

### Phase 2: UI Components
- **Files:** `src/components/dashboard/WalletCarousel.tsx`, `src/components/dashboard/NetWorthCard.tsx`
- **Details:** CSS Scroll Snap for carousel, Large typography for balance.
- **Validation:** Components render correctly with mock data.

### Phase 3: Page Integration
- **Files:** `src/app/dashboard/page.tsx`
- **Details:** Combine services and components. Handle loading/empty states.
- **Validation:** Home page redirects to Dashboard if wallets exist.

### Phase 4: Spending Summary
- **Files:** `src/components/dashboard/SpendingBar.tsx`
- **Details:** A simple multi-color progress bar representing categories.
- **Validation:** Bar widths correctly reflect percentage data.

## 5. Token & Cost Estimate
| Phase | Agent | Model | Est. Cost |
|-------|-------|-------|-----------|
| 1 | data_engineer | Pro | $0.15 |
| 2 | design_system_engineer | Pro | $0.20 |
| 3 | coder | Pro | $0.20 |
| 4 | design_system_engineer | Flash | $0.05 |
| **Total** | | | **~$0.60** |
