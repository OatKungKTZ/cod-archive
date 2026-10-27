import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge, Cover, Field, PageHead } from "../../components/UI";
import { seriesLabel, timelineEntries } from "../../data/games";
import {
  ownershipLabels,
  playLabels,
  type UserState,
} from "../../domain/model";
function Timeline({ state }: { state: UserState }) {
  const location = useLocation();
  const [series, setSeries] = useState(
    new URLSearchParams(location.search).get("series") || "all",
  );
  const [mode, setMode] = useState("recommended");
  const entries = timelineEntries(mode, series);
  return (
    <>
      <PageHead
        eyebrow="THE STORY SO FAR"
        title="เส้นทางเรื่องราว"
        description="เลือกลำดับการเล่นที่เหมาะกับคุณ โดยซ่อน Spoiler เป็นค่าเริ่มต้น"
      />
      <div className="toolbar">
        <div className="segmented">
          {[
            ["recommended", "ลำดับแนะนำ"],
            ["chronological", "ตามเหตุการณ์"],
            ["release", "ตามวันวางจำหน่าย"],
          ].map(([v, l]) => (
            <button
              key={v}
              className={mode === v ? "selected" : ""}
              onClick={() => setMode(v)}
            >
              {l}
            </button>
          ))}
        </div>
        <Field label="สายเนื้อเรื่อง">
          <select value={series} onChange={(e) => setSeries(e.target.value)}>
            <option value="all">ทุกสายเนื้อเรื่อง</option>
            {Object.entries(seriesLabel).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="notice">
        <ShieldCheck size={18} />
        {mode === "recommended"
          ? "ลำดับแนะนำเพื่อเข้าใจเนื้อเรื่อง ไม่ใช่ลำดับเหตุการณ์ทั้งหมด"
          : mode === "chronological"
            ? "แสดงหลายช่วงเวลาต่อเกมได้ แต่ไม่นับเกมซ้ำในสถิติ ช่วงเวลายังเป็น Unverified"
            : "ปีที่แสดงยังต้องตรวจแหล่งอ้างอิงรายเกม"}{" "}
        · ไม่เชื่อมสองสายเนื้อเรื่องเป็นเรื่องต่อกัน
      </div>
      {(["mw", "bo", "pending"] as const).map((lane) => {
        const rows = entries.filter((e) => e.game.series === lane);
        return (
          rows.length > 0 && (
            <section className="timeline-lane" key={lane}>
              <h2>{seriesLabel[lane]}</h2>
              <div className="timeline">
                {rows.map((e, i) => (
                  <Link
                    className="timeline-item"
                    key={e.key}
                    to={`/games/${e.game.id}`}
                  >
                    <span className="timeline-dot">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Cover game={e.game} />
                    <div className="timeline-body">
                      <div className="eyebrow">
                        {mode === "release"
                          ? (e.game.year ?? "UNKNOWN")
                          : mode === "chronological"
                            ? e.period
                            : `PLAY ORDER / ${String(e.game.order).padStart(2, "0")}`}
                      </div>
                      <h3>{e.game.title}</h3>
                      <p>
                        {mode === "chronological"
                          ? "ช่วงเวลาเรื่องราว · Unverified"
                          : e.period}
                      </p>
                      <div className="badges">
                        <Badge>
                          {
                            ownershipLabels[
                              state.games[e.game.id]?.ownership ?? "unknown"
                            ]
                          }
                        </Badge>
                        <Badge>
                          {
                            playLabels[
                              state.games[e.game.id]?.play ?? "unknown"
                            ]
                          }
                        </Badge>
                      </div>
                    </div>
                    <ArrowUpRight size={20} />
                  </Link>
                ))}
              </div>
            </section>
          )
        );
      })}
    </>
  );
}

export default Timeline;
