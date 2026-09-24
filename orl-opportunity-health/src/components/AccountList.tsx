import { HealthRing } from './HealthRing.tsx'
import { WeekHashes } from './WeekHashes.tsx'
import { healthSentence } from '../lib/health.ts'
import { cn } from '../lib/cn.ts'
import type { AccountView } from '../types.ts'

type Props = {
  accounts: AccountView[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function AccountList({ accounts, selectedId, onSelect }: Props) {
  if (accounts.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-stone-300 bg-white/60 px-4 py-12 text-center text-sm text-stone-500">
        No accounts match this filter.
      </p>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="hidden grid-cols-[11rem_minmax(0,1fr)_4.5rem] gap-4 border-b border-stone-200 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-stone-500 md:grid">
        <span>Account</span>
        <span>Weeks huddle-covered</span>
        <span className="text-right">Unchanged</span>
      </div>
      <ul>
        {accounts.map((account) => {
          const selected = account.id === selectedId
          const sentence = healthSentence(account.weeksUnchanged, account.lastLineChange)
          return (
            <li key={account.id} className="border-b border-stone-100 last:border-b-0">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(account.id)}
                className={cn(
                  'grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 px-4 py-3 text-left transition-colors hover:bg-stone-50 md:grid-cols-[11rem_minmax(0,1fr)_4.5rem]',
                  selected && 'bg-teal-50/70 hover:bg-teal-50',
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-stone-900">{account.name}</span>
                  <span className="mt-0.5 block text-xs text-stone-500">{account.kind}</span>
                </span>
                <span className="col-span-2 min-w-0 md:col-span-1">
                  <WeekHashes weeks={account.weeks} coveredInWindow={account.coveredInWindow} />
                </span>
                <span className="col-start-2 row-start-1 justify-self-end md:col-start-auto md:row-start-auto">
                  <HealthRing
                    weeks={account.weeksUnchanged}
                    band={account.band}
                    title={sentence}
                  />
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
