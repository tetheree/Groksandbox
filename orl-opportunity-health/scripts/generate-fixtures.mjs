/**
 * Builds src/data/book.json.
 * Patterns are intentional: coverage (was the account in a huddle that week)
 * is independent of lastLineChange (when the line text last changed).
 *
 * Run: node scripts/generate-fixtures.mjs
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function addDays(iso, days) {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + days)
  return dt.toISOString().slice(0, 10)
}

const mondays = []
for (let iso = '2025-10-06'; iso <= '2026-09-21'; iso = addDays(iso, 7)) {
  mondays.push(iso)
}

if (mondays.length !== 51) {
  throw new Error(`expected 51 Mondays, got ${mondays.length}`)
}

function setOf(indices) {
  return new Set(indices)
}

function range(start, end) {
  const out = []
  for (let i = start; i <= end; i += 1) out.push(i)
  return out
}

function every(step, offset = 0) {
  const out = []
  for (let i = offset; i < mondays.length; i += step) out.push(i)
  return out
}

function except(indices, blocked) {
  const block = new Set(blocked)
  return indices.filter((i) => !block.has(i))
}

function weeks(indices) {
  return [...new Set(indices)].sort((a, b) => a - b).map((i) => mondays[i])
}

function firstMondayOfEachMonth() {
  const seen = new Set()
  const out = []
  mondays.forEach((iso, i) => {
    const ym = iso.slice(0, 7)
    if (!seen.has(ym)) {
      seen.add(ym)
      out.push(i)
    }
  })
  return out
}

const accounts = [
  {
    id: 'hamden-hall',
    name: 'Hamden Hall',
    kind: 'School',
    staleExample: true,
    lastLineChange: '2024-07-19',
    lineText:
      'Gym wing still sits in a later phase. Same sentence since the July 19, 2024 huddle — no new owner language.',
    coveredWeeks: weeks(every(2, 0)),
  },
  {
    id: 'north-lab-wing',
    name: 'North Lab Wing',
    kind: 'Lab',
    lastLineChange: '2026-09-18',
    lineText:
      'Lab casework moved to the north wall. Owner confirmed the change in this week’s huddle.',
    coveredWeeks: weeks(except(range(0, 50), every(9, 0))),
  },
  {
    id: 'harbor-arts-center',
    name: 'Harbor Arts Center',
    kind: 'Arts',
    lastLineChange: '2026-09-04',
    lineText:
      'Gallery lighting package is in review. Wording updated after the September site walk.',
    coveredWeeks: weeks([...every(4, 1), ...range(30, 50)]),
  },
  {
    id: 'ridge-library',
    name: 'Ridge Library',
    kind: 'Library',
    lastLineChange: '2026-09-10',
    lineText:
      'Reading room shelving is back on the weekly list after the summer pause.',
    coveredWeeks: weeks(except(range(0, 50), range(30, 42))),
  },
  {
    id: 'westbrook-gym',
    name: 'Westbrook Gym',
    kind: 'Athletics',
    lastLineChange: '2026-07-02',
    lineText:
      'Flooring spec is unchanged since early July. Still the same substitute product.',
    coveredWeeks: weeks(every(2, 1)),
  },
  {
    id: 'mill-river-campus',
    name: 'Mill River Campus',
    kind: 'Campus',
    lastLineChange: '2026-08-21',
    lineText:
      'Phasing note updated in late August: the east quad waits until the bridge work clears.',
    coveredWeeks: weeks([...every(3, 20).filter((i) => i <= 36), ...range(40, 50)]),
  },
  {
    id: 'old-town-hall',
    name: 'Old Town Hall',
    kind: 'Civic',
    lastLineChange: '2026-01-16',
    lineText:
      'Council package has not been rewritten since January. It is still the same renovation sentence.',
    coveredWeeks: weeks([...range(0, 16), 22]),
  },
  {
    id: 'cedar-science',
    name: 'Cedar Science',
    kind: 'Science',
    lastLineChange: '2026-05-08',
    lineText:
      'Greenhouse bid language stopped moving in May. Nothing new has been written since.',
    coveredWeeks: weeks(range(0, 30)),
  },
  {
    id: 'pond-field-house',
    name: 'Pond Field House',
    kind: 'Athletics',
    lastLineChange: '2026-08-14',
    lineText:
      'Track surfacing note was rewritten mid-August and has been repeated as-is since.',
    coveredWeeks: weeks([...every(6, 2), ...range(38, 46)]),
  },
  {
    id: 'east-gate-dorm',
    name: 'East Gate Dorm',
    kind: 'Housing',
    lastLineChange: '2026-09-22',
    lineText:
      'New to the weekly huddle this month. Sep 22 line: dorm roof access is the open item.',
    coveredWeeks: weeks(range(46, 50)),
  },
  {
    id: 'quarry-walk',
    name: 'Quarry Walk',
    kind: 'Landscape',
    lastLineChange: '2026-03-06',
    lineText:
      'Retaining wall sentence has been copied forward since March. One mention a month, same words.',
    coveredWeeks: weeks(firstMondayOfEachMonth()),
  },
  {
    id: 'maple-clinic',
    name: 'Maple Clinic',
    kind: 'Clinic',
    lastLineChange: '2026-06-12',
    lineText:
      'Exam-room count is still the June figure. The line has not been edited since.',
    coveredWeeks: weeks(every(5, 2)),
  },
  {
    id: 'south-chapel',
    name: 'South Chapel',
    kind: 'Chapel',
    lastLineChange: '2026-04-17',
    lineText:
      'Stained-glass scope was rewritten in April. The weekly note still uses that sentence.',
    coveredWeeks: weeks([...range(0, 8), ...range(25, 50)]),
  },
  {
    id: 'brook-athletics',
    name: 'Brook Athletics',
    kind: 'Athletics',
    lastLineChange: '2026-09-11',
    lineText:
      'Bleacher layout changed last week. The huddle line now names the south sideline.',
    coveredWeeks: weeks(except(range(0, 50), every(3, 0))),
  },
  {
    id: 'pine-auditorium',
    name: 'Pine Auditorium',
    kind: 'Assembly',
    lastLineChange: '2026-08-28',
    lineText:
      'Seating bowl note was edited at the end of August. Later weeks repeat it.',
    coveredWeeks: weeks([...range(2, 6), ...range(14, 18), ...range(28, 31), ...range(44, 48)]),
  },
  {
    id: 'union-boathouse',
    name: 'Union Boathouse',
    kind: 'Waterfront',
    lastLineChange: '2026-09-17',
    lineText:
      'Just opened on the list. Sep 17 line: dock piles are waiting on the harbor permit.',
    coveredWeeks: weeks(range(47, 50)),
  },
]

const book = {
  asOf: '2026-09-24',
  windowWeeks: 16,
  windowMonths: 12,
  book: {
    customers: 103,
    contacts: 92,
    huddleLines: 12504,
    opportunityTable: 'empty on purpose',
  },
  accounts,
}

const out = join(root, 'src/data/book.json')
writeFileSync(out, `${JSON.stringify(book, null, 2)}\n`)

function weeksSince(last, asOf) {
  const a = Date.parse(`${asOf}T00:00:00Z`)
  const b = Date.parse(`${last}T00:00:00Z`)
  return Math.floor((a - b) / (7 * 24 * 60 * 60 * 1000))
}

const recent = new Set(mondays.slice(-16))
console.log(`wrote ${accounts.length} accounts, ${mondays.length} Mondays ${mondays[0]} → ${mondays.at(-1)}`)
for (const account of accounts) {
  const recentMarks = mondays
    .slice(-16)
    .map((iso) => (account.coveredWeeks.includes(iso) ? '█' : '·'))
    .join('')
  const inWindow = account.coveredWeeks.filter((iso) => recent.has(iso)).length
  console.log(
    `${account.name.padEnd(22)} ${String(weeksSince(account.lastLineChange, book.asOf)).padStart(3)}w  ${inWindow}/16  ${recentMarks}`,
  )
}
