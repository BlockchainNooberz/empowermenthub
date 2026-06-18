import { useState, useRef, useEffect } from "react";
import { RefreshCw } from "lucide-react";

const THRESHOLD = 70;

export default function PullToRefresh({ onRefresh, children }) {
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const containerRef = useRef(null);

  const handleTouchStart = (e) => {
    const el = containerRef.current;
    if (el && el.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (startY.current === null || refreshing) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      setPullY(Math.min(delta * 0.5, THRESHOLD + 20));
    }
  };

  const handleTouchEnd = async () => {
    if (pullY >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullY(THRESHOLD);
      await onRefresh?.();
      setRefreshing(false);
    }
    setPullY(0);
    startY.current = null;
  };

  const progress = Math.min(pullY / THRESHOLD, 1);
  const showIndicator = pullY > 10 || refreshing;

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto overscroll-none relative"
      style={{ overscrollBehavior: "none" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      {showIndicator && (
        <div
          className="flex items-center justify-center transition-all duration-150"
          style={{ height: refreshing ? THRESHOLD : pullY, overflow: "hidden" }}
        >
          <RefreshCw
            className="w-5 h-5 text-primary transition-transform"
            style={{
              transform: `rotate(${refreshing ? 0 : progress * 360}deg)`,
              animation: refreshing ? "spin 0.8s linear infinite" : "none",
            }}
          />
        </div>
      )}
      {children}
    </div>
  );
}