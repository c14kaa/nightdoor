/* Nightdoor entry gate: a 4-digit PIN screen shown before the site.
   It's a simple deterrent for children, not real security (anyone who reads the code could get round it).
   To change the PIN: open the site, open the browser console and run  NightdoorGate.hash('1234')  with your new PIN,
   then paste the number it prints into PIN_HASH below. A device stays unlocked for REMEMBER_DAYS, or until the PIN changes. */
(function () {
  var PIN_HASH = 4094403393;   // hash of the current PIN (the PIN itself isn't stored in the code)
  var REMEMBER_DAYS = 30;
  var MAX_TRIES = 3, LOCKOUT_SECS = 60;
  var KEY = 'nightdoor.gate';

  function hash(pin) {            // salted FNV-1a, stretched; enough to keep the PIN out of plain sight
    var s = 'nd-threshold::' + String(pin), h = 2166136261 >>> 0;
    for (var r = 0; r < 500; r++) for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; h ^= r; }
    return h >>> 0;
  }
  function store(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function load(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }

  window.NightdoorGate = { hash: hash, lock: function () { store(KEY, null); location.reload(); } };

  var saved = load(KEY);
  if (saved && saved.h === PIN_HASH && saved.until > Date.now()) return;   // already let in on this device

  var root = document.documentElement;
  root.classList.add('nd-locked');

  var css = `
  html.nd-locked body > main, html.nd-locked #screen, html.nd-locked #scare { display: none !important; }
  html.nd-locked, html.nd-locked body { overflow: hidden; background: #000; }
  #ndGate { position: fixed; inset: 0; z-index: 9999; background: #000; color: #c9c2b6; display: grid; place-items: center;
    font-family: 'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace; overflow: hidden; user-select: none; -webkit-user-select: none;
    padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom)); transition: opacity 1.2s ease; }
  #ndGate::before { content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 3;
    background: repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 1px, transparent 1px 3px); mix-blend-mode: screen; }
  #ndGate::after { content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 3;
    background: radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(0,0,0,.92) 100%); }
  #ndGate .fog { position: absolute; inset: -20%; z-index: 0; opacity: .35; filter: blur(30px);
    background: radial-gradient(30% 20% at 30% 70%, #3a1010, transparent 70%), radial-gradient(25% 25% at 75% 30%, #10203a, transparent 70%);
    animation: ndDrift 18s ease-in-out infinite alternate; }
  @keyframes ndDrift { to { transform: translate(6%, -4%) scale(1.1); } }
  #ndGate .eyes { position: absolute; z-index: 1; display: flex; gap: 22px; opacity: 0; pointer-events: none; }
  #ndGate .eyes i { width: 9px; height: 4px; border-radius: 50%; background: #ff2a1a; box-shadow: 0 0 12px 3px rgba(255,40,20,.8); }
  #ndGate .eyes.blink { animation: ndEyes 2.6s ease forwards; }
  @keyframes ndEyes { 0% { opacity: 0 } 15%,70% { opacity: .9 } 74% { opacity: 0 } 78% { opacity: .9 } 100% { opacity: 0 } }
  #ndGate .box { position: relative; z-index: 2; width: min(380px, 100%); text-align: center; }
  #ndGate .stamp { display: inline-block; border: 2px solid #b3201a; color: #e0352a; padding: 4px 10px; font-size: 11px; letter-spacing: .32em;
    transform: rotate(-3deg); margin-bottom: 18px; text-shadow: 0 0 8px rgba(224,53,42,.6); animation: ndFlick 5s steps(1) infinite; }
  @keyframes ndFlick { 0%,88%,100% { opacity: 1 } 89% { opacity: .2 } 91% { opacity: 1 } 93% { opacity: .4 } }
  #ndGate .file { font-size: 10.5px; letter-spacing: .22em; color: #6e675d; margin-bottom: 18px; }
  #ndGate .slit { width: 46px; height: 74px; margin: 0 auto 18px; background: #0d0806; border: 2px solid #2a1a10; position: relative; }
  #ndGate .slit::before { content: ''; position: absolute; top: 0; bottom: 0; right: 0; width: 4px; background: #ff3b24;
    box-shadow: 0 0 18px 5px rgba(255,59,36,.55); animation: ndCrack 3.8s ease-in-out infinite; transition: width 1.4s ease, background .6s; }
  @keyframes ndCrack { 0%,100% { opacity: .75 } 50% { opacity: 1 } 60% { opacity: .4 } }
  #ndGate h1 { font-family: 'IM Fell English SC', Georgia, serif; font-weight: 400; font-size: clamp(28px, 8vw, 40px); line-height: 1; margin: 0 0 10px;
    color: #efe6d4; letter-spacing: .04em; text-shadow: 2px 0 rgba(255,0,0,.35), -2px 0 rgba(0,180,255,.25); }
  #ndGate .line { min-height: 3.2em; font-size: 12.5px; line-height: 1.6; color: #9a9184; margin: 0 0 18px; letter-spacing: .04em; }
  #ndGate .line.bad { color: #ff4a3a; }
  #ndGate .line.ok { color: #ffd88a; }
  #ndGate .slots { display: flex; justify-content: center; gap: 12px; margin-bottom: 22px; }
  #ndGate .slots span { width: 46px; height: 58px; border: 1px solid #3a2c22; background: #070505; display: grid; place-items: center;
    font-size: 26px; color: #ff3b24; text-shadow: 0 0 10px rgba(255,59,36,.8); transition: border-color .2s; }
  #ndGate .slots span.f { border-color: #8a2a1e; }
  #ndGate .pad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; width: min(270px, 100%); margin: 0 auto; }
  #ndGate .pad button { appearance: none; height: 58px; border: 1px solid #2c241e; background: linear-gradient(#15100d, #0a0706); color: #d8cfc0;
    font: 500 22px 'IBM Plex Mono', ui-monospace, monospace; cursor: pointer; border-radius: 2px; touch-action: manipulation;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.04), 0 2px 0 #000; transition: background .1s, color .1s; }
  #ndGate .pad button:active, #ndGate .pad button.hit { background: #3a0e09; color: #ff6a55; transform: translateY(1px); }
  #ndGate .pad button.sm { font-size: 11px; letter-spacing: .16em; color: #7d7468; }
  #ndGate .pad button:disabled { opacity: .3; cursor: not-allowed; }
  #ndGate .foot { margin-top: 20px; font-size: 10px; letter-spacing: .2em; color: #4a443c; }
  #ndGate.shake .box { animation: ndShake .45s linear; }
  @keyframes ndShake { 10%,90% { transform: translateX(-2px) } 20%,80% { transform: translateX(4px) } 30%,50%,70% { transform: translateX(-8px) } 40%,60% { transform: translateX(8px) } }
  #ndGate .flash { position: absolute; inset: 0; z-index: 4; pointer-events: none; opacity: 0; background: #8a0a04; mix-blend-mode: screen; }
  #ndGate .flash.go { animation: ndFlash .5s ease-out; }
  @keyframes ndFlash { 0% { opacity: .7 } 100% { opacity: 0 } }
  #ndGate.open .slit::before { width: 100%; background: #ffe2a0; box-shadow: 0 0 80px 40px rgba(255,214,140,.7); }
  #ndGate .light { position: absolute; inset: 0; z-index: 5; pointer-events: none; opacity: 0; background: radial-gradient(circle at 50% 40%, #fff3d0, #ffcf7a 30%, #000 75%); transition: opacity 1.4s ease; }
  #ndGate.open .light { opacity: 1; }
  #ndGate.gone { opacity: 0; }
  @media (prefers-reduced-motion: reduce) { #ndGate *, #ndGate::before { animation: none !important; } }
  `;
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // Keep the game from reacting to key presses while the gate is up
  function blockKeys(e) { if (root.classList.contains('nd-locked') && !(e.target && e.target.closest && e.target.closest('#ndGate'))) { e.stopPropagation(); } }
  window.addEventListener('keydown', blockKeys, true);

  var ac = null;
  function tone(f, d, type, vol, slide) {
    try {
      if (!ac) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return; ac = new C(); }
      if (ac.state === 'suspended') ac.resume();
      var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
      g.gain.setValueAtTime(vol || .15, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + .02);
    } catch (e) { }
  }
  function buzz(ms) { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { } }

  var LINES = [
    'You have found a door that should not be here.<br>Only those who know the number may pass.',
    'Something on the other side is listening.<br>Enter the number. Quietly.',
    'This is not a place for visitors.<br>Prove you were invited.'
  ];
  var WRONG = [
    'WRONG. It heard that.',
    'WRONG. Something has turned towards the door.',
    'WRONG. It knows you are here now.'
  ];

  function build() {
    var g = document.createElement('div');
    g.id = 'ndGate'; g.setAttribute('role', 'dialog'); g.setAttribute('aria-label', 'Enter PIN');
    var keys = '';
    for (var n = 1; n <= 9; n++) keys += '<button type="button" data-k="' + n + '">' + n + '</button>';
    keys += '<button type="button" class="sm" data-k="clr">Clear</button><button type="button" data-k="0">0</button><button type="button" class="sm" data-k="del">Back</button>';
    g.innerHTML =
      '<div class="fog"></div><div class="eyes"><i></i><i></i></div>' +
      '<div class="box">' +
        '<div class="stamp">TOP SECRET</div>' +
        '<div class="file">FILE ND-09 · RESTRICTED THRESHOLD · CLEARANCE REQUIRED</div>' +
        '<div class="slit" aria-hidden="true"></div>' +
        '<h1>Nightdoor</h1>' +
        '<p class="line" id="ndLine">' + LINES[Math.floor(Math.random() * LINES.length)] + '</p>' +
        '<div class="slots" id="ndSlots"><span></span><span></span><span></span><span></span></div>' +
        '<div class="pad" id="ndPad">' + keys + '</div>' +
        '<div class="foot">UNAUTHORISED ENTRY WILL BE NOTICED</div>' +
      '</div><div class="flash"></div><div class="light"></div>';
    document.body.appendChild(g);

    var pin = '', tries = 0, busy = false;
    var line = g.querySelector('#ndLine'), slots = g.querySelectorAll('#ndSlots span'), pad = g.querySelector('#ndPad');
    var eyes = g.querySelector('.eyes'), flash = g.querySelector('.flash');

    var lockedUntil = load(KEY + '.wait') || 0;
    if (lockedUntil > Date.now()) lockout(lockedUntil);

    function say(html, cls) { line.className = 'line' + (cls ? ' ' + cls : ''); line.innerHTML = html; }
    function draw() { slots.forEach(function (s, i) { s.textContent = i < pin.length ? '•' : ''; s.className = i < pin.length ? 'f' : ''; }); }
    function setPad(on) { pad.querySelectorAll('button').forEach(function (b) { b.disabled = !on; }); }

    function showEyes() {
      eyes.style.left = (15 + Math.random() * 60) + '%'; eyes.style.top = (10 + Math.random() * 70) + '%';
      eyes.classList.remove('blink'); void eyes.offsetWidth; eyes.classList.add('blink');
    }

    function press(k) {
      if (busy) return;
      if (k === 'clr') { pin = ''; draw(); tone(90, .15, 'square', .05); return; }
      if (k === 'del') { pin = pin.slice(0, -1); draw(); tone(110, .1, 'square', .05); return; }
      if (pin.length >= 4) return;
      pin += k; draw(); tone(160 + Math.random() * 40, .12, 'triangle', .12); buzz(8);
      if (pin.length === 4) { busy = true; setTimeout(check, 350); }
    }

    function check() {
      if (hash(pin) === PIN_HASH) return grant();
      tries++;
      g.classList.remove('shake'); void g.offsetWidth; g.classList.add('shake');
      flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
      tone(70, .6, 'sawtooth', .18, 40); buzz([80, 40, 120]); showEyes();
      pin = ''; draw();
      if (tries >= MAX_TRIES) { tries = 0; var until = Date.now() + LOCKOUT_SECS * 1000; store(KEY + '.wait', until); lockout(until); return; }
      var left = MAX_TRIES - tries;
      say(WRONG[Math.min(tries - 1, WRONG.length - 1)] + '<br>' + left + ' attempt' + (left === 1 ? '' : 's') + ' left before it comes to look.', 'bad');
      busy = false;
    }

    function lockout(until) {
      busy = true; setPad(false);
      (function tick() {
        var s = Math.ceil((until - Date.now()) / 1000);
        if (s <= 0) { store(KEY + '.wait', null); busy = false; setPad(true); say('It has gone back to sleep.<br>Try again. Carefully.'); return; }
        say('THE DOOR IS SEALED.<br>Something is standing right behind it. Wait ' + s + 's.', 'bad');
        if (s % 7 === 0) showEyes();
        setTimeout(tick, 1000);
      })();
    }

    function grant() {
      store(KEY, { h: PIN_HASH, until: Date.now() + REMEMBER_DAYS * 864e5 });
      say('ACCESS GRANTED.<br>Welcome back. Don’t let anything follow you in.', 'ok');
      setPad(false);
      tone(220, 1.2, 'sine', .12, 440); setTimeout(function () { tone(330, 1.4, 'sine', .08, 660); }, 180);
      g.classList.add('open');
      setTimeout(function () {
        root.classList.remove('nd-locked');
        g.classList.add('gone');
        setTimeout(function () { g.remove(); window.removeEventListener('keydown', blockKeys, true); window.removeEventListener('keydown', onKey, true); }, 1300);
      }, 1500);
    }

    pad.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      press(b.dataset.k);
    });
    function onKey(e) {
      if (!root.classList.contains('nd-locked')) return;
      var k = e.key;
      if (/^[0-9]$/.test(k)) press(k);
      else if (k === 'Backspace') press('del');
      else if (k === 'Escape') press('clr');
      else return;
      var b = pad.querySelector('[data-k="' + (k === 'Backspace' ? 'del' : k === 'Escape' ? 'clr' : k) + '"]');
      if (b) { b.classList.add('hit'); setTimeout(function () { b.classList.remove('hit'); }, 120); }
      e.preventDefault(); e.stopImmediatePropagation();
    }
    window.addEventListener('keydown', onKey, true);

    setInterval(function () { if (root.classList.contains('nd-locked') && !busy && Math.random() < .25) showEyes(); }, 9000);
  }

  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
