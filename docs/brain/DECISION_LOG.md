# 📝 Decision Log: ตังค์ดี (Tang Dee)

| วันที่ | หัวข้อ | การตัดสินใจ | เหตุผล |
| :--- | :--- | :--- | :--- |
| 2026-04-21 | Data Architecture | ใช้ `runTransaction` สำหรับการบันทึก | เพื่อความแม่นยำของยอดเงินในกระเป๋า (Atomic Updates) |
| 2026-04-21 | UI Strategy | Minimalism + High Contrast | เพื่อความพรีเมียมและสะอาดตา ลด Cognitive Load |
| 2026-04-21 | Nav Design | Floating Pill Bottom Nav | เพิ่มความเป็น App-like และเข้าถึงง่ายด้วยนิ้วโป้ง |
| 2026-04-21 | i18n | Dictionary-based Mapping | ง่ายต่อการขยายผลและรองรับระบบ Real-time switching |
| 2026-04-21 | Wallet Management | Management Mode Toggle | เพื่อความสะอาดของ UI โดยแยกโหมดการเลือกและโหมดแก้ไขออกจากกัน |
| 2026-04-21 | Deletion Strategy | Dual-option Delete | ให้ผู้ใช้เลือกระหว่าง "ลบแค่กระเป๋า" หรือ "ลบข้อมูลทั้งหมด" เพื่อความยืดหยุ่น |
| 2026-04-21 | Testing Framework | Vitest + Manual Mocks | เลือก Vitest เพราะเร็วและรองรับ ESM/TypeScript ได้ดีมากสำหรับโปรเจกต์ Next.js |
| 2026-04-21 | Data Fetching | Firestore Pagination (limit/startAfter) | ป้องกันปัญหาคอขวดเมื่อธุรกรรมมีจำนวนมาก (Scale) และลดค่าใช้จ่าย Firestore Reads |
| 2026-04-21 | UI Component | Intersection Observer (Sentinel) | ใช้ระบบเลื่อนหน้าจออัตโนมัติ (Infinite Scroll) แทนปุ่ม "โหลดเพิ่ม" เพื่อประสบการณ์แบบ Seamless |
| 2026-04-21 | PWA Configuration | Standalone Mode & Viewport Cover | เพื่อซ่อน UI ของเบราว์เซอร์บน iOS และสร้างประสบการณ์เหมือน Native App อย่างสมบูรณ์ |
| 2026-04-21 | Page Transitions | Framer Motion (Apple Card Reveal) | เลือกใช้ `template.tsx` คู่กับ `cubic-bezier(0.22, 1, 0.36, 1)` เพื่อความนุ่มนวลแบบ iOS และเร่งด้วย GPU (`will-change`) |
| 2026-04-24 | Action Menu UI | Bottom Sheet (Slide-up) | ใช้ Bottom Sheet แทนเมนู Dropdown เพื่อให้เข้าถึงปุ่มลบ/แก้ไขได้ง่ายขึ้นด้วยนิ้วโป้งบนมือถือ และให้ความรู้สึกพรีเมียม |
| 2026-04-24 | Data Integrity | Inverse Transaction Logic | ในการแก้ไข/ลบรายการ จะใช้วิธีล้างผลกระทบเดิม (Reverse) ก่อนใส่ค่าใหม่ เพื่อลดความซับซ้อนของ Logic และเพิ่มความแม่นยำของยอดเงิน |
