import { defineConfig } from "vite-plus";

export default defineConfig({
  defaultPackage: {
    dev: "./apps/web",
    build: "./apps/web",
    preview: "./apps/web",
  },
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: ["**/dist/**", "**/routeTree.gen.ts"],
  },
  lint: {
    ignorePatterns: ["**/dist/**", "**/routeTree.gen.ts"],
    plugins: ["typescript", "oxc", "unicorn", "import"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      "no-console": "warn",
      eqeqeq: ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
      "typescript/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "typescript/no-floating-promises": "error",
      "typescript/no-misused-promises": "error",
      "typescript/await-thenable": "error",
      "typescript/no-explicit-any": "error",
      "typescript/no-unsafe-assignment": "error",
      "typescript/no-unsafe-call": "error",
      "typescript/no-unsafe-member-access": "error",
      "typescript/no-unsafe-return": "error",
      "typescript/no-unsafe-argument": "error",
      "import/no-duplicates": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    overrides: [
      {
        files: ["apps/web/**"],
        plugins: ["react"],
        rules: {
          "react/rules-of-hooks": "error",
          "react/only-export-components": [
            "warn",
            {
              allowConstantExport: true,
              allowExportNames: ["Route", "buttonVariants"],
            },
          ],
        },
      },
      {
        files: [
          "apps/web/src/routes/**",
          "apps/web/src/components/ui/**",
          "apps/web/src/integrations/**",
        ],
        plugins: ["react"],
        rules: {
          "react/only-export-components": "off",
        },
      },
      {
        files: ["apps/api/**"],
        env: {
          node: true,
        },
        rules: {
          "typescript/consistent-type-imports": "off",
        },
      },
      {
        files: [
          "**/*.spec.ts",
          "**/*.spec.tsx",
          "**/*.test.ts",
          "**/*.test.tsx",
          "**/*.e2e-spec.ts",
        ],
        plugins: ["vitest"],
      },
    ],
  },
  run: {
    cache: true,
  },
});
