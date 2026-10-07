(function () {
  "use strict";

  var config = window.LAW_SITE_CONFIG || {};
  var root = document.documentElement;
  var profile = config.profile === "small" ? "small" : "enterprise";
  root.setAttribute("data-firm-profile", profile);

  document.querySelectorAll("[data-brand]").forEach(function (el) {
    el.textContent = config.brand || "LAW";
  });
  // The SUN* wordmark is an image. A reused template with another brand name falls back to text.
  if (config.brand && config.brand !== "SUN") {
    document.querySelectorAll("[data-wordmark]").forEach(function (el) {
      el.classList.remove("wordmark", "wordmark--hero");
      el.removeAttribute("role");
      el.removeAttribute("aria-label");
      el.textContent = config.brand;
    });
  }
  document.querySelectorAll("[data-legal-name]").forEach(function (el) {
    el.textContent = config.legalName || "Law Firm LLP";
  });
  document.querySelectorAll("[data-primary-office]").forEach(function (el) {
    el.textContent = profile === "small"
      ? (config.smallPrimaryOffice || config.primaryOffice || "")
      : (config.primaryOffice || "");
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

    // Small-profile preview: a Seoul-led, one-lawyer technology boutique.
    // The enterprise profile remains the production default.
    document.querySelectorAll(".people-grid").forEach(function (grid) {
      Array.from(grid.children).slice(1).forEach(function (card) {
        card.remove();
      });
    });

    document.querySelectorAll(".practice-grid").forEach(function (grid) {
      Array.from(grid.children).slice(4).forEach(function (card) {
        card.remove();
      });
    });

    var featuredHeading = document.getElementById("featured-heading");
    if (featuredHeading) {
      var featuredSection = featuredHeading.closest("section");
      if (featuredSection) featuredSection.hidden = true;
    }

    var peopleHeading = document.getElementById("people-heading");
    if (peopleHeading) peopleHeading.textContent = "Will Sun";

    var heroStatement = document.querySelector(".hero__statement .lede");
    if (heroStatement) {
      heroStatement.textContent = "Cross-border technology counsel from Seoul to the Pacific.";
    }

    var heroTopline = document.querySelector(".hero__topline");
    if (heroTopline && !heroTopline.querySelector(".small-profile-location")) {
      var smallOffice = document.createElement("p");
      smallOffice.className = "hero__location small-profile-location";
      smallOffice.innerHTML = "Asia-Pacific Headquarters<br><span>Parc.1 Tower 1 · Seoul</span>";
      heroTopline.appendChild(smallOffice);
    }

    var peoplePageHero = document.querySelector("body .page-hero .section-title");
    if (peoplePageHero && /People/i.test(document.title)) {
      peoplePageHero.textContent = "Will Sun";
    }

    if (/People/i.test(document.title)) {
      document.querySelectorAll(".section--dark").forEach(function (section) {
        if (section.textContent.indexOf("One lawyer or one hundred") !== -1) section.hidden = true;
      });
    }

    if (/About/i.test(document.title)) {
      var aboutCopy = document.querySelector(".page-hero__copy");
      if (aboutCopy) {
        aboutCopy.textContent = "Will Sun leads a Seoul-headquartered cross-border technology practice focused on AI infrastructure, semiconductors, venture capital, transactions, and market expansion.";
      }
      var combination = Array.from(document.querySelectorAll("main > .section")).find(function (section) {
        return section.textContent.indexOf("Sun & Kim understood the technology") !== -1;
      });
      if (combination) combination.hidden = true;
    }

    if (/Locations/i.test(document.title)) {
      var locationHeroCopy = document.querySelector(".page-hero__copy");
      if (locationHeroCopy) {
        locationHeroCopy.textContent = "A Seoul-headquartered technology practice with West Coast and Pacific reach.";
      }

      var locationsIntro = document.querySelector(".locations-intro");
      if (locationsIntro) {
        var introEyebrow = locationsIntro.querySelector(".eyebrow");
        var introTitle = locationsIntro.querySelector(".section-title");
        var introCopy = locationsIntro.querySelector(".copy");
        if (introEyebrow) introEyebrow.textContent = "Asia-Pacific platform";
        if (introTitle) introTitle.textContent = "Seoul at the center. Pacific reach.";
        if (introCopy) introCopy.textContent = "Seoul serves as headquarters, with Los Angeles and Honolulu extending the practice across the West Coast and Pacific.";
      }

      var gallery = document.querySelector(".location-gallery");
      if (gallery) {
        gallery.hidden = false;
        var cards = Array.from(gallery.querySelectorAll(".location-card"));
        cards.forEach(function (card) {
          var city = (card.querySelector(".location-card__city") || {}).textContent || "";
          var keep = /Seoul|Los Angeles|Honolulu/i.test(city);
          if (!keep) {
            card.remove();
            return;
          }
          card.hidden = false;
          card.classList.remove("location-card--small-featured");
          if (/Seoul/i.test(city)) card.classList.add("location-card--small-featured");
        });
      }
    }
  }


  // Keep profile preview state when navigating between pages.
  // Without this, clicking People/Practices/Locations silently falls back to enterprise.
  (function preserveProfilePreviewLinks() {
    var requestedProfile = null;
    try {
      requestedProfile = new URLSearchParams(window.location.search).get("profile");
    } catch (e) {}

    if (requestedProfile !== "small" && requestedProfile !== "enterprise") return;

    document.querySelectorAll('a[href]').forEach(function (link) {
      var rawHref = link.getAttribute("href");
      if (!rawHref || rawHref.charAt(0) === "#" || /^(mailto:|tel:|javascript:)/i.test(rawHref)) return;

      try {
        var target = new URL(rawHref, window.location.href);
        if (target.origin !== window.location.origin) return;

        target.searchParams.set("profile", requestedProfile);

        // Keep project-relative links readable instead of replacing them with absolute URLs.
        link.setAttribute("href", target.pathname.split("/").pop() + target.search + target.hash);
      } catch (e) {}
    });
  })();

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
    toggle.setAttribute("aria-label", "Change theme");
    toggle.innerHTML = '<span class="theme-control__dot" aria-hidden="true"></span><span class="theme-control__label theme-control__label--full">Change Theme</span><span class="theme-control__label theme-control__label--short" aria-hidden="true">Theme</span>';

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

  // Mark the current page in the header nav and the mobile drawer.
  (function markCurrentPage() {
    var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".nav__link, .nav-drawer__link").forEach(function (link) {
      var target = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
      if (target && target === here) link.setAttribute("aria-current", "page");
    });
  })();

  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.querySelector(".nav-drawer");
  var closeBtn = document.querySelector(".nav-drawer__close");

  function setDrawer(open) {
    if (!toggle || !drawer) return;
    toggle.setAttribute("aria-expanded", String(open));
    drawer.hidden = !open;
    if (!drawer.hasAttribute("tabindex")) drawer.setAttribute("tabindex", "-1");
    drawer.dataset.open = String(open);
    document.body.classList.toggle("drawer-open", open);
    if (open) {
      drawer.focus({ preventScroll: true });
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