"use client";

import { useEffect } from "react";

export default function LegacyRouteRedirect({ routes }: { routes: Record<string, string> }) {
  useEffect(() => {
    const lessonId = decodeURIComponent(window.location.hash.slice(1));
    const canonicalPath = routes[lessonId];
    if (canonicalPath) window.location.replace(canonicalPath);
  }, [routes]);

  return null;
}
