/* あそぶ：かくれんぼ
 * カーテンが しまっている あいだに、ニャーちゃんが どこかに かくれる。さわって さがす。3かい みつけたら おしまい。
 * ときどき みみが ぴょこっと でる。なかなか みつからないと、ずっと みみが でたままに なる（救済） */
window.G = window.G || {};
G.Screens = G.Screens || {};

G.Screens.hide = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, L = G.CHARACTER.lines;
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const ROUNDS = 3;
    UI.backButton(scr, () => G.go('playmenu'));
    const meter = G.oneMeter(scr, 'fun');
    const setProg = G.progressRow(scr, ROUNDS, () => G.Art.all.icon_hide());

    // かくれる場所。cx・bottom = 下の まんなか、w・h = 絵の大きさ、mh = かくれる ニャーちゃんの 高さ、
    // inset = 絵の下の はしから ニャーちゃんの 足もとまで、peek = みみを だすときの ずらし、
    // rest = かくれている あいだも リボンや みみの さきが ちょこっと 見える ずらし（まったく 見えないと「きえた」と おもってしまう）
    const SPOTS = [
      { art: 'hide_screen', cx: 330,  bottom: 700, w: 300, h: 317, mh: 210, inset: 16, peek: [104, -12], rest: [88, -10], back: true },
      { art: 'hide_sofa',   cx: 1010, bottom: 700, w: 380, h: 256, mh: 190, inset: 34, peek: [0, -62], rest: [0, -52], back: true },
      { art: 'hide_gift',   cx: 230,  bottom: 985, w: 330, h: 291, mh: 196, inset: 16, peek: [0, -62], rest: [14, -56] },
      { art: 'hide_basket', cx: 683,  bottom: 985, w: 350, h: 272, mh: 175, inset: 16, peek: [0, -60], rest: [0, -50] },
      { art: 'hide_trunk',  cx: 1140, bottom: 985, w: 320, h: 282, mh: 200, inset: 14, peek: [0, -62], rest: [0, -56] }
    ];
    const at = (x, y) => `translate(${x}px,${y}px)`;
    SPOTS.forEach((s, i) => {
      s.el = UI.el('div', 'hide-spot' + (s.back ? ' back' : ''));
      s.el.dataset.i = i;
      UI.pos(s.el, s.cx - s.w / 2, s.bottom - s.h, s.w, s.h);
      s.el.appendChild(G.Assets.node(s.art, 'hs-art'));
      scr.appendChild(s.el);
    });

    let chara = new G.Chara(scr, { x: 683, y: 700, h: 300 });
    chara.el.classList.add('hide-out');
    chara.setMood('face_happy');
    chara.setPose('face_happy', 0);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.bubbleSpot(0.12, 380); bubble.place(p.x, p.y, p.side); };
    G.petting(chara, sc, { enabled: () => phase === 'show' });

    // カーテン（かくれている あいだ）
    const curtain = UI.el('div', 'hide-curtain', '<div class="hc-l"></div><div class="hc-r"></div><div class="hc-text"></div>');
    scr.appendChild(curtain);
    const ctext = curtain.querySelector('.hc-text');

    let phase = 'show', round = 0, spot = null, last = -1, misses = 0, strong = false, peeking = false;
    let hintTimer = null, wiggleTimer = null, searchFrom = 0;

    function stopHints() {
      clearInterval(hintTimer); clearInterval(wiggleTimer); hintTimer = wiggleTimer = null;
    }
    /* みみを ちょっとだけ だす（keep = だしたまま） */
    function peek(keep) {
      if (!spot || phase !== 'search' || (peeking && !keep)) return;
      peeking = true;
      // ふだんは rest（ちょこっと 見えている ところ）から さらに ぴょこっと。ずっと だすときは 目まで のぞかせる
      const dx = keep ? spot.peek[0] * 1.3 : spot.rest[0] + spot.peek[0] * 0.5;
      const dy = keep ? spot.peek[1] * 1.7 : spot.rest[1] + spot.peek[1] * 0.5;
      G.Sound.play('peek');
      const rest = at(spot.rest[0], spot.rest[1]);
      const frames = keep
        ? [{ transform: rest }, { transform: at(dx, dy) }]
        : [{ transform: rest }, { transform: at(dx, dy), offset: 0.25 }, { transform: at(dx, dy), offset: 0.75 }, { transform: rest }];
      const a = chara.el.animate(frames, { duration: keep ? 400 : 1300, easing: 'ease-in-out', fill: keep ? 'forwards' : 'none' });
      a.onfinish = () => { if (!keep) peeking = false; };
    }
    function goStrong() {
      if (strong || phase !== 'search') return;
      strong = true;
      peek(true);
      wiggleTimer = sc.interval(() => {
        if (phase !== 'search') return;
        spot.el.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-2deg)' }, { transform: 'rotate(2deg)' }, { transform: 'rotate(0)' }], { duration: 500 });
        if (Math.random() < 0.5) G.Sound.play('meow');
      }, 2600);
    }

    async function hideRound() {
      phase = 'hiding';
      bubble.hide();
      // カーテンを しめる
      ctext.textContent = L.hideAsk;
      curtain.classList.add('closed');
      G.Sound.play('curtain');
      await sc.wait(650);
      G.Voice.speak(L.hideAsk, 'guide');
      // そのあいだに かくれる
      let i;
      do { i = Math.floor(Math.random() * SPOTS.length); } while (i === last);
      last = i; spot = SPOTS[i];
      chara.destroy();
      chara = new G.Chara(scr, { x: spot.cx, y: spot.bottom - spot.inset, h: spot.mh });
      chara.setMood('face_happy');
      chara.setPose('face_happy', 0);
      chara.face(spot.peek[0] < 0 ? -1 : 1);
      chara.el.style.transform = at(spot.rest[0], spot.rest[1]);
      G.petting(chara, sc, { enabled: () => phase === 'show' });
      await sc.wait(1700);
      ctext.textContent = L.hideReady;
      G.Voice.speak(L.hideReady, 'chara');
      G.Sound.play('meow');
      await sc.wait(900);
      curtain.classList.remove('closed');
      G.Sound.play('curtain');
      await sc.wait(500);
      // さがす
      phase = 'search'; misses = 0; strong = false; peeking = false; searchFrom = Date.now();
      sc.timeout(() => peek(false), 1200);
      hintTimer = sc.interval(() => {
        if (phase !== 'search') return;
        if (Date.now() - searchFrom > 9000) goStrong();
        else peek(false);
      }, 3600);
    }

    async function found() {
      phase = 'found';
      stopHints();
      const from = getComputedStyle(chara.el).transform; // いま 見えている いち から もとの いちへ
      chara.el.getAnimations().forEach(a => a.cancel());
      chara.el.style.transform = '';
      if (from && from !== 'none') chara.el.animate([{ transform: from }, { transform: 'translate(0,0)' }], { duration: 300, easing: 'ease-out' });
      chara.el.classList.add('hide-out'); // カーテンより まえ・かくれる場所より まえに でる
      G.Sound.play('found');
      chara.setPose('face_happy');
      await sc.guard(chara.hop(Math.round(spot.mh * 0.75), 650));
      round++;
      setProg(round);
      const r = chara.rect();
      UI.sparkles(r.cx, r.y + r.h * 0.3, 10, 150);
      UI.hearts(r.cx, r.y + r.h * 0.2, 3);
      if (round >= ROUNDS) {
        G.finishGame(sc, chara, bubble, placeBubble, L.hideDone, meter);
        return;
      }
      placeBubble();
      await sc.guard(bubble.say(pick(L.hideFound), { hold: 500 }));
      phase = 'show';
      await sc.wait(500);
      hideRound();
    }

    function miss(s) {
      misses++;
      s.el.animate([{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(-3deg) scale(1.03)' }, { transform: 'rotate(3deg) scale(1.03)' }, { transform: 'rotate(0) scale(1)' }], { duration: 450 });
      G.Sound.play('soft');
      const r = UI.rectOf(s.el);
      UI.sparkles(r.cx, r.y + r.h * 0.3, 4, 80);
      UI.word('？', r.cx, r.y + 10, '#c95f7f', 64);
      G.Voice.speak(pick(L.hideMiss), 'chara'); // かくれている ところから こえだけ
      if (misses >= 2) goStrong(); else sc.timeout(() => peek(false), 900);
    }

    sc.on(scr, 'pointerdown', (e) => {
      if (phase !== 'search' || e.target.closest('.btn-back, .bubble')) return;
      const m = e.target.closest('.chara');
      if (m) { e.preventDefault(); found(); return; }
      const el = e.target.closest('.hide-spot');
      if (!el) return;
      e.preventDefault();
      const s = SPOTS[parseInt(el.dataset.i, 10)];
      if (s === spot) found(); else miss(s);
    });

    (async () => {
      await sc.wait(500);
      placeBubble();
      await sc.guard(bubble.say(L.hideIntro, { hold: 600 }));
      hideRound();
    })();
  }
};
