/* あそぶ（5.6）：えらぶ画面・けいとだま・ピアノ・ちょうちょ（ほかの あそびは play_*.js） */
window.G = window.G || {};
G.Screens = G.Screens || {};

/* あそび おわり：ほめて、メーターを変えて、おへやへ
   opts.fed = あそびの中で たべた（ケーキ・おちゃかい）。おなかは へらさずに すこし ふやす */
G.finishGame = async function (sc, chara, bubble, placeBubble, line, meter, opts = {}) {
  const UI = G.UI, S = G.State;
  const r = chara.rect();
  chara.setPose('face_happy');
  G.Sound.play('fanfare');
  chara.hop(50);
  sc.timeout(() => chara.hop(40), 600);
  UI.sparkles(r.cx, r.y + r.h * 0.3, 12, 200);
  UI.hearts(r.cx, r.y + r.h * 0.3, 5);
  S.setMeter('fun', 5);
  if (meter) meter.update(true);
  // いっぱい あそぶと、おなかがすいて、ちょっと よごれて、つかれる
  S.addMeter('hunger', opts.fed ? 1 : -0.7);
  S.addMeter('clean', -0.7);
  S.addMeter('energy', -1);
  UI.giveHearts(2, r.cx, r.y + r.h * 0.3);
  placeBubble();
  await sc.guard(bubble.say(line));
  await sc.wait(600);
  G.go('home');
};

function progressRow(scr, n, art) {
  const UI = G.UI;
  const row = UI.el('div', 'progress');
  const dots = [];
  for (let i = 0; i < n; i++) {
    const d = UI.el('div', 'pd', art());
    row.appendChild(d); dots.push(d);
  }
  scr.appendChild(row);
  return (k) => dots.forEach((d, i) => {
    const on = i < k;
    if (on && !d.classList.contains('on')) d.animate([{ transform: 'scale(.4)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1.1)' }], { duration: 400 });
    d.classList.toggle('on', on);
  });
}
G.progressRow = progressRow; // play_*.js でも つかう

