/*
 * ALLWEB — Sistema de reseñas conectado a Supabase
 * Publicación inmediata de opiniones y calificaciones.
 */

(() => {
  "use strict";

  // 1. REEMPLAZA estos dos valores por los de tu proyecto Supabase.
  const SUPABASE_URL = "https://shziyfkoldietcxzsgnj.supabase.co/rest/v1/";
  const SUPABASE_KEY = "sb_publishable_cq-1l9aen0qRYwadshIQYw_1kEiiErd";

  const TABLE = "resenas";
  const MAX_REVIEW_LENGTH = 1000;

  let supabaseClient = null;
  let selectedRating = 5;

  const $ = (id) => document.getElementById(id);

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  function showMessage(message, isError = false) {
    const element = $("resenas-mensaje");
    if (!element) return;

    element.textContent = message;
    element.style.color = isError ? "#fca5a5" : "#86efac";
    element.setAttribute("role", "status");
  }

  function renderStars(rating) {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  }

  function renderReview(review) {
    const card = document.createElement("article");
    card.className = "aw-review-card";

    const header = document.createElement("div");
    header.className = "aw-review-header";

    const name = document.createElement("strong");
    name.className = "aw-review-name";
    name.textContent = review.nombre;

    const stars = document.createElement("span");
    stars.className = "aw-review-stars";
    stars.textContent = renderStars(Number(review.calificacion));
    stars.setAttribute(
      "aria-label",
      `${review.calificacion} de 5 estrellas`
    );

    header.append(name, stars);

    const comment = document.createElement("p");
    comment.className = "aw-review-comment";
    comment.textContent = review.comentario;

    const date = document.createElement("small");
    date.className = "aw-review-date";
    date.textContent = formatDate(review.creada_en);

    card.append(header, comment, date);
    return card;
  }

  function updateSummary(reviews) {
    const averageElement = $("resenas-promedio");
    const countElement = $("resenas-total");
    const starsElement = $("resenas-resumen-estrellas");

    const count = reviews.length;
    const average = count
      ? reviews.reduce((sum, review) =>
          sum + Number(review.calificacion), 0) / count
      : 0;

    if (averageElement) {
      averageElement.textContent = count ? average.toFixed(1) : "0.0";
    }

    if (countElement) {
      countElement.textContent =
        `${count} ${count === 1 ? "opinión" : "opiniones"}`;
    }

    if (starsElement) {
      starsElement.textContent = renderStars(Math.round(average));
    }
  }

  async function loadReviews() {
    const list = $("resenas-lista");
    if (!list || !supabaseClient) return;

    list.setAttribute("aria-busy", "true");

    const { data, error } = await supabaseClient
      .from(TABLE)
      .select("id,nombre,calificacion,comentario,creada_en")
      .order("creada_en", { ascending: false })
      .limit(100);

    list.removeAttribute("aria-busy");

    if (error) {
      console.error("ALLWEB: error cargando reseñas:", error);
      list.textContent = "No fue posible cargar las opiniones.";
      showMessage(
        "No pudimos cargar las reseñas. Comprueba la configuración de Supabase.",
        true
      );
      return;
    }

    list.replaceChildren();

    if (!data || data.length === 0) {
      const empty = document.createElement("p");
      empty.className = "aw-review-empty";
      empty.textContent =
        "Aún no hay reseñas. ¡Sé la primera persona en compartir su experiencia!";
      list.appendChild(empty);
    } else {
      data.forEach((review) => list.appendChild(renderReview(review)));
    }

    updateSummary(data || []);
  }

  function setupRatingButtons() {
    const ratingContainer = $("resenas-estrellas");
    if (!ratingContainer) return;

    const buttons = ratingContainer.querySelectorAll("[data-rating]");

    function updateButtons() {
      buttons.forEach((button) => {
        const value = Number(button.dataset.rating);
        button.classList.toggle("is-selected", value <= selectedRating);
        button.textContent = value <= selectedRating ? "★" : "☆";
        button.setAttribute("aria-pressed", String(value === selectedRating));
      });
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        selectedRating = Number(button.dataset.rating);
        updateButtons();
      });
    });

    updateButtons();
  }

  async function submitReview(event) {
    event.preventDefault();

    const form = $("resenas-formulario");
    const submitButton = $("resenas-enviar");
    const nameInput = $("resenas-nombre");
    const commentInput = $("resenas-comentario");

    if (!form || !submitButton || !nameInput || !commentInput) return;

    const nombre = nameInput.value.trim();
    const comentario = commentInput.value.trim();

    if (nombre.length < 2 || nombre.length > 60) {
      showMessage("El nombre debe tener entre 2 y 60 caracteres.", true);
      nameInput.focus();
      return;
    }

    if (selectedRating < 1 || selectedRating > 5) {
      showMessage("Selecciona una calificación de 1 a 5 estrellas.", true);
      return;
    }

    if (
      comentario.length < 3 ||
      comentario.length > MAX_REVIEW_LENGTH
    ) {
      showMessage("El comentario debe tener entre 3 y 1000 caracteres.", true);
      commentInput.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Publicando…";
    showMessage("Enviando tu opinión…");

    const { error } = await supabaseClient
      .from(TABLE)
      .insert([{ nombre, calificacion: selectedRating, comentario }]);

    if (error) {
      console.error("ALLWEB: error publicando reseña:", error);
      showMessage(
        "No se pudo publicar. Revisa la tabla y las políticas de Supabase.",
        true
      );
      submitButton.disabled = false;
      submitButton.textContent = "Publicar reseña";
      return;
    }

    form.reset();
    selectedRating = 5;
    setupRatingButtons();
    showMessage("¡Gracias! Tu reseña se publicó correctamente.");
    submitButton.disabled = false;
    submitButton.textContent = "Publicar reseña";

    await loadReviews();
  }

  function init() {
    const list = $("resenas-lista");
    if (!list) {
      console.warn(
        "ALLWEB: falta el HTML de reseñas. Añade la sección con los IDs requeridos."
      );
      return;
    }

    if (
      SUPABASE_URL === "PEGA_AQUI_TU_PROJECT_URL" ||
      SUPABASE_KEY === "PEGA_AQUI_TU_PUBLISHABLE_KEY"
    ) {
      showMessage("Falta configurar la URL y la clave pública de Supabase.", true);
      return;
    }

    if (!window.supabase || !window.supabase.createClient) {
      showMessage("No se pudo cargar la biblioteca de Supabase.", true);
      return;
    }

    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

    setupRatingButtons();

    const form = $("resenas-formulario");
    if (form) form.addEventListener("submit", submitReview);

    loadReviews();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
