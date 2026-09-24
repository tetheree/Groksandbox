import { groupWeeksByMonth, weekTitle } from '../lib/coverage.ts'
import { cn } from '../lib/cn.ts'
import type { WeekCell } from '../types.ts'

type Props = {
  weeks: WeekCell[]
  coveredInWindow: number
  size?: 'list' | 'drawer'
}

export function WeekHashes({ weeks, coveredInWindow, size = 'list' }: Props) {
  const groups = groupWeeksByMonth(weeks)
  const tall = size === 'drawer'
  const summary = `${coveredInWindow} of ${weeks.length} weeks huddle-covered. Each mark is one week, not a count of names. Newest week is on the right.`

  return (
    <div>
      <div className="flex items-end justify-between gap-3" role="img" aria-label={summary}>
        <div className="flex items-end gap-2">
          {groups.map((group) => (
            <div key={group.key}>
              <div className="flex gap-[3px]">
                {group.weeks.map((week) => (
                  <span
                    key={week.iso}
                    title={weekTitle(week)}
                    className={cn(
                      'rounded-[3px]',
                      tall ? 'h-7 w-3' : 'h-5 w-2.5',
                      week.covered ? 'bg-teal-800' : 'bg-stone-200',
                    )}
                  />
                ))}
              </div>
              <div className={cn('text-stone-400', tall ? 'mt-1.5 text-[11px]' : 'mt-1 text-[10px]')}>
                {group.label}
              </div>
            </div>
          ))}
        </div>
        <p className={cn('shrink-0 tabular-nums text-stone-500', tall ? 'text-sm' : 'text-xs')}>
          {coveredInWindow}/{weeks.length}
        </p>
      </div>
    </div>
  )
}
