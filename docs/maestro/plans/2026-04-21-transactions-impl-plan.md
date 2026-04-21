# Implementation Plan: ตังค์ดี (Tang Dee) - Phase 6: Transactions History

**task_complexity:** medium
**date:** 2026-04-21

## 1. Plan Overview
แผนนี้จะสร้างหน้ารายการธุรกรรมทั้งหมดที่จัดกลุ่มตามวัน พร้อมระบบกรองข้อมูลและค้นหาที่ทันสมัยที่สุด (Apple-style UX)

## 2. Dependency Graph
- [Phase 1] -> [Phase 4]
- [Phase 2] -> [Phase 4]
- [Phase 3] -> [Phase 4]

## 3. Execution Strategy
| Stage | Agent | Mode | Description |
|-------|-------|------|-------------|
| 1 | data_engineer | Parallel | Filtering & Search Logic |
| 2 | design_system_engineer | Parallel | Filter Bar & Search UI |
| 3 | design_system_engineer | Parallel | Grouped List UI |
| 4 | coder | Sequential | Final Integration & Search State |

## 4. Phase Details

### Phase 1: Data Logic
- **Files:** `src/services/transactionService.ts`
- **Details:** Add `fetchTransactions({ uid, walletId?, month, year, search? })`. Support real-time grouping by date.
- **Validation:** Function returns grouped data correctly for various filter combinations.

### Phase 2: Filter UI
- **Files:** `src/components/transactions/FilterBar.tsx`, `src/components/transactions/SearchBar.tsx`
- **Details:** Pill buttons with horizontal scroll. Expandable search input.
- **Validation:** UI is responsive and follows the Minimalism theme.

### Phase 3: List UI
- **Files:** `src/components/transactions/TransactionGroup.tsx`, `src/components/transactions/TransactionItem.tsx`
- **Details:** Use Sticky headers for dates. High-contrast colors for amounts. Lucide icons in circle wrappers.
- **Validation:** List renders beautifully with mock and real data.

### Phase 4: Integration
- **Files:** `src/app/transactions/page.tsx`
- **Details:** Manage `filters` state. Connect all components. Add loading and empty states (using uxuipromax logic).
- **Validation:** Full flow: Select month -> Select wallet -> Search -> Correct list shown.

## 5. Token & Cost Estimate
| Phase | Agent | Model | Est. Cost |
|-------|-------|-------|-----------|
| 1 | data_engineer | Pro | $0.20 |
| 2 | design_system_engineer | Pro | $0.20 |
| 3 | design_system_engineer | Pro | $0.20 |
| 4 | coder | Pro | $0.20 |
| **Total** | | | **~$0.80** |
