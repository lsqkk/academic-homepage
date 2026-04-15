document.addEventListener("DOMContentLoaded", function () {
  var toggles = document.querySelectorAll("[data-toggle-target]");
  var glow = document.querySelector(".cursor-glow");
  var typewriter = document.getElementById("typewriter-text");
  var lightbox = document.getElementById("image-lightbox");
  var lightboxImage = document.getElementById("image-lightbox-img");
  var lightboxClose = document.getElementById("image-lightbox-close");
  var targetX = window.innerWidth / 2;
  var targetY = window.innerHeight / 2;
  var currentX = targetX;
  var currentY = targetY;

  toggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var target = toggle.getAttribute("data-toggle-target");
      var hiddenItems = document.querySelectorAll('[data-collapsible="' + target + '"] .is-collapsed');
      var expanded = toggle.getAttribute("aria-expanded") === "true";

      hiddenItems.forEach(function (item) {
        item.style.display = expanded ? "none" : "";
      });

      toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
      toggle.textContent = expanded
        ? toggle.getAttribute("data-expand-label")
        : toggle.getAttribute("data-collapse-label");
    });
  });

  if (glow) {
    window.addEventListener("mousemove", function (event) {
      targetX = event.clientX;
      targetY = event.clientY;
    });

    function animateGlow() {
      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;
      glow.style.transform = "translate(" + currentX + "px, " + currentY + "px) translate(-50%, -50%)";
      window.requestAnimationFrame(animateGlow);
    }

    animateGlow();
  }

  if (typewriter) {
    var message = "To boundless horizons and countless souls, I am connected";
    var typingDelay = 75;
    var deletingDelay = 38;
    var holdDelay = 3000;
    var restartDelay = 600;
    var index = 0;
    var isDeleting = false;

    function tickTypewriter() {
      if (!isDeleting) {
        index += 1;
        typewriter.textContent = message.slice(0, index);

        if (index === message.length) {
          window.setTimeout(function () {
            isDeleting = true;
            tickTypewriter();
          }, holdDelay);
          return;
        }

        window.setTimeout(tickTypewriter, typingDelay);
        return;
      }

      index -= 1;
      typewriter.textContent = message.slice(0, index);

      if (index === 0) {
        isDeleting = false;
        window.setTimeout(tickTypewriter, restartDelay);
        return;
      }

      window.setTimeout(tickTypewriter, deletingDelay);
    }

    tickTypewriter();
  }

  if (lightbox && lightboxImage) {
    var previewImages = document.querySelectorAll("header img, section img");

    function openLightbox(image) {
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt || "Preview image";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImage.src = "";
      lightboxImage.alt = "";
      document.body.classList.remove("lightbox-open");
    }

    previewImages.forEach(function (image) {
      image.classList.add("lightbox-enabled");
      image.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        openLightbox(image);
      });
    });

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox || event.target.getAttribute("data-lightbox-close") === "true") {
        closeLightbox();
      }
    });

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }
});
