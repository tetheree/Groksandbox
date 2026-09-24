import {
  bandFor,
  formatMonthDay,
  formatMonthYear,
  mondaysEnding,
  monthsEnding,
  weeksSince,
} from './health.ts'
import type { AccountView, BookFile, MonthCell, WeekCell } from '../types.ts'

export function buildAccountViews(book: BookFile): AccountView[] {
  const weekIsos = mondaysEnding(book.asOf, book.windowWeeks)
  const monthYms = monthsEnding(book.asOf, book.windowMonths)

  return book.accounts.map((account) => {
    const covered = new Set(account.coveredWeeks)
    const weeks: WeekCell[] = weekIsos.map((iso) => ({
      iso,
      covered: covered.has(iso),
    }))
    const months: MonthCell[] = monthYms.map((ym) => ({
      ym,
      weeksCovered: account.coveredWeeks.filter((iso) => iso.startsWith(ym)).length,
    }))
    const weeksUnchanged = weeksSince(account.lastLineChange, book.asOf)
    return {
      ...account,
      weeksUnchanged,
      band: bandFor(weeksUnchanged),
      weeks,
      months,
      coveredInWindow: weeks.filter((week) => week.covered).length,
    }
  })
}

export function weekTitle(week: WeekCell): string {
  const when = `Week of ${formatMonthDay(week.iso)}`
  return week.covered ? `${when}: huddle covered` : `${when}: not covered`
}

export function monthTitle(month: MonthCell): string {
  const { month: name, year } = formatMonthYear(month.ym)
  if (month.weeksCovered === 0) return `${name} ${year}: no weeks huddle-covered`
  if (month.weeksCovered === 1) return `${name} ${year}: 1 week huddle-covered`
  return `${name} ${year}: ${month.weeksCovered} weeks huddle-covered`
}

export type WeekGroup = {
  key: string
  label: string
  weeks: WeekCell[]
}

export function groupWeeksByMonth(weeks: WeekCell[]): WeekGroup[] {
  const groups: WeekGroup[] = []
  for (const week of weeks) {
    const key = week.iso.slice(0, 7)
    const last = groups.at(-1)
    if (!last || last.key !== key) {
      groups.push({ key, label: formatMonthYear(key).month, weeks: [week] })
    } else {
      last.weeks.push(week)
    }
  }
  return groups
}
