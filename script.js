const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Reveal sections on scroll — isolated first so a later feature's error
// can never leave the rest of the page stuck at opacity:0.
try {
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  }
} catch (err) {
  console.error("Reveal-on-scroll setup failed:", err);
}

// Typing effect for hero role text
try {
  const roles = [
    "Python Developer",
    "Odoo ERP Developer",
    "AI Developer",
    "ERP Automation Specialist",
  ];
  const typedEl = document.getElementById("typed");
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1500);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(tick, deleting ? 40 : 90);
  }

  if (prefersReducedMotion) {
    typedEl.textContent = roles[0];
  } else {
    tick();
  }
} catch (err) {
  console.error("Typing effect setup failed:", err);
}

// Mobile nav toggle
try {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
} catch (err) {
  console.error("Mobile nav toggle setup failed:", err);
}

// Theme toggle
try {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    themeIcon.className = theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "dark" : "light");
  });

  setTheme(localStorage.getItem("theme") || "dark");
} catch (err) {
  console.error("Theme toggle setup failed:", err);
}

// Contact form AJAX submit
try {
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector(".form-btn");
    btn.disabled = true;
    btn.textContent = "Sending...";

    fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          contactForm.reset();
          formStatus.textContent = "Message sent successfully!";
          formStatus.className = "form-status success";
        } else {
          formStatus.textContent = "Something went wrong. Please try again.";
          formStatus.className = "form-status error";
        }
      })
      .catch(() => {
        formStatus.textContent = "Something went wrong. Please try again.";
        formStatus.className = "form-status error";
      })
      .finally(() => {
        btn.disabled = false;
        btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
        setTimeout(() => (formStatus.textContent = ""), 5000);
      });
  });
} catch (err) {
  console.error("Contact form setup failed:", err);
}

// Footer year
try {
  document.getElementById("year").textContent = new Date().getFullYear();
} catch (err) {
  console.error("Footer year setup failed:", err);
}

// ── Scroll progress bar ────────────────────────────────────────
try {
  const scrollProgressEl = document.getElementById("scrollProgress");
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgressEl && docHeight > 0) {
      scrollProgressEl.style.width = (scrollTop / docHeight * 100) + "%";
    }
  }, { passive: true });
} catch (err) {
  console.error("Scroll progress bar setup failed:", err);
}

// ── Active nav link on scroll ──────────────────────────────────
try {
  const allSections = document.querySelectorAll("section[id]");
  const allNavLinks = document.querySelectorAll(".nav-links a");

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    allSections.forEach((section) => {
      const id = section.getAttribute("id");
      if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
        allNavLinks.forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === "#" + id);
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();
} catch (err) {
  console.error("Active nav link setup failed:", err);
}

// ── Particle canvas ────────────────────────────────────────────
try {
  const canvas = document.getElementById("particles");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let pts = [];

    function makePt() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 0.4,
        a: Math.random() * 0.35 + 0.08,
      };
    }

    function init() {
      canvas.width  = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      pts = Array.from({ length: 65 }, makePt);
    }

    let running = !document.hidden;

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          Object.assign(p, makePt());
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(47,129,247,${p.a})`;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(47,129,247,${0.07 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }

    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) requestAnimationFrame(frame);
    });

    window.addEventListener("resize", init, { passive: true });
    init();
    frame();
  }
} catch (err) {
  console.error("Particle canvas setup failed:", err);
}

// ── Back to top button ─────────────────────────────────────────
try {
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      backToTopBtn.classList.toggle("visible", window.scrollY > 400);
    }, { passive: true });
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }
} catch (err) {
  console.error("Back-to-top button setup failed:", err);
}

// ── Counter animation for stats ────────────────────────────────
try {
  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }
    const increment = target / (1200 / 16);
    let current = 0;
    const tick = () => {
      current = Math.min(current + increment, target);
      el.textContent = Math.floor(current);
      if (current < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const statsSection = document.querySelector(".stats-row");
  if (statsSection) {
    let counted = false;
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        statsSection.querySelectorAll(".stat-number").forEach(animateCount);
      }
    }, { threshold: 0.5 }).observe(statsSection);
  }
} catch (err) {
  console.error("Stat counter setup failed:", err);
}

// ── Copy email to clipboard ────────────────────────────────────
try {
  function showToast(msg) {
    const toast = document.getElementById("toastNotify");
    if (!toast) return;
    toast.querySelector("span").textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  }

  const copyEmailBtn = document.getElementById("copyEmailBtn");
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", () => {
      navigator.clipboard.writeText("patelkunjan1319@gmail.com")
        .then(() => showToast("Email copied to clipboard!"))
        .catch(() => showToast("Please copy: patelkunjan1319@gmail.com"));
    });
  }
} catch (err) {
  console.error("Copy-email button setup failed:", err);
}
