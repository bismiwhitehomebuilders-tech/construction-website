const toggle =
document.queryselector(".menu-toggle");
const nav =
document.queryselector(".nav-links");

if(toggle){
toggle.addEventListener("click", () => {
nav.classList.toggle("active");
});
}
