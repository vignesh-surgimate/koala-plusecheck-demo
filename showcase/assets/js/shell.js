/* Surgimate Framework Portal — shared shell (sidebar, topbar, search, fx)
   Static, dependency-free, GitHub Pages compatible.                       */
(function () {
  'use strict';

  var NAV = [
    { group: 'Overview' },
    { page: 'index.html', title: 'Home & Executive Summary' },
    { page: 'framework-features.html', title: 'Framework Features' },
    { page: 'roadmap.html', title: 'Roadmap & Business Value' },
    { group: 'Architecture' },
    { page: 'architecture.html', title: 'System Architecture' },
    { page: 'execution-flow.html', title: 'Execution Lifecycle' },
    { page: 'data-driven-testing.html', title: 'Data-Driven Testing' },
    { group: 'Coverage' },
    { page: 'browser-matrix.html', title: 'Browser Matrix' },
    { page: 'viewport-strategy.html', title: 'Viewport Strategy' },
    { group: 'Operations' },
    { page: 'docker-architecture.html', title: 'Docker Architecture' },
    { page: 'cicd-pipeline.html', title: 'CI/CD Pipeline ⏳' },
    { page: 'reporting-dashboard.html', title: 'Reporting & Analytics' },
  ];

  var SEARCH = [
    ['Executive summary & KPIs', 'index.html', 'Home'],
    ['Runner Manager — external run control', 'data-driven-testing.html#runner', 'Data-Driven'],
    ['SQL to JSON canonical conversion', 'data-driven-testing.html#sqljson', 'Data-Driven'],
    ['Module dataset pattern', 'data-driven-testing.html#module', 'Data-Driven'],
    ['Credential backend SQLite users table', 'data-driven-testing.html#credentials', 'Data-Driven'],
    ['Layered fixtures dependency injection', 'architecture.html#fixtures', 'Architecture'],
    ['Page Object Model components', 'architecture.html#pom', 'Architecture'],
    ['SOLID compliance', 'architecture.html#solid', 'Architecture'],
    ['Folder structure', 'architecture.html#folders', 'Architecture'],
    ['Execution lifecycle flowchart', 'execution-flow.html', 'Execution'],
    ['Timezone strategy America/New_York ET', 'execution-flow.html#tz', 'Execution'],
    ['Auth setup storage state per role', 'execution-flow.html#auth', 'Execution'],
    ['Chrome Edge Firefox WebKit Safari engines', 'browser-matrix.html', 'Browsers'],
    ['Browser projects and scopes', 'browser-matrix.html#projects', 'Browsers'],
    ['Viewport profiles 1920 1366 iPad Surface', 'viewport-strategy.html', 'Viewports'],
    ['Responsive support tiers', 'viewport-strategy.html#tiers', 'Viewports'],
    ['Viewport sweep with screenshots', 'viewport-strategy.html#sweep', 'Viewports'],
    ['Docker image and compose services', 'docker-architecture.html', 'Docker'],
    ['Scaling model workers and shards', 'docker-architecture.html#scaling', 'Docker'],
    ['GitHub Actions smoke regression workflows', 'cicd-pipeline.html', 'CI/CD'],
    ['Jenkins integration', 'cicd-pipeline.html#others', 'CI/CD'],
    ['Tenant matrix 5 sandboxes 4 roles', 'cicd-pipeline.html#matrix', 'CI/CD'],
    ['HTML Allure summary.json Slack ELK reports', 'reporting-dashboard.html', 'Reporting'],
    ['Action log file reporter ET timestamps', 'reporting-dashboard.html#actionlog', 'Reporting'],
    ['Kibana dashboards flaky leaderboard', 'reporting-dashboard.html#elk', 'Reporting'],
    ['Feature list multi-tenant per-role sessions', 'framework-features.html', 'Features'],
    ['Comparison vs vanilla Playwright vs TestComplete', 'framework-features.html#compare', 'Features'],
    ['Environment strategy staging preprod production', 'execution-flow.html#env', 'Execution'],
    ['Roadmap status next steps', 'roadmap.html', 'Roadmap'],
    ['Business value scalability maintainability', 'roadmap.html#value', 'Roadmap'],
    ['Technology stack TypeScript Playwright SQLite', 'index.html#stack', 'Home'],
    ['Quality gates 0 errors verification', 'index.html#quality', 'Home']
  ];

  function root() {
    // pages in /docs need ../ prefix back to site root
    return location.pathname.replace(/\\/g, '/').indexOf('/docs/') !== -1 ? '../' : '';
  }

  function currentPage() {
    var p = location.pathname.replace(/\\/g, '/').split('/').pop();
    return p === '' ? 'index.html' : p;
  }

  function buildShell() {
    var r = root();
    var cur = currentPage();
    var inDocs = r !== '';

    var aside = document.createElement('aside');
    aside.className = 'sidebar';
    aside.id = 'sidebar';
    var html =
      '<div class="brand"><div class="logo">SP</div><div><div class="t1">Surgimate Playwright Framework</div>' +
      '<div class="t2">Koala PulseCheck</div></div></div><nav>';
    NAV.forEach(function (item) {
      if (item.group) { html += '<div class="group">' + item.group + '</div>'; return; }
      var active = (!inDocs && item.page === cur) || (inDocs && item.page === 'docs/index.html');
      html += '<a href="' + r + item.page + '"' + (active ? ' class="active"' : '') +
        '><span class="dot"></span>' + item.title + '</a>';
    });
    html += '</nav>';
    aside.innerHTML = html;
    document.body.prepend(aside);

    var bar = document.createElement('header');
    bar.className = 'topbar';
    var crumbTitle = (document.querySelector('meta[name="page-title"]') || {}).content || document.title;
    bar.innerHTML =
      '<button class="hamburger" id="navToggle" aria-label="Menu">☰</button>' +
      '<div class="crumb">Surgimate Automation / <b>' + crumbTitle + '</b></div>' +
      '<div class="spacer"></div>' +
      '<button class="searchbtn" id="searchOpen"><span>🔍</span><span class="label">Search the portal…</span><kbd>Ctrl K</kbd></button>';
    document.body.prepend(bar);

    var ov = document.createElement('div');
    ov.className = 'search-overlay';
    ov.id = 'searchOverlay';
    ov.innerHTML =
      '<div class="search-panel"><input id="searchInput" type="text" ' +
      'placeholder="Search features, diagrams, code samples…" autocomplete="off">' +
      '<div class="search-results" id="searchResults"></div></div>';
    document.body.appendChild(ov);

    document.getElementById('navToggle').addEventListener('click', function () {
      aside.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (window.innerWidth <= 980 && aside.classList.contains('open') &&
          !aside.contains(e.target) && e.target.id !== 'navToggle') {
        aside.classList.remove('open');
      }
    });
  }

  /* ── Search ── */
  function initSearch() {
    var ov = document.getElementById('searchOverlay');
    var input = document.getElementById('searchInput');
    var results = document.getElementById('searchResults');
    var r = root();

    function open() { ov.classList.add('open'); input.value = ''; render(''); input.focus(); }
    function close() { ov.classList.remove('open'); }

    function render(q) {
      q = q.trim().toLowerCase();
      var hits = SEARCH.filter(function (e) {
        return !q || e[0].toLowerCase().indexOf(q) !== -1 || e[2].toLowerCase().indexOf(q) !== -1;
      }).slice(0, 12);
      results.innerHTML = hits.length
        ? hits.map(function (e) {
            return '<a href="' + r + e[1] + '">' + e[0] + '<small>' + e[2] + '</small></a>';
          }).join('')
        : '<div class="search-empty">No matches — try "runner", "docker", "viewport"…</div>';
    }

    document.getElementById('searchOpen').addEventListener('click', open);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    input.addEventListener('input', function () { render(input.value); });
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
      if (e.key === 'Escape') close();
    });
  }

  /* ── Animated KPI counters ── */
  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var el = en.target, target = parseFloat(el.dataset.count),
            suffix = el.dataset.suffix || '', dur = 1100, t0 = null;
        function tick(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
          var val = target * eased;
          el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ── Scroll reveal ── */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ── Copy buttons on code blocks ── */
  function initCopy() {
    document.querySelectorAll('pre').forEach(function (pre) {
      var btn = document.createElement('button');
      btn.className = 'copybtn'; btn.textContent = 'COPY';
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(pre.innerText.replace(/^COPY\n?/, '')).then(function () {
          btn.textContent = 'COPIED ✓';
          setTimeout(function () { btn.textContent = 'COPY'; }, 1600);
        });
      });
      pre.appendChild(btn);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildShell(); initSearch(); initCounters(); initReveal(); initCopy();
  });
})();
