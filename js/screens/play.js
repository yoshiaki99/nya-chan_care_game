/* あそぶ（5.6）：えらぶ画面・けいとだま・ネズミの おもちゃ（ほかの あそびは play_*.js） */
window.G = window.G || {};
G.Screens = G.Screens || {};

/* あそび おわり：ほめて、メーターを変えて、おへやへ */
G.finishGame = async function (sc, chara, bubble, placeBubble, line, meter) {
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
  S.addMeter('hunger', -0.7);
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

    // うえの だんに 3こ、したの だんに のこり（まんなかに よせる）
    const PER = 3;
    G.GAMES.forEach((g, i) => {
      const c = UI.el('div', 'game-card');
      const row = Math.floor(i / PER), n = Math.min(PER, G.GAMES.length - row * PER);
      UI.pos(c, 446 + (PER - n) * 150 + (i % PER) * 300, 220 + row * 300, 276, 262);
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

/* ================= ネズミの おもちゃ ================= */
/* ゼンマイの ネズミが ゆかを はしりまわる。タッチすると ニャーちゃんが とびついて つかまえる。
 * どこを さわっても ネズミに とびつく（救済） */
G.Screens.mouse = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, L = G.CHARACTER.lines;
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const TOTAL = 6, FLOOR = 900, W = 170, H = 120;
    UI.backButton(scr, () => G.go('playmenu'));
    const meter = G.oneMeter(scr, 'fun');
    const setProg = progressRow(scr, TOTAL, () => G.Assets.node('toy_mouse').outerHTML);

    const chara = new G.Chara(scr, { x: 380, y: FLOOR, h: 420 });
    chara.setMood('face_happy');
    chara.setPose('face_happy', 0);
    const nyu = G.NyuVisit.joinPlay(scr, sc, { x: 1210, y: 940, h: 330 }); // ニューちゃんが 来ていたら いっしょに
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.bubbleSpot(0.06, 420); bubble.place(p.x, p.y, p.side); };

    // ネズミ（x, y = 足もとの まんなか）。絵は 右むき
    const mouse = UI.el('div', 'mouse-toy');
    const body = UI.el('div', 'mt-body');
    body.appendChild(G.Assets.node('toy_mouse', 'mt-art'));
    mouse.appendChild(body);
    scr.appendChild(mouse);
    const XMAX = nyu ? 950 : 1240; // ニューちゃんが いるときは その ひだりで まわる（ニューちゃんの 枠に タッチを とられない）
    const m = { x: 900, y: 930, tx: 900, ty: 930, dir: -1, wait: 0.6, run: false, stop: false };
    let count = 0, busy = false, hand = null;
    const draw = () => {
      mouse.style.transform = `translate(${m.x - W / 2}px,${m.y - H}px)`;
      body.style.transform = `scaleX(${m.dir})`;
      mouse.style.zIndex = (m.stop || m.y > chara.feet().y) ? 4 : 1; // ニャーちゃんより てまえ／おく（つかまえた ときは てまえ）
      if (hand) UI.pos(hand.el, m.x - 40, m.y - H / 2 - 10); // ゆびの ヒントは ネズミに ついていく
    };
    const newSpot = () => {
      let tx;
      do { tx = 150 + Math.random() * (XMAX - 150); } while (Math.abs(tx - m.x) < 260);
      m.tx = tx; m.ty = 870 + Math.random() * 90;
      m.dir = tx > m.x ? 1 : -1;
      m.run = true;
    };

    let raf = 0, last = performance.now(), squeakAt = 0;
    const loop = (now) => {
      if (!sc.alive) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!m.stop) {
        if (m.run) {
          const dx = m.tx - m.x, dy = m.ty - m.y, d = Math.hypot(dx, dy), step = 330 * dt;
          if (d <= step) { m.x = m.tx; m.y = m.ty; m.run = false; m.wait = 0.4 + Math.random() * 0.8; }
          else { m.x += dx / d * step; m.y += dy / d * step; }
          mouse.classList.add('running');
          if (now > squeakAt) { squeakAt = now + 900 + Math.random() * 900; if (Math.random() < 0.5) G.Sound.play('squeak'); }
        } else {
          mouse.classList.remove('running');
          m.wait -= dt;
          if (m.wait <= 0) newSpot();
        }
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    draw();
    raf = requestAnimationFrame(loop);
    sc.add(() => cancelAnimationFrame(raf));

    sc.timeout(() => { if (busy || count) return; placeBubble(); bubble.say(L.mouseIntro); hand = UI.hand(scr, { x: m.x, y: m.y - H / 2 }); }, 500);

    async function pounce() {
      if (busy) return;
      busy = true; m.stop = true;
      mouse.classList.remove('running');
      if (hand) { hand.remove(); hand = null; }
      bubble.hide();
      // ニャーちゃんが はしって とびつく
      const dir = m.x > chara.feet().x ? 1 : -1;
      chara.face(dir);
      G.Sound.play('pounce');
      const half = chara.w / 2;
      const cx = Math.min(1366 - half * 0.6, Math.max(half * 0.6, m.x - dir * chara.h * 0.12));
      await sc.guard(chara.moveTo(cx, FLOOR, 520));
      chara.setPose('face_happy');
      chara.hop(120, 560);
      await sc.wait(420);
      // つかまえた：ネズミが くるっと まわる
      G.Sound.play('squeak');
      body.animate([{ transform: `scaleX(${m.dir}) rotate(0)` }, { transform: `scaleX(${m.dir}) translateY(-40px) rotate(${m.dir * 200}deg)` }, { transform: `scaleX(${m.dir}) rotate(${m.dir * 360}deg)` }], { duration: 600, easing: 'ease-out' });
      UI.sparkles(m.x, m.y - H / 2, 8, 110);
      UI.hearts(m.x, m.y - H / 2, 2);
      count++;
      setProg(count);
      await sc.wait(650);
      if (count >= TOTAL) { chara.face(1); G.finishGame(sc, chara, bubble, placeBubble, L.mouseDone, meter); return; }
      placeBubble();
      bubble.say(pick(L.mouseCheer), { hold: 200 });
      // ゼンマイを まいて また にげる
      m.stop = false; newSpot();
      await sc.wait(500);
      busy = false;
    }

    sc.on(scr, 'pointerdown', (e) => {
      if (e.target.closest('.btn-back, .bubble, .nyu')) return;
      e.preventDefault();
      pounce();
    });
  }
};
