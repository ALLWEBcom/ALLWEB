/* =========================================================
   ALLWEB · Navidad Futurista  (christmas.js)
   ========================================================= */
(() => {
  "use strict";

  /* ---------- CONFIGURACIÓN ---------- */
  const CFG = {
    // El tema se activa solo entre estas fechas (mes 1-12, día)
    start: { m: 11, d: 1 },
    end:   { m: 1,  d: 7 },
    forceOn: false,                 // true = siempre activo (para pruebas)
    whatsapp: "https://wa.me/573042753303?text=" +
      encodeURIComponent("Hola ALLWEB, quiero aprovechar la promoción navideña para mi página web"),
    promoText: "PROMOCIÓN NAVIDEÑA · 50% DE DESCUENTO"
  };

  const now = new Date();
  const inSeason = (() => {
    const y = now.getFullYear();
    const a = new Date(y, CFG.start.m - 1, CFG.start.d);
    const b = new Date(y, CFG.end.m - 1, CFG.end.d, 23, 59, 59);
    return a <= b ? (now >= a && now <= b) : (now >= a || now <= b);
  })();
  if (!inSeason && !CFG.forceOn) return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lite = matchMedia("(max-width: 900px), (pointer: coarse)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const rand = (a, b) => a + Math.random() * (b - a);
  const COLORS = ["#00f2fe", "#a855f7", "#ff3b5c", "#22e58b", "#ffd166"];

  // Preferencia guardada (efectos ON/OFF)
  let off = false;
  try { off = localStorage.getItem("xmasOff") === "1"; } catch (_) {}
  const applyOff = () => document.body.classList.toggle("xmas-off", off);

  function init() {
    applyOff();
    aurora();
    snow();
    garland();
    santaHat();
    ornaments();
    sleigh();
    widget();
    promoBadge();
  }

  /* ---------- 0) Aurora de fondo ---------- */
  function aurora() {
    const d = document.createElement("div");
    d.className = "xmas-aurora";
    d.setAttribute("aria-hidden", "true");
    document.body.appendChild(d);
  }

  /* ---------- 1) Nieve en canvas (viento con el mouse) ---------- */
  function snow() {
    const c = document.createElement("canvas");
    c.id = "xmas-snow";
    c.setAttribute("aria-hidden", "true");
    c.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:40";
    document.body.appendChild(c);
    const ctx = c.getContext("2d");
    let W = 0, H = 0, flakes = [], wind = 0, windT = 0, raf = null;
    const N = reduced ? 40 : lite ? 55 : 130;

    function size() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make(top) {
      const z = Math.random();                        // profundidad
      return {
        x: rand(0, W), y: top ? rand(-H, 0) : rand(0, H),
        z, r: 0.7 + z * 2.6, vy: 0.25 + z * 1.15,
        ph: rand(0, 6.28), tint: Math.random() < 0.16
      };
    }
    size();
    for (let i = 0; i < N; i++) flakes.push(make(false));
    addEventListener("resize", size, { passive: true });
    addEventListener("pointermove", e => { windT = (e.clientX / W - 0.5) * 1.6; }, { passive: true });

    function frame() {
      raf = requestAnimationFrame(frame);
      if (off) { ctx.clearRect(0, 0, W, H); return; }
      ctx.clearRect(0, 0, W, H);
      wind += (windT - wind) * 0.02;
      for (const f of flakes) {
        f.ph += 0.012;
        f.x += Math.sin(f.ph) * 0.35 + wind * f.z * 1.4;
        f.y += f.vy;
        if (f.y > H + 6) { Object.assign(f, make(true), { y: -6 }); }
        if (f.x > W + 6) f.x = -6; else if (f.x < -6) f.x = W + 6;
        const col = f.tint ? "170,240,255" : "255,255,255";
        if (f.r > 2) {                                // halo suave en copos grandes
          ctx.fillStyle = "rgba(" + col + ",0.10)";
          ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 2.4, 0, 6.283); ctx.fill();
        }
        ctx.fillStyle = "rgba(" + col + "," + (0.35 + f.z * 0.55).toFixed(2) + ")";
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.283); ctx.fill();
      }
    }
    const start = () => { if (!raf) frame(); };
    const stop = () => { cancelAnimationFrame(raf); raf = null; };
    document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
    start();
  }

  /* ---------- 2) Guirnalda LED bajo el header ---------- */
  function garland() {
    const header = $(".site-header");
    if (!header) return;
    if (getComputedStyle(header).position === "static") header.style.position = "relative";
    const g = document.createElement("div");
    g.className = "xmas-garland";
    g.setAttribute("aria-hidden", "true");
    g.style.cssText = "position:absolute;left:0;right:0;top:100%;height:44px;pointer-events:none;overflow:hidden;z-index:60";
    header.appendChild(g);

    function build() {
      const W = header.clientWidth;
      const n = Math.max(2, Math.round(W / (lite ? 130 : 170)));
      const sw = W / n, depth = lite ? 11 : 15, bulbs = lite ? 5 : 7;
      let d = "", html = "";
      for (let i = 0; i < n; i++) {
        const x0 = i * sw;
        d += "M" + x0.toFixed(1) + " 2 Q" + (x0 + sw / 2).toFixed(1) + " " + (2 + depth * 2) + " " + (x0 + sw).toFixed(1) + " 2 ";
        for (let k = 0; k < bulbs; k++) {
          const t = (k + 0.5) / bulbs;
          const x = x0 + sw * t, y = 2 + 4 * depth * t * (1 - t);
          const col = COLORS[(i * bulbs + k) % COLORS.length];
          html += '<span class="xm-bulb" style="left:' + x.toFixed(1) + "px;top:" + y.toFixed(1) +
                  "px;--c:" + col + ";animation-delay:" + ((i * bulbs + k) % 6 * 0.4).toFixed(1) + 's"></span>';
        }
      }
      g.innerHTML = '<svg preserveAspectRatio="none"><path d="' + d + '"/></svg>' + html;
    }
    build();
    let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(build, 150); }, { passive: true });
  }

  /* ---------- 3) Gorro de Papá Noel sobre el logo ---------- */
  function santaHat() {
    const logo = $(".site-header .logo");
    if (!logo) return;
    if (getComputedStyle(logo).position === "static") logo.style.position = "relative";
    logo.insertAdjacentHTML("beforeend",
      '<svg class="xmas-hat" viewBox="0 0 40 34" aria-hidden="true" style="position:absolute;left:-8px;top:-15px;width:34px;height:30px;pointer-events:none">' +
      '<path d="M6 28 Q8 6 26 4 Q34 4 36 12 Q26 10 30 28Z" fill="#e11d48"/>' +
      '<path d="M10 24 Q12 12 24 8" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.5" stroke-linecap="round"/>' +
      '<rect x="3" y="25" width="30" height="8" rx="4" fill="#fff"/>' +
      '<circle cx="36" cy="12" r="4.5" fill="#fff"/></svg>');
  }

  /* ---------- 4) Bolas navideñas colgando en el hero ---------- */
  function ornaments() {
    if (lite) return;
    const host = $(".hero-visual");
    if (!host) return;
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    const defs = [
      { l: "6%",  len: 54, d: 30, c: "#ff3b5c", delay: "0s" },
      { l: "24%", len: 96, d: 38, c: "#00f2fe", delay: "-1.4s" },
      { l: "78%", len: 70, d: 34, c: "#a855f7", delay: "-.8s" },
      { l: "94%", len: 40, d: 26, c: "#22e58b", delay: "-2.2s" }
    ];
    host.insertAdjacentHTML("beforeend", defs.map(o =>
      '<div class="xm-ornament" aria-hidden="true" style="left:' + o.l + ";--len:" + o.len + "px;--d:" + o.d +
      "px;--c:" + o.c + ";animation-delay:" + o.delay + '"><i></i><b></b></div>').join(""));
  }

  /* ---------- 5) Trineo holográfico de Papá Noel ---------- */
  function sleigh() {
    if (reduced) return;
    const el = document.createElement("div");
    el.className = "xmas-sleigh";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML =
      '<svg viewBox="0 0 270 112" fill="none" stroke="#00f2fe" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      /* reno */
      '<ellipse cx="50" cy="60" rx="22" ry="11" fill="rgba(0,242,254,.10)"/>' +
      '<path d="M68 55 L78 47"/><circle cx="82" cy="44" r="6" fill="rgba(0,242,254,.10)"/>' +
      '<path d="M82 38 L78 24 M78 30 L72 26 M85 38 L92 25 M89 31 L95 29" stroke="#a855f7"/>' +
      '<path d="M36 68 L30 90 M46 70 L44 92 M58 70 L62 92 M66 66 L75 86"/>' +
      '<path d="M28 56 Q22 52 24 46"/>' +
      '<circle class="xm-nose" cx="88" cy="46" r="2.6" fill="#ff3b5c" stroke="#ff3b5c"/>' +
      /* arneses */
      '<path d="M72 58 Q98 66 114 76" stroke="#a855f7" stroke-dasharray="3 4"/>' +
      /* trineo */
      '<path d="M112 68 Q114 92 138 94 L214 94 Q236 94 242 68 L226 68 Q222 82 210 82 L140 82 Q128 82 126 68 Z" fill="rgba(168,85,247,.16)" stroke="#a855f7"/>' +
      '<path d="M104 102 Q152 107 244 102 Q258 100 256 86"/>' +
      /* regalos */
      '<rect x="206" y="62" width="18" height="16" rx="2" stroke="#ffd166"/><path d="M215 62 V78 M206 70 H224" stroke="#ffd166"/>' +
      '<rect x="128" y="64" width="14" height="14" rx="2" stroke="#22e58b"/><path d="M135 64 V78" stroke="#22e58b"/>' +
      /* Papá Noel */
      '<path d="M162 82 Q164 60 180 60 Q196 60 198 82" fill="rgba(255,59,92,.28)" stroke="#ff3b5c"/>' +
      '<circle cx="180" cy="52" r="8" fill="rgba(255,255,255,.10)"/>' +
      '<path d="M171 49 Q172 30 188 28 Q194 30 192 38 Q188 36 190 49" fill="rgba(255,59,92,.4)" stroke="#ff3b5c"/>' +
      '<circle cx="193" cy="37" r="3" fill="#fff" stroke="#fff"/>' +
      '<path d="M172 55 Q180 68 188 55" stroke="#fff"/>' +
      '</svg>';
    document.body.appendChild(el);

    const fly = () => {
      if (off || document.hidden) return schedule(8000);
      el.style.top = rand(14, 34).toFixed(0) + "vh";
      el.classList.remove("fly"); void el.offsetWidth; el.classList.add("fly");
      schedule(rand(32000, 50000));
    };
    function schedule(ms) { setTimeout(fly, ms); }
    el.addEventListener("animationend", () => el.classList.remove("fly"));
    schedule(4500);
  }

  /* ---------- 6) Panel: cuenta regresiva + Papá Noel y duende ---------- */
  function widget() {
    const santaSVG =
      '<svg viewBox="0 0 80 70" aria-hidden="true">' +
      '<path d="M14 32 Q16 8 46 6 Q58 6 62 16 Q50 14 56 32Z" fill="#e11d48"/>' +
      '<circle cx="62" cy="16" r="6" fill="#fff"/>' +
      '<ellipse cx="36" cy="48" rx="20" ry="14" fill="#ffd9c2"/>' +
      '<path d="M16 46 Q18 72 36 74 Q54 72 56 46 Q46 58 36 55 Q26 58 16 46Z" fill="#fff"/>' +
      '<rect x="10" y="29" width="52" height="11" rx="5.5" fill="#fff"/>' +
      '<circle cx="29" cy="46" r="2.2" fill="#0b1020"/><circle cx="43" cy="46" r="2.2" fill="#0b1020"/>' +
      '<circle cx="36" cy="51" r="3.2" fill="#ff9d8a"/></svg>';
    const elfSVG =
      '<svg viewBox="0 0 80 70" aria-hidden="true">' +
      '<path d="M18 32 Q22 12 50 4 Q46 16 56 32Z" fill="#16a34a"/>' +
      '<circle cx="50" cy="5" r="4.5" fill="#ffd166"/>' +
      '<path d="M17 46 L5 36 L19 41Z" fill="#ffd9c2"/><path d="M55 46 L67 36 L53 41Z" fill="#ffd9c2"/>' +
      '<ellipse cx="36" cy="48" rx="19" ry="16" fill="#ffd9c2"/>' +
      '<rect x="14" y="29" width="44" height="10" rx="5" fill="#ef4444"/>' +
      '<circle cx="29" cy="46" r="2.3" fill="#0b1020"/><circle cx="43" cy="46" r="2.3" fill="#0b1020"/>' +
      '<path d="M29 55 Q36 61 43 55" fill="none" stroke="#b4533a" stroke-width="2" stroke-linecap="round"/>' +
      '<circle cx="24" cy="53" r="3" fill="#ffb3a0" opacity=".7"/><circle cx="48" cy="53" r="3" fill="#ffb3a0" opacity=".7"/></svg>';

    const w = document.createElement("aside");
    w.className = "xmas-widget";
    w.setAttribute("aria-label", "Cuenta regresiva de Navidad");
    w.innerHTML =
      '<div class="xm-chars"><div class="xm-char elf">' + elfSVG + '</div><div class="xm-char santa">' + santaSVG + '</div></div>' +
      '<div class="xmas-card">' +
        '<div class="xm-tools">' +
          '<button class="xm-btn" type="button" data-act="fx" aria-label="Activar o desactivar efectos navideños" title="Efectos">❄</button>' +
          '<button class="xm-btn" type="button" data-act="min" aria-label="Minimizar panel" title="Minimizar">–</button>' +
        '</div>' +
        '<p class="xm-title">NAVIDAD ALLWEB</p>' +
        '<div class="xm-body">' +
          '<div class="xm-clock" role="timer" aria-live="off">' +
            '<div><strong data-u="d">00</strong><span>días</span></div>' +
            '<div><strong data-u="h">00</strong><span>horas</span></div>' +
            '<div><strong data-u="m">00</strong><span>min</span></div>' +
            '<div><strong data-u="s">00</strong><span>seg</span></div>' +
          '</div>' +
          '<p class="xm-msg" hidden></p>' +
          '<a class="xm-cta" href="' + CFG.whatsapp + '" target="_blank" rel="noopener noreferrer">Estrena web esta Navidad</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(w);
    requestAnimationFrame(() => setTimeout(() => w.classList.add("show"), 600));

    // Cuenta regresiva
    const clock = $(".xm-clock", w), msg = $(".xm-msg", w);
    const U = k => $('[data-u="' + k + '"]', w);
    const y = now.getFullYear();
    let target = new Date(y, 11, 25, 0, 0, 0);
    function tick() {
      const t = new Date();
      const diff = target - t;
      if (diff <= 0) {
        clock.hidden = true; msg.hidden = false;
        msg.textContent = "¡Feliz Navidad de parte de ALLWEB!";
        return;
      }
      const s = Math.floor(diff / 1000);
      const pad = n => String(n).padStart(2, "0");
      U("d").textContent = pad(Math.floor(s / 86400));
      U("h").textContent = pad(Math.floor(s % 86400 / 3600));
      U("m").textContent = pad(Math.floor(s % 3600 / 60));
      U("s").textContent = pad(s % 60);
    }
    tick(); setInterval(tick, 1000);

    // Botones
    w.addEventListener("click", e => {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      if (b.dataset.act === "min") {
        w.classList.toggle("min");
        b.textContent = w.classList.contains("min") ? "+" : "–";
        b.setAttribute("aria-label", w.classList.contains("min") ? "Expandir panel" : "Minimizar panel");
      } else {
        off = !off; applyOff();
        try { localStorage.setItem("xmasOff", off ? "1" : "0"); } catch (_) {}
      }
    });
  }

  /* ---------- 7) Texto de la promoción del hero ---------- */
  function promoBadge() {
    const b = $(".hero-badge-promo");
    if (b) b.innerHTML = '<span class="status-dot"></span> ' + CFG.promoText;
  }

  /* Carga christmas.css si no está en el HTML. Si no existe, no hace nada. */
  function ensureCSS(cb) {
    const has = Array.from(document.styleSheets).some(s => s.href && s.href.indexOf("christmas.css") > -1);
    if (has) return cb();
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "css/christmas.css?v=1";
    l.onload = cb;
    l.onerror = () => console.warn("ALLWEB Navidad: no se encontró css/christmas.css, efectos desactivados.");
    document.head.appendChild(l);
  }
  const go = () => ensureCSS(init);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
  else go();
})();
