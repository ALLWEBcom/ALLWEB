/* =========================================================
   ALLWEB
   JAVASCRIPT PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ENTRADA DE LA PÁGINA
    ===================================================== */

    requestAnimationFrame(() => {

        document.body.classList.add("page-loaded");

    });


    /* =====================================================
       AÑO AUTOMÁTICO
    ===================================================== */

    document.querySelectorAll(".current-year").forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });


    /* =====================================================
       MENÚ MÓVIL
    ===================================================== */

    const menuToggle =
        document.getElementById("menuToggle");

    const mainNav =
        document.getElementById("mainNav");


    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                mainNav.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );


            const icon =
                menuToggle.querySelector("i");


            if (icon) {

                icon.className =
                    isOpen
                        ? "fa-solid fa-xmark"
                        : "fa-solid fa-bars";

            }

        });


        mainNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                mainNav.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );


                const icon =
                    menuToggle.querySelector("i");


                if (icon) {

                    icon.className =
                        "fa-solid fa-bars";

                }

            });

        });

    }


    /* =====================================================
       CERRAR MENÚ CON ESC
    ===================================================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            if (mainNav) {

                mainNav.classList.remove("open");

            }

            if (menuToggle) {

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );


                const icon =
                    menuToggle.querySelector("i");


                if (icon) {

                    icon.className =
                        "fa-solid fa-bars";

                }

            }

        }

    });


    /* =====================================================
       TRANSICIONES ENTRE PÁGINAS
    ===================================================== */

    document.querySelectorAll(
        'a[href$=".html"]'
    ).forEach(link => {

        link.addEventListener("click", event => {

            const href =
                link.getAttribute("href");


            if (!href) {
                return;
            }


            if (
                href.startsWith("#") ||
                href.startsWith("http") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:")
            ) {

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


            document.body.classList.add(
                "page-leaving"
            );


            setTimeout(() => {

                window.location.href = href;

            }, 280);

        });

    });


    /* =====================================================
       HEADER AL HACER SCROLL
    ===================================================== */

    const header =
        document.querySelector(".site-header");


    const updateHeader =
        () => {

            if (!header) {
                return;
            }


            if (window.scrollY > 30) {

                header.style.boxShadow =
                    "0 15px 45px rgba(0,0,0,.22)";

            } else {

                header.style.boxShadow =
                    "none";

            }

        };


    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    updateHeader();


    /* =====================================================
       FILTRO DEL PORTAFOLIO
    ===================================================== */

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    const portfolioCards =
        document.querySelectorAll(
            ".portfolio-card"
        );


    if (
        filterButtons.length &&
        portfolioCards.length
    ) {

        filterButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    filterButtons.forEach(
                        item => {
                            item.classList.remove(
                                "active"
                            );
                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const filter =
                        button.dataset.filter;


                    portfolioCards.forEach(card => {

                        const category =
                            card.dataset.category;


                        if (
                            filter === "all" ||
                            category === filter
                        ) {

                            card.classList.remove(
                                "hidden"
                            );

                        } else {

                            card.classList.add(
                                "hidden"
                            );

                        }

                    });

                }
            );

        });

    }


    /* =====================================================
       CALCULADORA DE PLANES
    ===================================================== */

    const projectType =
        document.getElementById(
            "projectType"
        );


    const calculatorPrice =
        document.getElementById(
            "calculatorPrice"
        );


    if (
        projectType &&
        calculatorPrice
    ) {

        const formatCOP =
            value => {

                if (
                    !value ||
                    Number(value) === 0
                ) {

                    return "A cotizar";

                }


                return "$" +
                    Number(value)
                        .toLocaleString(
                            "es-CO"
                        );

            };


        const updatePrice =
            () => {

                calculatorPrice.textContent =
                    formatCOP(
                        projectType.value
                    );

            };


        projectType.addEventListener(
            "change",
            updatePrice
        );


        updatePrice();

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
                    document.getElementById(
                        "name"
                    )?.value.trim();


                const business =
                    document.getElementById(
                        "business"
                    )?.value.trim();


                const project =
                    document.getElementById(
                        "project"
                    )?.value;


                const message =
                    document.getElementById(
                        "message"
                    )?.value.trim();


                if (!name || !project || !message) {

                    alert(
                        "Por favor completa los campos obligatorios."
                    );

                    return;

                }


                let text =
                    "Hola ALLWEB,%0A%0A";


                text +=
                    "Mi nombre es: " +
                    encodeURIComponent(name) +
                    "%0A";


                if (business) {

                    text +=
                        "Mi negocio es: " +
                        encodeURIComponent(business) +
                        "%0A";

                }


                text +=
                    "Necesito: " +
                    encodeURIComponent(project) +
                    "%0A%0A";


                text +=
                    "Información del proyecto:%0A" +
                    encodeURIComponent(message);


                const whatsappURL =
                    "https://wa.me/573042753303?text=" +
                    text;


                window.open(
                    whatsappURL,
                    "_blank",
                    "noopener"
                );

            }
        );

    }


    /* =====================================================
       ANIMACIÓN SUAVE AL APARECER
    ===================================================== */

    const animatedElements =
        document.querySelectorAll(
            ".service-card, .portfolio-card, .value-card, .process-card, .pricing-card, .timeline-item"
        );


    if (
        "IntersectionObserver" in window &&
        animatedElements.length
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: .08
                }
            );


        animatedElements.forEach(element => {

            element.style.opacity =
                "0";

            element.style.transform =
                "translateY(20px)";

            element.style.transition =
                "opacity .6s ease, transform .6s ease";


            observer.observe(element);

        });

    }

});
