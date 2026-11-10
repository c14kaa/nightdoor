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
    { id: 'signed-out' },
    { id: 'ward-9' },
    { id: 'leave-it-open' },
    { id: 'gull-rock', soon: true, title: 'The Keeper of Gull Rock', cover: 'cover_gullrock', tagline: 'The light must never go out. Something in the sea is counting on it.', blurb: 'A winter posting to a lighthouse eleven miles from shore. The last keeper left a logbook, and a list of rules written in a shaking hand.' }
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
    alarm() {
      if (!this.ctx) return; const t0 = this.ctx.currentTime + .1;
      for (let k = 0; k < 3; k++) { const t = t0 + k * 1.3; this.osc('square', 880, t, .9, .07, null); this.osc('square', 660, t + .45, .45, .07, null); }
    },
    tap() {
      if (!this.ctx) return; const c = this.ctx;
      [0, .5, .62, 1.6, 1.72, 1.84].forEach(dt => { const t = c.currentTime + .3 + dt; const n = this.noise(.03), hp = c.createBiquadFilter(), g = c.createGain(); hp.type = 'highpass'; hp.frequency.value = 2400; g.gain.setValueAtTime(1.2, t); g.gain.exponentialRampToValueAtTime(.001, t + .03); n.connect(hp); hp.connect(g); g.connect(this.master); n.start(t); this.osc('sine', 3200, t, .04, .05); });
    },
    handle() {
      if (!this.ctx) return; const c = this.ctx;
      [0, .25, 1.6, 1.85, 3.1, 3.3, 3.5].forEach((dt, i) => { const t = c.currentTime + .3 + dt; const n = this.noise(.18), bp = c.createBiquadFilter(), g = c.createGain(); bp.type = 'bandpass'; bp.frequency.value = 900 + (i % 2) * 300; bp.Q.value = 4; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.9 * (1 - i * .08), t + .02); g.gain.exponentialRampToValueAtTime(.001, t + .18); n.connect(bp); bp.connect(g); g.connect(this.master); n.start(t); this.osc('triangle', 240, t, .1, .08, null, 180); });
    },
    tick(fast) { if (!this.ctx) return; const t = this.ctx.currentTime; this.osc('square', fast ? 1500 : 1100, t, .03, .05); },
    beep() { if (!this.ctx) return; const t = this.ctx.currentTime; this.osc('square', 1320, t, .07, .05); },
    buzz() { if (!this.ctx) return; const t = this.ctx.currentTime; this.osc('sawtooth', 120, t, .35, .18); this.osc('square', 123, t, .35, .08); },
    heart() { if (!this.ctx) return; const t = this.ctx.currentTime; this.osc('sine', 62, t, .18, .7, null, 40); this.osc('sine', 58, t + .2, .2, .55, null, 38); },
    pager() {
      if (!this.ctx) return; const t0 = this.ctx.currentTime + .1;
      for (let k = 0; k < 4; k++) for (let j = 0; j < 3; j++) { const t = t0 + k * .9 + j * .14; this.osc('square', 2900, t, .09, .06); this.osc('square', 2350, t + .07, .06, .04); }
    },
    breath(dur = 2.2, vol = .5) {
      if (!this.ctx) return; const c = this.ctx, t = c.currentTime;
      const n = this.noise(dur + .2), bp = c.createBiquadFilter(), g = c.createGain();
      bp.type = 'bandpass'; bp.Q.value = .9; bp.frequency.setValueAtTime(380, t); bp.frequency.linearRampToValueAtTime(900, t + dur * .5); bp.frequency.linearRampToValueAtTime(300, t + dur);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + dur * .5); g.gain.linearRampToValueAtTime(0, t + dur);
      n.connect(bp); bp.connect(g); g.connect(this.master); n.start(t); n.stop(t + dur + .2);
    },
    ward() { if (!this.ctx) return; [0, 2.4, 4.8].forEach(dt => setTimeout(() => this.on && this.breath(2.2, .45), dt * 1000)); },
    watch(fast) {
      if (!this.ctx) return; const c = this.ctx, gap = fast ? .16 : .5;
      for (let k = 0; k < (fast ? 24 : 10); k++) { const t = c.currentTime + .2 + k * gap; this.osc('square', k % 2 ? 4100 : 3600, t, .018, .07); this.osc('sine', 1800, t, .02, .04); }
    },
    trolley() {
      if (!this.ctx) return; const c = this.ctx;
      [0, .9, 1.6, 2.6, 3.3].forEach((dt, i) => { const t = c.currentTime + .2 + dt; this.osc('sine', 1900 + i * 60, t, .35, .05, null, 2400 + i * 40); this.osc('triangle', 2700, t + .05, .25, .03, null, 3100); });
    },

    creak() {
      if (!this.ctx) return; const c = this.ctx, t = c.currentTime + .15;
      /* an old wardrobe door: a slow stick-slip groan that rises, then a dry tick at the end */
      const o = c.createOscillator(), bp = c.createBiquadFilter(), g = c.createGain(), l = c.createOscillator(), lg = c.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(95, t); o.frequency.linearRampToValueAtTime(240, t + 1.6); o.frequency.linearRampToValueAtTime(150, t + 2.3);
      l.type = 'square'; l.frequency.setValueAtTime(14, t); l.frequency.linearRampToValueAtTime(31, t + 2.2); lg.gain.value = 40; l.connect(lg); lg.connect(o.frequency);
      bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 2.5;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.32, t + .25); g.gain.setValueAtTime(.3, t + 1.9); g.gain.exponentialRampToValueAtTime(.001, t + 2.4);
      o.connect(bp); bp.connect(g); g.connect(this.master); o.start(t); l.start(t); o.stop(t + 2.5); l.stop(t + 2.5);
      const n = this.noise(.05), hp = c.createBiquadFilter(), g2 = c.createGain(); hp.type = 'highpass'; hp.frequency.value = 1500; g2.gain.setValueAtTime(.9, t + 2.45); g2.gain.exponentialRampToValueAtTime(.001, t + 2.5); n.connect(hp); hp.connect(g2); g2.connect(this.master); n.start(t + 2.45);
    },
    alertTone() {
      if (!this.ctx) return; const c = this.ctx, t0 = c.currentTime + .05;
      /* the phone emergency-alert tone: two clashing pitches, pulsed */
      [[0, 2], [2.15, .5], [2.75, .5]].forEach(([dt, d]) => { const t = t0 + dt; this.osc('sawtooth', 853, t, d, .09); this.osc('sawtooth', 960, t, d, .09); this.osc('sine', 853, t, d, .12); });
    },
    smoke() {
      if (!this.ctx) return; const t0 = this.ctx.currentTime + .2;
      for (let k = 0; k < 3; k++) for (let j = 0; j < 3; j++) this.osc('square', 3150, t0 + k * 1.4 + j * .32, .2, .05);
    },

    play(name) { if (!this.ctx || !this.on) return; ({ van: () => this.tune(false), vanSlow: () => this.tune(true), knock: () => this.knock(), heart: () => this.heart(), bell: () => this.bell(3), thunder: () => this.thunder(), scratch: () => this.scratch(), growl: () => this.growl(), stones: () => this.stones(), alarm: () => this.alarm(), tap: () => this.tap(), handle: () => this.handle(), pager: () => this.pager(), ward: () => this.ward(), watch: () => this.watch(false), watchFast: () => this.watch(true), trolley: () => this.trolley(), creak: () => this.creak(), alert: () => this.alertTone(), smoke: () => this.smoke(), creakAlarm: () => { this.creak(); setTimeout(() => this.on && this.alarm(), 1600); } })[name]?.(); },
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
  const fresh = (st, deaths = 0) => ({ storyId: st.id, node: st.start, lives: st.lives, inv: (st.startInv || []).slice(), deaths, steps: 0 });
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
        const scenes = Object.values(st.nodes).filter(n => !n.end && !n.route).length;
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
    const same = lastNode === id; lastNode = id; busy = false; stopTimer(); stopMech();
    document.body.dataset.mood = n.mood || 'night';
    SND.setMood(n.mood || 'night');
    const frozen = new RegExp(story.frozen || '^20:13$').test(n.time || '');
    $('clock').textContent = n.time || ''; $('clock').classList.toggle('frozen', frozen);
    $('sceneImg').innerHTML = ART.scene(n.img) + `<span class="act mono">${n.act || ''}</span>`;
    $('title').textContent = n.title || '';
    const ch = $('choices'); ch.className = 'choices hide' + (n.doors ? ' doors' : ''); ch.innerHTML = '';
    (n.choices || []).forEach((c, i) => {
      const li = document.createElement('li');
      const needs = arr(c.need).filter(x => !item(x).hidden);
      const needHtml = needs.length ? `<span class="needs">${needs.map(x => `<span class="need${S.inv.includes(x) ? '' : ' missing'}">${S.inv.includes(x) ? 'Use' : 'Needs'} ${item(x).icon} ${item(x).name}</span>`).join('')}</span>` : '';
      li.innerHTML = n.doors
        ? `<button class="choice door-btn" type="button"><span class="dsvg">${doorSVG(c.door || {})}</span><span class="t">${c.t}</span>${needHtml}</button>`
        : `<button class="choice" type="button"><span class="k">${i + 1}</span><span class="t">${c.t}</span><span class="arrow" aria-hidden="true">→</span>${needHtml}</button>`;
      li.querySelector('button').addEventListener('click', () => choose(n, i, li));
      ch.appendChild(li);
    });
    const ix = $('interact'); ix.innerHTML = ''; ix.className = 'interact hide';
    if (n.search) buildSearch(n, id);
    if (n.code) buildCode(n, id, same);
    const M = MECH.find(k => n[k]); if (M) buildMech(M, n);
    if (!same) window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    const reveal = () => { ch.classList.remove('hide'); ix.classList.remove('hide'); requestAnimationFrame(() => ch.classList.add('in')); if (n.timer) startTimer(n); if (mech) mech.start(); };
    const afterScare = () => typeText($('text'), n.text, same ? 0 : 1, reveal);
    if (n.sfx) SND.play(n.sfx);
    if (n.alert && !same) showAlerts(n.alert);
    if (n.scare && !same) { $('text').textContent = ''; scare(n.scare, afterScare); } else afterScare();
  }


  /* ---------- phone emergency alerts: node.alert = { kind, text } or an array of them ----------
     kind: 'extreme' (red), 'severe' (amber), 'test' (grey), 'clear' (green); optional head overrides the title. */
  function showAlerts(list) {
    const host = $('sceneImg'); let wrap = host.querySelector('.alerts');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'alerts'; host.appendChild(wrap); }
    arr(list).forEach((a, i) => setTimeout(() => {
      if (!host.contains(wrap)) return;
      const kind = a.kind || 'extreme';
      const head = a.head || ({ extreme: 'Extreme threat', severe: 'Severe threat', test: 'Test alert', clear: 'All clear' })[kind] || 'Emergency alert';
      const el = document.createElement('button'); el.type = 'button'; el.className = 'ealert ' + kind;
      el.innerHTML = `<span class="ico" aria-hidden="true">${kind === 'clear' ? '✓' : '⚠'}</span><span class="txt"><b>Emergency alert</b><i>${head}</i><span>${a.text}</span></span><span class="when mono">now</span>`;
      el.addEventListener('click', () => { el.classList.add('gone'); setTimeout(() => el.remove(), 300); });
      wrap.prepend(el);
      while (wrap.children.length > 3) wrap.lastChild.remove();
      if (SND.on) SND.alertTone();
      if (navigator.vibrate) try { navigator.vibrate([400, 120, 400, 120, 400]); } catch (e) { }
    }, i * 1400));
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
    lockChoices(); stopTimer(); stopMech();
    li.classList.add('picked');
    const host = n.doors ? outHost() : li;
    const go = () => resolve(r, host);
    if (r.scare) scare(r.scare, go); else go();
  }

  function lockChoices() {
    const ch = $('choices'); ch.classList.add('done');
    ch.querySelectorAll('.choice').forEach(b => b.disabled = true);
    $('interact').querySelectorAll('button,input').forEach(b => b.disabled = true);
    $('sceneImg').querySelectorAll('.spot').forEach(b => b.classList.add('off'));
  }
  function outHost() { const li = document.createElement('li'); li.className = 'dout'; $('choices').appendChild(li); return li; }

  /* apply an outcome (gain/lose/dmg/fatal/next) and show its text with a Continue button */
  function resolve(r, host) {
    {
      const fx = [];
      const gained = arr(r.gain).filter(g => !S.inv.includes(g));
      gained.forEach(g => S.inv.push(g));
      gained.filter(g => !item(g).hidden).forEach(g => fx.push(`<span class="fx gain">+ ${item(g).icon} ${item(g).name}</span>`));
      arr(r.lose).forEach(l => { S.inv = S.inv.filter(x => x !== l); });
      let dead = false;
      if (r.dmg) { S.lives = Math.max(0, S.lives - r.dmg); fx.push(`<span class="fx hurt">− ${r.dmg} life</span>`); hurt(); if (S.lives <= 0) dead = true; }
      if (r.fatal) { dead = true; fx.push('<span class="fx dead">Fatal</span>'); }
      if (gained.some(g => !item(g).hidden)) SND.pickup();
      S.steps++; save(); renderHud(gained);
      const box = document.createElement('div'); box.className = 'outcome';
      const label = dead ? (r.fatal ? 'Accept your fate' : 'Your last candle goes out') : (r.next === S.node ? 'Choose again' : 'Continue');
      box.innerHTML = `<p></p>${fx.length ? `<div class="effects">${fx.join('')}</div>` : ''}<button class="btn" type="button" hidden>${label} →</button>`;
      host.appendChild(box);
      const btn = box.querySelector('.btn');
      typeText(box.querySelector('p'), r.o || '', 1, () => { btn.hidden = false; btn.focus({ preventScroll: true }); box.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' }); });
      btn.addEventListener('click', () => {
        if (dead) return showDeath(r, !!r.fatal);
        const next = r.next || S.node;
        if (next === S.node) { lastNode = S.node; renderNode(story.nodes[S.node], S.node); }
        else goto(next);
      });
    }
  }

  /* ---------- puzzles: countdown, doors, picture search, keypad / typed codes ---------- */
  let timerId = null;
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } const t = document.getElementById('timer'); if (t) t.remove(); }
  function startTimer(n) {
    stopTimer();
    const secs = n.timer, bar = document.createElement('div'); bar.id = 'timer'; bar.className = 'timer';
    bar.innerHTML = `<span class="mono">${n.timerLabel || 'Decide'}</span><div class="track"><i></i></div><b class="mono">${secs}</b>`;
    $('choices').before(bar);
    const t0 = Date.now(), fill = bar.querySelector('i'), num = bar.querySelector('b');
    if (SND.on) SND.tick();
    timerId = setInterval(() => {
      const left = Math.max(0, secs - (Date.now() - t0) / 1000);
      fill.style.width = (left / secs * 100) + '%'; num.textContent = Math.ceil(left);
      bar.classList.toggle('urgent', left < Math.min(4, secs / 3));
      if (Math.ceil(left) !== Math.ceil(left + .1) && SND.on) SND.tick(left < 4);
      if (left <= 0) { stopTimer(); if (busy) return; stopMech(); busy = true; lockChoices(); const r = n.timeout || {}; const host = outHost(); const go = () => resolve(r, host); r.scare ? scare(r.scare, go) : go(); }
    }, 100);
  }

  function doorSVG(d) {
    const c = d.c || '#5a3e2a', dk = shadeHex(c, -.35), w = d.double ? 92 : 70, x = (100 - w) / 2;
    let s = `<svg viewBox="0 0 100 160" aria-hidden="true"><rect x="${x - 6}" y="8" width="${w + 12}" height="152" fill="${d.frame || '#2a2622'}"/>`;
    const leaf = (lx, lw) => {
      let g = `<rect x="${lx}" y="14" width="${lw}" height="146" fill="${c}"/><rect x="${lx + 4}" y="18" width="${lw - 8}" height="138" fill="none" stroke="${dk}" stroke-width="2"/>`;
      if (d.glass) g += `<rect x="${lx + lw / 2 - 7}" y="34" width="14" height="40" fill="${d.glass === true ? '#0b1020' : d.glass}" stroke="${dk}" stroke-width="2"/>`;
      if (d.steel) g += `<rect x="${lx}" y="14" width="${lw}" height="146" fill="url(#st)" opacity=".5"/>`;
      return g;
    };
    if (d.steel) s += `<defs><linearGradient id="st" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".2"/></linearGradient></defs>`;
    if (d.double) { s += leaf(x, w / 2 - 1) + leaf(x + w / 2 + 1, w / 2 - 1); s += `<rect x="${50 - 9}" y="88" width="6" height="16" rx="2" fill="#c9c2b0"/><rect x="${50 + 3}" y="88" width="6" height="16" rx="2" fill="#c9c2b0"/>`; }
    else { s += leaf(x, w); s += d.steel ? `<rect x="${x + w - 16}" y="80" width="6" height="24" rx="2" fill="#d8d8d8"/>` : `<rect x="${x + w - 18}" y="88" width="12" height="4" rx="2" fill="#c9c2b0"/><circle cx="${x + w - 15}" cy="90" r="3" fill="#c9c2b0"/>`; }
    if (d.sign) s += `<rect x="${50 - 30}" y="${d.glass ? 80 : 40}" width="60" height="16" rx="2" fill="${d.signC || '#f3efe4'}"/><text x="50" y="${d.glass ? 91.5 : 51.5}" font-family="Arial,sans-serif" font-size="${d.sign.length > 10 ? 6.5 : 8}" font-weight="700" text-anchor="middle" fill="${d.signT || '#222'}">${d.sign}</text>`;
    if (d.light) s += `<rect x="${x}" y="156" width="${w}" height="4" fill="${d.light}"/><ellipse cx="50" cy="160" rx="${w / 1.6}" ry="8" fill="${d.light}" opacity=".35"/>`;
    if (d.mark) s += `<path d="M${x + 12},60 l14,50 M${x + 18},56 l14,52 M${x + 24},58 l12,48" stroke="${d.mark}" stroke-width="2.4" opacity=".75"/>`;
    return s + '</svg>';
  }
  function shadeHex(h, t) { h = h.replace('#', ''); const n = parseInt(h, 16); const k = v => Math.max(0, Math.min(255, Math.round(t < 0 ? v * (1 + t) : v + (255 - v) * t))); return '#' + [n >> 16 & 255, n >> 8 & 255, n & 255].map(v => k(v).toString(16).padStart(2, '0')).join(''); }

  function buildSearch(n, id) {
    S.found = S.found || {}; const got = S.found[id] = S.found[id] || [];
    const svg = $('sceneImg').querySelector('svg'), NS = 'http://www.w3.org/2000/svg';
    const sp = n.search.spots;
    sp.forEach((p, k) => {
      if (svg) {
        const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'spot' + (got.includes(k) ? ' got' : '')); g.dataset.k = k;
        g.innerHTML = `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="6"/><circle class="glint" cx="${p.x + p.w / 2}" cy="${p.y + p.h / 2}" r="7"/>`;
        g.addEventListener('click', () => searchSpot(n, id, k));
        svg.appendChild(g);
      }
    });
    const box = document.createElement('div'); box.className = 'search';
    box.innerHTML = `<div class="mono slabel">${n.search.prompt || 'Search: tap the picture, or pick a spot'}</div><div class="spotlist">${sp.map((p, k) => `<button type="button" class="schip${got.includes(k) ? ' got' : ''}" data-k="${k}">${p.t}</button>`).join('')}</div><p class="snote" id="snote" aria-live="polite"></p>`;
    box.querySelectorAll('.schip').forEach(b => b.addEventListener('click', () => searchSpot(n, id, +b.dataset.k)));
    $('interact').appendChild(box);
  }
  function searchSpot(n, id, k) {
    if (busy) return; SND.init();
    if (typing && finishTyping) finishTyping();
    const p = n.search.spots[k], got = S.found[id], first = !got.includes(k);
    const show = () => {
      const fx = []; let dead = false, gained = [];
      if (first) {
        got.push(k);
        gained = arr(p.gain).filter(g => !S.inv.includes(g)); gained.forEach(g => S.inv.push(g));
        gained.filter(g => !item(g).hidden).forEach(g => fx.push(`<span class="fx gain">+ ${item(g).icon} ${item(g).name}</span>`));
        if (p.dmg) { S.lives = Math.max(0, S.lives - p.dmg); fx.push(`<span class="fx hurt">− ${p.dmg} life</span>`); hurt(); dead = S.lives <= 0; }
        if (gained.some(g => !item(g).hidden)) SND.pickup();
        save(); renderHud(gained);
      }
      document.querySelectorAll(`.spot[data-k="${k}"], .schip[data-k="${k}"]`).forEach(e => e.classList.add('got'));
      const note = $('snote'); note.innerHTML = `<b>${p.t}.</b> <span></span>${fx.length ? `<span class="effects">${fx.join('')}</span>` : ''}`;
      typeText(note.querySelector('span'), first ? p.o : (p.again || 'Nothing else there.'), first ? 1 : 0, null);
      if (dead) setTimeout(() => showDeath(p, false), 1600);
    };
    if (first && p.scare) scare(p.scare, show); else show();
  }

  const norm = v => String(v).toUpperCase().replace(/[^A-Z0-9]/g, '');
  function buildCode(n, id, same) {
    const cd = n.code; S.tries = S.tries || {};
    if (!same || S.tries[id] == null) S.tries[id] = cd.tries || 3;
    const letters = cd.kind === 'letters', len = cd.len || String(arr(cd.answer)[0]).length;
    const box = document.createElement('div'); box.className = 'code' + (letters ? ' letters' : ''); box.id = 'codebox';
    const clue = cd.clue && (!cd.clue.need || has(cd.clue.need)) ? `<p class="clue">${cd.clue.t}</p>` : '';
    box.innerHTML = `<div class="mono clabel">${cd.prompt || 'Enter the code'}</div>
      ${letters ? `<div class="crow"><input id="cin" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="${cd.max || 24}" aria-label="${cd.prompt || 'Answer'}"><button type="button" class="btn" id="cok">${cd.button || 'Write it'}</button></div>`
        : `<div class="slots" id="slots">${'<span></span>'.repeat(len)}</div><div class="keys" id="codeKeys">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, '✓'].map(k => `<button type="button" data-k="${k}"${k === '✓' ? ' class="ok"' : ''}>${k}</button>`).join('')}</div>`}
      <div class="mono tries" id="ctries">${S.tries[id]} ${S.tries[id] === 1 ? 'try' : 'tries'} left</div><p class="cmsg" id="cmsg" aria-live="polite"></p>${clue}`;
    $('interact').appendChild(box);
    let val = '';
    const draw = () => box.querySelectorAll('#slots span').forEach((sl, i) => { sl.textContent = val[i] || ''; sl.classList.toggle('on', i < val.length); });
    const submit = () => {
      if (busy) return; SND.init();
      const guess = letters ? $('cin').value : val; if (!norm(guess)) return;
      if (arr(cd.answer).map(norm).includes(norm(guess))) {
        busy = true; box.classList.add('right'); lockChoices(); stopTimer(); stopMech(); if (SND.on) SND.chime();
        const r = cd.ok || {}; const go = () => resolve(r, box); setTimeout(() => r.scare ? scare(r.scare, go) : go(), 450); return;
      }
      S.tries[id]--; save();
      box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake'); if (SND.on) SND.buzz();
      const w = cd.wrong || {}; let dead = false;
      if (w.dmg) { S.lives = Math.max(0, S.lives - w.dmg); hurt(); renderHud(); dead = S.lives <= 0; }
      $('cmsg').textContent = (w.o || 'Wrong.') + (w.dmg ? ` (− ${w.dmg} life)` : '');
      $('ctries').textContent = `${S.tries[id]} ${S.tries[id] === 1 ? 'try' : 'tries'} left`;
      val = ''; draw(); if (letters) $('cin').value = '';
      if (dead) { busy = true; return setTimeout(() => showDeath(w, false), 1200); }
      if (S.tries[id] <= 0) { busy = true; lockChoices(); stopTimer(); const r = cd.out || {}; const go = () => resolve(r, box); setTimeout(() => r.scare ? scare(r.scare, go) : go(), 500); }
    };
    if (letters) { $('cok').addEventListener('click', submit); $('cin').addEventListener('keydown', e => { if (e.key === 'Enter') submit(); }); }
    else box.querySelectorAll('#codeKeys button').forEach(b => b.addEventListener('click', () => codeKey(b.dataset.k)));
    codeKey = k => {
      if (busy || letters) return; SND.init();
      if (k === '⌫') val = val.slice(0, -1); else if (k === '✓') return submit(); else if (val.length < len) { val += k; if (SND.on) SND.beep(); }
      draw(); if (val.length === len && cd.auto !== false) setTimeout(submit, 250);
    };
  }
  let codeKey = null;

  /* ---------- action puzzles: hold, breathe (rhythm), sweep (dodge the light), mash ----------
     Each lives on a node as hold: {...} | breathe: {...} | sweep: {...} | mash: {...} with ok: {o,next,gain,…}
     and fail: {o,next,dmg,scare,fatal,…}. They start when the scene text has finished, and are cancelled
     when the scene changes. Space / Enter or tapping the big button drives them. */
  const MECH = ['hold', 'breathe', 'sweep', 'mash'];
  let mech = null;
  function stopMech() { if (mech) { const m = mech; mech = null; try { m.stop(); } catch (e) { } } }
  function mechEnd(r, box, won) {
    if (busy) return; busy = true;
    const m = mech; mech = null; if (m) try { m.stop(); } catch (e) { }
    lockChoices(); stopTimer();
    box.classList.add(won ? 'won' : 'lost');
    if (SND.on) won ? SND.chime() : SND.buzz();
    const go = () => resolve(r || {}, box); setTimeout(() => r && r.scare ? scare(r.scare, go) : go(), 350);
  }
  function loop(fn) { let id = 0, last = performance.now(), on = true; const tick = now => { if (!on) return; const dt = Math.min(.1, (now - last) / 1000); last = now; fn(dt); if (on) id = requestAnimationFrame(tick); }; id = requestAnimationFrame(tick); return () => { on = false; cancelAnimationFrame(id); }; }

  function buildMech(kind, n) {
    const cfg = n[kind], box = document.createElement('div'); box.className = 'mech mech-' + kind;
    $('interact').appendChild(box);
    const prompt = `<div class="mono clabel">${cfg.prompt || ''}</div>`;
    const status = t => { const el = box.querySelector('.mstat'); if (el) el.innerHTML = t; };
    let stopLoop = null, started = false;
    const M = { kind, box, start() { }, stop() { stopLoop && stopLoop(); }, key: null };

    if (kind === 'hold') {
      /* press and hold for `secs`; let go early, or fail to start within `grace`, and you're heard */
      const secs = cfg.secs || 6, grace = cfg.grace || 3, lines = cfg.lines || [];
      box.innerHTML = `${prompt}<div class="hbar"><i></i></div><button type="button" class="hbtn">${cfg.label || 'Hold your breath'}</button><p class="mstat mono">Press and hold. Don’t let go.</p>`;
      const fill = box.querySelector('.hbar i'), btn = box.querySelector('.hbtn');
      let held = false, prog = 0, wait = 0, beat = 0, shown = -1;
      const down = () => { if (!started || busy || held) return; held = true; btn.classList.add('on'); status('Holding…'); };
      const up = () => { if (!started || busy || !held) return; held = false; btn.classList.remove('on'); if (prog < 1) mechEnd(cfg.fail, box); };
      btn.addEventListener('pointerdown', e => { e.preventDefault(); try { btn.setPointerCapture(e.pointerId); } catch (x) { } down(); });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => btn.addEventListener(ev, up));
      btn.addEventListener('contextmenu', e => e.preventDefault());
      M.key = (isDown, e) => { if (!started) return false; if (e && e.repeat) return true; isDown ? down() : up(); return true; };
      M.start = () => {
        started = true; btn.classList.add('ready');
        stopLoop = loop(dt => {
          if (busy) return;
          if (!held) { wait += dt; fill.style.width = '0%'; status(`Press and hold. ${Math.max(0, Math.ceil(grace - wait))}…`); if (wait >= grace) mechEnd(cfg.late || cfg.fail, box); return; }
          prog = Math.min(1, prog + dt / secs); fill.style.width = (prog * 100) + '%';
          beat += dt; const rate = .9 - prog * .55; if (beat > rate) { beat = 0; SND.on && SND.heart(); }
          const li = Math.floor(prog * lines.length); if (li !== shown && li < lines.length) { shown = li; status(lines[li]); }
          box.classList.toggle('shake', prog > .55);
          if (prog >= 1) { held = false; btn.classList.remove('on'); mechEnd(cfg.ok, box, true); }
        });
      };
    }

    if (kind === 'breathe') {
      /* tap at the top of each breath, in time with the ward. On a held breath ("they stop"), don't tap at all. */
      const beats = cfg.beats || 8, need = cfg.need || beats - 2, base = cfg.period || 2.4, holds = cfg.holds || [];
      const plan = Array.from({ length: beats }, (_, i) => ({ p: base * (1 + (cfg.drift ? (Math.random() - .5) * cfg.drift : 0)), hold: holds.includes(i) }));
      box.innerHTML = `${prompt}<div class="lungs"><div class="ring"></div><div class="core"></div><span class="mono rlab">in</span></div><div class="dots">${plan.map(b => `<i class="${b.hold ? 'h' : ''}"></i>`).join('')}</div><button type="button" class="hbtn">${cfg.label || 'Breathe'}</button><p class="mstat mono">Tap as the ring fills: at the top of each breath. When they stop, you stop.</p>`;
      const ring = box.querySelector('.ring'), lab = box.querySelector('.rlab'), dots = box.querySelectorAll('.dots i'), btn = box.querySelector('.hbtn');
      let i = 0, t = 0, hits = 0, miss = 0, tapped = false, breathed = false;
      const tol = cfg.tol || .2;
      const mark = (ok, why) => { dots[i].classList.add(ok ? 'ok' : 'x'); ok ? hits++ : miss++; if (!ok) { SND.on && SND.buzz(); box.classList.remove('flinch'); void box.offsetWidth; box.classList.add('flinch'); status(why); } else status(plan[i].hold ? 'Still. Good.' : 'In time with them.'); };
      const tap = () => {
        if (!started || busy || i >= beats || tapped) return; tapped = true;
        const b = plan[i], ph = t / b.p;
        if (b.hold) return mark(false, 'They stopped. You didn’t.');
        mark(Math.abs(ph - .5) < tol, ph < .5 ? 'Too soon.' : 'Too late.');
        check();
      };
      const check = () => { if (miss > beats - need) mechEnd(cfg.fail, box); };
      btn.addEventListener('pointerdown', e => { e.preventDefault(); tap(); });
      M.key = (isDown, e) => { if (!started) return false; if (isDown && !(e && e.repeat)) tap(); return true; };
      M.start = () => {
        started = true;
        stopLoop = loop(dt => {
          if (busy || i >= beats) return;
          const b = plan[i]; t += dt; const ph = Math.min(1, t / b.p);
          if (!breathed) { breathed = true; if (!b.hold && SND.on) SND.breath(b.p, .4); }
          const sc = b.hold ? .42 : .42 + .58 * Math.sin(ph * Math.PI);
          ring.style.transform = `scale(${sc.toFixed(3)})`;
          ring.classList.toggle('peak', !b.hold && Math.abs(ph - .5) < tol);
          box.classList.toggle('held', b.hold);
          lab.textContent = b.hold ? 'stop' : ph < .5 ? 'in' : 'out';
          if (t >= b.p) {
            if (!tapped) b.hold ? mark(true) : mark(false, 'You missed a breath.');
            if (busy) return;
            check(); if (busy) return;
            i++; t = 0; tapped = false; breathed = false;
            if (i >= beats) mechEnd(hits >= need ? cfg.ok : cfg.fail, box, hits >= need);
          }
        });
      };
    }

    if (kind === 'sweep') {
      /* cross from cover to cover; only move while the beam is somewhere else. It reverses and pauses at random. */
      const moves = cfg.moves || 5, slots = moves + 1, secs = cfg.secs || 40, w = cfg.width || .11;
      let speed = cfg.speed || .32, pos = .98, dir = -1, pause = 0, next = 1.2, i = 0, moving = 0, from = 0, left = secs, me = (.5) / slots;
      const covers = Array.from({ length: slots }, (_, k) => `<span class="cov${k === slots - 1 ? ' goal' : ''}" style="left:${(k + .5) / slots * 100}%">${k === slots - 1 ? (cfg.goal || 'Here') : (cfg.cover || '')}</span>`).join('');
      box.innerHTML = `${prompt}<div class="lane"><i class="beam"></i>${covers}<b class="me"></b></div><div class="srow"><button type="button" class="hbtn">${cfg.label || 'Move'}</button><span class="mono sinfo"></span></div><p class="mstat mono">Move only when the light is away from you.</p>`;
      const beam = box.querySelector('.beam'), meEl = box.querySelector('.me'), btn = box.querySelector('.hbtn'), info = box.querySelector('.sinfo');
      const draw = () => { beam.style.left = (pos * 100) + '%'; beam.style.width = (w * 200) + '%'; meEl.style.left = (me * 100) + '%'; info.textContent = `${i} of ${moves} · ${Math.ceil(left)}s`; };
      const go = () => { if (!started || busy || moving) return; moving = .42; from = me; SND.on && SND.tick(); };
      btn.addEventListener('pointerdown', e => { e.preventDefault(); go(); });
      M.key = (isDown, e) => { if (!started) return false; if (isDown && !(e && e.repeat)) go(); return true; };
      draw();
      M.start = () => {
        started = true;
        stopLoop = loop(dt => {
          if (busy) return;
          left -= dt; if (left <= 0) return mechEnd(cfg.late || cfg.fail, box);
          next -= dt; if (next <= 0) { next = .9 + Math.random() * 1.6; const r = Math.random(); if (r < .3) dir *= -1; else if (r < .5) { pause = .5 + Math.random() * .9; status(cfg.pauseText || 'The light stops. Listening.'); } else if (r < .62) speed = (cfg.speed || .32) * (1.25 + Math.random() * .4); else speed = cfg.speed || .32; }
          if (pause > 0) pause -= dt; else { pos += dir * speed * dt; if (pos < .02) { pos = .02; dir = 1; } if (pos > .98) { pos = .98; dir = -1; } }
          if (moving) {
            moving = Math.max(0, moving - dt); const to = (i + 1.5) / slots; me = from + (to - from) * (1 - moving / .42);
            if (Math.abs(pos - me) < w) { draw(); box.classList.add('lit'); return mechEnd(cfg.fail, box); }
            if (!moving) { i++; me = to; status(i >= moves ? '' : 'In cover. Wait for it.'); if (i >= moves) { draw(); return mechEnd(cfg.ok, box, true); } }
          }
          box.classList.toggle('near', Math.abs(pos - me) < w * 2.2);
          draw();
        });
      };
    }

    if (kind === 'mash') {
      /* hammer the button: the bar fills with every tap and drains on its own */
      const taps = cfg.taps || 18, secs = cfg.secs || 5, drain = cfg.drain == null ? .14 : cfg.drain;
      box.innerHTML = `${prompt}<div class="hbar"><i></i></div><button type="button" class="hbtn">${cfg.label || 'Pull'}</button><p class="mstat mono">Tap as fast as you can. Space works too.</p>`;
      const fill = box.querySelector('.hbar i'), btn = box.querySelector('.hbtn');
      let v = 0, left = secs;
      const hit = () => { if (!started || busy) return; v = Math.min(1, v + 1 / taps); btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump'); SND.on && SND.tick(true); if (v >= 1) mechEnd(cfg.ok, box, true); };
      btn.addEventListener('pointerdown', e => { e.preventDefault(); hit(); });
      M.key = (isDown, e) => { if (!started) return false; if (isDown && !(e && e.repeat)) hit(); return true; };
      M.start = () => {
        started = true; btn.classList.add('ready');
        stopLoop = loop(dt => {
          if (busy) return;
          left -= dt; v = Math.max(0, v - drain * dt); fill.style.width = (v * 100) + '%';
          status(`${Math.max(0, left).toFixed(1)}s`);
          if (left <= 0) mechEnd(cfg.fail, box);
        });
      };
    }
    mech = M;
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
    stopTimer(); stopMech();
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
    stopTimer(); stopMech();
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
  $('backBtn').addEventListener('click', () => { stopTimer(); stopMech(); save(); renderHome(); });
  $('sndBtn').addEventListener('click', () => { SND.init(); SND.setOn(!SND.on); renderHud(); if (SND.on && story) SND.setMood((story.nodes[S.node] || {}).mood); });
  document.addEventListener('keydown', e => {
    if ($('play').hidden || !$('screen').hidden || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target && e.target.tagName === 'INPUT') return;
    const kp = document.getElementById('codeKeys');
    if (kp && !busy && codeKey) { if (/^[0-9]$/.test(e.key)) { codeKey(e.key); return; } if (e.key === 'Backspace') { codeKey('⌫'); return; } if (e.key === 'Enter') { codeKey('✓'); return; } }
    if ((e.key === ' ' || e.key === 'Enter') && mech && mech.key && !busy && mech.key(true, e)) { e.preventDefault(); return; }
    if (['1', '2', '3', '4'].includes(e.key)) { const b = document.querySelectorAll('#choices .choice')[+e.key - 1]; if (b && !b.disabled && $('choices').classList.contains('in')) b.click(); else if (typing && finishTyping) finishTyping(); }
    if ((e.key === ' ' || e.key === 'Enter') && typing && finishTyping && document.activeElement === document.body) { e.preventDefault(); finishTyping(); }
  });

  document.addEventListener('keyup', e => { if ((e.key === ' ' || e.key === 'Enter') && mech && mech.key) mech.key(false, e); });
  window.addEventListener('blur', () => { if (mech && mech.key) mech.key(false, {}); });

  /* keep a game in progress across live page updates */
  window.claude?.hot?.snapshot?.(() => ({ S, storyId: story && story.id, inPlay: !$('play').hidden }));
  function boot(data) {
    data = data || {};
    if (data.inPlay && data.S && NIGHTDOOR.stories[data.storyId]) { story = NIGHTDOOR.stories[data.storyId]; S = data.S; $('home').hidden = true; $('play').hidden = false; renderHud(); goto(S.node, true); }
    else renderHome();
  }
  window.claude?.hot?.ready ? window.claude.hot.ready(boot) : boot(window.claude?.hot?.data ?? {});
})();
