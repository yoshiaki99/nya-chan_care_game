/*
 * 着せ替え（ふく）の絵（要件定義書 5.6.1）。
 * ニャーちゃんの基準画（nya_base.png、1254px）と同じ座標で描いてある。G.Accessory が 体の上に かさねる。
 * 線は ニャーちゃんと同じ 黒くて太い線、ぬりは パステルの べたぬり。
 * opts.noL = 左うで（画面の左がわ）の そでを 描かない（手を あげている絵のとき）
 */
window.G = window.G || {};

G.ClothesArt = (function () {
  const INK = '#1d1a1c', W = 11;
  // 線の 属性。w = 太さ（同じ 属性を 2つ 書くと SVG の 画像が こわれるので、太さは ここで かえる）
  const line = (w = W) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

  // 体の目じるし（基準画のピクセル）
  // くび y600、からだの よこ x426〜812（〜y800）、わきの下 (462,906) (776,906)、こし y1040、また y1100、あし 〜y1200
  const NECK_L = [430, 600], NECK_R = [802, 600];

  /* そで（左）。right=true で 左右を はんてん */
  function sleeve(fill, long, right) {
    const pts = long
      ? [[428, 800], [400, 816], [366, 840], [340, 866], [330, 902], [334, 930], [396, 952], [444, 930], [464, 906]]
      : [[428, 800], [400, 816], [368, 840], [348, 862], [434, 932], [464, 906]];
    const p = pts.map(([x, y]) => right ? [1230 - x, y] : [x, y]);
    return `<path d="M${p.map(q => q.join(' ')).join(' L')}Z" fill="${fill}" ${line()}/>`;
  }
  /* からだ（どう）の 形。hem = すその 高さ、flare = すその ひろがり */
  function torso(fill, hem, flare = 0, neck = 'round') {
    const nl = neck === 'v'
      ? `M${NECK_L} L548 600 L615 700 L682 600 L${NECK_R}`
      : `M${NECK_L} L540 600 Q615 664 690 600 L${NECK_R}`;
    return `<path d="${nl} L812 800 L778 906 L${792 + flare} ${hem} Q615 ${hem + 18} ${438 - flare} ${hem} L462 906 L424 800 Z" fill="${fill}" ${line()}/>`;
  }
  const sleeves = (fill, opts, long) => (opts.noL ? '' : sleeve(fill, long, false)) + sleeve(fill, long, true);
  const button = (x, y, c = '#fff8e8') => `<circle cx="${x}" cy="${y}" r="13" fill="${c}" ${line(7)}/>`;
  const star = (x, y, r, c) => {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
      d += (i ? 'L' : 'M') + (x + Math.cos(a) * rr).toFixed(1) + ' ' + (y + Math.sin(a) * rr).toFixed(1);
    }
    return `<path d="${d}Z" fill="${c}"/>`;
  };
  /* ズボン（左右の あし）。to = すその 高さ */
  function pants(fill, to) {
    return `<path d="M450 960 L788 960 L792 ${to} L676 ${to} L668 1102 Q615 1108 566 1102 L560 ${to} L448 ${to} Z" fill="${fill}" ${line()}/>`;
  }
  /* スカート。from = こしの 高さ、to = すそ、w = すその はば（かた がわ） */
  function skirt(fill, from, to, w, wave) {
    const l = 615 - w, r = 615 + w;
    let hem = '';
    if (wave) {
      const n = 9;
      for (let i = n; i >= 0; i--) {
        const x = l + (r - l) * i / n, xm = l + (r - l) * (i + 0.5) / n;
        hem += i === n ? `L${r} ${to}` : ` Q${xm} ${to + 26} ${x} ${to}`;
      }
    } else hem = `L${r} ${to} Q615 ${to + 30} ${l} ${to}`;
    return `<path d="M456 ${from} L774 ${from} ${hem} Z" fill="${fill}" ${line()}/>`;
  }

  const ART = {
    tshirt: (c, o) => `${torso(c, 1040)}${sleeves(c, o)}
      <path d="M560 760 q55 30 110 0" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="12" stroke-linecap="round"/>
      ${star(615, 820, 34, '#fff8e8')}`,

    onepiece: (c, o) => `${skirt(c, 980, 1160, 230)}${torso(c, 1000)}${sleeves(c, o)}
      <path d="M470 990 Q615 1010 760 990" fill="none" ${line(9)}/>
      ${[[540, 1060], [690, 1060], [615, 1110], [470, 1120], [760, 1120]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="#fff" fill-opacity=".8"/>`).join('')}
      ${button(615, 760)}${button(615, 860)}`,

    overall: (c, o) => `${pants('#7fa6d6', 1150)}
      <path d="M486 760 L744 760 L760 980 L470 980 Z" fill="#7fa6d6" ${line()}/>
      <path d="M486 770 L452 640 M744 770 L778 640" ${line(26)} fill="none"/>
      <path d="M486 770 L452 640 M744 770 L778 640" stroke="#7fa6d6" stroke-width="12" stroke-linecap="round" fill="none"/>
      ${button(498, 784, '#f6d860')}${button(732, 784, '#f6d860')}
      <rect x="560" y="830" width="110" height="80" rx="10" fill="#9bbbe3" ${line(8)}/>
      <path d="M615 1000 L615 1080" ${line(7)} fill="none"/>`,

    pajama: (c, o) => `${pants('#bcd9f5', 1180)}${torso('#bcd9f5', 1030)}${sleeves('#bcd9f5', o, true)}
      ${[[520, 720], [700, 700], [580, 880], [740, 860], [500, 1000], [690, 1010], [520, 1130], [720, 1140], [616, 960]].map(([x, y], i) => i % 3 === 2
        ? `<path d="M${x} ${y - 20} a22 22 0 1 0 22 30 a17 17 0 1 1 -22 -30z" fill="#f6d860"/>`
        : star(x, y, 18, '#f6d860')).join('')}
      ${button(615, 700, '#fff')}${button(615, 790, '#fff')}${button(615, 880, '#fff')}`,

    raincoat: (c, o) => `${torso('#f7d64e', 1120, 30, 'v')}${sleeves('#f7d64e', o, true)}
      <path d="M548 600 L590 680 L520 690 Z M682 600 L640 680 L710 690 Z" fill="#f0c22c" ${line(8)}/>
      <path d="M615 700 L615 1130" ${line(8)} fill="none"/>
      ${button(650, 760, '#fff')}${button(650, 860, '#fff')}${button(650, 960, '#fff')}
      <path d="M690 990 L770 990 L770 1060 L690 1060 Z" fill="#f0c22c" ${line(8)}/>`,

    sailor: (c, o) => `${skirt('#5a6fb0', 990, 1140, 210)}
      <path d="M470 1000 L470 1140 M530 1000 L520 1150 M590 1000 L590 1160 M640 1000 L640 1160 M700 1000 L710 1150 M760 1000 L760 1140" stroke="#3d4f8a" stroke-width="6" fill="none"/>
      ${torso('#ffffff', 1010, 0, 'v')}${sleeves('#ffffff', o)}
      <path d="M${NECK_L} L548 600 L615 700 L682 600 L${NECK_R} L812 760 L700 780 L615 720 L530 780 L424 760 Z" fill="#5a6fb0" ${line(9)}/>
      <path d="M440 740 L528 760 M790 740 L702 760" stroke="#fff" stroke-width="7" fill="none"/>
      <path d="M615 712 L570 800 L615 780 L660 800 Z" fill="#e8636e" ${line(8)}/>`,

    yukata: (c, o) => `<path d="M${NECK_L} L548 600 L700 760 L${NECK_R} L812 800 L778 906 L800 1170 Q615 1186 430 1170 L462 906 L424 800 Z" fill="#cfe3f7" ${line()}/>
      <path d="M548 600 L460 1170" ${line(8)} fill="none"/>
      <path d="M682 600 L560 720" ${line(8)} fill="none"/>
      ${o.noL ? '' : `<path d="M428 800 L340 850 L330 1000 L420 1010 L462 930 Z" fill="#cfe3f7" ${line()}/>`}
      <path d="M802 800 L890 850 L900 1000 L810 1010 L768 930 Z" fill="#cfe3f7" ${line()}/>
      <path d="M452 950 L778 950 L782 1010 L448 1010 Z" fill="#f08aa4" ${line(9)}/>
      ${[[520, 680], [690, 860], [540, 1080], [720, 1100], [620, 1140], [870, 940], [370, 950]].map(([x, y]) => (o.noL && x < 400) ? '' : `<g fill="#f6a5bd">${[0, 72, 144, 216, 288].map(a => `<circle cx="${x + Math.cos(a * Math.PI / 180) * 14}" cy="${y + Math.sin(a * Math.PI / 180) * 14}" r="11"/>`).join('')}<circle cx="${x}" cy="${y}" r="7" fill="#f6d860"/></g>`).join('')}`,

    tutu: (c, o) => `<path d="M${NECK_L} L540 600 Q615 664 690 600 L${NECK_R} L812 800 L778 906 L786 1060 L444 1060 L462 906 L424 800 Z" fill="#f7b6cd" ${line()}/>
      <ellipse cx="615" cy="1060" rx="290" ry="58" fill="#fde3ec" ${line()}/>
      <path d="M335 1060 q35 40 70 4 q35 40 70 4 q35 40 70 4 q35 40 70 4 q35 40 70 4 q35 40 70 4 q35 40 70 4 q35 40 70 4" fill="none" ${line(8)}/>
      <path d="M380 1050 Q615 1010 850 1050" fill="none" stroke="#f7b6cd" stroke-width="16" stroke-linecap="round"/>
      ${star(615, 680, 26, '#fff')}`,

    gown: (c, o) => `${skirt(c, 970, 1170, 260, true)}
      <path d="M440 1040 Q615 1080 790 1040 M400 1110 Q615 1150 830 1110" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="10"/>
      ${torso(c, 990)}${o.noL ? '' : `<path d="M428 800 C380 790 340 830 352 870 C370 900 430 900 462 880 Z" fill="${c}" ${line()}/>`}
      <path d="M802 800 C850 790 890 830 878 870 C860 900 800 900 768 880 Z" fill="${c}" ${line()}/>
      <path d="M462 980 Q615 1000 768 980" fill="none" ${line(9)}/>
      ${star(615, 980, 30, '#f6d860')}
      <circle cx="615" cy="690" r="18" fill="#fff" ${line(6)}/>`,

    cape: (c, o) => `<path d="M${NECK_L} L520 600 L560 700 L520 1150 L380 1150 L360 860 Z" fill="#6b4a9e" ${line()}/>
      <path d="M${NECK_R} L710 600 L670 700 L710 1150 L850 1150 L870 860 Z" fill="#6b4a9e" ${line()}/>
      <path d="M520 600 L560 700 L540 1000 L500 820 Z M710 600 L670 700 L690 1000 L730 820 Z" fill="#f4a24a"/>
      <path d="M430 600 L520 560 L615 620 L710 560 L802 600 L760 650 L615 640 L470 650 Z" fill="#6b4a9e" ${line(9)}/>
      ${star(450, 1000, 22, '#f6d860')}${star(780, 950, 18, '#f6d860')}${star(800, 1080, 14, '#f6d860')}`,

    santasuit: (c, o) => `${torso('#e5484d', 1060)}${sleeves('#e5484d', o)}
      <path d="M436 1030 Q615 1060 794 1030 L796 1078 Q615 1110 434 1078 Z" fill="#fffaf2" ${line(9)}/>
      <path d="M455 960 L776 960 L780 1000 L452 1000 Z" fill="#2c2628" ${line(7)}/>
      <rect x="585" y="952" width="60" height="56" rx="8" fill="#f6d860" ${line(7)}/>
      <path d="M540 600 Q615 664 690 600 L690 640 Q615 700 540 640 Z" fill="#fffaf2" ${line(8)}/>
      ${button(615, 760, '#fffaf2')}${button(615, 860, '#fffaf2')}`
  };

  /* id の服を c（色）で描く */
  function markup(id, color, opts) {
    const f = ART[id];
    return f ? `<g>${f(color, opts || {})}</g>` : '';
  }
  return { markup, has: (id) => !!ART[id], ids: () => Object.keys(ART) };
})();
