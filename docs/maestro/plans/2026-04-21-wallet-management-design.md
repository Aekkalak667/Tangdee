# Design Document: ตังค์ดี (Tang Dee) - Phase 8: Wallet Management (Edit & Delete)

**design_depth:** standard
**task_complexity:** medium
**date:** 2026-04-21

## 1. Problem Statement
ผู้ใช้ต้องการแก้ไขข้อมูลกระเป๋าเงิน (ชื่อ, สี, ไอคอน) และลบกระเป๋าที่ไม่ใช้งานแล้วออกได้อย่างปลอดภัยและสวยงาม

## 2. Requirements (UI/UX Pro Max Optimized)
- **REQ-M1:** ระบบโหมดจัดการ (Management Mode) ที่หน้ากระเป๋าเงิน
- **REQ-M2:** ฟอร์มแก้ไขข้อมูลกระเป๋าเงิน (Reuse Create UI)
- **REQ-M3:** ระบบลบกระเป๋าเงินแบบ 2 ตัวเลือก (ลบเฉพาะใบ หรือ ลบข้อมูลทั้งหมด)
- **REQ-M4:** UI แบบ Apple-style (Rounded Modals, High-contrast)

## 3. Selected Approach: The "Manage Toggle"
เพิ่มสถานะ `isManageMode` ในหน้า Wallet เพื่อเปลี่ยนพฤติกรรมการคลิกจากการเลือกเป็นการจัดการ

## 4. Architecture
- **Services:** 
    - `walletService.ts` -> `updateWallet`, `deleteWallet`
    - `transactionService.ts` -> `deleteAllTransactionsByWallet`
- **Components:**
    - `EditWalletModal`: Overlay สำหรับแก้ไขข้อมูล
    - `DeleteConfirmation`: Modal สำหรับยืนยันการลบ
    - `WalletGridItem`: อัปเกรดให้แสดงปุ่มจัดการ

## 5. Agent Team
- **Data Engineer:** Implement deletion logic (batch delete for transactions).
- **Design System Engineer:** Build the Modal components and Manage Mode animations.
- **Coder:** Integrate the toggle logic and form state management.

## 6. Success Criteria
- สามารถแก้ไขข้อมูลและเห็นผลทันทีแบบ Real-time
- ระบบลบทำงานได้อย่างแม่นยำ ไม่เหลือข้อมูลขยะ
- UI สวยงามและให้ความรู้สึกปลอดภัยแก่ผู้ใช้
