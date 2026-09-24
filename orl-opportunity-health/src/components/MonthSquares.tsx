import { monthTitle } from '../lib/coverage.ts'
import { formatMonthYear } from '../lib/health.ts'
import { cn } from '../lib/cn.ts'
import type { MonthCell } from '../types.ts'

function tone(weeksCovered: number): string {
  if (weeksCovered <= 0) return 'bg-stone-100 text-stone-400'
  if (weeksCovered === 1) return 'bg-teal-100 text-teal-900'
  if (weeksCovered === 2) return 'bg-teal-500 text-white'
  return 'bg-teal-800 text-white'
}

type Props = {
  months: MonthCell[]
}

export function MonthSquares({ months }: Props) {
  return (
    <div>
      <ol className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {months.map((month) => {
          const label = formatMonthYear(month.ym)
          return (
            <li key={month.ym} className="text-center">
              <div
                title={monthTitle(month)}
                className={cn(
                  'flex h-11 items-center justify-center rounded-md text-sm font-semibold tabular-nums',
                  tone(month.weeksCovered),
                )}
              >
                {month.weeksCovered === 0 ? '–' : month.weeksCovered}
              </div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-wide text-stone-500">
                {label.month}
              </div>
              <div className="text-[10px] text-stone-400">{label.year}</div>
            </li>
          )
        })}
      </ol>
      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-stone-500">
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-stone-100 ring-1 ring-stone-300" /> none
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-teal-100" /> 1 week
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-teal-500" /> 2
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-teal-800" /> 3+
        </li>
      </ul>
    </div>
  )
}
