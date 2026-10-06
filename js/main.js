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

  var THEMES = [
    { id: "cobalt", label: "Cobalt", swatch: "linear-gradient(135deg,#061A33,#168BFF,#62C3FF)" },
    { id: "lime", label: "Lime", swatch: "linear-gradient(135deg,#102312,#63B72D,#B8F34B)" },
    { id: "rose", label: "Rose", swatch: "linear-gradient(135deg,#2B0A13,#B92E4A,#FF6B82)" },
    { id: "lemon", label: "Lemon", swatch: "linear-gradient(135deg,#332A00,#D6A900,#FFE65B)" },
    { id: "lavender", label: "Lavender", swatch: "linear-gradient(135deg,#1D1535,#7557D9,#C8B7FF)" },
    { id: "dove", label: "Dove", swatch: "linear-gradient(135deg,#3E444C,#8B949E,#D7DCE2)" },
    { id: "ivory", label: "Ivory", swatch: "linear-gradient(135deg,#786E57,#D8CFAE,#FFF9E9)" },
    { id: "onyx", label: "Onyx", swatch: "linear-gradient(135deg,#050608,#1A1D22,#4B515B)" }
  ];

  function setTheme(theme) {
    var valid = THEMES.some(function (item) { return item.id === theme; });
    var next = valid ? theme : (config.defaultTheme || "cobalt");
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("sun-theme", next); } catch (e) {}
    document.querySelectorAll("[data-theme-choice]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.themeChoice === next));
    });
  }

  function installThemePicker() {
    var headerInner = document.querySelector(".site-header__inner");
    var navToggle = document.querySelector(".nav-toggle");
    if (!headerInner || document.querySelector(".theme-control")) return;

    var wrap = document.createElement("div");
    wrap.className = "theme-control";

    var toggle = document.createElement("button");
    toggle.className = "theme-control__button";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "theme-menu");
    toggle.innerHTML = '<span class="theme-control__dot" aria-hidden="true"></span><span>Change Theme</span>';

    var menu = document.createElement("div");
    menu.className = "theme-menu";
    menu.id = "theme-menu";
    menu.hidden = true;

    var title = document.createElement("p");
    title.className = "theme-menu__title";
    title.textContent = "SUN color system";
    menu.appendChild(title);

    THEMES.forEach(function (theme) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "theme-menu__choice";
      button.dataset.themeChoice = theme.id;
      button.setAttribute("aria-pressed", "false");
      button.innerHTML = '<span class="theme-menu__swatch" aria-hidden="true"></span><span>' + theme.label + '</span>';
      button.querySelector(".theme-menu__swatch").style.background = theme.swatch;
      button.addEventListener("click", function () {
        setTheme(theme.id);
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      });
      menu.appendChild(button);
    });

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
    });

    document.addEventListener("click", function (event) {
      if (!wrap.contains(event.target)) {
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    wrap.appendChild(toggle);
    wrap.appendChild(menu);

    if (navToggle) {
      headerInner.insertBefore(wrap, navToggle);
    } else {
      headerInner.appendChild(wrap);
    }

    setTheme(root.getAttribute("data-theme") || config.defaultTheme || "cobalt");
  }

  installThemePicker();

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
      if (event.key === "Escape") {
        setDrawer(false);
        var themeMenu = document.querySelector(".theme-menu");
        var themeButton = document.querySelector(".theme-control__button");
        if (themeMenu && themeButton) {
          themeMenu.hidden = true;
          themeButton.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();