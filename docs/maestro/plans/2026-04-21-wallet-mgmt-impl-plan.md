# Implementation Plan: ตังค์ดี (Tang Dee) - Phase 8: Wallet Management

**task_complexity:** medium
**date:** 2026-04-21

## 1. Plan Overview
แผนนี้จะเพิ่มระบบการแก้ไขและลบกระเป๋าเงิน โดยผู้ใช้สามารถเข้าสู่โหมดจัดการเพื่อปรับแต่งข้อมูลหรือลบกระเป๋าเงินที่ไม่ต้องการได้อย่างปลอดภัย

## 2. Dependency Graph
- [Phase 1] -> [Phase 3]
- [Phase 2] -> [Phase 3]
- [Phase 3] -> [Phase 4]

## 3. Execution Strategy
| Stage | Agent | Mode | Description |
|-------|-------|------|-------------|
| 1 | data_engineer | Parallel | Delete & Update Services |
| 2 | design_system_engineer | Parallel | Modals & Management UI |
| 3 | coder | Sequential | Integration & Mode Toggle |
| 4 | tester | Sequential | Verification & Data Safety |

## 4. Phase Details

### Phase 1: Data Logic
- **Files:** `src/services/walletService.ts`, `src/services/transactionService.ts`
- **Details:** 
    - Implement `updateWalletMetadata(uid, walletId, data)`.
    - Implement `deleteWallet(uid, walletId, deleteTransactions: boolean)`.
- **Validation:** Deleting a wallet correctly handles its transactions based on the chosen option.

### Phase 2: UI Components
- **Files:** `src/components/wallet/DeleteModal.tsx`, `src/components/wallet/WalletGridItem.tsx`
- **Details:** 
    - Add Pencil/Trash icons to Grid Item when in manage mode.
    - Create a premium confirmation modal for deletion.
- **Validation:** Icons appear correctly; Modal follows Apple-style UI.

### Phase 3: Integration
- **Files:** `src/app/wallet/page.tsx`
- **Details:** 
    - Add "Manage" button in header.
    - Implement the logic to switch between 'Select' and 'Manage' behavior.
    - Connect to the Edit form (Reuse Create Wallet UI).
- **Validation:** Full flow: Toggle Manage -> Click Edit -> Save -> Changes reflect in Firestore.

### Phase 4: Verification
- **Files:** N/A (Manual/Automation tests)
- **Details:** Perform deep tests on data cleanup to ensure no orphan records remain.
- **Validation:** Database state is clean after deletion.

## 5. Token & Cost Estimate
| Phase | Agent | Model | Est. Cost |
|-------|-------|-------|-----------|
| 1 | data_engineer | Pro | $0.15 |
| 2 | design_system_engineer | Pro | $0.20 |
| 3 | coder | Pro | $0.20 |
| 4 | tester | Flash | $0.05 |
| **Total** | | | **~$0.60** |
