# The Guidance Trap — SoFi Technologies (SOFI) Q2 2026 Earnings Preview

An interactive earnings preview published **July 28, 2026**, one day ahead of SoFi's Q2 2026 report on **Wednesday, July 29, before market open**.

**Live site:** https://rene-math97.github.io/sofi-q2-2026-guidance-trap/

**No rating. No price target.** This is a map of what decides the print, not a pitch.

---

## The setup in one line

SoFi has beaten or matched consensus adjusted EPS in **six consecutive quarters with zero misses**, and the stock fell **12.3%** after the last print and **9.4%** after the one before it. The market has stopped paying for the quarter and started pricing the guide, which has now been reaffirmed rather than raised twice in a row.

## Why this quarter is unusual

SoFi reports at 7am ET. The **FOMC decision lands at 2:00pm the same day**, with Chair Kevin Warsh taking questions at 2:30. Markets put roughly a one-in-three chance on a hike. Two event risks, one session, on a stock where options imply an **8.7% to 11.5%** move.

The underappreciated detail: on the Q1 call, CFO Chris Lapointe stated the FY2026 outlook assumes *"an interest rate outlook consistent with the Fed funds futures and no rate cuts in 2026."* The guide was built for a hawkish Fed. A hawkish Warsh does not break the operating plan — it compresses the multiple.

## The central arithmetic

```
FY2026 adj. EPS guide − (Q1 actual + Q2 guide midpoint) = H2 required
$0.60 − ($0.12 + $0.105) = $0.375
```

That is **62% of the full-year target sitting in the back half**, while Technology Platform revenue is contracting 27% year over year. A beat without a raise leaves that back-loaded year intact — which is precisely the setup that produced a 12% drawdown in April.

## What's in the site

| Section | What it does |
|---|---|
| **The Setup** | Four sourced facts going in |
| **The Guidance Trap** | Six-quarter beat/miss table with verified stock reactions |
| **Segment Scorecard** | Lending and Financial Services accelerating vs. Technology Platform stalling |
| **Credit vs. Allegations** | Reported credit metrics beside the Muddy Waters claims, neither presented as adjudicated |
| **The Fed Overlay** | The 2pm event risk and the four channels that actually reach SoFi |
| **Scenario Engine** | Two-variable model with live sliders — no hidden DCF |
| **Valuation** | Peer table spanning the fintech and bank multiple regimes |
| **What to Watch** | Eleven line items with bull and bear thresholds |

## The model

Deliberately **not** a DCF. SoFi is a balance-sheet lender, and a five-year FCF model on a bank-like entity conflates funding flows with operating cash generation. Over a one-day event horizon the price is set by two things:

```
Implied price = FY2027 adjusted EPS × Forward P/E
```

Both variables are exposed as sliders. Presets: Beat & Raise ($0.87, 26×), Beat & Maintain ($0.81 street consensus, 21×), Miss or Trim ($0.72, 17×). Only the $0.81 and the current price are sourced figures; the rest are labelled assumptions.

## Sourcing standard

Every number carries a source. Primary SEC filings and the company transcript first, market data and consensus second, commentary last and marked as such. Figures that are my own arithmetic are tagged **computed** inline. Where sources conflict, **both values are shown and the conflict is disclosed** rather than silently resolved.

### Corrections made during research, resolved against official exchange data

Price and event figures on this page are computed from **Nasdaq official historical closes** and **SEC filings**, not from media summaries — which turned out to matter, because the media figures don't reconcile.

1. **SOFI is not "down 50% from its 2026 highs."** Wrong twice over. The **2026 high was $29.86 intraday on January 5**, making the drawdown **43.5%**. The $32.73 peak behind the ~48% figure was set **November 12, 2025**.
2. **Year to date is −35.5%**, computed from official closes of $26.18 (Dec 31, 2025) and $16.88 (Jul 27, 2026). Published figures range from −32% to −37.13% and none reconcile.
3. **The Q1 earnings reaction was −15.4%**, from $18.36 to $15.525 — larger than every published figure (−12%, −12.31%, −13%, −14%).
4. **The short report barely moved the stock.** On March 17, SOFI closed down **1.5%** ($17.63 → $17.37). By then it was *already* down **33.65% YTD** — which computes exactly from official closes and matches the figure Muddy Waters itself cited. **The earnings reaction was roughly 10× the short-report reaction.**
5. **LendingClub is not in the peer table.** It rebranded to **Happen, Inc. (HAPN)** in June 2026, so any comp set still showing "LC" is stale.

### Litigation status: a verified negative, not an unchecked gap

The **Q1 2026 Form 10-Q, filed May 7** — seven weeks after the short report — contains no securities class action, no derivative action, no SEC investigation, no subpoena, no consent order and no restatement. Contingencies language is boilerplate. The filing reflects facts through May 7.

### Known gaps, stated rather than papered over

The whisper number could not be verified. Post-earnings reactions before Q4 2025 are left blank rather than estimated. **SoFi is not an S&P 500 constituent**, so any anticipated-inclusion argument has no basis. Analyst consensus differs materially by vendor — average targets from **$20.58 to $22.83**, high targets **$30 to $35**, across 18 to 24 analysts — though every vendor agrees the rating is **Hold**.

---

## Stack

Static HTML, CSS and vanilla JavaScript. No build step, no dependencies, no external data calls. Dark and light themes.

```
├── index.html          # redirect to web-app/
├── web-app/
│   ├── index.html      # the preview
│   ├── style.css       # design system + earnings-preview modules
│   └── app.js          # scenario engine, sliders, animations
└── README.md
```

## Disclaimer

Independent research written for a public portfolio. **Not investment advice**, not a recommendation to buy or sell any security, and it carries no rating or price target. Forward-looking statements are estimates and will be wrong in some measure. Do your own work.
