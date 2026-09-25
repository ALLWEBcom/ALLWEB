"use strict";


/* =========================================================
   CONFIGURACIÓN ALLWEB
========================================================= */

const ALLWEB_CONFIG = {

    whatsapp: "573042753303",

    whatsappMessage:
        "Hola ALLWEB, quiero cotizar una página web para mi negocio."

};


/* =========================================================
   INICIO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeMobileMenu();

    initializePortfolioFilter();

    initializeFAQ();

    initializeQuoteCalculator();

    initializeNavigation();

    initializeYear();

    initializeWhatsApp();

});


/* =========================================================
   MENÚ MOBILE
========================================================= */

function initializeMobileMenu() {

    const button =
        document.getElementById(
            "mobile-menu-button"
        );

    const menu =
        document.getElementById(
            "mobile-nav"
        );


    if (!button || !menu) {
        return;
    }


    button.addEventListener("click", () => {

        const isOpen =
            menu.classList.toggle("open");


        button.setAttribute(
            "aria-expanded",
            String(isOpen)
        );


        button.setAttribute(
            "aria-label",
            isOpen
                ? "Cerrar menú"
                : "Abrir menú"
        );


        const icon =
            button.querySelector("i");


        if (icon) {

            icon.className = isOpen
                ? "fa-solid fa-xmark"
                : "fa-solid fa-bars";

        }

    });


    const links =
        menu.querySelectorAll("a");


    links.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                menu.classList.remove("open");

                button.setAttribute(
                    "aria-expanded",
                    "false"
                );

                button.setAttribute(
                    "aria-label",
                    "Abrir menú"
                );


                const icon =
                    button.querySelector("i");


                if (icon) {

                    icon.className =
                        "fa-solid fa-bars";

                }

            }
        );

    });

}


/* =========================================================
   FILTRO PORTAFOLIO
========================================================= */

