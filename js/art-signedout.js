/* NIGHTDOOR art for "Signed Out": Harrowfield School, Room 14, the other world outside the windows,
   and the Visitor: far too tall, folded at every joint, a cracked white porcelain head with ink-weeping
   eye holes and a mouth that opens top to bottom, seven-fingered hands, a VISITOR lanyard.
   Adds scenes to ART (800x400) and jump scares (600x600) using the shared toolkit. */
(function () {
  'use strict';
  const { kit, f, mix, shade, rng, S, SC, SVB } = ART.lib;
  let N = 0;

  /* ---------- palettes ---------- */
  const P = {
    golden: { wall: '#e9dcc0', wall2: '#dccca8', floor: '#9a8a74', light: '#ffd890', glass: '#bfe2f3', dark: 0 },
    dusk:   { wall: '#6a6474', wall2: '#5e586a', floor: '#4a4450', light: '#9a8fb0', glass: '#3a3550', dark: .35 },
    night:  { wall: '#1c2030', wall2: '#181b28', floor: '#14161f', light: '#5a6a8a', glass: '#0a0c16', dark: .62 },
    under:  { wall: '#2a1a26', wall2: '#22141e', floor: '#180e14', light: '#c8506a', glass: '#3a0a1a', dark: .55 },
    blood:  { wall: '#2a0c0c', wall2: '#220909', floor: '#160505', light: '#ff4a3a', glass: '#3a0606', dark: .55 }
  };
  const BLAZER = '#1f2c55', SKIN = ['#f0cdb0', '#c88f63', '#8a5a3a', '#e8bea0', '#a8754e'], HAIR = ['#2a1a12', '#5a3a1e', '#111', '#a8552a', '#d8b06a'];

  /* ---------- people ---------- */
  function pupil(x, b, s, o = {}) {
    const skin = o.skin || SKIN[0], hair = o.hair || HAIR[0], bl = o.blazer || BLAZER;
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${s})"${o.op ? ` opacity="${o.op}"` : ''}>`;
    if (!o.sit) g += `<rect x="-10" y="-46" width="8" height="46" fill="#222"/><rect x="2" y="-46" width="8" height="46" fill="#222"/>`;
    g += `<path d="M-17,${o.sit ? -10 : -44} L-15,-96 Q0,-104 15,-96 L17,${o.sit ? -10 : -44}Z" fill="${bl}"/>`;
    if (!o.back) g += `<path d="M-5,-96 L0,-80 L5,-96Z" fill="#f4f2ec"/><path d="M-1.6,-90 L1.6,-90 L2.6,-62 L0,-58 L-2.6,-62Z" fill="#8a2a2a"/><path d="M-1.6,-82 l3.2,-2 M-2,-74 l4,-2" stroke="#e0c050" stroke-width="1"/>`;
    g += `<path d="M-15,-92 L-20,${o.armUp ? -126 : -52}" stroke="${bl}" stroke-width="7" stroke-linecap="round"/><path d="M15,-92 L${o.reach ? 34 : 20},${o.reach ? -86 : -52}" stroke="${bl}" stroke-width="7" stroke-linecap="round"/>`;
    if (o.card) g += `<path d="M-7,-98 L0,-74 L7,-98" stroke="#ddd" stroke-width="1.4" fill="none"/><rect x="-7" y="-76" width="14" height="10" fill="#f8f8f4"/><rect x="-5" y="-73" width="10" height="2" fill="#bbb"/>`;
    g += `<ellipse cx="0" cy="-114" rx="12" ry="14" fill="${skin}"/>`;
    if (o.back) g += `<path d="M-13,-116 Q-14,-132 0,-132 Q14,-132 13,-116 L12,-104 Q0,-100 -12,-104Z" fill="${hair}"/>`;
    else {
      g += o.long ? `<path d="M-13,-114 Q-15,-132 0,-132 Q15,-132 13,-114 L15,-92 L9,-92 L9,-118 Q0,-124 -9,-118 L-9,-92 L-15,-92Z" fill="${hair}"/>` : `<path d="M-12,-116 Q-13,-131 0,-131 Q13,-131 12,-116 Q4,-124 -12,-116Z" fill="${hair}"/>`;
      if (o.blank) g += `<ellipse cx="-4.5" cy="-114" rx="2.6" ry="1.2" fill="#555"/><ellipse cx="4.5" cy="-114" rx="2.6" ry="1.2" fill="#555"/>`;
      else g += `<circle cx="-4.5" cy="-114" r="${o.scared ? 2.4 : 1.6}" fill="#111"/><circle cx="4.5" cy="-114" r="${o.scared ? 2.4 : 1.6}" fill="#111"/>`;
      g += o.scared ? `<ellipse cx="0" cy="-104" rx="3" ry="3.6" fill="#3a1010"/>` : `<path d="M-3.5,-105 Q0,-104 3.5,-105" stroke="#7a3a2a" stroke-width="1.3" fill="none"/>`;
    }
    return g + '</g>';
  }
  function teacher(x, b, s, o = {}) {
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${s})">`;
    g += `<rect x="-12" y="-70" width="10" height="70" fill="#2a2f3a"/><rect x="2" y="-70" width="10" height="70" fill="#2a2f3a"/>`;
    g += `<path d="M-20,-68 L-18,-138 Q0,-146 18,-138 L20,-68Z" fill="#6a7a5a"/><path d="M-6,-138 L0,-118 L6,-138Z" fill="#f4f2ec"/>`;
    g += `<path d="M-18,-132 L-26,-80 M18,-132 L${o.radio ? 26 : 26},${o.radio ? -150 : -80}" stroke="#6a7a5a" stroke-width="9" stroke-linecap="round"/>`;
    if (o.radio) g += `<rect x="20" y="-170" width="10" height="20" rx="2" fill="#222"/><rect x="26" y="-180" width="2" height="12" fill="#222"/>`;
    g += `<ellipse cx="0" cy="-156" rx="14" ry="17" fill="${o.skin || '#7a4a2e'}"/><path d="M-14,-160 Q-14,-176 0,-176 Q14,-176 14,-160 Q6,-168 -14,-160Z" fill="${o.white ? '#e8e6e0' : '#1a120c'}"/>`;
    g += `<g fill="none" stroke="#222" stroke-width="1.6"><circle cx="-5.5" cy="-157" r="4.5"/><circle cx="5.5" cy="-157" r="4.5"/><path d="M-1,-157 h2"/></g><circle cx="-5.5" cy="-157" r="1.4" fill="#111"/><circle cx="5.5" cy="-157" r="1.4" fill="#111"/>`;
    return g + '</g>';
  }

  /* ---------- the Visitor ---------- */
  function hand(x, y, ang, len, s = 1, c = '#cfc8bc') {
    let g = `<g transform="translate(${f(x)},${f(y)}) rotate(${ang}) scale(${s})"><ellipse cx="0" cy="0" rx="9" ry="7" fill="${c}"/>`;
    for (let i = 0; i < 7; i++) {
      const a = -54 + i * 18, r1 = len * .45, r2 = len * (.8 + (i % 3) * .07), rad = a * Math.PI / 180, bend = (i % 2 ? 1 : -1) * .25;
      const x1 = Math.sin(rad) * r1, y1 = Math.cos(rad) * r1, x2 = Math.sin(rad + bend) * r2, y2 = Math.cos(rad + bend) * r2;
      g += `<path d="M0,0 L${f(x1)},${f(y1)} L${f(x2)},${f(y2)}" stroke="${c}" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${f(x2)}" cy="${f(y2)}" r="1.4" fill="#1a1414"/>`;
    }
    return g + '</g>';
  }
  function vhead(cx, cy, s, o = {}) {
    let g = `<g transform="translate(${f(cx)},${f(cy)}) scale(${s})">`;
    g += `<path d="M0,-34 C17,-34 22,-14 20,6 C18,26 9,38 0,40 C-9,38 -18,26 -20,6 C-22,-14 -17,-34 0,-34Z" fill="#e8e2d6"/>`;
    g += `<path d="M6,-34 C14,-30 18,-18 18,-2" stroke="#fff" stroke-width="3" fill="none" opacity=".45"/>`;
    g += `<path d="M-8,-33 l4,10 l-5,7 l3,9 M12,-28 l-5,9 l4,6 M-18,4 l7,3 l2,8" stroke="#6a6458" stroke-width="1.1" fill="none"/>`;
    [-8, 8].forEach(ex => { g += `<ellipse cx="${ex}" cy="-6" rx="5.5" ry="7" fill="#050303"/><path d="M${ex - 1},0 q-1.5,10 1,20 q1,6 -1,12" stroke="#050303" stroke-width="2.2" fill="none"/>`; });
    if (o.mouth) g += `<path d="M0,2 C7,10 7,30 0,38 C-7,30 -7,10 0,2Z" fill="#160606"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${-4 + (i % 2) * 0},${8 + i * 4.6} l3,1.6 l-3,1.6Z M4,${9 + i * 4.6} l-3,1.6 l3,1.6Z" fill="#9a9488"/>`).join('');
    else g += `<path d="M0,4 L0.8,14 L-0.6,24 L0.6,36" stroke="#2a2420" stroke-width="1.6" fill="none"/>`;
    return g + '</g>';
  }
  function visitor(x, b, h, o = {}) {
    const k = h / 300, coat = o.coat || '#121216', skin = '#cfc8bc';
    let g = `<g transform="translate(${f(x)},${f(b)}) scale(${f(o.flip ? -k : k)},${f(k)})"${o.op ? ` opacity="${o.op}"` : ''}>`;
    g += `<path d="M-6,0 L-14,-70 L-6,-140 M8,0 L14,-72 L6,-140" stroke="${coat}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    g += `<path d="M-22,-230 Q-30,-160 -34,-96 L-24,-90 L-16,-120 L0,-100 L16,-122 L26,-88 L36,-96 Q30,-160 22,-230 Q0,-242 -22,-230Z" fill="${coat}"/>`;
    g += `<path d="M-10,-232 L0,-200 L10,-232" stroke="#2a2a30" stroke-width="3" fill="none"/>`;
    const lean = o.fold ? 26 : 0;
    g += `<path d="M-20,-226 Q-48,-170 ${o.reachL ? o.reachL[0] : -40},${o.reachL ? o.reachL[1] : -110}" stroke="${coat}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M20,-226 Q52,-180 ${o.reachR ? o.reachR[0] : 44},${o.reachR ? o.reachR[1] : -112}" stroke="${coat}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    g += hand(o.reachL ? o.reachL[0] : -40, o.reachL ? o.reachL[1] : -110, o.handAngL || 10, 34, 1, skin) + hand(o.reachR ? o.reachR[0] : 44, o.reachR ? o.reachR[1] : -112, o.handAngR || -10, 34, 1, skin);
    if (o.book) g += `<rect x="${(o.reachR ? o.reachR[0] : 44) - 10}" y="${(o.reachR ? o.reachR[1] : -112) - 8}" width="20" height="14" fill="#0a0a0a" stroke="#333"/>`;
    g += `<path d="M${-2 + lean / 3},-236 Q${lean / 2},-252 ${lean},-262" stroke="${coat}" stroke-width="7" fill="none"/>`;
    g += `<path d="M-6,-236 L${lean - 2},-205 M6,-236 L${lean + 4},-205" stroke="#d8d4c8" stroke-width="1.2"/><rect x="${lean - 6}" y="-206" width="16" height="11" fill="#f8f8f4"/><text x="${lean + 2}" y="-198.4" font-family="Arial,sans-serif" font-size="3.6" font-weight="700" text-anchor="middle" fill="#222">VISITOR</text>`;
    g += vhead(lean, -292, .95, o);
    return g + '</g>';
  }

  /* ---------- rooms ---------- */
  function shadeRoom(K, m) { const d = P[m].dark; return d ? `<rect width="800" height="400" fill="#050510" opacity="${d}"/>` : ''; }
  function clock(x, y, r, o = {}) {
    return `<g transform="translate(${x},${y})"><circle r="${r}" fill="#f6f4ee" stroke="#333" stroke-width="3"/>${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${-r + 3}" x2="0" y2="${-r + 7}" stroke="#333" stroke-width="1.6" transform="rotate(${i * 30})"/>`).join('')}<line x1="0" y1="0" x2="${f(r * .5 * Math.sin(97.5 * Math.PI / 180))}" y2="${f(-r * .5 * Math.cos(97.5 * Math.PI / 180))}" stroke="#222" stroke-width="3"/><line x1="0" y1="0" x2="${f(r * .8 * Math.sin(78 * Math.PI / 180))}" y2="${f(-r * .8 * Math.cos(78 * Math.PI / 180))}" stroke="#222" stroke-width="2"/>${o.red ? `<line x1="0" y1="0" x2="0" y2="${-r * .85}" stroke="#c22" stroke-width="1"/>` : ''}</g>`;
  }
  function desks(m, o = {}) {
    const top = mix('#b88a5c', '#000', P[m].dark * .6), leg = mix('#5a5a60', '#000', P[m].dark * .6);
    let s = '';
    [[250, 296, 140], [410, 296, 140]].forEach(([x, y, w]) => {
      s += `<rect x="${x}" y="${y}" width="${w}" height="10" fill="${top}"/><rect x="${x + 6}" y="${y + 10}" width="5" height="54" fill="${leg}"/><rect x="${x + w - 11}" y="${y + 10}" width="5" height="54" fill="${leg}"/>`;
      if (o.books !== false) for (let i = 0; i < 3; i++) s += `<rect x="${x + 12 + i * 42}" y="${y - 6}" width="30" height="6" fill="${o.facedown ? '#5a5a62' : ['#c94a3a', '#3d7ab0', '#5aa04a'][i]}"/>${o.facedown ? '' : `<rect x="${x + 16 + i * 42}" y="${y - 5}" width="18" height="2" fill="#fff" opacity=".85"/>`}`;
    });
    [[60, 340, 120], [600, 340, 130]].forEach(([x, y, w]) => s += `<rect x="${x}" y="${y}" width="${w}" height="10" fill="${top}"/><rect x="${x + 6}" y="${y + 10}" width="5" height="50" fill="${leg}"/><rect x="${x + w - 11}" y="${y + 10}" width="5" height="50" fill="${leg}"/>`);
    return s;
  }
  function classroom(K, m, o = {}) {
    const p = P[m];
    let s = `<rect width="800" height="400" fill="${p.wall}"/>`;
    for (let x = 0; x < 800; x += 50) s += `<rect x="${x}" y="0" width="1.5" height="262" fill="${p.wall2}"/>`;
    s += `<rect y="262" width="800" height="138" fill="${p.floor}"/>`;
    for (let i = 0; i < 9; i++) s += `<line x1="${i * 100 - 40}" y1="262" x2="${i * 120 - 120}" y2="400" stroke="${shade(p.floor, -.15)}" stroke-width="1.5"/>`;
    s += `<rect y="256" width="800" height="8" fill="${shade(p.wall, -.25)}"/>`;
    // coat pegs (left)
    s += `<rect x="24" y="150" width="180" height="8" fill="${shade(p.wall, -.35)}"/>`;
    for (let i = 0; i < 6; i++) { const x = 34 + i * 30; s += `<circle cx="${x}" cy="164" r="3" fill="#8a8a8a"/>`; if (!o.noLabels) s += `<rect x="${x - 11}" y="126" width="22" height="12" fill="#fbf8f0"/><rect x="${x - 7}" y="130" width="14" height="2" fill="#555"/><rect x="${x - 6}" y="133" width="10" height="1.6" fill="#999"/>`; if (o.cards) s += `<path d="M${x - 5},166 L${x},188 L${x + 5},166" stroke="#ddd" stroke-width="1" fill="none"/><rect x="${x - 6}" y="186" width="12" height="9" fill="#f8f8f4"/>`; else if (i % 2 === 0) s += `<path d="M${x - 10},168 Q${x},162 ${x + 10},168 L${x + 12},226 L${x - 12},226Z" fill="${['#1f2c55', '#3a3a44', '#5a2a3a'][i / 2]}"/>`; }
    // smartboard
    s += `<rect x="262" y="54" width="276" height="140" fill="#2a2a30"/><rect x="270" y="62" width="260" height="124" fill="${o.board === 'register' ? '#eef4fb' : o.board === 'write' ? '#f4f4f0' : o.board === 'glow' ? '#1a2a40' : '#0c0e14'}"/>`;
    if (o.board === 'register') { s += `<rect x="284" y="72" width="120" height="8" fill="#2c5a9a"/>`; for (let i = 0; i < 9; i++) s += `<rect x="284" y="${90 + i * 10}" width="${60 + (i * 37 % 70)}" height="4" fill="#555"/><rect x="430" y="${90 + i * 10}" width="${50 + (i * 23 % 60)}" height="4" fill="#555"/>`; }
    if (o.board === 'write') s += `<text x="400" y="128" font-family="Georgia,serif" font-size="22" font-style="italic" fill="#2a3a6a" text-anchor="middle">Glaciers</text><path d="M300,150 q30,-14 60,0 t60,0 t60,0 t60,0" stroke="#2a3a6a" stroke-width="2" fill="none"/>`;
    s += `<rect x="290" y="194" width="220" height="6" fill="#555"/>`;
    s += clock(400, 30, 18, { red: true });
    // windows with blinds (right)
    const g = o.outside || p.glass;
    s += `<rect x="580" y="40" width="200" height="160" fill="#ddd8cc"/><rect x="588" y="48" width="184" height="144" fill="${g}"/>`;
    if (o.view) s += o.view;
    const bl = o.blinds == null ? 1 : o.blinds;
    for (let i = 0; i < 18 * bl; i++) s += `<rect x="588" y="${48 + i * 8}" width="184" height="6" fill="${mix('#d9d4c8', '#000', p.dark * .7)}"/>`;
    if (o.slit) s += `<rect x="${o.slit[0]}" y="${o.slit[1]}" width="${o.slit[2]}" height="6" fill="${o.slitC || '#c8506a'}"/>`;
    s += `<path d="M680,48 V192 M588,120 H772" stroke="#ddd8cc" stroke-width="4"/>`;
    // teacher desk (right)
    s += `<rect x="586" y="232" width="190" height="14" fill="${mix('#8a6440', '#000', p.dark * .6)}"/><rect x="590" y="246" width="180" height="80" fill="${mix('#7a5636', '#000', p.dark * .6)}"/><rect x="600" y="258" width="78" height="26" fill="${mix('#8a6440', '#000', p.dark * .6)}"/><rect x="632" y="268" width="14" height="4" fill="#aaa"/><rect x="690" y="258" width="70" height="56" fill="${mix('#8a6440', '#000', p.dark * .6)}"/>`;
    if (o.mug !== false) s += `<rect x="616" y="216" width="14" height="16" fill="#e8e0d0"/><rect x="650" y="220" width="40" height="12" fill="#c94a3a"/>`;
    s += desks(m, o);
    // bag
    s += `<path d="M78,388 L74,332 Q76,320 96,318 L178,318 Q196,320 198,332 L196,388Z" fill="${mix('#3a5a8a', '#000', p.dark * .6)}"/><path d="M110,318 Q136,296 162,318" stroke="${mix('#2a3a5a', '#000', p.dark * .6)}" stroke-width="6" fill="none"/>`;
    return s;
  }
  function blindsView(K, m) { return `<g transform="translate(588,48) scale(.23,.36)">${otherworld(K, { small: true })}</g>`; }

  function otherworld(K, o = {}) {
    let s = `<rect width="800" height="400" fill="${K.lin('ow' + (++N), [[0, '#0a0206'], [.55, '#3a0a1c'], [1, '#6a1626']])}"/>`;
    s += `<ellipse cx="400" cy="420" rx="520" ry="200" fill="#8a1a2a" opacity=".35"/>`;
    const r = rng(19);
    for (let i = 0; i < 4; i++) { const x = 90 + i * 200 + r() * 60, y = 60 + r() * 120, sc = .6 + r() * .9; s += `<g opacity="${f(.35 + r() * .35)}" transform="translate(${f(x)},${f(y)}) scale(${f(sc)})"><path d="M-40,0 Q-38,-36 0,-38 Q38,-36 40,0 Q20,8 0,4 Q-20,8 -40,0Z" fill="#e8d8e0"/>${Array.from({ length: 7 }, (_, j) => `<path d="M${-30 + j * 10},2 q${j % 2 ? 8 : -8},40 0,80 t0,70" stroke="#e8d8e0" stroke-width="1.6" fill="none" opacity=".7"/>`).join('')}</g>`; }
    [[150, 210, .5], [620, 180, .35], [430, 150, .25]].forEach(([x, y, k]) => {
      s += `<g transform="translate(${x},${y}) scale(${k})" opacity=".85"><rect x="-120" y="-80" width="240" height="90" fill="#1a0a12"/><polygon points="-130,-80 0,-130 130,-80" fill="#14070c"/><path d="M-90,30 L-60,140 M60,30 L30,160 M0,40 L10,200" stroke="#14070c" stroke-width="10"/>`;
      for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) s += `<rect x="${-104 + i * 36}" y="${-66 + j * 36}" width="26" height="24" fill="#ffcf73" opacity=".85"/><circle cx="${-91 + i * 36}" cy="${-56 + j * 36}" r="4" fill="#f0d8c0"/>`;
      s += '</g>';
    });
    if (!o.small) {
      s += `<path d="M0,300 L800,300 L800,400 L0,400Z" fill="#000"/><path d="M0,300 L800,300 L800,312 L0,312Z" fill="#2a4a2a"/><path d="M0,312 L800,312" stroke="#3a6a3a" stroke-width="2"/>`;
      s += `<rect y="312" width="800" height="88" fill="${K.lin('vd' + (++N), [[0, '#0a0206'], [1, '#000']])}"/>`;
    }
    return s;
  }

  function corridor(K, m, o = {}) {
    const p = P[m];
    let s = `<rect width="800" height="400" fill="${p.wall2}"/>`;
    s += `<polygon points="0,0 330,140 330,270 0,400" fill="${p.wall}"/><polygon points="800,0 470,140 470,270 800,400" fill="${shade(p.wall, -.08)}"/>`;
    s += `<polygon points="0,400 330,270 470,270 800,400" fill="${p.floor}"/><polygon points="0,0 330,140 470,140 800,0" fill="${shade(p.wall2, -.3)}"/>`;
    for (let i = 0; i < 6; i++) { const t = i / 6; s += `<line x1="${f(330 * t)}" y1="${f(140 * t)}" x2="${f(330 * t)}" y2="${f(400 - 130 * t)}" stroke="${shade(p.wall, -.3)}" stroke-width="2"/><line x1="${f(800 - 330 * t)}" y1="${f(140 * t)}" x2="${f(800 - 330 * t)}" y2="${f(400 - 130 * t)}" stroke="${shade(p.wall, -.3)}" stroke-width="2"/>`; }
    // lockers left, doors right
    for (let i = 0; i < 5; i++) { const t0 = .1 + i * .15, t1 = t0 + .12, x0 = 330 * t0, x1 = 330 * t1; s += `<polygon points="${f(x0)},${f(60 + 140 * t0 * .55)} ${f(x1)},${f(60 + 140 * t1 * .55)} ${f(x1)},${f(400 - 130 * t1 - 6)} ${f(x0)},${f(400 - 130 * t0 - 6)}" fill="${mix('#3a5a8a', '#000', p.dark * .7)}" stroke="${shade(p.wall, -.4)}"/>`; }
    for (let i = 0; i < 3; i++) { const t0 = .14 + i * .25, t1 = t0 + .12, x0 = 800 - 330 * t0, x1 = 800 - 330 * t1; s += `<polygon points="${f(x0)},${f(80 + 140 * t0 * .5)} ${f(x1)},${f(80 + 140 * t1 * .5)} ${f(x1)},${f(400 - 130 * t1)} ${f(x0)},${f(400 - 130 * t0)}" fill="${mix('#7a5636', '#000', p.dark * .7)}"/><polygon points="${f(x0 - 10)},${f(110 + 140 * t0 * .5)} ${f(x0 - 22)},${f(110 + 140 * (t0 + .03) * .5)} ${f(x0 - 22)},${f(170 + 140 * (t0 + .03) * .3)} ${f(x0 - 10)},${f(170 + 140 * t0 * .3)}" fill="${p.glass}"/>`; }
    // stairs + plaque at end
    s += `<rect x="330" y="140" width="140" height="130" fill="${shade(p.wall2, -.2)}"/>`;
    for (let i = 0; i < 6; i++) s += `<rect x="${340 + i * 4}" y="${210 + i * 10}" width="${120 - i * 8}" height="3" fill="${shade(p.wall2, .15)}"/>`;
    if (o.plaque) s += `<rect x="360" y="160" width="80" height="34" fill="#b8913a" stroke="#6a4a1a" stroke-width="2"/><text x="400" y="171" font-family="Georgia,serif" font-size="6.4" font-weight="700" text-anchor="middle" fill="#3a2608">HARROWFIELD SCHOOL</text><text x="400" y="181" font-family="Georgia,serif" font-size="7" font-weight="700" text-anchor="middle" fill="#3a2608">OPENED 1962</text><text x="400" y="189" font-family="Georgia,serif" font-size="4.2" text-anchor="middle" fill="#3a2608">CLOCK TOWER: GIFT OF MR E. VANE</text>`;
    s += `<rect x="372" y="128" width="56" height="10" fill="#1a5a2a"/><text x="400" y="136" font-family="Arial,sans-serif" font-size="6" font-weight="700" fill="#fff" text-anchor="middle">STAIRS</text>`;
    return s;
  }

  function finish(K, m, vig = .75, s = '') {
    if (m === 'under') s += `<rect width="800" height="400" fill="#7a1a3a" opacity=".18" style="mix-blend-mode:screen"/>`;
    if (m === 'blood') s += `<rect width="800" height="400" fill="#ff2a1a" opacity=".12" style="mix-blend-mode:screen"/>`;
    return s + K.vignette(vig) + K.grain(.16);
  }

  /* ================= SCENES ================= */
  S.cover_signedout = () => {
    const K = kit(); let s = corridor(K, 'night', { plaque: true });
    s += visitor(470, 300, 230, { fold: true, reachR: [60, -170], handAngR: 200 });
    s += `<rect width="800" height="400" fill="${K.rad('t', [[0, '#c8506a', .25], [1, '#000', 0]], .58, .45, .45)}"/>`;
    return K.done(s + finish(K, 'night', .85));
  };

  S.so_classroom = () => {
    const K = kit(); let s = classroom(K, 'golden', { board: 'write', blinds: .35 });
    s += teacher(520, 300, 1.05);
    s += pupil(320, 300, 1, { sit: true, back: true, hair: HAIR[3] }) + pupil(380, 300, 1, { sit: true, back: true, hair: HAIR[0], long: true }) + pupil(470, 300, 1, { sit: true, back: true, hair: HAIR[2] });
    s += pupil(700, 340, 1, { sit: true, back: true, hair: HAIR[4], long: true, skin: SKIN[3] });
    s += `<rect width="800" height="400" fill="${K.rad('g', [[0, '#ffd890', .35], [1, '#ffd890', 0]], .85, .3, .6)}"/>`;
    return K.done(s + K.vignette(.35) + K.grain(.08));
  };
  S.so_lockdown = () => {
    const K = kit(); let s = classroom(K, 'dusk', { board: 'register', slit: [588, 104, 184], slitC: '#e9b070' });
    s += pupil(130, 400, 1.3, { scared: true, skin: SKIN[1], hair: HAIR[2] }) + pupil(230, 410, 1.2, { scared: true, long: true, hair: HAIR[3] });
    s += `<rect width="800" height="400" fill="#140a1a" opacity=".25"/>`;
    return K.done(s + finish(K, 'dusk', .7));
  };
  S.so_door = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#1a1c28"/><rect y="330" width="800" height="70" fill="#101218"/>`;
    s += `<rect x="270" y="20" width="260" height="330" fill="#2a2420"/><rect x="284" y="30" width="232" height="300" fill="#5a3e2a"/><rect x="296" y="42" width="208" height="276" fill="none" stroke="#3a2818" stroke-width="3"/>`;
    s += `<rect x="370" y="62" width="60" height="120" fill="#0a0c14"/>`;
    s += `<g clip-path="url(#${K.u}dw)">${visitor(404, 520, 420, {})}</g>`;
    K.defs.push(`<clipPath id="${K.u}dw"><rect x="370" y="62" width="60" height="120"/></clipPath>`);
    for (let i = 0; i < 14; i++) s += `<rect x="370" y="${62 + i * 8.6}" width="60" height="${i > 3 && i < 10 ? 3.4 : 7}" fill="#c9c2b0"/>`;
    s += `<rect x="370" y="62" width="60" height="120" fill="none" stroke="#2a2420" stroke-width="5"/>`;
    s += `<rect x="470" y="190" width="30" height="8" rx="3" fill="#c9c2b0" transform="rotate(${-12} 476 194)"/><circle cx="476" cy="194" r="7" fill="#c9c2b0"/>`;
    s += `<rect x="296" y="318" width="208" height="12" fill="#0a0b10"/><rect x="284" y="328" width="232" height="3" fill="#e8d8b0" opacity=".25"/>`;
    s += `<text x="400" y="234" font-family="Arial,sans-serif" font-size="18" font-weight="700" text-anchor="middle" fill="#e8e0d0" opacity=".85">14</text>`;
    return K.done(s + finish(K, 'night', .85));
  };
  S.so_dark = () => {
    const K = kit(); let s = classroom(K, 'night', { board: 'off', slit: [588, 112, 184] });
    s += teacher(640, 300, 1.05, { radio: true });
    s += pupil(170, 330, .9, { sit: true, scared: true, skin: SKIN[2] }) + pupil(330, 300, .9, { sit: true, scared: true, long: true, hair: HAIR[3] }) + pupil(470, 300, .9, { sit: true, scared: true });
    s += `<rect width="800" height="400" fill="${K.rad('ph', [[0, '#cfe0ff', .22], [1, '#000', 0]], .4, .7, .3)}"/>`;
    return K.done(s + finish(K, 'night', .85));
  };
  S.so_underworld = () => {
    const K = kit(); let s = otherworld(K);
    s += `<path d="M0,0 H800 V36 H0Z M0,36 H30 V400 H0Z M770,36 H800 V400 H770Z" fill="#14101a"/><path d="M400,36 V400" stroke="#14101a" stroke-width="12"/><rect y="370" width="800" height="30" fill="#14101a"/>`;
    s += pupil(240, 312, .35, { back: true, card: true, blazer: '#2a2a2a' }) + pupil(560, 312, .3, { back: true, card: true }) + pupil(660, 312, .28, { back: true, card: true });
    return K.done(s + finish(K, 'under', .7));
  };
  S.so_corridor_kai = () => {
    const K = kit(); let s = corridor(K, 'blood');
    s += `<rect x="360" y="0" width="80" height="40" fill="#000"/>`;
    s += `<g transform="translate(400,40) scale(1,-1)">${visitor(0, 0, 180, { reachL: [-46, -150], reachR: [46, -150], handAngL: 160, handAngR: 200, book: true })}</g>`;
    s += pupil(400, 392, 1.1, { back: true, card: true });
    s += `<text x="400" y="300" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">KAI 7</text>`;
    return K.done(s + finish(K, 'blood', .8));
  };
  S.so_names = () => {
    const K = kit(); let s = classroom(K, 'night', { board: 'register' });
    s += `<rect x="270" y="62" width="260" height="124" fill="#9ab8e0" opacity=".25"/>`;
    s += `<rect width="800" height="400" fill="${K.rad('l', [[0, '#cfe0ff', .2], [1, '#000', 0]], .5, .35, .4)}"/>`;
    return K.done(s + K.vignette(.6) + K.grain(.14));
  };
  S.so_corridor = () => {
    const K = kit(); let s = corridor(K, 'night', { plaque: true });
    s += `<rect width="800" height="400" fill="${K.rad('pl', [[0, '#ffd890', .18], [1, '#000', 0]], .5, .45, .2)}"/>`;
    s += `<g opacity=".8">${visitor(570, 300, 150, { fold: true, reachL: [-60, -100], handAngL: 60 })}</g>`;
    return K.done(s + finish(K, 'night', .8));
  };
  S.so_toilets = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#2a1414"/><rect y="290" width="800" height="110" fill="#1a0a0a"/>`;
    for (let x = 0; x < 800; x += 40) for (let y = 0; y < 290; y += 40) s += `<rect x="${x + 1}" y="${y + 1}" width="38" height="38" fill="#3a1e1e"/>`;
    for (let i = 0; i < 4; i++) { const x = 40 + i * 190; s += `<rect x="${x}" y="60" width="150" height="130" fill="#100808" stroke="#8a8a8a" stroke-width="4"/><g clip-path="url(#${K.u}m${i})">${visitor(x + 75, 372, 260, { op: .85 })}</g>`; K.defs.push(`<clipPath id="${K.u}m${i}"><rect x="${x}" y="60" width="150" height="130"/></clipPath>`); s += `<rect x="${x + 20}" y="210" width="110" height="30" rx="8" fill="#c8c8c8"/><rect x="${x + 70}" y="200" width="8" height="14" fill="#999"/>`; }
    return K.done(s + finish(K, 'blood', .8));
  };
  S.so_lobby = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#181b28"/><rect y="300" width="800" height="100" fill="#0e1018"/>`;
    for (let i = 0; i < 10; i++) s += `<rect x="${560 + i * 0}" y="${300 - i * 24}" width="${240 - i * 14}" height="24" fill="${i % 2 ? '#1e2232' : '#22263a'}"/>`;
    s += `<path d="M560,300 L800,60" stroke="#3a3e50" stroke-width="6"/>`;
    [[60, '#7a2a24', 'HALL', 1], [210, '#2f5a3a', 'LIBRARY'], [330, '#2c4f8a', 'STAFF'], [450, '#8a8f96', 'LIFT']].forEach(([x, c, t, d]) => { s += `<rect x="${x}" y="150" width="${d ? 120 : 90}" height="150" fill="${mix(c, '#000', .45)}" stroke="#2a2622" stroke-width="6"/><rect x="${x + 10}" y="166" width="${d ? 100 : 70}" height="18" fill="#d8d4c8" opacity=".6"/><text x="${x + (d ? 60 : 45)}" y="179" font-family="Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle" fill="#222">${t}</text>`; });
    s += `<rect x="210" y="296" width="90" height="5" fill="#ffcf73" opacity=".8"/><rect x="450" y="150" width="90" height="150" fill="#9fe07a" opacity=".08"/>`;
    return K.done(s + finish(K, 'night', .8));
  };
  S.so_keypad = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#1c2030"/><rect y="320" width="800" height="80" fill="#12141c"/>`;
    s += `<rect x="200" y="20" width="300" height="320" fill="#2c3a5a" stroke="#1a2236" stroke-width="10"/><rect x="250" y="60" width="200" height="120" fill="#0c1a30"/><rect x="262" y="72" width="80" height="60" fill="#1a3a6a" opacity=".8"/><rect x="380" y="110" width="50" height="40" fill="#f0e8d8" opacity=".5"/>`;
    s += `<rect x="540" y="130" width="90" height="130" rx="6" fill="#2a2a2e" stroke="#555" stroke-width="2"/><rect x="552" y="142" width="66" height="20" fill="#0a1a10"/><text x="585" y="157" font-family="monospace" font-size="12" fill="#5aff7a" text-anchor="middle">_ _ _ _</text>`;
    for (let i = 0; i < 12; i++) s += `<rect x="${554 + (i % 3) * 22}" y="${172 + Math.floor(i / 3) * 21}" width="16" height="15" rx="2" fill="#c8c8c4"/>`;
    s += `<text x="350" y="230" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#e8e0d0" text-anchor="middle">OFFICE</text>`;
    return K.done(s + finish(K, 'night', .8));
  };
  S.so_office = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#2a1a26"/><rect y="290" width="800" height="110" fill="#180e14"/>`;
    s += `<rect x="60" y="210" width="460" height="90" fill="#4a2e3a"/><rect x="50" y="200" width="480" height="14" fill="#6a4252"/>`;
    s += `<rect x="90" y="120" width="120" height="80" fill="#0a0a10" stroke="#333" stroke-width="4"/><rect x="98" y="128" width="104" height="64" fill="#1a3a8a"/><text x="150" y="152" font-family="monospace" font-size="9" fill="#cfe0ff" text-anchor="middle">VISITOR 15:13</text><path d="M110,170 l8,-8 l6,12 l8,-16 l7,20 l8,-10 l10,4 l8,-6" stroke="#cfe0ff" stroke-width="1.6" fill="none"/>`;
    s += `<path d="M300,198 L300,188 L470,188 L470,198Z" fill="#e8e0cc"/><path d="M385,188 V198" stroke="#888"/>${Array.from({ length: 5 }, (_, i) => `<path d="M396,${190.5 + i * 1.6} q20,-1 30,0 t30,0" stroke="#2a1a4a" stroke-width=".7" fill="none"/>`).join('')}`;
    s += `<rect x="600" y="80" width="150" height="210" fill="#3a2430" stroke="#6a4a3a" stroke-width="6"/><rect x="610" y="90" width="130" height="190" fill="#c8506a" opacity=".12"/><rect x="620" y="200" width="90" height="16" fill="#6a3a2a"/><rect x="616" y="214" width="98" height="64" fill="#5a2e22"/><text x="665" y="252" font-family="Georgia,serif" font-size="12" fill="#d8b070" text-anchor="middle">1962</text><path d="M610,140 H740" stroke="#6a4a3a" stroke-width="3"/>`;
    s += `<rect width="800" height="400" fill="${K.rad('sc', [[0, '#5a8aff', .2], [1, '#000', 0]], .19, .4, .25)}"/>`;
    return K.done(s + finish(K, 'under', .75));
  };
  S.so_oldbook = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#140a0c"/>`;
    s += `<path d="M90,40 L400,60 L710,40 L720,380 L400,360 L80,380Z" fill="#e8dcc0"/><path d="M400,60 V360" stroke="#a89878" stroke-width="3"/>`;
    for (let i = 0; i < 12; i++) { s += `<line x1="110" y1="${90 + i * 22}" x2="385" y2="${92 + i * 22}" stroke="#b8a888" stroke-width="1"/><line x1="415" y1="${92 + i * 22}" x2="690" y2="${90 + i * 22}" stroke="#b8a888" stroke-width="1"/>`; }
    s += `<text x="250" y="80" font-family="Georgia,serif" font-size="14" font-weight="700" text-anchor="middle" fill="#3a2a1a">VISITORS · 1962</text>`;
    const r = rng(5); for (let i = 0; i < 8; i++) s += `<path d="M120,${108 + i * 22} q${30 + r() * 30},-6 ${70 + r() * 40},0 t${60},0" stroke="#2a2a4a" stroke-width="1.4" fill="none"/>`;
    s += `<text x="140" y="306" font-family="Georgia,serif" font-size="22" font-style="italic" fill="#1a1a3a">E. V</text><ellipse cx="216" cy="300" rx="22" ry="12" fill="#2a2a4a" opacity=".55"/><text x="236" y="306" font-family="Georgia,serif" font-size="22" font-style="italic" fill="#1a1a3a">NE</text><path d="M200,310 q4,30 -2,60 M220,312 q3,24 -1,46" stroke="#2a2a4a" stroke-width="3" opacity=".5"/><text x="300" y="306" font-family="Georgia,serif" font-size="14" fill="#1a1a3a">3.13pm</text>`;
    for (let i = 0; i < 4; i++) s += `<path d="M430,${200 + i * 22} q40,-8 70,0 q20,6 40,-2" stroke="#3a1a1a" stroke-width="1.4" fill="none"/><text x="620" y="${204 + i * 22}" font-family="Georgia,serif" font-size="11" fill="#3a1a1a">3.13</text>`;
    s += `<text x="560" y="300" font-family="Georgia,serif" font-size="12" font-style="italic" fill="#8a6a4a">Signed out: — — —</text>`;
    s += `<rect width="800" height="400" fill="${K.rad('t', [[0, '#fff3c4', .15], [1, '#000', .6]], .5, .5, .6)}"/>`;
    return K.done(s + K.grain(.18));
  };
  S.so_final = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#220909"/><rect y="300" width="800" height="100" fill="#140505"/>`;
    s += `<rect x="290" y="40" width="220" height="270" fill="#050202" stroke="#3a1a14" stroke-width="10"/>`;
    s += visitor(400, 330, 255, { mouth: true, reachL: [-70, -170], reachR: [70, -150], handAngL: 40, handAngR: -40, book: true });
    s += pupil(120, 400, 1.4, { scared: true, long: true, hair: HAIR[3], back: false });
    s += `<rect x="560" y="300" width="200" height="16" fill="#3a1a14"/><path d="M590,300 L600,284 L740,284 L730,300Z" fill="#c8b890"/>`;
    return K.done(s + finish(K, 'blood', .8));
  };
  S.so_end_best = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="${K.lin('sk', [[0, '#7fc4ec'], [1, '#e0f2fa']])}"/><circle cx="660" cy="70" r="30" fill="#fff3b8"/>`;
    s += `<rect x="120" y="90" width="460" height="170" fill="#c9845e"/><polygon points="110,92 350,40 590,92" fill="#5c5f66"/><rect x="320" y="10" width="60" height="90" fill="#b97556"/>` + `<g transform="translate(350,48)"><circle r="20" fill="#f6f4ee" stroke="#333" stroke-width="3"/><line x1="0" y1="0" x2="10" y2="1" stroke="#222" stroke-width="3"/><line x1="0" y1="0" x2="3" y2="-16" stroke="#222" stroke-width="2"/></g>`;
    for (let i = 0; i < 8; i++) for (let j = 0; j < 2; j++) s += `<rect x="${140 + i * 54}" y="${120 + j * 60}" width="34" height="36" fill="#bfe2f3" stroke="#fff" stroke-width="3"/>`;
    s += `<rect y="260" width="800" height="140" fill="#86c46e"/>`;
    [[90, '#2a4a9a'], [700, '#fff']].forEach(([x, c]) => s += `<g transform="translate(${x},330)"><rect x="-40" y="-26" width="80" height="26" rx="6" fill="${c}" stroke="#222"/><rect x="-18" y="-40" width="40" height="16" fill="#bfe2f3" stroke="#222"/><rect x="-20" y="-31" width="40" height="5" fill="#3a6aff"/><circle cx="-24" cy="0" r="8" fill="#222"/><circle cx="24" cy="0" r="8" fill="#222"/><rect x="-6" y="-46" width="12" height="5" fill="#2a6aff"/></g>`);
    s += pupil(300, 360, .8, { card: true, blank: true, skin: SKIN[2] }) + pupil(360, 360, .8, { card: true, blank: true, long: true, hair: HAIR[4] }) + teacher(430, 362, .85, { white: true });
    [[520, '#5a5a5a'], [560, '#5a4030'], [600, '#3a3a3a'], [640, '#5a5a5a']].forEach(([x, c]) => s += pupil(x, 366, .7, { blazer: c, card: true, blank: true }));
    return K.done(s + K.vignette(.25) + K.grain(.08));
  };
  S.so_end_trade = () => {
    const K = kit(); let s = `<rect width="800" height="400" fill="#2a1a26"/>`;
    s += `<rect x="220" y="40" width="360" height="300" fill="#e8dcc0" transform="rotate(-3 400 190)"/>`;
    for (let i = 0; i < 9; i++) s += `<path d="M260,${90 + i * 26} q40,-8 80,0 t80,0" stroke="#2a1a3a" stroke-width="1.6" fill="none" transform="rotate(-3 400 190)"/>`;
    s += `<g transform="rotate(-3 400 190)"><rect x="250" y="60" width="300" height="34" fill="#1a0a0a" opacity=".85"/><path d="M262,84 q30,-26 60,-4 q30,20 60,-10 q30,-26 60,4 q20,14 50,-4" stroke="#e8dcc0" stroke-width="4" fill="none"/></g>`;
    s += `<g transform="translate(640,120) scale(.5)">${otherworld(K, { small: true })}</g>`;
    return K.done(s + finish(K, 'under', .8));
  };
  S.so_end_signed = () => {
    const K = kit(); let s = otherworld(K);
    const r = rng(8); for (let i = 0; i < 9; i++) s += pupil(80 + i * 80 + r() * 20, 312 + (i % 2) * 4, .38 + r() * .1, { back: true, card: true, blazer: i % 3 ? BLAZER : '#2a2a2a', long: i % 2 === 0, hair: HAIR[i % 5] });
    s += pupil(380, 395, 1.1, { back: true, card: true, long: true, hair: HAIR[3] }) + pupil(440, 395, 1.1, { back: true, card: true });
    return K.done(s + finish(K, 'under', .7));
  };
  S.so_end_stay = () => {
    const K = kit(); let s = classroom(K, 'night', { board: 'off', noLabels: true, cards: true, books: false, mug: false, slit: [588, 112, 184] });
    s += pupil(330, 300, .9, { sit: true, back: true, hair: HAIR[3], long: true, op: .85 }) + pupil(700, 340, .9, { sit: true, back: true, op: .85 });
    return K.done(s + finish(K, 'night', .85));
  };

  /* ================= JUMP SCARES (600x600) ================= */
  function bigHead(K, mouth, tilt = 0) {
    let s = `<rect width="600" height="600" fill="${K.rad('bg', [[0, '#3a0808'], [1, '#000']], .5, .45, .7)}"/>`;
    s += `<path d="M120,600 Q140,460 300,450 Q460,460 480,600Z" fill="#0a0a0c"/><path d="M250,470 L300,560 L350,470" stroke="#d8d4c8" stroke-width="3" fill="none"/><rect x="270" y="555" width="60" height="40" fill="#f8f8f4"/><text x="300" y="580" font-family="Arial,sans-serif" font-size="13" font-weight="700" text-anchor="middle" fill="#222">VISITOR</text>`;
    s += `<g transform="rotate(${tilt} 300 280)">${vhead(300, 270, 7.2, { mouth })}</g>`;
    return s;
  }
  SC.v_face = () => {
    const K = kit(); let s = bigHead(K, true, -8);
    s += hand(70, 540, 150, 80, 2.2) + hand(530, 540, 210, 80, 2.2);
    return K.done(s + `<rect width="600" height="600" fill="#ff2a1a" opacity=".1" style="mix-blend-mode:screen"/>` + K.vignette(.85, 600, 600) + K.grain(.25, 600, 600), SVB);
  };
  SC.v_window = () => {
    const K = kit(); let s = `<rect width="600" height="600" fill="#2a2420"/><rect x="150" y="0" width="300" height="600" fill="#05070c"/>`;
    s += `<g clip-path="url(#${K.u}w)">${vhead(300, 300, 7.6, {})}${hand(230, 500, 170, 70, 2.2)}</g>`;
    K.defs.push(`<clipPath id="${K.u}w"><rect x="150" y="0" width="300" height="600"/></clipPath>`);
    s += `<rect x="150" y="0" width="300" height="600" fill="#9ab0d0" opacity=".08"/><path d="M170,40 L240,0 M180,160 L320,20" stroke="#fff" stroke-width="3" opacity=".25"/>`;
    s += `<rect x="140" y="0" width="14" height="600" fill="#5a3e2a"/><rect x="446" y="0" width="14" height="600" fill="#5a3e2a"/>`;
    return K.done(s + K.vignette(.8, 600, 600) + K.grain(.25, 600, 600), SVB);
  };
  SC.v_ceiling = () => {
    const K = kit(); let s = `<rect width="600" height="600" fill="#0a0808"/>`;
    for (let x = 0; x < 600; x += 120) s += `<rect x="${x}" y="0" width="118" height="70" fill="#d8d4c8" opacity=".25"/>`;
    s += `<rect x="240" y="0" width="120" height="72" fill="#000"/>`;
    s += `<g transform="rotate(180 300 260)">${vhead(300, 280, 6.4, { mouth: true })}</g>`;
    s += hand(130, 200, 120, 80, 2.4) + hand(470, 200, 240, 80, 2.4);
    s += `<path d="M290,30 L280,0 M310,30 L320,0" stroke="#0a0a0c" stroke-width="30"/>`;
    return K.done(s + `<rect width="600" height="600" fill="#ff2a1a" opacity=".1" style="mix-blend-mode:screen"/>` + K.vignette(.85, 600, 600) + K.grain(.25, 600, 600), SVB);
  };
  SC.v_fingers = () => {
    const K = kit(); let s = `<rect width="600" height="600" fill="#08080c"/><rect y="0" width="600" height="380" fill="#3a2a1e"/><rect y="372" width="600" height="18" fill="#000"/><rect y="390" width="600" height="210" fill="#14161f"/>`;
    for (let i = 0; i < 7; i++) { const x = 90 + i * 70; s += `<path d="M${x},384 L${x + 10},450 L${x - 6},520 L${x + 14},${570 + (i % 2) * 20}" stroke="#cfc8bc" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="${x + 14}" cy="${578 + (i % 2) * 20}" rx="6" ry="9" fill="#1a1414"/>`; }
    s += `<rect y="372" width="600" height="14" fill="#fff" opacity=".08"/>`;
    return K.done(s + K.vignette(.8, 600, 600) + K.grain(.25, 600, 600), SVB);
  };
  SC.v_hall = () => {
    const K = kit(); let s = `<rect width="600" height="600" fill="#140808"/><rect y="0" width="600" height="200" fill="#2a0e0e"/>`;
    const r = rng(4);
    for (let row = 0; row < 4; row++) for (let i = 0; i < 6 - (row === 3 ? 2 : 0); i++) { const k = .55 + row * .28, x = 60 + i * (480 / (5 - (row === 3 ? 2 : 0))) + (row % 2) * 20, y = 230 + row * 110; s += `<g transform="translate(${f(x)},${y}) scale(${f(k)})"><path d="M-22,0 L-20,-60 Q0,-68 20,-60 L22,0Z" fill="${row % 2 ? BLAZER : '#2a2a2a'}"/><path d="M-6,-62 L0,-40 L6,-62" stroke="#ddd" stroke-width="1.6" fill="none"/><rect x="-8" y="-42" width="16" height="11" fill="#f8f8f4"/><ellipse cx="0" cy="-80" rx="15" ry="18" fill="${SKIN[Math.floor(r() * 5)]}"/><path d="M-15,-84 Q-15,-100 0,-100 Q15,-100 15,-84 Q6,-92 -15,-84Z" fill="${HAIR[Math.floor(r() * 5)]}"/><ellipse cx="-5" cy="-80" rx="3.4" ry="1.4" fill="#222"/><ellipse cx="5" cy="-80" rx="3.4" ry="1.4" fill="#222"/></g>`; }
    return K.done(s + `<rect width="600" height="600" fill="#ff2a1a" opacity=".12" style="mix-blend-mode:screen"/>` + K.vignette(.85, 600, 600) + K.grain(.25, 600, 600), SVB);
  };
})();
