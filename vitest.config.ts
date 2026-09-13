import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tools/validator/test/**/*.test.ts"],
    coverage: {
      include: ["tools/validator/src/**/*.ts"],
      exclude: ["tools/validator/src/cli.ts"],
      // Jede Regelzeile muss von einem Fixture erreicht werden.
      thresholds: { lines: 100, functions: 100 },
    },
  },
});
