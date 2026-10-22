---
# Processed by Jekyll so it can read site data (the booklet link below).
---
// Site-wide scripts, loaded once (deferred) from the footer on every page.

// ---------------------------------------------------------------
// Copyright year in the footer
// ---------------------------------------------------------------
document.getElementById("year").innerText = new Date().getFullYear();

// ---------------------------------------------------------------
// Newsletter forms: submit to Mailchimp in the background (JSONP), then send
// successful signups to the booklet download page (_data/reward.yml).
// Without JavaScript, forms still post to Mailchimp as before.
// ---------------------------------------------------------------
(function() {
  const THANKS_URL = {{ site.data.reward.thanks_url | jsonify }};
  const forms = document.querySelectorAll('form[action*="list-manage.com/subscribe/post"]');

  forms.forEach((form) => {
    const status = document.createElement("p");
    status.className = "newsletter-status";
    status.setAttribute("role", "status");
    form.after(status);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const button = form.querySelector('[type="submit"]');
      const label = button ? button.textContent : "";
      if (button) { button.disabled = true; button.textContent = "Sending…"; }
      status.textContent = "";
      status.classList.remove("is-error");

      const cb = "mcCallback" + Date.now();
      const params = new URLSearchParams(new FormData(form));
      params.set("c", cb);
      const url = form.action.replace("/subscribe/post?", "/subscribe/post-json?") + "&" + params.toString();
      const script = document.createElement("script");

      const done = () => {
        delete window[cb];
        script.remove();
        if (button) { button.disabled = false; button.textContent = label; }
      };

      window[cb] = (data) => {
        done();
        const msg = (data && data.msg) ? String(data.msg) : "";
        // Existing subscribers get the reward too
        if (data && (data.result === "success" || /already subscribed/i.test(msg))) {
          try { localStorage.setItem("newsletter-popup", Date.now()); } catch (err) {}
          // Record the signup, then redirect (fallback timer in case analytics is blocked)
          let left = false;
          const go = () => { if (!left) { left = true; window.location.href = THANKS_URL; } };
          const where = form.closest("#newsletter-modal") ? "newsletter_popup"
                      : form.closest(".lyrics-newsletter") ? "lyrics_page"
                      : (form.closest("section[id]") || {}).id || "page";
          if (typeof gtag === "function") {
            gtag("event", "newsletter_signup", {
              placement: where,
              already_subscribed: data.result !== "success",
              event_callback: go
            });
          }
          setTimeout(go, 1000);
          return;
        }
        // Mailchimp prefixes some errors with "0 - "; show plain text only
        const tmp = document.createElement("div");
        tmp.innerHTML = msg.replace(/^\d+\s*-\s*/, "");
        status.textContent = tmp.textContent || "Something went wrong. Please try again.";
        status.classList.add("is-error");
      };

      script.onerror = () => {
        done();
        status.textContent = "Couldn't reach the signup service. Please try again in a moment.";
        status.classList.add("is-error");
      };
      script.src = url;
      document.body.appendChild(script);
    });
  });
})();

// ---------------------------------------------------------------
// Newsletter popup (5 seconds in, at most every 30 days)
// ---------------------------------------------------------------
(function() {
  const modal = document.getElementById("newsletter-modal");
  const closeBtn = document.querySelector(".newsletter-close");

  // Don't interrupt industry visitors (music supervisors) on the sync page,
  // or readers on lyric pages (they get an inline signup after the lyrics)
  if (document.body.classList.contains("sync-page") || document.body.classList.contains("lyrics-body")) return;

  // Prevent showing again if dismissed or signed up recently
  const lastShown = localStorage.getItem("newsletter-popup");
  const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

  if (!lastShown || (Date.now() - lastShown) > THIRTY_DAYS) {
    setTimeout(() => {
      modal.classList.remove("hidden");
    }, 5000); // 5 seconds delay
  }

  function closeModal() {
    modal.classList.add("hidden");
    localStorage.setItem("newsletter-popup", Date.now());
  }

  // Close events
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
})();

// ---------------------------------------------------------------
// Rainbow "Darksoft" title in the footer
// ---------------------------------------------------------------
(function() {
    const text = "Darksoft";
    const container = document.getElementById("rainbow-text");
    if (!container) return;

    container.innerHTML = ""; // clear previous content for safety

    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.color = `hsl(${Math.floor(Math.random() * 360)}, 50%, 60%)`;
      span.style.animation = `fadeColors 10s infinite ${Math.random() * 5}s`;
      container.appendChild(span);
    });
  })();

// ---------------------------------------------------------------
// Mobile menu toggle
// ---------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById('menu-toggle');
    const body = document.body;

    if (toggle) {
      toggle.addEventListener('click', () => {
        const open = body.classList.toggle('menu-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
  });

// ---------------------------------------------------------------
// Music videos: click-to-play. Swap a thumbnail for the YouTube player only when
// it's clicked, so pages with many videos stay fast. Without JavaScript the link opens YouTube.
// ---------------------------------------------------------------
(function () {
  document.addEventListener("click", function (e) {
    var frame = e.target.closest("a.video-frame[data-video-id]");
    if (!frame || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();

    var id = frame.getAttribute("data-video-id");
    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
    iframe.title = frame.getAttribute("data-video-title") + " music video";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    var holder = document.createElement("div");
    holder.className = "video-frame is-playing";
    holder.appendChild(iframe);
    frame.replaceWith(holder);

    if (typeof gtag === "function") {
      gtag("event", "video_play", {
        platform: "YouTube",
        video_title: frame.getAttribute("data-video-title"),
        link_url: "https://www.youtube.com/watch?v=" + id,
        placement: frame.getAttribute("data-placement")
      });
    }
  });
})();
