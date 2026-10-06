/*
 * おでかけ（要件定義書 5.10）
 *   おへやの ドア → ① おでかけの じゅんび（ふくを えらんで チェック）→ ② どこに いく？（4つ）→ ③ その場所で あそぶ → おうちに かえる
 * ③ は 場所ごとに タッチできる もの（spot）が 4つ。ぜんぶ ためすと おしまい（ハート・たのしい メーター）。
 *   ふくが 場所に あっていると（おまつりに ゆかた など）ハートを もう1こ。
 *   ニューちゃんが 来ていたら いっしょに いく。ニューちゃんの いえ では いつも いる。
 * 場所の 絵は js/art_outing.js、場所の 一覧（名前・背景・曲）は js/data.js の G.OUTINGS
 */
window.G = window.G || {};
G.Screens = G.Screens || {};

/* ================= ① おでかけの じゅんび（着替え） ================= */
G.Screens.outfit = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, S = G.State, L = G.CHARACTER.lines;
    UI.backButton(scr, () => G.go('home'));
    const head = UI.el('div', 'out-head', '<div class="oh-icon"></div><div class="oh-label">おでかけの じゅんび</div>');
    head.firstChild.appendChild(G.Assets.node('icon_door'));
    UI.pos(head, 170, 24);
    scr.appendChild(head);
    UI.tap(head, () => { }, { sound: 'soft', say: 'おでかけの じゅんび' });

    scr.appendChild(UI.pos(UI.el('div', 'spotlight'), 120, 700, 620, 240));
    const chara = new G.Chara(scr, { x: 430, y: 880, h: 620 });
    chara.setMood('face_prim');
    chara.setPose('face_prim', 0);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.point(0.9, 0.08); bubble.place(Math.min(p.x, 720), p.y - 12, 'right'); };
    const say = (text) => { placeBubble(); return bubble.say(text); };
    G.petting(chara, sc);

    let leaving = false, told = !!S.clothes(), hand = null;
    const dropHand = () => { if (hand) { hand.remove(); hand = null; } };
    const ok = UI.el('div', 'btn-big btn-check', `<div class="ck-icon">${G.Art.all.icon_check()}</div><span>できた</span>`);
    UI.pos(ok, 860, 856, 400, 130);
    scr.appendChild(ok);
    const ready = () => ok.classList.toggle('ready', !!S.clothes());

    const panel = G.clothesPanel(scr, {
      chara, say, x: 790, y: 140,
      onChange: async (p) => {
        ready();
        dropHand();
        if (told || !S.clothes()) return;
        told = true; // はじめて 着たら「できたら チェック」と 1回だけ 言う
        await sc.guard(p);
        if (!leaving) say(L.outfitReady);
      }
    });
    ready();

    /* チェック：ふくを 着ていたら でかける。着ていなければ えらぶように いう */
    UI.tap(ok, async () => {
      if (leaving) return;
      dropHand();
      if (!S.clothes()) {
        ok.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(4deg)' }, { transform: 'rotate(0)' }], { duration: 380 });
        chara.flash('face_prim', 2400);
        say(L.outfitNone);
        const b = panel.firstOpen();
        if (b) { const r = UI.rectOf(b); hand = UI.hand(scr, { x: r.cx, y: r.cy }, null, { times: 3 }); }
        return;
      }
      leaving = true;
      panel.el.style.pointerEvents = 'none';
      G.Sound.play('fanfare');
      chara.flash('face_happy', 5000);
      chara.hop(50);
      const p = chara.point(0.5, 0.55);
      UI.sparkles(p.x, p.y, 14, 220);
      await sc.guard(say(L.outfitGo));
      G.go('outmenu');
    }, { say: 'できた' });

    sc.timeout(() => say(S.clothes() ? L.outfitReady : L.outfitIntro), 500);
  }
};

