import { CheckCheck, Clock, Disc3, Library } from "lucide-react";
import { useState } from "react";
import Metric from "../../components/Metric";
import { PageHead, Progress } from "../../components/UI";
import { seriesLabel } from "../../data/games";
import { money, type UserState } from "../../domain/model";
import { stats } from "../../domain/stats";
function Stats({ state }: { state: UserState }) {
  const [series, setSeries] = useState("all");
  const s = stats(state, series);
  return (
    <>
      <PageHead
        eyebrow="COLLECTION INTELLIGENCE"
        title="ภาพรวมการสะสม"
        description="สถิติจากสถานะและราคาที่คุณบันทึก ไม่มีการสมมติค่าที่ขาดหาย"
      />
      <div className="toolbar">
        <select
          aria-label="เลือกสายเนื้อเรื่องสำหรับสถิติ"
          value={series}
          onChange={(e) => setSeries(e.target.value)}
        >
          <option value="all">ทุกสายเนื้อเรื่อง</option>
          {Object.entries(seriesLabel).map(([v, l]) => (
            <option value={v} key={v}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div className="metrics">
        <Metric
          icon={<Library />}
          label="จำนวนเกม"
          value={String(s.total)}
          detail="นับเกมไม่ซ้ำ"
        />
        <Metric
          icon={<Disc3 />}
          label="มีแล้ว"
          value={String(s.owned)}
          detail={`${Math.round((s.owned / s.total) * 100)}% ของรายการที่เลือก`}
        />
        <Metric
          icon={<CheckCheck />}
          label="เล่นจบ"
          value={String(s.completed)}
          detail={`${Math.round((s.completed / s.total) * 100)}% ของรายการที่เลือก`}
        />
        <Metric
          icon={<Clock />}
          label="Campaign โดยประมาณ"
          value={s.hoursKnown ? `${s.hours} ชม.` : "Unknown"}
          detail={`มีข้อมูล ${s.hoursKnown} จาก ${s.total} เกม`}
        />
      </div>
      <div className="dashboard-columns">
        <section className="panel form-panel">
          <h2>งบที่ใช้กับคอลเลกชัน</h2>
          <div className="stat-big">{money(s.spent)}</div>
          <p>รวมเฉพาะ {s.priced} สำเนาที่บันทึกราคาแล้ว</p>
          <div className="facts">
            <div>
              <span>ราคาซื้อเฉลี่ยต่อสำเนาที่มีราคา</span>
              <strong>
                {s.average === null ? "ยังไม่มีข้อมูล" : money(s.average)}
              </strong>
            </div>
            <div>
              <span>สำเนาที่ยังไม่ระบุราคา</span>
              <strong>{s.unpriced}</strong>
            </div>
          </div>
        </section>
        <section className="panel form-panel">
          <h2>ความคืบหน้าตามสายเนื้อเรื่อง</h2>
          {(["mw", "bo", "pending"] as const)
            .filter((x) => series === "all" || series === x)
            .map((x) => {
              const t = stats(state, x);
              return (
                <div className="series-stat" key={x}>
                  <div className="row">
                    <strong>{seriesLabel[x]}</strong>
                    <span>
                      {t.owned} / {t.total} เกม
                    </span>
                  </div>
                  <Progress value={(t.owned / t.total) * 100} />
                  <p className="caption">
                    เล่นจบ {t.completed} เกม · ใช้จ่ายที่ระบุแล้ว{" "}
                    {money(t.spent)}
                  </p>
                </div>
              );
            })}
        </section>
      </div>
    </>
  );
}

export default Stats;
