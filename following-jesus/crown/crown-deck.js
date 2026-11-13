/* Crown Him with Many Crowns — PowerPoint-style slide viewer */
(function () {
  var deck = document.getElementById('deck');
  if (!deck) return;
  var week = deck.getAttribute('data-week');
  var count = parseInt(deck.getAttribute('data-count'), 10);
  var stage = document.getElementById('deck-stage');
  var img = document.getElementById('deck-img');
  var counter = document.getElementById('deck-count');
  var thumbsBox = document.getElementById('deck-thumbs');
  var thumbs = thumbsBox.querySelectorAll('.deck-thumb');
  var allBox = document.getElementById('deck-all');
  var modeBtn = document.getElementById('deck-mode');
  var fullBtn = document.getElementById('deck-full');
  var prevs = deck.querySelectorAll('.deck-prev');
  var nexts = deck.querySelectorAll('.deck-next');
  var cur = 1;

  function src(i) { return 'crown/w' + week + '-' + (i < 10 ? '0' : '') + i + '.webp'; }

  function preload(i) {
    if (i >= 1 && i <= count) { var p = new Image(); p.src = src(i); }
  }

  function go(i, fromHash) {
    if (i < 1 || i > count) return;
    cur = i;
    img.src = src(i);
    img.alt = 'Week ' + parseInt(week, 10) + ' 슬라이드 ' + i;
    counter.textContent = i + ' / ' + count;
    for (var k = 0; k < thumbs.length; k++) {
      thumbs[k].classList.toggle('is-active', k === i - 1);
    }
    var t = thumbs[i - 1];
    if (t) {
      var left = t.offsetLeft - thumbsBox.clientWidth / 2 + t.clientWidth / 2;
      thumbsBox.scrollTo({ left: left, behavior: 'smooth' });
    }
    for (var a = 0; a < prevs.length; a++) prevs[a].disabled = i === 1;
    for (var b = 0; b < nexts.length; b++) nexts[b].disabled = i === count;
    preload(i + 1); preload(i - 1);
    if (!fromHash && history.replaceState) history.replaceState(null, '', '#' + i);
  }

  for (var a = 0; a < prevs.length; a++) prevs[a].addEventListener('click', function () { go(cur - 1); });
  for (var b = 0; b < nexts.length; b++) nexts[b].addEventListener('click', function () { go(cur + 1); });
  for (var k = 0; k < thumbs.length; k++) {
    thumbs[k].addEventListener('click', function () { go(parseInt(this.getAttribute('data-i'), 10)); });
  }

  function isAll() { return deck.classList.contains('is-all'); }

  document.addEventListener('keydown', function (e) {
    if (isAll()) return;
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && document.fullscreenElement)) { e.preventDefault(); go(cur + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(cur - 1); }
    else if (e.key === 'Home') { go(1); }
    else if (e.key === 'End') { go(count); }
  });

  // Swipe
  var sx = null, sy = null;
  stage.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    var dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? cur + 1 : cur - 1);
    sx = sy = null;
  });

  // Click on slide body (not arrows) advances, like a presentation
  img.addEventListener('click', function () { go(cur + 1); });

  // All-slides mode
  modeBtn.addEventListener('click', function () {
    var on = !isAll();
    deck.classList.toggle('is-all', on);
    allBox.hidden = !on;
    modeBtn.textContent = on ? '슬라이드쇼로 보기' : '모두 보기';
    if (!on) stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Fullscreen
  var canFull = stage.requestFullscreen || stage.webkitRequestFullscreen;
  if (!canFull) { fullBtn.hidden = true; }
  fullBtn.addEventListener('click', function () {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } else {
      canFull.call(stage);
    }
  });

  var start = parseInt((location.hash || '').replace('#', ''), 10);
  go(start >= 1 && start <= count ? start : 1, true);
})();
