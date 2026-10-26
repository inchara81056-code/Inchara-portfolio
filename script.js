// ==============================
// MOBILE NAVIGATION
// ==============================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// ==============================
// CURRENT FOOTER YEAR
// ==============================

document.getElementById("currentYear").textContent =
  new Date().getFullYear();

// ==============================
// CONTACT FORM
// ==============================

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitButton = contactForm.querySelector('button[type="submit"]');
const submitText = document.getElementById("submitText");

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  formStatus.textContent = "";
  formStatus.className = "form-status";

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const formData = new FormData(contactForm);

  const contactData = {
    name: formData.get("name").trim(),
    email: formData.get("email").trim(),
    subject: formData.get("subject").trim(),
    message: formData.get("message").trim()
  };

  if (!contactData.name || !contactData.email || !contactData.message) {
    formStatus.textContent = "Please complete all required fields.";
    formStatus.classList.add("error");
    return;
  }

  submitButton.disabled = true;
  submitText.textContent = "Sending...";

  try {
    const response = await fetch("/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contactData)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to send your message.");
    }

    formStatus.textContent = result.message;
    formStatus.classList.add("success");
    contactForm.reset();
  } catch (error) {
    formStatus.textContent =
      error.message ||
      "Could not connect to the server. Please try again later.";

    formStatus.classList.add("error");
  } finally {
    submitButton.disabled = false;
    submitText.textContent = "Send message";
  }
});

// ==============================
// ACTIVE NAVIGATION ON SCROLL
// ==============================

const sections = document.querySelectorAll("main section[id]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navItems.forEach((link) => {
        const isActive =
          link.getAttribute("href") === `#${entry.target.id}`;

        link.classList.toggle("active", isActive);
      });
    });
  },
  {
    rootMargin: "-25% 0px -60% 0px"
  }
);

sections.forEach((section) => observer.observe(section));