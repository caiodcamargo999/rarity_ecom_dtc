"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getTracker, isIgnoredPath } from "@/lib/tracker";

function TrackingListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && !isIgnoredPath(pathname)) {
      const tracker = getTracker();
      tracker.trackPageView(pathname);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function TrackingProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <TrackingListener />
      </Suspense>
      {children}
    </>
  );
}
