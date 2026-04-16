document.addEventListener("DOMContentLoaded", function () {
  var toggles = document.querySelectorAll("[data-toggle-target]");
  var glow = document.querySelector(".cursor-glow");
  var typewriter = document.getElementById("typewriter-text");
  var lightbox = document.getElementById("image-lightbox");
  var lightboxImage = document.getElementById("image-lightbox-img");
  var lightboxClose = document.getElementById("image-lightbox-close");
  var repoBoard = document.querySelector(".repo-board");
  var targetX = window.innerWidth / 2;
  var targetY = window.innerHeight / 2;
  var currentX = targetX;
  var currentY = targetY;

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

  if (repoBoard) {
    var owner = repoBoard.getAttribute("data-repo-owner");
    var name = repoBoard.getAttribute("data-repo-name");
    var repoUrl = repoBoard.getAttribute("data-repo-url");
    var apiUrl = "https://api.github.com/repos/" + owner + "/" + name;

    function setText(id, value) {
      var element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    }

    function formatDate(value) {
      var date = new Date(value);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }

    fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github+json"
      }
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("GitHub API request failed");
        }

        return response.json();
      })
      .then(function (data) {
        setText("repo-board-title", data.full_name || owner + "/" + name);
        setText("repo-board-description", data.description || "A deeply customized academic homepage template.");
        setText("repo-stars", String(data.stargazers_count ?? "--"));
        setText("repo-forks", String(data.forks_count ?? "--"));
        setText("repo-issues", String(data.open_issues_count ?? "--"));
        setText("repo-watchers", String(data.subscribers_count ?? data.watchers_count ?? "--"));
        setText("repo-branch", data.default_branch || "--");
        setText("repo-updated", data.pushed_at ? formatDate(data.pushed_at) : "--");
        setText("repo-license", "License: " + (data.license && data.license.spdx_id ? data.license.spdx_id : "Not specified"));

        var boardLink = document.getElementById("repo-board-link");
        var issuesLink = document.getElementById("repo-issues-link");

        if (boardLink) {
          boardLink.href = data.html_url || repoUrl;
        }

        if (issuesLink) {
          issuesLink.href = (data.html_url || repoUrl) + "/issues";
        }
      })
      .catch(function () {
        setText("repo-board-description", "GitHub API data is temporarily unavailable. You can still open the repository directly.");
      });
  }
});
