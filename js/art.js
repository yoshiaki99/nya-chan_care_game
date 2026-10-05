/*
 * ゲームの中で描く絵（SVG）。
 * 背景・アイテム・アイコンの画像ファイルが届くまでの代わり、およびメーターやボタンの小さな飾りに使う。
 */
window.G = window.G || {};

G.Art = (function () {
  const LINE = '#b9a294';
  let uid = 0;
  const id = (p) => p + (++uid);

  function svg(vb, inner, attrs = '') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" ${attrs}>${inner}</svg>`;
  }

  /* ---------- ハート・きらきら ---------- */
  const HEART_PATH = 'M16 28C6 20 1 14 1 8.5 1 4 4.5 1 8.5 1c3 0 5.5 1.7 7.5 4.5C18 2.7 20.5 1 23.5 1 27.5 1 31 4 31 8.5 31 14 26 20 16 28z';
  function heart(fill = '#f37d9b', stroke = '#ffffff', sw = 2.5) {
    return svg('-2 -2 36 34', `<path d="${HEART_PATH}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>
      <ellipse cx="9" cy="8" rx="3.6" ry="2.4" fill="#fff" opacity=".55" transform="rotate(-30 9 8)"/>`);
  }
  function heartEmpty(color) {
    return svg('-2 -2 36 34', `<path d="${HEART_PATH}" fill="${color}" fill-opacity=".14" stroke="${color}" stroke-opacity=".75" stroke-width="2.6" stroke-linejoin="round"/>`);
  }
  function sparkle(fill = '#fff6c9') {
    return svg('0 0 100 100', `<path d="M50 0C54 38 62 46 100 50 62 54 54 62 50 100 46 62 38 54 0 50 38 46 46 38 50 0z" fill="${fill}"/>`);
  }

  /* ---------- メーターのアイコン ---------- */
  const meterIcons = {
    hunger: () => svg('0 0 64 64', `
      <path d="M8 33c10-14 28-16 40-2-12 13-30 12-40 2z" fill="#8ec5e8" stroke="#5f97bf" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M46 31l12-9c-2 6-2 12 0 18z" fill="#7ab6de" stroke="#5f97bf" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M16 36c8 5 18 5 26 0" fill="none" stroke="#c9e6f7" stroke-width="3" stroke-linecap="round"/>
      <circle cx="17" cy="30" r="3" fill="#3d4a66"/><circle cx="16" cy="29" r="1" fill="#fff"/>`),
    clean: () => svg('0 0 64 64', `
      <circle cx="24" cy="36" r="16" fill="#e7f6fd" stroke="#79c4e6" stroke-width="3"/>
      <circle cx="44" cy="22" r="11" fill="#eef9ff" stroke="#9ad3ef" stroke-width="3"/>
      <circle cx="46" cy="46" r="7" fill="#f3fbff" stroke="#9ad3ef" stroke-width="2.5"/>
      <path d="M15 30a10 10 0 0 1 8-7" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M39 18a6 6 0 0 1 5-4" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`),
    fun: () => yarnSvg('#f3a9c9', '#d97aa5', '#fbd3e5', '0 0 64 64', 32, 33, 22),
    energy: () => svg('0 0 64 64', `
      <path d="M40 8a24 24 0 1 0 16 38A20 20 0 0 1 40 8z" fill="#f6d66b" stroke="#d6aa36" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="26" cy="28" r="2.5" fill="#e9bd4a" opacity=".6"/><circle cx="20" cy="40" r="3.5" fill="#e9bd4a" opacity=".5"/>
      <path d="M50 14l2 4 4 1-4 2-2 4-2-4-4-2 4-1z" fill="#fff3b5"/>`)
  };

  function yarnSvg(fill, stroke, light, vb = '0 0 200 200', cx = 100, cy = 100, r = 62) {
    const k = r / 62;
    const t = (x, y) => `${cx + x * k} ${cy + y * k}`;
    return svg(vb, `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${3 * k + 0.5}"/>
      <path d="M${t(-50, -30)}C${t(-10, -50)} ${t(30, -40)} ${t(55, -10)}" fill="none" stroke="${light}" stroke-width="${5 * k}" stroke-linecap="round"/>
      <path d="M${t(-58, -6)}C${t(-10, -30)} ${t(36, -18)} ${t(60, 14)}" fill="none" stroke="${stroke}" stroke-opacity=".6" stroke-width="${4 * k}" stroke-linecap="round"/>
      <path d="M${t(-56, 18)}C${t(-14, -4)} ${t(30, 6)} ${t(52, 34)}" fill="none" stroke="${light}" stroke-width="${5 * k}" stroke-linecap="round"/>
      <path d="M${t(-40, 44)}C${t(-10, 26)} ${t(18, 32)} ${t(34, 52)}" fill="none" stroke="${stroke}" stroke-opacity=".6" stroke-width="${4 * k}" stroke-linecap="round"/>
      <path d="M${t(-20, -58)}C${t(-44, -20)} ${t(-40, 26)} ${t(-14, 58)}" fill="none" stroke="${stroke}" stroke-opacity=".45" stroke-width="${3.5 * k}" stroke-linecap="round"/>
      <path d="M${t(20, -58)}C${t(2, -20)} ${t(6, 30)} ${t(30, 56)}" fill="none" stroke="${light}" stroke-width="${4 * k}" stroke-linecap="round"/>
      <ellipse cx="${cx - 24 * k}" cy="${cy - 28 * k}" rx="${12 * k}" ry="${7 * k}" fill="#fff" opacity=".45" transform="rotate(-35 ${cx - 24 * k} ${cy - 28 * k})"/>`);
  }

  /* ---------- リボン（おしゃれの見本） ---------- */
  function bow(color, pattern) {
    const g = id('bg');
    let fill = color, extra = '', defs = '';
    if (color === 'rainbow') {
      defs = `<linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="#f6a1b5"/><stop offset=".2" stop-color="#f9c98a"/><stop offset=".4" stop-color="#f6e48a"/><stop offset=".6" stop-color="#a9e0b8"/><stop offset=".8" stop-color="#9fcdf2"/><stop offset="1" stop-color="#c8a9ec"/></linearGradient>`;
      fill = `url(#${g})`;
    }
    if (pattern === 'dots') {
      defs += `<pattern id="${g}d" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="3.2" fill="#fff" opacity=".95"/><circle cx="13" cy="13" r="3.2" fill="#fff" opacity=".95"/></pattern>`;
      extra = `<g fill="url(#${g}d)"><path d="M60 45C40 18 10 10 8 30c-2 19 22 33 52 15z"/><path d="M60 45c20-27 50-35 52-15 2 19-22 33-52 15z"/></g>`;
    }
    if (pattern === 'glitter') {
      extra = `<g fill="#fffbe6">${[[28, 30], [44, 22], [86, 26], [96, 38], [50, 70], [72, 76], [22, 40]].map(([x, y]) => `<path transform="translate(${x} ${y}) scale(.09)" d="M50 0C54 38 62 46 100 50 62 54 54 62 50 100 46 62 38 54 0 50 38 46 46 38 50 0z"/>`).join('')}</g>`;
    }
    return svg('0 0 120 96', `<defs>${defs}</defs>
      <g stroke="rgba(120,80,90,.35)" stroke-width="2.5" stroke-linejoin="round">
        <path d="M56 50 38 88l13-4 7 11 5-42z" fill="${fill}"/>
        <path d="M64 50l18 38-13-4-7 11-5-42z" fill="${fill}"/>
        <path d="M60 45C40 18 10 10 8 30c-2 19 22 33 52 15z" fill="${fill}"/>
        <path d="M60 45c20-27 50-35 52-15 2 19-22 33-52 15z" fill="${fill}"/>
      </g>
      ${extra}
      <path d="M22 26c6-6 16-4 26 6" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"/>
      <path d="M98 26c-6-6-16-4-26 6" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="60" cy="46" rx="11" ry="13" fill="${fill}" stroke="rgba(120,80,90,.4)" stroke-width="2.5"/>
      <ellipse cx="57" cy="42" rx="4" ry="3" fill="#fff" opacity=".5"/>`);
  }

  /* ---------- アイテム ---------- */
  const items = {
    item_fish: () => svg('0 0 200 200', `
      <ellipse cx="100" cy="142" rx="90" ry="38" fill="#fffdf9" stroke="${LINE}" stroke-width="3"/>
      <ellipse cx="100" cy="138" rx="70" ry="26" fill="#fbf4ea" stroke="#e6cb8d" stroke-width="3"/>
      <path d="M34 118c26-40 78-44 108-6-28 32-80 34-108 6z" fill="#8ec5e8" stroke="#5f97bf" stroke-width="3" stroke-linejoin="round"/>
      <path d="M140 112l30-24c-6 16-6 34 0 50z" fill="#7ab6de" stroke="#5f97bf" stroke-width="3" stroke-linejoin="round"/>
      <path d="M48 126c22 14 54 16 82 2" fill="none" stroke="#d2ecfa" stroke-width="7" stroke-linecap="round"/>
      <path d="M86 92c8-12 22-14 30-8" fill="#a8d4ef" stroke="#5f97bf" stroke-width="2.5"/>
      <path d="M84 108q6 6 0 12M98 106q6 7 0 14M112 106q6 7 0 14" fill="none" stroke="#6ea8cf" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="56" cy="112" r="7" fill="#3d4a66"/><circle cx="54" cy="110" r="2.4" fill="#fff"/>`),
    item_milk: () => svg('0 0 200 200', `
      <ellipse cx="100" cy="182" rx="56" ry="9" fill="#e9d9cc" opacity=".6"/>
      <path d="M78 42h44v16c0 8 8 16 12 22 10 14 12 24 12 38v50c0 10-8 16-16 16H70c-8 0-16-6-16-16v-50c0-14 2-24 12-38 4-6 12-14 12-22z" fill="#fffefb" stroke="${LINE}" stroke-width="3"/>
      <path d="M58 116h84v52c0 8-6 13-13 13H71c-7 0-13-5-13-13z" fill="#ffffff"/>
      <rect x="72" y="26" width="56" height="22" rx="8" fill="#f4a3b8" stroke="#d98ea2" stroke-width="3"/>
      <rect x="66" y="112" width="68" height="44" rx="12" fill="#fde3ea" stroke="#f0b7c6" stroke-width="2.5"/>
      <path transform="translate(88 122) scale(.75)" d="${HEART_PATH}" fill="#f37d9b"/>
      <path d="M70 84c-6 12-6 40-4 70" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/>
      <path d="M70 84c-6 12-6 40-4 70" fill="none" stroke="#e9eef3" stroke-width="2" stroke-linecap="round"/>`),
    item_cream: () => svg('0 0 200 200', `
      <ellipse cx="100" cy="176" rx="76" ry="15" fill="#fff" stroke="${LINE}" stroke-width="3"/>
      <path d="M150 116c22-2 24 28 2 34" fill="none" stroke="${LINE}" stroke-width="9" stroke-linecap="round"/>
      <path d="M150 116c22-2 24 28 2 34" fill="none" stroke="#fff8f4" stroke-width="4" stroke-linecap="round"/>
      <path d="M38 104h124c-4 46-30 64-62 66-32-2-58-20-62-66z" fill="#fff8f4" stroke="${LINE}" stroke-width="3"/>
      <path d="M44 124h112" stroke="#e6cb8d" stroke-width="5"/>
      <path transform="translate(88 136) scale(.75)" d="${HEART_PATH}" fill="#f6b3c4"/>
      <ellipse cx="100" cy="102" rx="60" ry="17" fill="#fffaf0" stroke="#e5d6c6" stroke-width="3"/>
      <ellipse cx="100" cy="86" rx="46" ry="16" fill="#fffaf0" stroke="#e5d6c6" stroke-width="3"/>
      <ellipse cx="100" cy="70" rx="31" ry="13" fill="#fffaf0" stroke="#e5d6c6" stroke-width="3"/>
      <path d="M84 60q16-22 32 0" fill="#fffaf0" stroke="#e5d6c6" stroke-width="3"/>
      <path d="M100 30c14 0 22 10 18 20-4 10-14 14-18 16-4-2-14-6-18-16-4-10 4-20 18-20z" fill="#f2697f" stroke="#cf4d66" stroke-width="2.5"/>
      <path d="M92 30l8-10 8 10-8-3z" fill="#8fcf8f" stroke="#6aa86a" stroke-width="2"/>
      <circle cx="94" cy="42" r="1.6" fill="#ffe8a8"/><circle cx="104" cy="40" r="1.6" fill="#ffe8a8"/><circle cx="99" cy="50" r="1.6" fill="#ffe8a8"/>`),
    item_croissant: () => svg('0 0 200 200', `
      <ellipse cx="100" cy="150" rx="88" ry="32" fill="#fffdf9" stroke="${LINE}" stroke-width="3"/>
      <ellipse cx="100" cy="146" rx="68" ry="21" fill="#fbf4ea" stroke="#e6cb8d" stroke-width="3"/>
      <g stroke="#b97a3c" stroke-width="3">
        <ellipse cx="38" cy="132" rx="15" ry="19" transform="rotate(-50 38 132)" fill="#e9a95a"/>
        <ellipse cx="162" cy="132" rx="15" ry="19" transform="rotate(50 162 132)" fill="#e9a95a"/>
        <ellipse cx="64" cy="112" rx="23" ry="30" transform="rotate(-28 64 112)" fill="#f0b765"/>
        <ellipse cx="136" cy="112" rx="23" ry="30" transform="rotate(28 136 112)" fill="#f0b765"/>
        <ellipse cx="100" cy="104" rx="33" ry="34" fill="#f4c277"/>
      </g>
      <g fill="none" stroke="#fbe0a8" stroke-width="6" stroke-linecap="round">
        <path d="M84 82c8-8 24-8 32 0"/><path d="M50 98c4-8 14-12 22-10"/><path d="M128 88c8-2 18 2 22 10"/>
      </g>
      <g fill="none" stroke="#d48f45" stroke-width="2.5" stroke-linecap="round" opacity=".7">
        <path d="M80 122c12 6 28 6 40 0"/><path d="M48 128c6 4 14 4 20 0"/><path d="M132 128c6 4 14 4 20 0"/>
      </g>`),
    item_macaron: () => {
      // マカロン 1こ（cx, cy = クリームの まんなか）
      const mac = (cx, cy, w, fill, dark, light) => {
        const l = cx - w / 2, r = cx + w / 2;
        return `
        <path d="M${l + 2} ${cy + 3}h${w - 4}c0 12-6 17-16 17H${l + 18}c-10 0-16-5-16-17z" fill="${fill}" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/>
        <rect x="${l + 3}" y="${cy - 5}" width="${w - 6}" height="10" rx="5" fill="#fffaf2" stroke="#eadfcf" stroke-width="2.5"/>
        <path d="M${l} ${cy - 4}c0-18 12-26 ${w / 2}-26s${w / 2} 8 ${w / 2} 26z" fill="${fill}" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M${l + 2} ${cy - 5}q4 3 8 0t8 0 8 0 8 0 8 0 8 0 8 0" fill="none" stroke="${dark}" stroke-width="2" stroke-linecap="round" opacity=".55"/>
        <path d="M${l + 12} ${cy - 18}c4-6 10-9 18-9" fill="none" stroke="${light}" stroke-width="5" stroke-linecap="round"/>
        <circle cx="${r - 14}" cy="${cy - 20}" r="2" fill="#fff" opacity=".7"/>`;
      };
      return svg('0 0 200 200', `
        <ellipse cx="100" cy="162" rx="84" ry="26" fill="#fffdf9" stroke="${LINE}" stroke-width="3"/>
        <ellipse cx="100" cy="158" rx="64" ry="16" fill="#fbf4ea" stroke="#e6cb8d" stroke-width="3"/>
        ${mac(66, 140, 66, '#c9b3ee', '#9a82c9', '#e6dbfa')}
        ${mac(134, 140, 66, '#a8e0c4', '#6fb593', '#d6f3e4')}
        ${mac(100, 98, 72, '#f6a9c0', '#d9799a', '#fcd6e2')}`);
    },
    item_cheese: () => svg('0 0 200 200', `
      <ellipse cx="100" cy="164" rx="88" ry="26" fill="#fffdf9" stroke="${LINE}" stroke-width="3"/>
      <ellipse cx="100" cy="160" rx="68" ry="16" fill="#fbf4ea" stroke="#e6cb8d" stroke-width="3"/>
      <g stroke="#c99a2e" stroke-width="3" stroke-linejoin="round">
        <path d="M148 110l32-40v50l-32 40z" fill="#efc24a"/>
        <path d="M20 110h128v50H20z" fill="#f9d45f"/>
        <path d="M20 110l160-40-32 40z" fill="#ffe48a"/>
      </g>
      <g fill="#e3ad33" stroke="#c99a2e" stroke-width="2">
        <ellipse cx="50" cy="138" rx="9" ry="7"/><ellipse cx="94" cy="128" rx="11" ry="8"/><ellipse cx="124" cy="146" rx="7" ry="6"/>
        <ellipse cx="76" cy="150" rx="5" ry="4"/><ellipse cx="140" cy="98" rx="8" ry="3.5"/><ellipse cx="164" cy="118" rx="5" ry="8"/>
      </g>
      <path d="M44 104l80-20" stroke="#fff3c2" stroke-width="5" stroke-linecap="round"/>`),
    item_pudding: () => svg('0 0 200 200', `
      <ellipse cx="100" cy="166" rx="86" ry="24" fill="#fffdf9" stroke="${LINE}" stroke-width="3"/>
      <ellipse cx="100" cy="162" rx="66" ry="15" fill="#fbf4ea" stroke="#e6cb8d" stroke-width="3"/>
      <path d="M52 160l18-70q30-10 60 0l18 70q-48 12-96 0z" fill="#fde39e" stroke="#d6a54a" stroke-width="3" stroke-linejoin="round"/>
      <path d="M70 90q30-10 60 0l4 16c1 8-8 8-9 1-2 10-11 10-12 1-2 12-12 12-13 1-2 9-11 9-12 0-2 8-10 8-11-1-1 7-10 7-9-2z" fill="#b8692c" stroke="#8f4f1f" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="100" cy="90" rx="30" ry="7" fill="#c97a36"/>
      <path d="M64 120c-4 14-6 26-6 34" fill="none" stroke="#fff6d6" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="100" cy="84" rx="20" ry="8" fill="#fffaf0" stroke="#e5d6c6" stroke-width="2.5"/>
      <ellipse cx="100" cy="74" rx="13" ry="7" fill="#fffaf0" stroke="#e5d6c6" stroke-width="2.5"/>
      <path d="M92 70q8-14 16 0" fill="#fffaf0" stroke="#e5d6c6" stroke-width="2.5"/>
      <path d="M100 56c4-12 12-18 22-20" fill="none" stroke="#6aa86a" stroke-width="3" stroke-linecap="round"/>
      <circle cx="100" cy="58" r="11" fill="#e8455f" stroke="#bf3049" stroke-width="2.5"/>
      <ellipse cx="96" cy="54" rx="3.5" ry="2.5" fill="#fff" opacity=".7"/>`),
    item_shrimp: () => {
      // まるまった エビ。しっぽ → あたまの じゅんに かさねる
      const segs = [[-255, 13], [-220, 17], [-180, 20], [-140, 23], [-95, 25]];
      const at = (deg, R = 40) => [100 + R * Math.cos(deg * Math.PI / 180), 106 + R * Math.sin(deg * Math.PI / 180)];
      const body = segs.map(([a, r]) => {
        const [x, y] = at(a);
        return `<circle cx="${x}" cy="${y}" r="${r}" fill="#f8a27c" stroke="#d9694a" stroke-width="3"/>
          <path d="M${x - r * 0.55} ${y - r * 0.5}a${r * 0.75} ${r * 0.75} 0 0 1 ${r * 1.1} 0" fill="none" stroke="#ffd9c6" stroke-width="4" stroke-linecap="round" transform="rotate(${a + 90} ${x} ${y})"/>`;
      }).join('');
      const [tx, ty] = at(-255, 40);
      const [hx, hy] = at(-50, 40);
      return svg('0 0 200 200', `
        <ellipse cx="100" cy="168" rx="84" ry="22" fill="#fffdf9" stroke="${LINE}" stroke-width="3"/>
        <ellipse cx="100" cy="164" rx="64" ry="13" fill="#fbf4ea" stroke="#e6cb8d" stroke-width="3"/>
        <g fill="#f2865e" stroke="#d9694a" stroke-width="3" stroke-linejoin="round">
          <path d="M${tx} ${ty}l38-14c0 12-14 22-34 18z"/><path d="M${tx} ${ty}l36 16c-10 10-28 8-36-4z"/>
        </g>
        ${body}
        <g fill="none" stroke="#d9694a" stroke-width="2.5" stroke-linecap="round">
          <path d="M${hx + 10} ${hy - 14}c14-22 28-28 42-24"/><path d="M${hx + 16} ${hy - 6}c16-12 30-12 40-4"/>
          <path d="M84 96l-6 6M96 92l-4 8M108 94l-2 8"/>
        </g>
        <circle cx="${hx}" cy="${hy}" r="26" fill="#f8a27c" stroke="#d9694a" stroke-width="3"/>
        <path d="M${hx - 16} ${hy - 12}c8-10 22-12 32-4" fill="none" stroke="#ffd9c6" stroke-width="5" stroke-linecap="round"/>
        <circle cx="${hx + 6}" cy="${hy - 2}" r="6" fill="#3d4a66"/><circle cx="${hx + 4}" cy="${hy - 4}" r="2.2" fill="#fff"/>
        <ellipse cx="${hx - 6}" cy="${hy + 10}" rx="6" ry="3.5" fill="#f37d9b" opacity=".5"/>`);
    },
    item_sponge: () => svg('0 0 200 200', `
      <g transform="rotate(-12 100 110)">
        <rect x="32" y="66" width="136" height="88" rx="28" fill="#f9dc72" stroke="#d2a944" stroke-width="3"/>
        <rect x="40" y="72" width="120" height="26" rx="13" fill="#fde99d"/>
        <g fill="#eac458"><ellipse cx="66" cy="116" rx="9" ry="7"/><ellipse cx="102" cy="128" rx="7" ry="5"/><ellipse cx="134" cy="112" rx="10" ry="7"/><ellipse cx="86" cy="140" rx="5" ry="4"/><ellipse cx="124" cy="142" rx="6" ry="4"/></g>
      </g>
      <g fill="#f4fbff" stroke="#9ad3ef" stroke-width="2.5"><circle cx="150" cy="54" r="14"/><circle cx="170" cy="78" r="8"/><circle cx="46" cy="58" r="10"/></g>`),
    item_shower: () => svg('0 0 200 200', `
      <path d="M26 20c0 60 20 74 66 74" fill="none" stroke="#c9a253" stroke-width="16" stroke-linecap="round"/>
      <path d="M26 20c0 60 20 74 66 74" fill="none" stroke="#ecd08f" stroke-width="8" stroke-linecap="round"/>
      <g transform="rotate(32 124 104)">
        <rect x="84" y="88" width="80" height="34" rx="16" fill="#ecd08f" stroke="#b8913f" stroke-width="3"/>
        <ellipse cx="124" cy="122" rx="40" ry="11" fill="#fdf3d6" stroke="#b8913f" stroke-width="3"/>
        <g fill="#b8913f"><circle cx="106" cy="122" r="2.5"/><circle cx="118" cy="124" r="2.5"/><circle cx="130" cy="124" r="2.5"/><circle cx="142" cy="122" r="2.5"/><circle cx="124" cy="118" r="2.5"/></g>
      </g>
      <g fill="#9fd6f4" stroke="#6fb6de" stroke-width="2"><path d="M96 150q6 10 0 16-6-6 0-16z"/><path d="M118 160q6 10 0 16-6-6 0-16z"/><path d="M140 150q6 10 0 16-6-6 0-16z"/><path d="M106 178q5 8 0 13-5-5 0-13z"/></g>`),
    item_towel: () => svg('0 0 200 200', `
      <path d="M30 70c46-14 94-14 140 0v84c-46 14-94 14-140 0z" fill="#f6b8c6" stroke="#d98ea2" stroke-width="3"/>
      <path d="M30 70c46-14 94-14 140 0v26c-46-14-94-14-140 0z" fill="#f9cbd5"/>
      <path d="M30 128c46-12 94-12 140 0" fill="none" stroke="#fff" stroke-width="7" opacity=".9"/>
      <path d="M30 142c46-12 94-12 140 0" fill="none" stroke="#fff" stroke-width="4" opacity=".9"/>
      <g fill="#fff" opacity=".5"><circle cx="60" cy="110" r="2"/><circle cx="90" cy="104" r="2"/><circle cx="120" cy="108" r="2"/><circle cx="150" cy="112" r="2"/></g>`),
    item_yarn: () => svg('0 0 200 200', `
      <path d="M150 150c20 10 30 24 22 34-8 8-26 0-36 6" fill="none" stroke="#7fb3d6" stroke-width="4" stroke-linecap="round"/>
      ${yarnSvg('#a9d6f2', '#7fb3d6', '#d6eefc').replace(/^<svg[^>]*>|<\/svg>$/g, '')}`),
    item_cushion: () => svg('0 0 260 170', `
      <ellipse cx="130" cy="150" rx="118" ry="16" fill="#000" opacity=".08"/>
      <g fill="#e2c48a" stroke="#b8913f" stroke-width="2"><path d="M22 40l-14 -6 4 16z"/><path d="M238 40l14-6-4 16z"/><path d="M22 128l-14 8 4-16z"/><path d="M238 128l14 8-4-16z"/></g>
      <path d="M24 40c70-22 142-22 212 0 14 30 14 58 0 88-70 22-142 22-212 0-14-30-14-58 0-88z" fill="#f4b3c2" stroke="#d98ea2" stroke-width="3"/>
      <path d="M36 50c62-18 126-18 188 0 10 24 10 44 0 68-62 18-126 18-188 0-10-24-10-44 0-68z" fill="none" stroke="#e2c48a" stroke-width="3" stroke-dasharray="7 6"/>
      <path d="M40 54c40-12 80-14 120-8" fill="none" stroke="#fbd8e0" stroke-width="10" stroke-linecap="round"/>
      <circle cx="130" cy="84" r="8" fill="#e98fa8" stroke="#d27691" stroke-width="2"/>`)
  };

  /* ---------- お世話ボタンのアイコン ---------- */
  const icons = {
    icon_food: () => items.item_fish(),
    icon_play: () => items.item_yarn(),
    icon_bath: () => svg('0 0 200 200', `
      <g fill="#f4fbff" stroke="#8fcdea" stroke-width="3"><circle cx="64" cy="70" r="24"/><circle cx="100" cy="52" r="30"/><circle cx="140" cy="70" r="22"/><circle cx="160" cy="36" r="10"/><circle cx="40" cy="38" r="8"/></g>
      <path d="M22 92h156c0 44-22 64-78 64S22 136 22 92z" fill="#ffffff" stroke="${LINE}" stroke-width="3"/>
      <path d="M16 86h168a6 6 0 0 1 0 12H16a6 6 0 0 1 0-12z" fill="#ecd08f" stroke="#b8913f" stroke-width="3"/>
      <path d="M50 152l-10 22M150 152l10 22" stroke="#c9a253" stroke-width="9" stroke-linecap="round"/>
      <path d="M40 112c10 24 34 30 60 30" fill="none" stroke="#e9f4f8" stroke-width="7" stroke-linecap="round"/>`),
    icon_sleep: () => svg('0 0 200 200', `
      <path d="M118 22a74 74 0 1 0 52 118A62 62 0 0 1 118 22z" fill="#f6d66b" stroke="#d6aa36" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="78" cy="88" r="7" fill="#e9bd4a" opacity=".55"/><circle cx="64" cy="122" r="10" fill="#e9bd4a" opacity=".45"/><circle cx="98" cy="136" r="6" fill="#e9bd4a" opacity=".5"/>
      <g fill="#fff3b5" stroke="#e5c35a" stroke-width="2"><path d="M160 30l5 11 11 3-11 4-5 11-5-11-11-4 11-3z"/><path d="M172 84l3 7 7 2-7 3-3 7-3-7-7-3 7-2z"/></g>`),
    icon_dress: () => bow('#f4a3b8'),
    icon_bye: () => svg('0 0 200 200', `
      <path d="M50 52q-14 12-14 30M34 44q-22 18-20 46" fill="none" stroke="#f0b7c6" stroke-width="7" stroke-linecap="round"/>
      <path d="M150 52q14 12 14 30M166 44q22 18 20 46" fill="none" stroke="#f0b7c6" stroke-width="7" stroke-linecap="round"/>
      <path d="M100 186c-30 0-44-16-44-42 0-30 18-50 44-50s44 20 44 50c0 26-14 42-44 42z" fill="#ffffff" stroke="${LINE}" stroke-width="3.5"/>
      <g fill="#ffffff" stroke="${LINE}" stroke-width="3.5"><ellipse cx="64" cy="82" rx="16" ry="20"/><ellipse cx="88" cy="60" rx="16" ry="21"/><ellipse cx="114" cy="60" rx="16" ry="21"/><ellipse cx="138" cy="82" rx="16" ry="20"/></g>
      <g fill="#f6b3c4"><ellipse cx="64" cy="84" rx="8" ry="10"/><ellipse cx="88" cy="62" rx="8" ry="11"/><ellipse cx="114" cy="62" rx="8" ry="11"/><ellipse cx="138" cy="84" rx="8" ry="10"/><path d="M100 168c-16 0-26-8-26-20 0-14 12-24 26-24s26 10 26 24c0 12-10 20-26 20z"/></g>`),
    icon_piano: () => svg('0 0 200 200', `
      <rect x="18" y="70" width="164" height="96" rx="14" fill="#5d4352" stroke="#3f2c38" stroke-width="3"/>
      <rect x="28" y="96" width="144" height="62" rx="6" fill="#fffdf8"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<line x1="${28 + 24 * (i + 1)}" y1="96" x2="${28 + 24 * (i + 1)}" y2="158" stroke="#d8cfc6" stroke-width="2"/>`).join('')}
      ${[0, 1, 3, 4, 5].map(i => `<rect x="${44 + 24 * i}" y="96" width="14" height="36" rx="3" fill="#3f2c38"/>`).join('')}
      <g fill="#e98fa8"><path d="M140 20v34a10 8 0 1 1-4-6V28l24-6v26a10 8 0 1 1-4-6V30z"/></g>
      <g fill="#8ec5e8"><path d="M56 16v32a9 7 0 1 1-4-6V16z"/></g>`),
    icon_butterfly: () => butterfly('#f6b3c4', '#c3a3ec'),
    icon_book: () => svg('0 0 200 200', `
      <path d="M100 48c-26-16-60-18-84-10v122c24-8 58-6 84 10 26-16 60-18 84-10V38c-24-8-58-6-84 10z" fill="#fff8ef" stroke="${LINE}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M100 48v122" stroke="${LINE}" stroke-width="3"/>
      <path d="M100 48c-26-16-60-18-84-10v122c24-8 58-6 84 10" fill="#fde3ea" opacity=".8"/>
      <path transform="translate(38 76) scale(1.35)" d="${HEART_PATH}" fill="#f37d9b"/>
      <path transform="translate(118 68) scale(.55)" d="M50 0C54 38 62 46 100 50 62 54 54 62 50 100 46 62 38 54 0 50 38 46 46 38 50 0z" fill="#f1c74f"/>
      <circle cx="152" cy="132" r="14" fill="#93c9ef"/>`),
    gear: () => svg('0 0 64 64', `
      <path d="M28 4h8l1.6 7.2a21 21 0 0 1 6 2.5l6.2-4 5.7 5.7-4 6.2a21 21 0 0 1 2.5 6L61 28v8l-7.2 1.6a21 21 0 0 1-2.5 6l4 6.2-5.7 5.7-6.2-4a21 21 0 0 1-6 2.5L36 61h-8l-1.6-7.2a21 21 0 0 1-6-2.5l-6.2 4-5.7-5.7 4-6.2a21 21 0 0 1-2.5-6L3 36v-8l7.2-1.6a21 21 0 0 1 2.5-6l-4-6.2 5.7-5.7 6.2 4a21 21 0 0 1 6-2.5z" fill="#d8c8bd" stroke="#a89385" stroke-width="2"/>
      <circle cx="32" cy="32" r="9" fill="#fff8ef" stroke="#a89385" stroke-width="2"/>`),
    back: () => svg('0 0 100 100', `
      <path d="M58 22 28 50l30 28" fill="none" stroke="#c95f7f" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M32 50h44" stroke="#c95f7f" stroke-width="13" stroke-linecap="round"/>`),
    lock: () => svg('0 0 64 64', `
      <path d="M20 28v-8a12 12 0 0 1 24 0v8" fill="none" stroke="#b9a294" stroke-width="6"/>
      <rect x="12" y="28" width="40" height="30" rx="8" fill="#e6d6ca" stroke="#b9a294" stroke-width="3"/>
      <circle cx="32" cy="42" r="4" fill="#b9a294"/>`)
  };

  /* ---------- ちょうちょ ---------- */
  function butterfly(c1 = '#f6b3c4', c2 = '#c3a3ec') {
    return svg('0 0 200 160', `
      <g stroke="rgba(110,80,100,.45)" stroke-width="3" stroke-linejoin="round">
        <path d="M100 76C80 30 30 10 18 36 8 58 40 86 100 82z" fill="${c1}"/>
        <path d="M100 76c20-46 70-66 82-40 10 22-22 50-82 46z" fill="${c1}"/>
        <path d="M100 84c-40 0-66 16-60 40 6 20 40 14 60-30z" fill="${c2}"/>
        <path d="M100 84c40 0 66 16 60 40-6 20-40 14-60-30z" fill="${c2}"/>
      </g>
      <g fill="#fff" opacity=".7"><circle cx="50" cy="44" r="8"/><circle cx="150" cy="44" r="8"/><circle cx="66" cy="112" r="5"/><circle cx="134" cy="112" r="5"/></g>
      <ellipse cx="100" cy="88" rx="7" ry="30" fill="#6b5463"/>
      <path d="M97 60q-10-26-22-30M103 60q10-26 22-30" fill="none" stroke="#6b5463" stroke-width="3" stroke-linecap="round"/>
      <circle cx="75" cy="30" r="4" fill="#6b5463"/><circle cx="125" cy="30" r="4" fill="#6b5463"/>`);
  }

  /* ---------- 背景：おへや ---------- */
  function bgRoom(night = false) {
    const c = night ? {
      wallTop: '#5c5a88', wallBot: '#4a4774', stripe: '#545183', dot: '#7a76a8', frame: '#6c689a', gold: '#b7a173',
      wains: '#4b4673', floorA: '#6a5470', floorB: '#57445e', line: '#3f3149', rug: '#8c6688', rugB: '#a27e9c',
      piano: '#2e2433', pianoHi: '#4b3a4e', keys: '#d9d3dc', sofa: '#8a6385', sofaHi: '#a07b9a', curt: '#7e6491', curtHi: '#9a7fab',
      skyTop: '#1b2150', skyBot: '#38407a', city: '#2b2b55', pic: '#56608c', rose: '#b87c9c'
    } : {
      wallTop: '#fdf4ea', wallBot: '#f7e4d9', stripe: '#f8e7df', dot: '#f2c8cf', frame: '#fffaf5', gold: '#e2c48a',
      wains: '#f5d9d6', floorA: '#ebcca8', floorB: '#dbb28c', line: '#c99f7a', rug: '#f2c3cc', rugB: '#fbe6ea',
      piano: '#5d4352', pianoHi: '#7d5f6f', keys: '#fffdf8', sofa: '#f0b7c3', sofaHi: '#f7d0d8', curt: '#f2b5c3', curtHi: '#f9d4dc',
      skyTop: '#bfe1f5', skyBot: '#fbeef2', city: '#cdbbd9', pic: '#cfe6f2', rose: '#f37d9b'
    };
    const p = id('r');
    const panels = [20, 248, 476, 704, 932, 1160].map(x =>
      `<rect x="${x + 12}" y="548" width="196" height="116" rx="12" fill="none" stroke="${c.frame}" stroke-width="5"/>
       <rect x="${x + 24}" y="560" width="172" height="92" rx="8" fill="none" stroke="${c.gold}" stroke-width="2" opacity=".8"/>`).join('');
    const floorLines = [768, 846, 934].map(y => `<path d="M0 ${y}H1366" stroke="${c.line}" stroke-width="2" opacity=".35"/>`).join('') +
      [[120, 700, 768], [420, 768, 846], [760, 700, 768], [1080, 768, 846], [260, 846, 934], [640, 846, 934], [1000, 934, 1024], [1200, 846, 934], [440, 934, 1024]]
        .map(([x, a, b]) => `<path d="M${x} ${a}V${b}" stroke="${c.line}" stroke-width="2" opacity=".3"/>`).join('');
    const keys = Array.from({ length: 15 }, (_, i) => `<line x1="${62 + i * 25.4}" y1="540" x2="${62 + i * 25.4}" y2="578" stroke="#cfc4bc" stroke-width="1.5"/>`).join('');
    const blacks = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12, 14].map(i => `<rect x="${76 + i * 25.4}" y="540" width="14" height="22" rx="2" fill="${c.piano}"/>`).join('');
    const stars = night ? [[900, 160], [960, 120], [1080, 150], [1110, 230], [930, 260], [1040, 300], [880, 330]].map(([x, y], i) =>
      `<circle cx="${x}" cy="${y}" r="${i % 2 ? 2.5 : 3.5}" fill="#fff6c9" opacity=".9"/>`).join('') +
      `<circle cx="1060" cy="200" r="36" fill="#fff3b8"/><circle cx="1076" cy="190" r="32" fill="${c.skyTop}"/>` : `
      <g fill="#fff" opacity=".85"><ellipse cx="930" cy="190" rx="40" ry="14"/><ellipse cx="960" cy="180" rx="28" ry="14"/><ellipse cx="1080" cy="260" rx="34" ry="11"/><ellipse cx="1100" cy="252" rx="22" ry="11"/></g>`;
    const lamp = night ? `<radialGradient id="${p}lg"><stop offset="0" stop-color="#ffd89a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd89a" stop-opacity="0"/></radialGradient>` : '';
    return svg('0 0 1366 1024', `
      <defs>
        <linearGradient id="${p}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.wallTop}"/><stop offset="1" stop-color="${c.wallBot}"/></linearGradient>
        <pattern id="${p}s" width="80" height="80" patternUnits="userSpaceOnUse"><rect width="40" height="80" fill="${c.stripe}"/><circle cx="60" cy="20" r="4.5" fill="${c.dot}" opacity=".6"/><circle cx="60" cy="60" r="2.5" fill="${c.dot}" opacity=".5"/></pattern>
        <linearGradient id="${p}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.floorB}"/><stop offset=".3" stop-color="${c.floorA}"/><stop offset="1" stop-color="${c.floorB}"/></linearGradient>
        <linearGradient id="${p}k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.skyTop}"/><stop offset="1" stop-color="${c.skyBot}"/></linearGradient>
        <clipPath id="${p}c"><path d="M872 556V236a128 128 0 0 1 256 0v320z"/></clipPath>
        ${lamp}
      </defs>
      <rect width="1366" height="700" fill="url(#${p}w)"/>
      <rect y="30" width="1366" height="482" fill="url(#${p}s)" opacity=".8"/>
      <rect width="1366" height="26" fill="${c.frame}"/><rect y="26" width="1366" height="6" fill="${c.gold}"/>
      <rect y="510" width="1366" height="16" fill="${c.gold}"/>
      <rect y="526" width="1366" height="156" fill="${c.wains}"/>
      ${panels}
      <rect y="680" width="1366" height="24" fill="${c.frame}"/>
      <rect y="702" width="1366" height="322" fill="url(#${p}f)"/>
      ${floorLines}

      <!-- まど -->
      <path d="M872 556V236a128 128 0 0 1 256 0v320z" fill="url(#${p}k)"/>
      <g clip-path="url(#${p}c)">
        ${stars}
        <path d="M872 470l30-14 26 10 24-22 32 16 22-12 30 18 28-10 32 14 32-8v114H872z" fill="${c.city}"/>
        <!-- 木 -->
        <path d="M948 500v-60M1060 500v-80" stroke="${night ? '#6b5a66' : '#b98d6a'}" stroke-width="10" stroke-linecap="round"/>
        <g fill="${night ? '#5f7a6a' : '#a9d89a'}"><circle cx="948" cy="420" r="42"/><circle cx="1060" cy="390" r="54"/><circle cx="1098" cy="430" r="34"/></g>
        <path d="M872 520l40-8 40 10 50-6 60 8 66-6v40H872z" fill="${c.city}" opacity=".8"/>
      </g>
      <path d="M872 556V236a128 128 0 0 1 256 0v320z" fill="none" stroke="${c.frame}" stroke-width="18"/>
      <path d="M1000 108v448M872 330h256M872 446h256" stroke="${c.frame}" stroke-width="9"/>
      <rect x="852" y="552" width="296" height="20" rx="6" fill="${c.frame}" stroke="${c.gold}" stroke-width="2"/>
      <!-- カーテン -->
      <path d="M820 70c40 0 70 10 84 20-10 120-6 300 16 470-30 8-60 8-100 0z" fill="${c.curt}"/>
      <path d="M840 90c10 140 10 300 6 470" fill="none" stroke="${c.curtHi}" stroke-width="12" stroke-linecap="round" opacity=".8"/>
      <path d="M1180 70c-40 0-70 10-84 20 10 120 6 300-16 470 30 8 60 8 100 0z" fill="${c.curt}"/>
      <path d="M1160 90c-10 140-10 300-6 470" fill="none" stroke="${c.curtHi}" stroke-width="12" stroke-linecap="round" opacity=".8"/>
      <path d="M800 60h400v34c-30 22-60 22-100 6-40 18-80 18-100 0-20 18-60 18-100 0-40 16-70 16-100-6z" fill="${c.curt}" stroke="${c.gold}" stroke-width="3"/>
      <circle cx="880" cy="372" r="11" fill="${c.gold}"/><circle cx="1120" cy="372" r="11" fill="${c.gold}"/>

      <!-- がくぶち -->
      <ellipse cx="250" cy="176" rx="74" ry="92" fill="${c.pic}" stroke="${c.gold}" stroke-width="12"/>
      <path d="M182 200c30-24 60-24 80-6s40 10 58-8v60c-40 40-100 40-138 8z" fill="${night ? '#4c5a78' : '#bfe0c4'}" opacity=".9"/>
      <circle cx="270" cy="138" r="14" fill="${night ? '#fff3b8' : '#fff4c4'}"/>
      <!-- かべの あかり -->
      <g transform="translate(560 200)"><path d="M0 0v40" stroke="${c.gold}" stroke-width="5"/><path d="M-22 40h44l-8 30h-28z" fill="${c.gold}"/><path d="M-26 0c0-30 52-30 52 0z" fill="${night ? '#ffe2a6' : '#fff2d8'}" stroke="${c.gold}" stroke-width="3"/></g>
      ${night ? `<circle cx="560" cy="190" r="140" fill="url(#${p}lg)"/><circle cx="330" cy="300" r="120" fill="url(#${p}lg)"/>` : ''}

      <!-- ピアノ -->
      <g>
        <rect x="46" y="322" width="408" height="26" rx="9" fill="${c.pianoHi}"/>
        <rect x="60" y="346" width="380" height="176" fill="${c.piano}"/>
        <rect x="84" y="364" width="332" height="138" rx="10" fill="none" stroke="${c.gold}" stroke-width="3" opacity=".7"/>
        <g transform="rotate(-3 250 410)"><rect x="196" y="374" width="112" height="76" rx="4" fill="#fffaf2"/>
          <path d="M206 392h92M206 404h92M206 416h92M206 428h92" stroke="#d8cfc6" stroke-width="1.5"/>
          <circle cx="226" cy="404" r="5" fill="#8a7684"/><circle cx="252" cy="416" r="5" fill="#8a7684"/><circle cx="280" cy="398" r="5" fill="#8a7684"/></g>
        <rect x="40" y="518" width="420" height="24" rx="6" fill="${c.pianoHi}"/>
        <rect x="56" y="540" width="388" height="40" fill="${c.keys}"/>
        ${keys}${blacks}
        <rect x="60" y="580" width="380" height="102" fill="${c.piano}"/>
        <rect x="90" y="596" width="140" height="70" rx="8" fill="none" stroke="${c.gold}" stroke-width="3" opacity=".6"/>
        <rect x="270" y="596" width="140" height="70" rx="8" fill="none" stroke="${c.gold}" stroke-width="3" opacity=".6"/>
        <path d="M236 676h28" stroke="${c.gold}" stroke-width="8" stroke-linecap="round"/>
        <!-- ばら の かびん -->
        <path d="M108 322c-8-20-6-36 10-44h20c16 8 18 24 10 44z" fill="${night ? '#8fa2c0' : '#cfe6f2'}" stroke="${c.gold}" stroke-width="2"/>
        <g fill="${c.rose}"><circle cx="112" cy="262" r="13"/><circle cx="138" cy="254" r="14"/><circle cx="160" cy="268" r="12"/><circle cx="126" cy="240" r="10"/></g>
        <g fill="${night ? '#5f8a6a' : '#9ed29a'}"><ellipse cx="98" cy="276" rx="10" ry="5" transform="rotate(30 98 276)"/><ellipse cx="172" cy="282" rx="10" ry="5" transform="rotate(-30 172 282)"/></g>
        <!-- しょくだい -->
        <path d="M380 322v-40M362 282h36" stroke="${c.gold}" stroke-width="6" stroke-linecap="round"/>
        <rect x="374" y="250" width="12" height="32" rx="3" fill="#fffaf0"/>
        <path d="M380 236q8 8 0 16-8-8 0-16z" fill="#ffc96b"/>
      </g>

      <!-- ソファ -->
      <g>
        <path d="M1190 600c0-40 30-60 90-60h86v170h-176z" fill="${c.sofa}"/>
        <path d="M1206 596c10-30 40-40 80-40h80" fill="none" stroke="${c.sofaHi}" stroke-width="14" stroke-linecap="round"/>
        <rect x="1176" y="690" width="190" height="70" rx="22" fill="${c.sofa}"/>
        <path d="M1200 700h166" stroke="${c.sofaHi}" stroke-width="10" stroke-linecap="round"/>
        <path d="M1160 650c0-26 40-26 40 0v100h-40z" fill="${c.sofa}" stroke="${c.sofaHi}" stroke-width="4"/>
        <circle cx="1180" cy="652" r="18" fill="${c.sofaHi}"/>
        <path d="M1190 758l-6 24M1350 758l4 24" stroke="${c.gold}" stroke-width="8" stroke-linecap="round"/>
      </g>

      <!-- じゅうたん -->
      <ellipse cx="683" cy="908" rx="480" ry="104" fill="${c.rugB}"/>
      <ellipse cx="683" cy="908" rx="450" ry="88" fill="${c.rug}"/>
      <ellipse cx="683" cy="908" rx="390" ry="68" fill="none" stroke="${c.rugB}" stroke-width="5" stroke-dasharray="14 10"/>
      <ellipse cx="683" cy="908" rx="300" ry="48" fill="none" stroke="${c.gold}" stroke-width="2.5" opacity=".6"/>
    `, 'preserveAspectRatio="xMidYMid slice"');
  }

  /* ---------- 背景：おふろば ---------- */
  function bgBath() {
    const p = id('b');
    return svg('0 0 1366 1024', `
      <defs>
        <pattern id="${p}t" width="72" height="72" patternUnits="userSpaceOnUse"><rect width="72" height="72" fill="#dff1f4"/><rect x="3" y="3" width="66" height="66" rx="10" fill="#e9f7f9"/><circle cx="20" cy="18" r="6" fill="#fff" opacity=".7"/></pattern>
        <pattern id="${p}f" width="120" height="120" patternUnits="userSpaceOnUse"><rect width="120" height="120" fill="#fff6f8"/><rect width="60" height="60" fill="#fbdfe6"/><rect x="60" y="60" width="60" height="60" fill="#fbdfe6"/></pattern>
        <linearGradient id="${p}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf3"/><stop offset="1" stop-color="#fbefe6"/></linearGradient>
      </defs>
      <rect width="1366" height="320" fill="url(#${p}w)"/>
      <rect width="1366" height="26" fill="#fffaf5"/><rect y="26" width="1366" height="6" fill="#e2c48a"/>
      <rect y="320" width="1366" height="390" fill="url(#${p}t)"/>
      <rect y="306" width="1366" height="16" fill="#e2c48a"/>
      <rect y="702" width="1366" height="322" fill="url(#${p}f)"/>
      <rect y="696" width="1366" height="12" fill="#fffaf5"/>
      <!-- まるい まど -->
      <circle cx="683" cy="150" r="88" fill="#cfe9f7" stroke="#fffaf5" stroke-width="16"/>
      <circle cx="683" cy="150" r="88" fill="none" stroke="#e2c48a" stroke-width="4"/>
      <path d="M683 62v176M595 150h176" stroke="#fffaf5" stroke-width="8"/>
      <g fill="#fff" opacity=".9"><ellipse cx="640" cy="120" rx="26" ry="9"/><ellipse cx="724" cy="188" rx="22" ry="8"/></g>
      <!-- かがみ -->
      <ellipse cx="240" cy="230" rx="96" ry="120" fill="#e3f2f8" stroke="#e2c48a" stroke-width="14"/>
      <path d="M190 170c20-30 50-40 70-36M180 220c10-16 20-24 30-26" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".9"/>
      <!-- タオルかけ -->
      <path d="M70 450h300" stroke="#c9a253" stroke-width="10" stroke-linecap="round"/>
      <circle cx="70" cy="450" r="12" fill="#e2c48a"/><circle cx="370" cy="450" r="12" fill="#e2c48a"/>
      <path d="M120 446h200v150c-40 14-160 14-200 0z" fill="#f6b8c6"/>
      <path d="M120 560c60 12 140 12 200 0M120 578c60 12 140 12 200 0" fill="none" stroke="#fff" stroke-width="6" opacity=".9"/>
      <!-- よくそう -->
      <g>
        <g fill="#f8fdff" stroke="#a9d8ee" stroke-width="3"><circle cx="930" cy="500" r="40"/><circle cx="990" cy="476" r="52"/><circle cx="1070" cy="470" r="58"/><circle cx="1150" cy="480" r="50"/><circle cx="1220" cy="500" r="40"/><circle cx="1240" cy="420" r="16"/><circle cx="960" cy="420" r="12"/><circle cx="1110" cy="390" r="20"/></g>
        <path d="M870 520h420c0 140-60 220-210 220S870 660 870 520z" fill="#ffffff" stroke="${LINE}" stroke-width="4"/>
        <path d="M858 508h444a14 14 0 0 1 0 28H858a14 14 0 0 1 0-28z" fill="#ecd08f" stroke="#b8913f" stroke-width="3"/>
        <path d="M900 560c20 80 80 130 170 136" fill="none" stroke="#eef6f9" stroke-width="16" stroke-linecap="round"/>
        <path d="M950 724l-26 52M1210 724l26 52" stroke="#c9a253" stroke-width="16" stroke-linecap="round"/>
        <circle cx="922" cy="780" r="12" fill="#e2c48a"/><circle cx="1238" cy="780" r="12" fill="#e2c48a"/>
      </g>
      <!-- うかぶ あわ -->
      <g fill="#ffffff" fill-opacity=".55" stroke="#a9d8ee" stroke-width="2.5"><circle cx="480" cy="180" r="18"/><circle cx="520" cy="240" r="10"/><circle cx="860" cy="250" r="14"/><circle cx="420" cy="300" r="8"/></g>
      <!-- バスマット -->
      <ellipse cx="560" cy="910" rx="330" ry="80" fill="#f6c3cf"/>
      <ellipse cx="560" cy="910" rx="300" ry="64" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="4 14" stroke-linecap="round"/>
    `, 'preserveAspectRatio="xMidYMid slice"');
  }

  /* ---------- メイク ---------- */
  // k < 1 で こく、k > 1 で うすく
  function shade(hex, k) {
    const n = parseInt(hex.slice(1), 16);
    const ch = [n >> 16 & 255, n >> 8 & 255, n & 255].map(v => Math.round(k < 1 ? v * k : v + (255 - v) * (k - 1)));
    return `rgb(${ch.join(',')})`;
  }
  const glints = (pts, r = 1) => pts.map(([x, y, s]) => `<path transform="translate(${x - 5 * s * r} ${y - 5 * s * r}) scale(${0.1 * s * r})" d="M50 0C54 38 62 46 100 50 62 54 54 62 50 100 46 62 38 54 0 50 38 46 46 38 50 0z" fill="#fffdf0"/>`).join('');
  function starPts(cx, cy, ro, ri) {
    const p = [];
    for (let k = 0; k < 10; k++) {
      const t = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? ri : ro;
      p.push((cx + Math.cos(t) * r).toFixed(1) + ',' + (cy + Math.sin(t) * r).toFixed(1));
    }
    return p.join(' ');
  }
  // ほっぺの コンパクト
  function compact(color, heartShape) {
    return svg('0 0 120 120', `
      <circle cx="60" cy="60" r="47" fill="#f6e2b0" stroke="#c9a253" stroke-width="3"/>
      <circle cx="60" cy="60" r="39" fill="#fff8ef" stroke="#e2c48a" stroke-width="2"/>
      ${heartShape ? `<path transform="translate(60 61) scale(1.9) translate(-16 -14.5)" d="${HEART_PATH}" fill="${color}"/>` : `<circle cx="60" cy="60" r="33" fill="${color}"/>`}
      <ellipse cx="45" cy="44" rx="13" ry="7" fill="#fff" opacity=".45" transform="rotate(-35 45 44)"/>`);
  }
  // くちべに（たてに おいたもの）
  function lipstick(color, glitter) {
    return svg('0 0 120 120', `<g transform="rotate(18 60 64)">
      <path d="M45 52V30q0-5 5-7l18-9q6-3 6 3v35z" fill="${color}" stroke="${shade(color, 0.72)}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M52 47V31" stroke="#fff" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/>
      ${glitter ? glints([[64, 30, 1.2], [58, 42, 0.8], [68, 20, 0.7]]) : ''}
      <rect x="42" y="50" width="36" height="18" rx="3" fill="#f6e2b0" stroke="#b8913f" stroke-width="3"/>
      <rect x="38" y="66" width="44" height="44" rx="7" fill="#f7c6d3" stroke="#d98ea2" stroke-width="3"/>
      <rect x="38" y="78" width="44" height="7" fill="#ecd08f"/>
    </g>`);
  }
  // アイシャドウの いろ
  function shadowPan(color, glitter) {
    return svg('0 0 120 120', `
      <rect x="13" y="13" width="94" height="94" rx="24" fill="#fff8ef" stroke="#c9a253" stroke-width="3"/>
      <circle cx="60" cy="60" r="35" fill="${color}" stroke="${shade(color, 0.82)}" stroke-width="2"/>
      <path d="M37 52q8-17 27-19" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="7" stroke-linecap="round"/>
      ${glitter ? glints([[70, 48, 1.3], [50, 70, 1], [76, 74, 0.8], [58, 40, 0.6]]) : ''}`);
  }
  function palette() {
    return svg('0 0 120 120', `
      <rect x="10" y="28" width="100" height="66" rx="16" fill="#fff8ef" stroke="#c9a253" stroke-width="3"/>
      <circle cx="35" cy="61" r="15" fill="#f59cc2"/><circle cx="60" cy="61" r="15" fill="#b597ec"/><circle cx="85" cy="61" r="15" fill="#86c3f0"/>
      <g fill="#fff" opacity=".5"><ellipse cx="30" cy="55" rx="5" ry="3"/><ellipse cx="55" cy="55" rx="5" ry="3"/><ellipse cx="80" cy="55" rx="5" ry="3"/></g>`);
  }
  // シール（ゲームの中で顔にはるものと 同じ形）
  function stickerSvg(it) {
    const c = it.color;
    const shape = (fill, extra) => {
      if (it.shape === 'star') return `<polygon points="${starPts(60, 63, 48, 24)}" fill="${fill}" ${extra}/>`;
      if (it.shape === 'heart') return `<path transform="translate(60 62) scale(2.9) translate(-16 -14.5)" d="${HEART_PATH}" fill="${fill}" ${extra.replace(/stroke-width="(\d+)"/, (m, w) => `stroke-width="${(w / 2.9).toFixed(2)}"`)}/>`;
      if (it.shape === 'gem') return `<polygon points="34,24 86,24 108,50 60,104 12,50" fill="${fill}" ${extra}/>`;
      return [0, 1, 2, 3, 4].map(k => { const t = -Math.PI / 2 + k * Math.PI * 2 / 5; return `<circle cx="${(60 + Math.cos(t) * 24).toFixed(1)}" cy="${(62 + Math.sin(t) * 24).toFixed(1)}" r="22" fill="${fill}" ${extra}/>`; }).join('');
    };
    const S = 'stroke="#ffffff" stroke-width="10" stroke-linejoin="round"';
    let inner = `<g transform="translate(0 4)" opacity=".16">${shape('#7a3c50', 'stroke="#7a3c50" stroke-width="10" stroke-linejoin="round"')}</g>`;
    inner += shape(c, S);
    if (it.shape === 'flower') inner += [0, 1, 2, 3, 4].map(k => { const t = -Math.PI / 2 + k * Math.PI * 2 / 5; return `<circle cx="${(60 + Math.cos(t) * 24).toFixed(1)}" cy="${(62 + Math.sin(t) * 24).toFixed(1)}" r="22" fill="${c}"/>`; }).join('') + '<circle cx="60" cy="62" r="15" fill="#ffd96a"/>';
    if (it.shape === 'gem') inner += `<g fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="3"><path d="M12 50h96M48 24 38 50l22 54M72 24l10 26-22 54"/></g>`;
    inner += '<ellipse cx="42" cy="44" rx="10" ry="6" fill="#fff" opacity=".6" transform="rotate(-35 42 44)"/>';
    return svg('0 0 120 120', inner);
  }
  function makeupSwatch(cat, it) {
    if (cat === 'cheek') return compact(it.color, it.shape === 'heart');
    if (cat === 'lip') return lipstick(it.color, it.glitter);
    if (cat === 'eye') return shadowPan(it.color, it.glitter);
    return stickerSvg(it);
  }
  // 手に もつ道具。左上（14, 14）が 先っぽ
  function makeupTool(cat, it) {
    const c = it ? it.color : '#f98bb0';
    if (cat === 'cheek') return svg('0 0 120 120', `<g transform="translate(14 14) rotate(45)">
      <rect x="58" y="-7" width="80" height="14" rx="7" fill="#f4b3c2" stroke="#d98ea2" stroke-width="3"/>
      <rect x="44" y="-11" width="18" height="22" rx="4" fill="#ecd08f" stroke="#b8913f" stroke-width="3"/>
      <path d="M46-12C30-26 2-20 0 0c2 20 30 26 46 12z" fill="#fff7ef" stroke="${LINE}" stroke-width="3"/>
      <path d="M0 0C3-15 18-20 27-17c-5 10-5 24 0 34C18 20 3 15 0 0z" fill="${c}"/></g>`);
    if (cat === 'lip') return svg('0 0 120 120', `<g transform="translate(14 14) rotate(45)">
      <rect x="50" y="-15" width="72" height="30" rx="6" fill="#f7c6d3" stroke="#d98ea2" stroke-width="3"/>
      <rect x="64" y="-15" width="8" height="30" fill="#ecd08f"/>
      <rect x="37" y="-13" width="16" height="26" rx="3" fill="#f6e2b0" stroke="#b8913f" stroke-width="3"/>
      <path d="M39-10H10q-8 0-8 7l4 13h33z" fill="${c}" stroke="${shade(c, 0.72)}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M12-4h22" stroke="#fff" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/></g>`);
    if (cat === 'eye') return svg('0 0 120 120', `<g transform="translate(14 14) rotate(45)">
      <rect x="26" y="-5" width="100" height="10" rx="5" fill="#ecd08f" stroke="#b8913f" stroke-width="2.5"/>
      <ellipse cx="16" cy="0" rx="19" ry="11" fill="${c}" stroke="${shade(c, 0.78)}" stroke-width="2.5"/>
      <ellipse cx="10" cy="-4" rx="7" ry="3" fill="#fff" opacity=".5"/></g>`);
    if (cat === 'cotton') return cotton();
    return stickerSvg(it);
  }
  function cotton() {
    return svg('0 0 120 120', `
      <circle cx="60" cy="62" r="44" fill="#ffffff" stroke="#d9dfe8" stroke-width="3"/>
      <circle cx="60" cy="62" r="33" fill="none" stroke="#e6ebf2" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>
      <g fill="#e6ebf2"><circle cx="48" cy="52" r="3"/><circle cx="70" cy="50" r="3"/><circle cx="60" cy="66" r="3"/><circle cx="46" cy="76" r="3"/><circle cx="74" cy="74" r="3"/></g>
      <ellipse cx="44" cy="40" rx="12" ry="6" fill="#f3f7fb" transform="rotate(-30 44 40)"/>`);
  }
  function makeupCat(cat) {
    if (cat === 'cheek') return compact('#f98bb0');
    if (cat === 'lip') return lipstick('#e0263f');
    if (cat === 'eye') return palette();
    if (cat === 'deco') return stickerSvg({ shape: 'star', color: '#ffd24d' });
    return cotton();
  }

  /* ---------- よこに してね ---------- */
  function rotateHint() {
    return svg('0 0 240 200', `
      <g class="rot-tab"><rect x="80" y="30" width="80" height="130" rx="14" fill="#fff" stroke="#c95f7f" stroke-width="6"/><circle cx="120" cy="146" r="5" fill="#c95f7f"/></g>
      <path d="M200 120a80 80 0 0 0-50-74" fill="none" stroke="#e2c48a" stroke-width="8" stroke-linecap="round"/>
      <path d="M150 34l2 20 18-8z" fill="#e2c48a"/>`);
  }

  const all = Object.assign({}, items, icons, {
    bg_room: () => bgRoom(false),
    bg_room_night: () => bgRoom(true),
    bg_bath: () => bgBath(),
    ribbon_pink: () => bow('#f4a3b8'),
    ribbon_blue: () => bow('#93c9ef'),
    ribbon_yellow: () => bow('#f5d76a'),
    icon_makeup: () => lipstick('#f2588f')
  });

  return { svg, heart, heartEmpty, sparkle, meterIcons, bow, butterfly, rotateHint, all, HEART_PATH, makeupSwatch, makeupTool, makeupCat };
})();
