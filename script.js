(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Theme toggle (remembers the choice; falls back to the system setting)
  var toggle = document.querySelector('.theme-toggle');
  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // Nav: glass background once scrolled, mobile menu
  var nav = document.querySelector('.nav');
  var menuBtn = document.querySelector('.menu-toggle');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    document.querySelectorAll('.nav__menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    document.addEventListener('click', function (e) { if (!nav.contains(e.target)) setMenu(false); });
  }

  // Active section in nav
  var links = document.querySelectorAll('.nav__menu a');
  var sections = Array.prototype.map.call(links, function (a) { return document.querySelector(a.getAttribute('href')); });
  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 10);
    var mid = window.innerHeight * 0.4, active = -1;
    sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= mid) active = i; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = sections.length - 1;
    links.forEach(function (a, i) { a.classList.toggle('is-active', i === active); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Projects carousel: arrows, progress bar and filters
  var track = document.getElementById('project-track');
  if (track) {
    var cards = Array.prototype.slice.call(track.querySelectorAll('.pcard'));
    var btns = document.querySelectorAll('.carousel__btn');
    var bar = document.querySelector('.carousel__progress i');
    function updateCarousel() {
      var max = track.scrollWidth - track.clientWidth;
      var x = track.scrollLeft;
      btns.forEach(function (b) {
        var dir = +b.dataset.dir;
        b.disabled = max <= 2 || (dir < 0 ? x <= 2 : x >= max - 2);
      });
      if (bar) {
        var w = track.scrollWidth ? Math.min(track.clientWidth / track.scrollWidth, 1) * 100 : 100;
        bar.style.setProperty('--w', w + '%');
        bar.style.setProperty('--x', (max > 0 ? (x / max) * (100 - w) : 0) + '%');
      }
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var first = cards.filter(function (c) { return !c.hidden; })[0];
        var step = first ? first.getBoundingClientRect().width + 20 : track.clientWidth;
        var per = Math.max(1, Math.round(track.clientWidth / step));
        track.scrollBy({ left: +b.dataset.dir * step * per, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });
    track.addEventListener('scroll', updateCarousel, { passive: true });
    window.addEventListener('resize', updateCarousel);

    var filters = document.querySelectorAll('.filter');
    filters.forEach(function (f) {
      f.addEventListener('click', function () {
        filters.forEach(function (o) { o.setAttribute('aria-pressed', String(o === f)); });
        var tag = f.dataset.filter;
        cards.forEach(function (c) {
          c.hidden = tag !== 'all' && c.dataset.tags.split(' ').indexOf(tag) === -1;
        });
        track.scrollTo({ left: 0, behavior: 'auto' });
        updateCarousel();
      });
    });
    updateCarousel();

    // Project details dialog
    var dlg = document.getElementById('project-dialog');
    var dlgContent = dlg && dlg.querySelector('.dlg__content');
    function closeDialog() { if (dlg.open) dlg.close(); }
    if (dlg && typeof dlg.showModal === 'function') {
      cards.forEach(function (card) {
        var open = card.querySelector('.pcard__open');
        var tpl = card.querySelector('.pcard__details');
        if (!open || !tpl) return;
        open.setAttribute('aria-haspopup', 'dialog');
        open.addEventListener('click', function () {
          dlgContent.replaceChildren(tpl.content.cloneNode(true));
          var title = dlgContent.querySelector('.dlg__title');
          if (title) title.id = 'dlg-title';
          dlg.showModal();
          root.classList.add('has-dialog');
          dlgContent.scrollTop = 0;
        });
      });
      dlg.querySelector('.dlg__close').addEventListener('click', closeDialog);
      dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDialog(); });
      dlg.addEventListener('close', function () { root.classList.remove('has-dialog'); });
    } else {
      // Very old browsers: no dialog, so the card title is plain text
      document.querySelectorAll('.pcard__hint').forEach(function (h) { h.hidden = true; });
    }
  }
})();
