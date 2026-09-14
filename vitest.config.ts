import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tools/*/test/**/*.test.ts"],
    coverage: {
      include: ["tools/validator/src/**/*.ts", "tools/scenarios/src/**/*.ts"],
      exclude: ["tools/validator/src/cli.ts", "tools/scenarios/src/cli.ts"],
      // Jede Regelzeile muss von einem Fixture erreicht werden.
      thresholds: { lines: 100, functions: 100 },
    },
  },
});