/* ================= ② どこに おでかけ する？ ================= */
G.Screens.outmenu = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, L = G.CHARACTER.lines;
    UI.backButton(scr, () => G.go('outfit'));
    const chara = new G.Chara(scr, { x: 236, y: 930, h: 400 });
    chara.setMood('face_happy');
    chara.setPose('face_happy', 0);
    const bubble = new UI.Bubble(scr);
    sc.timeout(() => { const p = chara.topSpot(0.5, 0.02); bubble.place(p.x, p.y, p.side); bubble.say(L.outingIntro); }, 400); // あたまの上（カードに かさねない）
    G.petting(chara, sc);

    // 2こずつ 2だん
    G.OUTINGS.forEach((o, i) => {
      const c = UI.el('div', 'game-card out-card');
      UI.pos(c, 506 + (i % 2) * 410, 160 + Math.floor(i / 2) * 400, 380, 360);
      c.appendChild(G.Assets.node(o.icon, 'gc-art'));
      c.appendChild(UI.el('div', 'gc-label', o.label.replace(' ', '<br>')));
      scr.appendChild(c);
      c.animate([{ transform: 'translateY(40px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 400, delay: i * 70, fill: 'backwards', easing: 'ease-out' });
      UI.tap(c, () => G.go('out_' + o.id), { say: o.label, sound: 'door' });
    });
  }
};

/* ================= ③ その場所で あそぶ ================= */
/*
 * 場所ごとの きまり。
 *   chara・nyu = ニャーちゃん・ニューちゃんの 足もと（x, y）と 高さ（h）
 *   hello(X) = ついた ときの ごあいさつ、match(S) = ふくが あっているときの セリフ（なければ null）、bye(X) = おしまいの セリフ
 *   spots = タッチできる もの。art = 絵（js/art_outing.js）、x, y, w, h = 場所、z = かさなり（2 = ニャーちゃんの うしろ／まえ）、
 *           hint = ゆびの ヒントを 出す ところ（わりあい）、act(X, s, first, p) = タッチしたとき（first = はじめて）、
 *           instant(X, s, p) = いそがしい ときでも すぐ うごく ぶん（はなび）、nyu = ニューちゃん じしん
 * X = 場所で つかう 道具（say・sayNyu・eat・fly・pop など。下の outingScreen の 中）
 */
G.OUTING_PLACES = {
  festival: {
    chara: { x: 610, y: 905, h: 470 }, nyu: { x: 830, y: 905, h: 360 },
    hello: (X) => X.say(X.L.festivalHello, 'face_happy', 3000),
    match: (S) => S.clothes() === 'yukata',
    matchLine: (L) => L.festivalYukata,
    bye: (X) => X.say(X.L.festivalDone, 'face_happy', 3000),
    spots: [
      { id: 'watame', art: 'prop_watame', x: 24, y: 300, w: 340, h: 470, z: 1, hint: [0.72, 0.44],
        async act(X, s) {
          const c = X.center(s.el, 0.72, 0.42);
          G.Sound.play('swish');
          await X.eat('item_watame', c);
          await X.say(X.L.festivalWatame, 'face_happy');
        } },
      { id: 'kingyo', art: 'prop_kingyo', x: 930, y: 790, w: 380, h: 200, z: 3, hint: [0.45, 0.5],
        async act(X, s, first) {
          X.restart(s.el, 'scoop');
          await X.wait(420);
          G.Sound.play('plop');
          const c = X.center(s.el, 0.5, 0.5);
          X.UI.sparkles(c.x, c.y, 8, 90, '#cfefff');
          // すくった きんぎょを ふくろに いれて、ニャーちゃんの そばに おく（はじめての ときは そのまま のこす）
          const f = X.chara.feet(), to = { x: f.x - 175, y: f.y - 70 };
          const bag = X.flyer('item_kingyo_bag', c, 110, 140);
          await X.fly(bag, c, to, 850, 220);
          G.Sound.play('land');
          if (first) bag.classList.add('out-keep');
          else bag.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, delay: 900, fill: 'forwards' }).onfinish = () => bag.remove();
          X.chara.flash('face_happy', 2600);
          X.chara.hop(30);
          await X.say(X.L.festivalKingyo, 'face_happy');
        } },
      { id: 'taiko', art: 'prop_taiko', x: 70, y: 740, w: 260, h: 230, z: 3, hint: [0.5, 0.45],
        async act(X, s) {
          for (let i = 0; i < 4; i++) {
            G.Sound.play('don');
            s.el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06,.94)' }, { transform: 'scale(1)' }], { duration: 220 });
            const c = X.center(s.el, 0.5, 0.45);
            X.UI.word('どん', c.x + (i % 2 ? 70 : -70), c.y - 90, '#d9605f', 54);
            if (i % 2) X.chara.hop(26); else X.chara.tilt(i ? 7 : -7, 380);
            if (X.nyu && i % 2) X.nyu.hop();
            await X.wait(430);
          }
          X.chara.flash('face_happy', 3200);
          X.chara.sway(1);
          const h = X.chara.head();
          X.UI.notes(h.x, h.y, 3);
          await X.say(X.L.festivalTaiko, 'face_happy');
        } },
      { id: 'hanabi', x: 380, y: 120, w: 600, h: 300, z: 1, hint: [0.5, 0.55], sound: false, sky: true,
        instant(X, s, p) { X.firework(p || X.center(s.el)); },
        async act(X, s, first) {
          X.chara.flash('face_happy', 2600);
          if (!first) { await X.wait(700); return; } // 2かいめ からは はなびだけ
          await X.wait(800);
          await X.say(X.L.festivalHanabi, 'face_happy');
        } }
    ]
  },

  halloween: {
    chara: { x: 610, y: 905, h: 470 }, nyu: { x: 830, y: 905, h: 360 },
    hello: (X) => X.say(X.L.halloweenHello, 'face_happy', 3000),
    match: (S) => S.clothes() === 'cape' || S.wear().head === 'witch',
    matchLine: (L) => L.halloweenCostume,
    bye: (X) => X.say(X.L.halloweenDone, 'face_happy', 3000),
    spots: [
      { id: 'pumpkins', art: 'prop_pumpkins', x: 30, y: 760, w: 380, h: 220, z: 3, hint: [0.5, 0.55],
        async act(X, s) {
          if (s.el.classList.contains('lit')) { s.el.classList.remove('lit'); G.Sound.play('lightsOff'); await X.wait(700); }
          s.el.classList.add('lit');
          G.Sound.play('chime');
          s.el.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-3deg)' }, { transform: 'rotate(3deg)' }, { transform: 'rotate(0)' }], { duration: 500, delay: 300 });
          await X.wait(500);
          X.pop(() => X.candy(), X.center(s.el, 0.5, 0.4), 4, 70);
          X.chara.flash('face_happy', 2600);
          X.chara.hop(30);
          await X.say(X.L.halloweenPumpkin, 'face_happy');
        } },
      { id: 'ghost', art: 'prop_ghost', x: 880, y: 240, w: 200, h: 220, z: 3, hint: [0.5, 0.5],
        async act(X, s) {
          G.Sound.play('boo');
          s.el.classList.add('boo');
          const c = X.center(s.el, 0.5, 0.3);
          X.UI.word('ばあ！', c.x, c.y - 100, '#7a66a8', 66);
          X.chara.flash('face_prim', 1500);
          X.chara.hop(70);
          if (X.nyu) X.nyu.hop();
          await X.wait(1200);
          s.el.classList.remove('boo');
          X.chara.flash('face_happy', 2600);
          X.UI.hearts(c.x, c.y, 3, '#c9b3ee');
          await X.say(X.L.halloweenGhost, 'face_happy');
        } },
      { id: 'candy', art: 'prop_candy', x: 990, y: 560, w: 340, h: 330, z: 1, hint: [0.5, 0.36],
        async act(X, s) {
          const c = X.center(s.el, 0.5, 0.36);
          G.Sound.play('sparkle');
          X.pop(() => X.candy(), c, 4, 64);
          await X.eat(() => X.candy(), c);
          await X.say(X.L.halloweenCandy, 'face_happy');
        } },
      { id: 'broom', art: 'prop_broom', x: 90, y: 370, w: 150, h: 340, z: 1, hint: [0.5, 0.4],
        async act(X, s) {
          G.Sound.play('whoosh');
          s.el.style.zIndex = 7; // とんでいる あいだは まえに
          const fly = s.el.animate([
            { transform: 'translate(0,0) rotate(0)' },
            { transform: 'translate(140px,-200px) rotate(-70deg)', offset: 0.18 },
            { transform: 'translate(560px,-250px) rotate(-90deg)', offset: 0.42 },
            { transform: 'translate(1000px,-130px) rotate(-110deg)', offset: 0.62 },
            { transform: 'translate(520px,-40px) rotate(-270deg)', offset: 0.84 },
            { transform: 'translate(0,0) rotate(-360deg)' }
          ], { duration: 3000, easing: 'ease-in-out' });
          const trail = X.sc.interval(() => { const c = X.center(s.el, 0.5, 0.75); X.UI.sparkles(c.x, c.y, 2, 40, '#fff3a8'); }, 140);
          X.chara.flash('face_happy', 3400);
          await X.sc.guard(fly.finished.catch(() => { }));
          clearInterval(trail);
          s.el.style.zIndex = 1;
          G.Sound.play('land');
          await X.say(X.L.halloweenBroom, 'face_happy');
        } }
    ]
  },

  christmas: {
    chara: { x: 600, y: 905, h: 470 }, nyu: { x: 770, y: 905, h: 360 },
    hello: (X) => X.say(X.L.christmasHello, 'face_happy', 3000),
    match: (S) => S.clothes() === 'santasuit' || S.wear().head === 'santa',
    matchLine: (L) => L.christmasSanta,
    bye: (X) => X.say(X.L.christmasDone, 'face_happy', 3000),
    spots: [
      { id: 'tree', art: 'prop_xtree', x: 1000, y: 180, w: 340, h: 720, z: 1, hint: [0.5, 0.45],
        async act(X, s) {
          if (s.el.classList.contains('lit')) { s.el.classList.remove('lit'); await X.wait(500); }
          s.el.classList.add('lit');
          G.Sound.play('jingle');
          const st = X.center(s.el, 0.5, 0.06);
          X.UI.sparkles(st.x, st.y, 12, 170);
          X.chara.flash('face_happy', 2600);
          X.chara.hop(30);
          await X.say(X.L.christmasTree, 'face_happy');
        } },
      { id: 'present', art: 'prop_present', x: 870, y: 800, w: 200, h: 170, z: 3, hint: [0.38, 0.55],
        async act(X, s, first) {
          if (s.el.classList.contains('open')) { s.el.classList.remove('open'); await X.wait(450); }
          s.el.classList.add('open');
          G.Sound.play('sparkle');
          G.Sound.play('chime');
          const c = X.center(s.el, 0.37, 0.4);
          X.UI.sparkles(c.x, c.y, 12, 150);
          X.UI.hearts(c.x, c.y, 5);
          if (first) X.UI.giveHearts(1, c.x, c.y);
          X.chara.flash('face_happy', 2600);
          X.chara.hop(40);
          await X.say(X.L.christmasGift, 'face_happy');
        } },
      { id: 'cake', art: 'prop_cake', x: 40, y: 690, w: 330, h: 260, z: 3, hint: [0.5, 0.3],
        async act(X, s) {
          await X.eat('item_cakeslice', X.center(s.el, 0.5, 0.28));
          await X.say(X.L.christmasCake, 'face_happy');
        } },
      { id: 'snow', art: 'prop_snowwin', x: 60, y: 150, w: 280, h: 320, z: 1, hint: [0.5, 0.45],
        async act(X) {
          G.Sound.play('jingle');
          X.snow(30);
          X.chara.flash('face_happy', 3200);
          X.chara.wiggle();
          await X.wait(700);
          await X.say(X.L.christmasSnow, 'face_happy');
        } }
    ]
  },

  nyuhome: {
    chara: { x: 520, y: 900, h: 470 }, nyu: { x: 890, y: 900, h: 414 }, nyuHere: true,
    async hello(X) {
      await X.sayNyu(X.N.homeHello, 'happy');
      await X.say(X.L.nyuHomeHello, 'face_happy');
      if (X.S.clothes()) { // おそろいの ふくで まっていてくれる（F-6I）
        await X.sayNyu(X.N.osoroi, 'happy');
        await X.say(X.L.nyuShy, 'face_dreamy');
      }
    },
    async bye(X) {
      await X.sayNyu(X.N.homeBye, 'wave', 3200);
      X.chara.flash('act_wave', 3000);
      await X.say(X.L.nyuHomeBye);
    },
    spots: [
      { id: 'nyu', nyu: true, hint: [0.5, 0.4], sound: 'soft',
        async act(X) {
          X.nyu.flash('dreamy', 2000);
          X.nyu.hop();
          G.Sound.play('meow');
          const h = X.nyu.point(0.5, 0.2);
          X.UI.hearts(h.x, h.y, 3);
          X.chara.flash('face_happy', 2200);
          await X.sayNyu(X.pick(X.N.pet));
        } },
      { id: 'snack', art: 'prop_snack', x: 30, y: 680, w: 330, h: 260, z: 3, hint: [0.5, 0.42],
        async act(X, s) {
          await X.sayNyu(X.N.homeSnack, 'happy');
          X.nyuMunch();
          await X.eat('item_cookie', X.center(s.el, 0.5, 0.42));
          await X.say(X.L.nyuHomeSnack, 'face_happy');
        } },
      { id: 'toybox', art: 'prop_toybox', x: 1090, y: 740, w: 250, h: 220, z: 3, hint: [0.5, 0.45],
        async act(X, s, first) {
          s.el.classList.add('open');
          G.Sound.play('sparkle');
          await X.wait(250);
          const c = X.center(s.el, 0.5, 0.4);
          ['toy_block', 'toy_star', 'toy_duck', 'item_yarn', 'toy_boat'].forEach((k, i) => X.sc.timeout(() => X.pop(() => G.Assets.node(k), c, 1, 96), i * 160));
          X.nyu.flash('happy', 2400);
          X.nyu.hop();
          if (first) await X.sayNyu(X.N.homeToys, 'happy');
          X.chara.flash('face_happy', 2600);
          X.chara.hop(30);
          await X.say(X.L.nyuHomeToys, 'face_happy');
          s.el.classList.remove('open');
        } },
      { id: 'ball', art: 'prop_ball', x: 660, y: 860, w: 110, h: 110, z: 3, hint: [0.5, 0.5],
        async act(X, s) {
          // ニューちゃんへ ポーン → ニューちゃんが なげかえす → ニャーちゃんが とる
          const home = X.center(s.el), toNyu = X.nyu.point(0.42, 0.5), toNya = X.chara.point(0.62, 0.52);
          const arc = (a, b, ms, lift) => s.el.animate([
            { transform: `translate(${a.x - home.x}px,${a.y - home.y}px) rotate(0)` },
            { transform: `translate(${(a.x + b.x) / 2 - home.x}px,${Math.min(a.y, b.y) - lift - home.y}px) rotate(180deg)`, offset: 0.5 },
            { transform: `translate(${b.x - home.x}px,${b.y - home.y}px) rotate(360deg)` }
          ], { duration: ms, easing: 'ease-in-out', fill: 'forwards' }).finished.catch(() => { });
          X.chara.hop(30);
          await arc(home, toNyu, 800, 170);
          G.Sound.play('pounce');
          X.nyu.hop();
          await X.sayNyu(X.N.homeBall, 'happy');
          await arc(toNyu, toNya, 850, 220);
          G.Sound.play('pounce');
          X.chara.hop(40);
          X.chara.flash('face_happy', 2600);
          X.UI.sparkles(toNya.x, toNya.y, 6, 80);
          await X.wait(250);
          await arc(toNya, home, 600, 80);
          s.el.getAnimations().forEach(a => a.cancel());
          await X.say(X.L.nyuHomeBall, 'face_happy');
        } }
    ]
  }
};

