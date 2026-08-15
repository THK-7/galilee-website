// 다크/라이트 모드 토글 (localStorage 미사용 - 세션 내 메모리 + 시스템 설정 감지)
(function () {
  const root = document.documentElement;
  const toggleBtn = document.getElementById("theme-toggle");

  function getPreferredTheme() {
    const stored = window.__theme;
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    window.__theme = theme;
    if (toggleBtn) {
      toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
    }
  }

  applyTheme(getPreferredTheme());

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      const current = root.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }
})();
