# Design Document: ตังค์ดี (Tang Dee) - Phase 1: Authentication & Wallet Creation

**design_depth:** standard
**task_complexity:** medium
**date:** 2026-04-21

## 1. Problem Statement
ผู้ใช้ต้องการระบบจัดการรายรับ-รายจ่ายที่เริ่มต้นใช้งานได้ง่าย มีความสวยงามระดับพรีเมียม และปรับแต่งกระเป๋าเงินใบแรกได้ตามสไตล์ของตัวเอง (Minimalism)

## 2. Requirements
- **REQ-1:** รองรับ Google Login (Firebase Auth)
- **REQ-2:** ระบบตรวจสอบผู้ใช้ใหม่และบังคับสร้างกระเป๋าเงินใบแรก
- **REQ-3:** หน้าสร้างกระเป๋าเงินแบบ Live Card Preview (ไอคอน, สี, ประเภท)
- **REQ-4:** รองรับ Responsive Design (Mobile First)

## 3. Selected Approach: The "Seamless Card"
เราเลือกใช้ Next.js 14+ ร่วมกับ Vanilla CSS เพื่อประสิทธิภาพสูงสุด โดยเน้นการทำ Interaction ที่ลื่นไหลในหน้าเดียว (Single-page creation flow)

### Decision Matrix
| Criterion | Approach 1 (Card) | Approach 2 (Stepper) |
|-----------|-------------------|----------------------|
| UX (40%) | 5 | 3 |
| Style (30%) | 5 | 4 |
| Speed (20%) | 3 | 5 |
| Total | **4.5** | **3.8** |

## 4. Architecture
- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** CSS Modules (Vanilla CSS)
- **Backend:** Firebase (Auth, Firestore)
- **Key Components:**
    - `src/components/auth/LoginButton.tsx`
    - `src/components/wallet/CardPreview.tsx`
    - `src/components/wallet/WalletForm.tsx`

## 5. Agent Team
- **Coder:** Logic, Firebase Integration
- **Design System Engineer:** Styling, Components
- **Tester:** Quality Assurance

## 6. Risk Assessment
- **Domain Configuration:** ต้องตั้งค่า Redirect URL ใน Firebase/Netlify ให้ถูกต้อง
- **Mobile UX:** หน้า Preview ต้องปรับเป็นแนวนอนหรือลดขนาดให้พอดีบนจอเล็ก

## 7. Success Criteria
- Login Google สำเร็จ
- สร้างกระเป๋าใบแรกและข้อมูลเข้า Firestore สำเร็จ
- UI สวยงามตามสไตล์ Minimalism