/* ================= あそびを えらぶ ================= */
G.Screens.playmenu = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, L = G.CHARACTER.lines;
    UI.backButton(scr, () => G.go('home'));
    const chara = new G.Chara(scr, { x: 222, y: 930, h: 380 });
    chara.setMood('face_happy');
    chara.setPose('face_happy', 0);
    const bubble = new UI.Bubble(scr);
    sc.timeout(() => { const p = chara.topSpot(0.5, 0.02); bubble.place(p.x, p.y, p.side); bubble.say(L.playIntro); }, 400); // あたまの上（カードに かさねない）
    G.petting(chara, sc);

    // 3こずつ 3だん
    G.GAMES.forEach((g, i) => {
      const c = UI.el('div', 'game-card');
      UI.pos(c, 446 + (i % 3) * 300, 128 + Math.floor(i / 3) * 290, 276, 262);
      const art = G.Assets.node(g.art, 'gc-art');
      c.appendChild(art);
      c.appendChild(UI.el('div', 'gc-label', g.label.replace(' ', '<br>')));
      scr.appendChild(c);
      c.animate([{ transform: 'translateY(40px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 400, delay: i * 60, fill: 'backwards', easing: 'ease-out' });
      UI.tap(c, () => G.go(g.id), { say: g.label });
    });
  }
};

/* ================= けいとだま ころころ（F-50） ================= */
G.Screens.yarn = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, L = G.CHARACTER.lines;
    const TOTAL = 8;
    UI.backButton(scr, () => G.go('playmenu'));
    const meter = G.oneMeter(scr, 'fun');
    const setProg = progressRow(scr, TOTAL, () => G.Art.meterIcons.fun());

    const chara = new G.Chara(scr, { x: 380, y: 900, h: 420 });
    chara.setMood('face_happy');
    chara.setPose('face_happy', 0);
    G.NyuVisit.joinPlay(scr, sc, { x: 1210, y: 940, h: 330 }); // ニューちゃんが 来ていたら いっしょに
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.bubbleSpot(0.06, 420); bubble.place(p.x, p.y, p.side); }; // リボンの高さ（しっぽより上）

    const SIZE = 130;
    const ball = UI.el('div', 'yarn-ball');
    ball.appendChild(G.Assets.node('item_yarn', 'yb-art'));
    scr.appendChild(ball);
    let bx = 900, by = 851, rot = 0;
    const setBall = (x, y) => { bx = x; by = y; ball.style.left = (x - SIZE / 2) + 'px'; ball.style.top = (y - SIZE / 2) + 'px'; };
    setBall(bx, by);

    let count = 0, busy = false, hand = null, ballHidden = false;
    sc.timeout(() => { placeBubble(); bubble.say(L.yarnIntro); hand = UI.hand(scr, { x: bx + 10, y: by - 10 }); }, 500);

    async function kick() {
      if (busy) {
        ball.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-12deg)' }, { transform: 'rotate(12deg)' }, { transform: 'rotate(0)' }], { duration: 300 });
        return;
      }
      busy = true;
      if (hand) { hand.remove(); hand = null; }
      bubble.hide();
      if (ballHidden) {
        const yb = G.CHARACTER.yarnBallInPose;
        const p = chara.point(yb.x, yb.y);
        setBall(p.x, Math.min(940, Math.max(820, p.y)));
        ball.style.opacity = '1';
        ballHidden = false;
        chara.setPose('face_happy', 150);
      }
      // ころがす
      let tx;
      do { tx = 170 + Math.random() * 1030; } while (Math.abs(tx - bx) < 320);
      const ty = 846 + Math.random() * 10; // 毛糸玉の絵の玉と同じ高さ
      const dist = tx - bx;
      const fromX = bx, fromY = by;
      rot += dist / (Math.PI * SIZE) * 360;
      G.Sound.play('roll');
      const a = ball.animate([
        { transform: 'translate(0,0) rotate(0deg)' },
        { transform: `translate(${(tx - fromX) * 0.5}px,${(ty - fromY) * 0.5 - 50}px) rotate(${dist / (Math.PI * SIZE) * 180}deg)`, offset: 0.4 },
        { transform: `translate(${tx - fromX}px,${ty - fromY}px) rotate(${dist / (Math.PI * SIZE) * 360}deg)` }
      ], { duration: 950, easing: 'ease-out', fill: 'forwards' });
      // ニャーちゃんが おいかける
      await sc.wait(180);
      const dir = dist > 0 ? 1 : -1;
      chara.face(dir);
      const half = chara.w / 2;
      const mx = Math.min(1366 - half * 0.6, Math.max(half * 0.6, tx - dir * chara.h * 0.11));
      await sc.guard(chara.moveTo(mx, 900, 950));
      await sc.guard(a.finished.catch(() => { }));
      a.cancel();
      setBall(tx, ty);
      // じゃれる
      count++;
      setProg(count);
      if (G.CharaArt.hasOwn('act_yarn')) {
        chara.setPose('act_yarn', 150);
        ball.style.opacity = '0';
        ballHidden = true;
      } else {
        chara.squish();
        ball.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-30px)' }, { transform: 'translateY(0)' }], { duration: 350 });
      }
      G.Sound.play(Math.random() < 0.5 ? 'meow' : 'tap');
      UI.sparkles(tx, ty, 4, 70);
      const h = chara.point(0.6, 0.2);
      UI.hearts(h.x, h.y, 1);
      if (count >= TOTAL) {
        await sc.wait(700);
        if (ballHidden) { ball.style.opacity = '1'; ballHidden = false; const yb = G.CHARACTER.yarnBallInPose, p = chara.point(yb.x, yb.y); setBall(p.x, Math.min(940, Math.max(820, p.y))); }
        chara.face(1);
        G.finishGame(sc, chara, bubble, placeBubble, L.yarnDone, meter);
        return;
      }
      placeBubble();
      const cheer = L.yarnCheer[Math.floor(Math.random() * L.yarnCheer.length)];
      bubble.say(cheer, { hold: 200 });
      await sc.wait(900);
      busy = false;
    }

    sc.on(scr, 'pointerdown', (e) => {
      if (e.target.closest('.btn-back, .bubble')) return;
      e.preventDefault();
      kick(); // どこをさわっても ころがる（救済）
    });
  }
};

