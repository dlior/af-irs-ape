import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["src/new.ts", "src/old.ts"],
    dts: true,
    format: ["esm"],
    sourcemap: true,
  },
  test: {
    include: ["src/**/*.spec.ts"],
  },
});
