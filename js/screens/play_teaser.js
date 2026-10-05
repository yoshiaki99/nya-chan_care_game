/* あそぶ：ねこじゃらし ふりふり
 * ゆびで ねこじゃらしを うごかすと ニャーちゃんが 目で おいかけ、とめると とびつく。
 * タップしただけでも その場所に とびつく（救済） */
window.G = window.G || {};
G.Screens = G.Screens || {};

G.Screens.teaser = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, L = G.CHARACTER.lines, PA = G.PlayArt;
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const TOTAL = 8;
    const FLOOR = 900;
    UI.backButton(scr, () => G.go('playmenu'));
    const meter = G.oneMeter(scr, 'fun');
    const setProg = G.progressRow(scr, TOTAL, () => G.Art.svg('-92 -96 184 116', PA.feathers() + '<circle r="15" fill="#f37d9b"/>'));

    const chara = new G.Chara(scr, { x: 560, y: FLOOR, h: 420 });
    chara.setMood('face_happy');
    chara.setPose('face_happy', 0);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.bubbleSpot(0.06, 420); bubble.place(p.x, p.y, p.side); };

    /* ---- ねこじゃらし ---- */
    const TIP = PA.TEASER_TIP;
    const wand = UI.el('div', 'teaser-wand', G.Art.all.teaser());
    wand.style.transformOrigin = `${TIP.x}px ${TIP.y}px`;
    scr.appendChild(wand);
    const tip = { x: 980, y: 560 };      // いま
    const target = { x: 980, y: 560 };   // ゆびの ところ
    let mirror = 1, tilt = 0;
    const clampTip = (p) => ({ x: Math.min(1300, Math.max(70, p.x)), y: Math.min(960, Math.max(230, p.y)) });

    let raf = 0;
    const loop = () => {
      if (!sc.alive) return;
      const vx = (target.x - tip.x) * 0.3, vy = (target.y - tip.y) * 0.3;
      tip.x += vx; tip.y += vy;
      // ぼうは ニャーちゃんと はんたいがわに のばす（からだに かさねない）。画面の はしでは はみださない ほうへ
      const mx = chara.feet().x;
      let want = tip.x > mx + 40 ? 1 : (tip.x < mx - 40 ? -1 : mirror);
      if (tip.x > 1366 - 240) want = -1;
      if (tip.x < 240) want = 1;
      mirror = want;
      tilt += (Math.max(-28, Math.min(28, -vx * 1.2 - vy * 0.4)) - tilt) * 0.2;
      wand.style.left = (tip.x - TIP.x) + 'px';
      wand.style.top = (tip.y - TIP.y) + 'px';
      wand.style.transform = `scaleX(${mirror}) rotate(${tilt * mirror}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    sc.add(() => cancelAnimationFrame(raf));

    /* ---- ニャーちゃんの うごき ---- */
    let count = 0, busy = false, moving = false, done = false;
    let armed = false, lastMove = 0, waveFrom = 0, drag = null, hand = null, idleAt = Date.now() + 9000;
    const half = () => chara.w * 0.36;
    const clampX = (x) => Math.min(1366 - half(), Math.max(half(), x));

    async function walk() { // ねこじゃらしの そばへ ちょこちょこ
      const f = chara.feet();
      const dir = tip.x > f.x ? 1 : -1;
      const tx = clampX(tip.x - dir * 190);
      if (Math.abs(tx - f.x) < 60) return;
      moving = true;
      await sc.guard(chara.moveTo(tx, FLOOR, Math.min(900, 300 + Math.abs(tx - f.x) * 0.9)));
      moving = false;
    }

    async function pounce() {
      busy = true; armed = false;
      if (hand) { hand.remove(); hand = null; }
      bubble.hide();
      const f = chara.feet();
      const dir = tip.x >= f.x ? 1 : -1;
      chara.face(dir);
      chara.setPose('face_happy');
      G.Sound.play('pounce');
      const chest = FLOOR - chara.h * 0.5; // むねの 高さで うけとめる
      const jump = Math.max(46, Math.min(300, chest - tip.y));
      const tx = clampX(tip.x - dir * chara.h * 0.2);
      wand.classList.add('caught'); // とびつく あいだは ねこじゃらしを ニャーちゃんの うしろへ（かおに かさねない）
      sc.timeout(() => wand.classList.remove('caught'), 960);
      chara.moveTo(tx, FLOOR, 420, false);
      chara.hop(jump, 640);
      await sc.wait(260);
      // つかまえた！
      count++;
      setProg(count);
      G.Sound.play(Math.random() < 0.6 ? 'meow' : 'sparkle');
      wand.firstChild.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(12deg)' }, { transform: 'rotate(0)' }], { duration: 420 });
      UI.sparkles(tip.x, tip.y, 6, 90);
      UI.hearts(tip.x, tip.y - 20, 1);
      await sc.wait(420);
      chara.squish();
      if (count >= TOTAL) { finish(); return; }
      placeBubble();
      bubble.say(pick(L.teaserCheer), { hold: 200 });
      // ゆびを はなしていたら、ねこじゃらしが ぴょんと にげる
      if (!drag) {
        let nx;
        do { nx = 160 + Math.random() * 1040; } while (Math.abs(nx - tip.x) < 300);
        Object.assign(target, clampTip({ x: nx, y: 300 + Math.random() * 420 }));
        G.Sound.play('whoosh');
      }
      await sc.wait(700);
      busy = false;
      idleAt = Date.now() + 9000;
    }

    async function finish() {
      done = true;
      await sc.wait(600);
      wand.classList.add('caught'); // おわりの あいだは ねこじゃらしを ニャーちゃんの うしろへ（かおに かさねない）
      Object.assign(target, { x: chara.feet().x > 683 ? 200 : 1180, y: 380 }); // ニャーちゃんの いない ほうへ
      chara.face(1);
      G.finishGame(sc, chara, bubble, placeBubble, L.teaserDone, meter);
    }

    sc.interval(() => {
      if (done || busy) return;
      const now = Date.now();
      const f = chara.feet();
      if (!moving) chara.face(tip.x > f.x + 30 ? 1 : (tip.x < f.x - 30 ? -1 : chara.facing));
      // とまったら とびつく。ずっと ふっていても ときどき とびつく
      if (armed && !moving && (now - lastMove > 600 || now - waveFrom > 3200)) { pounce(); return; }
      if (!moving && armed && Math.abs(tip.x - f.x) > 300) walk(); // さわってもらってから うごきだす
      if (now > idleAt && !drag) { // しばらく なにもしないときの ヒント
        idleAt = now + 12000;
        placeBubble();
        bubble.say(L.teaserIntro);
        hand = UI.hand(scr, { x: tip.x, y: tip.y }, { x: tip.x - 260, y: tip.y + 120 }, { times: 2 });
      }
    }, 120);

    sc.timeout(() => {
      placeBubble();
      bubble.say(L.teaserIntro);
      hand = UI.hand(scr, { x: tip.x, y: tip.y }, { x: tip.x - 260, y: tip.y + 120 }, { times: 3 });
    }, 500);

    /* ---- ゆび ---- */
    sc.on(scr, 'pointerdown', (e) => {
      if (e.target.closest('.btn-back, .bubble') || done) return;
      e.preventDefault();
      if (drag != null) return;
      drag = e.pointerId;
      try { scr.setPointerCapture(e.pointerId); } catch (_) { /* なし */ }
      if (hand) { hand.remove(); hand = null; }
      Object.assign(target, clampTip(UI.toStage(e.clientX, e.clientY)));
      G.Sound.play('flutter');
      if (!armed) waveFrom = Date.now();
      armed = true; lastMove = Date.now();
      idleAt = Date.now() + 9000;
    });
    sc.on(scr, 'pointermove', (e) => {
      if (e.pointerId !== drag) return;
      const p = clampTip(UI.toStage(e.clientX, e.clientY));
      if (Math.hypot(p.x - target.x, p.y - target.y) > 5) {
        if (!armed) waveFrom = Date.now();
        armed = !busy || armed;
        lastMove = Date.now();
        if (Math.random() < 0.08) G.Sound.play('flutter');
      }
      Object.assign(target, p);
    });
    const up = (e) => { if (e.pointerId === drag) drag = null; };
    sc.on(scr, 'pointerup', up);
    sc.on(scr, 'pointercancel', up);
  }
};