/* ================= ピアノで うたおう（F-51） ================= */
G.Screens.piano = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, L = G.CHARACTER.lines, m = G.Sound.m;
    UI.backButton(scr, () => G.go('playmenu'));
    const meter = G.oneMeter(scr, 'fun');
    // きらきらぼし（フランスの うた「Ah! vous dirai-je, maman」）
    const SONG = [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0];
    const BEATS = [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2];
    const setProg = progressRow(scr, SONG.length, () => '<div class="pn">♪</div>');

    const chara = new G.Chara(scr, { x: 610, y: 664, h: 380 }); // 鍵盤のすぐ上の床にすわる
    chara.setMood('face_happy');
    chara.setPose('face_happy', 0);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.bubbleSpot(0.4); bubble.place(p.x, p.y, p.side); };

    const NOTES = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'].map(m);
    const GEMS = [
      ['#f3889e', '<circle cx="32" cy="32" r="22"/>'],
      ['#f6b26b', '<path d="M32 8l26 46H6z"/>'],
      ['#f2cf5b', '<path d="M32 4C35 26 38 29 60 32 38 35 35 38 32 60 29 38 26 35 4 32 26 29 29 26 32 4z"/>'],
      ['#8fd19e', '<path d="M32 6l26 26-26 26L6 32z"/>'],
      ['#7cc3ea', `<path transform="translate(8 9) scale(1.5)" d="${G.Art.HEART_PATH}"/>`],
      ['#a7a3ec', '<rect x="10" y="10" width="44" height="44" rx="8"/>'],
      ['#e59ad8', '<g><circle cx="32" cy="18" r="11"/><circle cx="46" cy="30" r="11"/><circle cx="40" cy="46" r="11"/><circle cx="24" cy="46" r="11"/><circle cx="18" cy="30" r="11"/><circle cx="32" cy="32" r="8" fill="#fff8d0"/></g>'],
      ['#f3889e', '<circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="10" fill="#fff"/>']
    ];
    const kb = UI.el('div', 'keyboard');
    UI.pos(kb, 131, 676, 1104, 320);
    scr.appendChild(kb);
    const KW = 134;
    const keys = NOTES.map((n, i) => {
      const k = UI.el('div', 'pkey', `<div class="gem">${G.Art.svg('0 0 64 64', `<g fill="${GEMS[i][0]}" stroke="#fff" stroke-width="3">${GEMS[i][1]}</g>`)}</div>`);
      k.style.left = (16 + i * KW) + 'px';
      kb.appendChild(k);
      return k;
    });
    [0, 1, 3, 4, 5].forEach(i => {
      const b = UI.el('div', 'bkey');
      b.style.left = (16 + (i + 1) * KW - 27) + 'px';
      kb.appendChild(b);
    });
    const arrow = UI.el('div', 'key-arrow', '▼');
    scr.appendChild(arrow);

    let idx = 0, done = false, sing = 0;
    function showNext() {
      keys.forEach(k => k.classList.remove('next'));
      if (idx >= SONG.length) { arrow.style.display = 'none'; return; }
      const k = keys[SONG[idx]];
      k.classList.add('next');
      const r = UI.rectOf(k);
      arrow.style.left = (r.cx - 40) + 'px';
      arrow.style.top = (r.y - 86) + 'px';
    }
    sc.timeout(() => { placeBubble(); bubble.say(L.pianoIntro); showNext(); }, 500);

    keys.forEach((k, i) => {
      sc.on(k, 'pointerdown', (e) => {
        e.preventDefault();
        k.classList.add('down');
        sc.timeout(() => k.classList.remove('down'), 160);
        if (done) { G.Sound.note(NOTES[i]); return; }
        const ok = SONG[idx] === i;
        G.Sound.note(NOTES[i], { sing: ok });
        if (!ok) return; // まちがえても 音が鳴るだけ
        bubble.hide();
        sing++;
        chara.flash(sing % 2 ? 'face_happy' : 'face_dreamy', 700);
        chara.squish();
        const mo = chara.mouth();
        UI.notes(mo.x, mo.y - 20, 1);
        idx++;
        setProg(idx);
        showNext();
        if (idx >= SONG.length) finish();
      });
    });

    async function finish() {
      done = true;
      await sc.wait(700);
      // ごほうびに、ニャーちゃんが いっきょく うたう
      const ms = G.Sound.melody(SONG.map((s, i) => [NOTES[s], BEATS[i]]), 120, { sing: true });
      let t = 100;
      SONG.forEach((s, i) => {
        sc.timeout(() => {
          keys.forEach(k => k.classList.remove('next'));
          keys[s].classList.add('next');
          const mo = chara.mouth();
          UI.notes(mo.x, mo.y - 20, 1);
        }, t);
        t += BEATS[i] * 500;
      });
      chara.sway(Math.ceil((ms || 8000) / 1400));
      await sc.wait(Math.max(ms || 0, t) + 300);
      keys.forEach(k => k.classList.remove('next'));
      G.finishGame(sc, chara, bubble, placeBubble, L.pianoDone, meter);
    }
  }
};

