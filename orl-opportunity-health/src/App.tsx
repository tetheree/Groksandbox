import { useCallback, useMemo, useState, type ReactNode } from 'react'
import rawBook from './data/book.json'
import { AccountDrawer } from './components/AccountDrawer.tsx'
import { AccountList } from './components/AccountList.tsx'
import { DeltaStrip } from './components/DeltaStrip.tsx'
import { HealthRing } from './components/HealthRing.tsx'
import { SHOW_DELTA_STRIP } from './config.ts'
import { buildAccountViews } from './lib/coverage.ts'
import { BAND_META, formatLong, healthSentence } from './lib/health.ts'
import { cn } from './lib/cn.ts'
import type { Band, BookFile } from './types.ts'
import pkg from '../package.json'

const book = rawBook as BookFile

type SortKey = 'name' | 'stale' | 'coverage'
type BandFilter = 'all' | Band

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'name', label: 'Name' },
  { id: 'stale', label: 'Longest unchanged' },
  { id: 'coverage', label: 'Most weeks covered' },
]

function readHash(): string | null {
  const id = window.location.hash.replace(/^#/, '')
  return id || null
}

export default function App() {
  const accounts = useMemo(() => buildAccountViews(book), [])
  const byId = useMemo(() => new Map(accounts.map((account) => [account.id, account])), [accounts])
  const example = accounts.find((account) => account.staleExample) ?? null

  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('name')
  const [band, setBand] = useState<BandFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const fromHash = readHash()
    return fromHash && byId.has(fromHash) ? fromHash : null
  })

  const select = useCallback((id: string | null) => {
    setSelectedId(id)
    const next = id ? `#${id}` : window.location.pathname + window.location.search
    window.history.replaceState(null, '', next)
  }, [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = accounts.filter((account) => {
      if (band !== 'all' && account.band !== band) return false
      if (!q) return true
      return (
        account.name.toLowerCase().includes(q) ||
        account.kind.toLowerCase().includes(q)
      )
    })
    const copy = [...filtered]
    copy.sort((a, b) => {
      if (sort === 'stale' && b.weeksUnchanged !== a.weeksUnchanged) {
        return b.weeksUnchanged - a.weeksUnchanged
      }
      if (sort === 'coverage' && b.coveredInWindow !== a.coveredInWindow) {
        return b.coveredInWindow - a.coveredInWindow
      }
      return a.name.localeCompare(b.name)
    })
    return copy
  }, [accounts, query, sort, band])

  const selected = selectedId ? byId.get(selectedId) ?? null : null
  const onClose = useCallback(() => select(null), [select])

  function openExample() {
    if (!example) return
    setQuery('')
    setBand('all')
    setSort('name')
    select(example.id)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-[#f3f0e8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="font-serif text-xl tracking-tight text-stone-900">ORL</span>
            <span className="hidden h-4 w-px bg-stone-300 sm:block" />
            <div className="min-w-0">
              <h1 className="truncate text-sm font-medium leading-tight text-stone-900">
                Opportunity health
              </h1>
              <p className="truncate text-xs text-stone-500">Viewer on huddles you already write</p>
            </div>
          </div>
          <div className="shrink-0 text-right text-xs text-stone-500">
            <p>As of {formatLong(book.asOf)}</p>
            <p>
              Fixture · v{pkg.version}
            </p>
          </div>
        </div>
      </header>

      {SHOW_DELTA_STRIP ? <DeltaStrip /> : null}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="lg:flex lg:items-start lg:gap-6">
          <div className="min-w-0 flex-1">
            <p className="max-w-3xl text-sm leading-relaxed text-stone-600">
              Hashes count weeks an account was huddle-covered. The ring counts weeks since the
              huddle line text last changed. Mentioning the name again does not reset the ring.
            </p>

            <Legend />

            {example ? (
              <button
                type="button"
                onClick={openExample}
                className="mt-4 flex w-full items-center gap-4 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-left shadow-sm hover:border-rose-300"
              >
                <HealthRing
                  weeks={example.weeksUnchanged}
                  band={example.band}
                  size={52}
                  title={healthSentence(example.weeksUnchanged, example.lastLineChange)}
                />
                <span>
                  <span className="block text-sm font-medium text-rose-900">
                    Long-stale example · {example.name}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-stone-600">
                    Line text last changed {formatLong(example.lastLineChange)} —{' '}
                    {example.weeksUnchanged} weeks ago. Weekly hashes can still be filled when the
                    account is mentioned. Open it to see monthly squares.
                  </span>
                </span>
              </button>
            ) : null}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="block min-w-0 flex-1">
                <span className="sr-only">Search accounts</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search accounts"
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none ring-teal-700 focus:ring-2"
                />
              </label>
              <label className="block text-sm text-stone-600">
                <span className="sr-only">Sort</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortKey)}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 sm:w-auto"
                >
                  {SORTS.map((option) => (
                    <option key={option.id} value={option.id}>
                      Sort: {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <FilterChip active={band === 'all'} onClick={() => setBand('all')}>
                All
              </FilterChip>
              {(Object.keys(BAND_META) as Band[]).map((id) => (
                <FilterChip key={id} active={band === id} onClick={() => setBand(id)}>
                  <span className={cn('h-2 w-2 rounded-full', BAND_META[id].swatch)} />
                  {BAND_META[id].label}
                  <span className="opacity-70">{BAND_META[id].hint}</span>
                </FilterChip>
              ))}
            </div>

            <p className="mt-3 text-xs text-stone-500">
              {visible.length === accounts.length
                ? `${accounts.length} accounts`
                : `${visible.length} of ${accounts.length} accounts`}
              <span className="text-stone-400"> · click a row for monthly coverage</span>
            </p>

            <div className="mt-3">
              <AccountList
                accounts={visible}
                selectedId={selected?.id ?? null}
                onSelect={(id) => select(selected?.id === id ? null : id)}
              />
            </div>

            <footer className="mt-8 max-w-3xl text-xs leading-relaxed text-stone-500">
              Fixture sample of {accounts.length} accounts. The full book is about{' '}
              {book.book.customers} customers, {book.book.contacts} contacts, and{' '}
              {book.book.huddleLines.toLocaleString('en-US')} huddle lines. The opportunity table is{' '}
              {book.book.opportunityTable}. {example?.name ?? 'Hamden Hall'} uses the stale date from
              the notes. Every other name is a sample job, not a live export.
            </footer>
          </div>

          {selected ? <AccountDrawer account={selected} onClose={onClose} /> : null}
        </div>
      </main>
    </div>
  )
}

function Legend() {
  return (
    <div className="mt-4 grid gap-3 rounded-2xl border border-stone-200 bg-white/80 p-4 sm:grid-cols-3">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex gap-[3px]" aria-hidden="true">
          <span className="h-5 w-2.5 rounded-[3px] bg-teal-800" />
          <span className="h-5 w-2.5 rounded-[3px] bg-stone-200" />
          <span className="h-5 w-2.5 rounded-[3px] bg-teal-800" />
        </span>
        <p className="text-sm leading-snug text-stone-700">
          <span className="font-medium text-stone-900">Weekly hash.</span> One mark per week they
          actually huddle-covered that account. Not a count of names.
        </p>
      </div>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid grid-cols-2 gap-[3px]" aria-hidden="true">
          <span className="h-3.5 w-3.5 rounded-[3px] bg-teal-800" />
          <span className="h-3.5 w-3.5 rounded-[3px] bg-teal-100" />
          <span className="h-3.5 w-3.5 rounded-[3px] bg-stone-200" />
          <span className="h-3.5 w-3.5 rounded-[3px] bg-teal-500" />
        </span>
        <p className="text-sm leading-snug text-stone-700">
          <span className="font-medium text-stone-900">Monthly square.</span> Opens in the drawer.
          Each square is a month of coverage, not a wall of huddle text.
        </p>
      </div>
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 inline-block h-5 w-5 rounded-full border-[3px] border-rose-700"
          aria-hidden="true"
        />
        <p className="text-sm leading-snug text-stone-700">
          <span className="font-medium text-stone-900">Health ring.</span> Weeks since the huddle
          line text last changed. Color is the band, the number is the weeks.
        </p>
      </div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs',
        active
          ? 'border-stone-800 bg-stone-800 text-white'
          : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400',
      )}
    >
      {children}
    </button>
  )
}
