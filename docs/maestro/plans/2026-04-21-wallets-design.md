# Design Document: ตังค์ดี (Tang Dee) - Phase 5: Wallet Management & Switching

**design_depth:** standard
**task_complexity:** medium
**date:** 2026-04-21

## 1. Problem Statement
ผู้ใช้ต้องการเห็นกระเป๋าเงินทั้งหมดในหน้าเดียวและต้องการสลับดูข้อมูลเฉพาะเจาะจงของแต่ละกระเป๋าในหน้าหลักได้อย่างรวดเร็ว

## 2. Requirements
- **REQ-W1:** แสดงรายการกระเป๋าเงินทั้งหมดในรูปแบบ 2-Column Grid
- **REQ-W2:** ระบบสลับกระเป๋า (Wallet Switching) ที่มีผลต่อข้อมูลใน Dashboard
- **REQ-W3:** ปุ่มเพิ่มกระเป๋าใหม่ (Add Wallet) ที่เข้าถึงง่าย
- **REQ-W4:** UI เข้าธีม Minimalism High-contrast (2rem radius)

## 3. Selected Approach: The "Global Selector"
ใช้ระบบ Global State เพื่อจดจำกระเป๋าที่ผู้ใช้เลือก และทำการกรองข้อมูล (Filter) ในหน้า Dashboard โดยอ้างอิงจากสถานะนี้

## 4. Architecture
- **State Management:** เพิ่ม `activeWalletId` ใน `WalletContext` (หรือสร้าง Context ใหม่)
- **UI Components:**
    - `WalletGridItem`: การ์ดจิ๋วพรีเมียมสำหรับการเลือก
    - `AddWalletCard`: ปุ่มกดรูปทรงเดียวกับการ์ดสำหรับเพิ่มข้อมูลใหม่
- **Page:** `src/app/wallet/page.tsx`

## 5. Agent Team
- **Coder:** จัดการระบบ Global State และระบบ Switching
- **Design System Engineer:** พัฒนา Grid Layout และ Component การ์ดจิ๋ว
- **Data Engineer:** ปรับปรุง Firestore Hook ให้รองรับการกรองตาม Wallet ID

## 6. Success Criteria
- สามารถเลือกกระเป๋าในหน้า Wallet และนำทางกลับไปหน้า Dashboard ได้ถูกต้อง
- หน้า Dashboard แสดงข้อมูลเฉพาะของกระเป๋าที่เลือก
- ดีไซน์สวยงามและลื่นไหล (Apple-level UX)
