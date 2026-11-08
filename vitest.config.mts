import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      // Logica testabile in Node; UI React e glue Electron (main/index, preload) sono esclusi.
      include: [
        "src/main/backupService.ts",
        "src/shared/**/*.ts",
        "src/utils/**/*.ts",
      ],
      exclude: ["src/shared/types.ts"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
