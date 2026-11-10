/* NIGHTDOOR art for "Leave It Open": Isabel's bedroom, Gran's old wardrobe with a carved crown and a little
   brass lock, and the Hanger: a flat cut-out of pure black hanging from the rail on a hook where its head
   should be, coat-hanger shoulders, a body like a long coat, thin arms with far too many knuckles, and two
   eyes as bright as switched-on bulbs that drink the light out of the room.
   Adds scenes to ART (800x400) and jump scares (600x600) using the shared toolkit. */
(function () {
  'use strict';
  const { kit, f, mix, shade, rng, S, SC, SVB } = ART.lib;
  let N = 0;
  const id = p => 'lio' + p + (++N);

  const WALL = '#e7c9cf', WALL2 = '#dcb6be', FLOOR = '#8a6a52', WOOD = '#5a3a24', WOOD2 = '#734c30', WOOD3 = '#3e2716';
  const DUVET = '#8fb7e0', DUVET2 = '#6f97c4', PJ = '#b59ad8', SKIN = '#d9a07c', HAIR = '#3a2418', VOID = '#000000';
  const EYE = '#fff7d6', GOLD = '#ffcf5a';

  /* ---------- the Hanger's eyes: bulbs, with a halo that spills onto everything ---------- */
  function eyes(K, pts, r, o = {}) {
    const b = o.b == null ? 1 : o.b, col = o.coal ? '#ff7a1a' : GOLD, core = o.coal ? '#ffb070' : EYE;
    const halo = K.rad(id('h'), [[0, core, .9 * b], [.25, col, .5 * b], [1, col, 0]]);
    let s = '';
    pts.forEach(([x, y]) => { s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 7)}" fill="${halo}" style="mix-blend-mode:screen"/>`; });
    if (o.rays !== false && !o.coal) pts.forEach(([x, y]) => {
      s += `<g opacity="${f(.55 * b)}" stroke="${EYE}" stroke-linecap="round">`;
      [[r * 9, 0, 1.4], [0, r * 6, 1.1], [r * 5, r * 5, .7], [r * 5, -r * 5, .7]].forEach(([dx, dy, w]) => { s += `<line x1="${f(x - dx)}" y1="${f(y - dy)}" x2="${f(x + dx)}" y2="${f(y + dy)}" stroke-width="${f(w * r / 6)}"/>`; });
      s += `</g>`;
    });
    pts.forEach(([x, y]) => { s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 1.8)}" fill="${col}" opacity="${f(.85 * b)}"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${core}"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r * .26)}" fill="#1a1008" opacity="${o.coal ? .7 : .85}"/>`; });
    return s;
  }

  /* long thin fingers with too many knuckles. a = direction in degrees (0 = down), spread between fingers */
  function hand(x, y, a, len, o = {}) {
    const n = o.n || 5, spread = o.spread == null ? 11 : o.spread, w = o.w || 3.2, curl = o.curl || 0;
    let s = '';
    for (let i = 0; i < n; i++) {
      let ang = (a + (i - (n - 1) / 2) * spread) * Math.PI / 180, px = x, py = y, d = `M${f(x)},${f(y)}`;
      const segs = 5, L = len * (1 - Math.abs(i - (n - 1) / 2) * .08);
      for (let k = 0; k < segs; k++) {
        px += Math.sin(ang) * L / segs; py += Math.cos(ang) * L / segs; d += ` L${f(px)},${f(py)}`;
        if (k > 0 && k < segs - 1) s += `<circle cx="${f(px)}" cy="${f(py)}" r="${f(w * .75)}" fill="${VOID}"/>`;
        ang += curl * Math.PI / 180;
      }
      s += `<path d="${d}" stroke="${VOID}" stroke-width="${f(w)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    return s;
  }

  /* the Hanger. x = centre, top = tip of the hook, h = height. Sets EYES to its eye positions. */
  let EYES = [];
  function hanger(K, x, top, h, o = {}) {
    const k = h / 300;
    let g = `<g transform="translate(${f(x)},${f(top)}) scale(${f(k)})"${o.op ? ` opacity="${o.op}"` : ''}>`;
    if (o.edge !== false) g += `<g filter="${K.blur(id('e'), 3)}" opacity=".55"><path d="M-62,94 L0,42 L62,94 Q50,200 34,300 L-34,300 Q-50,200 -62,94Z" fill="none" stroke="${o.edgeC || '#3a3446'}" stroke-width="8"/></g>`;
    g += `<path d="M0,46 L0,18 C0,-2 -22,-4 -24,12 C-25,20 -16,24 -12,18" stroke="${VOID}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    const smoke = o.smoke ? ` filter="${K.rough(id('r'), 9)}"` : '';
    g += `<path${smoke} d="M0,40 L-64,92 Q-70,100 -60,102 Q-52,190 -34,300 L-26,292 L-18,304 L-8,290 L2,306 L12,290 L22,304 L34,300 Q52,190 60,102 Q70,100 64,92Z" fill="${VOID}"/>`;
    const arm = (side, ex, ey, ha) => {
      const sx = side * 58, sy = 100;
      g += `<path d="M${sx},${sy} Q${f((sx + ex) / 2 + side * 18)},${f((sy + ey) / 2)} ${f(ex)},${f(ey)}" stroke="${VOID}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      g += hand(ex, ey, ha, o.fingerLen || 70, { w: 3.6, curl: o.curl == null ? 6 * side : o.curl });
    };
    const L = o.armL || [-84, 238, 6], R = o.armR || [84, 238, -6];
    arm(-1, L[0], L[1], L[2]); arm(1, R[0], R[1], R[2]);
    if (o.smoke) for (let i = 0; i < 9; i++) { const sx = -50 + i * 12; g += `<path d="M${sx},${120 + (i % 3) * 40} q-10,-30 4,-60 q12,-26 -2,-56" stroke="#7a7480" stroke-width="5" fill="none" opacity=".35" stroke-linecap="round"/>`; }
    g += '</g>';
    EYES = [[x - 15 * k, top + 74 * k], [x + 15 * k, top + 74 * k]];
    return g;
  }

  /* ---------- Isabel and Mr Buttons ---------- */
  function face(x, y, r, o = {}) {
    let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="${SKIN}"/>`;
    s += `<path d="M${x - r},${y + r * .1} Q${x - r * 1.05},${y - r * 1.15} ${x},${y - r * 1.05} Q${x + r * 1.05},${y - r * 1.15} ${x + r},${y + r * .1} Q${x + r * .6},${y - r * .55} ${x},${y - r * .5} Q${x - r * .6},${y - r * .55} ${x - r},${y + r * .1}Z" fill="${HAIR}"/>`;
    if (o.hair) s += `<path d="M${x - r},${y} Q${x - r * 1.3},${y + r * 1.4} ${x - r * .6},${y + r * 2}" stroke="${HAIR}" stroke-width="${r * .5}" fill="none" stroke-linecap="round"/><path d="M${x + r},${y} Q${x + r * 1.3},${y + r * 1.4} ${x + r * .6},${y + r * 2}" stroke="${HAIR}" stroke-width="${r * .5}" fill="none" stroke-linecap="round"/>`;
    const lx = o.look ? o.look[0] * r * .12 : 0, ly = o.look ? o.look[1] * r * .12 : 0;
    s += `<ellipse cx="${x - r * .35}" cy="${y + r * .05}" rx="${r * .17}" ry="${r * .22}" fill="#fff"/><ellipse cx="${x + r * .35}" cy="${y + r * .05}" rx="${r * .17}" ry="${r * .22}" fill="#fff"/>`;
    s += `<circle cx="${f(x - r * .35 + lx)}" cy="${f(y + r * .07 + ly)}" r="${r * .1}" fill="#1a120c"/><circle cx="${f(x + r * .35 + lx)}" cy="${f(y + r * .07 + ly)}" r="${r * .1}" fill="#1a120c"/>`;
    s += `<path d="M${x - r * .55},${y - r * .28} L${x - r * .2},${y - r * .2} M${x + r * .55},${y - r * .28} L${x + r * .2},${y - r * .2}" stroke="${HAIR}" stroke-width="${r * .08}" stroke-linecap="round"/>`;
    s += `<ellipse cx="${x}" cy="${y + r * .5}" rx="${r * .1}" ry="${r * .13}" fill="#7a3a2a"/>`;
    return s;
  }
  function bear(x, y, s, o = {}) {
    const c = '#a0703e', c2 = '#c8945c';
    let g = `<g transform="translate(${f(x)},${f(y)}) scale(${f(s)})">`;
    g += `<circle cx="-11" cy="-30" r="6" fill="${c}"/><circle cx="11" cy="-30" r="6" fill="${c}"/><ellipse cx="0" cy="0" rx="14" ry="16" fill="${c}"/><circle cx="0" cy="-20" r="13" fill="${c}"/><ellipse cx="0" cy="-15" rx="6" ry="4.5" fill="${c2}"/><circle cx="0" cy="-17" r="1.8" fill="#2a1a10"/>`;
    g += `<circle cx="-5" cy="-23" r="2.6" fill="#3a2a5a" stroke="#1a1030" stroke-width=".8"/><circle cx="-5.5" cy="-23.5" r=".7" fill="#ccc"/><path d="M3,-26 l4,4 M7,-26 l-4,4" stroke="#2a1a10" stroke-width="1.3"/>`;
    g += `<ellipse cx="-14" cy="12" rx="6" ry="5" fill="${c}"/><ellipse cx="14" cy="12" rx="6" ry="5" fill="${c}"/>`;
    return g + '</g>';
  }

  /* ---------- the bedroom ---------- */
  const WX = 520, WR = 710, WM = 615; // wardrobe left, right, middle
  function wardrobe(K, o = {}) {
    const g = o.gap || 0;
    let s = '';
    // crown and carcass
    s += `<path d="M${WX - 8},70 L${WX - 8},58 Q${WM},26 ${WR + 8},58 L${WR + 8},70Z" fill="${WOOD2}"/><path d="M${WM - 26},44 q26,-26 52,0" stroke="${WOOD3}" stroke-width="4" fill="none"/><circle cx="${WM}" cy="36" r="5" fill="${WOOD3}"/>`;
    s += `<rect x="${WX}" y="70" width="${WR - WX}" height="262" fill="${WOOD}"/><rect x="${WX - 6}" y="326" width="${WR - WX + 12}" height="10" fill="${WOOD3}"/><rect x="${WX + 6}" y="336" width="12" height="10" fill="${WOOD3}"/><rect x="${WR - 18}" y="336" width="12" height="10" fill="${WOOD3}"/>`;
    // left door (always shut)
    s += `<rect x="${WX + 5}" y="76" width="${WM - WX - 7}" height="250" fill="${WOOD2}"/><rect x="${WX + 18}" y="92" width="${WM - WX - 33}" height="100" rx="6" fill="none" stroke="${WOOD3}" stroke-width="3"/><rect x="${WX + 18}" y="208" width="${WM - WX - 33}" height="100" rx="6" fill="none" stroke="${WOOD3}" stroke-width="3"/>`;
    // interior through the gap
    if (g > 0) {
      const cid = id('c'); K.defs.push(`<clipPath id="${cid}"><rect x="${WM}" y="76" width="${g}" height="250"/></clipPath>`);
      s += `<g clip-path="url(#${cid})"><rect x="${WM}" y="76" width="${g + 2}" height="250" fill="#030305"/>`;
      s += `<line x1="${WM}" y1="98" x2="${WR}" y2="98" stroke="#2a2a30" stroke-width="3"/>`;
      if (o.coats !== false) [[WM + 8, '#141a2a'], [WM + 60, '#1c1418']].forEach(([cx, c]) => { s += `<path d="M${cx},98 l-18,18 Q${cx - 24},200 ${cx - 16},300 L${cx + 16},300 Q${cx + 24},200 ${cx + 18},116Z" fill="${c}"/>`; });
      if (o.inside) s += o.inside;
      s += `</g>`;
    }
    // right door, swung out by g
    if (g < 92) {
      const tl = [WM + g, 76 - g * .12], tr = [WR - 5 + g * .3, 76], br = [WR - 5 + g * .3, 326], bl = [WM + g, 326 + g * .12];
      s += `<polygon points="${[tl, tr, br, bl].map(p => p.map(f).join(',')).join(' ')}" fill="${WOOD2}"/>`;
      const w = tr[0] - tl[0];
      if (w > 30) s += `<rect x="${f(tl[0] + w * .15)}" y="92" width="${f(w * .7)}" height="100" rx="6" fill="none" stroke="${WOOD3}" stroke-width="3"/><rect x="${f(tl[0] + w * .15)}" y="208" width="${f(w * .7)}" height="100" rx="6" fill="none" stroke="${WOOD3}" stroke-width="3"/>`;
      s += `<circle cx="${f(tl[0] + 8)}" cy="200" r="3.5" fill="#d8b04a"/>`;
      if (g > 2) s += `<rect x="${f(WM + g - 4)}" y="${f(76 - g * .12)}" width="4" height="${f(250 + g * .24)}" fill="${WOOD3}"/>`;
    } else {
      s += `<polygon points="${WR},74 ${WR + 60},50 ${WR + 60},350 ${WR},330" fill="${WOOD2}"/><polygon points="${WR},74 ${WR + 60},50 ${WR + 60},350 ${WR},330" fill="#000" opacity=".25"/>`;
    }
    // lock + key
    s += `<rect x="${WM - 10}" y="190" width="8" height="18" rx="2" fill="#c9a23a"/><circle cx="${WM - 6}" cy="196" r="1.8" fill="#2a1a08"/>`;
    if (o.key) s += `<path d="M${WM - 6},199 l0,10" stroke="#e0c050" stroke-width="2.4"/><circle cx="${WM - 6}" cy="214" r="4" fill="none" stroke="#e0c050" stroke-width="2.4"/>`;
    if (o.tape) { s += `<g opacity=".85">`; for (let i = 0; i < 7; i++) s += `<rect x="${WX - 6}" y="${100 + i * 32}" width="${WR - WX + 12}" height="11" fill="#d9c79a" transform="rotate(${(i % 2 ? 4 : -4)} ${WM} ${105 + i * 32})"/>`; s += `</g>`; }
    if (o.chair) s += `<path d="M${WM - 40},335 L${WM - 70},250 L${WM + 2},214 M${WM - 70},250 L${WM - 70},340 M${WM - 20},300 L${WM - 20},340" stroke="#e8e2d0" stroke-width="7" stroke-linecap="round" fill="none"/>`;
    return s;
  }

  function room(K, o = {}) {
    const mode = o.mode || 'night';
    let s = `<rect width="800" height="300" fill="${WALL}"/>`;
    // star wallpaper
    const r = rng(11);
    for (let i = 0; i < 46; i++) { const x = r() * 800, y = r() * 290; s += `<path d="M${f(x)},${f(y - 5)} l1.5,3.5 l3.8,.4 l-2.9,2.5 l.9,3.7 l-3.3,-2 l-3.3,2 l.9,-3.7 l-2.9,-2.5 l3.8,-.4Z" fill="${WALL2}"/>`; }
    s += `<rect y="292" width="800" height="10" fill="#f2ece0"/>`;
    s += `<path d="M0,302 L800,302 L800,400 L0,400Z" fill="${FLOOR}"/>`;
    for (let i = 0; i < 10; i++) s += `<line x1="0" y1="${310 + i * 10}" x2="800" y2="${310 + i * 10}" stroke="${shade(FLOOR, -.15)}" stroke-width="1"/>`;
    s += `<ellipse cx="300" cy="360" rx="190" ry="28" fill="#c87aa0" opacity=".8"/>`;
    // window + curtains
    const sky = mode === 'dusk' ? K.lin(id('sk'), [[0, '#2a1446'], [1, '#d0607a']]) : mode === 'day' || mode === 'lit' ? (mode === 'lit' ? '#0a1024' : '#a8d8f0') : '#060a1c';
    s += `<rect x="168" y="48" width="144" height="124" fill="${sky}"/><path d="M240,48 v124 M168,110 h144" stroke="#f2ece0" stroke-width="5"/><rect x="164" y="44" width="152" height="132" fill="none" stroke="#f2ece0" stroke-width="7"/>`;
    if (mode !== 'day') s += `<circle cx="282" cy="76" r="9" fill="#f6f0d8" opacity="${mode === 'dusk' ? .3 : .8}"/>`;
    s += `<path d="M150,36 L196,36 Q186,110 196,186 L150,186Z" fill="#8a5aa8"/><path d="M330,36 L284,36 Q294,110 284,186 L330,186Z" fill="#8a5aa8"/><rect x="140" y="30" width="200" height="8" rx="3" fill="#5a3a24"/>`;
    // shelf + things on the wall
    s += `<rect x="380" y="120" width="96" height="6" fill="#f2ece0"/><rect x="390" y="96" width="12" height="24" fill="#e26a6a"/><rect x="404" y="100" width="10" height="20" fill="#6ac0a0"/><rect x="416" y="94" width="14" height="26" fill="#e2c05a"/><circle cx="455" cy="108" r="12" fill="#f4d0e0"/>`;
    // alarm sensor in the corner
    s += `<path d="M760,10 L790,10 L786,34 L764,34Z" fill="#f4f2ec"/><circle cx="775" cy="26" r="4" fill="#3a1010"/>`;
    // wardrobe
    s += wardrobe(K, o);
    // bed
    s += `<rect x="28" y="168" width="22" height="160" rx="6" fill="#f2ece0"/><rect x="340" y="230" width="16" height="98" rx="5" fill="#f2ece0"/>`;
    s += `<rect x="40" y="262" width="310" height="44" fill="#f8f4ea"/><rect x="40" y="300" width="310" height="16" fill="#e2dccb"/>`;
    s += `<ellipse cx="96" cy="250" rx="46" ry="16" fill="#fff"/>`;
    const who = o.isabel || 'bed';
    if (who === 'sit') {
      s += `<path d="M78,300 L82,222 Q100,206 122,222 L126,300Z" fill="${PJ}"/>`;
      s += face(102, 196, 20, { hair: 1, look: o.look || [1, 0] });
      s += `<path d="M120,236 Q150,${o.armUp ? 200 : 250} ${o.armUp ? 176 : 160},${o.armUp ? 186 : 262}" stroke="${PJ}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
      if (o.torchBeam) s += `<rect x="168" y="178" width="34" height="14" rx="3" fill="#2a2a2a" transform="rotate(-8 168 186)"/>`;
    } else if (who === 'bed') {
      s += face(98, 244, 17, { look: o.look || [1, -.2] });
    }
    if (who !== 'none') {
      s += `<path d="M60,262 Q70,${who === 'hide' ? 196 : 238} 150,${who === 'hide' ? 200 : 248} Q260,236 352,262 L352,312 L60,312Z" fill="${DUVET}"/>`;
      s += `<path d="M90,280 Q200,262 330,280" stroke="${DUVET2}" stroke-width="4" fill="none"/>`;
      if (who === 'sit') s += `<path d="M60,270 Q200,256 352,268 L352,312 L60,312Z" fill="${DUVET}"/>`;
    } else {
      s += `<path d="M60,${o.stripped ? 300 : 268} Q200,${o.stripped ? 290 : 258} 352,${o.stripped ? 300 : 268} L352,312 L60,312Z" fill="${DUVET}" opacity="${o.stripped ? .5 : 1}"/>`;
    }
    if (o.bear !== false && who !== 'none') s += bear(who === 'sit' ? 64 : 146, who === 'sit' ? 256 : 250, .8);
    // bedside table, nightlight, phone, clock
    s += `<rect x="380" y="256" width="78" height="72" fill="#f2ece0"/><rect x="386" y="276" width="66" height="20" fill="#e2dccb"/><circle cx="419" cy="286" r="2.5" fill="#b0a890"/>`;
    s += `<path d="M396,256 a12,12 0 1,1 0,-.1 Z" fill="#f6e8b0"/><path d="M398,236 a10,10 0 1,0 8,16 a12,12 0 0,1 -8,-16Z" fill="#fff4c0"/>`;
    s += `<rect x="424" y="247" width="26" height="8" rx="2" fill="#1a1a22"/>`;
    if (o.clock !== false) s += `<rect x="440" y="226" width="34" height="20" rx="3" fill="#2a2a32"/><text x="457" y="241" font-family="monospace" font-size="11" text-anchor="middle" fill="#ff5a4a">${o.clock || '23:47'}</text>`;
    return s;
  }

  /* night: darken everything, then add the glowing things on top */
  function night(K, o = {}) {
    const dark = o.dark == null ? .8 : o.dark;
    let s = `<rect width="800" height="400" fill="${o.mode === 'dusk' ? '#2a1040' : '#05081c'}" opacity="${dark}"/>`;
    if (o.nightlight) s += `<circle cx="402" cy="246" r="60" fill="${K.rad(id('nl'), [[0, '#fff2b0', .7 * o.nightlight], [1, '#fff2b0', 0]])}"/><path d="M398,236 a10,10 0 1,0 8,16 a12,12 0 0,1 -8,-16Z" fill="#fff4c0" opacity="${o.nightlight}"/>`;
    if (o.phone) s += `<rect x="424" y="247" width="26" height="8" rx="2" fill="#bfe0ff"/><ellipse cx="437" cy="240" rx="40" ry="22" fill="${K.rad(id('ph'), [[0, '#bfe0ff', .55], [1, '#bfe0ff', 0]])}"/>`;
    if (o.sensor) s += `<circle cx="775" cy="26" r="4" fill="#ff2a1a"/><circle cx="775" cy="26" r="16" fill="${K.rad(id('se'), [[0, '#ff2a1a', .8], [1, '#ff2a1a', 0]])}"/>`;
    if (o.clock !== false) s += `<text x="457" y="241" font-family="monospace" font-size="11" text-anchor="middle" fill="#ff5a4a">${o.clock || '23:47'}</text>`;
    return s;
  }
  /* threads of light being pulled out of the room into the eyes */
  function drain(from, to, n = 5, op = .5) {
    const r = rng(from[0] + to[0]); let s = `<g stroke="${GOLD}" fill="none" stroke-linecap="round" opacity="${op}">`;
    for (let i = 0; i < n; i++) {
      const fx = from[0] + (r() - .5) * 30, fy = from[1] + (r() - .5) * 20, mx = (fx + to[0]) / 2 + (r() - .5) * 80, my = Math.min(fy, to[1]) - 30 - r() * 40;
      s += `<path d="M${f(fx)},${f(fy)} Q${f(mx)},${f(my)} ${f(to[0])},${f(to[1])}" stroke-width="${f(.8 + r() * 1.4)}" stroke-dasharray="${f(3 + r() * 6)} ${f(4 + r() * 8)}"/>`;
    }
    return s + '</g>';
  }
  function gapEyes(K, g, y = 150, b = 1, r = 5) {
    const cx = WM + Math.max(6, g / 2) + 2, sp = Math.min(13, 4 + g * .3);
    return eyes(K, [[cx - sp, y], [cx + sp, y]], r, { b });
  }
  const fin = (K, s, o = {}) => K.done(s + K.vignette(o.v == null ? .75 : o.v) + K.grain(o.g == null ? .16 : o.g));

  /* ---------- scenes ---------- */
  S.cover_lio = () => {
    const K = kit(); let s = room(K, { gap: 26, isabel: 'hide', clock: '02:22' });
    s += night(K, { dark: .84, sensor: 1, phone: 1, clock: '02:22' });
    s += `<g transform="translate(0,0)">${face(150, 214, 15, { look: [1, 0] })}</g><path d="M100,226 Q150,200 205,226 L205,250 L100,250Z" fill="${DUVET}"/><rect width="800" height="400" fill="#05081c" opacity=".45" style="mix-blend-mode:multiply"/>`;
    s += gapEyes(K, 26, 150, 1.1, 6);
    s += drain([402, 246], [WM + 15, 150], 5, .45);
    return fin(K, s, { v: .85 });
  };

  S.lio_crack = () => {
    const K = kit(); let s = room(K, { gap: 10, isabel: 'bed', look: [1, -.4] });
    s += night(K, { dark: .82, phone: 1, nightlight: .7 });
    s += gapEyes(K, 10, 150, 1, 4.5);
    return fin(K, s);
  };

  S.lio_duvet = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#0d1a3a"/>`;
    // inside a duvet tent: folds of blue lit by a phone
    for (let i = 0; i < 9; i++) s += `<path d="M${i * 100 - 40},0 Q${i * 100 + 10},200 ${i * 100 - 30},400" stroke="#1a2c58" stroke-width="40" fill="none" opacity=".7"/>`;
    s += `<ellipse cx="400" cy="300" rx="300" ry="160" fill="${K.rad(id('p'), [[0, '#9cc8ff', .55], [1, '#9cc8ff', 0]])}"/>`;
    s += `<rect x="360" y="280" width="80" height="120" rx="10" fill="#1a1a22"/><rect x="366" y="290" width="68" height="96" rx="4" fill="#d8ecff"/><rect x="370" y="296" width="60" height="30" rx="4" fill="#e8322a"/><text x="400" y="315" font-family="Arial" font-size="9" font-weight="700" text-anchor="middle" fill="#fff">ALERT</text>`;
    s += bear(250, 330, 1.6);
    // the strip of light at the edge, blocked by a shape
    s += `<rect x="0" y="372" width="800" height="10" fill="#ffd86a" opacity=".7"/><rect x="520" y="368" width="120" height="18" fill="#000"/>`;
    s += `<path d="M560,382 L540,400 M600,382 L620,400" stroke="#000" stroke-width="6"/>`;
    return fin(K, s, { v: .85, g: .2 });
  };

  S.lio_room_lit = () => {
    const K = kit(); let s = room(K, { mode: 'lit', gap: 0, isabel: 'sit', look: [1, 0] });
    s += `<rect width="800" height="400" fill="#ffd890" opacity=".08"/>`;
    // ceiling light
    s += `<path d="M380,0 L380,14 M360,14 L400,14 L392,30 L368,30Z" stroke="#f2ece0" stroke-width="3" fill="#fff6c8"/><circle cx="380" cy="28" r="60" fill="${K.rad(id('cl'), [[0, '#fff6c8', .6], [1, '#fff6c8', 0]])}"/>`;
    // Mum in the doorway at the far left edge: dressing gown
    s += `<g transform="translate(470,302)"><path d="M-26,0 L-22,-120 Q0,-138 22,-120 L26,0Z" fill="#c05a6a"/><path d="M-6,-120 L0,-70 L6,-120" stroke="#8a3a4a" stroke-width="3" fill="none"/><rect x="-6" y="-146" width="12" height="16" fill="${SKIN}"/>${face(0, -158, 16, { look: [1, .3] })}<path d="M-16,-170 Q0,-186 16,-170 Q22,-150 18,-140 M-16,-170 Q-22,-150 -18,-140" stroke="#7a4a2a" stroke-width="7" fill="none"/></g>`;
    s += `<circle cx="775" cy="26" r="4" fill="#3a1010"/>`;
    return fin(K, s, { v: .45, g: .12 });
  };

  S.lio_crack_wide = () => {
    const K = kit(); let s = room(K, { gap: 22, isabel: 'bed', look: [1, -.4], clock: '01:12' });
    s += night(K, { dark: .84, sensor: 1, nightlight: .3, clock: '01:12' });
    s += gapEyes(K, 22, 148, 1.1, 5);
    s += drain([402, 246], [WM + 13, 148], 6, .5);
    return fin(K, s);
  };

  S.lio_push = () => {
    const K = kit(); let s = room(K, { gap: 30, isabel: 'none', clock: '01:13' });
    s += night(K, { dark: .8, sensor: 1, clock: '01:13' });
    // Isabel pushing the door, seen from behind
    s += `<g transform="translate(700,330)"><path d="M-22,0 L-20,-90 Q0,-104 20,-90 L22,0Z" fill="${PJ}"/><circle cx="0" cy="-112" r="18" fill="${HAIR}"/><path d="M-16,-82 L-52,-130 M16,-82 L-36,-150" stroke="${PJ}" stroke-width="11" stroke-linecap="round"/><circle cx="-54" cy="-134" r="6" fill="${SKIN}"/><circle cx="-38" cy="-154" r="6" fill="${SKIN}"/></g>`;
    s += gapEyes(K, 30, 140, 1.2, 5);
    s += hand(WM + 20, 120, -150, 46, { n: 4, spread: 14, w: 3 });
    return fin(K, s);
  };

  S.lio_kitchen = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#f4ecd8"/>`;
    for (let x = 0; x < 800; x += 40) for (let y = 200; y < 250; y += 20) s += `<rect x="${x + (y / 20 % 2) * 20}" y="${y}" width="38" height="18" fill="#e6f0f2" stroke="#cad6d8"/>`;
    s += `<rect y="340" width="800" height="60" fill="#c8b090"/>`;
    // window over the counter + windowsill card
    s += `<rect x="380" y="46" width="260" height="144" fill="#a8d8f0"/><path d="M510,46 v144 M380,118 h260" stroke="#fff" stroke-width="6"/><rect x="374" y="40" width="272" height="156" fill="none" stroke="#fff" stroke-width="8"/><rect x="370" y="190" width="280" height="10" fill="#fff"/>`;
    s += `<circle cx="440" cy="160" r="22" fill="#7ac070"/><rect x="430" y="170" width="20" height="20" fill="#c0703a"/>`;
    s += `<g transform="rotate(-6 580 166)"><rect x="560" y="138" width="44" height="52" fill="#f6c0d0" stroke="#c07090" stroke-width="2"/><text x="582" y="162" font-family="Georgia" font-size="16" font-weight="700" text-anchor="middle" fill="#c03060">10</text><path d="M570,176 q12,-6 24,0" stroke="#c03060" stroke-width="2" fill="none"/></g>`;
    // fridge with note
    s += `<rect x="40" y="56" width="140" height="300" rx="10" fill="#f8f8fa" stroke="#d0d0d8" stroke-width="3"/><line x1="40" y1="200" x2="180" y2="200" stroke="#d0d0d8" stroke-width="3"/><rect x="160" y="90" width="7" height="80" rx="3" fill="#b0b0b8"/><rect x="160" y="220" width="7" height="90" rx="3" fill="#b0b0b8"/>`;
    s += `<g transform="rotate(4 110 148)"><rect x="76" y="114" width="70" height="66" fill="#fff59a"/><circle cx="111" cy="117" r="5" fill="#e04040"/>${[0, 1, 2, 3].map(i => `<line x1="84" y1="${132 + i * 11}" x2="${138 - (i % 2) * 14}" y2="${132 + i * 11}" stroke="#3a3a8a" stroke-width="2"/>`).join('')}</g>`;
    s += `<rect x="60" y="230" width="34" height="26" fill="#9ad0f0" transform="rotate(-5 77 243)"/><circle cx="130" cy="240" r="10" fill="#f0a040"/>`;
    // counter, drawers, biscuit tin, kettle
    s += `<rect x="220" y="250" width="440" height="12" fill="#6a4a30"/><rect x="226" y="262" width="428" height="80" fill="#e8dcc4"/>`;
    for (let i = 0; i < 3; i++) { s += `<rect x="${246 + i * 140}" y="272" width="128" height="38" fill="#f4ead6" stroke="#c8b898" stroke-width="2"/><rect x="${294 + i * 140}" y="288" width="32" height="6" rx="3" fill="#a89878"/>`; }
    s += `<rect x="430" y="208" width="62" height="42" rx="6" fill="#c0303a"/><rect x="426" y="202" width="70" height="10" rx="4" fill="#a0202a"/><text x="461" y="234" font-family="Georgia" font-size="11" text-anchor="middle" fill="#ffe8a0">BISCUITS</text>`;
    s += `<path d="M260,250 L264,212 Q280,200 296,212 L300,250Z" fill="#c8ccd4"/><path d="M296,220 q16,4 10,20" stroke="#c8ccd4" stroke-width="5" fill="none"/>`;
    // table edge, Dad's mug, cereal
    s += `<rect x="680" y="280" width="140" height="14" fill="#8a6040"/><rect x="700" y="294" width="10" height="70" fill="#6a4a30"/><rect x="720" y="244" width="22" height="36" fill="#f0d040"/><rect x="760" y="258" width="20" height="22" rx="3" fill="#2a6aa0"/>`;
    return K.done(s + K.grain(.1));
  };
  S.lio_kitchen2 = () => {
    const K = kit();
    let s = `<rect width="800" height="400" fill="#e8dcc4"/>`;
    s += `<rect x="380" y="46" width="260" height="144" fill="#bcc8d4"/><path d="M510,46 v144 M380,118 h260" stroke="#fff" stroke-width="6"/><rect x="374" y="40" width="272" height="156" fill="none" stroke="#fff" stroke-width="8"/>`;
    for (let i = 0; i < 6; i++) s += `<line x1="${390 + i * 44}" y1="50" x2="${370 + i * 44}" y2="186" stroke="#8aa0b8" stroke-width="2" opacity=".6"/>`;
    s += `<rect x="40" y="56" width="140" height="300" rx="10" fill="#f0f0f2" stroke="#d0d0d8" stroke-width="3"/><line x1="40" y1="200" x2="180" y2="200" stroke="#d0d0d8" stroke-width="3"/>`;
    s += `<rect x="220" y="250" width="440" height="12" fill="#6a4a30"/><rect x="226" y="262" width="428" height="80" fill="#e0d2b8"/><rect y="340" width="800" height="60" fill="#b8a080"/>`;
    // Mum and Dad at the table, Dad with dark rings round his eyes
    s += `<rect x="250" y="300" width="380" height="14" fill="#8a6040"/>`;
    s += `<g transform="translate(330,300)"><path d="M-28,0 L-24,-80 Q0,-96 24,-80 L28,0Z" fill="#c05a6a"/>${face(0, -108, 20, { look: [1, 0] })}<path d="M-20,-120 Q0,-140 20,-120 Q28,-100 22,-80 M-20,-120 Q-28,-100 -22,-80" stroke="#7a4a2a" stroke-width="8" fill="none"/></g>`;
    s += `<g transform="translate(540,300)"><path d="M-32,0 L-28,-90 Q0,-106 28,-90 L32,0Z" fill="#4a6a8a"/>${face(0, -120, 22, { look: [-1, .4] })}<ellipse cx="-8" cy="-114" rx="6" ry="3" fill="#5a3a4a" opacity=".6"/><ellipse cx="8" cy="-114" rx="6" ry="3" fill="#5a3a4a" opacity=".6"/><rect x="18" y="-60" width="16" height="22" rx="3" fill="#f0f0f0"/></g>`;
    return K.done(s + K.vignette(.35) + K.grain(.1));
  };

  S.lio_school = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#eef0e4"/>`;
    s += `<rect x="200" y="40" width="400" height="150" fill="#fff" stroke="#9aa0a8" stroke-width="6"/><text x="230" y="90" font-family="Comic Sans MS, cursive" font-size="26" fill="#2a4a9a">7 x 8 = ?</text><text x="230" y="140" font-family="Comic Sans MS, cursive" font-size="22" fill="#2a4a9a">Long division p.42</text>`;
    s += `<rect x="40" y="50" width="120" height="90" fill="#f8d870"/><rect x="640" y="50" width="120" height="90" fill="#9ad0a0"/><rect x="0" y="260" width="800" height="140" fill="#c8b490"/>`;
    // desks + children from behind
    [[150, '#3a5a9a'], [330, '#9a3a5a'], [520, '#3a7a5a'], [700, '#7a5a3a']].forEach(([x, c], i) => {
      s += `<g transform="translate(${x},300)"><path d="M-26,0 L-22,-60 Q0,-74 22,-60 L26,0Z" fill="${c}"/><circle cx="0" cy="-84" r="20" fill="${i % 2 ? '#2a1a10' : '#6a4a2a'}"/></g>`;
    });
    s += `<rect x="60" y="300" width="700" height="18" fill="#a07850"/>`;
    // Isabel's bag glowing red
    s += `<path d="M380,340 L470,340 L478,396 L372,396Z" fill="#7a3aa0"/><rect x="404" y="330" width="44" height="22" rx="4" fill="#1a1a22"/><rect x="408" y="333" width="36" height="16" rx="2" fill="#ff4a3a"/><ellipse cx="426" cy="340" rx="80" ry="40" fill="${K.rad(id('b'), [[0, '#ff4a3a', .5], [1, '#ff4a3a', 0]])}"/>`;
    s += `<path d="M560,400 L600,330 Q610,318 622,326 L640,340" stroke="${SKIN}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M560,400 L590,348" stroke="#4a6a3a" stroke-width="26"/>`;
    return K.done(s + K.vignette(.3) + K.grain(.1));
  };

  S.lio_dusk = () => {
    const K = kit(); let s = room(K, { mode: 'dusk', gap: 0, isabel: 'none', tape: 1, clock: '19:45' });
    s += night(K, { mode: 'dusk', dark: .5, clock: '19:45' });
    s += `<rect x="168" y="48" width="144" height="124" fill="#e07a7a" opacity=".2"/>`;
    return fin(K, s, { v: .6 });
  };
  S.lio_dusk2 = () => {
    const K = kit(); let s = room(K, { mode: 'dusk', gap: 0, isabel: 'sit', look: [1, 0], chair: 1, key: 1, clock: '21:10' });
    s += night(K, { mode: 'dusk', dark: .55, nightlight: .9, clock: '21:10' });
    return fin(K, s, { v: .6 });
  };

  S.lio_night2 = () => {
    const K = kit(); let s = room(K, { gap: 34, isabel: 'bed', look: [0, 0], clock: '23:59' });
    s += night(K, { dark: .84, sensor: 1, phone: 1, clock: '23:59' });
    // Isabel's eyes squeezed shut
    s += `<rect x="86" y="236" width="24" height="12" fill="${SKIN}"/><path d="M86,244 q6,-4 10,0 M100,244 q6,-4 10,0" stroke="#1a120c" stroke-width="2" fill="none"/>`;
    s += gapEyes(K, 34, 146, 1.2, 5.5);
    // smoke alarm on the landing, through the open door at the left
    s += `<path d="M0,0 L0,8 Q20,4 40,10" stroke="none"/>`;
    return fin(K, s);
  };

  S.lio_dad = () => {
    const K = kit(); let s = room(K, { gap: 44, isabel: 'sit', look: [1, -.2], clock: '00:06' });
    s += night(K, { dark: .78, sensor: 1, clock: '00:06' });
    // Dad in front of the wardrobe, back to it
    s += `<g transform="translate(580,334)"><path d="M-16,0 L-14,-70 M16,0 L14,-70" stroke="${SKIN}" stroke-width="13"/><rect x="-26" y="-92" width="52" height="30" fill="#3a5a8a"/><path d="M-30,-90 L-28,-170 Q0,-186 28,-170 L30,-90Z" fill="#8a8a92"/>${face(0, -196, 22, { look: [-1, 0] })}<path d="M-28,-160 L-54,-110 M28,-160 L44,-230" stroke="#8a8a92" stroke-width="13" stroke-linecap="round"/></g>`;
    s += `<rect width="800" height="400" fill="#05081c" opacity=".35"/>`;
    s += gapEyes(K, 44, 118, 1.1, 5);
    // long hands resting on Dad's shoulders
    s += `<path d="M${WM + 10},150 Q596,150 600,166" stroke="${VOID}" stroke-width="6" fill="none"/>${hand(600, 166, -20, 30, { n: 5, spread: 16, w: 3, curl: 14 })}`;
    s += `<path d="M${WM + 26},160 Q570,140 560,166" stroke="${VOID}" stroke-width="6" fill="none"/>${hand(560, 166, 20, 30, { n: 5, spread: 16, w: 3, curl: -14 })}`;
    return fin(K, s);
  };

  S.lio_fingers = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#120806"/>`;
    // close-up: the door edge, the black gap, fingers round the edge
    s += `<rect x="0" y="0" width="300" height="400" fill="${WOOD2}"/><rect x="40" y="40" width="220" height="320" rx="10" fill="none" stroke="${WOOD3}" stroke-width="6"/><rect x="250" y="160" width="20" height="44" rx="3" fill="#c9a23a"/><circle cx="260" cy="174" r="4" fill="#2a1a08"/>`;
    s += `<rect x="300" y="0" width="150" height="400" fill="#000"/>`;
    s += `<polygon points="450,0 800,-40 800,440 450,400" fill="${WOOD2}"/><rect x="450" y="0" width="14" height="400" fill="${WOOD3}"/><polygon points="520,60 760,30 760,370 520,340" fill="none" stroke="${WOOD3}" stroke-width="6"/>`;
    s += eyes(K, [[350, 150], [398, 150]], 13, { b: 1.2 });
    for (let i = 0; i < 4; i++) {
      const y = 210 + i * 30;
      s += `<path d="M430,${y} L470,${y - 6} L500,${y + 2} L522,${y + 16} L530,${y + 32}" stroke="${VOID}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      [[470, y - 6], [500, y + 2], [522, y + 16]].forEach(([x, yy]) => s += `<circle cx="${x}" cy="${yy}" r="6" fill="${VOID}"/>`);
    }
    s += `<rect x="600" y="300" width="120" height="56" rx="6" fill="#2a2a32"/><text x="660" y="338" font-family="monospace" font-size="28" text-anchor="middle" fill="#ff3a2a">02:22</text>`;
    return fin(K, s, { v: .85 });
  };

  S.lio_landing = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#141826"/>`;
    s += `<rect y="300" width="800" height="100" fill="#2a2030"/>`;
    for (let i = 0; i < 16; i++) s += `<rect x="${20 + i * 50}" y="250" width="8" height="70" fill="#3a3044"/>`;
    s += `<rect x="0" y="244" width="800" height="12" fill="#4a3c50"/>`;
    s += `<circle cx="400" cy="30" r="22" fill="#e8e6e0"/><circle cx="400" cy="34" r="4" fill="#ff2a1a"/><circle cx="400" cy="34" r="30" fill="${K.rad(id('sm'), [[0, '#ff2a1a', .6], [1, '#ff2a1a', 0]])}"/>`;
    s += `<path d="M370,22 q-14,10 0,20 M430,22 q14,10 0,20 M356,16 q-22,16 0,32 M444,16 q22,16 0,32" stroke="#ff8a80" stroke-width="2" fill="none" opacity=".6"/>`;
    return K.done(s + K.vignette(.8) + K.grain(.18));
  };

  S.lio_panel = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#1a1c24"/>`;
    s += `<rect x="560" y="0" width="200" height="400" fill="#2a2420"/><rect x="580" y="40" width="160" height="340" fill="#1e1a16"/><circle cx="600" cy="230" r="6" fill="#c9a23a"/>`;
    s += `<rect x="250" y="70" width="230" height="270" rx="14" fill="#efeee8"/><rect x="274" y="94" width="182" height="56" rx="4" fill="#0a2a10"/><text x="365" y="118" font-family="monospace" font-size="15" text-anchor="middle" fill="#7aff8a">ENTER CODE</text><text x="365" y="140" font-family="monospace" font-size="15" text-anchor="middle" fill="#7aff8a">TO SET _ _ _ _</text>`;
    s += `<rect x="274" y="94" width="182" height="56" rx="4" fill="${K.rad(id('g'), [[0, '#7aff8a', .2], [1, '#7aff8a', 0]])}"/>`;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) s += `<rect x="${290 + c * 52}" y="${164 + r * 36}" width="44" height="28" rx="6" fill="#d8d6ce"/><text x="${312 + c * 52}" y="${183 + r * 36}" font-family="Arial" font-size="14" text-anchor="middle" fill="#3a3a3a">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'][r * 3 + c]}</text>`;
    s += `<circle cx="140" cy="200" r="36" fill="#d0202a" stroke="#efeee8" stroke-width="10"/><text x="140" y="206" font-family="Arial" font-size="13" font-weight="700" text-anchor="middle" fill="#fff">PANIC</text>`;
    s += `<rect x="40" y="250" width="200" height="60" fill="#fff59a" transform="rotate(-4 140 280)"/><text x="140" y="286" font-family="Comic Sans MS, cursive" font-size="14" text-anchor="middle" fill="#3a3a8a" transform="rotate(-4 140 280)">PANIC = ALL LIGHTS ON</text>`;
    return K.done(s + K.vignette(.75) + K.grain(.14));
  };

  S.lio_alarms = () => {
    const K = kit(); let s = room(K, { gap: 40, isabel: 'sit', look: [-1, 0], clock: '23:58' });
    s += night(K, { dark: .82, sensor: 1, phone: 1, clock: '23:58' });
    // sound rings from the phone and the sensor, alert cards stacked over the room
    [[437, 246], [775, 26]].forEach(([x, y]) => { for (let i = 1; i < 4; i++) s += `<circle cx="${x}" cy="${y}" r="${i * 22}" fill="none" stroke="#ff6a5a" stroke-width="2" opacity="${.6 - i * .15}"/>`; });
    s += gapEyes(K, 40, 150, .9, 5);
    s += `<g transform="rotate(-4 150 120)"><rect x="60" y="80" width="190" height="44" rx="10" fill="#1c1c20" opacity=".92"/><rect x="60" y="80" width="6" height="44" fill="#e8322a"/><text x="76" y="98" font-family="Arial" font-size="11" font-weight="700" fill="#fff">Emergency alert</text><text x="76" y="114" font-family="Arial" font-size="10" fill="#ff8a80">IT IS IN THE HOUSE</text></g>`;
    return fin(K, s);
  };

  S.lio_open = () => {
    const K = kit(); let s = room(K, { gap: 120, isabel: 'sit', look: [1, -.3], clock: '02:22', coats: false, inside: '' });
    s += night(K, { dark: .85, nightlight: .25, clock: '02:22' });
    s += hanger(K, WM + 4, 66, 270, { edgeC: '#4a3a20' });
    s += eyes(K, EYES, 6, { b: 1.25 });
    s += drain([402, 246], EYES[0], 6, .6) + drain([240, 110], EYES[1], 5, .5);
    return fin(K, s, { v: .8 });
  };

  S.lio_door = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#2a1c22"/>`;
    s += `<rect x="260" y="20" width="280" height="380" fill="#efe6dc"/><rect x="290" y="50" width="220" height="140" rx="6" fill="none" stroke="#d0c4b4" stroke-width="5"/><rect x="290" y="210" width="220" height="170" rx="6" fill="none" stroke="#d0c4b4" stroke-width="5"/><rect x="480" y="200" width="40" height="12" rx="5" fill="#c9a23a"/>`;
    s += `<text x="400" y="122" font-family="Georgia" font-size="28" text-anchor="middle" fill="#c86a9a">ISABEL</text>`;
    s += `<path d="M560,400 L520,230 Q514,206 498,212" stroke="${SKIN}" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M560,400 L536,300" stroke="${PJ}" stroke-width="40"/>`;
    s += `<rect width="800" height="400" fill="#05081c" opacity=".55"/>`;
    s += `<circle cx="400" cy="200" r="380" fill="${K.rad(id('sp'), [[0, '#ffe08a', .35], [1, '#ffe08a', 0]], .3, .55, .7)}" style="mix-blend-mode:screen"/>`;
    // its shadow cast on the door: a hook and hanger shoulders
    s += `<g opacity=".7">${hanger(K, 400, 40, 360, { edge: false })}</g>`;
    return fin(K, s, { v: .85 });
  };

  S.lio_torch = () => {
    const K = kit(); let s = room(K, { gap: 120, isabel: 'sit', armUp: 1, torchBeam: 1, look: [1, -.3], clock: '02:24', coats: false });
    s += night(K, { dark: .8, clock: '02:24' });
    s += `<polygon points="200,180 ${WM - 50},70 ${WM + 70},70 210,196" fill="${K.lin(id('bm'), [[0, '#fffbe8', .9], [1, '#fffbe8', .25]], 0, 0, 1, 0)}"/>`;
    s += hanger(K, WM + 18, 70, 260, { smoke: 1, armL: [-90, 140, 120], armR: [90, 210, -20] });
    s += eyes(K, EYES, 5, { b: .8 });
    s += `<rect x="168" y="178" width="34" height="14" rx="3" fill="#2a2a2a" transform="rotate(-8 168 186)"/><circle cx="200" cy="182" r="10" fill="#fffbe8"/>`;
    return fin(K, s, { v: .7 });
  };

  S.lio_backed = () => {
    const K = kit(); let s = room(K, { gap: 120, isabel: 'sit', look: [1, 0], clock: '02:24', coats: false });
    s += night(K, { dark: .82, clock: '02:24' });
    s += `<g transform="translate(${WM + 50},300) scale(1,-.5) translate(${-(WM + 50)},-300)" opacity=".9">${hanger(K, WM + 50, 120, 200, { smoke: 1, edge: false, armL: [-40, 260, 10], armR: [50, 250, -10] })}</g>`;
    s += eyes(K, [[WM + 38, 250], [WM + 60, 252]], 5, { coal: 1, b: .9 });
    return fin(K, s, { v: .8 });
  };

  S.lio_close = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#000"/>`;
    s += `<rect width="800" height="400" fill="${K.rad(id('w'), [[0, '#fffbe8', 1], [.3, '#ffd870', .8], [1, '#3a2010', .4]])}"/>`;
    s += `<path d="M0,0 L800,0 L800,60 Q400,140 0,60Z" fill="#000"/>`;
    s += eyes(K, [[320, 170], [480, 170]], 28, { b: 1.4 });
    s += hand(260, 40, 30, 200, { n: 5, spread: 9, w: 9, curl: 4 }) + hand(540, 40, -30, 200, { n: 5, spread: 9, w: 9, curl: -4 });
    s += `<path d="M0,330 Q400,300 800,330 L800,400 L0,400Z" fill="${DUVET}"/><path d="M0,330 Q400,300 800,330 L800,400 L0,400Z" fill="#000" opacity=".4"/>`;
    return K.done(s + K.grain(.2));
  };

  /* ---------- endings ---------- */
  S.lio_end_clear = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="${K.lin(id('d'), [[0, '#2a3a6a'], [.6, '#e8a0a0'], [1, '#ffe0b0']])}"/>`;
    s += `<rect y="320" width="800" height="80" fill="#4a7a4a"/>`;
    s += `<rect x="220" y="110" width="360" height="220" fill="#d8c0a8"/><path d="M200,114 L400,30 L600,114Z" fill="#7a4a3a"/>`;
    [[250, 140], [340, 140], [440, 140], [530, 140], [250, 230], [530, 230]].forEach(([x, y]) => { s += `<rect x="${x - 10}" y="${y - 10}" width="70" height="66" fill="${K.rad(id('wl'), [[0, '#fff6c0', .8], [1, '#fff6c0', 0]])}"/><rect x="${x}" y="${y}" width="50" height="46" fill="#ffe9a0" stroke="#fff" stroke-width="4"/>`; });
    s += `<rect x="370" y="236" width="60" height="94" fill="#2a5a8a"/><rect x="360" y="226" width="80" height="10" fill="#fff6c0"/>`;
    // family in the doorway glow
    s += `<g transform="translate(400,330)"><path d="M-46,0 L-44,-60 Q-34,-70 -24,-60 L-22,0Z" fill="#3a2a2a"/><circle cx="-34" cy="-72" r="10" fill="#3a2a2a"/><path d="M22,0 L24,-62 Q34,-72 44,-62 L46,0Z" fill="#3a2a2a"/><circle cx="34" cy="-74" r="10" fill="#3a2a2a"/><path d="M-12,0 L-10,-40 Q0,-48 10,-40 L12,0Z" fill="#3a2a2a"/><circle cx="0" cy="-50" r="8" fill="#3a2a2a"/></g>`;
    // garden: the burnt hanger
    s += `<path d="M640,350 l30,-20 l30,20 Z M670,330 l0,-10 q0,-8 -6,-6" stroke="#1a1a1a" stroke-width="3" fill="none"/><path d="M670,320 q-8,-20 4,-36 q10,-16 -2,-30" stroke="#7a7480" stroke-width="4" fill="none" opacity=".5"/>`;
    s += `<g transform="translate(40,30)"><rect width="230" height="56" rx="12" fill="#1c1c20" opacity=".94"/><rect width="6" height="56" fill="#3cb054"/><circle cx="26" cy="28" r="12" fill="#3cb054"/><text x="26" y="33" font-family="Arial" font-size="14" font-weight="700" text-anchor="middle" fill="#fff">✓</text><text x="46" y="22" font-family="Arial" font-size="11" font-weight="700" fill="#fff">Emergency alert</text><text x="46" y="38" font-family="Arial" font-size="10" fill="#9fe6ad">ALL CLEAR</text><text x="46" y="50" font-family="Arial" font-size="9" fill="#ccc">The threat has ended.</text></g>`;
    return K.done(s + K.vignette(.35) + K.grain(.1));
  };

  S.lio_end_locked = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="${K.lin(id('m'), [[0, '#f0b070'], [1, '#fbe0b0']])}"/>`;
    s += `<circle cx="660" cy="110" r="44" fill="#fff0c0"/><rect y="300" width="800" height="100" fill="#8a8a7a"/>`;
    // skips at the tip
    s += `<path d="M40,300 L80,220 L330,220 L370,300Z" fill="#e8a020"/><text x="205" y="270" font-family="Arial" font-size="20" font-weight="700" text-anchor="middle" fill="#5a3a10">GENERAL WASTE</text>`;
    // van with the wardrobe strapped down, lying flat
    s += `<rect x="430" y="210" width="300" height="90" rx="10" fill="#f2f2f4"/><rect x="430" y="240" width="300" height="10" fill="#4a7ac0"/><circle cx="490" cy="304" r="22" fill="#2a2a2a"/><circle cx="670" cy="304" r="22" fill="#2a2a2a"/>`;
    s += `<rect x="440" y="150" width="270" height="60" fill="${WOOD}"/><rect x="446" y="156" width="258" height="48" fill="${WOOD2}"/><path d="M710,150 q30,30 0,60" fill="${WOOD2}"/>`;
    [490, 580, 660].forEach(x => s += `<rect x="${x}" y="146" width="12" height="70" fill="#e8c020"/>`);
    s += `<circle cx="575" cy="182" r="3" fill="#ffcf5a"/><circle cx="575" cy="182" r="10" fill="#ffcf5a" opacity=".25"/>`;
    return K.done(s + K.vignette(.3) + K.grain(.1));
  };

  S.lio_end_trade = () => {
    const K = kit(); let s = room(K, { mode: 'dusk', gap: 0, isabel: 'none', key: 1, clock: '--:--' });
    s += night(K, { mode: 'dusk', dark: .55, clock: '--:--' });
    // one button on the carpet by the wardrobe
    s += `<circle cx="600" cy="358" r="7" fill="#3a2a5a" stroke="#1a1030" stroke-width="1.5"/><circle cx="598" cy="356" r="1.5" fill="#ccc"/><circle cx="600" cy="358" r="30" fill="${K.rad(id('bt'), [[0, '#ffe8b0', .35], [1, '#ffe8b0', 0]])}"/>`;
    s += `<g transform="translate(560,350)">${face(0, -12, 13, { look: [0, -1] })}</g><path d="M520,400 Q560,330 600,400Z" fill="${PJ}"/>`;
    return fin(K, s, { v: .6 });
  };

  S.lio_end_taken = () => {
    const K = kit(); let s = room(K, { mode: 'day', gap: 8, isabel: 'none', stripped: 1, clock: '07:00' });
    s += `<rect width="800" height="400" fill="#bcc8e0" opacity=".25"/>`;
    s += `<rect x="424" y="247" width="26" height="8" rx="2" fill="#ff4a3a"/><ellipse cx="437" cy="244" rx="30" ry="16" fill="${K.rad(id('ph'), [[0, '#ff4a3a', .5], [1, '#ff4a3a', 0]])}"/>`;
    s += gapEyes(K, 8, 150, .5, 3);
    return fin(K, s, { v: .55 });
  };

  S.lio_end_parents = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#1a0c10"/>`;
    s += `<rect x="230" y="20" width="340" height="380" fill="#f8e0b0"/><rect x="230" y="20" width="340" height="380" fill="${K.rad(id('l'), [[0, '#fff0c0', .9], [1, '#c08a40', .2]])}"/>`;
    s += `<polygon points="230,20 160,0 160,400 230,400" fill="#efe6dc"/><polygon points="230,20 160,0 160,400 230,400" fill="#000" opacity=".5"/>`;
    // two flat black parent shapes
    const parent = (x, h, hair) => `<g transform="translate(${x},400)"><path d="M-40,0 L-36,${-h * .55} Q-30,${-h * .7} -18,${-h * .72} L18,${-h * .72} Q30,${-h * .7} 36,${-h * .55} L40,0Z" fill="#000"/><rect x="-8" y="${-h * .78}" width="16" height="${h * .08}" fill="#000"/><ellipse cx="0" cy="${-h * .86}" rx="${hair ? 26 : 22}" ry="28" fill="#000"/>${hair ? `<path d="M-26,${-h * .86} Q-34,${-h * .7} -24,${-h * .64} L26,${-h * .64} Q34,${-h * .7} 26,${-h * .86}Z" fill="#000"/>` : ''}<path d="M30,${-h * .6} L60,${-h * .4}" stroke="#000" stroke-width="14" stroke-linecap="round"/></g>`;
    s += parent(330, 360, 1) + parent(470, 380, 0);
    s += eyes(K, [[320, 92], [340, 92]], 4.5, { b: 1.2 }) + eyes(K, [[460, 76], [480, 76]], 4.5, { b: 1.2 });
    s += `<path d="M390,250 L410,250" stroke="#000" stroke-width="14" stroke-linecap="round"/>`;
    return fin(K, s, { v: .8 });
  };

  S.lio_end_face = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#fffbe8"/>`;
    s += `<rect width="800" height="400" fill="${K.rad(id('w'), [[0, '#ffffff', 1], [.5, '#ffe9a0', .9], [1, '#8a5a20', .8]])}"/>`;
    s += hand(400, -40, 0, 380, { n: 5, spread: 16, w: 26, curl: 0 });
    s += `<ellipse cx="400" cy="-20" rx="120" ry="70" fill="#000"/>`;
    return K.done(s + K.vignette(.6, 800, 400, '#2a1a00') + K.grain(.2));
  };

  /* ---------- jump scares (600x600) ---------- */
  const sfin = (K, s) => K.done(s + K.vignette(.9, 600, 600) + K.grain(.3, 600, 600), SVB);

  SC.s_lio_eyes = () => {
    const K = kit(); let s = `<rect width="600" height="600" fill="#000"/>`;
    s += `<rect x="0" y="0" width="200" height="600" fill="${WOOD2}"/><rect x="420" y="0" width="180" height="600" fill="${WOOD2}"/><rect x="190" y="0" width="14" height="600" fill="${WOOD3}"/><rect x="408" y="0" width="14" height="600" fill="${WOOD3}"/>`;
    s += `<rect x="200" y="0" width="208" height="600" fill="#000"/>`;
    s += eyes(K, [[262, 250], [346, 250]], 26, { b: 1.4 });
    return sfin(K, s);
  };
  SC.s_lio_peek = () => {
    const K = kit(); let s = `<rect width="600" height="600" fill="#0d1a3a"/>`;
    s += `<path d="M0,0 L600,0 L600,140 Q300,240 0,140Z" fill="${DUVET2}"/><path d="M0,140 Q300,240 600,140" stroke="#ffe08a" stroke-width="6" fill="none"/>`;
    s += `<path d="M0,160 Q300,260 600,160 L600,600 L0,600Z" fill="#000"/>`;
    s += eyes(K, [[200, 360], [400, 360]], 46, { b: 1.5 });
    return sfin(K, s);
  };
  SC.s_lio_gap = () => {
    const K = kit(); let s = `<rect width="600" height="600" fill="${WOOD2}"/>`;
    s += `<polygon points="250,0 350,0 380,600 230,600" fill="#000"/>`;
    s += eyes(K, [[280, 260], [326, 262]], 16, { b: 1.4 });
    s += hand(360, 140, -70, 120, { n: 4, spread: 12, w: 8, curl: 10 });
    return sfin(K, s);
  };
  SC.s_lio_reach = () => {
    const K = kit(); let s = `<rect width="600" height="600" fill="${K.rad(id('b'), [[0, '#3a2a10'], [1, '#000']])}"/>`;
    s += `<path d="M600,80 Q440,200 330,300" stroke="#000" stroke-width="30" fill="none" stroke-linecap="round"/>`;
    s += hand(330, 300, -40, 260, { n: 5, spread: 14, w: 14, curl: -3 });
    s += eyes(K, [[520, 60], [570, 64]], 14, { b: 1.3 });
    return sfin(K, s);
  };
  SC.s_lio_bedside = () => {
    const K = kit(); let s = `<rect width="600" height="600" fill="${K.rad(id('b'), [[0, '#5a4018'], [1, '#000']], .5, .35, .7)}"/>`;
    s += `<g transform="rotate(12 300 300)">${hanger(K, 300, -30, 620, { edgeC: '#8a6a20', armL: [-90, 150, 40], armR: [90, 150, -40], fingerLen: 120 })}</g>`;
    s += eyes(K, [[255, 135], [320, 148]], 18, { b: 1.5 });
    s += `<path d="M0,520 Q300,470 600,520 L600,600 L0,600Z" fill="${DUVET}" opacity=".6"/>`;
    return sfin(K, s);
  };
  SC.s_lio_under = () => {
    const K = kit(); let s = `<rect width="600" height="600" fill="#05050a"/>`;
    for (let i = 0; i < 8; i++) s += `<rect x="0" y="${i * 28}" width="600" height="14" fill="#2a2018"/>`;
    s += `<rect y="230" width="600" height="370" fill="#0a0a10"/><rect y="520" width="600" height="80" fill="#3a2a20"/>`;
    s += `<g opacity=".6"><circle cx="90" cy="540" r="18" fill="#4a4a6a"/><path d="M480,560 q20,-30 50,-10" stroke="#8a3a3a" stroke-width="10" fill="none"/></g>`;
    s += eyes(K, [[260, 470], [340, 470]], 20, { b: 1.4 });
    return sfin(K, s);
  };
})();
