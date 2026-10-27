# การตรวจรับ COD Archive

## ระบบอัตโนมัติ

`npm test` ตรวจ Domain, Backup, Schema และ IndexedDB; `npm run build` ตรวจ TypeScript และ Production Bundle; `npm run test:e2e` ตรวจ UI บน Desktop Chrome และ Chromium จำลองขนาด iPhone

E2E ใช้ Preview ที่ `/cod-archive/` ทดสอบ Refresh ของ Hash Route, แก้สถานะและหมายเหตุ, โหลดกลับมา, ไม่เปิด Spoiler อัตโนมัติ, Export/Import ผิด/ถูก และ Service Worker เมื่อปิดเครือข่าย

## ต้องตรวจบนเครื่องจริงก่อนถือว่ารองรับ iPhone สมบูรณ์

- [ ] iPhone Safari: อ่านไทย เปลี่ยนสถานะ พิมพ์หมายเหตุ วันที่ และราคา โดยหน้าไม่ Zoom หรือเลื่อนแนวนอน
- [ ] Add to Home Screen: ชื่อ COD Archive ไอคอน Safe Area และ Bottom Navigation ไม่ชน Home Indicator
- [ ] เปิด PWA ครั้งแรกออนไลน์จน Cache พร้อม จากนั้นโหมดเครื่องบินแล้วเปิดและแก้ข้อมูลได้
- [ ] ปิด/เปิด PWA แล้วข้อมูลยังอยู่
- [ ] Export JSON ไป Files และ Import กลับได้ พร้อมยืนยันก่อนแทนที่
- [ ] เปรียบเทียบข้อมูล Safari/PWA หากแยกพื้นที่ให้ใช้ Export/Import ไม่คาดหวัง Sync
- [ ] ทดสอบเวอร์ชันใหม่: มีปุ่มอัปเดต ข้อมูลส่วนตัวยังอยู่หลัง Reload
- [ ] iPad แนวตั้ง/แนวนอน Split View และ Desktop ที่ Zoom 200%
- [ ] VoiceOver อ่านปุ่ม ช่องฟอร์ม สถานะ และลำดับ Focus ได้
- [ ] Reduced Motion ปิดการเคลื่อนไหว, Light/Dark/System อ่านชัด
- [ ] แผ่น US/Region/Edition และข้อมูล PS5 Pro ที่ยังไม่ยืนยันไม่ถูกแสดงเป็นข้อเท็จจริง

การจำลองบน Chromium/WebKit ไม่ใช่ผลทดสอบอุปกรณ์จริง ไม่มีการอ้างว่าผ่านรายการนี้จนกว่าจะตรวจจริง
