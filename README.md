# COD Archive

**Call of Duty Archive & Collection** — เว็บแอปส่วนตัวสำหรับติดตามเกม Call of Duty และการสะสมบน PS5 Pro พร้อม Disc Drive ใช้ภาษาไทยเป็นหลัก รองรับ iPhone, iPad, Desktop และ PWA แบบ Offline

## เริ่มใช้งานในเครื่อง

ต้องใช้ Node.js 24 และ npm

```bash
npm ci
npm run dev
```

เปิด URL `/cod-archive/` ตามที่ Vite แสดง การพัฒนาจะไม่ลงทะเบียน Production Service Worker ให้ทดสอบ Offline ด้วย Production Preview:

```bash
npm run build
npm run preview
```

เปิด `http://localhost:4173/cod-archive/` เส้นทางรายละเอียดเป็น `#/games/mw-2019` จึง Refresh บน GitHub Pages ได้

## ฟีเจอร์ V1

- Dashboard พร้อม Collection, Wishlist, สถานะเล่น และเกมแนะนำถัดไป
- Timeline แนวตั้ง 3 แบบ แยกสายเนื้อเรื่อง และแสดง BO2 ได้หลายช่วงเวลาโดยไม่นับเกมซ้ำ
- Catalog 9 รายการ รวม Modern Warfare 4 ชื่อ/วันวางจำหน่ายยืนยันจากหน้าทางการเมื่อ 27 ตุลาคม 2026 ส่วนลำดับเรื่องราวยังรอตรวจ
- Game Details แสดงสถานะความน่าเชื่อถือรายข้อ ไม่สมมติ FPS ราคา เวลา Campaign หรือแพ็กติดตั้ง
- สถานะครอบครองแยกจากการเล่น Wishlist แยกอีกชุดหนึ่ง
- บันทึกหลายสำเนาต่อเกม รูปแบบ Region Edition เรต สภาพ ร้าน วันที่ซื้อ และราคาจริง
- Wishlist ราคาเป้าหมาย ประวัติราคาที่ผู้ใช้พบ งบรวม และสถิติ
- Spoiler Preference แยกรายเกม ปิดเป็นค่าเริ่มต้น ไม่มีข้อมูลตอนจบหรือชื่อภารกิจที่ยังไม่ตรวจสอบ
- IndexedDB, Export/Import JSON ที่ตรวจ Schema และยืนยันก่อนแทนที่, Reset พร้อมยืนยันสองชั้น
- Dark / Light / System, Responsive, Safe Area, Reduced Motion, Keyboard Focus
- Manifest, ไอคอนต้นฉบับ, Offline Cache และปุ่มอัปเดตแอป

ภาพปกและคีย์อาร์ตจริงครบ 9 เกมมาจาก PlayStation, Steam และ Activision Media Center เก็บในแอปเพื่อใช้ Offline มีแหล่งอ้างอิงและเครดิตรายเกมใน `src/data/covers.json` ส่วน SVG เดิมใช้สำรองเมื่อภาพโหลดไม่ได้ ดู [แหล่งภาพและลิขสิทธิ์](docs/cover-art.md) ฟอนต์ Noto Sans Thai และ Barlow Condensed เก็บในโครงการพร้อม OFL

## ข้อมูลเริ่มต้น

MW2019 มีแล้วแบบ PS4 Disc, US, ESRB ไม่ระบุราคา และไม่ยืนยันสถานะเล่นจบ อีก 8 รายการยังไม่ยืนยันการครอบครอง ไม่เติม Wishlist ให้เอง Initial State ใช้เฉพาะเมื่อไม่มีข้อมูลฐานข้อมูล ไม่เติมกลับหลัง Reset หรืออัปเดตเว็บไซต์

## การจัดเก็บและ Backup

ข้อมูลส่วนตัวอยู่ใน IndexedDB ชื่อ `cod-archive-personal` Object Store `state` Schema 1 แยกจาก Catalog ที่ Build มากับแอป บันทึกสถานะสำเร็จหลัง Transaction เสร็จเท่านั้น และแสดงข้อผิดพลาดถ้าบันทึกไม่ได้

