/* タイトル・おへや（ホーム）・おしまい */
window.G = window.G || {};
G.Screens = G.Screens || {};

/* ================= タイトル（5.1） ================= */
G.Screens.title = {
  bg: 'bg_room', hud: false, bgm: 'room',
  enter(scr, sc) {
    const UI = G.UI, L = G.CHARACTER.lines;
    G.gearButton(scr, sc);
    const logo = UI.el('div', 'title-logo', `<div class="tl-bow">${G.Art.bow('#f4a3b8')}</div><div class="tl-name">${G.CHARACTER.name}</div><div class="tl-sub">おせわゲーム</div>`);
    scr.appendChild(logo);
    UI.tap(logo, () => G.Voice.speak(G.CHARACTER.name + ' おせわゲーム', 'guide'), { sound: 'soft' });

    const chara = new G.Chara(scr, { x: 683, y: 778, h: 420 });
    chara.setMood('title');
    chara.setPose('title', 0);
    const bubble = new UI.Bubble(scr);
    G.petting(chara, sc);

    const start = UI.el('div', 'btn-big btn-start', '<span>はじめる</span>');
    scr.appendChild(start);
    UI.tap(start, () => {
      if (G.State.overLimit()) {
        const p = chara.bubbleSpot(0.3);
        bubble.place(p.x, p.y, p.side);
        chara.flash('face_sleepy', 3500);
        bubble.say(L.limit);
        return;
      }
      G.Voice.speak('はじめる', 'guide');
      G.go('home', { from: 'title' });
    });

    sc.interval(() => {
      const r = chara.rect();
      UI.sparkles(r.x + Math.random() * r.w, r.y + Math.random() * r.h * 0.7, 1, 30);
    }, 1500);
    sc.interval(() => chara.sway(1), 7000);
  }
};

/* ================= おへや（5.2） ================= */
G.Screens.home = {
  bg: 'bg_room', hud: true, bgm: 'room',
  enter(scr, sc, params) {
    const UI = G.UI, S = G.State, L = G.CHARACTER.lines;
    const pick = (a) => Array.isArray(a) ? a[Math.floor(Math.random() * a.length)] : a;
    const NEED = {
      hunger: { line: 'hungry', care: 'food' },
      clean: { line: 'dirty', care: 'bath' },
      fun: { line: 'bored', care: 'play' },
      energy: { line: 'sleepy', care: 'sleep' }
    };
    let busy = false;

    G.gearButton(scr, sc);

    /* げんきメーター */
    const mbox = UI.el('div', 'meters');
    scr.appendChild(mbox);
    const bars = G.METERS.map(mt => { const b = UI.meterBar(mt); mbox.appendChild(b); return b; });

    /* ニャーちゃん */
    const chara = new G.Chara(scr, { x: 683, y: 778, h: 460 });
    const moodFace = () => {
      const low = S.lowest(), v = S.meter(low.id);
      if (v < 0.5) return 'face_lonely';
      if (low.id === 'energy' && v <= 1.5) return 'face_sleepy';
      return 'face_normal';
    };
    chara.setMood(moodFace());
    chara.setPose(chara.mood, 0);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.bubbleSpot(0.34); bubble.place(p.x, p.y, p.side); };
    sc.timeout(placeBubble, 30);
    const say = async (text, face, ms = 2600) => {
      placeBubble();
      if (face) chara.flash(face, ms);
      await bubble.say(text);
    };
    G.petting(chara, sc, { enabled: () => !G.isRewarding() });

    /* おえかきで かいた え（ピアノの上の かべに かざる） */
    const drawn = S.drawing();
    if (drawn) {
      const art = UI.el('div', 'wall-art', `<img src="${drawn}" alt="">`);
      UI.pos(art, 322, 182, 196, 134);
      scr.appendChild(art);
      UI.tap(art, () => { if (!busy && !G.isRewarding()) say(L.drawWall, 'face_happy'); }, { sound: 'sparkle' });
    }

    /* お世話ボタン */
    const btns = {};
    G.CARES.forEach((c, i) => {
      const b = UI.el('div', 'btn-care care-' + c.id);
      UI.pos(b, 150 + i * 176, 838);
      b.appendChild(G.Assets.node(c.icon, 'bc-icon'));
      b.appendChild(UI.el('div', 'bc-label', c.label));
      scr.appendChild(b);
      btns[c.id] = b;
      UI.tap(b, () => onCare(c, b));
    });
    const bye = UI.el('div', 'btn-care btn-bye');
    UI.pos(bye, 1180, 838);
    bye.appendChild(G.Assets.node('icon_bye', 'bc-icon'));
    bye.appendChild(UI.el('div', 'bc-label', 'またね'));
    scr.appendChild(bye);
    UI.tap(bye, () => G.go('end', { reason: 'bye' }), { say: 'またね' });

    function onCare(c, b) {
      if (G.isRewarding()) return;
      const fullLine = { food: 'fullFood', bath: 'fullBath', sleep: 'fullSleep' }[c.id];
      if (fullLine && S.isFull(c.meter)) {
        b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(0)' }], { duration: 400 });
        say(L[fullLine], 'face_prim', 2600);
        chara.tilt(5, 1400);
        return;
      }
      G.Voice.speak(c.label, 'guide');
      G.go(c.id === 'play' ? 'playmenu' : c.id === 'dress' ? (G.lastDressTab || 'dress') : c.id); // おしゃれは さいごに見た リボン／ふく／メイク／アクセサリー
    }

    /* 一番下がっているメーターのヒント（F-14） */
    function hint(force) {
      const low = S.lowest(), v = S.meter(low.id);
      Object.values(btns).forEach(b => b.classList.remove('need'));
      if (v < 3.5) {
        const n = NEED[low.id];
        btns[n.care].classList.add('need');
        const face = v < 0.5 ? 'face_lonely' : (low.id === 'energy' ? 'face_sleepy' : 'face_normal');
        return say(v < 0.5 && Math.random() < 0.5 ? L.lonely : L[n.line], face);
      }
      if (force || Math.random() < 0.6) return say(pick(L.content), Math.random() < 0.5 ? 'face_prim' : 'face_happy');
    }

    /* なにもしていないときの動き（F-15） */
    const idles = [
      async () => { chara.flash('face_sleepy', 2200); G.Sound.play('yawn'); await chara.stretch(); },
      async () => { chara.flash('face_dreamy', 2300); await chara.tilt(-7, 2100); },
      async () => { await chara.sway(2); },
      async () => { chara.flash('face_happy', 1600); const h = chara.point(0.7, 0.15); UI.notes(h.x, h.y, 2); await chara.hop(34); },
      async () => { chara.face(-1); await sc.wait(1900); chara.face(1); },
      async () => { chara.flash('face_prim', 2600); await chara.tilt(5, 2300); }
    ];
    let idleAt = Date.now() + 6000, hintAt = Date.now() + 22000;
    sc.interval(async () => {
      if (busy || G.isRewarding()) return;
      const now = Date.now();
      if (now > hintAt) { hintAt = now + 22000 + Math.random() * 8000; idleAt = now + 7000; busy = true; await hint(); busy = false; return; }
      if (now > idleAt) {
        idleAt = now + 7000 + Math.random() * 5000;
        const sleepy = S.meter('energy') < 2 ? [0, 0] : [];
        const list = [0, 1, 2, 3, 4, 5].concat(sleepy);
        await idles[list[Math.floor(Math.random() * list.length)]]();
      }
    }, 500);
    sc.on(scr, 'pointerdown', () => { idleAt = Date.now() + 6000; hintAt = Math.max(hintAt, Date.now() + 12000); });

    /* 時間がたったら（main.js から1秒ごと） */
    this.onTick = () => {
      bars.forEach(b => b.update(true));
      const m = moodFace();
      if (m !== chara.mood) chara.setMood(m);
      if (S.overLimit() && !busy) { busy = true; G.go('end', { reason: 'limit' }); }
    };

    /* はいったとき：ごあいさつ・ごほうび・ヒント */
    (async () => {
      busy = true;
      if (S.overLimit()) { await sc.wait(600); G.go('end', { reason: 'limit' }); return; }
      await sc.wait(700);
      if (params.from === 'title') {
        if (S.isNewDay()) {
          S.markDay();
          chara.hop(40);
          await sc.guard(say(L.greetDaily, 'face_happy', 3800));
          const p = chara.point(0.5, 0.3);
          UI.word(L.dailyHeart, p.x, p.y - 40, '#e7799a', 44);
          G.Voice.speak(L.dailyHeart, 'guide');
          UI.giveHearts(1, p.x, p.y);
          await sc.wait(1600);
        } else {
          await sc.guard(say(pick(L.greetAgain), 'face_happy', 3000));
        }
      }
      await sc.guard(G.checkRewards());
      await sc.wait(300);
      await sc.guard(hint(true) || Promise.resolve());
      busy = false;
      hintAt = Date.now() + 22000;
    })();
    sc.interval(() => { if (!busy) G.checkRewards(); }, 1500);
  },
  leave() { this.onTick = null; }
};

