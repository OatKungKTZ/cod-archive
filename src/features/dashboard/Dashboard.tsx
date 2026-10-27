import {
  ArrowRight,
  ArrowUpRight,
  CheckCheck,
  Clock,
  Disc3,
  Gamepad2,
  Heart,
  Library,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import Metric from "../../components/Metric";
import { Badge, Cover, Empty, PageHead, Progress } from "../../components/UI";
import { games, seriesLabel } from "../../data/games";
import { type UserState } from "../../domain/model";
import { stats } from "../../domain/stats";
function Dashboard({ state }: { state: UserState }) {
  const s = stats(state);
  const playing = games.filter((g) => state.games[g.id]?.play === "playing");
  const next = games.find(
    (g) =>
      g.series !== "pending" &&
      state.games[g.id]?.play !== "completed" &&
      state.games[g.id]?.play !== "playing",
  );
  return (
    <>
      <PageHead
        eyebrow="YOUR PERSONAL OPERATIONS HUB"
        title="ทุกภาค ทุกเรื่องราว ในคลังเดียว"
        description="เส้นทางการเล่นและคอลเลกชัน Call of Duty ของคุณ"
        action={
          <Link className="button secondary desktop-action" to="/collection">
            <Library size={16} />
            จัดการคลังเกม
          </Link>
        }
      />
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-orbit one" />
        <div className="hero-orbit two" />
        <div className="hero-content">
          <h2>
            YOUR NEXT
            <br />
            <span>MISSION AWAITS.</span>
          </h2>
          <p>
            ย้อนรอยเรื่องราว วางแผนภาคถัดไป
            <br />
            และเติมเต็มคลังเกมในแบบของคุณ
          </p>
          <Link className="button" to="/timeline">
            สำรวจ Timeline <ArrowRight size={17} />
          </Link>
          <span className="hero-note">
            02 STORYLINES <span>/</span> 09 ARCHIVE ENTRIES
          </span>
        </div>
        <div className="hero-art" aria-hidden="true">
          <Cover game={games[0]} />
          <div className="art-label">
            <span className="live-dot" /> ARCHIVE NO. 001 <span>2019</span>
          </div>
        </div>
      </section>
      <div className="metrics">
        <Metric
          icon={<Library />}
          label="เกมใน Archive"
          value={String(s.total)}
          detail="2 สายเนื้อเรื่อง + 1 รอยืนยัน"
        />
        <Metric
          icon={<Disc3 />}
          label="มีในคอลเลกชัน"
          value={`${s.owned}`}
          detail={`จากทั้งหมด ${s.total} เกม`}
          accent
        />
        <Metric
          icon={<CheckCheck />}
          label="เล่นจบแล้ว"
          value={String(s.completed)}
          detail="อิงสถานะที่คุณยืนยัน"
        />
        <Metric
          icon={<Heart />}
          label="อยู่ใน Wishlist"
          value={String(s.wishes)}
          detail="เป้าหมายการสะสมครั้งถัดไป"
        />
      </div>
      <p className="campaign-summary">
        <Clock size={15} /> เวลา Campaign รวม:{" "}
        {s.hoursKnown ? `${s.hours} ชั่วโมง โดยประมาณ` : "Unknown"}{" "}
        <span>
          · มีข้อมูล {s.hoursKnown} จาก {s.total} เกม
        </span>
      </p>
      <div className="dashboard-columns">
        <section className="panel collection-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR COLLECTION</span>
              <h2>คอลเลกชันของคุณ</h2>
            </div>
            <Link className="text-link" to="/collection">
              ดูทั้งหมด <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="collection-progress">
            <div>
              <strong>
                {Math.round((s.owned / s.total) * 100)}
                <span>%</span>
              </strong>
              <p>
                เก็บสะสมแล้ว {s.owned} จาก {s.total} เกม
              </p>
            </div>
            <div
              className="progress-ring"
              style={
                {
                  "--progress": `${(s.owned / s.total) * 100}%`,
                } as React.CSSProperties
              }
            >
              <Library size={25} />
            </div>
          </div>
          <Progress value={Math.round((s.owned / s.total) * 100)} />
          <div className="collection-legend">
            <span>
              <i />
              มีแล้ว {s.owned}
            </span>
            <span>
              <i />
              ยังไม่ยืนยัน{" "}
              {
                games.filter(
                  (g) =>
                    !state.games[g.id] ||
                    state.games[g.id].ownership === "unknown",
                ).length
              }
            </span>
          </div>
          <div className="series-mini">
            <div>
              <span>Modern Warfare Reboot</span>
              <b>
                {stats(state, "mw").owned} <span>/ 3</span>
              </b>
            </div>
            <Progress value={(stats(state, "mw").owned / 3) * 100} />
            <div>
              <span>Black Ops</span>
              <b>
                {stats(state, "bo").owned} <span>/ 5</span>
              </b>
            </div>
            <Progress value={(stats(state, "bo").owned / 5) * 100} />
          </div>
        </section>
        <section className="panel next-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {playing.length ? "IN PROGRESS" : "UP NEXT"}
              </span>
              <h2>{playing.length ? "กำลังเล่น" : "ภารกิจถัดไปของคุณ"}</h2>
            </div>
            <Gamepad2 size={20} />
          </div>
          {(playing.length ? playing : next ? [next] : []).map((g) => (
            <Link className="next-game" key={g.id} to={`/games/${g.id}`}>
              <Cover game={g} />
              <div>
                <Badge tone="green">
                  {playing.length ? "กำลังเล่น" : "ลำดับแนะนำ"}
                </Badge>
                <h3>{g.title.replace("Call of Duty: ", "")}</h3>
                <p>
                  {g.year} <span>•</span> {seriesLabel[g.series]}
                </p>
                <span className="text-link">
                  ดูรายละเอียด <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
          {!playing.length && !next && (
            <Empty>เล่นครบทุกภาคที่จัดลำดับแล้ว</Empty>
          )}
          <div className="subtle-note">
            <ShieldCheck size={15} />
            <span>
              ซ่อน Spoiler เป็นค่าเริ่มต้น · การมีเกมไม่ได้หมายถึงเล่นจบ
            </span>
          </div>
        </section>
      </div>
      <section className="archive-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EXPLORE THE STORIES</span>
            <h2>เลือกเส้นทางของคุณ</h2>
          </div>
          <Link className="text-link" to="/timeline">
            ดู Timeline ทั้งหมด <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="story-grid">
          <Link className="story-card mw" to="/timeline?series=mw">
            <div className="story-number">01 / STORYLINE</div>
            <div>
              <span className="eyebrow">MODERN WARFARE REBOOT</span>
              <h3>
                สงครามยุคใหม่
                <br />
                เรื่องราวบทใหม่
              </h3>
              <p>3 เกม · เริ่มต้นที่ Modern Warfare (2019)</p>
            </div>
            <span className="story-arrow">
              <ArrowUpRight />
            </span>
          </Link>
          <Link className="story-card bo" to="/timeline?series=bo">
            <div className="story-number">02 / STORYLINE</div>
            <div>
              <span className="eyebrow">BLACK OPS</span>
              <h3>
                เบื้องหลังปฏิบัติการ
                <br />
                เหนือความคาดหมาย
              </h3>
              <p>5 เกม · เส้นทางแห่งปฏิบัติการลับ</p>
            </div>
            <span className="story-arrow">
              <ArrowUpRight />
            </span>
          </Link>
        </div>
        <p className="caption">
          แยกสายเนื้อเรื่องเพื่อการจัดลำดับ
          ไม่แสดงว่าทั้งสองเส้นทางต่อเนื่องกันโดยตรง · MW4
          ยืนยันการวางจำหน่ายแล้ว · รอจัดลำดับเนื้อเรื่อง
        </p>
      </section>
    </>
  );
}

export default Dashboard;
