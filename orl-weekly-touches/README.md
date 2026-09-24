# ORL weekly touches

Interactive v0 of the weekly touch queue for O.R&L Construction. Opp health tells you who’s cooling. This list is who we touch.

Sample week: **Aug 25, 2026**. Fixture data only (the 10 accounts from the Sep 10 mock). Version **1.1.0**.

## Run

```bash
cd orl-weekly-touches
npm install
npm run dev
```

Vite prints a local URL (usually http://localhost:5173).

## Lane rules

We have far more huddle accounts than anyone can work in a week, so each week is a short capped list. Everything else waits.

- **Cap:** 8–10 touches per week. This sample is 10: 6 Keep warm and 4 Warm cold.
- **Hot on huddle:** The line changed within about two weeks. Those accounts stay on the huddle. They do not get a weekly warm task.
- **Keep warm:** Live or slipping accounts that need a light touch this week — a call, a note, or a check-in — so the relationship keeps moving.
- **Warm cold:** Cold or dormant accounts with a 2026 signal, preferably a named contact. The touch re-opens the conversation (thank-you, RFP status, ROM follow-up, status).
- **Deferred:** Everyone else this week. It is a queue, not a to-do. Zero-contact cold waits until the Constant Contact list lands. Next Friday’s review pulls from deferred.

**Cap 8–10 / week · Review Friday · Next week pulls from deferred.**

No dollar columns. No CRM stages. Just who, why this week, what touch, and who to talk to.

## Out of scope

Live huddle data, CRM, dollar amounts, auth, Constant Contact, and deploy.
