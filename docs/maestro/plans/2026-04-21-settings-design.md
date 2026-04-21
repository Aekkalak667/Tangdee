# Design Document: ตังค์ดี (Tang Dee) - Phase 4: Premium Settings Page

**design_depth:** standard
**task_complexity:** medium
**date:** 2026-04-21

## 1. Problem Statement
ผู้ใช้ต้องการหน้าศูนย์กลางการจัดการที่สวยงามและใช้งานง่าย เพื่อดูข้อมูลส่วนตัวและปรับแต่งภาษาของแอพ

## 2. Requirements (UI/UX Pro Max Optimized)
- **REQ-S1:** Header โปรไฟล์สไตล์ Apple (Avatar ใหญ่, ฟอนต์ Bold, ระยะห่างสมบูรณ์แบบ)
- **REQ-S2:** ระบบเลือกภาษาแบบ List Selection พร้อมอนิเมชั่นการเลือก
- **REQ-S3:** การจัดกลุ่มเมนูด้วย Card 2rem (White background, Hairline border)
- **REQ-S4:** ปุ่ม Logout แบบ High-contrast (Minimalist but clear)

## 3. Selected Approach: The "Layered Minimalism"
เน้นการใช้ Shadow ที่บางเบาซ้อนทับบนพื้นหลังสีขาว และการใช้ไอคอน Lucide ที่มีเส้นบางพรีเมียม

## 4. Architecture
- **State Integration:** เชื่อมต่อ `LanguageContext` เพื่อสลับภาษาแบบ Real-time
- **Components:**
    - `src/components/settings/ProfileHeader.tsx`
    - `src/components/settings/MenuSection.tsx`
    - `src/components/settings/LanguageList.tsx`

## 5. Agent Team
- **UX Designer:** ออกแบบ Hierarchy และระยะห่าง (Golden Ratio)
- **Design System Engineer:** สร้างคอมโพเนนต์ Menu Row และ Avatar
- **Coder:** เชื่อมต่อ Logic การสลับภาษาและ Auth

## 6. Success Criteria
- หน้าตั้งค่าสวยงามสอดคล้องกับหน้า Login 100%
- สลับภาษาได้ถูกต้องและลื่นไหล
- UI ตอบสนองได้ดีเยี่ยมบนมือถือ
