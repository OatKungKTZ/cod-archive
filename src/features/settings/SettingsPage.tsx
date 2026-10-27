import { Download, RefreshCw, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { version as appVersion } from "../../../package.json";
import { Badge, Field, PageHead } from "../../components/UI";
import { games } from "../../data/games";
import {
  exportBackup,
  initialState,
  parseBackup,
  type UserState,
} from "../../domain/model";
import type { Update } from "../../domain/update";
function SettingsPage({
  state,
  update,
  ready,
}: {
  state: UserState;
  update: Update;
  ready: boolean;
}) {
  const [message, setMessage] = useState("");
  const [lastExport, setLastExport] = useState(() =>
    (() => {
      try {
        return localStorage.getItem("cod-archive-last-export") || "";
      } catch {
        return "";
      }
    })(),
  );
  const [incoming, setIncoming] = useState<UserState | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const exportData = () => {
    const blob = new Blob([exportBackup(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cod-archive-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    const now = new Date().toISOString();
    setLastExport(now);
    try {
      localStorage.setItem("cod-archive-last-export", now);
    } catch {
      /* Backup file remains downloadable even without localStorage. */
    }
    setMessage("สร้างไฟล์สำรองแล้ว โปรดตรวจว่าเก็บใน Files สำเร็จ");
  };
  return (
    <>
      <PageHead
        eyebrow="YOUR ARCHIVE, YOUR RULES"
        title="ตั้งค่าและสำรองข้อมูล"
        description="ข้อมูลส่วนตัวเก็บในอุปกรณ์ ไม่มีบัญชีและไม่มีการซิงค์อัตโนมัติ"
      />
      <div className="settings-grid">
        <section className="panel form-panel">
          <h2>การแสดงผล</h2>
          <Field label="ธีม">
            <select
              value={state.theme}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  theme: e.target.value as UserState["theme"],
                }))
              }
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">ตามระบบ</option>
            </select>
          </Field>
          <h3>การป้องกัน Spoiler</h3>
          <p>
            ปิดเป็นค่าเริ่มต้นสำหรับทุกเกม เปิดแยกเกมได้ในหน้ารายละเอียด
            การซื้อหรือเล่นจบไม่เปิด Spoiler ให้เอง
          </p>
          <h3>ติดตั้งบน iPhone</h3>
          <p>
            เปิดเว็บด้วย Safari → แชร์ → เพิ่มไปยังหน้าจอโฮม จากนั้นเปิด COD
            Archive จากไอคอน
          </p>
          <Badge tone={ready ? "green" : "amber"}>
            {ready
              ? "เตรียม Offline Cache แล้ว"
              : "กำลังเตรียม Cache หรือยังไม่ได้ติดตั้ง Service Worker"}
          </Badge>
          <p className="caption">
            ต้องเปิดออนไลน์จนโหลดเสร็จก่อนใช้งาน Offline ครั้งแรก
          </p>
        </section>
        <section className="panel form-panel">
          <h2>สำรองและกู้คืน</h2>
          <div className="notice">
            iPhone, iPad, Safari และ PWA อาจใช้คนละพื้นที่จัดเก็บ
            ข้อมูลอาจหายเมื่อถูกล้าง ควร Export หลังซื้อเกมหรือเล่นจบ
          </div>
          <p className="caption">
            Export ล่าสุดที่กดบนบริบทนี้:{" "}
            {lastExport
              ? new Date(lastExport).toLocaleString("th-TH")
              : "ยังไม่มี"}
            <br />
            ไม่สามารถยืนยันว่าไฟล์ถูกเก็บสำเร็จแล้ว
          </p>
          <div className="detail-actions">
            <button onClick={exportData}>
              <Download size={17} />
              Export JSON
            </button>
            <button
              className="secondary"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={17} />
              Import JSON
            </button>
          </div>
          <input
            ref={fileRef}
            className="sr-only"
            aria-label="เลือกไฟล์ Backup JSON"
            type="file"
            accept=".json,application/json"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              setIncoming(null);
              try {
                if (file.size > 5 * 1024 * 1024)
                  throw new Error("ไฟล์ใหญ่เกิน 5 MB");
                const backup = parseBackup(await file.text());
                setIncoming(backup.data);
                setMessage("ตรวจสอบไฟล์สำเร็จ โปรดดูสรุปก่อนยืนยัน");
              } catch {
                setMessage(
                  "นำเข้าไม่ได้: ไฟล์ไม่ถูกต้อง ข้อมูลซ้ำ เวอร์ชันไม่รองรับ หรือขนาดเกิน 5 MB ข้อมูลเดิมยังอยู่",
                );
              }
            }}
          />
          {incoming && (
            <div className="import-preview">
              <h3>ตรวจสอบก่อนแทนที่ข้อมูล</h3>
              <p>
                ข้อมูลใหม่: {Object.keys(incoming.games).length} สถานะเกม ·{" "}
                {incoming.items.length} สำเนา · {incoming.wishlist.length}{" "}
                Wishlist
              </p>
              <p>
                ข้อมูลเดิม: {state.items.length} สำเนา · {state.wishlist.length}{" "}
                Wishlist
              </p>
              <p>
                เกมที่ไม่รู้จักจะถูกเก็บไว้ ไม่ถูกทิ้ง:{" "}
                {
                  [
                    ...new Set([
                      ...Object.keys(incoming.games),
                      ...incoming.items.map((i) => i.gameId),
                      ...incoming.wishlist.map((i) => i.gameId),
                      ...incoming.observations.map((i) => i.gameId),
                    ]),
                  ].filter((id) => !games.some((g) => g.id === id)).length
                }{" "}
                รายการ
              </p>
              <p className="error-text">
                การนำเข้าจะแทนที่ข้อมูลส่วนตัวทั้งหมดบนบริบทนี้ ควร Export
                ของเดิมก่อน
              </p>
              <div className="detail-actions">
                <button
                  className="danger"
                  onClick={() => {
                    if (
                      confirm(
                        "ยืนยันแทนที่ข้อมูลส่วนตัวทั้งหมดด้วยไฟล์ที่เลือก?",
                      )
                    ) {
                      update(() => incoming);
                      setIncoming(null);
                      setMessage(
                        "ส่งข้อมูลกู้คืนเพื่อบันทึกแล้ว ตรวจสถานะบันทึกด้านล่าง",
                      );
                    }
                  }}
                >
                  ยืนยันแทนที่ข้อมูล
                </button>
                <button className="secondary" onClick={() => setIncoming(null)}>
                  ยกเลิก
                </button>
              </div>
            </div>
          )}
          <p role="status" aria-live="polite">
            {message}
          </p>
        </section>
        <section className="panel form-panel">
          <h2>เกี่ยวกับ COD Archive</h2>
          <p>
            Call of Duty Archive & Collection
            <br />
            เวอร์ชัน {appVersion} · Schema 1 · Catalog 2026-10-v1
          </p>
          <p>
            เว็บส่วนตัวสำหรับ PS5 Pro พร้อม Disc Drive ไม่ใช่ผลิตภัณฑ์ทางการของ
            Activision หรือ PlayStation ชื่อเกมเป็นเครื่องหมายการค้าของเจ้าของ
          </p>
          <p>
            ภาพปกและคีย์อาร์ตมาจาก PlayStation, Steam และ Activision Media
            Center ลิขสิทธิ์เป็นของเจ้าของ มีแหล่งภาพกำกับในรายละเอียดแต่ละเกม
            ข้อมูลกลางที่ยังไม่ยืนยันจะติดป้าย Unverified / Unknown
          </p>
        </section>
        <section className="panel form-panel danger-zone">
          <h2>ล้างข้อมูลส่วนตัว</h2>
          <p>ไม่สามารถย้อนกลับได้หากไม่มี Backup ไม่กระทบ Catalog เกม</p>
          <div className="detail-actions">
            <button
              className="secondary danger"
              onClick={() => {
                if (
                  confirm(
                    "ล้างข้อมูลส่วนตัวทั้งหมดให้ว่าง? โปรด Export ก่อนดำเนินการ",
                  ) &&
                  prompt("พิมพ์ RESET เพื่อยืนยัน") === "RESET"
                ) {
                  update(() => ({ ...initialState(), games: {}, items: [] }));
                  setMessage("ส่งคำขอล้างข้อมูลแล้ว ตรวจสถานะบันทึก");
                }
              }}
            >
              <Trash2 size={16} />
              ล้างทั้งหมด
            </button>
            <button
              className="secondary"
              onClick={() => {
                if (
                  confirm(
                    "กลับสู่ Initial State: MW2019 มีแล้ว 1 เกม และล้างข้อมูลอื่น?",
                  ) &&
                  prompt("พิมพ์ RESET เพื่อยืนยัน") === "RESET"
                ) {
                  update(() => initialState());
                  setMessage("ส่งคำขอคืนข้อมูลเริ่มต้นแล้ว");
                }
              }}
            >
              <RefreshCw size={16} />
              กลับค่าเริ่มต้น
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default SettingsPage;
