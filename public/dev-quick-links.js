// DevQuickLinks for the static .html files in public/. Mirrors
// app/_components/DevQuickLinksMenu.tsx; the link list comes from /api/dev/quick-links.
// Include with: <script src="/dev-quick-links.js" defer></script>
(function () {
  if (document.getElementById('dev-quick-links')) return;

  var host = document.createElement('div');
  host.id = 'dev-quick-links';
  // Shadow DOM keeps the host page's CSS from leaking into the widget (and vice versa).
  var root = host.attachShadow({ mode: 'open' });
  root.innerHTML =
    '<style>' +
    ':host{all:initial}' +
    '.wrap{position:fixed;z-index:2147483000;bottom:12px;left:12px;display:flex;flex-direction:column;align-items:flex-start;font:500 12px/1.2 system-ui,sans-serif}' +
    '.menu{display:none;margin-bottom:8px;min-width:148px;max-height:70vh;overflow-y:auto;padding:6px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 20px 25px -5px rgba(0,0,0,.2)}' +
    '.open .menu{display:flex;flex-direction:column;gap:2px}' +
    '.title{padding:6px 12px 2px;font-size:10px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#9ca3af}' +
    'a{display:block;padding:6px 12px;border-radius:6px;color:#374151;text-decoration:none}' +
    'a:hover{background:#f3f4f6}' +
    'button{width:28px;height:28px;padding:0;border:0;border-radius:50%;overflow:hidden;cursor:pointer;background:none;box-shadow:0 4px 6px rgba(0,0,0,.3);transition:transform .15s}' +
    'button:hover{transform:scale(1.1)}' +
    'button:focus-visible{outline:2px solid #4ade80;outline-offset:2px}' +
    'img{display:block;width:100%;height:100%;object-fit:cover}' +
    '</style>' +
    '<div class="wrap"><div class="menu"></div>' +
    '<button type="button" title="Quick links" aria-expanded="false">' +
    '<img src="https://media.ffycdn.net/eu/episerver/YKPBoHJ87Gba79trvfkP.png?width=28" alt="Optimizely quick links" width="28" height="28">' +
    '</button></div>';

  var wrap = root.querySelector('.wrap');
  var menu = root.querySelector('.menu');
  var button = root.querySelector('button');
  button.addEventListener('click', function () {
    var open = wrap.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });

  fetch('/api/dev/quick-links')
    .then(function (r) { return r.json(); })
    .then(function (groups) {
      groups.forEach(function (g) {
        if (groups.length > 1) {
          var title = document.createElement('div');
          title.className = 'title';
          title.textContent = g.title;
          menu.appendChild(title);
        }
        g.links.forEach(function (l) {
          var a = document.createElement('a');
          a.href = l.href;
          a.textContent = l.label;
          menu.appendChild(a);
        });
      });
      document.body.appendChild(host);
    })
    .catch(function () { /* widget is a dev convenience; stay hidden on failure */ });
})();
