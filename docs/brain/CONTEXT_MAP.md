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
- ระบบหลัก (Auth, Dashboard, Wallets, Transactions, Add/Transfer) ทำงานได้สมบูรณ์แบบบนข้อมูลจริง (Real-time Firestore)
- รองรับ 2 ภาษา (TH/EN) พร้อมระบบจำภาษาล่าสุด
- รองรับการโอนเงินระหว่างกระเป๋าแบบ Atomic Transaction
