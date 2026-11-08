/* NIGHTDOOR art for "Signal from Ward 9": Thornleigh General, shut since 1974. A long Nightingale ward of
   sheeted, breathing beds; green tiles, lino, sick green light; and the Night Sister: far too tall, navy dress and
   cape, starched white cap, grey skin, a square of yellowed gauze taped over her mouth that sucks into a hollow,
   lidless eyes with green eyeshine, an upside-down fob watch, long wet grey hands, an old chrome torch.
   Adds scenes to ART (800x400) and jump scares (600x600) using the shared toolkit. */
(function () {
  'use strict';
  const { kit, f, mix, shade, rng, S, SC, SVB } = ART.lib;
  let N = 0;
  const id = p => p + (++N);

  const SK = '#a9aea6', SKD = '#7d837c', NAVY = '#16213a', NAVY2 = '#0e1628', CAPE_IN = '#7a1620', GAUZE = '#d9cf9e', TAPE = '#c9a83a';
  const GREEN = '#7affb0', TILE = '#3f5e50', TILE2 = '#4d6f5f', CREAM = '#c9c2a4', LINO = '#3a3a2e';

  /* ---------- perspective ---------- */
  const VP = [400, 165], FL = 300;
  const P3 = (X, Y, Z) => [VP[0] + X * FL / Z, VP[1] + Y * FL / Z];
  const poly = (pts, fill, extra = '') => `<polygon points="${pts.map(p => f(p[0]) + ',' + f(p[1])).join(' ')}" fill="${fill}" ${extra}/>`;

  /* ---------- people ---------- */
  function eye(x, y, r, shine = true) {
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#e8efe2"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r * .55)}" fill="${shine ? '#9affc8' : '#2a3a30'}" opacity="${shine ? .9 : 1}"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r * .22)}" fill="#050806"/>` + (shine ? `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 1.6)}" fill="${GREEN}" opacity=".18"/>` : '');
  }
  let TIP = [0, 0];
  /* the Night Sister. b = feet line, h = height in px. Sets TIP to the torch lens in scene coords. */
  function sister(x, b, h, o = {}) {
    const k = h / 300;
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${f(o.flip ? -k : k)},${f(k)})"${o.op ? ` opacity="${o.op}"` : ''}>`;
    // shoes + legs
    g += `<path d="M-14,0 L-12,-60 M12,0 L10,-60" stroke="#1a1c22" stroke-width="7"/><ellipse cx="-16" cy="-2" rx="11" ry="4" fill="#050505"/><ellipse cx="16" cy="-2" rx="11" ry="4" fill="#050505"/>`;
    // dress + cape
    g += `<path d="M-26,-60 L-20,-210 Q0,-220 20,-210 L26,-60Z" fill="${NAVY}"/>`;
    if (!o.back) g += `<rect x="-20" y="-150" width="40" height="7" fill="#20283a"/><rect x="-7" y="-152" width="14" height="11" rx="2" fill="#c8c8c8"/>`;
    g += o.back
      ? `<path d="M-34,-60 Q-40,-150 -26,-212 Q0,-226 26,-212 Q40,-150 34,-60 Q0,-52 -34,-60Z" fill="${NAVY2}"/>`
      : `<path d="M-22,-212 Q-46,-150 -40,-64 L-30,-62 Q-34,-150 -16,-206Z" fill="${NAVY2}"/><path d="M22,-212 Q46,-150 40,-64 L30,-62 Q34,-150 16,-206Z" fill="${NAVY2}"/><path d="M-30,-64 Q-33,-140 -18,-200" stroke="${CAPE_IN}" stroke-width="3" fill="none"/><path d="M30,-64 Q33,-140 18,-200" stroke="${CAPE_IN}" stroke-width="3" fill="none"/>`;
    // collar + fob watch (upside down)
    if (!o.back) g += `<path d="M-12,-214 L0,-200 L12,-214" stroke="#e8e6dc" stroke-width="4" fill="none"/><circle cx="12" cy="-178" r="7" fill="#d8d0b0" stroke="#8a7a40" stroke-width="2"/><path d="M12,-185 L12,-192" stroke="#8a7a40" stroke-width="2"/><path d="M12,-178 L12,-173 M12,-178 L9,-176" stroke="#222" stroke-width="1.2"/>`;
    // arms: long, down to the knees
    const arm = (side, ang, len) => {
      const sx = side * 20, sy = -206, ex = sx + Math.sin(ang * Math.PI / 180) * len, ey = sy + Math.cos(ang * Math.PI / 180) * len;
      let a = `<path d="M${sx},${sy} L${f(ex)},${f(ey)}" stroke="${NAVY}" stroke-width="11" stroke-linecap="round"/>`;
      const fx = ex + Math.sin(ang * Math.PI / 180) * 14, fy = ey + Math.cos(ang * Math.PI / 180) * 14;
      a += `<path d="M${f(ex)},${f(ey)} L${f(fx)},${f(fy)}" stroke="${SK}" stroke-width="7" stroke-linecap="round"/>`;
      for (let i = -2; i <= 2; i++) { const aa = (ang + i * 9) * Math.PI / 180; a += `<path d="M${f(fx)},${f(fy)} l${f(Math.sin(aa) * 26)},${f(Math.cos(aa) * 26)}" stroke="${SK}" stroke-width="2.6" stroke-linecap="round"/>`; }
      return { a, fx, fy };
    };
    const L = arm(-1, o.armL == null ? 8 : o.armL, o.lenL || 140), R = arm(1, o.armR == null ? -8 : o.armR, o.lenR || 140);
    g += L.a + R.a;
    // torch in right hand
    if (o.torch) {
      const ta = (o.torchAng == null ? 90 : o.torchAng) * Math.PI / 180, tx = R.fx, ty = R.fy;
      TIP = [x + (tx + Math.cos(ta) * 32) * k * (o.flip ? -1 : 1), b + (ty + Math.sin(ta) * 32) * k];
      g += `<g transform="translate(${f(tx)},${f(ty)}) rotate(${f(o.torchAng == null ? 90 : o.torchAng)})"><rect x="-4" y="-5" width="30" height="10" rx="2" fill="#b8bcc0"/><rect x="24" y="-8" width="8" height="16" rx="2" fill="#d8dce0"/><ellipse cx="32" cy="0" rx="2" ry="7" fill="#fffbe0"/></g>`;
      void ta;
    }
    // neck + head (long, gaunt, tilted), starched cap, gauze, lidless shining eyes
    g += `<rect x="-5" y="-238" width="10" height="30" fill="${SKD}"/>`;
    g += `<g transform="rotate(${o.tilt || 0} 0 -236)">`;
    const cap = `<path d="M-19,-272 C-16,-300 16,-300 19,-272 C10,-280 -10,-280 -19,-272Z" fill="#f2efe4"/><path d="M-21,-270 Q0,-282 21,-270 L20,-264 Q0,-274 -20,-264Z" fill="#e2ddcc"/>` + Array.from({ length: 7 }, (_, i) => `<line x1="${-17 + i * 5.6}" y1="${-275 + Math.abs(i - 3) * .9}" x2="${-17 + i * 5.6}" y2="${-268 + Math.abs(i - 3) * .9}" stroke="#b8b09a" stroke-width=".8"/>`).join('');
    if (o.back) {
      g += `<ellipse cx="0" cy="-258" rx="16" ry="25" fill="#3a3a34"/>` + cap;
    } else {
      g += `<ellipse cx="0" cy="-256" rx="16" ry="27" fill="${SK}"/><ellipse cx="0" cy="-256" rx="16" ry="27" fill="#000" opacity=".12"/>`;
      g += `<path d="M-16,-262 Q-16,-282 0,-283 Q16,-282 16,-262 Q8,-272 0,-271 Q-8,-272 -16,-262Z" fill="#4a4a42"/>` + cap;
      g += `<ellipse cx="-6.5" cy="-257" rx="6" ry="5" fill="#1a1c16"/><ellipse cx="6.5" cy="-257" rx="6" ry="5" fill="#1a1c16"/>`;
      [-6.5, 6.5].forEach(ex => { g += `<circle cx="${ex}" cy="-257" r="3.4" fill="#d8d4bc"/><circle cx="${ex}" cy="-257" r="1.1" fill="#000"/>`; if (o.shine !== false) g += `<circle cx="${ex}" cy="-257" r="3" fill="${GREEN}" opacity=".7"/><circle cx="${ex}" cy="-257" r="7" fill="${GREEN}" opacity=".22"/>`; });
      g += `<path d="M-12,-248 Q0,-250 12,-248 L13,-230 Q0,-228 -13,-230Z" fill="${GAUZE}"/><path d="M-12,-248 l4,-2 M12,-248 l-4,-2 M-13,-230 l4,2 M13,-230 l-4,2" stroke="${TAPE}" stroke-width="2.6"/>`;
      g += `<ellipse cx="0" cy="-239" rx="${o.suck ? 5 : 2.5}" ry="${o.suck ? 7 : 2.5}" fill="#1a140a" opacity="${o.suck ? .9 : .4}"/>`;
    }
    g += `</g>`;
    return g + '</g>';
  }

  /* a sleeper lying on a pillow, seen side-on (for beds), or sitting up */
  function sitter(x, b, s, o = {}) {
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${f(s)})">`;
    g += `<path d="M-16,0 L-14,-46 Q0,-54 14,-46 L16,0Z" fill="#a9b8c4"/><path d="M-6,-50 L0,-40 L6,-50" stroke="#7a8a96" stroke-width="2" fill="none"/>`;
    if (o.point) g += `<path d="M14,-42 L${f(o.point * 46)},-52" stroke="#a9b8c4" stroke-width="7" stroke-linecap="round"/><path d="M${f(o.point * 46)},-52 l${f(o.point * 12)},-2" stroke="${SK}" stroke-width="3" stroke-linecap="round"/>`;
    g += `<rect x="-4" y="-58" width="8" height="10" fill="${SKD}"/><ellipse cx="0" cy="-72" rx="12" ry="15" fill="${SK}"/>`;
    g += `<path d="M-12,-78 Q-12,-90 0,-90 Q12,-90 12,-78 Q6,-84 -12,-78Z" fill="${o.hair || '#5a5650'}"/>`;
    g += `<circle cx="-4.5" cy="-74" r="3.3" fill="#eef3e8"/><circle cx="4.5" cy="-74" r="3.3" fill="#eef3e8"/><circle cx="${o.look ? -3.6 : -4.5}" cy="-74" r="1.1" fill="#111"/><circle cx="${o.look ? 5.4 : 4.5}" cy="-74" r="1.1" fill="#111"/>`;
    g += `<rect x="-8" y="-68" width="16" height="12" rx="2" fill="${GAUZE}"/><path d="M-8,-68 l3,-1 M8,-68 l-3,-1" stroke="${TAPE}" stroke-width="2"/>`;
    return g + '</g>';
  }

  /* hospital bed, side view. b = floor line */
  function bed(x, b, s, o = {}) {
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${f(o.flip ? -s : s)},${f(s)})">`;
    const fr = o.frame || '#c8ccc6';
    g += `<path d="M-90,0 L-90,-80 M-90,-80 Q-90,-92 -78,-92 L-70,-92 Q-60,-92 -60,-80 L-60,-38 M90,0 L90,-62 Q90,-70 82,-70 L74,-70 Q66,-70 66,-62 L66,-38" stroke="${fr}" stroke-width="4" fill="none"/>`;
    for (let i = 0; i < 3; i++) g += `<path d="M${-86 + i * 9},-38 V-84" stroke="${fr}" stroke-width="2"/>`;
    g += `<rect x="-94" y="-40" width="190" height="6" fill="${fr}"/><circle cx="-84" cy="-3" r="4" fill="#333"/><circle cx="84" cy="-3" r="4" fill="#333"/>`;
    if (o.empty) {
      g += `<path d="M-88,-40 L-88,-54 L88,-54 L88,-40Z" fill="#e8e6dc"/><path d="M10,-54 L88,-54 L88,-46 Q50,-40 10,-46Z" fill="#cfcabc"/><rect x="-86" y="-66" width="40" height="14" rx="6" fill="#f2f0e8"/>`;
    } else if (o.sitting) {
      g += `<path d="M-88,-40 L-88,-54 L88,-54 L88,-40Z" fill="#e8e6dc"/><path d="M-30,-54 Q40,-70 88,-56 L88,-40 L-30,-40Z" fill="#dcd8ca"/>`;
      g += sitter(-56, -54, 1, { point: o.point, hair: o.hair, look: true });
    } else {
      const lift = o.breath ? 6 : 0;
      g += `<rect x="-86" y="-66" width="40" height="14" rx="6" fill="#f2f0e8"/>`;
      g += `<path d="M-88,-40 L-88,-54 Q-60,${-70 - lift} -10,${-66 - lift} Q40,-62 70,-58 Q86,-56 88,-50 L88,-40Z" fill="${o.sheet || '#e8e6dc'}"/>`;
      if (o.face) g += `<ellipse cx="-62" cy="-66" rx="10" ry="8" fill="${SK}"/><rect x="-60" y="-70" width="10" height="8" fill="${GAUZE}"/><circle cx="-66" cy="-70" r="2.4" fill="#eef3e8"/>`;
      if (o.breath) g += `<path d="M-40,${-80 - lift} q4,-6 0,-12 M-30,${-78 - lift} q4,-6 0,-12" stroke="${GREEN}" stroke-width="1.4" fill="none" opacity=".4"/>`;
    }
    if (o.chart) g += `<rect x="72" y="-62" width="14" height="18" fill="#efe8d0" stroke="#7a6a40"/><text x="79" y="-50" font-family="Arial" font-size="7" font-weight="700" text-anchor="middle" fill="#2a2a2a">${o.chart}</text>`;
    return g + '</g>';
  }

  /* ---------- rooms ---------- */
  function sky(K, o = {}) {
    let s = `<rect width="800" height="400" fill="${K.lin(id('sk'), o.dawn ? [[0, '#3a4a6a'], [.6, '#c8a090'], [1, '#f2c890']] : [[0, '#01030a'], [1, '#0e1a2a']])}"/>`;
    if (!o.dawn) { const r = rng(o.seed || 7); for (let i = 0; i < 50; i++) s += `<circle cx="${f(r() * 800)}" cy="${f(r() * 180)}" r="${f(r() * 1.1 + .2)}" fill="#cfd8e8" opacity="${f(r() * .6 + .2)}"/>`; }
    return s;
  }
  /* the hospital block: seven floors, top one lit green */
  function hospital(K, x, b, w, o = {}) {
    const fh = 34, floors = 7, top = b - fh * floors - 20;
    let s = `<rect x="${x}" y="${top}" width="${w}" height="${b - top}" fill="${o.dawn ? '#5a5048' : '#14161a'}"/><rect x="${x - 6}" y="${top - 8}" width="${w + 12}" height="10" fill="${o.dawn ? '#4a4038' : '#0c0e12'}"/>`;
    s += `<rect x="${x + w / 2 - 50}" y="${top - 36}" width="100" height="30" fill="${o.dawn ? '#4a4038' : '#0e1014'}"/><text x="${x + w / 2}" y="${top - 16}" font-family="Georgia,serif" font-size="11" fill="${o.dawn ? '#8a7a60' : '#3a3e44'}" text-anchor="middle" letter-spacing="2">THORNLEIGH GENERAL</text>`;
    const cols = Math.floor(w / 34);
    for (let fl = 0; fl < floors; fl++) for (let c = 0; c < cols; c++) {
      const wx = x + 10 + c * (w - 20) / cols, wy = b - (fl + 1) * fh, ww = (w - 20) / cols - 10;
      const lit = fl === floors - 1 && o.lit, board = fl === 0;
      s += `<rect x="${f(wx)}" y="${wy}" width="${f(ww)}" height="20" fill="${board ? (o.dawn ? '#6a5a40' : '#2a2418') : lit ? (o.lit === 'white' ? '#f4f8ff' : GREEN) : (o.dawn ? '#3a3a40' : '#07080a')}" opacity="${lit ? .85 : 1}"/>`;
      if (lit && o.beamAt === c) s += `<rect x="${f(wx)}" y="${wy}" width="${f(ww)}" height="20" fill="#fffbe0"/>`;
      if (lit && o.figs && c % 3 === 1) s += `<rect x="${f(wx + ww / 2 - 3)}" y="${wy + 4}" width="6" height="16" fill="#0a1a10" opacity=".7"/>`;
    }
    if (o.lit) s += `<rect x="${x}" y="${b - floors * fh - 6}" width="${w}" height="30" fill="${o.lit === 'white' ? '#ffffff' : GREEN}" opacity=".12" filter="${K.blur(id('hb'), 10)}"/>`;
    if (o.fireEscape) for (let fl = 0; fl < floors; fl++) { const y = b - fl * fh - 6; s += `<path d="M${x + w},${y} L${x + w + 30},${y} M${x + w},${y - fh / 2} L${x + w + 30},${y} M${x + w + 30},${y} L${x + w + 30},${y - fh}" stroke="#3a2a1e" stroke-width="2"/>`; }
    return s;
  }
  function tiledWall(x, y, w, h, m = 'night', o = {}) {
    const dark = { night: .55, under: .35, blood: .5, lit: 0, golden: .1, dusk: .4 }[m] || 0;
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${mix(CREAM, '#000', dark)}"/>`;
    const th = h * .55;
    s += `<rect x="${x}" y="${y + h - th}" width="${w}" height="${th}" fill="${mix(TILE2, '#000', dark)}"/>`;
    for (let yy = y + h - th; yy < y + h; yy += 14) s += `<line x1="${x}" y1="${yy}" x2="${x + w}" y2="${yy}" stroke="${mix(TILE, '#000', dark + .1)}" stroke-width="1"/>`;
    for (let xx = x; xx < x + w; xx += 18) s += `<line x1="${xx}" y1="${y + h - th}" x2="${xx}" y2="${y + h}" stroke="${mix(TILE, '#000', dark + .1)}" stroke-width="1"/>`;
    s += `<rect x="${x}" y="${y + h - th - 5}" width="${w}" height="6" fill="${mix('#2a4a3a', '#000', dark)}"/>`;
    if (o.floor !== false) s += `<rect x="${x}" y="${y + h}" width="${w}" height="${400 - y - h}" fill="${mix(LINO, '#000', dark * .6)}"/>`;
    return s;
  }
  /* the Sister with her torch beam thrown to a target point (beam drawn behind her) */
  function sisB(K, x, b, h, o, tx, ty, w, op = .45) { const fig = sister(x, b, h, Object.assign({ torch: true }, o)); return beam(K, TIP[0], TIP[1], tx, ty, w, op) + fig; }
  function glow(K, x, y, r, c = GREEN, o = .35) { return `<circle cx="${x}" cy="${y}" r="${r}" fill="${K.rad(id('gl'), [[0, c, o], [1, c, 0]])}"/>`; }
  function beam(K, x1, y1, x2, y2, w, o = .45) {
    const ang = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(ang) * w, ny = Math.cos(ang) * w;
    const g = K.lin(id('bm'), [[0, '#fffbe0', o], [1, '#fffbe0', 0]], 0, 0, 1, 0);
    return `<g transform="rotate(0)"><polygon points="${f(x1)},${f(y1)} ${f(x2 + nx)},${f(y2 + ny)} ${f(x2 - nx)},${f(y2 - ny)}" fill="${g}" style="mix-blend-mode:screen"/><ellipse cx="${f(x2)}" cy="${f(y2)}" rx="${f(w * .9)}" ry="${f(w * .5)}" fill="#fffbe0" opacity="${o * .5}"/></g>`;
  }

  /* the long ward in one-point perspective: beds both sides, lit = white strip lights */
  function ward(K, m, o = {}) {
    const lit = o.lit, dk = lit ? 0 : .5;
    const wallC = lit ? '#d8d4bc' : mix(CREAM, '#000', .55), tileC = lit ? '#5a8a74' : mix(TILE2, '#000', .45);
    let s = `<rect width="800" height="400" fill="${lit ? '#c8c4ac' : '#060a08'}"/>`;
    const W = 3.2, Yf = 1.7, Yc = -2.1, Z0 = 1.6, Z1 = 30;
    // ceiling, floor, walls
    s += poly([P3(-W, Yc, Z0), P3(W, Yc, Z0), P3(W, Yc, Z1), P3(-W, Yc, Z1)], lit ? '#e4e0cc' : '#050806');
    s += poly([P3(-W, Yf, Z0), P3(W, Yf, Z0), P3(W, Yf, Z1), P3(-W, Yf, Z1)], lit ? '#8a8a70' : mix(LINO, '#000', .5));
    [-1, 1].forEach(sd => {
      s += poly([P3(sd * W, Yc, Z0), P3(sd * W, Yc, Z1), P3(sd * W, Yf, Z1), P3(sd * W, Yf, Z0)], wallC);
      s += poly([P3(sd * W, .2, Z0), P3(sd * W, .2, Z1), P3(sd * W, Yf, Z1), P3(sd * W, Yf, Z0)], tileC);
      // tall windows
      for (let z = 3; z < 26; z += 3.2) s += poly([P3(sd * W, -1.7, z), P3(sd * W, -1.7, z + 1.2), P3(sd * W, -.3, z + 1.2), P3(sd * W, -.3, z)], lit ? '#1a2230' : '#0a1410');
    });
    // end wall + doors
    s += poly([P3(-W, Yc, Z1), P3(W, Yc, Z1), P3(W, Yf, Z1), P3(-W, Yf, Z1)], lit ? '#d0ccb4' : '#0a100c');
    const d0 = P3(-.7, -.4, Z1), d1 = P3(.7, Yf, Z1);
    s += `<rect x="${f(d0[0])}" y="${f(d0[1])}" width="${f(d1[0] - d0[0])}" height="${f(d1[1] - d0[1])}" fill="${lit ? '#5a7a6a' : '#1a2a20'}"/>`;
    // floor stripe
    s += poly([P3(-.08, Yf, Z0), P3(.08, Yf, Z0), P3(.08, Yf, Z1), P3(-.08, Yf, Z1)], lit ? '#9a9a80' : '#1a1e16');
    // beds (far to near)
    const beds = [];
    for (let i = 10; i >= 0; i--) { const z = 3 + i * 2.2; beds.push([-1, z, i], [1, z, i]); }
    beds.forEach(([sd, z, i]) => {
      const x0 = sd * W, x1 = sd * (W - 2.1), top = Yf - .62, zz = z + 1;
      const sheet = o.empty ? '#e8e6dc' : (lit ? '#e8e6dc' : mix('#c8d8c8', '#000', .45));
      // legs + side
      s += poly([P3(x1, top, z), P3(x1, top, zz), P3(x1, Yf, zz), P3(x1, Yf, z)], lit ? '#8a8e88' : '#141a16');
      s += poly([P3(x0, top, z), P3(x1, top, z), P3(x1, top + .2, z), P3(x0, top + .2, z)], lit ? '#bab8a8' : '#1e2620');
      // sheet top
      s += poly([P3(x0, top, z), P3(x1, top, z), P3(x1, top, zz), P3(x0, top, zz)], sheet);
      // body lump / sitter
      const c = P3((x0 + x1) / 2 + sd * .3, top - .15, z + .5), k = FL / (z + .5) / 100;
      if (o.sitting && !(o.emptyBed && o.emptyBed(sd, i))) {
        s += sitter(c[0] + sd * 10 * k, c[1] + 6 * k, k * 1.25, { point: o.point ? -sd * .9 : 0, look: true });
      } else if (!o.empty && !(o.emptyBed && o.emptyBed(sd, i))) {
        s += `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(70 * k)}" ry="${f(18 * k)}" fill="${shade(sheet, -.06)}"/>`;
        const hp = P3(x0 + sd * -.35, top - .1, z + .5);
        s += `<ellipse cx="${f(hp[0])}" cy="${f(hp[1])}" rx="${f(18 * k)}" ry="${f(12 * k)}" fill="${lit ? '#f2f0e8' : '#3a4a40'}"/>`;
      }
      // headboard
      s += poly([P3(x0 + sd * -.02, top - .7, z), P3(x0 + sd * -.02, top - .7, zz), P3(x0 + sd * -.02, Yf, zz), P3(x0 + sd * -.02, Yf, z)], lit ? '#c8ccc6' : '#28302a', 'opacity=".7"');
      if (o.numbers) { const np = P3(x1, top - .25, z + .5); s += `<text x="${f(np[0])}" y="${f(np[1])}" font-family="Arial" font-size="${f(Math.max(5, 32 * k))}" font-weight="700" fill="${o.mark === sd * 100 + i ? '#ffd27a' : '#6a8a78'}" text-anchor="middle">${sd < 0 ? i + 1 : 24 - i}</text>`; }
    });
    // pendant lights
    for (let z = 4; z < 28; z += 4.4) { const p = P3(0, Yc + .5, z), q = P3(0, Yc, z), k = FL / z / 100; s += `<line x1="${f(q[0])}" y1="${f(q[1])}" x2="${f(p[0])}" y2="${f(p[1])}" stroke="#222" stroke-width="1"/><ellipse cx="${f(p[0])}" cy="${f(p[1])}" rx="${f(26 * k)}" ry="${f(8 * k)}" fill="${lit ? '#ffffff' : '#1a2a20'}"/>`; if (lit) s += glow(K, f(p[0]), f(p[1] + 10 * k), f(90 * k), '#ffffff', .45); }
    if (!lit) s += `<rect width="800" height="400" fill="${GREEN}" opacity=".07"/>` + glow(K, 400, 170, 200, GREEN, .18);
    void dk; void m;
    return s;
  }

  function corridor(K, m, o = {}) {
    const lit = o.lit;
    let s = `<rect width="800" height="400" fill="#050806"/>`;
    const W = 2, Yf = 1.6, Yc = -1.8, Z0 = 1.2, Z1 = 18;
    s += poly([P3(-W, Yc, Z0), P3(W, Yc, Z0), P3(W, Yc, Z1), P3(-W, Yc, Z1)], lit ? '#d8d4c0' : '#070a08');
    s += poly([P3(-W, Yf, Z0), P3(W, Yf, Z0), P3(W, Yf, Z1), P3(-W, Yf, Z1)], lit ? '#8a8a70' : '#1a1c14');
    [-1, 1].forEach(sd => {
      s += poly([P3(sd * W, Yc, Z0), P3(sd * W, Yc, Z1), P3(sd * W, Yf, Z1), P3(sd * W, Yf, Z0)], lit ? '#d0ccb4' : mix(CREAM, '#000', .7));
      s += poly([P3(sd * W, .1, Z0), P3(sd * W, .1, Z1), P3(sd * W, Yf, Z1), P3(sd * W, Yf, Z0)], lit ? '#5a8a74' : mix(TILE2, '#000', .55));
      s += poly([P3(sd * W, .05, Z0), P3(sd * W, .05, Z1), P3(sd * W, .12, Z1), P3(sd * W, .12, Z0)], '#2a3a30');
    });
    (o.doors || []).forEach(([sd, z, c, lbl, open]) => {
      const a = P3(sd * W, -.9, z), b = P3(sd * W, -.9, z + 1), c2 = P3(sd * W, Yf, z + 1), d = P3(sd * W, Yf, z);
      s += poly([a, b, c2, d], open ? '#000' : (c || '#4a5a50'));
      if (lbl) { const p = P3(sd * W, -1.02, z + .5); s += `<text x="${f(p[0])}" y="${f(p[1])}" font-family="Arial" font-size="${f(Math.max(6, 70 / z))}" font-weight="700" fill="#d8d0b0" text-anchor="middle">${lbl}</text>`; }
    });
    s += poly([P3(-W, Yc, Z1), P3(W, Yc, Z1), P3(W, Yf, Z1), P3(-W, Yf, Z1)], lit ? '#c8c4ac' : '#020403');
    for (let z = 2.5; z < 17; z += 3) { const p = P3(0, Yc, z), k = FL / z / 100; s += `<rect x="${f(p[0] - 40 * k)}" y="${f(p[1])}" width="${f(80 * k)}" height="${f(6 * k)}" fill="${lit ? '#fff' : '#1a221c'}"/>`; }
    void m;
    return s;
  }

  function finish(K, m, vig = .78, s = '') {
    if (m === 'under') s += `<rect width="800" height="400" fill="${GREEN}" opacity=".08" style="mix-blend-mode:screen"/>`;
    if (m === 'blood') s += `<rect width="800" height="400" fill="#ff2a1a" opacity=".13" style="mix-blend-mode:screen"/>`;
    return s + K.vignette(vig) + K.grain(.18);
  }

  /* ================= SCENES ================= */
  S.cover_ward9 = () => {
    const K = kit(); let s = ward(K, 'under', { numbers: false });
    s += `<rect width="800" height="400" fill="#000" opacity=".25"/>`;
    s += sisB(K, 430, 380, 330, { armR: 24, armL: -6, lenL: 165, torchAng: 112, suck: true, tilt: -13 }, 330, 420, 130, .55);
    s += `<text x="400" y="52" font-family="Georgia,serif" font-size="22" letter-spacing="6" fill="#bfffd6" text-anchor="middle" opacity=".55">WARD 9</text>`;
    return K.done(s + finish(K, 'under', .85));
  };

  S.w9_hut = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#1a1c20"/>`;
    s += `<rect x="0" y="0" width="800" height="250" fill="#2a2c28"/><rect y="250" width="800" height="150" fill="#3a3226"/>`;
    // window looking at the hospital
    s += `<rect x="420" y="30" width="330" height="190" fill="#05070c"/>`;
    s += `<g transform="translate(420,30) scale(.41,.48)">${sky(K)}${hospital(K, 260, 400, 330, { lit: true, beamAt: 3 })}<rect y="400" width="800" height="0"/></g>`;
    s += `<rect x="420" y="30" width="330" height="190" fill="none" stroke="#6a6a60" stroke-width="10"/><line x1="585" y1="30" x2="585" y2="220" stroke="#6a6a60" stroke-width="6"/>`;
    // desk
    s += `<rect x="60" y="240" width="680" height="18" fill="#6a5a44"/><rect x="80" y="258" width="20" height="142" fill="#4a3e2e"/><rect x="700" y="258" width="20" height="142" fill="#4a3e2e"/>`;
    s += `<rect x="110" y="190" width="120" height="50" fill="#2a2a2a"/><rect x="118" y="196" width="104" height="38" fill="#0e1a12"/><text x="170" y="220" font-family="monospace" font-size="10" fill="#4a8a5a" text-anchor="middle">CAM 4 · NO SIGNAL</text>`;
    s += `<rect x="260" y="226" width="70" height="14" fill="#c8b890"/><text x="295" y="236" font-family="Arial" font-size="7" fill="#3a2a1a" text-anchor="middle">LOST PROPERTY</text>`;
    s += `<g transform="translate(296,214) rotate(-8)"><rect x="-22" y="-12" width="44" height="22" rx="4" fill="#2a2a2a"/><rect x="-16" y="-7" width="28" height="11" fill="${GREEN}"/><text x="-2" y="2" font-family="monospace" font-size="6" fill="#0a2a14" text-anchor="middle">WARD 9</text></g>`;
    s += glow(K, 296, 214, 60, GREEN, .45);
    s += `<path d="M268,196 l-8,-10 M296,190 v-14 M324,196 l8,-10" stroke="${GREEN}" stroke-width="2.4"/>`;
    s += `<rect x="380" y="200" width="90" height="40" fill="#e8e0c8"/><path d="M392,212 h66 M392,220 h50 M392,228 h58" stroke="#5a5040" stroke-width="1.5"/><text x="425" y="208" font-family="Arial" font-size="6" fill="#3a2a1a" text-anchor="middle">SITE LOG</text>`;
    s += `<rect x="520" y="206" width="22" height="34" rx="4" fill="#8a2a24"/><rect x="600" y="214" width="50" height="26" fill="#111"/>`;
    s += `<rect x="40" y="30" width="200" height="110" fill="#d8cca8" opacity=".25"/><text x="140" y="70" font-family="Arial" font-size="12" fill="#c8b890" text-anchor="middle" opacity=".6">CASTLEGATE SECURITY</text><text x="140" y="90" font-family="Arial" font-size="9" fill="#c8b890" text-anchor="middle" opacity=".5">DEMOLITION MON · NO ENTRY</text>`;
    return K.done(s + finish(K, 'night', .7));
  };

  S.w9_carpark = () => {
    const K = kit(); let s = sky(K);
    s += hospital(K, 180, 330, 440, { lit: true, beamAt: 7, figs: true, fireEscape: true });
    s += `<rect y="330" width="800" height="70" fill="#101214"/>`;
    for (let i = 0; i < 6; i++) s += `<rect x="${60 + i * 130}" y="${360}" width="70" height="3" fill="#e8e0b0" opacity=".25"/>`;
    s += `<g transform="translate(90,352)"><rect x="-44" y="-26" width="88" height="22" rx="6" fill="#2a3040"/><rect x="-30" y="-40" width="56" height="18" rx="5" fill="#222836"/><circle cx="-26" cy="-2" r="8" fill="#000"/><circle cx="26" cy="-2" r="8" fill="#000"/></g>`;
    s += `<rect x="660" y="320" width="120" height="40" fill="#20221e"/><rect x="676" y="328" width="36" height="16" fill="#e0c070" opacity=".6"/>`;
    return K.done(s + finish(K, 'night', .7));
  };

  S.w9_fireescape = () => {
    const K = kit(); let s = sky(K, { seed: 11 });
    s += `<rect x="0" y="0" width="420" height="400" fill="#16181c"/>`;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) s += `<rect x="${c * 70}" y="${r * 18 + (c % 2) * 9}" width="68" height="16" fill="#1c1e22"/>`;
    s += `<rect x="180" y="40" width="120" height="90" fill="${GREEN}" opacity=".75"/>` + glow(K, 240, 85, 140, GREEN, .3) + `<rect x="180" y="40" width="120" height="90" fill="none" stroke="#2a2a2a" stroke-width="6"/>`;
    s += `<path d="M420,150 L780,150 M420,170 L780,170" stroke="#4a3626" stroke-width="5"/>`;
    for (let x = 430; x < 780; x += 26) s += `<line x1="${x}" y1="150" x2="${x}" y2="170" stroke="#4a3626" stroke-width="3"/>`;
    s += `<path d="M500,170 L470,400 M640,170 L560,320" stroke="#3a2a1e" stroke-width="8"/><path d="M600,170 L540,260 L560,270 L610,180Z" fill="#2a1e16" transform="rotate(14 600 170)"/>`;
    // hands gripping rail
    [[520, 150], [560, 150]].forEach(([x, y]) => s += `<ellipse cx="${x}" cy="${y + 4}" rx="14" ry="8" fill="#c89a78"/><path d="M${x - 10},${y + 2} v12 M${x - 3},${y + 2} v14 M${x + 4},${y + 2} v13 M${x + 10},${y + 2} v10" stroke="#a87a58" stroke-width="2"/>`);
    s += `<path d="M520,162 L530,240 L560,240 L560,162" fill="#2a3040"/>`;
    s += `<rect y="380" width="800" height="20" fill="#000"/>`;
    return K.done(s + finish(K, 'night', .8));
  };

  S.w9_foyer = () => {
    const K = kit(); let s = tiledWall(0, 0, 800, 300, 'night');
    // noticeboard
    s += `<rect x="40" y="90" width="150" height="120" fill="#6a4e30"/><rect x="48" y="98" width="134" height="104" fill="#8a6a44"/>`;
    [[56, 104, 40, 50, '#e8e0c8'], [104, 108, 70, 36, '#f0e8d0'], [60, 160, 60, 36, '#d8e0f0'], [130, 150, 46, 48, '#f2ecd8']].forEach(([x, y, w, h, c]) => s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" transform="rotate(${(x % 7) - 3} ${x} ${y})"/>`);
    s += `<text x="140" y="125" font-family="Arial" font-size="6" font-weight="700" fill="#2a2a2a" text-anchor="middle">WARD 9 CLOSED</text>`;
    // lift
    s += `<rect x="410" y="110" width="110" height="190" fill="#3a3e40"/><rect x="420" y="120" width="44" height="180" fill="#6a7074"/><rect x="466" y="120" width="44" height="180" fill="#6a7074"/>`;
    s += `<path d="M418,96 A47,47 0 0 1 512,96" fill="#c8b070" stroke="#5a4a2a" stroke-width="3"/>`;
    for (let i = 0; i < 8; i++) { const a = Math.PI + i * Math.PI / 7, x = 465 + Math.cos(a) * 38, y = 96 + Math.sin(a) * 38; s += `<text x="${f(x)}" y="${f(y + 3)}" font-family="Arial" font-size="7" font-weight="700" fill="#3a2a1a" text-anchor="middle">${i === 0 ? 'G' : i}</text>`; }
    s += `<path d="M465,96 L${f(465 + Math.cos(Math.PI + 2 * Math.PI / 7) * 30)},${f(96 + Math.sin(Math.PI + 2 * Math.PI / 7) * 30)}" stroke="#8a1a1a" stroke-width="3"/>` + glow(K, 465, 80, 50, '#ffd890', .2);
    // tea trolley
    s += `<rect x="236" y="240" width="130" height="8" fill="#9a9a9a"/><rect x="236" y="290" width="130" height="8" fill="#9a9a9a"/><path d="M240,248 V316 M362,248 V316" stroke="#9a9a9a" stroke-width="4"/><circle cx="244" cy="320" r="6" fill="#222"/><circle cx="358" cy="320" r="6" fill="#222"/>`;
    for (let i = 0; i < 5; i++) s += `<path d="M${248 + i * 22},240 l4,-14 h12 l4,14Z" fill="#e8e4d8"/>`;
    s += `<rect x="290" y="276" width="34" height="14" fill="#c8402a"/><rect x="290" y="276" width="34" height="3" fill="#f2d070"/>`;
    // reception desk
    s += `<rect x="0" y="250" width="200" height="90" fill="#5a4a36"/><rect x="0" y="242" width="210" height="10" fill="#7a6448"/><text x="100" y="290" font-family="Arial" font-size="12" fill="#c8b890" text-anchor="middle" opacity=".6">ENQUIRIES</text>`;
    // wheelchair
    s += `<g transform="translate(610,330)"><circle cx="0" cy="-30" r="30" fill="none" stroke="#8a8a8a" stroke-width="4"/><path d="M-30,-80 L-30,-40 L30,-40 L30,-10 M-30,-80 L-36,-84" stroke="#8a8a8a" stroke-width="4" fill="none"/><rect x="-28" y="-60" width="56" height="20" fill="#3a3a4a"/><circle cx="40" cy="-4" r="6" fill="#222"/></g>`;
    // chairs
    for (let i = 0; i < 4; i++) s += `<rect x="${690 + i * 26}" y="280" width="22" height="28" rx="3" fill="#a8582a"/>`;
    s += `<path d="M380,400 L330,330 L470,330 L420,400Z" fill="#fffbe0" opacity=".07"/>`;
    return K.done(s + finish(K, 'night', .78));
  };

  S.w9_lift = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#4a5054"/>`;
    s += `<rect x="0" y="0" width="160" height="400" fill="#5a6064"/><rect x="640" y="0" width="160" height="400" fill="#5a6064"/>`;
    s += `<rect x="200" y="30" width="400" height="370" fill="#000"/>`;
    // the dark beyond: rows of beds faint
    for (let i = 0; i < 5; i++) { const y = 230 + i * 28, k = .3 + i * .18; s += bed(400 - 120 * (1 + i * .3), y, k, { breath: true, sheet: '#3a4a40' }) + bed(400 + 120 * (1 + i * .3), y, k, { flip: true, breath: true, sheet: '#3a4a40' }); }
    s += `<rect x="200" y="30" width="400" height="370" fill="#000" opacity=".55"/>`;
    s += eye(392, 70, 5) + eye(410, 70, 5);
    s += `<rect x="160" y="30" width="40" height="370" fill="#7a8084"/><rect x="600" y="30" width="40" height="370" fill="#7a8084"/>`;
    s += `<rect x="660" y="140" width="60" height="150" fill="#3a3e40"/>`;
    ['8', '7', '6', '5', 'G'].forEach((t, i) => s += `<circle cx="690" cy="${160 + i * 28}" r="10" fill="${t === '8' ? '#ffd27a' : '#c8c8c0'}"/><text x="690" y="${164 + i * 28}" font-family="Arial" font-size="10" font-weight="700" text-anchor="middle" fill="#222">${t}</text>`);
    s += `<rect x="320" y="0" width="160" height="12" fill="#f8fff8" opacity=".7"/>`;
    return K.done(s + finish(K, 'under', .8));
  };

  S.w9_trolley = () => {
    const K = kit(); let s = tiledWall(0, 0, 800, 300, 'night');
    s += `<rect x="250" y="60" width="300" height="250" fill="#2a2e30"/><rect x="262" y="70" width="276" height="240" fill="#a8b0a8"/>`;
    s += `<rect x="262" y="70" width="276" height="240" fill="${K.rad(id('lf'), [[0, '#f0fff0', .6], [1, '#000', .3]], .5, .1, .9)}"/>`;
    s += `<rect x="226" y="60" width="36" height="250" fill="#6a7074"/><rect x="538" y="60" width="36" height="250" fill="#6a7074"/>`;
    s += `<g transform="translate(400,300)"><rect x="-120" y="-60" width="240" height="8" fill="#9a9a9a"/><path d="M-110,-52 V-6 M110,-52 V-6" stroke="#9a9a9a" stroke-width="5"/><circle cx="-110" cy="0" r="7" fill="#222"/><circle cx="110" cy="0" r="7" fill="#222"/>`;
    s += `<path d="M-124,-60 L-124,-70 Q-90,-104 -20,-98 Q60,-92 100,-80 Q124,-74 124,-62 L124,-60Z" fill="#ece8dc"/><path d="M-80,-100 Q-40,-108 0,-100" stroke="#d0ccbe" stroke-width="2" fill="none"/>`;
    s += `<path d="M-60,-64 q-8,30 -6,58" stroke="${SKD}" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="-70" y="-30" width="12" height="7" fill="#f2f0e8"/>`;
    s += `</g>`;
    return K.done(s + finish(K, 'night', .78));
  };

  S.w9_stairs = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#0a0c0a"/>`;
    s += tiledWall(0, 0, 800, 260, 'night', { floor: false });
    for (let i = 0; i < 9; i++) s += `<rect x="${160 + i * 20}" y="${380 - i * 26}" width="${480 - i * 40}" height="26" fill="${i % 2 ? '#2a2a24' : '#24241e'}"/><rect x="${160 + i * 20}" y="${380 - i * 26}" width="${480 - i * 40}" height="4" fill="#3a3a30"/>`;
    // barricade of bed frames
    const r = rng(9);
    for (let i = 0; i < 9; i++) { const x = 230 + r() * 300, y = 110 + r() * 110, a = (r() - .5) * 70, w = 120 + r() * 100; s += `<g transform="translate(${f(x)},${f(y)}) rotate(${f(a)})"><rect x="${f(-w / 2)}" y="-30" width="${f(w)}" height="60" fill="none" stroke="#9aa09a" stroke-width="5"/>${Array.from({ length: 6 }, (_, j) => `<line x1="${f(-w / 2 + j * w / 6)}" y1="-30" x2="${f(-w / 2 + j * w / 6)}" y2="30" stroke="#7a807a" stroke-width="2"/>`).join('')}</g>`; }
    s += `<text x="120" y="80" font-family="Comic Sans MS,Arial" font-size="20" fill="#e8e8e0" opacity=".85" transform="rotate(-4 120 80)">DON’T LET</text><text x="110" y="108" font-family="Comic Sans MS,Arial" font-size="20" fill="#e8e8e0" opacity=".85" transform="rotate(-4 110 108)">HER COUNT YOU</text>`;
    s += beam(K, 520, 0, 470, 230, 50, .25);
    return K.done(s + finish(K, 'night', .8));
  };

  S.w9_stairs_dark = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#020302"/>`;
    for (let i = 0; i < 7; i++) s += `<rect x="${200 + i * 20}" y="${400 - i * 30}" width="${400 - i * 40}" height="4" fill="#141810"/>`;
    s += `<g opacity=".5">` + Array.from({ length: 5 }, (_, i) => `<rect x="${260 + i * 50}" y="${60 + (i % 2) * 20}" width="${90}" height="60" fill="none" stroke="#2a302a" stroke-width="5" transform="rotate(${i * 13 - 20} ${300 + i * 50} 90)"/>`).join('') + `</g>`;
    s += `<g opacity=".9">${sisB(K, 430, 160, 260, { armR: 0, torchAng: 95, tilt: 14 }, 400, 330, 90, .3)}</g>`;
    s += `<rect width="800" height="190" fill="#000" opacity=".55"/>`;
    return K.done(s + finish(K, 'under', .9));
  };

  S.w9_landing = () => {
    const K = kit(); let s = tiledWall(0, 0, 800, 290, 'under');
    s += `<rect x="300" y="80" width="200" height="210" fill="#2a3a30"/><rect x="306" y="86" width="92" height="204" fill="#4a6a5a"/><rect x="402" y="86" width="92" height="204" fill="#4a6a5a"/>`;
    s += `<circle cx="352" cy="140" r="20" fill="${GREEN}" opacity=".8"/><circle cx="448" cy="140" r="20" fill="${GREEN}" opacity=".8"/>` + glow(K, 400, 140, 120, GREEN, .3);
    s += `<rect x="300" y="286" width="200" height="8" fill="${GREEN}"/>` + `<ellipse cx="400" cy="300" rx="200" ry="20" fill="${GREEN}" opacity=".25"/>`;
    s += `<rect x="350" y="50" width="100" height="24" fill="#eae4cc"/><text x="400" y="67" font-family="Georgia,serif" font-size="16" font-weight="700" fill="#1a2a20" text-anchor="middle">WARD 9</text>`;
    s += `<rect x="90" y="110" width="110" height="180" fill="#2c3a5a"/><rect x="128" y="130" width="34" height="50" fill="#1a2a20"/><rect x="110" y="196" width="70" height="16" fill="#eae4cc"/><text x="145" y="207" font-family="Arial" font-size="9" font-weight="700" fill="#222" text-anchor="middle">SISTER</text>`;
    s += `<rect x="600" y="110" width="110" height="180" fill="#5a5a5a"/><rect x="620" y="130" width="70" height="16" fill="#e8c840"/><text x="655" y="141" font-family="Arial" font-size="8" font-weight="700" fill="#222" text-anchor="middle">PLANT ROOM</text>`;
    return K.done(s + finish(K, 'under', .8));
  };

  S.w9_office = () => {
    const K = kit(); let s = tiledWall(0, 0, 800, 270, 'night');
    // photo
    s += `<rect x="90" y="70" width="110" height="110" fill="#3a2a1a"/><rect x="98" y="78" width="94" height="94" fill="#8a8470"/>`;
    for (let i = 0; i < 5; i++) s += `<circle cx="${112 + i * 17}" cy="140" r="6" fill="#d8d0b8"/><rect x="${106 + i * 17}" y="146" width="12" height="22" fill="#e8e4d8"/>`;
    s += `<rect x="140" y="92" width="16" height="44" fill="#1a2030"/><circle cx="148" cy="96" r="7" fill="#c8ccc4"/><circle cx="145.5" cy="95" r="1.6" fill="${GREEN}"/><circle cx="150.5" cy="95" r="1.6" fill="${GREEN}"/><rect x="144" y="98" width="8" height="5" fill="#f2f0e8"/>`;
    // wiring diagram
    s += `<rect x="560" y="60" width="150" height="110" fill="#d8dcc8"/>`;
    for (let i = 0; i < 6; i++) s += `<rect x="${572 + (i % 3) * 44}" y="${74 + Math.floor(i / 3) * 44}" width="36" height="30" fill="none" stroke="#3a4a7a" stroke-width="1.4"/>`;
    s += `<ellipse cx="662" cy="132" rx="26" ry="20" fill="none" stroke="#c82a2a" stroke-width="2.4"/><text x="662" y="136" font-family="Arial" font-size="9" font-weight="700" fill="#c82a2a" text-anchor="middle">27</text>`;
    // drugs cupboard
    s += `<rect x="250" y="60" width="100" height="120" fill="#7a7e78"/><rect x="290" y="80" width="20" height="20" fill="#c82a2a"/><rect x="296" y="74" width="8" height="32" fill="#c82a2a"/><rect x="284" y="74" width="32" height="8" fill="#7a7e78"/><rect x="284" y="96" width="32" height="10" fill="#7a7e78"/><rect x="292" y="80" width="16" height="20" fill="#c82a2a"/>`;
    s += `<rect x="270" y="140" width="60" height="14" fill="#c8a840"/>`;
    // desk + book + tin
    s += `<rect x="220" y="240" width="380" height="16" fill="#5a3e28"/><rect x="236" y="256" width="20" height="120" fill="#4a3220"/><rect x="560" y="256" width="20" height="120" fill="#4a3220"/><rect x="300" y="256" width="140" height="54" fill="#4a3220"/><rect x="356" y="276" width="28" height="5" fill="#b8a070"/>`;
    s += `<path d="M330,238 L390,232 L450,238 L450,226 L390,220 L330,226Z" fill="#efe8d0"/><path d="M390,220 V232" stroke="#8a7a5a"/>`;
    s += `<rect x="450" y="212" width="70" height="28" rx="3" fill="#2a4a8a"/><rect x="450" y="212" width="70" height="7" fill="#d8b040"/>`;
    s += `<rect x="530" y="222" width="18" height="18" fill="#f2f0e8"/><path d="M536,218 q-3,-8 0,-14 M542,218 q3,-8 0,-14" stroke="#ccc" stroke-width="1.2" fill="none" opacity=".6"/>`;
    // coat stand + cape
    s += `<path d="M745,120 V360" stroke="#3a2a1a" stroke-width="6"/><path d="M745,130 l-16,-10 M745,130 l16,-10" stroke="#3a2a1a" stroke-width="4"/>`;
    s += `<path d="M720,132 Q700,220 708,320 L782,320 Q790,220 770,132Z" fill="${NAVY2}"/><path d="M712,316 Q706,220 724,140" stroke="${CAPE_IN}" stroke-width="3" fill="none"/>`;
    s += beam(K, 0, 400, 380, 240, 80, .18);
    return K.done(s + finish(K, 'night', .78));
  };

  S.w9_book = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#1a120c"/>`;
    s += `<path d="M120,60 L400,40 L680,60 L680,370 L400,390 L120,370Z" fill="#efe8d0"/><path d="M400,40 V390" stroke="#a89a78" stroke-width="2"/>`;
    for (let i = 0; i < 12; i++) { s += `<line x1="140" y1="${90 + i * 24}" x2="390" y2="${80 + i * 24}" stroke="#c8d0e0" stroke-width="1"/><line x1="410" y1="${80 + i * 24}" x2="660" y2="${90 + i * 24}" stroke="#c8d0e0" stroke-width="1"/>`; }
    const lines = ['13/14 Mar 74. 23 pts. All settled.', 'All breathing well, together.', 'Night dose 03.03. Dr Pennant', 'bleeped x6. Did not attend.', '14/15 Mar 74. 23 pts. All settled.', 'All breathing well, together.'];
    lines.forEach((t, i) => s += `<text x="150" y="${86 + i * 24}" font-family="Georgia,serif" font-style="italic" font-size="13" fill="#1a2a5a" transform="rotate(-2 150 ${86 + i * 24})">${t}</text>`);
    const r2 = ['…', '24 pts. 1 admitted.', 'Bed 14. Security, male.', 'Bleeped security.', 'Awaiting.'];
    r2.forEach((t, i) => s += `<text x="420" y="${100 + i * 24}" font-family="Georgia,serif" font-style="italic" font-size="13" fill="${i > 0 ? '#0a1440' : '#1a2a5a'}" transform="rotate(2 420 ${100 + i * 24})">${t}</text>`);
    s += `<path d="M528,198 q4,10 0,22" stroke="#0a1440" stroke-width="2" fill="none"/><circle cx="528" cy="222" r="2.4" fill="#0a1440"/>`;
    s += beam(K, 0, 0, 400, 200, 260, .12);
    return K.done(s + K.vignette(.8) + K.grain(.18));
  };

  S.w9_cabinet = () => {
    const K = kit(); let s = tiledWall(0, 0, 800, 330, 'night', { floor: false });
    s += `<rect x="230" y="30" width="340" height="340" fill="#8a8e88"/><rect x="244" y="44" width="312" height="312" fill="#7a7e78" stroke="#5a5e58" stroke-width="3"/>`;
    s += `<rect x="370" y="70" width="60" height="20" fill="#c82a2a"/><rect x="390" y="50" width="20" height="60" fill="#c82a2a"/>`;
    s += `<rect x="320" y="130" width="160" height="30" fill="#efe8d0"/><text x="400" y="143" font-family="Courier New,monospace" font-size="9" fill="#2a2a2a" text-anchor="middle">COMBINATION: THE NIGHT</text><text x="400" y="155" font-family="Courier New,monospace" font-size="9" fill="#2a2a2a" text-anchor="middle">WE CLOSED (DAY, MONTH)</text>`;
    for (let i = 0; i < 4; i++) { const x = 310 + i * 60; s += `<rect x="${x - 20}" y="190" width="40" height="70" rx="6" fill="#c8a040" stroke="#6a4a10" stroke-width="2"/>`; for (let j = 0; j < 3; j++) s += `<line x1="${x - 16}" y1="${206 + j * 18}" x2="${x + 16}" y2="${206 + j * 18}" stroke="#8a6a20"/>`; s += `<text x="${x}" y="232" font-family="Georgia" font-size="22" font-weight="700" text-anchor="middle" fill="#3a2608">?</text>`; }
    s += `<rect x="520" y="200" width="20" height="60" rx="4" fill="#4a4e48"/>`;
    s += beam(K, 0, 380, 400, 220, 140, .18);
    return K.done(s + finish(K, 'night', .7));
  };

  S.w9_ward_door = () => {
    const K = kit(); let s = ward(K, 'under', {});
    s += `<g opacity=".95">${sisB(K, 420, 230, 150, { back: true, armR: 30, torchAng: 120 }, 330, 280, 40, .4)}</g>`;
    s += `<rect x="0" y="0" width="320" height="400" fill="#4a6a5a"/><rect x="560" y="0" width="240" height="400" fill="#4a6a5a"/>`;
    s += `<rect x="20" y="40" width="280" height="360" fill="#3e5e4e"/><circle cx="160" cy="130" r="34" fill="#0a140e" stroke="#2a3a30" stroke-width="6"/>`;
    s += `<rect x="580" y="40" width="200" height="360" fill="#3e5e4e"/><circle cx="680" cy="130" r="34" fill="#0a140e" stroke="#2a3a30" stroke-width="6"/>`;
    s += `<rect x="60" y="220" width="160" height="110" fill="#efe8d0"/><text x="140" y="240" font-family="Arial" font-size="11" font-weight="700" fill="#1a2a20" text-anchor="middle">WARD 9 · NIGHT RULES</text>`;
    ['1. Lights out 3.03 a.m.', '2. Patients remain in bed.', '3. Breathe quietly, together.', '4. Visitors found after', '    lights out will be admitted.'].forEach((t, i) => s += `<text x="72" y="${260 + i * 14}" font-family="Georgia,serif" font-size="10" fill="#222">${t}</text>`);
    s += `<rect x="300" y="0" width="20" height="400" fill="#000" opacity=".5"/>`;
    return K.done(s + finish(K, 'under', .8));
  };

  S.w9_ward = () => {
    const K = kit(); let s = ward(K, 'under', { numbers: true });
    s += sisB(K, 400, 250, 175, { armR: 40, torchAng: 150, tilt: 8 }, 200, 340, 70, .45);
    return K.done(s + finish(K, 'under', .82));
  };

  S.w9_inbed = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#050806"/>`;
    // looking up from the pillow: ceiling, bed rail, and the tall shape at the bed's foot
    s += `<rect width="800" height="160" fill="#0a100c"/>`;
    for (let i = 0; i < 5; i++) s += `<rect x="${i * 180 - 40}" y="${20 + i * 2}" width="120" height="10" fill="#1a221c"/>`;
    s += `<path d="M0,260 Q400,200 800,260 L800,400 L0,400Z" fill="#cfd6c8"/><path d="M0,300 Q400,240 800,300" stroke="#b8c0b0" stroke-width="3" fill="none"/>`;
    s += `<path d="M120,260 Q140,200 120,150 M680,260 Q660,200 680,150" stroke="#9aa09a" stroke-width="6" fill="none"/><path d="M120,150 H680" stroke="#9aa09a" stroke-width="6"/>`;
    s += sisB(K, 400, 330, 300, { armR: 20, torchAng: 100, suck: true, tilt: -14 }, 380, 420, 160, .4);
    s += `<rect y="330" width="800" height="70" fill="#dfe4d8" opacity=".9"/>`;
    return K.done(s + finish(K, 'under', .85));
  };

  S.w9_grabbed = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#100404"/>`;
    s += beam(K, 800, 60, 400, 240, 220, .25);
    // your arm, her hand wrapping it
    s += `<path d="M0,300 L380,220 L400,250 L0,350Z" fill="#2a3040"/><ellipse cx="420" cy="232" rx="40" ry="26" fill="#c89a78"/>`;
    s += `<path d="M450,226 l60,-10 M452,236 l64,-2 M450,246 l58,6 M446,254 l50,12" stroke="#a87a58" stroke-width="10" stroke-linecap="round"/>`;
    for (let i = 0; i < 5; i++) s += `<path d="M${330 + i * 22},160 Q${360 + i * 20},${200 + i * 4} ${340 + i * 16},${280 + i * 4} Q${330 + i * 14},${300} ${300 + i * 18},${300}" stroke="${SK}" stroke-width="11" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M300,60 Q340,150 330,170" stroke="${NAVY}" stroke-width="44" fill="none"/>`;
    s += `<rect x="560" y="260" width="140" height="70" rx="6" fill="${GAUZE}" transform="rotate(-12 630 295)"/><path d="M560,262 l30,-8 M700,330 l-30,8" stroke="${TAPE}" stroke-width="8"/>`;
    return K.done(s + finish(K, 'blood', .85));
  };

  S.w9_bed14 = () => {
    const K = kit(); let s = ward(K, 'under', {});
    s += `<rect width="800" height="400" fill="#000" opacity=".45"/>`;
    s += bed(400, 360, 2.6, { face: false, chart: '14', breath: true });
    // Dev's head on the pillow, big
    s += `<g transform="translate(225,190)"><ellipse cx="0" cy="0" rx="44" ry="34" fill="#a87a5a"/><path d="M-44,-6 Q-40,-36 0,-38 Q30,-36 38,-20 Q10,-30 -20,-24Z" fill="#1a120c"/>`;
    s += `<rect x="-6" y="-8" width="44" height="34" rx="4" fill="${GAUZE}"/><path d="M-6,-8 l10,-4 M38,-8 l-8,-6 M-6,26 l10,4 M38,26 l-8,6" stroke="${TAPE}" stroke-width="5"/>`;
    s += `<circle cx="-14" cy="-14" r="7" fill="#eef3e8"/><circle cx="-14" cy="-14" r="2.6" fill="#111"/><path d="M-22,-8 q-6,14 -10,30" stroke="#9fd0e8" stroke-width="2" fill="none" opacity=".6"/></g>`;
    s += `<path d="M260,250 L420,240 L430,262 L270,272Z" fill="#2a3048"/><text x="330" y="262" font-family="Arial" font-size="9" fill="#c8c8c8">SECURITY</text>`;
    return K.done(s + finish(K, 'under', .85));
  };

  S.w9_devwake = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#120505"/>` + beam(K, 0, 0, 380, 200, 260, .14);
    const sk = '#9a7458', soft = K.blur(id('dw'), 6);
    s += `<rect x="0" y="300" width="800" height="100" fill="#d8dcd0" opacity=".85"/>`;
    s += `<g transform="translate(400,210) rotate(-6)">`;
    s += `<ellipse cx="0" cy="0" rx="120" ry="150" fill="${K.rad(id('df'), [[0, shade(sk, .1)], [.7, sk], [1, shade(sk, -.5)]], .5, .45, .6)}"/>`;
    s += `<path d="M-120,-30 Q-116,-150 0,-156 Q110,-150 120,-40 Q80,-110 0,-112 Q-80,-110 -120,-30Z" fill="#1a120c"/>`;
    [[-44, -10], [44, -10]].forEach(([x, y]) => { s += `<ellipse cx="${x}" cy="${y + 6}" rx="38" ry="30" fill="#3a2418" opacity=".7" filter="${soft}"/><ellipse cx="${x}" cy="${y}" rx="26" ry="20" fill="#f0ece0"/><circle cx="${x + 3}" cy="${y}" r="11" fill="#4a3020"/><circle cx="${x + 3}" cy="${y}" r="4.5" fill="#000"/><path d="M${x - 24},${y - 2} q8,-4 14,2 M${x + 10},${y + 12} q8,-2 12,-8" stroke="#b02a20" stroke-width="1.4" fill="none"/>`; });
    s += `<path d="M-80,-48 Q-44,-62 -10,-46 M10,-46 Q44,-62 80,-48" stroke="#1a120c" stroke-width="7" fill="none"/>`;
    s += `<path d="M-54,16 q-6,40 -20,70 M56,16 q4,36 16,64" stroke="#9fc8e0" stroke-width="3" fill="none" opacity=".55"/>`;
    s += `<path d="M-6,0 Q-14,40 -8,50 Q0,56 8,50" stroke="${shade(sk, -.35)}" stroke-width="4" fill="none"/>`;
    s += `<ellipse cx="0" cy="92" rx="30" ry="34" fill="#1a0606"/><path d="M-30,86 Q0,70 30,86" stroke="#d8b4a0" stroke-width="6" fill="none"/><path d="M-6,64 q4,8 0,16" stroke="#a8241a" stroke-width="3" fill="none"/>`;
    s += `<path d="M-60,70 l-26,20 M60,70 l26,18" stroke="${TAPE}" stroke-width="10" opacity=".85"/>`;
    s += `<rect x="70" y="80" width="80" height="60" rx="4" fill="${GAUZE}" transform="rotate(34 110 110)"/>`;
    s += `</g>`;
    return K.done(s + finish(K, 'blood', .85));
  };

  S.w9_sitting = () => {
    const K = kit(); let s = ward(K, 'blood', { sitting: true, point: true });
    s += sisB(K, 400, 250, 160, { armR: 10, torchAng: 92, suck: true, tilt: 12 }, 400, 390, 80, .4);
    return K.done(s + finish(K, 'blood', .82));
  };

  S.w9_corridor = () => {
    const K = kit(); let s = corridor(K, 'blood', { doors: [[-1, 3, '#5a5a5a', 'PLANT', true], [-1, 7, '#8a8070', 'LINEN'], [1, 4, '#6a7a70', 'SLUICE'], [1, 9, '#4a6a5a', 'WARD 9', true]] });
    s += glow(K, 470, 175, 70, GREEN, .5);
    s += sisB(K, 466, 200, 80, { armR: 30, torchAng: 120 }, 330, 360, 70, .35);
    return K.done(s + finish(K, 'blood', .82));
  };

  S.w9_fuse = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#1a1c1a"/>`;
    s += `<rect x="120" y="40" width="460" height="300" fill="#6a6e6a"/><rect x="134" y="54" width="432" height="272" fill="#4a4e4a"/>`;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 10; c++) { const x = 150 + c * 41, y = 70 + r * 62; s += `<rect x="${x}" y="${y}" width="30" height="48" fill="#2a2c2a"/><rect x="${x + 8}" y="${y + 26}" width="14" height="18" fill="#c8c8c0"/><rect x="${x + 2}" y="${y + 2}" width="26" height="8" fill="#8a7a50" opacity="${(r * 10 + c) % 3 ? .3 : .7}"/>`; }
    s += `<rect x="600" y="120" width="80" height="140" fill="#5a5e5a"/><rect x="626" y="150" width="28" height="80" fill="#c82a2a"/><text x="640" y="276" font-family="Arial" font-size="9" fill="#e8e0c8" text-anchor="middle">MAIN</text>`;
    s += `<circle cx="640" cy="80" r="22" fill="#2a2c2a" stroke="#c8c8c0" stroke-width="3"/><text x="640" y="85" font-family="monospace" font-size="14" fill="#e8c840" text-anchor="middle">??</text><text x="640" y="114" font-family="Arial" font-size="7" fill="#e8e0c8" text-anchor="middle">CIRCUIT SELECT</text>`;
    s += `<rect x="20" y="60" width="18" height="140" fill="#c82a2a"/><rect x="14" y="60" width="30" height="16" fill="#9a9a9a"/>`;
    s += `<rect x="740" y="0" width="60" height="400" fill="#0a0c0a"/>` + beam(K, 800, 200, 520, 240, 90, .45) + glow(K, 780, 200, 60, '#fffbe0', .5);
    return K.done(s + finish(K, 'blood', .8));
  };

  S.w9_linen = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#030404"/>`;
    for (let r = 0; r < 4; r++) { s += `<rect x="40" y="${40 + r * 80}" width="720" height="6" fill="#141614"/>`; for (let i = 0; i < 9; i++) s += `<rect x="${60 + i * 78}" y="${10 + r * 80}" width="66" height="30" fill="#2a2c28"/>`; }
    s += `<rect x="0" y="372" width="800" height="10" fill="${GREEN}" opacity=".7"/>` + `<rect x="0" y="380" width="800" height="20" fill="#000"/>`;
    s += `<rect x="310" y="370" width="60" height="14" fill="#000"/><rect x="430" y="370" width="60" height="14" fill="#000"/>`;
    for (let i = 0; i < 5; i++) s += `<path d="M${500 - i * 22},384 Q${470 - i * 26},${356 + i * 2} ${430 - i * 34},${340 + i * 6}" stroke="${SK}" stroke-width="9" fill="none" stroke-linecap="round"/><ellipse cx="${430 - i * 34}" cy="${340 + i * 6}" rx="5" ry="3.4" fill="#d8dcd0"/>`;
    s += `<path d="M240,384 L230,330 L290,330 L300,384Z" fill="#14161c"/><path d="M226,334 Q258,318 292,334" stroke="#2a2a30" stroke-width="10" fill="none"/>`;
    return K.done(s + finish(K, 'under', .8));
  };

  S.w9_finale_lit = () => {
    const K = kit(); let s = corridor(K, 'lit', { lit: true, doors: [[1, 3, '#4a6a5a', 'WARD 9'], [-1, 6, '#2a6a3a', 'STAIRS', true]] });
    s += sister(400, 360, 330, { torch: true, armR: 18, armL: -18, torchAng: 80, suck: true, shine: false, tilt: 16 });
    s += `<rect width="800" height="400" fill="#fff" opacity=".12"/>`;
    return K.done(s + finish(K, 'blood', .6));
  };

  S.w9_finale_dark = () => {
    const K = kit(); let s = corridor(K, 'blood', { doors: [[-1, 6, '#2a6a3a', 'STAIRS', true]] });
    s += `<rect width="800" height="400" fill="#000" opacity=".45"/>`;
    s += sisB(K, 400, 380, 340, { armR: 26, torchAng: 110, armL: 40, lenL: 165, suck: true, tilt: -12 }, 360, 420, 150, .5);
    return K.done(s + finish(K, 'blood', .85));
  };

  S.w9_end_lights = () => {
    const K = kit(); let s = ward(K, 'golden', { lit: true, empty: true });
    s += `<g transform="translate(400,330)"><path d="M-70,0 Q-60,-26 -20,-30 Q30,-34 60,-16 Q76,-4 70,0Z" fill="${NAVY2}"/><path d="M-50,-4 Q0,-20 50,-6" stroke="${CAPE_IN}" stroke-width="3" fill="none"/><path d="M40,-30 Q60,-50 80,-30 L76,-24 Q60,-36 44,-24Z" fill="#f2efe4"/><circle cx="-20" cy="-10" r="7" fill="#d8d0b0" stroke="#8a7a40" stroke-width="2"/></g>`;
    return K.done(s + K.vignette(.45) + K.grain(.1));
  };

  S.w9_end_dawn = () => {
    const K = kit(); let s = sky(K, { dawn: true });
    s += hospital(K, 200, 330, 400, { dawn: true });
    s += `<rect y="330" width="800" height="70" fill="#3a3a38"/>`;
    s += `<g transform="translate(560,380)"><rect x="-10" y="-60" width="20" height="60" fill="#2a3048"/><circle cx="0" cy="-70" r="10" fill="#c89a78"/><rect x="18" y="-58" width="20" height="58" fill="#2a3048"/><circle cx="28" cy="-68" r="10" fill="#a87a5a"/><path d="M10,-50 L22,-54" stroke="#2a3048" stroke-width="6"/></g>`;
    s += `<rect width="800" height="400" fill="#ffb070" opacity=".08"/>`;
    return K.done(s + K.vignette(.45) + K.grain(.1));
  };

  S.w9_end_alone = () => {
    const K = kit(); let s = sky(K, { seed: 21 });
    s += hospital(K, 220, 300, 360, { lit: true, beamAt: 4 });
    s += `<rect y="300" width="800" height="100" fill="#0c0d10"/>`;
    s += `<path d="M0,240 L800,240 L800,400 L0,400Z" fill="#000" opacity=".5"/><path d="M60,400 L120,250 L680,250 L740,400Z" fill="#0a0c10" opacity=".9"/><rect x="120" y="240" width="560" height="14" fill="#14161c"/>`;
    s += `<g transform="translate(400,390)"><path d="M-60,0 Q-60,-50 0,-56 Q60,-50 60,0Z" fill="#1a1c22"/><circle cx="0" cy="-74" r="22" fill="#14161a"/></g>`;
    return K.done(s + finish(K, 'night', .7));
  };

  S.w9_end_police = () => {
    const K = kit(); let s = sky(K, { seed: 5 });
    s += hospital(K, 200, 300, 400, { lit: true, figs: true });
    s += `<rect y="300" width="800" height="100" fill="#0e1012"/>`;
    s += `<g transform="translate(300,370)"><rect x="-90" y="-40" width="180" height="40" rx="8" fill="#e8e8e8"/><rect x="-90" y="-26" width="180" height="10" fill="#2a4aaa"/><rect x="-90" y="-16" width="180" height="6" fill="#e8d020"/><rect x="-60" y="-66" width="110" height="28" rx="6" fill="#d8d8d8"/><rect x="-14" y="-74" width="28" height="8" fill="#2a6aff"/><circle cx="-56" cy="0" r="12" fill="#111"/><circle cx="56" cy="0" r="12" fill="#111"/><path d="M50,-40 L96,-70 L96,-30Z" fill="#c8c8c8"/></g>`;
    s += glow(K, 300, 296, 120, '#2a6aff', .45);
    return K.done(s + finish(K, 'night', .7));
  };

  S.w9_end_admitted = () => {
    const K = kit(); let s = ward(K, 'under', {});
    s += `<rect width="800" height="400" fill="#000" opacity=".35"/>`;
    s += sisB(K, 560, 330, 240, { armR: -20, torchAng: 150, tilt: -18, suck: true }, 220, 330, 90, .4);
    s += `<path d="M0,300 Q300,250 800,320 L800,400 L0,400Z" fill="#cfd6c8"/><rect x="40" y="250" width="120" height="70" rx="6" fill="${GAUZE}" opacity=".6"/><path d="M40,252 l26,-6 M160,318 l-26,6" stroke="${TAPE}" stroke-width="7" opacity=".6"/>`;
    return K.done(s + finish(K, 'under', .85));
  };

  /* ================= JUMP SCARES (600x600) ================= */
  /* a gaunt, lidless, gauze-masked face. o: cap, tilt, suck, look [dx,dy], skin, bg, under (underlight colour) */
  function face(K, o = {}) {
    const u = id('fc'), skin = o.skin || '#a7ad9f', clip = `${K.u}${u}`;
    const head = 'M300,64 C392,64 436,150 434,250 C432,342 404,420 362,470 C338,498 262,498 238,470 C196,420 168,342 166,250 C164,150 208,64 300,64Z';
    K.defs.push(`<clipPath id="${clip}"><path d="${head}"/></clipPath>`);
    const soft = K.blur(id('sf'), 14), soft2 = K.blur(id('sf'), 5), soft3 = K.blur(id('sf'), 2);
    let s = '';
    // neck + tendons
    s += `<path d="M262,440 L250,560 L350,560 L338,440Z" fill="${shade(skin, -.25)}"/><path d="M276,470 L268,560 M324,470 L332,560" stroke="${shade(skin, -.45)}" stroke-width="5" opacity=".7"/>`;
    s += `<path d="${head}" fill="${K.rad(id('sk'), [[0, shade(skin, .12)], [.65, skin], [1, shade(skin, -.45)]], .5, .45, .62)}"/>`;
    s += `<g clip-path="url(#${clip})">`;
    s += K.fog('#4a5a44', .55, 600, 600, 31, '0.02 0.03');
    s += `<rect width="600" height="600" fill="#000" opacity="0" />`;
    // hollows: temples, cheeks, sockets
    [[178, 222, 46, 70], [422, 222, 46, 70], [214, 362, 40, 60], [386, 362, 40, 60]].forEach(([x, y, rx, ry]) => s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#1e2218" opacity=".6" filter="${soft}"/>`);
    [[244, 252], [356, 252]].forEach(([x, y]) => s += `<ellipse cx="${x}" cy="${y}" rx="60" ry="50" fill="#14160f" opacity=".85" filter="${soft}"/>`);
    // veins at the temples
    s += `<path d="M186,170 q12,24 4,44 q-8,20 6,40 M412,168 q-10,28 -2,48 q6,18 -6,36" stroke="#3a4a5a" stroke-width="2.4" fill="none" opacity=".55" filter="${soft3}"/>`;
    // nose bridge
    s += `<path d="M300,262 C292,290 290,304 296,316 M300,262 C308,290 310,304 304,316" stroke="${shade(skin, -.3)}" stroke-width="5" fill="none" opacity=".6" filter="${soft3}"/>`;
    if (o.under) s += `<rect y="300" width="600" height="300" fill="${K.lin(id('ul'), [[0, o.under, 0], [1, o.under, .55]])}" style="mix-blend-mode:screen"/>`;
    s += `</g>`;
    // eyes: no lids, raw rims, tiny pupils, eyeshine
    const lk = o.look || [0, 0];
    [[244, 252], [356, 252]].forEach(([x, y], i) => {
      s += `<circle cx="${x}" cy="${y}" r="34" fill="#5a1a14" filter="${soft3}"/>`;
      s += `<circle cx="${x}" cy="${y}" r="30" fill="${K.rad(id('sc'), [[0, '#f2efdc'], [.7, '#ddd6b6'], [1, '#a89a70']], .45, .4, .6)}"/>`;
      const r = rng(40 + i);
      for (let v = 0; v < 7; v++) { const a = r() * Math.PI * 2, x1 = x + Math.cos(a) * 29, y1 = y + Math.sin(a) * 29, x2 = x + Math.cos(a + .3) * 16, y2 = y + Math.sin(a + .3) * 16; s += `<path d="M${f(x1)},${f(y1)} Q${f((x1 + x2) / 2 + r() * 6 - 3)},${f((y1 + y2) / 2 + r() * 6 - 3)} ${f(x2)},${f(y2)}" stroke="#a8281e" stroke-width="1.3" fill="none" opacity=".8"/>`; }
      const ix = x + lk[0] * 12, iy = y + lk[1] * 12;
      s += `<circle cx="${f(ix)}" cy="${f(iy)}" r="12" fill="#7d8a78"/><circle cx="${f(ix)}" cy="${f(iy)}" r="12" fill="none" stroke="#3a4436" stroke-width="2"/><circle cx="${f(ix)}" cy="${f(iy)}" r="3.4" fill="#000"/>`;
      if (o.shine !== false) s += `<circle cx="${f(ix)}" cy="${f(iy)}" r="20" fill="${GREEN}" opacity=".45" filter="${soft2}" style="mix-blend-mode:screen"/><circle cx="${f(ix)}" cy="${f(iy)}" r="9" fill="#d8ffe8" opacity=".55" style="mix-blend-mode:screen"/>`;
      s += `<ellipse cx="${x - 9}" cy="${y - 11}" rx="6" ry="3.4" fill="#fff" opacity=".85"/>`;
      s += `<circle cx="${x}" cy="${y}" r="31" fill="none" stroke="#7a2a20" stroke-width="2.4" opacity=".9"/>`;
    });
    // gauze, sucked into a hollow far too deep for a mouth
    const sk = o.suck == null ? 1 : o.suck;
    s += `<path d="M208,304 Q300,292 392,304 L402,468 Q300,484 198,468Z" fill="${K.rad(id('gz'), [[0, '#2a2416'], [.22 * sk + .05, '#6a5e3a'], [.55, '#cfc496'], [1, '#e2d8aa']], .5, .52, .62)}"/>`;
    for (let i = 0; i < 14; i++) { const t = i / 13, x0 = 208 + t * 184, y0 = 302 - Math.sin(t * Math.PI) * 10; s += `<path d="M${f(x0)},${f(y0)} Q${f(300 + (x0 - 300) * .5)},${f(340)} ${f(300 + (x0 - 300) * (.22 - sk * .12))},${f(386)}" stroke="#a89a68" stroke-width="1.2" fill="none" opacity=".7"/>`; }
    for (let i = 0; i < 14; i++) { const t = i / 13, x0 = 198 + t * 204, y0 = 470 + Math.sin(t * Math.PI) * 12; s += `<path d="M${f(x0)},${f(y0)} Q${f(300 + (x0 - 300) * .5)},${f(430)} ${f(300 + (x0 - 300) * (.22 - sk * .12))},${f(392)}" stroke="#a89a68" stroke-width="1.2" fill="none" opacity=".7"/>`; }
    s += `<ellipse cx="300" cy="388" rx="${f(14 + sk * 34)}" ry="${f(16 + sk * 42)}" fill="#050402" opacity=".92" filter="${soft2}"/>`;
    [[236, 330, 18], [372, 440, 24], [330, 320, 12], [250, 438, 14]].forEach(([x, y, r]) => s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#8a6a2a" opacity=".35" filter="${soft3}"/>`);
    [[206, 302, -24], [394, 302, 24], [200, 468, 24], [400, 468, -24]].forEach(([x, y, a]) => s += `<rect x="${x - 34}" y="${y - 9}" width="68" height="18" fill="#c4a246" opacity=".95" transform="rotate(${a} ${x} ${y})"/><rect x="${x - 34}" y="${y - 9}" width="68" height="18" fill="none" stroke="#8a6a20" stroke-width="1" transform="rotate(${a} ${x} ${y})"/>`);
    // hair scraped back, cap
    s += `<path d="M180,190 C190,110 240,74 300,72 C360,74 410,110 420,190 C400,140 360,112 300,110 C240,112 200,140 180,190Z" fill="#4a4a42"/>`;
    for (let i = 0; i < 16; i++) s += `<path d="M${190 + i * 14},${180 - Math.sin(i / 15 * Math.PI) * 60} Q${200 + i * 13},${110} ${300 + (i - 7.5) * 6},${78}" stroke="#8a8a80" stroke-width="1" fill="none" opacity=".6"/>`;
    if (o.cap !== false) {
      s += `<path d="M196,118 C210,40 390,40 404,118 C380,96 220,96 196,118Z" fill="#f2efe4"/><path d="M200,116 C240,92 360,92 400,116 L404,130 C360,108 240,108 196,130Z" fill="#e2ddcc"/>`;
      for (let i = 0; i < 22; i++) s += `<line x1="${202 + i * 9}" y1="${118 - Math.sin(i / 21 * Math.PI) * 18}" x2="${200 + i * 9.2}" y2="${130 - Math.sin(i / 21 * Math.PI) * 20}" stroke="#bdb6a0" stroke-width="1.2"/>`;
      s += `<path d="M206,110 C250,60 350,60 394,110" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>`;
    }
    return s;
  }
  const scareFinish = (K, s, tint) => K.done(s + (tint ? `<rect width="600" height="600" fill="${tint}" opacity=".08" style="mix-blend-mode:screen"/>` : '') + K.vignette(.9, 600, 600) + K.grain(.3, 600, 600), SVB);

  SC.s_face = () => {
    const K = kit(); let s = `<rect width="600" height="600" fill="${K.rad(id('bg'), [[0, '#0c1a10'], [1, '#000']], .5, .7, .8)}"/>`;
    s += `<path d="M40,600 Q70,500 300,486 Q530,500 560,600Z" fill="${NAVY}"/><path d="M226,494 L300,560 L374,494" stroke="#e8e6dc" stroke-width="10" fill="none"/><g transform="translate(408,556) rotate(180)"><circle r="24" fill="#d8d0b0" stroke="#8a7a40" stroke-width="5"/><path d="M0,0 v-16 M0,0 l9,6" stroke="#222" stroke-width="3"/></g>`;
    s += `<g transform="rotate(-9 300 300)">${face(K, { suck: 1, under: '#7affb0' })}</g>`;
    return scareFinish(K, s, GREEN);
  };
  SC.s_torch = () => {
    const K = kit(); let s = `<rect width="600" height="600" fill="#000"/>`;
    s += `<g transform="rotate(6 300 300) translate(0,-40)" opacity=".75">${face(K, { suck: .5, under: '#fff6c8' })}</g>`;
    s += `<rect width="600" height="600" fill="#000" opacity=".35"/>`;
    s += `<circle cx="310" cy="470" r="300" fill="${K.rad(id('tg'), [[0, '#ffffff', 1], [.14, '#fffbe6', .97], [.45, '#fff2b0', .4], [1, '#fff2b0', 0]])}"/>`;
    s += `<circle cx="310" cy="470" r="54" fill="#ffffff"/>`;
    s += `<path d="M260,600 L280,500 L340,500 L360,600Z" fill="#9aa0a4" opacity=".6"/>`;
    return scareFinish(K, s);
  };
  SC.s_hand = () => {
    const K = kit(); let s = `<rect width="600" height="600" fill="${K.rad(id('bg'), [[0, '#200808'], [1, '#000']], .5, .5, .7)}"/>`;
    // your forearm across the frame
    s += `<path d="M0,430 L600,300 L600,410 L0,560Z" fill="#c69a7c"/><path d="M0,430 L600,300" stroke="#a8785a" stroke-width="3"/><path d="M0,520 L600,380" stroke="#8a5a40" stroke-width="2" opacity=".5"/>`;
    s += `<path d="M0,390 L250,340 L250,420 L0,600Z" fill="#232a3a"/>`;
    // her sleeve from above
    s += `<path d="M600,0 L460,0 Q400,120 380,230 L470,250 Q520,120 600,90Z" fill="${NAVY}"/><path d="M380,230 L470,250" stroke="#e8e6dc" stroke-width="8"/>`;
    // the hand: palm on top, long wet fingers wrapping round under the arm
    s += `<path d="M376,232 Q330,260 330,320 Q332,352 360,360 Q420,370 470,340 Q480,300 470,250Z" fill="${SK}"/>`;
    const r = rng(8);
    for (let i = 0; i < 4; i++) {
      const x0 = 340 + i * 30, y0 = 340 + i * 6, x1 = x0 - 60 - i * 8, y1 = y0 + 90 + i * 8;
      s += `<path d="M${x0},${y0} C${x0 - 20},${y0 + 40} ${x1 + 30},${y1 - 10} ${x1},${y1}" stroke="${SK}" stroke-width="${19 - i * 1.5}" fill="none" stroke-linecap="round"/>`;
      for (let k = 1; k < 4; k++) { const t = k / 4, kx = x0 + (x1 - x0) * t - 6, ky = y0 + (y1 - y0) * t; s += `<path d="M${f(kx - 7)},${f(ky - 2)} q7,4 14,0" stroke="#6e746a" stroke-width="1.6" fill="none"/>`; }
      s += `<ellipse cx="${x1 + 2}" cy="${y1 + 4}" rx="6" ry="4" fill="#d8dcd0" transform="rotate(30 ${x1} ${y1})"/>`;
      s += `<circle cx="${f(x1 + r() * 10)}" cy="${f(y1 + 18 + r() * 12)}" r="3.4" fill="#bcd8e8" opacity=".8"/>`;
    }
    // the upside-down fob watch dangling
    s += `<path d="M440,120 L430,170" stroke="#8a7a40" stroke-width="3"/><g transform="translate(428,198) rotate(180)"><circle r="28" fill="#e2dac0" stroke="#8a7a40" stroke-width="6"/><path d="M0,0 v-18 M0,0 l10,6" stroke="#222" stroke-width="3"/>${Array.from({ length: 12 }, (_, i) => `<line x1="${f(Math.sin(i * Math.PI / 6) * 20)}" y1="${f(-Math.cos(i * Math.PI / 6) * 20)}" x2="${f(Math.sin(i * Math.PI / 6) * 24)}" y2="${f(-Math.cos(i * Math.PI / 6) * 24)}" stroke="#222" stroke-width="2"/>`).join('')}</g>`;
    s += `<rect x="190" y="430" width="120" height="60" fill="${GAUZE}" opacity=".9" transform="rotate(-18 250 460)"/><path d="M180,450 l40,-10 M300,470 l-30,10" stroke="${TAPE}" stroke-width="10" transform="rotate(-18 250 460)"/>`;
    return scareFinish(K, s, '#ff2a1a');
  };
  SC.s_sleeper = () => {
    const K = kit(); let s = `<rect width="600" height="600" fill="#030604"/>`;
    s += `<ellipse cx="300" cy="300" rx="320" ry="190" fill="#c8ccc0" opacity=".6"/>`;
    s += `<g transform="rotate(-16 300 300) translate(0,10)">${face(K, { cap: false, suck: .55, skin: '#9aa29a', look: [.75, .35], under: null })}</g>`;
    s += `<path d="M0,520 Q300,450 600,520 L600,600 L0,600Z" fill="#d8dcd0"/><path d="M0,520 Q300,450 600,520" stroke="#a8ac9e" stroke-width="4" fill="none"/>`;
    s += `<g transform="translate(470,540) rotate(-10)"><rect x="-50" y="-12" width="100" height="24" rx="4" fill="#f2f0e8"/><text x="0" y="5" font-family="Arial" font-size="13" font-weight="700" text-anchor="middle" fill="#2a3a8a">ADMITTED 03:03</text></g>`;
    return scareFinish(K, s, GREEN);
  };
})();
