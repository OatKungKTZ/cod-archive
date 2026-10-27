import { Search } from "lucide-react";
import { useState } from "react";
import { Badge, Empty, GameCard, PageHead } from "../../components/UI";
import { games, seriesLabel } from "../../data/games";
import {
  ownershipLabels,
  playLabels,
  type UserState,
} from "../../domain/model";
function Collection({ state }: { state: UserState }) {
  const [q, setQ] = useState("");
  const [owned, setOwned] = useState("all");
  const [play, setPlay] = useState("all");
  const [series, setSeries] = useState("all");
  const filtered = games.filter(
    (g) =>
      g.title.toLowerCase().includes(q.toLowerCase()) &&
      (owned === "all" ||
        (state.games[g.id]?.ownership ?? "unknown") === owned) &&
      (play === "all" || (state.games[g.id]?.play ?? "unknown") === play) &&
      (series === "all" || g.series === series),
  );
  return (
    <>
      <PageHead
        eyebrow="YOUR PERSONAL COLLECTION"
        title="คลังเกมของคุณ"
        description="เก็บรายละเอียดทุกสำเนา และบันทึกการเดินทางในแต่ละภาค"
      />
      <div className="toolbar filters">
        <label className="search">
          <Search size={18} />
          <input
            aria-label="ค้นหาเกม"
            placeholder="ค้นหาเกมใน Archive…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <select
          aria-label="กรองการครอบครอง"
          value={owned}
          onChange={(e) => setOwned(e.target.value)}
        >
          <option value="all">การครอบครองทั้งหมด</option>
          {Object.entries(ownershipLabels).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <select
          aria-label="กรองการเล่น"
          value={play}
          onChange={(e) => setPlay(e.target.value)}
        >
          <option value="all">สถานะเล่นทั้งหมด</option>
          {Object.entries(playLabels).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <select
          aria-label="กรองสายเนื้อเรื่อง"
          value={series}
          onChange={(e) => setSeries(e.target.value)}
        >
          <option value="all">ทุกสายเนื้อเรื่อง</option>
          {Object.entries(seriesLabel).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div className="section-heading">
        <span className="muted">แสดง {filtered.length} เกม</span>
        <Badge>PS5 PRO + DISC DRIVE</Badge>
      </div>
      <div className="game-grid">
        {filtered.map((g) => (
          <GameCard key={g.id} game={g} state={state} />
        ))}
      </div>
      {!filtered.length && (
        <Empty>ไม่พบเกมที่ตรงกับตัวกรอง ลองเปลี่ยนเงื่อนไขการค้นหา</Empty>
      )}
    </>
  );
}

export default Collection;
