# Implementation Plan: ตังค์ดี (Tang Dee) - Phase 7: Add Transaction

**task_complexity:** medium
**date:** 2026-04-21

## 1. Plan Overview
แผนนี้จะสร้างระบบการเพิ่มรายการรายรับ-รายจ่ายที่สมบูรณ์แบบที่สุด พร้อมระบบอัปเดตยอดเงินอัตโนมัติและความสวยงามระดับพรีเมียม

## 2. Dependency Graph
- [Phase 1] -> [Phase 4]
- [Phase 2] -> [Phase 4]
- [Phase 3] -> [Phase 4]

## 3. Execution Strategy
| Stage | Agent | Mode | Description |
|-------|-------|------|-------------|
| 1 | data_engineer | Parallel | Firestore Atomic Transactions |
| 2 | design_system_engineer | Parallel | Custom Keypad & Type Switcher |
| 3 | design_system_engineer | Parallel | Grouped Category Grid (30+ Icons) |
| 4 | coder | Sequential | Full Page Integration |

## 4. Phase Details

### Phase 1: Data Strategy
- **Files:** `src/services/transactionService.ts`
- **Details:** Implement `createTransaction(data)` using `runTransaction`. Ensure wallet balance is incremented/decremented correctly.
- **Validation:** Test with various amounts to ensure balance sync is perfect.

### Phase 2: Input Components
- **Files:** `src/components/transactions/Keypad.tsx`, `src/components/transactions/TypeToggle.tsx`
- **Details:** 0-9 Keypad with 'Delete' and 'Decimal'. Sliding toggle for Expense/Income.
- **Validation:** Keypad updates a string state correctly; Toggle changes theme colors.

### Phase 3: Category Visuals
- **Files:** `src/components/transactions/CategoryGrid.tsx`, `src/constants/categories.ts`
- **Details:** Define 30+ categories with Lucide icons. Implement Tab-based filtering (Food, Transport, etc.).
- **Validation:** All icons render correctly and tabs switch smoothly.

### Phase 4: Integration
- **Files:** `src/app/add/page.tsx`
- **Details:** Combine Keypad, Grid, and Form. Add Note field. Redirect to Dashboard on success.
- **Validation:** Successful recording updates the Dashboard total and daily recap immediately.

## 5. Token & Cost Estimate
| Phase | Agent | Model | Est. Cost |
|-------|-------|-------|-----------|
| 1 | data_engineer | Pro | $0.15 |
| 2 | design_system_engineer | Pro | $0.20 |
| 3 | design_system_engineer | Pro | $0.25 |
| 4 | coder | Pro | $0.20 |
| **Total** | | | **~$0.80** |
