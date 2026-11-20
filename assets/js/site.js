---
# Processed by Jekyll so it can read site data (the booklet link below).
---
// Site-wide scripts, loaded once (deferred) from the footer on every page.

// ---------------------------------------------------------------
// Copyright year in the footer
// ---------------------------------------------------------------
document.getElementById("year").innerText = new Date().getFullYear();

// ---------------------------------------------------------------
// Newsletter forms: submit to Mailchimp in the background (JSONP), then swap the
// forms for a link to the booklet page (_data/reward.yml), so visitors stay put.
// Without JavaScript, forms still post to Mailchimp as before.
// ---------------------------------------------------------------
(function() {
  const THANKS_URL = {{ site.data.reward.thanks_url | jsonify }};
  const forms = document.querySelectorAll('form[action*="list-manage.com/subscribe/post"]');

  // Name the part of the page a form sits in, so signups can be compared by placement
  const placement = (form) => form.closest("#newsletter-modal") ? "newsletter_popup"
                            : form.closest(".lyrics-newsletter") ? "lyrics_page"
                            : form.closest(".post-sidebar") ? "blog_sidebar"
                            : form.closest(".signup-cta") ? "post_inline"
                            : (form.closest("section[id]") || {}).id || "page";

  // Replace every form on the page with the booklet link. The heading and text around
  // each form are hidden too (.signup-done in style.css). Returns the submitted form's link.
  function showBooklet(submitted, alreadySubscribed) {
    const where = placement(submitted);
    let submittedLink = null;
    forms.forEach((form) => {
      const status = form.nextElementSibling;
      const title = alreadySubscribed ? "You're already on the list!" : "You're in!";
      const note = alreadySubscribed ? "Thanks for being a subscriber." : "Thanks for subscribing.";
      status.classList.remove("is-error");
      status.innerHTML = '<p class="newsletter-success-title">' + title + "</p><p>" + note + "</p>";
      const link = document.createElement("a");
      link.className = "cta-button";
      link.href = THANKS_URL;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Get your free booklet ↗";
      link.addEventListener("click", () => {
        if (typeof gtag === "function") gtag("event", "booklet_open", { placement: where });
      });
      status.append(link);
      form.parentElement.classList.add("signup-done");
      if (form === submitted) submittedLink = link;
      form.remove();
    });
    return submittedLink;
  }

  forms.forEach((form) => {
    const status = document.createElement("div");
    status.className = "newsletter-status";
    status.setAttribute("role", "status");
    form.after(status);

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Bot trap (hidden b_ field, see newsletter-form.html): Mailchimp doesn't check it on
      // background signups, so check it here. Bots get a fake thank-you and nothing is sent.
      const trap = form.querySelector('input[name^="b_"]');
      if (trap && trap.value) {
        status.textContent = "Thank you for subscribing!";
        status.classList.remove("is-error");
        return;
      }

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
          const alreadySubscribed = data.result !== "success";
          if (typeof gtag === "function") {
            gtag("event", "newsletter_signup", {
              placement: placement(form),
              already_subscribed: alreadySubscribed
            });
          }
          const link = showBooklet(form, alreadySubscribed);
          if (link) link.focus({ preventScroll: true });
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
// Popup (5 seconds in, at most every 30 days). Which one shows is set in
// _data/popup.yml; each popup's data-popup-key remembers when it was last
// closed, so a new popup (or a new album's key) shows to everyone again.
// ---------------------------------------------------------------
(function() {
  const modal = document.querySelector(".newsletter-modal");
  if (!modal) return; // popup turned off (active: none)
  const closeBtn = modal.querySelector(".newsletter-close");
  const key = modal.dataset.popupKey || "newsletter-popup";

  // Don't interrupt industry visitors (music supervisors) on the sync page,
  // or readers on lyric pages (they get an inline signup after the lyrics)
  if (document.body.classList.contains("sync-page") || document.body.classList.contains("lyrics-body")) return;

  // Prevent showing again if dismissed (or, for the newsletter popup, signed up) recently
  let lastShown = null;
  try { lastShown = localStorage.getItem(key); } catch (err) {}
  const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

  let lastFocus = null;

  if (!lastShown || (Date.now() - lastShown) > THIRTY_DAYS) {
    // Fetch the popup graphic now so it's ready when the popup opens (it's lazy-loaded otherwise)
    const image = modal.querySelector(".newsletter-image");
    if (image) image.loading = "eager";

    setTimeout(() => {
      lastFocus = document.activeElement;
      modal.classList.remove("hidden");
      document.documentElement.classList.add("newsletter-open"); // stop the page behind from scrolling
      closeBtn.focus({ preventScroll: true }); // keyboard and screen-reader users land in the popup
    }, 5000); // 5 seconds delay
  }

  function closeModal() {
    if (modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    document.documentElement.classList.remove("newsletter-open");
    try { localStorage.setItem(key, Date.now()); } catch (err) {}
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  // Close events: the X, a click on the dimmed backdrop, the Esc key, or following
  // any link in the popup (a button, or the newsletter link on this same page)
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("newsletter-overlay")) closeModal();
    const link = e.target.closest("a[href]");
    if (link) {
      if (typeof gtag === "function") {
        gtag("event", "popup_click", { popup: key, link_text: link.textContent.trim(), link_url: link.href, placement: "popup" });
      }
      closeModal();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
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
      const setOpen = (open) => {
        body.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      toggle.addEventListener('click', () => setOpen(!body.classList.contains('menu-open')));

      // Close with Esc (focus back on the button) or a tap outside the header
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && body.classList.contains('menu-open')) { setOpen(false); toggle.focus(); }
      });
      document.addEventListener('click', (e) => {
        if (body.classList.contains('menu-open') && !e.target.closest('.site-header')) setOpen(false);
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

// ---------------------------------------------------------------
// Homepage latest posts: on phones the cards swipe sideways (style.css), and
// these dots show which card is in view and jump to a card when tapped.
// The cards never move on their own. Without JavaScript, swiping still works.
// ---------------------------------------------------------------
(function() {
  const track = document.querySelector("#latest-posts .post-grid");
  const dots = document.querySelector("#latest-posts .post-dots");
  if (!track || !dots) return;

  const cards = Array.from(track.children);
  if (cards.length < 2) return;

  const buttons = cards.map((card, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", "Show post " + (i + 1) + " of " + cards.length);
    button.addEventListener("click", () => {
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({
        left: card.offsetLeft - track.offsetLeft,
        behavior: calm ? "auto" : "smooth"
      });
    });
    dots.appendChild(button);
    return button;
  });

  // The current card is the one whose middle is closest to the middle of the row
  function update() {
    const middle = track.getBoundingClientRect().left + track.clientWidth / 2;
    let current = 0;
    let closest = Infinity;
    cards.forEach((card, i) => {
      const box = card.getBoundingClientRect();
      const distance = Math.abs(box.left + box.width / 2 - middle);
      if (distance < closest) {
        closest = distance;
        current = i;
      }
    });
    buttons.forEach((button, i) => {
      if (i === current) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
  }

  let queued = false;
  track.addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  }, { passive: true });

  update();
})();

// ---------------------------------------------------------------
// Before/after audio players (_includes/audio-compare.html): one play button and
// a switch between versions that keeps the playback position, so listeners hear
// the same moment in each. Without JavaScript the plain audio players stay.
// ---------------------------------------------------------------
(function () {
  const fmt = (s) => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");

  document.querySelectorAll(".audio-compare").forEach((box) => {
    const clips = [...box.querySelectorAll("audio")];
    if (clips.length < 2) return;
    let current = clips[0];

    const ui = document.createElement("div");
    ui.className = "audio-compare-ui";
    ui.innerHTML =
      '<div class="audio-compare-switch" role="group" aria-label="Choose a version"></div>' +
      '<div class="audio-compare-transport">' +
      '<button type="button" class="audio-compare-play" aria-label="Play">▶</button>' +
      '<input type="range" class="audio-compare-seek" min="0" max="100" step="0.1" value="0" aria-label="Position">' +
      '<span class="audio-compare-time">0:00</span>' +
      "</div>";
    const group = ui.querySelector(".audio-compare-switch");
    const play = ui.querySelector(".audio-compare-play");
    const seek = ui.querySelector(".audio-compare-seek");
    const time = ui.querySelector(".audio-compare-time");

    const buttons = clips.map((clip, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = clip.dataset.label;
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      b.addEventListener("click", () => choose(clip));
      group.append(b);
      clip.preload = "metadata";
      clip.addEventListener("timeupdate", () => {
        if (clip !== current || !clip.duration) return;
        seek.value = (clip.currentTime / clip.duration) * 100;
        time.textContent = fmt(clip.currentTime);
      });
      clip.addEventListener("ended", () => { if (clip === current) setPlaying(false); });
      return b;
    });

    function setPlaying(on) {
      play.textContent = on ? "❚❚" : "▶";
      play.setAttribute("aria-label", on ? "Pause" : "Play");
    }

    function choose(clip) {
      if (clip === current) return;
      const wasPlaying = !current.paused;
      const at = current.currentTime;
      current.pause();
      current = clip;
      buttons.forEach((b, i) => b.setAttribute("aria-pressed", clips[i] === clip ? "true" : "false"));
      try { clip.currentTime = at; } catch (e) {}
      if (wasPlaying) clip.play();
    }

    play.addEventListener("click", () => {
      if (current.paused) {
        current.play();
        setPlaying(true);
        if (typeof gtag === "function") {
          gtag("event", "audio_compare_play", { clip: box.dataset.compare, version: current.dataset.label });
        }
      } else {
        current.pause();
        setPlaying(false);
      }
    });

    seek.addEventListener("input", () => {
      if (current.duration) current.currentTime = (seek.value / 100) * current.duration;
    });

    box.classList.add("is-enhanced");
    box.querySelector(".audio-compare-clips").after(ui);
  });
})();

// ---------------------------------------------------------------
// External links always open in a new tab, so visitors keep darksoft.band
// open. Templates set target="_blank" themselves; this catches anything
// else (links added by embedded widgets, or new content that forgets it).
// ---------------------------------------------------------------
document.addEventListener("click", (e) => {
  const link = e.target.closest("a[href]");
  if (!link || link.target) return;
  let url;
  try { url = new URL(link.href, location.href); } catch (err) { return; }
  if (!/^https?:$/.test(url.protocol) || url.hostname === location.hostname) return;
  link.target = "_blank";
  link.rel = (link.rel ? link.rel + " " : "") + "noopener";
}, true);
