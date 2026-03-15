// Scroll to top button
const scrollBtn = document.getElementById("scrollTopBtn");

if (scrollBtn) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollBtn.classList.add("show");
    } else {
      scrollBtn.classList.remove("show");
    }
  });

  scrollBtn.onclick = function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
}

// Projects filter
const filterButtons = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project-showcase-card");

if (filterButtons.length > 0 && projects.length > 0) {
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");

      projects.forEach(project => {
        if (filter === "all") {
          project.style.display = "block";
        } else if (project.getAttribute("data-category") === filter) {
          project.style.display = "block";
        } else {
          project.style.display = "none";
        }
      });
    });
  });
}