/* その場所の 画面を つくる（G.Screens.out_festival など） */
G.outingScreen = function (o) {
  return {
    bg: o.bg, hud: true, bgm: o.bgm,
    enter(scr, sc) {
      const UI = G.UI, S = G.State, L = G.CHARACTER.lines, N = G.CHARACTERS.nyu.lines;
      const P = G.OUTING_PLACES[o.id];
      const pick = (a) => Array.isArray(a) ? a[Math.floor(Math.random() * a.length)] : a;
      scr.classList.add('screen-outing');
      UI.backButton(scr, () => G.go('outmenu'));
      const setProg = G.progressRow(scr, P.spots.length, () => G.Art.all[o.icon]());

      /* ニャーちゃん・ニューちゃん */
      const chara = new G.Chara(scr, P.chara);
      chara.setMood('face_happy');
      chara.setPose('face_happy', 0);
      G.petting(chara, sc);
      let nyu = null;
      if (P.nyuHere) { // ニューちゃんの いえ：いつも いる
        nyu = new G.NyuSprite(scr, P.nyu);
        sc.add(() => nyu.remove());
      } else nyu = G.NyuVisit.joinPlay(scr, sc, Object.assign({ cheer: true }, P.nyu)); // 来ていたら いっしょに
      const bubble = new UI.Bubble(scr);
      const nyuBubble = nyu ? new UI.Bubble(scr) : null;
      const placeBubble = () => {
        if (nyu) { const p = chara.topSpot(0.5, 0.04); bubble.place(p.x, p.y, p.side); return; } // ニューちゃんが 右に いるので あたまの 上に
        const p = chara.bubbleSpot(0.24); bubble.place(p.x, p.y, p.side);
      };
      const say = (text, face, ms = 2600) => { placeBubble(); if (face) chara.flash(face, ms); return bubble.say(text); };
      const sayNyu = (text, face, ms = 2400) => {
        if (!nyu) return Promise.resolve();
        const p = nyu.point(0.5, 0.06);
        nyuBubble.place(p.x, p.y, 'top');
        if (face) nyu.flash(face, ms);
        return nyuBubble.say(text, { who: 'nyu' });
      };

      /* ---- 場所で つかう 道具 ---- */
      const center = (el, rx = 0.5, ry = 0.5) => { const r = UI.rectOf(el); return { x: r.x + r.w * rx, y: r.y + r.h * ry }; };
      // とばす 絵（key = 絵の名前、または 要素を かえす 関数）
      function flyer(key, at, w = 130, h = w) {
        const g = typeof key === 'function' ? key() : G.Assets.node(key);
        g.classList.add('out-fly');
        UI.pos(g, at.x - w / 2, at.y - h / 2, w, h);
        scr.appendChild(g);
        return g;
      }
      // from から to へ、山なりに とばす。おわったら その場所に おく
      function fly(g, from, to, ms = 650, lift = 140) {
        const dx = to.x - from.x, dy = to.y - from.y;
        const a = g.animate([
          { transform: 'translate(0,0) scale(1)' },
          { transform: `translate(${dx / 2}px,${dy / 2 - lift}px) scale(1.12)`, offset: 0.5 },
          { transform: `translate(${dx}px,${dy}px) scale(1)` }
        ], { duration: ms, easing: 'ease-in-out', fill: 'forwards' });
        return a.finished.catch(() => { }).then(() => {
          g.style.left = (parseFloat(g.style.left) + dx) + 'px';
          g.style.top = (parseFloat(g.style.top) + dy) + 'px';
          g.getAnimations().forEach(x => x.cancel());
        });
      }
      // ぽんっと とびだして おちる（あめ・おもちゃ）
      function pop(make, at, n = 3, size = 70) {
        for (let i = 0; i < n; i++) {
          const g = flyer(make, at, size);
          const dx = (Math.random() - 0.5) * 300, up = 130 + Math.random() * 130, fall = 70 + Math.random() * 90;
          const a = g.animate([
            { transform: 'translate(0,0) scale(.4) rotate(0)', opacity: 0 },
            { transform: `translate(${dx / 2}px,${-up}px) scale(1) rotate(${dx / 3}deg)`, opacity: 1, offset: 0.45 },
            { transform: `translate(${dx}px,${fall}px) scale(.9) rotate(${dx / 1.5}deg)`, opacity: 0 }
          ], { duration: 1200 + Math.random() * 400, delay: i * 90, easing: 'ease-out', fill: 'both' });
          a.onfinish = () => g.remove();
        }
      }
      const candy = () => {
        const C = [['#f6a04d', '#b796e6'], ['#9fd68e', '#f6a8c8'], ['#b796e6', '#f6d66b'], ['#f47c9c', '#9fd0f0']];
        const [a, b] = pick(C);
        return UI.el('div', 'art art-svg', G.OutingArt.candy(a, b));
      };
      // たべる（ごはんと 同じ うごき。おなかが すこし ふえる）
      async function eat(key, from) {
        const m = chara.mouth();
        const g = flyer(key, from, 130);
        await fly(g, from, { x: m.x, y: m.y + 20 }, 650, 120);
        chara.clearFlash();
        chara.setPose('act_eat');
        for (let i = 0; i < 3; i++) {
          G.Sound.play('munch');
          chara.squish();
          UI.word('もぐ', m.x + 70 - i * 40, m.y - 60 - i * 10, '#c98a5a', 42);
          g.style.transform = `scale(${1 - (i + 1) * 0.3})`;
          UI.sparkles(m.x, m.y + 30, 2, 50, '#fff1d6');
          await sc.wait(560);
        }
        g.remove();
        S.addMeter('hunger', 1);
        G.Sound.play('chime');
        chara.flash('face_happy', 2600);
        chara.hop(30);
        UI.hearts(m.x, m.y - 40, 3);
      }
      // ニューちゃんも もぐもぐ
      function nyuMunch() {
        if (!nyu) return;
        nyu.flash('happy', 2600);
        const m = nyu.point(0.52, 0.38);
        for (let i = 0; i < 3; i++) sc.timeout(() => UI.word('もぐ', m.x + 50 - i * 30, m.y - 40 - i * 10, '#c98a5a', 36), 700 + i * 560);
      }
      // はなび（p = あがる ところ）
      function firework(p) {
        const COLORS = [['#f47c9c', '#ffe27a'], ['#9fd0f0', '#fff6c9'], ['#f6d66b', '#f47c7c'], ['#c9b3ee', '#9fdcbc'], ['#9fdcbc', '#f6a8c8']];
        const [c1, c2] = pick(COLORS);
        const sx = p.x + (Math.random() - 0.5) * 80, sy = 700;
        const trail = UI.el('div', 'fw-trail');
        UI.pos(trail, sx - 7, sy - 7, 14, 14);
        scr.appendChild(trail);
        G.Sound.play('whistle');
        trail.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${p.x - sx}px,${p.y - sy}px)` }], { duration: 650, easing: 'ease-out', fill: 'forwards' });
        sc.timeout(() => {
          trail.remove();
          G.Sound.play('boom');
          const fw = UI.el('div', 'fw-burst', G.OutingArt.firework(c1, c2));
          UI.pos(fw, p.x - 170, p.y - 170, 340, 340);
          scr.appendChild(fw);
          fw.animate([{ transform: 'scale(.15)', opacity: 1 }, { transform: 'scale(1)', opacity: 1, offset: 0.45 }, { transform: 'scale(1.12)', opacity: 0 }],
            { duration: 1600, easing: 'ease-out', fill: 'forwards' }).onfinish = () => fw.remove();
          UI.sparkles(p.x, p.y, 8, 210, c2);
        }, 650);
      }
      // ゆきを ふらせる
      function snow(n) {
        for (let i = 0; i < n; i++) {
          const f = UI.el('div', 'out-snow', G.OutingArt.snowflake());
          const size = 22 + Math.random() * 28;
          UI.pos(f, Math.random() * 1366, -60, size, size);
          scr.appendChild(f);
          f.animate([
            { transform: 'translate(0,0) rotate(0)', opacity: 0 },
            { opacity: 1, offset: 0.1 },
            { transform: `translate(${(Math.random() - 0.5) * 240}px,${1020 + Math.random() * 80}px) rotate(${Math.random() * 360}deg)`, opacity: 0.9 }
          ], { duration: 4200 + Math.random() * 2400, delay: Math.random() * 1800, easing: 'linear', fill: 'both' }).onfinish = () => f.remove();
        }
      }
      // class を つけなおして、CSS の うごきを もう一度 はじめから
      function restart(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

      const X = {
        UI, S, L, N, sc, chara, pick, say, sayNyu, center, flyer, fly, pop, candy, eat, nyuMunch, firework, snow, restart,
        get nyu() { return nyu; },
        wait: (ms) => sc.wait(ms)
      };

      /* ---- タッチできる もの ---- */
      const done = new Set();
      let busy = true, hand = null, idleAt = Date.now() + 99999, hinted = false;
      const dropHand = () => { if (hand) { hand.remove(); hand = null; } };
      const spots = P.spots.map(sp => {
        let el;
        if (sp.nyu) el = nyu.el; // ニューちゃん じしん
        else {
          el = UI.el('div', 'out-prop op-' + sp.id);
          UI.pos(el, sp.x, sp.y, sp.w, sp.h);
          if (sp.art) el.appendChild(G.Assets.node(sp.art, 'op-art'));
          if (sp.sky) [[0.2, 0.3], [0.55, 0.15], [0.82, 0.45]].forEach(([rx, ry], i) => { // はなびの そら：きらきらで タッチを さそう
            const t = UI.el('div', 'star-tw', G.Art.sparkle('#fff6c9'));
            UI.pos(t, sp.w * rx - 22, sp.h * ry - 22, 44, 44);
            t.style.animationDelay = (-i * 0.9) + 's';
            el.appendChild(t);
          });
          el.style.zIndex = sp.z || 1;
          scr.appendChild(el);
        }
        const s = { sp, el };
        UI.tap(el, (e) => use(s, e), { sound: sp.sound === undefined ? 'tap' : sp.sound });
        return s;
      });

      async function use(s, e) {
        const p = e && e.clientX != null ? UI.toStage(e.clientX, e.clientY) : null;
        dropHand();
        idleAt = Date.now() + 10000;
        if (s.sp.instant) s.sp.instant(X, s, p);
        if (busy || G.isRewarding()) {
          if (!s.sp.instant && !s.sp.nyu) s.el.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-3deg)' }, { transform: 'rotate(3deg)' }, { transform: 'rotate(0)' }], { duration: 300 });
          return;
        }
        busy = true;
        bubble.hide();
        const first = !done.has(s.sp.id);
        await sc.guard(s.sp.act(X, s, first, p));
        chara.face(1);
        if (first) { done.add(s.sp.id); setProg(done.size); }
        busy = false;
        idleAt = Date.now() + 10000;
        if (done.size === spots.length) finish();
      }

      /* ---- ヒント：しばらく なにも しないと、まだの ものを ゆびで おしえる ---- */
      sc.interval(() => {
        if (busy || G.isRewarding() || Date.now() < idleAt) return;
        idleAt = Date.now() + 14000;
        const next = spots.find(s => !done.has(s.sp.id));
        if (!next) return;
        const h = next.sp.hint || [0.5, 0.5];
        hand = UI.hand(scr, center(next.el, h[0], h[1]), null, { times: 3 });
        if (!hinted) { hinted = true; say(L.outingHint, 'face_happy'); }
      }, 500);

      /* ---- ついた：あるいて くる → ごあいさつ → ふくが あっていたら ハート ---- */
      async function walkIn() {
        const f = P.chara;
        chara.moveTo(f.x - 760, f.y, 0, false);
        const walks = [chara.moveTo(f.x, f.y, 1500, true)];
        if (nyu && !P.nyuHere) { nyu.place(P.nyu.x - 760); walks.push(nyu.walkTo(P.nyu.x, 1500)); }
        await Promise.all(walks);
      }
      (async () => {
        G.Sound.play('door');
        await sc.guard(walkIn());
        chara.hop(40);
        await sc.guard(P.hello(X));
        if (P.match && P.match(S)) {
          const h = chara.point(0.5, 0.4);
          UI.sparkles(h.x, h.y, 10, 160);
          UI.giveHearts(1, h.x, h.y);
          await sc.guard(say(P.matchLine(L), 'face_happy'));
        }
        if (nyu && !P.nyuHere) await sc.guard(sayNyu(N.outing, 'happy'));
        busy = false;
        idleAt = Date.now() + 6000;
      })();

      /* ---- ぜんぶ ためしたら おしまい：ほめて、ハート、おうちへ ---- */
      async function finish() {
        busy = true;
        dropHand();
        await sc.wait(400);
        const r = chara.rect(), c = { x: r.x + r.w / 2, y: r.y + r.h * 0.3 };
        chara.flash('face_happy', 5000);
        G.Sound.play('fanfare');
        chara.hop(50);
        sc.timeout(() => chara.hop(40), 600);
        UI.sparkles(c.x, c.y, 12, 200);
        UI.hearts(c.x, c.y, 5);
        if (nyu) { nyu.flash('happy', 2400); nyu.hop(); }
        S.setMeter('fun', 5);
        S.addMeter('energy', -1);  // いっぱい あそぶと つかれて、
        S.addMeter('clean', -0.5); // ちょっと よごれる
        UI.giveHearts(2, c.x, c.y);
        await sc.guard(P.bye(X));
        await sc.wait(500);
        G.go('home', { from: 'outing' });
      }
    }
  };
};
G.OUTINGS.forEach(o => { G.Screens['out_' + o.id] = G.outingScreen(o); });
