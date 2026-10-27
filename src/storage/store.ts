import { openDB } from "idb";
import { initialState, stateSchema, type UserState } from "../domain/model";
let connection: ReturnType<typeof openDB> | undefined;
const db = () =>
  (connection ??= openDB("cod-archive-personal", 1, {
    upgrade(db) {
      db.createObjectStore("state");
    },
  }).catch((error) => {
    connection = undefined;
    throw error;
  }));
export async function loadState(): Promise<UserState> {
  const d = await db();
  const raw = await d.get("state", "personal");
  if (raw === undefined) {
    const s = initialState();
    await d.put("state", { schemaVersion: 1, data: s }, "personal");
    return s;
  }
  if (raw.schemaVersion !== 1)
    throw new Error("เวอร์ชันข้อมูลยังไม่รองรับ ข้อมูลเดิมถูกเก็บไว้");
  return stateSchema.parse(raw.data);
}
export async function saveState(state: UserState) {
  const validated = stateSchema.parse(state);
  const d = await db();
  await d.put("state", { schemaVersion: 1, data: validated }, "personal");
}
