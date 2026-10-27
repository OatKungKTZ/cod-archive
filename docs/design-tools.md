# เครื่องมือออกแบบของ COD Archive

ติดตั้งแบบ Project-local ใน `.agents/skills/` วันที่ 27 ตุลาคม 2026 จาก Repository ต้นทาง ไม่ได้ติดตั้งเป็น ChatGPT Plugin และไม่ได้เปลี่ยนเครื่องมือของบัญชีผู้ใช้

| ชุด                         | ต้นทาง                                                     | หน้าที่                                                | สิทธิ์                                                 |
| --------------------------- | ---------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| Impeccable                  | https://github.com/pbakaus/impeccable                      | แนวทางออกแบบและตรวจคุณภาพ UI                           | Apache-2.0                                             |
| Transitions.dev             | https://github.com/Jakubantalik/transitions.dev            | CSS transitions และ Reduced Motion                     | ใช้ในแอปได้ ห้ามขายต่อเป็นคลัง transitions คู่แข่ง     |
| GSAP Skills                 | https://github.com/greensock/gsap-skills                   | ความรู้ Animation, React และ Performance               | MIT สำหรับ Skills; ตัวไลบรารี GSAP มีใบอนุญาตของตัวเอง |
| Make Interfaces Feel Better | https://github.com/jakubkrehel/make-interfaces-feel-better | Typography, พื้นที่แตะ, ไอคอน และรายละเอียดปฏิสัมพันธ์ | MIT                                                    |

รวม 13 Skills: Impeccable 1, Transitions.dev 3, GSAP 8 และ Make Interfaces Feel Better 1 ทุกชุดมีสำเนาใบอนุญาต `UPSTREAM-LICENSE` และบันทึก Commit พร้อม SHA-256 ใน `design-tools.lock.json`

## วิธีใช้กับ Codex

เปิด Codex ที่โฟลเดอร์โครงการ หากรายชื่อ Skills ยังไม่ปรากฏ ให้เริ่ม Session ใหม่ ตัวอย่างคำขอ: `ใช้ impeccable ตรวจความชัดเจนของหน้าคลังเกม` หรือ `ใช้ make-interfaces-feel-better ตรวจพื้นที่แตะและตัวอักษรบน iPhone`

Session ปัจจุบันสามารถอ่าน `SKILL.md` โดยตรงได้ การคัดลอกไฟล์ไม่ได้รับประกันว่า Slash Commands หรือ Skills Catalog ของระบบ Cloud จะโหลดใหม่ทันที

ไม่ได้เปิด Automatic Hooks, ติดตั้งส่วนขยาย Browser, ใช้ Refine Relay, Login บริการ Pro หรือส่งข้อมูลส่วนตัวไปบริการออกแบบ การเรียก Impeccable engine ครั้งแรกอาจดาวน์โหลด Binary ที่ตรวจ Hash จาก Release ต้นทาง ส่วนการใช้ Visual-world Roll/Live เป็นอีกขั้นตอนหนึ่งและมีการเชื่อมต่อบริการตามเอกสารต้นทาง

Skills เป็นเครื่องมือพัฒนา ไม่รวมใน `dist` หรือ Offline Cache ของแอป และยังไม่เพิ่ม `gsap`, `@gsap/react`, Motion หรือบริการรายเดือนลง Dependencies การจะใช้ Animation ต้องเหมาะกับงานและเคารพ Reduced Motion เสมอ

## ตรวจและอัปเดต

ตรวจ SHA-256 เทียบ Lockfile ก่อนอัปเดต ดาวน์โหลดเวอร์ชันใหม่ไปพื้นที่ชั่วคราว ตรวจความแตกต่าง คำสั่ง สคริปต์ และใบอนุญาต แล้วเปลี่ยนเฉพาะชุดที่เลือกพร้อมอัปเดต Lockfile ไม่ใช้การดึงเวอร์ชันล่าสุดอัตโนมัติระหว่าง Build
