/* =========================================================
   ALLWEB — Cursor Trail Effect
   Estela de luz que sigue al cursor (cian → morado)
   Solo escritorio. Archivo: js/cursor-trail.js
========================================================= */
(() => {
  // No se activa en táctiles ni con "reducir movimiento"
  if (window.matchMedia("(pointer: coarse), (max-width: 900px)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const CFG = {
    trails: 20,        // cantidad de líneas
    size: 50,          // nodos por línea (largo de la estela)
    friction: 0.5,
    dampening: 0.25,
    tension: 0.98,
    lineWidth: 2,
    hueFrom: 185,      // cian
    hueTo: 275,        // morado
    hueSpeed: 0.0015
  };

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "9998"
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let lines = [];
  let running = false;
  let started = false;
  let frame = 0;

  // Zonas especiales
  const GREEN = 142;   // verde WhatsApp
  const WA_SEL = ".nav-whatsapp, .btn-whatsapp, .whatsapp-float, .footer-whatsapp, .promo-link, a[href*='wa.me']";
  const VIDEO_SEL = ".video-frame, .allweb-video";
  let zone = "normal"; // "normal" | "wa" | "video"
  let greenMix = 0;    // 0 = paleta ALLWEB, 1 = verde WhatsApp
  let boost = 0;       // 0 = normal, 1 = más brillante (videos)

  class Node {
    constructor() { this.x = pos.x; this.y = pos.y; this.vx = 0; this.vy = 0; }
  }

  class Line {
    constructor(spring) {
      this.spring = spring + (Math.random() * 0.1 - 0.05);
      this.friction = CFG.friction + (Math.random() * 0.01 - 0.005);
      this.nodes = Array.from({ length: CFG.size }, () => new Node());
    }

    update() {
      let spring = this.spring;
      const first = this.nodes[0];
      first.vx += (pos.x - first.x) * spring;
      first.vy += (pos.y - first.y) * spring;

      for (let i = 0; i < this.nodes.length; i++) {
        const n = this.nodes[i];
        if (i > 0) {
          const prev = this.nodes[i - 1];
          n.vx += (prev.x - n.x) * spring;
          n.vy += (prev.y - n.y) * spring;
          n.vx += prev.vx * CFG.dampening;
          n.vy += prev.vy * CFG.dampening;
        }
        n.vx *= this.friction;
        n.vy *= this.friction;
        n.x += n.vx;
        n.y += n.vy;
        spring *= CFG.tension;
      }
    }

    draw() {
      const nodes = this.nodes;
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);

      let i = 1;
      for (; i < nodes.length - 2; i++) {
        const a = nodes[i], b = nodes[i + 1];
        ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) * 0.5, (a.y + b.y) * 0.5);
      }
      const a = nodes[i], b = nodes[i + 1];
      ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
      ctx.stroke();
    }
  }

  function createLines() {
    lines = [];
    for (let i = 0; i < CFG.trails; i++) {
      lines.push(new Line(0.45 + (i / CFG.trails) * 0.025));
    }
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function render() {
    if (!running) return;

    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.globalCompositeOperation = "lighter";

    // El tono oscila suavemente entre cian y morado
    const mid = (CFG.hueFrom + CFG.hueTo) / 2;
    const amp = (CFG.hueTo - CFG.hueFrom) / 2;
    const baseHue = mid + Math.sin(frame * CFG.hueSpeed * 60) * amp;

    // Transición suave hacia la zona actual
    greenMix += ((zone === "wa" ? 1 : 0) - greenMix) * 0.12;
    boost += ((zone === "video" ? 1 : 0) - boost) * 0.12;

    const hue = baseHue + (GREEN - baseHue) * greenMix;
    const light = 55 + boost * 20;
    const alpha = 0.8 + boost * 0.2;

    ctx.strokeStyle = "hsla(" + Math.round(hue) + ",100%," + light.toFixed(0) + "%," + alpha.toFixed(2) + ")";
    ctx.lineWidth = CFG.lineWidth + boost * 1.5;

    for (const line of lines) {
      line.update();
      line.draw();
    }

    frame++;
    requestAnimationFrame(render);
  }

  function start() {
    if (running) return;
    running = true;
    requestAnimationFrame(render);
  }

  function stop() { running = false; }

  window.addEventListener("mousemove", e => {
    pos.x = e.clientX;
    pos.y = e.clientY;

    const t = e.target;
    if (t && t.closest) {
      zone = t.closest(WA_SEL) ? "wa" : t.closest(VIDEO_SEL) ? "video" : "normal";
    }

    if (!started) {          // primera vez: las líneas nacen donde está el cursor
      started = true;
      createLines();
      start();
    }
  }, { passive: true });

  window.addEventListener("resize", resize, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (started) start();
  });

  resize();
})();
