# ภาพปกและคีย์อาร์ต COD Archive

อัปเดตตามคำขอผู้ใช้ให้ใส่ภาพปกจริง ตรวจภาพแต่ละภาคด้วยตาและตรวจ Source วันที่ 27 ตุลาคม 2026

## แหล่งภาพ

| เกม | แหล่ง | ประเภท |
|---|---|---|
| Modern Warfare (2019) | PlayStation US | ภาพผลิตภัณฑ์ Digital |
| Modern Warfare II | PlayStation US | ภาพ Cross-Gen Bundle |
| Modern Warfare III | PlayStation US | ภาพ Cross-Gen Edition |
| Black Ops (2010) | หน้าร้าน Steam App 42700 | ภาพเกมต้นฉบับ PC ไม่ได้ยืนยันเวอร์ชัน PS4/PS5 |
| Black Ops Cold War | PlayStation US | ภาพ Cross-Gen Bundle |
| Black Ops II | หน้าร้าน Steam App 202970 | ภาพเกมต้นฉบับ PC ไม่ได้ยืนยันเวอร์ชัน PS4/PS5 |
| Black Ops 6 | PlayStation US | ภาพ Cross-Gen Bundle |
| Black Ops 7 | PlayStation US | ภาพ Cross-Gen Bundle |
| Modern Warfare 4 | Activision Media Center | คีย์อาร์ตที่แจกใน Media Center |

URL หน้าที่มา URL ไฟล์ต้นทาง วันที่ตรวจ ขนาด และ SHA-256 อยู่ใน `src/data/covers.json` Components ใช้รายการเดียวกันเพื่อไม่ให้ภาพกับเครดิตคลาดกัน

## ลิขสิทธิ์และบริบทการใช้

ภาพเป็นงานลิขสิทธิ์ของ Activision และเจ้าของที่เกี่ยวข้อง ไม่ใช่ภาพที่โครงการสร้างเอง ไม่ใช่ Public Domain หรือภาพที่โครงการออกใบอนุญาตต่อได้ ใช้เป็นภาพอ้างอิงเพื่อระบุเกมในคลังส่วนตัวที่ไม่แสวงหากำไรตามคำขอผู้ใช้ และแสดงเครดิต/ลิงก์ต้นทางในรายละเอียดเกม

ตรวจ [Activision Terms of Use](https://www.activision.com/legal/terms-of-use) และ [Media Center](https://press.activision.com/downloads) แล้ว ข้อกำหนดทั่วไปไม่ใช่ใบอนุญาตแบบเปิดหรือหนังสืออนุญาตให้เผยแพร่ภาพซ้ำทุกกรณี การบันทึกที่มาหรือการให้เครดิตไม่ได้สร้างสิทธิ์เผยแพร่ซ้ำขึ้นเอง โครงการไม่ได้อ้างว่าได้รับหนังสืออนุญาตเฉพาะจากเจ้าของภาพ

ไม่ใส่แถบ PS4/PS5 ปลอม ไม่เปลี่ยนโลโก้ ไม่ลบข้อความในภาพ และไม่อ้างว่าภาพ Digital เป็นปกแผ่น Region/Edition ที่ผู้ใช้มี ภาพ BO1/BO2 จาก Steam ไม่เปลี่ยนข้อมูลความเข้ากันได้บน PS5 Pro

## การแสดงผลและ Offline

ไฟล์จริงรวมประมาณ 876 KB เก็บใน `public/covers/` เพื่อไม่พึ่ง Hotlink และให้ PWA Precache ได้ ใช้ `object-fit: contain` แสดงภาพครบทั้งใบ ภาพสี่เหลี่ยมจัตุรัสอาจมีพื้นที่ว่างในกรอบแนวตั้ง เพื่อไม่ตัดชื่อเกมหรือ Edition

หากภาพจริงโหลดไม่ได้ ใช้ SVG เดิมที่สร้างเอง ถ้า SVG โหลดไม่ได้ด้วยจะแสดงชื่อย่อ ไม่มีการวนขอภาพที่เสียซ้ำไม่สิ้นสุด การสลับเกมจะเลือกภาพใหม่ได้แม้เกมก่อนหน้าใช้ Fallback

เวอร์ชันนี้ไม่แก้ Schema หรือข้อมูลส่วนตัว การอัปเดต PWA จะเพิ่มภาพใน Cache และยังเก็บ Collection/Backup เดิม
