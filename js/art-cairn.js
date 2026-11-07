/* NIGHTDOOR art for "Cairn": a Highland spruce forest in fog, five friends, the clearing,
   and the Cairnman: a walking heap of stacked grey stone, moss and roots, with a hollow for a face.
   Adds scenes to ART (800x400) and jump scares (600x600) using the shared toolkit. */
(function () {
  'use strict';
  const { kit, f, mix, shade, rng, at, S, SC, SVB } = ART.lib;
  let N = 0;

  /* ---------- palettes ---------- */
  const P = {
    fog:    { sky: [[0, '#8e9a98'], [1, '#d3d9d3']], far: '#8a9693', mid: '#5f6d66', near: '#2c3a33', ground: '#5d6a50', ground2: '#46523d', mist: '#e2e7e2', stone: '#9a9c94', light: false },
    dusk:   { sky: [[0, '#231d36'], [.55, '#6a4258'], [1, '#c4866a']], far: '#3a3446', mid: '#2a2634', near: '#15131c', ground: '#3a3a30', ground2: '#2a2a24', mist: '#a898a8', stone: '#7c7a78', tint: ['#2b1048', .25] },
    night:  { sky: [[0, '#02040a'], [1, '#0c1626']], far: '#0e1820', mid: '#091117', near: '#04080b', ground: '#0e1510', ground2: '#08100b', mist: '#4c5a68', stone: '#4a5058', stars: true },
    blood:  { sky: [[0, '#0a0101'], [1, '#3e0707']], far: '#200707', mid: '#140404', near: '#070101', ground: '#180505', ground2: '#0e0303', mist: '#6a2222', stone: '#5a4642' },
    golden: { sky: [[0, '#e9a26a'], [.6, '#f6cf94'], [1, '#fde9c2']], far: '#9a8e6a', mid: '#5f6a48', near: '#33412c', ground: '#9a8a5a', ground2: '#7a5a6a', mist: '#fff1da', stone: '#a8a092', sun: true }
  };
  const COL = { dev: '#e2702a', kenzie: '#7a4a9a', ollie: '#3f7a4a', priya: '#2f6aa8', you: '#c9a43a' };

  function sky(K, m) {
    const p = P[m];
    let s = `<rect width="800" height="400" fill="${K.lin('sk' + (++N), p.sky)}"/>`;
    if (p.stars) { const r = rng(7); for (let i = 0; i < 50; i++) s += `<circle cx="${f(r() * 800)}" cy="${f(r() * 140)}" r="${f(r() * 1.1 + .3)}" fill="#fff" opacity="${f(r() * .5 + .2)}"/>`; }
    if (p.sun) s += `<circle cx="400" cy="200" r="46" fill="#fff4d6"/><circle cx="400" cy="200" r="120" fill="#fff4d6" opacity=".25"/>`;
    if (m === 'blood') s += `<circle cx="640" cy="64" r="20" fill="#ff5a3a"/><circle cx="640" cy="64" r="60" fill="#ff3a2a" opacity=".12"/>`;
    if (m === 'night') s += `<circle cx="640" cy="64" r="18" fill="#e8e2d0"/><circle cx="646" cy="59" r="15" fill="#03050b"/>`;
    return s;
  }
  const mist = (K, m, o, y = 0, h = 400, seed = 3) => `<g transform="translate(0,${y})">${K.fog(P[m].mist, o, 800, h, seed, '0.003 0.02')}</g>`;
  function tint(m) { const t = P[m].tint; return t ? `<rect width="800" height="400" fill="${t[0]}" opacity="${t[1]}" style="mix-blend-mode:multiply"/>` : ''; }

  /* ---------- trees ---------- */
  function spruce(x, b, h, c) {
    let s = `<rect x="${f(x - h * .022)}" y="${f(b - h * .16)}" width="${f(h * .044)}" height="${f(h * .16)}" fill="${shade(c, -.25)}"/>`;
    for (let i = 0; i < 5; i++) {
      const top = b - h + i * h * .16, w = h * (.13 + i * .075), bot = top + h * .3;
      s += `<polygon points="${f(x)},${f(top)} ${f(x - w / 2)},${f(bot)} ${f(x + w / 2)},${f(bot)}" fill="${i % 2 ? c : shade(c, .04)}"/>`;
    }
    return s;
  }
  function band(base, hMin, hMax, c, seed, gap = 22, skip) {
    const r = rng(seed); let s = '';
    for (let x = -20; x < 830; x += gap * (.7 + r() * .6)) {
      if (skip && x > skip[0] && x < skip[1]) continue;
      s += spruce(x, base + r() * 6, hMin + r() * (hMax - hMin), c);
    }
    return s;
  }
  /* full forest backdrop. o.clear = [x0,x1] gap in the near trees, o.ground = horizon y */
  function forest(K, m, o = {}) {
    const p = P[m], gy = o.ground || 250;
    let s = sky(K, m);
    s += band(gy - 14, 70, 120, p.far, o.seed || 2, 18);
    s += mist(K, m, m === 'fog' ? .75 : .4, 0, 400, (o.seed || 2) + 1);
    s += band(gy + 2, 110, 170, p.mid, (o.seed || 2) + 5, 26, o.clear);
    s += `<rect y="${gy}" width="800" height="${400 - gy}" fill="${K.lin('gr' + (++N), [[0, p.ground2], [1, p.ground]])}"/>`;
    if (m === 'fog') s += mist(K, m, .45, gy - 60, 120, 9);
    return s;
  }
  /* big framing trunks at the sides */
  function sideTrees(m, seed = 5) {
    const c = P[m].near, r = rng(seed); let s = '';
    [[-30, 420], [60, 470], [740, 440], [830, 480]].forEach(([x, h]) => s += spruce(x + r() * 20, 420, h, c));
    return s;
  }

  /* ---------- stones ---------- */
  function stone(cx, cy, rx, ry, c, r, moss) {
    const rot = (r() - .5) * 10;
    let s = `<g transform="rotate(${f(rot)} ${f(cx)} ${f(cy)})"><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${c}"/>`;
    s += `<path d="M${f(cx - rx * .8)},${f(cy + ry * .35)} Q${f(cx)},${f(cy + ry * 1.05)} ${f(cx + rx * .8)},${f(cy + ry * .35)}" stroke="${shade(c, -.35)}" stroke-width="${f(Math.max(1, ry * .18))}" fill="none"/>`;
    s += `<path d="M${f(cx - rx * .5)},${f(cy - ry * .45)} Q${f(cx)},${f(cy - ry * .8)} ${f(cx + rx * .4)},${f(cy - ry * .5)}" stroke="${shade(c, .25)}" stroke-width="${f(Math.max(.8, ry * .12))}" fill="none" opacity=".6"/>`;
    if (moss) s += `<ellipse cx="${f(cx + (r() - .5) * rx)}" cy="${f(cy - ry * .4)}" rx="${f(rx * .35)}" ry="${f(ry * .35)}" fill="#5f7a3a" opacity=".8"/>`;
    return s + '</g>';
  }
  /* a cairn, base centre (x,b), height h. o.top: hat|glasses|cap|pack|kit|shoes; o.unfinished */
  function cairn(x, b, h, m, o = {}) {
    const r = rng(o.seed || Math.round(x * 7 + h)), base = P[m].stone;
    const n = Math.max(4, Math.round(h / 13)), sh = h / n;
    let s = `<ellipse cx="${f(x)}" cy="${f(b)}" rx="${f(h * .36)}" ry="${f(h * .05)}" fill="#000" opacity=".25"/>`;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), w = h * (.5 - .34 * t) * (o.unfinished ? 1.15 : 1);
      const c = shade(base, (r() - .55) * .3 - (o.old && i > n * .5 ? .1 : 0));
      s += stone(x + (r() - .5) * w * .15, b - sh * (i + .5), w / 2, sh * .62, c, r, (o.moss || (o.old && i > n / 2)) && r() < .5);
    }
    const ty = b - h;
    if (o.top === 'hat') s += `<path d="M${f(x - 11)},${f(ty + 3)} Q${f(x - 12)},${f(ty - 14)} ${f(x)},${f(ty - 15)} Q${f(x + 12)},${f(ty - 14)} ${f(x + 11)},${f(ty + 3)}Z" fill="#c8302a"/><rect x="${f(x - 12)}" y="${f(ty - 1)}" width="24" height="5" fill="#a82420"/><circle cx="${f(x)}" cy="${f(ty - 17)}" r="5" fill="#e04a40"/>`;
    if (o.top === 'glasses') s += `<g stroke="#222" stroke-width="1.6" fill="#9ab4c4" fill-opacity=".4"><circle cx="${f(x - 6)}" cy="${f(ty - 3)}" r="5"/><circle cx="${f(x + 6)}" cy="${f(ty - 3)}" r="5"/></g>`;
    if (o.top === 'cap') s += `<path d="M${f(x - 10)},${f(ty)} Q${f(x)},${f(ty - 12)} ${f(x + 10)},${f(ty)} L${f(x + 18)},${f(ty + 2)}Z" fill="#5a4a3a"/>`;
    if (o.top === 'pack') s += `<rect x="${f(x - 13)}" y="${f(ty - 24)}" width="26" height="26" rx="5" fill="${o.packc || COL.you}"/><rect x="${f(x - 9)}" y="${f(ty - 12)}" width="18" height="9" rx="2" fill="${shade(o.packc || COL.you, -.25)}"/>`;
    if (o.top === 'kit') s += `<rect x="${f(x - 11)}" y="${f(ty - 16)}" width="22" height="16" rx="2" fill="#2f8a4a"/><path d="M${f(x)},${f(ty - 13)} v10 M${f(x - 5)},${f(ty - 8)} h10" stroke="#fff" stroke-width="3"/>`;
    if (o.top === 'orange') s += `<path d="M${f(x - 12)},${f(ty + 2)} L${f(x - 10)},${f(ty - 18)} L${f(x + 10)},${f(ty - 18)} L${f(x + 12)},${f(ty + 2)}Z" fill="${COL.dev}"/>`;
    if (o.shoes) s += `<path d="M${f(x - 22)},${f(b)} q-2,-7 6,-8 l10,2 q4,2 3,6Z M${f(x + 6)},${f(b)} q-2,-7 6,-8 l10,2 q4,2 3,6Z" fill="#e8e4dc" stroke="#9a2a2a" stroke-width="1.4"/>`;
    return s;
  }
  function boulders(cx, cy, rx, ry, m, n = 14) {
    const r = rng(11); let s = '';
    for (let i = 0; i < n; i++) {
      const a = Math.PI * (i / (n - 1)) * 1 + Math.PI;
      const a2 = (i / n) * Math.PI * 2;
      const x = cx + Math.cos(a2) * rx, y = cy + Math.sin(a2) * ry;
      if (y < cy - ry * .2) continue;
      s += stone(x, y, 12 + r() * 10, 7 + r() * 5, shade(P[m].stone, -.1 + r() * .15), r, r() < .3);
    }
    return s;
  }

  /* ---------- the Cairnman ---------- */
  function cairnman(x, b, h, m, o = {}) {
    const k = h / 300, r = rng(o.seed || 31), c = o.c || P[m].stone;
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${f(k)})${o.bend ? ` rotate(${o.bend} 0 -150)` : ''}"${o.op != null ? ` opacity="${o.op}"` : ''}>`;
    const col = (cx, y0, y1, w0, w1, n) => { let s = ''; for (let i = 0; i < n; i++) { const t = i / (n - 1), y = y0 + (y1 - y0) * t, w = w0 + (w1 - w0) * t; s += stone(cx + (r() - .5) * 6, y, w / 2, Math.abs(y1 - y0) / n * .7, shade(c, (r() - .55) * .32), r, r() < .25); } return s; };
    // legs
    g += col(-26, -8, -96, 34, 28, 7) + col(26, -8, -96, 34, 28, 7);
    // torso heap
    g += col(0, -100, -214, 96, 118, 9);
    // arms: hang down, or reach
    if (o.reach) {
      for (let i = 0; i < 7; i++) { const t = i / 6; g += stone(54 + t * (o.reach[0] - 54), -206 + t * (o.reach[1] + 206), 13 - t * 3, 9, shade(c, (r() - .5) * .3), r); }
      g += roots(o.reach[0], o.reach[1], 1, '#2a2418');
    } else {
      g += col(-66, -200, -78, 26, 18, 9) + col(66, -200, -78, 26, 18, 9);
      g += roots(-66, -74, 1, '#2a2418') + roots(66, -74, 1, '#2a2418');
    }
    // head: a ring of stones round a hollow
    g += `<ellipse cx="0" cy="-252" rx="34" ry="40" fill="${shade(c, -.2)}"/>`;
    for (let i = 0; i < 11; i++) { const a = i / 11 * Math.PI * 2; g += stone(Math.cos(a) * 30, -252 + Math.sin(a) * 36, 13, 10, shade(c, (r() - .5) * .3), r, r() < .3); }
    g += `<ellipse cx="0" cy="-250" rx="17" ry="24" fill="#020202"/>`;
    g += `<path d="M-6,-232 q-4,16 2,30 M4,-232 q6,14 0,26 M0,-230 q1,18 -3,36" stroke="#3a2e1c" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    // moss on the shoulders
    g += `<path d="M-60,-212 q30,-14 60,-6 q30,-8 60,6 l-6,10 q-54,-12 -108,0Z" fill="#4f6a32" opacity=".85"/>`;
    if (o.hat) g += `<path d="M-22,-282 Q-24,-312 0,-314 Q24,-312 22,-282Z" fill="#c8302a"/><rect x="-24" y="-286" width="48" height="8" fill="#a82420"/><circle cx="0" cy="-318" r="9" fill="#e04a40"/>`;
    if (o.rim) g += `<path d="M-60,-214 Q-70,-120 -40,-8" stroke="${o.rim}" stroke-width="5" fill="none" opacity=".55"/><path d="M-30,-286 q-14,20 -6,50" stroke="${o.rim}" stroke-width="4" fill="none" opacity=".5"/>`;
    return g + '</g>';
  }
  function roots(x, y, s, c) {
    let g = '';
    [[-10, 34, -18], [-3, 44, 6], [5, 38, 16], [11, 28, 22]].forEach(([dx, len, bend]) => g += `<path d="M${f(x + dx * s)},${f(y)} q${f(bend * s)},${f(len * s * .5)} ${f(dx * s * .6)},${f(len * s)}" stroke="${c}" stroke-width="${f(3 * s)}" fill="none" stroke-linecap="round"/>`);
    return g;
  }

  /* ---------- people ---------- */
  function hiker(x, b, s, o = {}) {
    const skin = o.skin || '#e9c4a4', jacket = o.c || COL.you, leg = o.leg || '#2a2f36', hair = o.hair || '#4a3020';
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${o.flip ? -s : s},${s})"${o.op != null ? ` opacity="${o.op}"` : ''}>`;
    if (o.sit) {
      g += `<path d="M-14,-2 L18,-2 L22,-10 L-10,-14Z" fill="${leg}"/><path d="M-16,-12 L-14,-62 Q0,-68 14,-62 L14,-12Z" fill="${jacket}"/>`;
      g += `<path d="M-12,-56 L10,-30 M12,-56 L18,-28" stroke="${jacket}" stroke-width="7" stroke-linecap="round"/>`;
      g += head(0, -76, skin, hair, o);
      return g + '</g>';
    }
    g += `<rect x="-10" y="-56" width="8" height="56" fill="${leg}"/><rect x="2" y="-56" width="8" height="56" fill="${leg}"/>`;
    g += `<rect x="-12" y="-4" width="11" height="5" rx="2" fill="#3a2a1e"/><rect x="1" y="-4" width="11" height="5" rx="2" fill="#3a2a1e"/>`;
    if (o.pack !== false) g += `<rect x="${o.back ? -16 : -22}" y="-118" width="${o.back ? 32 : 14}" height="58" rx="6" fill="${o.packc || '#3a4a3a'}"/>`;
    g += `<path d="M-17,-54 L-15,-116 Q0,-124 15,-116 L17,-54Z" fill="${jacket}"/>`;
    if (o.back && o.pack !== false) g += `<rect x="-15" y="-112" width="30" height="50" rx="6" fill="${o.packc || '#3a4a3a'}"/><rect x="-11" y="-84" width="22" height="14" rx="3" fill="${shade(o.packc || '#3a4a3a', -.25)}"/>`;
    const L = o.torch ? 'M-14,-108 L-26,-86' : 'M-14,-108 L-20,-62', R = o.torch ? 'M14,-108 L34,-98' : (o.arm === 'up' ? 'M14,-108 L28,-146' : 'M14,-108 L20,-62');
    g += `<path d="${L} ${R}" stroke="${jacket}" stroke-width="7.5" stroke-linecap="round"/>`;
    if (o.camera) g += `<rect x="-8" y="-104" width="16" height="11" rx="2" fill="#222"/><circle cx="0" cy="-98.5" r="3.4" fill="#556"/>`;
    g += head(0, -136, skin, hair, o);
    return g + '</g>';
  }
  function head(x, y, skin, hair, o) {
    let g = `<rect x="${x - 5}" y="${y + 6}" width="10" height="10" fill="${shade(skin, -.12)}"/><ellipse cx="${x}" cy="${y}" rx="12" ry="14" fill="${skin}"/>`;
    if (o.long) g += `<path d="M${x - 13},${y - 2} Q${x - 14},${y - 18} ${x},${y - 18} Q${x + 14},${y - 18} ${x + 13},${y - 2} L${x + 15},${y + 24} L${x + 9},${y + 24} L${x + 9},${y} Q${x},${y - 8} ${x - 9},${y} L${x - 9},${y + 24} L${x - 15},${y + 24}Z" fill="${hair}"/>`;
    else g += `<path d="M${x - 12},${y - 2} Q${x - 13},${y - 17} ${x},${y - 17} Q${x + 13},${y - 17} ${x + 12},${y - 2} Q${x + 4},${y - 10} ${x - 12},${y - 2}Z" fill="${hair}"/>`;
    if (o.beanie) g += `<path d="M${x - 13},${y - 4} Q${x - 14},${y - 22} ${x},${y - 23} Q${x + 14},${y - 22} ${x + 13},${y - 4}Z" fill="${o.beanie}"/><rect x="${x - 14}" y="${y - 7}" width="28" height="5" fill="${shade(o.beanie, -.2)}"/><circle cx="${x}" cy="${y - 25}" r="5" fill="${shade(o.beanie, .15)}"/>`;
    if (o.back) { g += `<path d="M${x - 12},${y - 2} Q${x},${y + 14} ${x + 12},${y - 2} L${x + 12},${y - 6} Q${x},${y - 16} ${x - 12},${y - 6}Z" fill="${hair}"/>`; return g; }
    if (o.glasses) g += `<g fill="none" stroke="#222" stroke-width="1.3"><circle cx="${x - 5}" cy="${y - 1}" r="4"/><circle cx="${x + 5}" cy="${y - 1}" r="4"/></g>`;
    g += `<circle cx="${x - 5}" cy="${y - 1}" r="1.5" fill="#111"/><circle cx="${x + 5}" cy="${y - 1}" r="1.5" fill="#111"/>`;
    g += o.scared ? `<ellipse cx="${x}" cy="${y + 7}" rx="2.4" ry="3" fill="#3a1414"/>` : `<path d="M${x - 3},${y + 7} L${x + 3},${y + 7}" stroke="#7a3a2a" stroke-width="1.3"/>`;
    return g;
  }
  const DEV = { c: COL.dev, hair: '#1e1612', skin: '#b98a62' };
  const KEN = { c: COL.kenzie, beanie: '#c8302a', hair: '#d08a3a', long: true };
  const OLL = { c: COL.ollie, hair: '#a8865a', glasses: true, camera: true };
  const PRI = { c: COL.priya, hair: '#141010', skin: '#a8754e', long: true };
  const YOU = { c: COL.you, hair: '#5a3a22', packc: '#6a3a2a' };

  /* ---------- props ---------- */
  function tent(x, b, w, h, c, o = {}) {
    let s = `<path d="M${f(x - w / 2)},${f(b)} Q${f(x - w * .42)},${f(b - h * .9)} ${f(x)},${f(b - h)} Q${f(x + w * .42)},${f(b - h * .9)} ${f(x + w / 2)},${f(b)}Z" fill="${c}"/>`;
    s += `<path d="M${f(x)},${f(b - h)} L${f(x - w * .18)},${f(b)} M${f(x)},${f(b - h)} L${f(x + w * .18)},${f(b)}" stroke="${shade(c, -.3)}" stroke-width="1.5"/>`;
    if (o.glow) s += `<path d="M${f(x - w / 2)},${f(b)} Q${f(x - w * .42)},${f(b - h * .9)} ${f(x)},${f(b - h)} Q${f(x + w * .42)},${f(b - h * .9)} ${f(x + w / 2)},${f(b)}Z" fill="#ffd27a" opacity=".55"/>`;
    if (o.open) s += `<path d="M${f(x - w * .14)},${f(b)} L${f(x)},${f(b - h * .7)} L${f(x + w * .14)},${f(b)}Z" fill="#050505"/>`;
    return s;
  }
  function fire(K, x, b, s, o = {}) {
    let g = `<circle cx="${f(x)}" cy="${f(b - 10 * s)}" r="${f(140 * s * (o.glow || 1))}" fill="${K.rad('fg' + (++N), [[0, '#ffb04a', .45], [1, '#ff7a2a', 0]])}"/>`;
    g += `<path d="M${f(x - 22 * s)},${f(b)} L${f(x + 22 * s)},${f(b - 8 * s)} M${f(x - 22 * s)},${f(b - 8 * s)} L${f(x + 22 * s)},${f(b)}" stroke="#3a2416" stroke-width="${f(6 * s)}" stroke-linecap="round"/>`;
    if (o.out) return g.replace('#ffb04a', '#7a2a12') + `<circle cx="${f(x)}" cy="${f(b - 4 * s)}" r="${f(6 * s)}" fill="#c2401a" opacity=".7"/>`;
    g += `<path d="M${f(x - 16 * s)},${f(b - 4 * s)} Q${f(x - 20 * s)},${f(b - 30 * s)} ${f(x - 2 * s)},${f(b - 52 * s)} Q${f(x)},${f(b - 30 * s)} ${f(x + 8 * s)},${f(b - 40 * s)} Q${f(x + 20 * s)},${f(b - 20 * s)} ${f(x + 16 * s)},${f(b - 4 * s)}Z" fill="#ff8a2a"/>`;
    g += `<path d="M${f(x - 8 * s)},${f(b - 4 * s)} Q${f(x - 8 * s)},${f(b - 22 * s)} ${f(x)},${f(b - 32 * s)} Q${f(x + 8 * s)},${f(b - 20 * s)} ${f(x + 8 * s)},${f(b - 4 * s)}Z" fill="#ffd24a"/>`;
    return g;
  }
  function wolf(x, b, s, o = {}) {
    const c = o.c || '#5a5a58';
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${o.flip ? -s : s},${s})">`;
    g += `<path d="M-40,-30 Q-20,-44 20,-40 L38,-46 L52,-58 L56,-48 L66,-44 L58,-36 L44,-34 L34,-26 L30,0 L24,0 L22,-22 L-20,-22 L-24,0 L-30,0 L-32,-24 Q-48,-26 -60,-14 Q-50,-30 -40,-30Z" fill="${c}"/>`;
    g += `<circle cx="52" cy="-48" r="2.2" fill="#f2c23a"/>`;
    return g + '</g>';
  }
  function fence(y, m, c) {
    let s = '';
    for (let x = 10; x < 800; x += 90) s += `<rect x="${x}" y="${y - 150}" width="7" height="160" fill="${c}"/>`;
    for (let yy = y - 145; yy < y; yy += 14) s += `<line x1="0" y1="${yy}" x2="800" y2="${yy}" stroke="${c}" stroke-width="1" opacity=".7"/>`;
    for (let x = 0; x < 800; x += 14) s += `<line x1="${x}" y1="${y - 150}" x2="${x}" y2="${y}" stroke="${c}" stroke-width=".8" opacity=".5"/>`;
    return s;
  }
  function finish(K, m, s, vig) {
    return K.done(s + tint(m) + K.vignette(vig != null ? vig : (m === 'golden' ? .3 : m === 'fog' ? .45 : .75)) + K.grain(.14));
  }

  /* ================= SCENES ================= */

  S.cover_cairn = () => {
    const K = kit(), m = 'night';
    let s = forest(K, m, { ground: 240, seed: 4, clear: [300, 520] });
    s += fire(K, 250, 318, .9);
    s += cairnman(640, 300, 220, m, { op: .55, seed: 9 });
    s += boulders(400, 320, 330, 60, m, 22);
    s += cairn(430, 330, 120, m, { top: 'hat' });
    s += tent(170, 330, 90, 56, '#3a6a8a', { glow: true });
    s += sideTrees(m, 4);
    return finish(K, m, s);
  };

  S.cn_carpark = () => {
    const K = kit(), m = 'fog';
    let s = forest(K, m, { ground: 240, seed: 6 });
    s += `<rect y="250" width="800" height="150" fill="#8a8c84"/>`;
    for (let i = 0; i < 160; i++) { const r = rng(i + 3); s += `<circle cx="${f(r() * 800)}" cy="${f(255 + r() * 145)}" r="${f(r() * 1.6 + .4)}" fill="#6a6c64" opacity=".6"/>`; }
    // minibus fading into fog
    s += `<g opacity=".55"><rect x="40" y="200" width="170" height="70" rx="10" fill="#e8e8e2"/><rect x="52" y="210" width="40" height="24" fill="#9aa8b0"/><rect x="100" y="210" width="40" height="24" fill="#9aa8b0"/><rect x="148" y="210" width="40" height="24" fill="#9aa8b0"/><circle cx="80" cy="272" r="13" fill="#2a2a2a"/><circle cx="175" cy="272" r="13" fill="#2a2a2a"/></g>`;
    s += mist(K, m, .35, 150, 160, 12);
    // noticeboard
    s += `<rect x="600" y="180" width="8" height="120" fill="#4a3a2a"/><rect x="720" y="180" width="8" height="120" fill="#4a3a2a"/><rect x="590" y="160" width="148" height="92" fill="#5a4630"/><rect x="598" y="168" width="132" height="76" fill="#3a2e22"/>`;
    s += `<rect x="606" y="174" width="58" height="66" fill="#e6dcc4"/><text x="635" y="188" font-family="Georgia,serif" font-size="10" text-anchor="middle" fill="#7a2a1a" font-weight="bold">MISSING</text><ellipse cx="622" cy="210" rx="9" ry="12" fill="#cfc4ac"/><ellipse cx="648" cy="210" rx="9" ry="12" fill="#cfc4ac"/><text x="635" y="234" font-family="Georgia,serif" font-size="6" text-anchor="middle" fill="#6a5a4a">OCT 1971</text>`;
    s += `<rect x="672" y="178" width="50" height="40" fill="#c8d6c0" transform="rotate(4 697 198)"/>`;
    const r = rng(17); s += stone(640, 154, 13, 5, '#8a8c84', r) + stone(642, 145, 10, 4, '#7a7c74', r) + stone(639, 138, 7, 3.5, '#9a9c94', r);
    s += hiker(270, 352, 1.05, { ...DEV, back: false }) + hiker(330, 356, 1, { ...KEN }) + hiker(390, 350, 1.02, { ...OLL }) + hiker(450, 356, 1, { ...PRI }) + hiker(520, 362, 1.08, { ...YOU, back: true });
    s += mist(K, m, .25, 0, 400, 21);
    return finish(K, m, s);
  };

  S.cn_trail = () => {
    const K = kit(), m = 'fog';
    let s = forest(K, m, { ground: 230, seed: 8, clear: [330, 470] });
    s += `<path d="M380,230 L420,230 L560,400 L240,400Z" fill="#7a7458"/>`;
    [[392, 238, .3], [420, 250, .45], [366, 270, .7], [452, 300, 1]].forEach(([x, y, k]) => s += `<rect x="${f(x - 3 * k)}" y="${f(y - 40 * k)}" width="${f(6 * k)}" height="${f(40 * k)}" fill="#6a5a44"/><rect x="${f(x - 3 * k)}" y="${f(y - 40 * k)}" width="${f(6 * k)}" height="${f(7 * k)}" fill="#3a7ac8"/>`);
    s += `<g transform="rotate(-8 400 360)"><rect x="330" y="356" width="150" height="12" fill="#6a5a44"/><rect x="460" y="356" width="22" height="12" fill="#3a7ac8"/><path d="M330,356 l-8,4 l6,3 l-6,4 l8,1" fill="#c4b08a"/></g>`;
    s += sideTrees(m, 8) + mist(K, m, .3, 0, 400, 24);
    return finish(K, m, s);
  };

  S.cn_cairn = () => {
    const K = kit(), m = 'fog';
    let s = sky(K, m);
    s += band(250, 50, 80, P[m].far, 3, 14) + mist(K, m, .7, 0, 400, 5) + band(270, 70, 110, P[m].mid, 7, 18);
    s += mist(K, m, .5, 160, 140, 13);
    s += `<path d="M0,330 Q200,280 420,290 Q620,300 800,340 L800,400 L0,400Z" fill="#5a6248"/>`;
    s += cairn(470, 312, 150, m, { old: true, seed: 5 });
    s += hiker(330, 340, .9, { ...KEN, arm: 'up' }) + hiker(280, 344, .9, { ...DEV }) + hiker(600, 344, .9, { ...OLL }) + hiker(650, 340, .88, { ...PRI }) + hiker(390, 360, 1, { ...YOU, back: true });
    return finish(K, m, s);
  };

  S.cn_fence = () => {
    const K = kit(), m = 'fog';
    let s = forest(K, m, { ground: 240, seed: 12 });
    s += wolf(560, 292, 1.5, { c: '#34352f' });
    s += fence(300, m, '#4a4e48');
    s += `<rect x="340" y="190" width="120" height="62" fill="#e8e4d8" stroke="#2a2a2a" stroke-width="2"/><text x="400" y="207" font-family="Arial,sans-serif" font-size="9" font-weight="bold" text-anchor="middle" fill="#2a4a2a">CORRACH REWILDING ESTATE</text><text x="400" y="226" font-family="Arial,sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#b02a1a">WOLVES PRESENT</text><text x="400" y="243" font-family="Arial,sans-serif" font-size="9" text-anchor="middle" fill="#2a2a2a">DO NOT ENTER</text>`;
    s += hiker(150, 372, 1.05, { ...KEN, scared: true }) + hiker(210, 370, 1, { ...DEV }) + hiker(640, 374, 1.05, { ...PRI }) + hiker(700, 368, 1, { ...OLL });
    s += mist(K, m, .25, 0, 400, 30);
    return finish(K, m, s);
  };

  S.cn_loop = () => {
    const K = kit(), m = 'dusk';
    let s = forest(K, m, { ground: 236, seed: 14, clear: [320, 480] });
    s += `<path d="M370,236 L430,236 L580,400 L220,400Z" fill="#4a4436"/>`;
    s += `<g transform="rotate(-4 400 320)"><rect x="150" y="300" width="500" height="42" rx="20" fill="#5a4230"/><ellipse cx="650" cy="321" rx="16" ry="21" fill="#8a6a4a"/><ellipse cx="650" cy="321" rx="9" ry="13" fill="#6a4a30"/>`;
    s += `<rect x="300" y="306" width="200" height="30" fill="#7a5a3e"/><text x="400" y="328" font-family="Georgia,serif" font-size="20" font-weight="bold" text-anchor="middle" fill="#2a1a0e" letter-spacing="6">D·K·O·P·+</text></g>`;
    s += sideTrees(m, 14);
    s += hiker(250, 300, .95, { ...PRI, scared: true }) + hiker(320, 296, .9, { ...KEN, scared: true }) + hiker(500, 296, .9, { ...DEV }) + hiker(565, 300, .95, { ...OLL });
    return finish(K, m, s);
  };

  S.cn_camp = () => {
    const K = kit(), m = 'dusk';
    let s = forest(K, m, { ground: 236, seed: 16, clear: [200, 600] });
    s += `<ellipse cx="400" cy="320" rx="320" ry="62" fill="${shade(P[m].ground, .08)}"/>`;
    s += boulders(400, 320, 320, 62, m, 26);
    s += tent(250, 318, 110, 66, '#2f6a8a') + tent(560, 316, 110, 66, '#8a3a2a') + tent(420, 300, 56, 34, '#c9a43a');
    s += fire(K, 400, 352, .7);
    s += hiker(330, 372, .9, { ...DEV, pack: false }) + hiker(480, 374, .88, { ...KEN, pack: false, sit: true }) + hiker(640, 368, .86, { ...PRI, pack: false });
    s += sideTrees(m, 16);
    return finish(K, m, s);
  };

  S.cn_tent = () => {
    const K = kit(), m = 'night';
    let s = `<rect width="800" height="400" fill="#1a1408"/>`;
    s += `<path d="M0,400 L400,0 L800,400Z" fill="${K.rad('tn', [[0, '#c98a3a'], [1, '#3a240e']], .5, .75, .7)}"/>`;
    s += `<path d="M400,0 L330,400 M400,0 L470,400" stroke="#5a3a1a" stroke-width="3"/>`;
    // shadow pressing on the canvas
    s += `<g opacity=".55" transform="translate(560,400) scale(.9)"><ellipse cx="0" cy="-250" rx="40" ry="46" fill="#1a0e04"/><path d="M-70,-200 Q-80,-100 -50,0 L50,0 Q80,-100 70,-200 Q0,-230 -70,-200Z" fill="#1a0e04"/></g>`;
    s += `<rect x="300" y="300" width="200" height="100" fill="#2a3a5a"/><path d="M300,330 Q400,300 500,330 L500,400 L300,400Z" fill="#33456a"/>`;
    s += `<circle cx="250" cy="330" r="60" fill="#fff2c4" opacity=".15"/><rect x="236" y="322" width="28" height="12" rx="3" fill="#2a2a2a"/><circle cx="264" cy="328" r="5" fill="#fff6d0"/>`;
    s += K.vignette(.85) + K.grain(.18);
    return K.done(s);
  };

  S.cn_morning = () => {
    const K = kit(), m = 'fog';
    let s = forest(K, m, { ground: 236, seed: 18, clear: [200, 600] });
    s += boulders(400, 318, 330, 60, m, 26);
    s += tent(250, 312, 110, 66, '#2f6a8a') + tent(560, 310, 110, 66, '#8a3a2a') + tent(420, 296, 56, 34, '#c9a43a');
    s += cairn(470, 372, 110, m, { seed: 8 });
    s += mist(K, m, .3, 0, 400, 33);
    return finish(K, m, s);
  };

  S.cn_rations = () => {
    const K = kit(), m = 'fog';
    let s = `<rect width="800" height="400" fill="#4a5440"/><rect x="90" y="40" width="620" height="330" fill="#3a6aa8"/><path d="M90,40 L710,40 L710,370 L90,370Z" fill="none" stroke="#2a4a78" stroke-width="6"/>`;
    for (let i = 0; i < 8; i++) s += `<circle cx="${150 + i * 42}" cy="100" r="17" fill="#d9b884"/><circle cx="${150 + i * 42}" cy="100" r="17" fill="none" stroke="#b8946a" stroke-width="2"/>`;
    s += `<rect x="150" y="150" width="90" height="60" rx="4" fill="#e8c23a"/><text x="195" y="186" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="#a8261a">NOODLES</text><rect x="260" y="150" width="90" height="60" rx="4" fill="#e8c23a"/><text x="305" y="186" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="#a8261a">NOODLES</text>`;
    s += `<rect x="400" y="140" width="60" height="78" rx="4" fill="#9aa4ac"/><rect x="400" y="158" width="60" height="42" fill="#3a6a9a"/><text x="430" y="184" font-family="Arial" font-size="11" font-weight="bold" text-anchor="middle" fill="#fff">BEANS</text>`;
    s += `<path d="M500,140 L600,150 L590,230 L510,220Z" fill="#f2f2f2" opacity=".75"/>`;
    const r = rng(4), jc = ['#e84a3a', '#f2c23a', '#6ac24a', '#e88ab4', '#f28a2a'];
    for (let i = 0; i < 9; i++) s += `<ellipse cx="${f(520 + r() * 60)}" cy="${f(165 + r() * 45)}" rx="6" ry="9" fill="${jc[i % 5]}"/>`;
    s += `<rect x="160" y="260" width="140" height="34" rx="4" fill="#2a1408"/><rect x="190" y="260" width="80" height="34" fill="#c8302a"/>`;
    s += `<path d="M360,250 Q420,240 470,256 L480,330 Q420,344 360,330Z" fill="#c8b48a"/>`;
    for (let i = 0; i < 20; i++) s += `<circle cx="${f(380 + r() * 80)}" cy="${f(270 + r() * 50)}" r="3" fill="${['#5a2a1a', '#d9b884', '#7a4a2a'][i % 3]}"/>`;
    s += `<path d="M560,260 L660,250 L670,330 L570,340Z" fill="#f2ead8"/><text x="615" y="300" font-family="Georgia" font-size="11" text-anchor="middle" fill="#3a3a3a" transform="rotate(-5 615 300)">FRI · SAT · SUN</text>`;
    s += K.vignette(.5) + K.grain(.14);
    return K.done(s);
  };

  S.cn_burn = () => {
    const K = kit(), m = 'fog';
    let s = forest(K, m, { ground: 240, seed: 20, clear: [380, 760] });
    s += `<path d="M560,250 Q450,300 380,330 Q300,370 250,400 L170,400 Q240,360 320,320 Q420,280 530,250Z" fill="#6a5a3a"/><path d="M548,252 Q450,296 375,326 Q295,365 240,400 L200,400 Q260,360 330,322 Q430,282 540,252Z" fill="#8a7a5a" opacity=".6"/>`;
    s += `<path d="M520,236 Q600,220 700,236 L700,262 L520,262Z" fill="#4a5a3a"/><ellipse cx="560" cy="256" rx="18" ry="12" fill="#1a1a1a"/>`;
    s += tent(650, 238, 60, 36, '#2f6a8a') + tent(720, 236, 60, 36, '#8a3a2a') + cairn(600, 240, 40, m, { seed: 3 });
    s += hiker(140, 360, 1, { ...DEV, scared: true }) + hiker(90, 364, .96, { ...PRI });
    s += mist(K, m, .3, 0, 400, 36);
    return finish(K, m, s);
  };

  S.cn_fire = () => {
    const K = kit(), m = 'night';
    let s = forest(K, m, { ground: 236, seed: 22, clear: [160, 640] });
    s += boulders(400, 318, 330, 60, m, 26);
    [[110, 300, 60], [230, 270, 50], [600, 268, 52], [720, 302, 62]].forEach(([x, b, h], i) => s += cairn(x, b, h, m, { seed: 40 + i }));
    s += fire(K, 400, 350, 1.1, { glow: 1.4 });
    s += hiker(300, 372, .9, { ...DEV, pack: false, sit: true }) + hiker(500, 374, .9, { ...OLL, pack: false, sit: true, flip: true }) + hiker(440, 384, .95, { ...YOU, pack: false, sit: true, back: true });
    s += hiker(680, 300, .7, { ...KEN, pack: false, back: true, torch: true });
    s += `<path d="M700,276 L800,230 L800,300Z" fill="#fff4c4" opacity=".18"/>`;
    s += sideTrees(m, 22);
    return finish(K, m, s);
  };

  S.cn_kenzie = () => {
    const K = kit(), m = 'fog';
    let s = forest(K, m, { ground: 236, seed: 24, clear: [300, 520] });
    s += boulders(400, 320, 330, 60, m, 22);
    s += cairn(420, 360, 190, m, { top: 'hat', shoes: true, seed: 12 });
    s += hiker(180, 350, .9, { ...PRI, scared: true }) + hiker(640, 346, .88, { ...OLL }) + hiker(700, 350, .9, { ...DEV });
    s += mist(K, m, .28, 0, 400, 38);
    return finish(K, m, s);
  };

  S.cn_bothy = () => {
    const K = kit(), m = 'fog';
    let s = forest(K, m, { ground: 240, seed: 26, clear: [250, 560] });
    [[120, 290, 50, 'cap'], [200, 270, 40, 'kit'], [640, 274, 46, 'orange'], [720, 296, 54, 'glasses'], [580, 262, 30, null]].forEach(([x, b, h, t], i) => s += cairn(x, b, h, m, { old: true, moss: true, top: t === 'kit' || t === 'orange' || t === 'glasses' ? null : t, seed: 60 + i }));
    // bothy
    const r = rng(8);
    s += `<path d="M280,330 L280,220 L400,160 L520,220 L520,330Z" fill="#7a7a72"/>`;
    for (let y = 230; y < 330; y += 14) for (let x = 282; x < 518; x += 26) s += `<rect x="${f(x + (y / 14 % 2) * 12)}" y="${y}" width="22" height="11" rx="3" fill="${shade('#8a8a80', (r() - .5) * .3)}"/>`;
    s += `<path d="M268,224 L400,156 L470,192 L430,214 L400,198 L300,240Z" fill="#3a3a38"/><path d="M430,214 l20,-10 m10,4 l16,-6" stroke="#2a2a28" stroke-width="5"/>`;
    s += `<rect x="370" y="250" width="56" height="80" fill="#0a0a0a"/><rect x="460" y="240" width="34" height="30" fill="#0a0a0a"/>`;
    s += hiker(600, 360, .9, { ...DEV }) + hiker(200, 362, .9, { ...OLL });
    s += mist(K, m, .3, 0, 400, 40);
    return finish(K, m, s);
  };

  S.cn_wall = () => {
    const K = kit(), m = 'night';
    let s = `<rect width="800" height="400" fill="#1a120c"/>`;
    const r = rng(12);
    for (let y = 0; y < 400; y += 30) for (let x = -20; x < 820; x += 56) s += stone(x + (y / 30 % 2) * 28, y + 14, 25, 13, shade('#5a4e44', (r() - .5) * .35), r, r() < .15);
    s += `<path d="M330,120 L480,112 L492,206 L338,214Z" fill="#000"/><path d="M330,120 L480,112 L492,206 L338,214Z" fill="none" stroke="#2a1e14" stroke-width="6"/>`;
    s += roots(410, 210, 2.2, '#4a3a22') + `<path d="M360,124 q-14,-30 -50,-40 M460,116 q20,-28 56,-30 M350,200 q-30,10 -50,40" stroke="#4a3a22" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    s += `<g transform="rotate(14 600 110)">${stone(600, 110, 30, 14, '#5a4e44', r)}</g>`;
    s += `<rect width="800" height="400" fill="${K.rad('fw', [[0, '#ff8a2a', .35], [1, '#000', .2]], .2, .9, .9)}"/>`;
    s += K.vignette(.8) + K.grain(.16);
    return K.done(s);
  };

  S.cn_ollie = () => {
    const K = kit(), m = 'fog';
    let s = forest(K, m, { ground: 240, seed: 28 });
    s += cairn(560, 320, 160, m, { top: 'glasses', seed: 21 });
    s += `<rect x="0" y="300" width="300" height="100" fill="#6a6a62"/><rect x="0" y="0" width="70" height="400" fill="#4a4a44"/><rect x="230" y="0" width="70" height="300" fill="#4a4a44"/>`;
    for (let y = 10; y < 300; y += 22) s += `<rect x="232" y="${y}" width="66" height="18" rx="4" fill="#5a5a54"/><rect x="2" y="${y + 10}" width="66" height="18" rx="4" fill="#5a5a54"/>`;
    s += `<rect x="120" y="330" width="56" height="36" rx="5" fill="#1e1e1e"/><circle cx="148" cy="348" r="12" fill="#3a4050"/><circle cx="148" cy="348" r="6" fill="#0a0a10"/><rect x="128" y="324" width="14" height="7" fill="#2a2a2a"/><path d="M120,350 q-30,10 -10,26 q30,8 60,-6 q16,-10 6,-20" stroke="#222" stroke-width="3" fill="none"/>`;
    s += mist(K, m, .3, 0, 400, 42);
    return finish(K, m, s);
  };

  S.cn_moss = () => {
    const K = kit(), m = 'fog';
    let s = sky(K, m);
    s += band(250, 40, 70, P[m].far, 30, 30) + mist(K, m, .8, 0, 400, 44);
    s += `<rect y="250" width="800" height="150" fill="#6a6a44"/>`;
    const r = rng(9);
    for (let i = 0; i < 22; i++) { const y = 260 + r() * 140, w = 20 + (y - 250) * .9 * r(); s += `<ellipse cx="${f(r() * 800)}" cy="${f(y)}" rx="${f(w)}" ry="${f(w * .14)}" fill="#2a2a20" opacity=".85"/><ellipse cx="${f(r() * 800)}" cy="${f(y + 2)}" rx="${f(w * .6)}" ry="${f(w * .05)}" fill="#c8b45a" opacity=".5"/>`; }
    s += hiker(520, 266, .25, { ...DEV, back: true });
    s += band(400, 300, 380, P[m].near, 34, 40, [100, 830]);
    s += hiker(160, 392, 1.1, { ...PRI, scared: true }) + hiker(230, 396, 1.12, { ...YOU, back: true });
    s += mist(K, m, .35, 200, 200, 46);
    return finish(K, m, s);
  };

  S.cn_two = () => {
    const K = kit(), m = 'dusk';
    let s = forest(K, m, { ground: 236, seed: 30, clear: [160, 640] });
    s += boulders(400, 318, 330, 60, m, 22);
    [[130, 300, 90, 'hat'], [260, 272, 84, 'glasses'], [560, 270, 80, 'orange'], [690, 300, 70, null]].forEach(([x, b, h, t], i) => s += cairn(x, b, h, m, { top: t, seed: 70 + i }));
    s += tent(420, 312, 90, 54, '#8a3a2a');
    s += hiker(370, 370, 1, { ...PRI, pack: false, sit: true }) + hiker(440, 372, 1, { ...YOU, pack: false, sit: true, flip: true });
    s += fire(K, 400, 392, .6, { out: false });
    return finish(K, m, s);
  };

  S.cn_tents = () => {
    const K = kit(), m = 'night';
    let s = forest(K, m, { ground: 236, seed: 32, clear: [160, 640] });
    [[120, 300, 60], [250, 270, 54], [560, 268, 52], [690, 296, 64]].forEach(([x, b, h], i) => s += cairn(x, b, h, m, { seed: 80 + i }));
    s += fire(K, 600, 352, .8);
    s += tent(330, 330, 130, 80, '#2f6a8a', { glow: false }) + tent(470, 330, 130, 80, '#c9a43a', { glow: true });
    s += sideTrees(m, 32);
    return finish(K, m, s);
  };

  S.cn_alone = () => {
    const K = kit(), m = 'blood';
    let s = forest(K, m, { ground: 236, seed: 34, clear: [100, 700] });
    s += cairnman(640, 330, 260, m, { op: .9, rim: '#ff7a3a', seed: 14 });
    [[110, 312, 92, 'hat'], [230, 280, 84, 'glasses'], [400, 262, 80, 'orange'], [530, 274, 86, 'kit']].forEach(([x, b, h, t], i) => s += cairn(x, b, h, m, { top: t, seed: 90 + i }));
    s += cairn(220, 380, 60, m, { unfinished: true, seed: 99 });
    s += fire(K, 380, 360, .9, { glow: 1.3 });
    s += hiker(420, 386, 1.1, { ...YOU, pack: false, sit: true, back: true });
    return finish(K, m, s);
  };

  S.cn_dawn = () => {
    const K = kit(), m = 'fog';
    let s = forest(K, m, { ground: 236, seed: 36, clear: [180, 620] });
    s += boulders(400, 318, 330, 60, m, 22);
    s += cairn(240, 330, 120, m, { unfinished: true, seed: 99 });
    s += fire(K, 420, 350, .6, { out: true });
    s += `<text x="120" y="230" font-family="IBM Plex Mono,monospace" font-size="11" fill="#3a4a3a" opacity=".7">← THE MOSS</text><text x="620" y="230" font-family="IBM Plex Mono,monospace" font-size="11" fill="#3a4a3a" opacity=".7">THE FENCE →</text><text x="360" y="200" font-family="IBM Plex Mono,monospace" font-size="11" fill="#3a4a3a" opacity=".7">↑ THE FIREBREAK</text>`;
    s += hiker(520, 392, 1.15, { ...YOU, back: true });
    s += mist(K, m, .32, 0, 400, 48);
    return finish(K, m, s);
  };

  S.cn_firebreak = () => {
    const K = kit(), m = 'golden';
    let s = sky(K, m);
    s += `<polygon points="0,0 380,190 380,215 0,400" fill="${P[m].near}"/><polygon points="800,0 420,190 420,215 800,400" fill="${P[m].near}"/>`;
    for (let i = 0; i < 14; i++) { const t = i / 13; s += spruce(380 - 380 * t, 215 + 185 * t, 40 + 300 * t, shade(P[m].mid, -t * .4)) + spruce(420 + 380 * t, 215 + 185 * t, 40 + 300 * t, shade(P[m].mid, -t * .4)); }
    s += `<polygon points="380,215 420,215 640,400 160,400" fill="#8a7a4a"/><polygon points="390,215 410,215 470,400 330,400" fill="#7a5a6a" opacity=".5"/>`;
    s += `<rect x="392" y="206" width="16" height="9" fill="none" stroke="#5a5a5a" stroke-width="1.4"/>`;
    s += hiker(410, 392, 1.2, { ...YOU, back: true });
    s += mist(K, m, .3, 120, 160, 50);
    return finish(K, m, s);
  };

  S.cn_end_out = () => {
    const K = kit(), m = 'golden';
    let s = forest(K, m, { ground: 240, seed: 38 });
    s += `<rect y="280" width="800" height="120" fill="#9a8e74"/><rect y="276" width="800" height="6" fill="#7a6e54"/>`;
    s += `<rect x="440" y="196" width="300" height="70" fill="#7a5030"/>`;
    for (let i = 0; i < 4; i++) s += `<circle cx="${450 + i * 18}" cy="${210 + (i % 2) * 22}" r="10" fill="#c49a6a" stroke="#7a5030" stroke-width="3"/>`;
    s += `<rect x="330" y="200" width="110" height="80" rx="6" fill="#2a5a8a"/><rect x="340" y="210" width="60" height="34" fill="#9ac4e0"/>`;
    [360, 480, 690].forEach(x => s += `<circle cx="${x}" cy="282" r="20" fill="#1a1a1a"/><circle cx="${x}" cy="282" r="8" fill="#6a6a6a"/>`);
    s += hiker(250, 380, 1.15, { c: '#2a3a5a', hair: '#3a2a1a', pack: false });
    s += hiker(180, 384, 1.1, { ...YOU, back: false, pack: false }) + `<path d="M160,250 Q180,240 200,250 L206,330 L154,330Z" fill="#c25a1a"/>`;
    return finish(K, m, s);
  };

  S.cn_end_stone = () => {
    const K = kit(), m = 'golden';
    let s = forest(K, m, { ground: 240, seed: 40 });
    s += `<rect y="280" width="800" height="120" fill="#8a8a82"/><path d="M0,330 L800,330" stroke="#e8e2c8" stroke-width="4" stroke-dasharray="40 30"/>`;
    s += `<path d="M420,300 L430,250 Q440,230 480,230 L640,230 Q670,230 690,260 L720,270 L720,310 L420,310Z" fill="#b8302a"/><rect x="470" y="240" width="70" height="28" fill="#9ac4e0"/><rect x="550" y="240" width="70" height="28" fill="#9ac4e0"/>`;
    s += `<circle cx="480" cy="312" r="20" fill="#1a1a1a"/><circle cx="660" cy="312" r="20" fill="#1a1a1a"/><circle cx="716" cy="284" r="7" fill="#fff6c8"/>`;
    s += `<path d="M430,250 L380,230 L384,290 L430,300Z" fill="#a8282a"/>`;
    s += hiker(560, 360, 1, { c: '#2a6a5a', hair: '#7a4a2a', long: true, pack: false, scared: true });
    s += cairnman(200, 380, 300, m, { hat: true, seed: 22, reach: [90, -170] });
    s += mist(K, m, .3, 0, 400, 52);
    return finish(K, m, s);
  };

  S.cn_end_rescue = () => {
    const K = kit(), m = 'blood';
    let s = forest(K, m, { ground: 236, seed: 42 });
    [[560, 300], [640, 310], [720, 296]].forEach(([x, b]) => s += `<path d="M${x},${b - 90} L${x - 220},${b - 30} L${x - 210},${b + 10}Z" fill="#fff4c4" opacity=".12"/>` + hiker(x, b, .85, { c: '#e2602a', hair: '#2a2a2a', pack: false, torch: true, flip: true }));
    s += cairn(220, 360, 150, m, { top: 'pack', seed: 31 });
    s += `<path d="M300,380 Q260,340 240,300" stroke="#2a2418" stroke-width="5" fill="none"/>`;
    s += K.fog('#ffd8a0', .18, 800, 400, 54);
    return finish(K, m, s);
  };

  S.cn_end_taken = () => {
    const K = kit(), m = 'night';
    let s = forest(K, m, { ground: 236, seed: 44, clear: [160, 640] });
    [[120, 300, 80, 'hat'], [250, 270, 72, 'glasses'], [560, 268, 70, 'orange'], [690, 296, 80, 'kit']].forEach(([x, b, h, t], i) => s += cairn(x, b, h, m, { top: t, seed: 100 + i }));
    const r = rng(3);
    for (let row = 0; row < 7; row++) { const w = 200 - row * 26; for (let i = 0; i < Math.max(1, Math.round(w / 34)); i++) s += stone(400 - w / 2 + 17 + i * 34 + (r() - .5) * 8, 370 - row * 18, 17, 10, shade(P[m].stone, (r() - .5) * .3), r); }
    s += `<path d="M300,372 L296,382 L504,382 L500,372Z" fill="#c9a43a" opacity=".7"/>`;
    s += fire(K, 640, 380, .5, { out: true });
    return finish(K, m, s);
  };

  S.cn_end_wolves = () => {
    const K = kit(), m = 'dusk';
    let s = sky(K, m) + band(240, 50, 80, P[m].far, 46, 20);
    s += `<rect y="240" width="800" height="160" fill="#4a3046"/>`;
    const r = rng(5); for (let i = 0; i < 120; i++) s += `<circle cx="${f(r() * 800)}" cy="${f(250 + r() * 150)}" r="${f(2 + r() * 4)}" fill="${['#6a3a5a', '#3a2a36', '#7a4a6a'][i % 3]}"/>`;
    s += `<rect x="560" y="214" width="34" height="26" fill="#2a2228"/><rect x="572" y="222" width="8" height="8" fill="#ffd27a"/>`;
    s += fence(250, m, '#1a1418');
    s += wolf(140, 350, 1.5, { c: '#6a6a66' }) + wolf(660, 360, 1.6, { c: '#72726c', flip: true }) + wolf(290, 310, 1.1, { c: '#5a5a56' }) + wolf(530, 312, 1.15, { c: '#62625e', flip: true });
    s += hiker(400, 340, .95, { ...YOU, back: true });
    return finish(K, m, s);
  };

  S.cn_end_bog = () => {
    const K = kit(), m = 'fog';
    let s = sky(K, m) + band(240, 40, 60, P[m].far, 48, 30) + mist(K, m, .8, 0, 400, 56);
    s += `<rect y="240" width="800" height="160" fill="#5a5a3c"/>`;
    s += `<ellipse cx="400" cy="340" rx="330" ry="56" fill="#1a1a12"/>`;
    [80, 130, 190].forEach(rx => s += `<ellipse cx="420" cy="342" rx="${rx}" ry="${rx * .16}" fill="none" stroke="#5a5a44" stroke-width="2" opacity=".6"/>`);
    s += `<path d="M420,344 q-6,-30 4,-48 l6,-8 m-6,8 l-6,-10 m8,8 l1,-12 m3,10 l8,-8" stroke="#d9bca0" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M412,348 L432,348 L428,330 L416,330Z" fill="${COL.dev}"/>`;
    s += cairn(640, 262, 50, m, { seed: 17 });
    s += mist(K, m, .35, 160, 200, 58);
    return finish(K, m, s);
  };

  /* ================= JUMP SCARES (600x600) ================= */

  SC.cn_face = () => {
    const K = kit(), r = rng(77);
    let s = `<rect width="600" height="600" fill="${K.rad('bg', [[0, '#1a1a16'], [1, '#000']], .5, .5, .7)}"/>`;
    for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, d = 230 + r() * 50; s += stone(300 + Math.cos(a) * d, 300 + Math.sin(a) * d * 1.05, 70 + r() * 30, 44 + r() * 18, shade('#7a7a70', (r() - .5) * .4), r, r() < .3); }
    for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, d = 175; s += stone(300 + Math.cos(a) * d, 300 + Math.sin(a) * d * 1.1, 52, 32, shade('#8a8a80', (r() - .5) * .4), r, r() < .3); }
    s += `<ellipse cx="300" cy="300" rx="140" ry="170" fill="${K.rad('void', [[0, '#000'], [.85, '#000'], [1, '#1a1a14']])}"/>`;
    [[-60, 220, -40], [-20, 260, 30], [20, 240, -20], [60, 230, 40], [0, 280, 10]].forEach(([dx, len, bend]) => s += `<path d="M${300 + dx},${170} q${bend},${len * .5} ${dx * .4},${len}" stroke="#4a3a22" stroke-width="9" fill="none" stroke-linecap="round"/>`);
    for (let i = 0; i < 40; i++) s += `<circle cx="${f(220 + r() * 160)}" cy="${f(420 + r() * 180)}" r="${f(1 + r() * 3)}" fill="#8a8a7a" opacity=".7"/>`;
    s += K.vignette(.85, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };

  SC.cn_kenzie = () => {
    const K = kit(), r = rng(12);
    let s = `<rect width="600" height="600" fill="#0a0a08"/>`;
    s += `<ellipse cx="300" cy="320" rx="190" ry="240" fill="${K.rad('st', [[0, '#a8a89e'], [1, '#5a5a52']], .45, .4, .7)}"/>`;
    s += `<path d="M110,200 Q120,60 300,50 Q480,60 490,200 Q440,120 300,118 Q160,120 110,200Z" fill="#c8302a"/><rect x="104" y="180" width="392" height="34" fill="#a82420"/><circle cx="300" cy="40" r="34" fill="#e04a40"/>`;
    [[220, 290], [380, 290]].forEach(([x, y]) => s += `<path d="M${x - 44},${y} Q${x},${y + 22} ${x + 44},${y}" stroke="#3a3a34" stroke-width="7" fill="none"/>`);
    s += `<path d="M300,300 L290,380 L314,384" stroke="#4a4a42" stroke-width="5" fill="none"/>`;
    s += `<ellipse cx="300" cy="460" rx="80" ry="64" fill="#1a1a14"/>`;
    for (let i = 0; i < 60; i++) s += `<circle cx="${f(240 + r() * 120)}" cy="${f(420 + r() * 90)}" r="${f(2 + r() * 5)}" fill="${shade('#8a8a7e', (r() - .5) * .5)}"/>`;
    s += `<path d="M160,240 L230,330 L210,420 M420,230 L380,340 L440,450 M300,130 L320,210" stroke="#3a3a34" stroke-width="3" fill="none"/>`;
    s += `<ellipse cx="170" cy="420" rx="40" ry="22" fill="#5f7a3a" opacity=".8"/><ellipse cx="440" cy="250" rx="30" ry="16" fill="#5f7a3a" opacity=".8"/>`;
    s += K.vignette(.85, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };

  SC.cn_photo = () => {
    const K = kit();
    let s = `<rect width="600" height="600" fill="#111"/><rect x="30" y="80" width="540" height="440" rx="18" fill="#222"/><rect x="56" y="104" width="488" height="366" fill="#05070a"/>`;
    s += `<g transform="translate(56,104) scale(.61,.915)">`;
    s += `<rect width="800" height="400" fill="#0a0e0a"/>`;
    for (let i = 0; i < 9; i++) s += spruce(i * 100 + 20, 400, 380, '#26342a');
    s += `<rect width="800" height="400" fill="${K.rad('fl', [[0, '#e8f0e0', .5], [1, '#000', 0]], .5, .7, .7)}"/>`;
    s += cairnman(420, 440, 400, 'fog', { bend: 8, hat: true, reach: [-120, -60], c: '#c8ccc0', seed: 55 });
    s += `</g>`;
    s += `<text x="530" y="460" font-family="IBM Plex Mono,monospace" font-size="18" text-anchor="end" fill="#ff8a2a">MON 04:12</text><circle cx="80" cy="130" r="7" fill="#e83a2a"/><text x="96" y="136" font-family="IBM Plex Mono,monospace" font-size="16" fill="#e8e8e8">147/147</text>`;
    s += K.vignette(.7, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };

  SC.cn_hand = () => {
    const K = kit(), r = rng(33);
    let s = `<rect width="600" height="600" fill="${K.rad('tn', [[0, '#b8863a'], [1, '#2a1a08']], .5, .5, .7)}"/>`;
    s += `<path d="M180,0 L120,600 M420,0 L480,600" stroke="#5a3a14" stroke-width="5"/>`;
    s += `<path d="M260,40 L340,40 L360,600 L240,600Z" fill="#050302"/>`;
    for (let i = 0; i < 7; i++) s += stone(300 + (r() - .5) * 20, 560 - i * 52, 70 - i * 3, 30, shade('#7a7a70', (r() - .5) * .4), r, r() < .3);
    [[-60, -40], [-30, -70], [0, -84], [30, -70], [60, -40]].forEach(([dx, dy], i) => { s += stone(300 + dx * .6, 230 + dy * .4, 20, 15, shade('#8a8a80', (r() - .5) * .3), r) + stone(300 + dx, 200 + dy, 16, 13, shade('#8a8a80', (r() - .5) * .3), r) + `<path d="M${300 + dx * 1.2},${190 + dy} q${dx * .3},-30 ${dx * .1},-60" stroke="#3a2e1c" stroke-width="7" fill="none" stroke-linecap="round"/>`; });
    s += K.vignette(.8, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };

  SC.cn_wolf = () => {
    const K = kit();
    let s = `<rect width="600" height="600" fill="#2a2e2a"/>`;
    s += `<path d="M300,90 L200,40 L180,190 Q110,260 120,360 Q150,520 300,580 Q450,520 480,360 Q490,260 420,190 L400,40Z" fill="#5a5a56"/>`;
    s += `<path d="M300,330 Q230,360 210,450 Q300,540 390,450 Q370,360 300,330Z" fill="#b8b4a8"/>`;
    [[220, 270], [380, 270]].forEach(([x, y]) => s += `<path d="M${x - 40},${y - 6} L${x + 34},${y + 6} L${x - 20},${y + 22}Z" fill="#f2c23a"/><ellipse cx="${x + 2}" cy="${y + 8}" rx="5" ry="13" fill="#000"/>`);
    s += `<ellipse cx="300" cy="380" rx="34" ry="22" fill="#111"/>`;
    s += `<path d="M220,450 Q300,420 380,450 L360,520 Q300,560 240,520Z" fill="#3a0a0a"/>`;
    [[236, 456], [258, 448], [342, 448], [364, 456]].forEach(([x, y]) => s += `<path d="M${x - 6},${y} L${x},${y + 30} L${x + 6},${y}Z" fill="#f2ead8"/>`);
    for (let x = 0; x < 600; x += 40) s += `<line x1="${x}" y1="0" x2="${x}" y2="600" stroke="#9a9a90" stroke-width="2"/>`;
    for (let y = 0; y < 600; y += 40) s += `<line x1="0" y1="${y}" x2="600" y2="${y}" stroke="#9a9a90" stroke-width="2"/>`;
    s += K.vignette(.8, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };
})();
