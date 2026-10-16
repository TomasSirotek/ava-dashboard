import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
  // Unit tests sit next to the code they cover (thing.test.ts). They run in Node; hook tests opt into
  // jsdom with a `// @vitest-environment jsdom` comment at the top of the file.
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
    restoreMocks: true,
    // `pnpm test:coverage`: text table in the terminal, json-summary for the CI report, html in coverage/.
    // No thresholds: the 3D view and most components are deliberately untested.
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/components/ui/**", "src/**/*.interface.ts"],
      reporter: ["text", "json-summary", "html"],
    },
  },
})
