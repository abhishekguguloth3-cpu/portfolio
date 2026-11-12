/* =========================================================
   Portfolio interactions
   - scroll-printed words
   - character-split hero title
   - reveal-on-scroll, scrollspy, tilt, clock, copy
   ========================================================= */
(() => {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- split hero title into characters ---------- */
  let charIndex = 0;
  document.querySelectorAll("[data-split]").forEach((line) => {
    const text = line.textContent.trim();
    line.textContent = "";
    [...text].forEach((char) => {
      const span = document.createElement("span");
      span.className = "ch";
      span.textContent = char;
      span.style.setProperty("--i", String(charIndex++));
      span.setAttribute("aria-hidden", "true");
      line.appendChild(span);
    });
  });

  /* ---------- split print elements into words ---------- */
  const printElements = [];

  const splitWords = (el) => {
    const text = el.textContent.replace(/\s+/g, " ").trim();
    el.textContent = "";

    const fragment = document.createDocumentFragment();
    const words = text.split(" ");

    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.className = "w";
      span.textContent = word;
      fragment.appendChild(span);
      if (index < words.length - 1) fragment.appendChild(document.createTextNode(" "));
    });

    el.appendChild(fragment);
    el._words = Array.from(el.children);
    el._shown = -1;
    printElements.push(el);
  };

  document.querySelectorAll("[data-print]").forEach(splitWords);

  const paintWords = (el) => {
    const viewport = window.innerHeight;
    const rect = el.getBoundingClientRect();
    const start = viewport * 0.95;
    const end = viewport * 0.45;
    const distance = Math.max(1, start - end + rect.height * 0.5);

    let progress = (start - rect.top) / distance;
    progress = Math.max(0, Math.min(1, progress));

    const total = el._words.length;
    const visible = reduceMotion ? total : Math.round(progress * total);

    if (visible !== el._shown) {
      el._words.forEach((word, index) => {
        word.classList.toggle("on", index < visible);
      });
      el._shown = visible;
    }
  };

  if (reduceMotion) {
    printElements.forEach((el) => el._words.forEach((w) => w.classList.add("on")));
  }

  /* ---------- reveal on scroll ---------- */
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("in"));
  }

  /* ---------- scrollspy ---------- */
  const navLinks = Array.from(
    document.querySelectorAll('.nav-links a[href^="#"]:not(.nav-mobile-cta)')
  );
  const sections = ["about", "education", "skills", "work", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- navigation ---------- */
  const nav = document.getElementById("nav");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuLinks = document.querySelectorAll(".nav-links a");

  const closeMenu = () => {
    document.body.classList.remove("nav-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  menuLinks.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 880) closeMenu();
  });

  /* ---------- portrait tilt ---------- */
  const tiltTarget = document.querySelector("[data-tilt]");
  if (tiltTarget && finePointer && !reduceMotion) {
    const strength = 6;

    tiltTarget.addEventListener("pointerenter", () => {
      tiltTarget.classList.add("tilting");
    });

    tiltTarget.addEventListener("pointermove", (event) => {
      const rect = tiltTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      tiltTarget.style.transform =
        `perspective(950px) rotateY(${(x * strength).toFixed(2)}deg) ` +
        `rotateX(${(-y * strength).toFixed(2)}deg) translateZ(0)`;
    });

    tiltTarget.addEventListener("pointerleave", () => {
      tiltTarget.style.transform = "";
      window.setTimeout(() => tiltTarget.classList.remove("tilting"), 500);
    });
  }

  /* ---------- scroll frame ---------- */
  const progressBar = document.querySelector(".scroll-progress i");
  const parallax = document.querySelector("[data-parallax]");
  const hero = document.querySelector(".hero");
  let ticking = false;

  const updateScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    if (progressBar) {
      const ratio = max > 0 ? Math.min(1, scrollY / max) : 0;
      progressBar.style.transform = `scaleX(${ratio})`;
    }

    if (nav) nav.classList.toggle("scrolled", scrollY > 24);

    if (parallax && hero && !reduceMotion) {
      const offset = Math.min(scrollY, hero.offsetHeight) * 0.055;
      parallax.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    }

    // catch elements skipped by fast jumps or anchor links
    if (!reduceMotion) {
      revealItems.forEach((item) => {
        if (item.classList.contains("in")) return;
        if (item.getBoundingClientRect().top < window.innerHeight * 0.94) {
          item.classList.add("in");
        }
      });
    }

    printElements.forEach(paintWords);
    ticking = false;
  };

  const requestScrollUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScroll);
  };

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });

  /* ---------- copy email ---------- */
  const copyButton = document.querySelector(".copy-btn");

  const copyText = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      /* fall through to legacy path */
    }

    try {
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const ok = document.execCommand("copy");
      field.remove();
      return ok;
    } catch (error) {
      return false;
    }
  };

  if (copyButton) {
    const label = copyButton.textContent;
    let resetTimer;

    copyButton.addEventListener("click", async () => {
      const value = copyButton.getAttribute("data-copy") || "";
      const ok = await copyText(value);

      copyButton.textContent = ok ? "Copied ✓" : "Copy failed";
      copyButton.classList.toggle("copied", ok);

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        copyButton.textContent = label;
        copyButton.classList.remove("copied");
      }, 1800);
    });
  }

  /* ---------- clock + year ---------- */
  const clock = document.querySelector("[data-clock]");
  const year = document.querySelector("[data-year]");

  if (year) year.textContent = String(new Date().getFullYear());

  if (clock) {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
      hour12: false,
    });

    const tick = () => {
      clock.textContent = formatter.format(new Date());
    };

    tick();
    window.setInterval(tick, 30000);
  }

  /* ---------- initial paint ---------- */
  window.requestAnimationFrame(() => {
    updateScroll();
    root.classList.add("ready");
  });
})();
