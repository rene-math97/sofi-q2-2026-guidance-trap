/* ═══════════════════════════════════════════════
   SOFI Q2 2026 PREVIEW — APP JS
   Scenario engine, theme toggle, animations.

   MODEL PHILOSOPHY
   ----------------
   No DCF here. SoFi is a balance-sheet lender whose
   near-term price is set by two things the market can
   observe on July 29: (1) where FY2026 guidance lands,
   and (2) what multiple the market is willing to pay on
   the forward earnings stream that guidance implies.

   So the engine is deliberately a two-variable model:

       Implied price = FY2027 adjusted EPS  ×  Forward P/E

   Both variables are exposed as sliders. Nothing is
   hidden. The scenario buttons only preset the sliders.
════════════════════════════════════════════════ */

'use strict';

// ── THEME TOGGLE ────────────────────────────────
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root   = document.documentElement;
  let theme = root.getAttribute('data-theme') || 'dark';

  function applyTheme(t) {
    theme = t;
    root.setAttribute('data-theme', t);
    if (toggle) {
      toggle.setAttribute('aria-label', `Switch to ${t === 'dark' ? 'light' : 'dark'} mode`);
      toggle.innerHTML = t === 'dark'
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  }

  applyTheme(theme);
  toggle && toggle.addEventListener('click', () => applyTheme(theme === 'dark' ? 'light' : 'dark'));
})();

// ── NAV SCROLL SHADOW ───────────────────────────
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const obs = new IntersectionObserver(
    ([e]) => nav.classList.toggle('nav--scrolled', !e.isIntersecting),
    { threshold: 0, rootMargin: '-64px 0px 0px 0px' }
  );
  const sentinel = document.getElementById('hero');
  if (sentinel) obs.observe(sentinel);
})();

/* ── ANCHOR FACTS ───────────────────────────────
   Every constant below is a sourced figure. The
   source is cited next to the same number in the
   page body; see the Sources section.
──────────────────────────────────────────────── */
const CUR_PRICE      = 16.88;   // Close 2026-07-27 (StockAnalysis)
const TBVPS_Q1       = 7.21;    // Tangible book value/share at 2026-03-31 (SEC EX-99.1, Q1 2026 release)
const FY26_CO_EPS    = 0.60;    // Company FY2026 adjusted EPS guidance (~$0.60), reaffirmed 2026-04-29
const FY26_ST_EPS    = 0.59;    // Street FY2026 adjusted EPS consensus (StockAnalysis, 2026-07-27)
const FY27_ST_EPS    = 0.81;    // Street FY2027 adjusted EPS consensus (StockAnalysis, 2026-07-27)
const CONSENSUS_PT   = 20.58;   // StockAnalysis average PT (2026-07-27). Other vendors: $20.90 / $21.20 / $22.83

// Implied current multiple on the street's FY2027 number
const CUR_FWD_PE = CUR_PRICE / FY27_ST_EPS;   // = 20.8x

const SCENARIOS = {
  raise: {
    label: 'Beat & Raise',
    desc: 'Q2 adjusted EPS at or above $0.12, revenue above $1.13B, and — the part that actually matters — management lifts the FY2026 adjusted EPS guide above ~$0.60. Technology Platform returns to sequential growth. The multiple re-rates because the H2 back-loading risk is retired.',
    fy27eps: 0.87,
    pe: 26,
    panelClass: 'scenario-bull',
  },
  maintain: {
    label: 'Beat & Maintain',
    desc: 'Q2 lands in line to modestly ahead ($0.11–$0.12), and management reaffirms ~$0.60 FY2026 adjusted EPS rather than raising it. This is what happened in January and again in April. Both times the stock fell despite the beat. The forward estimate does not move, so the multiple does the work — and recently it has worked downward.',
    fy27eps: 0.81,
    pe: 21,
    panelClass: 'scenario-base',
  },
  cut: {
    label: 'Miss or Trim',
    desc: 'Adjusted EPS at or below $0.10, or revenue under $1.10B, or any softening of the FY2026 framework. Given ~62% of the full-year EPS target sits in H2, a Q2 shortfall compounds: it removes the runway needed to hit $0.60 and forces the street down. Personal-loan net charge-offs above ~3.3% would add a credit leg to the de-rating.',
    fy27eps: 0.72,
    pe: 17,
    panelClass: 'scenario-bear',
  },
};

