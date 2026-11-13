// Galilee Gateway 공통 스크립트

// 1) 공통 헤더와 메인 메뉴 (모든 페이지에서 같은 메뉴를 보여줍니다)
(function () {
  const MENU = [
    { href: "index.html", label: "홈" },
    { href: "bible365.html", label: "365일 성경" },
    { href: "following-jesus/crown-him-with-many-crowns.html", label: "영어예배 슬라이드", match: /crown-/ },
    { href: "following-jesus.html", label: "Following Jesus", match: /following-jesus/ },
    { href: "biblequiz.html", label: "성경퀴즈" },
    { href: "bibleoverview.html", label: "성경총론" },
    { href: "joshua.html", label: "여호수아서" },
    { href: "about.html", label: "갈릴리교회 소개" },
  ];

  const header = document.querySelector("header.site-header");
  if (!header) return;

  const oldBrand = header.querySelector(".brand");
  const base = ((oldBrand && oldBrand.getAttribute("href")) || "index.html").replace(/index\.html$/, "");

  // 공통 헤더 스타일 불러오기 (자체 스타일을 쓰는 페이지 포함)
  const hasHeaderCss =
    document.querySelector('link[href$="css/style.css"]') ||
    document.querySelector('link[href$="css/header.css"]');
  if (!hasHeaderCss) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = base + "css/header.css";
    document.head.appendChild(link);
  }

  if (!header.querySelector(".gg-top")) {
    let toggle = header.querySelector("#theme-toggle");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.id = "theme-toggle";
    }
    toggle.setAttribute("aria-label", "밝은/어두운 화면 전환");

    const top = document.createElement("div");
    top.className = "gg-top";
    top.innerHTML =
      '<a href="' + base + 'index.html" class="brand" aria-label="Galilee Gateway 홈">' +
      '<img class="brand-logo" src="' + base + 'img/galilee-mark.webp" alt="" width="52" height="37" />' +
      '<span class="brand-text"><span class="brand-name">Galilee Gateway</span>' +
      '<span class="brand-sub">갈릴리교회 Galilee Church</span></span></a>';
    top.appendChild(toggle);

    const nav = document.createElement("nav");
    nav.className = "site-nav";
    nav.setAttribute("aria-label", "주 메뉴");
    const list = document.createElement("div");
    list.className = "gg-menu";
    MENU.forEach(function (item) {
      const a = document.createElement("a");
      a.href = base + item.href;
      a.textContent = item.label;
      a.dataset.key = item.href;
      list.appendChild(a);
    });
    nav.appendChild(list);

    header.innerHTML = "";
    header.appendChild(top);
    header.appendChild(nav);
  }

  // 현재 메뉴 표시
  const path = location.pathname;
  const file = path.split("/").pop() || "index.html";
  let current = null;
  header.querySelectorAll("nav.site-nav a").forEach(function (a) {
    const key = a.dataset.key || a.getAttribute("href").replace(/^(\.\.\/)+/, "");
    const item = MENU.find(function (m) { return m.href === key; });
    if (!current && item && item.match && item.match.test(path)) current = a;
    if (!current && key.split("/").pop() === file) current = a;
  });
  if (current) {
    current.setAttribute("aria-current", "page");
    const list = current.parentNode;
    if (list.scrollWidth > list.clientWidth) {
      list.scrollLeft = Math.max(0, current.offsetLeft - 24);
    }
  }
})();

// 2) 다크/라이트 모드 토글 (localStorage 미사용 - 세션 내 메모리 + 시스템 설정 감지)
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

// 3) 푸터: 교회 이름과 삼대 목표
(function () {
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

// 4) 공유하기 버튼 (data-share) - 친구에게 소개하기
(function () {
  function toast(msg) {
    let t = document.querySelector(".gg-toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "gg-toast";
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
