// Enables the tabbed layout only when this script actually loads, so the
// server-rendered panels stay visible if the file fails to fetch.
document.documentElement.classList.add("tabs-ready");

document.addEventListener("DOMContentLoaded", function () {
  var toggles = document.querySelectorAll("[data-toggle-target]");
  var tabGroups = document.querySelectorAll("[data-tab-group]");
  var lightbox = document.getElementById("image-lightbox");
  var lightboxImage = document.getElementById("image-lightbox-img");
  var lightboxClose = document.getElementById("image-lightbox-close");
  var wechatModal = document.getElementById("wechat-modal");
  var wechatOpeners = document.querySelectorAll("[data-wechat-open]");
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.sidebar-nav a[href^="#"]')
  );
  var navSections = navLinks
    .map(function (link) {
      return {
        link: link,
        section: document.getElementById(link.getAttribute("href").slice(1))
      };
    })
    .filter(function (entry) {
      return entry.section;
    });
  var activeNavLink = null;
  var navTicking = false;

  function setActiveNav(link) {
    if (link === activeNavLink) {
      return;
    }

    activeNavLink = link;

    navLinks.forEach(function (candidate) {
      var isActive = candidate === link;

      candidate.classList.toggle("is-active", isActive);

      if (isActive) {
        candidate.setAttribute("aria-current", "location");
      } else {
        candidate.removeAttribute("aria-current");
      }
    });
  }

  function updateActiveNav() {
    if (!navSections.length) {
      return;
    }

    var probe = window.scrollY + Math.max(120, window.innerHeight * 0.2);
    var active = navSections[0];

    navSections.forEach(function (entry) {
      if (entry.section.getBoundingClientRect().top + window.scrollY <= probe) {
        active = entry;
      }
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      active = navSections[navSections.length - 1];
    }

    setActiveNav(active.link);
  }

  function onNavScroll() {
    if (navTicking) {
      return;
    }

    navTicking = true;

    window.requestAnimationFrame(function () {
      updateActiveNav();
      navTicking = false;
    });
  }

  if (navSections.length) {
    window.addEventListener("scroll", onNavScroll, { passive: true });
    window.addEventListener("resize", onNavScroll);
    window.addEventListener("load", updateActiveNav);
    updateActiveNav();
  }

  if (wechatModal && wechatOpeners.length) {
    var wechatDialog = wechatModal.querySelector(".wechat-modal-dialog");
    var wechatClose = wechatModal.querySelector(".wechat-modal-close");
    var lastWechatFocus = null;

    function getWechatFocusables() {
      if (!wechatDialog) {
        return [];
      }

      return Array.prototype.slice.call(
        wechatDialog.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
    }

    function openWechat() {
      lastWechatFocus = document.activeElement;
      wechatModal.classList.add("is-open");
      wechatModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      window.setTimeout(function () {
        if (wechatClose) {
          wechatClose.focus();
        }
      }, 0);
    }

    function closeWechat() {
      wechatModal.classList.remove("is-open");
      wechatModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");

      if (lastWechatFocus && typeof lastWechatFocus.focus === "function") {
        lastWechatFocus.focus();
      }

      lastWechatFocus = null;
    }

    wechatOpeners.forEach(function (opener) {
      opener.addEventListener("click", function (event) {
        event.preventDefault();
        openWechat();
      });
    });

    wechatModal.querySelectorAll("[data-wechat-close]").forEach(function (closer) {
      closer.addEventListener("click", closeWechat);
    });

    document.addEventListener("keydown", function (event) {
      if (!wechatModal.classList.contains("is-open")) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeWechat();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      var focusables = getWechatFocusables();

      if (!focusables.length) {
        return;
      }

      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  tabGroups.forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));

    if (!tabs.length) {
      return;
    }

    function activateTab(tab) {
      tabs.forEach(function (candidate) {
        var isActive = candidate === tab;
        var panel = document.getElementById(candidate.getAttribute("aria-controls"));

        candidate.classList.toggle("is-active", isActive);
        candidate.setAttribute("aria-selected", isActive ? "true" : "false");
        candidate.tabIndex = isActive ? 0 : -1;

        if (panel) {
          panel.classList.toggle("is-active", isActive);
        }
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        activateTab(tab);
      });

      tab.addEventListener("keydown", function (event) {
        var nextIndex = null;

        if (event.key === "ArrowRight") {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === "ArrowLeft") {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = tabs.length - 1;
        }

        if (nextIndex === null) {
          return;
        }

        event.preventDefault();
        tabs[nextIndex].focus();
        activateTab(tabs[nextIndex]);
      });
    });

    activateTab(tabs[0]);
  });

  toggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var target = toggle.getAttribute("data-toggle-target");
      var collapsible = document.querySelector('[data-collapsible="' + target + '"]');
      var expanded = toggle.getAttribute("aria-expanded") === "true";

      if (!collapsible) {
        return;
      }

      collapsible.classList.toggle("is-expanded", !expanded);

      toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
      toggle.textContent = expanded
        ? toggle.getAttribute("data-expand-label")
        : toggle.getAttribute("data-collapse-label");
    });
  });

  if (lightbox && lightboxImage) {
    var previewImages = document.querySelectorAll(
      "header img:not([data-no-lightbox]), section img:not([data-no-lightbox])"
    );
    var lastFocusedImage = null;

    function openLightbox(image) {
      lastFocusedImage = image;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt || "Preview image";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");

      window.setTimeout(function () {
        if (lightboxClose) {
          lightboxClose.focus();
        }
      }, 0);
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImage.src = "";
      lightboxImage.alt = "";
      document.body.classList.remove("lightbox-open");

      if (lastFocusedImage) {
        lastFocusedImage.focus();
        lastFocusedImage = null;
      }
    }

    previewImages.forEach(function (image) {
      image.classList.add("lightbox-enabled");
      image.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        openLightbox(image);
      });

      if (!image.closest("a")) {
        image.setAttribute("tabindex", "0");
        image.setAttribute("role", "button");
        image.setAttribute("aria-label", "Open image preview: " + (image.alt || "image"));
        image.addEventListener("keydown", function (event) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openLightbox(image);
          }
        });
      }
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
