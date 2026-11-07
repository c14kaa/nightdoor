/* NIGHTDOOR engine: homepage shelf, story player, lives, items, sound, saves. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const arr = x => x == null ? [] : Array.isArray(x) ? x : [x];
  const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Catalogue: add new stories here (and a <script src="stories/…js"> in index.html). */
  const SHELF = [
    { id: 'primrose-close' },
    { id: 'hollowmere' },
    { id: 'good-boy' },
    { id: 'cairn' },
    { id: 'gull-rock', soon: true, title: 'The Keeper of Gull Rock', cover: 'cover_gullrock', tagline: 'The light must never go out. Something in the sea is counting on it.', blurb: 'A winter posting to a lighthouse eleven miles from shore. The last keeper left a logbook, and a list of rules written in a shaking hand.' },
    { id: 'ward-9', soon: true, title: 'Signal from Ward 9', cover: 'cover_ward9', tagline: 'The hospital closed in 1974. The night nurse is still doing her rounds.', blurb: 'A pager goes off in an abandoned hospital at 3:03 every morning. Tonight, you answer it.' }
  ];

  /* ---------- storage (best-effort) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('nightdoor.v1.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('nightdoor.v1.' + k, JSON.stringify(v)); } catch (e) { } },
    del(k) { try { localStorage.removeItem('nightdoor.v1.' + k); } catch (e) { } }
  };

  /* ---------- sound (Web Audio, all synthesised) ---------- */
  const SND = {
    ctx: null, master: null, on: store.get('sound', true), drone: null, droneMood: null, timers: [],
    init() {
      if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
      try {
        const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
        this.ctx = new C(); this.master = this.ctx.createGain(); this.master.gain.value = this.on ? .9 : 0; this.master.connect(this.ctx.destination);
      } catch (e) { this.ctx = null; }
    },
    setOn(v) { this.on = v; store.set('sound', v); if (this.master) this.master.gain.setTargetAtTime(v ? .9 : 0, this.ctx.currentTime, .05); },
    osc(type, freq, t0, dur, vol, dest, glideTo) {
      const c = this.ctx, o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t0); if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
      g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + Math.min(.02, dur / 4)); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
      o.connect(g); g.connect(dest || this.master); o.start(t0); o.stop(t0 + dur + .05); return o;
    },
    noise(dur) { const c = this.ctx, b = c.createBuffer(1, c.sampleRate * dur, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = c.createBufferSource(); s.buffer = b; return s; },
    tune(slow) {
      if (!this.ctx) return;
      const M = [[69, 1], [72, 2], [74, 1], [76, 1.5], [77, .5], [76, 1], [74, 2], [71, 1], [67, 1.5], [69, .5], [71, 1], [72, 2], [69, 1], [69, 1.5], [68, .5], [69, 1], [71, 2], [68, 1], [64, 2]];
      const c = this.ctx; const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = slow ? 1400 : 2600; lp.connect(this.master);
      let t = c.currentTime + .05; const beat = slow ? .52 : .27;
      M.forEach(([m, d], i) => {
        let fr = 440 * Math.pow(2, (m - 69) / 12); if (slow) fr *= Math.pow(.992, i) * (1 + (Math.random() - .5) * .012);
        const len = d * beat;
        this.osc('square', fr, t, len * .95, slow ? .05 : .045, lp);
        this.osc('triangle', fr * 2, t, len * .6, .025, lp);
        if (slow) this.osc('sine', fr / 2, t, len, .05, lp);
        t += len;
      });
    },
    scream() {
      if (!this.ctx) return; const c = this.ctx, t = c.currentTime;
      const n = this.noise(1.3), bp = c.createBiquadFilter(), g = c.createGain();
      bp.type = 'bandpass'; bp.Q.value = 2; bp.frequency.setValueAtTime(3200, t); bp.frequency.exponentialRampToValueAtTime(500, t + 1.2);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.8, t + .03); g.gain.exponentialRampToValueAtTime(.001, t + 1.25);
      n.connect(bp); bp.connect(g); g.connect(this.master); n.start(t);
      this.osc('sawtooth', 1100, t, 1.1, .22, null, 160); this.osc('sawtooth', 1170, t, 1.0, .18, null, 140);
      this.osc('square', 1650, t, .5, .08, null, 900); this.osc('sine', 70, t, 1.2, .6, null, 30);
    },
    hurt() { if (!this.ctx) return; const t = this.ctx.currentTime; this.osc('sine', 150, t, .45, .7, null, 38); this.osc('triangle', 90, t, .3, .3, null, 40); },
    pickup() { if (!this.ctx) return; const t = this.ctx.currentTime; this.osc('triangle', 880, t, .18, .16); this.osc('triangle', 1318, t + .1, .3, .14); },
    death() { if (!this.ctx) return; const t = this.ctx.currentTime; [220, 207, 174, 110].forEach((fr, i) => this.osc('sawtooth', fr, t + i * .35, .9, .07, null, fr * .97)); this.osc('sine', 55, t, 2.4, .5, null, 30); },
    chime() { if (!this.ctx) return; const t = this.ctx.currentTime; [523, 659, 784, 1046].forEach((fr, i) => this.osc('triangle', fr, t + i * .14, 1.2, .1)); },
    knock() {
      if (!this.ctx) return; const c = this.ctx;
      [0, .38, .76].forEach(dt => { const t = c.currentTime + .3 + dt; const n = this.noise(.12), lp = c.createBiquadFilter(), g = c.createGain(); lp.type = 'lowpass'; lp.frequency.value = 260; g.gain.setValueAtTime(1.6, t); g.gain.exponentialRampToValueAtTime(.001, t + .12); n.connect(lp); lp.connect(g); g.connect(this.master); n.start(t); this.osc('sine', 95, t, .14, .5, null, 60); });
    },
    bell(n = 3) {
      if (!this.ctx) return; const c = this.ctx;
      for (let k = 0; k < n; k++) {
        const t = c.currentTime + .2 + k * 1.15;
        [[392, .22, 3.2], [392 * 2.76, .08, 1.6], [392 * 5.4, .04, .8], [392 * .5, .12, 3.6], [392 * 1.19, .07, 2.2]].forEach(([fr, v, d]) => this.osc('sine', fr, t, d, v));
      }
    },
    thunder() {
      if (!this.ctx) return; const c = this.ctx, t = c.currentTime + .1;
      const n = this.noise(3.5), lp = c.createBiquadFilter(), g = c.createGain();
      lp.type = 'lowpass'; lp.frequency.setValueAtTime(900, t); lp.frequency.exponentialRampToValueAtTime(90, t + 3.2);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1.1, t + .06); g.gain.setValueAtTime(.7, t + .4); g.gain.linearRampToValueAtTime(.9, t + .9); g.gain.exponentialRampToValueAtTime(.001, t + 3.4);
      n.connect(lp); lp.connect(g); g.connect(this.master); n.start(t);
      this.osc('sine', 48, t, 2.6, .5, null, 28);
    },
    scratch() {
      if (!this.ctx) return; const c = this.ctx;
      for (let k = 0; k < 7; k++) { const t = c.currentTime + .2 + k * .42 + Math.random() * .08; const n = this.noise(.22), bp = c.createBiquadFilter(), g = c.createGain(); bp.type = 'bandpass'; bp.frequency.setValueAtTime(2600, t); bp.frequency.linearRampToValueAtTime(1400, t + .2); bp.Q.value = 3; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.5, t + .03); g.gain.exponentialRampToValueAtTime(.001, t + .22); n.connect(bp); bp.connect(g); g.connect(this.master); n.start(t); }
    },
    growl() {
      if (!this.ctx) return; const c = this.ctx, t = c.currentTime + .1;
      const o = c.createOscillator(), lp = c.createBiquadFilter(), g = c.createGain(), l = c.createOscillator(), lg = c.createGain();
      o.type = 'sawtooth'; o.frequency.value = 68; l.frequency.value = 23; lg.gain.value = 18; l.connect(lg); lg.connect(o.frequency);
      lp.type = 'lowpass'; lp.frequency.value = 420; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.35, t + .4); g.gain.setValueAtTime(.35, t + 1.6); g.gain.exponentialRampToValueAtTime(.001, t + 2.4);
      o.connect(lp); lp.connect(g); g.connect(this.master); o.start(t); l.start(t); o.stop(t + 2.5); l.stop(t + 2.5);
    },
    stones() {
      if (!this.ctx) return; const c = this.ctx;
      [0, 1.1, 1.5, 3.0, 4.2, 4.5].forEach(dt => { const t = c.currentTime + .3 + dt; const n = this.noise(.08), bp = c.createBiquadFilter(), g = c.createGain(); bp.type = 'bandpass'; bp.frequency.value = 1700 + Math.random() * 500; bp.Q.value = 6; g.gain.setValueAtTime(1.4, t); g.gain.exponentialRampToValueAtTime(.001, t + .08); n.connect(bp); bp.connect(g); g.connect(this.master); n.start(t); this.osc('triangle', 820 + Math.random() * 200, t, .06, .12); });
    },
    heart() { if (!this.ctx) return; const t = this.ctx.currentTime; this.osc('sine', 62, t, .18, .7, null, 40); this.osc('sine', 58, t + .2, .2, .55, null, 38); },
    play(name) { if (!this.ctx || !this.on) return; ({ van: () => this.tune(false), vanSlow: () => this.tune(true), knock: () => this.knock(), heart: () => this.heart(), bell: () => this.bell(3), thunder: () => this.thunder(), scratch: () => this.scratch(), growl: () => this.growl(), stones: () => this.stones() })[name]?.(); },
    setMood(mood) {
      if (!this.ctx || mood === this.droneMood) return; this.droneMood = mood;
      const c = this.ctx, t = c.currentTime;
      if (this.drone) { const old = this.drone; old.g.gain.setTargetAtTime(0, t, .6); setTimeout(() => old.nodes.forEach(n => { try { n.stop(); } catch (e) { } }), 2500); this.drone = null; }
      this.timers.forEach(clearInterval); this.timers = [];
      if (mood === 'day' || mood === 'golden') {
        this.timers.push(setInterval(() => { if (!this.on || Math.random() < .45) return; const t0 = c.currentTime; const base = 2400 + Math.random() * 1600; for (let i = 0; i < 2 + Math.random() * 3; i++) this.osc('sine', base, t0 + i * .11, .08, .03, null, base * 1.3); }, mood === 'day' ? 2600 : 4200));
        return;
      }
      const g = c.createGain(); g.gain.value = 0; const lp = c.createBiquadFilter(); lp.type = 'lowpass';
      lp.connect(g); g.connect(this.master);
      const spec = { fog: [[73.4, 'sine'], [77.8, 'sine']], dusk: [[110, 'sawtooth'], [110.7, 'sawtooth'], [164.8, 'sine']], night: [[55, 'sine'], [58.3, 'sine'], [82.4, 'triangle']], under: [[49, 'sawtooth'], [51.9, 'sawtooth'], [73.4, 'sine'], [104, 'sine']], blood: [[41, 'sawtooth'], [43.6, 'sawtooth'], [61.7, 'sine']] }[mood] || [];
      lp.frequency.value = mood === 'dusk' ? 420 : mood === 'under' ? 300 : 240;
      const nodes = spec.map(([fr, ty]) => { const o = c.createOscillator(); o.type = ty; o.frequency.value = fr; o.connect(lp); o.start(); return o; });
      if (mood === 'under' || mood === 'blood') { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = .13; lg.gain.value = 140; l.connect(lg); lg.connect(lp.frequency); l.start(); nodes.push(l); }
      if (mood === 'night' || mood === 'under' || mood === 'fog') { const n = this.noise(4); n.loop = true; const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 500; bp.Q.value = .7; const ng = c.createGain(); ng.gain.value = .05; n.connect(bp); bp.connect(ng); ng.connect(g); n.start(); nodes.push(n); }
      g.gain.setTargetAtTime(mood === 'dusk' || mood === 'fog' ? .05 : .09, t, 1.2);
      this.drone = { g, nodes };
      if (mood === 'blood') this.timers.push(setInterval(() => this.on && this.heart(), 1150));
    }
  };

  /* ---------- state ---------- */
  let story = null, S = null, typing = null, lastNode = null, busy = false;
  const fresh = (st, deaths = 0) => ({ storyId: st.id, node: st.start, lives: st.lives, inv: [], deaths, steps: 0 });
  const has = need => arr(need).every(i => S.inv.includes(i));
  const item = id => story.items[id] || { name: id, icon: '•' };
  const save = () => { if (S) store.set('save.' + S.storyId, S); };
  const endingsFound = id => store.get('endings.' + id, []);
  const allEndings = st => Object.entries(st.nodes).filter(([, n]) => n.end).map(([k, n]) => ({ id: k, title: n.title, kind: n.end.kind }));

  /* ---------- home ---------- */
  function renderHome() {
    document.body.dataset.mood = 'night';
    $('home').hidden = false; $('play').hidden = true; $('screen').hidden = true;
    const shelf = $('shelf'); shelf.innerHTML = '';
    let live = 0;
    SHELF.forEach(entry => {
      const st = !entry.soon && window.NIGHTDOOR && NIGHTDOOR.stories[entry.id];
      const d = Object.assign({}, entry, st || {});
      const el = document.createElement('article'); el.className = 'story' + (st ? '' : ' soon');
      let meta = '', actions = '';
      if (st) {
        live++;
        const scenes = Object.values(st.nodes).filter(n => n.choices).length;
        const ends = allEndings(st), found = endingsFound(st.id);
        const saved = store.get('save.' + st.id, null);
        meta = `<div class="meta mono"><span>${scenes} scenes</span><span>${ends.length} endings · ${found.length} found</span><span>${st.lives} lives</span></div>`;
        actions = saved && saved.node && st.nodes[saved.node] && !st.nodes[saved.node].end
          ? `<button class="btn" data-act="continue" type="button">Continue · ${st.nodes[saved.node].title || ''}</button><button class="btn ghost" data-act="new" type="button">Start over</button>`
          : `<button class="btn" data-act="new" type="button">Open the door</button>`;
      }
      el.innerHTML = `<div class="cover">${ART.scene(d.cover)}</div><div class="body"><h2>${d.title}</h2><p class="tag">${d.tagline}</p><p class="blurb">${d.blurb}</p>${meta}<div class="actions">${actions}</div></div>`;
      el.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => { SND.init(); startStory(st, b.dataset.act === 'continue'); }));
      shelf.appendChild(el);
    });
    $('shelfCount').textContent = `${live} open · ${SHELF.length - live} coming soon`;
    window.scrollTo(0, 0);
  }

  /* ---------- player ---------- */
  function startStory(st, resume) {
    story = st;
    const saved = resume ? store.get('save.' + st.id, null) : null;
    S = saved && st.nodes[saved.node] ? saved : fresh(st, (store.get('save.' + st.id, null) || {}).deaths || 0);
    lastNode = null;
    $('home').hidden = true; $('play').hidden = false;
    renderHud(); goto(S.node, true);
  }

  function goto(id, first) {
    let n = story.nodes[id];
    if (n && n.route) { const r = n.route.find(r => !r.need || has(r.need)); return goto(r.next, first); }
    if (!n) { console.error('missing node', id); return; }
    S.node = id; save();
    if (n.end) return showEnding(id, n);
    renderNode(n, id);
  }

  function renderHud(newItem) {
    const L = $('lives'); L.innerHTML = '';
    for (let i = 0; i < story.lives; i++) {
      const out = i >= S.lives;
      L.insertAdjacentHTML('beforeend', `<svg viewBox="0 0 18 30" class="${out ? 'out' : ''}" aria-hidden="true"><path class="smoke" d="M9,10 q-3,-4 0,-7 q3,-3 0,-6" stroke="#999" stroke-width="1.2" fill="none"/><path class="flame" d="M9,2 C13,7 12,11 9,12 C6,11 5,7 9,2Z" fill="#ffb347"/><path class="flame" d="M9,6 C10.5,8 10.5,10 9,11 C7.5,10 7.5,8 9,6Z" fill="#fff3c4"/><rect x="5" y="13" width="8" height="16" rx="1" fill="${out ? '#5a5048' : '#efe6d4'}"/><line x1="9" y1="11" x2="9" y2="13.5" stroke="#222" stroke-width="1"/></svg>`);
    }
    L.setAttribute('aria-label', `${S.lives} of ${story.lives} lives left`);
    $('attempt').textContent = S.deaths ? `Attempt ${S.deaths + 1}` : '';
    $('sndBtn').textContent = SND.on ? 'Sound on' : 'Sound off'; $('sndBtn').setAttribute('aria-pressed', SND.on);
    const inv = $('inv'); inv.innerHTML = '';
    const vis = S.inv.filter(i => !item(i).hidden);
    if (!vis.length) inv.innerHTML = '<span class="empty">Your pockets are empty.</span>';
    vis.forEach(i => {
      const it = item(i); const b = document.createElement(it.heal ? 'button' : 'span');
      b.className = 'chip' + (it.heal ? ' usable' : '') + (i === newItem || arr(newItem).includes(i) ? ' new' : '');
      b.title = it.desc || ''; b.innerHTML = `<span class="ic" aria-hidden="true">${it.icon}</span>${it.name}`;
      if (it.heal) { b.type = 'button'; b.addEventListener('click', () => useItem(i)); }
      inv.appendChild(b);
    });
  }

  function useItem(i) {
    const it = item(i);
    if (it.heal) {
      if (S.lives >= story.lives) { flashText(`${it.name}: you're already at full strength. Save it.`); return; }
      S.lives = Math.min(story.lives, S.lives + it.heal); S.inv = S.inv.filter(x => x !== i);
      SND.pickup(); save(); renderHud(); flashText(`You eat the ${it.name.toLowerCase()}. A candle flickers back to life.`);
    }
  }
  function flashText(msg) {
    const el = document.createElement('div'); el.className = 'mono';
    el.style.cssText = 'position:fixed;left:50%;bottom:calc(20px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:var(--paper);color:var(--ink);border:1px solid var(--accent);padding:10px 14px;z-index:80;max-width:calc(100% - 32px);text-transform:none;letter-spacing:0;font-size:13px';
    el.textContent = msg; document.body.appendChild(el); setTimeout(() => el.remove(), 2600);
  }

  function renderNode(n, id) {
    const same = lastNode === id; lastNode = id; busy = false;
    document.body.dataset.mood = n.mood || 'night';
    SND.setMood(n.mood || 'night');
    const frozen = new RegExp(story.frozen || '^20:13$').test(n.time || '');
    $('clock').textContent = n.time || ''; $('clock').classList.toggle('frozen', frozen);
    $('sceneImg').innerHTML = ART.scene(n.img) + `<span class="act mono">${n.act || ''}</span>`;
    $('title').textContent = n.title || '';
    const ch = $('choices'); ch.className = 'choices hide'; ch.innerHTML = '';
    (n.choices || []).forEach((c, i) => {
      const li = document.createElement('li');
      const needs = arr(c.need).filter(x => !item(x).hidden);
      const needHtml = needs.length ? `<span class="needs">${needs.map(x => `<span class="need${S.inv.includes(x) ? '' : ' missing'}">${S.inv.includes(x) ? 'Use' : 'Needs'} ${item(x).icon} ${item(x).name}</span>`).join('')}</span>` : '';
      li.innerHTML = `<button class="choice" type="button"><span class="k">${i + 1}</span><span class="t">${c.t}</span><span class="arrow" aria-hidden="true">→</span>${needHtml}</button>`;
      li.querySelector('button').addEventListener('click', () => choose(n, i, li));
      ch.appendChild(li);
    });
    if (!same) window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    const reveal = () => { ch.classList.remove('hide'); requestAnimationFrame(() => ch.classList.add('in')); };
    const afterScare = () => typeText($('text'), n.text, same ? 0 : 1, reveal);
    if (n.sfx) SND.play(n.sfx);
    if (n.scare && !same) { $('text').textContent = ''; scare(n.scare, afterScare); } else afterScare();
  }

  function typeText(el, txt, animate, done) {
    clearInterval(typing); el.onclick = null;
    if (!animate || reduced) { el.textContent = txt; done && done(); return; }
    let i = 0; const step = 3;
    el.textContent = '';
    const caret = document.createElement('span'); caret.className = 'caret';
    const finish = () => { clearInterval(typing); typing = null; el.textContent = txt; el.onclick = null; done && done(); };
    el.onclick = finish; finishTyping = finish;
    typing = setInterval(() => { i += step; if (i >= txt.length) return finish(); el.textContent = txt.slice(0, i); el.appendChild(caret); }, 18);
  }
  let finishTyping = null;

  function choose(n, idx, li) {
    if (busy) return; busy = true;
    if (typing && finishTyping) finishTyping();
    SND.init();
    const c = n.choices[idx];
    const ok = !c.need || has(c.need);
    const r = ok ? c : Object.assign({}, c.fail || {});
    const ch = $('choices'); ch.classList.add('done');
    ch.querySelectorAll('.choice').forEach(b => b.disabled = true);
    li.classList.add('picked');
    const go = () => {
      const fx = [];
      const gained = arr(r.gain).filter(g => !S.inv.includes(g));
      gained.forEach(g => S.inv.push(g));
      gained.filter(g => !item(g).hidden).forEach(g => fx.push(`<span class="fx gain">+ ${item(g).icon} ${item(g).name}</span>`));
      arr(r.lose).forEach(l => { S.inv = S.inv.filter(x => x !== l); });
      if (ok && c.need && arr(c.need).some(x => !item(x).hidden)) { /* used item: kept */ }
      let dead = false;
      if (r.dmg) { S.lives = Math.max(0, S.lives - r.dmg); fx.push(`<span class="fx hurt">− ${r.dmg} life</span>`); hurt(); if (S.lives <= 0) dead = true; }
      if (r.fatal) { dead = true; fx.push('<span class="fx dead">Fatal</span>'); }
      if (gained.some(g => !item(g).hidden)) SND.pickup();
      S.steps++; save(); renderHud(gained);
      const box = document.createElement('div'); box.className = 'outcome';
      const label = dead ? (r.fatal ? 'Accept your fate' : 'Your last candle goes out') : (r.next === S.node ? 'Choose again' : 'Continue');
      box.innerHTML = `<p></p>${fx.length ? `<div class="effects">${fx.join('')}</div>` : ''}<button class="btn" type="button" hidden>${label} →</button>`;
      li.appendChild(box);
      const btn = box.querySelector('.btn');
      typeText(box.querySelector('p'), r.o || '', 1, () => { btn.hidden = false; btn.focus({ preventScroll: true }); box.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' }); });
      btn.addEventListener('click', () => {
        if (dead) return showDeath(r, !!r.fatal);
        const next = r.next || S.node;
        if (next === S.node) { lastNode = S.node; renderNode(story.nodes[S.node], S.node); }
        else goto(next);
      });
    };
    if (r.scare) scare(r.scare, go); else go();
  }

  function hurt() { SND.hurt(); const d = document.createElement('div'); d.className = 'hurtflash'; document.body.appendChild(d); setTimeout(() => d.remove(), 800); if (navigator.vibrate) try { navigator.vibrate(120); } catch (e) { } }

  function scare(key, then) {
    const el = $('scare'); el.querySelector('.face').innerHTML = ART.scare(key);
    el.hidden = false; el.classList.remove('fade', 'go'); void el.offsetWidth; el.classList.add('go');
    if (SND.on) SND.scream();
    if (navigator.vibrate) try { navigator.vibrate([60, 40, 120]); } catch (e) { }
    setTimeout(() => { el.classList.add('fade'); setTimeout(() => { el.hidden = true; el.classList.remove('go', 'fade'); then && then(); }, 450); }, reduced ? 700 : 1050);
  }

  /* ---------- death + endings ---------- */
  function showDeath(r, fatal) {
    SND.setMood('night'); SND.death();
    const n = story.nodes[S.node]; S.deaths++;
    const deaths = S.deaths; const steps = S.steps;
    S = fresh(story, deaths); save();
    const sc = $('screen'); sc.className = 'overlay screen'; sc.hidden = false;
    sc.innerHTML = `<div class="inner"><span class="mono kind">${fatal ? 'The story ends here' : 'Out of lives'}</span><h2>${fatal ? ((story.death && story.death.title) || 'The story keeps you') : 'Your last candle goes out'}</h2>
      <p>${fatal ? r.o : ((story.death && story.death.text) || 'Too many wrong turns. The dark closes in.')}</p>
      <div class="stats mono"><span>Fell at: ${n.title}</span><span>${n.time || ''}</span><span>Choices made: ${steps}</span><span>Deaths so far: ${deaths}</span></div>
      <div class="actions"><button class="btn" id="again" type="button">Start again from the beginning</button><button class="btn ghost" id="home2" type="button">Back to the doors</button></div></div>`;
    $('again').onclick = () => { sc.hidden = true; lastNode = null; renderHud(); goto(story.start); };
    $('home2').onclick = () => { sc.hidden = true; renderHome(); };
    $('again').focus();
  }

  function showEnding(id, n) {
    const found = endingsFound(story.id); if (!found.includes(id)) { found.push(id); store.set('endings.' + story.id, found); }
    const bad = n.end.kind === 'bad';
    document.body.dataset.mood = n.mood || 'day'; SND.setMood(bad ? 'night' : 'day'); bad ? SND.death() : SND.chime();
    const steps = S.steps, deaths = S.deaths;
    store.del('save.' + story.id);
    const ends = allEndings(story);
    const sc = $('screen'); sc.className = 'overlay screen ending' + (bad ? ' bad' : ''); sc.hidden = false;
    sc.innerHTML = `<div class="inner"><span class="mono kind">${n.end.label} · ${n.time || ''}</span><h2>${n.title}</h2><div class="art">${ART.scene(n.img)}</div>
      <p>${n.text}</p>
      <div class="stats mono"><span>Choices made: ${steps}</span><span>Deaths on the way: ${deaths}</span><span>Endings found: ${found.length} of ${ends.length}</span></div>
      <div class="found">${ends.map(e => `<div class="${found.includes(e.id) ? 'yes' : ''}"><small>${e.kind}</small>${found.includes(e.id) ? e.title : '? ? ?'}</div>`).join('')}</div>
      <div class="actions"><button class="btn" id="again" type="button">Play again</button><button class="btn ghost" id="home2" type="button">Back to the doors</button></div></div>`;
    sc.scrollTop = 0;
    $('again').onclick = () => { sc.hidden = true; S = fresh(story, 0); lastNode = null; renderHud(); goto(story.start); };
    $('home2').onclick = () => { sc.hidden = true; renderHome(); };
  }

  /* ---------- wiring ---------- */
  $('backBtn').addEventListener('click', () => { save(); renderHome(); });
  $('sndBtn').addEventListener('click', () => { SND.init(); SND.setOn(!SND.on); renderHud(); if (SND.on && story) SND.setMood((story.nodes[S.node] || {}).mood); });
  document.addEventListener('keydown', e => {
    if ($('play').hidden || !$('screen').hidden || e.metaKey || e.ctrlKey || e.altKey) return;
    if (['1', '2', '3'].includes(e.key)) { const b = document.querySelectorAll('#choices .choice')[+e.key - 1]; if (b && !b.disabled && $('choices').classList.contains('in')) b.click(); else if (typing && finishTyping) finishTyping(); }
    if ((e.key === ' ' || e.key === 'Enter') && typing && finishTyping && document.activeElement === document.body) { e.preventDefault(); finishTyping(); }
  });

  /* keep a game in progress across live page updates */
  window.claude?.hot?.snapshot?.(() => ({ S, storyId: story && story.id, inPlay: !$('play').hidden }));
  function boot(data) {
    data = data || {};
    if (data.inPlay && data.S && NIGHTDOOR.stories[data.storyId]) { story = NIGHTDOOR.stories[data.storyId]; S = data.S; $('home').hidden = true; $('play').hidden = false; renderHud(); goto(S.node, true); }
    else renderHome();
  }
  window.claude?.hot?.ready ? window.claude.hot.ready(boot) : boot(window.claude?.hot?.data ?? {});
})();
