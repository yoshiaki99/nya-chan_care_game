/*
 * おでかけ（要件定義書 5.10）で使う絵（SVG）。背景・えらぶ画面の絵・ドアのアイコン・その場所で タッチする 道具。
 * ニャーちゃんと 同じ 線画風（こい線 ＋ パステルの べたぬり）。絵の中に 文字は 入れない。
 * G.Art.all に足すので、G.Assets.node('bg_festival') のように使える（画像ファイルを 置けば 差しかわる）。
 * 道具の中で 動かす ところには class を つけてある（css/style.css の「おでかけ」で 動かす）。
 */
window.G = window.G || {};

G.OutingArt = (function () {
  const svg = G.Art.svg, HEART = G.Art.HEART_PATH;
  const INK = '#3b3236', LINE = '#b9a294';
  const ink = (w = 4, col = INK) => `stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  let uid = 0;
  const id = (p) => 'o' + p + (++uid);
  const STAR = 'M50 0C54 38 62 46 100 50 62 54 54 62 50 100 46 62 38 54 0 50 38 46 46 38 50 0z';
  const glint = (x, y, s, fill = '#fffbe6') => `<path transform="translate(${x - 50 * s} ${y - 50 * s}) scale(${s})" d="${STAR}" fill="${fill}"/>`;
  const heartAt = (x, y, s, fill) => `<path transform="translate(${x} ${y}) scale(${s}) translate(-16 -14.5)" d="${HEART}" fill="${fill}"/>`;
  function starPts(cx, cy, ro, ri) {
    const p = [];
    for (let k = 0; k < 10; k++) {
      const t = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? ri : ro;
      p.push((cx + Math.cos(t) * r).toFixed(1) + ',' + (cy + Math.sin(t) * r).toFixed(1));
    }
    return p.join(' ');
  }
  // まるを かさねた もくもく（わたあめ・ゆき・けむり）。ふちだけ 線を 描く
  function puff(pts, fill, w = 4) {
    const cs = pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
    return `<g fill="${INK}" ${ink(w * 2)}>${cs}</g><g fill="${fill}">${cs}</g>`;
  }

  /* ================= ボタン・えらぶ画面の 絵 ================= */
  // おへやの ドア（おでかけ）
  function door() {
    return svg('0 0 200 200', `
      ${glint(160, 40, 0.22, '#f6d66b')}${glint(178, 70, 0.13, '#f6d66b')}
      <path d="M30 184h140v8a5 5 0 0 1-5 5H35a5 5 0 0 1-5-5z" fill="#f4c7d3" stroke="${LINE}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M50 186V78a50 50 0 0 1 100 0v108z" fill="#a9dfc8" stroke="${LINE}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M64 186V82a36 36 0 0 1 72 0v104" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="5"/>
      <circle cx="100" cy="82" r="21" fill="#cdeaf8" stroke="${LINE}" stroke-width="4"/>
      <path d="M100 61v42M79 82h42" stroke="${LINE}" stroke-width="3"/>
      ${heartAt(100, 134, 0.9, '#f6a8c8')}
      <circle cx="133" cy="146" r="7" fill="#f6d66b" stroke="#c9a253" stroke-width="3"/>`);
  }
  // チェック（できた）
  function check() {
    return svg('0 0 100 100', `<circle cx="50" cy="50" r="44" fill="#fff" stroke="#6fbf8f" stroke-width="6"/>
      <path d="M28 52 44 68 74 34" fill="none" stroke="#4fae76" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`);
  }
  // ちょうちん（おまつり）
  function lantern(x, y, s, fill, rib) {
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M0-92v-14" ${ink(4)}/>
      <rect x="-22" y="-80" width="44" height="14" rx="4" fill="#4a3f46"/>
      <rect x="-22" y="64" width="44" height="14" rx="4" fill="#4a3f46"/>
      <ellipse cx="0" cy="0" rx="62" ry="70" fill="${fill}" ${ink(4)}/>
      <path d="M-56-30q56 12 112 0M-62 0q62 12 124 0M-56 30q56 12 112 0" fill="none" stroke="${rib}" stroke-width="4"/>
      <ellipse cx="-26" cy="-22" rx="11" ry="22" fill="#fff" opacity=".35"/>
      <path d="M0 78v16" stroke="#f6d66b" stroke-width="7" stroke-linecap="round"/></g>`;
  }
  function iconFestival() {
    const rays = [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path transform="rotate(${a})" d="M0-12V-28"/>`).join('');
    return svg('0 0 200 200', `
      <g transform="translate(160 44)" fill="none" stroke="#f6b26b" stroke-width="5" stroke-linecap="round">${rays}</g>
      <g transform="translate(36 52)" fill="none" stroke="#9fd0f0" stroke-width="4" stroke-linecap="round">${rays}</g>
      ${lantern(100, 110, 0.95, '#f47c7c', '#d9605f')}
      <circle cx="100" cy="110" r="20" fill="#fff8ef" stroke="${LINE}" stroke-width="3"/>
      ${heartAt(100, 111, 0.7, '#f47c7c')}`);
  }
  // かぼちゃ（ハロウィン）。lit = 目と口が ひかる
  function pumpkin(x, y, s, cls = '') {
    return `<g class="${cls}" transform="translate(${x} ${y}) scale(${s})">
      <path d="M-6-74q-4-22 10-32l8 8q-10 8-8 24z" fill="#8fbf6a" ${ink(4)}/>
      <ellipse cx="-42" cy="0" rx="48" ry="68" fill="#f39a45" ${ink(5)}/>
      <ellipse cx="42" cy="0" rx="48" ry="68" fill="#f39a45" ${ink(5)}/>
      <ellipse cx="0" cy="0" rx="54" ry="74" fill="#f8ae5c" ${ink(5)}/>
      <path d="M-62-20q-6 22 2 44M62-20q6 22-2 44" fill="none" stroke="#e08a3a" stroke-width="4" stroke-linecap="round"/>
      <g class="pk-face" fill="#5a3b2e"><path d="M-36-14l14-22 14 22zM8-14l14-22 14 22z"/>
        <path d="M-40 16q40 34 80 0l-12 4-8-10-10 12-10-12-10 12-8-10z"/></g></g>`;
  }
  // ハロウィンの えらぶ絵：ひかる かぼちゃと まじょの ぼうし
  function iconHalloween() {
    return svg('0 0 200 200', `
      ${glint(166, 42, 0.22, '#f6d66b')}${glint(30, 120, 0.14, '#f6d66b')}
      ${pumpkin(100, 128, 0.92).replace('fill="#5a3b2e"', 'fill="#ffd25a"')}
      <g transform="translate(58 60) rotate(-16)">
        <path d="M-40 12q40 16 80 0" fill="#7a66a8" stroke="${LINE}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M-26 10 4-48q4-8 10 0l8 10-6-2 8 50z" fill="#8f78c8" stroke="${LINE}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M-24 2q24 8 46 0" fill="none" stroke="#f6a04d" stroke-width="7"/></g>`);
  }
  // ツリー（クリスマス）
  function iconChristmas() {
    return svg('0 0 200 200', `
      <path d="M100 30 148 98H124l36 52H40l36-52H52z" fill="#8fd08a" stroke="${LINE}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M70 92q30 14 62 0M58 138q42 16 86 0" fill="none" stroke="#f4a3b8" stroke-width="5" stroke-linecap="round"/>
      <circle cx="88" cy="74" r="7" fill="#f47c7c"/><circle cx="118" cy="110" r="7" fill="#93c9ef"/><circle cx="76" cy="120" r="7" fill="#f6d66b"/><circle cx="128" cy="140" r="6" fill="#f47c7c"/>
      <rect x="88" y="150" width="24" height="24" fill="#c79a6e" stroke="${LINE}" stroke-width="4"/>
      <polygon points="${starPts(100, 28, 20, 9)}" fill="#f6d66b" stroke="#d6aa36" stroke-width="3" stroke-linejoin="round"/>
      <rect x="132" y="148" width="46" height="38" rx="4" fill="#f47c9c" stroke="${LINE}" stroke-width="3.5"/>
      <path d="M155 148v38M132 164h46" stroke="#fff1b8" stroke-width="7"/>`);
  }
  // ねこみみの おうち（ニューちゃんの いえ）。うしろから ニューちゃんの しまの しっぽ
  function iconNyuHome() {
    const tail = 'M156 176c22-4 30-30 24-58-4-18 4-34 18-34';
    return svg('0 0 200 200', `
      <path d="${tail}" fill="none" stroke="${LINE}" stroke-width="20" stroke-linecap="round"/>
      <path d="${tail}" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
      <path d="M174 136h14M172 112l14-4" stroke="#b07a52" stroke-width="7" stroke-linecap="round"/>
      <rect x="38" y="94" width="124" height="90" rx="6" fill="#fff8ef" stroke="${LINE}" stroke-width="4"/>
      <path d="M20 100 44 36 72 64h56l28-28 24 64z" fill="#f6a8c8" stroke="${LINE}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M46 66l6-16 10 12zM154 66l-6-16-10 12z" fill="#fde3ea"/>
      <path d="M86 184v-34a14 14 0 0 1 28 0v34z" fill="#c9b3ee" stroke="${LINE}" stroke-width="4"/>
      <circle cx="64" cy="132" r="13" fill="#cdeaf8" stroke="${LINE}" stroke-width="3.5"/>
      ${heartAt(136, 132, 0.8, '#f6a8c8')}`);
  }

  /* ================= 背景 ================= */
  const BG = 'preserveAspectRatio="xMidYMid slice"';

  /* おまつり：ゆうぐれの そら・ちょうちん・とおくの やま・どうろ */
  function bgFestival() {
    const p = id('f');
    const lanterns = [];
    for (let i = 0; i < 9; i++) {
      const t = (i + 0.5) / 9, x = -20 + 1406 * t, y = 150 + 220 * t * (1 - t);
      lanterns.push(`<circle cx="${x}" cy="${y + 46}" r="56" fill="url(#${p}g)"/>` + lantern(x, y + 46, 0.42, i % 2 ? '#fff8ef' : '#f47c7c', i % 2 ? '#f2c7c7' : '#d9605f'));
    }
    const stars = [[120, 70], [300, 120], [520, 64], [760, 100], [980, 60], [1200, 110], [1300, 50], [640, 190], [420, 230], [880, 220]]
      .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 3 : 4.5}" fill="#fff6c9"/>`).join('');
    const far = [180, 330, 480, 890, 1040, 1190].map(x => `<circle cx="${x}" cy="604" r="7" fill="#ffd98a"/><circle cx="${x}" cy="604" r="16" fill="#ffd98a" opacity=".3"/>`).join('');
    const stones = [[200, 880, 50], [420, 960, 40], [700, 1000, 46], [980, 900, 38], [1180, 990, 52], [560, 820, 30], [860, 790, 26], [120, 980, 34]]
      .map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.35}" fill="#e7c89c"/>`).join('');
    return svg('0 0 1366 1024', `
      <defs>
        <linearGradient id="${p}s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#5f5aa6"/><stop offset=".45" stop-color="#ad8ad0"/><stop offset=".78" stop-color="#f5b2ae"/><stop offset="1" stop-color="#ffd8a4"/>
        </linearGradient>
        <radialGradient id="${p}g"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".7"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="1366" height="720" fill="url(#${p}s)"/>
      ${stars}
      <path d="M1050 46a36 36 0 1 0 30 50 28 28 0 1 1-30-50z" fill="#fff0a8" ${ink(4)}/>
      <!-- とおくの やま・もり -->
      <path d="M0 600q120-90 260-60t280-40 300 50 300-60 226 40v220H0z" fill="#8a7bb8" ${ink(4)}/>
      <path d="M0 640q160-50 340-20t340-10 340 10 346-20v120H0z" fill="#6f9a8c" ${ink(4)}/>
      ${far}
      <!-- じめん（どうろ） -->
      <rect y="700" width="1366" height="324" fill="#f2d9b2"/>
      <path d="M0 700H1366" ${ink(4)}/>
      ${stones}
      <!-- ちょうちんの ひも -->
      <path d="M-20 150Q683 370 1386 150" fill="none" ${ink(4)}/>
      ${lanterns.join('')}
    `, BG);
  }

  /* ハロウィン：むらさきの パーティーの へや（まるい まどに おつきさま・ガーランド・くものす） */
  function bgHalloween() {
    const p = id('h');
    const flags = [];
    for (let i = 0; i < 14; i++) {
      const t = (i + 0.5) / 14, x = 1366 * t, y = 130 + 120 * t * (1 - t) * 2;
      const c = ['#f6a04d', '#b796e6', '#9fd68e'][i % 3];
      flags.push(`<path d="M${x - 34} ${y - 4}L${x + 34} ${y + 4}L${x - 2} ${y + 66}z" fill="${c}" ${ink(4)}/>`);
    }
    const web = (x, y, sx) => `<g transform="translate(${x} ${y}) scale(${sx} 1)" fill="none" stroke="#e8e0f6" stroke-width="3" opacity=".75">
      <path d="M0 0L170 30M0 0L140 110M0 0L60 160M0 0L10 180"/>
      <path d="M40 7q-2 22-26 33 22 2 35 28 4-24 20-36-12-15-29-25zM90 16q-6 50-55 82 46 8 72 60 6-52 44-74-30-26-61-68z"/></g>`;
    return svg('0 0 1366 1024', `
      <defs>
        <pattern id="${p}d" width="90" height="90" patternUnits="userSpaceOnUse">
          <path transform="translate(14 14) scale(.16)" d="${STAR}" fill="#7562a6"/><circle cx="66" cy="62" r="4" fill="#7562a6"/></pattern>
        <radialGradient id="${p}m"><stop offset="0" stop-color="#fff3b0" stop-opacity=".55"/><stop offset="1" stop-color="#fff3b0" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="1366" height="700" fill="#5e4b8b"/>
      <rect y="30" width="1366" height="490" fill="url(#${p}d)"/>
      <rect y="-4" width="1366" height="30" fill="#7a66a8" ${ink(4)}/>
      <rect y="520" width="1366" height="168" fill="#4b3d76"/>
      <rect y="508" width="1366" height="18" fill="#8a74b8" ${ink(4)}/>
      ${[60, 420, 780, 1140].map(x => `<rect x="${x}" y="548" width="200" height="110" rx="14" fill="none" stroke="#8a74b8" stroke-width="3" opacity=".5"/>`).join('')}
      <rect y="682" width="1366" height="22" fill="#8a74b8" ${ink(4)}/>
      <!-- ゆか（いちまつ もよう） -->
      <rect y="704" width="1366" height="320" fill="#c9a6cf"/>
      ${Array.from({ length: 6 * 23 }, (_, i) => { const r = Math.floor(i / 23), c = i % 23; return (r + c) % 2 ? '' : `<rect x="${c * 60}" y="${704 + r * 54}" width="60" height="54" fill="#b893c0"/>`; }).join('')}
      <path d="M0 704H1366" ${ink(4)}/>
      <!-- まるい まど・おつきさま -->
      <g transform="translate(683 300)">
        <circle r="150" fill="url(#${p}m)"/>
        <circle r="112" fill="#2c2f63" ${ink(5)}/>
        <circle cx="30" cy="-24" r="46" fill="#fff0a8" ${ink(4)}/>
        <circle cx="16" cy="-34" r="8" fill="#f3dc8a"/><circle cx="46" cy="-10" r="6" fill="#f3dc8a"/>
        ${[[-60, -40], [-40, 50], [60, 60], [-74, 10]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#fff6c9"/>`).join('')}
        <circle r="112" fill="none" stroke="#8a74b8" stroke-width="18"/>
        <circle r="124" fill="none" ${ink(4)}/>
        <path d="M0-112V112M-112 0H112" stroke="#8a74b8" stroke-width="10"/>
      </g>
      <!-- ガーランド・くものす -->
      ${web(0, 0, 1)}${web(1366, 0, -1)}
      <path d="M0 130Q683 250 1366 130" fill="none" ${ink(4)}/>
      ${flags.join('')}
      <!-- ろうそく -->
      ${[[150, 500], [1216, 500]].map(([x, y]) => `<rect x="${x - 14}" y="${y - 60}" width="28" height="60" rx="6" fill="#fff8ef" ${ink(4)}/><path d="M${x} ${y - 60}c-12-16-6-30 0-38 6 8 12 22 0 38z" fill="#ffd25a" ${ink(3)}/><circle cx="${x}" cy="${y - 74}" r="34" fill="url(#${p}m)"/>`).join('')}
    `, BG);
  }

  /* クリスマス：だんろの ある あたたかい へや */
  function bgChristmas() {
    const p = id('c');
    const stripes = Array.from({ length: 24 }, (_, i) => `<rect x="${i * 60 + 18}" y="26" width="24" height="494" fill="#fbe2d4"/>`).join('');
    const balls = [];
    for (let i = 0; i < 12; i++) {
      const x = 60 + i * 113, y = 70 + (i % 2) * 14;
      balls.push(`<circle cx="${x}" cy="${y + 26}" r="13" fill="${['#f47c7c', '#f6d66b', '#93c9ef'][i % 3]}" ${ink(3)}/>`);
    }
    const bow = (x, y) => `<g transform="translate(${x} ${y})" fill="#f47c7c" ${ink(3)}><path d="M0 0C-14-16-34-16-34 0S-14 14 0 0ZM0 0C14-16 34-16 34 0S14 14 0 0Z"/><path d="M-4 2l-12 26 10-4 4 8zM4 2l12 26-10-4-4 8z"/><circle r="7"/></g>`;
    return svg('0 0 1366 1024', `
      <defs><radialGradient id="${p}g"><stop offset="0" stop-color="#ffd98a" stop-opacity=".6"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient></defs>
      <rect width="1366" height="700" fill="#fff3e2"/>
      ${stripes}
      <rect y="-4" width="1366" height="30" fill="#fff" ${ink(4)}/>
      <rect y="520" width="1366" height="168" fill="#b5ddc0"/>
      <rect y="508" width="1366" height="18" fill="#fff" ${ink(4)}/>
      <rect y="682" width="1366" height="22" fill="#fff" ${ink(4)}/>
      <rect y="704" width="1366" height="320" fill="#ecc89c"/>
      ${[780, 860, 950].map(y => `<path d="M0 ${y}H1366" stroke="#d9ae7e" stroke-width="3"/>`).join('')}
      <!-- うえの かざり（もみの きの ガーランド） -->
      <path d="M0 60q57 40 113 0t113 0 113 0 113 0 113 0 113 0 113 0 113 0 113 0 113 0 113 0 113 0 113 0" fill="none" stroke="#6fb07e" stroke-width="22" stroke-linecap="round"/>
      <path d="M0 60q57 40 113 0t113 0 113 0 113 0 113 0 113 0 113 0 113 0 113 0 113 0 113 0 113 0 113 0" fill="none" stroke="#8fd08a" stroke-width="10" stroke-linecap="round" stroke-dasharray="2 14"/>
      ${balls.join('')}
      ${bow(113, 60)}${bow(683, 60)}${bow(1253, 60)}
      <!-- だんろ -->
      <circle cx="683" cy="600" r="260" fill="url(#${p}g)"/>
      <rect x="450" y="380" width="466" height="324" fill="#e48c78" ${ink(4)}/>
      ${[420, 460, 500, 540, 580, 620, 660].map((y, i) => `<path d="M450 ${y}H916" stroke="#cf7461" stroke-width="3"/>` + [0, 1, 2, 3, 4, 5].map(k => `<path d="M${470 + k * 80 + (i % 2) * 40} ${y - 40}v40" stroke="#cf7461" stroke-width="3"/>`).join('')).join('')}
      <rect x="420" y="352" width="526" height="34" rx="8" fill="#fff8ef" ${ink(4)}/>
      <path d="M552 704V540a131 110 0 0 1 262 0v164z" fill="#4a3f46" ${ink(4)}/>
      <path d="M600 690c-10-40 20-60 30-90 10 30 20 30 22 54 10-30 30-50 26-86 26 30 40 70 30 122z" fill="#f6a04d" ${ink(4)}/>
      <path d="M632 690c-6-26 10-34 16-54 8 20 16 22 16 40 8-16 16-24 16-40 14 20 20 36 14 54z" fill="#ffe27a"/>
      <path d="M590 692h186" ${ink(14, '#9a6b4f')}/>
      <!-- くつした -->
      <g ${ink(4)}><path d="M494 386v80c0 16-8 22-22 28-14 6-10 30 10 26 20-4 40-14 46-36v-98z" fill="#f47c7c"/><rect x="488" y="378" width="46" height="22" rx="6" fill="#fff"/>
        <path d="M872 386v80c0 16 8 22 22 28 14 6 10 30-10 26-20-4-40-14-46-36v-98z" fill="#8fd08a"/><rect x="832" y="378" width="46" height="22" rx="6" fill="#fff"/></g>
      <!-- だんろの うえの もみの えだ・ろうそく -->
      <path d="M440 352q60-24 120 0t120 0 120 0 120 0" fill="none" stroke="#6fb07e" stroke-width="14" stroke-linecap="round"/>
      ${[600, 766].map(x => `<rect x="${x - 10}" y="300" width="20" height="52" rx="4" fill="#fff" ${ink(3)}/><path d="M${x} 300c-10-14-4-26 0-32 4 6 10 18 0 32z" fill="#ffd25a" ${ink(3)}/>`).join('')}
    `, BG);
  }

  /* ニューちゃんの いえ：ミントの かべに ハート、まど・たな・まるい しきもの */
  function bgNyuHome() {
    const p = id('n');
    return svg('0 0 1366 1024', `
      <defs>
        <pattern id="${p}d" width="96" height="96" patternUnits="userSpaceOnUse">
          ${heartAt(24, 24, 0.5, '#c8ecdd')}${heartAt(72, 72, 0.5, '#c8ecdd')}</pattern>
        <clipPath id="${p}w"><path d="M170 470V280a120 120 0 0 1 240 0v190z"/></clipPath>
      </defs>
      <rect width="1366" height="700" fill="#e2f5ed"/>
      <rect y="30" width="1366" height="490" fill="url(#${p}d)"/>
      <rect y="-4" width="1366" height="30" fill="#fff" ${ink(4)}/>
      <rect y="520" width="1366" height="168" fill="#ece0fb"/>
      <rect y="508" width="1366" height="18" fill="#fff" ${ink(4)}/>
      ${[40, 300, 1100].map(x => `<rect x="${x}" y="548" width="200" height="110" rx="14" fill="none" ${ink(3)} opacity=".25"/>`).join('')}
      <rect y="682" width="1366" height="22" fill="#fff" ${ink(4)}/>
      <rect y="704" width="1366" height="320" fill="#f6e1c2"/>
      ${[772, 852, 942].map(y => `<path d="M0 ${y}H1366" stroke="#e5c69c" stroke-width="3"/>`).join('')}
      <!-- まど -->
      <g clip-path="url(#${p}w)">
        <rect x="160" y="140" width="260" height="340" fill="#cdeaf8"/>
        <path d="M200 236q8-24 32-18 14-18 36-4 24 0 24 20 0 16-22 16h-56q-20 0-14-14z" fill="#fff" ${ink(3)}/>
        <path d="M160 420q70-40 140-6t120-4v70H160z" fill="#b6e3a8" ${ink(4)}/>
      </g>
      <path d="M170 470V280a120 120 0 0 1 240 0v190z" fill="none" stroke="#fff" stroke-width="20"/>
      <path d="M170 470V280a120 120 0 0 1 240 0v190z" fill="none" ${ink(4)}/>
      <path d="M290 160v310M170 330h240" stroke="#fff" stroke-width="10"/>
      <rect x="150" y="466" width="280" height="22" rx="8" fill="#fff" ${ink(4)}/>
      <path d="M130 130c30 0 40 10 44 20-14 110-10 220 10 340-30 10-50 10-70 0 14-120 16-240 16-360z" fill="#f9c6d6" ${ink(4)}/>
      <path d="M450 130c-30 0-40 10-44 20 14 110 10 220-10 340 30 10 50 10 70 0-14-120-16-240-16-360z" fill="#f9c6d6" ${ink(4)}/>
      <!-- おほしさまの かざり -->
      <path d="M560 60q123 80 246 0" fill="none" ${ink(3)}/>
      ${[[590, 86], [640, 104], [683, 110], [726, 104], [776, 86]].map(([x, y], i) => `<path d="M${x} ${y - 14}v14" ${ink(2)}/><polygon points="${starPts(x, y + 14, 16, 7)}" fill="${['#f6d66b', '#f6a8c8', '#9fd0f0'][i % 3]}" ${ink(3)}/>`).join('')}
      <!-- たな（おもちゃ・ほん） -->
      <g>
        <rect x="960" y="300" width="330" height="20" rx="6" fill="#f3c08f" ${ink(4)}/>
        <rect x="980" y="226" width="22" height="74" rx="3" fill="#f47c7c" ${ink(3)}/><rect x="1002" y="236" width="22" height="64" rx="3" fill="#9fd0f0" ${ink(3)}/><rect x="1024" y="230" width="22" height="70" rx="3" fill="#f6d66b" ${ink(3)}/>
        <rect x="1070" y="246" width="54" height="54" rx="6" fill="#c9b3ee" ${ink(4)}/><path d="M1084 258l26 30M1110 258l-26 30" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
        <circle cx="1170" cy="270" r="30" fill="#fff" ${ink(4)}/><path d="M1142 262q28 14 56 0M1150 288q20-28 40-50" fill="none" stroke="#f47c7c" stroke-width="6"/>
        <path d="M1220 300l14-44h30l14 44z" fill="#f0a98c" ${ink(4)}/><path d="M1249 256c-10-26 8-40 22-46-4 18-6 32-22 46zM1249 256c0-24-16-34-30-38 6 18 10 30 30 38z" fill="#8fd08a" ${ink(3)}/>
        <rect x="960" y="430" width="330" height="20" rx="6" fill="#f3c08f" ${ink(4)}/>
        <rect x="1000" y="350" width="120" height="80" rx="10" fill="#fffaf0" ${ink(4)}/>
        ${heartAt(1060, 390, 1.1, '#f6a8c8')}
        <circle cx="1200" cy="400" r="28" fill="#f6d66b" ${ink(4)}/><path d="M1180 382q20 20 40 0M1180 418q20-20 40 0" fill="none" stroke="#fff" stroke-width="5"/>
      </g>
      <!-- しきもの -->
      <ellipse cx="683" cy="905" rx="500" ry="104" fill="#cfe8fa" ${ink(4)}/>
      <ellipse cx="683" cy="905" rx="420" ry="78" fill="none" stroke="#fff" stroke-width="8" stroke-dasharray="4 18" stroke-linecap="round"/>
    `, BG);
  }

  /* ================= その場所で タッチする 道具 ================= */
  /* --- おまつり --- */
  // やたい（340×470）。roof = やねの しまの 色、cloth = だいの ぬのの 色、sign = かんばんの 絵、goods = だいの 上の もの
  function stall(roof, cloth, sign, goods) {
    const stripes = [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${6 + i * 41}" y="22" width="41" height="74" fill="${i % 2 ? '#fff8ef' : roof}"/>`).join('');
    const scallop = [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${6 + i * 41} 96a20.5 20.5 0 0 0 41 0z" fill="${i % 2 ? '#fff8ef' : roof}" ${ink(4)}/>`).join('');
    return svg('0 0 340 470', `
      <rect x="20" y="96" width="16" height="366" fill="#c79a6e" ${ink(4)}/><rect x="304" y="96" width="16" height="366" fill="#c79a6e" ${ink(4)}/>
      ${stripes}
      <rect x="6" y="22" width="328" height="74" fill="none" ${ink(4)}/>
      ${scallop}
      <path d="M0 24 22 2h296l22 22z" fill="${roof}" ${ink(4)}/>
      <rect x="116" y="124" width="108" height="78" rx="12" fill="#fff1b8" ${ink(4)}/>
      ${sign}
      ${goods}
      <!-- だい -->
      <rect x="6" y="298" width="328" height="166" rx="10" fill="#f3c08f" ${ink(4)}/>
      <rect x="26" y="326" width="288" height="118" rx="8" fill="${cloth}" ${ink(4)}/>
      ${[[70, 360], [130, 400], [190, 360], [250, 400], [110, 430], [230, 432], [290, 366], [56, 420]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#fff" opacity=".85"/>`).join('')}
    `);
  }
  // わたあめの やたい
  function propWatame() {
    return stall('#f47c7c', '#f6a8c8', `
      <path d="M170 196v-22" ${ink(4, '#c79a6e')}/>
      ${puff([[156, 160, 14], [172, 150, 16], [186, 162, 13], [170, 170, 12]], '#f9c6d6', 3)}`, `
      <!-- わたあめを つくる きかい -->
      <path d="M48 300 60 244h120l12 56z" fill="#dfe8ee" ${ink(4)}/>
      <ellipse cx="120" cy="244" rx="62" ry="16" fill="#f6fafc" ${ink(4)}/>
      ${puff([[96, 232, 20], [122, 222, 26], [148, 234, 20], [120, 240, 18]], '#f9c6d6')}
      <!-- できた わたあめ -->
      <rect x="216" y="262" width="96" height="40" rx="8" fill="#9fd0f0" ${ink(4)}/>
      <path d="M240 262v-56M286 262v-46" ${ink(5, '#c79a6e')}/>
      ${puff([[226, 196, 18], [244, 184, 22], [260, 200, 18], [242, 206, 16]], '#f9c6d6')}
      ${puff([[274, 208, 16], [290, 196, 20], [304, 210, 15], [288, 216, 14]], '#cbe6fb')}`);
  }
  // りんごあめ（もとの点 = りんごの まんなか）
  const apple = (x, y, r = 22) => `<path d="M${x} ${y + r}v${r * 2.2}" ${ink(5, '#c79a6e')}/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="#e8505f" ${ink(4)}/><ellipse cx="${x - r * 0.32}" cy="${y - r * 0.36}" rx="${r * 0.27}" ry="${r * 0.36}" fill="#fff" opacity=".65"/>
    <path d="M${x} ${y - r}q2-10 10-12" fill="none" ${ink(3)}/>`;
  function propRingo() {
    return stall('#9fd0f0', '#cbe6fb', apple(170, 158, 20), `
      <rect x="40" y="262" width="260" height="40" rx="8" fill="#f6a8c8" ${ink(4)}/>
      ${[70, 120, 170, 220, 270].map((x, i) => apple(x, 200 - (i % 2) * 14)).join('')}`);
  }
  function itemRingo() {
    return svg('0 0 140 140', `${apple(70, 52, 38).replace('v83.6', 'v80')}`);
  }
  // ポテト（あかい カップの フライドポテト）
  function fries(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})">
      ${[[-26, -10, -8], [-12, -24, -3], [2, -30, 2], [16, -20, 6], [28, -8, 10], [-4, -14, 0]].map(([dx, dy, r]) => `<rect x="${dx - 6}" y="${dy - 40}" width="12" height="60" rx="3" transform="rotate(${r} ${dx} ${dy})" fill="#f6d66b" ${ink(3)}/>`).join('')}
      <path d="M-40-8h80l-10 56h-60z" fill="#f47c7c" ${ink(4)}/>
      <path transform="translate(0 20) scale(.6) translate(-16 -14.5)" d="${HEART}" fill="#fff"/></g>`;
  }
  function propPotato() {
    return stall('#f6b26b', '#fff1b8', fries(170, 172, 0.45), `
      <rect x="40" y="250" width="150" height="52" rx="8" fill="#c9d4dc" ${ink(4)}/>
      <rect x="52" y="240" width="126" height="16" rx="5" fill="#f6d66b" ${ink(3)}/>
      <path d="M190 262h30" ${ink(6)}/>
      ${fries(250, 262, 0.62)}${fries(296, 270, 0.5)}`);
  }
  function itemPotato() { return svg('0 0 140 140', fries(70, 80, 1.15)); }
  // たこやき（ふねに 6こ。ソース・あおのり・つまようじ）
  function takoyaki(x, y, s) {
    const balls = [[-28, 0], [0, -4], [28, 0], [-14, -22], [14, -24]];
    return `<g transform="translate(${x} ${y}) scale(${s})">
      ${balls.map(([dx, dy]) => `<circle cx="${dx}" cy="${dy}" r="17" fill="#e2a05a" ${ink(3)}/><path d="M${dx - 10} ${dy - 4}q10-8 20 0" fill="none" stroke="#7a4a2e" stroke-width="5" stroke-linecap="round"/><circle cx="${dx + 4}" cy="${dy - 9}" r="2" fill="#6fb07e"/>`).join('')}
      <path d="M-50 4h100l-12 22h-76z" fill="#f3c08f" ${ink(4)}/>
      <path d="M24-34 40-64" ${ink(3, '#c79a6e')}/></g>`;
  }
  function propTakoyaki() {
    const holes = [];
    for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) holes.push(`<circle cx="${68 + c * 34}" cy="${266 + r * 22}" r="13" fill="#e2a05a" ${ink(3)}/>`);
    return stall('#a9dfc0', '#f9c6d6', takoyaki(170, 170, 0.6), `
      <rect x="44" y="246" width="186" height="58" rx="8" fill="#4a3f46" ${ink(4)}/>
      ${holes.join('')}
      ${takoyaki(280, 268, 0.62)}`);
  }
  function itemTakoyaki() { return svg('0 0 140 140', takoyaki(70, 82, 1.2)); }
  // わたあめ（たべる とき。140×140）
  function itemWatame() {
    return svg('0 0 140 140', `
      <path d="M70 136V84" ${ink(7, '#c79a6e')}/>
      ${puff([[46, 60, 26], [72, 42, 32], [98, 60, 26], [70, 76, 24], [54, 82, 16], [88, 82, 16]], '#f9c6d6')}
      <path d="M58 44q10-10 24-6" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`);
  }
  // きんぎょ（右むき。もとの点 = からだの まんなか）
  function goldfish(fill) {
    return `<path d="M-18 0-38-14q6 14 0 28z" fill="${fill}" ${ink(3)}/>
      <ellipse rx="22" ry="13" fill="${fill}" ${ink(3)}/>
      <path d="M-4-12q8-10 16-4" fill="${fill}" ${ink(3)}/>
      <circle cx="10" cy="-3" r="3" fill="${INK}"/>`;
  }
  // きんぎょすくい（380×200）
  function propKingyo() {
    const fish = [[110, 96, '#f47c5c', 1], [220, 126, '#f6a04d', 2], [270, 86, '#f47c5c', 3]]
      .map(([x, y, c, n]) => `<g class="kf kf${n}"><g transform="translate(${x} ${y})">${goldfish(c)}</g></g>`).join('');
    return svg('0 0 380 200', `
      <ellipse cx="190" cy="112" rx="182" ry="84" fill="#7ec0ea" ${ink(5)}/>
      <ellipse cx="190" cy="106" rx="160" ry="64" fill="#c5e9fb" ${ink(3)}/>
      <path d="M70 92q20-8 40 0M230 150q20-8 40 0M160 70q16-6 32 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      ${fish}
      <g class="kp-poi"><g transform="translate(330 56) rotate(34)">
        <rect x="-6" y="30" width="12" height="62" rx="5" fill="#f6a8c8" ${ink(3)}/>
        <circle r="32" fill="#fffdf6" ${ink(4)}/><circle r="25" fill="none" stroke="#f6a8c8" stroke-width="5"/></g></g>
    `);
  }
  // きんぎょの ふくろ（もってかえる。110×140）
  function itemKingyoBag() {
    return svg('0 0 110 140', `
      <path d="M55 26c-10 0-10-10-6-16M55 26c10 0 10-10 6-16" fill="none" stroke="#f47c7c" stroke-width="4" stroke-linecap="round"/>
      <path d="M40 30h30l20 60c6 26-10 44-35 44S14 116 20 90z" fill="#e6f5fd" fill-opacity=".9" ${ink(4)}/>
      <path d="M24 78c14 6 48 6 62 0l4 14c6 26-10 40-35 40S16 118 20 92z" fill="#a9d8f4"/>
      <g transform="translate(56 104) scale(.8)">${goldfish('#f47c5c')}</g>
      <path d="M40 30h30" ${ink(4)}/>`);
  }
  // たいこ（260×230）
  function propTaiko() {
    const studs = Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2; return `<circle cx="${(130 + Math.cos(a) * 92).toFixed(1)}" cy="${(108 + Math.sin(a) * 92).toFixed(1)}" r="4" fill="#f6d66b"/>`; }).join('');
    return svg('0 0 260 230', `
      <path d="M58 224 96 150M202 224 164 150M74 196h112" ${ink(10, '#9a6b4f')}/>
      <path d="M58 224 96 150M202 224 164 150M74 196h112" stroke="#c79a6e" stroke-width="4" stroke-linecap="round"/>
      <circle cx="130" cy="108" r="100" fill="#d9605f" ${ink(5)}/>
      ${studs}
      <circle cx="130" cy="108" r="78" fill="#f6e3c0" ${ink(4)}/>
      <path d="M130 66a42 42 0 1 1-1 0" fill="none" stroke="#f4a3b8" stroke-width="6" opacity=".7"/>
      ${heartAt(130, 110, 1.3, '#f4a3b8')}
      <g class="tk-bachi"><path d="M196 34 248 2M206 50 254 26" ${ink(10)}/><path d="M196 34 248 2M206 50 254 26" stroke="#f3c08f" stroke-width="5" stroke-linecap="round"/></g>
    `);
  }
  // はなび（300×300。まんなか = 150,150）
  function firework(c1, c2) {
    const n = 16;
    const rays = Array.from({ length: n }, (_, i) => `<path transform="rotate(${i * 360 / n})" d="M0-34V-112" />`).join('');
    const dots = Array.from({ length: n }, (_, i) => { const a = (i + 0.5) / n * Math.PI * 2; return `<circle cx="${(Math.cos(a) * 126).toFixed(1)}" cy="${(Math.sin(a) * 126).toFixed(1)}" r="7"/>`; }).join('');
    const inner = Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; return `<circle cx="${(Math.cos(a) * 60).toFixed(1)}" cy="${(Math.sin(a) * 60).toFixed(1)}" r="6"/>`; }).join('');
    return svg('0 0 300 300', `<g transform="translate(150 150)">
      <circle r="30" fill="${c2}" opacity=".55"/>
      <g fill="none" stroke="${c1}" stroke-width="8" stroke-linecap="round">${rays}</g>
      <g fill="${c2}">${dots}</g><g fill="#fffbe6">${inner}</g></g>`);
  }

  /* --- ハロウィン --- */
  // かぼちゃ 3つ（380×220）。.lit で 目と口が ひかる
  function propPumpkins() {
    const g = id('pg');
    const glow = (x, y, r) => `<circle class="pk-glow" cx="${x}" cy="${y}" r="${r}" fill="url(#${g})"/>`;
    return svg('0 0 380 220', `
      <defs><radialGradient id="${g}"><stop offset="0" stop-color="#ffe27a" stop-opacity=".8"/><stop offset="1" stop-color="#ffe27a" stop-opacity="0"/></radialGradient></defs>
      ${glow(66, 156, 80)}${glow(190, 116, 120)}${glow(316, 160, 80)}
      ${pumpkin(66, 162, 0.62, 'pk pk1')}${pumpkin(316, 166, 0.58, 'pk pk3')}${pumpkin(190, 126, 0.98, 'pk pk2')}`);
  }
  // おばけ（220×240）
  function propGhost() {
    return svg('0 0 220 240', `<g class="gh-body">
      <path d="M32 124q-26 4-28 24 16 6 30-6M188 124q26 4 28 24-16 6-30-6" fill="#fff" ${ink(4)}/>
      <path d="M110 12C56 12 30 58 30 110v90q14-16 26 0 14 18 28 0 12-16 26 0 14 18 28 0 12-16 26 0 14 18 26 0v-90C190 58 164 12 110 12z" fill="#fff" ${ink(5)}/>
      <path d="M56 70q10-34 44-42" fill="none" stroke="#e6eef6" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="84" cy="100" rx="9" ry="12" fill="${INK}"/><ellipse cx="136" cy="100" rx="9" ry="12" fill="${INK}"/>
      <circle cx="87" cy="96" r="3" fill="#fff"/><circle cx="139" cy="96" r="3" fill="#fff"/>
      <ellipse cx="66" cy="122" rx="12" ry="7" fill="#f9b9cc"/><ellipse cx="154" cy="122" rx="12" ry="7" fill="#f9b9cc"/>
      <g class="gh-mouth"><ellipse cx="110" cy="128" rx="11" ry="9" fill="#e46a8a" ${ink(3)}/></g></g>`);
  }
  // つつんだ あめ（140×100）
  function candy(c1 = '#f6a04d', c2 = '#b796e6') {
    return svg('0 0 140 100', `
      <path d="M38 50 6 26v48zM102 50l32-24v48z" fill="${c2}" ${ink(4)}/>
      <ellipse cx="70" cy="50" rx="36" ry="28" fill="${c1}" ${ink(4)}/>
      <path d="M50 34q20 32 40 32M60 26q16 22 36 24" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`);
  }
  // おかしの なべ（つくえ。340×330）
  function propCandy() {
    const pops = [[110, 70, '#f47c9c'], [236, 64, '#9fd0f0'], [172, 40, '#f6d66b']]
      .map(([x, y, c]) => `<path d="M${x} ${y + 26}v60" ${ink(6, '#fff')}/><circle cx="${x}" cy="${y}" r="26" fill="${c}" ${ink(4)}/><path d="M${x} ${y}m-14 0a14 14 0 1 1 14 14" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`).join('');
    const wraps = [[122, 120, '#f6a04d', '#b796e6', -20], [178, 112, '#9fd68e', '#f6a8c8', 10], [226, 124, '#b796e6', '#f6d66b', 30]]
      .map(([x, y, a, b, r]) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(.55) translate(-70 -50)">${candy(a, b).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`).join('');
    return svg('0 0 340 330', `
      <path d="M20 200q150 40 300 0l-16 108q-134 30-268 0z" fill="#a07ad8" ${ink(4)}/>
      <path d="M36 300q16 18 34 0t34 0 34 0 34 0 34 0 34 0 34 0 34 0" fill="none" stroke="#f6a04d" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="170" cy="200" rx="152" ry="34" fill="#b796e6" ${ink(4)}/>
      ${pops}
      <path d="M86 130c0 50 36 76 84 76s84-26 84-76z" fill="#4a3f46" ${ink(4)}/>
      ${wraps}
      <ellipse cx="170" cy="130" rx="92" ry="20" fill="#5e5260" ${ink(4)}/>
      <path d="M100 168c10 14 30 22 50 24" fill="none" stroke="#7a6e7c" stroke-width="5" stroke-linecap="round"/>`);
  }
  // まじょの ほうき（160×360）
  function propBroom() {
    return svg('0 0 160 360', `<g transform="rotate(8 80 180)">
      <path d="M80 10V250" ${ink(14)}/><path d="M80 10V250" stroke="#c79a6e" stroke-width="7" stroke-linecap="round"/>
      <path d="M58 244h44l26 104H32z" fill="#f2cf72" ${ink(4)}/>
      <path d="M62 262 50 344M80 262v84M98 262l12 82" stroke="#d6aa36" stroke-width="4" stroke-linecap="round"/>
      <rect x="54" y="236" width="52" height="20" rx="6" fill="#a07ad8" ${ink(4)}/>
      <polygon points="${starPts(80, 120, 16, 7)}" fill="#f6d66b" ${ink(3)}/></g>`);
  }

  /* --- クリスマス --- */
  // ツリー（340×720）。.lit で でんきゅう・ほしが ひかる
  function propXtree() {
    const g = id('tg');
    const tier = (top, bot, hw, fill) => `<path d="M170 ${top}L${170 + hw} ${bot}Q170 ${bot + 30} ${170 - hw} ${bot}Z" fill="${fill}" ${ink(5)}/>`;
    const bulbs = [[130, 180, '#f47c7c'], [206, 200, '#93c9ef'], [100, 290, '#f6d66b'], [176, 300, '#f47c9c'], [246, 286, '#9fd68e'],
      [80, 420, '#93c9ef'], [150, 440, '#f6d66b'], [222, 430, '#f47c7c'], [282, 410, '#c9b3ee'], [60, 560, '#f47c9c'], [130, 590, '#9fd68e'],
      [204, 590, '#93c9ef'], [276, 566, '#f6d66b']];
    return svg('0 0 340 720', `
      <defs><radialGradient id="${g}"><stop offset="0" stop-color="#fff6c9" stop-opacity=".95"/><stop offset="1" stop-color="#fff6c9" stop-opacity="0"/></radialGradient></defs>
      <path d="M106 650h128l-12 64H118z" fill="#f47c7c" ${ink(5)}/><rect x="98" y="640" width="144" height="24" rx="6" fill="#f6d66b" ${ink(4)}/>
      <rect x="150" y="600" width="40" height="44" fill="#c79a6e" ${ink(4)}/>
      ${tier(300, 610, 166, '#6fbf7e')}${tier(210, 470, 136, '#7cc98a')}${tier(120, 340, 106, '#8fd49a')}${tier(50, 210, 72, '#9fdca6')}
      <path d="M110 200q60 30 120 0M70 330q100 40 200 0M40 460q130 40 260 0M20 600q150 36 300 0" fill="none" stroke="#f4a3b8" stroke-width="7" stroke-linecap="round"/>
      ${bulbs.map(([x, y, c], i) => `<circle class="xt-glow xg${i % 3}" cx="${x}" cy="${y}" r="34" fill="url(#${g})"/><circle class="xt-bulb xb${i % 3}" cx="${x}" cy="${y}" r="13" fill="${c}" ${ink(3)}/>`).join('')}
      <circle class="xt-sglow" cx="170" cy="44" r="80" fill="url(#${g})"/>
      <polygon class="xt-star" points="${starPts(170, 44, 42, 18)}" fill="#f6d66b" ${ink(4)}/>`);
  }
  // プレゼント（200×170）。.open で ふたが あく
  function propPresent() {
    return svg('0 0 200 170', `
      <rect x="120" y="92" width="72" height="72" rx="4" fill="#93c9ef" ${ink(4)}/>
      <path d="M156 92v72M120 128h72" stroke="#fff" stroke-width="9"/>
      <rect x="16" y="74" width="114" height="90" rx="4" fill="#f47c9c" ${ink(4)}/>
      <path d="M73 74v90" stroke="#f6d66b" stroke-width="18"/>
      <path d="M64 74v90M82 74v90" ${ink(2)} opacity=".35"/>
      <g class="pr-lid">
        <rect x="8" y="54" width="130" height="26" rx="5" fill="#f68fae" ${ink(4)}/>
        <rect x="64" y="54" width="18" height="26" fill="#f6d66b"/>
        <path d="M73 54C58 34 36 32 38 46s22 12 35 8zM73 54c15-20 37-22 35-8s-22 12-35 8z" fill="#f6d66b" ${ink(4)}/>
        <circle cx="73" cy="52" r="7" fill="#f6d66b" ${ink(3)}/></g>`);
  }
  // ケーキの つくえ（330×260）
  function propCake() {
    const ber = [[120, 72], [150, 62], [182, 62], [212, 72], [166, 82]]
      .map(([x, y]) => `<path d="M${x - 12} ${y}q12 26 24 0q0-14-12-14t-12 14z" fill="#f2577e" ${ink(3)}/><path d="M${x - 6} ${y - 12}l6 6 6-6" fill="none" stroke="#6fb07e" stroke-width="4" stroke-linecap="round"/>`).join('');
    return svg('0 0 330 260', `
      <path d="M16 150q149 40 298 0l-12 100q-137 22-274 0z" fill="#fff" ${ink(4)}/>
      <path d="M28 236q14 14 28 0t28 0 28 0 28 0 28 0 28 0 28 0 28 0 28 0" fill="none" stroke="#f47c7c" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="165" cy="150" rx="150" ry="34" fill="#fff8ef" ${ink(4)}/>
      <ellipse cx="165" cy="146" rx="96" ry="20" fill="#e8f4f8" ${ink(3)}/>
      <path d="M95 76v62c0 10 32 18 70 18s70-8 70-18V76z" fill="#fff8ef" ${ink(4)}/>
      <path d="M95 104c14 8 20-6 34 2s20-6 34 2 22-6 36 2 22-8 36 0" fill="none" stroke="#f9c6d6" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="165" cy="76" rx="70" ry="18" fill="#fff" ${ink(4)}/>
      ${ber}`);
  }
  // ケーキ ひときれ（140×140）
  function itemCakeSlice() {
    return svg('0 0 140 140', `
      <path d="M18 92 112 60v40L18 126z" fill="#fff8ef" ${ink(4)}/>
      <path d="M18 106 112 76" stroke="#f9c6d6" stroke-width="8"/>
      <path d="M18 92 112 60 78 46z" fill="#fff" ${ink(4)}/>
      <path d="M68 46q12 24 24 0q0-14-12-14t-12 14z" fill="#f2577e" ${ink(3)}/>`);
  }
  // ゆきの まど（280×320）
  function propSnowWin() {
    const flakes = [[70, 80], [140, 60], [210, 96], [96, 150], [186, 170], [60, 210], [222, 230], [130, 220]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff"/>`).join('');
    return svg('0 0 280 320', `
      <rect x="30" y="30" width="220" height="250" rx="10" fill="#3d4a86" ${ink(4)}/>
      ${flakes}
      <path d="M30 250q60-40 120-10t100-20v60H30z" fill="#fff" ${ink(3)}/>
      <rect x="30" y="30" width="220" height="250" rx="10" fill="none" stroke="#fff" stroke-width="16"/>
      <rect x="22" y="22" width="236" height="266" rx="14" fill="none" ${ink(4)}/>
      <path d="M140 30v250M30 150h220" stroke="#fff" stroke-width="10"/>
      <path d="M2 30c30 0 40 10 44 20-10 80-6 160 6 240-24 8-40 8-50 0z" fill="#f47c7c" ${ink(4)}/>
      <path d="M278 30c-30 0-40 10-44 20 10 80 6 160-6 240 24 8 40 8 50 0z" fill="#f47c7c" ${ink(4)}/>
      <rect x="10" y="282" width="260" height="22" rx="8" fill="#fff" ${ink(4)}/>
      ${puff([[60, 280, 14], [90, 276, 16], [200, 278, 14], [226, 282, 10]], '#fff', 3)}`);
  }
  // ゆきの けっしょう（ふらせる）
  function snowflake() {
    const arm = '<path d="M0 0V-40M0-26l-10-10M0-26l10-10"/>';
    return svg('-50 -50 100 100', `<g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round">${[0, 60, 120, 180, 240, 300].map(a => `<g transform="rotate(${a})">${arm}</g>`).join('')}</g>`);
  }

  /* --- ニューちゃんの いえ --- */
  // おやつの つくえ（330×260）。クッキーと ミルク
  function propSnack() {
    const cookies = [[130, 116, 'heart'], [166, 106, 'star'], [200, 118, 'round']].map(([x, y, s]) => s === 'heart'
      ? `<path transform="translate(${x} ${y}) scale(.9) translate(-16 -14.5)" d="${HEART}" fill="#e9b26a" ${ink(3)}/>`
      : s === 'star' ? `<polygon points="${starPts(x, y, 18, 8)}" fill="#f2c27a" ${ink(3)}/>` : `<circle cx="${x}" cy="${y}" r="15" fill="#e0a45c" ${ink(3)}/><circle cx="${x - 5}" cy="${y - 3}" r="2.5" fill="#8a5a3c"/><circle cx="${x + 5}" cy="${y + 4}" r="2.5" fill="#8a5a3c"/>`).join('');
    const cup = (x) => `<path d="M${x - 20} 74h40l-5 52h-30z" fill="#fff" ${ink(4)}/><path d="M${x - 18} 86h36" stroke="#f1f6fa" stroke-width="10"/>${heartAt(x, 104, 0.45, '#f6a8c8')}`;
    return svg('0 0 330 260', `
      <path d="M16 150q149 40 298 0l-12 100q-137 22-274 0z" fill="#c9b3ee" ${ink(4)}/>
      <path d="M28 236q14 14 28 0t28 0 28 0 28 0 28 0 28 0 28 0 28 0 28 0" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="165" cy="150" rx="150" ry="34" fill="#ddd0f6" ${ink(4)}/>
      <ellipse cx="165" cy="130" rx="72" ry="18" fill="#fff" ${ink(4)}/>
      ${cookies}${cup(70)}${cup(262)}`);
  }
  // クッキー（たべる とき。140×140）
  function itemCookie() {
    return svg('0 0 140 140', `<path transform="translate(70 70) scale(2.6) translate(-16 -14.5)" d="${HEART}" fill="#e9b26a" ${ink(1.6)}/>
      <circle cx="56" cy="62" r="5" fill="#8a5a3c"/><circle cx="82" cy="58" r="5" fill="#8a5a3c"/><circle cx="70" cy="82" r="5" fill="#8a5a3c"/>`);
  }
  // おもちゃばこ（250×220）。.open で ふたが あく
  function propToybox() {
    return svg('0 0 250 220', `
      <circle cx="80" cy="84" r="30" fill="#f6d66b" ${ink(4)}/><path d="M54 74q26 20 52 0" fill="none" stroke="#fff" stroke-width="6"/>
      <rect x="140" y="62" width="50" height="50" rx="6" fill="#9fd0f0" ${ink(4)}/>
      <rect x="18" y="96" width="214" height="118" rx="10" fill="#fff1b8" ${ink(4)}/>
      ${[[64, 150, '#f6a8c8'], [126, 168, '#9fd0f0'], [188, 146, '#c9b3ee']].map(([x, y, c]) => `<polygon points="${starPts(x, y, 20, 9)}" fill="${c}" ${ink(3)}/>`).join('')}
      <g class="tb-lid"><rect x="8" y="80" width="234" height="28" rx="8" fill="#f6a8c8" ${ink(4)}/><rect x="108" y="88" width="34" height="12" rx="6" fill="#fff" ${ink(3)}/></g>`);
  }
  // つみき（とびだす おもちゃ。100×100）
  function toyBlock() {
    return svg('0 0 100 100', `<rect x="14" y="14" width="72" height="72" rx="8" fill="#9fd68e" ${ink(4)}/>${heartAt(50, 52, 1, '#fff')}`);
  }
  function toyStar() {
    return svg('0 0 100 100', `<polygon points="${starPts(50, 52, 42, 19)}" fill="#f6d66b" ${ink(4)}/>`);
  }
  // ビーチボール（110×110）
  function propBall() {
    return svg('0 0 110 110', `
      <circle cx="55" cy="55" r="46" fill="#fff" ${ink(4)}/>
      <path d="M55 9C30 30 30 80 55 101 40 80 40 30 55 9z" fill="#f47c7c"/>
      <path d="M55 9c25 21 25 71 0 92 15-21 15-71 0-92z" fill="#9fd0f0"/>
      <path d="M9 55C30 40 80 40 101 55" fill="none" stroke="#f6d66b" stroke-width="8"/>
      <circle cx="55" cy="55" r="46" fill="none" ${ink(4)}/>
      <ellipse cx="38" cy="34" rx="10" ry="6" fill="#fff" opacity=".7" transform="rotate(-30 38 34)"/>`);
  }

  /* ---- うごく しかけの ある 道具の 絵（水彩の 画像を パーツごとに かさねる） ----
   * ふた・きんぎょ・かぼちゃの ひかり などを 別の 画像に して、上の SVG と 同じ 場所・同じ class で かさねる。
   * そのため css/style.css の「おでかけ」の 動きは そのまま はたらく。画像が 無いときは 上の SVG を 使う。 */
  const LAYER = {
    kingyo_pool: 'assets/outing/anim_kingyo_pool.webp',
    kingyo_fish_red: 'assets/outing/anim_kingyo_fish_red.webp',
    kingyo_fish_orange: 'assets/outing/anim_kingyo_fish_orange.webp',
    kingyo_poi: 'assets/outing/anim_kingyo_poi.webp',
    pumpkin: 'assets/outing/anim_pumpkin.webp',
    pumpkin_lit: 'assets/outing/anim_pumpkin_lit.webp',
    ghost_body: 'assets/outing/anim_ghost_body.webp',
    ghost_mouth: 'assets/outing/anim_ghost_mouth.webp',
    xtree: 'assets/outing/anim_xtree.webp',
    xt_bulb0: 'assets/outing/anim_xt_bulb0.webp',
    xt_bulb1: 'assets/outing/anim_xt_bulb1.webp',
    xt_bulb2: 'assets/outing/anim_xt_bulb2.webp',
    xt_bulb3: 'assets/outing/anim_xt_bulb3.webp',
    xt_bulb4: 'assets/outing/anim_xt_bulb4.webp',
    xt_bulb5: 'assets/outing/anim_xt_bulb5.webp',
    present_box: 'assets/outing/anim_present_box.webp',
    present_lid: 'assets/outing/anim_present_lid.webp',
    toybox_body: 'assets/outing/anim_toybox_body.webp',
    toybox_lid: 'assets/outing/anim_toybox_lid.webp'
  };
  const hasLayers = (...names) => !!G.ASSET_FILES && names.every(n => G.ASSET_FILES.indexOf(LAYER[n]) >= 0);
  const pic = (n, x, y, w, h, cls = '') =>
    `<image${cls ? ` class="${cls}"` : ''} href="${LAYER[n]}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none"/>`;
  // 画像が そろっていれば 画像の 絵、なければ もとの SVG
  const layered = (names, draw, fallback) => () => (hasLayers(...names) ? draw() : fallback());

  const propKingyoArt = layered(['kingyo_pool', 'kingyo_fish_red', 'kingyo_fish_orange', 'kingyo_poi'], () => {
    const fish = [[110, 96, 'kingyo_fish_red', 1], [220, 126, 'kingyo_fish_orange', 2], [270, 86, 'kingyo_fish_red', 3]]
      .map(([x, y, n, k]) => `<g class="kf kf${k}"><g transform="translate(${x} ${y})">${pic(n, -40, -18, 64, 34)}</g></g>`).join('');
    return svg('0 0 380 200', `${pic('kingyo_pool', 0, 0, 380, 200)}${fish}
      <g class="kp-poi"><g transform="translate(330 56) rotate(34)">${pic('kingyo_poi', -36, -36, 72, 132)}</g></g>`);
  }, propKingyo);

  const propPumpkinsArt = layered(['pumpkin', 'pumpkin_lit'], () => {
    const g = id('pg');
    const glow = (x, y, r) => `<circle class="pk-glow" cx="${x}" cy="${y}" r="${r}" fill="url(#${g})"/>`;
    const pk = (x, y, s, cls) => `<g class="${cls}" transform="translate(${x} ${y}) scale(${s})">
      ${pic('pumpkin', -96, -110, 192, 190)}${pic('pumpkin_lit', -96, -110, 192, 190, 'pk-lit')}</g>`;
    return svg('0 0 380 220', `
      <defs><radialGradient id="${g}"><stop offset="0" stop-color="#ffe27a" stop-opacity=".8"/><stop offset="1" stop-color="#ffe27a" stop-opacity="0"/></radialGradient></defs>
      ${glow(66, 156, 80)}${glow(190, 116, 120)}${glow(316, 160, 80)}
      ${pk(66, 162, 0.62, 'pk pk1')}${pk(316, 166, 0.58, 'pk pk3')}${pk(190, 126, 0.98, 'pk pk2')}`);
  }, propPumpkins);

  const propGhostArt = layered(['ghost_body', 'ghost_mouth'], () => svg('0 0 220 240',
    `<g class="gh-body">${pic('ghost_body', 0, 0, 220, 240)}<g class="gh-mouth">${pic('ghost_mouth', 97, 117, 26, 22)}</g></g>`), propGhost);

  const propXtreeArt = layered(['xtree', 'xt_bulb0', 'xt_bulb1', 'xt_bulb2', 'xt_bulb3', 'xt_bulb4', 'xt_bulb5'], () => {
    const g = id('tg');
    // オーナメントの 色 → 画像（xt_bulb0〜5）
    const bulbs = [[130, 180, 0], [206, 200, 1], [100, 290, 2], [176, 300, 3], [246, 286, 4], [80, 420, 1], [150, 440, 2], [222, 430, 0],
      [282, 410, 5], [60, 560, 3], [130, 590, 4], [204, 590, 1], [276, 566, 2]];
    return svg('0 0 340 720', `
      <defs><radialGradient id="${g}"><stop offset="0" stop-color="#fff6c9" stop-opacity=".95"/><stop offset="1" stop-color="#fff6c9" stop-opacity="0"/></radialGradient></defs>
      ${pic('xtree', 0, 0, 340, 720)}
      ${bulbs.map(([x, y, c], i) => `<circle class="xt-glow xg${i % 3}" cx="${x}" cy="${y}" r="34" fill="url(#${g})"/>${pic('xt_bulb' + c, x - 15, y - 15, 30, 30, `xt-bulb xb${i % 3}`)}`).join('')}
      <circle class="xt-sglow" cx="170" cy="44" r="80" fill="url(#${g})"/>`);
  }, propXtree);

  const propPresentArt = layered(['present_box', 'present_lid'], () => svg('0 0 200 170',
    `${pic('present_box', 0, 0, 200, 170)}<g class="pr-lid">${pic('present_lid', 6, 30, 134, 52)}</g>`), propPresent);

  const propToyboxArt = layered(['toybox_body', 'toybox_lid'], () => svg('0 0 250 220',
    `${pic('toybox_body', 0, 0, 250, 220)}<g class="tb-lid">${pic('toybox_lid', 6, 78, 238, 32)}</g>`), propToybox);

  Object.assign(G.Art.all, {
    icon_door: door, icon_check: check,
    icon_out_festival: iconFestival, icon_out_halloween: iconHalloween, icon_out_christmas: iconChristmas, icon_out_nyuhome: iconNyuHome,
    bg_festival: bgFestival, bg_halloween: bgHalloween, bg_christmas: bgChristmas, bg_nyuhome: bgNyuHome,
    prop_watame: propWatame, prop_ringo: propRingo, prop_potato: propPotato, prop_takoyaki: propTakoyaki,
    item_ringo: itemRingo, item_potato: itemPotato, item_takoyaki: itemTakoyaki, prop_kingyo: propKingyoArt, prop_taiko: propTaiko, item_watame: itemWatame, item_kingyo_bag: itemKingyoBag,
    prop_pumpkins: propPumpkinsArt, prop_ghost: propGhostArt, prop_candy: propCandy, prop_broom: propBroom, item_candy: () => candy(),
    prop_xtree: propXtreeArt, prop_present: propPresentArt, prop_cake: propCake, prop_snowwin: propSnowWin, item_cakeslice: itemCakeSlice,
    prop_snack: propSnack, prop_toybox: propToyboxArt, prop_ball: propBall, item_cookie: itemCookie, toy_block: toyBlock, toy_star: toyStar,
    snowflake
  });

  return { firework, candy, snowflake };
})();
