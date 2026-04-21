# Design Document: ตังค์ดี (Tang Dee) - Phase 6: Premium Transactions History

**design_depth:** standard
**task_complexity:** medium
**date:** 2026-04-21

## 1. Problem Statement
ผู้ใช้ต้องการเห็นประวัติการเงินทั้งหมดที่จัดระเบียบตามวัน และสามารถค้นหาหรือกรองข้อมูลตามกระเป๋าเงินและช่วงเวลาได้อย่างรวดเร็วและสวยงาม

## 2. Requirements (UI/UX Pro Max Optimized)
- **REQ-T1:** ระบบแสดงรายการแยกตามกลุ่มวันที่ (Daily Grouping)
- **REQ-T2:** ระบบกรอง (Filter) ตามกระเป๋าเงินและเดือนแบบ Horizontal Pill
- **REQ-T3:** ระบบค้นหา (Search) แบบ Real-time
- **REQ-T4:** ดีไซน์พรีเมียม Minimalism (Apple Style), 2rem radius, High-contrast

## 3. Selected Approach: The "Seamless Ledger"
ใช้ Layout แบบรายการเดียวที่เลื่อนได้ต่อเนื่อง (Continuous Scroll) พร้อมระบบนำทางส่วนบนที่คงที่ (Sticky Header) เพื่อความสะดวกในการกรอง

## 4. Architecture
- **State:** `selectedMonth`, `selectedWalletId`, `searchQuery`
- **Data Source:** Firestore `transactions` collection
- **Components:**
    - `FilterBar`: Pill-based scrolling selector.
    - `TransactionList`: Grouped logic for daily rendering.
    - `SearchBar`: Expandable minimalist input.

## 5. Agent Team
- **Data Engineer:** Implement transaction fetcher and search/filter logic.
- **Design System Engineer:** Build the Transaction Item and Pill components.
- **Coder:** Build the main page and integrate all filters.

## 6. Success Criteria
- แสดงข้อมูลครบถ้วนตามกระเป๋าและเดือนที่เลือก
- ระบบค้นหาทำงานได้รวดเร็ว
- UI สวยงามและตอบสนองได้ดีเยี่ยมบนมือถือ (425px+)
