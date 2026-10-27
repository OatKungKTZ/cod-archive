import { ExternalLink, Heart, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Accordion from "../../components/Accordion";
import { Badge, Cover, Empty, Field } from "../../components/UI";
import { games, seriesLabel } from "../../data/games";
import {
  blankGame,
  ownershipLabels,
  playLabels,
  type UserGame,
  type UserState,
} from "../../domain/model";
import type { Update } from "../../domain/update";
import PurchaseEditor from "../collection/PurchaseEditor";
function Details({ state, update }: { state: UserState; update: Update }) {
  const { id } = useParams();
  const g = games.find((g) => g.id === id);
  if (!g)
    return (
      <Empty>
        ไม่พบเกมนี้ <Link to="/collection">กลับคลังเกม</Link>
      </Empty>
    );
  const user = state.games[g.id] ?? blankGame();
  const patch = (p: Partial<UserGame>) =>
    update((s) => ({
      ...s,
      games: {
        ...s.games,
        [g.id]: { ...(s.games[g.id] ?? blankGame()), ...p },
      },
    }));
  const wish = state.wishlist.some((w) => w.gameId === g.id);
  const toggleWish = () =>
    update((s) => ({
      ...s,
      wishlist: wish
        ? s.wishlist.filter((w) => w.gameId !== g.id)
        : [
            ...s.wishlist,
            { gameId: g.id, format: "Unknown", target: null, notes: "" },
          ],
    }));
  return (
    <>
      <Link className="text-link back-link" to="/collection">
        ← กลับคลังเกม
      </Link>
      <div className="detail-header">
        <Cover game={g} large />
        <div>
          <div className="eyebrow">
            {seriesLabel[g.series]} / {g.year ?? "UNKNOWN"}
          </div>
          <h1>{g.title}</h1>
          <p>{g.summary}</p>
          <div className="badges">
            <Badge tone={g.verifiedTitle ? "green" : "amber"}>
              {g.verifiedTitle
                ? "ชื่อเกมยืนยันแล้ว · ตรวจสถานะแต่ละข้อมูล"
                : "Unverified · รอตรวจสอบข้อมูลเกม"}
            </Badge>
            <Badge>{ownershipLabels[user.ownership]}</Badge>
          </div>
          <div className="detail-actions">
            <button className={wish ? "secondary" : ""} onClick={toggleWish}>
              <Heart size={17} fill={wish ? "currentColor" : "none"} />
              {wish ? "นำออกจาก Wishlist" : "เพิ่มใน Wishlist"}
            </button>
            <a
              className="button secondary"
              href={g.source}
              target="_blank"
              rel="noreferrer"
            >
              แหล่งข้อมูลทางการ <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
      <div className="notice">
        <ShieldCheck size={18} />
        การอยู่ใน Archive ไม่ได้ยืนยันว่าเล่นบน PS5 Pro ได้ ข้อมูลราคา FPS
        และแผ่นที่ยังไม่ยืนยันจะแสดง Unknown
      </div>
      <div className="detail-columns">
        <div>
          <Accordion title="เรื่องราวและลำดับการเล่น" open>
            <p>
              {g.periods.map((p) => p.label).join(" / ") || "ช่วงเวลา Unknown"}
            </p>
            <p>
              ลำดับแนะนำ: {g.series === "pending" ? "ยังไม่จัดลำดับ" : g.order}{" "}
              · {g.series === "pending" ? "รอยืนยัน" : seriesLabel[g.series]}
            </p>
            <p>ตัวละคร: {g.characters.join(", ") || "ยังไม่ยืนยันรายชื่อ"}</p>
            <p className="caption">
              เรื่องย่อ ตัวละคร และช่วงเวลาข้างต้นเป็น Unverified
              ยังไม่ถือว่าได้รับการยืนยันจากหน้าทางการ
            </p>
            {g.series === "mw" && (
              <p>
                ลำดับในสาย Reboot: Modern Warfare (2019) → Modern Warfare II →
                Modern Warfare III
              </p>
            )}
            {g.series === "bo" && (
              <p>
                ลำดับแนะนำ: Black Ops → Cold War → Black Ops II → Black Ops 6 →
                Black Ops 7 ไม่ใช่ลำดับเหตุการณ์ทั้งหมด
              </p>
            )}
            <label className="check-field">
              <input
                type="checkbox"
                checked={user.spoiler}
                onChange={(e) => patch({ spoiler: e.target.checked })}
              />
              อนุญาตให้แสดงข้อมูล Spoiler สำหรับเกมนี้
            </label>
            {user.spoiler ? (
              <div className="notice">
                ยังไม่มีเนื้อหา Spoiler ที่ผ่านการตรวจสอบ
                ชื่อภารกิจและเนื้อเรื่องเชิงลึกจะไม่ถูกแต่งขึ้น
              </div>
            ) : (
              <div className="subtle-note">
                <ShieldCheck size={16} />
                ข้อมูลเชิงลึกและชื่อภารกิจถูกซ่อน
              </div>
            )}
          </Accordion>
          <Accordion title="การเล่นบน PS5 Pro และการติดตั้ง" open>
            <div className="facts">
              {g.facts.map((f) => (
                <div key={f.label}>
                  <span>{f.label}</span>
                  <p>{f.value}</p>
                  <Badge tone={f.status === "verified" ? "green" : "amber"}>
                    {f.status === "verified"
                      ? "Verified"
                      : f.status === "unknown"
                        ? "Unknown"
                        : "Unverified"}
                  </Badge>
                  {f.source && (
                    <a
                      className="text-link source-link"
                      href={f.source}
                      target="_blank"
                      rel="noreferrer"
                    >
                      แหล่งอ้างอิง · ตรวจ 27 ต.ค. 2026{" "}
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Accordion>
          <Accordion title="ข้อมูลการซื้อและแหล่งอ้างอิง">
            <div className="facts">
              {[
                "แผ่นที่แนะนำ / Standard / Cross-Gen",
                "การอัปเกรด PS4 → PS5",
                "แผ่นมือสอง / Region และ DLC",
                "ราคาอ้างอิง / วันที่ตรวจราคา",
                "โหมด Campaign / Multiplayer / Zombies / Co-op",
              ].map((l) => (
                <div key={l}>
                  <span>{l}</span>
                  <p>Unknown — ต้องตรวจ Edition และแหล่งข้อมูลก่อนแนะนำ</p>
                </div>
              ))}
            </div>
            <a
              className="text-link"
              href={g.source}
              target="_blank"
              rel="noreferrer"
            >
              หน้าทางการที่เสนอให้ตรวจสอบ <ExternalLink size={14} />
            </a>
            <p className="caption">
              ข้อมูล Verified มีแหล่งอ้างอิงกำกับรายข้อ ตรวจเมื่อ 27 ตุลาคม 2026
              ข้อมูล Unverified ยังไม่ถือว่ายืนยันแล้ว
            </p>
            <a
              className="text-link"
              href="https://www.playstation.com/en-us/support/games/ps5-backward-compatibility-games/"
              target="_blank"
              rel="noreferrer"
            >
              PlayStation: ความเข้ากันได้กับเกมรุ่นก่อน
            </a>
          </Accordion>
        </div>
        <div>
          <section className="panel form-panel">
            <div className="section-heading">
              <h2>บันทึกของคุณ</h2>
              <Badge tone="green">LOCAL ONLY</Badge>
            </div>
            <div className="form-grid">
              <Field label="การครอบครอง">
                <select
                  value={user.ownership}
                  onChange={(e) =>
                    patch({
                      ownership: e.target.value as UserGame["ownership"],
                    })
                  }
                >
                  {Object.entries(ownershipLabels).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="สถานะการเล่น">
                <select
                  value={user.play}
                  onChange={(e) =>
                    patch({ play: e.target.value as UserGame["play"] })
                  }
                >
                  {Object.entries(playLabels).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="วันที่เริ่มเล่น">
                <input
                  type="date"
                  value={user.started}
                  onChange={(e) => patch({ started: e.target.value })}
                />
              </Field>
              <Field label="วันที่เล่นจบ">
                <input
                  type="date"
                  value={user.finished}
                  onChange={(e) => patch({ finished: e.target.value })}
                />
              </Field>
              <Field label="คะแนนส่วนตัว">
                <select
                  value={user.rating ?? ""}
                  onChange={(e) =>
                    patch({
                      rating: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                >
                  <option value="">ยังไม่ให้คะแนน</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} / 10
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="บันทึกส่วนตัว">
              <textarea
                value={user.notes}
                rows={5}
                placeholder="ความประทับใจ หรือสิ่งที่อยากกลับมาเล่นต่อ…"
                onChange={(e) => patch({ notes: e.target.value })}
              />
            </Field>
            <p className="caption">
              บันทึกอัตโนมัติ · วันที่เล่นจบไม่เปลี่ยนสถานะให้เอง
            </p>
          </section>
          <PurchaseEditor gameId={g.id} state={state} update={update} />
        </div>
      </div>
    </>
  );
}

export default Details;
