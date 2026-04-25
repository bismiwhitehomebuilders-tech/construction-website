// MENU TOGGLE
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}

// PAGE SWITCH
const links = document.querySelectorAll('[data-page]');
const pages = document.querySelectorAll('.page');

links.forEach(link => {
  link.addEventListener('click', () => {
    const id = link.getAttribute('data-page');

    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    if (nav) nav.classList.remove("active");
  });
});

// LOADER
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.style.display = "none";
    }, 800);
  }
});

// SCROLL ANIMATION
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

document.querySelectorAll("section, .project-card").forEach(el => {
  el.classList.add("hidden");
  observer.observe(el);
});

// HERO IMAGE SLIDER
const hero = document.querySelector(".hero");

const images = [
  "images/hero.jpg",
  "images/villa.jpg",
  "images/home.jpg"
];

let i = 0;

if (hero) {
  setInterval(() => {
    i = (i + 1) % images.length;
    hero.style.backgroundImage =
      `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url('${images[i]}')`;
  }, 4000);
}

// ✅ FORM SUBMIT (FINAL CLEAN)
const form = document.getElementById("contact-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value,
      phone: form.phone.value,
      message: form.message.value
    };

    try {
      const res = await fetch("https://construction-website-ey39.onrender.com/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        alert("✅ Request Sent Successfully!");

        // WhatsApp redirect
        const phoneNumber = "919072745989";
        const msg = `New enquiry:
Name: ${data.name}
Phone: ${data.phone}
Message: ${data.message}`;

        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");

        form.reset();
      } else {
        alert("❌ Failed to send");
      }

    } catch (err) {
      console.log(err);
      alert("⚠️ Server error");
    }
  });
}
