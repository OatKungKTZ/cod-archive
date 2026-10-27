import { Component, StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="boot">
        <h1>เปิดหน้าจอนี้ไม่สำเร็จ</h1>
        <p>ข้อมูลในอุปกรณ์ยังไม่ถูกลบ ลองเปิดแอปใหม่อีกครั้ง</p>
        <button onClick={() => window.location.reload()}>เปิดใหม่</button>
      </div>
    ) : (
      this.props.children
    );
  }
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
