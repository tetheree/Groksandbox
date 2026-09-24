import type { Band } from '../types.ts'

const MS_PER_DAY = 24 * 60 * 60 * 1000

export const BAND_META: Record<
  Band,
  { label: string; hint: string; stroke: string; swatch: string }
> = {
  fresh: {
    label: 'Fresh',
    hint: '0–4 weeks',
    stroke: '#15803d',
    swatch: 'bg-emerald-700',
  },
  recent: {
    label: 'Recent',
    hint: '5–12 weeks',
    stroke: '#0f766e',
    swatch: 'bg-teal-700',
  },
  cooling: {
    label: 'Cooling',
    hint: '13–26 weeks',
    stroke: '#b45309',
    swatch: 'bg-amber-700',
  },
  unchanged: {
    label: 'Long unchanged',
    hint: '27+ weeks',
    stroke: '#be123c',
    swatch: 'bg-rose-700',
  },
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

export function formatISODate(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatLong(iso: string): string {
  const date = parseISODate(iso)
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
}

export function formatMonthDay(iso: string): string {
  const date = parseISODate(iso)
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`
}

export function formatMonthYear(ym: string): { month: string; year: string } {
  const [year, month] = ym.split('-').map(Number)
  return { month: MONTHS[month - 1], year: String(year) }
}

/** Whole weeks from lastChanged through asOf. A change this week is 0. */
export function weeksSince(lastChanged: string, asOf: string): number {
  const days = Math.round(
    (parseISODate(asOf).getTime() - parseISODate(lastChanged).getTime()) / MS_PER_DAY,
  )
  if (days <= 0) return 0
  return Math.floor(days / 7)
}

export function bandFor(weeks: number): Band {
  if (weeks <= 4) return 'fresh'
  if (weeks <= 12) return 'recent'
  if (weeks <= 26) return 'cooling'
  return 'unchanged'
}

export function healthSentence(weeks: number, lastChanged: string): string {
  const when = formatLong(lastChanged)
  if (weeks === 0) return `The huddle line changed this week (${when}).`
  if (weeks === 1) return `The huddle line last changed 1 week ago, on ${when}.`
  return `The huddle line last changed ${weeks} weeks ago, on ${when}.`
}

/** Monday on or before iso, as YYYY-MM-DD (UTC). */
export function weekStartMonday(iso: string): string {
  const date = parseISODate(iso)
  const day = date.getUTCDay()
  const delta = day === 0 ? -6 : 1 - day
  date.setUTCDate(date.getUTCDate() + delta)
  return formatISODate(date)
}

export function shiftDays(iso: string, days: number): string {
  const date = parseISODate(iso)
  date.setUTCDate(date.getUTCDate() + days)
  return formatISODate(date)
}

/** Oldest → newest Mondays, ending on the week that contains asOf. */
export function mondaysEnding(asOf: string, count: number): string[] {
  const end = weekStartMonday(asOf)
  const out: string[] = []
  for (let i = count - 1; i >= 0; i -= 1) out.push(shiftDays(end, -7 * i))
  return out
}

/** Oldest → newest YYYY-MM, ending on the month that contains asOf. */
export function monthsEnding(asOf: string, count: number): string[] {
  const date = parseISODate(asOf)
  let year = date.getUTCFullYear()
  let month = date.getUTCMonth() + 1
  const newestFirst: string[] = []
  for (let i = 0; i < count; i += 1) {
    newestFirst.push(`${year}-${String(month).padStart(2, '0')}`)
    month -= 1
    if (month === 0) {
      month = 12
      year -= 1
    }
  }
  return newestFirst.reverse()
}
