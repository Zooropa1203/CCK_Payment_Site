import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import "../styles/application.css";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
    </div>
  );
}
