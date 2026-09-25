/* =========================================================
   ALLWEB
   JAVASCRIPT PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CARGA DE PÁGINA
    ===================================================== */

    document.body.classList.add("page-loaded");


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const header =
        document.querySelector(".site-header");

    const menuToggle =
        document.getElementById("menu-toggle");

    const mobileMenu =
        document.getElementById("site-nav");


    /* =====================================================
       HEADER AL HACER SCROLL
    ===================================================== */

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 30) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        {
            passive: true
        }
    );


    /* =====================================================
       MENÚ MÓVIL
    ===================================================== */

    function openMenu() {

        if (!mobileMenu || !menuToggle) return;

        mobileMenu.classList.add("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Cerrar menú"
        );

        const icon =
            menuToggle.querySelector("i");

        if (icon) {

            icon.classList.remove(
                "fa-bars"
            );

            icon.classList.add(
                "fa-xmark"
            );

        }

    }


    function closeMenu() {

        if (!mobileMenu || !menuToggle) return;

        mobileMenu.classList.remove("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Abrir menú"
        );

        const icon =
            menuToggle.querySelector("i");

        if (icon) {

            icon.classList.remove(
                "fa-xmark"
            );

            icon.classList.add(
                "fa-bars"
            );

        }

    }


    function toggleMenu() {

        if (!mobileMenu) return;

        const isOpen =
            mobileMenu.classList.contains("open");

        if (isOpen) {

            closeMenu();

        } else {

            openMenu();

        }

    }


    if (menuToggle && mobileMenu) {

        menuToggle.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                toggleMenu();

            }
        );


        /* CERRAR AL HACER CLICK EN UN ENLACE */

        const mobileLinks =
            mobileMenu.querySelectorAll("a");

        mobileLinks.forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    closeMenu();

                }
            );

        });


        /* CERRAR AL HACER CLICK FUERA */

        document.addEventListener(
            "click",
            (event) => {

                if (
                    !mobileMenu.classList.contains("open")
                ) {
                    return;
                }

                const clickedInsideMenu =
                    mobileMenu.contains(event.target);

                const clickedButton =
                    menuToggle.contains(event.target);

                if (
                    !clickedInsideMenu &&
                    !clickedButton
                ) {

                    closeMenu();

                }

            }
        );


        /* ESC PARA CERRAR */

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape"
                ) {

                    closeMenu();

                }

            }
        );

    }


    /* =====================================================
       NAVEGACIÓN ACTIVA
    ===================================================== */

    let currentPage =
        window.location.pathname
            .split("/")
            .pop();


    if (
        !currentPage ||
        currentPage === ""
    ) {

        currentPage =
            "index.html";

    }


    document
        .querySelectorAll(".nav-link")
        .forEach(link => {

            const href =
                link.getAttribute("href");

            if (!href) return;


            const cleanHref =
                href
                    .split("#")[0]
                    .split("?")[0];


            if (
                cleanHref === currentPage
            ) {

                link.classList.add(
                    "active"
                );

            } else {

                link.classList.remove(
                    "active"
                );

            }

        });


    /* =====================================================
       TRANSICIÓN ENTRE PÁGINAS
    ===================================================== */

    document
        .querySelectorAll(
            'a[href$=".html"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const href =
                        link.getAttribute(
                            "href"
                        );

                    if (!href) return;


                    /* No modificar enlaces externos */

                    if (
                        href.startsWith("http") ||
                        href.startsWith("#") ||
                        href.startsWith("mailto:") ||
                        href.startsWith("tel:") ||
                        link.target === "_blank"
                    ) {

                        return;

                    }


                    /* No interceptar CTRL/CMD */

                    if (
                        event.ctrlKey ||
                        event.metaKey ||
                        event.shiftKey ||
                        event.altKey
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
       AÑO ACTUAL
    ===================================================== */

    const year =
        document.getElementById(
            "current-year"
        );


    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       FORMULARIO DE CONTACTO
    ===================================================== */

    const contactForm =
        document.getElementById(
            "contactForm"
        );


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    document
                        .getElementById("name")
                        ?.value
                        .trim() || "";


                const phone =
                    document
                        .getElementById("phone")
                        ?.value
                        .trim() || "";


                const project =
                    document
                        .getElementById("project")
                        ?.value
                        .trim() || "";


                const message =
                    document
                        .getElementById("message")
                        ?.value
                        .trim() || "";


                const text =
                    [
                        "Hola ALLWEB, quiero solicitar información sobre una página web.",
                        "",
                        `Nombre: ${name}`,
                        `Teléfono: ${phone}`,
                        `Proyecto: ${project}`,
                        `Necesidad: ${message}`
                    ].join("\n");


                const whatsapp =
                    "https://wa.me/573042753303?text=" +
                    encodeURIComponent(text);


                window.open(
                    whatsapp,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }


    /* =====================================================
       CERRAR MENÚ SI PASA A ESCRITORIO
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 900
            ) {

                closeMenu();

            }

        }
    );

});