ข้อมูล **ไม่ซิงค์ข้ามอุปกรณ์** Safari และ PWA อาจมีคนละพื้นที่จัดเก็บ Origin/Browser Profile/โดเมนที่เปลี่ยนจะเป็นพื้นที่ข้อมูลอีกชุด ข้อมูลอาจหายเมื่อถูกล้างหรือระบบเรียกคืนพื้นที่ จึงควร Export ไป Files / iCloud Drive หลังซื้อเกมหรือเล่นจบ

ตั้งค่า → Export JSON → ตรวจว่าไฟล์ถูกเก็บแล้ว การแสดงวันที่ Export ล่าสุดหมายถึงกดสร้างไฟล์ ไม่ใช่ยืนยันการจัดเก็บสำเร็จ

Import จำกัด 5 MB ตรวจชนิดข้อมูล Enum จำนวนไม่ติดลบ วันที่ URL และ ID ซ้ำ รองรับเฉพาะ Schema 1 แสดงสรุปและแจ้งก่อนแทนที่ทั้งชุด เก็บข้อมูลเกมที่ไม่รู้จักไว้โดยไม่ทิ้งเงียบ ๆ ไม่มี Merge ใน V1 หาก Schema ใหม่กว่าแอปจะปฏิเสธและเก็บข้อมูลเดิม

การเพิ่ม Schema ในอนาคตต้องเพิ่ม Migration ที่ทดสอบได้และ Transaction เดียว ห้ามลบฐานข้อมูลเพื่อแก้ปัญหาเวอร์ชัน ไม่ล้าง IndexedDB ระหว่างเปลี่ยน Cache แอป ข้อมูลส่วนตัวและไฟล์ Backup ห้าม Commit ลง Repository

V1 เหมาะกับการแก้ข้อมูลในหน้าต่างหลักเดียว การแก้พร้อมกันหลาย Tab ยังไม่มีระบบแก้ Conflict ควรปิดหน้าต่างซ้ำก่อนแก้ไข

## ตรวจสอบและเพิ่มข้อมูลเกม

ข้อมูลกลางอยู่ใน `src/data/games.ts` หลักฐานที่ตรวจจริงอยู่ใน `src/data/verified.ts` และ [บันทึกแหล่งข้อมูล](docs/data-verification.md)

1. เพิ่มเกมด้วย ID ใหม่ที่ไม่เปลี่ยน ใช้ได้กับ Components เดิม
2. เพิ่มช่วงเหตุการณ์ใน `periods` ได้หลายช่วง และตรวจว่าปีไม่สปอยล์จุดหักมุม
3. กำหนดสายเนื้อเรื่องและลำดับแนะนำจากเหตุผลที่ตรวจสอบได้ อย่าจัดเกมที่ยังไม่ทราบแบบเดาสุ่ม
4. เพิ่มข้อเท็จจริงพร้อม `status`, URL และวันที่ตรวจ อย่าใช้ `verified` เพียงเพราะหน้าเว็บตอบ HTTP 200 ต้องอ่านว่าหน้านั้นตรงเกมจริง
5. ข้อมูล FPS ต้องแยกเวอร์ชัน โหมด และเงื่อนไข การมี PS5 Pro Enhanced ไม่แปลว่า 120 FPS
6. ราคาอ้างอิงในไทยต้องมีร้าน Edition Region สภาพสินค้า และวันที่ ไม่แปลงราคา US มาเป็นราคาไทยโดยไม่อธิบาย
7. ภาพต้องมีสิทธิ์ใช้งานชัดเจน วางใน `public/covers/` หรือใช้ภาพทดแทนเดิม
8. ทดสอบและ Build ก่อนเผยแพร่

ไม่ต้องแก้ Schema ข้อมูลส่วนตัวเมื่อเพิ่มเกม เพราะเชื่อมด้วย `gameId` เกมเดิมใช้ ID ตามรายการแรก แม้ชื่อแสดงผลถูกแก้ไข เช่น `mw4-pending` คง ID ไว้เพื่อไม่ทำข้อมูลหลุด

