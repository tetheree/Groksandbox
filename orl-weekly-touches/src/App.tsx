import { useState } from "react";
import week from "./data/sample-week.json";

type FilterId = "this-week" | "keep-warm" | "warm-cold" | "deferred" | "hot";

type Tone = "blue" | "green" | "peach" | "gray";

const filters: { id: FilterId; label: string; count: string | number; tone: Tone }[] = [
  { id: "this-week", label: "This week", count: week.stats.thisWeek, tone: "blue" },
  { id: "keep-warm", label: "Keep warm", count: week.stats.keepWarm, tone: "green" },
  { id: "warm-cold", label: "Warm cold", count: week.stats.warmCold, tone: "peach" },
  { id: "deferred", label: "Deferred", count: week.stats.deferred, tone: "gray" },
  { id: "hot", label: "Hot on huddle", count: week.stats.hotOnHuddle, tone: "gray" },
];

const chipTone: Record<Tone, { idle: string; selected: string }> = {
  blue: {
    idle: "bg-[#e7eef6] text-[#3c5168]",
    selected: "bg-[#d3e3f4] text-[#16324f] ring-2 ring-[#6f97c2]",
  },
  green: {
    idle: "bg-[#e5f6eb] text-[#1d7a3e]",
    selected: "bg-[#d3f0de] text-[#146b32] ring-2 ring-[#67b884]",
  },
  peach: {
    idle: "bg-[#fde8d8] text-[#c45c12]",
    selected: "bg-[#fcd9c2] text-[#a84e0c] ring-2 ring-[#e29a62]",
  },
  gray: {
    idle: "bg-[#f1f2f4] text-[#5c6570]",
    selected: "bg-[#e4e7eb] text-[#2c3540] ring-2 ring-[#b7bec8]",
  },
};

function rowsFor(filter: FilterId) {
  if (filter === "keep-warm") return week.touches.filter((row) => row.lane === "keep-warm");
  if (filter === "warm-cold") return week.touches.filter((row) => row.lane === "warm-cold");
  if (filter === "this-week") return week.touches;
  return [];
}

function laneLabel(lane: string) {
  return lane === "keep-warm" ? "Keep warm" : "Warm cold";
}

