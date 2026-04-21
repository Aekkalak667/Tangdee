# Design Document: ตังค์ดี (Tang Dee) - Phase 2: Dashboard Overview

**design_depth:** standard
**task_complexity:** medium
**date:** 2026-04-21

## 1. Problem Statement
ผู้ใช้ต้องการเห็นภาพรวมทางการเงินของตัวเอง (ยอดรวมทุกกระเป๋า) ได้อย่างรวดเร็วและสวยงาม โดยเน้นความง่ายในการใช้งานและการเข้าถึงกระเป๋าเงินต่างๆ

## 2. Requirements
- **REQ-D1:** คำนวณยอดเงินรวม (Net Worth) จากทุกกระเป๋าแบบ Real-time
- **REQ-D2:** แสดงรายการกระเป๋าเงินในรูปแบบ Horizontal Carousel
- **REQ-D3:** มีทางลัดสำหรับเพิ่มธุรกรรม (Quick Actions)
- **REQ-D4:** แสดงสัดส่วนรายจ่ายด้วยระบบ Color Bar (No Charts)

## 3. Selected Approach: Clean Summary
เน้นความโปร่งโล่ง (Whitespace) และลำดับความสำคัญของตัวเลขเป็นหลัก

## 4. Architecture
- **Real-time Engine:** Firebase `onSnapshot` listener on `users/{uid}/wallets`
- **UI Components:** 
    - `NetWorthCard`: Big typography for total balance.
    - `WalletCarousel`: CSS-based scroll snap container.
    - `QuickActionHub`: Floating or prominent button group.

## 5. Agent Team
- **Data Engineer:** Implement aggregate fetching logic.
- **Coder:** Build the Dashboard layout and state management.
- **Design System Engineer:** Refine the Carousel and Summary Bar components.

## 6. Risk Assessment
- **Performance (Low):** การดึงข้อมูลหลายกระเป๋าพร้อมกัน (ถ้ามีเยอะมาก) อาจต้องทำ Pagination ในอนาคต
- **State Sync (Medium):** ตรวจสอบให้แน่ใจว่ายอดเงินรวมอัปเดตทันทีเมื่อมีการเพิ่ม/แก้ไขกระเป๋า

## 7. Success Criteria
- ยอดเงินรวมตรงตามจริงใน Firestore
- สามารถเลื่อนสไลด์ดูแต่ละกระเป๋าได้ลื่นไหล
- UI สวยงามตามสไตล์ Minimalism