function initializePortfolioFilter() {

    const buttons =
        document.querySelectorAll(
            ".filter-button"
        );


    const cards =
        document.querySelectorAll(
            ".portfolio-card"
        );


    if (!buttons.length || !cards.length) {
        return;
    }


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const filter =
                    button.dataset.filter;


                buttons.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                cards.forEach(card => {

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


/* =========================================================
   FAQ
========================================================= */

function initializeFAQ() {

    const questions =
        document.querySelectorAll(
            ".faq-question"
        );


    questions.forEach(question => {

        question.addEventListener(
            "click",
            () => {

                const currentItem =
                    question.closest(
                        ".faq-item"
                    );


                if (!currentItem) {
                    return;
                }


                const wasOpen =
                    currentItem.classList.contains(
                        "open"
                    );


                document
                    .querySelectorAll(".faq-item")
                    .forEach(item => {

                        item.classList.remove(
                            "open"
                        );


                        const answer =
                            item.querySelector(
                                ".faq-answer"
                            );


                        if (answer) {

                            answer.style.maxHeight =
                                null;

                        }

                    });


                if (!wasOpen) {

                    currentItem.classList.add(
                        "open"
                    );


                    const answer =
                        currentItem.querySelector(
                            ".faq-answer"
                        );


                    if (answer) {

                        answer.style.maxHeight =
                            answer.scrollHeight + "px";

                    }

                }

            }
        );

    });

}


/* =========================================================
   COTIZADOR
========================================================= */

function initializeQuoteCalculator() {

    const projectSelect =
        document.getElementById(
            "project-type"
        );


    const addons =
        document.querySelectorAll(
            ".quote-addon"
        );


    const totalElement =
        document.getElementById(
            "total-price"
        );


    const summaryElement =
        document.getElementById(
            "quote-summary"
        );


    const whatsappButton =
        document.getElementById(
            "quote-whatsapp"
        );


    if (
        !projectSelect ||
        !totalElement ||
        !summaryElement
    ) {

        return;

    }


    function calculateQuote() {

        const selectedOption =
            projectSelect.options[
                projectSelect.selectedIndex
            ];


        const basePrice =
            Number(
                projectSelect.value
            ) || 0;


        const projectName =
            selectedOption.dataset.name ||
            selectedOption.textContent.trim();


        let total =
            basePrice;


        const selectedAddons = [];


        addons.forEach(addon => {

            if (addon.checked) {

                const value =
                    Number(addon.value) || 0;


                total += value;


                selectedAddons.push(
                    addon.dataset.name
                );

            }

        });


        totalElement.textContent =
            total > 0
                ? formatCOP(total)
                : "Cotizar";


        const summaryParts = [
            projectName
        ];


        if (selectedAddons.length) {

            summaryParts.push(
                "Adicionales:\n• " +
                selectedAddons.join(
                    "\n• "
                )
            );

        }


        summaryElement.textContent =
            summaryParts.join("\n\n");


        if (whatsappButton) {

            const message =
                createQuoteMessage(
                    projectName,
                    basePrice,
                    selectedAddons,
                    total
                );


            whatsappButton.href =
                buildWhatsAppUrl(
                    message
                );

        }

    }


    projectSelect.addEventListener(
        "change",
        calculateQuote
    );


    addons.forEach(addon => {

        addon.addEventListener(
            "change",
            calculateQuote
        );

    });


    calculateQuote();

}


/* =========================================================
   FORMATO PESOS COLOMBIANOS
========================================================= */

function formatCOP(value) {

    return new Intl.NumberFormat(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }
    ).format(value);

}


/* =========================================================
   MENSAJE DE COTIZACIÓN
========================================================= */

function createQuoteMessage(
    projectName,
    basePrice,
    addons,
    total
) {

    let message =
        "Hola ALLWEB, quiero cotizar una página web.%0A%0A";


    message +=
        "Proyecto: " +
        projectName +
        "%0A";


    if (basePrice > 0) {

        message +=
            "Valor base: " +
            formatCOP(basePrice) +
            "%0A";

    }


    if (addons.length) {

        message +=
            "%0AAdicionales:%0A";


        addons.forEach(addon => {

            message +=
                "• " +
                addon +
                "%0A";

        });

    }


    message +=
        "%0AEstimación inicial: " +
        (
            total > 0
                ? formatCOP(total)
                : "Por cotizar"
        );


    message +=
        "%0A%0AQuiero recibir más información.";


    return decodeURIComponent(
        message
    );

}


/* =========================================================
   URL WHATSAPP
========================================================= */

function buildWhatsAppUrl(message) {

    return (
        "https://wa.me/" +
        ALLWEB_CONFIG.whatsapp +
        "?text=" +
        encodeURIComponent(message)
    );

}


/* =========================================================
   NAVEGACIÓN ACTIVA
========================================================= */

function initializeNavigation() {

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    const navLinks =
        document.querySelectorAll(
            ".desktop-nav .nav-link"
        );


    if (!sections.length || !navLinks.length) {
        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    const id =
                        entry.target.id;


                    navLinks.forEach(link => {

                        link.classList.toggle(
                            "active",
                            link.getAttribute(
                                "href"
                            ) === "#" + id
                        );

                    });

                });

            },
            {
                rootMargin:
                    "-35% 0px -55% 0px"
            }
        );


    sections.forEach(section => {

        observer.observe(section);

    });

}


/* =========================================================
   AÑO AUTOMÁTICO
========================================================= */

function initializeYear() {

    const yearElement =
        document.getElementById(
            "current-year"
        );


    if (!yearElement) {
        return;
    }


    yearElement.textContent =
        new Date().getFullYear();

}


/* =========================================================
   WHATSAPP
========================================================= */

function initializeWhatsApp() {

    const links =
        document.querySelectorAll(
            'a[href*="wa.me"]'
        );


    links.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                /*
                    Espacio reservado para
                    futuras estadísticas.
                */

                console.log(
                    "ALLWEB: WhatsApp abierto"
                );

            }
        );

    });

}


/* =========================================================
   SCROLL A SECCIÓN
========================================================= */

function scrollToSection(
    sectionId
) {

    const section =
        document.getElementById(
            sectionId
        );


    if (!section) {
        return;
    }


    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   API GLOBAL
========================================================= */

window.ALLWEB = {

    config: ALLWEB_CONFIG,

    scrollToSection,

    formatCOP

};
