/* あそぶ：おえかき
 * クレヨンと スタンプで じゆうに かく。「できた！」で がくぶちに 入れて、おへやの かべに かざる（つぎに かくまで） */
window.G = window.G || {};
G.Screens = G.Screens || {};

G.Screens.drawing = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, S = G.State, L = G.CHARACTER.lines, PA = G.PlayArt;
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    UI.backButton(scr, () => G.go('playmenu'));
    const meter = G.oneMeter(scr, 'fun');

    const chara = new G.Chara(scr, { x: 170, y: 930, h: 330 });
    chara.setMood('face_happy');
    chara.setPose('face_happy', 0);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.topSpot(0.55, 0.02); bubble.place(p.x, p.y, p.side); };
    G.petting(chara, sc);

    /* ---- かみ ---- */
    const PX = 330, PY = 140, PW = 820, PH = 560, RES = 1.5;
    const board = UI.el('div', 'draw-board');
    UI.pos(board, PX - 18, PY - 18, PW + 36, PH + 36);
    scr.appendChild(board);
    const cv = UI.el('canvas', 'draw-canvas');
    cv.width = PW * RES; cv.height = PH * RES;
    UI.pos(cv, 18, 18, PW, PH);
    board.appendChild(cv);
    const ctx = cv.getContext('2d');
    const paper = () => { ctx.fillStyle = '#fffdf8'; ctx.fillRect(0, 0, cv.width, cv.height); };
    paper();

    /* ---- どうぐ ---- */
    const pens = new Map(); // pointerId → かいている ゆび（下の「かく」を見る）
    let tool = null, crayon = null; // crayon = さいごに えらんだ クレヨン（ぜんぶ けしたら けしゴムから もどす）
    const btns = [], toolOf = new Map(); // ボタン → どうぐ（ボタンから 紙へ ゆびを すべらせても かける）
    const select = (t, el) => {
      tool = t;
      if (t.kind === 'crayon') crayon = { t, el };
      btns.forEach(b => b.classList.toggle('sel', b === el));
    };
    const addTool = (b, t) => { btns.push(b); toolOf.set(b, t); };
    // ボタンを おして はなした とき。そのまま 紙に かいた ゆびなら、なにも しない（もう もちかえて いる）
    const tapTool = (b, label, fn, sound = 'tap') => UI.tap(b, (e) => {
      const pen = pens.get(e.pointerId);
      if (pen && pen.on) return;
      G.Voice.speak(label, 'guide');
      fn(b);
    }, { sound });
    G.CRAYONS.forEach((c, i) => {
      const b = UI.el('div', 'crayon', PA.crayon(c.color));
      UI.pos(b, PX + 6 + i * 91, 752, 70, 230);
      scr.appendChild(b);
      const t = { kind: 'crayon', it: c };
      addTool(b, t);
      tapTool(b, c.label, () => select(t, b));
    });
    select(toolOf.get(btns[1]), btns[1]); // はじめは ピンク
    const side = (html, label, y, fn, sound) => {
      const b = UI.el('div', 'draw-tool', `<div class="dt-art">${html}</div><div class="dt-name">${label}</div>`);
      UI.pos(b, 1184, y, 160, 112);
      scr.appendChild(b);
      tapTool(b, label, fn, sound);
      return b;
    };
    G.DRAW_STAMPS.forEach((s, i) => {
      const t = { kind: 'stamp', it: s };
      addTool(side(PA.stamp(s), s.label, 130 + i * 124, (el) => select(t, el)), t);
    });
    const eraser = { kind: 'eraser' };
    addTool(side(G.Art.all.item_eraser(), 'けしゴム', 502, (el) => select(eraser, el)), eraser);
    let clearAsk = 0;
    side(G.Art.all.item_newpaper(), 'ぜんぶ けす', 626, (el) => {
      if (Date.now() - clearAsk > 4000) { // まちがえて けさないように、2かい おしたら けす
        clearAsk = Date.now();
        el.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 400 });
        placeBubble();
        bubble.say(L.drawClear);
        return;
      }
      clearAsk = 0;
      G.Sound.play('swish');
      const wipe = UI.el('div', 'draw-wipe');
      board.appendChild(wipe);
      wipe.animate([{ transform: 'translateX(-105%)' }, { transform: 'translateX(0)', offset: 0.45 }, { transform: 'translateX(0)', offset: 0.55 }, { transform: 'translateX(105%)' }], { duration: 900, easing: 'ease-in-out' }).onfinish = () => wipe.remove();
      sc.timeout(() => {
        paper(); strokes = 0;
        if (tool.kind === 'eraser') select(crayon.t, crayon.el); // まっさらな 紙に けしゴムでは なにも かけないので
      }, 420);
    }, 'whoosh');
    const doneBtn = UI.el('div', 'btn-big btn-drawdone', '<span>できた！</span>');
    scr.appendChild(doneBtn);
    UI.tap(doneBtn, finish, { say: 'できた' });

    /* ---- かく ----
       ゆびごとに べつべつに かく（ほかの ゆびや 手のひらが 紙に ふれていても かける）。
       紙の そと（ふち・クレヨン・スタンプ）で さわって、すべらせて 紙に 入っても かきはじめる。
       pens の ひとつ = { from: さわった どうぐの ボタン, t: どうぐ, on: かきはじめた, out: 紙に 入る まえの 点, last, mid, dist } */
    let strokes = 0, lastCheer = Date.now(), finished = false, hand = null;
    const toPaper = (e) => {
      const p = UI.toStage(e.clientX, e.clientY);
      return { x: (p.x - PX) * RES, y: (p.y - PY) * RES };
    };
    const onPaper = (q, m = 0) => q.x >= m && q.y >= m && q.x <= cv.width - m && q.y <= cv.height - m; // m = ふちから これだけ 内がわ
    // ボタンから すべらせてきた ゆびは、紙の すこし 内がわに 入ってから かく
    // （クレヨンを タップした ときの ゆびの ずれで かかない。スタンプは 紙から はみださない）
    const edge = (pen) => pen.from ? (toolOf.get(pen.from).kind === 'stamp' ? 46 : 12) * RES : 0;
    function stampAt(s, p) {
      const R = 46 * RES;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = s.color;
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6 * RES; ctx.lineJoin = 'round';
      ctx.beginPath();
      if (s.shape === 'heart') {
        const k = R / 15;
        ctx.scale(k, k); ctx.translate(-16, -14.5);
        const path = new Path2D(G.Art.HEART_PATH);
        ctx.lineWidth = 6 * RES / k;
        ctx.stroke(path); ctx.fill(path);
      } else if (s.shape === 'star') {
        for (let k = 0; k < 10; k++) {
          const t = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? R * 0.5 : R;
          ctx.lineTo(Math.cos(t) * r, Math.sin(t) * r);
        }
        ctx.closePath(); ctx.stroke(); ctx.fill();
      } else {
        for (let k = 0; k < 5; k++) {
          const t = -Math.PI / 2 + k * Math.PI * 2 / 5;
          ctx.moveTo(Math.cos(t) * R * 0.5 + R * 0.46, Math.sin(t) * R * 0.5);
          ctx.arc(Math.cos(t) * R * 0.5, Math.sin(t) * R * 0.5, R * 0.46, 0, Math.PI * 2);
        }
        ctx.stroke(); ctx.fill();
        ctx.beginPath(); ctx.fillStyle = '#ffd96a'; ctx.arc(0, 0, R * 0.3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      G.Sound.play('stamp');
    }
    const PAPER = '#fffdf8';
    function line(t, a, b, mid) { // けしゴムは かみの いろで ぬる
      ctx.strokeStyle = t.kind === 'eraser' ? PAPER : t.it.color;
      ctx.lineWidth = (t.kind === 'eraser' ? 46 : 15) * RES;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(mid.x, mid.y, b.x, b.y);
      ctx.stroke();
    }
    const uncover = (q) => { // ふきだしの 下に かいたら、ふきだしを ひっこめて 紙を 見せる
      if (!bubble.el.classList.contains('show')) return;
      const r = UI.rectOf(bubble.el), x = q.x / RES + PX, y = q.y / RES + PY;
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) bubble.hide();
    };
    function begin(pen, q) {
      if (pen.from) select(toolOf.get(pen.from), pen.from); // ボタンから すべらせてきたら、その どうぐに もちかえる
      pen.t = tool; pen.on = true; pen.last = q;
      if (hand) { hand.remove(); hand = null; }
      uncover(q);
      if (pen.t.kind === 'stamp') stampAt(pen.t.it, q);
      else if (pen.out) line(pen.t, pen.out, q, pen.out); // そとから 入ってきたら、紙の ふちから つなぐ（はみだした ぶんは かかれない）
      else line(pen.t, q, { x: q.x + 0.1, y: q.y }, q); // てん
    }
    sc.on(scr, 'pointerdown', (e) => {
      if (finished) return;
      const from = e.target.closest('.crayon, .draw-tool');
      if (from ? !toolOf.has(from) : (e.target !== cv && e.target !== board && e.target !== scr)) return; // もどる・できた・ニャーちゃん などは べつ
      const q = toPaper(e);
      const pen = { from, t: null, on: false, out: onPaper(q) ? null : q, last: null, mid: null, dist: 0 };
      pens.set(e.pointerId, pen);
      if (from) return; // ボタンを おすのは UI.tap に まかせる（そのまま 紙に 入ったら かきはじめる）
      e.preventDefault();
      try { scr.setPointerCapture(e.pointerId); } catch (_) { /* なし */ }
      if (!pen.out) begin(pen, q);
    });
    const up = (e) => {
      const pen = pens.get(e.pointerId);
      if (!pen) return;
      pens.delete(e.pointerId);
      if (!pen.on || finished) return;
      if (pen.t.kind !== 'stamp' && pen.mid) line(pen.t, pen.mid, pen.last, pen.last); // はなした ところまで つなぐ
      if (pen.t.kind !== 'eraser') { strokes++; cheer(); }
    };
    sc.on(scr, 'pointerup', up);
    sc.on(scr, 'pointercancel', up);
    sc.on(scr, 'pointermove', (e) => {
      const pen = pens.get(e.pointerId);
      if (!pen || finished) return;
      if (e.pointerType !== 'touch' && !e.buttons) { up(e); return; } // マウス・ペンを はなした しらせが こなかった
      const q = toPaper(e);
      if (!pen.on) { if (onPaper(q, edge(pen))) begin(pen, q); else pen.out = q; return; }
      uncover(q);
      const d = Math.hypot(q.x - pen.last.x, q.y - pen.last.y);
      if (d < 3) return;
      if (pen.t.kind === 'stamp') { // なぞると スタンプが ならぶ
        pen.dist += d; pen.last = q;
        if (pen.dist > 80 * RES) { pen.dist = 0; stampAt(pen.t.it, q); }
        return;
      }
      const mid = { x: (pen.last.x + q.x) / 2, y: (pen.last.y + q.y) / 2 };
      line(pen.t, pen.mid || pen.last, mid, pen.last);
      pen.mid = mid; pen.last = q;
      pen.dist += d;
      if (pen.dist > 60) { pen.dist = 0; if (pen.t.kind === 'crayon') G.Sound.play('scribble'); }
    });

    function cheer() {
      if (strokes % 5 !== 0 || Date.now() - lastCheer < 9000) return;
      lastCheer = Date.now();
      chara.flash('face_happy', 2000);
      chara.hop(26);
      placeBubble();
      bubble.say(pick(L.drawCheer));
    }

    async function finish() {
      if (finished) return;
      if (!strokes && ![...pens.values()].some(p => p.on && p.t.kind !== 'eraser')) { // まだ なにも かいていない（1本めを かいている とちゅうでも ない）
        placeBubble();
        bubble.say(L.drawEmpty);
        if (!hand || !hand.el.isConnected) hand = UI.hand(scr, { x: PX + 300, y: PY + 260 }, { x: PX + 520, y: PY + 340 }, { times: 2 });
        return;
      }
      finished = true;
      if (hand) { hand.remove(); hand = null; }
      // おへやに かざる 小さな え
      const out = document.createElement('canvas');
      out.width = 420; out.height = Math.round(420 * PH / PW);
      out.getContext('2d').drawImage(cv, 0, 0, out.width, out.height);
      try { S.setDrawing(out.toDataURL('image/jpeg', 0.85)); } catch (e) { /* かざれなくても つづける */ }
      doneBtn.style.pointerEvents = 'none';
      board.classList.add('framed');
      G.Sound.play('sparkle');
      for (let k = 0; k < 5; k++) sc.timeout(() => UI.sparkles(PX + Math.random() * PW, PY + Math.random() * PH, 5, 110), k * 180);
      await sc.wait(900);
      G.finishGame(sc, chara, bubble, placeBubble, L.drawDone, meter);
    }

    sc.timeout(() => {
      placeBubble();
      bubble.say(L.drawIntro);
      hand = UI.hand(scr, { x: PX + 300, y: PY + 260 }, { x: PX + 520, y: PY + 340 }, { times: 2 });
    }, 500);
  }
};
