/* NIGHTDOOR art for "The Bell at Hollowmere": farm, chapel, possession and demon drawings.
   Adds scenes to ART (800x400) and jump scares (600x600) using the shared toolkit. */
(function () {
  'use strict';
  const { kit, f, mix, shade, rng, grinMouth, humMouth, person, at, harrow, tree, S, SC, SVB } = ART.lib;

  let WIN = 0;

  /* ---------- moods ---------- */
  const M = {
    day:    { sky: [[0, '#74bfe9'], [1, '#dcf0f8']], back: '#a9d48f', hill: '#8cc472', field: '#79b45f', hedge: '#4b8441', sun: '#fff3b8', clouds: true },
    golden: { sky: [[0, '#e48f58'], [.6, '#f5c483'], [1, '#fbe6b2']], back: '#c2b56c', hill: '#a9b45e', field: '#98a852', hedge: '#5d6e33', sun: '#ffe0a0', tint: ['#ff9a3c', .16] },
    grey:   { sky: [[0, '#3c414d'], [1, '#8a8d94']], back: '#5f6b5a', hill: '#55634e', field: '#4a5843', hedge: '#2f3d2c', tint: ['#2a3040', .25] },
    dusk:   { sky: [[0, '#1d1233'], [.55, '#6c2c58'], [1, '#d66e48']], back: '#4a3a58', hill: '#3c3648', field: '#33303e', hedge: '#211d2a', moon: true, stars: true, tint: ['#2b1048', .35] },
    night:  { sky: [[0, '#02040a'], [1, '#0d1631']], back: '#0e1626', hill: '#0b121f', field: '#09101a', hedge: '#05080e', moon: true, stars: true },
    storm:  { sky: [[0, '#030509'], [1, '#18202f']], back: '#0f1520', hill: '#0a0f17', field: '#080c12', hedge: '#040609', rain: true },
    blood:  { sky: [[0, '#0c0101'], [1, '#4a0a08']], back: '#2a0606', hill: '#1c0404', field: '#140303', hedge: '#0a0101', moon: 'red', rain: true },
    dawn:   { sky: [[0, '#9cc6e6'], [.55, '#f7d6c2'], [1, '#ffd39a']], back: '#a6c992', hill: '#92c27c', field: '#82b56c', hedge: '#4f7f45', sun: '#fff0c4', low: true }
  };

  /* ---------- landscape pieces ---------- */
  function sky(K, m, o = {}) {
    const P = M[m];
    let s = `<rect width="800" height="400" fill="${K.lin('sky' + (++WIN), P.sky)}"/>`;
    if (P.sun) { const x = P.low ? 560 : 660, y = P.low ? 205 : 70; s += `<circle cx="${x}" cy="${y}" r="${P.low ? 58 : 32}" fill="${P.sun}"/><circle cx="${x}" cy="${y}" r="${P.low ? 120 : 70}" fill="${P.sun}" opacity=".22"/>`; }
    if (P.clouds) s += `<g fill="#fff" opacity=".9"><ellipse cx="150" cy="70" rx="60" ry="16"/><ellipse cx="186" cy="58" rx="36" ry="17"/><ellipse cx="480" cy="104" rx="46" ry="12"/><ellipse cx="505" cy="96" rx="26" ry="11"/></g>`;
    if (m === 'grey') s += `<g fill="#2e323c" opacity=".55"><ellipse cx="160" cy="60" rx="220" ry="40"/><ellipse cx="560" cy="40" rx="260" ry="46"/><ellipse cx="400" cy="110" rx="300" ry="26" opacity=".6"/></g>`;
    if (P.stars) { const r = rng(11); for (let i = 0; i < 46; i++) s += `<circle cx="${f(r() * 800)}" cy="${f(r() * 160)}" r="${f(r() * 1.2 + .3)}" fill="#fff" opacity="${f(r() * .6 + .2)}"/>`; }
    if (P.moon) { const red = P.moon === 'red'; s += `<circle cx="640" cy="66" r="22" fill="${red ? '#ff6a4a' : '#f3e9d2'}" opacity=".95"/><circle cx="640" cy="66" r="60" fill="${red ? '#ff3a2a' : '#f3e9d2'}" opacity=".12"/>`; if (!red) s += `<circle cx="648" cy="61" r="19" fill="${P.sky[0][1]}"/>`; }
    if (m === 'storm' && o.flash !== false) s += `<path d="M560,0 L540,60 L556,62 L528,140 L548,142 L520,220" stroke="#e6f0ff" stroke-width="3" fill="none"/><rect width="800" height="400" fill="#cfe0ff" opacity=".08"/>`;
    return s;
  }
  function hills(K, m, horizon = 250, seed = 5) {
    const P = M[m], r = rng(seed);
    let s = `<path d="M0,${horizon - 40} Q120,${horizon - 90} 260,${horizon - 50} T540,${horizon - 60} T800,${horizon - 70} L800,400 L0,400Z" fill="${P.back}"/>`;
    s += `<path d="M0,${horizon} Q160,${horizon - 50} 330,${horizon - 14} T680,${horizon - 22} T800,${horizon - 30} L800,400 L0,400Z" fill="${P.hill}"/>`;
    for (let i = 0; i < 5; i++) { const y = horizon + 10 + i * 34; s += `<path d="M0,${y} Q${200 + r() * 100},${y - 10} 400,${y + 4} T800,${y - 4}" stroke="${P.hedge}" stroke-width="${3 + i}" fill="none" opacity=".75"/>`; }
    return s;
  }
  function tint(m) { const t = M[m].tint; return t ? `<rect width="800" height="400" fill="${t[0]}" opacity="${t[1]}" style="mix-blend-mode:multiply"/>` : ''; }
  function rain(K, o = .35, w = 800, h = 400) { const r = rng(17); let s = `<g stroke="#a9bfdc" stroke-width="1.2" opacity="${o}">`; for (let i = 0; i < 160; i++) { const x = r() * (w + 100), y = r() * h; s += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x - 10)}" y2="${f(y + 26)}"/>`; } return s + '</g>'; }

  function farmhouse(x, b, s, o = {}) {
    const wall = o.wall || '#d9ccb2', roof = o.roof || '#4d525c', lit = o.lit;
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${s})">`;
    g += `<rect x="-120" y="-150" width="22" height="40" fill="${shade(wall, -.25)}"/><rect x="96" y="-150" width="22" height="40" fill="${shade(wall, -.25)}"/>`;
    g += `<polygon points="-140,-100 0,-170 140,-100" fill="${roof}"/><rect x="-130" y="-102" width="260" height="102" fill="${wall}"/>`;
    for (let i = 0; i < 18; i++) g += `<rect x="${-128 + (i % 6) * 43}" y="${-96 + Math.floor(i / 6) * 32}" width="40" height="2" fill="${shade(wall, -.12)}" opacity=".6"/>`;
    const win = (wx, wy, on) => `<rect x="${wx}" y="${wy}" width="34" height="30" fill="${on ? (o.litc || '#ffd27a') : (o.win || '#3a4252')}" stroke="#f3eee2" stroke-width="3"/><path d="M${wx + 17},${wy} V${wy + 30} M${wx},${wy + 15} H${wx + 34}" stroke="#f3eee2" stroke-width="2"/>`;
    g += win(-104, -86, lit && lit[0]) + win(-40, -86, lit && lit[1]) + win(70, -86, lit && lit[2]) + win(-104, -40, lit && lit[3]) + win(70, -40, lit && lit[4]);
    g += `<rect x="0" y="-52" width="34" height="52" fill="${o.door || '#2f5d47'}"/><polygon points="-6,-52 17,-66 40,-52" fill="${roof}"/><circle cx="27" cy="-26" r="2" fill="#e5c25a"/>`;
    if (lit) g += lit.map((on, i) => on ? `<circle cx="${[-87, -23, 87, -87, 87][i]}" cy="${[-71, -71, -71, -25, -25][i]}" r="30" fill="${o.litc || '#ffd27a'}" opacity=".18"/>` : '').join('');
    return g + '</g>';
  }
  function barn(x, b, s, c = '#a33a2c') {
    return `<g transform="translate(${f(x)},${f(b)}) scale(${s})"><polygon points="-90,-90 0,-140 90,-90 90,0 -90,0" fill="${c}"/><polygon points="-96,-88 0,-146 96,-88 90,-86 0,-136 -90,-86" fill="${shade(c, -.45)}"/><rect x="-36" y="-70" width="72" height="70" fill="${shade(c, -.25)}"/><path d="M-36,-70 L36,0 M36,-70 L-36,0" stroke="#efe2c8" stroke-width="5"/><rect x="-36" y="-70" width="72" height="70" fill="none" stroke="#efe2c8" stroke-width="5"/></g>`;
  }
  function ruin(x, b, s, o = {}) {
    const c = o.c || '#3a3734', d = shade(c, -.35);
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${s})">`;
    g += `<path d="M-120,0 L-120,-80 L-104,-96 L-92,-78 L-70,-110 L-50,-84 L-30,-120 L-10,-92 L10,-118 L40,-86 L60,-104 L90,-70 L110,-82 L120,-60 L120,0Z" fill="${c}"/>`;
    g += `<path d="M-40,-40 L-40,-80 Q-20,-108 0,-80 L0,-40Z" fill="${o.glow || d}"/><path d="M40,-30 L40,-62 Q56,-84 72,-62 L72,-30Z" fill="${o.glow || d}"/>`;
    g += `<rect x="-170" y="-190" width="54" height="190" fill="${shade(c, .05)}"/><path d="M-170,-190 L-162,-204 L-150,-192 L-136,-206 L-124,-190 L-116,-198 L-116,-190Z" fill="${shade(c, .05)}"/>`;
    g += `<rect x="-160" y="-170" width="34" height="46" fill="${d}"/>`;
    g += `<path d="M-160,-124 L-143,-168 L-126,-124 M-152,-144 L-134,-144" stroke="#5a3b22" stroke-width="4" fill="none"/>`;
    if (o.bell) g += `<path d="M-151,-150 Q-151,-162 -143,-162 Q-135,-162 -135,-150 L-132,-138 L-154,-138Z" fill="#c99a3a"/>`;
    g += `<path d="M-120,0 L-120,-30 M120,0 L120,-20" stroke="${d}" stroke-width="3"/>`;
    return g + '</g>';
  }
  function church(x, b, s, c = '#b7ad9a') {
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${s})">`;
    g += `<rect x="-20" y="-110" width="140" height="110" fill="${c}"/><polygon points="-26,-110 50,-160 126,-110" fill="#545a63"/>`;
    g += `<rect x="-90" y="-170" width="70" height="170" fill="${shade(c, -.05)}"/><polygon points="-96,-170 -55,-260 -14,-170" fill="#545a63"/>`;
    g += `<path d="M-68,-140 Q-55,-160 -42,-140 L-42,-110 L-68,-110Z" fill="#2c2a28"/><path d="M10,-80 Q24,-100 38,-80 L38,-40 L10,-40Z M62,-80 Q76,-100 90,-80 L90,-40 L62,-40Z" fill="#3a5a7a"/>`;
    g += `<path d="M-68,0 L-68,-40 Q-55,-58 -42,-40 L-42,0Z" fill="#5a3a24"/><circle cx="-55" cy="-196" r="8" fill="#e8dcc0"/>`;
    return g + '</g>';
  }
  function sheep(x, b, s, o = {}) {
    const w = o.w || '#f2efe6', e = o.eyes;
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${s})">`;
    g += `<rect x="-14" y="-12" width="4" height="12" fill="#2a2522"/><rect x="8" y="-12" width="4" height="12" fill="#2a2522"/>`;
    g += `<ellipse cx="0" cy="-20" rx="22" ry="14" fill="${w}"/><circle cx="-12" cy="-28" r="8" fill="${w}"/><circle cx="8" cy="-30" r="9" fill="${w}"/>`;
    g += `<ellipse cx="${o.face === 'front' ? 0 : 22}" cy="-24" rx="7" ry="9" fill="#2a2522"/>`;
    if (e) g += `<circle cx="${o.face === 'front' ? -3 : 20}" cy="-26" r="1.6" fill="${e}"/><circle cx="${o.face === 'front' ? 3 : 25}" cy="-26" r="1.6" fill="${e}"/>`;
    return g + '</g>';
  }
  function collie(x, b, s, o = {}) {
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${s})">`;
    g += `<path d="M-22,-24 q-16,-8 -18,-26" stroke="#1b1b1e" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    g += `<ellipse cx="0" cy="-20" rx="24" ry="11" fill="#1b1b1e"/><path d="M12,-28 Q22,-8 14,-10Z" fill="#f2efe8"/>`;
    g += `<rect x="-18" y="-12" width="5" height="12" fill="#1b1b1e"/><rect x="12" y="-12" width="5" height="12" fill="#f2efe8"/>`;
    g += `<circle cx="22" cy="-30" r="10" fill="#1b1b1e"/><path d="M22,-40 L22,-20 L34,-24Z" fill="#f2efe8"/><path d="M15,-38 L18,-48 L23,-39Z M24,-39 L28,-48 L30,-37Z" fill="#1b1b1e"/>`;
    g += `<circle cx="34" cy="-25" r="2" fill="#222"/><circle cx="25" cy="-32" r="1.6" fill="${o.eyes || '#e7c35a'}"/>`;
    return g + '</g>';
  }
  function bell(x, y, s, o = {}) {
    const c = o.c || '#c99a3a';
    let g = `<g transform="translate(${f(x)},${f(y)}) scale(${s})">`;
    if (o.glow) g += `<circle cx="0" cy="-10" r="60" fill="${o.glow}" opacity=".22"/><circle cx="0" cy="-10" r="34" fill="${o.glow}" opacity=".25"/>`;
    g += `<rect x="-4" y="-62" width="8" height="18" rx="3" fill="#1a1612"/><circle cx="0" cy="-64" r="7" fill="#1a1612"/>`;
    g += `<path d="M-18,-44 Q-20,-46 -12,-48 L12,-48 Q20,-46 18,-44 Q22,-20 26,-4 L32,4 L-32,4 L-26,-4 Q-22,-20 -18,-44Z" fill="${c}"/>`;
    g += `<path d="M-10,-42 Q-14,-20 -18,0" stroke="#f3d78a" stroke-width="4" fill="none" opacity=".7"/>`;
    g += `<rect x="-32" y="2" width="64" height="5" rx="2" fill="${shade(c, -.3)}"/><circle cx="0" cy="12" r="5" fill="${shade(c, -.4)}"/>`;
    return g + '</g>';
  }

  /* figures */
  const TILLY = { skin: '#f3d0b5', hair: '#a8552a', longhair: true, cloth: '#8fb8e0', iris: '#5d7c4a' };
  const freckles = (o = .6) => `<g fill="#b8693e" opacity="${o}">${[[352, 186], [362, 194], [346, 196], [448, 186], [438, 194], [454, 196], [358, 204], [442, 204]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4"/>`).join('')}</g>`;
  const veins = () => `<g stroke="#2a1c3a" stroke-width="2" fill="none" opacity=".75"><path d="M356,170 l-12,10 l-6,22 M444,170 l12,10 l6,22 M372,176 l-4,20 M428,176 l4,20 M400,96 l-6,22 l8,14"/></g>`;
  function tilly(o = {}) {
    let s = person(Object.assign({}, TILLY, o.guest ? { hollow: true, shut: true, smile: 'hum', cloth: '#5c6f86' } : {}));
    if (o.guest) s = `<g transform="rotate(-11 400 200)">${s}</g>`;
    s += freckles(o.guest ? .25 : .6);
    if (o.guest) s += veins() + `<path d="M330,80 L470,80 L480,400 L320,400Z" fill="#6a7a8a" opacity=".22" style="mix-blend-mode:color"/>`;
    return s;
  }
  /* full-body girl in a nightie, feet at (x,b); back = seen from behind */
  function girl(x, b, s, o = {}) {
    const dress = o.dress || '#dfe6ee', hair = o.hair || '#7a3c1e', skin = o.skin || '#e8cbb6';
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${s})"${o.op ? ` opacity="${o.op}"` : ''}>`;
    g += `<rect x="-12" y="-36" width="8" height="36" fill="${skin}"/><rect x="4" y="-36" width="8" height="36" fill="${skin}"/>`;
    g += `<path d="M-30,-34 L-20,-120 Q0,-130 20,-120 L30,-34Z" fill="${dress}"/>`;
    g += `<path d="M-20,-118 L-30,-60 M20,-118 L30,-60" stroke="${skin}" stroke-width="8" stroke-linecap="round"/>`;
    g += `<ellipse cx="0" cy="-142" rx="17" ry="20" fill="${skin}"/>`;
    if (o.back) g += `<path d="M-20,-150 Q-22,-168 0,-168 Q22,-168 20,-150 L24,-96 L-24,-96Z" fill="${hair}"/>`;
    else {
      g += `<path d="M-20,-140 Q-22,-168 0,-168 Q22,-168 20,-140 L24,-100 L16,-134 Q0,-150 -16,-134 L-24,-100Z" fill="${hair}"/>`;
      const e = o.eyes || '#222';
      if (o.hum) g += `<path d="M-9,-143 Q-6,-139 -3,-143 M3,-143 Q6,-139 9,-143" stroke="#2a1a1a" stroke-width="1.4" fill="none"/>`;
      else g += `<ellipse cx="-6" cy="-142" rx="3.4" ry="2.6" fill="${e}"/><ellipse cx="6" cy="-142" rx="3.4" ry="2.6" fill="${e}"/>`;
      if (o.hum) g += humMouth(0, -130, 2.6, '#200404');
      else g += `<path d="M-4,-131 Q0,-128 4,-131" stroke="#8a3434" stroke-width="1.4" fill="none"/>`;
    }
    return g + '</g>';
  }
  const grey = (x, b, h, o = {}) => harrow(x, b, h, Object.assign({ c: '#5d6168', face: '#cfc9bd', smile: false }, o));

  /* interiors */
  function room(K, wall, floor, o = {}) {
    let s = `<rect width="800" height="400" fill="${wall}"/>`;
    if (o.paper) for (let x = 0; x < 800; x += 40) s += `<rect x="${x}" y="0" width="14" height="${o.floorY || 300}" fill="${shade(wall, -.06)}"/>`;
    const fy = o.floorY || 300;
    s += `<rect x="0" y="${fy}" width="800" height="${400 - fy}" fill="${floor}"/>`;
    for (let x = 0; x < 800; x += 46) s += `<line x1="${x}" y1="${fy}" x2="${x - 30}" y2="400" stroke="${shade(floor, -.2)}" stroke-width="2"/>`;
    s += `<rect x="0" y="${fy - 12}" width="800" height="12" fill="${shade(wall, -.25)}"/>`;
    return s;
  }
  function window_(K, x, y, w, h, inner) {
    const id = K.u + 'win' + (++WIN);
    K.defs.push(`<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>`);
    return `<rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 16}" fill="#efe9dc"/><g clip-path="url(#${id})"><g transform="translate(${x},${y}) scale(${f(w / 800)},${f(h / 400)})">${inner(K)}</g></g><path d="M${x + w / 2},${y} V${y + h} M${x},${y + h / 2} H${x + w}" stroke="#efe9dc" stroke-width="6"/>`;
  }

  /* ================= SCENES ================= */

  S.cover_hollowmere = () => {
    const K = kit(); let s = sky(K, 'dusk') + hills(K, 'dusk', 300, 3);
    s += ruin(560, 214, .9, { glow: '#ff9a4a', bell: true }) ;
    s += `<path d="M380,260 Q330,190 470,214" stroke="#2a2232" stroke-width="10" fill="none"/>`;
    s += farmhouse(200, 330, .75, { lit: [1, 0, 0, 1, 0], wall: '#8a7f7a', roof: '#2a2a33', win: '#211d2a' });
    s += girl(406, 300, .42, { back: true, dress: '#d9dfe8' });
    s += tint('dusk') + K.vignette(.8) + K.grain(.18);
    return K.done(s);
  };

  S.station = () => {
    const K = kit(); let s = sky(K, 'day') + hills(K, 'day', 230, 2);
    s += `<rect x="0" y="282" width="800" height="22" fill="#d8cfbf"/><rect x="0" y="302" width="800" height="98" fill="#b9b0a2"/><rect x="0" y="282" width="800" height="5" fill="#f1e05a"/>`;
    s += `<rect x="60" y="150" width="220" height="132" fill="#d9c7a6"/><polygon points="40,150 300,150 280,120 60,120" fill="#7a3a2c"/><rect x="90" y="190" width="40" height="92" fill="#2f5d47"/><rect x="160" y="185" width="90" height="50" fill="#bfe2f3" stroke="#fff" stroke-width="4"/>`;
    s += `<rect x="110" y="128" width="120" height="16" fill="#1f3f6f"/><text x="170" y="140" font-family="Georgia,serif" font-size="11" fill="#fff" text-anchor="middle">HOLLOWMERE</text>`;
    for (let i = 0; i < 4; i++) s += `<path d="M${330 + i * 110},180 L${330 + i * 110},230" stroke="#2a2a2a" stroke-width="2"/><ellipse cx="${330 + i * 110}" cy="234" rx="18" ry="10" fill="#4f8a45"/><circle cx="${322 + i * 110}" cy="232" r="4" fill="#e04b6b"/><circle cx="${338 + i * 110}" cy="236" r="4" fill="#f2c94a"/>`;
    s += `<rect x="300" y="160" width="500" height="6" fill="#3a3a3a"/>`;
    s += `<g transform="translate(560,282)"><rect x="-12" y="-80" width="24" height="56" rx="10" fill="#6a8a4a"/><circle cx="0" cy="-92" r="13" fill="#e9c2a6"/><path d="M-13,-96 Q0,-114 13,-96 Q10,-104 0,-104Z" fill="#8a5a3a"/><rect x="-12" y="-26" width="9" height="26" fill="#2a3a2a"/><rect x="3" y="-26" width="9" height="26" fill="#2a3a2a"/><path d="M12,-70 L30,-50" stroke="#6a8a4a" stroke-width="8" stroke-linecap="round"/><rect x="26" y="-56" width="8" height="20" fill="#c94a3a"/></g>`;
    s += sheep(700, 248, .7) + sheep(740, 252, .6);
    s += K.vignette(.45) + K.grain(.1);
    return K.done(s);
  };

  S.farmyard = () => {
    const K = kit(); let s = sky(K, 'day') + hills(K, 'day', 250, 4);
    s += ruin(690, 166, .32);
    s += barn(600, 300, .95) + farmhouse(270, 300, .95);
    s += `<rect x="0" y="300" width="800" height="100" fill="#b6a88c"/>`;
    for (let i = 0; i < 6; i++) s += `<ellipse cx="${80 + i * 130}" cy="${340 + (i % 2) * 20}" rx="30" ry="6" fill="#9a8b70"/>`;
    s += `<rect x="40" y="250" width="110" height="40" fill="#efe6d4"/><text x="95" y="275" font-family="Georgia,serif" font-weight="700" font-size="12" fill="#c94a3a" text-anchor="middle">WELCOME COUSIN!!!</text><rect x="54" y="290" width="6" height="20" fill="#6a4a2a"/><rect x="130" y="290" width="6" height="20" fill="#6a4a2a"/>`;
    s += collie(470, 370, 1.4) + girl(420, 380, .6, { eyes: '#3a2a1a', dress: '#e98aa8' });
    [[640, 360], [700, 375], [560, 385]].forEach(([x, y]) => s += `<ellipse cx="${x}" cy="${y - 8}" rx="9" ry="7" fill="#c47a3a"/><circle cx="${x + 7}" cy="${y - 15}" r="4.5" fill="#c47a3a"/><path d="M${x + 11},${y - 15} l5,1 l-5,2Z" fill="#e8b84a"/>`);
    s += sheep(150, 372, .8, { w: '#fffaf0' }) + sheep(195, 380, .55, { w: '#fffaf0' });
    s += K.vignette(.45) + K.grain(.1);
    return K.done(s);
  };

  S.kitchen = () => {
    const K = kit(); let s = room(K, '#f1dfb8', '#9a6a44', { floorY: 310 });
    s += window_(K, 300, 60, 200, 130, k => sky(k, 'golden') + hills(k, 'golden', 230, 7));
    s += `<rect x="40" y="170" width="200" height="140" fill="#2f4a6f"/><rect x="40" y="160" width="200" height="16" fill="#9aa3ad"/><circle cx="90" cy="168" r="18" fill="#cfd4da"/><circle cx="160" cy="168" r="18" fill="#cfd4da"/><rect x="60" y="200" width="70" height="40" fill="#24395a"/><rect x="140" y="200" width="80" height="40" fill="#24395a"/><rect x="70" y="270" width="150" height="10" fill="#c9a24a"/>`;
    s += `<rect x="260" y="250" width="320" height="18" fill="#c29a6a"/><rect x="280" y="268" width="14" height="80" fill="#8a6440"/><rect x="546" y="268" width="14" height="80" fill="#8a6440"/>`;
    s += `<ellipse cx="420" cy="246" rx="60" ry="12" fill="#efe8da"/><ellipse cx="420" cy="240" rx="46" ry="10" fill="#c27a3a"/><path d="M380,240 q10,-8 20,0 q10,-8 20,0 q10,-8 20,0" stroke="#e8b46a" stroke-width="4" fill="none"/>`;
    s += `<rect x="600" y="40" width="160" height="10" fill="#7a5a3a"/>`;
    for (let i = 0; i < 5; i++) s += `<path d="M${610 + i * 30},50 q6,22 12,0" stroke="#d9d0bf" stroke-width="10" fill="none"/>`;
    s += `<rect x="620" y="110" width="110" height="200" fill="#6a4a2f"/><path d="M640,110 V310 M712,110 V310" stroke="#4a321e" stroke-width="2"/><path d="M675,96 L675,104" stroke="#555" stroke-width="2"/><circle cx="675" cy="118" r="7" fill="#d8dde2"/><path d="M675,100 l-6,10 M675,100 l6,10" stroke="#aaa" stroke-width="1"/>`;
    s += `<rect width="800" height="400" fill="${K.rad('w', [[0, '#ffcf7a', .25], [1, '#ffcf7a', 0]], .5, .3, .7)}"/>`;
    s += K.vignette(.5) + K.grain(.1);
    return K.done(s);
  };

  S.bedroom = () => {
    const K = kit(); let s = room(K, '#e9d6c4', '#7a5638', { paper: true, floorY: 320 });
    s += `<polygon points="0,0 800,0 800,40 0,90" fill="#d8c3ad"/>`;
    s += window_(K, 520, 100, 180, 120, k => sky(k, 'night') + hills(k, 'night', 260, 3) + ruin(560, 210, .5, { glow: '#ffcf7a' }));
    s += `<rect x="80" y="230" width="340" height="80" fill="#6a4a30"/><rect x="80" y="200" width="20" height="120" fill="#5a3e26"/><rect x="400" y="230" width="20" height="90" fill="#5a3e26"/>`;
    for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) s += `<rect x="${100 + i * 50}" y="${232 + j * 30}" width="50" height="30" fill="${['#c94a3a', '#e8b84a', '#4f8a8a', '#e98aa8', '#7a9a4a', '#5a7ab0'][(i + j * 2) % 6]}"/>`;
    s += `<ellipse cx="140" cy="226" rx="44" ry="14" fill="#fbf6ec"/><rect x="130" y="214" width="26" height="14" rx="3" fill="#333"/><rect x="146" y="200" width="3" height="16" fill="#333"/>`;
    s += `<rect x="440" y="250" width="50" height="70" fill="#7a5638"/><path d="M455,250 L465,214 L475,250Z" fill="#f2d9a0"/><circle cx="465" cy="216" r="40" fill="#ffd27a" opacity=".22"/>`;
    s += `<rect width="800" height="400" fill="#ffb060" opacity=".14" style="mix-blend-mode:multiply"/>`;
    s += K.vignette(.6) + K.grain(.12);
    return K.done(s);
  };

  S.carboot = () => {
    const K = kit(); let s = sky(K, 'day') + `<rect x="0" y="210" width="800" height="190" fill="#88c06c"/>`;
    s += church(110, 210, .55) + tree(260, 214, 90, '#4f8a45', '#5a3e26') + tree(700, 214, 110, '#4f8a45', '#5a3e26');
    for (let i = 0; i < 26; i++) { const t = i / 25, x = t * 800, y = 70 + Math.sin(t * Math.PI) * 30; s += `<path d="M${f(x - 10)},${f(y)} L${f(x + 10)},${f(y)} L${f(x)},${f(y + 18)}Z" fill="${['#e04b4b', '#f2c94a', '#4a8ad8', '#5ab35a'][i % 4]}"/>`; }
    s += `<path d="M0,70 Q400,130 800,70" stroke="#555" stroke-width="1.4" fill="none"/>`;
    const car = (x, c) => `<g transform="translate(${x},300)"><path d="M0,0 L0,-30 L20,-52 L100,-52 L124,-30 L150,-26 L150,0Z" fill="${c}"/><rect x="104" y="-60" width="46" height="34" fill="${shade(c, -.25)}" transform="skewX(-10)"/><circle cx="30" cy="0" r="12" fill="#222"/><circle cx="120" cy="0" r="12" fill="#222"/><rect x="128" y="-24" width="40" height="24" fill="#d9c7a6"/><rect x="134" y="-34" width="12" height="10" fill="#c94a3a"/><rect x="150" y="-32" width="14" height="8" fill="#4a8ad8"/></g>`;
    s += car(60, '#c94a3a') + car(300, '#3a6a9a');
    s += `<rect x="560" y="300" width="190" height="40" fill="#7b7f86"/>`;
    s += grey(612, 300, 120, { eyes: '#000' });
    s += bell(680, 296, .55);
    s += girl(470, 360, .5, { eyes: '#3a2a1a', dress: '#e98aa8' }) + collie(420, 362, .9);
    s += K.vignette(.45) + K.grain(.1);
    return K.done(s);
  };

  S.greyman = () => {
    const K = kit(); let s = sky(K, 'day') + `<rect x="0" y="230" width="800" height="170" fill="#88c06c"/>`;
    s += tree(120, 232, 140, '#4f8a45', '#5a3e26') + tree(700, 232, 120, '#4f8a45', '#5a3e26');
    s += `<rect x="260" y="320" width="300" height="50" fill="#7b7f86"/>`;
    s += grey(410, 330, 300, { eyes: '#111' });
    s += bell(490, 316, .9, { glow: '#ffe7a0' });
    s += `<rect width="800" height="400" fill="#8a92a0" opacity=".2" style="mix-blend-mode:color"/>`;
    s += K.vignette(.7) + K.grain(.14);
    return K.done(s);
  };

  S.village = () => {
    const K = kit(); let s = sky(K, 'day') + hills(K, 'day', 230, 9);
    s += church(560, 290, .95) + `<rect x="380" y="270" width="80" height="30" fill="#8a7f6a"/><polygon points="370,270 420,240 470,270" fill="#5a4a3a"/>`;
    s += `<rect x="0" y="290" width="800" height="110" fill="#7fbe66"/><ellipse cx="200" cy="350" rx="170" ry="34" fill="#6fa8c8"/><ellipse cx="200" cy="346" rx="140" ry="24" fill="#8cc2de"/>`;
    [[130, 345], [180, 352], [250, 340]].forEach(([x, y]) => s += `<ellipse cx="${x}" cy="${y}" rx="10" ry="5" fill="#f2efe6"/><circle cx="${x + 8}" cy="${y - 5}" r="4" fill="#3a6a3a"/><path d="M${x + 11},${y - 5} l5,1 l-5,1Z" fill="#e8a83a"/>`);
    s += `<g transform="translate(660,370)"><circle cx="-22" cy="0" r="16" fill="none" stroke="#222" stroke-width="3"/><circle cx="22" cy="0" r="16" fill="none" stroke="#222" stroke-width="3"/><path d="M-22,0 L0,-20 L22,0 M0,-20 L-4,-34" stroke="#222" stroke-width="3" fill="none"/><path d="M-2,-34 L-4,-80" stroke="#1a1a1a" stroke-width="16" stroke-linecap="round"/><rect x="-6" y="-72" width="4" height="10" fill="#fff"/><circle cx="-4" cy="-92" r="11" fill="#7a4a2a"/><path d="M-15,-96 Q-4,-110 7,-96Z" fill="#222"/></g>`;
    s += K.vignette(.45) + K.grain(.1);
    return K.done(s);
  };

  S.tilly_bell = () => {
    const K = kit(); let s = room(K, '#c7a7c4', '#5a4030', { paper: true, floorY: 330 });
    s += `<rect width="800" height="400" fill="#2b1048" opacity=".35" style="mix-blend-mode:multiply"/>`;
    s += `<rect x="70" y="250" width="140" height="80" fill="#6a4a30"/>`;
    s += `<path d="M90,250 L104,210 L118,250Z" fill="#f2d9a0"/><circle cx="104" cy="214" r="34" fill="#ffd27a" opacity=".25"/>`;
    s += bell(170, 246, .8, { glow: '#ffe7a0' });
    s += at(500, 180, .82, tilly());
    s += `<g transform="translate(410,330)"><path d="M0,0 q20,-60 60,-90" stroke="#f3d0b5" stroke-width="22" stroke-linecap="round" fill="none"/></g>`;
    s += bell(472, 238, .6);
    s += K.vignette(.7) + K.grain(.14);
    return K.done(s);
  };

  S.foot_of_bed = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#0a0e18"/>`;
    for (let x = 0; x < 800; x += 40) s += `<rect x="${x}" width="14" height="330" fill="#0d1220"/>`;
    s += window_(K, 560, 70, 150, 110, k => sky(k, 'night') + hills(k, 'night', 260, 3));
    s += `<polygon points="560,190 710,190 800,400 470,400" fill="#9fb4e0" opacity=".08"/>`;
    s += `<rect x="0" y="320" width="800" height="80" fill="#151a26"/><rect x="40" y="300" width="720" height="70" fill="#1d2436"/>`;
    s += girl(400, 330, 1.25, { back: true, dress: '#c8d2e4', hair: '#4a2614' });
    s += `<g fill="#9fb4e0" opacity=".25">${[[300, 390], [330, 376], [470, 386], [500, 372]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="11"/>`).join('')}</g>`;
    s += K.vignette(.9) + K.grain(.2);
    return K.done(s);
  };

  S.breakfast = () => {
    const K = kit(); let s = room(K, '#e6d3ad', '#8a6040', { floorY: 310 });
    s += window_(K, 300, 60, 200, 130, k => sky(k, 'grey') + hills(k, 'grey', 230, 7) + ruin(560, 200, .5));
    for (let i = 0; i < 7; i++) s += `<path d="M${330 + i * 22},${196} l3,-3 l3,3 M${333 + i * 22},${193} l0,4" stroke="#111" stroke-width="1.4"/>`;
    s += `<rect x="160" y="250" width="480" height="18" fill="#c29a6a"/><rect x="180" y="268" width="14" height="80" fill="#8a6440"/><rect x="606" y="268" width="14" height="80" fill="#8a6440"/>`;
    s += `<rect x="250" y="210" width="34" height="40" fill="#e8e2d6"/><path d="M250,214 q-14,6 -10,20 q4,8 16,4" stroke="#e8e2d6" stroke-width="4" fill="none"/><path d="M256,250 q10,10 0,26 q-6,12 4,22" stroke="#e8e3c8" stroke-width="8" fill="none" opacity=".9"/>`;
    s += `<ellipse cx="380" cy="248" rx="34" ry="7" fill="#efe8da"/><ellipse cx="520" cy="248" rx="34" ry="7" fill="#efe8da"/><rect x="505" y="240" width="30" height="6" fill="#c27a3a"/>`;
    s += at(400, 175, .55, tilly());
    s += `<rect width="800" height="400" fill="#4a5a60" opacity=".22" style="mix-blend-mode:multiply"/>`;
    s += K.vignette(.6) + K.grain(.14);
    return K.done(s);
  };

  S.farm_grey = () => {
    const K = kit(); let s = sky(K, 'grey') + hills(K, 'grey', 250, 4);
    s += ruin(680, 168, .38);
    s += barn(600, 300, .95, '#6e2e26') + farmhouse(270, 300, .95, { wall: '#a8a090', win: '#2a2f38', lit: [0, 0, 0, 0, 0] });
    s += `<rect x="0" y="300" width="800" height="100" fill="#7a7060"/>`;
    const r = rng(4); for (let i = 0; i < 9; i++) { const x = 60 + r() * 700, y = 40 + r() * 120; s += `<path d="M${f(x - 8)},${f(y)} q8,-6 8,0 q0,-6 8,0" stroke="#111" stroke-width="2" fill="none"/>`; }
    s += sheep(140, 360, .8, { w: '#cfcabe', face: 'front', eyes: '#d8c86a' }) + sheep(200, 372, .7, { w: '#cfcabe', face: 'front', eyes: '#d8c86a' }) + sheep(90, 380, .65, { w: '#cfcabe', face: 'front', eyes: '#d8c86a' });
    s += tint('grey') + K.vignette(.65) + K.grain(.16);
    return K.done(s);
  };

  S.ruin_day = () => {
    const K = kit(); let s = sky(K, 'grey') + hills(K, 'grey', 300, 8);
    s += ruin(470, 330, 1.45);
    s += `<ellipse cx="460" cy="360" rx="110" ry="22" fill="none" stroke="#b33a2a" stroke-width="4" opacity=".7"/>`;
    s += `<rect x="610" y="300" width="60" height="50" fill="#6f6a64"/><ellipse cx="640" cy="300" rx="34" ry="9" fill="#4a5a64"/>`;
    const r = rng(9); for (let i = 0; i < 40; i++) { const x = r() * 800; s += `<path d="M${f(x)},400 q${f(r() * 10 - 5)},-40 ${f(r() * 16 - 8)},-${f(50 + r() * 50)}" stroke="#3a4a2e" stroke-width="3" fill="none"/>`; }
    s += tint('grey') + K.vignette(.7) + K.grain(.18);
    return K.done(s);
  };

  S.church_in = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#2a2420"/>`;
    for (let i = 0; i < 4; i++) { const x = 60 + i * 200; s += `<path d="M${x},400 L${x},120 Q${x + 80},10 ${x + 160},120 L${x + 160},400" fill="none" stroke="#3a322a" stroke-width="18"/>`; }
    s += `<path d="M340,160 Q400,60 460,160 L460,250 L340,250Z" fill="${K.lin('gl', [[0, '#c94a5a'], [.5, '#4a7ac8'], [1, '#e8b84a']])}" opacity=".85"/><path d="M400,80 V250 M340,190 H460" stroke="#2a2420" stroke-width="5"/>`;
    s += `<polygon points="340,250 460,250 560,400 240,400" fill="#e8c88a" opacity=".1"/>`;
    s += `<rect x="560" y="280" width="90" height="70" fill="#8f877a"/><ellipse cx="605" cy="280" rx="54" ry="12" fill="#a59c8e"/><ellipse cx="605" cy="280" rx="42" ry="8" fill="#6a8aa8"/>`;
    s += at(250, 205, .62, person({ skin: '#9a6a4a', hair: '#2a1a12', short: true, cloth: '#1f2228', iris: '#3a2a1a' }) + `<rect x="385" y="262" width="30" height="12" fill="#fff"/>`);
    [[120, 270], [150, 262], [700, 268]].forEach(([x, y]) => s += `<rect x="${x - 3}" y="${y}" width="6" height="26" fill="#efe6cc"/><ellipse cx="${x}" cy="${y - 6}" rx="4" ry="8" fill="#ffd27a"/><circle cx="${x}" cy="${y - 6}" r="18" fill="#ffd27a" opacity=".2"/>`);
    s += K.vignette(.8) + K.grain(.16);
    return K.done(s);
  };

  S.attic = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#05060a"/>`;
    s += `<polygon points="0,0 400,-40 800,0 800,60 400,180 0,60" fill="#120e0c"/>`;
    for (let i = 0; i < 7; i++) s += `<line x1="${i * 133}" y1="0" x2="400" y2="180" stroke="#1e1712" stroke-width="10"/>`;
    s += `<polygon points="400,40 120,400 680,400" fill="#f3e3b0" opacity=".08"/>`;
    const trunk = (x, y, w, lab) => `<rect x="${x}" y="${y}" width="${w}" height="70" fill="#3a2a1c"/><rect x="${x}" y="${y}" width="${w}" height="14" fill="#2a1d12"/><rect x="${x + w / 2 - 8}" y="${y + 10}" width="16" height="16" fill="#8a7a4a"/><text x="${x + w / 2}" y="${y + 52}" font-family="Georgia,serif" font-size="12" fill="#c9b48a" text-anchor="middle" letter-spacing="2">${lab}</text>`;
    s += trunk(210, 300, 140, 'VICARAGE') + trunk(370, 310, 120, 'VICARAGE') + trunk(510, 296, 150, 'VICARAGE');
    s += `<g transform="translate(120,330)" fill="#2a1d14"><path d="M-50,0 Q0,30 50,0" stroke="#2a1d14" stroke-width="6" fill="none"/><ellipse cx="0" cy="-30" rx="40" ry="16"/><path d="M30,-40 q24,-10 20,-36 l-10,-4 q-6,14 -22,20Z"/><rect x="-26" y="-20" width="5" height="22"/><rect x="20" y="-20" width="5" height="22"/></g>`;
    s += `<circle cx="140" cy="290" r="2" fill="#d8e0ff"/>`;
    s += `<path d="M520,300 q10,-30 30,-26 q14,4 10,26" fill="#d8cbb4" opacity=".55"/>`;
    s += K.vignette(.92) + K.grain(.22);
    return K.done(s);
  };

  S.ros_asleep = () => {
    const K = kit(); let s = room(K, '#2a2f3e', '#1a1612', { paper: true, floorY: 330 });
    s += `<rect x="120" y="220" width="560" height="110" fill="#3a4a6a"/><rect x="110" y="170" width="24" height="170" fill="#3a2a1c"/><rect x="666" y="200" width="24" height="140" fill="#3a2a1c"/>`;
    s += `<rect x="140" y="200" width="110" height="40" rx="14" fill="#cfd3dc"/>`;
    s += `<path d="M240,214 Q420,196 640,214 L640,240 Q420,252 240,240Z" fill="#c9b8d8"/><path d="M360,206 L420,206 L420,240 L360,240Z" fill="#efe6d4"/>`;
    s += `<g transform="translate(200,212) rotate(-90)">${`<ellipse cx="0" cy="0" rx="22" ry="27" fill="#b9b3ae"/><path d="M-22,-4 Q-22,-30 0,-30 Q22,-30 22,-4 Q10,-16 0,-16 Q-10,-16 -22,-4Z" fill="#8a7a6a"/>`}</g>`;
    s += `<path d="M206,204 q-4,6 0,16 M206,224 q-6,0 -10,-4" stroke="#222" stroke-width="2" fill="none"/>`;
    s += `<path d="M216,198 Q222,212 216,226" stroke="#2a0606" stroke-width="3" fill="none"/>`;
    s += `<rect x="40" y="250" width="60" height="80" fill="#3a2a1c"/><rect x="60" y="230" width="28" height="12" rx="3" fill="#222"/>`;
    s += `<rect width="800" height="400" fill="#4a5a7a" opacity=".25" style="mix-blend-mode:color"/>`;
    s += K.vignette(.9) + K.grain(.2);
    return K.done(s);
  };

  S.door_tilly = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#1a1422"/>`;
    for (let x = 0; x < 800; x += 40) s += `<rect x="${x}" width="14" height="400" fill="#1e1828"/>`;
    s += `<rect x="290" y="30" width="220" height="370" fill="#efe6d4"/><rect x="304" y="44" width="192" height="356" fill="#e3d7c0"/>`;
    s += `<rect x="324" y="64" width="152" height="120" fill="none" stroke="#c9bba0" stroke-width="4"/><rect x="324" y="210" width="152" height="150" fill="none" stroke="#c9bba0" stroke-width="4"/>`;
    s += `<rect x="350" y="90" width="100" height="40" rx="6" fill="#e98aa8"/><text x="400" y="116" font-family="Georgia,serif" font-weight="700" font-size="16" fill="#fff" text-anchor="middle">TILLY</text>`;
    s += `<circle cx="470" cy="230" r="7" fill="#c9a24a"/>`;
    s += `<g stroke="#5a3a2a" stroke-width="2" opacity=".6">${Array.from({ length: 12 }, (_, i) => `<line x1="${330 + i * 12}" y1="${300 + (i % 3) * 8}" x2="${334 + i * 12}" y2="${360 - (i % 2) * 10}"/>`).join('')}</g>`;
    s += `<rect x="300" y="392" width="200" height="8" fill="#ffd27a" opacity=".4"/>`;
    s += `<g transform="translate(470,388) rotate(-8)"><rect x="-60" y="-12" width="120" height="80" fill="#fbfaf4"/><circle cx="0" cy="10" r="14" fill="none" stroke="#e98aa8" stroke-width="3"/><path d="M0,24 V48 M-16,32 H16 M0,48 l-10,14 M0,48 l10,14" stroke="#3a6ab0" stroke-width="3"/></g>`;
    s += K.vignette(.85) + K.grain(.2);
    return K.done(s);
  };

  S.tilly_guest = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#0a0e0c"/>`;
    for (let x = 0; x < 800; x += 40) s += `<rect x="${x}" width="14" height="400" fill="#0e1410"/>`;
    s += `<rect width="800" height="400" fill="${K.rad('g', [[0, '#8fd16a', .2], [1, '#000', 0]], .5, .45, .55)}"/>`;
    s += at(400, 170, .95, tilly({ guest: true }));
    s += `<path d="M300,400 Q340,360 320,300" stroke="#2a3020" stroke-width="2" fill="none"/>`;
    s += K.vignette(.92) + K.grain(.22);
    return K.done(s);
  };

  S.storm = () => {
    const K = kit(); let s = sky(K, 'storm') + hills(K, 'storm', 260, 4);
    s += ruin(680, 180, .4, { glow: '#ff6a4a' });
    s += farmhouse(360, 330, 1.2, { wall: '#4a4a52', roof: '#15161c', win: '#0b0d12', lit: [0, 0, 1, 0, 0], litc: '#9fe07a' });
    s += `<rect x="0" y="330" width="800" height="70" fill="#0c0e12"/>` + rain(K, .45);
    s += K.vignette(.85) + K.grain(.2);
    return K.done(s);
  };

  S.lane = () => {
    const K = kit(); let s = sky(K, 'storm', { flash: false }) + hills(K, 'storm', 230, 2);
    s += farmhouse(140, 236, .45, { wall: '#3a3a42', roof: '#15161c', lit: [1, 1, 1, 1, 1], litc: '#ffe08a' });
    s += `<polygon points="360,400 440,400 420,250 400,250" fill="#2a261f"/><polygon points="0,400 360,400 400,250 0,280" fill="#0b1009"/><polygon points="800,400 440,400 420,250 800,270" fill="#0b1009"/>`;
    s += tree(330, 260, 160, '#05080a', '#05080a') + tree(500, 260, 170, '#05080a', '#05080a');
    s += grey(412, 262, 70, { c: '#6a6e78', eyes: '#000' });
    s += rain(K, .5) + K.vignette(.9) + K.grain(.2);
    return K.done(s);
  };

  S.landing = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#0b0d14"/>`;
    s += `<polygon points="0,0 800,0 600,90 200,90" fill="#11141c"/><polygon points="0,0 200,90 200,330 0,400" fill="#0e1119"/><polygon points="800,0 600,90 600,330 800,400" fill="#0e1119"/><polygon points="200,330 600,330 800,400 0,400" fill="#141110"/>`;
    s += `<rect x="340" y="110" width="120" height="220" fill="#030304"/><rect x="330" y="100" width="140" height="10" fill="#1e2130"/>`;
    for (let i = 0; i < 3; i++) s += `<polygon points="${40 + i * 50},${90 + i * 18} ${80 + i * 50},${100 + i * 16} ${80 + i * 50},${150 + i * 14} ${40 + i * 50},${150 + i * 20}" fill="#3a3024"/>`;
    for (let i = 0; i < 3; i++) s += `<polygon points="${720 - i * 50},${100 + i * 16} ${760 - i * 50},${90 + i * 18} ${760 - i * 50},${150 + i * 20} ${720 - i * 50},${150 + i * 14}" fill="#3a3024"/>`;
    const fp = []; for (let i = 0; i < 9; i++) { const t = i / 8; fp.push([700 - t * 300, 380 - t * 340]); }
    s += `<g fill="#6a8aa8" opacity=".45">${fp.map(([x, y], i) => `<ellipse cx="${f(x + (i % 2 ? 10 : -10))}" cy="${f(y)}" rx="${f(6 - i * .3)}" ry="${f(10 - i * .5)}"/>`).join('')}</g>`;
    s += `<polygon points="380,400 420,400 520,240 480,240" fill="#e9e4c8" opacity=".06"/>`;
    s += K.vignette(.92) + K.grain(.22);
    return K.done(s);
  };

  function spiderGirl(x, y, s, o = {}) {
    const skin = o.skin || '#b9b8b0', hair = '#3a1a0e', dress = '#9aa4b2';
    let g = `<g transform="translate(${f(x)},${f(y)}) scale(${s})">`;
    g += `<path d="M-30,-10 L-80,-40 L-110,10 M30,-10 L80,-40 L110,10 M-20,40 L-70,60 L-90,110 M20,40 L70,60 L90,110" stroke="${skin}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    g += `<ellipse cx="0" cy="14" rx="34" ry="46" fill="${dress}"/>`;
    g += `<ellipse cx="0" cy="-48" rx="26" ry="30" fill="${skin}"/>`;
    g += `<path d="M-26,-40 Q-30,-10 -20,60 M-14,-30 Q-14,20 -8,80 M0,-26 Q2,30 2,90 M14,-30 Q16,20 10,80 M26,-40 Q30,-10 20,64" stroke="${hair}" stroke-width="7" fill="none"/>`;
    g += `<path d="M-17,-55 Q-10,-48 -3,-55 M3,-55 Q10,-48 17,-55" stroke="#1a0a0a" stroke-width="2" fill="none"/>`;
    g += humMouth(0, -34, 8, '#200202');
    return g + '</g>';
  }
  S.ceiling = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#120404"/>`;
    s += `<polygon points="0,0 800,0 640,210 160,210" fill="#1e0a0a"/><polygon points="0,0 160,210 160,400 0,400" fill="#170606"/><polygon points="800,0 640,210 640,400 800,400" fill="#170606"/>`;
    s += `<rect x="390" y="0" width="6" height="40" fill="#0a0202"/><path d="M372,40 L414,40 L404,58 L382,58Z" fill="#2a1010"/>`;
    s += spiderGirl(420, 110, 1.05);
    s += `<rect width="800" height="400" fill="${K.rad('g', [[0, '#ff4a3a', .18], [1, '#000', 0]], .5, .3, .6)}"/>`;
    s += K.vignette(.92) + K.grain(.22);
    return K.done(s);
  };

  S.tillyroom = () => {
    const K = kit(); let s = room(K, '#3a1c22', '#1a0e0c', { floorY: 320 });
    const r = rng(21); for (let i = 0; i < 22; i++) { const x = r() * 760, y = 20 + r() * 260; s += `<text x="${f(x)}" y="${f(y)}" font-family="'Comic Sans MS',cursive" font-size="${f(14 + r() * 18)}" fill="#e2635a" opacity="${f(.4 + r() * .4)}" transform="rotate(${f(r() * 30 - 15)} ${f(x)} ${f(y)})">HUSH</text>`; }
    s += `<rect x="440" y="240" width="300" height="80" fill="#5a3a3a"/><rect x="440" y="200" width="20" height="130" fill="#3a2020"/><ellipse cx="560" cy="236" rx="60" ry="16" fill="#d8c8c8"/>`;
    s += bell(560, 228, .8, { glow: '#ff9a4a' });
    s += `<g transform="translate(150,330)"><ellipse cx="0" cy="-30" rx="40" ry="36" fill="#9aa4b2"/><ellipse cx="0" cy="-80" rx="24" ry="27" fill="#a8a69e"/><path d="M-24,-80 Q-28,-112 0,-112 Q28,-112 24,-80 L30,-30 L-30,-30Z" fill="#3a1a0e"/><ellipse cx="-8" cy="-80" rx="5" ry="4" fill="#f4f4ee"/><ellipse cx="8" cy="-80" rx="5" ry="4" fill="#f4f4ee"/></g>`;
    s += `<rect width="800" height="400" fill="${K.rad('g', [[0, '#ff6a3a', .25], [1, '#000', 0]], .7, .55, .5)}"/>`;
    s += K.vignette(.9) + K.grain(.22);
    return K.done(s);
  };

  S.bell_close = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#030805"/>`;
    s += `<rect width="800" height="400" fill="${K.rad('g', [[0, '#8fd16a', .3], [1, '#000', 0]], .5, .5, .5)}"/>`;
    s += bell(400, 300, 4.2, { glow: '#9fe07a' });
    s += `<text x="400" y="330" font-family="Georgia,serif" font-size="30" fill="#2a1a06" text-anchor="middle" letter-spacing="10" transform="scale(-1,1) translate(-800,0)">VASSHAEL</text>`;
    s += K.fog('#8fd16a', .25, 800, 400, 4) + K.vignette(.9) + K.grain(.2);
    return K.done(s);
  };

  S.hill = () => {
    const K = kit(); let s = sky(K, 'storm');
    s += `<path d="M0,400 L0,330 Q300,300 500,140 Q560,110 620,140 Q700,200 800,240 L800,400Z" fill="#0b0f16"/>`;
    s += ruin(560, 150, .55, { glow: '#ff6a4a' });
    s += `<path d="M60,400 Q200,320 380,250 Q460,210 520,160" stroke="#2a2a26" stroke-width="10" fill="none"/>`;
    s += sheep(240, 330, .7, { w: '#8a8a90', face: 'front', eyes: '#e8e0a0' }) + sheep(280, 316, .6, { w: '#8a8a90', face: 'front', eyes: '#e8e0a0' }) + sheep(200, 345, .75, { w: '#8a8a90', face: 'front', eyes: '#e8e0a0' });
    s += `<g transform="translate(120,388)"><path d="M-30,0 L-20,-14 L-6,-6 L4,-20 L18,-4 L30,0" stroke="#bfc3b8" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-10" rx="16" ry="8" fill="#bfc3b8"/><path d="M-8,-18 Q0,-34 8,-18" fill="#3a1a0e"/><circle cx="-3" cy="-14" r="1.6" fill="#fff"/><circle cx="3" cy="-14" r="1.6" fill="#fff"/></g>`;
    s += rain(K, .5) + K.vignette(.88) + K.grain(.2);
    return K.done(s);
  };

  S.chapel_night = () => {
    const K = kit(); let s = sky(K, 'blood') + `<rect x="0" y="300" width="800" height="100" fill="#0e0303"/>`;
    s += ruin(400, 320, 1.5, { c: '#1e1414', glow: '#2a0606' });
    s += `<ellipse cx="400" cy="350" rx="170" ry="30" fill="none" stroke="#ff3a2a" stroke-width="4" opacity=".85"/><ellipse cx="400" cy="350" rx="170" ry="30" fill="none" stroke="#ff3a2a" stroke-width="14" opacity=".15"/>`;
    s += `<rect x="600" y="300" width="56" height="46" fill="#3a3030"/><ellipse cx="628" cy="300" rx="32" ry="8" fill="#3a5a6a"/>`;
    s += `<path d="M320,330 Q300,200 360,100 Q400,60 440,100 Q500,200 470,330Z" fill="#000" opacity=".55"/><path d="M362,104 q-26,-34 -10,-60 M438,104 q26,-34 10,-60" stroke="#000" stroke-width="10" fill="none" opacity=".55"/>`;
    s += girl(400, 340, .62, { hum: true, dress: '#8a929e', skin: '#b0aea6', hair: '#3a1a0e' });
    s += rain(K, .3) + K.vignette(.9) + K.grain(.22);
    return K.done(s);
  };

  function demonBody(cx, cy, s) {
    let g = `<g transform="translate(${f(cx)},${f(cy)}) scale(${s})">`;
    g += `<path d="M-170,300 L-150,60 Q-120,0 -60,-6 L60,-6 Q120,0 150,60 L170,300Z" fill="#4a4e56"/><path d="M-30,-4 L0,90 L30,-4Z" fill="#d8d2c4"/><path d="M-14,10 L0,90 L14,10Z" fill="#7a1a1a"/>`;
    g += `<path d="M-150,60 L-230,240 L-210,250 L-130,120 M150,60 L230,240 L210,250 L130,120" stroke="#4a4e56" stroke-width="40" fill="none" stroke-linejoin="round"/>`;
    g += `<path d="M-226,244 l-30,60 M-220,248 l-14,66 M-212,250 l4,64 M226,244 l30,60 M220,248 l14,66 M212,250 l-4,64" stroke="#b9b3a8" stroke-width="8" stroke-linecap="round"/>`;
    g += `<ellipse cx="0" cy="-96" rx="86" ry="100" fill="#b6b0a4"/>`;
    g += `<path d="M-60,-170 C-150,-210 -190,-120 -140,-90 C-110,-70 -96,-120 -120,-130 C-140,-140 -120,-176 -70,-150Z" fill="#2a2420"/><path d="M60,-170 C150,-210 190,-120 140,-90 C110,-70 96,-120 120,-130 C140,-140 120,-176 70,-150Z" fill="#2a2420"/>`;
    [[-40, -130, 11], [40, -130, 11], [0, -150, 9], [-62, -100, 7], [62, -100, 7], [-20, -112, 6], [20, -112, 6], [0, -122, 5]].forEach(([x, y, r]) => g += `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffd23a"/><circle cx="${x}" cy="${y}" r="${r * .45}" fill="#000"/>`);
    g += `<path d="M-46,-84 Q-46,-118 0,-120 Q46,-118 46,-84 L54,-10 Q60,4 70,6 L-70,6 Q-60,4 -54,-10Z" fill="#6a5a3a" stroke="#2a2010" stroke-width="3"/>`;
    g += `<path d="M-30,-104 Q-34,-60 -40,-6 M30,-104 Q34,-60 40,-6" stroke="#8a7a52" stroke-width="3" fill="none" opacity=".7"/><path d="M-10,-116 l-8,30 l12,18 l-10,30" stroke="#1a1208" stroke-width="3" fill="none"/>`;
    g += `<ellipse cx="0" cy="6" rx="70" ry="10" fill="#0a0202"/><path d="M0,-6 L0,30" stroke="#2a2010" stroke-width="5"/><circle cx="0" cy="36" r="12" fill="#7a1a1a"/>`;
    g += `<path d="M-96,20 q-16,14 -6,32 M96,20 q16,14 6,32 M-120,0 q-24,26 -8,60 M120,0 q24,26 8,60" stroke="#ffd23a" stroke-width="3" fill="none" opacity=".45"/>`;
    return g + '</g>';
  }
  S.demon = () => {
    const K = kit(); let s = sky(K, 'blood') + `<rect x="0" y="320" width="800" height="80" fill="#0e0303"/>`;
    s += ruin(400, 340, 1.6, { c: '#1a1010', glow: '#120303' });
    s += demonBody(400, 200, .62);
    s += `<rect width="800" height="400" fill="${K.rad('g', [[0, '#ff3a2a', .2], [1, '#000', 0]], .5, .4, .6)}"/>`;
    s += rain(K, .25) + K.vignette(.9) + K.grain(.22);
    return K.done(s);
  };

  S.dawn_farm = () => {
    const K = kit(); let s = sky(K, 'dawn') + hills(K, 'dawn', 270, 4);
    s += farmhouse(170, 268, .45) + barn(270, 268, .4);
    s += `<path d="M0,400 L0,330 Q300,310 520,300 Q640,296 800,320 L800,400Z" fill="#7aa864"/>`;
    s += ruin(560, 330, .9, { c: '#5a5450' });
    s += `<rect x="690" y="300" width="50" height="40" fill="#8a847a"/><ellipse cx="715" cy="300" rx="28" ry="7" fill="#8ab6d6"/>`;
    s += girl(470, 380, .55, { eyes: '#3a2a1a', dress: '#e6ecf2' }) + collie(530, 382, 1.1);
    s += tint('dawn') + K.vignette(.4) + K.grain(.1);
    return K.done(s);
  };

  S.buried_bell = () => {
    const K = kit(); let s = sky(K, 'golden') + hills(K, 'golden', 230, 6);
    s += ruin(400, 300, 1.1, { c: '#6a5a4a' });
    s += `<rect x="0" y="300" width="800" height="100" fill="#5a4a32"/>`;
    s += `<path d="M300,330 Q400,300 500,330 L520,400 L280,400Z" fill="#3a2a1a"/>`;
    s += bell(400, 380, 1.3, { c: '#8a6a2a' });
    s += `<path d="M370,380 Q400,360 430,380" stroke="#efe6cc" stroke-width="6" fill="none"/>`;
    s += `<g transform="translate(580,370)"><rect x="-4" y="-120" width="8" height="120" fill="#6a4a2a"/><path d="M-20,0 L20,0 L14,24 L-14,24Z" fill="#888"/></g>`;
    s += K.vignette(.55) + K.grain(.12);
    return K.done(s);
  };

  S.lane_dawn = () => {
    const K = kit(); let s = sky(K, 'dusk') + hills(K, 'dusk', 230, 2);
    s += church(560, 260, .6);
    s += `<polygon points="360,400 440,400 420,250 400,250" fill="#2a2430"/>`;
    for (let i = 0; i < 6; i++) { const x = 300 + i * 34, y = 300 + (i % 2) * 10; s += `<circle cx="${x}" cy="${y - 50}" r="10" fill="#ffb060" opacity=".35"/><rect x="${x - 2}" y="${y - 46}" width="4" height="20" fill="#ffd27a"/><path d="M${x - 8},${y} L${x - 6},${y - 30} L${x + 6},${y - 30} L${x + 8},${y}Z" fill="#141018"/><circle cx="${x}" cy="${y - 36}" r="6" fill="#141018"/>`; }
    s += tint('dusk') + K.vignette(.75) + K.grain(.16);
    return K.done(s);
  };

  S.guest_you = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#070910"/>`;
    s += `<rect x="250" y="20" width="300" height="360" rx="150" fill="#2a2f3a"/><rect x="264" y="34" width="272" height="332" rx="136" fill="${K.lin('m', [[0, '#26334a'], [1, '#0d1320']])}"/>`;
    s += at(400, 200, .7, person({ skin: '#cfc6b8', hair: '#3a2a1e', short: true, cloth: '#2f4a6f', hollow: true, shut: true, smile: 'hum' }));
    s += `<path d="M300,80 L330,140 L310,200 M500,90 L470,150" stroke="#d8e0ec" stroke-width="1.4" fill="none" opacity=".5"/>`;
    s += K.vignette(.9) + K.grain(.2);
    return K.done(s);
  };

  S.rung = () => {
    const K = kit(); let s = room(K, '#2a1418', '#140a08', { floorY: 320 });
    s += `<rect x="300" y="250" width="200" height="70" fill="#3a2020"/>`;
    s += bell(400, 246, 1.4, { glow: '#ffcf7a' });
    s += `<g transform="translate(470,260) rotate(-10)"><rect x="-40" y="-26" width="80" height="54" fill="#f6f1e2"/><path d="M-30,-12 q20,-6 40,0 M-30,0 q30,-6 54,2 M-30,12 q16,-4 30,0" stroke="#2a2a6a" stroke-width="1.6" fill="none"/></g>`;
    s += `<rect width="800" height="400" fill="${K.rad('g', [[0, '#ffcf7a', .18], [1, '#000', 0]], .5, .6, .45)}"/>`;
    s += K.vignette(.9) + K.grain(.2);
    return K.done(s);
  };

  /* ================= JUMP SCARES (600x600) ================= */

  SC.grey = () => {
    const K = kit();
    let s = `<rect width="600" height="600" fill="${K.rad('bg', [[0, '#3a4048'], [1, '#000']], .5, .5, .65)}"/>`;
    s += `<path d="M60,600 L90,470 Q300,420 510,470 L540,600Z" fill="#5d6168"/><path d="M260,450 L300,560 L340,450Z" fill="#d8d2c4"/>`;
    s += `<path d="M120,330 C120,140 200,90 300,90 C400,90 480,140 480,330 C480,440 400,500 300,500 C200,500 120,440 120,330Z" fill="${K.rad('sk', [[0, '#d8d2c6'], [1, '#8a8478']], .5, .4, .6)}"/>`;
    s += `<path d="M70,150 L530,150 L540,176 L60,176Z M150,152 Q150,10 300,10 Q450,10 450,152Z" fill="#4a4e56"/><rect x="150" y="128" width="300" height="20" fill="#2a2d33"/>`;
    s += `<ellipse cx="300" cy="320" rx="138" ry="168" fill="#3a3630"/><ellipse cx="300" cy="316" rx="112" ry="140" fill="#24201c"/><ellipse cx="300" cy="310" rx="84" ry="108" fill="#130f0c"/><ellipse cx="300" cy="304" rx="54" ry="72" fill="#050302"/>`;
    s += `<path d="M300,180 Q310,300 336,392" stroke="#4a3e2a" stroke-width="10" fill="none"/><circle cx="338" cy="404" r="26" fill="#6a5a3a"/><circle cx="330" cy="396" r="8" fill="#9a8a5a" opacity=".6"/>`;
    s += `<path d="M110,240 q-40,90 0,180 M490,240 q40,90 0,180 M70,210 q-60,120 0,240 M530,210 q60,120 0,240" stroke="#e0b25a" stroke-width="5" fill="none" opacity=".45"/>`;
    s += K.vignette(.85, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };

  SC.tilly = () => {
    const K = kit();
    let s = `<rect width="600" height="600" fill="#030503"/>`;
    s += `<path d="M90,600 L80,200 Q90,40 300,30 Q510,40 520,200 L510,600Z" fill="#4a2010"/>`;
    s += `<ellipse cx="300" cy="320" rx="190" ry="240" fill="${K.rad('sk', [[0, '#c8c6bc'], [1, '#6a6e66']], .5, .4, .6)}"/>`;
    s += `<g stroke="#1e1430" stroke-width="4" fill="none" opacity=".8"><path d="M170,260 l-20,40 l-4,50 M430,260 l20,40 l4,50 M300,110 l-10,40 l16,30 M220,420 l-16,40 M380,420 l16,40"/></g>`;
    [[220, 270], [380, 270]].forEach(([x, y]) => s += `<path d="M${x - 58},${y} Q${x},${y - 46} ${x + 58},${y} Q${x},${y + 42} ${x - 58},${y}Z" fill="#e8e4d6"/><path d="M${x - 26},${y - 20} Q${x},${y - 6} ${x + 26},${y - 20} Q${x},${y - 30} ${x - 26},${y - 20}Z" fill="#5d7c4a"/><path d="M${x - 40},${y + 8} q40,16 80,0" stroke="#b9a8a0" stroke-width="2" fill="none"/>`);
    s += `<path d="M150,120 Q300,70 450,120 Q440,160 420,170 Q300,120 180,170 Q160,160 150,120Z" fill="#4a2010"/>`;
    s += `<ellipse cx="300" cy="450" rx="62" ry="92" fill="#160202"/><path d="M200,430 q-30,20 -20,60 M400,430 q30,20 20,60 M170,410 q-46,36 -30,100 M430,410 q46,36 30,100" stroke="#e0b25a" stroke-width="4" fill="none" opacity=".5"/>`;
    s += `<g fill="#b8693e" opacity=".3">${[[170, 330], [190, 345], [410, 330], [430, 345]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5"/>`).join('')}</g>`;
    s += K.vignette(.85, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };

  SC.ceiling = () => {
    const K = kit();
    let s = `<rect width="600" height="600" fill="#120202"/>`;
    let face = `<ellipse cx="300" cy="300" rx="170" ry="210" fill="${K.rad('sk', [[0, '#c4c2b8'], [1, '#6a6a62']], .5, .4, .6)}"/>`;
    [[230, 250], [370, 250]].forEach(([x, y]) => face += `<path d="M${x - 50},${y} Q${x},${y - 40} ${x + 50},${y} Q${x},${y + 36} ${x - 50},${y}Z" fill="#e8e4d6"/><path d="M${x - 22},${y - 18} Q${x},${y - 6} ${x + 22},${y - 18} Q${x},${y - 26} ${x - 22},${y - 18}Z" fill="#3a2a1e"/>`);
    face += humMouth(300, 400, 64, '#1a0202');
    s += `<g transform="rotate(180 300 300)">${face}</g>`;
    for (let i = 0; i < 18; i++) { const x = 140 + i * 18; s += `<path d="M${x},${440 + Math.sin(i) * 10} Q${x + (i % 2 ? 14 : -14)},520 ${x + (i % 3) * 6 - 6},600" stroke="#3a1a0e" stroke-width="10" fill="none"/>`; }
    s += `<rect width="600" height="600" fill="#ff3a2a" opacity=".1" style="mix-blend-mode:screen"/>`;
    s += K.vignette(.85, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };

  SC.demon = () => {
    const K = kit();
    let s = `<rect width="600" height="600" fill="${K.rad('bg', [[0, '#5a0606'], [1, '#000']], .5, .5, .65)}"/>`;
    s += demonBody(300, 330, 2.05);
    s += `<rect width="600" height="600" fill="#ff2a1a" opacity=".12" style="mix-blend-mode:screen"/>`;
    s += K.vignette(.8, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };

  SC.reflection = () => {
    const K = kit();
    let s = `<rect width="600" height="600" fill="#04060a"/>`;
    s += `<rect x="30" y="30" width="540" height="540" fill="#0c1220" stroke="#efe9dc" stroke-width="16"/><path d="M300,30 V570 M30,300 H570" stroke="#efe9dc" stroke-width="12"/>`;
    s += `<g opacity=".92"><ellipse cx="300" cy="300" rx="170" ry="210" fill="#1a1f2a"/>`;
    [[230, 250], [370, 250]].forEach(([x, y]) => s += `<circle cx="${x}" cy="${y}" r="22" fill="#d8e4ff"/><circle cx="${x}" cy="${y}" r="7" fill="#000"/>`);
    s += humMouth(300, 400, 70, '#000') + `<g fill="none" stroke="#d8e4ff" stroke-width="3" opacity=".5"><ellipse cx="300" cy="400" rx="90" ry="104"/><ellipse cx="300" cy="400" rx="122" ry="138" opacity=".6"/><ellipse cx="300" cy="400" rx="156" ry="172" opacity=".3"/></g></g>`;
    s += `<path d="M120,80 L260,280 L230,330 L340,420 L320,500 M260,280 L400,240 L520,140 M340,420 L470,470" stroke="#e8f0ff" stroke-width="3" fill="none" opacity=".85"/>`;
    s += K.vignette(.8, 600, 600) + K.grain(.25, 600, 600);
    return K.done(s, SVB);
  };
})();
