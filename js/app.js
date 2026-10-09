
/* =========================================================
   ALLWEB | JAVASCRIPT PRINCIPAL
   Menú, WhatsApp, navegación, láser y fondo premium
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* 1. AÑO AUTOMÁTICO DEL FOOTER */
    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    document.querySelectorAll("[data-year]").forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    /* 2. MENÚ MÓVIL */
    const menuToggle = document.getElementById("menu-toggle");
    const siteNav = document.getElementById("site-nav");

    if (menuToggle && siteNav) {
        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.addEventListener("click", () => {
            const isOpen = siteNav.classList.toggle("open");

            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));

            menuToggle.querySelectorAll("span").forEach((line, index) => {
                if (isOpen) {
                    if (index === 0) {
                        line.style.transform = "translateY(7px) rotate(45deg)";
                    } else if (index === 1) {
                        line.style.opacity = "0";
                    } else if (index === 2) {
                        line.style.transform = "translateY(-7px) rotate(-45deg)";
                    }
                } else {
                    line.style.transform = "";
                    line.style.opacity = "";
                }
            });
        });

        siteNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                siteNav.classList.remove("open");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");

                menuToggle.querySelectorAll("span").forEach(line => {
                    line.style.transform = "";
                    line.style.opacity = "";
                });
            });
        });
    }

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900 && siteNav && menuToggle) {
            siteNav.classList.remove("open");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    }, { passive: true });

    /* 3. HEADER AL DESPLAZARSE */
    const header = document.querySelector(
        ".site-header, header, .navbar"
    );

    const updateHeader = () => {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 30);
        }
    };

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    /* 4. NAVEGACIÓN ENTRE PÁGINAS */
    document.querySelectorAll('a[href$=".html"]:not([target="_blank"])')
        .forEach(link => {
            link.addEventListener("click", event => {
                if (
                    event.ctrlKey ||
                    event.metaKey ||
                    event.shiftKey ||
                    event.altKey ||
                    event.button !== 0
                ) {
                    return;
                }

                const href = link.getAttribute("href");

                if (!href || href.startsWith("#")) return;

                const destination = new URL(href, window.location.href);

                if (destination.origin !== window.location.origin) return;

                event.preventDefault();

                document.body.classList.add("page-changing");

                window.setTimeout(() => {
                    window.location.href = destination.href;
                }, 180);
            });
        });

    /* 5. WHATSAPP */
    const whatsappNumber = "573042753303";

    function openWhatsApp(message) {
        const url =
            "https://wa.me/" + whatsappNumber +
            "?text=" + encodeURIComponent(message);

        window.open(url, "_blank", "noopener,noreferrer");
    }

    const defaultMessage =
        "Hola ALLWEB, deseo asesoría para crear mi página web.";

    document.querySelectorAll("[data-whatsapp]").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();

            const message =
                button.getAttribute("data-whatsapp-message") ||
                defaultMessage;

            openWhatsApp(message);
        });
    });

    /* Botones de la oferta de lanzamiento */
    document.querySelectorAll(".offer-whatsapp").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();

            openWhatsApp(
                "Hola ALLWEB, quiero consultar la promoción de lanzamiento " +
                "del 50% de descuento para crear mi página web."
            );
        });
    });

    /* 6. FORMULARIO DE CONTACTO A WHATSAPP */
    const whatsappForm = document.getElementById("whatsapp-form");

    if (whatsappForm) {
        whatsappForm.addEventListener("submit", event => {
            event.preventDefault();

            const getValue = id => {
                const element = document.getElementById(id);
                return element ? element.value.trim() : "";
            };

            const name = getValue("name");
            const business = getValue("business");
            const service = getValue("service");
            const message = getValue("message");

            const whatsappMessage = [
                "Hola ALLWEB, deseo información para crear mi página web.",
                "",
                "Nombre: " + (name || "No indicado"),
                "Negocio: " + (business || "No indicado"),
                "Servicio: " + (service || "Por asesorar"),
                "",
                "Detalles: " + (message || "Quiero recibir asesoría.")
            ].join("\n");

            openWhatsApp(whatsappMessage);
        });
    }

    /* 7. INTERACCIÓN CON LAS LÍNEAS LÁSER */
    function createLaserInteraction(laser) {
        const parent = laser.parentElement;

        if (!parent || laser.dataset.interactive === "true") return;

        laser.dataset.interactive = "true";

        if (getComputedStyle(parent).position === "static") {
            parent.style.position = "relative";
        }

        const interaction = document.createElement("div");
        interaction.className = "laser-interaction-layer";
        interaction.setAttribute("aria-hidden", "true");

        Object.assign(interaction.style, {
            position: "absolute",
            left: "0",
            right: "0",
            zIndex: "5",
            pointerEvents: "auto",
            background: "transparent"
        });

        const updatePosition = () => {
            const parentRect = parent.getBoundingClientRect();
            const laserRect = laser.getBoundingClientRect();

            interaction.style.top =
                (laserRect.top - parentRect.top - 12) + "px";

            interaction.style.height =
                Math.max(laserRect.height + 24, 28) + "px";
        };

        parent.appendChild(interaction);
        updatePosition();

        window.addEventListener("resize", updatePosition, {
            passive: true
        });

        interaction.addEventListener("pointerdown", event => {
            const rect = interaction.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            createLaserPulse(interaction, x, y);

            laser.style.filter =
                "brightness(1.45) " +
                "drop-shadow(0 0 8px rgba(0,242,254,.95)) " +
                "drop-shadow(0 0 20px rgba(121,40,202,.75))";

            window.setTimeout(() => {
                laser.style.filter = "";
            }, 220);
        });

        let lastMove = 0;

        interaction.addEventListener("pointermove", event => {
            if (event.pointerType !== "mouse") return;

            const now = Date.now();
            if (now - lastMove < 80) return;

            lastMove = now;

            const rect = interaction.getBoundingClientRect();

            createLaserTrail(
                interaction,
                event.clientX - rect.left,
                event.clientY - rect.top
            );
        });
    }

    function createLaserPulse(container, x, y) {
        const pulse = document.createElement("span");
        pulse.className = "laser-pulse";
        pulse.style.left = x + "px";
        pulse.style.top = y + "px";

        const wave = document.createElement("span");
        wave.className = "laser-wave";
        wave.style.left = x + "px";
        wave.style.top = y + "px";

        container.append(pulse, wave);

        window.setTimeout(() => pulse.remove(), 900);
        window.setTimeout(() => wave.remove(), 1000);
    }

    function createLaserTrail(container, x, y) {
        const trail = document.createElement("span");
        trail.className = "laser-pulse";
        trail.style.left = x + "px";
        trail.style.top = y + "px";
        trail.style.animationDuration = ".45s";

        container.appendChild(trail);

        window.setTimeout(() => trail.remove(), 500);
    }

    document.querySelectorAll(".brand-line, .video-line").forEach(
        createLaserInteraction
    );

    /* 8. DETECTAR DISPOSITIVOS TÁCTILES */
    document.addEventListener("touchstart", () => {
        document.body.classList.add("touch-device");
    }, { passive: true, once: true });

    /* 9. FONDO AMBIENTAL INTERACTIVO */
    const root = document.documentElement;
    const motionBg = document.querySelector(".allweb-motion-bg");
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (motionBg && !reducedMotion) {
        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let currentX = targetX;
        let currentY = targetY;
        let frameId;

        const updateBackground = () => {
            currentX += (targetX - currentX) * 0.075;
            currentY += (targetY - currentY) * 0.075;

            const dx = currentX - window.innerWidth / 2;
            const dy = currentY - window.innerHeight / 2;

            root.style.setProperty("--pointer-x", currentX + "px");
            root.style.setProperty("--pointer-y", currentY + "px");
            root.style.setProperty("--motion-x", (dx * 0.045) + "px");
            root.style.setProperty("--motion-y", (dy * 0.045) + "px");
            root.style.setProperty("--grid-x", (dx * 0.018) + "px");
            root.style.setProperty("--grid-y", (dy * 0.018) + "px");

            frameId = requestAnimationFrame(updateBackground);
        };

        window.addEventListener("pointermove", event => {
            if (event.pointerType === "touch") return;

            targetX = event.clientX;
            targetY = event.clientY;
        }, { passive: true });

        window.addEventListener("pointerleave", () => {
            targetX = window.innerWidth / 2;
            targetY = window.innerHeight / 2;
        }, { passive: true });

        window.addEventListener("resize", () => {
            targetX = Math.min(targetX, window.innerWidth);
            targetY = Math.min(targetY, window.innerHeight);
        }, { passive: true });

        updateBackground();

        window.addEventListener("pagehide", () => {
            if (frameId) cancelAnimationFrame(frameId);
        }, { once: true });
    }

    /* 10. PARTÍCULAS SUAVES */
    if (motionBg && !reducedMotion) {
        const canvas = document.createElement("canvas");
        canvas.className = "allweb-particles";
        canvas.setAttribute("aria-hidden", "true");

        motionBg.parentNode.insertBefore(canvas, motionBg.nextSibling);

        const ctx = canvas.getContext("2d");

        if (ctx) {
            let width = 0;
            let height = 0;
            let particles = [];
            let animationFrame = null;
            let lastTime = 0;

            const getParticleCount = () => {
                if (window.innerWidth < 600) return 18;
                if (window.innerWidth < 1000) return 28;
                return 40;
            };

            const resizeCanvas = () => {
                const ratio = Math.min(window.devicePixelRatio || 1, 1.5);

                width = window.innerWidth;
                height = window.innerHeight;

                canvas.width = Math.floor(width * ratio);
                canvas.height = Math.floor(height * ratio);
                canvas.style.width = width + "px";
                canvas.style.height = height + "px";

                ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

                particles = Array.from(
                    { length: getParticleCount() },
                    () => ({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        r: Math.random() * 1.2 + 0.35,
                        vx: (Math.random() - 0.5) * 0.05,
                        vy: (Math.random() - 0.5) * 0.05,
                        phase: Math.random() * Math.PI * 2
                    })
                );
            };

            const drawParticles = time => {
                const delta = Math.min(time - lastTime || 16, 40);
                lastTime = time;

                ctx.clearRect(0, 0, width, height);

                particles.forEach(p => {
                    p.x += p.vx * delta;
                    p.y += p.vy * delta;
                    p.phase += 0.001 * delta;

                    if (p.x < -5) p.x = width + 5;
                    if (p.x > width + 5) p.x = -5;
                    if (p.y < -5) p.y = height + 5;
                    if (p.y > height + 5) p.y = -5;

                    const alpha =
                        0.14 + ((Math.sin(p.phase) + 1) * 0.5) * 0.25;

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(120,220,255,${alpha})`;
                    ctx.fill();
                });

                if (!document.hidden) {
                    animationFrame = requestAnimationFrame(drawParticles);
                }
            };

            resizeCanvas();

            window.addEventListener("resize", resizeCanvas, {
                passive: true
            });

            animationFrame = requestAnimationFrame(drawParticles);

            document.addEventListener("visibilitychange", () => {
                if (document.hidden) {
                    if (animationFrame) {
                        cancelAnimationFrame(animationFrame);
                    }

                    animationFrame = null;
                } else if (!animationFrame) {
                    lastTime = performance.now();
                    animationFrame = requestAnimationFrame(drawParticles);
                }
            });
        }
    }

    /* 11. EFECTO 3D SUTIL EN TARJETAS */
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (!reducedMotion && !coarsePointer) {
        const cards = document.querySelectorAll(
            ".service-card, .review-card, .payment-card, " +
            ".portfolio-card, .plan-card, .project-card"
        );

        cards.forEach(card => {
            if (card.dataset.tiltReady === "true") return;
            card.dataset.tiltReady = "true";

            card.addEventListener("pointermove", event => {
                const rect = card.getBoundingClientRect();

                if (!rect.width || !rect.height) return;

                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;

                const rotateY = (x - 0.5) * 4;
                const rotateX = (0.5 - y) * 4;

                card.style.transform =
                    `perspective(900px) rotateX(${rotateX}deg) ` +
                    `rotateY(${rotateY}deg) translateY(-2px)`;
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }

    /* 12. REVELAR ELEMENTOS AL DESPLAZARSE */
    const revealElements = document.querySelectorAll(
        ".reveal, .fade-in, .animate-on-scroll"
    );

    if ("IntersectionObserver" in window && !reducedMotion) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach(element => observer.observe(element));
    } else {
        revealElements.forEach(element => element.classList.add("visible"));
    }

    /* 13. ENLACES INTERNOS CON DESPLAZAMIENTO SUAVE */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", event => {
            const targetId = anchor.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });

    /* 14. AUTOPLAY SILENCIOSO PARA VIDEOS ALLWEB */
    document.querySelectorAll(".allweb-video").forEach(video => {
        video.muted = true;
        video.playsInline = true;

        const playVideo = () => {
            const promise = video.play();

            if (promise && typeof promise.catch === "function") {
                promise.catch(() => {
                    /* Algunos navegadores requieren interacción del usuario. */
                });
            }
        };

        if (document.visibilityState === "visible") {
            playVideo();
        }

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                playVideo();
            } else {
                video.pause();
            }
        });
    });

    /* 15. CLASE FINAL DE CARGA */
    document.body.classList.add("allweb-loaded");

});
