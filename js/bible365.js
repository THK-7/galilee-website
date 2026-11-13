// 365일 성경 페이지 렌더링
// - 처음 열면 오늘 날짜가 있는 달을 보여주고, 오늘 말씀을 펼쳐 둡니다.
// - 주소 끝에 #today 또는 #d-월-일 (예: #d-11-13) 을 붙이면 그 날로 바로 이동합니다.
(function () {
  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월",
  ];

  const tabsEl = document.getElementById("month-tabs");
  const listEl = document.getElementById("day-list");
  const progressEl = document.getElementById("month-progress");

  const now = new Date();
  const todayM = now.getMonth() + 1;
  const todayD = now.getDate();

  function daysInMonth(month) {
    return bibleDays.filter((d) => d.month === month);
  }

  function renderTabs(activeMonth) {
    tabsEl.innerHTML = "";
    monthNames.forEach((name, i) => {
      const month = i + 1;
      const hasContent = daysInMonth(month).length > 0;
      const btn = document.createElement("button");
      btn.className = "month-tab" + (month === activeMonth ? " active" : "");
      btn.textContent = name;
      btn.disabled = !hasContent;
      if (month === activeMonth) btn.setAttribute("aria-pressed", "true");
      btn.addEventListener("click", () => {
        renderMonth(month);
        if (history.replaceState) history.replaceState(null, "", "#m-" + month);
      });
      tabsEl.appendChild(btn);
    });
  }

  function renderMonth(month, openDay) {
    renderTabs(month);
    const days = daysInMonth(month);
    listEl.innerHTML = "";

    if (days.length === 0) {
      progressEl.textContent = "";
      const empty = document.createElement("div");
      empty.className = "bible-empty";
      empty.textContent = "이 달의 콘텐츠는 준비 중이에요. 곧 만나요! 📖";
      listEl.appendChild(empty);
      return null;
    }

    progressEl.textContent = `${monthNames[month - 1]} · 총 ${days.length}일`;

    let target = null;
    days.forEach((d) => {
      const details = document.createElement("details");
      details.className = "bible-day";
      details.id = `d-${d.month}-${d.day}`;
      const isToday = d.month === todayM && d.day === todayD;
      if (isToday) details.classList.add("is-today");

      const summary = document.createElement("summary");
      summary.innerHTML = `
        <span class="bible-day-num">Day ${d.day}</span>
        <span class="bible-day-ref">${d.ref}</span>
        ${isToday ? '<span class="bible-today-badge">오늘</span>' : ""}
      `;
      details.appendChild(summary);

      const body = document.createElement("div");
      body.className = "bible-day-body";
      body.innerHTML = `
        <p class="bible-story">${d.story}</p>
      `;
      details.appendChild(body);

      if (openDay && d.day === openDay) {
        details.open = true;
        target = details;
      }
      listEl.appendChild(details);
    });
    return target;
  }

  function fromHash() {
    const h = (location.hash || "").replace("#", "");
    let m = null, d = null;
    let scroll = false;
    if (h === "today") { m = todayM; d = todayD; scroll = true; }
    let r = h.match(/^d-(\d{1,2})-(\d{1,2})$/);
    if (r) { m = +r[1]; d = +r[2]; scroll = true; }
    r = h.match(/^m-(\d{1,2})$/);
    if (r) { m = +r[1]; }
    if (!m || m < 1 || m > 12 || daysInMonth(m).length === 0) {
      m = daysInMonth(todayM).length ? todayM : 1;
      d = m === todayM ? todayD : null;
    }
    return { m, d, scroll };
  }

  const start = fromHash();
  const target = renderMonth(start.m, start.d);
  if (target && start.scroll) {
    setTimeout(() => target.scrollIntoView({ block: "center" }), 50);
  }

  window.addEventListener("hashchange", () => {
    const s = fromHash();
    const t = renderMonth(s.m, s.d);
    if (t && s.scroll) t.scrollIntoView({ block: "center", behavior: "smooth" });
  });
})();