## Deploy ไป GitHub Pages

เชื่อม Repository `OatKungKTZ/cod-archive` แล้ว และเตรียม Workflow ไว้ การเปิด Pages ผ่าน API ถูกปฏิเสธด้วย HTTP 403 จึงต้องให้เจ้าของเปิด Settings → Pages → GitHub Actions ก่อนเผยแพร่จริง

1. สร้าง Repository ชื่อ `cod-archive` ใน GitHub หากต้องการไม่มีค่าใช้จ่ายให้ตรวจสิทธิ์ Pages ของบัญชี โดยทั่วไป Repository แบบ Public ใช้ Pages บน GitHub Free ได้
2. อัปโหลดโครงการโดยไม่รวม `node_modules`, Backup หรือข้อมูลส่วนตัว ตั้ง Branch หลักเป็น `main`
3. Settings → Pages → Build and deployment → Source เลือก GitHub Actions
4. Workflow `.github/workflows/deploy.yml` จะทดสอบ Build และ E2E ก่อน Deploy เมื่อ Push `main` ส่วน Pull Request ตรวจอย่างเดียว
5. เปิด `https://oatkungktz.github.io/cod-archive/`

Vite Base, Manifest id/start_url/scope และ Paths ของทรัพยากรกำหนด `/cod-archive/` แล้ว หากเปลี่ยนชื่อ Repository ต้องปรับทุกจุด รวม Fonts Paths, `index.html` และการทดสอบ

การอัปเดต: แก้ Catalog หรือโค้ด → ตรวจ Tests/Build → Push `main` → รอ Workflow ผ่าน → เปิดแอปและกดอัปเดตเมื่อแจ้ง หากหน้าฟอร์มยังบันทึกไม่สำเร็จแอปจะไม่สั่ง Reload เพื่ออัปเดต

## ติดตั้ง PWA บน iPhone

เปิดผ่าน Safari → แชร์ → เพิ่มไปยังหน้าจอโฮม → เปิด COD Archive จากไอคอน รอโหลดออนไลน์ครั้งแรกให้เสร็จ รูป ฟอนต์ และข้อมูลกลางใน Build จะถูก Cache ไม่ดึงภาพภายนอกขณะ Offline

Service Worker Scope จำกัด `/cod-archive/` Cache และฐานข้อมูลมีหน้าที่แยกกัน การเปลี่ยนเวอร์ชันแอปไม่ควรลบข้อมูลส่วนตัว หากเว็บแสดงรุ่นเก่าให้กดอัปเดตแอปก่อน อย่าล้างข้อมูลเว็บไซต์โดยไม่สำรอง

## ทดสอบ

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Unit Tests ตรวจสถานะ งบ ราคาไม่ทราบ Timeline, Import, ID ซ้ำ, URL, Schema และ IndexedDB ส่วน E2E ตรวจ Desktop/Mobile Emulation, Subpath Refresh, Persistence, Backup และ Offline บน Production Preview

ดู [รายการทดสอบอุปกรณ์จริง](docs/testing.md) การจำลอง iPhone บน Chromium ไม่ใช่การยืนยันผล Safari/PWA บน iPhone จริง

## เครื่องมือช่วยออกแบบ

ติดตั้ง 4 ชุดตามที่ผู้ใช้ขอใน `.agents/skills/` ไม่มี Runtime Dependencies เพิ่ม ดู [วิธีใช้และแหล่งต้นทาง](docs/design-tools.md) และ `docs/design-tools.lock.json` ไม่เปิด Hooks หรือบริการเสียเงินอัตโนมัติ

## ยังไม่อยู่ใน V1

Mission Checklist, Trophy Tracker, PSN API, ราคาสด/Web Scraping, Cloud Sync, Login, Notifications, Backend, NAS Hosting และการแก้ Conflict ข้ามหลายหน้าต่าง

Call of Duty, Activision และ PlayStation เป็นชื่อ/เครื่องหมายการค้าของเจ้าของ โครงการนี้ไม่มีความเกี่ยวข้องอย่างเป็นทางการ
