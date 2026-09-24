import { useEffect, useRef } from 'react'
import { HealthRing } from './HealthRing.tsx'
import { MonthSquares } from './MonthSquares.tsx'
import { WeekHashes } from './WeekHashes.tsx'
import { BAND_META, formatLong, healthSentence } from '../lib/health.ts'
import type { AccountView } from '../types.ts'

type Props = {
  account: AccountView
  onClose: () => void
}

export function AccountDrawer({ account, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const sentence = healthSentence(account.weeksUnchanged, account.lastLineChange)
  const band = BAND_META[account.band]

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [account.id, onClose])

  return (
    <div className="lg:sticky lg:top-20 lg:w-[420px] lg:shrink-0 lg:self-start">
      <button
        type="button"
        aria-label="Close account details"
        className="fixed inset-0 z-30 bg-stone-900/30 lg:hidden"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-drawer-title"
        className="fixed inset-y-0 right-0 z-40 flex h-full w-full max-w-[440px] flex-col bg-white shadow-2xl lg:static lg:h-[calc(100vh-6.25rem)] lg:max-w-none lg:rounded-2xl lg:border lg:border-stone-200 lg:shadow-sm"
      >
        <header className="flex items-start justify-between gap-3 border-b border-stone-200 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-stone-500">
              {account.kind}
            </p>
            <h2 id="account-drawer-title" className="truncate font-serif text-2xl text-stone-900">
              {account.name}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-md border border-stone-200 px-2.5 py-1 text-sm text-stone-600 hover:bg-stone-50"
          >
            Close
          </button>
        </header>

        <div className="flex-1 space-y-8 overflow-y-auto px-5 py-5">
          <section>
            <h3 className="text-[11px] font-medium uppercase tracking-wide text-stone-500">
              Line health
            </h3>
            <div className="mt-3 flex items-center gap-4">
              <HealthRing weeks={account.weeksUnchanged} band={account.band} size={96} title={sentence} />
              <div>
                <p className="text-sm font-medium text-stone-900">{band.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-stone-600">{sentence}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              The ring counts weeks since this account’s huddle line last{' '}
              <em>changed</em>. It does not count how often the name was mentioned.
            </p>
            {account.staleExample ? (
              <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm leading-relaxed text-rose-950">
                Hamden Hall can still show coverage hashes for weeks it was mentioned. Those hashes
                do not move the ring, because the sentence has not changed since{' '}
                {formatLong(account.lastLineChange)}.
              </p>
            ) : null}
          </section>

          <section>
            <h3 className="text-[11px] font-medium uppercase tracking-wide text-stone-500">
              Current huddle line
            </h3>
            <blockquote className="mt-3 border-l-2 border-stone-300 pl-3 text-sm leading-relaxed text-stone-800">
              {account.lineText}
            </blockquote>
            <p className="mt-2 text-xs text-stone-500">
              Last changed {formatLong(account.lastLineChange)}
            </p>
          </section>

          <section>
            <h3 className="text-[11px] font-medium uppercase tracking-wide text-stone-500">
              Monthly coverage
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Each square is a month. The number is how many weeks in that month were huddle-covered.
            </p>
            <div className="mt-3">
              <MonthSquares months={account.months} />
            </div>
          </section>

          <section>
            <h3 className="text-[11px] font-medium uppercase tracking-wide text-stone-500">
              Weekly coverage
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Same marks as the list. A filled hash is a week the account was huddle-covered. Newest
              week is on the right.
            </p>
            <div className="mt-3">
              <WeekHashes
                weeks={account.weeks}
                coveredInWindow={account.coveredInWindow}
                size="drawer"
              />
            </div>
          </section>
        </div>

        <footer className="border-t border-stone-200 px-5 py-3 text-xs text-stone-400">
          Esc to close
        </footer>
      </aside>
    </div>
  )
}
