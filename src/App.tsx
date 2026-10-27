import {
  ChartNoAxesCombined,
  ChevronRight,
  Gamepad2,
  GitBranch,
  Heart,
  LayoutDashboard,
  Library,
  Menu,
  Settings,
  WifiOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  HashRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Empty } from "./components/UI";
import { type UserState } from "./domain/model";
import { stats } from "./domain/stats";
import type { Update } from "./domain/update";
import Collection from "./features/collection/Collection";
import Dashboard from "./features/dashboard/Dashboard";
import Details from "./features/games/Details";
import SettingsPage from "./features/settings/SettingsPage";
import Stats from "./features/stats/Stats";
import Timeline from "./features/timeline/Timeline";
import Wishlist from "./features/wishlist/Wishlist";
import { loadState, saveState } from "./storage/store";
const nav = [
  { to: "/", label: "ภาพรวม", icon: LayoutDashboard },
  { to: "/timeline", label: "Timeline", icon: GitBranch },
  { to: "/collection", label: "คลังเกม", icon: Library },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/stats", label: "สถิติ", icon: ChartNoAxesCombined },
  { to: "/settings", label: "ตั้งค่า", icon: Settings },
];
function App() {
  return (
    <HashRouter>
      <Root />
    </HashRouter>
  );
}
function Root() {
  const [state, setState] = useState<UserState | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [offline, setOffline] = useState(!navigator.onLine);
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();
  const current = useRef<UserState | null>(null);
  const queue = useRef(Promise.resolve());
  const failed = useRef(false);
  const [retry, setRetry] = useState(0);
  const {
    offlineReady: [ready],
    needRefresh: [refresh],
    updateServiceWorker,
  } = useRegisterSW();
  useEffect(() => {
    loadState()
      .then((s) => {
        current.current = s;
        setState(s);
        setError("");
      })
      .catch(() =>
        setError(
          "เปิดฐานข้อมูลไม่ได้หรือเวอร์ชันข้อมูลไม่รองรับ ข้อมูลเดิมยังไม่ถูกลบ โปรดเปิดในบริบทเดิมและลองใหม่",
        ),
      );
  }, [retry]);
  useEffect(() => {
    const on = () => setOffline(!navigator.onLine);
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", on);
    };
  }, []);
  useEffect(() => {
    setMobileMenu(false);
    window.scrollTo(0, 0);
    document.querySelector<HTMLElement>("main")?.focus();
  }, [location.pathname]);
  useEffect(() => {
    if (!state) return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const apply = () => {
      document.documentElement.dataset.theme =
        state.theme === "system"
          ? media.matches
            ? "light"
            : "dark"
          : state.theme;
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [state?.theme]);
  const update: Update = (fn) => {
    if (!current.current) return;
    const next = fn(current.current);
    current.current = next;
    setState(next);
    setSaved("กำลังบันทึก…");
    queue.current = queue.current.then(async () => {
      try {
        await saveState(next);
        failed.current = false;
        setSaved(current.current === next ? "บันทึกแล้ว" : "กำลังบันทึก…");
      } catch {
        failed.current = true;
        setSaved("บันทึกไม่สำเร็จ — โปรด Export ข้อมูลก่อนปิด");
      }
    });
  };
  if (!state)
    return (
      <div className="boot">
        <div className="brand-mark">CA</div>
        <h1>COD Archive</h1>
        <p>{error || "กำลังเปิดคลังเกมของคุณ…"}</p>
        {error && (
          <button onClick={() => setRetry((x) => x + 1)}>ลองอีกครั้ง</button>
        )}
      </div>
    );
  const s = stats(state);
  return (
    <div className="app">
      <a className="skip" href="#main">
        ข้ามไปเนื้อหา
      </a>
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span className="brand-mark">CA</span>
          <span>
            COD<span className="brand-light"> ARCHIVE</span>
            <small>YOUR PERSONAL OPERATIONS HUB</small>
          </span>
        </Link>
        <div className="sidebar-caption">
          WORKSPACE <span>01</span>
        </div>
        <nav aria-label="เมนูหลัก">
          {nav.map((n) => (
            <NavLink end={n.to === "/"} key={n.to} to={n.to}>
              <n.icon size={19} />
              {n.label}
              {n.to === "/collection" && (
                <span className="nav-count">{s.total}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="device-icon">
            <Gamepad2 size={22} />
          </div>
          <div>
            <strong>PlayStation 5 Pro</strong>
            <small>Disc Drive · คลังส่วนตัว</small>
          </div>
          <span className="online-dot" />
        </div>
        <p className="sidebar-foot">
          PERSONAL ARCHIVE / EST. 2026
          <br />
          ไม่ใช่ผลิตภัณฑ์ทางการของ Activision
        </p>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span className="breadcrumb">
            WORKSPACE <ChevronRight size={12} />{" "}
            <b>
              {nav.find((n) => n.to === location.pathname)?.label ??
                "รายละเอียดเกม"}
            </b>
          </span>
          <span className="top-right">
            <span className="local-status">
              <span className="online-dot" />
              {offline ? "ออฟไลน์" : "จัดเก็บในอุปกรณ์"}
            </span>
            <span className="avatar">P1</span>
          </span>
        </header>
        <main id="main" tabIndex={-1}>
          {offline && (
            <div className="notice">
              <WifiOff size={16} /> กำลังใช้งานออฟไลน์
              ข้อมูลส่วนตัวยังบันทึกในเครื่อง
            </div>
          )}
          {refresh && (
            <div className="notice">
              มีเวอร์ชันใหม่{" "}
              <button
                onClick={async () => {
                  await queue.current;
                  if (!failed.current) void updateServiceWorker(true);
                }}
              >
                อัปเดตแอป
              </button>
            </div>
          )}
          <Routes>
            <Route path="/" element={<Dashboard state={state} />} />
            <Route path="/timeline" element={<Timeline state={state} />} />
            <Route path="/collection" element={<Collection state={state} />} />
            <Route
              path="/wishlist"
              element={<Wishlist state={state} update={update} />}
            />
            <Route path="/stats" element={<Stats state={state} />} />
            <Route
              path="/settings"
              element={
                <SettingsPage state={state} update={update} ready={ready} />
              }
            />
            <Route
              path="/games/:id"
              element={<Details state={state} update={update} />}
            />
            <Route
              path="*"
              element={
                <Empty>
                  ไม่พบหน้านี้ <Link to="/">กลับหน้าแรก</Link>
                </Empty>
              }
            />
          </Routes>
          <footer className="page-footer">
            <span>
              COD ARCHIVE <span className="muted">/</span> คลังเกม เรื่องราว
              และการเดินทางของคุณ
            </span>
            <span role="status" aria-live="polite">
              {saved || "ข้อมูลส่วนตัวอยู่บนอุปกรณ์นี้"}
            </span>
          </footer>
        </main>
      </div>
      <nav className="bottom-nav" aria-label="เมนูมือถือ">
        {nav.slice(0, 4).map((n) => (
          <NavLink key={n.to} end={n.to === "/"} to={n.to}>
            <n.icon size={20} />
            <span>{n.label}</span>
          </NavLink>
        ))}
        <button
          aria-expanded={mobileMenu}
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          <Menu size={20} />
          <span>เพิ่มเติม</span>
        </button>
      </nav>
      {mobileMenu && (
        <div className="mobile-more">
          <Link to="/stats">สถิติ</Link>
          <Link to="/settings">ตั้งค่าและสำรองข้อมูล</Link>
        </div>
      )}
    </div>
  );
}

export default App;
