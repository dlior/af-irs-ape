import { describe, expect, it } from "vite-plus/test";

import { add as addNew } from "./new.ts";
import { add as addOld } from "./old.ts";

describe("@ape/pricing", () => {
  it("@ape/pricing/old adds two numbers starting from 0", () => {
    expect(addOld(100, 50)).toBe(150);
  });

  it("@ape/pricing/new adds two numbers with optional initialValue", () => {
    expect(addNew(100, 50)).toBe(150);
    expect(addNew(100, 50, 25)).toBe(175);
  });
});
