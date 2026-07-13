import GoogleAnalytics from "./GoogleAnalytics";
import Clarity from "./Clarity";

/**
 * Single entry point for all analytics / telemetry scripts.
 * Add new providers here so the root layout only ever mounts <Analytics />.
 * Each provider self-gates on its own env var, so this is safe to always mount.
 */
export default function Analytics() {
  return (
    <>
      <GoogleAnalytics />
      <Clarity />
    </>
  );
}
