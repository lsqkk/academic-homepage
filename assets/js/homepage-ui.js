document.addEventListener("DOMContentLoaded", function () {
  var toggles = document.querySelectorAll("[data-toggle-target]");
  var glow = document.querySelector(".cursor-glow");
  var typewriter = document.getElementById("typewriter-text");
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
});
