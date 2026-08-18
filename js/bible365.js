// 365일 성경 페이지 렌더링
(function () {
  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월",
  ];

  const tabsEl = document.getElementById("month-tabs");
  const listEl = document.getElementById("day-list");
  const progressEl = document.getElementById("month-progress");

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
      btn.addEventListener("click", () => renderMonth(month));
      tabsEl.appendChild(btn);
    });
  }

  function renderMonth(month) {
    renderTabs(month);
    const days = daysInMonth(month);
    listEl.innerHTML = "";

    if (days.length === 0) {
      progressEl.textContent = "";
      const empty = document.createElement("div");
      empty.className = "bible-empty";
      empty.textContent = "이 달의 콘텐츠는 준비 중이에요. 곧 만나요! 📖";
      listEl.appendChild(empty);
      return;
    }

    progressEl.textContent = `${monthNames[month - 1]} · 총 ${days.length}일`;

    days.forEach((d) => {
      const details = document.createElement("details");
      details.className = "bible-day";

      const summary = document.createElement("summary");
      summary.innerHTML = `
        <span class="bible-day-num">Day ${d.day}</span>
        <span class="bible-day-ref">${d.ref}</span>
      `;
      details.appendChild(summary);

      const body = document.createElement("div");
      body.className = "bible-day-body";
      body.innerHTML = `
        <p class="bible-story">${d.story}</p>
      `;
      details.appendChild(body);

      listEl.appendChild(details);
    });
  }

  renderMonth(1);
})();
