import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Disc3,
  ExternalLink,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Metric from "../../components/Metric";
import { Cover, Empty, Field, PageHead } from "../../components/UI";
import { games } from "../../data/games";
import { money, ownershipLabels, type UserState } from "../../domain/model";
import { stats } from "../../domain/stats";
import type { Update } from "../../domain/update";
function Wishlist({ state, update }: { state: UserState; update: Update }) {
  const [adding, setAdding] = useState(false);
  const [gameId, setGameId] = useState(games[0].id);
  const [price, setPrice] = useState("");
  const [store, setStore] = useState("");
  const [url, setUrl] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [formError, setFormError] = useState("");
  const s = stats(state);
  const patch = (id: string, key: string, value: unknown) =>
    update((s) => ({
      ...s,
      wishlist: s.wishlist.map((w) =>
        w.gameId === id ? { ...w, [key]: value } : w,
      ),
    }));
  return (
    <>
      <PageHead
        eyebrow="PLAN YOUR NEXT ACQUISITION"
        title="Wishlist & งบประมาณ"
        description="วางแผนการสะสม บันทึกราคาที่พบ และคุมงบในแบบของคุณ"
        action={
          <button onClick={() => setAdding(!adding)}>
            <Plus size={17} />
            เพิ่มเกม
          </button>
        }
      />
      {adding && (
        <div className="panel form-panel">
          <Field label="เลือกเกม">
            <select value={gameId} onChange={(e) => setGameId(e.target.value)}>
              {games.map((g) => (
                <option value={g.id} key={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </Field>
          <button
            disabled={state.wishlist.some((w) => w.gameId === gameId)}
            onClick={() => {
              update((s) => ({
                ...s,
                wishlist: [
                  ...s.wishlist,
                  { gameId, format: "Unknown", target: null, notes: "" },
                ],
              }));
              setAdding(false);
            }}
          >
            เพิ่มใน Wishlist
          </button>
          <p className="caption">
            เพิ่มรายการที่มีอยู่แล้วได้ เช่น อยากได้ Edition เพิ่มเติม
            การครอบครองจะไม่เปลี่ยน
          </p>
        </div>
      )}
      <div className="metrics budget-metrics">
        <Metric
          icon={<Disc3 />}
          label="ซื้อจริงที่ระบุราคาแล้ว"
          value={money(s.spent)}
          detail={`${s.priced} สำเนาระบุราคา · ${s.unpriced} สำเนาไม่ระบุ`}
        />
        <div className="metric">
          <Field label="งบสะสมรวม (บาท)">
            <input
              type="number"
              min="0"
              max="1000000000"
              placeholder="ยังไม่ตั้งงบ"
              value={state.budget ?? ""}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  budget:
                    e.target.value === ""
                      ? null
                      : Math.max(0, Number(e.target.value)),
                }))
              }
            />
          </Field>
          <small>รวมยอดซื้อที่บันทึกทั้งหมด</small>
        </div>
        <Metric
          icon={<ChartNoAxesCombined />}
          label="งบคงเหลือ"
          value={
            state.budget === null
              ? "ยังไม่ตั้งงบ"
              : money(state.budget - s.spent)
          }
          detail={
            s.unpriced
              ? "ยังไม่รวมสำเนาที่ไม่ได้ระบุราคา"
              : "คำนวณจากราคาซื้อจริง"
          }
        />
      </div>
      <h2 className="section-title">
        รายการที่อยากสะสม{" "}
        <span className="muted">({state.wishlist.length})</span>
      </h2>
      {!state.wishlist.length && (
        <Empty>
          ยังไม่มี Wishlist กด “เพิ่มเกม” เพื่อวางแผนการซื้อครั้งถัดไป
        </Empty>
      )}
      <div className="wish-list">
        {state.wishlist.map((w) => {
          const g = games.find((g) => g.id === w.gameId);
          return (
            <section className="panel wish-item" key={w.gameId}>
              {g ? (
                <Link to={`/games/${g.id}`}>
                  <Cover game={g} />
                </Link>
              ) : (
                <div>เกมที่ยังไม่รู้จัก: {w.gameId}</div>
              )}
              <div className="wish-content">
                <div className="section-heading">
                  <h3>{g?.title ?? w.gameId}</h3>
                  <button
                    className="icon-button danger"
                    aria-label={`นำ ${g?.short ?? w.gameId} ออกจาก Wishlist`}
                    onClick={() =>
                      update((s) => ({
                        ...s,
                        wishlist: s.wishlist.filter(
                          (x) => x.gameId !== w.gameId,
                        ),
                      }))
                    }
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="form-grid">
                  <Field label="รูปแบบที่ต้องการ">
                    <select
                      value={w.format}
                      onChange={(e) =>
                        patch(w.gameId, "format", e.target.value)
                      }
                    >
                      {["Unknown", "PS4 Disc", "PS5 Disc", "Digital"].map(
                        (f) => (
                          <option key={f}>{f}</option>
                        ),
                      )}
                    </select>
                  </Field>
                  <Field label="ราคาเป้าหมาย (บาท)">
                    <input
                      type="number"
                      min="0"
                      max="1000000000"
                      value={w.target ?? ""}
                      onChange={(e) =>
                        patch(
                          w.gameId,
                          "target",
                          e.target.value === ""
                            ? null
                            : Math.max(0, Number(e.target.value)),
                        )
                      }
                    />
                  </Field>
                </div>
                <Field label="หมายเหตุ">
                  <input
                    value={w.notes}
                    onChange={(e) => patch(w.gameId, "notes", e.target.value)}
                  />
                </Field>
                <p className="caption">
                  {state.games[w.gameId]?.ownership === "owned"
                    ? "มีเกมนี้แล้ว — อาจเป็นเป้าหมายซื้ออีก Edition"
                    : "การครอบครอง: " +
                      ownershipLabels[
                        state.games[w.gameId]?.ownership ?? "unknown"
                      ]}
                </p>
                {g && (
                  <Link className="text-link" to={`/games/${g.id}`}>
                    บันทึกการซื้อจริงในรายละเอียดเกม <ArrowUpRight size={15} />
                  </Link>
                )}
              </div>
            </section>
          );
        })}
      </div>
      <section className="panel form-panel">
        <h2>บันทึกราคาที่พบ</h2>
        <p className="muted">
          ข้อมูลที่คุณบันทึกเอง ไม่ใช่ราคาสดหรือราคาอ้างอิงที่แอปตรวจสอบ
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!price || !date) {
              setFormError("ระบุราคาและวันที่พบราคา");
              return;
            }
            if (url && !/^https?:\/\//i.test(url)) {
              setFormError("ลิงก์ร้านค้าต้องขึ้นต้นด้วย http:// หรือ https://");
              return;
            }
            setFormError("");
            update((s) => ({
              ...s,
              observations: [
                ...s.observations,
                {
                  id: crypto.randomUUID(),
                  gameId,
                  price: Number(price),
                  store,
                  url,
                  date,
                },
              ],
            }));
            setPrice("");
            setStore("");
            setUrl("");
          }}
        >
          <div className="form-grid">
            <Field label="เกม">
              <select
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
              >
                {games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ราคาที่พบ (บาท)">
              <input
                required
                type="number"
                min="0"
                max="1000000000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Field>
            <Field label="ร้านค้า">
              <input value={store} onChange={(e) => setStore(e.target.value)} />
            </Field>
            <Field label="ลิงก์ร้านค้า">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </Field>
            <Field label="วันที่บันทึกราคา">
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>
          </div>
          {formError && (
            <p role="alert" className="error-text">
              {formError}
            </p>
          )}
          <button type="submit">
            <Plus size={16} />
            บันทึกราคา
          </button>
        </form>
        <div className="price-history">
          {[...state.observations].reverse().map((o) => (
            <div className="price-row" key={o.id}>
              <div>
                <strong>
                  {games.find((g) => g.id === o.gameId)?.short ?? o.gameId}
                </strong>
                <p>
                  {o.store || "ไม่ระบุร้าน"} · {o.date}
                </p>
              </div>
              <strong>{money(o.price)}</strong>
              {o.url && (
                <a
                  className="icon-button"
                  href={o.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="เปิดร้านค้า"
                >
                  <ExternalLink size={17} />
                </a>
              )}
              <button
                className="icon-button danger"
                aria-label="ลบราคาที่บันทึก"
                onClick={() =>
                  update((s) => ({
                    ...s,
                    observations: s.observations.filter((x) => x.id !== o.id),
                  }))
                }
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="panel form-panel">
        <h2>เกมที่ยังไม่ยืนยันว่ามีแล้ว</h2>
        <p>
          {games
            .filter((g) => state.games[g.id]?.ownership !== "owned")
            .map((g) => g.short)
            .join(" · ") || "ยืนยันว่ามีครบทุกเกมแล้ว"}
        </p>
        <p className="caption">
          ยังไม่ยืนยันไม่เท่ากับยังไม่มี รายการนี้ช่วยทบทวนก่อนซื้อซ้ำ
        </p>
      </section>
    </>
  );
}

export default Wishlist;
