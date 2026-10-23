import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import request from "supertest";
import { App } from "supertest/types.js";

import { AppModule } from "./../src/app.module.js";

describe("API Health, oRPC, OpenAPI Docs & ServeStatic SPA (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.setGlobalPrefix("api", {
      exclude: ["/docs", "/docs/spec.json"],
    });
    await app.init();
  });

  it("/api/health (GET)", () => {
    return request(app.getHttpServer()).get("/api/health").expect(200).expect({ status: "ok" });
  });

  it("/api/greeting & /api/tasks (oRPC NestJS Controller procedures)", async () => {
    const greetingRes = await request(app.getHttpServer()).get("/api/greeting").expect(200);
    expect(greetingRes.body).toMatchObject({
      app: "AF-IRS-APE",
      message: "Hello from AF-IRS-APE (api)!",
    });

    const createRes = await request(app.getHttpServer())
      .post("/api/tasks")
      .send({ title: "oRPC E2E Task", priority: "high" })
      .expect(200);
    expect(createRes.body).toMatchObject({
      title: "oRPC E2E Task",
      priority: "high",
      status: "todo",
    });

    const createdId = (createRes.body as { id: string }).id;

    const toggleRes = await request(app.getHttpServer())
      .patch(`/api/tasks/${createdId}/toggle-status`)
      .send({})
      .expect(200);
    expect(toggleRes.body).toMatchObject({
      id: createdId,
      status: "done",
    });

    // Zod validation rejects invalid input (< 3 chars) via oRPC with 400 Bad Request
    await request(app.getHttpServer())
      .post("/api/tasks")
      .send({ title: "ab", priority: "high" })
      .expect(400);
  });

  it("serves OpenAPI 3.1 spec at /docs/spec.json and Scalar UI at /docs", async () => {
    const specRes = await request(app.getHttpServer()).get("/docs/spec.json").expect(200);
    expect(specRes.body).toMatchObject({
      openapi: "3.1.1",
      info: {
        title: "AF-IRS-APE API",
        version: "1.0.0",
      },
    });

    const docsUiRes = await request(app.getHttpServer()).get("/docs").expect(200);
    expect(docsUiRes.headers["content-type"]).toContain("text/html");
    expect(docsUiRes.text).toContain('data-url="/docs/spec.json"');
  });

  it("serves React SPA index.html for client-side routes (/ and /tasks) and excludes /api/* and /docs*", async () => {
    const spaRouteRes = await request(app.getHttpServer()).get("/tasks").expect(200);
    expect(spaRouteRes.headers["content-type"]).toContain("text/html");
    expect(spaRouteRes.text).toContain('<div id="root"></div>');

    const rootRes = await request(app.getHttpServer()).get("/").expect(200);
    expect(rootRes.headers["content-type"]).toContain("text/html");
    expect(rootRes.text).toContain('<div id="root"></div>');

    await request(app.getHttpServer()).get("/api/unknown-endpoint").expect(404);
  });

  afterEach(async () => {
    await app.close();
  });
});
