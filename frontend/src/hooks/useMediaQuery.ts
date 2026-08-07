import { useEffect, useState } from "react";

/**
 * Returns whether `query` currently matches. SSR-safe: starts `false` on the
 * server and first client render (so hydration matches), then updates after
 * mount. Use it to keep expensive client-only UI (e.g. WebGL) off small screens.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