// ── FORMAT HELPERS ──────────────────────────────
const fmt = {
  price:  (v) => `$${v.toFixed(2)}`,
  eps:    (v) => `$${v.toFixed(2)}`,
  mult:   (v) => `${v.toFixed(1)}×`,
  updown: (v) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`,
};

// ── ANIMATED NUMBER ─────────────────────────────
function animateValue(el, from, to, formatter, duration = 350) {
  if (!el) return;
  const start = performance.now();
  function step(ts) {
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatter(from + (to - from) * ease);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = formatter(to);
  }
  requestAnimationFrame(step);
}

// ── STATE ───────────────────────────────────────
let currentScenario = 'maintain';
let state = { fy27eps: SCENARIOS.maintain.fy27eps, pe: SCENARIOS.maintain.pe };
let prevPrice = SCENARIOS.maintain.fy27eps * SCENARIOS.maintain.pe;

// ── RENDER ──────────────────────────────────────
function render(opts = {}) {
  const { fy27eps, pe } = state;
  const implied  = fy27eps * pe;
  const upside   = (implied / CUR_PRICE - 1) * 100;
  const impliedPTBV = implied / TBVPS_Q1;

  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  // Slider read-outs
  setTxt('sc-eps-readout',  fmt.eps(fy27eps));
  setTxt('sc-pe-readout',   fmt.mult(pe));

  // Live formula line
  setTxt('formula-eps',  fmt.eps(fy27eps));
  setTxt('formula-pe',   fmt.mult(pe));

  // Primary outputs
  animateValue(document.getElementById('sc-implied'), prevPrice, implied, fmt.price);
  setTxt('sc-upside', `${fmt.updown(upside)} vs. $${CUR_PRICE.toFixed(2)}`);

  const upEl = document.getElementById('sc-upside');
  if (upEl) {
    upEl.classList.toggle('positive', upside >= 0);
    upEl.classList.toggle('negative', upside < 0);
  }

  setTxt('sc-ptbv', `${impliedPTBV.toFixed(2)}×`);
  setTxt('sc-vs-consensus',
    implied >= CONSENSUS_PT
      ? `${fmt.updown((implied / CONSENSUS_PT - 1) * 100)} vs. street PT $${CONSENSUS_PT.toFixed(2)}`
      : `${fmt.updown((implied / CONSENSUS_PT - 1) * 100)} vs. street PT $${CONSENSUS_PT.toFixed(2)}`);

  // Price bar — scale $10 to $30
  const MIN = 10, MAX = 30;
  const pct = (v) => `${Math.max(0, Math.min(100, ((v - MIN) / (MAX - MIN)) * 100)).toFixed(1)}%`;

  const barFill = document.getElementById('price-bar-fill');
  const barCur  = document.getElementById('price-bar-current');
  const barImp  = document.getElementById('price-bar-target');
  const barCons = document.getElementById('price-bar-intrinsic');

  if (barFill) barFill.style.width = pct(implied);
  if (barCur)  barCur.style.left   = pct(CUR_PRICE);
  if (barImp) {
    barImp.style.left = pct(implied);
    const span = barImp.querySelector('.price-bar-tag');
    if (span) span.innerHTML = `${fmt.price(implied)}<br/>Scenario`;
  }
  if (barCons) {
    barCons.style.left = pct(CONSENSUS_PT);
    const span = barCons.querySelector('.price-bar-tag');
    if (span) span.innerHTML = `$${CONSENSUS_PT.toFixed(2)}<br/>Street PT`;
  }

  prevPrice = implied;
}

function applyScenario(key) {
  const sc = SCENARIOS[key];
  if (!sc) return;

  state = { fy27eps: sc.fy27eps, pe: sc.pe };
  currentScenario = key;

  const panel = document.getElementById('scenario-panel');
  if (panel) panel.className = `scenario-panel ${sc.panelClass}`;

  const nameEl = document.getElementById('sc-name');
  const descEl = document.getElementById('sc-desc');
  if (nameEl) nameEl.textContent = sc.label;
  if (descEl) descEl.textContent = sc.desc;

  // Sync sliders
  const epsSlider = document.getElementById('slider-eps');
  const peSlider  = document.getElementById('slider-pe');
  if (epsSlider) epsSlider.value = String(Math.round(sc.fy27eps * 100));
  if (peSlider)  peSlider.value  = String(Math.round(sc.pe * 10));

  render();
}

// ── WIRING ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const btns = document.querySelectorAll('.scenario-btn');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.scenario;
      btns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      applyScenario(key);
    });
  });

  // Sliders — moving either one marks the scenario as user-modified
  const epsSlider = document.getElementById('slider-eps');
  const peSlider  = document.getElementById('slider-pe');

  function markCustom() {
    const nameEl = document.getElementById('sc-name');
    const descEl = document.getElementById('sc-desc');
    if (nameEl) nameEl.textContent = 'Your Assumptions';
    if (descEl) descEl.textContent = 'You have moved the model off the preset. The output is your FY2027 adjusted EPS estimate multiplied by your chosen forward P/E. Nothing else is happening under the hood.';
    const panel = document.getElementById('scenario-panel');
    if (panel) panel.className = 'scenario-panel';
    document.querySelectorAll('.scenario-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
  }

  if (epsSlider) {
    epsSlider.addEventListener('input', () => {
      state.fy27eps = Number(epsSlider.value) / 100;
      markCustom();
      render();
    });
  }
  if (peSlider) {
    peSlider.addEventListener('input', () => {
      state.pe = Number(peSlider.value) / 10;
      markCustom();
      render();
    });
  }

  applyScenario('maintain');

  // ── REACTION BARS (post-earnings moves) ───────
  // Rendered from data-move attributes so the markup stays the source of truth.
  document.querySelectorAll('.reaction-track').forEach(track => {
    const move = parseFloat(track.dataset.move);
    if (Number.isNaN(move)) return;
    const MAX_ABS = 15; // bar saturates at ±15%
    const half = Math.min(Math.abs(move) / MAX_ABS, 1) * 50;
    const fill = document.createElement('div');
    fill.className = `reaction-fill ${move < 0 ? 'reaction-fill--neg' : 'reaction-fill--pos'}`;
    if (move < 0) {
      fill.style.right = '50%';
      fill.style.width = `${half}%`;
    } else {
      fill.style.left = '50%';
      fill.style.width = `${half}%`;
    }
    track.appendChild(fill);
  });

  // ── ENTRANCE ANIMATIONS ───────────────────────
  const animateItems = document.querySelectorAll(
    '.kpi-card, .exec-bullet, .risk-card, .timeline-item, .versus-card, .event-item, .fed-card'
  );

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animateItems.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.animationDelay = `${(i % 6) * 60}ms`;
      io.observe(el);
    });
  }

  // ── ACTIVE NAV LINK ───────────────────────────
  const sections = ['hero','setup','trap','segments','credit','fed','scenarios','comps','watch','risks','sources'];
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          const href = a.getAttribute('href');
          a.style.color = href === `#${id}` ? 'var(--color-text)' : '';
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });
});
