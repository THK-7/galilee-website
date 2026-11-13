// Galilee Gateway 공통 스크립트
// 1) 다크/라이트 모드 토글 (localStorage 미사용 - 세션 내 메모리 + 시스템 설정 감지)
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

// 2) 갈릴리교회 브랜드 헤더 · 모바일 메뉴 · 현재 메뉴 표시 · 푸터
//    (공통 스타일시트 css/style.css 를 쓰는 페이지에서만 적용)
(function () {
  const usesSiteCss = !!document.querySelector('link[href$="css/style.css"]');
  if (!usesSiteCss) return;

  const header = document.querySelector("header.site-header");
  const brand = header && header.querySelector(".brand");
  const nav = header && header.querySelector("nav.site-nav");
  const base = (brand && brand.getAttribute("href") || "index.html").replace(/index\.html$/, "");

  // 로고 + 교회 이름
  if (brand && !brand.querySelector(".brand-logo")) {
    const name = brand.textContent.trim() || "Galilee Gateway";
    brand.innerHTML =
      '<img class="brand-logo" src="' + base + 'img/galilee-mark.webp" alt="" width="46" height="31" />' +
      '<span class="brand-text"><span>' + name + '</span><span class="brand-sub">갈릴리교회 Galilee Church</span></span>';
    brand.setAttribute("aria-label", name + " 홈");
  }

  // 현재 페이지 메뉴 표시
  if (nav) {
    const here = location.pathname.split("/").pop() || "index.html";
    const inFJ = /\/following-jesus\//.test(location.pathname);
    nav.querySelectorAll("a").forEach(function (a) {
      const target = (a.getAttribute("href") || "").split("/").pop();
      if (target === here || (inFJ && target === "following-jesus.html")) {
        a.setAttribute("aria-current", "page");
      }
    });
  }

  // 모바일 메뉴 버튼
  if (header && nav && !header.querySelector(".nav-toggle")) {
    nav.id = nav.id || "site-nav";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nav-toggle";
    btn.setAttribute("aria-controls", nav.id);
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "메뉴 열기");
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    nav.parentNode.insertBefore(btn, nav);
    btn.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      }
    });
  }

  // 푸터: 교회 이름과 삼대 목표
  const footWrap = document.querySelector("footer.site-footer .wrap");
  if (footWrap && !footWrap.querySelector(".footer-church")) {
    const div = document.createElement("div");
    div.className = "footer-church";
    div.innerHTML =
      "<strong>갈릴리교회 Galilee Church</strong>" +
      "<span>세계를 교구로 삼는 교회</span>" +
      "<span>말씀을 생활에 적용하는 교회</span>" +
      "<span>날마다 수를 더하는 교회</span>";
    footWrap.insertBefore(div, footWrap.firstChild);
  }
})();

// 3) 공유하기 버튼 (data-share) - 친구에게 소개하기
(function () {
  function toast(msg) {
    let t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("is-show");
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove("is-show"); }, 2200);
  }

  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-share]");
    if (!btn) return;
    e.preventDefault();
    const url = btn.getAttribute("data-share-url") || location.href.split("#")[0];
    const data = {
      title: btn.getAttribute("data-share-title") || document.title,
      text: btn.getAttribute("data-share-text") || "",
      url: url,
    };
    if (navigator.share) {
      navigator.share(data).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(
        function () { toast("링크가 복사되었어요. 친구에게 보내주세요!"); },
        function () { toast(url); }
      );
    } else {
      toast(url);
    }
  });
})();
