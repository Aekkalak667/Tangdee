# 📓 Debug Journal: ตังค์ดี (Tang Dee)

## 🐞 Fixed Issues

### 1. Firestore Timestamp Error
- **Issue:** `t.date.toLocaleTimeString is not a function`
- **Root Cause:** ข้อมูลจาก Firestore มาเป็น Timestamp object ไม่ใช่ JS Date
- **Fix:** ใช้ `.toDate()` แปลงค่าก่อนเรียกใช้ฟังก์ชันจัดการวันที่

### 2. Missing `uid` in Transactions
- **Issue:** บันทึกรายการแล้วไม่โผล่ในหน้าเว็บ
- **Root Cause:** ลืมส่ง `uid` เข้าไปในชุดข้อมูล ทำให้ Query กรองทิ้งเพราะหาเจ้าของไม่เจอ
- **Fix:** เพิ่มการดึง `user.uid` จาก AuthContext เข้าไปในฟังก์ชันบันทึก

### 3. Navigation Overlap
- **Issue:** แถบเมนูล่างทับปุ่มสำคัญ
- **Root Cause:** ลืมใส่ Padding-bottom ในคอนเทนเนอร์หลักของแต่ละหน้า
- **Fix:** เพิ่ม `padding-bottom: 8rem` ให้กับทุกหน้าที่มีระบบนำทาง

### 4. Nested Button Error
- **Issue:** `In HTML, <button> cannot be a descendant of <button>`
- **Root Cause:** ใส่ปุ่มแก้ไข/ลบ ซ้อนไว้ในการ์ดที่เป็นปุ่ม
- **Fix:** เปลี่ยนตัวหุ้มการ์ดจาก `<button>` เป็น `<div>` พร้อมจัดการ Accessibility

### 5. Modal Z-Index & Logic Wiring
- **Issue:** Modal โดน Bottom Nav บัง และปุ่มลบกดแล้วไม่ทำงาน
- **Root Cause:** `z-index` ต่ำเกินไป และ Props ระหว่าง Modal กับ Page ไม่ตรงกัน
- **Fix:** ปรับ `z-index: 3000` และเชื่อมต่อ `onConfirm` ให้ส่งค่า boolean กลับไปที่ฟังก์ชันลบจริง

### 6. Vitest Firebase Mock TypeError
- **Issue:** `TypeError: Cannot read properties of undefined (reading 'includes')` ในไฟล์เทสต์
- **Root Cause:** ฟังก์ชัน `doc()` mock ไว้ให้รับ 3 อาร์กิวเมนต์ แต่ในโค้ดจริงบางจุดส่งแค่ 1 หรือ 2 ตัว (Variadic Arguments)
- **Fix:** ปรับการเขียน Mock ให้ใช้ `(...args)` และเช็กชนิดข้อมูลของอาร์กิวเมนต์ตัวที่ 2 ก่อนประมวลผลสตริง เพื่อรองรับทุกรูปแบบการเรียกใช้ใน Firebase v10+

### 7. Missing Icons Build Error
- **Issue:** `Export Github doesn't exist in target module lucide-react`
- **Root Cause:** เวอร์ชันของ `lucide-react` เก่าเกินไป (`1.8.0`) และมีการถอด Brand Icons ออกในเวอร์ชันใหม่
- **Fix:** อัพเกรด `lucide-react@latest` และเปลี่ยนการใช้ไอคอนแบรนด์ (Github/Twitter) ไปใช้ไอคอนมาตรฐาน (Globe/Mail/User) เพื่อให้ Build ผ่านและแสดงผลได้คงเส้นคงวา

### 8. Action Sheet Obscured by Bottom Nav
- **Issue:** ปุ่ม "ยกเลิก" ใน TransactionActionSheet โดนแถบ Bottom Nav บัง ทำให้กดยากหรือมองไม่เห็น
- **Root Cause:** Padding-bottom ของ Bottom Sheet ไม่เพียงพอที่จะดันเนื้อหาขึ้นมาเหนือแถบเมนูที่ลอยอยู่ (Floating Nav)
- **Fix:** เพิ่ม `padding-bottom: 8rem` ให้กับ `.sheet` ในไฟล์ `TransactionActionSheet.module.css` เพื่อให้เนื้อหาทั้งหมดลอยพ้นแถบนำทางหลัก
