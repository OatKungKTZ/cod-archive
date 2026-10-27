import { Plus, Trash2 } from "lucide-react";
import { Field } from "../../components/UI";
import { type UserState } from "../../domain/model";
import type { Update } from "../../domain/update";
function PurchaseEditor({
  gameId,
  state,
  update,
}: {
  gameId: string;
  state: UserState;
  update: Update;
}) {
  const items = state.items.filter((i) => i.gameId === gameId);
  const change = (id: string, key: string, value: unknown) =>
    update((s) => ({
      ...s,
      items: s.items.map((i) => (i.id === id ? { ...i, [key]: value } : i)),
    }));
  return (
    <section className="panel form-panel">
      <div className="section-heading">
        <h2>สำเนาที่สะสม</h2>
        <button
          className="icon-button"
          aria-label="เพิ่มสำเนา"
          onClick={() =>
            update((s) => ({
              ...s,
              items: [
                ...s.items,
                {
                  id: crypto.randomUUID(),
                  gameId,
                  format: "Unknown",
                  region: "",
                  ratingSystem: "",
                  edition: "",
                  condition: "",
                  purchased: "",
                  price: null,
                  store: "",
                },
              ],
            }))
          }
        >
          <Plus size={18} />
        </button>
      </div>
      {!items.length && (
        <p className="muted">
          ยังไม่มีรายละเอียดการซื้อ เพิ่มสำเนาได้โดยไม่สมมติราคา
        </p>
      )}
      {items.map((i, n) => (
        <div className="purchase-item" key={i.id}>
          <div className="section-heading">
            <strong>สำเนา {n + 1}</strong>
            <button
              className="icon-button danger"
              aria-label={`ลบสำเนา ${n + 1}`}
              onClick={() => {
                if (
                  confirm(
                    "ลบรายละเอียดสำเนานี้? สถานะครอบครองจะไม่เปลี่ยนอัตโนมัติ",
                  )
                )
                  update((s) => ({
                    ...s,
                    items: s.items.filter((x) => x.id !== i.id),
                  }));
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="form-grid">
            <Field label="รูปแบบ">
              <select
                value={i.format}
                onChange={(e) => change(i.id, "format", e.target.value)}
              >
                {["Unknown", "PS4 Disc", "PS5 Disc", "Digital"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </Field>
            <Field label="Region">
              <input
                value={i.region}
                onChange={(e) => change(i.id, "region", e.target.value)}
              />
            </Field>
            <Field label="Edition">
              <input
                value={i.edition}
                onChange={(e) => change(i.id, "edition", e.target.value)}
              />
            </Field>
            <Field label="ระบบเรต เช่น ESRB">
              <input
                value={i.ratingSystem}
                onChange={(e) => change(i.id, "ratingSystem", e.target.value)}
              />
            </Field>
            <Field label="วันที่ซื้อ">
              <input
                type="date"
                value={i.purchased}
                onChange={(e) => change(i.id, "purchased", e.target.value)}
              />
            </Field>
            <Field label="ราคาซื้อจริง (บาท)">
              <input
                type="number"
                min="0"
                max="1000000000"
                value={i.price ?? ""}
                onChange={(e) =>
                  change(
                    i.id,
                    "price",
                    e.target.value === ""
                      ? null
                      : Math.max(0, Number(e.target.value)),
                  )
                }
              />
            </Field>
            <Field label="ร้านที่ซื้อ">
              <input
                value={i.store}
                onChange={(e) => change(i.id, "store", e.target.value)}
              />
            </Field>
            <Field label="สภาพแผ่น">
              <input
                value={i.condition}
                onChange={(e) => change(i.id, "condition", e.target.value)}
              />
            </Field>
          </div>
        </div>
      ))}
    </section>
  );
}

export default PurchaseEditor;
