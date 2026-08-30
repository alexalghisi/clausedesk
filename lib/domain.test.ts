import { describe, expect, it } from "vitest";
import { missingRequired, packetReady } from "./domain";

const rows = [
  { catalogId: "nda", required: true, status: "pending" },
  { catalogId: "logo", required: false, status: "pending" },
];

describe("missingRequired", () => {
  it("ignores optional pending rows", () => {
    expect(missingRequired(rows).map((row) => row.catalogId)).toEqual(["nda"]);
  });
});

describe("packetReady", () => {
  it("is false until required rows are accepted", () => {
    expect(packetReady(rows)).toBe(false);
    expect(packetReady([{ catalogId: "nda", required: true, status: "accepted" }])).toBe(true);
  });
});
