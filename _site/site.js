// ---------------------------
// 1. RAINBOW TEXT ANIMATION
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  const text = "Darksoft";
  const container = document.getElementById("rainbow-text");

  if (container) {
    container.innerHTML = "";

    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.color = `hsl(${Math.floor(Math.random() * 360)}, 50%, 60%)`;
      span.style.animation = `fadeColors 10s infinite ${Math.random() * 5}s`;
      container.appendChild(span);
    });
  }

  // YEAR AUTO-UPDATE
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
});

// ---------------------------
// 2. HERO TITLE FADE-OUT ON SCROLL
// (Homepage only — guarded so lyrics pages don't error)
// ---------------------------
window.addEventListener("scroll", () => {
  const title = document.querySelector(".landing-title");
  if (!title) return; // only exists on homepage

  const scrollTop = window.scrollY;
  const fadePoint = window.innerHeight * 0.7;
  const factor = Math.min(scrollTop / fadePoint, 1);
  title.style.color = `rgb(${255 * (1 - factor)}, ${255 * (1 - factor)}, ${255 * (1 - factor)})`;
});

// ---------------------------
// 3. STICKY NAV BEHAVIOR
// (Homepage only — safe fallback)
// ---------------------------
window.addEventListener("scroll", () => {
  const nav = document.getElementById("sticky-nav-bar");
  const landing = document.querySelector(".landing-page");

  if (!nav || !landing) return;

  const landingBottom = landing.getBoundingClientRect().bottom;

  if (landingBottom <= -100) {
    nav.classList.add("stuck");
    document.body.classList.add("scrolled");
  } else {
    nav.classList.remove("stuck");
    document.body.classList.remove("scrolled");
  }
});

// ---------------------------
// 4. MOBILE MENU TOGGLE
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
  });
});