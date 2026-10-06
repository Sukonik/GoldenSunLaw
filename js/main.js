(function () {
  "use strict";

  var config = window.LAW_SITE_CONFIG || {};
  var root = document.documentElement;
  var profile = config.profile === "small" ? "small" : "enterprise";
  root.setAttribute("data-firm-profile", profile);

  document.querySelectorAll("[data-brand]").forEach(function (el) {
    el.textContent = config.brand || "LAW";
  });
  document.querySelectorAll("[data-legal-name]").forEach(function (el) {
    el.textContent = config.legalName || "Law Firm LLP";
  });
  document.querySelectorAll("[data-primary-office]").forEach(function (el) {
    el.textContent = config.primaryOffice || "";
  });
  document.querySelectorAll("[data-short-line]").forEach(function (el) {
    el.textContent = config.shortLine || "";
  });

  if (profile === "small") {
    document.querySelectorAll("[data-enterprise-only]").forEach(function (el) {
      el.hidden = true;
    });
    document.querySelectorAll("[data-small-copy]").forEach(function (el) {
      if (el.dataset.smallCopy) el.textContent = el.dataset.smallCopy;
    });
  }

  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.querySelector(".nav-drawer");
  var closeBtn = document.querySelector(".nav-drawer__close");

  function setDrawer(open) {
    if (!toggle || !drawer) return;
    toggle.setAttribute("aria-expanded", String(open));
    drawer.hidden = !open;
    drawer.dataset.open = String(open);
    document.body.classList.toggle("drawer-open", open);
    if (open) {
      var first = drawer.querySelector("a");
      if (first) first.focus();
    }
  }

  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      setDrawer(toggle.getAttribute("aria-expanded") !== "true");
    });
    if (closeBtn) closeBtn.addEventListener("click", function () { setDrawer(false); });
    drawer.addEventListener("click", function (event) {
      if (event.target.closest("a")) setDrawer(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setDrawer(false);
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();