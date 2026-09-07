(() => {
  const root = document.documentElement;

  // Website প্রতিবার white theme দিয়ে শুরু হবে
  root.removeAttribute("data-theme");

  const setupThemeSwitch = () => {
    const button = document.getElementById("themeSwitch");
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    if (!button) return;

    const applyTheme = (isDark) => {
      if (isDark) {
        root.setAttribute("data-theme", "dark");
      } else {
        root.removeAttribute("data-theme");
      }

      button.setAttribute("aria-pressed", String(isDark));

      button.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );

      if (themeMeta) {
        themeMeta.setAttribute(
          "content",
          isDark ? "#1b1f24" : "#e9edf2"
        );
      }
    };

    // Default theme: white
    applyTheme(false);

    button.addEventListener("click", () => {
      const isCurrentlyDark =
        root.getAttribute("data-theme") === "dark";

      applyTheme(!isCurrentlyDark);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      setupThemeSwitch,
      { once: true }
    );
  } else {
    setupThemeSwitch();
  }
})();
