/* メイク（おしゃれ）：ほっぺ・くちべに・アイシャドウ・シール */
window.G = window.G || {};
G.Screens = G.Screens || {};

G.Screens.makeup = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, S = G.State, L = G.CHARACTER.lines;
    const pick = (a) => Array.isArray(a) ? a[Math.floor(Math.random() * a.length)] : a;
    const GOAL = 9;  // こする回数（これで ぬりおわる）
    const DECO_SPOTS = [[-0.28, 0.2], [1.2, 0.26], [0.45, -0.4], [0.02, 0.46], [0.95, -0.28]]; // おてつだいで はる場所
    UI.backButton(scr, () => G.go('home'));
    G.dressTabs(scr, 'makeup');

    scr.appendChild(UI.pos(UI.el('div', 'spotlight'), 60, 790, 680, 230));
    const chara = new G.Chara(scr, { x: 400, y: 1000, h: 790, accHide: ['face'] }); // メガネは はずして メイク
    chara.setMood('face_normal');
    chara.setPose('face_normal', 0);
    const guides = UI.el('div', 'mk-guides');
    scr.appendChild(guides);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.point(0.86, 0.1); bubble.place(Math.min(p.x, 700), p.y, 'right'); };
    const say = (text) => { placeBubble(); return bubble.say(text); };

    let tool = null;     // { cat, it }。cat が 'cotton' のときは おとす
    let progress = 0, busy = false, auto = false, rub = null, hand = null;
    let gotHeart = false, lastSnd = 0, again = 0, decoN = 0, idleAt = Date.now() + 14000;
    const hinted = {};
    G.petting(chara, sc, { enabled: () => !tool && !busy });

    /* ---- 右のパネル ---- */
    const panel = UI.el('div', 'mk-panel');
    UI.pos(panel, 790, 310, 540, 680);
    scr.appendChild(panel);
    const catBtns = {};
    G.MAKEUP.forEach((c, i) => {
      const b = UI.el('div', 'mk-cat', `<div class="mc-icon">${G.Art.makeupCat(c.id)}</div><div class="mc-label${c.label.length > 4 ? ' long' : ''}">${c.label}</div>`);
      UI.pos(b, 14 + i * 130, 14, 122, 136);
      panel.appendChild(b);
      catBtns[c.id] = b;
      UI.tap(b, () => setCat(c.id), { sound: 'tap', say: c.label });
    });
    const swBox = UI.el('div', 'mk-swatches');
    panel.appendChild(swBox);
    const cot = UI.el('div', 'mk-cotton', `<div class="mk-cot-icon">${G.Art.makeupTool('cotton')}</div><div class="mk-cot-label">おとす</div>`);
    UI.pos(cot, 120, 530, 300, 120);
    panel.appendChild(cot);
    UI.tap(cot, chooseCotton, { sound: 'tap', say: 'おとす' });

    const cursor = UI.el('div', 'mk-cursor');
    scr.appendChild(cursor);
    const showCursor = (p) => { cursor.classList.add('on'); cursor.style.left = p.x + 'px'; cursor.style.top = p.y + 'px'; };
    const hideCursor = () => cursor.classList.remove('on');

    let cat = G.lastMakeupCat || 'cheek';
    let swatches = [];
    function setCat(id) {
      if (busy || auto) return;
      cat = G.lastMakeupCat = id;
      selectTool(null);
      Object.entries(catBtns).forEach(([k, b]) => b.classList.toggle('on', k === id));
      swBox.innerHTML = '';
      swatches = G.Makeup.catOf(id).items.map((it, i) => {
        const open = S.isUnlocked(it);
        const e = UI.el('div', 'mk-sw' + (open ? '' : ' locked'));
        e.dataset.i = i;
        UI.pos(e, 40 + (i % 2) * 240, 172 + Math.floor(i / 2) * 172, 220, 150);
        e.innerHTML = `<div class="ms-art">${G.Art.makeupSwatch(id, it)}</div>` +
          (open ? `<div class="ms-label">${it.label}</div>` : `<div class="ms-lock"><div class="sl-heart">${G.Art.heart()}</div><div class="sl-num">${it.unlock}</div></div>`) +
          `<div class="ms-on">${G.Art.heart()}</div>`;
        swBox.appendChild(e);
        return { it, e, open };
      });
      refresh();
    }
    /* えらんでいる・ついている しるし */
    function refresh() {
      const m = S.makeup();
      swatches.forEach(({ it, e }) => {
        e.classList.toggle('sel', !!tool && tool.it === it);
        e.classList.toggle('on', cat !== 'deco' && m[cat] === it.id);
      });
      cot.classList.toggle('sel', !!tool && tool.cat === 'cotton');
    }
    function selectTool(t) {
      tool = t; progress = 0; again = 0;
      chara.preview = null;
      if (hand) { hand.remove(); hand = null; }
      guides.innerHTML = '';
      hideCursor();
      if (t) {
        cursor.innerHTML = G.Art.makeupTool(t.cat, t.it);
        cursor.className = 'mk-cursor' + (t.cat === 'deco' ? ' deco' : t.cat === 'cotton' ? ' cotton' : '');
      }
      refresh();
    }
    const isOn = (t) => t.cat !== 'cotton' && t.cat !== 'deco' && S.makeup()[t.cat] === t.it.id;

    /* ぬる場所に わっかを出す */
    function targetsOnStage(c) {
      const sc2 = chara.artScale();
      return G.Makeup.targets(chara.artPose(), c).map(q => Object.assign(chara.fromArt(q), { r: Math.max(34, q.r * sc2) }));
    }
    function faceCenter() {
      const f = G.Makeup.decoAt(chara.artPose(), 0.5, 0.2);
      if (f) return chara.fromArt(f);
      const r = chara.rect();
      return { x: r.cx, y: r.y + r.h * 0.42 };
    }
    function showGuide(from) {
      guides.innerHTML = '';
      if (hand) { hand.remove(); hand = null; }
      if (!tool) return;
      let to = faceCenter();
      if (tool.cat !== 'deco' && tool.cat !== 'cotton' && !isOn(tool)) {
        const T = targetsOnStage(tool.cat);
        T.forEach(t => {
          const g = UI.el('div', 'mk-ring');
          UI.pos(g, t.x - t.r, t.y - t.r, t.r * 2, t.r * 2);
          guides.appendChild(g);
        });
        if (T.length) to = T[0];
      }
      if (from) hand = UI.hand(scr, from, to, { times: 2 });
    }

    /* ---- いろを えらぶ ---- */
    function pickSwatch(i, e, p) {
      const sw = swatches[i];
      if (!sw) return;
      if (!sw.open) {
        G.Sound.play('lock');
        e.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(0)' }], { duration: 380 });
        chara.flash('face_prim', 2400);
        say(L.makeupLocked);
        return;
      }
      G.Sound.play('tap');
      const wasSel = !!tool && tool.it === sw.it;
      if (!wasSel) {
        G.Voice.speak(sw.it.label, 'guide');
        selectTool({ cat, it: sw.it });
      }
      // ここから ニャーちゃんの顔まで ドラッグしても ぬれる
      rub = { id: null, last: p, acc: 0, moved: 0, fromSwatch: true, wasSel, el: e };
      showCursor(p);
    }
    function afterSelect(e) {
      if (!tool) return;
      const r = UI.rectOf(e);
      if (isOn(tool)) { chara.flash('face_happy', 2000); say(L.makeupAgain); showGuide(null); return; }
      const c = G.Makeup.catOf(tool.cat);
      if (!hinted[c.id]) { hinted[c.id] = true; say(L[c.hint]); }
      showGuide({ x: r.cx, y: r.cy });
    }

    function chooseCotton() {
      if (busy || auto) return;
      if (!S.hasMakeup()) { selectTool(null); chara.flash('face_prim', 2000); say(L.makeupNone); return; }
      if (tool && tool.cat === 'cotton') { autoApply(); return; }
      selectTool({ cat: 'cotton', it: null });
      say(L.makeupRemove);
      const r = UI.rectOf(cot);
      showGuide({ x: r.cx, y: r.cy });
    }

    /* ---- こする ---- */
    // ニャーちゃんの どこを さわっても ぬれる（シールは 顔の いちばん近い ところに はる）
    const onFace = (p) => {
      const r = chara.rect();
      return p.x > r.x + r.w * 0.04 && p.x < r.x + r.w * 0.98 && p.y > r.y + r.h * 0.04 && p.y < r.y + r.h;
    };
    function mark(p) {
      if (busy || !tool) return;
      if (tool.cat === 'cotton' ? !S.hasMakeup() : isOn(tool)) { // もう ついている（もう なにも ない）
        UI.sparkles(p.x, p.y, 1, 40);
        if (++again === 6) { chara.flash('face_happy', 2000); say(tool.cat === 'cotton' ? L.makeupNone : L.makeupAgain); }
        return;
      }
      if (progress === 0) guides.innerHTML = '';
      progress++;
      const k = Math.min(1, progress / GOAL);
      chara.preview = tool.cat === 'cotton' ? { remove: true, p: k } : { cat: tool.cat, id: tool.it.id, p: k };
      chara.flash(tool.cat === 'eye' || tool.cat === 'cotton' ? 'face_dreamy' : 'face_prim', 1500); // めを とじて まってる
      chara.redraw();
      UI.sparkles(p.x, p.y, 1, 46, tool.cat === 'cotton' ? '#ffffff' : tool.it.color);
      if (Date.now() - lastSnd > 150) { G.Sound.play(tool.cat === 'cotton' ? 'swish' : 'bubble'); lastSnd = Date.now(); }
      if (Math.random() < 0.25) chara.squish();
      if (progress >= GOAL) (tool.cat === 'cotton' ? removed() : applied());
    }

    function heartOnce() {
      if (gotHeart) return;
      gotHeart = true;
      const h = chara.head();
      UI.giveHearts(1, h.x, h.y);
    }

    async function applied() {
      busy = true;
      const t = tool;
      S.setMakeup(t.cat, t.it.id);
      chara.preview = null;
      progress = 0;
      rub = null;
      hideCursor();
      guides.innerHTML = '';
      chara.flash('face_happy', 2800);
      chara.redraw();
      chara.hop(30);
      G.Sound.play('sparkle');
      targetsOnStage(t.cat).forEach(q => UI.sparkles(q.x, q.y, 6, 80));
      refresh();
      heartOnce();
      say(pick(L.makeupDone));
      await sc.wait(700);
      busy = false;
    }

    async function removed() {
      busy = true;
      S.clearMakeup();
      selectTool(null);
      rub = null;
      chara.flash('face_happy', 2600);
      chara.redraw();
      chara.wiggle();
      G.Sound.play('chime');
      const r = chara.rect();
      for (let k = 0; k < 3; k++) sc.timeout(() => UI.sparkles(r.x + r.w * (0.3 + Math.random() * 0.5), r.y + r.h * (0.2 + Math.random() * 0.3), 4, 70), k * 200);
      say(L.makeupRemoved);
      await sc.wait(700);
      busy = false;
    }

    /* シールを はる（さわった ところへ。顔の外なら 顔のはしへ） */
    async function placeDeco(p) {
      if (busy || !tool || tool.cat !== 'deco') return;
      const q = G.Makeup.decoSpot(chara.artPose(), chara.toArt(p));
      if (!q || !Number.isFinite(q.u) || !Number.isFinite(q.v)) return;
      busy = true;
      if (hand) { hand.remove(); hand = null; }
      guides.innerHTML = '';
      const s = { id: tool.it.id, u: +q.u.toFixed(3), v: +q.v.toFixed(3), rot: +((Math.random() - 0.5) * 0.7).toFixed(2) };
      G.Sound.play('popBubble');
      const t0 = performance.now();
      await new Promise(res => {
        const step = (now) => {
          if (!sc.alive) return res();
          const k = Math.min(1, (now - t0) / 280);
          chara.preview = { deco: s, p: k < 0.7 ? k / 0.7 * 1.25 : 1.25 - (k - 0.7) / 0.3 * 0.25 }; // ぽんっ
          chara.redraw();
          if (k < 1) requestAnimationFrame(step); else res();
        };
        requestAnimationFrame(step);
      });
      if (!sc.alive) return;
      S.addDeco(s);
      chara.preview = null;
      chara.flash('face_happy', 2200);
      chara.redraw();
      chara.squish();
      const at = G.Makeup.decoAt(chara.artPose(), s.u, s.v);
      if (at) { const a = chara.fromArt(at); UI.sparkles(a.x, a.y, 6, 70); }
      G.Sound.play('sparkle');
      heartOnce();
      if (decoN++ % 3 === 0) say(pick(L.decoDone));
      sc.timeout(hideCursor, 250);
      busy = false;
    }

    /* おてつだい：えらんだ いろを もう一度 さわると、かわりに ぬってくれる（N-06 救済） */
    async function autoApply() {
      if (busy || auto || !tool) return;
      const t = tool;
      if (t.cat === 'deco') {
        const sp = DECO_SPOTS[decoN % DECO_SPOTS.length];
        const at = G.Makeup.decoAt(chara.artPose(), sp[0], sp[1]);
        const p = at ? chara.fromArt(at) : faceCenter();
        showCursor(p);
        placeDeco(p);
        return;
      }
      const done = () => tool !== t || busy || (t.cat === 'cotton' ? !S.hasMakeup() : isOn(t));
      if (done()) { mark(faceCenter()); return; }
      auto = true;
      if (hand) { hand.remove(); hand = null; }
      const T = targetsOnStage(t.cat === 'cotton' ? 'cheek' : t.cat);
      if (!T.length) { auto = false; mark(faceCenter()); return; } // 顔の場所が まだ わからない
      for (let i = 0; i < 40 && !done() && sc.alive; i++) {
        const q = T[Math.floor(i / 3) % T.length];
        const a = i * 1.9;
        const p = { x: q.x + Math.cos(a) * q.r * 0.45, y: q.y + Math.sin(a) * q.r * 0.3 };
        showCursor(p);
        mark(p);
        await sc.wait(150);
      }
      hideCursor();
      auto = false;
    }

    /* ---- ゆびの操作 ---- */
    sc.on(scr, 'pointerdown', (e) => {
      idleAt = Date.now() + 14000;
      if (rub || auto || busy) return;
      const p = UI.toStage(e.clientX, e.clientY);
      const swEl = e.target.closest('.mk-sw');
      if (swEl) {
        e.preventDefault();
        swEl.classList.add('pressed');
        setTimeout(() => swEl.classList.remove('pressed'), 160);
        pickSwatch(parseInt(swEl.dataset.i, 10), swEl, p);
        if (rub) { rub.id = e.pointerId; try { scr.setPointerCapture(e.pointerId); } catch (_) { /* なし */ } }
        return;
      }
      if (!tool || e.target.closest('.btn-back, .bubble, .mk-panel, .dress-tabs')) return;
      if (!onFace(p)) return;
      e.preventDefault();
      if (hand) { hand.remove(); hand = null; }
      showCursor(p);
      if (tool.cat === 'deco') { placeDeco(p); return; }
      rub = { id: e.pointerId, last: p, acc: 0, moved: 0 };
      try { scr.setPointerCapture(e.pointerId); } catch (_) { /* なし */ }
      mark(p);
    });
    sc.on(scr, 'pointermove', (e) => {
      if (!rub || e.pointerId !== rub.id) return;
      const p = UI.toStage(e.clientX, e.clientY);
      const dd = Math.hypot(p.x - rub.last.x, p.y - rub.last.y);
      rub.acc += dd; rub.moved += dd; rub.last = p;
      showCursor(p);
      if (tool && tool.cat === 'deco') return;
      if (rub.acc > 38) { rub.acc = 0; if (onFace(p)) mark(p); }
    });
    const up = (e, ok) => {
      if (!rub || e.pointerId !== rub.id) return;
      const r = rub; rub = null;
      const p = UI.toStage(e.clientX, e.clientY);
      hideCursor();
      if (!ok || !tool) return;
      if (r.fromSwatch) {
        if (r.moved < 24) { if (r.wasSel) autoApply(); else afterSelect(r.el); return; }
        if (tool.cat === 'deco' && onFace(p)) { showCursor(p); placeDeco(p); return; } // ドラッグして はる
        if (!isOn(tool) && progress < GOAL) showGuide(null);
      }
    };
    sc.on(scr, 'pointerup', (e) => up(e, true));
    sc.on(scr, 'pointercancel', (e) => up(e, false));

    /* ---- はじめ・ヒント ---- */
    setCat(cat);
    sc.timeout(() => say(L.makeupIntro), 500);
    sc.interval(() => {
      if (busy || auto || rub || Date.now() < idleAt) return;
      idleAt = Date.now() + 16000;
      if (!tool) {
        const first = swatches.find(s => s.open);
        say(L.makeupPick);
        if (first && !hand) { const r = UI.rectOf(first.e); hand = UI.hand(scr, { x: r.cx, y: r.cy }, null, { times: 3 }); }
      } else if (tool.cat !== 'cotton' && !isOn(tool)) {
        say(L[G.Makeup.catOf(tool.cat).hint]);
        const s = swatches.find(x => x.it === tool.it);
        if (s) showGuide({ x: UI.rectOf(s.e).cx, y: UI.rectOf(s.e).cy });
      }
    }, 1000);
  }
};
