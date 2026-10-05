/* ごはん・おふろ・ねんね */
window.G = window.G || {};
G.Screens = G.Screens || {};

/* ================= ごはん（5.4） ================= */
G.Screens.food = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, S = G.State, L = G.CHARACTER.lines;
    UI.backButton(scr, () => G.go('home'));
    const meter = G.oneMeter(scr, 'hunger');

    scr.appendChild(UI.pos(UI.el('div', 'food-table'), 10, 700, 740, 305));
    const chara = new G.Chara(scr, { x: 930, y: 800, h: 470 });
    chara.setMood('face_normal');
    chara.setPose('face_normal', 0);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.bubbleSpot(0.2); bubble.place(p.x, p.y, p.side); };
    sc.timeout(placeBubble, 30);

    // 4こずつ 2だんに ならべる（おくの だん → てまえの だん）
    const SIZE = 150;
    const items = G.FOODS.map((f, i) => {
      const card = UI.el('div', 'food-item');
      UI.pos(card, 40 + (i % 4) * 175, 645 + Math.floor(i / 4) * 185, SIZE, SIZE);
      card.appendChild(G.Assets.node(f.art, 'fi-art'));
      card.appendChild(UI.el('div', 'fi-label', f.label));
      scr.appendChild(card);
      return { f, card };
    });

    let busy = false, drag = null, hand = null;
    sc.timeout(() => { placeBubble(); bubble.say(L.foodIntro); }, 500);
    const showHand = () => {
      if (busy || drag) return;
      const r = UI.rectOf(items[0].card);
      hand = UI.hand(scr, { x: r.cx, y: r.cy }, chara.mouth(), { times: 2 });
    };
    sc.timeout(showHand, 3000);
    sc.interval(() => { if (!busy && !drag) { placeBubble(); bubble.say(L.foodHint); showHand(); } }, 14000);

    const near = (p) => { const m = chara.mouth(); return Math.hypot(p.x - m.x, p.y - m.y) < 220; };

    items.forEach(({ f, card }) => {
      sc.on(card, 'pointerdown', (e) => {
        if (busy || drag) return;
        e.preventDefault();
        G.Sound.play('press');
        if (hand) hand.remove();
        G.Voice.speak(f.label, 'guide');
        const p = UI.toStage(e.clientX, e.clientY);
        const r = UI.rectOf(card);
        const ghost = G.Assets.node(f.art, 'food-ghost');
        UI.pos(ghost, r.x, r.y, SIZE, SIZE);
        scr.appendChild(ghost);
        ghost.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }], { duration: 150, fill: 'forwards' });
        card.classList.add('taken');
        drag = { id: e.pointerId, f, card, ghost, off: { x: p.x - r.x, y: p.y - r.y }, x: r.x, y: r.y };
        try { card.setPointerCapture(e.pointerId); } catch (_) { /* なし */ }
      });
      sc.on(card, 'pointermove', (e) => {
        if (!drag || e.pointerId !== drag.id) return;
        const p = UI.toStage(e.clientX, e.clientY);
        drag.x = p.x - drag.off.x; drag.y = p.y - drag.off.y;
        drag.ghost.style.left = drag.x + 'px'; drag.ghost.style.top = drag.y + 'px';
        const c = { x: drag.x + SIZE / 2, y: drag.y + SIZE / 2 };
        if (near(c) && chara.pose !== 'face_happy') { chara.setPose('face_happy'); G.Sound.play('meow'); }
        else if (!near(c) && chara.pose === 'face_happy') chara.setPose('face_normal');
      });
      const up = (e) => {
        if (!drag || e.pointerId !== drag.id) return;
        const d = drag; drag = null;
        eat(d); // はなしただけでも食べる（F-31 救済）
      };
      sc.on(card, 'pointerup', up);
      sc.on(card, 'pointercancel', up);
    });

    async function eat(d) {
      busy = true;
      bubble.hide();
      const m = chara.mouth();
      const tx = m.x - 75, ty = m.y - 50;
      d.ghost.style.transition = 'left .45s ease-in-out, top .45s ease-in-out, transform .25s ease';
      d.ghost.style.left = tx + 'px'; d.ghost.style.top = ty + 'px';
      d.ghost.style.width = '150px'; d.ghost.style.height = '150px';
      await sc.wait(460);
      chara.setPose('act_eat');
      G.Voice.speak(L.foodEat, 'chara');
      for (let i = 0; i < 3; i++) {
        G.Sound.play('munch');
        chara.squish();
        UI.word('もぐ', m.x + 70 - i * 40, m.y - 60 - i * 10, '#c98a5a', 42);
        d.ghost.getAnimations().forEach(a => a.cancel());
        d.ghost.style.transform = `scale(${1 - (i + 1) * 0.3})`;
        UI.sparkles(m.x, m.y + 30, 2, 50, '#fff1d6');
        await sc.wait(650);
      }
      d.ghost.remove();
      const fav = S.favoriteFood() === d.f.id;
      S.setMeter('hunger', 5);
      meter.update(true);
      G.Sound.play('chime');
      chara.setPose('face_happy');
      chara.hop(40);
      UI.hearts(m.x, m.y - 40, fav ? 5 : 3);
      UI.giveHearts(fav ? 3 : 1, m.x, m.y);
      if (fav) { UI.sparkles(m.x, m.y - 60, 10, 160); UI.word('だいすき！', m.x - 40, m.y - 160, '#e7799a', 56); }
      placeBubble();
      await sc.guard(bubble.say(fav ? L.foodFav : L.foodDone));
      await sc.wait(500);
      G.go('home');
    }
  }
};

