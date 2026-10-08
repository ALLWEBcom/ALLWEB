/* =========================================================
   ALLWEB · APP.JS
   Interacciones, navegación, WhatsApp, láser y efectos
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       AÑO AUTOMÁTICO
       ===================================================== */

    const yearElements = document.querySelectorAll("[data-year]");

    yearElements.forEach(element => {
        element.textContent = new Date().getFullYear();
    });


    /* =====================================================
       MENÚ MÓVIL
       ===================================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navMenu.classList.toggle("active");

            menuToggle.classList.toggle("active", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );
        });


        /* Cerrar menú al seleccionar una opción */

        navMenu.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navMenu.classList.remove("active");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    /* =====================================================
       TRANSICIONES ENTRE PÁGINAS
       ===================================================== */

    document.querySelectorAll("a").forEach(link => {

        const href = link.getAttribute("href");

        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("http") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            link.target === "_blank"
        ) {
            return;
        }

        link.addEventListener("click", event => {

            const destination = link.href;

            if (!destination) return;

            event.preventDefault();

            document.body.classList.add("page-exit");

            setTimeout(() => {
                window.location.href = destination;
            }, 180);

        });

    });


    /* =====================================================
       WHATSAPP
       ===================================================== */

    const whatsappNumber = "573042753303";

    const defaultWhatsAppMessage =
        "Hola ALLWEB, deseo asesoría para crear mi página web.";

    function openWhatsApp(message = defaultWhatsAppMessage) {

        const url =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank", "noopener,noreferrer");

    }


    /* Botones generales de WhatsApp */

    document.querySelectorAll("[data-whatsapp]").forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const message =
                button.getAttribute("data-whatsapp-message") ||
                defaultWhatsAppMessage;

            openWhatsApp(message);

        });

    });


    /* =====================================================
       FORMULARIOS
       ===================================================== */

    document.querySelectorAll("form").forEach(form => {

        form.addEventListener("submit", event => {

            event.preventDefault();

            const name =
                form.querySelector('[name="nombre"]')?.value ||
                form.querySelector('[name="name"]')?.value ||
                "";

            const email =
                form.querySelector('[name="email"]')?.value ||
                "";

            const phone =
                form.querySelector('[name="telefono"]')?.value ||
                form.querySelector('[name="phone"]')?.value ||
                "";

            const message =
                form.querySelector('[name="mensaje"]')?.value ||
                form.querySelector('[name="message"]')?.value ||
                "";

            let whatsappMessage =
                "Hola ALLWEB, deseo asesoría para crear mi página web.";

            if (name) {
                whatsappMessage += `\n\nNombre: ${name}`;
            }

            if (email) {
                whatsappMessage += `\nCorreo: ${email}`;
            }

            if (phone) {
                whatsappMessage += `\nTeléfono: ${phone}`;
            }

            if (message) {
                whatsappMessage += `\n\nMensaje:\n${message}`;
            }

            openWhatsApp(whatsappMessage);

        });

    });


    /* =====================================================
       OFERTA 50% DE DESCUENTO
       ===================================================== */

    document.querySelectorAll(".offer-whatsapp").forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const message =
                "Hola ALLWEB, quiero aprovechar el 50% de descuento y comenzar mi proyecto web.";

            openWhatsApp(message);

        });

    });


    /* =====================================================
       LÍNEAS LÁSER
       ===================================================== */

    const laserElements = document.querySelectorAll(
        ".brand-line, .video-line, .laser-line"
    );

    laserElements.forEach(laser => {

        laser.addEventListener("mouseenter", () => {
            laser.classList.add("laser-active");
        });

        laser.addEventListener("mouseleave", () => {
            laser.classList.remove("laser-active");
        });

    });


    /* =====================================================
       INTERACCIÓN DEL LÁSER CON EL MOUSE
       ===================================================== */

    document.querySelectorAll(".brand-line, .video-line").forEach(line => {

        line.addEventListener("mousemove", event => {

            const rect = line.getBoundingClientRect();

            const position =
                ((event.clientX - rect.left) / rect.width) * 100;

            line.style.setProperty(
                "--laser-position",
                `${position}%`
            );

        });

    });


    /* =====================================================
       ANIMACIÓN SUAVE DE ONDAS
       ===================================================== */

    const laserWaves =
        document.querySelectorAll(
            ".laser-wave, .laser-pulse"
        );

    laserWaves.forEach(wave => {

        wave.addEventListener("animationiteration", () => {

            wave.classList.remove("laser-refresh");

            requestAnimationFrame(() => {
                wave.classList.add("laser-refresh");
            });

        });

    });


    /* =====================================================
       EFECTO DE MENÚ / HEADER AL HACER SCROLL
       ===================================================== */

    const header =
        document.querySelector("header") ||
        document.querySelector(".site-header") ||
        document.querySelector(".navbar");

    if (header) {

        const updateHeader = () => {

            if (window.scrollY > 30) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }

        };

        window.addEventListener(
            "scroll",
            updateHeader,
            { passive: true }
        );

        updateHeader();

    }


    /* =====================================================
       FONDO AMBIENTAL PREMIUM
       ===================================================== */

    const ambientBackground =
        document.querySelector(".ambient-background");

    if (ambientBackground) {

        let targetX = 50;
        let targetY = 50;

        let currentX = 50;
        let currentY = 50;

        document.addEventListener("mousemove", event => {

            targetX =
                (event.clientX / window.innerWidth) * 100;

            targetY =
                (event.clientY / window.innerHeight) * 100;

        });

        const animateAmbient = () => {

            currentX += (targetX - currentX) * 0.025;
            currentY += (targetY - currentY) * 0.025;

            ambientBackground.style.setProperty(
                "--mouse-x",
                `${currentX}%`
            );

            ambientBackground.style.setProperty(
                "--mouse-y",
                `${currentY}%`
            );

            requestAnimationFrame(animateAmbient);

        };

        animateAmbient();

    }


    /* =====================================================
       ORBES DE LUZ
       ===================================================== */

    const orbs =
        document.querySelectorAll(
            ".light-orb, .ambient-orb, .bg-orb"
        );

    if (orbs.length) {

        orbs.forEach((orb, index) => {

            const duration =
                8 + (index * 2.5);

            const delay =
                index * -1.5;

            orb.style.animationDuration =
                `${duration}s`;

            orb.style.animationDelay =
                `${delay}s`;

        });

    }


    /* =====================================================
       EFECTO DE MOVIMIENTO DEL FONDO
       ===================================================== */

    const backgroundLayer =
        document.querySelector(".background-layer") ||
        document.querySelector(".motion-background");

    if (backgroundLayer) {

        let mouseX = 0;
        let mouseY = 0;

        let currentMouseX = 0;
        let currentMouseY = 0;

        document.addEventListener("mousemove", event => {

            mouseX =
                (event.clientX / window.innerWidth - 0.5) * 2;

            mouseY =
                (event.clientY / window.innerHeight - 0.5) * 2;

        });

        const animateBackground = () => {

            currentMouseX +=
                (mouseX - currentMouseX) * 0.02;

            currentMouseY +=
                (mouseY - currentMouseY) * 0.02;

            backgroundLayer.style.transform =
                `translate3d(
                    ${currentMouseX * 10}px,
                    ${currentMouseY * 10}px,
                    0
                )`;

            requestAnimationFrame(
                animateBackground
            );

        };

        animateBackground();

    }


    /* =====================================================
       CURSOR / EFECTO DE LUZ
       ===================================================== */

    const cursorGlow =
        document.querySelector(".cursor-glow");

    if (cursorGlow) {

        let cursorX = 0;
        let cursorY = 0;

        let glowX = 0;
        let glowY = 0;

        document.addEventListener("mousemove", event => {

            cursorX = event.clientX;
            cursorY = event.clientY;

        });

        const animateCursorGlow = () => {

            glowX +=
                (cursorX - glowX) * 0.08;

            glowY +=
                (cursorY - glowY) * 0.08;

            cursorGlow.style.transform =
                `translate3d(
                    ${glowX}px,
                    ${glowY}px,
                    0
                )`;

            requestAnimationFrame(
                animateCursorGlow
            );

        };

        animateCursorGlow();

    }


    /* =====================================================
       GRID / PARALLAX
       ===================================================== */

    const grid =
        document.querySelector(".tech-grid") ||
        document.querySelector(".grid-background");

    if (grid) {

        window.addEventListener(
            "scroll",
            () => {

                const scroll =
                    window.scrollY;

                grid.style.transform =
                    `translateY(${scroll * 0.04}px)`;

            },
            { passive: true }
        );

    }


    /* =====================================================
       PARTÍCULAS
       ===================================================== */

    const particlesContainer =
        document.querySelector(".particles");

    if (particlesContainer) {

        const particleCount =
            window.innerWidth < 768 ? 18 : 35;

        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const particle =
                document.createElement("span");

            particle.className =
                "generated-particle";

            particle.style.left =
                `${Math.random() * 100}%`;

            particle.style.top =
                `${Math.random() * 100}%`;

            particle.style.animationDelay =
                `${Math.random() * 8}s`;

            particle.style.animationDuration =
                `${6 + Math.random() * 8}s`;

            particle.style.opacity =
                `${0.15 + Math.random() * 0.4}`;

            particlesContainer.appendChild(
                particle
            );

        }

    }


    /* =====================================================
       EFECTO 3D EN TARJETAS
       ===================================================== */

    const tiltCards =
        document.querySelectorAll(
            ".tilt-card, .service-card, .project-card, .glass-card"
        );

    if (
        tiltCards.length &&
        window.matchMedia("(pointer:fine)").matches
    ) {

        tiltCards.forEach(card => {

            card.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        event.clientX - rect.left;

                    const y =
                        event.clientY - rect.top;

                    const rotateY =
                        ((x / rect.width) - 0.5) * 5;

                    const rotateX =
                        ((y / rect.height) - 0.5) * -5;

                    card.style.transform =
                        `perspective(900px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)
                         translateY(-2px)`;

                }
            );

            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform = "";

                }
            );

        });

    }


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".reveal, .fade-in, .animate-on-scroll"
        );

    if (
        revealElements.length &&
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach(element => {
            observer.observe(element);
        });

    }


    /* =====================================================
       BOTONES DE NAVEGACIÓN SUAVE
       ===================================================== */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(anchor => {

        anchor.addEventListener(
            "click",
            event => {

                const targetId =
                    anchor.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        targetId
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });


    /* =====================================================
       REDES SOCIALES
       ===================================================== */

    document.querySelectorAll(
        ".footer-social-icon"
    ).forEach(social => {

        social.addEventListener(
            "mouseenter",
            () => {

                social.classList.add(
                    "social-active"
                );

            }
        );

        social.addEventListener(
            "mouseleave",
            () => {

                social.classList.remove(
                    "social-active"
                );

            }
        );

    });


    /* =====================================================
       DETECCIÓN DE REDUCED MOTION
       ===================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

    if (reducedMotion.matches) {

        document.documentElement.classList.add(
            "reduce-motion"
        );

    }


    /* =====================================================
       PREVENIR EFECTOS PESADOS EN CELULARES
       ===================================================== */

    if (window.innerWidth < 768) {

        document.documentElement.classList.add(
            "mobile-device"
        );

    }


    /* =====================================================
       INICIO
       ===================================================== */

    document.body.classList.add(
        "allweb-loaded"
    );

});
