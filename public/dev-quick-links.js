/*
 * Quick-links menu for the static pages in public/.
 *
 * The same collapsible tree as app/_components/DevQuickLinksMenu.tsx, as plain
 * JavaScript because these pages are served as-is and can't render React.
 * Add it to a page with:  <script src="/dev-quick-links.js" defer></script>
 * The page list comes from /api/dev-links, so new pages show up on their own.
 * It renders inside a shadow root so the page's own CSS can't affect it.
 * If you change the look or tree rules here, change the React component too.
 */
(function () {
  'use strict';
  if (window.__devQuickLinks) return;
  window.__devQuickLinks = true;

  var ICON = 'https://media.ffycdn.net/eu/episerver/YKPBoHJ87Gba79trvfkP.png?width=28';

  var CSS = [
    ':host{all:initial}',
    '.wrap{position:fixed;bottom:12px;left:64px;z-index:2147483000;display:flex;flex-direction:column;align-items:flex-start;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}',
    '.panel{margin-bottom:8px;max-height:70vh;min-width:180px;max-width:280px;overflow-y:auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:6px;box-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1)}',
    '.panel[hidden]{display:none}',
    'ul{list-style:none;margin:0;padding:0}',
    '.row{display:flex;align-items:center;gap:4px;width:100%;box-sizing:border-box;border:0;background:none;border-radius:6px;padding:6px 12px 6px 8px;font-weight:500;font-size:12px;line-height:16px;font-family:inherit;color:#374151;text-align:left;text-decoration:none;cursor:pointer}',
    '.row:hover{background:#f3f4f6}',
    '.row.folder{color:#6b7280}',
    '.row.active{background:#f3f4f6;font-weight:600}',
    '.row.split{padding-top:0;padding-bottom:0}',
    '.label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:6px 0;color:inherit;text-decoration:none}',
    '.toggle{display:flex;align-items:center;justify-content:center;width:16px;height:24px;flex:none;border:0;background:none;padding:0;cursor:pointer}',
    '.sep{height:0;border-top:1px solid #f3f4f6;margin:4px 8px}',
    '.spacer{width:16px;flex:none}',
    '.chev{width:12px;height:12px;flex:none;color:#9ca3af;transition:transform .15s}',
    '.open>.chev,.open .chev{transform:rotate(90deg)}',
    '.fab{width:28px;height:28px;border:0;padding:0;border-radius:50%;overflow:hidden;cursor:pointer;box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1);transition:transform .15s}',
    '.fab:hover{transform:scale(1.1)}',
    '.fab:focus-visible{outline:2px solid #4ade80;outline-offset:2px}',
    '.fab img{display:block;width:100%;height:100%;object-fit:cover}',
  ].join('');

  function toLabel(segment) {
    return segment.replace(/[-_]+/g, ' ').replace(/\b\w/g, function (c) {
      return c.toUpperCase();
    });
  }

  // Same tree rules as the React menu: path segments become folders; with more
  // than one group, each group is a top-level folder.
  function buildTree(links) {
    var groups = [];
    var byName = {};
    links.forEach(function (link) {
      var groupName = link.group || 'Pages';
      var group = byName[groupName];
      if (!group) {
        group = byName[groupName] = { key: 'g:' + groupName, label: groupName, children: [] };
        groups.push(group);
      }
      var parent = group;
      var segments = link.href.split('/').filter(Boolean);
      segments.forEach(function (raw, i) {
        var segment = raw;
        try {
          segment = decodeURIComponent(raw);
        } catch (e) {
          /* keep the raw segment */
        }
        var key = parent.key + '/' + segment;
        var node = parent.children.filter(function (c) {
          return c.key === key;
        })[0];
        if (!node) {
          node = { key: key, label: toLabel(segment.replace(/\.html?$/i, '')), children: [] };
          parent.children.push(node);
        }
        if (i === segments.length - 1) {
          node.link = link;
          node.label = link.label;
        }
        parent = node;
      });
    });
    if (groups.length > 1) return groups;
    return groups.reduce(function (all, g) {
      return all.concat(g.children);
    }, []);
  }

  function containsPath(node, pathname) {
    return (
      (node.link && node.link.href === pathname) ||
      node.children.some(function (c) {
        return containsPath(c, pathname);
      })
    );
  }

  var SVG_NS = 'http://www.w3.org/2000/svg';
  function chevron() {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 12 12');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'chev');
    var p = document.createElementNS(SVG_NS, 'path');
    p.setAttribute('d', 'M4 2.5 8 6 4 9.5');
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', 'currentColor');
    p.setAttribute('stroke-width', '1.5');
    p.setAttribute('stroke-linecap', 'round');
    p.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(p);
    return svg;
  }

  function homeIcon() {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 12 12');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'chev');
    var p = document.createElementNS(SVG_NS, 'path');
    p.setAttribute('d', 'M1.5 6 6 2l4.5 4M2.75 5.25V10h2.5V7.5h1.5V10h2.5V5.25');
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', 'currentColor');
    p.setAttribute('stroke-width', '1.2');
    p.setAttribute('stroke-linecap', 'round');
    p.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(p);
    return svg;
  }

  function el(tag, cls) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }

  function render(links) {
    var pathname = location.pathname;
    var tree = buildTree(links);
    var expanded = {};
    (function expandToCurrent(nodes) {
      nodes.forEach(function (n) {
        if (n.children.length && containsPath(n, pathname)) {
          expanded[n.key] = true;
          expandToCurrent(n.children);
        }
      });
    })(tree);

    var host = document.createElement('div');
    host.id = 'dev-quick-links';
    var root = host.attachShadow({ mode: 'open' });
    var style = document.createElement('style');
    style.textContent = CSS;
    var wrap = el('div', 'wrap');
    var panel = el('div', 'panel');
    panel.hidden = true;
    var fab = el('button', 'fab');
    fab.type = 'button';
    fab.title = 'Quick links';
    var img = document.createElement('img');
    img.src = ICON;
    img.alt = 'Optimizely quick links';
    img.width = 28;
    img.height = 28;
    fab.appendChild(img);
    wrap.appendChild(panel);
    wrap.appendChild(fab);
    root.appendChild(style);
    root.appendChild(wrap);

    function closePanel() {
      panel.hidden = true;
    }

    function paint() {
      panel.textContent = '';
      var home = el('a', 'row' + (pathname === '/' ? ' active' : ''));
      home.href = '/';
      home.appendChild(homeIcon());
      home.appendChild(document.createTextNode('Home'));
      home.addEventListener('click', closePanel);
      panel.appendChild(home);
      panel.appendChild(el('div', 'sep'));
      var ul = document.createElement('ul');
      tree.forEach(function (n) {
        ul.appendChild(item(n, 0));
      });
      panel.appendChild(ul);
    }

    function toggle(key) {
      if (expanded[key]) delete expanded[key];
      else expanded[key] = true;
      paint();
    }

    function item(node, depth) {
      var li = document.createElement('li');
      var isOpen = !!expanded[node.key];
      var hasChildren = node.children.length > 0;
      var pad = 8 + depth * 12;
      var link = node.link;
      // Only same-site paths are ever turned into links.
      var safeHref = link && /^\/(?!\/)/.test(link.href) ? link.href : null;

      if (!safeHref) {
        var btn = el('button', 'row folder' + (isOpen ? ' open' : ''));
        btn.type = 'button';
        btn.style.paddingLeft = pad + 'px';
        btn.setAttribute('aria-expanded', String(isOpen));
        btn.appendChild(chevron());
        btn.appendChild(document.createTextNode(node.label));
        btn.addEventListener('click', function () {
          toggle(node.key);
        });
        li.appendChild(btn);
      } else {
        var row = el('div', 'row split' + (safeHref === pathname ? ' active' : ''));
        row.style.paddingLeft = pad + 'px';
        if (hasChildren) {
          var t = el('button', 'toggle' + (isOpen ? ' open' : ''));
          t.type = 'button';
          t.setAttribute('aria-expanded', String(isOpen));
          t.setAttribute('aria-label', (isOpen ? 'Collapse ' : 'Expand ') + node.label);
          t.appendChild(chevron());
          t.addEventListener('click', function () {
            toggle(node.key);
          });
          row.appendChild(t);
        } else {
          row.appendChild(el('span', 'spacer'));
        }
        var a = el('a', 'label');
        a.href = safeHref;
        a.textContent = node.label;
        if (link.isStatic) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
        a.addEventListener('click', closePanel);
        row.appendChild(a);
        li.appendChild(row);
      }

      if (hasChildren && isOpen) {
        var sub = document.createElement('ul');
        node.children.forEach(function (c) {
          sub.appendChild(item(c, depth + 1));
        });
        li.appendChild(sub);
      }
      return li;
    }

    fab.addEventListener('click', function () {
      panel.hidden = !panel.hidden;
    });
    paint();
    document.body.appendChild(host);
  }

  function start() {
    fetch('/api/dev-links', { headers: { Accept: 'application/json' } })
      .then(function (r) {
        return r.ok ? r.json() : [];
      })
      .then(function (links) {
        if (Array.isArray(links) && links.length) render(links);
      })
      .catch(function () {
        /* menu is a convenience; stay silent if the API isn't reachable */
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
