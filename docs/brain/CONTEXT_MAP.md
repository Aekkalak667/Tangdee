# 🗺️ Context Map: ตังค์ดี (Tang Dee)

## 🏗️ Architecture Overview
- **Framework:** Next.js 14+ (App Router)
- **Database:** Firebase Firestore
- **Auth:** Firebase Google Authentication
- **State:** Global Context (Auth, Language, Wallet)
- **UI:** Minimalism High-contrast, 2rem rounding, Lucide Icons

## 🔗 Connection Links
- [[DECISION_LOG]] - บันทึกการตัดสินใจสำคัญ
- [[DEBUG_JOURNAL]] - บันทึกการแก้บั๊กที่เคยพบ

## 📍 Current State (2026-04-21)
- **[NEW] Wallet Management:** ระบบแก้ไขและลบกระเป๋าเงินเสร็จสมบูรณ์ 100%
- ระบบหลัก (Auth, Dashboard, Wallets, Transactions, Add/Transfer) ทำงานแบบ Real-time Firestore
- รองรับ 2 ภาษา (TH/EN) และ Atomic Transactions สำหรับการโอนเงิน
- ดีไซน์ Apple-style (Floating Nav, Bottom Sheets, Premium Rounding)
