// Device Preview Toggle - floating bottom-left
// Detects real mobile devices and hides toggle (no point on a real phone)
(function() {
  var hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  var isNarrow = window.innerWidth < 768;
  if (hasTouch && isNarrow) return;

  if (new URLSearchParams(window.location.search).get('embedded') === 'true') return;

  var mode = 'desktop';

  function svgIcon(type) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    if (type === 'desktop') {
      var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      r.setAttribute('x', '2'); r.setAttribute('y', '3'); r.setAttribute('width', '20'); r.setAttribute('height', '14'); r.setAttribute('rx', '2');
      var l1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l1.setAttribute('x1', '8'); l1.setAttribute('y1', '21'); l1.setAttribute('x2', '16'); l1.setAttribute('y2', '21');
      var l2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l2.setAttribute('x1', '12'); l2.setAttribute('y1', '17'); l2.setAttribute('x2', '12'); l2.setAttribute('y2', '21');
      svg.appendChild(r); svg.appendChild(l1); svg.appendChild(l2);
    } else {
      var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      r.setAttribute('x', '5'); r.setAttribute('y', '2'); r.setAttribute('width', '14'); r.setAttribute('height', '20'); r.setAttribute('rx', '2');
      var l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', '12'); l.setAttribute('y1', '18'); l.setAttribute('x2', '12'); l.setAttribute('y2', '18');
      svg.appendChild(r); svg.appendChild(l);
    }
    return svg;
  }

  // Build toggle
  var toggle = document.createElement('div');
  toggle.id = 'device-toggle';

  var btnD = document.createElement('button');
  btnD.id = 'dt-desktop';
  btnD.setAttribute('aria-label', 'Desktop view');
  btnD.classList.add('active');
  btnD.appendChild(svgIcon('desktop'));
  btnD.onclick = function() { window.__setDeviceView('desktop'); };

  var btnM = document.createElement('button');
  btnM.id = 'dt-mobile';
  btnM.setAttribute('aria-label', 'Mobile view');
  btnM.appendChild(svgIcon('mobile'));
  btnM.onclick = function() { window.__setDeviceView('mobile'); };

  toggle.appendChild(btnD);
  toggle.appendChild(btnM);

  // Build phone frame overlay
  var overlay = document.createElement('div');
  overlay.id = 'phone-overlay';

  var bezel = document.createElement('div');
  bezel.id = 'phone-bezel';

  var notch = document.createElement('div');
  notch.id = 'phone-notch';
  var pill = document.createElement('div');
  pill.id = 'phone-notch-pill';
  notch.appendChild(pill);

  var screen = document.createElement('div');
  screen.id = 'phone-screen';
  var iframe = document.createElement('iframe');
  iframe.id = 'phone-iframe';
  iframe.title = 'Mobile preview';
  screen.appendChild(iframe);

  var home = document.createElement('div');
  home.id = 'phone-home';

  bezel.appendChild(notch);
  bezel.appendChild(screen);
  bezel.appendChild(home);
  overlay.appendChild(bezel);

  // Styles
  var style = document.createElement('style');
  style.textContent = [
    '#device-toggle{position:fixed;bottom:1.5rem;left:1.5rem;z-index:9000;display:flex;align-items:center;gap:2px;background:#fff;border-radius:999px;box-shadow:0 2px 12px rgba(0,0,0,0.12);border:1px solid #e2e8f0;padding:3px;}',
    '#device-toggle button{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;border-radius:999px;cursor:pointer;transition:all 0.2s;background:transparent;color:#94a3b8;}',
    '#device-toggle button:hover{color:#475569;background:#f1f5f9;}',
    '#device-toggle button.active{background:var(--blue,#1B6CE0);color:#fff;}',
    '#phone-overlay{display:none;position:fixed;inset:0;z-index:8000;background:#f1f5f9;align-items:center;justify-content:center;padding:1.5rem;}',
    '#phone-overlay.active{display:flex;}',
    '#phone-bezel{position:relative;width:100%;max-width:390px;height:calc(100vh - 5rem);max-height:844px;background:#1a1a1a;border-radius:3rem;padding:0.75rem;box-shadow:0 25px 60px rgba(0,0,0,0.3),inset 0 0 4px rgba(255,255,255,0.05);}',
    '#phone-notch{position:absolute;top:0;left:50%;transform:translateX(-50%);width:9rem;height:1.75rem;background:#1a1a1a;border-radius:0 0 1rem 1rem;z-index:2;display:flex;align-items:center;justify-content:center;}',
    '#phone-notch-pill{width:4rem;height:1rem;background:#0a0a0a;border-radius:999px;}',
    '#phone-screen{width:100%;height:100%;background:#fff;border-radius:2.4rem;overflow:hidden;}',
    '#phone-iframe{width:100%;height:100%;border:none;display:block;}',
    '#phone-home{position:absolute;bottom:0.5rem;left:50%;transform:translateX(-50%);width:8rem;height:0.25rem;background:#555;border-radius:999px;}'
  ].join('\n');

  document.head.appendChild(style);
  document.body.appendChild(toggle);
  document.body.appendChild(overlay);

  window.__setDeviceView = function(m) {
    mode = m;
    var d = document.getElementById('dt-desktop');
    var mb = document.getElementById('dt-mobile');
    var ov = document.getElementById('phone-overlay');
    if (m === 'mobile') {
      mb.classList.add('active');
      d.classList.remove('active');
      var fr = document.getElementById('phone-iframe');
      var sep = window.location.href.indexOf('?') > -1 ? '&' : '?';
      fr.src = window.location.href + sep + 'embedded=true';
      ov.classList.add('active');
    } else {
      d.classList.add('active');
      mb.classList.remove('active');
      ov.classList.remove('active');
      document.getElementById('phone-iframe').src = '';
    }
  };
})();
