import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    // Default tests exercise the live-backend (fetch) path of the API client.
    // The static-fallback path is covered by tests that unset this var.
    env: { NEXT_PUBLIC_API_URL: "http://test.local" },
    coverage: {
      provider: "v8",
      include: [
        "src/lib/api.ts",
        "src/lib/handle-async.ts",
        "src/components/layout/Header.tsx",
        "src/components/blog/CommentSection.tsx",
        "src/app/login/page.tsx",
        "src/app/register/page.tsx",
      ],
      thresholds: {
        lines: 100,
        branches: 100,
        functions: 100,
        statements: 100,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
