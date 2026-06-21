// Typing effect for hero role text
const roles = [
  "Python Developer",
  "Odoo ERP Developer",
  "Django Enthusiast",
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
tick();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  navToggle.classList.toggle("active");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("active");
  });
});

// Reveal sections on scroll
const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));

// Theme toggle
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

// Contact form AJAX submit
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

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
