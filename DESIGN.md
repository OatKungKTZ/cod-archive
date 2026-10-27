# ระบบภาพ COD Archive

บันทึกระบบที่พัฒนาตามแผนที่ผู้ใช้อนุมัติ ไม่ใช่การเปลี่ยน Branding

- โหมดการใช้งาน: เครื่องมือส่วนตัว เน้นอ่านและบันทึกข้อมูลได้เร็ว
- พื้นหลัง `#0b0f12`, Surface `#12171b`, Surface ย่อย `#191f24`, ขอบ `#282f35`
- ตัวอักษร `#edf0f2`, รอง `#a1aab2`, Accent `#c7e86b`, ข้อความบน Accent `#17200b`
- สีเตือน `#efbd79`, ข้อผิดพลาด `#ef9f9f` พร้อมข้อความเสมอ
- ตัวอักษรหลัก Noto Sans Thai ในชื่อ Archive ใช้ทั้งภาษาไทยและข้อความ UI ส่วน Barlow Condensed ใช้หัวเรื่องตกแต่งภาษาอังกฤษและค่าตัวเลขขนาดใหญ่
- Card รัศมี 8–12px, Control 6–7px ใช้ขอบเพื่อแบ่งข้อมูล Shadow เฉพาะภาพและเมนูยกชั้น
- Desktop Sidebar 242px, iPad/iPhone Bottom Navigation 5 จุด, เนื้อหา 1–2 คอลัมน์ตามพื้นที่
- Timeline แนวตั้ง แยกสายเนื้อเรื่อง ไม่ลากเส้นเชื่อมข้ามสองสาย
- ภาพปก/คีย์อาร์ตจริงพร้อมแหล่งอ้างอิง ใช้ object-fit: contain เพื่อไม่ตัดชื่อเกมและป้าย Edition เก็บ SVG แบบ Typography ที่สร้างเองเป็น Fallback
- ไม่มี Entrance Sequence หรือ Animation ต่อเนื่อง ใช้ State Feedback สั้นและปิดเมื่อ Reduced Motion
- ข้อมูลสำคัญอ่านได้โดยไม่พึ่งสีเพียงอย่างเดียว พื้นที่แตะหลักอย่างน้อย 44px
- Theme Tokens อยู่ใน src/styles.css รวม Dark / Light / System
