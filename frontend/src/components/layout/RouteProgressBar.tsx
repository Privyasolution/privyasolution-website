"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ProgressBarInner() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [width, setWidth]     = useState(0);

  useEffect(() => {
    // New route started — animate bar to ~80% quickly, then complete
    setVisible(true);
    setWidth(15);

    const grow = setTimeout(() => setWidth(75), 50);
    const done = setTimeout(() => {
      setWidth(100);
      // Hide after transition completes
      setTimeout(() => { setVisible(false); setWidth(0); }, 250);
    }, 350);

    return () => { clearTimeout(grow); clearTimeout(done); };
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-brand-cyan/20 pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-brand-cyan transition-all duration-300 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

// Wrap in Suspense — useSearchParams requires it
export default function RouteProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}
