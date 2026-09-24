# ORL opportunity health (v0)

A clickable fixture viewer for ORL huddles. Brian can polish the UI in Cursor, then demo it to Alrun and Nora. It is not a CRM. Outlook stays. There is no backend, no login, and no live data from orl.tetheree.com.

Dev scaffold version: **1.1.0** (see the header, and `package.json`).

## Run

From this folder:

```bash
cd orl-opportunity-health
npm install
npm run dev
```

Vite serves the app at http://localhost:5173.

Other commands:

```bash
npm test          # week math + Hamden Hall fixture checks
npm run build     # typecheck and production bundle
npm run fixtures  # regenerate src/data/book.json from scripts/generate-fixtures.mjs
```

## How the three views work

The list is the default screen. Click any account to open the drawer.

**1. Weekly coverage hashes (the list).**  
Each small mark is one week that account was actually huddle-covered. A filled mark means the name showed up in a huddle that week. An empty mark means it did not. The marks are not a count of people, contacts, or mentions inside the week. Newest week is on the right. The fraction (for example `8/16`) is how many of the last 16 weeks were covered.

**2. Monthly squares (the drawer).**  
Click a row. The side panel shows one square per month, for the last 12 months. The number inside a square is how many weeks in that month were huddle-covered. Darker means more weeks. This is the coverage picture without a wall of huddle text.

**3. Health ring.**  
The ring is weeks since that account’s huddle *line text* last changed. It is not how often the name appears. Saying the same sentence again does not move the ring. The number in the ring is the week count. The color is a band:

- Fresh (green): 0–4 weeks
- Recent (teal): 5–12 weeks
- Cooling (amber): 13–26 weeks
- Long unchanged (rose): 27 weeks or more

Hover a ring or a mark for the plain-language meaning. The legend at the top of the page says the same thing.

## Hamden Hall

Hamden Hall is the long-stale example. The huddle line last changed on **Jul 19, 2024**. As of the fixture date (Sep 24, 2026) that is **113 weeks**. The account still has weekly hashes, because it keeps being mentioned. Those mentions do not reset the ring. Use the rose callout at the top of the list, or search “Hamden”.

## What the fixture is

Sixteen sample accounts, with dense, sparse, new, and long-quiet coverage. The “as of” date is fixed at Sep 24, 2026 so the week counts do not drift.

Scale, for context only: the real book is about 103 customers, 92 contacts, and 12,504 huddle lines. The opportunity table is empty on purpose. This viewer does not show dollars.

Hamden Hall’s stale date comes from the Sep 2 notes. Every other name is a sample job, not a live export.

Edit patterns in `scripts/generate-fixtures.mjs`, then run `npm run fixtures`. The app reads `src/data/book.json`.

## Where to polish

- Theme and type: `src/index.css`
- List, drawer, ring, hashes, month squares: `src/components/`
- Copy and layout of the page: `src/App.tsx`
- Sample jobs: `scripts/generate-fixtures.mjs`

## Parked

A this-week delta strip (Todd’s 24h add-on as two 12h units) is behind `SHOW_DELTA_STRIP` in `src/config.ts`. It is off. Flip it to show a placeholder only.

Out of scope for this scaffold: auth, a deploy to orl.tetheree.com, CRM fields, dollar projections, Constant Contact, and ingesting real huddles.

## Screenshots

`artifacts/list-weekly-hashes.png` — the list.  
`artifacts/drawer-monthly-squares.png` — Hamden Hall’s drawer (monthly squares and the health ring).
