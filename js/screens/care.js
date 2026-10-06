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

    // おくの だんに 5こ、てまえの だんに 4こ ならべる（G.FOODS の はじめの 5こが おく）。
    // まんなかの クロワッサンは 名前が ながいので、まわりを すこし あける
    const SIZE = 140, BACK_X = [14, 156, 314, 472, 614], FRONT_X = [50, 225, 400, 575];
    const items = G.FOODS.map((f, i) => {
      const card = UI.el('div', 'food-item');
      const back = i < BACK_X.length;
      UI.pos(card, back ? BACK_X[i] : FRONT_X[i - BACK_X.length], back ? 650 : 835, SIZE, SIZE);
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

/* ================= おふろ（5.5） =================
 * ニャーちゃんは バスタブに つかっている。4つの じゅんばんで すすむ:
 * ① せっけんを えらんで こする（ラベンダー・さくら。あわの 色と 舞う 花びらが かわる）
 * ② じゃぐちを タッチ → ニャーちゃんが じぶんで シャワーを もつ。のこった あわを ゆびで こすって ながす
 * ③ すきな おもちゃで あそぶ（アヒルちゃん・おふね・じょうろ・おさかな。おもちゃは いつでも あそべる）
 * ④ バスタブから でて、タオルで ふく
 * タップだけでも すすむ（N-06 救済） */
G.Screens.bath = {
  bg: 'bg_bath', hud: true,
  enter(scr, sc) {
    const UI = G.UI, S = G.State, L = G.CHARACTER.lines;
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    UI.backButton(scr, () => G.go('home'));
    const meter = G.oneMeter(scr, 'clean');
    const node = (key, cls) => G.Assets.node(key, cls);
    const put = (cls, key, x, y, w, h) => { const e = UI.el('div', cls); UI.pos(e, x, y, w, h); if (key) e.appendChild(node(key, 'b-art')); scr.appendChild(e); return e; };

    /* ---- バスタブ（うしろ・まえ の 2まいで ニャーちゃんを はさむ） ---- */
    const TUB = { x: 180, y: 650, w: 760, h: 380 };
    const WATER = TUB.y + 72; // お湯の 面の 高さ（ここより 下は お湯の 中）
    put('tub tub-back', 'bath_tub_back', TUB.x, TUB.y, TUB.w, TUB.h);
    const IN_TUB = { x: 560, y: 850 }, OUT = { x: 1180, y: 995 };
    const chara = new G.Chara(scr, { x: IN_TUB.x, y: IN_TUB.y, h: 440, acc: false }); // アクセサリーは はずして おふろ
    chara.setMood('face_normal');
    chara.setPose('face_normal', 0);
    put('tub tub-front', 'bath_tub_front', TUB.x, TUB.y, TUB.w, TUB.h);
    let inTub = true;

    /* ---- かべの もの：じゃぐち・シャワー・せっけん・タオル ---- */
    const FAUCET = { x: 200, y: 540, w: 150, h: 130 };
    const faucet = put('bath-thing faucet', 'bath_faucet', FAUCET.x, FAUCET.y, FAUCET.w, FAUCET.h);
    const HOSE_FROM = { x: FAUCET.x + 28, y: FAUCET.y + 104 }; // じゃぐちの 下の ホースの 口
    // シャワーの 絵の 中の 点：hose = ホースが つく はし、hold = 手で もつ ところ、face = あなの 面の まんなか（水は 右下へ 出る）
    const SH = { w: 150, h: 150, hose: { x: 21, y: 129 }, hold: { x: 52, y: 98 }, face: { x: 112, y: 56 } };
    const SH_REST = { x: 40, y: 455, rot: 0 }; // かべの ホルダー
    const hose = UI.el('div', 'hose', '<svg viewBox="0 0 1366 1024"><path class="h-out" d=""/><path class="h-in" d=""/></svg>');
    scr.appendChild(hose);
    const shower = put('shower', 'item_shower', 0, 0, SH.w, SH.h);
    const sh = { x: SH_REST.x, y: SH_REST.y, rot: SH_REST.rot };
    const shPoint = (q) => { // シャワーの 絵の 中の 点 → ステージ
      const a = sh.rot * Math.PI / 180, dx = q.x - SH.w / 2, dy = q.y - SH.h / 2;
      return { x: sh.x + SH.w / 2 + dx * Math.cos(a) - dy * Math.sin(a), y: sh.y + SH.h / 2 + dx * Math.sin(a) + dy * Math.cos(a) };
    };
    const drawShower = () => {
      shower.style.transform = `translate(${sh.x}px,${sh.y}px) rotate(${sh.rot}deg)`;
      const g = shPoint(SH.hose), f = HOSE_FROM;
      const d = `M${f.x} ${f.y}C${f.x - 40} ${f.y + 140} ${g.x - 30} ${g.y + 150} ${g.x} ${g.y}`;
      hose.querySelectorAll('path').forEach(p => p.setAttribute('d', d));
    };
    shower.style.left = '0px'; shower.style.top = '0px';
    drawShower();

    const SOAP_SPOT = [{ x: 982, y: 500 }, { x: 1148, y: 500 }];
    const soaps = G.SOAPS.map((s, i) => ({ s, e: put('bath-thing soap', s.art, SOAP_SPOT[i].x, SOAP_SPOT[i].y, 140, 110) }));
    const towel = put('bath-thing towel-hang', 'item_towel', 1080, 296, 180, 170);

    /* ---- おもちゃ（いつでも あそべる） ---- */
    const TOYS = {
      duck: { x: 236, y: WATER + 12 - 108, w: 130, h: 120, float: true },
      boat: { x: 756, y: WATER + 14 - 125, w: 150, h: 140, float: true },
      can:  { x: 22,  y: 836, w: 160, h: 130 },
      fish: { x: 940, y: 878, w: 150, h: 110 }
    };
    const toys = G.BATH_TOYS.map(t => {
      const p = TOYS[t.id];
      const e = UI.el('div', 'bath-toy' + (p.float ? ' float' : ''));
      UI.pos(e, p.x, p.y, p.w, p.h);
      const inner = UI.el('div', 'bt-in');
      inner.appendChild(node(t.art, 'b-art'));
      e.appendChild(inner);
      scr.appendChild(e);
      return { t, p, e, inner, busy: false };
    });

    const foamLayer = UI.el('div', 'foam-layer');
    scr.appendChild(foamLayer);
    const cursor = UI.el('div', 'rub-cursor');
    scr.appendChild(cursor);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.bubbleSpot(0.2); bubble.place(p.x, p.y, p.side); };
    sc.timeout(placeBubble, 30);

    /* ---- いま どこまで すすんだか（左上の 4つの まる） ---- */
    const STEP_ART = ['item_soap_lavender', 'item_shower', 'toy_duck', 'item_towel'];
    const steps = UI.el('div', 'bath-steps');
    const dots = STEP_ART.map(k => { const d = UI.el('div', 'bs-dot'); d.appendChild(node(k, 'b-art')); steps.appendChild(d); return d; });
    scr.appendChild(steps);

    let step = -1, progress = 0, busy = false, rub = null, hand = null, foams = [], lastSnd = 0;
    let soap = null, showering = false, showerTimers = [], toyPlays = 0;
    const STEP_LINES = [L.bathIntro, L.bathShower, L.bathToy, L.bathTowel];
    const GOAL = { 0: 26, 3: 20 };
    const TOY_GOAL = 3;
    const targets = () => [soaps.map(o => o.e), [faucet], toys.map(o => o.e), [towel]][step] || [];

    function setStep(n) {
      step = n; progress = 0;
      dots.forEach((d, i) => { d.classList.toggle('active', i === n); d.classList.toggle('done', i < n); });
      [...soaps.map(o => o.e), faucet, ...toys.map(o => o.e), towel].forEach(e => e.classList.remove('active'));
      targets().forEach(e => e.classList.add('active'));
      cursor.innerHTML = '';
      if (n === 3) cursor.appendChild(node('item_towel', 'rc-art'));
      hint();
      placeBubble();
      bubble.say(STEP_LINES[n]);
    }
    // 手の ヒント：その じゅんばんで さわる ものを ゆびさす
    function hint() {
      if (hand) { hand.remove(); hand = null; }
      const mr = chara.rect();
      const chest = { x: mr.cx, y: Math.min(WATER - 40, mr.y + mr.h * 0.55) };
      if (step === 0) { const r = UI.rectOf((soap ? soaps.find(o => o.s === soap) : soaps[0]).e); hand = UI.hand(scr, { x: r.cx, y: r.cy }, chest, { times: 3 }); }
      else if (step === 1 && !showering) { const r = UI.rectOf(faucet); hand = UI.hand(scr, { x: r.cx + 10, y: r.cy - 20 }); }
      else if (step === 2) { const r = UI.rectOf(toys[toyPlays % toys.length].e); hand = UI.hand(scr, { x: r.cx, y: r.cy }); }
      else if (step === 3) { const r = UI.rectOf(towel); hand = UI.hand(scr, { x: r.cx, y: r.cy }, { x: mr.cx, y: mr.y + mr.h * 0.6 }, { times: 3 }); }
    }
    sc.timeout(() => setStep(0), 500);
    sc.interval(() => { if (!busy && !rub && step >= 0 && step <= 3 && !showering) hint(); }, 12000);

    // こすれる ところ = ニャーちゃんの 見えている ところ（お湯の 中は のぞく）
    const inZone = (p) => {
      const r = chara.rect();
      const bottom = inTub ? WATER - 6 : r.y + r.h + 20;
      return p.x > r.x + r.w * 0.12 && p.x < r.x + r.w * 0.88 && p.y > r.y - 20 && p.y < bottom;
    };
    const showCursor = (p) => { cursor.classList.add('on'); cursor.style.left = p.x + 'px'; cursor.style.top = p.y + 'px'; };

    function addFoam(x, y, s) {
      const f = UI.el('div', 'foam');
      UI.pos(f, x - s / 2, y - s / 2, s, s);
      f.style.setProperty('--fc', soap.foam);
      f.style.setProperty('--fe', soap.edge);
      foamLayer.appendChild(f);
      f.animate([{ transform: 'scale(0)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 300 });
      foams.push(f);
      if (foams.length > 70) foams.shift().remove();
    }
    // 花びらが ふわっと 舞う
    function petal(x, y) {
      const s = 34 + Math.random() * 18;
      const e = UI.el('div', 'petal');
      e.appendChild(node(soap.petal, 'b-art'));
      UI.pos(e, x - s / 2, y - s / 2, s, s);
      scr.appendChild(e);
      const dx = (Math.random() - 0.5) * 220, up = 80 + Math.random() * 90, rot = (Math.random() - 0.5) * 540;
      e.animate([
        { transform: 'translate(0,0) rotate(0deg) scale(.4)', opacity: 0 },
        { transform: `translate(${dx * 0.4}px,${-up}px) rotate(${rot * 0.4}deg) scale(1)`, opacity: 1, offset: 0.3 },
        { transform: `translate(${dx}px,${-up * 0.4}px) rotate(${rot}deg) scale(.9)`, opacity: 0 }
      ], { duration: 1800 + Math.random() * 600, easing: 'ease-out', fill: 'both' }).onfinish = () => e.remove();
    }
    function popFoam(f) {
      const i = foams.indexOf(f);
      if (i < 0) return;
      foams.splice(i, 1);
      f.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.3)', opacity: 0 }], { duration: 250, fill: 'forwards' }).onfinish = () => f.remove();
      if (Math.random() < 0.4) G.Sound.play('popBubble');
    }

    function addMark(p, n) {
      if (step === 0) {
        if (!soap) return;
        for (let k = 0; k < n; k++) addFoam(p.x + (Math.random() - 0.5) * 70, p.y + (Math.random() - 0.5) * 60, 34 + Math.random() * 46);
        if (Math.random() < 0.35) petal(p.x, p.y);
        if (Date.now() - lastSnd > 90) { G.Sound.play('bubble'); lastSnd = Date.now(); }
      } else if (step === 1) {
        if (!showering) return;
        foams.filter(f => { const r = UI.rectOf(f); return Math.hypot(r.cx - p.x, r.cy - p.y) < 90; }).forEach(popFoam);
        if (!foams.length) rinseDone();
        return;
      } else if (step === 3) {
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
      const s0 = step;
      for (let i = 0; i < 40 && step === s0 && (s0 === 0 || s0 === 3); i++) {
        const r = chara.rect();
        const cx = r.cx, cy = inTub ? (r.y + WATER) / 2 : r.y + r.h * 0.5;
        const ry = inTub ? (WATER - r.y) * 0.32 : r.h * 0.26;
        const a = i / 12 * Math.PI * 2;
        const p = { x: cx + Math.cos(a) * r.w * 0.24, y: cy + Math.sin(a) * ry };
        showCursor(p);
        addMark(p, 2);
        await sc.wait(130);
      }
      cursor.classList.remove('on');
      busy = false;
    }

    /* ① せっけん */
    function chooseSoap(o) {
      soap = o.s;
      G.Voice.speak(soap.label, 'guide');
      soaps.forEach(x => x.e.classList.toggle('taken', x === o));
      cursor.innerHTML = '';
      cursor.appendChild(node(soap.art, 'rc-art'));
      o.e.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 260 });
    }
    async function foamDone() {
      busy = true; step = -1;
      cursor.classList.remove('on');
      rub = null;
      if (hand) { hand.remove(); hand = null; }
      soaps.forEach(x => x.e.classList.remove('taken', 'active'));
      S.clearMakeup(); // メイクは あわで おちる
      // あたまの 上にも あわを のせる
      const r = chara.rect();
      for (let k = 0; k < 7; k++) addFoam(r.x + r.w * (0.36 + k * 0.045), r.y + r.h * (0.08 + (k % 2) * 0.04), 46 + Math.random() * 26);
      for (let k = 0; k < 5; k++) sc.timeout(() => petal(r.x + r.w * (0.3 + Math.random() * 0.4), r.y + r.h * 0.2), k * 120);
      chara.setPose('face_happy');
      G.Sound.play('sparkle');
      chara.wiggle();
      placeBubble();
      bubble.say(L.bathFoam, { hold: 300 });
      await sc.wait(1100); // 話し終わるのを待たずに、すぐ つぎへ すすめるようにする
      busy = false;
      setStep(1);
    }

    /* ② シャワー：ニャーちゃんが じぶんで もつ */
    async function startShower() {
      if (showering || step !== 1 || busy) return;
      showering = true; busy = true;
      if (hand) { hand.remove(); hand = null; }
      faucet.classList.remove('active');
      faucet.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(0)' }], { duration: 420 });
      bubble.hide();
      chara.setPose('act_wave', 200);
      await sc.wait(260);
      // ホルダーから ニャーちゃんの 手へ
      const paw = chara.point(G.CHARACTER.showerPaw.x, G.CHARACTER.showerPaw.y);
      const rot = -20, a = rot * Math.PI / 180, hx = SH.hold.x - SH.w / 2, hy = SH.hold.y - SH.h / 2;
      const to = { x: paw.x - SH.w / 2 - (hx * Math.cos(a) - hy * Math.sin(a)), y: paw.y - SH.h / 2 - (hx * Math.sin(a) + hy * Math.cos(a)), rot };
      const from = { ...sh }, t0 = performance.now();
      await new Promise(res => {
        const step2 = (now) => {
          if (!sc.alive) return res();
          const k = Math.min(1, (now - t0) / 650), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          sh.x = from.x + (to.x - from.x) * e; sh.y = from.y + (to.y - from.y) * e - Math.sin(k * Math.PI) * 80; sh.rot = from.rot + (to.rot - from.rot) * e;
          drawShower();
          if (k < 1) requestAnimationFrame(step2); else res();
        };
        requestAnimationFrame(step2);
      });
      if (!sc.alive) return;
      G.Sound.shower(true);
      // 水を ニャーちゃんの あたまへ
      const drops = sc.interval(() => {
        const f = shPoint(SH.face), r = chara.rect();
        for (let k = 0; k < 3; k++) {
          const d = UI.el('div', 'drop');
          UI.pos(d, f.x, f.y, 14, 30);
          scr.appendChild(d);
          const tx = r.x + r.w * (0.38 + Math.random() * 0.36) - f.x, ty = r.y + r.h * (0.05 + Math.random() * 0.1) - f.y;
          d.animate([
            { transform: 'translate(0,0) rotate(-40deg)', opacity: 0.9 },
            { transform: `translate(${tx}px,${ty}px) rotate(-20deg)`, opacity: 0.9, offset: 0.45 },
            { transform: `translate(${tx + (Math.random() - 0.5) * 60}px,${WATER - f.y}px) rotate(0deg)`, opacity: 0.2 }
          ], { duration: 800 + Math.random() * 300, easing: 'ease-in' }).onfinish = () => d.remove();
        }
      }, 80);
      // お湯だけでも すこしずつ ながれる（救済）。ゆびで こすると はやく ながれる
      const slow = sc.interval(() => { if (foams.length) popFoam(foams[Math.floor(Math.random() * foams.length)]); if (!foams.length) rinseDone(); }, 260);
      showerTimers = [drops, slow];
      placeBubble();
      bubble.say(L.bathRinse, { hold: 200 });
      busy = false;
    }
    async function rinseDone() {
      if (!showering || busy) return;
      busy = true; step = -1;
      showerTimers.forEach(t => clearInterval(t)); showerTimers = [];
      foams.forEach(f => f.remove()); foams = [];
      G.Sound.shower(false);
      // シャワーを ホルダーに もどす
      const from = { ...sh }, t0 = performance.now();
      chara.setPose('face_happy', 300);
      await new Promise(res => {
        const back = (now) => {
          if (!sc.alive) return res();
          const k = Math.min(1, (now - t0) / 600), e = 1 - Math.pow(1 - k, 2);
          sh.x = from.x + (SH_REST.x - from.x) * e; sh.y = from.y + (SH_REST.y - from.y) * e; sh.rot = from.rot + (SH_REST.rot - from.rot) * e;
          drawShower();
          if (k < 1) requestAnimationFrame(back); else res();
        };
        requestAnimationFrame(back);
      });
      showering = false;
      chara.wiggle();
      G.Sound.play('sparkle');
      const r = chara.rect();
      UI.sparkles(r.cx, r.y + r.h * 0.2, 6, 120);
      await sc.wait(500);
      busy = false;
      setStep(2);
    }

    /* ③ おもちゃ */
    const ripple = (x, y) => {
      for (let k = 0; k < 2; k++) {
        const e = UI.el('div', 'ripple');
        UI.pos(e, x - 40, y - 10, 80, 20);
        scr.appendChild(e);
        e.animate([{ transform: 'scale(.4)', opacity: 0.9 }, { transform: 'scale(1.8)', opacity: 0 }], { duration: 900, delay: k * 250, fill: 'both' }).onfinish = () => e.remove();
      }
    };
    const splash = (x, y, n = 6) => {
      for (let k = 0; k < n; k++) {
        const d = UI.el('div', 'drop');
        UI.pos(d, x - 7, y - 15, 14, 30);
        scr.appendChild(d);
        const dx = (Math.random() - 0.5) * 160, up = 60 + Math.random() * 70;
        d.animate([{ transform: 'translate(0,0)', opacity: 0.9 }, { transform: `translate(${dx * 0.6}px,${-up}px)`, opacity: 0.9, offset: 0.45 }, { transform: `translate(${dx}px,${20}px)`, opacity: 0 }], { duration: 700, easing: 'ease-out' }).onfinish = () => d.remove();
      }
    };
    const nyaLaugh = () => {
      if (busy || showering || !inTub) return;
      chara.flash('face_happy', 1400);
      const h = chara.point(0.62, 0.12);
      UI.hearts(h.x, h.y, 1);
    };
    const PLAY = {
      async duck(o) { // ピッと ないて すいすい およぐ
        G.Sound.play('squeak');
        const a = o.inner.animate([
          { transform: 'translate(0,0) scaleX(1)' }, { transform: 'translate(0,-34px) scaleX(1)', offset: 0.12 }, { transform: 'translate(20px,0) scaleX(1)', offset: 0.22 },
          { transform: 'translate(120px,0) scaleX(1)', offset: 0.55 }, { transform: 'translate(120px,0) scaleX(-1)', offset: 0.6 }, { transform: 'translate(0,0) scaleX(-1)', offset: 0.95 }, { transform: 'translate(0,0) scaleX(1)' }
        ], { duration: 2600, easing: 'ease-in-out' });
        sc.timeout(() => ripple(o.p.x + o.p.w / 2, WATER + 6), 300);
        sc.timeout(() => ripple(o.p.x + o.p.w / 2 + 120, WATER + 6), 1400);
        sc.timeout(() => G.Sound.play('squeak'), 1500);
        await a.finished.catch(() => { });
      },
      async boat(o) { // ゆらゆら すすんで もどる
        G.Sound.play('swish');
        const a = o.inner.animate([
          { transform: 'translate(0,0) rotate(0)' }, { transform: 'translate(-50px,0) rotate(-8deg)', offset: 0.25 }, { transform: 'translate(-110px,0) rotate(6deg)', offset: 0.5 },
          { transform: 'translate(-60px,0) rotate(-6deg)', offset: 0.75 }, { transform: 'translate(0,0) rotate(0)' }
        ], { duration: 2800, easing: 'ease-in-out' });
        sc.timeout(() => ripple(o.p.x + o.p.w / 2 - 60, WATER + 6), 500);
        sc.timeout(() => ripple(o.p.x + o.p.w / 2 - 110, WATER + 6), 1300);
        await a.finished.catch(() => { });
      },
      async can(o) { // もちあげて バスタブに じゃーっ
        const dx = 250 - o.p.x, dy = 520 - o.p.y;
        const up = o.inner.animate([{ transform: 'translate(0,0) rotate(0)' }, { transform: `translate(${dx}px,${dy}px) rotate(0)` }], { duration: 600, easing: 'ease-out', fill: 'forwards' });
        await up.finished.catch(() => { });
        if (!sc.alive) return;
        const tilt = o.inner.animate([{ transform: `translate(${dx}px,${dy}px) rotate(0)` }, { transform: `translate(${dx}px,${dy}px) rotate(32deg)` }], { duration: 300, fill: 'forwards' });
        await tilt.finished.catch(() => { });
        if (!sc.alive) return;
        up.cancel();
        G.Sound.play('pour');
        const r = UI.rectOf(o.inner);
        const sx = r.x + r.w * 0.92, sy = r.y + r.h * 0.45; // そそぎ口の 先（だいたい）
        const t = sc.interval(() => {
          for (let k = 0; k < 2; k++) {
            const d = UI.el('div', 'drop');
            UI.pos(d, sx + (Math.random() - 0.5) * 24, sy, 12, 26);
            scr.appendChild(d);
            d.animate([{ transform: 'translate(0,0)', opacity: 0.9 }, { transform: `translate(${10 + Math.random() * 30}px,${WATER - sy}px)`, opacity: 0.3 }], { duration: 520, easing: 'ease-in' }).onfinish = () => d.remove();
          }
        }, 60);
        sc.timeout(() => ripple(sx + 24, WATER + 4), 400);
        nyaLaugh();
        await sc.wait(1300);
        clearInterval(t);
        const back = o.inner.animate([{ transform: `translate(${dx}px,${dy}px) rotate(32deg)` }, { transform: `translate(${dx}px,${dy}px) rotate(0)`, offset: 0.3 }, { transform: 'translate(0,0) rotate(0)' }], { duration: 800, easing: 'ease-in-out' });
        tilt.cancel();
        await back.finished.catch(() => { });
      },
      async fish(o) { // ぴょーんと バスタブに とびこんで、お水を ぴゅっ
        const tx = 820 - (o.p.x + o.p.w / 2), ty = WATER - 30 - (o.p.y + o.p.h / 2);
        G.Sound.play('hop');
        const jump = o.inner.animate([
          { transform: 'translate(0,0) rotate(0) scaleX(-1)' },
          { transform: `translate(${tx * 0.5}px,${ty - 150}px) rotate(-30deg) scaleX(-1)`, offset: 0.5 },
          { transform: `translate(${tx}px,${ty}px) rotate(10deg) scaleX(-1)` }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
        await jump.finished.catch(() => { });
        if (!sc.alive) return;
        G.Sound.play('plop');
        splash(820, WATER, 8);
        ripple(820, WATER + 6);
        // 口から お水を ぴゅっ
        const r = UI.rectOf(o.inner);
        const mx = r.x + r.w * 0.08, my = r.y + r.h * 0.45;
        for (let k = 0; k < 10; k++) sc.timeout(() => {
          const d = UI.el('div', 'drop');
          UI.pos(d, mx, my, 12, 24);
          scr.appendChild(d);
          const far = 140 + Math.random() * 60;
          d.animate([{ transform: 'translate(0,0)', opacity: 0.9 }, { transform: `translate(${-far * 0.5}px,-90px)`, opacity: 0.9, offset: 0.5 }, { transform: `translate(${-far}px,${WATER - my}px)`, opacity: 0.2 }], { duration: 700, easing: 'ease-out' }).onfinish = () => d.remove();
        }, 300 + k * 50);
        sc.timeout(() => G.Sound.play('bubble'), 300);
        nyaLaugh();
        await sc.wait(1200);
        if (!sc.alive) return;
        G.Sound.play('hop');
        const back = o.inner.animate([
          { transform: `translate(${tx}px,${ty}px) rotate(10deg) scaleX(-1)` },
          { transform: `translate(${tx * 0.5}px,${ty - 150}px) rotate(30deg) scaleX(1)`, offset: 0.5 },
          { transform: 'translate(0,0) rotate(0) scaleX(1)' }
        ], { duration: 750, easing: 'ease-in-out' });
        jump.cancel();
        await back.finished.catch(() => { });
      }
    };
    async function playToy(o) {
      if (o.busy) { o.e.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      o.busy = true;
      o.e.classList.add('playing');
      G.Voice.speak(o.t.label, 'guide');
      if (step === 2) { if (hand) { hand.remove(); hand = null; } toyPlays++; }
      const done = PLAY[o.t.id](o);
      if (step === 2 && toyPlays < TOY_GOAL) { placeBubble(); bubble.say(pick(L.bathToyCheer), { hold: 200 }); }
      await done;
      o.e.classList.remove('playing');
      o.busy = false;
      if (step === 2 && toyPlays >= TOY_GOAL && !busy) toyDone();
    }
    async function toyDone() {
      busy = true; step = -1;
      toys.forEach(o => o.e.classList.remove('active'));
      chara.setPose('face_happy');
      G.Sound.play('chime');
      const r = chara.rect();
      UI.hearts(r.cx, r.y + r.h * 0.2, 3);
      // バスタブから ざぶーんと でる
      await sc.wait(500);
      G.Sound.play('plop');
      splash(IN_TUB.x, WATER, 10);
      chara.face(1);
      chara.hop(170, 900);
      await sc.guard(chara.moveTo(OUT.x, OUT.y, 900, false));
      inTub = false;
      chara.el.classList.add('out-tub');
      await sc.wait(200);
      busy = false;
      setStep(3);
    }

    /* ④ タオル */
    async function towelDone() {
      busy = true; step = 4;
      cursor.classList.remove('on');
      rub = null;
      if (hand) { hand.remove(); hand = null; }
      towel.classList.remove('active');
      towel.classList.remove('taken');
      dots.forEach(d => { d.classList.remove('active'); d.classList.add('done'); });
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
      const toyEl = e.target.closest('.bath-toy');
      if (toyEl) { const o = toys.find(x => x.e === toyEl); G.Sound.play('press'); playToy(o); return; }
      const soapEl = e.target.closest('.soap');
      if (soapEl) {
        G.Sound.play('press');
        if (step !== 0 || busy) { if (step >= 0 && step <= 3) { placeBubble(); bubble.say(STEP_LINES[step]); } return; }
        chooseSoap(soaps.find(x => x.e === soapEl));
        rub = { id: e.pointerId, last: p, acc: 0, moved: 0, fromTool: true };
        showCursor(p);
        if (hand) { hand.remove(); hand = null; }
        return;
      }
      if (e.target.closest('.faucet')) {
        G.Sound.play('press');
        if (step === 1) startShower();
        else if (step >= 0 && step <= 3) { placeBubble(); bubble.say(STEP_LINES[step]); }
        return;
      }
      if (e.target.closest('.towel-hang')) {
        G.Sound.play('press');
        if (step !== 3 || busy) { if (step >= 0 && step <= 3) { placeBubble(); bubble.say(STEP_LINES[step]); } return; }
        towel.classList.add('taken');
        rub = { id: e.pointerId, last: p, acc: 0, moved: 0, fromTool: true };
        showCursor(p);
        if (hand) { hand.remove(); hand = null; }
        return;
      }
      if (busy) return;
      if (step === 0 && !soap) { placeBubble(); bubble.say(L.bathIntro); hint(); return; } // さきに せっけんを えらぶ
      if (step === 1 && !showering) { placeBubble(); bubble.say(L.bathShower); hint(); return; }
      if (step !== 0 && step !== 1 && step !== 3) return;
      rub = { id: e.pointerId, last: p, acc: 0, moved: 0, fromTool: false };
      if (hand) { hand.remove(); hand = null; }
      if (inZone(p)) { if (step !== 1) showCursor(p); addMark(p, 3); }
    });
    sc.on(scr, 'pointermove', (e) => {
      if (!rub || e.pointerId !== rub.id || busy) return;
      const p = UI.toStage(e.clientX, e.clientY);
      const dd = Math.hypot(p.x - rub.last.x, p.y - rub.last.y);
      rub.acc += dd; rub.moved += dd; rub.last = p;
      if (step !== 1 && (rub.fromTool || inZone(p))) showCursor(p);
      if (step === 1) { addMark(p, 1); return; }
      while (rub && rub.acc > 36) { rub.acc -= 36; if (inZone(p)) addMark(p, 1); }
    });
    const up = (e) => {
      if (!rub || e.pointerId !== rub.id) return;
      const r = rub; rub = null;
      cursor.classList.remove('on');
      if (step === 3) towel.classList.remove('taken');
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

    const BED = { x: 300, y: 430, w: 760, h: 489 }; // ねている絵（よこ長）が まくらに 頭を のせて ちょうど のる 大きさ
    const IN_BED = { x: 765, y: 712 };               // ねる ときの 足もとの まんなか（G.Chara の x, y）
    const bed = UI.el('div', 'bed glow');
    UI.pos(bed, BED.x, BED.y, BED.w, BED.h);
    bed.appendChild(G.Assets.node('item_bed', 'bd-art'));
    scr.appendChild(bed);
    const chara = new G.Chara(scr, { x: 290, y: 800, h: 440, wearOver: { body: G.CLOTHES_SLEEP } }); // ねんねは パジャマで
    chara.setMood('face_sleepy');
    chara.setPose('face_sleepy', 0);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.bubbleSpot(0.3); bubble.place(p.x, p.y, p.side); };
    sc.timeout(placeBubble, 30);

    let started = false, hand = null;
    sc.timeout(() => {
      placeBubble();
      bubble.say(L.sleepIntro);
      const r = UI.rectOf(bed);
      hand = UI.hand(scr, { x: r.cx, y: r.y + r.h * 0.5 });
    }, 500);
    UI.tap(bed, start, { sound: 'soft' });
    UI.tap(chara.el, start, { sound: 'soft' }); // ニャーちゃんをさわっても ねんね（救済）

    async function start() {
      if (started) return;
      started = true;
      if (hand) hand.remove();
      bed.classList.remove('glow');
      bubble.hide();
      G.Sound.play('yawn');
      chara.setPose('face_sleepy');
      chara.face(1);
      await sc.guard(chara.moveTo(IN_BED.x, IN_BED.y, 1100)); // とちゅうで「もどる」を おしたら ここで やめる
      chara.setPose('act_sleep', 500);
      G.setBg('bg_room_night');
      chara.setNight(true);
      bed.classList.add('night'); // ベッドも 夜の 色に
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
      bed.classList.remove('night');
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
