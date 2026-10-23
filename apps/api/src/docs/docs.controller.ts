import { appContract } from "@ape/contract";
import { APP_NAME } from "@ape/shared";
import { Controller, Get, Header } from "@nestjs/common";
import { OpenAPIGenerator } from "@orpc/openapi";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";

@Controller("docs")
export class DocsController {
  private readonly generator = new OpenAPIGenerator({
    schemaConverters: [new ZodToJsonSchemaConverter()],
  });

  @Get("spec.json")
  async getSpec() {
    return this.generator.generate(appContract, {
      info: {
        title: `${APP_NAME} API`,
        version: "1.0.0",
        description: "oRPC Contract-First OpenAPI 3.1 Specification",
      },
      servers: [{ url: "/api" }],
    });
  }

  @Get()
  @Header("Content-Type", "text/html; charset=utf-8")
  getDocsUi(): string {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${APP_NAME} — API Docs</title>
  </head>
  <body>
    <script id="api-reference" data-url="/docs/spec.json"></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`;
  }
}
