/* =========================================================
   ALLWEB
   MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    document.body.classList.add("page-loaded");


    /* =====================================================
       HEADER SCROLL
    ===================================================== */

    const header = document.querySelector(".site-header");

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
        { passive: true }
    );


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuToggle =
        document.getElementById("menuToggle");

    const mobileMenu =
        document.getElementById("mobileMenu");


    if (menuToggle && mobileMenu) {

        menuToggle.addEventListener("click", () => {

            mobileMenu.classList.toggle("open");

            const isOpen =
                mobileMenu.classList.contains("open");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen
            );

        });


        const mobileLinks =
            mobileMenu.querySelectorAll("a");


        mobileLinks.forEach(link => {

            link.addEventListener("click", () => {

                mobileMenu.classList.remove("open");

            });

        });

    }


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop() || "index.html";


    document
        .querySelectorAll(".nav-link, .mobile-link")
        .forEach(link => {

            const href =
                link.getAttribute("href");

            if (!href) return;

            const cleanHref =
                href.split("#")[0]
                    .split("?")[0];


            if (cleanHref === currentPage) {

                link.classList.add("active");

            } else {

                link.classList.remove("active");

            }

        });


    /* =====================================================
       PAGE TRANSITIONS
    ===================================================== */

    document
        .querySelectorAll('a[href$=".html"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const href =
                    link.getAttribute("href");

                if (!href) return;

                if (
                    href.startsWith("http") ||
                    href.startsWith("#") ||
                    link.target === "_blank"
                ) {
                    return;
                }

                event.preventDefault();

                document.body.classList.add(
                    "page-changing"
                );

                setTimeout(() => {

                    window.location.href = href;

                }, 220);

            });

        });


    /* =====================================================
       YEAR
    ===================================================== */

    const year =
        document.getElementById("currentYear");

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       CONTACT FORM
    ===================================================== */

    const contactForm =
        document.getElementById("contactForm");


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
                    `Hola ALLWEB, quiero solicitar información sobre una página web.%0A%0A` +
                    `Nombre: ${name}%0A` +
                    `Teléfono: ${phone}%0A` +
                    `Proyecto: ${project}%0A` +
                    `Necesidad: ${message}`;


                const whatsapp =
                    `https://wa.me/573042753303?text=${text}`;


                window.open(
                    whatsapp,
                    "_blank"
                );

            }
        );

    }


    /* =====================================================
       ESC - CERRAR MENU
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                if (mobileMenu) {

                    mobileMenu.classList.remove(
                        "open"
                    );

                }

            }

        }
    );

});
