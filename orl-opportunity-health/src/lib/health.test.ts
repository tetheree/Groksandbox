import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { buildAccountViews } from './coverage.ts'
import { bandFor, weekStartMonday, weeksSince } from './health.ts'
import type { BookFile } from '../types.ts'

const book = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../data/book.json'), 'utf8'),
) as BookFile

test('weeks since a line change are whole weeks, and this week is zero', () => {
  assert.equal(weeksSince('2024-07-19', '2026-09-24'), 113)
  assert.equal(weeksSince('2026-09-24', '2026-09-24'), 0)
  assert.equal(weeksSince('2026-09-18', '2026-09-24'), 0)
  assert.equal(weeksSince('2026-09-17', '2026-09-24'), 1)
  assert.equal(weeksSince('2026-01-16', '2026-09-24'), 35)
})

test('week start is the Monday of that week', () => {
  assert.equal(weekStartMonday('2026-09-24'), '2026-09-21')
  assert.equal(weekStartMonday('2026-09-21'), '2026-09-21')
  assert.equal(weekStartMonday('2026-09-20'), '2026-09-14')
})

test('health bands follow weeks since the line changed', () => {
  assert.equal(bandFor(0), 'fresh')
  assert.equal(bandFor(4), 'fresh')
  assert.equal(bandFor(5), 'recent')
  assert.equal(bandFor(12), 'recent')
  assert.equal(bandFor(13), 'cooling')
  assert.equal(bandFor(26), 'cooling')
  assert.equal(bandFor(27), 'unchanged')
  assert.equal(bandFor(113), 'unchanged')
})

test('Hamden Hall is the long-stale example and coverage is not the ring', () => {
  const views = buildAccountViews(book)
  assert.ok(views.length >= 12 && views.length <= 20)
  const hamden = views.find((account) => account.id === 'hamden-hall')
  assert.ok(hamden)
  assert.equal(hamden.name, 'Hamden Hall')
  assert.equal(hamden.staleExample, true)
  assert.equal(hamden.lastLineChange, '2024-07-19')
  assert.equal(hamden.weeksUnchanged, 113)
  assert.equal(hamden.band, 'unchanged')
  assert.equal(hamden.weeks.length, 16)
  assert.ok(hamden.coveredInWindow > 0, 'mentions in recent weeks must not reset the ring')
  assert.equal(hamden.months.length, 12)

  const harbor = views.find((account) => account.id === 'harbor-arts-center')
  assert.ok(harbor)
  assert.equal(harbor.coveredInWindow, 16)
  assert.equal(harbor.weeksUnchanged, 2)
  assert.notEqual(harbor.band, hamden.band)

  for (const account of views) {
    for (const iso of account.coveredWeeks) {
      assert.equal(weekStartMonday(iso), iso, `${account.name} ${iso} is not a Monday`)
    }
  }
})
