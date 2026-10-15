(function () {
  "use strict";

  /* =========================================================
     Données
     ========================================================= */
  const DATA = window.DATA;
  const PARTS = DATA.parts, NOTIONS = DATA.notions, READING = DATA.reading, EXS = DATA.exercises;
  const NIDS = Object.keys(NOTIONS);
  const EX = {};
  EXS.forEach(e => {
    if (e.part == null && e.notion) e.part = NOTIONS[e.notion].part;
    e.nlist = collectNotions(e);
    EX[e.id] = e;
  });

  function collectNotions(e) {
    const s = new Set();
    if (e.notion) s.add(e.notion);
    (e.ns || []).forEach(n => s.add(n));
    (e.pairs || []).forEach(p => p.n && s.add(p.n));
    (e.items || []).forEach(i => i && i.n && s.add(i.n));
    (e.rows || []).forEach(r => r.n && s.add(r.n));
    (e.nodes || []).forEach(x => x.n && s.add(x.n));
    return [...s];
  }

  const TYPES = {
    qcm: { label: "QCM", help: "Choisis la bonne réponse. Avec le rappel actif, formule-la d'abord dans ta tête : c'est cet effort de rappel qui fixe la mémoire.", keys: "A à D (ou 1 à 4) pour choisir · Entrée pour valider" },
    vf: { label: "Vrai ou faux", help: "Tranche vite, puis lis la justification : c'est elle qui compte.", keys: "V ou F pour répondre · Entrée pour continuer" },
    fill: { label: "Texte à trous", help: "Tape les mots manquants. Accents et majuscules facultatifs ; une petite faute de frappe est tolérée.", keys: "Entrée : champ suivant, puis valider" },
    part: { label: "Quelle partie ?", help: "Situe la phrase dans le livre. Savoir d'où vient une citation, c'est pouvoir s'en servir au contrôle.", keys: "1 à 6 pour répondre" },
    order: { label: "Remettre dans l'ordre", help: "Fais glisser les étiquettes, ou utilise les flèches, pour rétablir l'ordre.", keys: "Entrée pour valider" },
    match: { label: "Associer", help: "Clique un élément à gauche, puis son correspondant à droite. Clique un élément déjà relié pour défaire le lien.", keys: "Entrée pour valider" },
    sort: { label: "Classer", help: "Clique une étiquette, puis la colonne où elle va. Tu peux aussi la faire glisser.", keys: "Entrée pour valider" },
    schema: { label: "Schéma à compléter", help: "Place les étiquettes dans les cases vides. Attention : certaines étiquettes sont des pièges.", keys: "Clique une étiquette, puis une case · Entrée pour valider" },
    grid: { label: "Tableau à compléter", help: "Clique chaque case pour alterner entre ✓ et ✗.", keys: "Entrée pour valider" },
    flash: { label: "Carte mémoire", help: "Réponds à voix haute avant de retourner la carte, puis note-toi honnêtement.", keys: "Espace pour retourner · 1, 2 ou 3 pour noter" },
    build: { label: "Construire la réponse", help: "Au contrôle, chaque question attend des arguments précis. Sélectionne ceux qui ont leur place dans ta réponse, ni plus ni moins.", keys: "Entrée pour valider" }
  };
  const QUICK = ["qcm", "vf", "part", "fill"];
  const VISUAL = ["order", "match", "sort", "schema", "grid"];
  const STATUS_LABEL = { new: "Non testé", weak: "À revoir", mid: "Fragile", good: "Acquis" };
  const MODE_LABEL = { express: "Express", ess: "Essentiel", full: "Intégrale" };

  const ICON = {
    close: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>',
    check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>',
    cross: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7"/></svg>',
    half: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 8h8"/></svg>',
    ext: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3H3.5v9.5H13V9M9.5 3H13v3.5M13 3L7.5 8.5"/></svg>',
    chev: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5L10.5 8 6 12.5"/></svg>',
    back: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3.5L5.5 8l4.5 4.5"/></svg>',
    up: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10l4-4 4 4"/></svg>',
    down: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>',
    grip: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="5.5" cy="4" r="1.3"/><circle cx="10.5" cy="4" r="1.3"/><circle cx="5.5" cy="8" r="1.3"/><circle cx="10.5" cy="8" r="1.3"/><circle cx="5.5" cy="12" r="1.3"/><circle cx="10.5" cy="12" r="1.3"/></svg>',
    grid: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="5.5" height="5.5" rx="1.5"/><rect x="11.5" y="3" width="5.5" height="5.5" rx="1.5"/><rect x="3" y="11.5" width="5.5" height="5.5" rx="1.5"/><rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.5"/></svg>',
    book: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M10 5.5C8.5 4.2 6.2 3.8 3.5 4v11c2.7-.2 5 .2 6.5 1.5 1.5-1.3 3.8-1.7 6.5-1.5V4c-2.7-.2-5 .2-6.5 1.5zM10 5.5v11"/></svg>'
  };
  const PICTO = {
    filter: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"><path d="M10 18h44L37 37v14l-10 5V37z"/><circle cx="22" cy="9" r="1.8" fill="currentColor"/><circle cx="32" cy="7" r="1.8" fill="currentColor"/><circle cx="42" cy="10" r="1.8" fill="currentColor"/></svg>',
    split: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"><rect x="9" y="9" width="20" height="20" rx="3"/><rect x="35" y="9" width="20" height="20" rx="3"/><rect x="9" y="35" width="20" height="20" rx="3"/><rect x="35" y="35" width="20" height="20" rx="3"/></svg>',
    stairs: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"><path d="M8 56h12V44h12V32h12V20h12"/><path d="M44 8h10v10M54 8L42 20"/></svg>',
    list: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"><path d="M27 16h28M27 32h28M27 48h28"/><path d="M8 16l4 4 7-8M8 32l4 4 7-8M8 48l4 4 7-8"/></svg>'
  };

  /* =========================================================
     Utilitaires
     ========================================================= */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "’")
      .replace(/ ([?!:;»])/g, " $1").replace(/« /g, "« ");
  }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function norm(s) { return String(s).toLowerCase().replace(/œ/g, "oe").replace(/æ/g, "ae").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim(); }
  function lev(a, b) {
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  const sum = a => a.reduce((s, x) => s + x, 0);
  const avg = a => a.length ? sum(a) / a.length : 0;
  const clip = (s, n) => { s = String(s == null ? "" : s); n = n || 400; return s.length > n ? s.slice(0, n - 1) + "…" : s; };
  function fmtDur(m) { if (m < 60) return m + " min"; const h = Math.floor(m / 60), r = m % 60; return h + " h" + (r ? " " + String(r).padStart(2, "0") : ""); }
  function clock(ts) { return new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); }
  function fmtClock(ms) { const neg = ms < 0; let s = Math.round(Math.abs(ms) / 1000); const m = Math.floor(s / 60); s %= 60; return (neg ? "+" : "") + m + ":" + String(s).padStart(2, "0"); }
  function nextFive() { const d = new Date(); d.setSeconds(0, 0); d.setMinutes(Math.ceil(d.getMinutes() / 5) * 5); return d.getTime(); }
  const partLabel = p => p ? PARTS[p].name : "Contexte";
  const yt = q => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2600); }

  /* =========================================================
     Stockage
     ========================================================= */
  const KEY = "methode-descartes-v1";
  function defaults() { return { attempts: [], plan: { duration: 60, read: [1, 2, 3] }, run: null, settings: { recall: true, len: 12 }, checks: {} }; }
  function load() {
    try {
      const o = JSON.parse(localStorage.getItem(KEY));
      if (o && typeof o === "object") {
        const d = defaults();
        return Object.assign(d, o, { plan: Object.assign(d.plan, o.plan), settings: Object.assign(d.settings, o.settings), checks: o.checks || {} });
      }
    } catch (e) { /* stockage indisponible */ }
    return defaults();
  }
  let S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }

  /* =========================================================
     Maîtrise
     ========================================================= */
  let MC = null;
  function masteryMap() {
    if (MC) return MC;
    const by = {};
    S.attempts.forEach(a => (by[a.n] = by[a.n] || []).push(a.r));
    MC = {};
    NIDS.forEach(id => {
      const arr = by[id];
      if (!arr || !arr.length) { MC[id] = null; return; }
      let w = 1, num = 0, den = 0;
      for (let i = arr.length - 1; i >= 0; i--) { num += w * arr[i]; den += w; w *= 0.75; }
      MC[id] = Math.min(1, (num / (den + 0.5)) * 1.125);
    });
    return MC;
  }
  const mastery = id => masteryMap()[id];
  function status(m) { if (m == null) return "new"; if (m < 0.5) return "weak"; if (m < 0.8) return "mid"; return "good"; }
  const pct = m => Math.round((m || 0) * 100);
  function partScore(p) { const ids = NIDS.filter(id => NOTIONS[id].part === p); return avg(ids.map(id => mastery(id) || 0)); }
  function globalScore() { return avg(NIDS.map(id => mastery(id) || 0)); }
  function lastByEx() {
    const m = {};
    S.attempts.forEach(a => {
      const x = m[a.ex];
      if (!x || a.t > x.t) m[a.ex] = { t: a.t, s: a.r, c: 1 };
      else if (a.t === x.t) { x.s += a.r; x.c++; }
    });
    Object.keys(m).forEach(k => { m[k].r = m[k].s / m[k].c; });
    return m;
  }
  function errorIds() {
    const last = lastByEx();
    return Object.keys(last).filter(id => EX[id] && last[id].r < 0.99).sort((a, b) => last[b].t - last[a].t);
  }
  function rankWeak() {
    const mm = masteryMap();
    const arr = NIDS.map(id => ({ id, m: mm[id] }));
    return [...arr.filter(x => x.m != null && x.m < 0.8).sort((a, b) => a.m - b.m), ...arr.filter(x => x.m == null)];
  }

  function shortQ(ex) {
    switch (ex.type) {
      case "vf": return "Vrai ou faux : " + ex.s;
      case "fill": return "Compléter : " + ex.text.replace(/\[\[(.+?)\]\]/g, "____");
      case "part": return "Partie d'où vient : « " + ex.quote + " »";
      case "flash": return ex.f;
      default: return ex.q;
    }
  }
  function record(ex, res) {
    const t = Date.now();
    const per = {}, perG = {}, perE = {};
    (res.items || []).forEach(it => {
      const n = it.n || ex.notion || ex.nlist[0];
      (per[n] = per[n] || []).push(it.r);
      if (it.g != null && it.r < 0.99) { (perG[n] = perG[n] || []).push(it.g); (perE[n] = perE[n] || []).push(it.e); }
    });
    const ns = Object.keys(per).length ? Object.keys(per) : ex.nlist;
    const uniq = a => [...new Set(a)].join(" ; ");
    ns.forEach(n => {
      const r = per[n] ? avg(per[n]) : res.score;
      S.attempts.push({ ex: ex.id, n, r: Math.round(r * 100) / 100, t, g: clip(perG[n] ? uniq(perG[n]) : res.given), e: clip(perE[n] ? uniq(perE[n]) : res.expected), q: clip(shortQ(ex), 260) });
    });
    MC = null;
    save();
  }

  /* =========================================================
     Sélection des exercices
     ========================================================= */
  function pickSmart(n, filter, allowBuild) {
    const last = lastByEx(), now = Date.now();
    const pool = EXS.filter(e => (allowBuild || e.type !== "build") && (!filter || filter(e)));
    const scored = pool.map(e => {
      const ms = e.nlist.map(id => mastery(id));
      let pr = 1 - avg(ms.map(m => m == null ? 0.35 : m));
      const l = last[e.id];
      if (!l) pr += 0.25; else { pr += (1 - l.r) * 0.4; if (now - l.t < 10 * 60e3) pr -= 0.7; }
      pr += Math.random() * 0.35;
      return { e, pr };
    }).sort((a, b) => b.pr - a.pr);
    const out = [], tc = {}, nc = {};
    const maxType = Math.max(2, Math.ceil(n / 3));
    for (const { e } of scored) {
      if (out.length >= n) break;
      if ((tc[e.type] || 0) >= maxType) continue;
      if (e.nlist.some(id => (nc[id] || 0) >= 2)) continue;
      out.push(e); tc[e.type] = (tc[e.type] || 0) + 1; e.nlist.forEach(id => nc[id] = (nc[id] || 0) + 1);
    }
    for (const { e } of scored) { if (out.length >= n) break; if (!out.includes(e)) out.push(e); }
    return shuffle(out).map(e => e.id);
  }
  function pickDiag() {
    const per = { 0: 1, 1: 1, 2: 2, 3: 1, 4: 2, 5: 1, 6: 2 };
    const out = [];
    Object.keys(per).forEach(p => {
      const used = new Set();
      shuffle(EXS.filter(e => e.part === +p && QUICK.includes(e.type))).forEach(e => {
        if (used.size >= per[p] || used.has(e.notion)) return;
        used.add(e.notion); out.push(e.id);
      });
    });
    return shuffle(out);
  }
  function pickBuild(k) {
    const last = lastByEx(), now = Date.now();
    return EXS.filter(e => e.type === "build").map(e => {
      const l = last[e.id];
      let pr = l ? (1 - l.r) * 0.6 : 1;
      if (l && now - l.t < 15 * 60e3) pr -= 0.8;
      return { e, pr: pr + Math.random() * 0.5 };
    }).sort((a, b) => b.pr - a.pr).slice(0, k).map(x => x.e.id);
  }

  /* =========================================================
     Navigation
     ========================================================= */
  let VIEW = "plan", PARAMS = {};
  let CLEAN = [];
  const app = $("#app");
  const VIEWS = {};
  function go(v, p) { VIEW = v; PARAMS = p || {}; render(); }
  function render() {
    closeModal();
    CLEAN.forEach(f => { try { f(); } catch (e) { /* */ } });
    CLEAN = [];
    const navKey = VIEW === "player" ? (P && P.from === "reflexion" ? "reflexion" : "train") : VIEW === "lecture" ? "plan" : VIEW;
    $$("#nav button").forEach(b => b.classList.toggle("on", b.dataset.view === navKey));
    VIEWS[VIEW](app, PARAMS);
    renderPill();
  }
  $$("#nav button").forEach(b => b.addEventListener("click", () => { if (b.dataset.view === "carte") go("carte", {}); else go(b.dataset.view); }));

  /* =========================================================
     Plan de révision
     ========================================================= */
  const CAT = { diag: "ex", read: "read", reread: "read", drill: "ex", mixed: "ex", video: "weak", reflect: "refl", weak: "weak", pause: "rest", bilan: "rest" };
  const CAT_LABEL = { read: "Lecture", ex: "Exercices", refl: "Réflexion", weak: "Points faibles", rest: "Pauses et bilan" };
  const CAT_COLOR = { read: "var(--indigo)", ex: "var(--accent)", refl: "var(--teal-mark)", weak: "var(--orange-mark)", rest: "var(--fill-3)" };
  const sumObj = o => sum(Object.values(o));

  function buildPlan(Dur, readArr) {
    const read = new Set(readArr);
    const ALL = [1, 2, 3, 4, 5, 6];
    const unread = ALL.filter(p => !read.has(p));
    const pauses = Dur >= 150 ? 2 : Dur >= 85 ? 1 : 0;
    const budget = Dur - 5 - 3 - pauses * 5;
    const A = { read: {}, mode: {}, drill: {}, reflect: 5, weak: 4, mixed: 0, reread: {}, video: 0 };
    unread.forEach(p => { A.read[p] = READING[p].express; A.mode[p] = "express"; });
    ALL.forEach(p => { A.drill[p] = 2; });
    const used = () => sumObj(A.read) + sumObj(A.drill) + A.reflect + A.weak + A.mixed + sumObj(A.reread) + A.video;
    let compressed = false;

    if (used() > budget) {
      compressed = true;
      ALL.forEach(p => { if (read.has(p)) A.drill[p] = 1; });
      A.reflect = 3; A.weak = 2;
      if (used() > budget) {
        const avail = budget - (sumObj(A.drill) + A.reflect + A.weak);
        const f = Math.max(0, avail) / (sumObj(A.read) || 1);
        unread.forEach(p => { A.read[p] = Math.max(2, Math.floor(A.read[p] * f)); });
        if (used() > budget) unread.forEach(p => { A.drill[p] = 1; });
      }
      let left = budget - used();
      const pri = [4, 2, 3, 1, 6, 5].filter(p => !read.has(p));
      let k = 0;
      while (left > 0 && pri.length) { A.read[pri[k % pri.length]]++; left--; k++; }
    } else {
      const ups = [];
      const up = (cost, apply) => ups.push({ cost, apply });
      const ess = p => up(() => READING[p].ess - A.read[p], () => { A.read[p] = READING[p].ess; A.mode[p] = READING[p].ess === READING[p].full ? "full" : "ess"; });
      const full = p => up(() => READING[p].full - A.read[p], () => { A.read[p] = READING[p].full; A.mode[p] = "full"; });
      if (!read.has(4)) ess(4);
      up(() => 5, () => { A.reflect += 5; });
      up(() => 2, () => { A.drill[4] += 2; });
      up(() => 2, () => { A.weak += 2; });
      [6, 5, 2, 3, 1].filter(p => !read.has(p)).forEach(ess);
      [2, 3, 1, 5, 6].forEach(p => up(() => 2, () => { A.drill[p] += 2; }));
      up(() => 8, () => { A.mixed += 8; });
      [2, 4, 3, 1, 6, 5].filter(p => read.has(p)).forEach(p => up(() => 3, () => { A.reread[p] = 3; }));
      up(() => 5, () => { A.reflect += 5; });
      [4, 6, 3, 2, 1, 5].filter(p => !read.has(p)).forEach(full);
      up(() => 4, () => { A.weak += 4; });
      [4, 2, 3, 1, 5, 6].forEach(p => up(() => 2, () => { A.drill[p] += 2; }));
      if (Dur >= 100) up(() => 12, () => { A.video += 12; });
      up(() => 6, () => { A.mixed += 6; });
      up(() => 6, () => { A.reflect += 6; });
      up(() => 4, () => { A.weak += 4; });
      ups.forEach(u => { const c = u.cost(); if (c <= 0 || used() + c <= budget) u.apply(); });
      // Reste : on répartit sur les exercices, sans dépasser des plafonds raisonnables
      let left = budget - used();
      const targets = [() => A.drill[4] < 12 && (A.drill[4] += 1), () => A.mixed < 30 && (A.mixed += 1), () => A.reflect < 33 && (A.reflect += 1), () => A.drill[2] < 12 && (A.drill[2] += 1), () => A.drill[3] < 12 && (A.drill[3] += 1), () => A.drill[5] < 12 && (A.drill[5] += 1), () => A.drill[6] < 12 && (A.drill[6] += 1), () => A.drill[1] < 12 && (A.drill[1] += 1)];
      let guard = 0;
      while (left > 0 && guard < 400) { if (targets[guard % targets.length]()) left--; guard++; }
      if (left > 0) A.weak += left;
    }

    const blocks = [];
    blocks.push({ type: "diag", min: 5 });
    let p = 1;
    while (p <= 6) {
      if (read.has(p)) {
        let q = p; while (q + 1 <= 6 && read.has(q + 1)) q++;
        const ps = []; for (let x = p; x <= q; x++) ps.push(x);
        blocks.push({ type: "drill", parts: ps, min: sum(ps.map(x => A.drill[x])) });
        const rr = ps.filter(x => A.reread[x]);
        if (rr.length) blocks.push({ type: "reread", parts: rr, min: sum(rr.map(x => A.reread[x])) });
        p = q + 1;
      } else {
        blocks.push({ type: "read", part: p, mode: A.mode[p], min: A.read[p] });
        blocks.push({ type: "drill", parts: [p], min: A.drill[p] });
        p++;
      }
    }
    if (A.mixed) blocks.push({ type: "mixed", min: A.mixed });
    blocks.push({ type: "reflect", min: A.reflect });
    blocks.push({ type: "weak", min: A.weak });
    if (A.video) blocks.push({ type: "video", min: A.video });
    blocks.push({ type: "bilan", min: 3 });
    for (let k = 1; k <= pauses; k++) {
      const target = Dur * k / (pauses + 1);
      let acc = 0, best = -1, bd = Infinity;
      for (let i = 0; i < blocks.length - 1; i++) {
        acc += blocks[i].min;
        if (blocks[i].type === "read" || blocks[i].type === "pause" || blocks[i + 1].type === "pause") continue;
        const d = Math.abs(acc - target);
        if (d < bd) { bd = d; best = i + 1; }
      }
      if (best > 0) blocks.splice(best, 0, { type: "pause", min: 5 });
    }
    const expressParts = unread.filter(x => A.mode[x] === "express");
    return { blocks, duration: Dur, compressed, expressParts };
  }

  const romanList = ps => ps.length === 1 ? "partie " + PARTS[ps[0]].roman : "parties " + PARTS[ps[0]].roman + " à " + PARTS[ps[ps.length - 1]].roman;
  const nItems = min => Math.max(4, Math.round(min * 60 / 50));
  const nBuild = min => Math.max(2, Math.round(min / 2.5));
  const READ_WHY = {
    1: "La phrase d'ouverture sur le bon sens fournit souvent un sujet de réflexion : c'est le cas de l'exemple donné par ton professeur.",
    2: "Les quatre règles et l'image de l'architecte sont incontournables ; elles sont courtes et faciles à citer.",
    3: "Les trois maximes et leurs images (la maison, la forêt) se citent facilement et nourrissent les réponses sur l'action.",
    4: "C'est le cœur métaphysique du livre (doute, cogito, âme, Dieu, rêve), et c'est l'une des parties les plus courtes.",
    5: "L'essentiel pour un contrôle est la fin : homme, animal et machine, avec les deux critères. Le cœur peut se survoler.",
    6: "Les vidéos la survolent souvent ; or « maîtres et possesseurs de la nature » est un sujet classique, et Descartes y explique pourquoi il écrit en français."
  };
  function describe(b) {
    switch (b.type) {
      case "diag": return { title: "Diagnostic éclair", desc: "10 questions rapides sur tout le livre, sans réviser avant. Ne cherche pas à bien faire : le but est de repérer tes angles morts.", why: "Se tester d'abord vaut mieux que relire : chaque erreur devient une priorité pour la suite du plan.", act: "Lancer le diagnostic" };
      case "read": return { title: "Lecture · partie " + PARTS[b.part].roman, desc: READING[b.part].text[b.mode], why: READ_WHY[b.part], list: READING[b.part].look, listTitle: "Ce que tu dois repérer", act: "Ouvrir le guide de lecture", eyebrow: "Lecture " + MODE_LABEL[b.mode].toLowerCase() };
      case "reread": return { title: "Relecture ciblée · " + romanList(b.parts), desc: "Ne relis pas tout : ouvre la Carte, puis la fiche de chaque notion en rouge ou en orange, et relis seulement les passages cités.", why: "Tu as déjà lu ces parties. Relire en entier donne une illusion de maîtrise ; viser tes erreurs est bien plus rentable.", act: "Ouvrir la carte" };
      case "drill": {
        const n = nItems(b.min);
        const fresh = b.parts.length === 1 && !S.plan.read.includes(b.parts[0]);
        return { title: "Exercices · " + romanList(b.parts), desc: fresh ? "Juste après la lecture, teste-toi : c'est à ce moment que l'effort de rappel fixe le mieux ce que tu viens de lire." : "Rappel actif sur des parties déjà lues : QCM, textes à trous, citations à situer, cartes mémoire. Ce que tu rates part dans tes points faibles.", why: n + " exercices, environ 50 secondes chacun.", act: "Lancer " + n + " exercices", n };
      }
      case "mixed": { const n = Math.max(3, Math.round(b.min * 60 / 80)); return { title: "Schémas et liens entre parties", desc: "Exercices visuels : schémas à compléter, ordres à rétablir, associations, classements, tableaux. Ils obligent à relier les parties entre elles, comme le demande une question de réflexion.", why: n + " exercices, environ 1 min 20 chacun.", act: "Lancer " + n + " exercices", n }; }
      case "reflect": { const k = nBuild(b.min); return { title: "Questions de réflexion", desc: k + " questions du type de ton contrôle. Pour chacune : réfléchis 30 secondes, choisis les arguments pertinents, puis compare au plan modèle et à la citation clé.", why: "Ton contrôle : 4 questions de réflexion en 1 h. Ici, tu t'entraînes à trouver vite les bons arguments sans perdre de temps à rédiger.", act: "Lancer " + k + " questions", n: k }; }
      case "weak": return { title: "Points faibles", desc: "Refais tes exercices ratés jusqu'à ce qu'ils passent au vert, puis ouvre la fiche des notions qui restent en rouge dans le Bilan.", why: "Les erreurs corrigées juste après coup sont celles qu'on retient le mieux le lendemain.", act: "Refaire mes erreurs" };
      case "video": return { title: "Vidéo ciblée", desc: "Sur ta notion la plus fragile, regarde une explication en vidéo, en vitesse ×1,5. Le Bilan propose une recherche ciblée pour chaque notion.", why: "Une vidéo est utile pour débloquer une idée précise, pas pour remplacer la lecture.", act: "Ouvrir le bilan" };
      case "pause": return { title: "Pause", desc: "Lève-toi, bois un verre d'eau, et pas d'écran. Cinq minutes suffisent.", why: "Une courte pause entre deux blocs aide à consolider ce que tu viens de travailler." };
      case "bilan": return { title: "Bilan et export", desc: "Regarde ta préparation globale, puis exporte le PDF (ou copie le texte) et envoie-le à Claude pour recevoir des fiches sur ce qui reste fragile.", why: "Après ça : dodo. Le sommeil fait une bonne partie du travail de mémorisation.", act: "Voir le bilan" };
    }
    return { title: "" };
  }

  let PLAN_SEL = null;
  VIEWS.plan = function (root) {
    const running = !!S.run;
    if (running) PLAN_SEL = S.run.idx;
    root.innerHTML = `
    <section class="view plan">
      <div class="card plan-ctrl">
        <div class="eyebrow">Ce soir</div>
        <div class="display" id="durTxt"></div>
        <div class="sub">de révision avant le contrôle.</div>
        <div class="range"><input type="range" id="dur" min="30" max="180" step="5" value="${S.plan.duration}" ${running ? "disabled" : ""} aria-label="Durée de révision"></div>
        <div class="range-scale"><span style="left:0">30 min</span><span style="left:20%">1 h</span><span style="left:40%">1 h 30</span><span style="left:60%">2 h</span><span style="left:100%">3 h</span></div>
        <div class="ctrl-label">Parties déjà lues <span>touche pour modifier</span></div>
        <div class="part-toggles">${[1, 2, 3, 4, 5, 6].map(p => `<button class="ptog ${S.plan.read.includes(p) ? "on" : ""}" data-p="${p}" ${running ? "disabled" : ""} title="${esc(PARTS[p].title)}">${PARTS[p].roman}</button>`).join("")}</div>
        <div class="mix" id="mix"></div>
        <div class="ctrl-foot" id="ctrlFoot"></div>
      </div>
      <div class="card plan-tl">
        <div class="tl-head"><h3>Programme</h3><span id="tlRange"></span></div>
        <ol class="tl" id="tl"></ol>
      </div>
      <div class="card plan-detail" id="pd"></div>
    </section>`;
    const slider = $("#dur");
    const setP = () => slider.style.setProperty("--p", ((slider.value - 30) / 150 * 100) + "%");
    setP();
    slider.addEventListener("input", () => { S.plan.duration = +slider.value; setP(); save(); refreshPlan(); });
    $$(".ptog").forEach(b => b.addEventListener("click", () => {
      const p = +b.dataset.p, r = S.plan.read;
      S.plan.read = r.includes(p) ? r.filter(x => x !== p) : [...r, p].sort();
      b.classList.toggle("on");
      save(); refreshPlan();
    }));
    refreshPlan();
  };

  function currentPlan() {
    if (S.run) return { blocks: S.run.blocks, duration: S.run.duration, compressed: S.run.compressed, expressParts: S.run.expressParts || [] };
    return buildPlan(S.plan.duration, S.plan.read);
  }
  function timesFor(blocks) {
    const out = [];
    if (S.run) {
      const idx = S.run.idx;
      let t = S.run.blockStart;
      for (let i = idx; i < blocks.length; i++) { out[i] = t; t += blocks[i].min * 60000; }
      t = S.run.blockStart;
      for (let i = idx - 1; i >= 0; i--) { t -= blocks[i].min * 60000; out[i] = t; }
      out.end = S.run.blockStart + sum(blocks.slice(idx).map(b => b.min)) * 60000;
    } else {
      let t = nextFive();
      blocks.forEach((b, i) => { out[i] = t; t += b.min * 60000; });
      out.end = t;
    }
    return out;
  }
  function refreshPlan() {
    const plan = currentPlan();
    const blocks = plan.blocks;
    const T = timesFor(blocks);
    if (PLAN_SEL == null || PLAN_SEL >= blocks.length) PLAN_SEL = S.run ? S.run.idx : 0;
    $("#durTxt").textContent = fmtDur(plan.duration);
    $("#tlRange").textContent = clock(T[0]) + " → " + clock(T.end);
    const cats = {};
    blocks.forEach(b => { const c = CAT[b.type]; cats[c] = (cats[c] || 0) + b.min; });
    const order = ["read", "ex", "refl", "weak", "rest"].filter(c => cats[c]);
    $("#mix").innerHTML = `<div class="mix-bar">${order.map(c => `<i style="flex-grow:${cats[c]};background:${CAT_COLOR[c]}"></i>`).join("")}</div>
      <div class="mix-legend">${order.map(c => `<div><span class="sw" style="background:${CAT_COLOR[c]}"></span>${CAT_LABEL[c]}<b>${cats[c]} min</b></div>`).join("")}</div>`;
    let note = "";
    if (plan.compressed) note = `<p class="note warn">Avec ${fmtDur(plan.duration)}, impossible de tout couvrir : le plan garde le strict essentiel. Vise au moins 1 h.</p>`;
    else if (plan.expressParts.length) note = `<p class="note">Lecture express pour la ${plan.expressParts.map(p => PARTS[p].roman).join(", ")} : allonge la durée pour lire davantage.</p>`;
    $("#ctrlFoot").innerHTML = note + (S.run
      ? `<button class="btn secondary" id="stopRun">Arrêter la session</button>`
      : `<button class="btn primary lg" id="startRun">Commencer maintenant</button>`);
    const sr = $("#startRun"); if (sr) sr.onclick = () => {
      S.run = { blocks: plan.blocks, duration: plan.duration, compressed: plan.compressed, expressParts: plan.expressParts, idx: 0, blockStart: Date.now(), startedAt: Date.now() };
      PLAN_SEL = 0; save(); render();
    };
    const st = $("#stopRun"); if (st) st.onclick = () => { S.run = null; PLAN_SEL = 0; save(); render(); };

    $("#tl").innerHTML = blocks.map((b, i) => {
      const d = describe(b);
      const cls = ["tl-row", i === PLAN_SEL ? "sel" : "", S.run && i < S.run.idx ? "done" : "", S.run && i === S.run.idx ? "now" : "", b.type === "pause" ? "pause" : ""].join(" ");
      return `<li class="${cls}" data-i="${i}"><span class="tl-time">${clock(T[i])}</span><span class="tl-dot" style="background:${CAT_COLOR[CAT[b.type]]}"></span><span class="tl-title">${esc(d.title)}</span><span class="tl-min">${b.min} min</span></li>`;
    }).join("");
    $$("#tl .tl-row").forEach(li => li.addEventListener("click", () => { PLAN_SEL = +li.dataset.i; refreshPlan(); }));
    renderDetail(blocks, T);
  }
  function renderDetail(blocks, T) {
    const i = PLAN_SEL, b = blocks[i], d = describe(b);
    const isNow = S.run && i === S.run.idx;
    const cat = CAT[b.type];
    $("#pd").innerHTML = `
      <div class="pd-top"><span class="sw" style="background:${CAT_COLOR[cat]};width:10px;height:10px;border-radius:3px"></span><span class="eyebrow">${esc(d.eyebrow || CAT_LABEL[cat])} · étape ${i + 1} sur ${blocks.length}</span></div>
      <h2 class="pd-title">${esc(d.title)}</h2>
      <div class="pd-when">${clock(T[i])} → ${clock(T[i] + b.min * 60000)} · ${b.min} min</div>
      ${isNow ? `<div class="pd-run"><div><div class="small">En cours · temps restant</div><div class="countdown tabnum" id="countdown">${fmtClock(remaining())}</div></div><button class="btn primary" id="nextBlock">Bloc suivant ${ICON.chev}</button></div>` : ""}
      <p class="pd-desc">${esc(d.desc)}</p>
      ${d.list ? `<ul class="pd-list">${d.list.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      ${d.why ? `<div class="pd-why"><b>Pourquoi ? </b>${esc(d.why)}</div>` : ""}
      <div class="pd-foot">${d.act ? `<button class="btn primary" id="act">${esc(d.act)} ${ICON.chev}</button>` : ""}${!S.run ? `<span class="note">Astuce : clique « Commencer maintenant » pour lancer le chronomètre.</span>` : ""}</div>`;
    const a = $("#act"); if (a) a.onclick = () => runAction(b);
    const nb = $("#nextBlock"); if (nb) nb.onclick = advanceRun;
  }
  function advanceRun() {
    if (!S.run) return;
    S.run.idx++;
    S.run.blockStart = Date.now();
    if (S.run.idx >= S.run.blocks.length) { S.run = null; save(); toast("Session terminée. Bravo, et bonne nuit."); PLAN_SEL = 0; go("bilan"); return; }
    PLAN_SEL = S.run.idx;
    save();
    if (VIEW === "plan") refreshPlan(); else go("plan");
    renderPill();
  }
  function remaining() { const b = S.run.blocks[S.run.idx]; return S.run.blockStart + b.min * 60000 - Date.now(); }
  function runAction(b) {
    const d = describe(b);
    const o = { origin: "plan" };
    switch (b.type) {
      case "diag": return startSession(Object.assign({ title: "Diagnostic éclair", ids: pickDiag() }, o));
      case "read": return go("lecture", { part: b.part, mode: b.mode, fromPlan: true });
      case "reread": return go("carte", { part: b.parts[0] });
      case "drill": return startSession(Object.assign({ title: "Exercices · " + romanList(b.parts), ids: pickSmart(d.n, e => b.parts.includes(e.part)) }, o));
      case "mixed": return startSession(Object.assign({ title: "Schémas et liens", ids: pickSmart(d.n, e => VISUAL.includes(e.type)) }, o));
      case "reflect": return startSession(Object.assign({ title: "Questions de réflexion", ids: pickBuild(d.n), from: "reflexion" }, o));
      case "weak": {
        const ids = errorIds().slice(0, 12);
        if (ids.length) return startSession(Object.assign({ title: "Mes erreurs", ids: shuffle(ids) }, o));
        toast("Aucune erreur enregistrée : mix intelligent à la place.");
        return startSession(Object.assign({ title: "Mix intelligent", ids: pickSmart(10) }, o));
      }
      default: return go("bilan");
    }
  }

  /* Pastille de session (barre du haut) */
  function renderPill() {
    const slot = $("#pillSlot");
    if (!S.run) { slot.innerHTML = ""; return; }
    const b = S.run.blocks[S.run.idx];
    const rem = remaining();
    slot.innerHTML = `<button class="pill ${rem < 0 ? "late" : ""}" id="pill" title="Voir le plan"><span class="pill-dot"></span><span class="pill-txt">${esc(describe(b).title)}</span><span class="pill-time">${fmtClock(rem)}</span></button>`;
    $("#pill").onclick = () => go("plan");
  }
  setInterval(() => {
    if (!S.run) return;
    const rem = remaining();
    const p = $("#pill");
    if (p) { p.classList.toggle("late", rem < 0); $(".pill-time", p).textContent = fmtClock(rem); }
    const cd = $("#countdown");
    if (cd) { cd.textContent = fmtClock(rem); cd.classList.toggle("late", rem < 0); }
  }, 1000);

  /* =========================================================
     Guide de lecture
     ========================================================= */
  VIEWS.lecture = function (root, prm) {
    const part = prm.part || 4, r = READING[part], P0 = PARTS[part];
    const mode = prm.mode || "ess";
    const checks = S.checks[part] || [];
    root.innerHTML = `
    <section class="view lecture">
      <div class="card l-main">
        <div class="eyebrow accent">Guide de lecture</div>
        <div class="r">${P0.roman}</div>
        <h1>${esc(P0.title)}</h1>
        <div class="l-modes"><div class="segmented" id="modes">${["express", "ess", "full"].map(m => `<button data-m="${m}" class="${m === mode ? "on" : ""}">${MODE_LABEL[m]} · ${r[m]} min</button>`).join("")}</div></div>
        <p class="l-what">${esc(r.text[mode])}</p>
        <div class="l-actions">
          <a class="btn secondary" href="${r.wiki}" target="_blank" rel="noopener">Texte en ligne ${ICON.ext}</a>
          <button class="btn primary" id="done">J'ai lu · exercices de la partie ${ICON.chev}</button>
          <button class="btn ghost" id="toCarte">Fiches de la partie</button>
        </div>
      </div>
      <div class="card l-look">
        <div class="eyebrow">Lecture active</div>
        <h2 style="margin-top:6px">En lisant, repère</h2>
        <ul class="checks">${r.look.map((t, i) => `<li><label><input type="checkbox" data-i="${i}" ${checks.includes(i) ? "checked" : ""}><span class="box">${ICON.check}</span><span>${esc(t)}</span></label></li>`).join("")}</ul>
        <p class="note" style="margin-top:auto;padding-top:14px">Coche au fur et à mesure. Si un point t'échappe à la fin, c'est là que tu relis.</p>
      </div>
    </section>`;
    $$("#modes button").forEach(b => b.onclick = () => go("lecture", Object.assign({}, prm, { mode: b.dataset.m })));
    $$(".checks input").forEach(c => c.onchange = () => { S.checks[part] = $$(".checks input").filter(x => x.checked).map(x => +x.dataset.i); save(); });
    $("#done").onclick = () => {
      if (S.run && S.run.blocks[S.run.idx] && S.run.blocks[S.run.idx].type === "read" && S.run.blocks[S.run.idx].part === part) advanceRunSilent();
      startSession({ title: "Exercices · partie " + P0.roman, ids: pickSmart(6, e => e.part === part), origin: prm.fromPlan ? "plan" : null });
    };
    $("#toCarte").onclick = () => go("carte", { part });
  };
  function advanceRunSilent() { S.run.idx++; S.run.blockStart = Date.now(); if (S.run.idx >= S.run.blocks.length) S.run = null; PLAN_SEL = S.run ? S.run.idx : 0; save(); }

  /* =========================================================
     Carte & fiches
     ========================================================= */
  VIEWS.carte = function (root, prm) {
    const mode = prm.notion ? "n" : prm.part != null ? "p" : "ov";
    const cur = prm.notion ? NOTIONS[prm.notion].part : prm.part;
    const navItem = (p) => {
      const sc = partScore(p), st = status(NIDS.some(id => NOTIONS[id].part === p && mastery(id) != null) ? sc : null);
      return `<button class="c-nav-item ${mode !== "ov" && cur === p ? "on" : ""}" data-part="${p}"><span class="r">${p ? PARTS[p].roman : ICON.book}</span><span class="t">${esc(p ? PARTS[p].label : "Contexte")}</span><div class="bar ${st}"><i style="width:${pct(sc)}%"></i></div></button>`;
    };
    root.innerHTML = `
    <section class="view carte">
      <nav class="card c-nav">
        <button class="c-nav-item ${mode === "ov" ? "on" : ""}" data-ov><span class="r">${ICON.grid}</span><span class="t" style="grid-row:span 2">Vue d'ensemble</span></button>
        ${navItem(0)}
        <div class="c-nav-sep"></div>
        ${[1, 2, 3, 4, 5, 6].map(navItem).join("")}
      </nav>
      <div class="card c-main" id="cmain"></div>
    </section>`;
    $$(".c-nav-item").forEach(b => b.onclick = () => b.hasAttribute("data-ov") ? go("carte", {}) : go("carte", { part: +b.dataset.part }));
    $$(".c-nav-item .r svg").forEach(s => { s.style.width = "20px"; s.style.height = "20px"; });
    const main = $("#cmain");
    if (mode === "ov") main.innerHTML = overviewHTML();
    else if (mode === "p") main.innerHTML = partHTML(prm.part);
    else main.innerHTML = ficheHTML(prm.notion, { back: true });
    $$("[data-part]", main).forEach(b => b.onclick = () => go("carte", { part: +b.dataset.part }));
    $$("[data-notion]", main).forEach(b => b.onclick = () => go("carte", { notion: b.dataset.notion }));
    const bk = $("[data-back]", main); if (bk) bk.onclick = () => go("carte", { part: NOTIONS[prm.notion].part });
    const tp = $("#trainPart", main); if (tp) tp.onclick = () => startSession({ title: "Exercices · " + partLabel(prm.part), ids: pickSmart(S.settings.len, e => e.part === prm.part) });
    const lp = $("#readPart", main); if (lp) lp.onclick = () => go("lecture", { part: prm.part, mode: "ess" });
  };
  function overviewHTML() {
    return `
      <div class="ov-head"><div><div class="eyebrow">Vue d'ensemble</div><h1 style="margin-top:6px">Le Discours en six temps</h1>
        <p>Descartes compare sa démarche à une maison qu'on rebâtit : constater que le terrain est meuble, tracer le plan, se loger en attendant, poser les fondations, bâtir, puis habiter.</p></div></div>
      <div class="frise">${[1, 2, 3, 4, 5, 6].map(p => {
        const has = NIDS.some(id => NOTIONS[id].part === p && mastery(id) != null), sc = partScore(p);
        return `<button class="fr-col" data-part="${p}"><span class="r">${PARTS[p].roman}</span><span class="m">${esc(PARTS[p].metaphor)}</span><span class="t">${esc(PARTS[p].label)}</span><span class="e">${esc(PARTS[p].essence)}</span><div class="bar ${status(has ? sc : null)}"><i style="width:${pct(sc)}%"></i></div></button>`;
      }).join("")}</div>
      <div class="ov-foot">
        <div class="ov-box"><b>Le fil rouge</b>Le bon sens est égal en tous : tout dépend de la méthode. Douter pour juger, mais agir sans hésiter ; trouver un premier principe certain, puis bâtir une science utile à la vie.</div>
        <div class="ov-box"><b>Le piège numéro un</b>Ne pas mélanger avec les Méditations (1641) : ni malin génie, ni morceau de cire, ni « je suis, j'existe » dans le Discours.</div>
      </div>`;
  }
  function partHTML(p) {
    const ids = NIDS.filter(id => NOTIONS[id].part === p);
    const P0 = PARTS[p];
    return `
      <div class="part-head"><span class="r">${p ? P0.roman : ""}</span><div><div class="eyebrow">${esc(partLabel(p))}${P0.metaphor ? " · " + esc(P0.metaphor) : ""}</div><h1 style="margin-top:6px">${esc(P0.title)}</h1><p>${esc(P0.essence)}</p></div></div>
      <div class="n-grid">${ids.map(id => { const m = mastery(id), st = status(m); return `<button class="n-tile" data-notion="${id}"><span class="t">${esc(NOTIONS[id].title)}</span><span class="s"><span class="dot ${st}"></span>${STATUS_LABEL[st]}${m != null ? " · " + pct(m) + " %" : ""}</span></button>`; }).join("")}</div>
      <div class="part-actions"><button class="btn primary" id="trainPart">S'entraîner sur cette partie</button>${p ? `<button class="btn secondary" id="readPart">Guide de lecture</button><a class="btn ghost" href="${READING[p].wiki}" target="_blank" rel="noopener">Texte en ligne ${ICON.ext}</a>` : ""}</div>`;
  }
  function ficheHTML(id, o) {
    const n = NOTIONS[id], m = mastery(id), st = status(m);
    return `<div class="fiche">
      <div class="fiche-l">
        ${o.back ? `<button class="btn ghost back" data-back>${ICON.back} ${esc(partLabel(n.part))}</button>` : ""}
        <div class="eyebrow">${esc(partLabel(n.part))}</div>
        <h1 style="margin-top:6px">${esc(n.title)}</h1>
        <p class="lead">${esc(n.essentiel)}</p>
        <ul>${n.retenir.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      </div>
      <div class="fiche-r">
        <div class="fiche-quote"><div class="eyebrow">Citation à connaître</div><p class="quote" style="margin-top:8px">« ${esc(n.citation)} »</p><div class="src">${esc(partLabel(n.part))}</div></div>
        <div class="fiche-trap"><b>Piège</b>${esc(n.piege)}</div>
        <div class="fiche-stat"><span class="dot ${st}"></span><span>${STATUS_LABEL[st]}</span><div class="bar ${st}"><i style="width:${pct(m)}%"></i></div><span class="tabnum">${m == null ? "—" : pct(m) + " %"}</span></div>
        <div class="fiche-links">
          <button class="btn primary sm" data-train-notion="${id}">S'entraîner</button>
          <a class="btn secondary sm" href="${yt(n.video)}" target="_blank" rel="noopener">Vidéos ${ICON.ext}</a>
          ${n.part ? `<a class="btn ghost sm" href="${READING[n.part].wiki}" target="_blank" rel="noopener">Texte ${ICON.ext}</a>` : ""}
        </div>
      </div>
    </div>`;
  }
  function openFiche(id) {
    const m = $("#modal");
    m.innerHTML = `<div class="modal-card" role="dialog" aria-modal="true" aria-label="Fiche"><div class="modal-head"><span class="eyebrow">Fiche</span><button class="icon-btn" data-close aria-label="Fermer">${ICON.close}</button></div>${ficheHTML(id, {})}</div>`;
    m.hidden = false;
    m.onclick = e => { if (e.target === m || e.target.closest("[data-close]")) closeModal(); };
  }
  function closeModal() { const m = $("#modal"); if (!m.hidden) { m.hidden = true; m.innerHTML = ""; } }

  /* =========================================================
     Entraînement
     ========================================================= */
  const pickState = { parts: new Set(), types: new Set() };
  VIEWS.train = function (root) {
    const mm = masteryMap();
    const untested = NIDS.filter(id => mm[id] == null).length;
    const weak = NIDS.filter(id => mm[id] != null && mm[id] < 0.8).length;
    const errs = errorIds().length;
    const len = S.settings.len;
    const counts = {}; EXS.forEach(e => counts[e.type] = (counts[e.type] || 0) + 1);
    const pc = {}; EXS.forEach(e => pc[e.part] = (pc[e.part] || 0) + 1);
    root.innerHTML = `
    <section class="view train">
      <div class="card t-smart">
        <div class="eyebrow accent">Recommandé</div>
        <h1>Mix intelligent</h1>
        <p>Les exercices sont choisis pour toi : d'abord les notions jamais vues et celles que tu rates, dans des formats variés pour ancrer chaque idée sous plusieurs angles.</p>
        <div class="t-stats"><div><b>${untested}</b><span>notions jamais testées</span></div><div><b>${weak}</b><span>notions fragiles</span></div><div><b>${EXS.length}</b><span>exercices en tout</span></div></div>
        <div class="t-set">
          <div class="t-set-row"><span class="lbl">Longueur des séries</span><span class="segmented" id="len">${[8, 12, 20].map(n => `<button data-n="${n}" class="${n === len ? "on" : ""}">${n}</button>`).join("")}</span></div>
          <div class="t-set-row"><span class="lbl">Rappel actif</span><span class="switch ${S.settings.recall ? "on" : ""}" id="recall" role="switch" aria-checked="${S.settings.recall}" tabindex="0"><i></i></span></div>
          <p class="note">Le rappel actif masque les propositions (QCM, réflexion) tant que tu n'as pas formulé ta réponse de tête.</p>
        </div>
        <button class="btn primary lg" id="smart">Commencer · ${len} exercices ${ICON.chev}</button>
      </div>
      <div class="card t-mini"><div class="eyebrow">Point de départ</div><h3 style="margin-top:6px">Diagnostic éclair</h3><p>10 questions sur tout le livre pour repérer tes angles morts.</p><div class="gap"></div><button class="btn secondary" id="diag">Lancer</button></div>
      <div class="card t-mini"><div class="eyebrow orange">À corriger</div><div class="head"><h3 style="margin-top:6px">Mes erreurs</h3><span class="big">${errs}</span></div><p>exercice${errs > 1 ? "s" : ""} raté${errs > 1 ? "s" : ""} à refaire jusqu'au vert.</p><div class="gap"></div><button class="btn secondary" id="errs" ${errs ? "" : "disabled"}>Refaire</button></div>
      <div class="card t-pick"><div class="row"><h3>Par partie</h3><button class="btn secondary sm" id="goPart">Lancer</button></div>
        <div class="chips" id="partChips">${[0, 1, 2, 3, 4, 5, 6].map(p => `<button class="chip ${pickState.parts.has(p) ? "on" : ""}" data-p="${p}">${p ? PARTS[p].roman + " · " + esc(PARTS[p].label) : "Contexte et transversal"} <span class="n">${pc[p] || 0}</span></button>`).join("")}</div></div>
      <div class="card t-format"><div class="row"><h3>Par format</h3><button class="btn secondary sm" id="goFmt">Lancer</button></div>
        <div class="chips" id="fmtChips">${Object.keys(TYPES).map(t => `<button class="chip ${pickState.types.has(t) ? "on" : ""}" data-t="${t}">${esc(TYPES[t].label)} <span class="n">${counts[t] || 0}</span></button>`).join("")}</div></div>
    </section>`;
    $("#smart").onclick = () => startSession({ title: "Mix intelligent", ids: pickSmart(S.settings.len) });
    $("#diag").onclick = () => startSession({ title: "Diagnostic éclair", ids: pickDiag() });
    $("#errs").onclick = () => startSession({ title: "Mes erreurs", ids: shuffle(errorIds().slice(0, Math.max(S.settings.len, 12))) });
    $$("#partChips .chip").forEach(b => b.onclick = () => { const p = +b.dataset.p; pickState.parts.has(p) ? pickState.parts.delete(p) : pickState.parts.add(p); b.classList.toggle("on"); });
    $$("#fmtChips .chip").forEach(b => b.onclick = () => { const t = b.dataset.t; pickState.types.has(t) ? pickState.types.delete(t) : pickState.types.add(t); b.classList.toggle("on"); });
    $("#goPart").onclick = () => {
      if (!pickState.parts.size) return toast("Choisis au moins une partie.");
      const ps = [...pickState.parts].sort();
      startSession({ title: "Parties " + ps.map(p => p ? PARTS[p].roman : "contexte").join(", "), ids: pickSmart(S.settings.len, e => pickState.parts.has(e.part)) });
    };
    $("#goFmt").onclick = () => {
      if (!pickState.types.size) return toast("Choisis au moins un format.");
      const ts = [...pickState.types];
      startSession({ title: ts.map(t => TYPES[t].label).join(", "), ids: pickSmart(S.settings.len, e => pickState.types.has(e.type), true), from: ts.length === 1 && ts[0] === "build" ? "reflexion" : "train" });
    };
    $$("#len button").forEach(b => b.onclick = () => { S.settings.len = +b.dataset.n; save(); render(); });
    const rc = $("#recall");
    const flipRecall = () => { S.settings.recall = !S.settings.recall; save(); rc.classList.toggle("on", S.settings.recall); rc.setAttribute("aria-checked", S.settings.recall); };
    rc.onclick = flipRecall;
    rc.onkeydown = e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); flipRecall(); } };
  };

  /* =========================================================
     Réflexion
     ========================================================= */
  VIEWS.reflexion = function (root) {
    const builds = EXS.filter(e => e.type === "build");
    const last = lastByEx();
    root.innerHTML = `
    <section class="view reflexion">
      <div class="refl-head">
        <div><div class="eyebrow accent">Format du contrôle</div><h1 style="margin-top:6px">Questions de réflexion</h1>
        <p>Au contrôle : 4 questions en 1 h, soit environ 15 minutes chacune. Ici, pas de rédaction : pour chaque question, trouve les arguments pertinents, puis compare-toi au plan modèle et à la citation clé.</p></div>
        <div style="display:flex;gap:8px;flex:none"><button class="btn secondary" id="undone">Questions jamais faites</button><button class="btn primary" id="sim">Simulation · 4 questions</button></div>
      </div>
      <div class="refl-grid">${builds.map(e => {
        const l = last[e.id], st = l ? status(l.r) : "new";
        return `<button class="q-card" data-id="${e.id}"><div class="top"><span class="r">${e.part ? PARTS[e.part].roman : "Contexte"}</span><span class="score-badge ${l ? st : ""}">${l ? Math.round(l.r * 100) + " %" : "À faire"}</span></div><span class="t">${esc(e.q)}</span></button>`;
      }).join("")}</div>
    </section>`;
    $$(".q-card").forEach(c => c.onclick = () => startSession({ title: "Question de réflexion", ids: [c.dataset.id], from: "reflexion" }));
    $("#sim").onclick = () => startSession({ title: "Simulation de contrôle", ids: pickBuild(4), from: "reflexion" });
    $("#undone").onclick = () => {
      const ids = builds.filter(e => !last[e.id]).map(e => e.id);
      if (!ids.length) return toast("Tu as déjà fait toutes les questions.");
      startSession({ title: "Questions jamais faites", ids: shuffle(ids), from: "reflexion" });
    };
  };

  /* =========================================================
     Lecteur d'exercices
     ========================================================= */
  let P = null, CTRL = null, CHECKED = false;
  function startSession(o) {
    if (!o.ids || !o.ids.length) { toast("Rien à proposer ici pour le moment."); return; }
    closeModal();
    P = { title: o.title, ids: o.ids, idx: 0, res: [], origin: o.origin || null, from: o.from || "train", done: false };
    go("player");
  }
  const segCls = s => s == null ? "" : s >= 0.99 ? "ok" : s > 0 ? "mid" : "ko";
  function promptOf(ex) {
    switch (ex.type) {
      case "vf": return "Vrai ou faux ?";
      case "fill": return ex.plain ? "Complète la phrase." : "Complète la citation.";
      case "part": return "De quelle partie vient cette phrase ?";
      case "flash": return "Réponds de tête, puis retourne la carte.";
      default: return ex.q;
    }
  }
  function leaveSession() { const back = P && P.origin === "plan" ? "plan" : P && P.from === "reflexion" ? "reflexion" : "train"; P = null; go(back); }

  VIEWS.player = function (root) {
    if (!P) return go("train");
    if (P.done) return renderEnd(root);
    const ex = EX[P.ids[P.idx]];
    CHECKED = false;
    root.innerHTML = `
    <section class="view player">
      <div class="card player-main">
        <div class="player-head">
          <button class="icon-btn" id="quit" title="Quitter la série" aria-label="Quitter">${ICON.close}</button>
          <div class="segs">${P.ids.map((id, i) => `<i class="${i === P.idx ? "cur" : segCls(P.res[i])}"></i>`).join("")}</div>
          <span class="count">${P.idx + 1} / ${P.ids.length}</span>
        </div>
        <div class="ex-meta"><span class="tag">${esc(TYPES[ex.type].label)}</span>${ex.type !== "part" && ex.part ? `<span class="tag ghost">Partie ${PARTS[ex.part].roman}</span>` : ""}<span class="sess">${esc(P.title)}</span></div>
        <h2 class="ex-q">${esc(promptOf(ex))}</h2>
        <div class="ex-body" id="exBody"></div>
        <div class="ex-foot">
          <button class="btn ghost gray" id="idk">Je ne sais pas</button>
          <button class="btn ghost" id="hint" hidden>Indice</button>
          <span class="grow"></span>
          <button class="btn primary" id="validate" disabled>Valider <kbd>Entrée</kbd></button>
          <button class="btn primary" id="next" hidden>Continuer <kbd>Entrée</kbd></button>
        </div>
      </div>
      <aside class="card player-side" id="side">${sideIntro(ex)}</aside>
    </section>`;
    const api = {
      ready: v => { const b = $("#validate"); if (b) b.disabled = !v; },
      check: () => doCheck(false),
      next: () => nextEx(),
      hint: fn => { const h = $("#hint"); h.hidden = false; h.onclick = () => { fn(); h.disabled = true; }; }
    };
    CTRL = R[ex.type](ex, $("#exBody"), api);
    $("#quit").onclick = leaveSession;
    $("#idk").onclick = () => doCheck(true);
    $("#validate").onclick = () => doCheck(false);
    $("#next").onclick = nextEx;
    if (ex.type === "flash") { $("#validate").hidden = true; $("#idk").hidden = true; }
    if (ex.type === "vf" || ex.type === "part") $("#validate").hidden = true;
  };
  function sideIntro(ex) {
    const t = TYPES[ex.type];
    return `<div class="side-intro"><h4>Consigne</h4><p>${esc(t.help)}</p><div class="side-keys">${esc(t.keys)}</div></div>
      ${ex.type === "build" ? `<div class="side-sep"></div><div class="side-intro"><h4>Au contrôle</h4><p>Une bonne réponse tient en trois éléments : une problématique, deux ou trois arguments tirés du texte, une citation précise.</p></div>` : ""}
      ${ex.type === "part" ? `<div class="side-sep"></div><div class="side-intro"><h4>Repères</h4><p>I sciences · II méthode · III morale · IV métaphysique · V physique · VI pourquoi publier.</p></div>` : ""}`;
  }
  function doCheck(giveUp) {
    if (CHECKED || !CTRL) return;
    const ex = EX[P.ids[P.idx]];
    const res = CTRL.check(giveUp);
    if (giveUp) { res.score = 0; (res.items || []).forEach(i => { i.r = 0; if (i.g != null) i.g = "Je ne sais pas"; }); res.given = "Je ne sais pas"; res.gaveUp = true; }
    CHECKED = true;
    $("#exBody").classList.add("locked");
    record(ex, res);
    P.res[P.idx] = res.score;
    const seg = $$(".segs i")[P.idx]; if (seg) seg.className = segCls(res.score);
    ["#validate", "#idk", "#hint"].forEach(s => { const b = $(s); if (b) b.hidden = true; });
    const nx = $("#next"); nx.hidden = false;
    $("#side").innerHTML = feedbackHTML(ex, res);
    $("#side").scrollTop = 0;
  }
  function nextEx() {
    if (!P) return;
    P.idx++;
    if (P.idx >= P.ids.length) P.done = true;
    render();
  }
  function feedbackHTML(ex, res) {
    const s = res.score, cls = s >= 0.99 ? "ok" : s > 0 ? "mid" : "ko";
    const title = res.gaveUp ? "Voici la réponse" : cls === "ok" ? (res.typo ? "Juste, à une faute près" : "Juste") : cls === "mid" ? "Presque" : "À revoir";
    const icon = cls === "ok" ? ICON.check : cls === "mid" ? ICON.half : ICON.cross;
    const partial = ["fill", "order", "match", "sort", "schema", "grid", "build"].includes(ex.type) || (ex.type === "qcm" && Array.isArray(ex.answer));
    const sub = res.gaveUp ? "Pas de souci : elle repassera dans tes erreurs." : partial ? Math.round(s * 100) + " % des points" : cls === "ok" ? "Bonne réponse" : "Mauvaise réponse";
    let body = "";
    if (res.expectedHTML) body += `<div class="side-block"><h4>${esc(res.expectedTitle || "Réponse attendue")}</h4>${res.expectedHTML}</div>`;
    if (ex.explain) body += `<div class="side-block"><h4>Explication</h4><p>${esc(ex.explain)}</p></div>`;
    const links = ex.nlist.map(id => `<button class="fiche-link" data-fiche="${id}"><span class="dot ${status(mastery(id))}"></span><span class="t">${esc(NOTIONS[id].title)}</span>${ICON.chev}</button>`).join("");
    return `<div class="verdict ${cls}"><div class="v-icon">${icon}</div><div><div class="v-title">${title}</div><div class="v-sub">${sub}</div></div></div>${body}
      <div class="side-links"><h4>Fiche${ex.nlist.length > 1 ? "s" : ""} liée${ex.nlist.length > 1 ? "s" : ""}</h4>${links}</div>`;
  }
  function ringHTML(p, st) {
    const r = 52, c = 2 * Math.PI * r;
    return `<div class="ring ${st}"><svg viewBox="0 0 120 120"><circle class="bg" cx="60" cy="60" r="${r}"/><circle class="fg" cx="60" cy="60" r="${r}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - p / 100)).toFixed(1)}"/></svg><div class="lbl">${p}<small>%</small></div></div>`;
  }
  function renderEnd(root) {
    const n = P.ids.length, score = sum(P.res.map(x => x || 0));
    const p = Math.round(score / n * 100), st = p >= 80 ? "good" : p >= 50 ? "mid" : "weak";
    const okN = P.res.filter(x => x >= 0.99).length;
    const touched = {};
    P.ids.forEach((id, i) => EX[id].nlist.forEach(nid => (touched[nid] = touched[nid] || []).push(P.res[i] || 0)));
    const errs = P.ids.filter((id, i) => (P.res[i] || 0) < 0.99);
    const fromPlan = P.origin === "plan" && S.run;
    const weakest = Object.keys(touched).map(id => ({ id, a: avg(touched[id]) })).filter(x => x.a < 0.99).sort((a, b) => a.a - b.a).slice(0, 4);
    root.innerHTML = `
    <section class="view player">
      <div class="card player-main end">
        ${ringHTML(p, st)}
        <h2>${p >= 80 ? "Très bien." : p >= 50 ? "Pas mal. Encore un effort." : "C'est le bon moment pour corriger."}</h2>
        <p>${okN} réponse${okN > 1 ? "s" : ""} parfaite${okN > 1 ? "s" : ""} sur ${n} · ${esc(P.title)}</p>
        <div class="end-chips">${Object.keys(touched).map(id => { const a = avg(touched[id]); return `<button class="end-chip" data-fiche="${id}"><span class="dot ${a >= 0.99 ? "good" : a > 0 ? "mid" : "weak"}"></span>${esc(NOTIONS[id].title)}</button>`; }).join("")}</div>
        <div class="end-actions">
          ${errs.length ? `<button class="btn secondary" id="redo">Refaire ${errs.length > 1 ? "les " + errs.length + " erreurs" : "l'erreur"}</button>` : ""}
          ${fromPlan ? `<button class="btn primary" id="nextBlock">Bloc suivant du plan ${ICON.chev}</button>` : `<button class="btn primary" id="back">Continuer</button>`}
          <button class="btn ghost" id="toBilan">Voir le bilan</button>
        </div>
      </div>
      <aside class="card player-side">
        <div class="side-intro"><h4>À revoir maintenant</h4>${weakest.length ? `<p>Ouvre ces fiches avant de passer à la suite : deux minutes de lecture juste après une erreur valent plus qu'une relecture complète.</p>` : `<p>Aucune erreur sur cette série. Passe à la suite du plan.</p>`}</div>
        ${weakest.length ? `<div class="side-links" style="margin-top:14px">${weakest.map(x => `<button class="fiche-link" data-fiche="${x.id}"><span class="dot ${status(mastery(x.id))}"></span><span class="t">${esc(NOTIONS[x.id].title)}</span>${ICON.chev}</button>`).join("")}</div>` : ""}
      </aside>
    </section>`;
    const rd = $("#redo"); if (rd) rd.onclick = () => startSession({ title: "Correction · " + P.title, ids: shuffle(errs), origin: P.origin, from: P.from });
    const nb = $("#nextBlock"); if (nb) nb.onclick = () => { P = null; advanceRun(); };
    const bk = $("#back"); if (bk) bk.onclick = leaveSession;
    $("#toBilan").onclick = () => { P = null; go("bilan"); };
  }

  /* ---------- Rendus par type ---------- */
  const R = {};
  function recallWrap(inner, t, p, btn) {
    return `<div class="recall-wrap ${S.settings.recall ? "hidden" : ""}" data-rw><div class="recall-target">${inner}</div>
      <div class="recall-cover"><div class="recall-box"><b>${esc(t)}</b><p>${esc(p)}</p><button class="btn primary" data-reveal>${esc(btn || "Afficher les propositions")} <kbd>Espace</kbd></button></div></div></div>`;
  }
  function bindReveal(el) {
    const w = $("[data-rw]", el);
    const reveal = () => { if (w) w.classList.remove("hidden"); };
    const b = $("[data-reveal]", el); if (b) b.onclick = reveal;
    return { reveal, hidden: () => !!(w && w.classList.contains("hidden")) };
  }

  R.qcm = function (ex, el, api) {
    const multi = Array.isArray(ex.answer);
    const ans = multi ? ex.answer : [ex.answer];
    const order = shuffle(ex.options.map((_, i) => i));
    const sel = new Set();
    el.innerHTML = (multi ? `<p class="multi-hint">Plusieurs réponses possibles.</p>` : "") +
      recallWrap(`<div class="opts">${order.map((oi, k) => `<button class="opt" data-i="${oi}"><span class="k">${"ABCD"[k]}</span><span>${esc(ex.options[oi])}</span></button>`).join("")}</div>`,
        "Réponds d'abord de tête", "Formule ta réponse avant de voir les propositions : c'est cet effort qui fait retenir.");
    const rv = bindReveal(el);
    const btns = $$(".opt", el);
    const toggle = i => {
      if (CHECKED) return;
      if (multi) { sel.has(i) ? sel.delete(i) : sel.add(i); } else { sel.clear(); sel.add(i); }
      btns.forEach(b => b.classList.toggle("sel", sel.has(+b.dataset.i)));
      api.ready(sel.size > 0);
    };
    btns.forEach(b => b.onclick = () => toggle(+b.dataset.i));
    return {
      reveal: rv.reveal,
      key(k) {
        const j = "abcd".indexOf(k.toLowerCase()) >= 0 ? "abcd".indexOf(k.toLowerCase()) : "1234".indexOf(k);
        if (j < 0 || j >= order.length) return false;
        if (rv.hidden()) { rv.reveal(); return true; }
        toggle(order[j]); return true;
      },
      check() {
        rv.reveal();
        const ok = ans.filter(a => sel.has(a)).length, bad = [...sel].filter(a => !ans.includes(a)).length;
        const score = multi ? Math.max(0, (ok - bad) / ans.length) : (ok ? 1 : 0);
        btns.forEach(b => { const i = +b.dataset.i; b.classList.remove("sel"); if (ans.includes(i)) b.classList.add("correct"); else if (sel.has(i)) b.classList.add("wrong"); });
        return { score, given: [...sel].map(i => ex.options[i]).join(" / ") || "—", expected: ans.map(i => ex.options[i]).join(" / "), expectedHTML: `<p>${ans.map(i => esc(ex.options[i])).join("<br>")}</p>` };
      }
    };
  };

  R.vf = function (ex, el, api) {
    el.innerHTML = `<div class="vf"><p class="vf-s">${esc(ex.s)}</p><div class="vf-btns"><button class="vf-btn" data-v="1">Vrai <kbd>V</kbd></button><button class="vf-btn" data-v="0">Faux <kbd>F</kbd></button></div></div>`;
    let given = null;
    const btns = $$(".vf-btn", el);
    btns.forEach(b => b.onclick = () => { if (CHECKED) return; given = b.dataset.v === "1"; api.check(); });
    return {
      key(k) { k = k.toLowerCase(); if (k === "v") { btns[0].click(); return true; } if (k === "f") { btns[1].click(); return true; } return false; },
      check() {
        btns.forEach(b => { const v = b.dataset.v === "1"; if (v === ex.a) b.classList.add("correct"); else if (v === given) b.classList.add("wrong"); });
        return { score: given === ex.a ? 1 : 0, given: given == null ? "—" : given ? "Vrai" : "Faux", expected: ex.a ? "Vrai" : "Faux", expectedHTML: `<p><b>${ex.a ? "Vrai" : "Faux"}</b></p>` };
      }
    };
  };

  R.fill = function (ex, el, api) {
    const bits = ex.text.split(/\[\[(.+?)\]\]/);
    const blanks = [];
    let html = "";
    bits.forEach((b, i) => {
      if (i % 2 === 0) { html += esc(b); return; }
      const alts = b.split("|"), k = blanks.length;
      blanks.push(alts);
      const w = Math.max(5, Math.max.apply(null, alts.map(a => a.length)) + 2);
      html += `<input class="blank" data-k="${k}" style="width:${w}ch" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Mot manquant ${k + 1}">`;
    });
    el.innerHTML = `<p class="fill-text">${html}</p><p class="fill-note">${blanks.length > 1 ? blanks.length + " mots à retrouver." : "Un mot à retrouver."}</p>`;
    const inputs = $$(".blank", el);
    const hinted = new Set();
    inputs.forEach((inp, k) => {
      inp.addEventListener("input", () => api.ready(inputs.some(x => x.value.trim())));
      inp.addEventListener("keydown", e => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        if (CHECKED) { api.next(); return; }
        const nxt = inputs.slice(k + 1).find(x => !x.value.trim());
        if (nxt) nxt.focus(); else if (inputs.some(x => x.value.trim())) api.check();
      });
    });
    setTimeout(() => { if (inputs[0] && !CHECKED) inputs[0].focus({ preventScroll: true }); }, 60);
    api.hint(() => {
      inputs.forEach((inp, k) => {
        if (inp.value.trim()) return;
        const a = blanks[k][0];
        inp.placeholder = a.slice(0, 1) + "·".repeat(Math.max(0, a.length - 1));
        hinted.add(k);
      });
      const f = inputs.find(x => !x.value.trim()); if (f) f.focus();
    });
    return {
      check() {
        let typo = false;
        const items = inputs.map((inp, k) => {
          const v = norm(inp.value), alts = blanks[k].map(norm);
          let ok = alts.includes(v);
          if (!ok && v.length >= 5 && alts.some(a => a.length >= 5 && lev(a, v) <= 1)) { ok = true; typo = true; }
          inp.disabled = true;
          inp.classList.add(ok ? "correct" : "wrong");
          if (!ok) inp.insertAdjacentHTML("afterend", `<span class="fix">${esc(blanks[k][0])}</span>`);
          return { r: ok ? (hinted.has(k) ? 0.5 : 1) : 0 };
        });
        const full = esc(ex.text.replace(/\[\[(.+?)\]\]/g, (_, a) => a.split("|")[0]));
        return {
          score: avg(items.map(i => i.r)), typo,
          given: inputs.map(i => i.value.trim() || "∅").join(" · "), expected: blanks.map(b => b[0]).join(" · "),
          expectedHTML: ex.plain ? `<p>${full}</p>` : `<p class="quote">« ${full} »</p>`
        };
      }
    };
  };

  R.part = function (ex, el, api) {
    el.innerHTML = `<div class="pq"><p class="quote">${esc(ex.quote)}</p><div class="part-btns">${[1, 2, 3, 4, 5, 6].map(p => `<button class="part-btn" data-p="${p}"><span class="r">${PARTS[p].roman}</span><span class="l">${esc(PARTS[p].label)}</span></button>`).join("")}</div></div>`;
    let given = null;
    const btns = $$(".part-btn", el);
    btns.forEach(b => b.onclick = () => { if (CHECKED) return; given = +b.dataset.p; api.check(); });
    return {
      key(k) { const n = parseInt(k, 10); if (n >= 1 && n <= 6) { btns[n - 1].click(); return true; } return false; },
      check() {
        btns.forEach(b => { const p = +b.dataset.p; if (p === ex.a) b.classList.add("correct"); else if (p === given) b.classList.add("wrong"); });
        return { score: given === ex.a ? 1 : 0, given: given ? PARTS[given].name : "—", expected: PARTS[ex.a].name, expectedHTML: `<p><b>${esc(PARTS[ex.a].name)}</b> · ${esc(PARTS[ex.a].title)}</p>` };
      }
    };
  };

  function makeSortable(list) {
    let drag = null;
    const gap = () => parseFloat(getComputedStyle(list).rowGap) || 8;
    const move = e => {
      if (!drag) return;
      const it = drag.item;
      it.style.transform = `translateY(${e.clientY - drag.y0}px)`;
      const r = it.getBoundingClientRect(), mid = r.top + r.height / 2;
      const next = it.nextElementSibling, prev = it.previousElementSibling;
      if (next) { const nr = next.getBoundingClientRect(); if (mid > nr.top + nr.height / 2) { list.insertBefore(next, it); drag.y0 += nr.height + gap(); } }
      if (prev) { const pr = prev.getBoundingClientRect(); if (mid < pr.top + pr.height / 2) { list.insertBefore(prev, it.nextElementSibling); drag.y0 -= pr.height + gap(); } }
      it.style.transform = `translateY(${e.clientY - drag.y0}px)`;
    };
    const end = () => {
      if (!drag) return;
      drag.item.style.transform = ""; drag.item.classList.remove("dragging"); drag = null;
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", end); window.removeEventListener("pointercancel", end);
    };
    list.addEventListener("pointerdown", e => {
      if (CHECKED || e.button !== 0) return;
      const item = e.target.closest(".s-item");
      if (!item || e.target.closest("button")) return;
      e.preventDefault();
      drag = { item, y0: e.clientY };
      item.classList.add("dragging");
      window.addEventListener("pointermove", move); window.addEventListener("pointerup", end); window.addEventListener("pointercancel", end);
    });
    CLEAN.push(end);
  }
  R.order = function (ex, el, api) {
    let idx = ex.items.map((_, i) => i);
    do { idx = shuffle(idx); } while (idx.every((v, i) => v === i));
    el.innerHTML = `<ol class="sortable">${idx.map(i => `<li class="s-item" data-i="${i}"><span class="grip">${ICON.grip}</span><span class="num"></span><span class="txt">${esc(ex.items[i])}</span><span class="arrows"><button data-mv="-1" aria-label="Monter">${ICON.up}</button><button data-mv="1" aria-label="Descendre">${ICON.down}</button></span></li>`).join("")}</ol>`;
    const list = $(".sortable", el);
    makeSortable(list);
    list.addEventListener("click", e => {
      const b = e.target.closest("[data-mv]"); if (!b || CHECKED) return;
      const li = b.closest(".s-item");
      if (+b.dataset.mv < 0 && li.previousElementSibling) list.insertBefore(li, li.previousElementSibling);
      if (+b.dataset.mv > 0 && li.nextElementSibling) list.insertBefore(li.nextElementSibling, li);
    });
    api.ready(true);
    return {
      check() {
        const lis = $$(".s-item", list), cur = lis.map(li => +li.dataset.i);
        let ok = 0;
        lis.forEach((li, pos) => {
          const i = +li.dataset.i, good = i === pos;
          ok += good ? 1 : 0;
          li.classList.add(good ? "correct" : "wrong");
          $(".arrows", li).innerHTML = good ? "" : `<span class="should">place ${i + 1}</span>`;
        });
        return { score: ok / cur.length, given: cur.map(i => ex.items[i]).join(" → "), expected: ex.items.join(" → "), expectedHTML: `<ol>${ex.items.map(t => `<li>${esc(t)}</li>`).join("")}</ol>` };
      }
    };
  };

  function observe(target, fn) {
    if (!window.ResizeObserver) { window.addEventListener("resize", fn); CLEAN.push(() => window.removeEventListener("resize", fn)); return; }
    const ro = new ResizeObserver(() => fn());
    ro.observe(target);
    CLEAN.push(() => ro.disconnect());
  }
  R.match = function (ex, el, api) {
    const n = ex.pairs.length;
    const rOrder = shuffle(ex.pairs.map((_, i) => i));
    const COLORS = ["#0071e3", "#5856d6", "#30b0c7", "#ff9f0a", "#af52de", "#a2845e"];
    el.innerHTML = `<div class="match"><svg class="lines"></svg>
      <div class="col l">${ex.pairs.map((p, i) => `<button class="m-item" data-side="l" data-i="${i}"><span>${esc(p.l)}</span><span class="badge"></span></button>`).join("")}</div>
      <div class="col r">${rOrder.map(i => `<button class="m-item" data-side="r" data-i="${i}"><span>${esc(ex.pairs[i].r)}</span><span class="badge"></span></button>`).join("")}</div></div>`;
    const wrap = $(".match", el), svg = $("svg.lines", el);
    const link = {};
    let sel = null, result = null;
    const leftOf = (side, i) => side === "l" ? (i in link ? i : null) : (() => { for (const k in link) if (link[k] === i) return +k; return null; })();
    const unlink = (side, i) => { const L = leftOf(side, i); if (L != null) delete link[L]; };
    wrap.addEventListener("click", e => {
      const b = e.target.closest(".m-item"); if (!b || CHECKED) return;
      const side = b.dataset.side, i = +b.dataset.i;
      if (!sel || sel.side === side) {
        const same = sel && sel.side === side && sel.i === i;
        unlink(side, i);
        sel = same ? null : { side, i };
      } else {
        const L = side === "l" ? i : sel.i, Rr = side === "r" ? i : sel.i;
        unlink("l", L); unlink("r", Rr);
        link[L] = Rr; sel = null;
      }
      draw(); api.ready(Object.keys(link).length === n);
    });
    function draw() {
      const keys = Object.keys(link).map(Number).sort((a, b) => a - b);
      const num = {}; keys.forEach((L, k) => { num[L] = k; });
      const colorOf = L => result ? (result[L] ? "var(--green-mark)" : "var(--red-mark)") : COLORS[num[L] % COLORS.length];
      $$(".m-item", wrap).forEach(b => {
        const side = b.dataset.side, i = +b.dataset.i, L = leftOf(side, i);
        b.classList.toggle("paired", L != null);
        b.classList.toggle("sel", !!sel && sel.side === side && sel.i === i);
        const badge = $(".badge", b);
        if (L != null) { badge.textContent = num[L] + 1; badge.style.background = colorOf(L); }
      });
      const wr = wrap.getBoundingClientRect();
      svg.innerHTML = keys.map(L => {
        const a = $(`.m-item[data-side="l"][data-i="${L}"]`, wrap).getBoundingClientRect();
        const b = $(`.m-item[data-side="r"][data-i="${link[L]}"]`, wrap).getBoundingClientRect();
        const x1 = a.right - wr.left, y1 = a.top + a.height / 2 - wr.top, x2 = b.left - wr.left, y2 = b.top + b.height / 2 - wr.top, mx = (x1 + x2) / 2;
        return `<path d="M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}" stroke="${colorOf(L)}" ${result && !result[L] ? 'stroke-dasharray="5 5"' : ""}/>`;
      }).join("");
    }
    observe(wrap, draw);
    return {
      check() {
        result = {}; let ok = 0;
        ex.pairs.forEach((p, L) => { result[L] = link[L] === L; if (result[L]) ok++; });
        sel = null;
        $$(".m-item", wrap).forEach(b => {
          const L = leftOf(b.dataset.side, +b.dataset.i);
          if (L != null) b.classList.add(result[L] ? "correct" : "wrong"); else b.classList.add("wrong");
        });
        draw();
        const wrong = ex.pairs.map((p, L) => result[L] ? null : p.l + " → " + (link[L] != null ? ex.pairs[link[L]].r : "∅")).filter(Boolean);
        return {
          score: ok / n, items: ex.pairs.map((p, L) => ({ n: p.n, r: result[L] ? 1 : 0, g: p.l + " → " + (link[L] != null ? ex.pairs[link[L]].r : "∅"), e: p.l + " → " + p.r })),
          given: wrong.length ? wrong.join(" ; ") : "Tout juste", expected: ex.pairs.map(p => p.l + " → " + p.r).join(" ; "),
          expectedHTML: `<ul>${ex.pairs.map(p => `<li><b>${esc(p.l)}</b> : ${esc(p.r)}</li>`).join("")}</ul>`
        };
      }
    };
  };

  function tokenMover(el, onChange) {
    /* Sélection par clic + glisser-déposer pour les étiquettes (classer, schéma) */
    let sel = null;
    const zones = () => $$("[data-zone]", el);
    const setSel = tok => { sel = tok; $$(".token", el).forEach(t => t.classList.toggle("sel", t === sel)); zones().forEach(z => z.classList.toggle("target", !!sel && z.dataset.zone !== "bank")); };
    const moveTo = (tok, zone) => {
      const dest = $(".drop", zone) || zone;
      if (zone.dataset.single != null) { const old = $(".token", dest); if (old && old !== tok) $("[data-zone=bank]", el).appendChild(old); }
      dest.appendChild(tok);
      setSel(null); onChange();
    };
    el.addEventListener("click", e => {
      if (CHECKED) return;
      const tok = e.target.closest(".token");
      const zone = e.target.closest("[data-zone]");
      if (tok) {
        const inZone = tok.closest("[data-zone]");
        if (sel && sel !== tok && inZone && inZone.dataset.zone !== "bank" && inZone.dataset.single != null) { moveTo(sel, inZone); return; }
        if (!sel && inZone && inZone.dataset.single != null && inZone.dataset.zone !== "bank") { $("[data-zone=bank]", el).appendChild(tok); onChange(); return; }
        setSel(sel === tok ? null : tok); return;
      }
      if (zone && sel) moveTo(sel, zone);
    });
    el.addEventListener("dragstart", e => { const t = e.target.closest(".token"); if (!t || CHECKED) return; sel = t; t.classList.add("dragging"); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", "x"); } catch (err) { /* */ } });
    el.addEventListener("dragend", e => { const t = e.target.closest(".token"); if (t) t.classList.remove("dragging"); zones().forEach(z => z.classList.remove("over")); });
    el.addEventListener("dragover", e => { const z = e.target.closest("[data-zone]"); if (!z || !sel) return; e.preventDefault(); zones().forEach(x => x.classList.toggle("over", x === z)); });
    el.addEventListener("drop", e => { const z = e.target.closest("[data-zone]"); if (!z || !sel) return; e.preventDefault(); z.classList.remove("over"); const t = sel; moveTo(t, z); t.classList.remove("dragging"); });
  }

  R.sort = function (ex, el, api) {
    const order = shuffle(ex.items.map((_, i) => i));
    el.innerHTML = `<div class="sort-wrap"><div class="pool" data-zone="bank">${order.map(i => `<button class="token" draggable="true" data-i="${i}">${esc(ex.items[i].t)}</button>`).join("")}</div>
      <div class="buckets" style="grid-template-columns:repeat(${ex.buckets.length},minmax(0,1fr))">${ex.buckets.map((b, k) => `<div class="bucket" data-zone="${k}"><h5>${esc(b)}</h5><div class="drop"></div></div>`).join("")}</div></div>`;
    const placeOf = i => { const z = $(`.token[data-i="${i}"]`, el).closest("[data-zone]"); return z.dataset.zone === "bank" ? -1 : +z.dataset.zone; };
    tokenMover(el, () => api.ready(!$(".pool .token", el)));
    return {
      check() {
        let ok = 0;
        const items = ex.items.map((it, i) => {
          const pl = placeOf(i), good = pl === it.b; if (good) ok++;
          const tok = $(`.token[data-i="${i}"]`, el);
          tok.classList.add(good ? "correct" : "wrong"); tok.draggable = false;
          if (!good) tok.insertAdjacentHTML("beforeend", `<span class="should">→ ${esc(ex.buckets[it.b])}</span>`);
          return { n: it.n, r: good ? 1 : 0, g: it.t + " → " + (pl < 0 ? "non classé" : ex.buckets[pl]), e: it.t + " → " + ex.buckets[it.b] };
        });
        const wrong = ex.items.filter((it, i) => placeOf(i) !== it.b).map(it => it.t);
        return {
          score: ok / ex.items.length, items,
          given: wrong.length ? "Mal classés : " + wrong.join(" ; ") : "Tout juste", expected: ex.buckets.map((b, k) => b + " : " + ex.items.filter(x => x.b === k).map(x => x.t).join(", ")).join(" | "),
          expectedHTML: `<ul>${ex.buckets.map((b, k) => `<li><b>${esc(b)}</b> : ${ex.items.filter(x => x.b === k).map(x => esc(x.t)).join(" ; ")}</li>`).join("")}</ul>`
        };
      }
    };
  };

  R.schema = function (ex, el, api) {
    const slots = [];
    const slot = nd => { const k = slots.length; slots.push({ ans: nd.slot, n: nd.n }); return `<div class="slot" data-zone="s${k}" data-single data-s="${k}"></div>`; };
    let canvas = "";
    if (ex.layout === "flow") canvas = `<div class="flow ${ex.nodes.length === 6 ? "n6" : ""}">${ex.nodes.map(nd => `<div class="node ${nd.slot ? "" : "given"}" data-node><span class="cap">${esc(nd.cap)}</span>${nd.slot ? slot(nd) : `<span>${esc(nd.t)}</span>`}</div>`).join("")}</div>`;
    else if (ex.layout === "tree") canvas = `<div class="tree"><div class="tree-root" data-root>${esc(ex.root)}</div><div class="tree-branches">${ex.branches.map(br => `<div class="tree-col">${br.map(nd => `<div class="node ${nd.slot ? "" : "given"}" data-node>${nd.slot ? slot(nd) : `<span>${esc(nd.t)}</span>`}</div>`).join("")}</div>`).join("")}</div></div>`;
    else canvas = `<div class="pictos">${ex.nodes.map(nd => `<div class="picto">${PICTO[nd.icon]}<span class="cap">${esc(nd.cap)}</span>${slot(nd)}</div>`).join("")}</div>`;
    const labels = shuffle(slots.map(s => s.ans).concat(ex.distract || []));
    el.innerHTML = `<div class="schema"><div class="sch-canvas"><svg class="lines"></svg>${canvas}</div><div class="bank" data-zone="bank">${labels.map(t => `<button class="token" draggable="true">${esc(t)}</button>`).join("")}</div></div>`;
    const tokText = new Map();
    $$(".bank .token", el).forEach((t, j) => tokText.set(t, labels[j]));
    tokenMover(el, () => { $$(".slot", el).forEach(s => s.classList.toggle("filled", !!$(".token", s))); api.ready(slots.every((_, k) => $(`.slot[data-s="${k}"] .token`, el))); });
    const canvasEl = $(".sch-canvas", el), svg = $("svg.lines", el);
    function draw() {
      if (ex.layout === "pictos") return;
      const cr = canvasEl.getBoundingClientRect();
      const rel = r => ({ l: r.left - cr.left, r: r.right - cr.left, t: r.top - cr.top, b: r.bottom - cr.top, cx: r.left - cr.left + r.width / 2, cy: r.top - cr.top + r.height / 2 });
      const paths = [];
      const nodes = $$("[data-node]", el).map(n => rel(n.getBoundingClientRect()));
      if (ex.layout === "flow") {
        for (let i = 0; i < nodes.length - 1; i++) {
          const a = nodes[i], b = nodes[i + 1];
          if (Math.abs(a.t - b.t) < 8) paths.push(`M${a.r + 4} ${a.cy} L${b.l - 6} ${b.cy}`);
          else paths.push(`M${a.cx} ${a.b + 4} C${a.cx} ${a.b + 26} ${b.cx} ${b.t - 26} ${b.cx} ${b.t - 6}`);
        }
      } else {
        const root = rel($("[data-root]", el).getBoundingClientRect());
        $$(".tree-col", el).forEach(col => {
          const ns = $$("[data-node]", col).map(n => rel(n.getBoundingClientRect()));
          if (ns[0]) paths.push(`M${root.cx} ${root.b + 4} C${root.cx} ${root.b + 22} ${ns[0].cx} ${ns[0].t - 22} ${ns[0].cx} ${ns[0].t - 6}`);
          for (let i = 0; i < ns.length - 1; i++) paths.push(`M${ns[i].cx} ${ns[i].b + 4} L${ns[i + 1].cx} ${ns[i + 1].t - 6}`);
        });
      }
      svg.innerHTML = `<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L8 5L1 9" fill="none" stroke="#c7c7cc" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>` + paths.map(d => `<path d="${d}" marker-end="url(#ah)"/>`).join("");
    }
    observe(canvasEl, draw);
    return {
      check() {
        let ok = 0;
        const items = slots.map((s, k) => {
          const sl = $(`.slot[data-s="${k}"]`, el), tok = $(".token", sl);
          const good = !!tok && tokText.get(tok) === s.ans; if (good) ok++;
          sl.classList.add(good ? "correct" : "wrong");
          if (!good) sl.insertAdjacentHTML("beforeend", `<span class="fixline">→ ${esc(s.ans)}</span>`);
          return { n: s.n, r: good ? 1 : 0, g: "case « " + s.ans + " » remplie par : " + (tok ? tokText.get(tok) : "rien"), e: s.ans };
        });
        $$(".token", el).forEach(t => { t.draggable = false; });
        return {
          score: ok / slots.length, items,
          given: slots.map((s, k) => { const t = $(`.slot[data-s="${k}"] .token`, el); return t ? tokText.get(t) : "∅"; }).join(" ; "),
          expected: slots.map(s => s.ans).join(" ; "),
          expectedHTML: `<ul>${slots.map(s => `<li>${esc(s.ans)}</li>`).join("")}</ul>${ex.distract ? `<p style="margin-top:8px" class="small muted">Pièges : ${ex.distract.map(esc).join(", ")}.</p>` : ""}`
        };
      }
    };
  };

  R.grid = function (ex, el, api) {
    const val = ex.rows.map(r => r.a.map(() => null));
    el.innerHTML = `<table class="grid-ex"><thead><tr><th></th>${ex.cols.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${ex.rows.map((r, i) => `<tr><td class="t">${esc(r.t)}</td>${r.a.map((_, j) => `<td class="c"><button class="cell" data-r="${i}" data-c="${j}" aria-label="${esc(r.t)} : ${esc(ex.cols[j])}"></button></td>`).join("")}</tr>`).join("")}</tbody></table>`;
    $$(".cell", el).forEach(c => c.onclick = () => {
      if (CHECKED) return;
      const i = +c.dataset.r, j = +c.dataset.c, v = val[i][j];
      val[i][j] = v == null ? 1 : v === 1 ? 0 : null;
      c.textContent = val[i][j] == null ? "" : val[i][j] ? "✓" : "✗";
      c.className = "cell" + (val[i][j] == null ? "" : val[i][j] ? " yes" : " no");
      api.ready(val.every(row => row.every(x => x != null)));
    });
    return {
      check() {
        let ok = 0, tot = 0;
        const items = ex.rows.map((r, i) => {
          let rowOk = 0;
          r.a.forEach((a, j) => {
            tot++;
            const good = val[i][j] === a; if (good) { ok++; rowOk++; }
            const c = $(`.cell[data-r="${i}"][data-c="${j}"]`, el);
            c.classList.add(good ? "correct" : "wrong");
            if (!good) { c.textContent = a ? "✓" : "✗"; c.classList.remove("yes", "no"); c.classList.add(a ? "yes" : "no"); }
          });
          const mark = v => v == null ? "?" : v ? "✓" : "✗";
          return { n: r.n, r: rowOk / r.a.length, g: r.t + " : " + ex.cols.map((c, j) => c + " " + mark(val[i][j])).join(", "), e: r.t + " : " + ex.cols.map((c, j) => c + " " + mark(r.a[j])).join(", ") };
        });
        return {
          score: ok / tot, items,
          given: ex.rows.map((r, i) => r.t + " : " + val[i].map(v => v == null ? "?" : v ? "✓" : "✗").join("")).join(" | "),
          expected: ex.rows.map(r => r.t + " : " + r.a.map(v => v ? "✓" : "✗").join("")).join(" | "),
          expectedHTML: `<p>Les cases corrigées apparaissent en rouge dans le tableau, avec la bonne valeur.</p>`
        };
      }
    };
  };

  R.flash = function (ex, el, api) {
    el.innerHTML = `<div class="flash"><div class="flash-card"><div class="f">${esc(ex.f)}</div><div class="b" hidden>${esc(ex.b)}</div></div><div id="flashAct"><button class="btn primary lg" id="flip">Retourner la carte <kbd>Espace</kbd></button></div></div>`;
    let flipped = false, rating = null;
    function flip() {
      if (flipped) return;
      flipped = true;
      $(".b", el).hidden = false;
      $("#flashAct", el).innerHTML = `<div class="flash-rate"><button class="btn rate-0" data-r="0">Je ne savais pas <kbd>1</kbd></button><button class="btn rate-1" data-r="0.5">À moitié <kbd>2</kbd></button><button class="btn rate-2" data-r="1">Je savais <kbd>3</kbd></button></div>`;
      $$("[data-r]", el).forEach(b => b.onclick = () => rate(+b.dataset.r));
    }
    function rate(r) { if (CHECKED) return; rating = r; api.check(); api.next(); }
    $("#flip", el).onclick = flip;
    return {
      reveal: flip,
      key(k) { if (!flipped) return false; const m = { 1: 0, 2: 0.5, 3: 1 }; if (k in m) { rate(m[k]); return true; } return false; },
      check() { return { score: rating == null ? 0 : rating, given: rating == null ? "—" : ["Je ne savais pas", "À moitié", "Je savais"][rating * 2], expected: ex.b }; }
    };
  };

  R.build = function (ex, el, api) {
    const order = shuffle(ex.els.map((_, i) => i));
    const sel = new Set();
    const nOk = ex.els.filter(x => x.ok).length;
    el.innerHTML = `<p class="build-hint">Sélectionne les ${nOk} éléments qui ont leur place dans ta réponse.</p>` +
      recallWrap(`<div class="build-grid">${order.map(i => `<button class="el" data-i="${i}"><span class="ck">${ICON.check}</span><span class="tx">${esc(ex.els[i].t)}</span></button>`).join("")}</div>`,
        "Réfléchis d'abord", "Avant de voir les propositions, cherche de tête trois ou quatre arguments et une citation. Note-les au brouillon si tu veux.", "Afficher les éléments");
    const rv = bindReveal(el);
    const btns = $$(".el", el);
    btns.forEach(b => b.onclick = () => {
      if (CHECKED) return;
      const i = +b.dataset.i;
      sel.has(i) ? sel.delete(i) : sel.add(i);
      b.classList.toggle("sel", sel.has(i));
      api.ready(sel.size > 0);
    });
    return {
      reveal: rv.reveal,
      check() {
        rv.reveal();
        let good = 0, bad = 0;
        btns.forEach(b => {
          const i = +b.dataset.i, it = ex.els[i], s = sel.has(i);
          b.classList.remove("sel");
          if (it.ok && s) { b.classList.add("correct"); good++; }
          else if (it.ok) { b.classList.add("missed"); $(".tx", b).insertAdjacentHTML("beforeend", `<span class="miss">Oublié</span>`); }
          else if (s) { b.classList.add("wrong"); bad++; $(".tx", b).insertAdjacentHTML("beforeend", `<span class="why">${esc(it.why)}</span>`); }
          else b.classList.add("dim");
        });
        return {
          score: Math.max(0, (good - bad) / nOk),
          given: [...sel].map(i => (ex.els[i].ok ? "✓ " : "✗ ") + ex.els[i].t).join(" ; ") || "—",
          expected: ex.els.filter(x => x.ok).map(x => x.t).join(" ; "),
          expectedTitle: "Plan modèle",
          expectedHTML: `<p><b>Problématique.</b> ${esc(ex.prob)}</p><ol style="margin-top:10px">${ex.plan.map(x => `<li>${esc(x)}</li>`).join("")}</ol><p class="quote" style="margin-top:12px">« ${esc(ex.cit)} »</p>`
        };
      }
    };
  };

  /* =========================================================
     Bilan & export
     ========================================================= */
  function stats() {
    const byEx = {};
    S.attempts.forEach(a => { const k = a.ex + "@" + a.t; (byEx[k] = byEx[k] || []).push(a.r); });
    const vals = Object.values(byEx).map(avg);
    return { answered: vals.length, acc: vals.length ? Math.round(avg(vals) * 100) : 0 };
  }
  VIEWS.bilan = function (root) {
    const mm = masteryMap();
    const g = Math.round(globalScore() * 100);
    const st = g >= 80 ? "good" : g >= 50 ? "mid" : "weak";
    const tested = NIDS.filter(id => mm[id] != null).length;
    const { answered, acc } = stats();
    const caption = !answered ? "Rien encore : lance le diagnostic, puis suis le plan." : g < 35 ? "Tu débutes. Suis le plan : diagnostic, lecture, exercices." : g < 60 ? "Les bases sont là. Concentre-toi sur les notions en rouge." : g < 80 ? "Bonne préparation. Consolide les dernières notions fragiles." : "Tu es prêt. Une simulation de contrôle, puis au lit.";
    const errsBy = {};
    errorIds().forEach(id => EX[id].nlist.forEach(n => { errsBy[n] = (errsBy[n] || 0) + 1; }));
    const weak = rankWeak();
    root.innerHTML = `
    <section class="view bilan">
      <div class="card b-over">
        <div class="eyebrow">Préparation globale</div>
        ${ringHTML(g, answered ? st : "")}
        <p class="caption">${esc(caption)}</p>
        <div class="b-stats"><div><b>${tested}/${NIDS.length}</b><span>notions testées</span></div><div><b>${answered}</b><span>exercices faits</span></div><div><b>${acc} %</b><span>de réussite</span></div></div>
        <div class="b-actions">
          <button class="btn primary" id="pdf">Exporter le PDF</button>
          <button class="btn secondary" id="copy">Copier le bilan pour Claude</button>
          <div style="display:flex;gap:4px;justify-content:center"><button class="btn ghost sm" id="txt">Télécharger en .txt</button><button class="btn ghost gray sm" id="reset">Réinitialiser</button></div>
        </div>
      </div>
      <div class="card b-parts"><h3>Par partie</h3><p class="small muted" style="margin-top:4px">Moyenne de maîtrise des notions ; une notion non testée compte zéro.</p>
        <div class="bp-list">${[0, 1, 2, 3, 4, 5, 6].map(p => { const sc = partScore(p); const has = NIDS.some(id => NOTIONS[id].part === p && mm[id] != null); const s = status(has ? sc : null); const nb = NIDS.filter(id => NOTIONS[id].part === p).length;
          return `<button class="bp-row" data-part="${p}"><span class="r">${p ? PARTS[p].roman : "·"}</span><div><div class="t">${esc(p ? PARTS[p].label : "Contexte")}<span>${nb} notion${nb > 1 ? "s" : ""}</span></div><div class="bar ${s}"><i style="width:${pct(sc)}%"></i></div></div><span class="p">${has ? pct(sc) + " %" : "—"}</span></button>`; }).join("")}</div>
      </div>
      <div class="card b-weak">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px"><h3>À retravailler en priorité</h3><span class="small muted">rouge, puis orange, puis non testé</span></div>
        ${weak.length ? `<ul class="bw-list">${weak.map(x => { const s = status(x.m), e = errsBy[x.id] || 0;
          return `<li class="bw-row"><span class="dot ${s}"></span><div style="min-width:0"><div class="t">${esc(NOTIONS[x.id].title)}</div><div class="s">${esc(partLabel(NOTIONS[x.id].part))} · ${x.m == null ? "non testé" : pct(x.m) + " %"}${e ? " · " + e + " erreur" + (e > 1 ? "s" : "") : ""}</div></div>
            <div class="acts"><button class="btn ghost sm" data-fiche="${x.id}">Fiche</button><a class="btn ghost sm" href="${yt(NOTIONS[x.id].video)}" target="_blank" rel="noopener">Vidéos</a><button class="btn ghost sm" data-train-notion="${x.id}">S'entraîner</button></div></li>`; }).join("")}</ul>`
          : `<div class="empty"><div><b style="color:var(--text);font-size:17px">Tout est acquis.</b><span>Toutes les notions sont au vert. Fais une simulation de contrôle pour vérifier.</span><button class="btn primary" id="toSim">Simulation</button></div></div>`}
      </div>
    </section>`;
    $$(".bp-row").forEach(b => b.onclick = () => go("carte", { part: +b.dataset.part }));
    $("#pdf").onclick = exportPDF;
    $("#copy").onclick = () => copyText(buildReport().text);
    $("#txt").onclick = () => downloadText(buildReport().text);
    $("#reset").onclick = () => { if (confirm("Effacer toute ta progression (réponses, plan, session) ?")) { S = defaults(); MC = null; save(); P = null; toast("Progression effacée."); render(); } };
    const ts = $("#toSim"); if (ts) ts.onclick = () => startSession({ title: "Simulation de contrôle", ids: pickBuild(4), from: "reflexion" });
  };

  function buildReport() {
    const mm = masteryMap();
    const date = new Date().toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" });
    const g = Math.round(globalScore() * 100);
    const tested = NIDS.filter(id => mm[id] != null).length;
    const { answered, acc } = stats();
    const latest = {};
    S.attempts.forEach(a => { latest[a.ex + "|" + a.n] = a; });
    const errs = {};
    Object.values(latest).forEach(a => { if (a.r < 0.99) (errs[a.n] = errs[a.n] || []).push(a); });
    const ranked = NIDS.map(id => ({ id, m: mm[id] })).sort((a, b) => (a.m == null ? 2 : a.m) - (b.m == null ? 2 : b.m));
    const weak = ranked.filter(x => x.m != null && x.m < 0.8);
    const untested = ranked.filter(x => x.m == null);
    const prompt = [
      "Bonjour Claude. Demain, j'ai un contrôle de lecture de philosophie sur le Discours de la méthode de Descartes : 4 questions de réflexion en 1 heure. Voici le bilan de mon entraînement (notions fragiles et erreurs non corrigées).",
      "1. Pour chaque notion fragile, fais-moi une fiche courte : l'idée en deux phrases, l'argument étape par étape, la citation à connaître, le piège à éviter.",
      "2. Explique-moi précisément pourquoi chacune de mes erreurs est une erreur.",
      "3. Propose-moi deux questions de contrôle possibles sur ces notions, avec pour chacune une problématique et un plan en trois points.",
      "4. Termine par 5 questions de vérification rapide, sans les réponses : je te renverrai mes réponses."
    ].join("\n");

    // Texte
    const L = [];
    L.push("BILAN DE RÉVISION · Discours de la méthode (Descartes)");
    L.push("Généré le " + date);
    L.push(`Préparation globale : ${g} % · notions testées : ${tested}/${NIDS.length} · exercices faits : ${answered} · réussite : ${acc} %`);
    L.push("");
    L.push("MAÎTRISE PAR NOTION (de la plus fragile à la plus solide)");
    ranked.forEach(x => L.push(`- [${STATUS_LABEL[status(x.m)]}] ${NOTIONS[x.id].title} (${partLabel(NOTIONS[x.id].part)}) : ${x.m == null ? "non testé" : pct(x.m) + " %"}`));
    L.push("");
    L.push("NOTIONS À RETRAVAILLER ET ERREURS NON CORRIGÉES");
    if (!weak.length) L.push("Aucune notion fragile parmi celles testées.");
    weak.forEach(x => {
      L.push(`\n■ ${NOTIONS[x.id].title} (${partLabel(NOTIONS[x.id].part)}) : ${pct(x.m)} %`);
      (errs[x.id] || []).forEach(a => { L.push("  Question : " + a.q); L.push("  Ma réponse : " + a.g); L.push("  Attendu : " + a.e); });
    });
    const otherErr = Object.keys(errs).filter(id => !weak.some(w => w.id === id));
    if (otherErr.length) {
      L.push("\nAUTRES ERREURS NON CORRIGÉES (notions par ailleurs acquises)");
      otherErr.forEach(id => (errs[id] || []).forEach(a => { L.push(`- ${NOTIONS[id].title} · ${a.q}`); L.push("  Ma réponse : " + a.g + " · Attendu : " + a.e); }));
    }
    L.push("");
    L.push("NOTIONS JAMAIS TESTÉES : " + (untested.length ? untested.map(x => NOTIONS[x.id].title).join(", ") : "aucune"));
    L.push("");
    L.push("DEMANDE À CLAUDE");
    L.push(prompt);
    const text = L.join("\n");

    // HTML (impression)
    const h = [];
    h.push(`<div class="pr-head"><h1>Bilan de révision</h1><p>Discours de la méthode, Descartes · ${esc(date)}</p></div>`);
    h.push(`<div class="pr-stats"><div><b>${g} %</b><span>préparation globale</span></div><div><b>${tested}/${NIDS.length}</b><span>notions testées</span></div><div><b>${answered}</b><span>exercices faits</span></div><div><b>${acc} %</b><span>de réussite</span></div></div>`);
    h.push(`<h2>1. Notions à retravailler et erreurs</h2>`);
    if (!weak.length) h.push(`<p>Aucune notion fragile parmi celles testées.</p>`);
    weak.forEach(x => {
      const n = NOTIONS[x.id];
      h.push(`<div class="pr-notion"><h3><span>${esc(n.title)} · ${esc(partLabel(n.part))}</span><span>${pct(x.m)} %</span></h3><p>${esc(n.essentiel)}</p>${(errs[x.id] || []).map(a => `<div class="pr-err"><div class="q">${esc(a.q)}</div><div class="g">Ma réponse : ${esc(a.g)}</div><div class="e">Attendu : ${esc(a.e)}</div></div>`).join("")}</div>`);
    });
    if (otherErr.length) {
      h.push(`<h2>Autres erreurs non corrigées</h2>`);
      otherErr.forEach(id => (errs[id] || []).forEach(a => h.push(`<div class="pr-err"><div class="q">${esc(NOTIONS[id].title)} · ${esc(a.q)}</div><div class="g">Ma réponse : ${esc(a.g)}</div><div class="e">Attendu : ${esc(a.e)}</div></div>`)));
    }
    h.push(`<h2>2. Maîtrise par notion</h2><table><thead><tr><th>Notion</th><th>Partie</th><th>Statut</th><th>Maîtrise</th></tr></thead><tbody>${ranked.map(x => `<tr><td>${esc(NOTIONS[x.id].title)}</td><td>${esc(partLabel(NOTIONS[x.id].part))}</td><td>${STATUS_LABEL[status(x.m)]}</td><td>${x.m == null ? "—" : pct(x.m) + " %"}</td></tr>`).join("")}</tbody></table>`);
    h.push(`<h2>3. Demande à Claude</h2><div class="pr-prompt">${esc(prompt)}</div>`);
    return { text, html: h.join("") };
  }
  function exportPDF() {
    if (!S.attempts.length) { toast("Fais d'abord quelques exercices."); return; }
    $("#print").innerHTML = buildReport().html;
    toast("Choisis « Enregistrer au format PDF » comme imprimante.");
    setTimeout(() => window.print(), 350);
  }
  function copyText(text) {
    const done = () => toast("Bilan copié : colle-le dans ta conversation avec Claude.");
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).then(done, () => fallback()); } else fallback();
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { toast("Copie impossible : utilise le téléchargement .txt."); }
      ta.remove();
    }
  }
  function downloadText(text) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    a.download = "bilan-descartes.txt";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  /* =========================================================
     Écouteurs globaux
     ========================================================= */
  document.addEventListener("click", e => {
    const f = e.target.closest("[data-fiche]");
    if (f) { e.preventDefault(); openFiche(f.dataset.fiche); return; }
    const t = e.target.closest("[data-train-notion]");
    if (t) {
      const id = t.dataset.trainNotion;
      startSession({ title: "Notion · " + NOTIONS[id].title, ids: pickSmart(6, x => x.nlist.includes(id)) });
    }
  });
  document.addEventListener("keydown", e => {
    const modalOpen = !$("#modal").hidden;
    if (e.key === "Escape" && modalOpen) { closeModal(); return; }
    if (VIEW !== "player" || !P || P.done || modalOpen) return;
    const tag = e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "Enter") {
      e.preventDefault();
      if (CHECKED) nextEx();
      else { const v = $("#validate"); if (v && !v.hidden && !v.disabled) doCheck(false); }
      return;
    }
    if (e.key === " ") { e.preventDefault(); if (!CHECKED && CTRL && CTRL.reveal) CTRL.reveal(); return; }
    if (!CHECKED && CTRL && CTRL.key && CTRL.key(e.key)) e.preventDefault();
  }, true);
  window.addEventListener("afterprint", () => { $("#print").innerHTML = ""; });

  /* Accès console, pour tester un exercice précis : Methode.start(["schema-1"]) */
  window.Methode = { start: ids => startSession({ title: "Test", ids }), ids: () => Object.keys(EX), report: () => buildReport().text };

  go("plan");
})();
