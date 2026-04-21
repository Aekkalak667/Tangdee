# Design Document: ตังค์ดี (Tang Dee) - Phase 3: Layout & Navigation

**design_depth:** standard
**task_complexity:** medium
**date:** 2026-04-21

## 1. Problem Statement
ผู้ใช้ต้องการระบบนำทางที่สะดวก (Bottom Nav) และต้องการเห็นข้อมูลที่ครบถ้วนในหน้าเดียว (สรุปรายวัน + ปฏิทิน) โดยที่ยังคงความสวยงามแบบ Minimalism

## 2. Requirements
- **REQ-L1:** สร้างคอมโพเนนต์ **Bottom Navigation** ที่ล็อคไว้ด้านล่างสุดของจอ (Sticky)
- **REQ-L2:** พัฒนา **Mini Calendar** แสดงผลยอดรายวันแบบเรียบง่าย
- **REQ-L3:** ปรับขนาดคอมโพเนนต์เดิม (NetWorth, Carousel) ให้กะทัดรัดขึ้น
- **REQ-L4:** เพิ่มส่วนสรุปรายวัน (Daily Recap: Income/Expense)

## 3. Selected Approach: The "Floating shortcuts"
ใช้ Layout แบบเลื่อนได้ปกติ (Standard Scroll) แต่มีเมนูด้านล่างที่เป็น `position: fixed` หรือ `sticky` เพื่อให้กดได้ตลอดเวลา

## 4. Architecture
- **Navigation:** ใช้ Next.js `Link` ในคอมโพเนนต์ `BottomNav`
- **Calendar Logic:** คำนวณวันที่ในเดือนปัจจุบันและดึงยอดสรุปจาก Firestore รายวัน
- **Components:**
    - `src/components/navigation/BottomNav.tsx`
    - `src/components/dashboard/MiniCalendar.tsx`
    - `src/components/dashboard/DailyRecap.tsx`

## 5. Agent Team
- **Design System Engineer:** สร้างคอมโพเนนต์ UI ใหม่ทั้งหมด
- **Coder:** จัดการระบบนำทาง (Routing) และ Logic ของปฏิทิน
- **Data Engineer:** พัฒนา Query สำหรับดึงข้อมูลสรุปรายวันและรายเดือน

## 6. Risk Assessment
- **UI Clutter (Medium):** การใส่ปฏิทินและสรุปรายวันในหน้าแรกอาจทำให้ดูรก ต้องเน้นใช้ Whitespace ให้ดี
- **Firestore Query (High):** การดึงยอดเงินทุกวันในปฏิทินอาจใช้ Read เยอะ ต้องวางแผนการทำ Index หรือ Aggregation ให้ดี
