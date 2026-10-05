/*
 * アクセサリー（おしゃれ）：ぼうし・メガネ・くびかざり・はね・しっぽのリボン。
 * くびのリボン（えらんでいる リボン）と ふく（js/clothes.js）も、ここで いっしょに かさねる。
 * 絵はこのファイルの SVG。それぞれ G.CHARACTER.accessory.pivot の 目じるしの 座標で描いてある。
 * 一度 画像にしておき、G.Chara が ニャーちゃんの絵の まえ（はねは うしろ）に かさねる。
 * 絵ごとの つける場所は G.CHARACTER.accessory。
 */
window.G = window.G || {};

G.Accessory = (function () {
  const RS = 0.8;   // 画像にするときの大きさ（ニャーちゃんの絵の下ごしらえ 1000/1254 と だいたい同じ）
  const PAD = 16;   // ふちのゆらぎ・線の太さのぶん
  const FRONT = ['body', 'tail', 'bow', 'neck', 'face', 'head']; // まえに描く順（あとのものほど手前）。body = ふく、bow = くびのリボン
  const BACK = ['back'];

  const HEART = 'M16 28C6 20 1 14 1 8.5 1 4 4.5 1 8.5 1c3 0 5.5 1.7 7.5 4.5C18 2.7 20.5 1 23.5 1 27.5 1 31 4 31 8.5 31 14 26 20 16 28z';
  const SPARK = 'M50 0C54 38 62 46 100 50 62 54 54 62 50 100 46 62 38 54 0 50 38 46 46 38 50 0z';
  const EYE_L = [625, 535], EYE_R = [880, 455], TILT = -17; // face_normal の目（メガネの位置）

  const DEFS = `<defs>
    <filter id="wc" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="wcSoft" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="fluff" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="11" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G"/></filter>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdf0b8"/><stop offset=".5" stop-color="#ecc964"/><stop offset="1" stop-color="#c99a3e"/></linearGradient>
    <radialGradient id="goldR" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#fff4c4"/><stop offset=".45" stop-color="#efcd6a"/><stop offset="1" stop-color="#bf8f35"/></radialGradient>
    <radialGradient id="pearl" cx=".36" cy=".34" r=".72"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f3eef4"/><stop offset="1" stop-color="#cbbccd"/></radialGradient>
    <linearGradient id="navy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7f8fc2"/><stop offset="1" stop-color="#4c5b8f"/></linearGradient>
    <linearGradient id="purple" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ab8fdc"/><stop offset="1" stop-color="#6f529f"/></linearGradient>
    <linearGradient id="red" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ee7b78"/><stop offset="1" stop-color="#c94a55"/></linearGradient>
    <radialGradient id="wing" cx="1" cy="1" r="1.2"><stop offset="0" stop-color="#fff6fb"/><stop offset=".45" stop-color="#d8eefc"/><stop offset=".8" stop-color="#dccbf6"/><stop offset="1" stop-color="#f7cfe6"/></radialGradient>
    <radialGradient id="wing2" cx="1" cy="0" r="1.2"><stop offset="0" stop-color="#fff6fb"/><stop offset=".5" stop-color="#d5f1e4"/><stop offset="1" stop-color="#dccbf6"/></radialGradient>
    <linearGradient id="heartLens" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8fb4"/><stop offset="1" stop-color="#e2507f"/></linearGradient>
    <radialGradient id="rose" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffe0ea"/><stop offset=".6" stop-color="#f59ab6"/><stop offset="1" stop-color="#d9657f"/></radialGradient>
  </defs>`;

  /* ---------- 部品 ---------- */
  function starPath(R, r, n = 5) {
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r : R;
      d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ' ' + (Math.sin(a) * rr).toFixed(1);
    }
    return d + 'Z';
  }
  function quad(p0, c, p2, t) {
    const u = 1 - t;
    return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p2[1]];
  }
  /* 曲線にそって 等間隔に点を置く */
  function along(p0, c, p2, gap) {
    const pts = [], N = 400;
    let prev = quad(p0, c, p2, 0), acc = gap;
    for (let i = 0; i <= N; i++) {
      const p = quad(p0, c, p2, i / N);
      acc += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
      if (acc >= gap) { pts.push(p); acc = 0; }
      prev = p;
    }
    return pts;
  }
  function flower(x, y, r, petal, center, n, rot) {
    let s = '';
    for (let k = 0; k < n; k++) {
      s += `<ellipse cx="${x}" cy="${y - r * 0.55}" rx="${r * 0.42}" ry="${r * 0.6}" fill="${petal}" stroke="rgba(140,100,110,.35)" stroke-width="2.5" transform="rotate(${rot + k * 360 / n} ${x} ${y})"/>`;
    }
    return s + `<circle cx="${x}" cy="${y}" r="${r * 0.32}" fill="${center}" stroke="rgba(150,110,60,.4)" stroke-width="2"/>`;
  }
  /* リボンの色（えらんでいるリボン）の 小さなリボン。結び目が (0, 0) */
  function ribbonBow(rb, w) {
    const s = w / 120;
    return G.Art.bow(rb.swatch, rb.pattern).replace('<svg ', `<svg x="${-60 * s}" y="${-46 * s}" width="${120 * s}" height="${96 * s}" `);
  }
  function glassesArms(stroke, w) {
    return `<path d="M528 566 L468 556" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" fill="none"/>
      <path d="M966 428 L1012 404" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
  }
  const pearl = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#pearl)" stroke="#b6a7ba" stroke-width="2.5"/>`;

  /* ---------- 絵（rb = えらんでいるリボン） ---------- */
  const ART = {
    tiara: () => `<g transform="translate(706 312) rotate(-16) scale(.95)" filter="url(#wcSoft)">
      <path d="M-160 4 L-128 -40 L-98 -10 L-58 -74 L-22 -22 L0 -116 L22 -22 L58 -74 L98 -10 L128 -40 L160 4 Q0 -36 -160 4Z" fill="url(#gold)" stroke="#a87f2c" stroke-width="5" stroke-linejoin="round"/>
      <path d="M-40 -24 Q0 -70 40 -24" fill="none" stroke="#fff4c4" stroke-width="5" stroke-linecap="round" opacity=".8"/>
      <path d="M-170 2 Q0 -40 170 2 L174 28 Q0 -14 -174 28Z" fill="url(#gold)" stroke="#a87f2c" stroke-width="5" stroke-linejoin="round"/>
      <path d="M0 -80 L20 -52 L0 -24 L-20 -52Z" fill="#9ed6f2" stroke="#4f97c4" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-6 -66 L0 -74 L6 -66" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      ${[[0, -116, 11], [-58, -74, 10], [58, -74, 10], [-128, -40, 9], [128, -40, 9]].map(([x, y, r]) => pearl(x, y, r)).join('')}
      ${[[-120, 4], [-60, -4], [0, -7], [60, -4], [120, 4]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i === 2 ? 9 : 7}" fill="${i % 2 ? '#c9b3ee' : '#fff'}" stroke="#a88fcf" stroke-width="2.5"/>`).join('')}
    </g>`,

    flowers: () => {
      const P0 = [372, 372], C = [628, 214], P2 = [906, 258];
      const pts = along(P0, C, P2, 66);
      const kinds = [['#ffffff', '#f6cf55', 6], ['#f8e27a', '#e7a83a', 5], ['#d6c2f3', '#f6e08a', 5], ['#ffd6c9', '#f2b04f', 5]];
      let leaves = '', fl = '';
      pts.forEach((p, i) => {
        const t = i / (pts.length - 1);
        const q = quad(P0, C, P2, Math.min(1, t + 0.01)), q0 = quad(P0, C, P2, Math.max(0, t - 0.01));
        const ang = Math.atan2(q[1] - q0[1], q[0] - q0[0]) * 180 / Math.PI;
        leaves += `<ellipse cx="${p[0] + 26}" cy="${p[1] + 6}" rx="26" ry="11" fill="#9fcd8a" stroke="#6f9f5c" stroke-width="2.5" transform="rotate(${ang + 25} ${p[0]} ${p[1]})"/>`;
        const [pc, cc, n] = kinds[i % kinds.length];
        fl += flower(p[0], p[1], i % 2 ? 30 : 36, pc, cc, n, i * 17);
      });
      return `<g filter="url(#wcSoft)"><path d="M${P0} Q${C} ${P2}" fill="none" stroke="#8dbb78" stroke-width="10" stroke-linecap="round"/>${leaves}${fl}</g>`;
    },

    beret: (rb) => `<g transform="translate(598 196) rotate(-24)">
      <g filter="url(#wc)">
        <path d="M-262 30 C-270 -60 -150 -128 10 -128 C170 -128 280 -70 268 20 C258 92 150 120 0 120 C-150 120 -256 96 -262 30Z" fill="url(#navy)" stroke="#3d4a78" stroke-width="5"/>
        <path d="M-150 -86 C-90 -116 10 -122 70 -110" fill="none" stroke="#a9b6e0" stroke-width="10" stroke-linecap="round" opacity=".7"/>
        <path d="M-178 84 Q0 136 178 84 L172 116 Q0 168 -172 116Z" fill="#46548a" stroke="#34406b" stroke-width="5" stroke-linejoin="round"/>
        <path d="M8 -128 C4 -150 14 -164 30 -160 C40 -150 34 -136 26 -126Z" fill="#4c5b8f" stroke="#34406b" stroke-width="4"/>
      </g>
      <g transform="translate(150 98) rotate(10)">${ribbonBow(rb, 108)}</g>
    </g>`,

    witch: () => `<g transform="translate(606 300) rotate(-14)" filter="url(#wc)">
      <ellipse cx="0" cy="0" rx="330" ry="76" fill="url(#purple)" stroke="#55397f" stroke-width="5"/>
      <path d="M-200 -14 C-170 -150 -100 -300 -20 -380 C20 -420 90 -440 130 -404 C80 -396 46 -356 64 -300 C104 -196 160 -100 200 -14 Q0 26 -200 -14Z" fill="url(#purple)" stroke="#55397f" stroke-width="5" stroke-linejoin="round"/>
      <path d="M-196 -24 Q0 16 196 -24 L180 -84 Q0 -48 -182 -84Z" fill="#f4b45f" stroke="#c9822f" stroke-width="5" stroke-linejoin="round"/>
      <g transform="translate(-10 -50)"><path d="${starPath(30, 13)}" fill="#ffe27a" stroke="#d1a72c" stroke-width="4" stroke-linejoin="round"/></g>
      <g transform="translate(-70 -200) rotate(15)"><path d="${starPath(18, 8)}" fill="#ffe27a" opacity=".9"/></g>
      <g transform="translate(40 -290) rotate(-10)"><path d="${starPath(14, 6)}" fill="#ffe27a" opacity=".9"/></g>
      <path d="M-120 -120 C-90 -220 -50 -300 0 -350" fill="none" stroke="#c6b0ee" stroke-width="9" stroke-linecap="round" opacity=".6"/>
    </g>`,

    santa: () => `<g transform="translate(606 286) rotate(-16)">
      <path d="M-204 -8 C-176 -190 -40 -310 120 -306 C226 -302 306 -236 336 -150 C282 -196 200 -206 158 -168 C200 -112 212 -52 204 -8Z" fill="url(#red)" stroke="#a83a46" stroke-width="5" stroke-linejoin="round" filter="url(#wc)"/>
      <path d="M-120 -120 C-80 -210 0 -262 90 -270" fill="none" stroke="#f6a5a0" stroke-width="10" stroke-linecap="round" opacity=".6"/>
      <rect x="-236" y="-46" width="472" height="88" rx="44" fill="#fffdfa" stroke="#e3d6d0" stroke-width="5" filter="url(#fluff)"/>
      <circle cx="338" cy="-150" r="52" fill="#fffdfa" stroke="#e3d6d0" stroke-width="5" filter="url(#fluff)"/>
    </g>`,

    glasses: () => `<g>
      <circle cx="${EYE_L[0]}" cy="${EYE_L[1]}" r="96" fill="#ffffff" fill-opacity=".14" stroke="#c99a3e" stroke-width="11"/>
      <circle cx="${EYE_R[0]}" cy="${EYE_R[1]}" r="86" fill="#ffffff" fill-opacity=".14" stroke="#c99a3e" stroke-width="10"/>
      <path d="M718 508 Q752 474 797 484" fill="none" stroke="#c99a3e" stroke-width="10" stroke-linecap="round"/>
      ${glassesArms('#c99a3e', 9)}
      <path d="M570 490 A78 78 0 0 1 640 462" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".75"/>
      <path d="M832 410 A70 70 0 0 1 892 388" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".75"/>
    </g>`,

    heartglasses: () => `<g>
      <g transform="translate(${EYE_L[0]} ${EYE_L[1] + 4}) rotate(${TILT}) scale(6.6) translate(-16 -15)"><path d="${HEART}" fill="url(#heartLens)" fill-opacity=".5" stroke="#d9406f" stroke-width="1.5" stroke-linejoin="round"/></g>
      <g transform="translate(${EYE_R[0]} ${EYE_R[1] + 4}) rotate(${TILT}) scale(5.9) translate(-16 -15)"><path d="${HEART}" fill="url(#heartLens)" fill-opacity=".5" stroke="#d9406f" stroke-width="1.6" stroke-linejoin="round"/></g>
      <path d="M722 492 Q756 466 792 474" fill="none" stroke="#d9406f" stroke-width="10" stroke-linecap="round"/>
      ${glassesArms('#d9406f', 9)}
      <path d="M560 478 q20 -22 46 -20" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".8"/>
      <path d="M828 404 q18 -20 40 -18" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".8"/>
    </g>`,

    starglasses: () => `<g>
      <g transform="translate(${EYE_L[0]} ${EYE_L[1] + 6}) rotate(${TILT})"><path d="${starPath(116, 62)}" fill="#fff7c2" fill-opacity=".3" stroke="#f0b52e" stroke-width="12" stroke-linejoin="round"/></g>
      <g transform="translate(${EYE_R[0]} ${EYE_R[1] + 6}) rotate(${TILT})"><path d="${starPath(104, 56)}" fill="#fff7c2" fill-opacity=".3" stroke="#f0b52e" stroke-width="11" stroke-linejoin="round"/></g>
      <path d="M716 500 Q754 470 800 478" fill="none" stroke="#f0b52e" stroke-width="10" stroke-linecap="round"/>
      ${glassesArms('#f0b52e', 9)}
    </g>`,

    pearl: () => {
      const pts = along([646, 790], [738, 948], [846, 828], 27);
      const low = pts.reduce((a, p) => (p[1] > a[1] ? p : a), pts[0]);
      const [x, y] = low;
      return `<g>${pts.map(p => pearl(p[0], p[1], 14)).join('')}
        <path d="M${x} ${y + 12} C${x + 22} ${y + 40} ${x + 18} ${y + 66} ${x} ${y + 66} C${x - 18} ${y + 66} ${x - 22} ${y + 40} ${x} ${y + 12}Z" fill="url(#pearl)" stroke="#b6a7ba" stroke-width="3"/></g>`;
    },

    bell: () => `<g transform="translate(826 846) scale(1.15)">
      <ellipse cx="0" cy="-48" rx="13" ry="11" fill="none" stroke="#b8892f" stroke-width="7"/>
      <circle r="44" fill="url(#goldR)" stroke="#a87f2c" stroke-width="5"/>
      <path d="M-42 -6 Q0 8 42 -6" stroke="#a87f2c" stroke-width="5" fill="none"/>
      <circle cx="0" cy="17" r="8" fill="#7a5530"/><rect x="-3" y="18" width="6" height="24" fill="#7a5530"/>
      <ellipse cx="-16" cy="-20" rx="12" ry="7" fill="#fff" opacity=".7" transform="rotate(-30 -16 -20)"/>
    </g>`,

    locket: () => `<g>
      <path d="M690 780 Q730 838 764 846 Q800 838 826 788" fill="none" stroke="#c99a3e" stroke-width="5" stroke-dasharray="2 7" stroke-linecap="round"/>
      <g transform="translate(764 878) scale(2.5) translate(-16 -14)"><path d="${HEART}" fill="url(#rose)" stroke="#c99a3e" stroke-width="2.4" stroke-linejoin="round"/></g>
      <ellipse cx="748" cy="864" rx="9" ry="5" fill="#fff" opacity=".8" transform="rotate(-30 748 864)"/>
    </g>`,

    wings: () => `<g filter="url(#wcSoft)">
      <path d="M560 762 C540 560 470 262 360 172 C288 116 214 168 236 262 C268 402 420 640 560 782Z" fill="url(#wing2)" fill-opacity=".92" stroke="#a58fd6" stroke-width="6"/>
      <path d="M560 772 C500 560 330 330 160 300 C40 280 -2 400 58 500 C140 622 380 742 560 806Z" fill="url(#wing)" fill-opacity=".95" stroke="#a58fd6" stroke-width="6"/>
      <path d="M560 832 C440 852 220 882 120 952 C40 1012 80 1082 170 1062 C300 1032 460 942 560 862Z" fill="url(#wing)" fill-opacity=".9" stroke="#a58fd6" stroke-width="6"/>
      <path d="M550 790 C420 640 260 440 120 380 M552 770 C500 560 420 330 300 220 M550 846 C400 880 250 940 140 1010" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/>
      ${[[150, 420], [250, 520], [300, 260], [380, 420], [90, 470], [180, 1000]].map(([x, y], i) => `<path d="${SPARK}" fill="#fffbe0" stroke="#e8cf7a" stroke-width="6" transform="translate(${x} ${y}) scale(${i % 2 ? .16 : .24}) translate(-50 -50)"/>`).join('')}
    </g>`,

    tailbow: (rb) => `<g transform="translate(300 952) rotate(-36)">${ribbonBow(rb, 210)}</g>`,

    // くびのリボン（おしゃれの リボン）。結び目が (0, 0)
    neckbow: (rb) => `<g>${ribbonBow(rb, 200)}</g>`
  };
  // リボンの色で 絵が かわるもの
  const BY_RIBBON = { beret: true, tailbow: true, neckbow: true };

  // リボン「なし」のときの ベレーぼう・しっぽのリボンは ピンク（要件定義書 F-68）
  const ribbonOf = (id) => G.RIBBONS.find(r => r.id === id && r.id !== 'none') || G.RIBBONS.find(r => r.id === 'pink');
  const isCloth = (id) => !ART[id] && G.ClothesArt.has(id);
  const known = (id) => !!ART[id] || isCloth(id);
  /* 絵の SVG。opts = { noL: 左の そでを 描かない, color: ふくの 色（なければ えらんでいる色） } */
  function markup(id, ribbonId, opts) {
    if (isCloth(id)) {
      const o = opts || {};
      const c = G.CLOTHES.find(x => x.id === id);
      return G.ClothesArt.markup(id, o.color || G.State.clothColor(id) || (c && c.colors ? c.colors[0] : null), o);
    }
    return ART[id](ribbonOf(ribbonId));
  }
  function svgDoc(inner, box, scale) {
    const [x, y, w, h] = box;
    const size = scale ? ` width="${Math.round(w * scale)}" height="${Math.round(h * scale)}"` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}"${size}>${DEFS}${inner}</svg>`;
  }
  const dataUrl = (svg) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

  /* 絵の はんい（face_normal の座標）。はじめて使うときに 1回だけ はかる */
  let boxes = null;
  function box(id) {
    if (!boxes) {
      boxes = {};
      const NS = 'http://www.w3.org/2000/svg';
      const s = document.createElementNS(NS, 'svg');
      s.setAttribute('style', 'position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden');
      document.body.appendChild(s);
      Object.keys(ART).concat(G.ClothesArt.ids()).forEach(k => {
        const g = document.createElementNS(NS, 'g');
        g.innerHTML = markup(k, 'pink');
        s.appendChild(g);
        const b = g.getBBox();
        boxes[k] = [Math.floor(b.x - PAD), Math.floor(b.y - PAD), Math.ceil(b.width + PAD * 2), Math.ceil(b.height + PAD * 2)];
      });
      s.remove();
    }
    return boxes[id];
  }

  /* 画像にした絵。読みこみは あとから終わる */
  const imgs = new Map();
  function raster(id, ribbonId, opts) {
    const o = opts || {};
    let key = BY_RIBBON[id] ? id + '|' + ribbonId : id;
    if (isCloth(id)) key += '|' + G.State.clothColor(id) + '|' + (o.noL ? 1 : 0);
    let r = imgs.get(key);
    if (r) return r;
    r = { img: new Image(), ok: false };
    r.p = new Promise((res) => {
      r.img.onload = () => {
        const done = () => { r.ok = true; res(true); };
        if (r.img.decode) r.img.decode().then(done, done); else done();
      };
      r.img.onerror = () => res(false);
    });
    r.img.src = dataUrl(svgDoc(markup(id, ribbonId, o), box(id), RS));
    imgs.set(key, r);
    return r;
  }

  /* その絵で つけられる場所（G.CHARACTER.accessory）。書いていない絵・場所は つけない */
  function anchors(k) {
    const T = G.CHARACTER.accessory;
    let a = T.poses[k], n = 0;
    while (typeof a === 'string' && n++ < 5) a = T.poses[a];
    return a && typeof a === 'object' ? a : null;
  }

  /*
   * いま つけるもの。k = 下ごしらえした絵の名前、geo = その絵の変換（G.CharaArt.geo）
   * かえすもの：{ id, slot, back, m: [a, b, c, d, e, f]（face_normal の座標 → canvas の座標）, r: 画像 }
   */
  function layout(k, geo, wear, ribbonId, hide) {
    const A = anchors(k);
    if (!A || !geo) return [];
    const P = G.CHARACTER.accessory.pivot;
    const out = [];
    FRONT.concat(BACK).forEach(slot => {
      const id = slot === 'bow' ? (ribbonId && ribbonId !== 'none' ? 'neckbow' : null) : wear[slot];
      if (!id || !known(id) || !A[slot] || !P[slot] || (hide && hide.indexOf(slot) >= 0)) return;
      const [tx, ty, rot, sc, opts] = A[slot], [px, py] = P[slot];
      const th = rot * Math.PI / 180, k2 = sc * geo.s;
      const a = Math.cos(th) * k2, b = Math.sin(th) * k2;
      // canvas = (T + R·sc·(p − P))·s − (x0, y0)
      const e = tx * geo.s - geo.x0 - (a * px - b * py), f = ty * geo.s - geo.y0 - (b * px + a * py);
      out.push({ id, slot, back: BACK.indexOf(slot) >= 0, m: [a, b, -b, a, e, f], r: raster(id, ribbonId, opts) });
    });
    // まえのものは FRONT の順に
    return out.sort((x, y) => (FRONT.indexOf(x.slot) - FRONT.indexOf(y.slot)));
  }
  /* 絵の はんい（canvas の座標）。layout の1つずつ */
  function bounds(it) {
    const [x, y, w, h] = box(it.id), [a, b, c, d, e, f] = it.m;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].forEach(([u, v]) => {
      const X = a * u + c * v + e, Y = b * u + d * v + f;
      x0 = Math.min(x0, X); y0 = Math.min(y0, Y); x1 = Math.max(x1, X); y1 = Math.max(y1, Y);
    });
    return [x0, y0, x1, y1];
  }
  /* ctx に描く（ctx はすでに canvas の座標に そろえてある） */
  function draw(ctx, it) {
    if (!it.r.ok) return false;
    const [x, y, w, h] = box(it.id);
    ctx.save();
    ctx.transform.apply(ctx, it.m);
    ctx.drawImage(it.r.img, x, y, w, h);
    ctx.restore();
    return true;
  }

  /* ボタン・おしらせ用の見本（<img>） */
  function swatch(id, ribbonId, cls = '', opts) {
    const el = document.createElement('img');
    el.className = 'art acc-art ' + cls;
    el.draggable = false;
    el.alt = '';
    el.src = dataUrl(svgDoc(markup(id, ribbonId || G.State.ribbon(), opts), box(id)));
    return el;
  }

  /* つけている絵を 先に画像にしておく */
  function warm(wear, ribbonId) {
    Object.values(wear).forEach(id => { if (id && known(id)) raster(id, ribbonId); });
  }

  return { layout, bounds, draw, swatch, warm };
})();
