import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import BottomTabBar from "./BottomTabBar";
import MobileHeader from "./MobileHeader";

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile layout */}
      <div className="lg:hidden flex flex-col h-screen">
        <MobileHeader />
        <main
          className="flex-1 overflow-y-auto overscroll-none"
          style={{
            paddingTop: "calc(env(safe-area-inset-top) + 3.5rem)",
            paddingBottom: "calc(env(safe-area-inset-bottom) + 4rem)",
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
            overscrollBehavior: "none",
          }}
        >
          <Outlet />
        </main>
        <BottomTabBar />
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex">
        <Sidebar />
        <main className="ml-[260px] min-h-screen flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}