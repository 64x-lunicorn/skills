import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tools/*/test/**/*.test.ts"],
    coverage: {
      include: ["tools/validator/src/**/*.ts", "tools/scenarios/src/**/*.ts"],
      exclude: ["tools/validator/src/cli.ts", "tools/scenarios/src/cli.ts"],
      // Every line of the tools' source must be reached by a test.
      thresholds: { lines: 100, functions: 100 },
    },
  },
});
