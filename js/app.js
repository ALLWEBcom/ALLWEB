/* =========================================================
   ALLWEB
   JavaScript principal
   Mantiene las funciones y efectos originales
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       AÑO DEL FOOTER
    ===================================================== */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       MENÚ MOBILE
    ===================================================== */

    const menuToggle = document.getElementById("menu-toggle");
    const siteNav = document.getElementById("site-nav");

    if (menuToggle && siteNav) {

        menuToggle.addEventListener("click", () => {

            const isOpen = siteNav.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.classList.toggle(
                "active",
                isOpen
            );

        });


        siteNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                siteNav.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.classList.remove("active");

            });

        });

    }


    /* =====================================================
       CERRAR MENÚ AL CAMBIAR TAMAÑO
    ===================================================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {

            if (siteNav) {
                siteNav.classList.remove("open");
            }

            if (menuToggle) {

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.classList.remove("active");

            }

        }

    });


    /* =====================================================
       TRANSICIÓN ENTRE PÁGINAS
    ===================================================== */

    document.querySelectorAll(
        'a[href$=".html"]:not([target="_blank"])'
    ).forEach(link => {

        link.addEventListener("click", event => {

            const href = link.getAttribute("href");

            if (!href || href.startsWith("#")) {
                return;
            }

            if (
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            event.preventDefault();

            document.body.classList.add("page-changing");

            setTimeout(() => {

                window.location.href = href;

            }, 180);

        });

    });


    /* =====================================================
       FORMULARIO → WHATSAPP
    ===================================================== */

    const whatsappForm =
        document.getElementById("whatsapp-form");

    if (whatsappForm) {

        whatsappForm.addEventListener("submit", event => {

            event.preventDefault();

            const name =
                document.getElementById("name")?.value.trim() || "";

            const business =
                document.getElementById("business")?.value.trim() || "";

            const service =
                document.getElementById("service")?.value || "";

            const message =
                document.getElementById("message")?.value.trim() || "";


            const whatsappMessage =
                `Hola ALLWEB.%0A%0A` +
                `Mi nombre es: ${name}%0A` +
                `Mi negocio es: ${business}%0A` +
                `Necesito: ${service}%0A%0A` +
                `Detalles:%0A${message}`;


            const url =
                `https://wa.me/573042753303?text=${whatsappMessage}`;


            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

        });

    }


    /* =====================================================
       INTERACCIÓN DEL LÁSER

       IMPORTANTE:
       NO REEMPLAZA NI ELIMINA LAS LÍNEAS LÁSER.

       Se mantiene la animación original del CSS.
    ===================================================== */

    const laserTargets = [
        ".brand-line",
        ".video-line"
    ];


    laserTargets.forEach(selector => {

        document.querySelectorAll(selector).forEach(laser => {

            createLaserInteraction(laser);

        });

    });


    function createLaserInteraction(laser) {

        const parent = laser.parentElement;

        if (!parent) {
            return;
        }


        const parentStyle =
            window.getComputedStyle(parent);


        if (parentStyle.position === "static") {

            parent.style.position = "relative";

        }


        const interaction =
            document.createElement("div");

        interaction.className =
            "laser-interaction-layer";


        const updateInteractionPosition = () => {

            const parentRect =
                parent.getBoundingClientRect();

            const laserRect =
                laser.getBoundingClientRect();


            const top =
                laserRect.top -
                parentRect.top -
                12;


            const height =
                laserRect.height + 24;


            interaction.style.top =
                `${top}px`;

            interaction.style.bottom =
                "auto";

            interaction.style.height =
                `${Math.max(height, 28)}px`;

        };


        parent.appendChild(interaction);

        updateInteractionPosition();


        window.addEventListener(
            "resize",
            updateInteractionPosition
        );


        /* =================================================
           CLICK / TOUCH
        ================================================= */

        interaction.addEventListener(
            "pointerdown",
            event => {

                const rect =
                    interaction.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;


                createLaserPulse(
                    interaction,
                    x,
                    y
                );


                laser.style.filter =
                    `
                    brightness(1.45)
                    drop-shadow(0 0 8px rgba(0,242,254,.95))
                    drop-shadow(0 0 20px rgba(121,40,202,.75))
                    `;


                setTimeout(() => {

                    laser.style.filter = "";

                }, 220);

            }
        );


        /* =================================================
           MOVIMIENTO DEL MOUSE
        ================================================= */

        let lastMove = 0;


        interaction.addEventListener(
            "pointermove",
            event => {

                const now =
                    Date.now();

                if (now - lastMove < 80) {
                    return;
                }

                lastMove = now;


                if (event.pointerType === "mouse") {

                    const rect =
                        interaction.getBoundingClientRect();

                    const x =
                        event.clientX - rect.left;

                    const y =
                        event.clientY - rect.top;


                    createLaserTrail(
                        interaction,
                        x,
                        y
                    );

                }

            }
        );

    }


    /* =====================================================
       PULSO LÁSER
    ===================================================== */

    function createLaserPulse(
        container,
        x,
        y
    ) {

        const pulse =
            document.createElement("span");

        pulse.className =
            "laser-pulse";


        pulse.style.left =
            `${x}px`;

        pulse.style.top =
            `${y}px`;


        container.appendChild(pulse);


        const wave =
            document.createElement("span");

        wave.className =
            "laser-wave";


        wave.style.left =
            `${x}px`;

        wave.style.top =
            `${y}px`;


        container.appendChild(wave);


        setTimeout(() => {

            pulse.remove();

        }, 900);


        setTimeout(() => {

            wave.remove();

        }, 1000);

    }


    /* =====================================================
       RASTRO LÁSER
    ===================================================== */

    function createLaserTrail(
        container,
        x,
        y
    ) {

        const trail =
            document.createElement("span");


        trail.className =
            "laser-pulse";


        trail.style.left =
            `${x}px`;

        trail.style.top =
            `${y}px`;


        trail.style.width =
            "5px";

        trail.style.height =
            "5px";

        trail.style.opacity =
            ".55";


        container.appendChild(trail);


        setTimeout(() => {

            trail.remove();

        }, 500);

    }


    /* =====================================================
       BOTÓN DEL MENÚ
    ===================================================== */

    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            () => {

                menuToggle.classList.toggle(
                    "menu-open"
                );

            }
        );

    }


    /* =====================================================
       FONDO INTERACTIVO ALLWEB
       
       Estos efectos son adicionales.
       NO sustituyen el fondo ni las líneas láser.
    ===================================================== */

    const motionBackground =
        document.querySelector(".allweb-motion-bg");

    const motionCursor =
        document.querySelector(".motion-cursor");

    const cyanOrb =
        document.querySelector(".motion-orb-cyan");

    const purpleOrb =
        document.querySelector(".motion-orb-purple");

    const motionGrid =
        document.querySelector(".motion-grid");


    if (
        motionBackground &&
        !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        let pointerX =
            window.innerWidth / 2;

        let pointerY =
            window.innerHeight / 2;


        window.addEventListener(
            "pointermove",
            event => {

                pointerX =
                    event.clientX;

                pointerY =
                    event.clientY;


                document.documentElement.style.setProperty(
                    "--pointer-x",
                    `${pointerX}px`
                );

                document.documentElement.style.setProperty(
                    "--pointer-y",
                    `${pointerY}px`
                );


                const normalizedX =
                    (pointerX / window.innerWidth - 0.5) * 2;

                const normalizedY =
                    (pointerY / window.innerHeight - 0.5) * 2;


                if (cyanOrb) {

                    cyanOrb.style.setProperty(
                        "--motion-x",
                        `${normalizedX * 18}px`
                    );

                    cyanOrb.style.setProperty(
                        "--motion-y",
                        `${normalizedY * 12}px`
                    );

                }


                if (purpleOrb) {

                    purpleOrb.style.setProperty(
                        "--motion-x",
                        `${normalizedX * -14}px`
                    );

                    purpleOrb.style.setProperty(
                        "--motion-y",
                        `${normalizedY * -10}px`
                    );

                }


                if (motionGrid) {

                    motionGrid.style.setProperty(
                        "--grid-x",
                        `${normalizedX * 8}px`
                    );

                    motionGrid.style.setProperty(
                        "--grid-y",
                        `${normalizedY * 5}px`
                    );

                }

            },
            {
                passive: true
            }
        );

    }


    /* =====================================================
       PARTÍCULAS DIGITALES
    ===================================================== */

    const particleCanvas =
        document.querySelector(".allweb-particles");


    if (
        particleCanvas &&
        !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        const ctx =
            particleCanvas.getContext("2d");

        let particles = [];

        let animationFrame;


        function resizeCanvas() {

            const dpr =
                Math.min(
                    window.devicePixelRatio || 1,
                    2
                );


            particleCanvas.width =
                window.innerWidth * dpr;

            particleCanvas.height =
                window.innerHeight * dpr;


            particleCanvas.style.width =
                `${window.innerWidth}px`;

            particleCanvas.style.height =
                `${window.innerHeight}px`;


            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );

        }


        function createParticles() {

            const count =
                window.innerWidth < 700
                    ? 24
                    : 48;


            particles =
                Array.from(
                    {
                        length: count
                    },
                    () => ({
                        x:
                            Math.random() *
                            window.innerWidth,

                        y:
                            Math.random() *
                            window.innerHeight,

                        size:
                            Math.random() * 1.6 + .4,

                        speed:
                            Math.random() * .25 + .08,

                        opacity:
                            Math.random() * .35 + .08,

                        direction:
                            Math.random() > .5
                                ? 1
                                : -1
                    })
                );

        }


        function animateParticles() {

            ctx.clearRect(
                0,
                0,
                window.innerWidth,
                window.innerHeight
            );


            particles.forEach(particle => {

                particle.y -=
                    particle.speed;


                particle.x +=
                    particle.direction *
                    particle.speed *
                    .18;


                if (
                    particle.y <
                    -10
                ) {

                    particle.y =
                        window.innerHeight + 10;

                }


                if (
                    particle.x <
                    -10
                ) {

                    particle.x =
                        window.innerWidth + 10;

                }


                if (
                    particle.x >
                    window.innerWidth + 10
                ) {

                    particle.x = -10;

                }


                ctx.beginPath();

                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.size,
                    0,
                    Math.PI * 2
                );


                /*
                 * Cyan muy tenue.
                 * Se mantiene el aspecto elegante
                 * sin llenar demasiado el fondo.
                 */

                ctx.fillStyle =
                    `rgba(0,242,254,${particle.opacity})`;


                ctx.fill();

            });


            animationFrame =
                requestAnimationFrame(
                    animateParticles
                );

        }


        resizeCanvas();

        createParticles();

        animateParticles();


        window.addEventListener(
            "resize",
            () => {

                resizeCanvas();

                createParticles();

            }
        );


        document.addEventListener(
            "visibilitychange",
            () => {

                if (
                    document.hidden
                ) {

                    cancelAnimationFrame(
                        animationFrame
                    );

                } else {

                    animateParticles();

                }

            }
        );

    }


    /* =====================================================
       EFECTO 3D SUTIL EN TARJETAS
       
       No modifica colores ni estructura.
    ===================================================== */

    const tiltCards =
        document.querySelectorAll(
            ".glass-card, .service-card, .portfolio-card, .plan-card, .review-card, .offer-benefit"
        );


    tiltCards.forEach(card => {

        card.addEventListener(
            "pointermove",
            event => {

                if (
                    window.innerWidth < 768 ||
                    event.pointerType !== "mouse"
                ) {
                    return;
                }


                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                const px =
                    x / rect.width;


                const py =
                    y / rect.height;


                const rotateY =
                    (px - 0.5) * 4.5;


                const rotateX =
                    (0.5 - py) * 4.5;


                card.style.transform =
                    `
                    perspective(900px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-3px)
                    `;


                card.style.setProperty(
                    "--tilt-light-x",
                    `${px * 100}%`
                );


                card.style.setProperty(
                    "--tilt-light-y",
                    `${py * 100}%`
                );

            },
            {
                passive: true
            }
        );


        card.addEventListener(
            "pointerleave",
            () => {

                card.style.transform = "";

            },
            {
                passive: true
            }
        );

    });


    /* =====================================================
       BOTONES 50% DESCUENTO
       
       Cualquier botón que tenga:
       .offer-whatsapp
       abrirá WhatsApp con el mensaje de promoción.
    ===================================================== */

    const offerButtons =
        document.querySelectorAll(
            ".offer-whatsapp"
        );


    offerButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const message =
                    "Hola ALLWEB, quiero aprovechar el 50% de descuento y comenzar mi proyecto web.";

                const whatsappURL =
                    `https://wa.me/573042753303?text=${encodeURIComponent(message)}`;

                window.open(
                    whatsappURL,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    });

});