/* ================= おふろ（5.5） ================= */
G.Screens.bath = {
  bg: 'bg_bath', hud: true,
  enter(scr, sc) {
    const UI = G.UI, S = G.State, L = G.CHARACTER.lines;
    UI.backButton(scr, () => G.go('home'));
    const meter = G.oneMeter(scr, 'clean');

    const chara = new G.Chara(scr, { x: 683, y: 778, h: 460, acc: false }); // アクセサリーは はずして おふろ
    chara.setMood('face_normal');
    chara.setPose('face_normal', 0);
    const foamLayer = UI.el('div', 'foam-layer');
    scr.appendChild(foamLayer);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.bubbleSpot(0.34); bubble.place(p.x, p.y, p.side); };
    sc.timeout(placeBubble, 30);

    const TOOLS = [
      { id: 'sponge', art: 'item_sponge', label: 'スポンジ' },
      { id: 'shower', art: 'item_shower', label: 'シャワー' },
      { id: 'towel', art: 'item_towel', label: 'タオル' }
    ];
    const tools = TOOLS.map((t, i) => {
      const e = UI.el('div', 'tool');
      e.dataset.i = i;
      UI.pos(e, 373 + i * 220, 818, 180, 190);
      e.appendChild(G.Assets.node(t.art, 't-art'));
      e.appendChild(UI.el('div', 't-label', t.label));
      scr.appendChild(e);
      return e;
    });
    const cursor = UI.el('div', 'rub-cursor');
    scr.appendChild(cursor);

    let step = -1, progress = 0, busy = false, rub = null, hand = null, foams = [], lastSnd = 0, showering = false;
    const STEP_LINES = [L.bathIntro, L.bathShower, L.bathTowel];
    const GOAL = [26, 0, 20];

    function setStep(n) {
      step = n; progress = 0;
      tools.forEach((t, i) => { t.classList.toggle('active', i === n); t.classList.toggle('done', i < n); });
      cursor.innerHTML = '';
      if (n === 0 || n === 2) cursor.appendChild(G.Assets.node(TOOLS[n].art, 'rc-art'));
      if (hand) hand.remove();
      const tr = UI.rectOf(tools[n]), mr = chara.rect();
      hand = n === 1 ? UI.hand(scr, { x: tr.cx, y: tr.cy }) : UI.hand(scr, { x: tr.cx, y: tr.cy }, { x: mr.cx, y: mr.y + mr.h * 0.66 }, { times: 3 }); // ゆびの先は むね（顔にかけない）
      placeBubble();
      bubble.say(STEP_LINES[n]);
    }
    sc.timeout(() => setStep(0), 500);

    const inZone = (p) => { const r = chara.rect(); return p.x > r.x - 40 && p.x < r.x + r.w + 40 && p.y > r.y - 20 && p.y < r.y + r.h + 20; };
    const showCursor = (p) => { cursor.classList.add('on'); cursor.style.left = p.x + 'px'; cursor.style.top = p.y + 'px'; };

    function addMark(p, n) {
      if (step === 0) {
        for (let k = 0; k < n; k++) {
          const s = 34 + Math.random() * 46;
          const f = UI.el('div', 'foam');
          UI.pos(f, p.x - s / 2 + (Math.random() - 0.5) * 70, p.y - s / 2 + (Math.random() - 0.5) * 60, s, s);
          foamLayer.appendChild(f);
          f.animate([{ transform: 'scale(0)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 300 });
          foams.push(f);
          if (foams.length > 60) foams.shift().remove();
        }
        if (Date.now() - lastSnd > 90) { G.Sound.play('bubble'); lastSnd = Date.now(); }
      } else if (step === 2) {
        for (let k = 0; k < n; k++) {
          const s = 40 + Math.random() * 40;
          const f = UI.el('div', 'puff');
          UI.pos(f, p.x - s / 2 + (Math.random() - 0.5) * 60, p.y - s / 2 + (Math.random() - 0.5) * 50, s, s);
          foamLayer.appendChild(f);
          f.animate([{ transform: 'scale(.3)', opacity: 0.9 }, { transform: 'scale(1.4) translateY(-30px)', opacity: 0 }], { duration: 900, fill: 'forwards' }).onfinish = () => f.remove();
        }
        if (Math.random() < 0.3) UI.sparkles(p.x, p.y, 1, 40);
        if (Date.now() - lastSnd > 220) { G.Sound.play('swish'); lastSnd = Date.now(); }
      } else return;
      if (Math.random() < 0.25) chara.squish();
      progress += n;
      if (progress >= GOAL[step]) { if (step === 0) foamDone(); else towelDone(); }
    }

    async function autoRub() { // タップだけでも（N-06 救済）
      if (busy) return;
      busy = true;
      const r = chara.rect();
      const cx = r.cx, cy = r.y + r.h * 0.5;
      const s0 = step;
      // その手順が おわるまで くるくる こする
      for (let i = 0; i < 40 && step === s0 && (s0 === 0 || s0 === 2); i++) {
        const a = i / 12 * Math.PI * 2;
        const p = { x: cx + Math.cos(a) * r.w * 0.28, y: cy + Math.sin(a) * r.h * 0.26 };
        showCursor(p);
        addMark(p, 2);
        await sc.wait(130);
      }
      cursor.classList.remove('on');
      busy = false;
    }

    async function foamDone() {
      busy = true; step = -1;
      cursor.classList.remove('on');
      rub = null;
      if (hand) hand.remove();
      S.clearMakeup(); // メイクは あわで おちる
      chara.setPose('act_foam');
      G.Sound.play('sparkle');
      chara.wiggle();
      placeBubble();
      bubble.say(L.bathFoam, { hold: 300 });
      await sc.wait(1100); // 話し終わるのを待たずに、すぐシャワーを押せるようにする
      busy = false;
      setStep(1);
    }

    async function shower() {
      if (showering || step !== 1) return;
      showering = true; busy = true;
      if (hand) hand.remove();
      bubble.hide();
      tools[1].classList.remove('active');
      const r = chara.rect();
      const head = UI.el('div', 'shower-head');
      head.appendChild(G.Assets.node('item_shower', 'sh-art'));
      UI.pos(head, r.cx - 40, r.y - 190, 220, 220);
      scr.appendChild(head);
      head.animate([{ opacity: 0, transform: 'translateY(-60px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 400, fill: 'both' });
      G.Sound.shower(true);
      const t0 = Date.now();
      const dropTimer = sc.interval(() => {
        for (let k = 0; k < 3; k++) {
          const d = UI.el('div', 'drop');
          const x = r.cx + 20 + (Math.random() - 0.5) * r.w * 0.75;
          UI.pos(d, x, r.y - 40, 14, 30);
          scr.appendChild(d);
          d.animate([{ transform: 'translateY(0)', opacity: 0.9 }, { transform: `translateY(${r.h * 0.9}px)`, opacity: 0.2 }], { duration: 700 + Math.random() * 300, easing: 'ease-in' }).onfinish = () => d.remove();
        }
      }, 70);
      const popTimer = sc.interval(() => {
        const f = foams.splice(Math.floor(Math.random() * foams.length), 1)[0];
        if (!f) return;
        f.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.3)', opacity: 0 }], { duration: 250, fill: 'forwards' }).onfinish = () => f.remove();
        if (Math.random() < 0.4) G.Sound.play('popBubble');
      }, 60);
      await sc.wait(1500);
      chara.setPose('face_happy', 600);
      await sc.wait(Math.max(0, 3200 - (Date.now() - t0)));
      clearInterval(dropTimer); clearInterval(popTimer);
      foams.forEach(f => f.remove()); foams = [];
      G.Sound.shower(false);
      head.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }).onfinish = () => head.remove();
      chara.wiggle();
      await sc.wait(500);
      busy = false; showering = false;
      setStep(2);
    }

    async function towelDone() {
      busy = true; step = 3;
      cursor.classList.remove('on');
      rub = null;
      if (hand) hand.remove();
      tools.forEach(t => { t.classList.remove('active'); t.classList.add('done'); });
      chara.setPose('act_fluffy', 400);
      G.Sound.play('sparkle');
      setTimeout(() => G.Sound.play('chime'), 300);
      const r = chara.rect();
      for (let k = 0; k < 4; k++) sc.timeout(() => UI.sparkles(r.x + Math.random() * r.w, r.y + Math.random() * r.h * 0.8, 5, 90), k * 250);
      chara.hop(46);
      S.setMeter('clean', 5);
      meter.update(true);
      UI.giveHearts(2, r.cx, r.y + r.h * 0.3);
      placeBubble();
      await sc.guard(bubble.say(L.bathDone));
      await sc.wait(600);
      G.go('home');
    }

    /* ゆびの操作 */
    sc.on(scr, 'pointerdown', (e) => {
      if (e.target.closest('.btn-back, .bubble')) return;
      const p = UI.toStage(e.clientX, e.clientY);
      const toolEl = e.target.closest('.tool');
      if (toolEl) {
        G.Sound.play('press');
        const i = parseInt(toolEl.dataset.i, 10);
        toolEl.animate([{ transform: 'scale(1)' }, { transform: 'scale(.9)' }, { transform: 'scale(1)' }], { duration: 200 });
        if (i !== step) {
          if (step >= 0 && step <= 2) { placeBubble(); bubble.say(STEP_LINES[step]); }
          return;
        }
        if (step === 1) { shower(); return; }
        if (busy) return;
        rub = { id: e.pointerId, last: p, acc: 0, moved: 0, fromTool: true };
        showCursor(p);
        if (hand) hand.remove();
        return;
      }
      if (step === 1) { shower(); return; }
      if (busy || (step !== 0 && step !== 2)) return;
      rub = { id: e.pointerId, last: p, acc: 0, moved: 0, fromTool: false };
      if (hand) hand.remove();
      if (inZone(p)) { showCursor(p); addMark(p, 3); }
    });
    sc.on(scr, 'pointermove', (e) => {
      if (!rub || e.pointerId !== rub.id || busy) return;
      const p = UI.toStage(e.clientX, e.clientY);
      const dd = Math.hypot(p.x - rub.last.x, p.y - rub.last.y);
      rub.acc += dd; rub.moved += dd; rub.last = p;
      if (rub.fromTool || inZone(p)) showCursor(p);
      while (rub && rub.acc > 36) { rub.acc -= 36; if (inZone(p)) addMark(p, 1); }
    });
    const up = (e) => {
      if (!rub || e.pointerId !== rub.id) return;
      const r = rub; rub = null;
      cursor.classList.remove('on');
      if (r.fromTool && r.moved < 30) autoRub();
    };
    sc.on(scr, 'pointerup', up);
    sc.on(scr, 'pointercancel', up);
  }
};

/* ================= ねんね（5.7） ================= */
G.Screens.sleep = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, S = G.State, L = G.CHARACTER.lines;
    UI.backButton(scr, () => G.go('home'));
    const meter = G.oneMeter(scr, 'energy');
    const hour = new Date().getHours();
    const night = hour >= 20 || hour < 5;

    const cushion = UI.el('div', 'cushion glow');
    UI.pos(cushion, 451, 600, 464, 303); // ねている絵より ひとまわり大きく
    cushion.appendChild(G.Assets.node('item_cushion', 'cu-art'));
    scr.appendChild(cushion);
    const chara = new G.Chara(scr, { x: 290, y: 800, h: 440 });
    chara.setMood('face_sleepy');
    chara.setPose('face_sleepy', 0);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.bubbleSpot(0.3); bubble.place(p.x, p.y, p.side); };
    sc.timeout(placeBubble, 30);

    let started = false, hand = null;
    sc.timeout(() => {
      placeBubble();
      bubble.say(L.sleepIntro);
      const r = UI.rectOf(cushion);
      hand = UI.hand(scr, { x: r.cx + 20, y: r.cy - 20 });
    }, 500);
    UI.tap(cushion, start, { sound: 'soft' });
    UI.tap(chara.el, start, { sound: 'soft' }); // ニャーちゃんをさわっても ねんね（救済）

    async function start() {
      if (started) return;
      started = true;
      if (hand) hand.remove();
      cushion.classList.remove('glow');
      bubble.hide();
      G.Sound.play('yawn');
      chara.setPose('face_sleepy');
      chara.face(1);
      await sc.guard(chara.moveTo(683, 772, 1100)); // とちゅうで「もどる」を おしたら ここで やめる
      chara.setPose('act_sleep', 500);
      G.setBg('bg_room_night');
      chara.setNight(true);
      G.Sound.play('lightsOff');
      G.Sound.playBgm('lullaby');
      const stars = [];
      [[240, 200], [520, 140], [760, 260], [1180, 180], [380, 420], [1240, 420], [640, 400]].forEach(([x, y], i) => {
        const s = UI.el('div', 'star-tw', G.Art.sparkle('#fff6c9'));
        UI.pos(s, x, y, 34, 34);
        s.style.animationDelay = (i * 0.4) + 's';
        scr.appendChild(s);
        stars.push(s);
      });
      const zt = sc.interval(() => { const h = chara.point(0.78, 0.3); UI.zzz(h.x, h.y); }, 1400);
      const p = chara.topSpot(0.55, 0.02); // 頭の上に出す（ピアノやランプを かくさない）
      bubble.place(p.x, p.y, p.side);
      bubble.say(L.sleepGo, { hold: 600 });
      S.setMeter('energy', 5);
      sc.timeout(() => meter.update(true), 2500);

      if (night) { // 夜はおしまいをうながす（F-63）
        await sc.wait(4200);
        bubble.say(L.sleepNight, { keep: true });
        UI.giveHearts(1, p.x, p.y);
        await sc.wait(1500);
        const gn = UI.el('div', 'btn-big btn-goodnight', '<span>おやすみなさい</span>');
        scr.appendChild(gn);
        let tapped = false;
        UI.tap(gn, () => { tapped = true; G.go('end', { reason: 'night' }); }, { say: 'おやすみなさい' });
        sc.timeout(() => { if (!tapped) { const r = UI.rectOf(gn); UI.hand(scr, { x: r.x + r.w - 10, y: r.cy + 10 }); } }, 1500); // 文字にかからない右はし
        return;
      }

      await sc.wait(10500); // 10びょう ほどで おきる（F-62）
      clearInterval(zt);
      stars.forEach(s => s.remove());
      G.setBg('bg_room');
      G.Sound.playBgm('room');
      chara.setNight(false);
      G.Sound.play('wake');
      chara.setPose('face_happy', 400);
      chara.hop(50);
      const r = chara.rect();
      UI.sparkles(r.cx, r.y + r.h * 0.3, 8, 140);
      S.addMeter('hunger', -0.5);
      UI.giveHearts(1, r.cx, r.y + r.h * 0.3);
      placeBubble();
      await sc.guard(bubble.say(L.sleepWake));
      await sc.wait(500);
      G.go('home');
    }
  }
};
