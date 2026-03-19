const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll('a[href^="#"]');
const revealItems = document.querySelectorAll(".reveal");
const supportForm = document.getElementById("support-form");
const formNote = document.getElementById("form-note");
const yearElement = document.getElementById("year");
const sections = document.querySelectorAll("main section[id]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const supportMailboxCodes = [
  115, 117, 112, 112, 111, 114, 116, 64, 114, 117, 115, 115, 101, 108, 108, 108,
  117, 98, 105, 110, 115, 107, 105, 46, 117, 115
];

const setYear = () => {
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
};

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeMobileNav = () => {
  if (!navToggle) return;
  body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
};

const openMobileNav = () => {
  if (!navToggle) return;
  body.classList.add("nav-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close navigation menu");
};

const toggleMobileNav = () => {
  if (body.classList.contains("nav-open")) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
};

const scrollToTarget = (targetId) => {
  const target = document.querySelector(targetId);
  if (!target) return;

  const headerHeight = header ? header.offsetHeight : 0;
  const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

  window.scrollTo({
    top,
    behavior: reduceMotion.matches ? "auto" : "smooth"
  });
};

const updateActiveNav = () => {
  let currentId = "#home";
  const offset = (header ? header.offsetHeight : 0) + 120;

  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - offset) {
      currentId = `#${section.id}`;
    }
  });

  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === currentId);
  });
};

const initReveal = () => {
  if (reduceMotion.matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
};

const buildSupportEmail = (formData) => {
  const recipient = String.fromCharCode(...supportMailboxCodes);
  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const app = (formData.get("app") || "").toString().trim() || "App Support";
  const message = (formData.get("message") || "").toString().trim();

  const subject = `${app} Support Request`;
  const bodyLines = [
    name ? `Name: ${name}` : "",
    email ? `Email: ${email}` : "",
    `App: ${app}`,
    "",
    "Issue details:",
    message
  ].filter(Boolean);

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
};

if (navToggle) {
  navToggle.addEventListener("click", toggleMobileNav);
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    closeMobileNav();
    scrollToTarget(href);

    if (target.tabIndex < 0) {
      target.tabIndex = -1;
    }

    window.setTimeout(() => {
      target.focus({ preventScroll: true });
    }, reduceMotion.matches ? 0 : 350);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileNav();
  }
});

document.addEventListener("click", (event) => {
  if (!body.classList.contains("nav-open") || !siteNav || !navToggle) return;

  const clickTarget = event.target;
  if (siteNav.contains(clickTarget) || navToggle.contains(clickTarget)) return;
  closeMobileNav();
});

window.addEventListener("scroll", () => {
  setHeaderState();
  updateActiveNav();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeMobileNav();
  }
});

if (supportForm && formNote) {
  supportForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(supportForm);
    const message = (formData.get("message") || "").toString().trim();

    if (!message) {
      formNote.textContent = "Please add a brief message so the email draft includes your issue.";
      formNote.classList.add("is-error");
      const messageField = document.getElementById("message");
      if (messageField) messageField.focus();
      return;
    }

    formNote.textContent = "Your default email app should open with a pre-filled draft.";
    formNote.classList.remove("is-error");
    window.location.href = buildSupportEmail(formData);
  });
}

setYear();
setHeaderState();
updateActiveNav();
initReveal();
