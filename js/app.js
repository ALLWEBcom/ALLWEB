/* =========================================================
   ALLWEB - APP.JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PAGE LOAD
    ===================================================== */

    requestAnimationFrame(() => {
        document.body.classList.add("page-loaded");
    });


    /* =====================================================
       HEADER SCROLL
    ===================================================== */

    const header = document.getElementById("header");

    const updateHeader = () => {

        if (!header) return;

        if (window.scrollY > 30) {
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


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuButton =
        document.getElementById("mobileMenuButton");

    const mobileMenu =
        document.getElementById("mobileMenu");

    if (menuButton && mobileMenu) {

        menuButton.addEventListener(
            "click",
            () => {

                mobileMenu.classList.toggle("open");

                const icon =
                    menuButton.querySelector("i");

                if (
                    mobileMenu.classList.contains("open")
                ) {

                    icon.classList.remove(
                        "fa-bars"
                    );

                    icon.classList.add(
                        "fa-xmark"
                    );

                } else {

                    icon.classList.remove(
                        "fa-xmark"
                    );

                    icon.classList.add(
                        "fa-bars"
                    );
                }

            }
        );


        mobileMenu
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        mobileMenu.classList.remove(
                            "open"
                        );

                        const icon =
                            menuButton.querySelector("i");

                        icon.classList.remove(
                            "fa-xmark"
                        );

                        icon.classList.add(
                            "fa-bars"
                        );

                    }
                );

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
        .querySelectorAll(
            ".desktop-nav .nav-link"
        )
        .forEach(link => {

            const href =
                link.getAttribute("href");

            link.classList.remove("active");

            if (
                href === currentPage ||
                (
                    currentPage === "" &&
                    href === "index.html"
                )
            ) {

                link.classList.add("active");

            }

        });


    /* =====================================================
       INTERNAL PAGE TRANSITIONS
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
                        link.getAttribute("href");

                    if (
                        !href ||
                        href.startsWith("#") ||
                        link.target === "_blank"
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

                    document.body.classList.remove(
                        "page-loaded"
                    );

                    document.body.classList.add(
                        "page-leaving"
                    );

                    setTimeout(() => {

                        window.location.href =
                            href;

                    }, 280);

                }
            );

        });


    /* =====================================================
       YEAR
    ===================================================== */

    const year =
        document.getElementById("year");

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       ESC PARA CERRAR MENU
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
