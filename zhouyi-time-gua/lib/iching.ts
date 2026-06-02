export type TrigramKey = "qian" | "dui" | "li" | "zhen" | "xun" | "kan" | "gen" | "kun";

export type ElementName = "金" | "木" | "水" | "火" | "土";

export type Trigram = {
  key: TrigramKey;
  order: number;
  name: string;
  symbol: string;
  nature: string;
  element: ElementName;
  lines: [0 | 1, 0 | 1, 0 | 1];
};

export type Hexagram = {
  name: string;
  upper: Trigram;
  lower: Trigram;
  lines: [0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1];
};

export type IchingResult = {
  inputTime: string;
  upper: Trigram;
  lower: Trigram;
  movingLine: number;
  original: Hexagram;
  mutual: Hexagram;
  changed: Hexagram;
  body: Trigram;
  use: Trigram;
  bodyUseRelation: string;
};

const TRIGRAMS: Trigram[] = [
  { key: "qian", order: 1, name: "乾", symbol: "☰", nature: "天", element: "金", lines: [1, 1, 1] },
  { key: "dui", order: 2, name: "兑", symbol: "☱", nature: "泽", element: "金", lines: [1, 1, 0] },
  { key: "li", order: 3, name: "离", symbol: "☲", nature: "火", element: "火", lines: [1, 0, 1] },
  { key: "zhen", order: 4, name: "震", symbol: "☳", nature: "雷", element: "木", lines: [1, 0, 0] },
  { key: "xun", order: 5, name: "巽", symbol: "☴", nature: "风", element: "木", lines: [0, 1, 1] },
  { key: "kan", order: 6, name: "坎", symbol: "☵", nature: "水", element: "水", lines: [0, 1, 0] },
  { key: "gen", order: 7, name: "艮", symbol: "☶", nature: "山", element: "土", lines: [0, 0, 1] },
  { key: "kun", order: 8, name: "坤", symbol: "☷", nature: "地", element: "土", lines: [0, 0, 0] }
];

const HEXAGRAM_NAMES: Record<string, string> = {
  "1-1": "乾为天",
  "1-2": "天泽履",
  "1-3": "天火同人",
  "1-4": "天雷无妄",
  "1-5": "天风姤",
  "1-6": "天水讼",
  "1-7": "天山遁",
  "1-8": "天地否",
  "2-1": "泽天夬",
  "2-2": "兑为泽",
  "2-3": "泽火革",
  "2-4": "泽雷随",
  "2-5": "泽风大过",
  "2-6": "泽水困",
  "2-7": "泽山咸",
  "2-8": "泽地萃",
  "3-1": "火天大有",
  "3-2": "火泽睽",
  "3-3": "离为火",
  "3-4": "火雷噬嗑",
  "3-5": "火风鼎",
  "3-6": "火水未济",
  "3-7": "火山旅",
  "3-8": "火地晋",
  "4-1": "雷天大壮",
  "4-2": "雷泽归妹",
  "4-3": "雷火丰",
  "4-4": "震为雷",
  "4-5": "雷风恒",
  "4-6": "雷水解",
  "4-7": "雷山小过",
  "4-8": "雷地豫",
  "5-1": "风天小畜",
  "5-2": "风泽中孚",
  "5-3": "风火家人",
  "5-4": "风雷益",
  "5-5": "巽为风",
  "5-6": "风水涣",
  "5-7": "风山渐",
  "5-8": "风地观",
  "6-1": "水天需",
  "6-2": "水泽节",
  "6-3": "水火既济",
  "6-4": "水雷屯",
  "6-5": "水风井",
  "6-6": "坎为水",
  "6-7": "水山蹇",
  "6-8": "水地比",
  "7-1": "山天大畜",
  "7-2": "山泽损",
  "7-3": "山火贲",
  "7-4": "山雷颐",
  "7-5": "山风蛊",
  "7-6": "山水蒙",
  "7-7": "艮为山",
  "7-8": "山地剥",
  "8-1": "地天泰",
  "8-2": "地泽临",
  "8-3": "地火明夷",
  "8-4": "地雷复",
  "8-5": "地风升",
  "8-6": "地水师",
  "8-7": "地山谦",
  "8-8": "坤为地"
};

const GENERATES: Record<ElementName, ElementName> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木"
};

const CONTROLS: Record<ElementName, ElementName> = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木"
};

export function castByTime(input: Date | string): IchingResult {
  const date = typeof input === "string" ? new Date(input) : input;

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();

  const upper = getTrigram(year + month + day);
  const lower = getTrigram(year + month + day + hour);
  const movingLine = modOneBased(year + month + day + hour, 6);

  const original = buildHexagram(upper, lower);
  const changed = buildChangedHexagram(original, movingLine);
  const mutual = buildMutualHexagram(original);
  const body = movingLine <= 3 ? upper : lower;
  const use = movingLine <= 3 ? lower : upper;

  return {
    inputTime: date.toISOString(),
    upper,
    lower,
    movingLine,
    original,
    mutual,
    changed,
    body,
    use,
    bodyUseRelation: describeElementRelation(body.element, use.element)
  };
}

export function getTrigrams(): Trigram[] {
  return TRIGRAMS;
}

export function describeElementRelation(body: ElementName, use: ElementName): string {
  if (body === use) return `体用同为${body}，同气相求，事态可借势推进。`;
  if (GENERATES[use] === body) return `用生体：${use}生${body}，外部条件助你成事。`;
  if (GENERATES[body] === use) return `体生用：${body}生${use}，你需要投入心力与资源。`;
  if (CONTROLS[body] === use) return `体克用：${body}克${use}，你有主动掌控空间。`;
  return `用克体：${use}克${body}，阻力在外，应先稳住节奏。`;
}

function getTrigram(value: number): Trigram {
  return TRIGRAMS[modOneBased(value, 8) - 1];
}

function modOneBased(value: number, base: number): number {
  const mod = value % base;
  return mod === 0 ? base : mod;
}

function buildHexagram(upper: Trigram, lower: Trigram): Hexagram {
  const lines = [...lower.lines, ...upper.lines] as Hexagram["lines"];
  return {
    name: HEXAGRAM_NAMES[`${upper.order}-${lower.order}`],
    upper,
    lower,
    lines
  };
}

function buildChangedHexagram(hexagram: Hexagram, movingLine: number): Hexagram {
  const changedLines = [...hexagram.lines] as Hexagram["lines"];
  const index = movingLine - 1;
  changedLines[index] = changedLines[index] === 1 ? 0 : 1;
  return buildHexagram(trigramFromLines(changedLines.slice(3, 6)), trigramFromLines(changedLines.slice(0, 3)));
}

function buildMutualHexagram(hexagram: Hexagram): Hexagram {
  const lower = trigramFromLines(hexagram.lines.slice(1, 4));
  const upper = trigramFromLines(hexagram.lines.slice(2, 5));
  return buildHexagram(upper, lower);
}

function trigramFromLines(lines: number[]): Trigram {
  const match = TRIGRAMS.find((trigram) => trigram.lines.every((line, index) => line === lines[index]));
  if (!match) throw new Error(`Unknown trigram lines: ${lines.join("")}`);
  return match;
}
