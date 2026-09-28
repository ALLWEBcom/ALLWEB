/* =========================================================
   ALLWEB
   JavaScript principal
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
       NO CAMBIA LA ANIMACIÓN ORIGINAL.

       Permite:
       - Click con mouse
       - Toque con celular
       - Pointer
       - Pulsos luminosos
       - Onda láser
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

        /*
         * Creamos una capa independiente.
         * No modificamos:
         * - posición original
         * - animación original
         * - tamaño original
         * - diseño original
         */

        const parent = laser.parentElement;

        if (!parent) {
            return;
        }


        /*
         * El contenedor necesita posición relativa
         * para que la zona de interacción se ubique
         * correctamente.
         */

        const parentStyle =
            window.getComputedStyle(parent);


        if (parentStyle.position === "static") {

            parent.style.position = "relative";

        }


        const interaction =
            document.createElement("div");

        interaction.className =
            "laser-interaction-layer";


        /*
         * Ubicamos la capa exactamente sobre la línea.
         */

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


        /*
         * MOUSE / POINTER
         */

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


                /*
                 * Para el efecto de iluminación
                 * temporal.
                 */

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


        /*
         * MOVIMIENTO DEL MOUSE
         *
         * Cuando se mueve sobre la línea,
         * aparece una pequeña respuesta luminosa.
         */

        let lastMove = 0;


        interaction.addEventListener(
            "pointermove",
            event => {

                /*
                 * En celular evitamos generar
                 * demasiados elementos.
                 */

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
       PEQUEÑO RASTRO AL MOVER EL MOUSE
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
            "4px";

        trail.style.height =
            "4px";


        trail.style.animationDuration =
            ".45s";


        container.appendChild(trail);


        setTimeout(() => {

            trail.remove();

        }, 500);

    }


    /* =====================================================
       DETECTAR TOUCH EN CELULARES
    ===================================================== */

    document.addEventListener(
        "touchstart",
        () => {

            document.body.classList.add(
                "touch-device"
            );

        },
        {
            passive: true,
            once: true
        }
    );


    /* =====================================================
       ANIMACIÓN SUAVE DEL MENÚ
    ===================================================== */

    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            () => {

                menuToggle
                    .querySelectorAll("span")
                    .forEach((line, index) => {

                        if (
                            menuToggle.classList.contains("active")
                        ) {

                            if (index === 0) {
                                line.style.transform =
                                    "translateY(7px) rotate(45deg)";
                            }

                            if (index === 1) {
                                line.style.opacity = "0";
                            }

                            if (index === 2) {
                                line.style.transform =
                                    "translateY(-7px) rotate(-45deg)";
                            }

                        } else {

                            line.style.transform = "";
                            line.style.opacity = "";

                        }

                    });

            }
        );

    }

});
