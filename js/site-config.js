try {
  var savedTheme = localStorage.getItem("sun-theme");
  if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
} catch (e) {}

window.LAW_SITE_CONFIG = {
  /*
   * profile controls progressive disclosure:
   * "enterprise" = multi-lawyer / multi-office / matters + industries
   * "small"      = solo / two-lawyer friendly navigation and density
   */
  profile: "enterprise",
  brand: "SUN",
  legalName: "Sun, Kim, Diamond & Goldman LLP",
  shortLine: "Technology. Real Estate. Capital. Infrastructure.",
  primaryOffice: "10 Hudson Yards · New York",
  contactEmail: "contact@example.com",
  defaultTheme: "cobalt"
};
