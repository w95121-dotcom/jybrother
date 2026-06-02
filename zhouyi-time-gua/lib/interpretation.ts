import type { IchingResult } from "./iching";

export type MatterType = "career" | "love" | "wealth" | "partnership" | "choice" | "travel";

export type Interpretation = {
  title: string;
  trend: string;
  risks: string[];
  actions: string[];
  conclusion: string;
};

export const MATTER_TYPES: { value: MatterType; label: string }[] = [
  { value: "career", label: "事业" },
  { value: "love", label: "感情" },
  { value: "wealth", label: "财运" },
  { value: "partnership", label: "合作" },
  { value: "choice", label: "选择" },
  { value: "travel", label: "出行" }
];

const TYPE_COPY: Record<MatterType, { title: string; focus: string; action: string }> = {
  career: { title: "事业判断", focus: "职位、项目与长期势能", action: "把目标拆成可交付节点，以结果换取更高信任。" },
  love: { title: "感情判断", focus: "情绪、沟通与关系温度", action: "先降低误解，再表达真实需求，避免用试探代替沟通。" },
  wealth: { title: "财运判断", focus: "现金流、收益与风险敞口", action: "保留余地，先验证收益来源，再扩大投入。" },
  partnership: { title: "合作判断", focus: "分工、契约与利益一致性", action: "把口头默契落到边界、责任与退出条件上。" },
  choice: { title: "选择判断", focus: "取舍、时机与后续代价", action: "用最小成本测试关键假设，不急于把路走死。" },
  travel: { title: "出行判断", focus: "行程、变动与安全感", action: "预留缓冲，提前确认路线、证件、天气与衔接时间。" }
};

export function interpret(result: IchingResult, matterType: MatterType, question: string): Interpretation {
  const copy = TYPE_COPY[matterType];
  const isSupported = result.bodyUseRelation.startsWith("用生体") || result.bodyUseRelation.startsWith("体克用") || result.bodyUseRelation.startsWith("体用同");
  const isCostly = result.bodyUseRelation.startsWith("体生用");
  const isBlocked = result.bodyUseRelation.startsWith("用克体");
  const movement = result.movingLine <= 2 ? "初动，事情仍在酝酿" : result.movingLine <= 4 ? "中动，变化已经进入关键段" : "上动，结果接近显现";

  const trend = isSupported
    ? `${copy.focus}上有可用之势。本卦${result.original.name}显示当下格局清晰，${movement}；变卦${result.changed.name}提示顺势推进可见结果。`
    : isCostly
      ? `${copy.focus}需要先投入再见回响。本卦${result.original.name}说明你是推动变化的一方，${movement}；互卦${result.mutual.name}提示过程里要重视中间人的态度与资源消耗。`
      : `${copy.focus}暂有阻力。本卦${result.original.name}显示外部条件牵制较强，${movement}；变卦${result.changed.name}提示先化阻，再求进。`;

  const risks = [
    isBlocked ? "外部约束强于主观意愿，硬推容易换来反复。" : "形势虽可推动，但仍需防止判断过快。",
    isCostly ? "投入大于短期回报，容易因消耗感影响耐心。" : "不要忽略细节确认，尤其是时间、承诺与边界。",
    `动爻在${result.movingLine}爻，关键变化点不宜被情绪带偏。`
  ];

  const actions = [
    copy.action,
    isSupported ? "抓住已有助力，优先做能形成反馈的动作。" : "先处理最明显的阻力，再判断是否加速。",
    question.trim() ? `围绕“${question.trim()}”写下一个可在三天内执行的下一步。` : "补充一个具体问题，会让判断更聚焦。"
  ];

  const conclusion = isSupported
    ? "可进，但宜稳中取势。"
    : isCostly
      ? "能成，但要控制投入节奏。"
      : "暂缓硬冲，先解外部阻力。";

  return {
    title: copy.title,
    trend,
    risks,
    actions,
    conclusion
  };
}
