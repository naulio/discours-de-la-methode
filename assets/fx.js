/* Recto · bibliothèque d'effets visuels (aucun son).
   Chaque effet respecte le niveau d'intensité (0 aucun · 1 doux · 2 complet)
   et le réglage système « réduire les animations ». */
window.FX = (function () {
  "use strict";
  const RM = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  /* motion : "auto" suit l'appareil, "reduce" force les animations réduites, "full" les garde */
  const state = { level: 2, motion: "auto", forceReduced: false };
  const reduced = () => state.forceReduced || state.motion === "reduce" || (state.motion !== "full" && RM.matches);
  const can = kind => state.level > 0 && (kind !== "hard" || (state.level >= 2 && !reduced()));
  const PALETTE = ["#34c759", "#0071e3", "#ffcc00", "#ff9f0a", "#5856d6", "#30b0c7"];
  const EASE = "cubic-bezier(.2,.7,.2,1)", BOUNCE = "cubic-bezier(.34,1.56,.64,1)";
  const rnd = (a, b) => a + Math.random() * (b - a);
  let layer = null;
  function getLayer() {
    if (!layer || !layer.isConnected) {
      layer = document.createElement("div");
      layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden";
      document.body.appendChild(layer);
    }
    return layer;
  }
  const centerOf = el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  const cleanup = (anim, node) => { anim.onfinish = () => node.remove(); anim.oncancel = () => node.remove(); };
  const relative = el => { if (getComputedStyle(el).position === "static") el.style.position = "relative"; };

  /* FX-01 : onde depuis le point de clic */
  function ripple(el, x, y, color) {
    if (!can("soft")) return;
    const r = el.getBoundingClientRect();
    if (x == null) { x = r.left + r.width / 2; y = r.top + r.height / 2; }
    const size = Math.max(r.width, r.height) * 2.4;
    relative(el); el.style.overflow = "hidden";
    const s = document.createElement("span");
    s.style.cssText = `position:absolute;left:${x - r.left - size / 2}px;top:${y - r.top - size / 2}px;width:${size}px;height:${size}px;border-radius:50%;background:${color || "rgba(52,199,89,.34)"};pointer-events:none`;
    el.appendChild(s);
    cleanup(s.animate(reduced()
      ? [{ opacity: .7 }, { opacity: 0 }]
      : [{ transform: "scale(0)", opacity: .95 }, { transform: "scale(1)", opacity: 0 }], { duration: 650, easing: EASE }), s);
  }
  function pop(el, s) {
    if (!can("soft") || reduced()) return;
    el.animate([{ transform: "scale(1)" }, { transform: `scale(${s || 1.035})` }, { transform: "scale(1)" }], { duration: 360, easing: BOUNCE });
  }
  /* FX-02 : gerbe de particules */
  function burst(el, o) {
    o = o || {};
    if (!can("hard")) return;
    const L = getLayer(), c = o.x != null ? o : centerOf(el), cols = o.colors || PALETTE, n = o.count || 16;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i"), bar = Math.random() < .45, sz = rnd(4, 7);
      p.style.cssText = `position:absolute;left:${c.x}px;top:${c.y}px;width:${bar ? sz * .45 : sz}px;height:${bar ? sz * 1.9 : sz}px;border-radius:${bar ? "2px" : "50%"};background:${cols[i % cols.length]};margin:${-sz / 2}px 0 0 ${-sz / 2}px`;
      L.appendChild(p);
      const a = (Math.PI * 2 * i) / n + rnd(-.3, .3), d = rnd(o.min || 38, o.max || 88), dx = Math.cos(a) * d, dy = Math.sin(a) * d, rot = rnd(-220, 220);
      cleanup(p.animate([
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx * .75}px,${dy * .75 - 8}px) rotate(${rot * .6}deg)`, opacity: 1, offset: .55 },
        { transform: `translate(${dx}px,${dy + 28}px) rotate(${rot}deg) scale(.6)`, opacity: 0 }
      ], { duration: rnd(640, 920), easing: EASE }), p);
    }
  }
  /* FX-04 / FX-18 : texte qui s'envole */
  function floatText(el, text, o) {
    o = o || {};
    if (!can("soft")) return;
    const r = el.getBoundingClientRect(), t = document.createElement("span");
    t.textContent = text;
    t.style.cssText = `position:absolute;left:${o.x != null ? o.x : r.left + r.width / 2}px;top:${o.y != null ? o.y : r.top}px;font:600 ${o.size || 12.5}px/1 Inter,-apple-system,system-ui,sans-serif;color:${o.color || "#1a7f37"};white-space:nowrap;letter-spacing:-.01em;background:${o.bg || "rgba(255,255,255,.95)"};padding:6px 10px;border-radius:980px;box-shadow:0 2px 12px rgba(0,0,0,.1),0 0 0 1px rgba(0,0,0,.04)`;
    getLayer().appendChild(t);
    cleanup(t.animate([
      { transform: "translate(-50%,-20%)", opacity: 0 },
      { transform: "translate(-50%,-110%)", opacity: 1, offset: .22 },
      { transform: "translate(-50%,-140%)", opacity: 1, offset: .75 },
      { transform: "translate(-50%,-185%)", opacity: 0 }
    ], { duration: reduced() ? 1000 : 1500, easing: EASE }), t);
  }
  /* FX-04 (revu, plus discret) : petit texte qui monte, sans fond */
  function nudge(el, text, o) {
    o = o || {};
    if (!can("soft")) return;
    const r = el.getBoundingClientRect(), t = document.createElement("span");
    t.textContent = text;
    t.style.cssText = `position:absolute;left:${o.x != null ? o.x : r.left + r.width / 2}px;top:${o.y != null ? o.y : r.top}px;font:600 12px/1 Inter,-apple-system,system-ui,sans-serif;color:${o.color || "#1a7f37"};white-space:nowrap;letter-spacing:-.005em;opacity:.9`;
    getLayer().appendChild(t);
    cleanup(t.animate(reduced()
      ? [{ transform: "translate(-50%,-100%)", opacity: 0 }, { transform: "translate(-50%,-100%)", opacity: .9, offset: .2 }, { transform: "translate(-50%,-100%)", opacity: 0 }]
      : [{ transform: "translate(-50%,-60%)", opacity: 0 }, { transform: "translate(-50%,-120%)", opacity: .9, offset: .25 }, { transform: "translate(-50%,-150%)", opacity: .9, offset: .8 }, { transform: "translate(-50%,-170%)", opacity: 0 }],
      { duration: 1800, easing: EASE }), t);
  }
  /* FX-05 / FX-21 : reflet qui traverse */
  function sweep(el, o) {
    o = o || {};
    if (!can("soft")) return;
    relative(el); el.style.overflow = "hidden";
    const s = document.createElement("span");
    s.style.cssText = `position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 30%,${o.color || "rgba(255,255,255,.7)"} 50%,transparent 70%)`;
    el.appendChild(s);
    cleanup(s.animate([{ transform: "translateX(-120%)" }, { transform: "translateX(120%)" }], { duration: o.duration || 850, easing: "cubic-bezier(.4,0,.2,1)" }), s);
  }
  /* FX-06 */
  function shake(el) {
    if (!can("soft") || reduced()) return;
    el.animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(5px)" }, { transform: "translateX(-3px)" }, { transform: "translateX(2px)" }, { transform: "translateX(0)" }], { duration: 380, easing: "ease-out" });
  }
  /* FX-07 */
  function glow(el, base) {
    if (!can("soft")) return;
    const b = base ? base + "," : "";
    el.animate([{ boxShadow: b + "0 0 0 0 rgba(52,199,89,.55)" }, { boxShadow: b + "0 0 0 12px rgba(52,199,89,0)" }], { duration: 900, iterations: 2, easing: "ease-out" });
  }
  /* FX-03 : coche tracée */
  function drawCheck(icon) {
    const path = icon.querySelector("path");
    if (!path) return;
    const len = path.getTotalLength ? path.getTotalLength() : 20;
    path.style.strokeDasharray = len;
    if (!can("soft") || reduced()) { path.style.strokeDashoffset = 0; return; }
    icon.animate([{ transform: "scale(.4)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 380, easing: BOUNCE });
    path.animate([{ strokeDashoffset: len }, { strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 620, easing: EASE, fill: "both" });
  }
  /* FX-11 / FX-17 */
  function countUp(el, to, o) {
    o = o || {};
    const from = o.from || 0, suf = o.suffix || "", dur = !can("soft") || reduced() ? 0 : (o.duration || 1000);
    if (!dur) { el.textContent = to + suf; return; }
    const t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(from + (to - from) * e) + suf; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function ringTo(circle, p, o) {
    const r = +circle.getAttribute("r"), c = 2 * Math.PI * r, end = c * (1 - p / 100), start = c * (1 - ((o && o.from) || 0) / 100);
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = end;
    if (!can("soft") || reduced()) return;
    circle.animate([{ strokeDashoffset: start }, { strokeDashoffset: end }], { duration: (o && o.duration) || 1100, easing: EASE });
  }
  /* FX-14 / FX-27 : apparition en cascade */
  function stagger(nodes, o) {
    o = o || {};
    if (!can("soft")) return;
    Array.from(nodes).forEach((n, i) => n.animate(reduced()
      ? [{ opacity: 0 }, { opacity: 1 }]
      : [{ opacity: 0, transform: `translate(${o.x || 0}px,${o.y == null ? 10 : o.y}px) scale(${o.scale || 1})` }, { opacity: 1, transform: "none" }],
      { duration: o.duration || 440, delay: i * (o.step || 55), easing: EASE, fill: "backwards" }));
  }
  /* FX-16 */
  function fillBars(bars, o) {
    o = o || {};
    if (!can("soft")) return;
    Array.from(bars).forEach((i, k) => { const w = i.style.width || "0%"; i.animate([{ width: "0%" }, { width: w }], { duration: 700, delay: k * (o.step || 70), easing: EASE, fill: "backwards" }); });
  }
  /* FX-18 */
  function strike(el) {
    relative(el);
    const l = document.createElement("span");
    l.style.cssText = "position:absolute;left:0;right:0;top:52%;height:1.5px;background:currentColor;transform-origin:left;opacity:.5;pointer-events:none";
    el.appendChild(l);
    if (can("soft") && !reduced()) l.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: 460, easing: "cubic-bezier(.4,0,.2,1)", fill: "both" });
    return l;
  }
  /* FX-19 / FX-20 : remplacement avec glissement */
  function swap(el, fn, o) {
    o = o || {};
    if (!can("soft")) { fn(); return; }
    const dx = reduced() ? 0 : (o.dx == null ? 20 : o.dx), sc = o.zoom ? " scale(.985)" : "";
    const out = el.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: `translateX(${-dx}px)${sc}` }], { duration: 170, easing: "ease-in", fill: "forwards" });
    out.onfinish = () => {
      fn(); out.cancel();
      el.animate([{ opacity: 0, transform: `translateX(${dx}px)${sc}` }, { opacity: 1, transform: "none" }], { duration: 260, easing: EASE });
    };
  }
  /* FX-22 : vol d'une étiquette vers sa case (FLIP) */
  function fly(node, target) {
    const a = node.getBoundingClientRect();
    target.appendChild(node);
    if (!can("soft") || reduced()) return;
    const b = node.getBoundingClientRect();
    node.animate([{ transform: `translate(${a.left - b.left}px,${a.top - b.top}px) scale(1.04)` }, { transform: "none" }], { duration: 420, easing: BOUNCE });
  }
  function drawLine(path) {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    if (!can("soft") || reduced()) return;
    path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 420, easing: EASE, fill: "both" });
  }
  /* FX-08 → FX-10, MC-04 : pastille de série */
  function streak(el, n, big) {
    el.textContent = n + " d'affilée";
    el.style.opacity = 1;
    if (!can("soft") || reduced()) return;
    el.animate([{ transform: "scale(.8)" }, { transform: `scale(${big ? 1.22 : 1.1})` }, { transform: "scale(1)" }], { duration: big ? 520 : 380, easing: BOUNCE });
    if (big) sweep(el, { color: "rgba(255,255,255,.8)" });
  }
  function breakStreak(el) {
    if (!can("soft") || reduced()) { el.style.opacity = 0; return; }
    const a = el.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(.82)", opacity: 0 }], { duration: 420, easing: "ease-in", fill: "forwards" });
    a.onfinish = () => { el.style.opacity = 0; a.cancel(); };
  }
  /* FX-12 : confettis (canvas) */
  function confetti(o) {
    o = o || {};
    if (!can("hard")) return;
    const cv = document.createElement("canvas"), dpr = Math.min(2, window.devicePixelRatio || 1), W = innerWidth, H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999";
    document.body.appendChild(cv);
    const ctx = cv.getContext("2d"); ctx.scale(dpr, dpr);
    const cols = o.colors || PALETTE, ps = [], top = (o.from || "top") === "top";
    const ox = o.x != null ? o.x : W / 2, oy = o.y != null ? o.y : H * .4;
    for (let i = 0; i < (o.count || 150); i++) ps.push({
      x: top ? rnd(0, W) : ox, y: top ? rnd(-H * .35, -10) : oy, vx: top ? rnd(-1.4, 1.4) : rnd(-9, 9), vy: top ? rnd(2, 5.5) : rnd(-14, -4),
      w: rnd(5, 9), h: rnd(8, 14), rot: rnd(0, Math.PI), vr: rnd(-.2, .2), c: cols[i % cols.length], tl: rnd(0, 6.28)
    });
    const t0 = performance.now(), dur = o.duration || 2200;
    (function frame(t) {
      const k = (t - t0) / dur;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = Math.max(0, Math.min(1, (1 - k) / .3));
      ps.forEach(p => {
        p.vy += .17; p.vx *= .99; p.vy *= .99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.tl += .12;
        const s = Math.abs(Math.cos(p.tl));
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h * s / 2, p.w, p.h * s); ctx.restore();
      });
      if (k < 1) requestAnimationFrame(frame); else cv.remove();
    })(t0);
  }
  /* FX-13 : gerbes radiales */
  function fireworks(o) {
    o = o || {};
    if (!can("hard")) return;
    const W = innerWidth, H = innerHeight;
    const pts = o.points || [{ x: W * .3, y: H * .32 }, { x: W * .7, y: H * .28 }, { x: W * .5, y: H * .2 }];
    pts.forEach((p, i) => setTimeout(() => burst(null, { x: p.x, y: p.y, count: 34, min: 60, max: 150 }), i * 240));
  }
  function shimmer(el) {
    if (!can("soft") || reduced()) return;
    el.animate([{ backgroundPosition: "180% 0" }, { backgroundPosition: "-80% 0" }], { duration: 1400, easing: "cubic-bezier(.4,0,.2,1)" });
  }
  /* FX-15 / MC-01 (revu) : bandeau texte, arrivée douce et durée plus longue */
  function achievement(title, sub, o) {
    o = o || {};
    if (!can("soft")) return 0;
    const card = document.createElement("div");
    card.style.cssText = "position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:10000;pointer-events:none;background:rgba(29,29,31,.94);color:#fff;border-radius:18px;padding:13px 20px;min-width:260px;max-width:min(440px,90vw);box-shadow:0 14px 44px rgba(0,0,0,.22);font:500 13px/1.35 Inter,-apple-system,system-ui,sans-serif;overflow:hidden;backdrop-filter:blur(8px)";
    card.innerHTML = `<div style="font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:${o.color || "#34c759"}">${title}</div><div style="font-size:15px;font-weight:600;letter-spacing:-.015em;margin-top:3px">${sub}</div>`;
    document.body.appendChild(card);
    const dur = o.duration || 4600;
    cleanup(card.animate(reduced()
      ? [{ opacity: 0 }, { opacity: 1, offset: .12 }, { opacity: 1, offset: .9 }, { opacity: 0 }]
      : [{ opacity: 0, transform: "translate(-50%,14px)" }, { opacity: 1, transform: "translate(-50%,0)", offset: .16 }, { opacity: 1, transform: "translate(-50%,0)", offset: .9 }, { opacity: 0, transform: "translate(-50%,8px)" }],
      { duration: dur, easing: "cubic-bezier(.25,.1,.25,1)" }), card);
    setTimeout(() => sweep(card, { color: "rgba(255,255,255,.12)", duration: 1400 }), 700);
    return dur;
  }
  /* FX-23 (revu) : la fiche se retourne comme une carte, du verso au recto, puis son coin se plie */
  function logoFlip(wrap) {
    const inner = wrap.querySelector(".flip-in"), fold = wrap.querySelector(".front .logo-fold");
    if (!inner || !can("soft") || reduced()) return;
    inner.animate([{ transform: "rotateY(180deg)" }, { transform: "rotateY(-12deg)", offset: .75 }, { transform: "rotateY(0deg)" }], { duration: 900, easing: "cubic-bezier(.3,.6,.2,1)" });
    if (fold) {
      fold.style.transformBox = "fill-box"; fold.style.transformOrigin = "100% 0%";
      fold.animate([{ transform: "scale(0)" }, { transform: "scale(1.3)", offset: .65 }, { transform: "scale(1)" }], { duration: 480, delay: 760, easing: "ease-out", fill: "backwards" });
    }
  }
  /* FX-31 : flottement lent (boucle) */
  function float(el, o) {
    o = o || {};
    if (!can("soft") || reduced()) return null;
    const r = o.rotate || 0;
    return el.animate([{ transform: `translateY(0) rotate(${r}deg)` }, { transform: `translateY(-${o.y || 4}px) rotate(${r + .4}deg)` }, { transform: `translateY(0) rotate(${r}deg)` }], { duration: o.duration || 6000, iterations: o.loops || Infinity, easing: "ease-in-out" });
  }
  /* FX-33 : le bouton principal « respire » */
  function breathe(el) {
    if (!can("soft") || reduced()) return;
    el.animate([{ boxShadow: "0 0 0 0 rgba(0,113,227,.45)" }, { boxShadow: "0 0 0 16px rgba(0,113,227,0)" }], { duration: 1600, iterations: 2, easing: "ease-out" });
  }
  /* FX-29 : un trait se dessine sous un mot */
  function underline(el, color) {
    relative(el);
    const u = document.createElement("span");
    u.style.cssText = `position:absolute;left:0;right:0;bottom:.04em;height:.09em;border-radius:.05em;background:${color || "currentColor"};transform-origin:left;pointer-events:none`;
    el.appendChild(u);
    if (can("soft") && !reduced()) u.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: 620, delay: 120, easing: "cubic-bezier(.4,0,.2,1)", fill: "both" });
    return u;
  }
  /* FX-24 : titre mot à mot (garde les retours à la ligne et les mots colorés) */
  function wordsIn(el, o) {
    if (!el.dataset.split) {
      const wrapText = node => {
        Array.from(node.childNodes).forEach(n => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(part => {
              if (!part) return;
              if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
              else { const sp = document.createElement("span"); sp.className = "fx-w"; sp.style.display = "inline-block"; sp.textContent = part; frag.appendChild(sp); }
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1 && n.tagName !== "BR") wrapText(n);
        });
      };
      wrapText(el);
      el.dataset.split = 1;
    }
    stagger(el.querySelectorAll(".fx-w"), Object.assign({ y: 18, step: 80, duration: 560 }, o || {}));
  }
  /* FX-25 : inclinaison 3D vers le curseur */
  function tilt(el, o) {
    o = o || {};
    const max = o.max || 3;
    relative(el);
    const shine = document.createElement("span");
    shine.style.cssText = "position:absolute;inset:0;pointer-events:none;border-radius:inherit;opacity:0;transition:opacity .25s;background:radial-gradient(circle at var(--sx,50%) var(--sy,50%),rgba(255,255,255,.16),transparent 55%)";
    el.appendChild(shine);
    el.style.transition = "transform .25s " + EASE;
    let raf = 0;
    const move = e => {
      if (!can("soft") || reduced()) return;
      const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(700px) rotateX(${(.5 - py) * max}deg) rotateY(${(px - .5) * max}deg) translateY(-2px)`;
        shine.style.setProperty("--sx", px * 100 + "%"); shine.style.setProperty("--sy", py * 100 + "%"); shine.style.opacity = 1;
      });
    };
    const leave = () => { el.style.transform = ""; shine.style.opacity = 0; };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    return { demo() { move({ clientX: el.getBoundingClientRect().left + el.offsetWidth * .8, clientY: el.getBoundingClientRect().top + el.offsetHeight * .25 }); setTimeout(leave, 700); } };
  }
  /* FX-26 : halo qui suit le curseur */
  function spotlight(el) {
    relative(el);
    const s = document.createElement("span");
    s.style.cssText = "position:absolute;inset:0;pointer-events:none;border-radius:inherit;opacity:0;transition:opacity .3s;background:radial-gradient(420px circle at var(--mx,50%) var(--my,50%),rgba(0,113,227,.10),transparent 45%)";
    el.prepend(s);
    const move = e => { if (!can("soft")) return; const r = el.getBoundingClientRect(); s.style.setProperty("--mx", (e.clientX - r.left) + "px"); s.style.setProperty("--my", (e.clientY - r.top) + "px"); s.style.opacity = 1; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", () => { s.style.opacity = 0; });
    return { demo() { const r = el.getBoundingClientRect(); move({ clientX: r.left + r.width * .3, clientY: r.top + r.height * .5 }); setTimeout(() => move({ clientX: r.left + r.width * .7, clientY: r.top + r.height * .4 }), 350); setTimeout(() => { s.style.opacity = 0; }, 1200); } };
  }

  return {
    state, setLevel(l) { state.level = l; }, setMotion(m) { state.motion = m; }, can, reduced,
    ripple, pop, burst, floatText, sweep, shake, glow, drawCheck, countUp, ringTo, stagger, fillBars, strike, swap, fly, drawLine,
    streak, breakStreak, confetti, fireworks, shimmer, achievement, logoFlip, wordsIn, tilt, spotlight, float, breathe, underline, nudge
  };
})();
