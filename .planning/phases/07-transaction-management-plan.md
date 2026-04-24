# 🔴 แผนการเพิ่มฟีเจอร์ ลบ และ แก้ไข รายการ (Transactions Edit/Delete)

ออกแบบโดยทีม UI/UX Pro Max เพื่อความพรีเมียมสไตล์ Apple-Minimalism

## 🛠️ รายละเอียดการเปลี่ยนแปลง

### 1. ฐานข้อมูล (Firestore Service)
- เพิ่มฟังก์ชัน `deleteTransactionWithUpdate`: ลบรายการพร้อมอัปเดตยอดเงินในกระเป๋าคืนแบบ Atomic (ใช้ `runTransaction`)
- เพิ่มฟังก์ชัน `updateTransactionWithUpdate`: แก้ไขรายการเดิม โดยล้างผลกระทบเก่าและใส่ผลกระทบใหม่ในยอดเงิน (Atomic)

### 2. ส่วนแสดงผล (UI/UX)
- **Action Bottom Sheet**: เมื่อแตะที่รายการธุรกรรม จะมีเมนูเลื่อนขึ้นมาจากด้านล่าง (Bottom Sheet) 
- **Apple Style Design**: เมนูมีความโค้งมน (2rem radius), พื้นหลังเบลอ (Glassmorphism), และปุ่มกดที่ชัดเจน
- **ปุ่มแก้ไข (Edit)**: นำทางไปยังหน้าแก้ไขที่มีฟอร์มเหมือนหน้าเพิ่ม (แต่ดึงข้อมูลเก่ามาแสดง)
- **ปุ่มลบ (Delete)**: แสดงการยืนยัน (Confirmation) ก่อนลบจริง เพื่อป้องกันความผิดพลาด

### 3. หน้าแก้ไข (Edit Transaction Page)
- สร้างหน้า `/transactions/[id]/edit` โดยใช้ Logic ร่วมกับหน้าเพิ่มเงิน
- รองรับการดึงข้อมูล Real-time มาแสดงก่อนแก้ไข

---

## 🏗️ แผนการทำงาน (Phases)

### Phase 1: Logic & Service
- [ ] อัปเดต `src/services/transactionService.ts` เพิ่ม `deleteTransactionWithUpdate`
- [ ] อัปเดต `src/services/transactionService.ts` เพิ่ม `updateTransactionWithUpdate`

### Phase 2: Action UI (Bottom Sheet)
- [ ] สร้างคอมโพเนนต์ `TransactionActionSheet.tsx` ด้วย `framer-motion`
- [ ] อัปเดตหน้า `src/app/transactions/page.tsx` ให้เรียกใช้ Action Sheet เมื่อคลิกรายการ

### Phase 3: Edit Feature
- [ ] สร้างหน้าแก้ไข `/src/app/transactions/[id]/edit/page.tsx`
- [ ] ทดสอบความถูกต้องของยอดเงิน (Balance) หลังลบและแก้ไข

---

**TechLead Mandate:** ต้องมั่นใจว่ายอดเงินในกระเป๋า (Wallet Balance) จะถูกต้องเสมอหลังมีการลบหรือแก้ไข โดยใช้ Firestore Transactions เท่านั้น
