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

  /* ---------- 背景：おへや（ニャーちゃんと 同じ 線画風：こい線 ＋ パステルの べたぬり） ---------- */
  const BGINK = '#3b3236';
  const ink = (w = 4, col = BGINK) => `stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  function bgRoom(night = false) {
    const c = night ? {
      wall: '#56547e', dot: '#68669a', wains: '#4a5c78', rail: '#6d6a96', floor: '#6c5c76', plank: '#5a4c64',
      sky: '#232a5a', hill: '#3c5a5a', tree: '#3f6a62', trunk: '#5a4a52', curt: '#8676a6', frame: '#7c7aa6',
      piano: '#7a5f70', pianoP: '#6a5262', keys: '#d8d2dc', rug: '#86648e', rugIn: '#9c7aa2', pot: '#a2707a', leaf: '#4f7a66',
      pic: '#e9e2c4', shade: '#ffe08a', ink: '#221c26'
    } : {
      wall: '#fff3da', dot: '#f9dfb6', wains: '#d5efe0', rail: '#ffffff', floor: '#f3d8b0', plank: '#ddb98d',
      sky: '#cdeaf8', hill: '#b6e3a8', tree: '#9fd68e', trunk: '#c79a6e', curt: '#ffe39a', frame: '#ffffff',
      piano: '#d9ae8c', pianoP: '#c79a76', keys: '#ffffff', rug: '#f8c6d3', rugIn: '#fde3ea', pot: '#f0a98c', leaf: '#8fd08a',
      pic: '#fffaf0', shade: '#fff1b8', ink: BGINK
    };
    const I = (w) => ink(w, c.ink);
    const p = id('r');
    const planks = [772, 852, 942].map(y => `<path d="M0 ${y}H1366" stroke="${c.plank}" stroke-width="3"/>`).join('') +
      [[140, 704, 772], [480, 772, 852], [820, 704, 772], [1120, 772, 852], [300, 852, 942], [700, 852, 942], [1040, 942, 1024], [1240, 852, 942], [460, 942, 1024]]
        .map(([x, a, b]) => `<path d="M${x} ${a}V${b}" stroke="${c.plank}" stroke-width="3"/>`).join('');
    const whites = Array.from({ length: 15 }, (_, i) => `<path d="M${84 + i * 25} 548V602" ${I(2.5)}/>`).join('');
    const blacks = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12].map(i => `<rect x="${78 + i * 25 + 17}" y="548" width="14" height="32" rx="3" fill="${c.ink}"/>`).join('');
    const sky = night
      ? `${[[900, 220], [960, 190], [1090, 210], [1120, 300], [930, 330], [1040, 360]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 3 : 4.5}" fill="#fff6c9"/>`).join('')}
         <path d="M1062 228 a40 40 0 1 0 34 56 a32 32 0 1 1 -34 -56z" fill="#fff0a8" ${I(4)}/>`
      : `<circle cx="1080" cy="250" r="34" fill="#ffe27a" ${I(4)}/>
         <path d="M908 236 q8 -26 34 -20 q14 -20 38 -6 q26 0 26 22 q0 18 -24 18 h-60 q-22 0 -14 -14z" fill="#fff" ${I(4)}/>`;
    const glow = night ? `<radialGradient id="${p}g"><stop offset="0" stop-color="#ffd98a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>` : '';
    return svg('0 0 1366 1024', `
      <defs>
        <pattern id="${p}d" width="64" height="64" patternUnits="userSpaceOnUse"><circle cx="16" cy="16" r="5" fill="${c.dot}"/><circle cx="48" cy="48" r="5" fill="${c.dot}"/></pattern>
        <clipPath id="${p}w"><path d="M880 540V290a140 140 0 0 1 280 0v250z"/></clipPath>
        ${glow}
      </defs>
      <!-- かべ -->
      <rect width="1366" height="700" fill="${c.wall}"/>
      <rect y="30" width="1366" height="486" fill="url(#${p}d)"/>
      <rect y="-4" width="1366" height="30" fill="${c.rail}" ${I(4)}/>
      <rect y="520" width="1366" height="168" fill="${c.wains}"/>
      <rect y="508" width="1366" height="18" fill="${c.rail}" ${I(4)}/>
      ${[40, 300, 1180].map(x => `<rect x="${x}" y="548" width="200" height="110" rx="14" fill="none" ${I(3)} opacity=".35"/>`).join('')}
      <rect y="682" width="1366" height="22" fill="${c.rail}" ${I(4)}/>
      <!-- ゆか -->
      <rect y="704" width="1366" height="320" fill="${c.floor}"/>
      ${planks}

      <!-- まど -->
      <g clip-path="url(#${p}w)">
        <rect x="870" y="140" width="300" height="410" fill="${c.sky}"/>
        ${sky}
        <path d="M870 470 q80 -50 160 -10 q70 -40 140 0 v90 h-300z" fill="${c.hill}" ${I(4)}/>
        <path d="M950 470v-40M1080 460v-60" ${I(8)} stroke="${c.trunk}"/>
        <circle cx="950" cy="420" r="36" fill="${c.tree}" ${I(4)}/><circle cx="1080" cy="392" r="46" fill="${c.tree}" ${I(4)}/>
      </g>
      <path d="M880 540V290a140 140 0 0 1 280 0v250z" fill="none" stroke="${c.frame}" stroke-width="22"/>
      <path d="M880 540V290a140 140 0 0 1 280 0v250z" fill="none" ${I(5)}/>
      <path d="M868 552V290a152 152 0 0 1 304 0v262" fill="none" ${I(4)}/>
      <path d="M1020 150v390M880 380h280" stroke="${c.frame}" stroke-width="12"/>
      <path d="M1020 150v390M880 380h280" fill="none" ${I(3)} opacity=".6"/>
      <rect x="852" y="540" width="336" height="24" rx="8" fill="${c.frame}" ${I(4)}/>
      <!-- カーテン -->
      <path d="M820 120 C850 120 880 130 892 140 C880 300 884 460 906 600 C870 610 840 610 812 600 C830 440 826 280 820 120Z" fill="${c.curt}" ${I(4)}/>
      <path d="M1220 120 C1190 120 1160 130 1148 140 C1160 300 1156 460 1134 600 C1170 610 1200 610 1228 600 C1210 440 1214 280 1220 120Z" fill="${c.curt}" ${I(4)}/>
      <path d="M846 170c6 120 8 280 -4 400M1194 170c-6 120 -8 280 4 400" fill="none" ${I(3)} opacity=".45"/>
      <path d="M804 104h432v34c-36 26-72 26-108 4-36 24-72 24-108 0-36 24-72 24-108 0-36 22-72 22-108-4z" fill="${c.curt}" ${I(4)}/>

      <!-- えを かざる がくぶち（おえかきの え が ここに はいる） -->
      <rect x="306" y="166" width="228" height="166" rx="10" fill="#e9c48c" ${I(4)}/>
      <rect x="322" y="182" width="196" height="134" rx="4" fill="${c.pic}" ${I(3)}/>
      <g transform="translate(420 250)">
        <path d="M-50 0 C-30 -34 30 -34 44 0 C30 34 -30 34 -50 0Z" fill="#9ccdf0" ${I(4)}/>
        <path d="M44 0 L74 -24 L70 24 Z" fill="#9ccdf0" ${I(4)}/>
        <circle cx="-26" cy="-6" r="5" fill="${c.ink}"/>
      </g>

      <!-- ピアノ -->
      <g>
        <rect x="50" y="318" width="404" height="30" rx="10" fill="${c.piano}" ${I(4)}/>
        <rect x="62" y="346" width="380" height="176" fill="${c.piano}" ${I(4)}/>
        <rect x="88" y="366" width="328" height="136" rx="12" fill="${c.pianoP}" ${I(3)}/>
        <g transform="rotate(-3 250 410)"><rect x="196" y="378" width="112" height="76" rx="4" fill="#fffdf6" ${I(3)}/>
          <path d="M208 396h88M208 410h88M208 424h88M208 438h88" stroke="${c.ink}" stroke-width="1.5" opacity=".35"/>
          <circle cx="228" cy="410" r="5" fill="${c.ink}"/><circle cx="254" cy="424" r="5" fill="${c.ink}"/><circle cx="282" cy="402" r="5" fill="${c.ink}"/></g>
        <rect x="44" y="520" width="416" height="28" rx="6" fill="${c.piano}" ${I(4)}/>
        <rect x="70" y="548" width="364" height="54" fill="${c.keys}" ${I(4)}/>
        ${whites}${blacks}
        <rect x="62" y="602" width="380" height="80" fill="${c.piano}" ${I(4)}/>
        <path d="M236 668h32" ${I(8)}/>
        <!-- おはなの はちうえ -->
        <path d="M100 318 l8 -40 h44 l8 40z" fill="${c.pot}" ${I(4)}/>
        <path d="M130 278 v-30" ${I(5)}/>
        <g fill="#f7a8c4">${[[112, 244], [130, 230], [148, 244], [130, 256]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" ${I(3)}/>`).join('')}</g>
        <circle cx="130" cy="244" r="8" fill="#ffe27a" ${I(3)}/>
        <!-- スタンドの あかり -->
        <path d="M244 318 v-46" ${I(5)}/>
        <path d="M210 272 h68 l-12 -44 h-44z" fill="${c.shade}" ${I(4)}/>
        ${night ? `<circle cx="244" cy="252" r="170" fill="url(#${p}g)"/>` : ''}
      </g>

      <!-- はちうえ（右） -->
      <g>
        <path d="M1250 700 l-14 -86 h96 l-14 86z" fill="${c.pot}" ${I(4)}/>
        <path d="M1284 614 C1270 560 1230 540 1214 500 M1284 614 C1290 550 1310 520 1340 500 M1284 614 C1284 560 1280 520 1290 470" fill="none" ${I(5)}/>
        ${[[1214, 500, -30], [1340, 500, 30], [1290, 470, 0], [1250, 560, -50], [1316, 548, 50]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="24" ry="40" transform="rotate(${r} ${x} ${y})" fill="${c.leaf}" ${I(4)}/>`).join('')}
      </g>

      <!-- じゅうたん -->
      <ellipse cx="683" cy="900" rx="480" ry="108" fill="${c.rug}" ${I(4)}/>
      <ellipse cx="683" cy="900" rx="400" ry="80" fill="none" stroke="${c.rugIn}" stroke-width="8" stroke-dasharray="18 14"/>
    `, 'preserveAspectRatio="xMidYMid slice"');
  }

  /* ---------- 背景：おふろば（線画風） ---------- */
  function bgBath() {
    const p = id('b');
    const I = (w) => ink(w);
    const tiles = [];
    for (let x = 0; x <= 1366; x += 76) tiles.push(`M${x} 320V700`);
    for (let y = 320; y <= 700; y += 76) tiles.push(`M0 ${y}H1366`);
    const bubbles = [[930, 486, 34], [990, 466, 44], [1066, 458, 50], [1140, 466, 42], [1210, 484, 34], [1240, 410, 14], [960, 404, 12], [1110, 380, 18]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${I(3.5)} stroke="#7fb6d6"/>`).join('');
    return svg('0 0 1366 1024', `
      <defs>
        <pattern id="${p}f" width="120" height="120" patternUnits="userSpaceOnUse"><rect width="120" height="120" fill="#fff6f8"/><rect width="60" height="60" fill="#fbdde5"/><rect x="60" y="60" width="60" height="60" fill="#fbdde5"/></pattern>
      </defs>
      <!-- かべ -->
      <rect width="1366" height="320" fill="#fff7e8"/>
      <rect y="-4" width="1366" height="30" fill="#fff" ${I(4)}/>
      <rect y="320" width="1366" height="384" fill="#d9f1f3"/>
      <path d="${tiles.join('')}" stroke="#b3dde2" stroke-width="3"/>
      <rect y="306" width="1366" height="18" fill="#fff" ${I(4)}/>
      <!-- ゆか -->
      <rect y="700" width="1366" height="324" fill="url(#${p}f)"/>
      <rect y="694" width="1366" height="14" fill="#fff" ${I(4)}/>
      <!-- まるい まど -->
      <circle cx="683" cy="160" r="86" fill="#cdeaf8" ${I(5)}/>
      <circle cx="683" cy="160" r="100" fill="none" stroke="#fff" stroke-width="18"/>
      <circle cx="683" cy="160" r="110" fill="none" ${I(4)}/>
      <path d="M683 74v172M597 160h172" stroke="#fff" stroke-width="10"/>
      <path d="M640 130 q10 -18 30 -12 q14 -12 28 0 q16 0 14 14 h-66z" fill="#fff" ${I(3)}/>
      <!-- かがみ -->
      <ellipse cx="240" cy="226" rx="96" ry="120" fill="#e6f5fb" ${I(5)}/>
      <ellipse cx="240" cy="226" rx="108" ry="132" fill="none" stroke="#f3cf8f" stroke-width="14"/>
      <ellipse cx="240" cy="226" rx="116" ry="140" fill="none" ${I(4)}/>
      <path d="M192 168c18 -28 46 -38 66 -34M182 214c10 -16 20 -24 30 -26" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/>
      <!-- タオルかけ -->
      <path d="M70 452h300" ${I(10)}/>
      <path d="M70 452h300" stroke="#f3cf8f" stroke-width="5" stroke-linecap="round"/>
      <path d="M120 448h200v150c-40 14-160 14-200 0z" fill="#f8b9c8" ${I(4)}/>
      <path d="M120 560c60 12 140 12 200 0M120 578c60 12 140 12 200 0" fill="none" stroke="#fff" stroke-width="6"/>
      <!-- よくそう -->
      <g>
        ${bubbles}
        <path d="M870 520h420c0 140-60 220-210 220S870 660 870 520z" fill="#ffffff" ${I(5)}/>
        <path d="M858 506h444a15 15 0 0 1 0 30H858a15 15 0 0 1 0-30z" fill="#ffe08e" ${I(4)}/>
        <path d="M902 566c20 76 80 124 168 130" fill="none" stroke="#e8f4f8" stroke-width="16" stroke-linecap="round"/>
        <path d="M950 724l-26 52M1210 724l26 52" ${I(14)}/>
        <path d="M950 724l-26 52M1210 724l26 52" stroke="#f3cf8f" stroke-width="7" stroke-linecap="round"/>
        <!-- あひる -->
        <g transform="translate(1238 488)">
          <path d="M-30 4 C-34 -20 -10 -26 4 -16 C10 -40 40 -38 42 -16 C44 -2 34 6 24 8 C20 20 -24 22 -30 4Z" fill="#ffe27a" ${I(4)}/>
          <path d="M40 -18 l18 4 l-16 8z" fill="#f6a24a" ${I(3)}/>
          <circle cx="26" cy="-22" r="4" fill="${BGINK}"/>
        </g>
      </g>
      <!-- うかぶ あわ -->
      <g fill="#fff" ${I(3)} stroke="#7fb6d6"><circle cx="480" cy="190" r="18"/><circle cx="520" cy="246" r="10"/><circle cx="860" cy="256" r="14"/><circle cx="420" cy="300" r="8"/></g>
      <!-- バスマット -->
      <ellipse cx="560" cy="910" rx="330" ry="80" fill="#f7c3d0" ${I(4)}/>
      <ellipse cx="560" cy="910" rx="290" ry="60" fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="4 16" stroke-linecap="round"/>
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