/* ================= ちょうちょ つかまえ（F-52） ================= */
G.Screens.butterfly = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, L = G.CHARACTER.lines;
    const TOTAL = 6;
    UI.backButton(scr, () => G.go('playmenu'));
    const meter = G.oneMeter(scr, 'fun');
    const setProg = progressRow(scr, TOTAL, () => G.Art.butterfly('#f6b3c4', '#c3a3ec'));

    const chara = new G.Chara(scr, { x: 683, y: 900, h: 420 });
    chara.setMood('face_happy');
    chara.setPose('face_happy', 0);
    G.NyuVisit.joinPlay(scr, sc, { x: 1210, y: 940, h: 330 }); // ニューちゃんが 来ていたら いっしょに
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.bubbleSpot(0.06, 420); bubble.place(p.x, p.y, p.side); }; // リボンの高さ（しっぽより上）

    const COLORS = [['#f6b3c4', '#c3a3ec'], ['#9fd0f2', '#f6d66b'], ['#f6d66b', '#f3a9c9']];
    const flies = COLORS.map((c, i) => {
      const e = UI.el('div', 'bfly', `<div class="bf-wing">${G.Art.butterfly(c[0], c[1])}</div>`);
      scr.appendChild(e);
      return { e, cx: 300 + i * 380, cy: 300 + (i % 2) * 120, tx: 300 + i * 380, ty: 300 + (i % 2) * 120, ph: i * 2.1, x: 0, y: 0, busy: false };
    });
    const newSpot = (f) => { f.tx = 200 + Math.random() * 970; f.ty = 220 + Math.random() * 300; };

    let raf = 0;
    const t0 = performance.now();
    const loop = (now) => {
      if (!sc.alive) return;
      const t = (now - t0) / 1000;
      flies.forEach(f => {
        f.cx += (f.tx - f.cx) * 0.02; f.cy += (f.ty - f.cy) * 0.02;
        if (!f.busy) {
          f.x = f.cx + Math.sin(t * 0.9 + f.ph) * 120;
          f.y = f.cy + Math.sin(t * 1.7 + f.ph * 2) * 50;
        }
        f.e.style.transform = `translate(${f.x}px,${f.y}px)`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    sc.add(() => cancelAnimationFrame(raf));
    sc.interval(() => { const f = flies[Math.floor(Math.random() * flies.length)]; if (!f.busy) newSpot(f); }, 2500);

    let count = 0, busy = false;
    sc.timeout(() => { placeBubble(); bubble.say(L.flyIntro); }, 500);

    async function chase(f) {
      busy = true; f.busy = true;
      bubble.hide();
      const dir = f.x > chara.feet().x ? 1 : -1;
      chara.face(dir);
      G.Sound.play('flutter');
      await sc.guard(chara.moveTo(Math.min(1200, Math.max(170, f.x)), 900, 600));
      chara.setPose('face_happy');
      chara.hop(150, 700);
      f.e.animate([{ transform: `translate(${f.x}px,${f.y}px) scale(1) rotate(0)` }, { transform: `translate(${f.x}px,${f.y - 60}px) scale(1.3) rotate(180deg)` }, { transform: `translate(${f.x}px,${f.y}px) scale(1) rotate(360deg)` }], { duration: 700 });
      await sc.wait(330);
      G.Sound.play('sparkle');
      UI.sparkles(f.x, f.y, 8, 110);
      UI.hearts(f.x, f.y, 2);
      count++;
      setProg(count);
      await sc.wait(400);
      newSpot(f);
      f.busy = false;
      if (count >= TOTAL) { chara.face(1); G.finishGame(sc, chara, bubble, placeBubble, L.flyDone, meter); return; }
      placeBubble();
      bubble.say(L.flyCheer[Math.floor(Math.random() * L.flyCheer.length)], { hold: 200 });
      await sc.wait(500);
      busy = false;
    }

    sc.on(scr, 'pointerdown', (e) => {
      if (e.target.closest('.btn-back, .bubble')) return;
      e.preventDefault();
      if (busy) return;
      const p = UI.toStage(e.clientX, e.clientY);
      // いちばん ちかい ちょうちょ（どこをさわっても いい：救済）
      const f = flies.slice().sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))[0];
      chase(f);
    });
  }
};