/* ================= おしまい（5.10） ================= */
G.Screens.end = {
  bg: 'bg_room', hud: false, bgm: 'room',
  enter(scr, sc, params) {
    const UI = G.UI, L = G.CHARACTER.lines;
    const reason = params.reason || 'bye';
    const night = reason === 'night';
    if (night) G.setBg('bg_room_night');
    G.State.saveNow();
    const title = UI.el('div', 'end-title', night ? 'おやすみなさい' : 'またね！');
    scr.appendChild(title);

    const chara = new G.Chara(scr, { x: 683, y: 790, h: night ? 440 : 480 });
    const pose = night ? 'act_sleep' : 'act_wave';
    chara.night = night;
    chara.setMood(pose);
    chara.setPose(pose, 0);
    const bubble = new UI.Bubble(scr);
    const again = UI.el('div', 'btn-big btn-again', '<span>はじめに もどる</span>');
    scr.appendChild(again);
    again.style.opacity = '0';
    again.style.pointerEvents = 'none';

    (async () => {
      await sc.wait(500);
      const p = night ? chara.topSpot(0.55, 0.02) : chara.bubbleSpot(0.3);
      bubble.place(p.x, p.y, p.side);
      if (!night) chara.wiggle();
      G.Sound.play(night ? 'lightsOff' : 'meow');
      const line = reason === 'limit' ? L.limit : night ? L.sleepNight : L.bye;
      await sc.guard(bubble.say(line, { keep: true }));
      if (!night) {
        const h = chara.point(0.5, 0.3);
        UI.hearts(h.x, h.y, 5);
      }
      await sc.wait(1200);
      G.Sound.stopBgm();
      again.style.transition = 'opacity .6s';
      again.style.opacity = '1';
      again.style.pointerEvents = '';
    })();
    if (night) sc.interval(() => { const h = chara.point(0.78, 0.3); UI.zzz(h.x, h.y); }, 1600);
    UI.tap(again, () => G.go('title'), { say: 'はじめに もどる' });
  }
};
