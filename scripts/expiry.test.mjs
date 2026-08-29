import assert from "node:assert/strict";
import test from "node:test";
import { defaultExpiresAt, defaultGesExpiresAt } from "../src/lib/expiry.ts";

const AUGUST_29_2026 = new Date(2026, 7, 29, 12);

test("loyalty codes default to 14 days", () => {
  assert.equal(defaultExpiresAt(AUGUST_29_2026), "2026-09-12");
});

test("GES codes default to 21 days", () => {
  assert.equal(defaultGesExpiresAt(AUGUST_29_2026), "2026-09-19");
});
