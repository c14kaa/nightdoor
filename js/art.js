/* NIGHTDOOR art: hand-built SVG illustrations.
   ART.scene(key) -> svg string (800x400 scenes)
   ART.scare(key) -> svg string (600x600 jump-scare close-ups) */
(function () {
  'use strict';
  let UID = 0;

  /* ---------- colour + maths helpers ---------- */
  function hex2rgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function rgb2hex(r, g, b) { return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
  function mix(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); }
  function shade(c, t) { return t < 0 ? mix(c, '#000000', -t) : mix(c, '#ffffff', t); }
  function rng(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = s * 16807 % 2147483647) / 2147483647; }
  function qb(p0, p1, p2, t) { const u = 1 - t; return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]]; }
  const f = n => Math.round(n * 10) / 10;

  /* ---------- per-drawing kit: unique ids for defs ---------- */
  function kit() {
    const u = 'nd' + (++UID) + '_';
    const defs = [];
    const K = {
      u, defs,
      lin(id, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
        defs.push(`<linearGradient id="${u + id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`).join('')}</linearGradient>`);
        return `url(#${u + id})`;
      },
      rad(id, stops, cx = .5, cy = .5, r = .5) {
        defs.push(`<radialGradient id="${u + id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`).join('')}</radialGradient>`);
        return `url(#${u + id})`;
      },
      blur(id, sd) {
        defs.push(`<filter id="${u + id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`);
        return `url(#${u + id})`;
      },
      rough(id, scale = 3) {
        defs.push(`<filter id="${u + id}"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="${scale}"/></filter>`);
        return `url(#${u + id})`;
      },
      grain(o = .14, w = 800, h = 400) {
        defs.push(`<filter id="${u}gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>`);
        return `<rect width="${w}" height="${h}" filter="url(#${u}gr)" opacity="${o}" style="mix-blend-mode:overlay"/>`;
      },
      vignette(o = .7, w = 800, h = 400, c = '#000') {
        const g = K.rad('vg', [[.45, c, 0], [1, c, o]], .5, .5, .72);
        return `<rect width="${w}" height="${h}" fill="${g}"/>`;
      },
      fog(color = '#9fe07a', o = .35, w = 800, h = 400, seed = 2, freq = '0.004 0.018') {
        const c = hex2rgb(color).map(v => (v / 255).toFixed(3));
        defs.push(`<filter id="${u}fog${seed}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" seed="${seed}"/><feColorMatrix type="matrix" values="0 0 0 0 ${c[0]} 0 0 0 0 ${c[1]} 0 0 0 0 ${c[2]} 1.8 0 0 0 -0.75"/></filter>`);
        return `<rect width="${w}" height="${h}" filter="url(#${u}fog${seed})" opacity="${o}"/>`;
      },
      done(body, vb = '0 0 800 400') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>${defs.join('')}</defs>${body}</svg>`;
      }
    };
    return K;
  }

  /* ---------- palettes ---------- */
  const PAL = {
    day:    { sky: [[0, '#6fbde8'], [1, '#d6eef8']], hill: '#a6d48e', grass: '#86c46e', road: '#9a9ea6', pave: '#d9d3c6', tint: null, sun: '#fff3b8', lampOn: false },
    golden: { sky: [[0, '#e9925a'], [.6, '#f6c886'], [1, '#fbe7b5']], hill: '#b8b766', grass: '#9cb85e', road: '#a5998a', pave: '#e0cfb0', tint: ['#ff9a3c', .22], sun: '#ffe2a0', lampOn: false },
    dusk:   { sky: [[0, '#1d1233'], [.55, '#7a2f5c'], [1, '#e2774a']], hill: '#4c3a5a', grass: '#3e4a52', road: '#4d4a58', pave: '#6c6370', tint: ['#2b1048', .55], sun: null, lampOn: true },
    night:  { sky: [[0, '#02040a'], [1, '#0c1530']], hill: '#0b1220', grass: '#0d1622', road: '#14181f', pave: '#1c2129', tint: ['#081026', .8], sun: null, lampOn: false },
    dawn:   { sky: [[0, '#9fc7e6'], [.55, '#f8d7c4'], [1, '#ffd29a']], hill: '#9cc48a', grass: '#8cc274', road: '#a3a0a4', pave: '#ddd2c6', tint: ['#ff9f86', .14], sun: '#fff0c4', lampOn: false }
  };
  const WALLS = ['#f0d4aa', '#e7bf9b', '#efe0c6', '#dcb59b', '#e9cfb6', '#d8c0a2'];
  const ROOFS = ['#a2513f', '#7c4b3c', '#8f5c45', '#6e5048'];
  const DOORS = ['#2f6f9e', '#3d8656', '#6b4c8a', '#c48a2a', '#2c5d5a'];

  /* ---------- reusable pieces ---------- */
  function house(o, lit) {
    const { x, b, w, h } = o; const rh = o.rh || h * .55; const top = b - h; const tr = o.trim || '#fbf8f0';
    let s = '';
    s += `<rect x="${f(x + w * .66)}" y="${f(top - rh * .85)}" width="${f(w * .1)}" height="${f(rh * .7)}" fill="${shade(o.roof, -.15)}"/>`;
    s += `<polygon points="${f(x - w * .06)},${f(top + 1)} ${f(x + w / 2)},${f(top - rh)} ${f(x + w * 1.06)},${f(top + 1)}" fill="${o.roof}"/>`;
    s += `<rect x="${f(x)}" y="${f(top)}" width="${f(w)}" height="${f(h)}" fill="${o.wall}"/>`;
    s += `<rect x="${f(x)}" y="${f(top)}" width="${f(w)}" height="${f(h * .06)}" fill="${shade(o.wall, -.18)}"/>`;
    const ww = w * .2, wh = h * .24;
    const wins = [[x + w * .14, top + h * .14], [x + w * .66, top + h * .14], [x + w * .14, top + h * .56]];
    wins.forEach(([wx, wy], i) => {
      const isLit = o.lit && o.lit[i];
      s += `<rect x="${f(wx)}" y="${f(wy)}" width="${f(ww)}" height="${f(wh)}" fill="${o.win}" stroke="${tr}" stroke-width="${f(Math.max(1, w * .018))}"/>`;
      if (o.curtain) s += `<rect x="${f(wx)}" y="${f(wy)}" width="${f(ww)}" height="${f(wh)}" fill="${o.curtain}"/>`;
      if (isLit && lit) lit.push(`<rect x="${f(wx)}" y="${f(wy)}" width="${f(ww)}" height="${f(wh)}" fill="${o.litc || '#ffcf73'}"/>`);
      s += `<line x1="${f(wx + ww / 2)}" y1="${f(wy)}" x2="${f(wx + ww / 2)}" y2="${f(wy + wh)}" stroke="${tr}" stroke-width="${f(Math.max(.6, w * .01))}"/>`;
    });
    const dw = w * .17, dh = h * .4, dx = x + w * .62, dy = b - dh;
    s += `<rect x="${f(dx - w * .02)}" y="${f(dy - w * .02)}" width="${f(dw + w * .04)}" height="${f(dh + w * .02)}" fill="${tr}"/>`;
    s += `<rect x="${f(dx)}" y="${f(dy)}" width="${f(dw)}" height="${f(dh)}" fill="${o.door}"/>`;
    s += `<circle cx="${f(dx + dw * .8)}" cy="${f(dy + dh * .55)}" r="${f(Math.max(.8, w * .012))}" fill="#e8c35a"/>`;
    if (o.num) s += `<text x="${f(dx + dw / 2)}" y="${f(dy + dh * .3)}" font-size="${f(w * .07)}" font-family="Georgia,serif" font-weight="700" text-anchor="middle" fill="#f3d27a">${o.num}</text>`;
    if (o.roses) { const r = rng(o.roses); for (let i = 0; i < 9; i++) s += `<circle cx="${f(dx - w * .06 + r() * w * .05)}" cy="${f(dy + r() * dh)}" r="${f(w * .018)}" fill="${i % 3 ? '#d6455b' : '#4f8a45'}"/>`; }
    return s;
  }

  function tree(x, b, s, c1, c2) {
    return `<rect x="${f(x - s * .06)}" y="${f(b - s * .55)}" width="${f(s * .12)}" height="${f(s * .55)}" fill="${c2}"/>` +
      `<circle cx="${f(x)}" cy="${f(b - s * .75)}" r="${f(s * .38)}" fill="${c1}"/><circle cx="${f(x - s * .25)}" cy="${f(b - s * .58)}" r="${f(s * .26)}" fill="${c1}"/><circle cx="${f(x + s * .26)}" cy="${f(b - s * .6)}" r="${f(s * .27)}" fill="${shade(c1, -.08)}"/>`;
  }

  function dog(x, b, s, opt = {}) {
    const c = opt.c || '#b9783f', d = shade(c, -.3);
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${s})">`;
    g += `<ellipse cx="0" cy="-18" rx="22" ry="11" fill="${c}"/>`;
    g += `<rect x="-17" y="-12" width="5" height="12" fill="${d}"/><rect x="11" y="-12" width="5" height="12" fill="${d}"/>`;
    g += `<path d="M-21,-22 q-12,-14 -6,-20" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    g += `<circle cx="22" cy="-28" r="10" fill="${c}"/><ellipse cx="31" cy="-25" rx="6" ry="4" fill="${shade(c, .15)}"/><circle cx="36" cy="-26" r="2" fill="#222"/>`;
    g += `<path d="M16,-36 q-6,4 -3,14" stroke="${d}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    g += `<circle cx="24" cy="-31" r="1.6" fill="#111"/>`;
    if (opt.smile) g += `<path d="M18,-22 Q30,-12 40,-24" stroke="#fff" stroke-width="1.6" fill="none"/>`;
    return g + '</g>';
  }

  function gnome(x, b, s, opt = {}) {
    const eye = opt.glow ? '#c8ff7a' : '#222';
    return `<g transform="translate(${f(x)},${f(b)}) scale(${s})"><ellipse cx="0" cy="0" rx="12" ry="3" fill="#000" opacity=".25"/>` +
      `<path d="M-10,0 L-8,-18 L8,-18 L10,0Z" fill="${opt.coat || '#3f6fae'}"/><circle cx="0" cy="-22" r="7" fill="#f1c9a5"/>` +
      `<path d="M-7,-21 Q0,-6 7,-21 L5,-14 Q0,-8 -5,-14Z" fill="#f4f1ea"/><path d="M-8,-25 L0,-44 L8,-25Z" fill="${opt.hat || '#c8392f'}"/>` +
      `<circle cx="-2.5" cy="-23.5" r="1.2" fill="${eye}"/><circle cx="2.5" cy="-23.5" r="1.2" fill="${eye}"/>` +
      `<path d="M-3,-19 Q0,-16.5 3,-19" stroke="#7a2a2a" stroke-width="1" fill="none"/></g>`;
  }

  /* wide crescent mouth with teeth */
  function grinMouth(cx, cy, w, d, o = {}) {
    const L = [cx - w / 2, cy], R = [cx + w / 2, cy], U = [cx, cy + d * .7], D = [cx, cy + d * 2.6];
    let s = `<path d="M${f(L[0])},${f(L[1])} Q${f(U[0])},${f(U[1])} ${f(R[0])},${f(R[1])} Q${f(D[0])},${f(D[1])} ${f(L[0])},${f(L[1])}Z" fill="${o.inside || '#1b0606'}"/>`;
    if (o.teeth) {
      const n = o.teeth, tc = o.tc || '#efe7cf';
      for (let i = 1; i < n; i++) {
        const t = i / n; const up = qb(L, U, R, t), lo = qb(L, D, R, t); const gap = lo[1] - up[1]; const tw = w / n * .78; const th = gap * (o.long || .44);
        s += `<path d="M${f(up[0] - tw / 2)},${f(up[1] - 1)} L${f(up[0] + tw / 2)},${f(up[1] - 1)} L${f(up[0] + tw * .12)},${f(up[1] + th)} L${f(up[0] - tw * .12)},${f(up[1] + th)}Z" fill="${tc}"/>`;
        s += `<path d="M${f(lo[0] - tw / 2)},${f(lo[1] + 1)} L${f(lo[0] + tw / 2)},${f(lo[1] + 1)} L${f(lo[0] + tw * .12)},${f(lo[1] - th * .8)} L${f(lo[0] - tw * .12)},${f(lo[1] - th * .8)}Z" fill="${shade(tc, -.12)}"/>`;
      }
    }
    s += `<path d="M${f(L[0])},${f(L[1])} Q${f(U[0])},${f(U[1])} ${f(R[0])},${f(R[1])}" fill="none" stroke="${o.lip || '#000'}" stroke-width="${o.lw || 2}" stroke-linecap="round"/>`;
    if (o.crease) s += `<path d="M${f(L[0] - 4)},${f(L[1] - 10)} q-6,10 2,22 M${f(R[0] + 4)},${f(R[1] - 10)} q6,10 -2,22" stroke="${o.crease}" stroke-width="2" fill="none" opacity=".6"/>`;
    return s;
  }

  /* slack, hanging-open jaw (no smile): dark tall opening, optional lolling tongue and drool */
  function slackMouth(cx, cy, w, h, o = {}) {
    let s = `<path d="M${f(cx - w / 2)},${f(cy)} Q${f(cx)},${f(cy - h * .18)} ${f(cx + w / 2)},${f(cy)} Q${f(cx + w * .42)},${f(cy + h)} ${f(cx)},${f(cy + h * 1.04)} Q${f(cx - w * .42)},${f(cy + h)} ${f(cx - w / 2)},${f(cy)}Z" fill="${o.inside || '#1a0606'}"/>`;
    if (o.tongue !== false) s += `<path d="M${f(cx - w * .22)},${f(cy + h * .55)} Q${f(cx + w * .1)},${f(cy + h * .5)} ${f(cx + w * .26)},${f(cy + h * .62)} Q${f(cx + w * .3)},${f(cy + h * 1.5)} ${f(cx + w * .02)},${f(cy + h * 1.42)} Q${f(cx - w * .12)},${f(cy + h * 1.05)} ${f(cx - w * .22)},${f(cy + h * .55)}Z" fill="${o.tc || '#c25a64'}"/>`;
    if (o.drool) s += `<path d="M${f(cx - w * .3)},${f(cy + h * .9)} q-2,${f(h * .6)} 1,${f(h * .9)}" stroke="#dfe6e8" stroke-width="${f(Math.max(1, w / 30))}" fill="none" opacity=".7"/>`;
    s += `<path d="M${f(cx - w / 2)},${f(cy)} Q${f(cx)},${f(cy - h * .18)} ${f(cx + w / 2)},${f(cy)}" fill="none" stroke="${o.lip || '#3a0c0c'}" stroke-width="${o.lw || 2}" stroke-linecap="round"/>`;
    return s;
  }
  /* face splitting open vertically, teeth along both edges (no smile) */
  function splitMouth(cx, top, bot, w, o = {}) {
    const mid = (top + bot) / 2; let s = `<path d="M${f(cx)},${f(top)} Q${f(cx - w)},${f(mid)} ${f(cx)},${f(bot)} Q${f(cx + w)},${f(mid)} ${f(cx)},${f(top)}Z" fill="${o.inside || '#1a0202'}"/>`;
    const n = o.teeth || 8, tc = o.tc || '#efe7d0';
    for (let i = 1; i < n; i++) {
      const t = i / n, y = top + (bot - top) * t, ex = w * 2 * t * (1 - t) * .98, tl = w * (o.long || .45) * (1 - Math.abs(t - .5)), th = (bot - top) / n * .34;
      s += `<path d="M${f(cx - ex)},${f(y - th)} L${f(cx - ex + tl)},${f(y)} L${f(cx - ex)},${f(y + th)}Z M${f(cx + ex)},${f(y - th + th * .6)} L${f(cx + ex - tl)},${f(y + th * .6)} L${f(cx + ex)},${f(y + th * 1.6)}Z" fill="${tc}"/>`;
    }
    s += `<path d="M${f(cx)},${f(top)} Q${f(cx - w)},${f(mid)} ${f(cx)},${f(bot)} Q${f(cx + w)},${f(mid)} ${f(cx)},${f(top)}Z" fill="none" stroke="${o.lip || '#3a0606'}" stroke-width="${o.lw || 2}"/>`;
    return s;
  }
  /* small round open mouth: humming / singing (no smile) */
  const humMouth = (cx, cy, r, c) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(r * .8)}" ry="${f(r)}" fill="${c || '#1a0a0a'}"/>`;

  /* bust portrait, centred on x=400, head centre y=170 */
  function person(o) {
    const skin = o.hollow ? mix(o.skin, '#a3aaa0', .65) : o.skin;
    const hair = o.hair || '#ccc';
    let s = '';
    if (o.bun) s += `<circle cx="400" cy="92" r="34" fill="${hair}"/>`;
    if (o.longhair) s += `<path d="M330,150 Q330,80 400,80 Q470,80 470,150 L478,270 L322,270Z" fill="${hair}"/>`;
    s += `<path d="M210,400 C220,300 300,262 400,258 C500,262 580,300 590,400Z" fill="${o.cloth}"/>`;
    if (o.cardigan) {
      s += `<path d="M362,262 L400,330 L438,262 Z" fill="${o.blouse || '#f4efe4'}"/>`;
      s += `<path d="M400,330 L400,400" stroke="${shade(o.cloth, -.2)}" stroke-width="3"/>`;
      for (let i = 0; i < 3; i++) s += `<circle cx="407" cy="${345 + i * 20}" r="4" fill="${shade(o.cloth, .35)}"/>`;
      if (o.brooch) s += `<circle cx="450" cy="300" r="7" fill="#d9b44a"/><circle cx="450" cy="300" r="3" fill="#b8323a"/>`;
    }
    if (o.apron) s += `<path d="M330,290 L470,290 L480,400 L320,400Z" fill="${o.apron}"/><path d="M340,290 L370,262 M460,290 L430,262" stroke="${o.apron}" stroke-width="6"/>`;
    s += `<path d="M375,215 L375,268 Q400,282 425,268 L425,215Z" fill="${shade(skin, -.14)}"/>`;
    s += `<ellipse cx="337" cy="175" rx="10" ry="16" fill="${shade(skin, -.06)}"/><ellipse cx="463" cy="175" rx="10" ry="16" fill="${shade(skin, -.06)}"/>`;
    s += `<ellipse cx="400" cy="168" rx="64" ry="80" fill="${skin}"/>`;
    // hair front
    if (o.bun || o.curls) s += `<path d="M336,150 Q336,82 400,82 Q466,82 466,150 Q452,112 400,108 Q350,112 336,150Z" fill="${hair}"/>`;
    if (o.short) s += `<path d="M334,152 Q330,86 400,84 Q470,86 466,152 Q462,118 440,110 Q400,124 360,110 Q340,118 334,152Z" fill="${hair}"/>`;
    if (o.longhair) s += `<path d="M336,160 Q336,86 400,86 Q464,86 464,160 Q440,112 400,114 Q360,112 336,160Z" fill="${hair}"/>`;
    // eyes
    const ey = 160;
    if (o.shut) {
      [[372, ey], [428, ey]].forEach(([x, y]) => {
        s += `<path d="M${x - 15},${y - 2} Q${x},${y + 9} ${x + 15},${y - 2}" stroke="${shade(skin, -.5)}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
        s += `<path d="M${x - 10},${y + 3} l-3,5 M${x},${y + 6} l0,6 M${x + 10},${y + 3} l3,5" stroke="${shade(skin, -.5)}" stroke-width="1.6"/>`;
      });
    } else if (o.hollow) {
      [[372, ey], [428, ey]].forEach(([x, y]) => {
        s += `<path d="M${x - 16},${y} Q${x},${y - 14} ${x + 16},${y} Q${x},${y + 13} ${x - 16},${y}Z" fill="#050505"/><circle cx="${x + 3}" cy="${y - 2}" r="1.8" fill="#fff"/>`;
      });
      s += `<path d="M352,${ey + 18} q20,12 40,2 M408,${ey + 20} q20,10 40,-2" stroke="${shade(skin, -.35)}" stroke-width="1.5" fill="none" opacity=".6"/>`;
    } else {
      [[372, ey], [428, ey]].forEach(([x, y]) => {
        s += `<ellipse cx="${x}" cy="${y}" rx="13" ry="${o.wideEyes ? 9 : 7}" fill="#fbfaf6"/><circle cx="${x}" cy="${y}" r="${o.wideEyes ? 4.5 : 5.5}" fill="${o.iris || '#4a6a8a'}"/><circle cx="${x}" cy="${y}" r="2.4" fill="#111"/><circle cx="${x + 2}" cy="${y - 2}" r="1.2" fill="#fff"/>`;
        s += `<path d="M${x - 15},${y - 4} Q${x},${y - 14} ${x + 15},${y - 4}" stroke="${shade(skin, -.4)}" stroke-width="2" fill="none"/>`;
      });
    }
    s += `<path d="M352,${ey - 22} q20,-8 40,0 M408,${ey - 22} q20,-8 40,0" stroke="${shade(hair, -.25)}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    if (o.glasses) s += `<g fill="none" stroke="#6a4b2a" stroke-width="2.5"><circle cx="372" cy="${ey}" r="20"/><circle cx="428" cy="${ey}" r="20"/><path d="M392,${ey} q8,-6 16,0 M352,${ey - 2} L337,${ey - 6} M448,${ey - 2} L463,${ey - 6}"/></g>`;
    s += `<path d="M400,${ey + 6} q-8,26 -2,30 q6,3 12,-2" stroke="${shade(skin, -.3)}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    s += `<circle cx="352" cy="200" r="13" fill="#e88a8a" opacity="${o.hollow ? 0 : .3}"/><circle cx="448" cy="200" r="13" fill="#e88a8a" opacity="${o.hollow ? 0 : .3}"/>`;
    const sm = o.smile || 'kind';
    if (sm === 'kind') s += `<path d="M370,210 Q400,236 430,210" stroke="#8a3434" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M376,212 Q400,228 424,212Z" fill="#fff"/>`;
    if (sm === 'wide') s += grinMouth(400, 205, 104, 15, { teeth: 12, tc: '#f6f1e2', inside: '#4a1414', lip: '#7a2a2a', lw: 3, crease: shade(skin, -.35) });
    if (sm === 'huge') s += grinMouth(400, 196, 152, 24, { teeth: 18, tc: '#efe6c8', inside: '#140303', lip: '#2a0a0a', lw: 3, long: .5, crease: shade(skin, -.4) });
    if (sm === 'hum') s += humMouth(400, 214, 10, '#2a0e10');
    if (sm === 'flat') s += `<path d="M378,214 L422,214" stroke="${shade(skin, -.45)}" stroke-width="3" stroke-linecap="round"/>`;
    if (sm === 'slack') s += slackMouth(400, 204, 46, 52, { drool: true }) + `<path d="M340,206 q-6,40 14,70 M460,206 q6,40 -14,70" stroke="${shade(skin, -.3)}" stroke-width="2" fill="none" opacity=".7"/>`;
    if (o.greyHalf) s += `<path d="M400,80 L480,80 L480,400 L400,400Z" fill="#8f978e" opacity=".55" style="mix-blend-mode:color"/><path d="M400,90 L470,90 L470,262 L400,262Z" fill="#7d867c" opacity=".35"/>`;
    if (o.hold === 'cake') s += `<g><ellipse cx="400" cy="372" rx="92" ry="20" fill="#f5f5f5"/><rect x="330" y="330" width="140" height="40" rx="6" fill="#f2d27a"/><path d="M330,334 Q360,350 380,334 Q400,352 420,334 Q445,352 470,334 L470,330 L330,330Z" fill="#fffbe8"/><rect x="330" y="350" width="140" height="6" fill="#e2b24a"/></g>`;
    return s;
  }
  const at = (cx, cy, s, inner) => `<g transform="translate(${f(cx - 400 * s)},${f(cy - 170 * s)}) scale(${s})">${inner}</g>`;

  /* tall smiling man silhouette (Mr Harrow), feet at (x,b), height h */
  function harrow(x, b, h, opt = {}) {
    const s = h / 200; const c = opt.c || '#050507';
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${f(s)})">`;
    g += `<path d="M-14,0 L-10,-110 L-24,-112 L-30,-150 Q-30,-160 -16,-160 L16,-160 Q30,-160 30,-150 L24,-112 L10,-110 L14,0 L6,0 L0,-90 L-6,0Z" fill="${c}"/>`;
    g += `<path d="M-30,-150 L-38,-60 L-34,-58 L-26,-120 M30,-150 L38,-60 L34,-58 L26,-120" stroke="${c}" stroke-width="7" fill="none"/>`;
    g += `<path d="M-38,-60 l-4,22 M-38,-60 l0,24 M-37,-60 l4,22 M38,-60 l4,22 M38,-60 l0,24 M37,-60 l-4,22" stroke="${c}" stroke-width="2.4"/>`;
    g += `<ellipse cx="0" cy="-178" rx="15" ry="22" fill="${opt.face || c}"/>`;
    g += `<path d="M-20,-192 L20,-192 L22,-188 L-22,-188Z M-12,-192 Q-12,-212 0,-212 Q12,-212 12,-192Z" fill="${c}"/>`;
    if (opt.smile !== false) g += `<path d="M-13,-172 Q0,-160 13,-172 Q0,-155 -13,-172Z" fill="${opt.smile || '#f4efe0'}"/>`;
    if (opt.eyes) g += `<circle cx="-5" cy="-182" r="1.4" fill="${opt.eyes}"/><circle cx="5" cy="-182" r="1.4" fill="${opt.eyes}"/>`;
    return g + '</g>';
  }

  /* ice-cream van */
  function van(x, b, w, opt = {}) {
    const h = w * .55, k = w / 100;
    let s = `<g transform="translate(${f(x)},${f(b)}) scale(${f(k)})">`;
    s += `<ellipse cx="50" cy="0" rx="56" ry="5" fill="#000" opacity=".25"/>`;
    s += `<path d="M2,-12 L2,-50 Q2,-54 6,-54 L70,-54 L72,-38 L96,-36 Q100,-35 100,-30 L100,-12Z" fill="${opt.body || '#f6f2ec'}"/>`;
    s += `<rect x="2" y="-30" width="98" height="8" fill="${opt.stripe || '#e57da2'}"/>`;
    s += `<path d="M73,-50 L76,-38 L95,-36 L82,-50Z" fill="${opt.glass || '#9fd3ef'}"/>`;
    s += `<rect x="12" y="-49" width="42" height="16" rx="2" fill="${opt.hatch || '#2a2a33'}"/>`;
    if (!opt.noCone) s += `<path d="M30,-54 L36,-72 L42,-54Z" fill="#e7b35a"/><circle cx="36" cy="-74" r="6" fill="#fbe6ef"/><circle cx="36" cy="-79" r="4" fill="#fbe6ef"/>`;
    s += `<circle cx="22" cy="-10" r="8" fill="#222"/><circle cx="22" cy="-10" r="3" fill="#888"/><circle cx="82" cy="-10" r="8" fill="#222"/><circle cx="82" cy="-10" r="3" fill="#888"/>`;
    s += `<text x="33" y="-40" font-family="Georgia,serif" font-size="7" font-weight="700" fill="${opt.textc || '#fbe6ef'}" text-anchor="middle">SUNNY</text>`;
    return s + '</g>';
  }

  /* ---------- the street (cul-de-sac view) ---------- */
  function street(opt = {}) {
    const K = kit(); const P = PAL[opt.mood || 'day']; const lit = [];
    let s = `<rect width="800" height="400" fill="${K.lin('sky', P.sky)}"/>`;
    if (P.sun) s += `<circle cx="${opt.mood === 'dawn' ? 400 : 650}" cy="${opt.mood === 'dawn' ? 228 : 70}" r="${opt.mood === 'dawn' ? 60 : 34}" fill="${P.sun}"/><circle cx="${opt.mood === 'dawn' ? 400 : 650}" cy="${opt.mood === 'dawn' ? 228 : 70}" r="${opt.mood === 'dawn' ? 110 : 70}" fill="${P.sun}" opacity=".25"/>`;
    if (opt.mood === 'day') s += `<g fill="#fff" opacity=".85"><ellipse cx="160" cy="70" rx="56" ry="16"/><ellipse cx="196" cy="60" rx="34" ry="16"/><ellipse cx="470" cy="110" rx="44" ry="12"/></g>`;
    if (opt.mood === 'dusk' || opt.mood === 'night') { const r = rng(7); for (let i = 0; i < 40; i++) s += `<circle cx="${f(r() * 800)}" cy="${f(r() * 140)}" r="${f(r() * 1.2 + .3)}" fill="#fff" opacity="${f(r() * .6 + .2)}"/>`; }
    if (opt.mood === 'dusk' || opt.mood === 'night') s += `<circle cx="610" cy="66" r="18" fill="#f3e9d2" opacity=".9"/><circle cx="617" cy="62" r="16" fill="${P.sky[0][1]}"/>`;
    const r = rng(11);
    for (let i = 0; i < 26; i++) { const x = i * 32 + r() * 10; s += `<ellipse cx="${f(x)}" cy="${f(232 - r() * 10)}" rx="${f(26 + r() * 10)}" ry="${f(16 + r() * 8)}" fill="${shade(P.hill, -.12 - r() * .1)}"/>`; }
    s += `<rect y="230" width="800" height="170" fill="${P.grass}"/>`;
    s += `<polygon points="120,400 365,238 435,238 680,400" fill="${P.pave}"/>`;
    s += `<polygon points="170,400 375,238 425,238 630,400" fill="${P.road}"/>`;
    s += `<path d="M400,240 L400,400" stroke="${shade(P.road, .35)}" stroke-width="3" stroke-dasharray="14 16" opacity=".55"/>`;
    const H = [
      { x: 352, b: 242, w: 96, h: 60, num: '13', door: '#c9442f', main: true },
      { x: 262, b: 258, w: 72, h: 50 }, { x: 466, b: 258, w: 72, h: 50 },
      { x: 150, b: 286, w: 120, h: 80 }, { x: 530, b: 286, w: 120, h: 80 },
      { x: -44, b: 334, w: 200, h: 128 }, { x: 644, b: 334, w: 200, h: 128 }
    ];
    H.forEach((hh, i) => {
      const o = Object.assign({ wall: WALLS[i % WALLS.length], roof: ROOFS[i % ROOFS.length], door: hh.door || DOORS[i % DOORS.length], win: opt.mood === 'night' ? '#0b0f18' : '#bfe2f3' }, hh);
      if (opt.mood === 'dusk') { o.lit = hh.main ? [0, 0, 0] : [i % 2, 0, i % 3 === 0]; o.curtain = hh.main ? null : null; o.win = '#2a2f40'; }
      if (opt.mood === 'golden') o.win = '#f7d7a0';
      if (opt.curtains && !hh.main) { o.curtain = '#3a2238'; o.lit = null; }
      if (hh.main) o.roses = 5;
      s += `<rect x="${f(hh.x + hh.w * .62)}" y="${f(hh.b)}" width="${f(hh.w * .17)}" height="${f(hh.w * .1)}" fill="${shade(P.pave, -.05)}"/>`;
      s += house(o, lit);
    });
    // hedges
    s += `<rect x="-10" y="336" width="190" height="16" rx="8" fill="${shade(P.grass, -.25)}"/><rect x="620" y="336" width="190" height="16" rx="8" fill="${shade(P.grass, -.25)}"/>`;
    // lamps
    [[248, 320], [552, 320], [326, 270], [474, 270]].forEach(([x, y], i) => {
      const hgt = (y - 200) * 1.05;
      s += `<rect x="${f(x - 1.5)}" y="${f(y - hgt)}" width="3" height="${f(hgt)}" fill="#2d2f36"/><rect x="${f(x - 5)}" y="${f(y - hgt - 6)}" width="10" height="7" fill="#2d2f36"/>`;
      if (P.lampOn && !opt.lampsOff) lit.push(`<circle cx="${x}" cy="${f(y - hgt - 2)}" r="16" fill="#ffd27a" opacity=".35"/><rect x="${f(x - 4)}" y="${f(y - hgt - 5)}" width="8" height="5" fill="#fff1c4"/>`);
    });
    s += tree(70, 352, 120, shade(P.grass, -.15), '#5a4030') + tree(735, 352, 120, shade(P.grass, -.18), '#5a4030');
    if (!opt.noGnome) s += gnome(420, 262, .55, { glow: opt.mood === 'dusk' || opt.mood === 'night' });
    if (opt.van) s += van(275, 268, 64);
    if (opt.watchers) {
      [[70, 334, 1], [210, 286, .65], [590, 286, .65], [728, 334, 1]].forEach(([x, b, k]) => {
        s += `<g transform="translate(${x},${b}) scale(${k})"><rect x="-14" y="-46" width="28" height="40" rx="10" fill="#4a3b52"/><circle cx="0" cy="-58" r="12" fill="#f0d6bf"/><circle cx="-4" cy="-60" r="1.6" fill="#111"/><circle cx="4" cy="-60" r="1.6" fill="#111"/><path d="M-6,-53 Q0,-48 6,-53" stroke="#7a2a2a" stroke-width="1.6" fill="none"/><path d="M-14,-40 l-6,22 M14,-40 l6,-26" stroke="#4a3b52" stroke-width="5" stroke-linecap="round"/></g>`;
      });
    }
    if (opt.dog) s += dog(250, 372, 1.1);
    if (opt.figure) s += harrow(400, 252, 74, { c: '#030305' });
    if (P.tint) s += `<rect width="800" height="400" fill="${P.tint[0]}" opacity="${P.tint[1]}" style="mix-blend-mode:multiply"/>`;
    s += lit.join('');
    if (opt.figure) s += `<path d="M396.3,${f(252 - 74 / 200 * 172)} q3.7,3 7.4,0" stroke="#fff" stroke-width="1.8" fill="none"/><circle cx="400" cy="${f(252 - 74 / 200 * 172)}" r="10" fill="#fff" opacity=".12"/>`;
    if (opt.mood === 'golden') s += `<rect width="800" height="400" fill="${K.lin('gl', [[0, '#ffcf7a', .35], [1, '#ffcf7a', 0]], 0, 0, 1, 1)}"/>`;
    s += K.vignette(opt.mood === 'day' || opt.mood === 'dawn' ? .25 : .75) + K.grain(.12);
    return K.done(s);
  }

  /* ---------- individual scenes ---------- */
  const S = {};

  S.street_day = () => street({ mood: 'day', dog: true });
  S.street_watchers = () => street({ mood: 'golden', watchers: true, van: true, dog: true });
  S.street_dusk = () => street({ mood: 'dusk', van: true, curtains: true });
  S.street_figure = () => street({ mood: 'dusk', figure: true, curtains: true, lampsOff: true });
  S.dawn = () => street({ mood: 'dawn', dog: true, noGnome: false });
  S.cover_primrose = () => street({ mood: 'dusk', figure: true, curtains: true });

  function gardenScene(golden) {
    const K = kit(); const sky = golden ? [[0, '#ec9a5e'], [1, '#fbe1aa']] : [[0, '#79c3ea'], [1, '#dff1f8']];
    let s = `<rect width="800" height="400" fill="${K.lin('sky', sky)}"/>`;
    s += `<rect y="250" width="800" height="150" fill="${golden ? '#9eb35c' : '#85c46c'}"/>`;
    s += `<path d="M0,250 Q200,236 400,248 T800,244 L800,262 L0,262Z" fill="${golden ? '#7e9a48' : '#6aa95a'}"/>`;
    // fence
    for (let x = 0; x < 800; x += 22) s += `<rect x="${x}" y="196" width="18" height="60" fill="${golden ? '#b98a5c' : '#c49a6c'}"/>`;
    // back of house (right)
    s += `<rect x="520" y="60" width="300" height="250" fill="#ead2ad"/><polygon points="500,62 680,-40 840,62" fill="#9a4b3b"/>`;
    s += `<rect x="560" y="100" width="70" height="70" fill="#bfe2f3" stroke="#fff" stroke-width="5"/><rect x="680" y="100" width="70" height="70" fill="#bfe2f3" stroke="#fff" stroke-width="5"/>`;
    s += `<rect x="610" y="200" width="60" height="110" fill="#5a7a5a"/><circle cx="660" cy="258" r="3" fill="#e8c35a"/>`;
    // shed
    s += `<rect x="300" y="170" width="120" height="96" fill="#7b5a3e"/><polygon points="290,172 360,130 430,172" fill="#4f3a2a"/><rect x="345" y="200" width="32" height="66" fill="#5b412c"/>`;
    for (let x = 304; x < 420; x += 12) s += `<line x1="${x}" y1="172" x2="${x}" y2="266" stroke="#5b412c" stroke-width="1.4"/>`;
    // apple tree with swing
    s += `<path d="M120,330 Q130,220 110,150 M118,200 Q170,160 240,150" stroke="#5a3e2a" stroke-width="18" fill="none" stroke-linecap="round"/>`;
    s += `<circle cx="110" cy="110" r="80" fill="#5f9c4c"/><circle cx="190" cy="120" r="70" fill="#6aa956"/><circle cx="60" cy="150" r="56" fill="#5a9446"/>`;
    [[90, 90], [150, 130], [200, 100], [60, 140], [130, 160]].forEach(([x, y]) => s += `<circle cx="${x}" cy="${y}" r="7" fill="#d8443a"/>`);
    s += `<line x1="200" y1="156" x2="214" y2="300" stroke="#444" stroke-width="2"/><line x1="236" y1="152" x2="246" y2="300" stroke="#444" stroke-width="2"/><rect x="205" y="298" width="48" height="8" fill="#6b4a33" transform="rotate(-6 229 302)"/>`;
    // foxgloves
    const r = rng(4);
    for (let i = 0; i < 14; i++) { const x = 20 + i * 34 + r() * 10, b = 330 + r() * 40; s += `<line x1="${f(x)}" y1="${f(b)}" x2="${f(x)}" y2="${f(b - 60)}" stroke="#3f7a3a" stroke-width="2"/>`; for (let j = 0; j < 5; j++) s += `<ellipse cx="${f(x + (j % 2 ? 4 : -4))}" cy="${f(b - 20 - j * 9)}" rx="4" ry="6" fill="${i % 2 ? '#c76bb0' : '#e08cc8'}"/>`; }
    s += gnome(590, 318, 1.5);
    s += dog(420, 360, 1.3);
    if (golden) s += `<rect width="800" height="400" fill="#ff9a3c" opacity=".18" style="mix-blend-mode:multiply"/><rect width="800" height="400" fill="${K.lin('gl', [[0, '#ffd08a', .45], [1, '#ffd08a', 0]], 1, 0, 0, 1)}"/>`;
    s += K.vignette(.3) + K.grain(.12);
    return K.done(s);
  }
  S.garden = () => gardenScene(false);
  S.garden_golden = () => gardenScene(true);

  S.abernathy = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="${K.lin('sky', [[0, '#8ccbef'], [1, '#e2f2f8']])}"/>`;
    s += `<rect x="0" y="40" width="800" height="360" fill="#efd9b4"/><rect x="0" y="40" width="800" height="12" fill="#d6b88f"/>`;
    s += `<rect x="560" y="90" width="120" height="250" fill="#c9442f"/><rect x="552" y="82" width="136" height="10" fill="#fbf8f0"/><text x="620" y="140" font-family="Georgia,serif" font-size="30" font-weight="700" fill="#f3d27a" text-anchor="middle">13</text>`;
    s += `<rect x="90" y="110" width="140" height="110" fill="#bfe2f3" stroke="#fff" stroke-width="8"/>`;
    const r = rng(9); for (let i = 0; i < 40; i++) s += `<circle cx="${f(500 + r() * 60)}" cy="${f(120 + r() * 240)}" r="${f(6 + r() * 6)}" fill="${i % 3 ? '#d6455b' : '#4f8a45'}"/>`;
    s += person({ skin: '#f2d2bf', hair: '#d9d6d2', bun: true, cloth: '#b79ad2', cardigan: true, brooch: true, glasses: true, smile: 'kind', hold: 'cake', iris: '#5d7f9a' });
    s += `<g transform="translate(560,316)"><path d="M0,0 q8,-26 26,-30 q6,10 -2,30Z" fill="#fff"/><text x="14" y="-6" font-size="9" fill="#666">SALT</text></g>`;
    s += K.vignette(.3) + K.grain(.1);
    return K.done(s);
  };

  S.abernathy_you = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="${K.lin('sky', [[0, '#8ccbef'], [1, '#e2f2f8']])}"/>`;
    s += `<rect x="0" y="40" width="800" height="360" fill="#efd9b4"/>`;
    s += `<rect x="580" y="90" width="120" height="250" fill="#c9442f"/><text x="640" y="140" font-family="Georgia,serif" font-size="30" font-weight="700" fill="#f3d27a" text-anchor="middle">13</text>`;
    s += van(40, 330, 230, { body: '#e9e4dc', stripe: '#6c7a8c', textc: '#fff', noCone: true }).replace('SUNNY', 'MOVERS');
    s += person({ skin: '#ecc9b0', hair: '#5a3e2b', short: true, cloth: '#b79ad2', cardigan: true, smile: 'huge', wideEyes: true, iris: '#6b5a3a' });
    s += K.vignette(.35) + K.grain(.12);
    return K.done(s);
  };

  S.party = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="${K.lin('sky', [[0, '#6fbde8'], [1, '#d6eef8']])}"/>`;
    for (let i = 0; i < 6; i++) s += house({ x: i * 140 - 20, b: 230, w: 130, h: 120, wall: WALLS[i], roof: ROOFS[i % 4], door: DOORS[i % 5], win: '#bfe2f3' });
    s += `<rect y="228" width="800" height="172" fill="#a9a6a2"/><rect y="228" width="800" height="14" fill="#cfc9c0"/>`;
    // bunting
    const cols = ['#e04b4b', '#f2c14e', '#3f8fd1', '#5fb35c', '#f08ac0'];
    [[0, 40, 800, 70], [0, 90, 800, 60]].forEach(([x1, y1, x2, y2], row) => {
      s += `<path d="M${x1},${y1} Q400,${y1 + 50} ${x2},${y2}" stroke="#555" stroke-width="1.5" fill="none"/>`;
      for (let i = 0; i < 22; i++) { const t = (i + .5) / 22; const [x, y] = qb([x1, y1], [400, y1 + 50], [x2, y2], t); s += `<path d="M${f(x - 12)},${f(y)} L${f(x + 12)},${f(y)} L${f(x)},${f(y + 22)}Z" fill="${cols[(i + row) % 5]}"/>`; }
    });
    // table
    s += `<rect x="250" y="270" width="300" height="20" fill="#fff"/><path d="M250,290 L550,290 L540,330 L260,330Z" fill="#f4f4f4"/><rect x="270" y="330" width="6" height="40" fill="#777"/><rect x="524" y="330" width="6" height="40" fill="#777"/>`;
    for (let i = 0; i < 9; i++) s += `<ellipse cx="${270 + i * 32}" cy="268" rx="12" ry="5" fill="${['#e2a64a', '#d9573b', '#7cc96a', '#f2d27a'][i % 4]}"/>`;
    // bbq + smoke
    s += `<rect x="90" y="270" width="80" height="30" rx="4" fill="#333"/><rect x="100" y="300" width="4" height="50" fill="#333"/><rect x="156" y="300" width="4" height="50" fill="#333"/>`;
    s += `<g fill="#ddd" opacity=".7"><circle cx="120" cy="240" r="16"/><circle cx="134" cy="210" r="20"/><circle cx="118" cy="176" r="24"/></g>`;
    // people
    const ppl = [[200, 360, 1.05, '#c84f3c', '#6b4630', 'chef'], [600, 360, 1, '#5f8fd1', '#f0d2bc'], [680, 360, .95, '#8a6bb0', '#e9c4a8'], [360, 380, .55, '#f2c14e', '#f3d5c0'], [420, 380, .55, '#f2c14e', '#f3d5c0']];
    ppl.forEach(([x, b, k, c, sk, hat]) => {
      s += `<g transform="translate(${x},${b}) scale(${k})"><rect x="-20" y="-90" width="40" height="70" rx="14" fill="${c}"/><rect x="-16" y="-24" width="12" height="24" fill="#333"/><rect x="4" y="-24" width="12" height="24" fill="#333"/><circle cx="0" cy="-108" r="18" fill="${sk}"/>`;
      if (hat) s += `<rect x="-14" y="-140" width="28" height="18" rx="8" fill="#fff"/><rect x="-16" y="-126" width="32" height="6" fill="#fff"/>`;
      s += `<circle cx="-6" cy="-110" r="2" fill="#111"/><circle cx="6" cy="-110" r="2" fill="#111"/><path d="M-9,-101 Q0,-92 9,-101" stroke="#7a2a2a" stroke-width="2" fill="none"/></g>`;
    });
    s += van(700, 250, 110);
    s += `<g stroke="#fff" stroke-width="3" fill="none" opacity=".85" stroke-linecap="round"><path d="M300,370 l40,0 l0,22 l-40,0z M340,370 l40,0 l0,22"/></g>`;
    s += dog(520, 392, 1);
    s += K.vignette(.25) + K.grain(.1);
    return K.done(s);
  };

  S.chalk = () => {
    const K = kit(); const rough = K.rough('ch', 2.5);
    let s = `<rect width="800" height="400" fill="#8f8e8b"/>`;
    const r = rng(21);
    for (let y = 0; y < 400; y += 100) for (let x = (y / 100 % 2) * -60; x < 800; x += 120) s += `<rect x="${x + 2}" y="${y + 2}" width="116" height="96" fill="${shade('#8f8e8b', (r() - .5) * .12)}"/>`;
    s += `<g fill="none" stroke-linecap="round" stroke-linejoin="round" filter="${rough}" opacity=".92">`;
    s += `<path d="M60,210 L740,210" stroke="#f4f1e6" stroke-width="5"/>`;
    s += `<path d="M180,210 L180,110 L300,110 L300,210 M170,112 L240,56 L310,112" stroke="#f4f1e6" stroke-width="5"/>`;
    s += `<path d="M228,210 L228,160 L256,160 L256,210" stroke="#f08a8a" stroke-width="5"/><path d="M200,130 l20,0 l0,18 l-20,0z M262,130 l20,0 l0,18 l-20,0z" stroke="#9fd0f0" stroke-width="4"/>`;
    s += `<text x="242" y="100" font-family="Georgia,serif" font-size="26" fill="#f4f1e6" stroke="none" text-anchor="middle">13</text>`;
    s += `<path d="M120,240 q40,20 10,50 q-30,30 20,60 M330,236 q-30,30 0,60" stroke="#c2a26a" stroke-width="3" stroke-dasharray="6 10"/>`;
    s += `<path d="M206,300 L206,372 L262,372 L262,300 Z" stroke="#f4f1e6" stroke-width="5"/><circle cx="252" cy="338" r="3" stroke="#f4f1e6" stroke-width="3"/>`;
    s += `<path d="M300,330 m-8,-14 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M300,324 L300,352 M300,334 L288,344 M300,334 L312,344 M300,352 L292,368 M300,352 L308,368 M290,326 L310,326 L304,346 L296,346Z" stroke="#f2d04a" stroke-width="4"/>`;
    s += `<path d="M480,210 L480,90 M480,120 L440,175 M480,120 L520,175 M480,210 L456,206 M480,210 L506,206" stroke="#f4f1e6" stroke-width="5"/>`;
    s += `<path d="M480,90 m-24,-34 a24,34 0 1,0 48,0 a24,34 0 1,0 -48,0" stroke="#f4f1e6" stroke-width="5"/>`;
    s += `<path d="M450,26 L510,26 M462,26 Q462,2 480,2 Q498,2 498,26" stroke="#f4f1e6" stroke-width="5"/>`;
    s += `<path d="M455,64 Q480,100 505,64" stroke="#e04b4b" stroke-width="5"/>`;
    for (let i = 0; i < 9; i++) s += `<path d="M${461 + i * 5},${70 + Math.sin(i / 8 * Math.PI) * 14} l0,6" stroke="#e04b4b" stroke-width="2.5"/>`;
    s += `<circle cx="470" cy="46" r="3" stroke="#f4f1e6" stroke-width="4"/><circle cx="490" cy="46" r="3" stroke="#f4f1e6" stroke-width="4"/>`;
    [[600, 260], [660, 260], [600, 320], [660, 320], [630, 380]].forEach(([x, y], i) => s += `<rect x="${x}" y="${y}" width="56" height="56" stroke="#9fd0f0" stroke-width="4"/><text x="${x + 28}" y="${y + 38}" font-family="Georgia,serif" font-size="26" fill="#9fd0f0" stroke="none" text-anchor="middle">${i + 1}</text>`);
    s += `</g>`;
    s += `<rect x="560" y="170" width="40" height="10" rx="5" fill="#f08a8a" transform="rotate(20 580 175)"/><rect x="380" y="330" width="40" height="10" rx="5" fill="#f2d04a" transform="rotate(-30 400 335)"/>`;
    s += K.vignette(.45) + K.grain(.18);
    return K.done(s);
  };

  S.loft = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="#2a1d14"/>`;
    s += `<polygon points="0,400 400,40 800,400" fill="#4a3424"/>`;
    for (let i = 0; i < 8; i++) { const t = i / 7; s += `<line x1="400" y1="40" x2="${f(-200 + t * 1200)}" y2="400" stroke="#6b4a30" stroke-width="${f(10 - Math.abs(t - .5) * 8)}"/>`; }
    s += `<polygon points="0,330 800,330 800,400 0,400" fill="#5a3f28"/>`;
    for (let x = -400; x < 1200; x += 60) s += `<line x1="400" y1="250" x2="${x}" y2="400" stroke="#3e2b1b" stroke-width="2" clip-path="none" opacity=".6"/>`;
    s += `<polygon points="0,330 800,330 800,400 0,400" fill="#5a3f28" opacity=".6"/>`;
    s += `<polygon points="250,60 290,60 520,400 340,400" fill="${K.lin('beam', [[0, '#ffe2a0', .7], [1, '#ffe2a0', .05]])}"/>`;
    s += `<rect x="248" y="40" width="44" height="30" fill="#ffe9b8"/>`;
    const r = rng(5); for (let i = 0; i < 40; i++) s += `<circle cx="${f(280 + r() * 160)}" cy="${f(80 + r() * 300)}" r="${f(r() * 1.6 + .4)}" fill="#fff6d8" opacity="${f(r() * .7)}"/>`;
    // suitcase
    s += `<rect x="90" y="300" width="150" height="70" rx="8" fill="#9a2f2f"/>`;
    for (let i = 0; i < 6; i++) s += `<line x1="${100 + i * 25}" y1="300" x2="${100 + i * 25}" y2="370" stroke="#2f5a3a" stroke-width="4" opacity=".7"/>`;
    s += `<line x1="90" y1="330" x2="240" y2="330" stroke="#2f5a3a" stroke-width="5" opacity=".7"/><rect x="150" y="290" width="30" height="12" rx="4" fill="none" stroke="#3a2a20" stroke-width="4"/>`;
    // rocking horse
    s += `<path d="M560,370 Q620,390 680,370" stroke="#6a4630" stroke-width="8" fill="none"/><path d="M585,372 L600,320 M655,372 L640,320" stroke="#6a4630" stroke-width="6"/><ellipse cx="620" cy="315" rx="44" ry="18" fill="#d9cbb5"/><path d="M650,305 L672,262 Q690,258 694,272 L676,300Z" fill="#d9cbb5"/><path d="M668,266 q-10,20 -20,30" stroke="#5a3a2a" stroke-width="6" fill="none"/><circle cx="682" cy="272" r="2" fill="#111"/>`;
    // music box
    s += `<rect x="370" y="338" width="70" height="34" fill="#7a1f3a"/><path d="M370,338 L384,300 L454,300 L440,338Z" fill="#a33a5a"/><rect x="372" y="342" width="66" height="4" fill="#d9b44a"/><line x1="405" y1="338" x2="405" y2="320" stroke="#d9b44a" stroke-width="2"/><path d="M405,300 l-6,18 l12,0Z M405,296 m-4,0 a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0 M393,306 L417,302" fill="#f6e6ef" stroke="#f6e6ef" stroke-width="1.5"/>`;
    s += `<g fill="#f6e6ef" opacity=".8" font-family="Georgia,serif" font-size="18"><text x="450" y="292">♪</text><text x="470" y="270">♫</text></g>`;
    // dark corner
    s += `<rect x="620" width="180" height="400" fill="${K.lin('dk', [[0, '#000', 0], [.5, '#000', .85], [1, '#000', 1]], 0, 0, 1, 0)}"/>`;
    s += `<circle cx="742" cy="246" r="2.6" fill="#e9f2c8"/><circle cx="758" cy="244" r="2.6" fill="#e9f2c8"/>`;
    s += K.vignette(.65) + K.grain(.16);
    return K.done(s);
  };

  S.van_dusk = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="${K.lin('sky', PAL.dusk.sky)}"/>`;
    for (let i = 0; i < 5; i++) s += house({ x: i * 180 - 40, b: 250, w: 150, h: 120, wall: WALLS[i], roof: ROOFS[i % 4], door: DOORS[i], win: '#2a2f40', curtain: '#3a2238' });
    s += `<rect y="250" width="800" height="150" fill="#4d4a58"/><rect y="250" width="800" height="16" fill="#6c6370"/>`;
    s += `<rect width="800" height="400" fill="#2b1048" opacity=".5" style="mix-blend-mode:multiply"/>`;
    s += van(170, 372, 470, { hatch: '#7fd8ff', body: '#dcd4d2', glass: '#24304a' });
    s += `<polygon points="240,182 440,182 520,400 160,400" fill="${K.lin('hb', [[0, '#7fd8ff', .45], [1, '#7fd8ff', 0]])}"/>`;
    s += `<ellipse cx="300" cy="380" rx="70" ry="12" fill="#000" opacity=".9"/>`;
    s += `<g stroke="#e9e4da" stroke-width="5" stroke-linecap="round" fill="none"><path d="M270,384 q-10,-14 6,-22 q8,-4 14,8"/><path d="M300,386 q-6,-18 10,-24 q10,-2 12,10"/><path d="M330,384 q0,-16 14,-18"/></g>`;
    s += `<path d="M380,388 a18,8 0 1,0 36,0" stroke="#b82020" stroke-width="5" fill="none"/>`;
    s += K.vignette(.8) + K.grain(.16);
    return K.done(s);
  };

  S.van_inside = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="#05080d"/>`;
    for (let i = 7; i >= 0; i--) {
      const t = i / 8, sc = 1 - t * .9, w = 800 * sc, x = 400 - w / 2, y = 200 - 160 * sc, h = 320 * sc;
      s += `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="none" stroke="#1d2a38" stroke-width="${f(2 * sc + .5)}"/>`;
      s += `<rect x="${f(x + w * .02)}" y="${f(y + h * .55)}" width="${f(w * .2)}" height="${f(h * .45)}" fill="#cfe7f2" opacity="${f(.15 + sc * .5)}"/>`;
      s += `<rect x="${f(x + w * .78)}" y="${f(y + h * .55)}" width="${f(w * .2)}" height="${f(h * .45)}" fill="#cfe7f2" opacity="${f(.15 + sc * .5)}"/>`;
      s += `<rect x="${f(x + w * .02)}" y="${f(y + h * .55)}" width="${f(w * .2)}" height="${f(h * .03)}" fill="#7fd8ff" opacity="${f(sc)}"/>`;
      s += `<rect x="${f(x + w * .78)}" y="${f(y + h * .55)}" width="${f(w * .2)}" height="${f(h * .03)}" fill="#7fd8ff" opacity="${f(sc)}"/>`;
    }
    s += `<rect width="800" height="400" fill="${K.rad('gl', [[0, '#7fd8ff', .3], [1, '#7fd8ff', 0]], .5, .55, .5)}"/>`;
    s += `<g transform="translate(400,236)"><rect x="-26" y="-6" width="52" height="40" rx="6" fill="#0d1218"/><rect x="-14" y="-30" width="28" height="30" rx="6" fill="#1a2028"/>`;
    s += `<path d="M-12,-30 Q-16,-46 0,-50 Q16,-46 12,-30Z M-9,-48 Q-10,-60 0,-62 Q10,-60 9,-48Z M-5,-60 Q0,-72 5,-60Z" fill="#e9dccb"/><path d="M-12,-30 q-3,10 2,14 M10,-30 q4,8 -2,16" stroke="#e9dccb" stroke-width="2.5" fill="none"/></g>`;
    s += K.vignette(.85) + K.grain(.18);
    return K.done(s);
  };

  S.door_glass = () => {
    const K = kit(); const bl = K.blur('b', 6);
    let s = `<rect width="800" height="400" fill="#06080f"/>`;
    s += `<rect x="0" y="0" width="800" height="400" fill="${K.lin('wall', [[0, '#0e1424'], [1, '#05070d']])}"/>`;
    for (let x = 0; x < 800; x += 40) s += `<rect x="${x}" width="18" height="400" fill="#0a0f1c" opacity=".7"/>`;
    s += `<rect x="250" y="20" width="300" height="380" fill="#1a120d"/><rect x="262" y="32" width="276" height="368" fill="#2a1c13"/>`;
    s += `<path d="M300,70 Q300,50 320,50 L480,50 Q500,50 500,70 L500,220 L300,220Z" fill="${K.lin('gls', [[0, '#3a5378'], [1, '#1c2a44']])}"/>`;
    s += `<g filter="${bl}"><ellipse cx="400" cy="128" rx="54" ry="68" fill="#cfd4d8" opacity=".75"/><rect x="330" y="180" width="140" height="60" fill="#000"/><path d="M342,62 L458,62 L462,74 L338,74Z M366,62 Q366,24 400,24 Q434,24 434,62Z" fill="#000"/></g>`;
    s += `<path d="M352,140 Q400,168 448,140 Q400,186 352,140Z" fill="#1a0505"/>`;
    for (let i = 1; i < 14; i++) { const t = i / 14; const x = 352 + 96 * t; const y = 140 + Math.sin(t * Math.PI) * 14; s += `<rect x="${f(x - 2.5)}" y="${f(y - 1)}" width="5" height="${f(6 + Math.sin(t * Math.PI) * 4)}" fill="#efe6d0"/>`; }
    s += `<circle cx="378" cy="112" r="5" fill="#000"/><circle cx="422" cy="110" r="5" fill="#000"/>`;
    s += `<rect x="300" y="50" width="200" height="170" fill="${K.lin('frost', [[0, '#9fb6d9', .25], [1, '#9fb6d9', .08]])}"/>`;
    s += `<rect x="340" y="280" width="120" height="16" rx="3" fill="#b8902e"/><rect x="346" y="285" width="108" height="6" fill="#000"/>`;
    s += `<circle cx="508" cy="250" r="8" fill="#b8902e"/>`;
    s += `<rect width="800" height="400" fill="${K.rad('moon', [[0, '#5a7ab0', .25], [1, '#000', 0]], .5, .3, .6)}"/>`;
    s += K.vignette(.9) + K.grain(.2);
    return K.done(s);
  };

  S.hallway = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="#04060b"/>`;
    s += `<polygon points="0,0 800,0 800,400 0,400" fill="${K.lin('w', [[0, '#0d1220'], [1, '#05070c']])}"/>`;
    // stairs rising to the right
    for (let i = 0; i < 10; i++) s += `<rect x="${380 + i * 42}" y="${f(330 - i * 30)}" width="${f(440 - i * 42)}" height="30" fill="${shade('#1a1a22', i * .02)}" stroke="#0a0a10" stroke-width="2"/>`;
    s += `<path d="M380,330 L800,30" stroke="#2b2420" stroke-width="10"/>`;
    for (let i = 0; i < 9; i++) s += `<line x1="${400 + i * 44}" y1="${f(318 - i * 31)}" x2="${400 + i * 44}" y2="${f(278 - i * 31)}" stroke="#2b2420" stroke-width="4"/>`;
    // under-stairs door with light
    s += `<rect x="470" y="260" width="80" height="120" fill="#120d09"/>`;
    s += `<rect x="470" y="260" width="80" height="120" fill="none" stroke="#9fe07a" stroke-width="2" opacity=".85"/><rect x="465" y="378" width="90" height="5" fill="#9fe07a" filter="${K.blur('gl', 3)}"/>`;
    s += `<polygon points="470,383 550,383 620,400 400,400" fill="#9fe07a" opacity=".18"/>`;
    // footprints
    const fp = (x, y, sc, rot) => `<g transform="translate(${x},${y}) rotate(${rot}) scale(${sc})" fill="#7aa0c8" opacity=".55"><ellipse cx="0" cy="0" rx="5" ry="9"/><circle cx="-3" cy="-12" r="1.6"/><circle cx="0" cy="-13" r="1.6"/><circle cx="3" cy="-12" r="1.6"/></g>`;
    [[480, 392, .7, 200], [460, 396, .8, 160], [420, 392, 1, 200], [380, 396, 1.1, 160], [330, 392, 1.25, 200]].forEach(a => s += fp(...a));
    s += `<polygon points="90,400 230,400 520,300 480,290" fill="#fff6d0" opacity=".06"/>`;
    s += `<rect x="60" y="80" width="100" height="140" fill="#0b0f18" stroke="#2b2420" stroke-width="6"/><circle cx="110" cy="150" r="30" fill="#0f1420"/>`;
    s += K.vignette(.9) + K.grain(.2);
    return K.done(s);
  };

  S.cellar = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="#06080d"/>`;
    s += `<rect x="220" y="0" width="360" height="400" fill="#3a2a1e"/>`;
    for (let x = 220; x < 580; x += 60) s += `<rect x="${x + 2}" y="0" width="56" height="400" fill="${shade('#4a3524', (x % 120 ? -.08 : 0))}"/><line x1="${x + 30}" y1="0" x2="${x + 34}" y2="400" stroke="#2a1d14" stroke-width="1" opacity=".5"/>`;
    s += `<rect x="220" y="80" width="360" height="22" fill="#2a1d14"/><rect x="220" y="300" width="360" height="22" fill="#2a1d14"/>`;
    s += `<rect x="470" y="170" width="60" height="90" rx="6" fill="#b8902e"/><rect x="474" y="174" width="52" height="82" rx="4" fill="#d6ad4a"/><path d="M500,206 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M496,212 L494,236 L506,236 L504,212Z" fill="#1a1208"/>`;
    s += `<g stroke="#d8cbb4" stroke-width="3" stroke-linecap="round" opacity=".85">`;
    for (let g = 0; g < 3; g++) { for (let i = 0; i < 4; i++) s += `<line x1="${270 + g * 50 + i * 8}" y1="200" x2="${272 + g * 50 + i * 8}" y2="240"/>`; s += `<line x1="${264 + g * 50}" y1="236" x2="${302 + g * 50}" y2="204"/>`; }
    s += `<line x1="420" y1="200" x2="422" y2="240"/></g>`;
    s += `<rect x="220" y="392" width="360" height="8" fill="#9fe07a" filter="${K.blur('gl', 4)}"/><polygon points="220,400 580,400 700,400 100,400" fill="#9fe07a" opacity=".4"/>`;
    s += `<rect width="800" height="400" fill="${K.lin('up', [[0, '#9fe07a', 0], [1, '#9fe07a', .12]])}"/>`;
    s += K.fog('#9fe07a', .25, 800, 400, 4) + K.vignette(.92) + K.grain(.2);
    return K.done(s);
  };

  function mirrorRoom(flipped) {
    const K = kit();
    let s = '';
    let room = `<rect width="800" height="400" fill="#0b1018"/>`;
    for (let y = 0; y < 400; y += 40) for (let x = 0; x < 800; x += 40) room += `<rect x="${x + 1}" y="${y + 1}" width="38" height="38" fill="${(x + y) % 80 ? '#121a26' : '#0f1520'}"/>`;
    if (!flipped) {
      room += `<ellipse cx="400" cy="170" rx="150" ry="140" fill="#2a2f38"/><ellipse cx="400" cy="170" rx="136" ry="126" fill="${K.lin('m', [[0, '#26334a'], [1, '#0d1320']])}"/>`;
      room += `<path d="M310,300 C320,220 360,206 400,204 C440,206 480,220 490,300Z" fill="#05070c"/><ellipse cx="400" cy="150" rx="46" ry="58" fill="#0a0e16"/>`;
      room += grinMouth(400, 160, 70, 14, { teeth: 12, tc: '#e9e2cc', inside: '#000', lip: '#000', lw: 1 });
      room += `<circle cx="384" cy="136" r="3" fill="#cfd8e8"/><circle cx="416" cy="136" r="3" fill="#cfd8e8"/>`;
      room += `<path d="M180,320 L620,320 L600,400 L200,400Z" fill="#e8e6e0" opacity=".85"/><ellipse cx="400" cy="336" rx="150" ry="14" fill="#9aa2ad"/>`;
      room += `<rect x="388" y="300" width="24" height="20" fill="#9aa2ad"/>`;
    } else {
      room += `<rect x="0" y="300" width="800" height="100" fill="#2a2320"/>`;
      room += `<rect x="200" y="210" width="360" height="110" rx="20" fill="#5a3a4a"/><rect x="200" y="190" width="360" height="60" rx="16" fill="#6b4658"/>`;
      room += `<rect x="350" y="150" width="60" height="100" rx="18" fill="#3a3f55"/><circle cx="380" cy="128" r="28" fill="#c9b8a6"/><path d="M362,136 Q380,152 398,136" stroke="#2a0a0a" stroke-width="3" fill="none"/><circle cx="372" cy="122" r="3" fill="#111"/><circle cx="390" cy="122" r="3" fill="#111"/>`;
      room += `<rect x="620" y="200" width="140" height="100" fill="#111"/><rect x="630" y="210" width="120" height="80" fill="#d8ffd0" opacity=".35"/>`;
      room += `<rect x="70" y="120" width="10" height="180" fill="#333"/><path d="M50,120 L100,120 L90,80 L60,80Z" fill="#c9b35a"/>`;
      room += `<rect x="380" y="40" width="160" height="10" fill="#4a3a2a"/><rect x="430" y="10" width="40" height="30" fill="#e8c43a" opacity=".8"/>`;
      s += `<g transform="rotate(180 400 200)">${room}</g>`;
      s += `<rect width="800" height="400" fill="#9fe07a" opacity=".18" style="mix-blend-mode:color"/>`;
    }
    if (!flipped) s += room;
    s += K.vignette(.9) + K.grain(.2);
    return K.done(s);
  }
  S.mirror = () => mirrorRoom(false);
  S.mirror_house = () => mirrorRoom(true);

  function ellieFig(x, b, sc, op = .8) {
    let g = `<g transform="translate(${x},${b}) scale(${sc})" opacity="${op}">`;
    g += `<ellipse cx="0" cy="0" rx="60" ry="10" fill="#7aa0c8" opacity=".35"/>`;
    g += `<rect x="-14" y="-60" width="9" height="58" fill="#d8dfe2"/><rect x="5" y="-60" width="9" height="58" fill="#d8dfe2"/>`;
    g += `<path d="M-48,-60 L-30,-200 Q0,-214 30,-200 L48,-60Z" fill="#e8c43a"/>`;
    g += `<path d="M-30,-200 L-44,-120 L-36,-118 M30,-200 L44,-120 L36,-118" stroke="#d1ae2a" stroke-width="10" fill="none"/>`;
    g += `<path d="M0,-200 L0,-70" stroke="#c49e22" stroke-width="2"/>`;
    for (let i = 0; i < 4; i++) g += `<circle cx="6" cy="${-180 + i * 28}" r="3" fill="#c49e22"/>`;
    g += `<ellipse cx="0" cy="-238" rx="30" ry="36" fill="#cfd8dc"/>`;
    g += `<path d="M-36,-232 Q-40,-282 0,-284 Q40,-282 36,-232 L40,-150 L26,-196 L18,-150 L8,-200 L0,-146 L-8,-200 L-18,-150 L-26,-196 L-40,-150Z" fill="#0a0c10"/>`;
    g += `<path d="M-38,-250 Q0,-290 38,-250 Q40,-230 36,-226 Q0,-266 -36,-226Z" fill="#e8c43a"/>`;
    g += `<path d="M-46,-140 l0,30 M-30,-80 l0,26 M44,-110 l0,22 M20,-70 l0,30" stroke="#9fc7e6" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;
    return g + '</g>';
  }
  S.ellie = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="#070a12"/>`;
    for (let x = 0; x < 800; x += 50) s += `<rect x="${x}" width="24" height="400" fill="#0c1220"/>`;
    s += `<rect x="0" y="330" width="800" height="70" fill="#0a0c12"/>`;
    s += `<rect width="800" height="400" fill="${K.rad('glow', [[0, '#bcd8f0', .28], [1, '#000', 0]], .5, .55, .45)}"/>`;
    s += ellieFig(400, 370, 1.15, .82);
    s += K.vignette(.9) + K.grain(.2);
    return K.done(s);
  };
  S.ellie_under = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="${K.lin('bg', [[0, '#2a1e12'], [.45, '#0c1a0f'], [1, '#050a06']])}"/>`;
    const r = rng(3);
    for (let i = 0; i < 6; i++) { const x = i * 150 - 20; s += `<g transform="rotate(180 ${x + 60} 60)">${house({ x, b: 120 + r() * 20, w: 120, h: 90, wall: '#4a5a46', roof: '#2a2420', door: '#1a2a1a', win: '#0b120b' })}</g>`; }
    s += `<path d="M0,320 L800,300 L800,400 L0,400Z" fill="#081008"/><path d="M0,330 L800,312" stroke="#2f4a2a" stroke-width="10"/>`;
    s += K.fog('#8fd16a', .4, 800, 400, 6);
    s += ellieFig(560, 360, .8, .85);
    s += `<path d="M520,180 L470,150" stroke="#d8dfe2" stroke-width="8" stroke-linecap="round" opacity=".7"/>`;
    s += K.vignette(.85) + K.grain(.2);
    return K.done(s);
  };

  S.stairs = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="#050805"/>`;
    s += `<polygon points="0,0 260,0 360,260 0,400" fill="${K.lin('wl', [[0, '#3a1a18'], [1, '#160807']], 0, 0, 1, 0)}"/>`;
    s += `<polygon points="800,0 540,0 440,260 800,400" fill="${K.lin('wr', [[0, '#160807'], [1, '#3a1a18']], 0, 0, 1, 0)}"/>`;
    const r = rng(8);
    for (let i = 0; i < 18; i++) { const x = r() < .5 ? r() * 300 : 500 + r() * 300; const y = r() * 400; s += `<path d="M${f(x)},${f(y)} q${f(r() * 40 - 20)},${f(r() * 40)} ${f(r() * 60 - 30)},${f(r() * 80)}" stroke="#6a2424" stroke-width="${f(r() * 3 + 1)}" fill="none" opacity=".7"/>`; }
    for (let i = 0; i < 12; i++) { const t = i / 12; const y = 400 - Math.pow(t, .8) * 150, w = 520 * (1 - t * .85); s += `<rect x="${f(400 - w / 2)}" y="${f(y - 22 * (1 - t))}" width="${f(w)}" height="${f(22 * (1 - t) + 2)}" fill="${shade('#2a2420', -t * .6)}" stroke="#0a0806" stroke-width="1.5"/>`; }
    s += `<ellipse cx="400" cy="250" rx="140" ry="50" fill="#8fd16a" opacity=".35" filter="${K.blur('g', 18)}"/>`;
    s += K.fog('#8fd16a', .45, 800, 400, 9);
    s += `<g transform="rotate(180 120 200)"><rect x="80" y="140" width="80" height="130" fill="#1a110c" stroke="#3a2a1e" stroke-width="5"/><text x="120" y="180" font-family="Georgia,serif" font-size="22" fill="#d6ad4a" text-anchor="middle">13</text></g>`;
    s += ellieFig(600, 360, .55, .6);
    s += K.vignette(.9) + K.grain(.2);
    return K.done(s);
  };

  function underWorld(opt = {}) {
    const K = kit();
    let s = `<rect width="800" height="400" fill="${K.lin('bg', [[0, '#3a2814'], [.3, '#1a2414'], [.7, '#0b160c'], [1, '#040804']])}"/>`;
    const r = rng(opt.seed || 13);
    s += `<path d="M0,0 L800,0 L800,40 Q600,60 400,44 Q200,30 0,50Z" fill="#2a1c10"/>`;
    for (let i = 0; i < 22; i++) { const x = r() * 800; s += `<path d="M${f(x)},${f(30 + r() * 20)} q${f(r() * 30 - 15)},${f(60 + r() * 80)} ${f(r() * 20 - 10)},${f(120 + r() * 120)}" stroke="#4a3220" stroke-width="${f(r() * 4 + 1)}" fill="none"/>`; }
    for (let i = 0; i < 6; i++) { const x = i * 140 - 30, w = 120, h = 80 + r() * 20; s += `<g transform="rotate(180 ${x + w / 2} ${f(50 + h / 2 + 30)})">${house({ x, b: 50 + h + 60, w, h, wall: '#56604f', roof: '#2a2420', door: '#1c261c', win: '#0b120b', lit: [r() < .3, 0, 0], litc: '#b8ff7a' })}</g>`; }
    for (let i = 0; i < 6; i++) { const x = i * 140 + 30; s += `<path d="M${x},140 q4,20 0,40" stroke="#7fae60" stroke-width="3" opacity=".6"/>`; }
    s += `<path d="M0,300 L800,290 L800,400 L0,400Z" fill="#0b130b"/><path d="M0,300 L800,290" stroke="#3a4a34" stroke-width="6"/>`;
    s += K.fog('#8fd16a', .5, 800, 400, opt.seed || 13);
    if (opt.people) {
      [[120, 340, .8], [220, 330, .6], [600, 336, .75], [700, 344, .9], [470, 326, .5]].forEach(([x, b, k]) => {
        s += `<g transform="translate(${x},${b}) scale(${k})"><path d="M-22,0 L-18,-80 Q0,-90 18,-80 L22,0Z" fill="#5a4a5a"/><circle cx="0" cy="-102" r="20" fill="#9aa39a"/><ellipse cx="-7" cy="-106" rx="5" ry="4" fill="#000"/><ellipse cx="7" cy="-106" rx="5" ry="4" fill="#000"/><path d="M-12,-94 Q0,-82 12,-94" stroke="#000" stroke-width="2.4" fill="none"/></g>`;
      });
    }
    s += K.vignette(.85) + K.grain(.2);
    return K.done(s);
  }
  S.underclose = () => underWorld({ people: true });

  S.gardens = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="${K.lin('bg', [[0, '#1f2a18'], [1, '#060a05']])}"/>`;
    s += `<polygon points="80,60 400,0 720,60 720,330 80,330" fill="#9fe07a" opacity=".06"/>`;
    s += `<g stroke="#5f7a54" stroke-width="3" fill="none" opacity=".75"><path d="M80,330 L80,60 L400,0 L720,60 L720,330"/>`;
    for (let x = 80; x <= 720; x += 80) s += `<line x1="${x}" y1="${f(60 - (x <= 400 ? (x - 80) / 320 * 60 : (720 - x) / 320 * 60))}" x2="${x}" y2="330"/>`;
    s += `<line x1="80" y1="180" x2="720" y2="180"/></g>`;
    const r = rng(17);
    for (let i = 0; i < 9; i++) {
      const x = 120 + i * 70, top = 60 - (Math.abs(x - 400) < 320 ? (320 - Math.abs(x - 400)) / 320 * 60 : 0) + 6, len = 90 + r() * 60;
      s += `<line x1="${x}" y1="${f(top)}" x2="${x}" y2="${f(top + 20)}" stroke="#aab0a4" stroke-width="2"/>`;
      if (i === 4) {
        s += `<g transform="translate(${x},${f(top + 20)})"><ellipse cx="0" cy="40" rx="30" ry="44" fill="#b9bdb4"/><ellipse cx="26" cy="74" rx="16" ry="14" fill="#b9bdb4"/><path d="M-14,8 q-8,-14 -2,-20 M14,8 q8,-14 2,-20" stroke="#b9bdb4" stroke-width="8" stroke-linecap="round"/><path d="M-20,30 q20,10 40,0 M-22,54 q22,10 44,0" stroke="#8a8f86" stroke-width="2" fill="none"/></g>`;
      } else {
        s += `<path d="M${x},${f(top + 20)} q${f(-18 - r() * 6)},${f(len * .4)} 0,${f(len)} q${f(18 + r() * 6)},${f(-len * .6)} 0,${f(-len)}Z" fill="${shade('#a7aca2', -r() * .25)}"/>`;
        s += `<path d="M${x - 10},${f(top + 50)} q10,6 20,0 M${x - 12},${f(top + 80)} q12,6 24,0" stroke="#7e837a" stroke-width="2" fill="none"/>`;
      }
    }
    for (let row = 0; row < 3; row++) for (let i = 0; i < 16; i++) s += gnome(20 + i * 52 + row * 18, 360 + row * 18, .9 + row * .2, { glow: true, hat: '#8a2a24', coat: '#2f4a6e' });
    s += K.fog('#8fd16a', .35, 800, 400, 19);
    s += K.vignette(.85) + K.grain(.2);
    return K.done(s);
  };

  S.drain = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="#020403"/>`;
    for (let i = 0; i < 9; i++) { const k = 1 - i * .1; s += `<ellipse cx="400" cy="190" rx="${f(420 * k)}" ry="${f(260 * k)}" fill="none" stroke="${shade('#2a3a2a', -i * .08)}" stroke-width="${f(22 * k)}"/>`; }
    s += `<ellipse cx="400" cy="190" rx="40" ry="26" fill="#8fd16a" opacity=".5" filter="${K.blur('g', 10)}"/>`;
    s += `<path d="M0,280 Q400,250 800,280 L800,400 L0,400Z" fill="#050806"/>`;
    for (let i = 0; i < 10; i++) s += `<path d="M${40 + i * 80},${300 + (i % 3) * 20} q20,-4 40,0" stroke="#8fd16a" stroke-width="1.5" opacity=".35" fill="none"/>`;
    const shoe = (x, y, k, c, rot) => `<g transform="translate(${x},${y}) rotate(${rot}) scale(${k})"><path d="M-20,0 Q-22,-14 -6,-14 L4,-14 Q8,-6 22,-4 Q26,0 22,4 L-18,4Z" fill="${c}"/><path d="M-20,4 L22,4" stroke="#ddd" stroke-width="2"/></g>`;
    s += shoe(220, 330, 1.4, '#c84f6a', -10) + shoe(520, 350, 1.2, '#3a6ab0', 14) + shoe(380, 312, .9, '#e8c43a', 4) + shoe(640, 320, 1, '#f2f2f2', -20) + shoe(140, 370, 1.6, '#5fb35c', 8);
    s += `<g fill="#8fd16a" opacity=".5" font-family="Georgia,serif" font-style="italic" font-size="14"><text x="80" y="120" transform="rotate(-12 80 120)">you you you</text><text x="600" y="90" transform="rotate(10 600 90)">number thirteen</text><text x="560" y="240">welcome home</text></g>`;
    s += K.vignette(.9) + K.grain(.22);
    return K.done(s);
  };

  S.church = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="#050806"/>`;
    for (let i = 0; i < 5; i++) { const x = 40 + i * 180; s += `<path d="M${x},400 L${x},140 Q${x + 70},20 ${x + 140},140 L${x + 140},400" fill="none" stroke="#1a2a1a" stroke-width="16"/>`; }
    s += `<path d="M330,170 Q400,60 470,170 L470,250 L330,250Z" fill="#8fd16a" opacity=".25"/>`;
    s += `<rect x="350" y="250" width="100" height="80" fill="#2a1d14"/><rect x="340" y="244" width="120" height="12" fill="#3a2a1e"/>`;
    s += harrow(400, 262, 150, { c: '#060606', face: '#d9d4c2', smile: '#1a0505', eyes: '#000' });
    s += `<path d="M386,${f(262 - 150 / 200 * 172)} q14,10 28,0" stroke="#efe6d0" stroke-width="1.6" fill="none"/>`;
    for (let row = 0; row < 3; row++) {
      const y = 320 + row * 30;
      s += `<rect x="40" y="${y}" width="300" height="16" fill="#2a1d14"/><rect x="460" y="${y}" width="300" height="16" fill="#2a1d14"/>`;
      for (let i = 0; i < 6; i++) { const x1 = 60 + i * 48, x2 = 480 + i * 48; [x1, x2].forEach(x => s += `<ellipse cx="${x}" cy="${y - 12}" rx="${12 + row * 2}" ry="${15 + row * 2}" fill="#14140f"/>`); }
    }
    [[300, 230], [500, 230], [250, 200], [550, 200]].forEach(([x, y]) => s += `<rect x="${x - 3}" y="${y}" width="6" height="26" fill="#e9e2cc"/><ellipse cx="${x}" cy="${y - 6}" rx="4" ry="8" fill="#b8ff7a"/><circle cx="${x}" cy="${y - 6}" r="18" fill="#b8ff7a" opacity=".15"/>`);
    s += K.fog('#8fd16a', .3, 800, 400, 23);
    s += K.vignette(.9) + K.grain(.2);
    return K.done(s);
  };

  S.ledger = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="#0a0c08"/>`;
    for (let x = 20; x < 800; x += 60) for (let y = 10; y < 130; y += 40) s += `<rect x="${x}" y="${y}" width="50" height="32" fill="#1a1a12" stroke="#2a2a1e"/>`;
    s += `<rect y="280" width="800" height="120" fill="#3a2414"/><rect y="270" width="800" height="14" fill="#5a3a20"/>`;
    s += `<path d="M150,290 Q400,250 400,280 Q400,250 650,290 L640,170 Q400,150 400,170 Q400,150 160,170Z" fill="#e7dcc0"/>`;
    s += `<path d="M400,170 L400,280" stroke="#a89878" stroke-width="2"/>`;
    const r = rng(29);
    for (let side = 0; side < 2; side++) for (let i = 0; i < 9; i++) {
      const x0 = side ? 420 : 180, y = 184 + i * 10;
      let d = `M${x0},${y}`; for (let j = 0; j < 14; j++) d += ` q${f(4 + r() * 3)},${f(-3 - r() * 4)} ${f(8 + r() * 4)},${f(r() * 2)}`;
      s += `<path d="${d}" stroke="#7a2a14" stroke-width="1.6" fill="none" opacity="${f(.5 + r() * .5)}"/>`;
    }
    s += `<rect x="440" y="220" width="160" height="40" fill="none" stroke="#b8323a" stroke-width="2" stroke-dasharray="4 3"/><text x="600" y="214" font-family="Georgia,serif" font-size="16" fill="#b8323a" text-anchor="end">No. 13</text>`;
    s += `<rect x="690" y="220" width="16" height="60" fill="#e9e2cc"/><ellipse cx="698" cy="208" rx="6" ry="12" fill="#ffd27a"/><circle cx="698" cy="208" r="60" fill="#ffd27a" opacity=".1"/>`;
    s += `<rect width="800" height="400" fill="${K.rad('lt', [[0, '#ffd27a', .18], [1, '#000', 0]], .6, .55, .5)}"/>`;
    s += K.fog('#8fd16a', .2, 800, 400, 31);
    s += K.vignette(.88) + K.grain(.2);
    return K.done(s);
  };

  /* --- the Long Lodger (crawler) --- */
  function crawlerBody(cx, cy, k) {
    let g = `<g transform="translate(${cx},${cy}) scale(${k})">`;
    const limb = (pts, w) => `<polyline points="${pts}" fill="none" stroke="#d9d6cc" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
    g += limb('-30,-120 -140,-200 -260,-150 -300,-40', 12) + limb('30,-120 140,-210 270,-160 310,-40', 12);
    g += limb('-20,-60 -170,-60 -230,30 -200,120', 11) + limb('20,-60 170,-50 240,40 210,130', 11);
    [[-300, -40], [310, -40], [-200, 120], [210, 130]].forEach(([x, y]) => { for (let i = -2; i <= 2; i++) g += `<line x1="${x}" y1="${y}" x2="${x + i * 9}" y2="${y + 34}" stroke="#d9d6cc" stroke-width="4" stroke-linecap="round"/>`; });
    g += `<path d="M-34,-200 Q0,-230 34,-200 L28,-20 Q0,0 -28,-20Z" fill="#cfccc2"/>`;
    for (let i = 0; i < 6; i++) g += `<path d="M-24,${-170 + i * 24} q24,8 48,0" stroke="#9a978e" stroke-width="2" fill="none"/>`;
    g += `<ellipse cx="0" cy="40" rx="46" ry="62" fill="#e2dfd6"/>`;
    g += `<path d="M-30,10 q30,-14 60,0" stroke="#b7b3a8" stroke-width="2" fill="none"/>`;
    g += `<rect x="-36" y="46" width="72" height="34" rx="10" fill="#0b0505"/>`;
    for (let i = 0; i < 9; i++) g += `<rect x="${-33 + i * 7.6}" y="48" width="6.6" height="28" fill="#f4f0e2"/>`;
    for (let i = 0; i < 8; i++) if (i % 7 !== 2 && i % 7 !== 6) g += `<rect x="${-29 + i * 7.6}" y="48" width="4.6" height="17" fill="#0b0505"/>`;
    return g + '</g>';
  }
  S.crawler = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="#040705"/>`;
    s += `<g transform="rotate(180 400 40)" opacity=".7">${house({ x: 200, b: 60, w: 160, h: 100, wall: '#3a443a', roof: '#1a1a14', door: '#101810', win: '#070c07' })}${house({ x: 460, b: 60, w: 160, h: 100, wall: '#3a443a', roof: '#1a1a14', door: '#101810', win: '#070c07' })}</g>`;
    s += K.fog('#8fd16a', .3, 800, 400, 41);
    s += crawlerBody(400, 230, 1);
    s += `<rect width="800" height="400" fill="${K.rad('g', [[0, '#9fe07a', .12], [1, '#000', 0]], .5, .7, .5)}"/>`;
    s += K.vignette(.9) + K.grain(.2);
    return K.done(s);
  };

  S.hollows = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="${K.lin('bg', [[0, '#1a2414'], [1, '#040804']])}"/>`;
    s += K.fog('#8fd16a', .45, 800, 400, 51);
    s += at(130, 210, .62, person({ skin: '#c99a7a', hair: '#3a2a1a', short: true, cloth: '#3a5a7a', hollow: true, smile: 'huge' }));
    s += at(670, 210, .62, person({ skin: '#f0d2bc', hair: '#8a5a2a', longhair: true, cloth: '#7a3a4a', hollow: true, smile: 'huge' }));
    s += at(260, 240, .7, person({ skin: '#e9c9b0', hair: '#555', short: true, cloth: '#4a4a3a', hollow: true, smile: 'wide' }));
    s += at(540, 240, .7, person({ skin: '#8a5a40', hair: '#111', short: true, cloth: '#5a3a3a', hollow: true, smile: 'huge' }));
    s += at(400, 190, 1.08, person({ skin: '#f2d2bf', hair: '#d9d6d2', bun: true, cloth: '#b79ad2', cardigan: true, brooch: true, glasses: true, hollow: true, smile: 'huge' }));
    s += K.vignette(.85) + K.grain(.2);
    return K.done(s);
  };

  S.okafor = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="#1a1410"/>`;
    s += `<rect x="40" y="60" width="200" height="140" fill="#0f0c0a" stroke="#3a2a1e" stroke-width="8"/><rect x="50" y="70" width="180" height="120" fill="#1e3a1a" opacity=".7"/>`;
    s += `<rect x="560" y="70" width="150" height="110" fill="#2a1e14"/><text x="635" y="132" font-family="Georgia,serif" font-size="16" fill="#d9b44a" text-anchor="middle">World's Best</text><text x="635" y="152" font-family="Georgia,serif" font-size="16" fill="#d9b44a" text-anchor="middle">Grill Dad</text>`;
    s += `<rect width="800" height="400" fill="${K.rad('w', [[0, '#ffb05a', .2], [1, '#000', 0]], .5, .45, .55)}"/>`;
    s += person({ skin: '#6b4630', hair: '#151010', short: true, cloth: '#b84a38', apron: '#e9e2cc', smile: 'kind', greyHalf: true, iris: '#3a2412' });
    s += K.fog('#8fd16a', .18, 800, 400, 61);
    s += K.vignette(.8) + K.grain(.18);
    return K.done(s);
  };

  /* --- the Landlord --- */
  function landlordMass(cx, by, k, K) {
    const r = rng(77);
    let g = `<g transform="translate(${cx},${by}) scale(${k})">`;
    g += `<path d="M-380,0 Q-400,-160 -260,-230 Q-120,-320 0,-310 Q140,-320 260,-230 Q400,-160 380,0Z" fill="${K.lin('ll', [[0, '#8a8478'], [1, '#2a2622']])}"/>`;
    for (let i = 0; i < 14; i++) g += `<path d="M${f(-340 + r() * 680)},${f(-20 - r() * 260)} q${f(r() * 60 - 30)},${f(r() * 40)} ${f(r() * 80 - 40)},${f(r() * 60)}" stroke="#5a2a2a" stroke-width="${f(1 + r() * 3)}" fill="none" opacity=".6"/>`;
    for (let i = 0; i < 13; i++) {
      const t = i / 12, x = -230 + t * 460, y = -300 + Math.abs(t - .5) * 120 - (i % 2) * 14;
      g += `<g transform="translate(${f(x)},${f(y)}) rotate(${f((t - .5) * 40)})"><rect x="-17" y="-58" width="34" height="58" fill="${DOORS[i % 5]}" stroke="#f2ead8" stroke-width="3"/><circle cx="10" cy="-26" r="2.5" fill="#e8c35a"/><text x="0" y="-38" font-family="Georgia,serif" font-size="11" font-weight="700" fill="#f3d27a" text-anchor="middle">${i + 1}</text></g>`;
    }
    const mouths = [[0, -150, 210, 34], [-210, -110, 100, 18], [200, -120, 110, 20], [-120, -40, 90, 16], [130, -40, 80, 14], [-280, -40, 60, 12], [290, -50, 60, 12], [-60, -230, 70, 12], [80, -235, 66, 12], [0, -60, 70, 14]];
    mouths.forEach(([x, y, w, d], i) => g += grinMouth(x, y, w, d, { teeth: Math.round(w / 9), tc: '#ece3c8', inside: '#1a0303', lip: '#140202', lw: 2, long: .5 }));
    return g + '</g>';
  }
  function cave(K) {
    let s = `<rect width="800" height="400" fill="${K.lin('cv', [[0, '#140303'], [1, '#2a0606']])}"/>`;
    const r = rng(81);
    for (let i = 0; i < 30; i++) { const x = r() * 800; s += `<path d="M${f(x)},0 q${f(r() * 40 - 20)},${f(60 + r() * 60)} ${f(r() * 30 - 15)},${f(100 + r() * 120)}" stroke="#3a1610" stroke-width="${f(r() * 6 + 2)}" fill="none" stroke-linecap="round"/>`; }
    return s;
  }
  S.landlord = () => {
    const K = kit();
    let s = cave(K);
    s += `<rect width="800" height="400" fill="${K.rad('r', [[0, '#e0362c', .35], [1, '#000', 0]], .5, .7, .6)}"/>`;
    s += landlordMass(400, 420, .95, K);
    s += ellieFig(130, 400, .45, .9);
    s += K.vignette(.85) + K.grain(.22);
    return K.done(s);
  };
  S.landlord_door = () => {
    const K = kit();
    let s = cave(K);
    s += landlordMass(300, 420, .7, K);
    s += `<rect x="640" y="190" width="80" height="140" fill="#ffd9a0" filter="${K.blur('d', 14)}"/><rect x="650" y="200" width="60" height="130" fill="#7a1f1a"/><text x="680" y="240" font-family="Georgia,serif" font-size="18" font-weight="700" fill="#f3d27a" text-anchor="middle">13</text><circle cx="700" cy="270" r="3" fill="#e8c35a"/>`;
    s += `<polygon points="650,330 710,330 800,400 560,400" fill="#ffd9a0" opacity=".18"/>`;
    s += ellieFig(560, 392, .4, .9);
    s += K.vignette(.85) + K.grain(.22);
    return K.done(s);
  };
  S.door13 = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="#0c0202"/>`;
    s += `<rect x="290" y="30" width="220" height="370" fill="#ffd9a0" filter="${K.blur('b', 26)}" opacity=".9"/>`;
    s += `<rect x="310" y="40" width="180" height="360" fill="#7a1f1a"/><rect x="326" y="58" width="148" height="140" fill="#651814"/><rect x="326" y="218" width="148" height="160" fill="#651814"/>`;
    s += `<text x="400" y="150" font-family="Georgia,serif" font-size="64" font-weight="700" fill="#f3d27a" text-anchor="middle">13</text><rect x="448" y="200" width="22" height="34" rx="4" fill="#d6ad4a"/><path d="M459,210 m-4,0 a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0 M457,214 L456,226 L462,226 L461,214Z" fill="#1a1208"/>`;
    const hand = (x, y, rot, k) => `<g transform="translate(${x},${y}) rotate(${rot}) scale(${k})" fill="#8a847a"><path d="M0,0 L150,-10 L150,10 Z"/><ellipse cx="160" cy="0" rx="24" ry="18"/><path d="M176,-12 l40,-14 M180,-4 l48,-4 M180,4 l46,8 M174,12 l36,18 M160,-16 l12,-30" stroke="#8a847a" stroke-width="7" stroke-linecap="round"/></g>`;
    s += hand(-20, 120, 0, 1) + hand(-20, 300, -12, 1.1) + `<g transform="scale(-1,1) translate(-800,0)">${hand(-20, 200, 6, 1.05)}${hand(-20, 360, -8, .9)}</g>`;
    s += `<rect width="800" height="400" fill="#e0362c" opacity=".12" style="mix-blend-mode:screen"/>`;
    s += K.vignette(.9) + K.grain(.22);
    return K.done(s);
  };

  /* ---------- jump-scare close-ups (600 x 600) ---------- */
  const SC = {};
  const SVB = '0 0 600 600';

  SC.grin = () => {
    const K = kit();
    let s = `<rect width="600" height="600" fill="${K.rad('bg', [[0, '#5a0606'], [1, '#000']], .5, .55, .6)}"/>`;
    s += `<path d="M300,40 C420,40 470,150 470,260 C470,330 520,380 500,440 C470,540 380,590 300,590 C220,590 130,540 100,440 C80,380 130,330 130,260 C130,150 180,40 300,40Z" fill="${K.rad('sk', [[0, '#f2ecdc'], [.7, '#cfc6b0'], [1, '#8a8270']], .5, .4, .6)}"/>`;
    s += `<path d="M110,90 L490,90 L500,110 L100,110Z M180,92 Q180,-20 300,-20 Q420,-20 420,92Z" fill="#050505"/>`;
    [[226, 232], [376, 224]].forEach(([x, y]) => s += `<path d="M${x - 46},${y} Q${x},${y - 40} ${x + 46},${y} Q${x},${y + 34} ${x - 46},${y}Z" fill="#000"/><circle cx="${x + 8}" cy="${y - 4}" r="4.5" fill="#fff"/><path d="M${x - 40},${y + 22} q${40},20 80,0" stroke="#7a705e" stroke-width="3" fill="none"/>`);
    s += `<path d="M190,190 q40,-26 80,-6 M330,182 q40,-22 84,4" stroke="#6a6252" stroke-width="5" fill="none"/>`;
    s += `<path d="M300,250 q-12,60 -4,70 q8,6 18,0" stroke="#8a8270" stroke-width="4" fill="none"/>`;
    s += grinMouth(300, 350, 470, 48, { teeth: 24, tc: '#f3ead0', inside: '#160202', lip: '#100000', lw: 4, long: .5, crease: '#6a6252' });
    s += K.vignette(.85, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };

  SC.dan = () => {
    const K = kit();
    let s = `<rect width="600" height="600" fill="${K.rad('bg', [[0, '#123848'], [1, '#000']], .5, .5, .6)}"/>`;
    s += `<path d="M120,600 L130,500 Q300,450 470,500 L480,600Z" fill="#e9e6e0"/><path d="M120,560 L480,560" stroke="#e57da2" stroke-width="18"/>`;
    s += `<path d="M150,440 Q100,330 180,300 Q120,220 220,190 Q200,110 300,90 Q400,110 380,190 Q480,220 420,300 Q500,330 450,440 Z" fill="${K.rad('ss', [[0, '#fbf3e6'], [1, '#d9c8b0']], .45, .35, .6)}"/>`;
    s += `<path d="M180,300 Q300,340 420,300 M220,190 Q300,226 380,190" stroke="#c9b398" stroke-width="5" fill="none"/>`;
    [[170, 430, 60], [230, 450, 90], [380, 450, 70], [430, 430, 50], [300, 455, 110]].forEach(([x, y, l]) => s += `<path d="M${x - 10},${y} q0,${l} 10,${l} q10,0 10,-${l}Z" fill="#efe2cc"/>`);
    s += `<path d="M300,64 q-10,-30 14,-50" stroke="#efe2cc" stroke-width="16" fill="none" stroke-linecap="round"/>`;
    [[245, 270], [355, 268]].forEach(([x, y]) => s += `<ellipse cx="${x}" cy="${y}" rx="22" ry="30" fill="#1a0e08"/><path d="M${x - 6},${y + 28} q4,40 0,70" stroke="#4a2a14" stroke-width="8" stroke-linecap="round"/>`);
    s += grinMouth(300, 345, 230, 30, { teeth: 14, tc: '#5a3014', inside: '#1a0805', lip: '#4a2a14', lw: 4 });
    s += K.vignette(.85, 600, 600) + K.grain(.22, 600, 600);
    return K.done(s, SVB);
  };

  SC.crawler = () => {
    const K = kit();
    let s = `<rect width="600" height="600" fill="#020402"/>`;
    s += crawlerBody(300, 175, 1.95);
    s += `<rect width="600" height="600" fill="${K.rad('g', [[0, '#9fe07a', .15], [1, '#000', 0]], .5, .5, .6)}"/>`;
    s += K.vignette(.9, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };

  SC.ellie = () => {
    const K = kit();
    let s = `<rect width="600" height="600" fill="#03050a"/>`;
    s += `<ellipse cx="300" cy="320" rx="200" ry="250" fill="${K.rad('sk', [[0, '#e3ecef'], [1, '#7f8f98']], .5, .45, .6)}"/>`;
    s += `<ellipse cx="350" cy="290" rx="40" ry="28" fill="#fdfdfb"/><circle cx="348" cy="292" r="7" fill="#9aa9b0"/>`;
    s += `<path d="M260,420 Q300,430 340,418" stroke="#4a5a62" stroke-width="5" fill="none"/>`;
    s += `<path d="M60,600 L80,200 Q90,40 300,30 Q330,30 330,60 L322,200 Q316,260 326,330 L300,600 L250,600 L270,250 Q240,330 220,600 L140,600 L170,240Z" fill="#05070b"/><path d="M330,60 Q420,34 520,200 L540,600 L460,600 L430,300 Q420,360 410,600 L380,600 Q396,420 392,330 Q402,250 388,160 Q380,90 330,60Z" fill="#05070b"/><path d="M326,200 q-10,120 4,220 M392,190 q14,120 -4,240" stroke="#05070b" stroke-width="6" fill="none"/>`;
    s += `<path d="M60,140 Q300,-40 540,140 Q560,60 520,30 L80,30 Q40,60 60,140Z" fill="#e8c43a"/>`;
    s += `<g stroke="#9fc7e6" stroke-width="4" stroke-linecap="round" opacity=".6"><path d="M120,300 l0,40 M480,380 l0,50 M200,500 l0,40"/></g>`;
    s += K.vignette(.9, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };

  SC.hollows = () => {
    const K = kit();
    let s = `<rect width="600" height="600" fill="#030603"/>`;
    s += `<g transform="translate(-380,-40) scale(1.7)">${person({ skin: '#f2d2bf', hair: '#d9d6d2', bun: true, cloth: '#b79ad2', cardigan: true, brooch: true, glasses: true, hollow: true, smile: 'huge' })}</g>`;
    s += `<rect width="600" height="600" fill="#8fd16a" opacity=".12" style="mix-blend-mode:color"/>`;
    s += K.vignette(.85, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };

  SC.landlord = () => {
    const K = kit();
    let s = `<rect width="600" height="600" fill="#1a0202"/>`;
    s += landlordMass(300, 760, 1.9, K);
    s += `<rect width="600" height="600" fill="#e0362c" opacity=".15" style="mix-blend-mode:screen"/>`;
    s += K.vignette(.85, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };

  /* coming-soon covers */
  S.cover_gullrock = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="${K.lin('s', [[0, '#05080f'], [1, '#14223a']])}"/>`;
    s += `<polygon points="380,320 400,90 440,90 460,320" fill="#d9d4c8"/><rect x="392" y="140" width="56" height="18" fill="#b8323a"/><rect x="388" y="220" width="64" height="18" fill="#b8323a"/><rect x="396" y="64" width="48" height="28" fill="#ffe9a8"/><path d="M390,64 L420,40 L450,64Z" fill="#2a2a2a"/>`;
    s += `<polygon points="420,78 0,20 0,130" fill="#ffe9a8" opacity=".18"/>`;
    s += `<path d="M0,320 Q200,300 380,320 L460,320 Q640,300 800,330 L800,400 L0,400Z" fill="#0a1220"/>`;
    for (let i = 0; i < 8; i++) s += `<path d="M${i * 110},${350 + (i % 2) * 14} q30,-10 60,0" stroke="#3a5a7a" stroke-width="2" fill="none" opacity=".6"/>`;
    s += K.vignette(.8) + K.grain(.18);
    return K.done(s);
  };
  /* cover_ward9 lives in art-ward9.js */

  /* shared toolkit so other story art files can add their own drawings */
  const LIB = { kit, f, mix, shade, rng, qb, hex2rgb, tree, dog, gnome, grinMouth, slackMouth, splitMouth, humMouth, person, at, harrow, house, S, SC, SVB };
  window.ART = {
    lib: LIB,
    scene(key) { try { return (S[key] || S.street_day)(); } catch (e) { console.error('art', key, e); return ''; } },
    scare(key) { try { return (SC[key] || SC.grin)(); } catch (e) { console.error('scare', key, e); return ''; } },
    has(key) { return !!S[key]; },
    keys() { return Object.keys(S); },
    scareKeys() { return Object.keys(SC); }
  };
})();
