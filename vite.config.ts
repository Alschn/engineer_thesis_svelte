/// <reference types="vitest" />
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import type { UserConfig as VitestUserConfigInterface } from "vitest/config";

const vitestConfig: VitestUserConfigInterface = {
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/tests/vitest/setup.ts"],
    include: [
      "./src/tests/vitest/*.{spec,test}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    css: false,
    coverage: {
      provider: "c8",
      reporter: ["html", "lcov", "text"],
      src: ["src"],
      exclude: ["**/src/tests/**", "**/src/config/**", "**/src/vite-env.d.ts"],
      all: true,
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  test: vitestConfig.test,
  optimizeDeps: { exclude: ["svelte-navigator"] },
});
