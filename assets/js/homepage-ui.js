document.addEventListener("DOMContentLoaded", function () {
  var toggles = document.querySelectorAll("[data-toggle-target]");

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
});
