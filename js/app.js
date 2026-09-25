/* =========================================================
   ALLWEB
   JavaScript principal
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PAGE LOADED
       ===================================================== */

    document.body.classList.add("page-loaded");


    /* =====================================================
       HEADER
       ===================================================== */

    const header = document.querySelector(".site-header");

    if (header) {

        const updateHeader = () => {

            if (window.scrollY > 20) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }

        };

        updateHeader();

        window.addEventListener(
            "scroll",
            updateHeader,
            { passive: true }
        );
    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const menuToggle =
        document.getElementById("menu-toggle");

    const siteNav =
        document.getElementById("site-nav");


    const closeMenu = () => {

        if (!menuToggle || !siteNav) {
            return;
        }

        menuToggle.classList.remove("open");

        siteNav.classList.remove("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Abrir menú"
        );

        document.body.classList.remove(
            "menu-open"
        );
    };


    const openMenu = () => {

        if (!menuToggle || !siteNav) {
            return;
        }

        menuToggle.classList.add("open");

        siteNav.classList.add("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Cerrar menú"
        );

        document.body.classList.add(
            "menu-open"
        );
    };


    if (menuToggle && siteNav) {

        menuToggle.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                const isOpen =
                    siteNav.classList.contains("open");

                if (isOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }

            }
        );


        /* Cerrar al seleccionar una página */

        siteNav
            .querySelectorAll("a")
            .forEach((link) => {

                link.addEventListener(
                    "click",
                    () => {

                        closeMenu();

                    }
                );

            });


        /* Cerrar al hacer click fuera */

        document.addEventListener(
            "click",
            (event) => {

                if (
                    !siteNav.contains(event.target) &&
                    !menuToggle.contains(event.target)
                ) {
                    closeMenu();
                }

            }
        );


        /* ESC */

        document.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Escape") {
                    closeMenu();
                }

            }
        );


        /* Si vuelve a escritorio */

        window.addEventListener(
            "resize",
            () => {

                if (window.innerWidth > 900) {
                    closeMenu();
                }

            }
        );

    }


    /* =====================================================
       ACTIVE PAGE
       ===================================================== */

    const currentFile =
        window.location.pathname
            .split("/")
            .pop() || "index.html";


    const navigationLinks =
        document.querySelectorAll(
            ".site-nav a"
        );


    navigationLinks.forEach((link) => {

        const href =
            link.getAttribute("href");

        if (!href) {
            return;
        }

        const cleanHref =
            href.split("#")[0]
                .split("?")[0];


        if (
            cleanHref === currentFile ||
            (
                currentFile === "" &&
                cleanHref === "index.html"
            )
        ) {

            link.classList.add("active");

        } else {

            link.classList.remove("active");

        }

    });


    /* =====================================================
       FOOTER YEAR
       ===================================================== */

    const yearElement =
        document.getElementById(
            "current-year"
        );

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       INTERNAL PAGE TRANSITIONS
       ===================================================== */

    const internalLinks =
        document.querySelectorAll(
            'a[href$=".html"]'
        );


    internalLinks.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                /* No interceptar Ctrl/Cmd/Shift/Alt */

                if (
                    event.ctrlKey ||
                    event.metaKey ||
                    event.shiftKey ||
                    event.altKey
                ) {
                    return;
                }


                /* No interceptar nueva pestaña */

                if (
                    link.target === "_blank"
                ) {
                    return;
                }


                const href =
                    link.getAttribute("href");

                if (
                    !href ||
                    href.startsWith("#") ||
                    href.startsWith("http")
                ) {
                    return;
                }


                event.preventDefault();

                closeMenu();


                document.body.classList.add(
                    "page-changing"
                );


                setTimeout(() => {

                    window.location.href =
                        href;

                }, 220);

            }
        );

    });


    /* =====================================================
       CONTACT FORM
       ===================================================== */

    const contactForm =
        document.getElementById(
            "contact-form"
        );


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "name"
                    )?.value.trim() || "";


                const phone =
                    document.getElementById(
                        "phone"
                    )?.value.trim() || "";


                const project =
                    document.getElementById(
                        "project"
                    )?.value.trim() || "";


                const message =
                    document.getElementById(
                        "message"
                    )?.value.trim() || "";


                if (
                    !name ||
                    !phone ||
                    !project ||
                    !message
                ) {

                    alert(
                        "Por favor completa todos los campos."
                    );

                    return;

                }


                const whatsappMessage =
`Hola ALLWEB 👋

Quiero solicitar una cotización.

Nombre: ${name}

Teléfono: ${phone}

Tipo de proyecto: ${project}

Descripción:
${message}`;


                const whatsappURL =
                    "https://wa.me/573042753303?text=" +
                    encodeURIComponent(
                        whatsappMessage
                    );


                window.open(
                    whatsappURL,
                    "_blank",
                    "noopener"
                );

            }
        );

    }


    /* =====================================================
       VIDEO
       ===================================================== */

    const video =
        document.querySelector(
            ".allweb-video"
        );


    if (video) {

        video.muted = true;

        const playVideo = () => {

            const promise =
                video.play();

            if (
                promise &&
                typeof promise.catch === "function"
            ) {

                promise.catch(() => {
                    /* El navegador puede bloquear autoplay */
                });

            }

        };

        playVideo();

    }

});
