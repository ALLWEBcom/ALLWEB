/* =========================================================
   ALLWEB | Componentes: StatsCard + LampLogin (JS puro)
   Pégalo al FINAL de js/app.js (o cárgalo como <script src="js/app-components.js">)
   No depende de React ni de librerías.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ---------- STATS: contador animado + sube/baja ---------- */
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll(".aw-stat").forEach(card => {
        const change = parseFloat(card.dataset.change || "0");
        const changeEl = card.querySelector(".aw-stat__change");

        if (changeEl) {
            const up = change >= 0;
            changeEl.classList.add(up ? "is-up" : "is-down");
            const icon = changeEl.querySelector("i");
            if (icon) icon.className = up ? "fa-solid fa-arrow-trend-up" : "fa-solid fa-arrow-trend-down";
            const num = changeEl.querySelector("[data-change-value]");
            if (num) num.textContent = (up ? "+" : "") + change + "%";
        }

        const valueEl = card.querySelector(".aw-stat__value");
        const target = parseFloat(card.dataset.value || "NaN");
        if (!valueEl || Number.isNaN(target) || reduceMotion) return;

        const prefix = card.dataset.prefix || "";
        const fmt = n => prefix + Math.round(n).toLocaleString("es-CO");
        let started = false;

        const run = () => {
            if (started) return;
            started = true;
            const duration = 900;
            const t0 = performance.now();
            const tick = now => {
                const p = Math.min((now - t0) / duration, 1);
                valueEl.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };

        if ("IntersectionObserver" in window) {
            const io = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) { run(); io.disconnect(); }
            }, { threshold: 0.4 });
            io.observe(card);
        } else {
            run();
        }
    });

    /* ---------- LAMP LOGIN ---------- */
    const lampRoot = document.getElementById("lamp-login");
    if (!lampRoot) return;

    const shade = lampRoot.querySelector(".aw-lamp__shade");
    const bulb = lampRoot.querySelector(".aw-lamp__bulb");
    const glow = lampRoot.querySelector(".aw-lamp__glow");
    const pull = lampRoot.querySelector(".aw-lamp__pull");
    const card = lampRoot.querySelector(".aw-login");
    const form = lampRoot.querySelector("form");
    const errorEl = lampRoot.querySelector(".aw-login__error");
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitLabel = submitBtn.querySelector("span");
    const toggle = lampRoot.querySelector(".aw-field__toggle");
    const pass = form.querySelector("#login-password");

    const setLamp = on => {
        [shade, bulb, glow].forEach(el => el.classList.toggle("is-on", on));
        card.classList.toggle("is-lit", on);
        pull.setAttribute("aria-pressed", String(on));
        pull.setAttribute("aria-label", on ? "Apagar lámpara" : "Encender lámpara");
    };

    pull.addEventListener("click", () => setLamp(!bulb.classList.contains("is-on")));
    form.addEventListener("focusin", () => setLamp(true));

    toggle.addEventListener("click", () => {
        const show = pass.type === "password";
        pass.type = show ? "text" : "password";
        toggle.querySelector("i").className = show ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
        toggle.setAttribute("aria-label", show ? "Ocultar contraseña" : "Mostrar contraseña");
    });

    /* Conecta aquí tu autenticación real (ej. Firebase Auth).
       Debe devolver una promesa y lanzar un Error si falla. */
    async function authenticate({ email, password }) {
        // Ejemplo con Firebase Auth (cuando lo configures):
        // await signInWithEmailAndPassword(auth, email, password);
        throw new Error("El acceso aún no está activo.");
    }

    form.addEventListener("submit", async event => {
        event.preventDefault();
        errorEl.textContent = "";
        submitBtn.disabled = true;
        submitLabel.textContent = "Verificando...";
        setLamp(true);

        try {
            await authenticate({
                email: form.querySelector("#login-email").value.trim(),
                password: pass.value
            });
        } catch (err) {
            errorEl.textContent = err.message || "No se pudo iniciar sesión.";
        } finally {
            submitBtn.disabled = false;
            submitLabel.textContent = "Entrar a la plataforma";
        }
    });
});
