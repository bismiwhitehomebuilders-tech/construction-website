const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

if (toggle && nav) {
  toggle.addEventListener("click", function () {
    nav.classList.toggle("active");
    // Optional: Change the icon to 'X' when open
    toggle.textContent = nav.classList.contains("active") ? "✕" : "≡";
  });
}

console.log("JS WORKING");

async function sha512(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-512", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// test
sha512("alphaSecure_92817").then(hash => {
  console.log("Hash:", hash);
});
