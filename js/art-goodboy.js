/* NIGHTDOOR art for "Good Boy": new-build estate, the wood, the brook, Bramble and the thing wearing him.
   Adds scenes to ART (800x400) and jump scares (600x600) using the shared toolkit. */
(function () {
  'use strict';
  const { kit, f, mix, shade, rng, grinMouth, slackMouth, splitMouth, person, at, house, tree, S, SC, SVB } = ART.lib;
  let N = 0;

  /* ---------- palettes ---------- */
  const P = {
    day:    { sky: [[0, '#6fbde8'], [1, '#d8eff8']], wood: '#3f6b3a', wood2: '#2f5530', lawn: '#86c46e', pave: '#d9d3c6', road: '#9a9ea6', sun: '#fff3b8', clouds: true },
    golden: { sky: [[0, '#e9925a'], [.6, '#f6c886'], [1, '#fbe7b5']], wood: '#4e5a2c', wood2: '#3a4422', lawn: '#9cb85e', pave: '#e0cfb0', road: '#a5998a', sun: '#ffe2a0', tint: ['#ff9a3c', .18] },
    dusk:   { sky: [[0, '#1d1233'], [.55, '#7a2f5c'], [1, '#e2774a']], wood: '#1f1a28', wood2: '#15111c', lawn: '#3e4a52', pave: '#6c6370', road: '#4d4a58', moon: true, stars: true, tint: ['#2b1048', .45] },
    night:  { sky: [[0, '#02040a'], [1, '#0c1530']], wood: '#060a12', wood2: '#03060b', lawn: '#0d1622', pave: '#1c2129', road: '#14181f', moon: true, stars: true, tint: ['#081026', .55] },
    blood:  { sky: [[0, '#0c0101'], [1, '#4a0a08']], wood: '#140303', wood2: '#0a0101', lawn: '#1c0606', pave: '#2a0c0a', road: '#1a0606', moon: 'red', tint: ['#300404', .35] },
    dawn:   { sky: [[0, '#9fc7e6'], [.55, '#f8d7c4'], [1, '#ffd29a']], wood: '#5a7a52', wood2: '#46653f', lawn: '#8cc274', pave: '#ddd2c6', road: '#a3a0a4', sun: '#fff0c4', low: true }
  };
  const BRICK = ['#c9845e', '#d49a72', '#b97556', '#e0b08a'];

  function sky(K, m) {
    const p = P[m];
    let s = `<rect width="800" height="400" fill="${K.lin('sk' + (++N), p.sky)}"/>`;
    if (p.sun) { const x = p.low ? 520 : 660, y = p.low ? 200 : 66; s += `<circle cx="${x}" cy="${y}" r="${p.low ? 54 : 30}" fill="${p.sun}"/><circle cx="${x}" cy="${y}" r="${p.low ? 110 : 66}" fill="${p.sun}" opacity=".24"/>`; }
    if (p.clouds) s += `<g fill="#fff" opacity=".9"><ellipse cx="150" cy="62" rx="58" ry="15"/><ellipse cx="186" cy="52" rx="34" ry="16"/><ellipse cx="470" cy="96" rx="44" ry="12"/><ellipse cx="494" cy="88" rx="24" ry="10"/></g>`;
    if (p.stars) { const r = rng(9); for (let i = 0; i < 44; i++) s += `<circle cx="${f(r() * 800)}" cy="${f(r() * 150)}" r="${f(r() * 1.2 + .3)}" fill="#fff" opacity="${f(r() * .6 + .2)}"/>`; }
    if (p.moon) { const red = p.moon === 'red'; s += `<circle cx="640" cy="62" r="22" fill="${red ? '#ff5a3a' : '#f3e9d2'}"/><circle cx="640" cy="62" r="64" fill="${red ? '#ff3a2a' : '#f3e9d2'}" opacity=".12"/>`; if (!red) s += `<circle cx="648" cy="57" r="19" fill="${p.sky[0][1]}"/>`; }
    return s;
  }
  function tint(m, o) { const t = P[m].tint; return t ? `<rect width="800" height="400" fill="${t[0]}" opacity="${o != null ? o : t[1]}" style="mix-blend-mode:multiply"/>` : ''; }

  /* the wood: a jagged band of dark trees */
  function treeline(m, top = 120, base = 230, seed = 3) {
    const p = P[m], r = rng(seed);
    let s = `<rect x="0" y="${base - 30}" width="800" height="40" fill="${p.wood2}"/>`;
    for (let i = 0; i < 34; i++) {
      const x = i * 25 + r() * 14 - 10, h = (base - top) * (.6 + r() * .5), w = 26 + r() * 24;
      s += `<polygon points="${f(x - w / 2)},${base} ${f(x)},${f(base - h)} ${f(x + w / 2)},${base}" fill="${i % 2 ? p.wood : p.wood2}"/>`;
    }
    return s;
  }
  /* big trunks for being inside the wood */
  function trunks(m, seed = 4, dark) {
    const r = rng(seed); const c = dark || P[m].wood2;
    let s = '';
    for (let i = 0; i < 11; i++) {
      const x = i * 78 + r() * 40 - 20, w = 18 + r() * 30;
      s += `<path d="M${f(x - w / 2)},400 L${f(x - w / 3)},0 L${f(x + w / 3)},0 L${f(x + w / 2)},400Z" fill="${shade(c, -.1 + r() * .2)}"/>`;
      s += `<path d="M${f(x)},${f(60 + r() * 120)} q${f(40 + r() * 40)},-30 ${f(80 + r() * 50)},-60" stroke="${c}" stroke-width="${f(5 + r() * 5)}" fill="none"/>`;
      s += `<path d="M${f(x)},${f(40 + r() * 100)} q-${f(40 + r() * 40)},-20 -${f(80 + r() * 40)},-50" stroke="${c}" stroke-width="${f(4 + r() * 4)}" fill="none"/>`;
    }
    return s;
  }

  /* eyeshine: flat white coins */
  const coin = (x, y, r = 3) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 3.2)}" fill="#f4f7ee" opacity=".16"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#f6f8f2"/>`;

  /* ---------- Bramble ---------- */
  function bramble(x, b, s, o = {}) {
    const c = o.c || '#dca65e', d = shade(c, -.28), l = shade(c, .25);
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${o.flip ? -s : s},${s})">`;
    g += `<ellipse cx="0" cy="0" rx="40" ry="5" fill="#000" opacity=".22"/>`;
    if (o.sit) {
      g += `<path d="M-26,-6 Q-40,-30 -14,-56 Q6,-70 22,-52 L26,-6Z" fill="${c}"/>`;
      g += `<ellipse cx="-20" cy="-10" rx="18" ry="12" fill="${d}"/>`;
      g += `<rect x="14" y="-44" width="8" height="44" rx="3" fill="${c}"/><rect x="22" y="-44" width="8" height="44" rx="3" fill="${d}"/>`;
      g += `<path d="M-32,-8 q-22,-2 -30,-18" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
      g += head(26, -64, c, d, l, o);
    } else {
      g += `<path d="M-38,-26 q-20,-20 -24,-36" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
      g += `<ellipse cx="0" cy="-30" rx="40" ry="17" fill="${c}"/><ellipse cx="0" cy="-22" rx="34" ry="9" fill="${l}" opacity=".5"/>`;
      [[-30, d], [-18, c], [20, d], [30, c]].forEach(([lx, lc]) => g += `<rect x="${lx - 4}" y="-26" width="8" height="26" rx="3" fill="${lc}"/>`);
      if (o.wrong) g += `<path d="M-34,-40 Q0,-56 36,-44" stroke="${shade(c, -.45)}" stroke-width="3" fill="none" stroke-dasharray="4 4"/>`;
      g += head(40, -48, c, d, l, o);
    }
    if (o.fingers) g += `<path d="M24,-2 l6,6 M28,-2 l8,4 M31,-3 l9,1" stroke="#d9d2c6" stroke-width="2.4" stroke-linecap="round"/>`;
    return g + '</g>';
  }
  function head(hx, hy, c, d, l, o) {
    let g = `<circle cx="${hx}" cy="${hy}" r="15" fill="${c}"/>`;
    g += `<ellipse cx="${hx + 14}" cy="${hy + 5}" rx="12" ry="8" fill="${l}"/><ellipse cx="${hx + 25}" cy="${hy + 2}" rx="3.6" ry="3" fill="#2a1a12"/>`;
    g += `<path d="M${hx - 8},${hy - 10} q-10,6 -6,22 q6,2 10,-6" fill="${d}"/>`;
    if (o.eyes) g += coin(hx + 5, hy - 4, 2.6);
    else g += `<circle cx="${hx + 5}" cy="${hy - 4}" r="2.4" fill="#1a120c"/><circle cx="${hx + 5.8}" cy="${hy - 4.8}" r=".8" fill="#fff"/>`;
    if (o.grin) g += slackMouth(hx + 16, hy + 9, 12, 7, { tc: '#b84a56' }) + `<path d="M${hx + 18},${hy + 14} q2,14 -2,24 q-4,4 -5,-2" stroke="#b84a56" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
    else if (o.tongue) g += `<path d="M${hx + 14},${hy + 11} q3,10 8,0Z" fill="#e2707a"/>`;
    return g;
  }
  /* Bramble standing up on his back legs like a person */
  function brambleUp(x, b, s, o = {}) {
    const c = o.c || '#dca65e', d = shade(c, -.28), l = shade(c, .25);
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${s})">`;
    g += `<path d="M-10,0 L-12,-40 M10,0 L12,-40" stroke="${d}" stroke-width="9" stroke-linecap="round"/>`;
    g += `<path d="M-18,-36 Q-24,-80 -12,-118 Q0,-128 12,-118 Q24,-80 18,-36Z" fill="${c}"/>`;
    g += `<path d="M-12,-110 Q-24,-80 -22,-54 M12,-110 Q24,-80 22,-54" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M-22,-54 l-3,10 M-22,-54 l0,12 M-21,-54 l3,10 M22,-54 l3,10 M22,-54 l0,12 M21,-54 l-3,10" stroke="#d9d2c6" stroke-width="2"/>`;
    g += `<circle cx="0" cy="-136" r="17" fill="${c}"/><ellipse cx="0" cy="-124" rx="11" ry="9" fill="${l}"/><ellipse cx="0" cy="-122" rx="4" ry="3" fill="#2a1a12"/>`;
    g += `<path d="M-15,-146 q-8,8 -4,24 M15,-146 q8,8 4,24" stroke="${d}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    g += coin(-6, -140, 2.6) + coin(6, -140, 2.6);
    if (o.slip) g += `<path d="M-17,-150 Q0,-160 17,-150 L14,-138 Q0,-146 -14,-138Z" fill="#cfc8bc"/><ellipse cx="0" cy="-152" rx="5" ry="2" fill="#2a0808"/>`;
    return g + '</g>';
  }

  /* ---------- the thing ---------- */
  function walker(x, b, h, o = {}) {
    const k = h / 300, pale = o.pale || '#d6d0c4', pelt = o.pelt === false ? null : (o.pelt || '#c4924e');
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${f(k)})"${o.op ? ` opacity="${o.op}"` : ''}>`;
    g += `<path d="M-10,0 L-22,-64 L-9,-132 M10,0 L22,-64 L9,-132" stroke="${pale}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    g += `<path d="M-17,-128 Q-20,-180 -13,-222 L13,-222 Q20,-180 17,-128Z" fill="${pale}"/>`;
    for (let i = 0; i < 5; i++) g += `<path d="M-12,${-200 + i * 12} q12,5 24,0" stroke="${shade(pale, -.3)}" stroke-width="1.6" fill="none"/>`;
    const armL = o.reach ? `M-12,-212 Q-60,-200 ${o.reach[0]},${o.reach[1]}` : 'M-12,-212 Q-42,-150 -38,-56';
    g += `<path d="${armL} M12,-212 Q42,-150 38,-56" stroke="${pale}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    if (!o.reach) g += `<path d="M-38,-56 l-6,30 M-38,-56 l-1,32 M-38,-56 l5,30 M38,-56 l6,30 M38,-56 l1,32 M38,-56 l-5,30" stroke="${pale}" stroke-width="2.6" stroke-linecap="round"/>`;
    if (pelt) g += `<path d="M-26,-214 Q-34,-266 0,-284 Q34,-266 26,-214 L32,-170 Q0,-186 -32,-170Z" fill="${pelt}"/>`;
    g += `<ellipse cx="0" cy="-246" rx="15" ry="27" fill="${shade(pale, -.05)}"/>`;
    if (pelt) g += `<path d="M-24,-262 q-16,10 -10,40 M24,-262 q16,10 10,40" stroke="${shade(pelt, -.25)}" stroke-width="10" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-283" rx="12" ry="7" fill="${shade(pelt, .15)}"/>`;
    g += coin(-6, -252, 3) + coin(6, -252, 3);
    g += splitMouth(0, -244, -220, 6, { teeth: 5, lw: 1, long: .5 });
    return g + '</g>';
  }

  /* ---------- people (full figures) ---------- */
  function adult(x, b, s, o = {}) {
    const skin = o.skin || '#ecc8aa', cloth = o.cloth || '#3d5a80', hair = o.hair || '#4a3020', leg = o.leg || '#2a2f3a';
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${s})"${o.op ? ` opacity="${o.op}"` : ''}>`;
    g += `<rect x="-11" y="-60" width="9" height="60" fill="${leg}"/><rect x="2" y="-60" width="9" height="60" fill="${leg}"/>`;
    g += `<path d="M-18,-58 L-16,-120 Q0,-128 16,-120 L18,-58Z" fill="${cloth}"/>`;
    const armsL = o.armsOut ? 'M-15,-114 L-42,-96' : 'M-15,-114 L-22,-64', armsR = o.armsOut ? 'M15,-114 L42,-96' : (o.wave ? 'M15,-114 L30,-150' : 'M15,-114 L22,-64');
    g += `<path d="${armsL} ${armsR}" stroke="${cloth}" stroke-width="8" stroke-linecap="round"/>`;
    if (o.bandage) g += `<circle cx="22" cy="-62" r="6" fill="#f4f2ec"/><circle cx="23" cy="-60" r="2" fill="#b8323a"/>`;
    g += `<rect x="-5" y="-134" width="10" height="10" fill="${shade(skin, -.12)}"/>`;
    g += `<ellipse cx="0" cy="-146" rx="13" ry="16" fill="${skin}"/>`;
    if (o.long) g += `<path d="M-14,-150 Q-16,-166 0,-166 Q16,-166 14,-150 L17,-118 L11,-118 L10,-148 Q0,-156 -10,-148 L-11,-118 L-17,-118Z" fill="${hair}"/>`;
    else if (o.bun) g += `<circle cx="0" cy="-166" r="8" fill="${hair}"/><path d="M-13,-148 Q-14,-162 0,-162 Q14,-162 13,-148 Q6,-156 -13,-148Z" fill="${hair}"/>`;
    else g += `<path d="M-13,-148 Q-14,-164 0,-164 Q14,-164 13,-148 Q4,-156 -13,-148Z" fill="${hair}"/>`;
    if (o.back) g += `<path d="M-13,-150 Q-14,-164 0,-164 Q14,-164 13,-150 L13,-138 Q0,-134 -13,-138Z" fill="${hair}"/>`;
    else if (o.eyes) g += coin(-5, -148, 2.2) + coin(5, -148, 2.2);
    else g += `<circle cx="-5" cy="-148" r="1.6" fill="#111"/><circle cx="5" cy="-148" r="1.6" fill="#111"/>`;
    if (!o.back) {
      if (o.grin === 'torn') g += splitMouth(0, -160, -126, 7, { teeth: 6, lw: 1, long: .5 });
      else if (o.grin) g += slackMouth(0, -141, 8, 7, { tongue: false, lw: 1, inside: '#300606' });
      else g += `<path d="M-4,-139 Q0,-136 4,-139" stroke="#7a2a2a" stroke-width="1.4" fill="none"/>`;
    }
    return g + '</g>';
  }
  function kid(x, b, s, o = {}) {
    const dino = o.dino !== false, c = o.cloth || (dino ? '#6aa84f' : '#e98aa8'), skin = o.skin || '#f0ceb2', hair = o.hair || '#c8893a';
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${s})"${o.op ? ` opacity="${o.op}"` : ''}>`;
    g += `<rect x="-9" y="-30" width="7" height="30" rx="2" fill="${c}"/><rect x="2" y="-30" width="7" height="30" rx="2" fill="${c}"/>`;
    g += `<path d="M-14,-28 L-12,-76 Q0,-82 12,-76 L14,-28Z" fill="${c}"/>`;
    if (dino) g += `<path d="M-14,-40 q-14,4 -18,16" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-50" rx="7" ry="12" fill="#c9e6a0"/>`;
    const L = o.hold ? 'M-11,-72 L-22,-50' : 'M-11,-72 L-16,-38', R = o.hold === 'up' ? 'M11,-72 L24,-96' : (o.hold ? 'M11,-72 L26,-58' : 'M11,-72 L16,-38');
    g += `<path d="${L} ${R}" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`;
    if (o.walkie) g += `<rect x="20" y="-70" width="9" height="15" rx="2" fill="#f28a1a"/><rect x="25" y="-80" width="2" height="10" fill="#333"/>`;
    g += `<ellipse cx="0" cy="-92" rx="12" ry="13" fill="${skin}"/>`;
    g += `<path d="M-12,-94 Q-13,-108 0,-108 Q13,-108 12,-94 L14,-74 L9,-74 L8,-96 Q0,-102 -8,-96 L-9,-74 L-14,-74Z" fill="${hair}"/>`;
    if (dino) g += `<path d="M-14,-96 Q-15,-112 0,-113 Q15,-112 14,-96 Q14,-86 12,-82 M-14,-96 Q-15,-86 -12,-82" fill="${c}" stroke="${c}" stroke-width="2"/><path d="M-6,-112 l3,-7 l3,7 M2,-112 l3,-7 l3,7 M10,-108 l5,-5 l1,7" fill="#f2d13a"/>`;
    if (o.eyes) g += coin(-4.5, -93, 2) + coin(4.5, -93, 2);
    else g += `<circle cx="-4.5" cy="-93" r="1.5" fill="#111"/><circle cx="4.5" cy="-93" r="1.5" fill="#111"/>`;
    if (o.grin) g += slackMouth(0, -88, 7, 6, { tongue: false, lw: 1, inside: '#300606' });
    else g += `<path d="M-3,-86 Q0,-83 3,-86" stroke="#7a2a2a" stroke-width="1.3" fill="none"/>`;
    return g + '</g>';
  }

  /* ---------- buildings ---------- */
  function estate(K, m, o = {}) {
    const p = P[m];
    let s = sky(K, m) + treeline(m, 110, 226, o.seed || 3);
    s += `<rect y="226" width="800" height="174" fill="${p.lawn}"/>`;
    const H = [{ x: 18, num: '3' }, { x: 214, num: '5' }, { x: 418, num: '7', main: true }, { x: 616, num: '9' }];
    const lit = [];
    H.forEach((h, i) => {
      const q = { x: h.x, b: 292, w: 166, h: 92, wall: BRICK[i % 4], roof: '#5c5f66', door: h.main ? '#c94a3a' : ['#2f6f9e', '#3d8656', '#2c5d5a'][i % 3], win: m === 'night' || m === 'blood' ? '#0b0f18' : m === 'dusk' ? '#2a2f40' : '#bfe2f3', trim: '#f6f4ee', num: h.num };
      if (o.lit && o.lit[i]) { q.lit = [1, 0, 1]; q.litc = o.litc || '#ffcf73'; }
      if (o.curtains) q.curtain = '#3a2238';
      s += house(q, lit);
      s += `<rect x="${f(h.x + 166 * .62)}" y="292" width="${f(166 * .17)}" height="34" fill="${shade(p.pave, -.06)}"/>`;
    });
    s += `<rect y="326" width="800" height="14" fill="${p.pave}"/><rect y="340" width="800" height="60" fill="${p.road}"/>`;
    s += `<path d="M0,372 H800" stroke="${shade(p.road, .3)}" stroke-width="3" stroke-dasharray="22 18" opacity=".5"/>`;
    s += `<g fill="${shade(p.lawn, -.25)}">${[0, 196, 400, 598].map(x => `<rect x="${x}" y="300" width="14" height="26"/>`).join('')}</g>`;
    [[198, '#2d2f36'], [404, '#2d2f36'], [606, '#2d2f36']].forEach(([x, c], i) => {
      s += `<rect x="${x - 2}" y="210" width="4" height="122" fill="${c}"/><rect x="${x - 8}" y="204" width="20" height="7" fill="${c}"/>`;
      if (o.lamps) lit.push(`<circle cx="${x + 2}" cy="212" r="26" fill="#ffd27a" opacity=".3"/><rect x="${x - 4}" y="210" width="12" height="4" fill="#fff1c4"/>`);
      if (o.posters) s += `<rect x="${x - 12}" y="256" width="24" height="30" fill="#fbf8f0"/><text x="${x}" y="265" font-family="Georgia,serif" font-size="5.6" font-weight="700" text-anchor="middle" fill="#c22">${o.posters === 'cat' && i % 2 ? 'LOST CAT' : 'LOST DOG'}</text><ellipse cx="${x}" cy="275" rx="7" ry="5" fill="${o.posters === 'cat' && i % 2 ? '#555' : '#dca65e'}"/>`;
    });
    if (P[m].tint) s += tint(m);
    s += lit.join('');
    return s;
  }

  function kitchen(K, m, o = {}) {
    const dark = m === 'night' || m === 'blood';
    let s = `<rect width="800" height="400" fill="#f2e8d6"/>`;
    s += `<rect y="300" width="800" height="100" fill="#cfc2ad"/>`;
    for (let x = 0; x < 800; x += 50) s += `<line x1="${x}" y1="300" x2="${x - 26}" y2="400" stroke="#b6a892" stroke-width="2"/>`;
    s += `<line x1="0" y1="340" x2="800" y2="340" stroke="#b6a892" stroke-width="2"/>`;
    // units left
    s += `<rect x="0" y="190" width="300" height="110" fill="#8fae9a"/><rect x="0" y="180" width="300" height="12" fill="#e9e4dc"/>`;
    for (let i = 0; i < 4; i++) s += `<rect x="${10 + i * 72}" y="200" width="64" height="90" fill="#9cbaa6" stroke="#7d9a88" stroke-width="2"/><rect x="${36 + i * 72}" y="208" width="12" height="3" fill="#ddd"/>`;
    s += `<rect x="0" y="40" width="300" height="70" fill="#9cbaa6"/>`;
    for (let i = 0; i < 4; i++) s += `<rect x="${10 + i * 72}" y="46" width="64" height="58" fill="#a9c6b2" stroke="#7d9a88" stroke-width="2"/>`;
    // window above sink
    s += `<rect x="96" y="118" width="110" height="58" fill="${dark ? '#0b1224' : '#bfe2f3'}" stroke="#fff" stroke-width="5"/>`;
    // clock
    s += `<circle cx="370" cy="70" r="22" fill="#fff" stroke="#333" stroke-width="3"/><line x1="370" y1="70" x2="370" y2="54" stroke="#333" stroke-width="3"/><line x1="370" y1="70" x2="${o.three ? 384 : 378}" y2="${o.three ? 70 : 76}" stroke="#333" stroke-width="3"/>`;
    // glass back door
    const id = K.u + 'door' + (++N);
    K.defs.push(`<clipPath id="${id}"><rect x="560" y="80" width="170" height="220"/></clipPath>`);
    s += `<rect x="550" y="70" width="190" height="236" fill="#eeeae2"/>`;
    s += `<g clip-path="url(#${id})"><g transform="translate(560,80) scale(.2125,.55)">${sky(K, o.out || (dark ? 'night' : 'day'))}<rect y="230" width="800" height="170" fill="${P[o.out || (dark ? 'night' : 'day')].lawn}"/>${treeline(o.out || (dark ? 'night' : 'day'), 120, 236, 6)}</g>${o.doorInner || ''}</g>`;
    s += `<path d="M645,80 V300 M560,190 H730" stroke="#eeeae2" stroke-width="7"/>`;
    if (o.open) s += `<rect x="560" y="80" width="86" height="220" fill="#eeeae2" transform="skewY(-8) translate(0,82)" opacity=".9"/>`;
    // table
    if (o.table !== false) {
      s += `<rect x="330" y="232" width="200" height="14" fill="#b88a5c"/><rect x="342" y="246" width="10" height="90" fill="#8a6440"/><rect x="508" y="246" width="10" height="90" fill="#8a6440"/>`;
    }
    s += o.inner || '';
    if (dark) s += `<rect width="800" height="400" fill="#06102a" opacity=".72" style="mix-blend-mode:multiply"/><rect width="800" height="400" fill="#000" opacity=".25"/>`;
    if (m === 'dusk') s += `<rect width="800" height="400" fill="#5e2846" opacity=".3" style="mix-blend-mode:multiply"/>`;
    s += o.top || '';
    return s;
  }

  function room(wall, floor, fy = 310) {
    let s = `<rect width="800" height="400" fill="${wall}"/><rect y="${fy}" width="800" height="${400 - fy}" fill="${floor}"/>`;
    for (let x = 0; x < 800; x += 46) s += `<line x1="${x}" y1="${fy}" x2="${x - 30}" y2="400" stroke="${shade(floor, -.18)}" stroke-width="2"/>`;
    return s + `<rect y="${fy - 10}" width="800" height="10" fill="${shade(wall, -.22)}"/>`;
  }
  const horseshoe = (x, y, s = 1, rot = 0) => `<path transform="translate(${x},${y}) rotate(${rot}) scale(${s})" d="M-12,10 Q-16,-14 0,-16 Q16,-14 12,10" stroke="#55585e" stroke-width="6" fill="none" stroke-linecap="round"/>`;

  /* portraits */
  const DAD = { skin: '#e9c4a6', hair: '#4a3020', short: true, cloth: '#3d5a80', iris: '#4a6a8a' };
  const MUM = { skin: '#efcfb6', hair: '#2a1a12', longhair: true, cloth: '#b85a6a', iris: '#5a4030' };
  const DUN = { skin: '#efd8c8', hair: '#e2e0dc', bun: true, cloth: '#6a5a7a', cardigan: true, glasses: true, brooch: true };

  /* ================= SCENES ================= */

  S.cover_goodboy = () => {
    const K = kit(); let s = estate(K, 'dusk', { lit: [0, 0, 1, 0], lamps: true, seed: 8 });
    s += `<path d="M520,392 Q540,250 505,140 Q500,120 512,112" stroke="#000" stroke-width="16" fill="none" opacity=".45"/>`;
    s += `<g opacity=".78">${walker(520, 392, 290, { pale: '#05030a', pelt: '#05030a' })}</g>`;
    s += bramble(470, 392, 2.1, { sit: true, eyes: true, tongue: true });
    s += K.vignette(.75) + K.grain(.16);
    return K.done(s);
  };

  S.gb_kitchen = () => {
    const K = kit();
    const inner = adult(150, 300, 1.15, { ...{ cloth: '#3d5a80' } }) + `<rect x="168" y="168" width="30" height="5" fill="#333"/><ellipse cx="183" cy="164" rx="14" ry="4" fill="#e6b35a"/><ellipse cx="420" cy="18" rx="16" ry="5" fill="#e6b35a"/>` +
      adult(620, 320, 1.15, { cloth: '#b85a6a', long: true, hair: '#2a1a12' }) +
      kid(400, 300, 1, {}) + `<ellipse cx="360" cy="228" rx="22" ry="6" fill="#fff"/><ellipse cx="360" cy="225" rx="14" ry="4" fill="#e6b35a"/><ellipse cx="470" cy="228" rx="22" ry="6" fill="#fff"/>` +
      bramble(470, 352, 1.4, { sit: true, tongue: true });
    let s = kitchen(K, 'day', { inner });
    s += `<rect width="800" height="400" fill="${K.rad('w', [[0, '#fff3c4', .3], [1, '#fff3c4', 0]], .5, .2, .7)}"/>`;
    s += K.vignette(.3) + K.grain(.08);
    return K.done(s);
  };

  S.gb_woodedge = () => {
    const K = kit(); let s = sky(K, 'golden');
    s += `<rect y="150" width="800" height="250" fill="${P.golden.wood2}"/>` + trunks('golden', 5, '#2e3218');
    s += walker(470, 300, 230, { op: .55, pale: '#1a1a10', pelt: false });
    s += `<rect y="290" width="800" height="110" fill="#9cb85e"/>`;
    for (let x = 0; x < 800; x += 26) s += `<rect x="${x}" y="246" width="20" height="58" fill="#c49a6c"/>`;
    s += `<rect y="262" width="800" height="6" fill="#a87c50"/>`;
    s += bramble(560, 286, 1.2, { flip: true });
    s += adult(150, 380, 1.2, { cloth: '#3d5a80' }) + kid(210, 382, .95, { hold: true }) + adult(280, 384, 1.15, { long: true, cloth: '#b85a6a', hair: '#2a1a12', back: true });
    s += tint('golden') + K.vignette(.55) + K.grain(.12);
    return K.done(s);
  };

  S.gb_posters = () => {
    const K = kit(); let s = estate(K, 'dusk', { posters: 'dog', lit: [1, 1, 1, 0], lamps: true, seed: 5 });
    s += `<rect x="-20" y="230" width="60" height="70" fill="#8a7f72"/>`;
    s += adult(70, 360, 1, { ...DUN, cloth: '#5a4a3a', bun: true, hair: '#e2e0dc', back: true });
    s += K.vignette(.7) + K.grain(.15);
    return K.done(s);
  };

  S.gb_backdoor = () => {
    const K = kit();
    const doorInner = `<path d="M600,300 Q660,110 690,90" stroke="#000" stroke-width="16" opacity=".6" fill="none"/>` + bramble(660, 286, 1.1, { sit: true, eyes: true, flip: true });
    let s = kitchen(K, 'night', { three: true, doorInner, table: false });
    s += `<rect width="800" height="400" fill="${K.rad('m', [[0, '#a9bde3', .22], [1, '#a9bde3', 0]], .82, .5, .4)}"/>`;
    s += coin(651, 262, 2.6);
    s += K.vignette(.85) + K.grain(.2);
    return K.done(s);
  };

  S.gb_dog_in = () => {
    const K = kit();
    const inner = adult(330, 330, 1.2, { cloth: '#3d5a80' }) + adult(520, 330, 1.2, { long: true, hair: '#2a1a12', cloth: '#d9c8d8', armsOut: true }) + kid(260, 340, 1, {});
    let s = kitchen(K, 'night', { open: true, inner, table: false, three: true });
    s += `<rect width="800" height="400" fill="${K.rad('m', [[0, '#a9bde3', .25], [1, '#a9bde3', 0]], .8, .6, .45)}"/>`;
    s += bramble(430, 360, 1.6, { eyes: true });
    s += K.vignette(.8) + K.grain(.18);
    return K.done(s);
  };

  S.gb_table = () => {
    const K = kit();
    const inner = `<rect x="440" y="160" width="60" height="80" fill="#a87c50"/><rect x="440" y="236" width="60" height="10" fill="#8a6440"/>` + bramble(475, 238, 1.25, { sit: true, flip: true }) +
      `<ellipse cx="380" cy="228" rx="22" ry="6" fill="#fff"/><ellipse cx="520" cy="228" rx="22" ry="6" fill="#fff"/><ellipse cx="520" cy="226" rx="12" ry="4" fill="#c25a5a"/>` + kid(330, 304, 1, {});
    let s = kitchen(K, 'day', { inner });
    s += K.vignette(.35) + K.grain(.08);
    return K.done(s);
  };

  S.gb_estate_day = () => {
    const K = kit(); let s = estate(K, 'day', { posters: 'dog', seed: 2 });
    s += adult(470, 330, 1.1, { cloth: '#3d5a80', bandage: true }) + bramble(540, 332, 1.05, { sit: true, flip: true });
    s += K.vignette(.3) + K.grain(.08);
    return K.done(s);
  };

  S.gb_woods = () => {
    const K = kit(); let s = sky(K, 'golden');
    s += `<rect width="800" height="400" fill="#2e3218"/>` + trunks('golden', 11, '#1e2210');
    const r = rng(4);
    [[120, 120, '#7a6a5a'], [220, 90, '#c47a3a'], [600, 110, '#8a8a8a'], [690, 80, '#a8805a'], [340, 70, '#b07a4a']].forEach(([x, y, c]) => {
      s += `<line x1="${x}" y1="${y - 30}" x2="${x}" y2="${y}" stroke="#222" stroke-width="1.5"/><path d="M${x - 10},${y} Q${x},${y - 6} ${x + 10},${y} L${x + 7},${y + 44} Q${x},${y + 50} ${x - 7},${y + 44}Z" fill="${c}" opacity=".9"/><path d="M${x - 9},${y + 44} l-3,10 M${x + 9},${y + 44} l3,10" stroke="${c}" stroke-width="3"/>`;
    });
    s += `<ellipse cx="400" cy="350" rx="300" ry="50" fill="#4a4a26"/>`;
    s += `<path d="M330,350 Q360,318 400,326 Q440,316 470,346 Q440,360 400,356 Q360,362 330,350Z" fill="#dca65e"/><path d="M350,346 Q380,336 410,342 Q440,334 455,346" stroke="#8a3a2a" stroke-width="3" fill="none"/>`;
    s += `<path d="M480,360 a16,10 0 1 0 1,0" stroke="#c22a2a" stroke-width="5" fill="none"/><path d="M494,364 l8,4 l-3,4 l-8,-4Z" fill="#e2c35a"/>`;
    s += `<rect width="800" height="400" fill="${K.rad('l', [[0, '#ffcf7a', .25], [1, '#000', .4]], .5, .9, .7)}"/>`;
    s += K.vignette(.75) + K.grain(.16);
    return K.done(s);
  };

  S.gb_dunmore = () => {
    const K = kit(); let s = room('#d9c7a6', '#6a4a30', 320);
    for (let x = 0; x < 800; x += 40) s += `<rect x="${x}" y="0" width="16" height="310" fill="#d0bc98"/>`;
    s += `<rect x="560" y="70" width="120" height="250" fill="#5a3e26"/><circle cx="660" cy="200" r="5" fill="#d9b44a"/>` + horseshoe(620, 50, 1.6);
    s += `<rect x="420" y="90" width="110" height="80" fill="#1a1a1a" stroke="#6a4a30" stroke-width="8"/>` + horseshoe(475, 76, 1.1);
    s += `<rect x="440" y="110" width="70" height="40" fill="#6a8a6a" opacity=".5"/>`;
    s += at(220, 220, .82, person({ ...DUN }));
    s += `<rect width="800" height="400" fill="${K.rad('w', [[0, '#ffcf7a', .2], [1, '#000', .2]], .3, .4, .8)}"/>`;
    s += K.vignette(.55) + K.grain(.12);
    return K.done(s);
  };

  S.gb_hall = () => {
    const K = kit(); let s = room('#e9dccb', '#9a7a58', 330);
    s += `<polygon points="260,330 520,40 640,40 380,330" fill="#c9b49a"/>`;
    for (let i = 0; i < 12; i++) { const t = i / 12; s += `<line x1="${f(260 + 260 * t)}" y1="${f(330 - 290 * t)}" x2="${f(380 + 260 * t)}" y2="${f(330 - 290 * t)}" stroke="#a8927a" stroke-width="3"/>`; }
    s += `<path d="M250,330 L510,40" stroke="#6a4a30" stroke-width="8"/>`;
    for (let i = 0; i < 10; i++) s += `<line x1="${f(250 + 26 * i)}" y1="${f(330 - 29 * i)}" x2="${f(250 + 26 * i)}" y2="${f(290 - 29 * i)}" stroke="#6a4a30" stroke-width="3"/>`;
    s += brambleUp(560, 118, .5);
    s += `<rect x="40" y="120" width="80" height="210" fill="#c94a3a"/>`;
    s += `<rect width="800" height="400" fill="#ffb060" opacity=".14" style="mix-blend-mode:multiply"/>`;
    s += K.vignette(.6) + K.grain(.12);
    return K.done(s);
  };

  S.gb_dinner = () => {
    const K = kit(); let s = room('#5a3a4a', '#3a2430', 330);
    s += `<rect x="560" y="60" width="160" height="110" fill="#2a1c34" stroke="#d9c8b8" stroke-width="6"/><rect x="566" y="66" width="148" height="98" fill="#7a2f5c" opacity=".6"/>`;
    s += at(400, 170, .85, person({ ...DAD, smile: 'flat', greyHalf: true }));
    s += `<rect x="120" y="270" width="560" height="22" fill="#8a5a3a"/><rect x="100" y="292" width="600" height="108" fill="#f2ead8"/>`;
    s += `<ellipse cx="400" cy="282" rx="70" ry="16" fill="#efe8da"/><ellipse cx="400" cy="272" rx="48" ry="18" fill="#c27a3a"/><path d="M370,268 q14,-10 30,0" stroke="#e9b06a" stroke-width="4" fill="none"/>`;
    s += `<path d="M370,290 q-6,10 4,14 M430,288 q8,12 -2,16" stroke="#c22a2a" stroke-width="3" fill="none" opacity=".7"/>`;
    s += coin(250, 360, 2.4) + coin(262, 360, 2.4);
    s += `<rect width="800" height="400" fill="${K.rad('c', [[0, '#ffb060', .2], [1, '#000', .4]], .5, .6, .7)}"/>`;
    s += K.vignette(.7) + K.grain(.14);
    return K.done(s);
  };

  S.gb_landing = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#05070c"/>`;
    s += `<polygon points="250,400 330,170 470,170 550,400" fill="#0e121c"/>`;
    for (let i = 0; i < 9; i++) { const y = 170 + i * 26, w = 70 + i * 9.5; s += `<line x1="${f(400 - w)}" y1="${y}" x2="${f(400 + w)}" y2="${y}" stroke="#1a2030" stroke-width="2"/>`; }
    s += `<rect x="350" y="120" width="100" height="50" fill="#0a0d14"/>`;
    s += `<rect x="40" y="40" width="150" height="260" fill="#0c1220"/><rect x="60" y="60" width="110" height="240" fill="#131a2c"/><ellipse cx="115" cy="250" rx="46" ry="10" fill="#1d2640"/><path d="M80,230 Q115,214 150,230" stroke="#2a3450" stroke-width="10"/>`;
    s += `<rect x="600" y="40" width="150" height="260" fill="#0c1220"/>`;
    s += coin(390, 158, 2.6) + coin(410, 158, 2.6);
    s += `<rect width="800" height="400" fill="${K.rad('t', [[0, '#a9bde3', .08], [1, '#000', 0]], .5, .6, .5)}"/>`;
    s += K.vignette(.9) + K.grain(.22);
    return K.done(s);
  };

  S.gb_dad = () => {
    const K = kit(); let s = kitchen(K, 'day', { table: false });
    s += `<rect width="800" height="400" fill="#fff" opacity=".2"/>`;
    s += at(400, 175, .95, person({ ...DAD, smile: 'slack', wideEyes: true }));
    s += `<g transform="translate(560,300)"><rect x="-24" y="-20" width="48" height="60" rx="18" fill="#f4f2ec"/><path d="M-20,-10 h40 M-20,4 h40 M-20,18 h40" stroke="#ddd" stroke-width="2"/><path d="M-6,-2 q4,10 10,4" stroke="#b8323a" stroke-width="3" fill="none"/><path d="M-22,-20 q-10,-20 6,-34 q-6,14 2,24" fill="${shade(DAD.skin, -.1)}" opacity=".8"/></g>`;
    s += K.vignette(.45) + K.grain(.1);
    return K.done(s);
  };

  S.gb_estate_dusk = () => {
    const K = kit(); let s = estate(K, 'dusk', { posters: 'cat', curtains: true, seed: 6 });
    s += adult(70, 316, .9, { cloth: '#7a6a5a', eyes: true, grin: true, leg: '#5a4a3a' }) + `<path d="M85,284 q30,10 40,30" stroke="#3a6a3a" stroke-width="3" fill="none"/>`;
    s += kid(290, 300, .7, { dino: false, cloth: '#e0c050', eyes: true }) + kid(312, 300, .7, { dino: false, cloth: '#e0c050', eyes: true });
    s += adult(700, 320, .95, { cloth: '#4a3b52', eyes: true, long: true, hair: '#6a4a2a' });
    s += K.vignette(.75) + K.grain(.16);
    return K.done(s);
  };

  S.gb_dunmore_dark = () => {
    const K = kit(); let s = room('#2a2420', '#1a120c', 330);
    s += `<rect x="460" y="70" width="220" height="150" fill="#0a1020" stroke="#3a2a1a" stroke-width="8"/>`;
    s += `<rect x="120" y="190" width="120" height="80" fill="#0c0c0c"/><rect x="128" y="198" width="104" height="64" fill="#6a8aaa" opacity=".55"/>`;
    s += `<path d="M380,330 L370,210 Q420,186 470,210 L460,330Z" fill="#3a2a30"/><path d="M366,250 L360,330 M474,250 L480,330" stroke="#2a1a20" stroke-width="16"/>`;
    s += `<circle cx="420" cy="196" r="18" fill="#e2e0dc"/><circle cx="420" cy="182" r="9" fill="#e2e0dc"/>`;
    for (let i = 0; i < 6; i++) s += horseshoe(80 + i * 14, 350 - (i % 2) * 8, 1, i * 40);
    s += `<rect x="580" y="300" width="90" height="10" fill="#4a3424"/><rect x="595" y="288" width="34" height="12" fill="#c9b48a"/>`;
    s += `<rect width="800" height="400" fill="${K.rad('tv', [[0, '#8ab0d8', .25], [1, '#000', 0]], .22, .6, .4)}"/>`;
    s += K.vignette(.9) + K.grain(.22);
    return K.done(s);
  };

  S.gb_mum = () => {
    const K = kit();
    const doorInner = walker(660, 290, 150, { pelt: '#5a6a8a', op: .9 }) + `<path d="M690,290 L700,256" stroke="#5a4a3a" stroke-width="4"/>` + bramble(620, 292, .7, { eyes: true });
    let s = kitchen(K, 'night', { doorInner, table: false });
    s += at(280, 190, .9, person({ ...MUM, wideEyes: true, smile: 'kind' }));
    s += `<path d="M330,330 L420,250" stroke="#cfd4da" stroke-width="7" stroke-linecap="round"/><path d="M335,326 L352,312" stroke="#5a3a2a" stroke-width="10" stroke-linecap="round"/>`;
    s += `<rect width="800" height="400" fill="${K.rad('m', [[0, '#a9bde3', .18], [1, '#000', 0]], .8, .5, .4)}"/>`;
    s += K.vignette(.8) + K.grain(.18);
    return K.done(s);
  };

  S.gb_poppyroom = () => {
    const K = kit(); let s = room('#e6c8d8', '#7a5a68', 320);
    const r = rng(3); for (let i = 0; i < 26; i++) s += `<path d="M${f(r() * 800)},${f(r() * 280)} l3,7 l7,1 l-5,5 l1,7 l-6,-4 l-6,4 l1,-7 l-5,-5 l7,-1Z" fill="#fff3a0" opacity=".7"/>`;
    s += `<rect x="560" y="70" width="140" height="110" fill="#0b1224" stroke="#fff" stroke-width="6"/>`;
    s += `<rect x="140" y="230" width="460" height="90" fill="#efe8ff"/><rect x="130" y="190" width="24" height="140" fill="#f2b8d0"/><rect x="590" y="220" width="20" height="110" fill="#f2b8d0"/>`;
    s += `<path d="M160,240 Q280,180 420,236 Q520,250 590,240 L590,320 L160,320Z" fill="#b8d8f0"/><circle cx="210" cy="232" r="24" fill="#fff"/>`;
    s += `<rect x="190" y="218" width="12" height="20" rx="2" fill="#f28a1a"/>`;
    s += bramble(500, 248, 1.25, { eyes: true });
    s += `<circle cx="80" cy="300" r="10" fill="#fff3a0"/><circle cx="80" cy="300" r="40" fill="#fff3a0" opacity=".2"/>`;
    s += `<rect width="800" height="400" fill="#0a1030" opacity=".6" style="mix-blend-mode:multiply"/>` + coin(533, 196, 2.6);
    s += K.vignette(.85) + K.grain(.18);
    return K.done(s);
  };

  S.gb_car = () => {
    const K = kit(); let s = sky(K, 'night') + treeline('night', 140, 230, 9);
    s += `<rect y="230" width="800" height="170" fill="#0d1622"/><polygon points="250,400 380,230 420,230 550,400" fill="#1c2129"/>`;
    s += `<polygon points="300,400 395,232 405,232 500,400" fill="#fff3c4" opacity=".14"/>`;
    s += `<polygon points="150,400 330,250 470,250 650,400" fill="#fff3c4" opacity=".12"/>`;
    [[230, '#7a6a5a'], [280, '#4a5a7a', 1], [330, '#5a4a6a'], [470, '#3a4a6a', 1], [520, '#2a2a3a'], [570, '#6a5a4a']].forEach(([x, c, l]) => s += adult(x, 330, .9, { cloth: c, eyes: true, armsOut: true, long: !!l, hair: '#3a2a1a' }));
    s += adult(400, 340, 1.05, { cloth: '#3d5a80', eyes: true, grin: true, armsOut: true });
    s += `<path d="M0,0 H800 V60 Q400,30 0,60Z M0,400 V300 Q400,330 800,300 V400Z" fill="#05070c"/><path d="M0,60 L80,300 M800,60 L720,300" stroke="#05070c" stroke-width="40"/>`;
    s += `<rect x="360" y="58" width="80" height="20" rx="4" fill="#0a0d14"/>`;
    s += K.vignette(.8) + K.grain(.18);
    return K.done(s);
  };

  S.gb_mum_taken = () => {
    const K = kit(); let s = sky(K, 'blood') + `<rect y="250" width="800" height="150" fill="#1c0606"/>`;
    s += `<polygon points="230,400 400,240 570,400" fill="#ffd27a" opacity=".16"/><rect x="398" y="80" width="5" height="250" fill="#120404"/><rect x="390" y="76" width="22" height="8" fill="#120404"/><circle cx="401" cy="86" r="30" fill="#ffd27a" opacity=".35"/>`;
    s += walker(430, 340, 260, { pelt: '#3d5a80', reach: [-48, -150] });
    s += adult(400, 340, 1.1, { long: true, hair: '#2a1a12', cloth: '#b85a6a', eyes: true, grin: 'torn' });
    s += kid(120, 390, .7, { back: true }) ;
    s += K.vignette(.85) + K.grain(.2);
    return K.done(s);
  };

  function alley(K, m) {
    let s = `<rect width="800" height="400" fill="${m === 'blood' ? '#0a0101' : '#03050a'}"/>`;
    s += `<polygon points="0,0 330,150 330,260 0,400" fill="${m === 'blood' ? '#2a0808' : '#1a1410'}"/><polygon points="800,0 470,150 470,260 800,400" fill="${m === 'blood' ? '#240606' : '#16120e'}"/>`;
    for (let i = 0; i < 12; i++) { const t = i / 12; s += `<line x1="${f(330 * t)}" y1="${f(150 * t)}" x2="${f(330 * t)}" y2="${f(400 - 140 * t)}" stroke="#000" stroke-width="2" opacity=".5"/><line x1="${f(800 - 330 * t)}" y1="${f(150 * t)}" x2="${f(800 - 330 * t)}" y2="${f(400 - 140 * t)}" stroke="#000" stroke-width="2" opacity=".5"/>`; }
    s += `<polygon points="0,400 330,260 470,260 800,400" fill="${m === 'blood' ? '#140303' : '#0a0c10'}"/><rect x="330" y="150" width="140" height="110" fill="${m === 'blood' ? '#300606' : '#0b1020'}"/>`;
    return s;
  }
  S.gb_alley = () => {
    const K = kit(); let s = alley(K, 'night');
    s += kid(400, 340, 1.3, { eyes: true });
    s += `<path d="M420,300 Q520,330 600,400" stroke="#1d2430" stroke-width="22" fill="none" stroke-linecap="round"/>`;
    s += `<rect width="800" height="400" fill="${K.rad('t', [[0, '#a9bde3', .14], [1, '#000', 0]], .5, .7, .4)}"/>`;
    s += K.vignette(.9) + K.grain(.22);
    return K.done(s);
  };
  S.gb_two = () => {
    const K = kit(); let s = alley(K, 'blood');
    s += walker(400, 262, 110, { pelt: false, op: .35, pale: '#000' });
    s += kid(400, 380, 1.9, { eyes: true, grin: true });
    s += `<g transform="translate(130,320) rotate(-12)"><rect x="-26" y="-50" width="52" height="90" rx="8" fill="#f28a1a"/><rect x="-16" y="-38" width="32" height="22" fill="#2a1a0a"/><text x="0" y="-22" font-family="monospace" font-size="12" fill="#ff5a3a" text-anchor="middle">CH 3</text><rect x="12" y="-90" width="6" height="40" fill="#222"/>${[0, 1, 2, 3].map(i => `<rect x="-16" y="${-8 + i * 8}" width="32" height="3" fill="#a85a10"/>`).join('')}</g>`;
    s += `<circle cx="130" cy="300" r="70" fill="#ff8a3a" opacity=".12"/>`;
    s += K.vignette(.85) + K.grain(.22);
    return K.done(s);
  };

  function brook(K, m, o = {}) {
    let s = sky(K, m);
    s += `<path d="M0,180 L250,150 L560,160 L800,140 L800,260 L0,260Z" fill="${m === 'blood' ? '#200404' : '#0e1626'}"/>`;
    const lit = []; [[60, 1], [200, 0], [330, 1], [470, 0], [600, 1], [720, 0]].forEach(([x, l]) => { s += `<rect x="${x}" y="${150 - (x % 3) * 4}" width="70" height="40" fill="${m === 'blood' ? '#1c0606' : '#141a26'}"/><polygon points="${x - 4},${152 - (x % 3) * 4} ${x + 35},${130 - (x % 3) * 4} ${x + 74},${152 - (x % 3) * 4}" fill="${m === 'blood' ? '#140303' : '#0a0e16'}"/>`; if (l) lit.push(`<rect x="${x + 10}" y="${160 - (x % 3) * 4}" width="12" height="10" fill="#ffcf73" opacity=".7"/>`); });
    s += lit.join('');
    s += `<path d="M0,250 Q400,236 800,252 L800,262 L0,262Z" fill="${m === 'blood' ? '#2a0808' : '#1a2030'}"/>`;
    s += `<rect y="262" width="800" height="138" fill="${K.lin('wt' + (++N), m === 'blood' ? [[0, '#2a0606'], [1, '#080101']] : [[0, '#0c1830'], [1, '#02050c']])}"/>`;
    const r = rng(7); for (let i = 0; i < 40; i++) { const x = r() * 800, y = 270 + r() * 120; s += `<path d="M${f(x)},${f(y)} q${f(10 + r() * 20)},-5 ${f(30 + r() * 30)},0" stroke="${m === 'blood' ? '#7a2a2a' : '#5a7aaa'}" stroke-width="1.6" fill="none" opacity="${f(.3 + r() * .4)}"/>`; }
    return s;
  }
  S.gb_brook = () => {
    const K = kit(); let s = brook(K, 'night');
    [[260, '#3d5a80'], [330, '#b85a6a', 1], [470, '#7a6a5a'], [540, '#4a3b52', 1]].forEach(([x, c, l]) => s += adult(x, 256, .7, { cloth: c, eyes: true, long: !!l, hair: '#2a1a12' }));
    s += kid(395, 256, .55, { eyes: true, hold: true }) + bramble(430, 256, .55, { sit: true, eyes: true });
    s += K.vignette(.85) + K.grain(.2);
    return K.done(s);
  };
  S.gb_crossing = () => {
    const K = kit(); let s = brook(K, 'blood');
    s += walker(250, 258, 140, { pelt: '#3d5a80', reach: [250, 240] });
    s += `<path d="M330,256 Q480,300 560,350" stroke="#d6d0c4" stroke-width="5" fill="none"/><path d="M560,350 l10,8 M560,350 l12,2 M560,350 l8,-6" stroke="#d6d0c4" stroke-width="2.5"/>`;
    s += `<ellipse cx="580" cy="360" rx="60" ry="10" fill="#4a1010" opacity=".6"/><path d="M570,360 L566,300 Q580,288 594,300 L590,360Z" fill="#2a3a5a"/><circle cx="580" cy="282" r="12" fill="#e9c4a6"/>`;
    s += [[150, '#b85a6a'], [380, '#7a6a5a']].map(([x, c]) => adult(x, 256, .6, { cloth: c, eyes: true })).join('');
    s += K.vignette(.85) + K.grain(.22);
    return K.done(s);
  };
  S.gb_farbank = () => {
    const K = kit(); let s = brook(K, 'night');
    s += adult(320, 254, .8, { cloth: '#3d5a80', eyes: true, grin: true }) + adult(380, 254, .78, { long: true, hair: '#2a1a12', cloth: '#b85a6a', eyes: true, grin: true });
    s += kid(440, 254, .6, { eyes: true, wave: true, hold: 'up' }) + bramble(490, 254, .62, { sit: true, eyes: true });
    s += `<path d="M0,400 Q200,340 400,372 T800,350 L800,400Z" fill="#05070c"/>`;
    s += K.vignette(.85) + K.grain(.2);
    return K.done(s);
  };

  /* endings */
  S.gb_end_river = () => {
    const K = kit(); let s = sky(K, 'dawn');
    s += `<path d="M0,240 Q200,210 400,232 T800,226 L800,400 L0,400Z" fill="#9cc48a"/><path d="M0,272 Q300,250 800,268 L800,400 L0,400Z" fill="#8cb874"/>`;
    s += `<polygon points="380,240 420,240 640,400 160,400" fill="#a3a0a4"/><path d="M400,244 V400" stroke="#ddd" stroke-width="3" stroke-dasharray="14 16"/>`;
    s += `<g transform="translate(470,250) scale(.6)"><rect x="0" y="-60" width="110" height="60" fill="#f4f4f0"/><rect x="110" y="-44" width="36" height="44" fill="#3d7ab0"/><rect x="118" y="-38" width="20" height="16" fill="#bfe2f3"/><circle cx="24" cy="2" r="10" fill="#222"/><circle cx="120" cy="2" r="10" fill="#222"/><text x="55" y="-26" font-family="Georgia,serif" font-size="14" font-weight="700" fill="#3d7ab0" text-anchor="middle">MILK</text></g>`;
    s += adult(360, 330, .9, { cloth: '#4a4a5a', back: true });
    s += K.vignette(.35) + K.grain(.1);
    return K.done(s);
  };
  S.gb_end_family = () => {
    const K = kit(); let s = room('#4a1a24', '#2a0c12', 330);
    s += `<rect x="80" y="250" width="640" height="22" fill="#6a3a2a"/><rect x="60" y="272" width="680" height="128" fill="#e8dcc8"/>`;
    s += adult(170, 300, 1.1, { cloth: '#3d5a80', eyes: true, grin: true }) + adult(310, 296, 1.05, { long: true, hair: '#2a1a12', cloth: '#b85a6a', eyes: true, grin: true });
    s += kid(450, 280, 1, { eyes: true, grin: true }) + adult(600, 300, 1.05, { cloth: '#5a6a4a', hair: '#3a2a1a', eyes: true, grin: true });
    s += `<ellipse cx="400" cy="262" rx="60" ry="14" fill="#efe8da"/><ellipse cx="400" cy="252" rx="40" ry="14" fill="#a85a3a"/>` + bramble(700, 330, .9, { sit: true, eyes: true, flip: true });
    s += `<rect width="800" height="400" fill="${K.rad('c', [[0, '#ff6a3a', .18], [1, '#000', .45]], .5, .5, .7)}"/>`;
    s += K.vignette(.8) + K.grain(.18);
    return K.done(s);
  };
  S.gb_end_poppy = () => {
    const K = kit(); let s = brook(K, 'blood');
    s += `<circle cx="420" cy="320" r="20" fill="none" stroke="#9a3a3a" stroke-width="2"/><circle cx="420" cy="320" r="40" fill="none" stroke="#7a2a2a" stroke-width="1.5" opacity=".6"/><circle cx="420" cy="320" r="64" fill="none" stroke="#5a1a1a" stroke-width="1" opacity=".4"/>`;
    [[220, '#3d5a80'], [300, '#b85a6a'], [520, '#7a6a5a'], [590, '#4a3b52']].forEach(([x, c]) => s += adult(x, 258, .6, { cloth: c, eyes: true }));
    s += bramble(380, 258, .5, { sit: true, eyes: true });
    s += K.vignette(.85) + K.grain(.2);
    return K.done(s);
  };
  S.gb_end_walkie = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#02040a"/>` + trunks('night', 14, '#0a0e16');
    s += `<path d="M200,100 Q400,70 650,120" stroke="#0e1420" stroke-width="16" fill="none"/>`;
    s += `<line x1="330" y1="88" x2="330" y2="130" stroke="#333" stroke-width="2"/><path d="M300,130 Q330,120 360,130 L364,230 L340,230 L338,280 L322,280 L320,230 L296,230Z" fill="#4a7a3a"/><path d="M310,128 l6,-12 l6,12 M326,124 l6,-12 l6,12 M342,126 l6,-12 l6,12" fill="#b8a02a"/>`;
    s += `<line x1="470" y1="96" x2="470" y2="150" stroke="#333" stroke-width="2"/><rect x="456" y="150" width="28" height="50" rx="5" fill="#f28a1a"/><rect x="462" y="158" width="16" height="12" fill="#ff5a3a" opacity=".8"/><circle cx="470" cy="175" r="60" fill="#ff8a3a" opacity=".12"/>`;
    s += walker(640, 400, 330, { pelt: '#b85a6a', op: .85 });
    s += K.vignette(.9) + K.grain(.22);
    return K.done(s);
  };
  S.gb_end_estate = () => {
    const K = kit(); let s = estate(K, 'day', { seed: 4 });
    s += adult(110, 330, .95, { cloth: '#7a6a5a', eyes: true, grin: true, wave: true }) + adult(300, 330, .95, { cloth: '#4a3b52', eyes: true, grin: true, wave: true, long: true, hair: '#6a4a2a' });
    s += adult(500, 334, 1, { cloth: '#b85a6a', long: true, hair: '#2a1a12', eyes: true, grin: true, wave: true }) + kid(560, 336, .8, { eyes: true, grin: true }) + bramble(620, 336, .9, { sit: true, eyes: true, flip: true });
    s += `<g transform="translate(700,300)"><rect x="-4" y="0" width="8" height="40" fill="#5a4030"/><rect x="-70" y="-50" width="140" height="56" fill="#fbf8f0" stroke="#3d7a3d" stroke-width="3"/><text x="0" y="-32" font-family="Georgia,serif" font-size="11" font-weight="700" fill="#3d7a3d" text-anchor="middle">WILLOW REACH</text><text x="0" y="-18" font-family="Georgia,serif" font-size="10" fill="#333" text-anchor="middle">PHASE TWO</text><text x="0" y="-4" font-family="Georgia,serif" font-size="8" fill="#c22" text-anchor="middle">PETS WELCOME</text></g>`;
    s += K.vignette(.3) + K.grain(.08);
    return K.done(s);
  };

  /* ================= JUMP SCARES (600x600) ================= */

  SC.bramble = () => {
    const K = kit();
    let s = `<rect width="600" height="600" fill="${K.rad('bg', [[0, '#3a0a06'], [1, '#000']], .5, .5, .7)}"/>`;
    s += `<ellipse cx="300" cy="300" rx="230" ry="250" fill="#dca65e"/>`;
    s += `<path d="M90,170 Q20,320 80,470 Q130,430 140,250Z M510,170 Q580,320 520,470 Q470,430 460,250Z" fill="#a8743a"/>`;
    s += `<path d="M300,60 Q250,300 300,580 Q350,300 300,60Z" fill="#2a0404"/>`;
    s += `<path d="M300,90 Q262,300 300,560 Q338,300 300,90Z" fill="#d6c4b8"/>`;
    s += `<ellipse cx="300" cy="250" rx="16" ry="26" fill="#f6f8f2"/><ellipse cx="300" cy="250" rx="5" ry="20" fill="#000"/>`;
    s += coin(200, 220, 22) + coin(400, 220, 22);
    s += slackMouth(300, 420, 230, 130, { drool: true, lw: 4 });
    s += `<rect width="600" height="600" fill="#ff3a2a" opacity=".1" style="mix-blend-mode:screen"/>`;
    s += K.vignette(.8, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };

  function bigFace(K, base, extra) {
    let s = `<rect width="600" height="600" fill="${K.rad('bg', [[0, '#2a0404'], [1, '#000']], .5, .5, .7)}"/>`;
    s += `<g transform="translate(300,300) scale(2.6) translate(-400,-170)">${person(base)}</g>`;
    return s + extra;
  }
  SC.dad = () => {
    const K = kit();
    let s = bigFace(K, { ...DAD, hollow: true, smile: 'slack' }, coin(227, 274, 14) + coin(373, 274, 14));
    s += `<path d="M120,120 Q300,40 480,120 L470,180 Q300,130 130,180Z" fill="#d6d0c4" opacity=".9"/><path d="M130,180 Q300,130 470,180" stroke="#7a2a2a" stroke-width="5" fill="none"/>`;
    s += `<path d="M440,200 q30,40 10,120 q-14,40 6,90" stroke="#5a1010" stroke-width="5" fill="none" opacity=".7"/>`;
    s += `<rect width="600" height="600" fill="#ff2a1a" opacity=".1" style="mix-blend-mode:screen"/>`;
    s += K.vignette(.85, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };
  SC.mum = () => {
    const K = kit();
    let s = bigFace(K, { ...MUM, hollow: true, smile: 'flat' }, coin(227, 274, 14) + coin(373, 274, 14));
    s += splitMouth(300, 60, 600, 90, { teeth: 14, lw: 4, long: .5 });
    s += `<path d="M20,600 Q60,420 120,300 M580,600 Q540,420 480,300" stroke="#d6d0c4" stroke-width="22" fill="none" stroke-linecap="round"/>`;
    s += K.vignette(.85, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };
  SC.dunmore = () => {
    const K = kit();
    let s = `<rect width="600" height="600" fill="#050302"/>`;
    s += `<g transform="rotate(-24 300 300)"><g transform="translate(300,330) scale(2.4,2.9) translate(-400,-170)">${person({ ...DUN, hollow: true, smile: 'slack' })}</g></g>`;
    s += `<g transform="rotate(-24 300 300)"><ellipse cx="208" cy="250" rx="34" ry="24" fill="#000"/><ellipse cx="350" cy="250" rx="34" ry="24" fill="#000"/>${coin(212, 256, 8)}${coin(346, 256, 8)}</g>`;
    s += `<path d="M180,420 Q300,520 420,420 L400,600 L200,600Z" fill="#efd8c8" opacity=".5"/>`;
    s += K.vignette(.85, 600, 600) + K.grain(.28, 600, 600);
    return K.done(s, SVB);
  };
  SC.walker = () => {
    const K = kit();
    let s = `<rect width="600" height="600" fill="${K.rad('bg', [[0, '#1a0404'], [1, '#000']], .5, .4, .7)}"/>`;
    s += `<path d="M60,600 Q40,200 300,40 Q560,200 540,600Z" fill="#b8854a"/><path d="M110,140 Q60,260 90,420 M490,140 Q540,260 510,420" stroke="#8a5a2a" stroke-width="44" fill="none" stroke-linecap="round"/>`;
    s += `<ellipse cx="300" cy="310" rx="140" ry="230" fill="#d6d0c4"/>`;
    s += `<path d="M200,240 Q230,226 260,240 M340,240 Q370,226 400,240" stroke="#7a7266" stroke-width="5" fill="none"/>`;
    s += coin(232, 262, 14) + coin(368, 262, 14);
    s += `<path d="M290,300 L300,340 L310,300" stroke="#8a8276" stroke-width="4" fill="none"/>`;
    s += splitMouth(300, 300, 560, 70, { teeth: 12, lw: 3, long: .55 });
    s += `<rect width="600" height="600" fill="#ff2a1a" opacity=".08" style="mix-blend-mode:screen"/>`;
    s += K.vignette(.85, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };
})();
