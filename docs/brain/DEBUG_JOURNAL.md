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
