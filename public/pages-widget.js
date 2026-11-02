// Pages widget for the static .html files in public/. Mirrors
// app/_components/PageLinksWidgetMenu.tsx; the link list comes from /api/dev/pages.
// Sits above the bottom edge so it clears reveal.js controls and the slide number.
// Include with: <script src="/pages-widget.js" defer></script>
// (add data-position="left" to dock it bottom-left instead of bottom-right)
(function () {
  if (document.getElementById('pages-widget')) return;
  // data-position="left" moves the widget to the bottom-left corner.
  var left = document.currentScript && document.currentScript.dataset.position === 'left';

  var host = document.createElement('div');
  host.id = 'pages-widget';
  // Shadow DOM keeps the host page's CSS from leaking into the widget (and vice versa).
  var root = host.attachShadow({ mode: 'open' });
  root.innerHTML =
    '<style>' +
    ':host{all:initial}' +
    '.wrap{position:fixed;z-index:2147483000;display:flex;flex-direction:column;' +
    (left ? 'bottom:12px;left:12px;align-items:flex-start;' : 'bottom:80px;right:12px;align-items:flex-end;') +
    'font:600 12px/1.2 system-ui,sans-serif}' +
    '.menu{display:none;margin-bottom:8px;min-width:180px;padding:6px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,.2)}' +
    '.open .menu{display:flex;flex-direction:column;gap:4px}' +
    '.title{padding:4px 12px 0;font-size:10px;letter-spacing:.05em;text-transform:uppercase;color:#9ca3af}' +
    'a{display:block;padding:6px 12px;border-radius:6px;color:#374151;font-weight:500;text-decoration:none}' +
    'a:hover{background:#f3f4f6}' +
    'button{padding:6px 12px;border:0;border-radius:9999px;background:#111827;color:#fff;font:inherit;cursor:pointer;box-shadow:0 0 0 2px rgba(255,255,255,.85),0 4px 6px rgba(0,0,0,.3)}' +
    '</style>' +
    '<div class="wrap"><div class="menu"></div><button type="button" aria-expanded="false">≡ Pages</button></div>';

  var wrap = root.querySelector('.wrap');
  var menu = root.querySelector('.menu');
  var button = root.querySelector('button');
  button.addEventListener('click', function () {
    var open = wrap.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    button.textContent = (open ? '×' : '≡') + ' Pages';
  });

  fetch('/api/dev/pages')
    .then(function (r) { return r.json(); })
    .then(function (groups) {
      groups.forEach(function (g) {
        var title = document.createElement('div');
        title.className = 'title';
        title.textContent = g.title;
        menu.appendChild(title);
        g.links.forEach(function (l) {
          var a = document.createElement('a');
          a.href = l.href;
          a.textContent = l.label;
          if (g.external) { a.target = '_blank'; a.rel = 'noreferrer'; }
          menu.appendChild(a);
        });
      });
      document.body.appendChild(host);
    })
    .catch(function () { /* widget is a dev convenience; stay hidden on failure */ });
})();