export default function App() {
  const [filter, setFilter] = useState<FilterId>("this-week");
  const rows = rowsFor(filter);
  const showTable = filter === "this-week" || filter === "keep-warm" || filter === "warm-cold";

  return (
    <div className="min-h-screen bg-[#e6e9ee] px-7 py-9">
      <div
        className="mx-auto flex w-full max-w-[1200px] items-stretch overflow-hidden rounded-[20px] bg-white shadow-[0_16px_40px_rgba(16,36,64,0.10)]"
        data-version="1.1.0"
        data-filter={filter}
      >
        <aside
          className="flex w-[52px] shrink-0 flex-col items-center bg-[#0c2340] py-6"
          aria-hidden="true"
        >
          <div className="mt-3 flex flex-col gap-3.5">
            {[0, 1, 2, 3, 4].map((dot) => (
              <span
                key={dot}
                className={`h-2 w-2 rounded-full ${dot === 2 ? "bg-[#1eb8b0]" : "bg-white/25"}`}
              />
            ))}
          </div>
          <div className="mb-1 mt-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#148f8a] text-[13px] font-semibold text-white">
            0
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-8 pb-6 pt-7">
          <header className="flex items-start justify-between gap-6">
            <div>
              {week.sample ? (
                <span className="inline-flex rounded-full bg-[#f8efc4] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a6232]">
                  Sample
                </span>
              ) : null}
              <h1 className="mt-3 text-[30px] font-bold leading-tight tracking-[-0.02em] text-[#10243f]">
                {week.title} · week of {week.weekOf}
              </h1>
              <p className="mt-2 text-[15.5px] text-[#1c3348]">{week.tagline}</p>
              <p className="mt-1 text-[13px] text-[#8b95a1]">
                {week.org} · {week.location} · {week.meta}
              </p>
            </div>
            <span className="mt-1 shrink-0 rounded-full bg-[#0e6e6a] px-4 py-1.5 text-[13.5px] font-semibold text-white">
              {week.capLabel}
            </span>
          </header>

          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Lane filters">
            {filters.map((chip) => {
              const selected = filter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  aria-pressed={selected}
                  data-chip={chip.id}
                  onClick={() => setFilter(chip.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13.5px] ${chipTone[chip.tone][selected ? "selected" : "idle"]}`}
                >
                  <span>{chip.label}</span>
                  <span className="font-bold">{chip.count}</span>
                </button>
              );
            })}
          </div>

          <p className="mt-4 rounded-lg bg-[#eef5fb] px-4 py-2.5 text-[13px] leading-relaxed text-[#5d6d7e]">
            {week.rules.join(" · ")}
          </p>

          {showTable ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-[#e7ebf0]">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#f4f6f8] text-[12px] text-[#8b95a1]">
                    <th className="w-10 px-3 py-2.5 font-medium">#</th>
                    <th className="px-3 py-2.5 font-medium">Account</th>
                    <th className="px-3 py-2.5 font-medium">Lane</th>
                    <th className="px-3 py-2.5 font-medium">Why this week</th>
                    <th className="px-3 py-2.5 font-medium">Suggested touch</th>
                    <th className="px-3 py-2.5 font-medium">Who</th>
                    <th className="px-3 py-2.5 font-medium">Day</th>
                    <th className="px-3 py-2.5 font-medium">Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.n} className="border-t border-[#eef0f3] text-[13.5px] text-[#24384c]" data-account={row.account}>
                      <td className="px-3 py-3 text-[#7d8b99]">{row.n}</td>
                      <td className="px-3 py-3 font-semibold text-[#14283f]">{row.account}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-medium ${
                            row.lane === "keep-warm"
                              ? "bg-[#e3f6e8] text-[#1f8a42]"
                              : "bg-[#fdecdc] text-[#d2651a]"
                          }`}
                        >
                          {laneLabel(row.lane)}
                        </span>
                      </td>
                      <td className="px-3 py-3">{row.why}</td>
                      <td className="px-3 py-3">{row.touch}</td>
                      <td className="px-3 py-3">{row.who}</td>
                      <td className="px-3 py-3 font-bold text-[#0e7c86]">{row.day}</td>
                      <td className="px-3 py-3">{row.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {filter === "deferred" ? (
            <div className="mt-4 rounded-xl border border-[#e6eaee] border-l-4 border-l-[#148f8a] bg-[#f7f8fa] px-5 py-6">
              <p className="text-[15px] font-semibold text-[#14324f]">{week.deferred.summary}</p>
              <p className="mt-2 text-[13.5px] text-[#5c6b78]">{week.deferred.cadence}</p>
            </div>
          ) : null}

          {filter === "hot" ? (
            <div className="mt-4 rounded-xl border border-[#e6eaee] bg-[#f7f8fa] px-5 py-6">
              <p className="text-[15px] font-semibold text-[#14324f]">Hot stays on huddle (no task).</p>
              <p className="mt-2 text-[13.5px] text-[#5c6b78]">No weekly warm task.</p>
            </div>
          ) : null}

          <footer className="mt-4 flex items-start justify-between gap-6 rounded-xl border-l-4 border-[#148f8a] bg-[#f6f8f9] px-5 py-4">
            <div>
              <p className="text-[14px] font-semibold text-[#16324a]">{week.deferred.summary}</p>
              <p className="mt-1 text-[13px] text-[#6b7785]">{week.deferred.cadence}</p>
            </div>
            <p className="max-w-[200px] shrink-0 text-right text-[12px] leading-snug text-[#8b95a1]">
              {week.deferred.footnote}
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
