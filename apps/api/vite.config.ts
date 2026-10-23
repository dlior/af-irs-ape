import { defineConfig } from "vite-plus";

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`. Requires Vite 8, which ships this option.
  resolve: { tsconfigPaths: true },
  run: {
    tasks: {
      build: {
        command: "nest build",
        dependsOn: [{ task: "build", from: "dependencies" }],
        cache: {
          input: [{ auto: true }, "!dist/**", "!tsconfig.build.tsbuildinfo"],
          output: ["dist/**"],
        },
      },
    },
  },
  test: {
    globals: true,
    root: "./",
    include: ["**/*.spec.ts"],
  },
});
