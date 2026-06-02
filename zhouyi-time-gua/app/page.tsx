"use client";

import { useMemo, useState } from "react";
import { castByTime } from "@/lib/iching";
import { interpret, MATTER_TYPES, type MatterType } from "@/lib/interpretation";

function toLocalInputValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [matterType, setMatterType] = useState<MatterType>("career");
  const [time, setTime] = useState(() => toLocalInputValue(new Date()));

  const result = useMemo(() => castByTime(time), [time]);
  const reading = useMemo(() => interpret(result, matterType, question), [result, matterType, question]);

  return (
    <main className="min-h-screen px-4 py-5 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <header className="flex items-end justify-between gap-4 border-b border-ink/15 pb-4">
          <div>
            <p className="text-sm text-cinnabar">梅花易数</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal sm:text-5xl">时间起卦</h1>
          </div>
          <div className="hidden text-right text-sm leading-6 text-ink/60 sm:block">
            <p>本卦 · 互卦 · 变卦</p>
            <p>体用 · 五行 · 生克</p>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <form className="rounded-md border border-ink/15 bg-paper/90 p-4 shadow-soft sm:p-5">
            <label className="block text-sm font-medium text-ink/70" htmlFor="question">
              所问之事
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={4}
              placeholder="例如：这个项目是否适合本月推进？"
              className="mt-2 w-full resize-none rounded border border-ink/15 bg-white/60 px-3 py-3 text-base outline-none transition focus:border-cinnabar"
            />

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <label className="block text-sm font-medium text-ink/70" htmlFor="matterType">
                事情类型
                <select
                  id="matterType"
                  value={matterType}
                  onChange={(event) => setMatterType(event.target.value as MatterType)}
                  className="mt-2 w-full rounded border border-ink/15 bg-white/60 px-3 py-3 text-base outline-none transition focus:border-cinnabar"
                >
                  {MATTER_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-ink/70" htmlFor="time">
                起卦时间
                <input
                  id="time"
                  type="datetime-local"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="mt-2 w-full rounded border border-ink/15 bg-white/60 px-3 py-3 text-base outline-none transition focus:border-cinnabar"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => setTime(toLocalInputValue(new Date()))}
              className="mt-4 w-full rounded bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-cinnabar"
            >
              使用当前时间
            </button>
          </form>

          <section className="rounded-md border border-ink/15 bg-[#fffaf0]/80 p-4 shadow-soft sm:p-5">
            <div className="flex items-start justify-between gap-3 border-b border-ink/10 pb-4">
              <div>
                <p className="text-sm text-ink/55">本卦</p>
                <h2 className="mt-1 text-3xl font-semibold">{result.original.name}</h2>
              </div>
              <div className="text-right">
                <p className="text-5xl leading-none text-cinnabar">
                  {result.upper.symbol}
                  {result.lower.symbol}
                </p>
                <p className="mt-1 text-sm text-ink/55">动爻：{result.movingLine} 爻</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Info label="上卦" value={`${result.upper.name}为${result.upper.nature}`} meta={result.upper.element} />
              <Info label="下卦" value={`${result.lower.name}为${result.lower.nature}`} meta={result.lower.element} />
              <Info label="互卦" value={result.mutual.name} meta={`${result.mutual.upper.name}${result.mutual.lower.name}`} />
              <Info label="变卦" value={result.changed.name} meta={`${result.changed.upper.name}${result.changed.lower.name}`} />
              <Info label="体卦" value={result.body.name} meta={result.body.element} />
              <Info label="用卦" value={result.use.name} meta={result.use.element} />
            </div>

            <div className="mt-4 rounded border border-jade/20 bg-jade/5 p-3 text-sm leading-6 text-ink/75">
              {result.bodyUseRelation}
            </div>
          </section>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-md border border-ink/15 bg-paper/90 p-4 sm:p-5">
            <p className="text-sm text-cinnabar">{reading.title}</p>
            <h2 className="mt-2 text-xl font-semibold">趋势判断</h2>
            <p className="mt-3 text-base leading-8 text-ink/75">{reading.trend}</p>
          </article>

          <article className="rounded-md border border-ink/15 bg-paper/90 p-4 sm:p-5">
            <h2 className="text-xl font-semibold">风险点</h2>
            <ul className="mt-3 space-y-2 text-base leading-7 text-ink/75">
              {reading.risks.map((risk) => (
                <li key={risk} className="border-l-2 border-bronze/50 pl-3">
                  {risk}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-md border border-ink/15 bg-paper/90 p-4 sm:p-5">
            <h2 className="text-xl font-semibold">行动建议</h2>
            <ul className="mt-3 space-y-2 text-base leading-7 text-ink/75">
              {reading.actions.map((action) => (
                <li key={action} className="border-l-2 border-jade/50 pl-3">
                  {action}
                </li>
              ))}
            </ul>
          </article>

          <article className="flex min-h-44 flex-col justify-between rounded-md border border-cinnabar/30 bg-cinnabar px-4 py-5 text-paper sm:p-6">
            <p className="text-sm text-paper/70">一句话结论</p>
            <p className="mt-4 text-3xl font-semibold leading-tight">{reading.conclusion}</p>
          </article>
        </section>
      </div>
    </main>
  );
}

function Info({ label, value, meta }: { label: string; value: string; meta: string }) {
  return (
    <div className="rounded border border-ink/10 bg-white/45 p-3">
      <p className="text-xs text-ink/50">{label}</p>
      <p className="mt-1 text-lg font-semibold leading-tight">{value}</p>
      <p className="mt-1 text-sm text-bronze">{meta}</p>
    </div>
  );
}
