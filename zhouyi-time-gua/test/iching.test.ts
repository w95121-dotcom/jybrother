import { describe, expect, it } from "vitest";
import { castByTime } from "../lib/iching";
import { interpret } from "../lib/interpretation";

describe("castByTime", () => {
  it("returns a fixed hexagram for the same time input", () => {
    const result = castByTime("2026-06-02T09:30:00+08:00");

    expect(result.upper.name).toBe("巽");
    expect(result.lower.name).toBe("巽");
    expect(result.movingLine).toBe(5);
    expect(result.original.name).toBe("巽为风");
    expect(result.mutual.name).toBe("火泽睽");
    expect(result.changed.name).toBe("山风蛊");
    expect(result.body.name).toBe("巽");
    expect(result.use.name).toBe("巽");
    expect(result.bodyUseRelation).toContain("体用同为木");
  });

  it("keeps interpretation deterministic for a fixed matter type", () => {
    const result = castByTime("2026-06-02T09:30:00+08:00");
    const reading = interpret(result, "career", "本月项目是否适合推进？");

    expect(reading.title).toBe("事业判断");
    expect(reading.conclusion).toBe("可进，但宜稳中取势。");
    expect(reading.risks).toHaveLength(3);
    expect(reading.actions).toHaveLength(3);
  });
});
