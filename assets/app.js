(function () {
  "use strict";

  /* =========================================================
     Bibliothèque (livres et leçons) et chargement à la demande
     ========================================================= */
  const LIB = ((window.RECTO_LIBRARY && window.RECTO_LIBRARY.items) || []).map(m => Object.assign({ type: "livre" }, m));
  const BOOKS = {}, WAIT = {};
  window.Recto = {
    add(id, data) {
      BOOKS[id] = prepareBook(id, data);
      const list = WAIT[id] || []; delete WAIT[id];
      list.forEach(f => f());
    }
  };
  const KIND = {
    livre: { one: "Livre", many: "Livres", the: "le livre", all: "tout le livre", this: "ce livre", in: "dans le livre" },
    lecon: { one: "Leçon", many: "Leçons", the: "la leçon", all: "toute la leçon", this: "cette leçon", in: "dans la leçon" }
  };
  function loadBook(id, cb) {
    if (BOOKS[id]) return cb();
    const meta = LIB.find(b => b.id === id);
    if (!meta) return cb(new Error("unknown"));
    (WAIT[id] = WAIT[id] || []).push(cb);
    if (WAIT[id].length > 1) return;
    const s = document.createElement("script");
    s.src = meta.file + "?v=4";
    s.onerror = () => { const l = WAIT[id] || []; delete WAIT[id]; l.forEach(f => f(new Error("load"))); };
    document.head.appendChild(s);
  }
  function prepareBook(id, d) {
    const meta = LIB.find(b => b.id === id) || { id, title: id };
    const EXm = {};
    d.exercises.forEach(e => {
      if (e.part == null && e.notion) e.part = d.notions[e.notion].part;
      e.nlist = collectNotions(e);
      if (e.cite == null) e.cite = e.type === "part" || (e.type === "fill" && !e.plain);
      EXm[e.id] = e;
    });
    const CHs = d.parts.filter(p => p.n > 0).map(p => p.n).sort((a, b) => a - b);
    return Object.assign({ id, meta, unit: { one: "chapitre", many: "chapitres" }, exam: {}, plan: {}, tips: [], overview: null }, d, { EX: EXm, NIDS: Object.keys(d.notions), CH: CHs });
  }
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

  /* Contenu courant, livre ou leçon (le moteur lit ces variables) */
  let B = null, PARTS = [], NOTIONS = {}, READING = {}, EXS = [], NIDS = [], EX = {}, CH = [], U = { one: "chapitre", many: "chapitres" }, W = KIND.livre;

  const TYPES = {
    qcm: { label: "QCM", help: "Choisis la bonne réponse. Avec le rappel actif, formule-la d'abord dans ta tête : c'est cet effort de rappel qui fixe la mémoire.", keys: "A à D (ou 1 à 4) pour choisir · Entrée pour valider" },
    vf: { label: "Vrai ou faux", help: "Tranche vite, puis lis la justification : c'est elle qui compte.", keys: "V ou F pour répondre · Entrée pour continuer" },
    fill: { label: "Texte à trous", help: "Tape les mots manquants. Accents et majuscules facultatifs ; une petite faute de frappe est tolérée.", keys: "Entrée : champ suivant, puis valider" },
    part: { label: "Quelle partie ?", help: "Situe la phrase dans le texte. Savoir d'où vient une citation, c'est pouvoir s'en servir à l'épreuve.", keys: "Chiffre du chapitre pour répondre" },
    order: { label: "Remettre dans l'ordre", help: "Fais glisser les étiquettes, ou utilise les flèches, pour rétablir l'ordre.", keys: "Entrée pour valider" },
    match: { label: "Associer", help: "Clique un élément à gauche, puis son correspondant à droite. Clique un élément déjà relié pour défaire le lien.", keys: "Entrée pour valider" },
    sort: { label: "Classer", help: "Clique une étiquette, puis la colonne où elle va. Tu peux aussi la faire glisser.", keys: "Entrée pour valider" },
    schema: { label: "Schéma à compléter", help: "Place les étiquettes dans les cases vides. Attention : certaines étiquettes sont des pièges.", keys: "Clique une étiquette, puis une case · Entrée pour valider" },
    grid: { label: "Tableau à compléter", help: "Clique chaque case pour alterner entre ✓ et ✗.", keys: "Entrée pour valider" },
    flash: { label: "Carte mémoire", help: "Réponds à voix haute avant de retourner la carte, puis note-toi honnêtement.", keys: "Espace pour retourner · 1, 2 ou 3 pour noter" },
    build: { label: "Construire la réponse", help: "À l'épreuve, chaque question attend des arguments précis. Sélectionne ceux qui ont leur place dans ta réponse, ni plus ni moins.", keys: "Entrée pour valider" }
  };
  const QUICK = ["qcm", "vf", "part", "fill"];
  const VISUAL = ["order", "match", "sort", "schema", "grid"];
  const STATUS_LABEL = { new: "Non testé", weak: "À revoir", mid: "Fragile", good: "Acquis" };
  const MODE_LABEL = { express: "Express", ess: "Essentiel", full: "Intégrale" };
  /* Logo Recto : une fiche bristol dont le coin se retourne */
  const LOGO = '<svg class="logo" viewBox="0 0 24 24" aria-hidden="true"><path class="logo-card" d="M4.5 5h15A2.5 2.5 0 0 1 22 7.5V13l-6 6H4.5A2.5 2.5 0 0 1 2 16.5v-9A2.5 2.5 0 0 1 4.5 5z"/><path class="logo-fold" d="M22 13h-3.5a2.5 2.5 0 0 0-2.5 2.5V19z"/></svg>';

  /* Icônes réduites au strict nécessaire */
  const ICON = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path d="M3.5 10.5L12 3.8l8.5 6.7V19a1.5 1.5 0 0 1-1.5 1.5h-4.2v-5.8H9.2v5.8H5A1.5 1.5 0 0 1 3.5 19z"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h9.5M18.5 7H20M4 17h3.5M12.5 17H20"/><circle cx="16" cy="7" r="2.3"/><circle cx="10" cy="17" r="2.3"/></svg>',
    library: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><rect x="3.5" y="4" width="4.2" height="16" rx="1"/><rect x="9.7" y="4" width="4.2" height="16" rx="1"/><path d="M15.9 5.6l3.9-1 3 14.6-3.9 1z"/></svg>',
    close: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>',
    check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>',
    cross: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7"/></svg>',
    half: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 8h8"/></svg>',
    ext: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3H3.5v9.5H13V9M9.5 3H13v3.5M13 3L7.5 8.5"/></svg>',
    chev: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5L10.5 8 6 12.5"/></svg>',
    back: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3.5L5.5 8l4.5 4.5"/></svg>',
    up: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10l4-4 4 4"/></svg>',
    down: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>',
    grip: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="5.5" cy="4" r="1.3"/><circle cx="10.5" cy="4" r="1.3"/><circle cx="5.5" cy="8" r="1.3"/><circle cx="10.5" cy="8" r="1.3"/><circle cx="5.5" cy="12" r="1.3"/><circle cx="10.5" cy="12" r="1.3"/></svg>'
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
  function fmtHMS(ms) { let s = Math.max(0, Math.round(ms / 1000)); const h = Math.floor(s / 3600); s -= h * 3600; const m = Math.floor(s / 60); s %= 60; return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0"); }
  function fmtLeft(ms) { const m = Math.max(0, Math.ceil(ms / 60000)); return m < 60 ? m + " min" : Math.floor(m / 60) + " h " + String(m % 60).padStart(2, "0"); }
  function nextFive() { const d = new Date(); d.setSeconds(0, 0); d.setMinutes(Math.ceil(d.getMinutes() / 5) * 5); return d.getTime(); }
  const partLabel = p => p ? PARTS[p].name : "Contexte";
  const yt = q => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2600); }

  /* =========================================================
     Stockage : réglages communs + un état par livre
     ========================================================= */
  const K_SET = "recto.settings", K_LAST = "recto.last", kBook = id => "recto.item." + id, kSum = id => "recto.summary." + id;
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  };
  (function migrate() {
    /* Reprend la progression des versions précédentes (« Méthode », puis « Ergo ») */
    const D = "discours-de-la-methode";
    if (!store.get(kBook(D))) {
      const ergo = store.get("ergo.book." + D), old = store.get("methode-descartes-v1");
      if (ergo) store.set(kBook(D), ergo);
      else if (old) store.set(kBook(D), { attempts: old.attempts || [], plan: old.plan, run: old.run, checks: old.checks || {} });
    }
    if (!store.get(K_SET)) {
      const s = store.get("ergo.settings") || (store.get("methode-descartes-v1") || {}).settings;
      if (s) store.set(K_SET, s);
    }
    if (!store.get(K_LAST) && store.get("ergo.last")) store.set(K_LAST, store.get("ergo.last"));
  })();
  const G = Object.assign({ recall: true, len: 12, noQuotes: false, fx: 2, motion: "auto", days: [], celebrated: "" }, store.get(K_SET) || {});
  /* Effets visuels : fx.js s'il est chargé, sinon des fonctions vides */
  const X = window.FX || new Proxy({}, { get: () => () => 0 });
  function applyFx() {
    if (window.FX) { FX.setLevel(G.fx); FX.setMotion(G.motion); }
    document.body.classList.toggle("fx-off", G.fx === 0);
    document.body.classList.toggle("fx-reduce", !!(window.FX && FX.reduced()));
  }
  applyFx();
  let S = null;
  function bookDefaults() { return { attempts: [], plan: { duration: 60, read: (B.plan.defaultRead || []).slice() }, run: null, checks: {}, ach: {}, best: 0, maxErr: 0 }; }
  function loadState(id) {
    const d = bookDefaults(), o = store.get(kBook(id));
    if (!o || typeof o !== "object") return d;
    return Object.assign(d, o, { plan: Object.assign(d.plan, o.plan || {}), checks: o.checks || {}, ach: o.ach || {} });
  }
  function save() {
    store.set(K_SET, G);
    if (!B || !S) return;
    store.set(kBook(B.id), S);
    saveSummary();
  }
  function saveSummary() {
    store.set(kSum(B.id), { pct: Math.round(globalScore() * 100), tested: NIDS.filter(id => mastery(id) != null).length, total: NIDS.length, answered: stats().answered, at: Date.now() });
  }
  function useBook(id) {
    if (B && B.id === id) return;
    B = BOOKS[id];
    PARTS = B.parts; NOTIONS = B.notions; READING = B.reading; EXS = B.exercises; NIDS = B.NIDS; EX = B.EX; CH = B.CH; U = B.unit; W = KIND[B.meta.type] || KIND.livre;
    S = loadState(id); MC = null; P = null; PLAN_SEL = null;
    pickState.parts.clear(); pickState.types.clear();
    store.set(K_LAST, id);
    saveSummary();
  }
  const avail = e => !(G.noQuotes && e.cite);

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
  const partTested = p => NIDS.some(id => NOTIONS[id].part === p && mastery(id) != null);
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
    return Object.keys(last).filter(id => EX[id] && avail(EX[id]) && last[id].r < 0.99).sort((a, b) => last[b].t - last[a].t);
  }
  function rankWeak() {
    const mm = masteryMap();
    const arr = NIDS.map(id => ({ id, m: mm[id] }));
    return [...arr.filter(x => x.m != null && x.m < 0.8).sort((a, b) => a.m - b.m), ...arr.filter(x => x.m == null)];
  }
  function stats() {
    const byEx = {};
    S.attempts.forEach(a => { const k = a.ex + "@" + a.t; (byEx[k] = byEx[k] || []).push(a.r); });
    const vals = Object.values(byEx).map(avg);
    return { answered: vals.length, acc: vals.length ? Math.round(avg(vals) * 100) : 0 };
  }

  function shortQ(ex) {
    switch (ex.type) {
      case "vf": return "Vrai ou faux : " + ex.s;
      case "fill": return "Compléter : " + ex.text.replace(/\[\[(.+?)\]\]/g, "____");
      case "part": return "D'où vient : « " + ex.quote + " »";
      case "flash": return ex.f;
      default: return ex.q;
    }
  }
  function dayKey(d) { d = d || new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function dayStreak() {
    const set = new Set(G.days); const d = new Date(); let n = 0;
    if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
    while (set.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function record(ex, res) {
    const t = Date.now();
    const dk = dayKey(); if (!G.days.includes(dk)) { G.days.push(dk); G.days = G.days.slice(-120); }
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
    const pool = EXS.filter(e => avail(e) && (allowBuild || e.type !== "build") && (!filter || filter(e)));
    const scored = pool.map(e => {
      let pr = 1 - avg(e.nlist.map(id => { const m = mastery(id); return m == null ? 0.35 : m; }));
      const l = last[e.id];
      if (!l) pr += 0.25; else { pr += (1 - l.r) * 0.4; if (now - l.t < 10 * 60e3) pr -= 0.7; }
      return { e, pr: pr + Math.random() * 0.35 };
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
    const total = 10, pri = B.plan.priority || CH;
    const per = { 0: 1 };
    const base = Math.floor((total - 1) / CH.length);
    CH.forEach(p => { per[p] = base; });
    let left = total - 1 - base * CH.length, k = 0;
    while (left > 0) { per[pri[k % pri.length]]++; left--; k++; }
    const out = [];
    Object.keys(per).forEach(p => {
      const used = new Set();
      shuffle(EXS.filter(e => e.part === +p && QUICK.includes(e.type) && avail(e))).forEach(e => {
        if (used.size >= per[p] || used.has(e.notion)) return;
        used.add(e.notion); out.push(e.id);
      });
    });
    return shuffle(out);
  }
  function pickBuild(k) {
    const last = lastByEx(), now = Date.now();
    return EXS.filter(e => e.type === "build" && avail(e)).map(e => {
      const l = last[e.id];
      let pr = l ? (1 - l.r) * 0.6 : 1;
      if (l && now - l.t < 15 * 60e3) pr -= 0.8;
      return { e, pr: pr + Math.random() * 0.5 };
    }).sort((a, b) => b.pr - a.pr).slice(0, k).map(x => x.e.id);
  }

  /* =========================================================
     Routage (#/  ·  #/bibliotheque  ·  #/<contenu>/<vue>?param=…)
     ========================================================= */
  const BOOK_VIEWS = ["plan", "carte", "train", "reflexion", "bilan", "lecture", "player"];
  let VIEW = "home", PARAMS = {};
  let CLEAN = [];
  const app = $("#app");
  const VIEWS = {};
  function parseHash() {
    const h = location.hash.replace(/^#\/?/, "");
    const [path, qs] = h.split("?");
    const seg = (path || "").split("/").filter(Boolean);
    const q = {};
    (qs || "").split("&").filter(Boolean).forEach(kv => { const i = kv.indexOf("="); q[decodeURIComponent(i < 0 ? kv : kv.slice(0, i))] = i < 0 ? "1" : decodeURIComponent(kv.slice(i + 1)); });
    if (!seg.length) return { view: "home" };
    if (seg[0] === "bibliotheque" || seg[0] === "livres") return { view: "library", q };
    return { book: seg[0], view: seg[1] || "plan", q };
  }
  function hashFor(view, params) {
    if (view === "home") return "#/";
    if (view === "library") return "#/bibliotheque" + (params && params.type ? "?type=" + params.type : "");
    const q = Object.keys(params || {}).filter(k => params[k] != null && params[k] !== false && typeof params[k] !== "object").map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k] === true ? 1 : params[k]));
    return "#/" + B.id + "/" + view + (q.length ? "?" + q.join("&") : "");
  }
  function go(view, params) {
    const h = hashFor(view, params);
    if (location.hash === h) route(); else location.hash = h;
  }
  function openBook(id, view, params) {
    loadBook(id, err => {
      if (err) return toast("Impossible de charger ce contenu.");
      useBook(id);
      go(view || "plan", params);
    });
  }
  function route() {
    const r = parseHash();
    if (r.view === "home" || r.view === "library") {
      const fid = store.get(K_LAST) || (LIB[0] && LIB[0].id);
      const prm = r.q || {};
      if (!fid || !LIB.find(b => b.id === fid)) { VIEW = r.view; PARAMS = prm; return render(); }
      return loadBook(fid, () => { if (BOOKS[fid]) useBook(fid); VIEW = r.view; PARAMS = prm; render(); });
    }
    if (!LIB.find(b => b.id === r.book)) { location.replace("#/"); return; }
    loadBook(r.book, err => {
      if (err) { toast("Impossible de charger ce contenu."); location.replace("#/"); return; }
      useBook(r.book);
      let view = BOOK_VIEWS.includes(r.view) ? r.view : "plan";
      if (view === "player" && !P) view = "train";
      const prm = Object.assign({}, r.q);
      if (prm.part != null) prm.part = +prm.part;
      if (prm.fromPlan) prm.fromPlan = true;
      VIEW = view; PARAMS = prm;
      render();
    });
  }
  window.addEventListener("hashchange", route);

  let STILL = false;
  function render() {
    closeModal(true);
    CLEAN.forEach(f => { try { f(); } catch (e) { /* */ } });
    CLEAN = [];
    document.body.dataset.view = VIEW;
    renderTopbar();
    VIEWS[VIEW](app, PARAMS);
    if (STILL) { const v = $(".view", app); if (v) v.classList.add("still"); }
    STILL = false;
    renderPill();
  }
  function renderTopbar() {
    const inBook = B && !["home", "library"].includes(VIEW);
    $("#crumb").innerHTML = inBook ? `<span class="sep"></span><a href="#/${B.id}/plan">${esc(B.meta.title)}</a>` : "";
    $("#nav").hidden = !inBook;
    $("#topIcons").innerHTML = `<a class="top-icon ${VIEW === "home" ? "on" : ""}" href="#/" title="Accueil" aria-label="Accueil">${ICON.home}</a><a class="top-icon ${VIEW === "library" ? "on" : ""}" href="#/bibliotheque" title="Bibliothèque" aria-label="Bibliothèque">${ICON.library}</a><button class="top-icon" id="openSettings" title="Réglages" aria-label="Réglages">${ICON.gear}</button>`;
    $("#openSettings").onclick = openSettings;
    const br = $(".brand");
    if (br && !br.dataset.fx) { br.dataset.fx = 1; br.addEventListener("pointerenter", flipLogo); }
    const navKey = VIEW === "player" ? (P && P.from === "reflexion" ? "reflexion" : "train") : VIEW === "lecture" ? "plan" : VIEW;
    $$("#nav button").forEach(b => b.classList.toggle("on", b.dataset.view === navKey));
  }
  $$("#nav button").forEach(b => b.addEventListener("click", () => go(b.dataset.view, {})));

  /* =========================================================
     Accueil & bibliothèque
     ========================================================= */
  const SOON = {
    livre: { t: "D'autres livres arrivent", s: "Chaque œuvre au programme aura son plan, ses exercices et son bilan." },
    lecon: { t: "Les leçons arrivent", s: "Notions de philosophie, chapitres d'histoire, de SES, de SVT… avec les mêmes outils." }
  };
  function coverHTML(meta, cls) {
    const sm = store.get(kSum(meta.id));
    const k = KIND[meta.type] || KIND.livre;
    const top = meta.type === "lecon" ? (meta.subject || "Leçon") : [meta.subject, meta.year].filter(Boolean).join(" · ");
    return `<button class="cover ${meta.type === "lecon" ? "lesson" : ""} ${cls || ""}" data-book="${meta.id}" style="--tone:${meta.tone || "#1d1d1f"}">
      <span class="cv-kind">${k.one}</span>
      <span class="cv-top">${esc(top)}</span>
      <span class="cv-title">${esc(meta.title)}</span>
      <span class="cv-author">${esc(meta.author || meta.level || "")}</span>
      <span class="cv-foot"><span class="cv-bar"><i style="width:${sm ? sm.pct : 0}%"></i></span><span>${sm && sm.answered ? sm.pct + " %" : "Nouveau"}</span></span>
    </button>`;
  }
  const soonHTML = type => `<div class="cover soon"><span class="cv-title">${SOON[type].t}</span><span class="cv-author">${SOON[type].s}</span></div>`;
  function bindCovers(root) { $$("[data-book]", root).forEach(b => b.onclick = () => openBook(b.dataset.book, "plan")); }
  const ofType = t => LIB.filter(m => m.type === t);

  let HOME_TAB = "livre";
  VIEWS.home = function (root) {
    const sm = B ? store.get(kSum(B.id)) : null;
    const started = sm && sm.answered;
    const list = ofType(HOME_TAB);
    const shown = list.slice(0, 5);
    const cells = shown.length + (list.length < 6 ? 1 : 0);
    const prog = B && started ? `<div class="hero-prog"><div class="hp-top"><span>Préparation · ${esc(B.meta.title)}</span><b>${sm.pct} %</b></div><div class="bar ${sm.pct >= 80 ? "good" : sm.pct >= 50 ? "mid" : "weak"}"><i style="width:${sm.pct}%"></i></div>${S.run ? `<p class="resume-run" id="homeRun">Session en cours · reste ${fmtLeft(runTimes().left)}</p>` : `<p class="muted">${sm.tested} notions testées sur ${sm.total} · ${sm.answered} exercices faits</p>`}</div>` : "";
    root.innerHTML = `
    <section class="view home">
      <div class="card hero">
        <div class="eyebrow accent">Livres et leçons · révision active</div>
        <h1 class="hero-t">Lis. Comprends.<br><span class="hl">Retiens.</span></h1>
        <p class="hero-p">Recto transforme un livre ou une leçon en plan de révision minuté, en exercices qui font réfléchir et en bilan de ce qui te manque.</p>
        <div class="hero-cta">${B ? `<button class="btn primary xl" id="start">${S.run ? "Revenir à la session" : started ? "Reprendre" : "Commencer"} · ${esc(B.meta.title)}</button>` : ""}</div>
        ${prog}
        ${B ? `<div class="hero-facts">${daysHTML()}<div><b class="cnt" data-v="${EXS.length}">${EXS.length}</b><span>exercices</span></div><div><b class="cnt" data-v="${NIDS.length}">${NIDS.length}</b><span>fiches</span></div><div><b class="cnt" data-v="${new Set(EXS.map(e => e.type)).size}">${new Set(EXS.map(e => e.type)).size}</b><span>formats</span></div></div>` : ""}
      </div>
      <div class="card shelf">
        <div class="row-head"><div class="segmented big" id="shelfTab"><button data-t="livre" class="${HOME_TAB === "livre" ? "on" : ""}">Livres <span class="n">${ofType("livre").length}</span></button><button data-t="lecon" class="${HOME_TAB === "lecon" ? "on" : ""}">Leçons <span class="n">${ofType("lecon").length}</span></button></div><a class="link" href="#/bibliotheque?type=${HOME_TAB}">Tout voir</a></div>
        <div class="covers ${cells <= 2 ? "two" : ""}">${shown.map(m => coverHTML(m)).join("")}${list.length < 6 ? soonHTML(HOME_TAB) : ""}</div>
        <ol class="how"><li><b>Planifie</b><span>De 30 min à 3 h, le plan se construit seul.</span></li><li><b>Entraîne-toi</b><span>11 formats qui font réfléchir.</span></li><li><b>Fais ton bilan</b><span>Ce qui te manque, prêt pour ton IA.</span></li></ol>
      </div>
    </section>`;
    const s = $("#start"); if (s) s.onclick = () => openBook(B.id, "plan");
    const rs = $("#resume"); if (rs) rs.onclick = () => openBook(B.id, "plan");
    $$("#shelfTab button").forEach(b => b.onclick = () => { HOME_TAB = b.dataset.t; render(); });
    bindCovers(root);
    homeFx(root);
  };

  let LIB_SUBJ = "Toutes";
  VIEWS.library = function (root, prm) {
    const type = prm.type === "livre" || prm.type === "lecon" ? prm.type : "tout";
    const base = LIB.filter(m => type === "tout" || m.type === type);
    const subjects = ["Toutes", ...new Set(base.map(b => b.subject).filter(Boolean))];
    if (!subjects.includes(LIB_SUBJ)) LIB_SUBJ = "Toutes";
    const list = base.filter(b => LIB_SUBJ === "Toutes" || b.subject === LIB_SUBJ);
    const soons = (type === "tout" ? ["livre", "lecon"] : [type]).filter(t => ofType(t).length < 6);
    root.innerHTML = `
    <section class="view library">
      <div class="lib-head">
        <div><div class="eyebrow">Bibliothèque</div><h1 style="margin-top:6px">${type === "lecon" ? "Leçons" : type === "livre" ? "Livres" : "Livres et leçons"}</h1><p class="muted">Choisis ce que tu révises. Chaque livre et chaque leçon a son plan, ses exercices, ses fiches et son bilan, enregistrés séparément.</p></div>
        <div class="lib-filters">
          <div class="segmented big" id="ltype">${[["tout", "Tout"], ["livre", "Livres"], ["lecon", "Leçons"]].map(([k, l]) => `<button data-t="${k}" class="${k === type ? "on" : ""}">${l}</button>`).join("")}</div>
          ${subjects.length > 2 ? `<div class="chips">${subjects.map(s => `<button class="chip ${s === LIB_SUBJ ? "on" : ""}" data-s="${esc(s)}">${esc(s)}</button>`).join("")}</div>` : ""}
        </div>
      </div>
      <div class="lib-grid">${list.map(m => `<div class="lib-item">${coverHTML(m, "big")}<div class="lib-meta"><b>${esc(m.title)}</b><span>${esc([m.author, m.level].filter(Boolean).join(" · "))}</span><p>${esc(m.tagline || "")}</p></div></div>`).join("")}${soons.map(t => `<div class="lib-item">${soonHTML(t)}</div>`).join("")}</div>
    </section>`;
    $$("#ltype button").forEach(b => b.onclick = () => go("library", b.dataset.t === "tout" ? {} : { type: b.dataset.t }));
    $$(".lib-filters .chip").forEach(b => b.onclick = () => { LIB_SUBJ = b.dataset.s; render(); });
    bindCovers(root);
    X.stagger($$(".lib-item", root), { y: 14, step: 70 });
    X.fillBars($$(".cv-bar i", root));
    $$("button.cover", root).forEach(c => { const t = X.tilt(c); if (t) CLEAN.push(() => {}); });
  };

  /* =========================================================
     Plan de révision
     ========================================================= */
  const CAT = { diag: "ex", read: "read", reread: "read", drill: "ex", mixed: "ex", video: "weak", reflect: "refl", weak: "weak", pause: "rest", bilan: "rest" };
  const CAT_LABEL = { read: "Lecture", ex: "Exercices", refl: "Réflexion", weak: "Points faibles", rest: "Pauses et bilan" };
  const CAT_COLOR = { read: "var(--indigo)", ex: "var(--accent)", refl: "var(--teal-mark)", weak: "var(--orange-mark)", rest: "var(--fill-3)" };
  const sumObj = o => sum(Object.values(o));
  const RD = p => READING[p] || { full: 10, ess: 5, express: 3, text: { full: "Tout le " + U.one + ".", ess: "Les passages essentiels.", express: "Le début et la fin." }, look: [] };

  function buildPlan(Dur, readArr) {
    const read = new Set(readArr);
    const ALL = CH.slice();
    const PR = (B.plan.priority || ALL).filter(p => ALL.includes(p));
    const ESS = (B.plan.essOrder || PR.slice(1)).filter(p => ALL.includes(p));
    const FULL = (B.plan.fullOrder || PR).filter(p => ALL.includes(p));
    const unread = ALL.filter(p => !read.has(p));
    const pauses = Dur >= 150 ? 2 : Dur >= 85 ? 1 : 0;
    const budget = Dur - 5 - 3 - pauses * 5;
    const A = { read: {}, mode: {}, drill: {}, reflect: 5, weak: 4, mixed: 0, reread: {}, video: 0 };
    unread.forEach(p => { A.read[p] = RD(p).express; A.mode[p] = "express"; });
    ALL.forEach(p => { A.drill[p] = 2; });
    const used = () => sumObj(A.read) + sumObj(A.drill) + A.reflect + A.weak + A.mixed + sumObj(A.reread) + A.video;
    let compressed = false;

    if (used() > budget) {
      compressed = true;
      ALL.forEach(p => { if (read.has(p)) A.drill[p] = 1; });
      A.reflect = 3; A.weak = 2;
      if (used() > budget) {
        const availMin = budget - (sumObj(A.drill) + A.reflect + A.weak);
        const f = Math.max(0, availMin) / (sumObj(A.read) || 1);
        unread.forEach(p => { A.read[p] = Math.max(2, Math.floor(A.read[p] * f)); });
        if (used() > budget) unread.forEach(p => { A.drill[p] = 1; });
      }
      let left = budget - used();
      const pri = PR.filter(p => !read.has(p));
      let k = 0;
      while (left > 0 && pri.length) { A.read[pri[k % pri.length]]++; left--; k++; }
    } else {
      const ups = [];
      const up = (cost, apply) => ups.push({ cost, apply });
      const ess = p => up(() => RD(p).ess - A.read[p], () => { A.read[p] = RD(p).ess; A.mode[p] = RD(p).ess === RD(p).full ? "full" : "ess"; });
      const full = p => up(() => RD(p).full - A.read[p], () => { A.read[p] = RD(p).full; A.mode[p] = "full"; });
      if (!read.has(PR[0])) ess(PR[0]);
      up(() => 5, () => { A.reflect += 5; });
      up(() => 2, () => { A.drill[PR[0]] += 2; });
      up(() => 2, () => { A.weak += 2; });
      ESS.filter(p => !read.has(p)).forEach(ess);
      PR.slice(1).forEach(p => up(() => 2, () => { A.drill[p] += 2; }));
      up(() => 8, () => { A.mixed += 8; });
      PR.filter(p => read.has(p)).forEach(p => up(() => 3, () => { A.reread[p] = 3; }));
      up(() => 5, () => { A.reflect += 5; });
      FULL.filter(p => !read.has(p)).forEach(full);
      up(() => 4, () => { A.weak += 4; });
      PR.forEach(p => up(() => 2, () => { A.drill[p] += 2; }));
      if (Dur >= 100) up(() => 12, () => { A.video += 12; });
      up(() => 6, () => { A.mixed += 6; });
      up(() => 6, () => { A.reflect += 6; });
      up(() => 4, () => { A.weak += 4; });
      ups.forEach(u => { const c = u.cost(); if (c <= 0 || used() + c <= budget) u.apply(); });
      let left = budget - used();
      const targets = [() => A.mixed < 30 && (A.mixed += 1), () => A.reflect < 33 && (A.reflect += 1)].concat(PR.map(p => () => A.drill[p] < 12 && (A.drill[p] += 1)));
      let guard = 0;
      while (left > 0 && guard < 600) { if (targets[guard % targets.length]()) left--; guard++; }
      if (left > 0) A.weak += left;
    }

    const blocks = [{ type: "diag", min: 5 }];
    let i = 0;
    while (i < ALL.length) {
      const p = ALL[i];
      if (read.has(p)) {
        const ps = [];
        while (i < ALL.length && read.has(ALL[i])) { ps.push(ALL[i]); i++; }
        blocks.push({ type: "drill", parts: ps, min: sum(ps.map(x => A.drill[x])) });
        const rr = ps.filter(x => A.reread[x]);
        if (rr.length) blocks.push({ type: "reread", parts: rr, min: sum(rr.map(x => A.reread[x])) });
      } else {
        blocks.push({ type: "read", part: p, mode: A.mode[p], min: A.read[p] });
        blocks.push({ type: "drill", parts: [p], min: A.drill[p] });
        i++;
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
      for (let j = 0; j < blocks.length - 1; j++) {
        acc += blocks[j].min;
        if (blocks[j].type === "read" || blocks[j].type === "pause" || blocks[j + 1].type === "pause") continue;
        const d = Math.abs(acc - target);
        if (d < bd) { bd = d; best = j + 1; }
      }
      if (best > 0) blocks.splice(best, 0, { type: "pause", min: 5 });
    }
    return { blocks, duration: Dur, compressed, expressParts: unread.filter(x => A.mode[x] === "express") };
  }

  const romanList = ps => ps.length === 1 ? U.one + " " + PARTS[ps[0]].roman : U.many + " " + PARTS[ps[0]].roman + " à " + PARTS[ps[ps.length - 1]].roman;
  const nItems = min => Math.max(4, Math.round(min * 60 / 50));
  const nBuild = min => Math.max(2, Math.round(min / 2.5));
  function describe(b) {
    const ex = B.exam || {};
    switch (b.type) {
      case "diag": return { title: "Diagnostic éclair", desc: `10 questions rapides sur ${W.all}, sans réviser avant. Ne cherche pas à bien faire : le but est de repérer tes angles morts.`, why: "Se tester d'abord vaut mieux que relire : chaque erreur devient une priorité pour la suite du plan.", act: "Lancer le diagnostic" };
      case "read": return { title: "Lecture · " + U.one + " " + PARTS[b.part].roman, desc: RD(b.part).text[b.mode], why: (B.plan.why || {})[b.part], list: RD(b.part).look, act: "Ouvrir le guide de lecture", eyebrow: "Lecture " + MODE_LABEL[b.mode].toLowerCase() };
      case "reread": return { title: "Relecture ciblée · " + romanList(b.parts), desc: "Ne relis pas tout : ouvre la Carte, puis la fiche de chaque notion en rouge ou en orange, et relis seulement les passages cités.", why: "Tu as déjà lu ces " + U.many + ". Relire en entier donne une illusion de maîtrise ; viser tes erreurs est bien plus rentable.", act: "Ouvrir la carte" };
      case "drill": {
        const n = nItems(b.min);
        const fresh = b.parts.length === 1 && !S.plan.read.includes(b.parts[0]);
        return { title: "Exercices · " + romanList(b.parts), desc: fresh ? "Juste après la lecture, teste-toi : c'est à ce moment que l'effort de rappel fixe le mieux ce que tu viens de lire." : "Rappel actif sur ce que tu as déjà lu : QCM, textes à trous, cartes mémoire. Ce que tu rates part dans tes points faibles.", why: n + " exercices, environ 50 secondes chacun.", act: "Lancer " + n + " exercices", n };
      }
      case "mixed": { const n = Math.max(3, Math.round(b.min * 60 / 80)); return { title: "Schémas et liens", desc: "Exercices visuels : schémas à compléter, ordres à rétablir, associations, classements, tableaux. Ils obligent à relier les " + U.many + " entre eux, comme le demande une question de réflexion.", why: n + " exercices, environ 1 min 20 chacun.", act: "Lancer " + n + " exercices", n }; }
      case "reflect": { const k = nBuild(b.min); return { title: "Questions de réflexion", desc: k + " questions du type de ton épreuve. Pour chacune : réfléchis 30 secondes, choisis les arguments pertinents, puis compare au plan modèle.", why: (ex.format ? "Ton épreuve : " + ex.format + ". " : "") + "Ici, tu t'entraînes à trouver vite les bons arguments sans perdre de temps à rédiger.", act: "Lancer " + k + " questions", n: k }; }
      case "weak": return { title: "Points faibles", desc: "Refais tes exercices ratés jusqu'à ce qu'ils passent au vert, puis ouvre la fiche des notions qui restent en rouge dans le Bilan.", why: "Les erreurs corrigées juste après coup sont celles qu'on retient le mieux le lendemain.", act: "Refaire mes erreurs" };
      case "video": return { title: "Vidéo ciblée", desc: "Sur ta notion la plus fragile, regarde une explication en vidéo, en vitesse ×1,5. Le Bilan propose une recherche pour chaque notion.", why: "Une vidéo est utile pour débloquer une idée précise, pas pour remplacer la lecture.", act: "Ouvrir le bilan" };
      case "pause": return { title: "Pause", desc: "Lève-toi, bois un verre d'eau, et pas d'écran. Cinq minutes suffisent.", why: "Une courte pause entre deux blocs aide à consolider ce que tu viens de travailler." };
      case "bilan": return { title: "Bilan et export", desc: "Regarde ta préparation globale, puis exporte ton bilan (PDF ou texte) et donne-le à ton IA pour recevoir des explications et des conseils sur ce qui reste fragile.", why: "Après ça : dodo. Le sommeil fait une bonne partie du travail de mémorisation.", act: "Voir le bilan" };
    }
    return { title: "" };
  }

  /* Temps de session : écoulé, restant, fin prévue */
  function runTimes() {
    const r = S.run, now = Date.now();
    const cur = r.blocks[r.idx];
    const curEnd = r.blockStart + cur.min * 60000;
    const rem = curEnd - now;
    const after = sum(r.blocks.slice(r.idx + 1).map(b => b.min)) * 60000;
    const left = Math.max(0, rem) + after;
    const elapsed = now - r.startedAt;
    return { rem, left, elapsed, end: now + left, progress: elapsed + left ? elapsed / (elapsed + left) : 0, curEnd };
  }

  let PLAN_SEL = null;
  VIEWS.plan = function (root) {
    const running = !!S.run;
    if (running) PLAN_SEL = S.run.idx;
    root.innerHTML = `
    <section class="view plan">
      <div class="card plan-ctrl">
        <div class="eyebrow" id="durEyebrow">${running ? "Session en cours" : "Ce soir"}</div>
        <div class="display" id="durTxt"></div>
        <div class="sub" id="durSub">de révision avant l'épreuve.</div>
        ${running ? `<div class="run-bar"><i id="runProg"></i></div>` : `<div class="range"><input type="range" id="dur" min="30" max="180" step="5" value="${S.plan.duration}" aria-label="Durée de révision"></div>
        <div class="range-scale"><span style="left:0">30 min</span><span style="left:20%">1 h</span><span style="left:40%">1 h 30</span><span style="left:60%">2 h</span><span style="left:100%">3 h</span></div>`}
        <div class="ctrl-label">${esc(U.many.charAt(0).toUpperCase() + U.many.slice(1))} déjà lu${U.many.endsWith("es") ? "es" : "s"} <span>touche pour modifier</span></div>
        <div class="part-toggles" style="grid-template-columns:repeat(${Math.min(CH.length, 6)},1fr)">${CH.map(p => `<button class="ptog ${S.plan.read.includes(p) ? "on" : ""}" data-p="${p}" ${running ? "disabled" : ""} title="${esc(PARTS[p].title)}">${PARTS[p].roman}</button>`).join("")}</div>
        <div class="mix" id="mix"></div>
        <div class="set-line"><span>Sans citations</span>${switchHTML("nq", G.noQuotes)}</div>
        <div class="ctrl-foot" id="ctrlFoot"></div>
      </div>
      <div class="card plan-tl">
        <div class="tl-head"><h3>Programme</h3><span id="tlRange" class="tabnum"></span></div>
        <ol class="tl" id="tl"></ol>
      </div>
      <div class="card plan-detail" id="pd"></div>
    </section>`;
    const slider = $("#dur");
    if (slider) {
      const setP = () => slider.style.setProperty("--p", ((slider.value - 30) / 150 * 100) + "%");
      setP();
      slider.addEventListener("input", () => { S.plan.duration = +slider.value; setP(); save(); refreshPlan(); });
    }
    $$(".ptog").forEach(b => b.addEventListener("click", () => {
      const p = +b.dataset.p, r = S.plan.read;
      S.plan.read = r.includes(p) ? r.filter(x => x !== p) : [...r, p].sort((a, c) => a - c);
      b.classList.toggle("on");
      save(); refreshPlan();
    }));
    bindSwitch("nq", v => { G.noQuotes = v; save(); toast(v ? "Mode sans citations : les exercices de citation sont retirés." : "Exercices de citation réactivés."); });
    refreshPlan();
  };
  function switchHTML(id, on) { return `<span class="switch ${on ? "on" : ""}" id="${id}" role="switch" aria-checked="${on}" tabindex="0"><i></i></span>`; }
  function bindSwitch(id, fn) {
    const el = $("#" + id); if (!el) return;
    const flip = () => { const v = !el.classList.contains("on"); el.classList.toggle("on", v); el.setAttribute("aria-checked", v); fn(v); };
    el.onclick = flip;
    el.onkeydown = e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); } };
  }
  function currentPlan() {
    if (S.run) return { blocks: S.run.blocks, duration: S.run.duration, compressed: S.run.compressed, expressParts: S.run.expressParts || [] };
    return buildPlan(S.plan.duration, S.plan.read);
  }
  function timesFor(blocks) {
    const out = [];
    if (S.run) {
      const r = S.run, t = runTimes();
      const starts = r.starts || [];
      for (let i = 0; i < r.idx; i++) out[i] = starts[i] != null ? starts[i] : r.startedAt;
      out[r.idx] = r.blockStart;
      let s = Math.max(t.curEnd, Date.now());
      for (let i = r.idx + 1; i < blocks.length; i++) { out[i] = s; s += blocks[i].min * 60000; }
      out.end = t.end;
    } else {
      let s = nextFive();
      blocks.forEach((b, i) => { out[i] = s; s += b.min * 60000; });
      out.end = s;
    }
    return out;
  }
  function refreshPlan() {
    const plan = currentPlan();
    const blocks = plan.blocks;
    const T = timesFor(blocks);
    if (PLAN_SEL == null || PLAN_SEL >= blocks.length) PLAN_SEL = S.run ? S.run.idx : 0;
    updatePlanClock();
    if (!S.run) { $("#durTxt").textContent = fmtDur(plan.duration); $("#tlRange").textContent = clock(T[0]) + " → " + clock(T.end); }
    const cats = {};
    blocks.forEach(b => { const c = CAT[b.type]; cats[c] = (cats[c] || 0) + b.min; });
    const order = ["read", "ex", "refl", "weak", "rest"].filter(c => cats[c]);
    $("#mix").innerHTML = `<div class="mix-bar">${order.map(c => `<i style="flex-grow:${cats[c]};background:${CAT_COLOR[c]}"></i>`).join("")}</div>
      <div class="mix-legend">${order.map(c => `<div><span class="sw" style="background:${CAT_COLOR[c]}"></span>${CAT_LABEL[c]}<b>${cats[c]} min</b></div>`).join("")}</div>`;
    let note = "";
    if (plan.compressed) note = `<p class="note warn">Avec ${fmtDur(plan.duration)}, impossible de tout couvrir : le plan garde le strict essentiel. Vise au moins 1 h.</p>`;
    else if (plan.expressParts.length) note = `<p class="note">Lecture express pour : ${plan.expressParts.map(p => PARTS[p].roman).join(", ")}. Allonge la durée pour lire davantage.</p>`;
    $("#ctrlFoot").innerHTML = note + (S.run
      ? `<button class="btn secondary" id="stopRun">Arrêter la session</button>`
      : `<button class="btn primary lg" id="startRun">Commencer maintenant</button>`);
    const sr = $("#startRun"); if (sr) sr.onclick = () => {
      const now = Date.now();
      S.run = { blocks: plan.blocks, duration: plan.duration, compressed: plan.compressed, expressParts: plan.expressParts, idx: 0, blockStart: now, startedAt: now, starts: [now], startPct: Math.round(globalScore() * 100) };
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
    if (PENDING_STRIKE) {
      const ps = PENDING_STRIKE; PENDING_STRIKE = null;
      requestAnimationFrame(() => {
        const row = $(`#tl .tl-row[data-i="${ps.i}"]`), title = row && $(".tl-title", row);
        if (title) { title.style.textDecoration = "none"; const l = X.strike(title); setTimeout(() => { if (l) l.remove(); title.style.textDecoration = ""; }, 1400); }
        const target = $("#durTxt");
        if (ps.min > 0 && target) X.floatText(target, "− " + ps.min + " min", { color: "#6e6e73" });
      });
    }
  }
  let PENDING_STRIKE = null, PENDING_GAIN = null;
  function updatePlanClock() {
    if (!S || !S.run || VIEW !== "plan") return;
    const t = runTimes();
    const d = $("#durTxt"); if (!d) return;
    d.textContent = fmtHMS(t.left);
    const el = Math.floor(t.elapsed / 60000);
    $("#durSub").textContent = "restantes · " + (el < 60 ? el + " min" : Math.floor(el / 60) + " h " + String(el % 60).padStart(2, "0")) + " écoulée" + (el > 1 ? "s" : "") + " · fin vers " + clock(t.end);
    const pr = $("#runProg"); if (pr) pr.style.transform = `scaleX(${t.progress.toFixed(4)})`;
    $("#tlRange").textContent = "fin prévue " + clock(t.end);
    const T = timesFor(S.run.blocks);
    $$("#tl .tl-time").forEach((el, i) => { const v = clock(T[i]); if (el.textContent !== v) el.textContent = v; });
    const cd = $("#countdown"); if (cd) { cd.textContent = fmtClock(t.rem); cd.classList.toggle("late", t.rem < 0); }
  }
  function renderDetail(blocks, T) {
    const i = PLAN_SEL, b = blocks[i], d = describe(b);
    const isNow = S.run && i === S.run.idx;
    const cat = CAT[b.type];
    $("#pd").innerHTML = `
      <div class="pd-top"><span class="sw" style="background:${CAT_COLOR[cat]};width:10px;height:10px;border-radius:3px"></span><span class="eyebrow">${esc(d.eyebrow || CAT_LABEL[cat])} · étape ${i + 1} sur ${blocks.length}</span></div>
      <h2 class="pd-title">${esc(d.title)}</h2>
      <div class="pd-when">${clock(T[i])} → ${clock(T[i] + b.min * 60000)} · ${b.min} min</div>
      ${isNow ? `<div class="pd-run"><div><div class="small">En cours · temps restant sur ce bloc</div><div class="countdown tabnum" id="countdown">${fmtClock(runTimes().rem)}</div></div><button class="btn primary" id="nextBlock">Bloc suivant</button></div>` : ""}
      <p class="pd-desc">${esc(d.desc)}</p>
      ${d.list && d.list.length ? `<ul class="pd-list">${d.list.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      ${d.why ? `<div class="pd-why"><b>Pourquoi ? </b>${esc(d.why)}</div>` : ""}
      <div class="pd-foot">${d.act ? `<button class="btn primary" id="act">${esc(d.act)}</button>` : ""}${!S.run ? `<span class="note">Clique « Commencer maintenant » pour lancer le chronomètre.</span>` : ""}</div>`;
    const a = $("#act"); if (a) a.onclick = () => runAction(b);
    const nb = $("#nextBlock"); if (nb) nb.onclick = advanceRun;
  }
  function stepRun() {
    const now = Date.now();
    S.run.idx++;
    S.run.blockStart = now;
    (S.run.starts = S.run.starts || [])[S.run.idx] = now;
    if (S.run.idx >= S.run.blocks.length) { S.run = null; return true; }
    PLAN_SEL = S.run.idx;
    return false;
  }
  function advanceRun() {
    if (!S.run) return;
    const t = runTimes(), from = S.run.startPct;
    PENDING_STRIKE = { i: S.run.idx, min: Math.max(0, Math.round(t.rem / 60000)) };
    const finished = stepRun();
    save();
    if (finished) {
      PENDING_STRIKE = null; PLAN_SEL = 0;
      unlock("plan", "Plan terminé");
      PENDING_GAIN = from == null ? null : { from, to: Math.round(globalScore() * 100) };
      go("bilan");
      return;
    }
    if (VIEW === "plan") { refreshPlan(); renderPill(); } else go("plan");
  }
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

  /* Pastille de session (barre du haut) : bloc en cours, compte à rebours, temps total restant */
  function renderPill() {
    const slot = $("#pillSlot");
    const inBook = B && S && !["home", "library"].includes(VIEW);
    if (!inBook || !S.run) {
      slot.innerHTML = "";
      return;
    }
    const b = S.run.blocks[S.run.idx], t = runTimes();
    slot.innerHTML = `<button class="pill ${t.rem < 0 ? "late" : ""}" id="pill" title="Voir le plan"><span class="pill-dot"></span><span class="pill-txt">${esc(describe(b).title)}</span><span class="pill-time">${fmtClock(t.rem)}</span><span class="pill-left">reste ${fmtLeft(t.left)}</span><i class="pill-prog" style="transform:scaleX(${t.progress.toFixed(4)})"></i></button>`;
    $("#pill").onclick = () => go("plan");
  }
  setInterval(() => {
    if (!S || !S.run) return;
    const t = runTimes();
    const p = $("#pill");
    if (p) {
      p.classList.toggle("late", t.rem < 0);
      $(".pill-time", p).textContent = fmtClock(t.rem);
      $(".pill-left", p).textContent = "reste " + fmtLeft(t.left);
      $(".pill-prog", p).style.transform = `scaleX(${t.progress.toFixed(4)})`;
    }
    const hr = $("#homeRun"); if (hr) hr.textContent = "Session en cours · reste " + fmtLeft(t.left);
    updatePlanClock();
  }, 1000);

  /* =========================================================
     Guide de lecture
     ========================================================= */
  VIEWS.lecture = function (root, prm) {
    const part = prm.part && PARTS[prm.part] ? prm.part : CH[0], r = RD(part), P0 = PARTS[part];
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
          ${r.link ? `<a class="btn secondary" href="${r.link}" target="_blank" rel="noopener">Texte en ligne ${ICON.ext}</a>` : ""}
          <button class="btn primary" id="done">J'ai lu · exercices</button>
          <button class="btn ghost" id="toCarte">Fiches</button>
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
      const cur = S.run && S.run.blocks[S.run.idx];
      if (cur && cur.type === "read" && cur.part === part) { stepRun(); save(); }
      startSession({ title: "Exercices · " + U.one + " " + P0.roman, ids: pickSmart(6, e => e.part === part), origin: prm.fromPlan ? "plan" : null });
    };
    $("#toCarte").onclick = () => go("carte", { part });
  };

  /* =========================================================
     Carte & fiches
     ========================================================= */
  VIEWS.carte = function (root, prm) {
    if (prm.notion && !NOTIONS[prm.notion]) prm = {};
    const mode = prm.notion ? "n" : prm.part != null ? "p" : "ov";
    const cur = prm.notion ? NOTIONS[prm.notion].part : prm.part;
    const navItem = p => {
      const sc = partScore(p), st = status(partTested(p) ? sc : null);
      return `<button class="c-nav-item ${mode !== "ov" && cur === p ? "on" : ""}" data-part="${p}"><span class="r">${p ? PARTS[p].roman : "§"}</span><span class="t">${esc(p ? PARTS[p].label : "Contexte")}</span><div class="bar ${st}"><i style="width:${pct(sc)}%"></i></div></button>`;
    };
    const hasCtx = NIDS.some(id => NOTIONS[id].part === 0);
    root.innerHTML = `
    <section class="view carte">
      <nav class="card c-nav">
        <button class="c-nav-item ${mode === "ov" ? "on" : ""}" data-ov><span class="r">∴</span><span class="t" style="grid-row:span 2">Vue d'ensemble</span></button>
        ${hasCtx ? navItem(0) : ""}
        <div class="c-nav-sep"></div>
        ${CH.map(navItem).join("")}
      </nav>
      <div class="card c-main" id="cmain"></div>
    </section>`;
    $$(".c-nav-item").forEach(b => b.onclick = () => b.hasAttribute("data-ov") ? go("carte", {}) : go("carte", { part: +b.dataset.part }));
    const main = $("#cmain");
    if (mode === "ov") main.innerHTML = overviewHTML();
    else if (mode === "p") main.innerHTML = partHTML(prm.part);
    else main.innerHTML = ficheHTML(prm.notion, { back: true });
    $$("[data-part]", main).forEach(b => b.onclick = () => go("carte", { part: +b.dataset.part }));
    $$("[data-notion]", main).forEach(b => b.onclick = () => go("carte", { notion: b.dataset.notion }));
    const bk = $("[data-back]", main); if (bk) bk.onclick = () => go("carte", { part: NOTIONS[prm.notion].part });
    const tp = $("#trainPart", main); if (tp) tp.onclick = () => startSession({ title: "Exercices · " + partLabel(prm.part), ids: pickSmart(G.len, e => e.part === prm.part) });
    const lp = $("#readPart", main); if (lp) lp.onclick = () => go("lecture", { part: prm.part, mode: "ess" });
    X.fillBars($$(".bar i", root));
    X.stagger($$(".fr-col, .n-tile", main), { y: 10, step: 55 });
  };
  function overviewHTML() {
    const ov = B.overview || { title: B.meta.title + " en un coup d'œil", intro: B.meta.tagline || "", boxes: [] };
    return `
      <div class="ov-head"><div><div class="eyebrow">Vue d'ensemble</div><h1 style="margin-top:6px">${esc(ov.title)}</h1><p>${esc(ov.intro)}</p></div></div>
      <div class="frise" style="grid-template-columns:repeat(${Math.min(CH.length, 6)},minmax(0,1fr))">${CH.map(p => {
        const sc = partScore(p);
        return `<button class="fr-col" data-part="${p}"><span class="r">${PARTS[p].roman}</span><span class="m">${esc(PARTS[p].metaphor || "")}</span><span class="t">${esc(PARTS[p].label)}</span><span class="e">${esc(PARTS[p].essence || "")}</span><div class="bar ${status(partTested(p) ? sc : null)}"><i style="width:${pct(sc)}%"></i></div></button>`;
      }).join("")}</div>
      ${ov.boxes.length ? `<div class="ov-foot">${ov.boxes.map(x => `<div class="ov-box"><b>${esc(x.t)}</b>${esc(x.b)}</div>`).join("")}</div>` : ""}`;
  }
  function partHTML(p) {
    const ids = NIDS.filter(id => NOTIONS[id].part === p);
    const P0 = PARTS[p];
    return `
      <div class="part-head"><span class="r">${p ? P0.roman : "§"}</span><div><div class="eyebrow">${esc(partLabel(p))}${P0.metaphor ? " · " + esc(P0.metaphor) : ""}</div><h1 style="margin-top:6px">${esc(P0.title)}</h1><p>${esc(P0.essence)}</p></div></div>
      <div class="n-grid">${ids.map(id => { const m = mastery(id), st = status(m); return `<button class="n-tile" data-notion="${id}"><span class="t">${esc(NOTIONS[id].title)}</span><span class="s"><span class="dot ${st}"></span>${STATUS_LABEL[st]}${m != null ? " · " + pct(m) + " %" : ""}</span></button>`; }).join("")}</div>
      <div class="part-actions"><button class="btn primary" id="trainPart">S'entraîner dessus</button>${p ? `<button class="btn secondary" id="readPart">Guide de lecture</button>${RD(p).link ? `<a class="btn ghost" href="${RD(p).link}" target="_blank" rel="noopener">Texte en ligne ${ICON.ext}</a>` : ""}` : ""}</div>`;
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
        ${n.citation ? `<div class="fiche-quote"><div class="eyebrow">Citation à connaître</div><p class="quote" style="margin-top:8px">« ${esc(n.citation)} »</p><div class="src">${esc(partLabel(n.part))}</div></div>` : ""}
        ${n.piege ? `<div class="fiche-trap"><b>Piège</b>${esc(n.piege)}</div>` : ""}
        <div class="fiche-stat"><span class="dot ${st}"></span><span>${STATUS_LABEL[st]}</span><div class="bar ${st}"><i style="width:${pct(m)}%"></i></div><span class="tabnum">${m == null ? "—" : pct(m) + " %"}</span></div>
        <div class="fiche-links">
          <button class="btn primary sm" data-train-notion="${id}">S'entraîner</button>
          ${n.video ? `<a class="btn secondary sm" href="${yt(n.video)}" target="_blank" rel="noopener">Vidéos ${ICON.ext}</a>` : ""}
          ${n.part && RD(n.part).link ? `<a class="btn ghost sm" href="${RD(n.part).link}" target="_blank" rel="noopener">Texte ${ICON.ext}</a>` : ""}
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
  let MODAL_CLOSE = null;
  function closeModal(silent) {
    const m = $("#modal");
    if (!m.hidden) { m.hidden = true; m.innerHTML = ""; }
    const cb = MODAL_CLOSE; MODAL_CLOSE = null;
    if (cb && !silent) cb();
  }
  function openModal(html, cls, onClose) {
    const m = $("#modal");
    m.innerHTML = `<div class="modal-card ${cls || ""}" role="dialog" aria-modal="true">${html}</div>`;
    m.hidden = false;
    MODAL_CLOSE = onClose || null;
    m.onclick = e => { if (e.target === m || e.target.closest("[data-close]")) closeModal(); };
    return m.firstElementChild;
  }

  /* =========================================================
     Entraînement
     ========================================================= */
  const pickState = { parts: new Set(), types: new Set() };
  let TRAIN_PICK = "part";
  VIEWS.train = function (root) {
    const mm = masteryMap();
    const untested = NIDS.filter(id => mm[id] == null).length;
    const weak = NIDS.filter(id => mm[id] != null && mm[id] < 0.8).length;
    const errs = errorIds().length;
    const pool = EXS.filter(avail);
    const counts = {}; pool.forEach(e => counts[e.type] = (counts[e.type] || 0) + 1);
    const pc = {}; pool.forEach(e => pc[e.part] = (pc[e.part] || 0) + 1);
    [...pickState.types].forEach(t => { if (!counts[t]) pickState.types.delete(t); });
    const hasCtx = pc[0] > 0;
    root.innerHTML = `
    <section class="view train">
      <div class="card t-smart">
        <div class="eyebrow accent">Recommandé</div>
        <h1>Mix intelligent</h1>
        <p>Les exercices sont choisis pour toi : d'abord les notions jamais vues et celles que tu rates, dans des formats variés pour ancrer chaque idée sous plusieurs angles.</p>
        <div class="t-stats"><div><b class="cnt" data-v="${untested}">${untested}</b><span>notions jamais testées</span></div><div><b class="cnt" data-v="${weak}">${weak}</b><span>notions fragiles</span></div><div><b class="cnt" data-v="${pool.length}">${pool.length}</b><span>exercices disponibles</span></div></div>
        <div class="t-set">
          <div class="t-set-row"><span class="lbl">Longueur des séries</span><span class="segmented" id="len">${[8, 12, 20].map(n => `<button data-n="${n}" class="${n === G.len ? "on" : ""}">${n}</button>`).join("")}</span></div>
          <div class="t-set-row"><span class="lbl">Rappel actif</span>${switchHTML("recall", G.recall)}</div>
          <div class="t-set-row"><span class="lbl">Sans citations</span>${switchHTML("nq", G.noQuotes)}</div>
          <p class="note">Le rappel actif masque les propositions tant que tu n'as pas répondu de tête. Le mode sans citations retire les textes à trous de citations et les « Quelle partie ? ».</p>
        </div>
        <button class="btn primary lg" id="smart">Commencer · ${G.len} exercices</button>
      </div>
      <div class="card t-mini"><div class="eyebrow">Point de départ</div><h3 style="margin-top:6px">Diagnostic éclair</h3><p>10 questions sur ${W.all} pour repérer tes angles morts.</p><div class="gap"></div><button class="btn secondary" id="diag">Lancer</button></div>
      <div class="card t-mini"><div class="eyebrow orange">À corriger</div><div class="head"><h3 style="margin-top:6px">Mes erreurs</h3><span class="big">${errs}</span></div><p>exercice${errs > 1 ? "s" : ""} raté${errs > 1 ? "s" : ""} à refaire jusqu'au vert.</p><div class="gap"></div><button class="btn secondary" id="errs" ${errs ? "" : "disabled"}>Refaire</button></div>
      <div class="card t-pick">
        <div class="row"><div><div class="eyebrow">À la carte</div><h3 style="margin-top:6px">Choisis ce que tu travailles</h3></div><div class="segmented" id="pickMode"><button data-m="part" class="${TRAIN_PICK === "part" ? "on" : ""}">Par ${esc(U.one)}</button><button data-m="format" class="${TRAIN_PICK === "format" ? "on" : ""}">Par format</button></div></div>
        ${TRAIN_PICK === "part"
          ? `<div class="chips" id="partChips">${(hasCtx ? [0] : []).concat(CH).map(p => `<button class="chip ${pickState.parts.has(p) ? "on" : ""}" data-p="${p}">${p ? PARTS[p].roman + " · " + esc(PARTS[p].label) : "Contexte et transversal"} <span class="n">${pc[p] || 0}</span></button>`).join("")}</div>`
          : `<div class="chips" id="fmtChips">${Object.keys(TYPES).filter(t => EXS.some(e => e.type === t)).map(t => `<button class="chip ${pickState.types.has(t) ? "on" : ""}" data-t="${t}" ${counts[t] ? "" : "disabled"}>${esc(TYPES[t].label)} <span class="n">${counts[t] || 0}</span></button>`).join("")}</div>`}
        <div class="t-pick-foot"><button class="btn primary" id="${TRAIN_PICK === "part" ? "goPart" : "goFmt"}">Lancer la sélection</button></div>
      </div>
    </section>`;
    $("#smart").onclick = () => startSession({ title: "Mix intelligent", ids: pickSmart(G.len) });
    $("#diag").onclick = () => startSession({ title: "Diagnostic éclair", ids: pickDiag() });
    $("#errs").onclick = () => startSession({ title: "Mes erreurs", ids: shuffle(errorIds().slice(0, Math.max(G.len, 12))) });
    $$("#partChips .chip").forEach(b => b.onclick = () => { const p = +b.dataset.p; pickState.parts.has(p) ? pickState.parts.delete(p) : pickState.parts.add(p); b.classList.toggle("on"); });
    $$("#fmtChips .chip").forEach(b => b.onclick = () => { const t = b.dataset.t; pickState.types.has(t) ? pickState.types.delete(t) : pickState.types.add(t); b.classList.toggle("on"); });
    $$("#pickMode button").forEach(b => b.onclick = () => { TRAIN_PICK = b.dataset.m; render(); });
    const gp = $("#goPart"); if (gp) gp.onclick = () => {
      if (!pickState.parts.size) return toast("Choisis au moins un " + U.one + ".");
      const ps = [...pickState.parts].sort((a, b) => a - b);
      startSession({ title: (ps.length > 1 ? U.many : U.one).replace(/^./, c => c.toUpperCase()) + " " + ps.map(p => p ? PARTS[p].roman : "contexte").join(", "), ids: pickSmart(G.len, e => pickState.parts.has(e.part)) });
    };
    const gf = $("#goFmt"); if (gf) gf.onclick = () => {
      if (!pickState.types.size) return toast("Choisis au moins un format.");
      const ts = [...pickState.types];
      startSession({ title: ts.map(t => TYPES[t].label).join(", "), ids: pickSmart(G.len, e => pickState.types.has(e.type), true), from: ts.length === 1 && ts[0] === "build" ? "reflexion" : "train" });
    };
    $$("#len button").forEach(b => b.onclick = () => { G.len = +b.dataset.n; save(); render(); });
    bindSwitch("recall", v => { G.recall = v; save(); });
    bindSwitch("nq", v => { G.noQuotes = v; save(); render(); toast(v ? "Mode sans citations activé." : "Exercices de citation réactivés."); });
    countAll(root);
  };

  /* =========================================================
     Réflexion
     ========================================================= */
  VIEWS.reflexion = function (root) {
    const builds = EXS.filter(e => e.type === "build" && avail(e));
    const last = lastByEx();
    const ex = B.exam || {};
    root.innerHTML = `
    <section class="view reflexion">
      <div class="refl-head">
        <div><div class="eyebrow accent">Format de l'épreuve</div><h1 style="margin-top:6px">Questions de réflexion</h1>
        <p>${ex.format ? "À l'épreuve : " + esc(ex.format) + (ex.perQuestion ? ", soit " + esc(ex.perQuestion) : "") + ". " : ""}Ici, pas de rédaction : pour chaque question, trouve les arguments pertinents, puis compare-toi au plan modèle et à la citation clé.</p></div>
        <div style="display:flex;gap:8px;flex:none"><button class="btn secondary" id="undone">Questions jamais faites</button><button class="btn primary" id="sim">Simulation · 4 questions</button></div>
      </div>
      <div class="refl-grid">${builds.map(e => {
        const l = last[e.id], st = l ? status(l.r) : "new";
        return `<button class="q-card" data-id="${e.id}"><div class="top"><span class="r">${e.part ? PARTS[e.part].roman : "Contexte"}</span><span class="score-badge ${l ? st : ""}">${l ? Math.round(l.r * 100) + " %" : "À faire"}</span></div><span class="t">${esc(e.q)}</span></button>`;
      }).join("")}</div>
    </section>`;
    $$(".q-card").forEach(c => c.onclick = () => startSession({ title: "Question de réflexion", ids: [c.dataset.id], from: "reflexion" }));
    $("#sim").onclick = () => startSession({ title: "Simulation d'épreuve", ids: pickBuild(4), from: "reflexion" });
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
      case "part": return "De quel " + U.one + " vient cette phrase ?";
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
          <span class="streak ${(P.streak || 0) >= 3 ? "show" : ""} ${P.record ? "gold" : ""}" id="streak">${(P.streak || 0) >= 3 ? (P.record ? "Record : " : "") + P.streak + " d'affilée" : ""}</span>
          ${goalHTML()}
          <span class="count">${P.idx + 1} / ${P.ids.length}</span>
        </div>
        <div class="ex-meta"><span class="tag">${esc(TYPES[ex.type].label)}</span>${ex.type !== "part" && ex.part ? `<span class="tag ghost">${esc(U.one.charAt(0).toUpperCase() + U.one.slice(1))} ${PARTS[ex.part].roman}</span>` : ""}<span class="sess">${esc(P.title)}</span></div>
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
      <aside class="card player-side dim" id="side">${sideIntro(ex)}</aside>
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
      ${ex.type === "build" ? `<div class="side-sep"></div><div class="side-intro"><h4>À l'épreuve</h4><p>Une bonne réponse tient en trois éléments : une problématique, deux ou trois arguments tirés du texte, une citation précise.</p></div>` : ""}
      ${ex.type === "part" ? `<div class="side-sep"></div><div class="side-intro"><h4>Repères</h4><p>${CH.map(p => PARTS[p].roman + " " + esc(PARTS[p].label.toLowerCase())).join(" · ")}</p></div>` : ""}`;
  }
  function doCheck(giveUp) {
    if (CHECKED || !CTRL) return;
    const ex = EX[P.ids[P.idx]];
    const res = CTRL.check(giveUp);
    if (giveUp) { res.score = 0; (res.items || []).forEach(i => { i.r = 0; if (i.g != null) i.g = "Je ne sais pas"; }); res.given = "Je ne sais pas"; res.gaveUp = true; }
    CHECKED = true;
    $("#exBody").classList.add("locked");
    const before = {}; ex.nlist.forEach(n => { before[n] = mastery(n); });
    record(ex, res);
    P.res[P.idx] = res.score;
    const seg = $$(".segs i")[P.idx]; if (seg) seg.className = segCls(res.score);
    ["#validate", "#idk", "#hint"].forEach(s => { const b = $(s); if (b) b.hidden = true; });
    $("#next").hidden = false;
    $("#side").innerHTML = feedbackHTML(ex, res);
    $("#side").scrollTop = 0;
    $("#side").classList.remove("dim");
    celebrate(ex, res, before);
  }
  function nextEx() {
    if (!P) return;
    P.idx++;
    if (P.idx >= P.ids.length) P.done = true;
    STILL = !P.done;
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
    return `<div class="ring ${st}"><svg viewBox="0 0 120 120"><circle class="bg" cx="60" cy="60" r="${r}"/><circle class="fg" cx="60" cy="60" r="${r}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - p / 100)).toFixed(1)}"/></svg><div class="lbl"><span class="num">${p}</span><small>%</small></div></div>`;
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
        <h2 class="${p === 100 ? "perfect" : ""}">${p === 100 ? "Parfait." : p >= 80 ? "Très bien." : p >= 50 ? "Pas mal. Encore un effort." : "C'est le bon moment pour corriger."}</h2>
        <p>${okN} réponse${okN > 1 ? "s" : ""} parfaite${okN > 1 ? "s" : ""} sur ${n} · ${esc(P.title)}</p>
        <div class="end-chips">${Object.keys(touched).map(id => { const a = avg(touched[id]); return `<button class="end-chip" data-fiche="${id}"><span class="dot ${a >= 0.99 ? "good" : a > 0 ? "mid" : "weak"}"></span>${esc(NOTIONS[id].title)}</button>`; }).join("")}</div>
        <div class="end-actions">
          ${errs.length ? `<button class="btn secondary" id="redo">Refaire ${errs.length > 1 ? "les " + errs.length + " erreurs" : "l'erreur"}</button>` : ""}
          ${fromPlan ? `<button class="btn primary" id="nextBlock">Bloc suivant du plan</button>` : `<button class="btn primary" id="back">Continuer</button>`}
          <button class="btn ghost" id="toBilan">Voir le bilan</button>
        </div>
      </div>
      <aside class="card player-side">
        <div class="side-intro"><h4>À revoir maintenant</h4>${weakest.length ? `<p>Ouvre ces fiches avant de passer à la suite : deux minutes de lecture juste après une erreur valent plus qu'une relecture complète.</p>` : `<p>Aucune erreur sur cette série. Passe à la suite du plan.</p>`}</div>
        ${weakest.length ? `<div class="side-links" style="margin-top:14px">${weakest.map(x => `<button class="fiche-link" data-fiche="${x.id}"><span class="dot ${status(mastery(x.id))}"></span><span class="t">${esc(NOTIONS[x.id].title)}</span>${ICON.chev}</button>`).join("")}</div>` : ""}
      </aside>
    </section>`;
    animateRing($(".ring", root), p);
    X.stagger($$(".end-chip", root), { y: 8, scale: .94, step: 45 });
    const h2 = $(".end h2", root);
    if (p === 100 && n >= 3) setTimeout(() => { X.shimmer(h2); X.pop(h2, 1.08); X.fireworks(); }, 450);
    else if (p >= 80) setTimeout(() => X.confetti(), 350);
    if (p === 100 && n >= 5) unlock("perfect", "Première série parfaite");
    if (P.title === "Diagnostic éclair") unlock("diag", "Diagnostic fait");
    if (P.title === "Simulation d'épreuve" && p >= 75) unlock("sim", "Simulation réussie");
    const rd = $("#redo"); if (rd) rd.onclick = () => startSession({ title: "Correction · " + P.title, ids: shuffle(errs), origin: P.origin, from: P.from });
    const nb = $("#nextBlock"); if (nb) nb.onclick = () => { P = null; advanceRun(); };
    const bk = $("#back"); if (bk) bk.onclick = leaveSession;
    $("#toBilan").onclick = () => { P = null; go("bilan"); };
  }

  /* =========================================================
     Effets visuels validés (voir le livre des effets)
     ========================================================= */
  let LASTPT = null;
  document.addEventListener("pointerdown", e => { LASTPT = { x: e.clientX, y: e.clientY, t: Date.now() }; }, true);
  const ptIn = el => { if (!LASTPT || Date.now() - LASTPT.t > 2000) return null; const r = el.getBoundingClientRect(); return LASTPT.x >= r.left && LASTPT.x <= r.right && LASTPT.y >= r.top && LASTPT.y <= r.bottom ? LASTPT : null; };
  function countAll(root) { $$(".cnt[data-v]", root).forEach(el => X.countUp(el, +el.dataset.v)); }
  function animateRing(ring, p) {
    if (!ring) return;
    const fg = $(".fg", ring), num = $(".num", ring);
    if (fg) X.ringTo(fg, p);
    if (num) X.countUp(num, p);
  }

  /* MC-02 (revu, discret) : petit anneau « encore N » pour finir un bloc du plan */
  function goalHTML() {
    if (!P || P.origin !== "plan" || P.done) return "";
    const n = P.ids.length, done = P.res.filter(x => x != null).length, c = 2 * Math.PI * 7;
    return `<span class="goal" id="goal" title="Exercices restants pour finir le bloc"><svg viewBox="0 0 18 18"><circle class="bg" cx="9" cy="9" r="7"/><circle class="fg" cx="9" cy="9" r="7" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${(c * (1 - done / n)).toFixed(2)}"/></svg><span>encore ${n - done}</span></span>`;
  }
  function updateGoal() {
    const g = $("#goal"); if (!g || !P) return;
    const n = P.ids.length, done = P.res.filter(x => x != null).length, c = 2 * Math.PI * 7;
    $(".fg", g).style.strokeDashoffset = (c * (1 - done / n)).toFixed(2);
    $("span", g).textContent = n - done ? "encore " + (n - done) : "bloc fini";
  }

  /* Réponse : éclaboussure, gerbe, secousse, halo, série, maîtrise qui monte */
  function celebrate(ex, res, before) {
    const ok = res.score >= 0.99 && !res.gaveUp;
    const body = $("#exBody");
    const seg = $$(".segs i")[P.idx];
    if (ok) {
      let targets = $$(".opt.correct, .vf-btn.correct, .part-btn.correct, .flash-rate [data-r='1']", body);
      if (!targets.length) targets = [$("#side .v-icon")].filter(Boolean);
      targets.slice(0, 2).forEach((t, i) => {
        const pt = ptIn(t);
        X.ripple(t, pt ? pt.x : null, pt ? pt.y : null);
        X.pop(t);
        if (!i) X.burst(t);
      });
      if (seg) X.sweep(seg);
    } else if (!res.gaveUp) {
      $$(".wrong", body).slice(0, 6).forEach(w => X.shake(w));
      setTimeout(() => $$(".opt.correct, .vf-btn.correct, .part-btn.correct", body).forEach(c => X.glow(c, "inset 0 0 0 1.5px #34c759")), 260);
    }
    /* Série d'affilée, palier, record, fin de série */
    const chip = $("#streak");
    if (ok) {
      P.streak = (P.streak || 0) + 1;
      if (P.streak >= 3 && chip) {
        const isRecord = P.streak >= 5 && P.streak > (S.best || 0);
        if (isRecord) { S.best = P.streak; P.record = true; save(); }
        const milestone = P.streak % 5 === 0;
        chip.classList.add("show");
        chip.classList.toggle("gold", !!P.record);
        X.streak(chip, P.streak, milestone || isRecord);
        chip.textContent = (P.record ? "Record : " : "") + P.streak + " d'affilée";
        chip.style.opacity = 1;
        if (milestone) { X.burst(chip, { count: 22 }); X.confetti({ count: 80, duration: 1700 }); }
        if (P.streak >= 10) unlock("streak10", "Série de 10");
      }
    } else {
      if ((P.streak || 0) >= 3 && chip) { X.breakStreak(chip); setTimeout(() => chip.classList.remove("show", "gold"), 450); }
      P.streak = 0; P.record = false;
    }
    /* FX-04 (revu) : la maîtrise qui monte, en petit */
    let best = null;
    ex.nlist.forEach(n => { const a = mastery(n), b = before[n]; if (a != null && pct(a) > pct(b || 0)) { const d = a - (b || 0); if (!best || d > best.d) best = { n, a, b, d }; } });
    const vs = $("#side .v-sub");
    if (best && vs) { const r = vs.getBoundingClientRect(); X.nudge(vs, clip(NOTIONS[best.n].title, 30) + " · " + (best.b == null ? "0" : pct(best.b)) + " → " + pct(best.a) + " %", { x: r.left + Math.min(r.width, 220) / 2, y: r.top - 4 }); }
    /* FX-15 (revu) : notion acquise */
    ex.nlist.forEach(n => { const a = mastery(n), b = before[n]; if (a != null && a >= 0.8 && (b == null || b < 0.8)) queueToast("Notion acquise", NOTIONS[n].title); });
    checkAch();
    updateGoal();
  }

  /* Bandeaux texte à la suite (notions acquises, succès) */
  const TQ = []; let tqBusy = false;
  function queueToast(title, sub, color) { TQ.push([title, sub, color]); if (!tqBusy) nextToast(); }
  function nextToast() {
    const t = TQ.shift();
    if (!t) { tqBusy = false; return; }
    tqBusy = true;
    const d = X.achievement(t[0], t[1], { color: t[2] });
    if (!d) toast(t[0] + " : " + t[1]);
    setTimeout(nextToast, d ? d - 500 : 2700);
  }

  /* MC-01 : succès discrets (texte seul) */
  const capFirst = s => s.charAt(0).toUpperCase() + s.slice(1);
  function achList() {
    const fem = !!U.fem;
    return [
      { id: "diag", t: "Diagnostic fait" },
      { id: "perfect", t: "Première série parfaite" },
      { id: "streak10", t: "Série de 10" },
      { id: "explorer", t: "Tout exploré" },
      { id: "errors0", t: "Ardoise propre" },
      { id: "plan", t: "Plan terminé" },
      { id: "sim", t: "Simulation réussie" }
    ].concat(CH.map(p => ({ id: "part-" + p, t: capFirst(U.one) + " " + PARTS[p].roman + " maîtrisé" + (fem ? "e" : "") })))
      .concat([{ id: "master", t: W.one + " maîtrisé" + (W === KIND.lecon ? "e" : "") }]);
  }
  function unlock(id, title) {
    if (!S || S.ach[id]) return;
    S.ach[id] = Date.now();
    save();
    queueToast("Succès", title, "#ffd60a");
  }
  function checkAch() {
    const mm = masteryMap();
    if (NIDS.every(id => mm[id] != null)) unlock("explorer", "Tout exploré");
    const errs = errorIds().length;
    S.maxErr = Math.max(S.maxErr || 0, errs);
    if (S.maxErr >= 5 && errs === 0) unlock("errors0", "Ardoise propre");
    CH.forEach(p => {
      const ids = NIDS.filter(id => NOTIONS[id].part === p);
      if (ids.length && ids.every(id => (mm[id] || 0) >= 0.8)) unlock("part-" + p, achList().find(a => a.id === "part-" + p).t);
    });
    if (globalScore() >= 0.8) unlock("master", achList().find(a => a.id === "master").t);
  }
  function achHTML() {
    const L = achList(), n = L.filter(a => S.ach[a.id]).length;
    const on = L.filter(a => S.ach[a.id]), next = L.filter(a => !S.ach[a.id]).map(a => a.t);
    return `<div class="ach"><h4>Succès · ${n} sur ${L.length}</h4><div class="ach-list">${on.map(a => `<span class="ach-chip on">${esc(a.t)}</span>`).join("")}${next.length ? `<span class="ach-chip" title="${esc(next.join(", "))}">${on.length ? "+" : ""}${next.length} à débloquer</span>` : ""}</div></div>`;
  }

  /* MC-05 (revu, plus de dopamine) : jours de suite */
  function daysHTML() {
    if (!G.days.length) return "";
    const n = dayStreak(), set = new Set(G.days), today = dayKey();
    const dots = [];
    for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const k = dayKey(d); dots.push(`<i class="${set.has(k) ? "on" : ""} ${k === today ? "today" : ""}"></i>`); }
    return `<div class="fact-days"><b id="daysN">${n}</b><span>jour${n > 1 ? "s" : ""} de suite</span><span class="days-dots">${dots.join("")}</span></div>`;
  }
  function flipLogo() {
    const w = $(".brand .logo-flip");
    if (!w || w._busy) return;
    w._busy = true; X.logoFlip(w); setTimeout(() => { w._busy = false; }, 1300);
  }
  let LOGO_DONE = false;
  function homeFx(root) {
    if (!LOGO_DONE) { LOGO_DONE = true; setTimeout(flipLogo, 150); }
    const title = $(".hero-t", root), hl = $(".hero-t .hl", root);
    X.wordsIn(title);
    const t1 = setTimeout(() => { const w = $(".fx-w", hl) || hl; X.shimmer(w); X.underline(hl, "var(--accent)"); }, 750);
    const hero = $(".hero", root);
    if (hero) X.spotlight(hero);
    countAll(root);
    const hp = $(".hero-prog", root);
    if (hp) { X.fillBars($$(".bar i", hp)); const b = $(".hp-top b", hp); if (b) X.countUp(b, parseInt(b.textContent, 10) || 0, { suffix: " %" }); }
    X.stagger($$(".covers > *", root), { y: 16, step: 80, duration: 520 });
    X.fillBars($$(".cv-bar i", root));
    const covers = $$(".covers button.cover", root);
    covers.forEach(c => X.tilt(c));
    if (covers[0]) {
      const c = covers[0]; let fl = null;
      const start = () => { fl = X.float(c, { rotate: 0 }); };
      const t2 = setTimeout(start, 900);
      c.addEventListener("pointerenter", () => { if (fl && fl.cancel) fl.cancel(); fl = null; });
      c.addEventListener("pointerleave", () => { if (!fl) start(); });
      CLEAN.push(() => { clearTimeout(t2); if (fl && fl.cancel) fl.cancel(); });
    }
    const cta = $("#start", root);
    const t3 = cta ? setTimeout(() => X.breathe(cta), 2600) : 0;
    /* Jours de suite : on fête une seule fois par jour */
    const today = dayKey(), dn = $("#daysN", root);
    if (dn && G.days.includes(today) && G.celebrated !== today) {
      G.celebrated = today; save();
      const n = dayStreak();
      setTimeout(() => {
        X.countUp(dn, n, { from: Math.max(0, n - 1), duration: 700 });
        X.pop(dn.parentNode, 1.06);
        X.burst(dn, { count: 14, min: 24, max: 60 });
        X.stagger($$(".days-dots i", root), { y: 0, scale: .4, step: 60 });
      }, 900);
    }
    CLEAN.push(() => { clearTimeout(t1); clearTimeout(t3); });
  }

  /* IM-01 / IM-02 : petit onglet de réglages */
  function openSettings() {
    let dirty = false;
    const rmSys = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seg = (id, opts, cur) => `<div class="segmented" id="${id}">${opts.map(([v, l]) => `<button data-v="${v}" class="${String(v) === String(cur) ? "on" : ""}">${l}</button>`).join("")}</div>`;
    const card = openModal(`
      <div class="modal-head"><h3>Réglages</h3><button class="icon-btn" data-close aria-label="Fermer">${ICON.close}</button></div>
      <div class="set-row"><div><b>Effets visuels</b><span>Réussites, séries, confettis, transitions. Jamais de son.</span></div>${seg("sFx", [[0, "Aucun"], [1, "Doux"], [2, "Complet"]], G.fx)}</div>
      <div class="set-row"><div><b>Animations</b><span>« Auto » suit le réglage de ton appareil${rmSys ? " (il demande des animations réduites)" : ""}.</span></div>${seg("sMo", [["auto", "Auto"], ["reduce", "Réduites"], ["full", "Complètes"]], G.motion)}</div>
      <div class="set-row"><div><b>Rappel actif</b><span>Masque les propositions tant que tu n'as pas répondu de tête.</span></div>${switchHTML("sRecall", G.recall)}</div>
      <div class="set-row"><div><b>Sans citations</b><span>Retire les exercices de citation.</span></div>${switchHTML("sNq", G.noQuotes)}</div>
      <div class="set-row"><div><b>Longueur des séries</b><span>Nombre d'exercices par série.</span></div>${seg("sLen", [[8, "8"], [12, "12"], [20, "20"]], G.len)}</div>
      <div class="set-foot"><span class="note">Les réglages valent pour tous les livres et leçons.</span><button class="btn secondary sm" id="sTry">Essayer les effets</button></div>`, "settings", () => { if (dirty) render(); });
    const segBind = (id, fn) => $$("#" + id + " button", card).forEach(b => b.onclick = () => { $$("#" + id + " button", card).forEach(x => x.classList.toggle("on", x === b)); fn(b.dataset.v); save(); });
    segBind("sFx", v => { G.fx = +v; applyFx(); });
    segBind("sMo", v => { G.motion = v; applyFx(); });
    segBind("sLen", v => { G.len = +v; dirty = true; });
    bindSwitch("sRecall", v => { G.recall = v; save(); dirty = true; });
    bindSwitch("sNq", v => { G.noQuotes = v; save(); dirty = true; });
    $("#sTry", card).onclick = e => { const b = e.currentTarget; X.ripple(b, e.clientX, e.clientY, "rgba(0,113,227,.25)"); X.pop(b); X.burst(b); };
  }

  /* MC-03 : gain de la soirée, à la fin d'une session du plan */
  function showGain(from, to) {
    if (from == null) return;
    const gain = to - from;
    const card = openModal(`
      <div class="eyebrow accent">Session terminée</div>
      <h2 class="gain-t">Ce soir : <span class="gain-n">${gain >= 0 ? "+" : ""}${gain}</span> point${Math.abs(gain) > 1 ? "s" : ""} de préparation</h2>
      <div class="gain-bars">
        <div><span>Avant</span><span class="bar"><i style="width:${from}%;background:var(--fill-3)"></i></span><b>${from} %</b></div>
        <div><span>Après</span><span class="bar good"><i class="after" style="width:${to}%"></i></span><b>${to} %</b></div>
      </div>
      <p class="muted">Bravo. Le sommeil va maintenant faire une bonne partie du travail.</p>
      <button class="btn primary lg" data-close>Voir le bilan</button>`, "gain");
    X.fillBars([$(".after", card)]);
    const n = $(".gain-n", card);
    if (gain > 0) { X.countUp(n, gain, { duration: 900 }); setTimeout(() => { n.textContent = "+" + gain; X.pop(n, 1.15); X.burst(n, { count: 18 }); }, 950); }
  }

  /* ---------- Rendus par type ---------- */
  const R = {};
  function recallWrap(inner, t, p, btn) {
    return `<div class="recall-wrap ${G.recall ? "hidden" : ""}" data-rw><div class="recall-target">${inner}</div>
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
    const cols = Math.min(CH.length, 6);
    el.innerHTML = `<div class="pq"><p class="quote">${esc(ex.quote)}</p><div class="part-btns" style="grid-template-columns:repeat(${cols},1fr)">${CH.map(p => `<button class="part-btn" data-p="${p}"><span class="r">${PARTS[p].roman}</span><span class="l">${esc(PARTS[p].label)}</span></button>`).join("")}</div></div>`;
    let given = null;
    const btns = $$(".part-btn", el);
    btns.forEach(b => b.onclick = () => { if (CHECKED) return; given = +b.dataset.p; api.check(); });
    return {
      key(k) { const n = parseInt(k, 10); if (n >= 1 && n <= btns.length) { btns[n - 1].click(); return true; } return false; },
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
    else canvas = `<div class="pictos">${ex.nodes.map(nd => `<div class="picto">${PICTO[nd.icon] || ""}<span class="cap">${esc(nd.cap)}</span>${slot(nd)}</div>`).join("")}</div>`;
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
        const mark = v => v == null ? "?" : v ? "✓" : "✗";
        const items = ex.rows.map((r, i) => {
          let rowOk = 0;
          r.a.forEach((a, j) => {
            tot++;
            const good = val[i][j] === a; if (good) { ok++; rowOk++; }
            const c = $(`.cell[data-r="${i}"][data-c="${j}"]`, el);
            c.classList.add(good ? "correct" : "wrong");
            if (!good) { c.textContent = a ? "✓" : "✗"; c.classList.remove("yes", "no"); c.classList.add(a ? "yes" : "no"); }
          });
          return { n: r.n, r: rowOk / r.a.length, g: r.t + " : " + ex.cols.map((c, j) => c + " " + mark(val[i][j])).join(", "), e: r.t + " : " + ex.cols.map((c, j) => c + " " + mark(r.a[j])).join(", ") };
        });
        return {
          score: ok / tot, items,
          given: ex.rows.map((r, i) => r.t + " : " + val[i].map(mark).join("")).join(" | "),
          expected: ex.rows.map(r => r.t + " : " + r.a.map(mark).join("")).join(" | "),
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
          expectedHTML: `<p><b>Problématique.</b> ${esc(ex.prob)}</p><ol style="margin-top:10px">${ex.plan.map(x => `<li>${esc(x)}</li>`).join("")}</ol>${ex.cit ? `<p class="quote" style="margin-top:12px">« ${esc(ex.cit)} »</p>` : ""}`
        };
      }
    };
  };

  /* =========================================================
     Bilan & export universel (n'importe quelle IA)
     ========================================================= */
  VIEWS.bilan = function (root) {
    const mm = masteryMap();
    const g = Math.round(globalScore() * 100);
    const st = g >= 80 ? "good" : g >= 50 ? "mid" : "weak";
    const tested = NIDS.filter(id => mm[id] != null).length;
    const { answered, acc } = stats();
    const caption = !answered ? "Rien encore : lance le diagnostic, puis suis le plan." : g < 35 ? "Tu débutes. Suis le plan : diagnostic, lecture, exercices." : g < 60 ? "Les bases sont là. Concentre-toi sur les notions en rouge." : g < 80 ? "Bonne préparation. Consolide les dernières notions fragiles." : "Tu es prêt. Une simulation d'épreuve, puis au lit.";
    const errsBy = {};
    errorIds().forEach(id => EX[id].nlist.forEach(n => { errsBy[n] = (errsBy[n] || 0) + 1; }));
    const weak = rankWeak();
    const parts = (NIDS.some(id => NOTIONS[id].part === 0) ? [0] : []).concat(CH);
    root.innerHTML = `
    <section class="view bilan">
      <div class="card b-over">
        <div class="eyebrow">Préparation globale</div>
        ${ringHTML(g, answered ? st : "")}
        <p class="caption">${esc(caption)}</p>
        <div class="b-stats"><div><b><span class="cnt" data-v="${tested}">${tested}</span>/${NIDS.length}</b><span>notions testées</span></div><div><b class="cnt" data-v="${answered}">${answered}</b><span>exercices faits</span></div><div><b><span class="cnt" data-v="${acc}">${acc}</span> %</b><span>de réussite</span></div></div>
        <div class="b-actions">
          <button class="btn primary" id="copy">Copier le bilan pour ton IA</button>
          <button class="btn secondary" id="pdf">Exporter le PDF</button>
          <div style="display:flex;gap:4px;justify-content:center"><button class="btn ghost sm" id="txt">Télécharger en .txt</button><button class="btn ghost gray sm" id="reset">Réinitialiser</button></div>
          <p class="note" style="text-align:center">Colle-le dans ChatGPT, Claude, Gemini, Mistral… : il contient une consigne prête à l'emploi.</p>
        </div>
      </div>
      <div class="card b-parts"><h3>Par ${esc(U.one)}</h3><p class="small muted" style="margin-top:4px">Moyenne de maîtrise des notions ; une notion non testée compte zéro.</p>
        <div class="bp-list">${parts.map(p => { const sc = partScore(p); const has = partTested(p); const s = status(has ? sc : null); const nb = NIDS.filter(id => NOTIONS[id].part === p).length;
          return `<button class="bp-row" data-part="${p}"><span class="r">${p ? PARTS[p].roman : "§"}</span><div><div class="t">${esc(p ? PARTS[p].label : "Contexte")}<span>${nb} notion${nb > 1 ? "s" : ""}</span></div><div class="bar ${s}"><i style="width:${pct(sc)}%"></i></div></div><span class="p">${has ? pct(sc) + " %" : "—"}</span></button>`; }).join("")}</div>
        ${achHTML()}
      </div>
      <div class="card b-weak">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px"><h3>À retravailler en priorité</h3><span class="small muted">rouge, puis orange, puis non testé</span></div>
        ${weak.length ? `<ul class="bw-list">${weak.map(x => { const s = status(x.m), e = errsBy[x.id] || 0;
          return `<li class="bw-row"><span class="dot ${s}"></span><div style="min-width:0"><div class="t">${esc(NOTIONS[x.id].title)}</div><div class="s">${esc(partLabel(NOTIONS[x.id].part))} · ${x.m == null ? "non testé" : pct(x.m) + " %"}${e ? " · " + e + " erreur" + (e > 1 ? "s" : "") : ""}</div></div>
            <div class="acts"><button class="btn ghost sm" data-fiche="${x.id}">Fiche</button>${NOTIONS[x.id].video ? `<a class="btn ghost sm" href="${yt(NOTIONS[x.id].video)}" target="_blank" rel="noopener">Vidéos</a>` : ""}<button class="btn ghost sm" data-train-notion="${x.id}">S'entraîner</button></div></li>`; }).join("")}</ul>`
          : `<div class="empty"><div><b style="color:var(--text);font-size:17px">Tout est acquis.</b><span>Toutes les notions sont au vert. Fais une simulation d'épreuve pour vérifier.</span><button class="btn primary" id="toSim">Simulation</button></div></div>`}
      </div>
    </section>`;
    $$(".bp-row").forEach(b => b.onclick = () => go("carte", { part: +b.dataset.part }));
    $("#pdf").onclick = exportPDF;
    $("#copy").onclick = () => copyText(buildReport().text);
    $("#txt").onclick = () => downloadText(buildReport().text);
    $("#reset").onclick = () => { if (confirm("Effacer ta progression sur " + W.this + " (réponses, plan, session) ?")) { S = bookDefaults(); MC = null; save(); P = null; toast("Progression effacée."); render(); } };
    const ts = $("#toSim"); if (ts) ts.onclick = () => startSession({ title: "Simulation d'épreuve", ids: pickBuild(4), from: "reflexion" });
    animateRing($(".b-over .ring", root), g);
    countAll(root);
    X.fillBars($$(".bp-row .bar i", root));
    X.stagger($$(".ach-chip.on", root), { y: 6, scale: .94, step: 40 });
    if (PENDING_GAIN) { const g2 = PENDING_GAIN; PENDING_GAIN = null; setTimeout(() => showGain(g2.from, g2.to), 350); }
  };

  function computedTips(weak, errs) {
    const out = [];
    const { answered } = stats();
    if (!answered) { out.push("Commence par le diagnostic éclair : il repère en 5 minutes ce que tu sais déjà."); return out; }
    const worst = CH.filter(partTested).map(p => ({ p, s: partScore(p), n: NIDS.filter(id => NOTIONS[id].part === p && (mastery(id) == null || mastery(id) < 0.8)).length })).sort((a, b) => a.s - b.s)[0];
    if (worst && worst.s < 0.6 && worst.n) out.push(`Relis en priorité ${U.one === "partie" ? "la" : "le"} ${U.one} ${PARTS[worst.p].roman} (${PARTS[worst.p].label.toLowerCase()}) : ${worst.n} notion${worst.n > 1 ? "s y restent fragiles" : " y reste fragile"}.`);
    const untested = NIDS.filter(id => mastery(id) == null).length;
    if (untested) out.push(`${untested} notion${untested > 1 ? "s n'ont" : " n'a"} jamais été testée${untested > 1 ? "s" : ""} : un « Mix intelligent » les vise en premier.`);
    const byType = {};
    const last = lastByEx();
    Object.keys(last).forEach(id => { const t = EX[id] && EX[id].type; if (t) (byType[t] = byType[t] || []).push(last[id].r); });
    const tAvg = t => byType[t] && byType[t].length >= 2 ? avg(byType[t]) : null;
    if (tAvg("build") != null && tAvg("build") < 0.6) out.push("Questions de réflexion : tu retiens encore des arguments hors sujet. Avant de répondre, reformule la question en une phrase et vérifie que chaque argument y répond.");
    if (!G.noQuotes && tAvg("part") != null && tAvg("part") < 0.6) out.push("Tu situes mal les citations " + W.in + " : refais les exercices « Quelle partie ? » avec la Carte ouverte à côté.");
    if (!G.noQuotes && tAvg("fill") != null && tAvg("fill") < 0.6) out.push("Les formules exactes ne sont pas encore fixées : refais les textes à trous à voix haute.");
    if (tAvg("vf") != null && tAvg("vf") < 0.6) out.push("Tu tombes dans les pièges des vrai/faux : lis la justification de chaque erreur, c'est là que se cachent les confusions.");
    if (errs.length > 8) out.push(`Tu as ${errs.length} erreurs non corrigées : refais-les jusqu'au vert avant d'attaquer de nouvelles notions.`);
    return out;
  }
  function buildReport() {
    const meta = B.meta, exam = B.exam || {};
    const mm = masteryMap();
    const date = new Date().toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" });
    const g = Math.round(globalScore() * 100);
    const tested = NIDS.filter(id => mm[id] != null).length;
    const { answered, acc } = stats();
    const latest = {};
    S.attempts.forEach(a => { latest[a.ex + "|" + a.n] = a; });
    const errs = {};
    const errList = Object.values(latest).filter(a => a.r < 0.99);
    errList.forEach(a => (errs[a.n] = errs[a.n] || []).push(a));
    const ranked = NIDS.map(id => ({ id, m: mm[id] })).sort((a, b) => (a.m == null ? 2 : a.m) - (b.m == null ? 2 : b.m));
    const weak = ranked.filter(x => x.m != null && x.m < 0.8);
    const untested = ranked.filter(x => x.m == null);
    const tips = computedTips(weak, errList).concat(B.tips || []);
    const work = "« " + meta.title + " »" + (meta.author ? " de " + meta.author : "") + (meta.year ? " (" + meta.year + ")" : "");
    const prompt = [
      `Agis comme un professeur bienveillant et exigeant. Je prépare ${exam.kind ? "un " + exam.kind : "une évaluation"} sur ${work}${exam.format ? ", au format : " + exam.format : ""}.`,
      "Voici le bilan de mon entraînement : ma maîtrise par notion, mes erreurs non corrigées et les notions que je n'ai pas encore travaillées.",
      "1. Fais le bilan de mes connaissances manquantes, classées par priorité, en t'appuyant sur mes erreurs.",
      "2. Pour chaque notion fragile : explique l'idée simplement, déroule l'argument étape par étape, donne une image ou une formule du texte à retenir, et signale le piège à éviter.",
      "3. Donne-moi des conseils concrets de méthode pour réussir cette épreuve.",
      "4. Pose-moi 5 questions de vérification, sans les réponses. Je te répondrai, puis tu me corrigeras."
    ].join("\n");
    const noteBlock = (x, pad) => {
      const n = NOTIONS[x.id], L = [];
      L.push(pad + "L'essentiel : " + n.essentiel);
      if (n.retenir && n.retenir.length) { L.push(pad + "À retenir :"); n.retenir.forEach(r => L.push(pad + "  • " + r)); }
      if (n.piege) L.push(pad + "Piège : " + n.piege);
      if (n.citation && !G.noQuotes) L.push(pad + "Citation : « " + n.citation + " »");
      return L;
    };

    const L = [];
    L.push("CONSIGNE POUR L'IA (ChatGPT, Claude, Gemini, Mistral, Copilot…)");
    L.push(prompt);
    L.push("");
    L.push("────────────────────────────────────────");
    L.push("BILAN DE CONNAISSANCES · " + work);
    L.push("Recto · généré le " + date);
    L.push(`Préparation globale : ${g} % · notions testées : ${tested}/${NIDS.length} · exercices faits : ${answered} · réussite : ${acc} %`);
    L.push("");
    L.push("1. CE QUI TE MANQUE (par priorité)");
    if (!weak.length && !untested.length) L.push("Rien : toutes les notions testées sont acquises.");
    weak.forEach((x, i) => {
      L.push(`\n${i + 1}. ${NOTIONS[x.id].title} · ${partLabel(NOTIONS[x.id].part)} · maîtrise ${pct(x.m)} %`);
      noteBlock(x, "   ").forEach(l => L.push(l));
      (errs[x.id] || []).forEach(a => { L.push("   Erreur · " + a.q); L.push("     Ma réponse : " + a.g); L.push("     Attendu : " + a.e); });
    });
    if (untested.length) {
      L.push("\nJamais testées (à découvrir) :");
      untested.forEach(x => L.push(`- ${NOTIONS[x.id].title} (${partLabel(NOTIONS[x.id].part)}) : ${NOTIONS[x.id].essentiel}`));
    }
    const otherErr = Object.keys(errs).filter(id => !weak.some(w => w.id === id));
    if (otherErr.length) {
      L.push("\nAutres erreurs non corrigées (notions par ailleurs acquises) :");
      otherErr.forEach(id => errs[id].forEach(a => { L.push(`- ${NOTIONS[id].title} · ${a.q}`); L.push("  Ma réponse : " + a.g + " · Attendu : " + a.e); }));
    }
    L.push("");
    L.push("2. TIPS");
    tips.forEach(t => L.push("- " + t));
    L.push("");
    L.push("3. MAÎTRISE PAR NOTION");
    ranked.forEach(x => L.push(`- [${STATUS_LABEL[status(x.m)]}] ${NOTIONS[x.id].title} (${partLabel(NOTIONS[x.id].part)}) : ${x.m == null ? "non testé" : pct(x.m) + " %"}`));
    const text = L.join("\n");

    const h = [];
    h.push(`<div class="pr-head"><div class="pr-brand">recto</div><h1>Bilan de connaissances</h1><p>${esc(work)} · ${esc(date)}</p></div>`);
    h.push(`<div class="pr-stats"><div><b>${g} %</b><span>préparation globale</span></div><div><b>${tested}/${NIDS.length}</b><span>notions testées</span></div><div><b>${answered}</b><span>exercices faits</span></div><div><b>${acc} %</b><span>de réussite</span></div></div>`);
    h.push(`<h2>1. Ce qui te manque</h2>`);
    if (!weak.length) h.push(`<p>Aucune notion fragile parmi celles testées.</p>`);
    weak.forEach((x, i) => {
      const n = NOTIONS[x.id];
      h.push(`<div class="pr-notion"><h3><span>${i + 1}. ${esc(n.title)} · ${esc(partLabel(n.part))}</span><span>${pct(x.m)} %</span></h3><p>${esc(n.essentiel)}</p>${n.retenir ? `<ul>${n.retenir.map(r => `<li>${esc(r)}</li>`).join("")}</ul>` : ""}${n.piege ? `<p class="pr-trap"><b>Piège :</b> ${esc(n.piege)}</p>` : ""}${n.citation && !G.noQuotes ? `<p class="pr-cit">« ${esc(n.citation)} »</p>` : ""}${(errs[x.id] || []).map(a => `<div class="pr-err"><div class="q">${esc(a.q)}</div><div class="g">Ma réponse : ${esc(a.g)}</div><div class="e">Attendu : ${esc(a.e)}</div></div>`).join("")}</div>`);
    });
    if (untested.length) h.push(`<p><b>Jamais testées :</b> ${untested.map(x => esc(NOTIONS[x.id].title)).join(", ")}.</p>`);
    h.push(`<h2>2. Tips</h2><ul class="pr-tips">${tips.map(t => `<li>${esc(t)}</li>`).join("")}</ul>`);
    h.push(`<h2>3. Maîtrise par notion</h2><table><thead><tr><th>Notion</th><th>${esc(U.one)}</th><th>Statut</th><th>Maîtrise</th></tr></thead><tbody>${ranked.map(x => `<tr><td>${esc(NOTIONS[x.id].title)}</td><td>${esc(partLabel(NOTIONS[x.id].part))}</td><td>${STATUS_LABEL[status(x.m)]}</td><td>${x.m == null ? "—" : pct(x.m) + " %"}</td></tr>`).join("")}</tbody></table>`);
    h.push(`<h2>4. À donner à ton IA</h2><p class="pr-small">Joins ce PDF ou colle le texte dans ChatGPT, Claude, Gemini, Mistral… avec cette consigne :</p><div class="pr-prompt">${esc(prompt)}</div>`);
    return { text, html: h.join("") };
  }
  function exportPDF() {
    if (!S.attempts.length) { toast("Fais d'abord quelques exercices."); return; }
    $("#print").innerHTML = buildReport().html;
    toast("Choisis « Enregistrer au format PDF » comme imprimante.");
    setTimeout(() => window.print(), 350);
  }
  function copyText(text) {
    const done = () => toast("Bilan copié : colle-le dans ton IA.");
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
    a.download = "bilan-" + B.id + ".txt";
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

  /* Accès console, pour tester : Recto.start(["schema-1"]) dans un contenu ouvert */
  Object.assign(window.Recto, { start: ids => startSession({ title: "Test", ids }), report: () => buildReport().text });

  route();
})();
