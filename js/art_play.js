/*
 * あそぶ（ねこじゃらし・かくれんぼ・おえかき・ケーキ・おちゃかい・しゃしん）で使う絵（SVG）。
 * G.Art.all に足すので、G.Assets.node('icon_cake') のように使える（画像ファイルは まだ無い）。
 */
window.G = window.G || {};

G.PlayArt = (function () {
  const svg = G.Art.svg, HEART = G.Art.HEART_PATH;
  const LINE = '#b9a294';
  const STAR = 'M50 0C54 38 62 46 100 50 62 54 54 62 50 100 46 62 38 54 0 50 38 46 46 38 50 0z';
  const glint = (x, y, s, fill = '#fffbe6') => `<path transform="translate(${x - 50 * s} ${y - 50 * s}) scale(${s})" d="${STAR}" fill="${fill}"/>`;
  const heartAt = (x, y, s, fill, extra = '') => `<path transform="translate(${x} ${y}) scale(${s}) translate(-16 -14.5)" d="${HEART}" fill="${fill}" ${extra}/>`;
  function starPts(cx, cy, ro, ri) {
    const p = [];
    for (let k = 0; k < 10; k++) {
      const t = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? ri : ro;
      p.push((cx + Math.cos(t) * r).toFixed(1) + ',' + (cy + Math.sin(t) * r).toFixed(1));
    }
    return p.join(' ');
  }

  /* ================= ねこじゃらし ================= */
  // 羽の ふさ（もとの点 = 0,0。上に のびる）
  function feathers() {
    const one = (deg, c, d) => `<g transform="rotate(${deg})">
      <path d="M0 0C-17-24-15-62 0-84 15-62 17-24 0 0z" fill="${c}" stroke="${d}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M0-4V-74" stroke="#fff" stroke-opacity=".75" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M0-24l-9-8M0-40l-9-9M0-56l-7-8M0-24l9-8M0-40l9-9M0-56l7-8" stroke="${d}" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/></g>`;
    return one(-82, '#9fdcbc', '#6fb593') + one(-52, '#93c9ef', '#5f9fcf') + one(-22, '#f6b3c4', '#e08aa3') + one(8, '#c3a3ec', '#9a82c9') + one(38, '#f6d66b', '#d6aa36');
  }
  // ねこじゃらし ぜんたい（360×460）。羽の まんなか（ねらう ところ）= TEASER_TIP
  const TEASER_TIP = { x: 66, y: 64 };
  function teaser(icon) {
    // アイコンは 羽の まわりだけを 大きく みせる
    return svg(icon ? '-4 -8 300 300' : '0 0 360 460', `
      <path d="M104 126 352 456" stroke="#b8913f" stroke-width="14" stroke-linecap="round"/>
      <path d="M104 126 352 456" stroke="#ecd08f" stroke-width="6" stroke-linecap="round"/>
      <path d="M104 126q-4-14-16-22" fill="none" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>
      <g class="tz-feather"><g transform="translate(86 102)">${feathers()}
        <circle r="15" fill="#f37d9b" stroke="#d65f7f" stroke-width="2.5"/><circle cx="-5" cy="-5" r="5" fill="#fff" opacity=".55"/></g></g>
      <circle cx="104" cy="132" r="10" fill="#f1c74f" stroke="#c99a2e" stroke-width="2.5"/><path d="M98 134h12" stroke="#c99a2e" stroke-width="2"/>`, icon ? 'style="overflow:hidden"' : '');
  }

  /* ================= かくれんぼの かくれる場所 ================= */
  const shadow = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="12" fill="#6e3c46" opacity=".12"/>`;
  const hide = {
    // プレゼントの はこ（340×300）
    hide_gift: () => svg('0 0 340 300', `${shadow(170, 290, 160)}
      <rect x="30" y="96" width="280" height="192" rx="10" fill="#a9d6f2" stroke="#6fa9d1" stroke-width="4"/>
      <g fill="#fff" opacity=".7"><circle cx="66" cy="130" r="8"/><circle cx="110" cy="176" r="8"/><circle cx="66" cy="230" r="8"/><circle cx="236" cy="132" r="8"/><circle cx="280" cy="186" r="8"/><circle cx="232" cy="244" r="8"/><circle cx="118" cy="260" r="6"/></g>
      <rect x="148" y="96" width="44" height="192" fill="#f4a3b8" stroke="#d98ea2" stroke-width="3"/>
      <rect x="16" y="64" width="308" height="48" rx="10" fill="#c3e3f8" stroke="#6fa9d1" stroke-width="4"/>
      <rect x="146" y="64" width="48" height="48" fill="#f4a3b8" stroke="#d98ea2" stroke-width="3"/>
      <path d="M36 82h100M206 82h100" stroke="#fff" stroke-opacity=".6" stroke-width="7" stroke-linecap="round"/>
      <g stroke="#d98ea2" stroke-width="3" stroke-linejoin="round" fill="#f4a3b8">
        <path d="M170 64C150 30 112 32 118 54c4 16 34 16 52 10z"/><path d="M170 64c20-34 58-32 52-10-4 16-34 16-52 10z"/>
      </g>
      <ellipse cx="170" cy="62" rx="12" ry="10" fill="#f6b3c4" stroke="#d98ea2" stroke-width="3"/>`),
    // かご（360×280）
    hide_basket: () => svg('0 0 360 280', `${shadow(180, 270, 160)}
      <path d="M28 92h304l-26 166q-126 22-252 0z" fill="#e7bf82" stroke="#b98a4a" stroke-width="4" stroke-linejoin="round"/>
      <g fill="none" stroke="#c99b5c" stroke-width="3" stroke-linecap="round">
        <path d="M40 130q140 14 280 0M44 166q136 14 272 0M48 202q132 14 264 0M52 236q128 12 256 0"/>
        <path d="M80 100l6 158M130 102l3 162M180 102v164M230 102l-3 162M280 100l-6 158"/>
      </g>
      <path d="M36 96q144 18 288 0" fill="none" stroke="#f6dcae" stroke-width="5" stroke-linecap="round"/>
      <path d="M24 92c-14-56 18-80 40-78M336 92c14-56-18-80-40-78" fill="none" stroke="#b98a4a" stroke-width="9" stroke-linecap="round"/>
      <rect x="14" y="74" width="332" height="32" rx="16" fill="#d9a865" stroke="#b98a4a" stroke-width="4"/>
      <path d="M30 84q150-10 300 0" stroke="#f0cf96" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M200 76c40-6 90-4 120 6l-8 96c-4 8-14 10-20 4l-10-10-12 12c-6 6-14 4-16-4z" fill="#f6b3c4" stroke="#d98ea2" stroke-width="3" stroke-linejoin="round"/>
      <path d="M214 86l92 2M210 108l94 4M222 82l-6 84M262 80l-4 92M298 84l-6 74" stroke="#fff" stroke-opacity=".75" stroke-width="5"/>`),
    // ついたて（360×380）
    hide_screen: () => {
      const panel = (pts, rose) => `<polygon points="${pts}" fill="#fff6ee" stroke="#c9a253" stroke-width="5" stroke-linejoin="round"/>
        <g transform="translate(${rose[0]} ${rose[1]})">
          <circle r="22" fill="#f6b3c4" stroke="#e08aa3" stroke-width="2.5"/><path d="M2 2c-4 2-8-2-5-6 4-5 13-2 12 6-1 9-14 11-19 3-5-9 3-19 14-17" fill="none" stroke="#e08aa3" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M-20 18c-14 6-22 2-26-6 10-2 18 0 26 6zM20 18c14 6 22 2 26-6-10-2-18 0-26 6z" fill="#9fdcbc" stroke="#6fb593" stroke-width="2"/></g>`;
      return svg('0 0 360 380', `${shadow(180, 370, 170)}
        ${panel('12,42 124,22 124,354 12,366', [68, 140])}
        ${panel('124,22 236,42 236,366 124,354', [180, 196])}
        ${panel('236,42 348,22 348,354 236,366', [292, 140])}
        <path d="M24 270l96-10M136 262l90 10M248 270l90-10" stroke="#f3c2cf" stroke-width="10" stroke-linecap="round"/>
        <g fill="#c9a253"><rect x="20" y="364" width="18" height="10" rx="4"/><rect x="116" y="352" width="18" height="10" rx="4"/><rect x="226" y="364" width="18" height="10" rx="4"/><rect x="322" y="352" width="18" height="10" rx="4"/></g>`);
    },
    // ソファ（400×270）
    hide_sofa: () => svg('0 0 400 270', `${shadow(200, 262, 190)}
      <path d="M42 160C40 50 92 24 200 24s160 26 158 136z" fill="#f4b3c2" stroke="#d98ea2" stroke-width="4" stroke-linejoin="round"/>
      <path d="M80 70c30-24 70-30 120-30" fill="none" stroke="#fbd8e0" stroke-width="10" stroke-linecap="round"/>
      <g fill="#e98fa8"><circle cx="130" cy="96" r="5"/><circle cx="200" cy="86" r="5"/><circle cx="270" cy="96" r="5"/><circle cx="160" cy="130" r="5"/><circle cx="240" cy="130" r="5"/></g>
      <rect x="54" y="146" width="292" height="58" rx="24" fill="#f7c6d3" stroke="#d98ea2" stroke-width="4"/>
      <path d="M80 160h240" stroke="#fde3ea" stroke-width="8" stroke-linecap="round"/>
      <rect x="10" y="108" width="72" height="124" rx="34" fill="#f4b3c2" stroke="#d98ea2" stroke-width="4"/>
      <rect x="318" y="108" width="72" height="124" rx="34" fill="#f4b3c2" stroke="#d98ea2" stroke-width="4"/>
      <rect x="40" y="196" width="320" height="46" rx="16" fill="#f0a9b9" stroke="#d98ea2" stroke-width="4"/>
      <path d="M58 226q142 10 284 0" fill="none" stroke="#e2c48a" stroke-width="4" stroke-dasharray="8 7"/>
      <g fill="#c9a253"><rect x="46" y="238" width="16" height="22" rx="5"/><rect x="338" y="238" width="16" height="22" rx="5"/></g>`),
    // トランク（340×300）
    hide_trunk: () => svg('0 0 340 300', `${shadow(170, 292, 160)}
      <rect x="10" y="160" width="320" height="130" rx="16" fill="#cf9a72" stroke="#9a6646" stroke-width="4"/>
      <path d="M26 176h288" stroke="#e7bc98" stroke-width="7" stroke-linecap="round"/>
      <rect x="70" y="160" width="26" height="130" fill="#a8714f" stroke="#8a5a3e" stroke-width="3"/>
      <rect x="244" y="160" width="26" height="130" fill="#a8714f" stroke="#8a5a3e" stroke-width="3"/>
      <g fill="#ecd08f" stroke="#b8913f" stroke-width="3"><rect x="150" y="166" width="40" height="22" rx="5"/><rect x="66" y="230" width="34" height="16" rx="4"/><rect x="240" y="230" width="34" height="16" rx="4"/></g>
      <path d="M140 60c0-34 60-34 60 0" fill="none" stroke="#8a6a52" stroke-width="10" stroke-linecap="round"/>
      <rect x="30" y="56" width="280" height="110" rx="16" fill="#a8d9c0" stroke="#6fa58c" stroke-width="4"/>
      <path d="M46 72h248" stroke="#d6f0e2" stroke-width="7" stroke-linecap="round"/>
      <rect x="30" y="100" width="280" height="12" fill="#8fc7ab"/>
      <circle cx="96" cy="128" r="18" fill="#f6b3c4" stroke="#fff" stroke-width="4"/><path transform="translate(83 118) scale(.8)" d="${HEART}" fill="#fff"/>
      <rect x="214" y="116" width="54" height="34" rx="6" fill="#fff6d8" stroke="#fff" stroke-width="3" transform="rotate(8 241 133)"/>
      <path d="M241 120l-6 24h12z" fill="#ae98c3" transform="rotate(8 241 133)"/>`)
  };

  /* ================= おえかき ================= */
  // クレヨン（60×200。とがった先が 上）
  function crayon(color) {
    return svg('0 0 60 200', `
      <path d="M30 6 47 50H13z" fill="${color}" stroke="rgba(80,50,60,.35)" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M30 6 36 22H24z" fill="#fff" opacity=".35"/>
      <rect x="11" y="48" width="38" height="146" rx="6" fill="${color}" stroke="rgba(80,50,60,.35)" stroke-width="2.5"/>
      <rect x="11" y="76" width="38" height="96" fill="#fff" opacity=".42"/>
      <path d="M11 84h38M11 164h38" stroke="${color}" stroke-width="4"/>
      <path d="M20 56v128" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/>`);
  }
  const eraser = () => svg('0 0 120 120', `<g transform="rotate(-28 60 60)">
      <rect x="16" y="38" width="88" height="46" rx="10" fill="#f7c6d3" stroke="#d98ea2" stroke-width="3"/>
      <rect x="56" y="38" width="48" height="46" rx="10" fill="#9fd0f2" stroke="#6fa9d1" stroke-width="3"/>
      <rect x="56" y="38" width="10" height="46" fill="#9fd0f2"/>
      <path d="M24 48h26" stroke="#fff" stroke-opacity=".6" stroke-width="5" stroke-linecap="round"/></g>`);
  const newPaper = () => svg('0 0 120 120', `
      <path d="M26 14h50l20 20v72H26z" fill="#fffdf8" stroke="${LINE}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M76 14v20h20" fill="#f3e6d8" stroke="${LINE}" stroke-width="3" stroke-linejoin="round"/>
      ${glint(60, 66, 0.3, '#ffd24d')}${glint(40, 44, 0.14, '#f6b3c4')}${glint(80, 90, 0.16, '#93c9ef')}`);

  /* ================= ケーキ ================= */
  // ケーキの台と スポンジ（520×420）。上の だ円 = (260, 140) rx200 ry56
  const CAKE = { w: 520, h: 420, cx: 260, cy: 140, rx: 200, ry: 56, side: 160 };
  function cakeBase() {
    const { cx, cy, rx, ry, side } = CAKE, by = cy + side;
    return svg(`0 0 ${CAKE.w} ${CAKE.h}`, `
      <ellipse cx="${cx}" cy="398" rx="150" ry="16" fill="#6e3c46" opacity=".1"/>
      <path d="M210 360h100l18 34H192z" fill="#f4e2b8" stroke="#c9a253" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="${cx}" cy="${by + 30}" rx="248" ry="50" fill="#fffdf8" stroke="#c9a253" stroke-width="4"/>
      <ellipse cx="${cx}" cy="${by + 24}" rx="226" ry="40" fill="#fbf4ea" stroke="#e6cb8d" stroke-width="3"/>
      <path d="M${cx - rx} ${cy}v${side}a${rx} ${ry} 0 0 0 ${rx * 2} 0v-${side}z" fill="#f8dca2" stroke="#d9ad62" stroke-width="3"/>
      <path d="M${cx - rx} ${cy + 64}a${rx} ${ry} 0 0 0 ${rx * 2} 0v18a${rx} ${ry} 0 0 1-${rx * 2} 0z" fill="#fffaf0"/>
      <path d="M${cx - rx} ${cy + 82}a${rx} ${ry} 0 0 0 ${rx * 2} 0v14a${rx} ${ry} 0 0 1-${rx * 2} 0z" fill="#ee8aa3"/>
      <g fill="#e9c27e" opacity=".8"><circle cx="120" cy="200" r="3"/><circle cx="180" cy="290" r="3"/><circle cx="330" cy="300" r="3"/><circle cx="390" cy="196" r="3"/><circle cx="250" cy="196" r="2.5"/><circle cx="300" cy="230" r="2.5"/></g>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fbe7bd" stroke="#d9ad62" stroke-width="3"/>`);
  }
  // クリーム（cakeBase に かさねる）。うえと、まわりに たれる ところ
  function cakeCream(cr) {
    const { cx, cy, rx, ry } = CAKE;
    let drip = `M${cx - rx - 4} ${cy}`;
    const N = 9;
    for (let i = 0; i <= N; i++) { // 手前の ふちを たどって、ところどころ たらす
      const t = Math.PI - (i / N) * Math.PI;
      const x = cx + Math.cos(t) * (rx + 4), y = cy + Math.sin(t) * ry;
      const d = i % 2 ? 46 : 26;
      drip += ` L${x.toFixed(1)} ${(y + d).toFixed(1)}`;
    }
    drip += ` L${cx + rx + 4} ${cy} A${rx + 4} ${ry} 0 0 1 ${cx - rx - 4} ${cy}z`;
    return svg(`0 0 ${CAKE.w} ${CAKE.h}`, `
      <path d="${drip}" fill="${cr.color}" stroke="${cr.edge}" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx + 4}" ry="${ry + 2}" fill="${cr.color}" stroke="${cr.edge}" stroke-width="3"/>
      <path d="M${cx - 150} ${cy - 18}q60-26 150-28" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="9" stroke-linecap="round"/>`);
  }
  // しぼった クリーム（1こ）
  const rosette = (cr) => svg('0 0 60 60', `
      <path d="M30 6c8 6 4 10 12 12s10 10 4 16 2 12-8 14-10 6-16 0-14-2-14-10 2-10-2-16 6-12 12-12 4-8 12-4z" fill="${cr.color}" stroke="${cr.edge}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M22 22c6-6 14-4 16 2M20 34c8 4 16 4 22-2" fill="none" stroke="${cr.edge}" stroke-width="2" stroke-linecap="round" opacity=".7"/>
      <ellipse cx="24" cy="18" rx="5" ry="3" fill="#fff" opacity=".5"/>`);
  // しぼりぶくろ（120×160。先が 下）
  const pipingBag = (cr) => svg('0 0 120 160', `
      <path d="M14 16h92L66 132H54z" fill="#fffdf8" stroke="${LINE}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M22 26h76L64 122H56z" fill="${cr.color}" stroke="${cr.edge}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M50 128h20l-4 22h-12z" fill="#ecd08f" stroke="#b8913f" stroke-width="3" stroke-linejoin="round"/>
      <path d="M10 10h100v14H10z" fill="#f4a3b8" stroke="#d98ea2" stroke-width="3" stroke-linejoin="round"/>
      <path d="M34 40l12 60" stroke="#fff" stroke-opacity=".6" stroke-width="6" stroke-linecap="round"/>`);
  // のせるもの（100×100）
  const topping = {
    strawberry: () => svg('0 0 100 100', `
      <path d="M50 92C26 80 14 56 18 40c4-14 18-18 32-12 14-6 28-2 32 12 4 16-8 40-32 52z" fill="#ef4f63" stroke="#c43449" stroke-width="3" stroke-linejoin="round"/>
      <g fill="#ffe7a8"><ellipse cx="36" cy="48" rx="2" ry="3"/><ellipse cx="52" cy="44" rx="2" ry="3"/><ellipse cx="66" cy="50" rx="2" ry="3"/><ellipse cx="42" cy="62" rx="2" ry="3"/><ellipse cx="58" cy="64" rx="2" ry="3"/><ellipse cx="50" cy="78" rx="2" ry="3"/></g>
      <path d="M50 30 38 18l12 4 0-14 6 13 12-5-8 12z" fill="#7cc483" stroke="#4f9a58" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="32" cy="40" rx="6" ry="4" fill="#fff" opacity=".45" transform="rotate(-30 32 40)"/>`),
    cherry: () => svg('0 0 100 100', `
      <path d="M36 62C40 36 52 18 66 10M64 64C64 40 66 24 66 10" fill="none" stroke="#6aa86a" stroke-width="4" stroke-linecap="round"/>
      <path d="M66 10c10-4 20 0 24 8-10 4-20 2-24-8z" fill="#8fcf8f" stroke="#6aa86a" stroke-width="2"/>
      <circle cx="34" cy="72" r="18" fill="#e23e5a" stroke="#b72a45" stroke-width="3"/><circle cx="66" cy="74" r="18" fill="#e8455f" stroke="#b72a45" stroke-width="3"/>
      <ellipse cx="28" cy="66" rx="5" ry="3.5" fill="#fff" opacity=".6"/><ellipse cx="60" cy="68" rx="5" ry="3.5" fill="#fff" opacity=".6"/>`),
    macaron: () => svg('0 0 100 100', `
      <path d="M16 56h68c0 14-8 22-20 22H36c-12 0-20-8-20-22z" fill="#f6a9c0" stroke="#d9799a" stroke-width="3" stroke-linejoin="round"/>
      <rect x="16" y="46" width="68" height="12" rx="6" fill="#fffaf2" stroke="#eadfcf" stroke-width="2.5"/>
      <path d="M14 48c0-20 14-28 36-28s36 8 36 28z" fill="#f6a9c0" stroke="#d9799a" stroke-width="3" stroke-linejoin="round"/>
      <path d="M28 34c6-6 12-8 20-8" fill="none" stroke="#fcd6e2" stroke-width="5" stroke-linecap="round"/>`),
    heart: () => svg('0 0 100 100', `${heartAt(50, 52, 2.6, '#8a5038', 'stroke="#5e3322" stroke-width="1.2" stroke-linejoin="round"')}
      ${heartAt(50, 50, 1.9, '#a8664a')}
      <path d="M30 36c4-6 10-8 16-6" fill="none" stroke="#e2b9a2" stroke-width="4" stroke-linecap="round"/>`),
    star: () => svg('0 0 100 100', `
      <polygon points="${starPts(50, 52, 44, 22)}" fill="#f1c26a" stroke="#c9913a" stroke-width="3" stroke-linejoin="round"/>
      <polygon points="${starPts(50, 52, 34, 16)}" fill="#fff2d6" opacity=".8"/>
      <g fill="#f37d9b"><circle cx="50" cy="40" r="3.5"/><circle cx="40" cy="56" r="3.5"/><circle cx="60" cy="56" r="3.5"/></g>`),
    candy: () => svg('0 0 100 100', `
      <path d="M26 50 6 34v32zM74 50l20-16v32z" fill="#9fd0f2" stroke="#6fa9d1" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="50" cy="50" r="26" fill="#f6b3c4" stroke="#d98ea2" stroke-width="3"/>
      <path d="M50 24c14 8 14 44 0 52M34 30c10 10 10 30 0 40M66 30c-10 10-10 30 0 40" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="40" cy="38" rx="6" ry="4" fill="#fff" opacity=".6" transform="rotate(-30 40 38)"/>`)
  };
  // ろうそく（40×140）。火は べつの 要素
  const candle = () => svg('0 0 40 140', `
      <path d="M20 4v18" stroke="#6b5463" stroke-width="3" stroke-linecap="round"/>
      <rect x="8" y="20" width="24" height="116" rx="6" fill="#fffaf2" stroke="#d98ea2" stroke-width="3"/>
      <path d="M8 40l24-12M8 64l24-12M8 88l24-12M8 112l24-12M8 134l24-10" stroke="#f4a3b8" stroke-width="7"/>
      <path d="M14 26v104" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>`);

  /* ================= おちゃかい ================= */
  // テーブル（760×330）。上の だ円 = (380, 110) rx370 ry100
  const teaTable = () => {
    let hem = '';
    for (let i = 0; i <= 14; i++) {
      const x = 22 + i * 51.1;
      hem += `<circle cx="${x.toFixed(1)}" cy="${(290 + Math.sin(i / 14 * Math.PI) * 18).toFixed(1)}" r="14" fill="#fff" stroke="#eadfcf" stroke-width="3"/>`;
    }
    return svg('0 0 760 330', `
      <ellipse cx="380" cy="320" rx="330" ry="10" fill="#6e3c46" opacity=".1"/>
      <path d="M10 110 22 292Q380 336 738 292L750 110A370 100 0 0 1 10 110z" fill="#fffdf8" stroke="#e6d6c4" stroke-width="3"/>
      ${hem}
      <path d="M24 250Q380 296 736 250" fill="none" stroke="#f6b3c4" stroke-width="12"/>
      <path d="M24 250Q380 296 736 250" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="4 10" stroke-linecap="round"/>
      <path d="M60 170c10 40 12 80 8 110" fill="none" stroke="#f3ece4" stroke-width="10" stroke-linecap="round"/>
      <ellipse cx="380" cy="110" rx="370" ry="100" fill="#fffdf8" stroke="#e6d6c4" stroke-width="3"/>
      <ellipse cx="380" cy="110" rx="330" ry="80" fill="none" stroke="#f9dbe3" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round"/>`);
  };
  // カップと おさら（160×130）。.tea-liquid が こうちゃ
  const teacup = () => svg('0 0 160 130', `
      <ellipse cx="80" cy="110" rx="74" ry="17" fill="#fffdf8" stroke="#c9a253" stroke-width="3"/>
      <ellipse cx="80" cy="106" rx="52" ry="10" fill="#fbf4ea" stroke="#e6cb8d" stroke-width="2.5"/>
      <path d="M128 50c22-4 26 30 0 36" fill="none" stroke="#c9a253" stroke-width="9" stroke-linecap="round"/>
      <path d="M128 50c22-4 26 30 0 36" fill="none" stroke="#fffdf8" stroke-width="4" stroke-linecap="round"/>
      <path d="M28 44h104c-2 34-20 58-52 60-32-2-50-26-52-60z" fill="#fffdf8" stroke="#c9a253" stroke-width="3" stroke-linejoin="round"/>
      <path d="M34 62h92" stroke="#f6b3c4" stroke-width="8"/>
      ${heartAt(80, 80, 0.7, '#f37d9b')}
      <path d="M40 54c2 16 8 30 18 38" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/>
      <ellipse cx="80" cy="44" rx="52" ry="12" fill="#fbf1e6" stroke="#c9a253" stroke-width="3"/>
      <ellipse class="tea-liquid" cx="80" cy="45" rx="45" ry="8.5" fill="#c97a3c"/>
      <ellipse class="tea-liquid" cx="68" cy="43" rx="14" ry="3" fill="#e9a76a"/>`);
  // ティーポット（220×180）。そそぎ口は 左
  const teapot = () => svg('0 0 220 180', `
      <path d="M58 96C36 92 22 74 10 52c14 2 26 14 34 26" fill="#f7c6d3" stroke="#d98ea2" stroke-width="4" stroke-linejoin="round"/>
      <path d="M160 74c40-14 52 52 4 60" fill="none" stroke="#d98ea2" stroke-width="12" stroke-linecap="round"/>
      <path d="M160 74c40-14 52 52 4 60" fill="none" stroke="#f7c6d3" stroke-width="5" stroke-linecap="round"/>
      <path d="M44 110c0-40 30-64 66-64s66 24 66 64c0 34-28 56-66 56s-66-22-66-56z" fill="#f7c6d3" stroke="#d98ea2" stroke-width="4"/>
      <path d="M50 120q60 22 120 0" fill="none" stroke="#ecd08f" stroke-width="6"/>
      <g transform="translate(110 104)"><circle r="16" fill="#fffaf2" stroke="#e08aa3" stroke-width="2.5"/><circle r="7" fill="#f37d9b"/>
        <path d="M-16 14c-12 4-20 0-22-6 8-2 16 0 22 6zM16 14c12 4 20 0 22-6-8-2-16 0-22 6z" fill="#9fdcbc" stroke="#6fb593" stroke-width="2"/></g>
      <path d="M62 92c6-16 18-28 34-32" fill="none" stroke="#fde3ea" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="110" cy="48" rx="42" ry="10" fill="#f4b3c2" stroke="#d98ea2" stroke-width="3.5"/>
      <path d="M80 46c0-16 14-24 30-24s30 8 30 24" fill="#f7c6d3" stroke="#d98ea2" stroke-width="3.5"/>
      <circle cx="110" cy="18" r="9" fill="#ecd08f" stroke="#b8913f" stroke-width="3"/>`);
  // そそぎ口の 先（teapot の 中の 位置）
  const TEAPOT_SPOUT = { x: 12, y: 52 };
  const sugarBowl = () => svg('0 0 160 140', `
      <ellipse cx="80" cy="128" rx="54" ry="9" fill="#6e3c46" opacity=".1"/>
      <path d="M22 60h116c0 40-26 64-58 64S22 100 22 60z" fill="#fffdf8" stroke="#c9a253" stroke-width="3"/>
      <path d="M30 80q50 18 100 0" fill="none" stroke="#9fd0f2" stroke-width="7"/>
      <ellipse cx="80" cy="60" rx="58" ry="14" fill="#fbf1e6" stroke="#c9a253" stroke-width="3"/>
      <g fill="#fff" stroke="#d8cfc6" stroke-width="2"><rect x="44" y="38" width="22" height="22" rx="4" transform="rotate(-12 55 49)"/><rect x="70" y="34" width="22" height="22" rx="4" transform="rotate(10 81 45)"/><rect x="92" y="42" width="22" height="22" rx="4" transform="rotate(-6 103 53)"/></g>
      ${glint(60, 40, 0.1)}${glint(100, 40, 0.08)}`);
  const sugarCube = () => svg('0 0 40 40', `<rect x="6" y="6" width="28" height="28" rx="5" fill="#fff" stroke="#d8cfc6" stroke-width="2.5"/>
      <path d="M10 12h12" stroke="#f2ede8" stroke-width="3" stroke-linecap="round"/>${glint(28, 12, 0.1)}`);

  /* ================= しゃしん ================= */
  const camera = () => svg('0 0 200 200', `
      <path d="M62 50l12-18h52l12 18z" fill="#e98fa8" stroke="#c9667f" stroke-width="3.5" stroke-linejoin="round"/>
      <rect x="138" y="36" width="26" height="16" rx="5" fill="#ecd08f" stroke="#b8913f" stroke-width="3"/>
      <rect x="18" y="50" width="164" height="118" rx="22" fill="#f6b3c4" stroke="#c9667f" stroke-width="4"/>
      <rect x="18" y="76" width="164" height="22" fill="#f9cbd5"/>
      <rect x="34" y="62" width="30" height="16" rx="5" fill="#fffaf2" stroke="#c9667f" stroke-width="2.5"/>
      <circle cx="100" cy="112" r="44" fill="#fffaf2" stroke="#c9667f" stroke-width="4"/>
      <circle cx="100" cy="112" r="32" fill="#5d6e93" stroke="#3f4b6a" stroke-width="3"/>
      <circle cx="100" cy="112" r="18" fill="#3f4b6a"/>
      <ellipse cx="88" cy="100" rx="10" ry="6" fill="#fff" opacity=".65" transform="rotate(-35 88 100)"/>
      <circle cx="112" cy="124" r="4" fill="#fff" opacity=".45"/>
      ${heartAt(158, 146, 0.55, '#fff', 'opacity=".85"')}`);
  const album = () => svg('0 0 200 200', `
      <rect x="30" y="22" width="140" height="160" rx="14" fill="#f4b3c2" stroke="#c9667f" stroke-width="4"/>
      <rect x="30" y="22" width="22" height="160" rx="8" fill="#e98fa8" stroke="#c9667f" stroke-width="3"/>
      <g transform="rotate(-8 108 96)"><rect x="66" y="50" width="86" height="96" rx="4" fill="#fff" stroke="#e6d6c4" stroke-width="2.5"/>
        <rect x="74" y="58" width="70" height="62" fill="#cfe6f2"/><circle cx="108" cy="96" r="16" fill="#fff"/>
        <path d="M96 84l4-12 8 9 8-9 4 12z" fill="#fff"/>${heartAt(108, 76, 0.32, '#f37d9b')}</g>
      ${glint(156, 40, 0.16, '#fff6c9')}`);

  /* ================= メニューの アイコン（200×200） ================= */
  const icons = {
    icon_teaser: () => teaser(true),
    icon_hide: () => svg('0 0 200 200', `
      <path d="M64 86 78 34l32 40z" fill="#fff" stroke="${LINE}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M72 78l8-30 16 22z" fill="#f6c3cf"/>
      <path d="M136 86 122 34 90 74z" fill="#fff" stroke="${LINE}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M128 78l-8-30-16 22z" fill="#f6c3cf"/>
      <path d="M70 92c4-20 18-28 30-28s26 8 30 28z" fill="#fff" stroke="${LINE}" stroke-width="3.5"/>
      <g stroke="#d98ea2" stroke-width="2.5" fill="#f4a3b8"><path d="M100 60c-10-16-28-14-26-2 2 8 16 8 26 2z"/><path d="M100 60c10-16 28-14 26-2-2 8-16 8-26 2z"/></g>
      <circle cx="100" cy="60" r="6" fill="#f6b3c4" stroke="#d98ea2" stroke-width="2.5"/>
      <rect x="30" y="104" width="140" height="80" rx="8" fill="#a9d6f2" stroke="#6fa9d1" stroke-width="4"/>
      <rect x="22" y="88" width="156" height="26" rx="7" fill="#c3e3f8" stroke="#6fa9d1" stroke-width="4"/>
      <rect x="88" y="88" width="24" height="96" fill="#f4a3b8" stroke="#d98ea2" stroke-width="3"/>
      <g fill="#fff" opacity=".75"><circle cx="52" cy="134" r="6"/><circle cx="62" cy="164" r="5"/><circle cx="146" cy="130" r="6"/><circle cx="140" cy="164" r="5"/></g>
      ${glint(168, 52, 0.2, '#ffd24d')}${glint(36, 58, 0.14, '#ffd24d')}`),
    icon_drawing: () => svg('0 0 200 200', `
      <path d="M58 176 82 40M142 176 118 40M100 176V150" stroke="#c9a253" stroke-width="8" stroke-linecap="round"/>
      <rect x="36" y="30" width="128" height="104" rx="6" fill="#fffdf8" stroke="#c9a253" stroke-width="4"/>
      <path d="M56 110c10-34 30-56 44-56s34 22 44 56" fill="none" stroke="#f47fa8" stroke-width="8" stroke-linecap="round"/>
      <path d="M66 112c8-24 22-40 34-40s26 16 34 40" fill="none" stroke="#f2cb2e" stroke-width="8" stroke-linecap="round"/>
      <path d="M78 114c6-14 14-22 22-22s16 8 22 22" fill="none" stroke="#58a8e6" stroke-width="8" stroke-linecap="round"/>
      <circle cx="140" cy="54" r="10" fill="#f59a3e"/>
      <g transform="translate(150 118) rotate(40)"><rect x="-8" y="-6" width="16" height="64" rx="3" fill="#9b7be0" stroke="rgba(80,50,60,.35)" stroke-width="2"/><path d="M-8-6 0-24 8-6z" fill="#9b7be0" stroke="rgba(80,50,60,.35)" stroke-width="2" stroke-linejoin="round"/><rect x="-8" y="10" width="16" height="30" fill="#fff" opacity=".45"/></g>`),
    icon_cake: () => svg('0 0 200 200', `
      <ellipse cx="100" cy="170" rx="88" ry="20" fill="#fffdf8" stroke="#c9a253" stroke-width="3.5"/>
      <path d="M36 98v60a64 18 0 0 0 128 0V98z" fill="#f8dca2" stroke="#d9ad62" stroke-width="3"/>
      <path d="M36 124a64 18 0 0 0 128 0v8a64 18 0 0 1-128 0z" fill="#ee8aa3"/>
      <path d="M32 98 32 118 46 112 58 124 72 114 86 126 100 116 114 126 128 114 142 124 154 112 168 118 168 98z" fill="#fff8ec" stroke="#e6d3b8" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="100" cy="98" rx="68" ry="20" fill="#fff8ec" stroke="#e6d3b8" stroke-width="3"/>
      <g transform="translate(62 70) scale(.5)">${topping.strawberry().replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>
      <g transform="translate(104 72) scale(.44)">${topping.strawberry().replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>
      <rect x="94" y="34" width="12" height="48" rx="4" fill="#fffaf2" stroke="#d98ea2" stroke-width="2.5"/>
      <path d="M94 46l12-6M94 60l12-6M94 74l12-6" stroke="#f4a3b8" stroke-width="4"/>
      <path d="M100 8c8 10 10 16 6 22-2 4-10 4-12 0-4-6-2-12 6-22z" fill="#ffc94d" stroke="#f29b3a" stroke-width="2.5"/>`),
    icon_tea: () => svg('0 0 200 200', `
      <path d="M78 52c-8-12 8-18 0-30M100 48c-8-12 8-18 0-30M122 52c-8-12 8-18 0-30" fill="none" stroke="#e6d6c4" stroke-width="5" stroke-linecap="round"/>
      <g transform="translate(20 52)">${teacup().replace(/^<svg[^>]*>|<\/svg>$/g, '').replace(/class="tea-liquid" /g, '')}</g>`),
    icon_photo: () => camera()
  };

  Object.assign(G.Art.all, hide, icons, {
    teaser: () => teaser(false), item_eraser: eraser, item_newpaper: newPaper,
    cake_base: cakeBase, item_candle: candle,
    tea_table: teaTable, item_teacup: teacup, item_teapot: teapot, item_sugarbowl: sugarBowl, item_sugar: sugarCube,
    item_camera: camera, item_album: album
  });

  return {
    TEASER_TIP, CAKE, TEAPOT_SPOUT, crayon, cakeCream, rosette, pipingBag, topping,
    stamp: (s) => G.Art.makeupSwatch('deco', s), feathers
  };
})();
