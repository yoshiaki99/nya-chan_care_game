/* あそぶ：ケーキ デコレーション
 * ① すきな クリームを えらんで ケーキに ぬる → ② すきな ものを 5こ のせる → ③ ろうそくを たてると ニャーちゃんが ふーっ → いただきます。
 * どうぐを タップするだけでも すすむ（救済） */
window.G = window.G || {};
G.Screens = G.Screens || {};

G.Screens.cake = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, L = G.CHARACTER.lines, PA = G.PlayArt;
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const CREAM_GOAL = 16, TOP_GOAL = 5;
    UI.backButton(scr, () => G.go('playmenu'));
    const meter = G.oneMeter(scr, 'fun');

    /* ---- ケーキ（cake_base の だ円を ステージに うつす） ---- */
    const C = PA.CAKE, K = 1.1, OX = 214, OY = 236;
    const top = { cx: OX + C.cx * K, cy: OY + C.cy * K, rx: C.rx * K, ry: C.ry * K };
    const sideBottom = OY + (C.cy + C.side) * K;
    const wrap = UI.el('div', 'cake-wrap');
    UI.pos(wrap, OX, OY, C.w * K, C.h * K);
    wrap.appendChild(G.Assets.node('cake_base', 'cake-layer'));
    const creamLayer = UI.el('div', 'cake-layer cake-cream');
    wrap.appendChild(creamLayer);
    scr.appendChild(wrap);
    const deco = UI.el('div', 'cake-deco'); // しぼった クリーム・のせたもの・ろうそく
    scr.appendChild(deco);

    const chara = new G.Chara(scr, { x: 1130, y: 880, h: 440 });
    chara.setMood('face_happy');
    chara.setPose('face_happy', 0);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.topSpot(0.5, 0.02); bubble.place(p.x, p.y, p.side); }; // あたまの上（ケーキに かさねない）
    const say = (t, o) => { placeBubble(); return bubble.say(t, o); };

    const inCake = (p) => p.x > top.cx - top.rx - 40 && p.x < top.cx + top.rx + 40 && p.y > top.cy - top.ry - 60 && p.y < sideBottom + 20;
    const onTop = (p, k = 0.8) => { // だ円の 中に おさめる
      const dx = (p.x - top.cx) / (top.rx * k), dy = (p.y - top.cy) / (top.ry * k);
      const d = Math.hypot(dx, dy);
      return d <= 1 ? { x: p.x, y: p.y } : { x: top.cx + dx / d * top.rx * k, y: top.cy + dy / d * top.ry * k };
    };
    const ring = (deg, k) => ({ x: top.cx + Math.cos(deg * Math.PI / 180) * top.rx * k, y: top.cy + Math.sin(deg * Math.PI / 180) * top.ry * k });
    function addDeco(html, p, size, cls = '') {
      const e = UI.el('div', 'cake-item ' + cls, html);
      UI.pos(e, p.x - size / 2, p.y - size * 0.8, size, size);
      e.style.zIndex = String(Math.round(p.y));
      deco.appendChild(e);
      e.animate([{ transform: 'scale(.2)', opacity: 0 }, { transform: 'scale(1.15)', opacity: 1, offset: 0.6 }, { transform: 'scale(1)' }], { duration: 320, easing: 'ease-out' });
      return e;
    }

    /* ---- したの どうぐ ---- */
    const bar = UI.el('div', 'cake-bar');
    scr.appendChild(bar);
    const cursor = UI.el('div', 'cake-cursor');
    scr.appendChild(cursor);
    const showCursor = (p) => { cursor.classList.add('on'); cursor.style.left = (p.x - 60) + 'px'; cursor.style.top = (p.y - 150) + 'px'; };
    const hideCursor = () => cursor.classList.remove('on');

    let step = 0, busy = false, hand = null, cream = null, progress = 0, placed = 0, rub = null, lastSnd = 0, dollops = 0;
    const clearHand = () => { if (hand) { hand.remove(); hand = null; } };

    /* ① クリーム */
    let bags = [];
    function stepCream() {
      step = 1;
      bar.innerHTML = '';
      bags = G.CREAMS.map((cr, i) => {
        const b = UI.el('div', 'cake-tool', `<div class="ct-art">${PA.pipingBag(cr)}</div><div class="ct-label">${cr.label}</div>`);
        UI.pos(b, 190 + i * 220, 770, 180, 214);
        bar.appendChild(b);
        sc.on(b, 'pointerdown', (e) => {
          if (step !== 1 || busy) return;
          e.preventDefault(); e.stopPropagation();
          G.Sound.play('press');
          G.Voice.speak(cr.label, 'guide');
          chooseCream(cr);
          clearHand();
          rub = { id: e.pointerId, last: UI.toStage(e.clientX, e.clientY), acc: 0, moved: 0, fromBag: true };
          try { scr.setPointerCapture(e.pointerId); } catch (_) { /* なし */ }
        });
        return b;
      });
      say(L.cakeIntro);
      const r = UI.rectOf(bags[1]);
      hand = UI.hand(scr, { x: r.cx, y: r.cy }, { x: top.cx, y: top.cy }, { times: 3 });
    }
    function chooseCream(cr) {
      if (cream !== cr) {
        cream = cr;
        creamLayer.innerHTML = PA.cakeCream(cr);
        deco.querySelectorAll('.rosette').forEach(e => { e.innerHTML = PA.rosette(cr); });
      }
      bags.forEach((b, i) => b.classList.toggle('sel', G.CREAMS[i] === cr));
      cursor.innerHTML = PA.pipingBag(cr);
    }
    function pipe(p) {
      if (step !== 1) return;
      const q = onTop(p, 0.86);
      if (dollops < 26) { addDeco(PA.rosette(cream), q, 56, 'rosette'); dollops++; }
      if (Date.now() - lastSnd > 110) { G.Sound.play('squeeze'); lastSnd = Date.now(); }
      progress++;
      creamLayer.style.opacity = Math.min(1, 0.15 + progress / CREAM_GOAL);
      if (Math.random() < 0.2) chara.flash('face_happy', 1200);
      if (progress >= CREAM_GOAL) creamDone();
    }
    async function autoPipe() { // タップだけでも ぐるっと しぼる
      if (busy) return;
      busy = true;
      for (let i = 0; i < 26 && step === 1; i++) {
        const p = ring(150 - i * 24, 0.62 + (i % 3) * 0.08);
        showCursor(p);
        pipe(p);
        await sc.wait(120);
      }
      hideCursor();
      busy = false;
    }
    async function creamDone() {
      step = 1.5; busy = true; rub = null;
      hideCursor();
      creamLayer.style.opacity = 1;
      // まわりに きれいに しぼる
      for (let i = 0; i < 10; i++) { sc.timeout(() => { addDeco(PA.rosette(cream), ring(195 - i * 21, 0.93), 50, 'rosette'); G.Sound.play('squeeze'); }, i * 70); }
      await sc.wait(800);
      G.Sound.play('sparkle');
      UI.sparkles(top.cx, top.cy, 10, 200);
      chara.hop(36);
      await sc.guard(say(pick(L.cakeCheer), { hold: 300 }));
      busy = false;
      stepToppings();
    }

    /* ② のせる */
    let tops = [], drag = null;
    const AUTO = [200, 335, 268, 130, 50, 0, 180, 90].map((d, i) => ring(d, i < 5 ? 0.55 : 0.25));
    function stepToppings() {
      step = 2;
      bar.innerHTML = '';
      tops = G.TOPPINGS.map((t, i) => {
        const b = UI.el('div', 'cake-top', `<div class="ctp-art">${PA.topping[t.id]()}</div><div class="ctp-label">${t.label}</div>`);
        UI.pos(b, 70 + i * 145, 800, 128, 128);
        bar.appendChild(b);
        sc.on(b, 'pointerdown', (e) => {
          if (step !== 2 || busy || drag) return;
          e.preventDefault(); e.stopPropagation();
          G.Sound.play('press');
          G.Voice.speak(t.label, 'guide');
          clearHand();
          const p = UI.toStage(e.clientX, e.clientY);
          const ghost = UI.el('div', 'cake-ghost', PA.topping[t.id]());
          UI.pos(ghost, p.x - 50, p.y - 70, 100, 100);
          scr.appendChild(ghost);
          drag = { id: e.pointerId, t, ghost, start: p, moved: 0 };
          try { scr.setPointerCapture(e.pointerId); } catch (_) { /* なし */ }
        });
        return b;
      });
      say(L.cakeTop);
      const r = UI.rectOf(tops[0]);
      hand = UI.hand(scr, { x: r.cx, y: r.cy }, { x: top.cx - 60, y: top.cy }, { times: 3 });
    }
    function putTopping(t, p, ghost) {
      // おいた ところ（ケーキの そとなら、あいている ところ）
      const q = inCake(p) ? onTop(p, 0.78) : AUTO[placed % AUTO.length];
      if (ghost) ghost.remove();
      addDeco(PA.topping[t.id](), q, 100, 'topping');
      G.Sound.play('place');
      UI.sparkles(q.x, q.y - 30, 3, 50);
      placed++;
      chara.flash('face_happy', 1400);
      chara.squish();
      if (placed === 2 || placed === 4) say(pick(L.cakeCheer), { hold: 200 });
      if (placed >= TOP_GOAL) { busy = true; sc.timeout(() => { busy = false; stepCandle(); }, 900); }
    }

    /* ③ ろうそく */
    let candleBtn = null, lit = false;
    function stepCandle() {
      step = 3;
      bar.innerHTML = '';
      candleBtn = UI.el('div', 'cake-tool candle-tool', `<div class="ct-art">${G.Art.all.item_candle()}</div><div class="ct-label">ろうそく</div>`);
      UI.pos(candleBtn, 400, 770, 180, 214);
      bar.appendChild(candleBtn);
      UI.tap(candleBtn, putCandle, { say: 'ろうそく' });
      say(L.cakeCandle);
      const r = UI.rectOf(candleBtn);
      hand = UI.hand(scr, { x: r.cx, y: r.cy });
    }
    async function putCandle() {
      if (step !== 3 || lit) return;
      lit = true; step = 4;
      clearHand();
      bubble.hide();
      candleBtn.style.opacity = '0.3';
      const p = { x: top.cx, y: top.cy - 6 };
      const cdl = addDeco(G.Art.all.item_candle(), { x: p.x, y: p.y + 30 }, 40, 'candle');
      cdl.style.height = '140px'; cdl.style.top = (p.y - 110) + 'px';
      G.Sound.play('place');
      await sc.wait(500);
      const flame = UI.el('div', 'candle-flame');
      UI.pos(flame, p.x - 15, p.y - 152, 30, 46);
      flame.style.zIndex = '2000';
      deco.appendChild(flame);
      G.Sound.play('chime');
      UI.sparkles(p.x, p.y - 130, 5, 60);
      await sc.wait(1200);
      // ニャーちゃんが ふーっ
      chara.face(-1);
      await sc.guard(chara.moveTo(930, 880, 700));
      say(L.cakeBlow, { hold: 200 });
      G.Sound.play('blow');
      const m = chara.mouth();
      for (let k = 0; k < 6; k++) {
        const w = UI.el('div', 'blow-puff');
        UI.pos(w, m.x - 20, m.y - 20 + (k % 3 - 1) * 16, 40, 40);
        scr.appendChild(w);
        w.animate([{ transform: 'translate(0,0) scale(.4)', opacity: 0.9 }, { transform: `translate(${p.x - m.x}px,${p.y - 130 - m.y}px) scale(1.4)`, opacity: 0 }], { duration: 700, delay: k * 60, easing: 'ease-out', fill: 'both' }).onfinish = () => w.remove();
      }
      await sc.wait(650);
      flame.remove();
      const smoke = UI.el('div', 'candle-smoke');
      UI.pos(smoke, p.x - 20, p.y - 160, 40, 60);
      deco.appendChild(smoke);
      smoke.animate([{ transform: 'translateY(0) scale(.6)', opacity: 0.7 }, { transform: 'translateY(-70px) scale(1.4)', opacity: 0 }], { duration: 1200, fill: 'forwards' }).onfinish = () => smoke.remove();
      G.Sound.play('fanfare');
      UI.sparkles(top.cx, top.cy - 40, 14, 240);
      UI.hearts(top.cx, top.cy - 60, 4);
      chara.setPose('face_happy');
      chara.hop(44);
      await sc.guard(say(L.cakeEat, { hold: 300 }));
      // いただきます
      chara.setPose('act_eat');
      for (let i = 0; i < 3; i++) {
        G.Sound.play('munch');
        chara.squish();
        const mm = chara.mouth();
        UI.word('もぐ', mm.x - 60 - i * 40, mm.y - 60 - i * 10, '#c98a5a', 42);
        await sc.wait(600);
      }
      chara.face(1);
      G.finishGame(sc, chara, bubble, placeBubble, L.cakeDone, meter, { fed: true });
    }

    /* ---- ゆび ---- */
    sc.on(scr, 'pointerdown', (e) => {
      if (e.target.closest('.btn-back, .bubble, .cake-tool, .cake-top')) return;
      const p = UI.toStage(e.clientX, e.clientY);
      if (step === 1 && !busy) {
        if (!cream) chooseCream(G.CREAMS[0]); // えらばずに ぬっても いい
        clearHand();
        rub = { id: e.pointerId, last: p, acc: 0, moved: 0, fromBag: false };
        if (inCake(p)) { showCursor(p); pipe(p); }
      } else if (step === 3 && inCake(p)) putCandle();
    });
    sc.on(scr, 'pointermove', (e) => {
      const p = UI.toStage(e.clientX, e.clientY);
      if (drag && e.pointerId === drag.id) {
        drag.moved += Math.hypot(p.x - drag.start.x, p.y - drag.start.y);
        drag.ghost.style.left = (p.x - 50) + 'px'; drag.ghost.style.top = (p.y - 70) + 'px';
        return;
      }
      if (!rub || e.pointerId !== rub.id || step !== 1) return;
      const dd = Math.hypot(p.x - rub.last.x, p.y - rub.last.y);
      rub.acc += dd; rub.moved += dd; rub.last = p;
      if (rub.fromBag || inCake(p)) showCursor(p);
      while (rub && rub.acc > 34) { rub.acc -= 34; if (inCake(p)) pipe(p); }
    });
    const up = (e) => {
      if (drag && e.pointerId === drag.id) {
        const d = drag; drag = null;
        const p = UI.toStage(e.clientX, e.clientY);
        putTopping(d.t, d.moved < 20 ? { x: -1, y: -1 } : p, d.ghost); // タップだけなら あいている ところへ
        return;
      }
      if (!rub || e.pointerId !== rub.id) return;
      const r = rub; rub = null;
      hideCursor();
      if (r.fromBag && r.moved < 30 && step === 1) autoPipe();
    };
    sc.on(scr, 'pointerup', up);
    sc.on(scr, 'pointercancel', up);

    sc.timeout(stepCream, 500);
  }
};
