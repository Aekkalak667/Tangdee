# Design Document: ตังค์ดี (Tang Dee) - Phase 7: Premium Add Transaction System

**design_depth:** standard
**task_complexity:** medium
**date:** 2026-04-21

## 1. Problem Statement
ผู้ใช้ต้องการบันทึกรายรับ-รายจ่ายที่รวดเร็ว สวยงาม และเห็นภาพชัดเจน (Visual-driven) โดยยอดเงินในกระเป๋าต้องอัปเดตอัตโนมัติ

## 2. Requirements (UI/UX Pro Max Optimized)
- **REQ-A1:** หน้าเพิ่มรายการแบบ Full-screen (Fixed View)
- **REQ-A2:** ระบบ Custom Keypad สำหรับป้อนจำนวนเงิน
- **REQ-A3:** รายการหมวดหมู่ (Categories) พร้อมไอคอน SVG แบ่งตาม Tabs
- **REQ-A4:** ระบบ Auto-Balance (Firestore Transaction)
- **REQ-A5:** รองรับ Note และการเลือก Wallet

## 3. Selected Approach: The "Visual Ledger"
เน้นการโต้ตอบด้วยภาพ (Icons) และการพิมพ์ที่รวดเร็วด้วย Keypad ที่ออกแบบมาเฉพาะ

## 4. Architecture
- **State Management:** `amount`, `type`, `categoryId`, `walletId`, `note`
- **Services:** `transactionService.ts` -> `addTransactionWithUpdate`
- **Components:**
    - `TransactionKeypad`: Custom 0-9 numeric pad.
    - `CategoryGrid`: Grouped by tabs (Food, Travel, etc.).
    - `TypeToggle`: Premium sliding segment.

## 5. Agent Team
- **Data Engineer:** Implement Firestore Atomic Transactions.
- **Design System Engineer:** Build the Keypad and extensive Icon Grid.
- **Coder:** Integrate the form and handle navigation.

## 6. Success Criteria
- ข้อมูลบันทึกสำเร็จและยอดเงินในกระเป๋าเปลี่ยนตามจริง
- UI ลื่นไหลและสวยงามตามมาตรฐาน Apple
- ผู้ใช้ใช้เวลาไม่เกิน 5-10 วินาทีในการบันทึกหนึ่งรายการ
