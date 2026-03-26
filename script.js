// 1. MOBILE MENU TOGGLE
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

if (toggle && nav) {
  toggle.addEventListener("click", function () {
    nav.classList.toggle("active");
    // Switch between hamburger (≡) and close (✕) icons
    toggle.textContent = nav.classList.contains("active") ? "✕" : "≡";
  });
}

// 2. PAGE SWITCHER LOGIC
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function(e) {
    const targetPageId = this.getAttribute('data-page');
    
    // Only switch if the link has a data-page attribute
    if (targetPageId) {
      e.preventDefault();

      // Hide all sections with the 'page' class
      document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
      });

      // Show the section that matches the data-page ID
      const targetPage = document.getElementById(targetPageId);
      if (targetPage) {
        targetPage.classList.add('active');
      }

      // Automatically close mobile menu after clicking a link
      if (nav.classList.contains("active")) {
        nav.classList.remove("active");
        toggle.textContent = "≡";
      }
      
      // Scroll to top of the new page
      window.scrollTo(0, 0);
    }
  });
});

console.log("JS WORKING");

// 3. SECURITY: SHA-512 FUNCTION
async function sha512(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-512", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Test the hash function
sha512("alphaSecure_92817").then(hash => {
  console.log("Security Hash Generated:", hash);
});

