/*
 * あそぶ（ねこじゃらし・ネズミの おもちゃ・おえかき・しゃしん）で使う絵（SVG）。
 * G.Art.all に足すので、G.Assets.node('icon_photo') のように使える（画像ファイルは まだ無い）。
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

  /* ================= ネズミの おもちゃ ================= */
  // ゼンマイの ネズミ（右むき。いちばん 下が ゆか）
  const toyMouse = () => svg('0 0 170 120', `
      <ellipse cx="84" cy="112" rx="62" ry="4" fill="#3b3236" opacity=".1"/><path d="M20 84C8 84 4 96 12 102C19 107 27 99 21 94C15 90 7 98 9 106C10 110 14 110.5 18 109.5" fill="none" stroke="#3b3236" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/><path d="M20 84C8 84 4 96 12 102C19 107 27 99 21 94C15 90 7 98 9 106C10 110 14 110.5 18 109.5" fill="none" stroke="#f6a9bf" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="88" cy="30" r="15" fill="#c4bccb" stroke="#3b3236" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="54" cy="104" r="8" fill="#a99fb2" stroke="#3b3236" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="54" cy="104" r="2.5" fill="#fff"/><circle cx="116" cy="104" r="8" fill="#a99fb2" stroke="#3b3236" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="116" cy="104" r="2.5" fill="#fff"/><path d="M38 98C20 98 14 84 18 70C26 46 50 36 76 36C104 36 128 54 144 76C150 82 153 89 147 93C141 97 134 98 124 98Z" fill="#d8d2dc" stroke="#3b3236" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M24 86C30 92 36 93 44 93H122C132 93 138 92 142 90" fill="none" stroke="#c4bccb" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M54 39V24" stroke="#3b3236" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/><path d="M54 39V24" stroke="#ffd76a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M54 20C50 10 38 6 34 13C30 20 42 26 54 20ZM54 20C58 10 70 6 74 13C78 20 66 26 54 20Z" fill="#ffd76a" stroke="#3b3236" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M38 13C40 11 43 11 45 12M63 12C65 11 68 11 70 13" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="54" cy="20" r="3.5" fill="#f3b94a" stroke="#3b3236" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M48 40.4L60 37.6" stroke="#3b3236" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="104" cy="34" r="19" fill="#d8d2dc" stroke="#3b3236" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="104" cy="35" r="11.5" fill="#f6c9d6"/><path d="M34 60C40 50 50 44 62 42" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><ellipse cx="74" cy="44" rx="3" ry="2" fill="#fff"/><ellipse cx="124" cy="64" rx="4.5" ry="5.5" fill="#3b3236"/><circle cx="125.5" cy="62" r="1.6" fill="#fff"/><ellipse cx="128" cy="78" rx="6" ry="4" fill="#f6a9bf" opacity=".8"/><path d="M140 78L162 72M141 83L164 83M140 88L160 94" fill="none" stroke="#3b3236" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="149" cy="88" r="5.5" fill="#f58fb0" stroke="#3b3236" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="147.5" cy="86.5" r="1.4" fill="#fff"/>`);

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
    icon_mouse: () => svg('0 0 200 200', `<g transform="translate(10 40) scale(1.06)">${toyMouse().replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`),
    icon_drawing: () => svg('0 0 200 200', `
      <path d="M58 176 82 40M142 176 118 40M100 176V150" stroke="#c9a253" stroke-width="8" stroke-linecap="round"/>
      <rect x="36" y="30" width="128" height="104" rx="6" fill="#fffdf8" stroke="#c9a253" stroke-width="4"/>
      <path d="M56 110c10-34 30-56 44-56s34 22 44 56" fill="none" stroke="#f47fa8" stroke-width="8" stroke-linecap="round"/>
      <path d="M66 112c8-24 22-40 34-40s26 16 34 40" fill="none" stroke="#f2cb2e" stroke-width="8" stroke-linecap="round"/>
      <path d="M78 114c6-14 14-22 22-22s16 8 22 22" fill="none" stroke="#58a8e6" stroke-width="8" stroke-linecap="round"/>
      <circle cx="140" cy="54" r="10" fill="#f59a3e"/>
      <g transform="translate(150 118) rotate(40)"><rect x="-8" y="-6" width="16" height="64" rx="3" fill="#9b7be0" stroke="rgba(80,50,60,.35)" stroke-width="2"/><path d="M-8-6 0-24 8-6z" fill="#9b7be0" stroke="rgba(80,50,60,.35)" stroke-width="2" stroke-linejoin="round"/><rect x="-8" y="10" width="16" height="30" fill="#fff" opacity=".45"/></g>`),
    icon_photo: () => camera()
  };

  Object.assign(G.Art.all, icons, {
    teaser: () => teaser(false), toy_mouse: toyMouse, item_eraser: eraser, item_newpaper: newPaper,
    item_camera: camera, item_album: album
  });

  return {
    TEASER_TIP, crayon,
    stamp: (s) => G.Art.sticker(s), feathers
  };
})();
