/*
 * ニューちゃんが 遊びに来る（要件定義書 5.9 F-90〜F-98）
 * ・G.NyuSprite：ニューちゃんの 表示と動き。メイク・ふく・アクセサリーは つけないので（F-9A）、絵を 1まい 出すだけの かるい しくみ
 * ・G.NyuVisit ：いつ 来て、なにを して、いつ 帰るか
 */
window.G = window.G || {};

G.NyuSprite = class {
  /* x, y = 足もとの まんなか（ステージ座標）。h = 高さ */
  constructor(parent, { x, y, h }) {
    const UI = G.UI;
    this.CH = G.CHARACTERS.nyu;
    this.x = x; this.y = y; this.h = h;
    this.el = UI.el('div', 'nyu');
    this.move = UI.el('div', 'ny-move');
    this.flip = UI.el('div', 'ny-flip');
    this.img = document.createElement('img');
    this.img.className = 'ny-img';
    this.img.alt = '';
    this.img.draggable = false;
    this.flip.appendChild(this.img);
    this.move.appendChild(this.flip);
    this.el.appendChild(UI.el('div', 'ny-shadow'));
    this.el.appendChild(this.move);
    parent.appendChild(this.el);
    this.place(x);
    this.setPose('base');
    this.tempTimer = null;
  }
  place(x) {
    this.x = x;
    G.UI.pos(this.el, x - this.h / 2, this.y - this.h, this.h, this.h);
  }
  src(key) {
    const s = this.CH.images[key];
    const ok = (p) => !G.ASSET_FILES || G.ASSET_FILES.indexOf(p) >= 0;
    return ok(s) ? s : this.CH.images.base;
  }
  setPose(key) { this.pose = key; this.img.src = this.src(key); }
  /* しばらく ちがう 顔に して、もとに もどす */
  flash(key, ms = 1600) {
    clearTimeout(this.tempTimer);
    this.setPose(key);
    this.tempTimer = setTimeout(() => { this.tempTimer = null; if (this.el.isConnected) this.setPose('base'); }, ms);
  }
  face(dir) { this.flip.style.transform = dir < 0 ? 'scaleX(-1)' : ''; }
  /* x まで ちょこちょこ 歩く */
  walkTo(x, ms) {
    return new Promise((res) => {
      this.face(x < this.x ? -1 : 1);
      this.el.classList.add('walking');
      this.el.style.transition = `left ${ms}ms linear`;
      void this.el.offsetWidth;
      this.place(x);
      setTimeout(() => {
        this.el.classList.remove('walking');
        this.el.style.transition = '';
        this.face(1);
        res();
      }, ms);
    });
  }
  hop() {
    this.move.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-36px)' }, { transform: 'translateY(0)' }],
      { duration: 420, easing: 'ease-out' });
  }
  /* 絵の わくに 対する 割合の 点（ステージ座標） */
  point(rx, ry) { return { x: this.x - this.h / 2 + this.h * rx, y: this.y - this.h + this.h * ry }; }
  remove() { clearTimeout(this.tempTimer); this.el.remove(); }
};

G.NyuVisit = (function () {
  const X = 1035;           // おへやで 立つ ところ
  const STAY_RETURNS = 3;   // おへやに もどった 回数で これだけ あそんだら 帰る（F-96）
  const STAY_MS = 180000;   // または これだけ たったら
  const CHANCE = 1 / 3;     // おへやに もどったときに 来る 確率
  const V = { active: false, startedAt: 0, returns: 0, petted: false, homeCount: 0, force: false };
  const pick = (a) => Array.isArray(a) ? a[Math.floor(Math.random() * a.length)] : a;

  let ctx = null;   // いまの おへや画面 { scr, sc, chara, sayNya, isBusy, setBusy }
  let sprite = null, bubble = null;

  function sayNyu(text, face, ms = 2400) {
    if (!sprite || !bubble) return Promise.resolve();
    const p = sprite.point(0.5, 0.06);
    bubble.place(p.x, p.y, 'top');
    if (face) sprite.flash(face, ms);
    return bubble.say(text, { who: 'nyu' });
  }

  function spawn(x) {
    const UI = G.UI;
    const h = 460 * G.CHARACTERS.nyu.scale;
    sprite = new G.NyuSprite(ctx.scr, { x, y: 778, h });
    bubble = new UI.Bubble(ctx.scr);
    UI.tap(sprite.el, pet, { sound: 'soft' });
  }

  /* なでる（F-92）。なでて もらえる ハートは 1回の 訪問で 1こまで */
  function pet() {
    if (!sprite || G.isRewarding()) return;
    const UI = G.UI;
    sprite.flash('dreamy', 1800);
    sprite.hop();
    G.Sound.play('meow');
    const h = sprite.point(0.5, 0.2);
    UI.hearts(h.x, h.y, 3);
    if (!V.petted) { V.petted = true; UI.giveHearts(1, h.x, h.y); }
    if (!ctx.isBusy()) sayNyu(pick(G.CHARACTERS.nyu.lines.pet));
  }

  function canStart() {
    if (V.active) return false;
    if (V.force) return true;
    const S = G.State;
    if (S.settings().nyu === false || S.nyuCameToday()) return false;
    if (V.homeCount < 3) return false; // はじめは すこし なれてから（お世話を 2回 したあと）
    return Math.random() < CHANCE;
  }

  /* 来る */
  async function arrive() {
    const S = G.State, L = G.CHARACTER.lines, N = G.CHARACTERS.nyu.lines, sc = ctx.sc;
    V.force = false;
    V.active = true; V.startedAt = Date.now(); V.returns = 0; V.petted = false;
    S.markNyuVisit();
    ctx.setBusy(true);
    spawn(1500);
    G.Sound.play('whoosh');
    await sc.guard(sprite.walkTo(X, 2200));
    sprite.hop();
    await sc.guard(sayNyu(pick(N.arrive), 'happy'));
    if (S.nyuVisits() === 1) {
      await sc.guard(ctx.sayNya(L.nyuIntro, 'face_happy'));
      await sc.guard(sayNyu(N.hello, 'happy'));
    } else {
      await sc.guard(ctx.sayNya(L.nyuWelcome, 'face_happy'));
    }
    if (S.clothes()) { // ふくを ほめてくれる
      await sc.guard(sayNyu(N.praise, 'happy'));
      await sc.guard(ctx.sayNya(L.nyuShy, 'face_dreamy'));
    }
    if (Math.random() < 1 / 3) { // ときどき おみやげ（F-93）
      await sc.guard(sayNyu(N.gift, 'happy'));
      const h = sprite.point(0.5, 0.3);
      G.UI.giveHearts(2, h.x, h.y);
      await sc.guard(ctx.sayNya(L.nyuThanks, 'face_happy'));
    }
    ctx.setBusy(false);
  }

  /* 帰る（F-96） */
  async function leave() {
    const L = G.CHARACTER.lines, N = G.CHARACTERS.nyu.lines, sc = ctx.sc;
    ctx.setBusy(true);
    await sc.guard(sayNyu(N.leave, 'wave', 3000));
    ctx.chara.flash('act_wave', 2600);
    await sc.guard(ctx.sayNya(L.nyuBye, null));
    V.active = false;
    if (bubble) bubble.el.remove();
    await sc.guard(sprite.walkTo(1550, 2200));
    sprite.remove();
    sprite = bubble = null;
    ctx.setBusy(false);
  }

  /* おしゃべり（ときどき） */
  async function chat() {
    const L = G.CHARACTER.lines, N = G.CHARACTERS.nyu.lines, sc = ctx.sc;
    ctx.setBusy(true);
    await sc.guard(sayNyu(pick(N.chat), 'happy'));
    await sc.guard(ctx.sayNya(pick(L.nyuReply), 'face_happy'));
    ctx.setBusy(false);
  }

  return {
    get active() { return V.active; },
    /* ためすとき：つぎに おへやに もどったら かならず 来る */
    set force(v) { V.force = !!v; },

    /* おへやに はいった とき（はじめに よぶ）。来ているなら すぐ となりに 立たせる */
    enterHome(c) {
      ctx = c;
      sprite = bubble = null;
      V.homeCount++;
      if (V.active) spawn(X);
      ctx.sc.add(() => { if (sprite) sprite.remove(); sprite = bubble = null; });
    },

    /* おへやの ごあいさつが おわった あと：おかえり・帰る・来る */
    async afterIntro() {
      const sc = ctx.sc, N = G.CHARACTERS.nyu.lines;
      if (V.active) {
        V.returns++;
        if (V.returns >= STAY_RETURNS || Date.now() - V.startedAt > STAY_MS) { await leave(); return; }
        ctx.setBusy(true);
        await sc.guard(sayNyu(N.welcome, 'happy')); // おかえり（F-95）
        ctx.setBusy(false);
        return;
      }
      if (canStart()) await arrive();
    },

    /* おへやに いる あいだ（ときどき よぶ） */
    tick() {
      if (!V.active || !sprite || ctx.isBusy() || G.isRewarding()) return;
      if (Date.now() - V.startedAt > STAY_MS) { leave(); return; }
      if (Math.random() < 0.035) chat();
    },

    /* またね（おしまい）：いっしょに 手を ふって 帰る */
    async bye(scr, sc) {
      if (!V.active) return;
      V.active = false;
      const UI = G.UI;
      const s = new G.NyuSprite(scr, { x: X + 20, y: 790, h: 480 * G.CHARACTERS.nyu.scale });
      s.setPose('wave');
      const b = new UI.Bubble(scr);
      sc.add(() => s.remove());
      await sc.wait(1600);
      const p = s.point(0.5, 0.06);
      b.place(p.x, p.y, 'top');
      await sc.guard(b.say(G.CHARACTERS.nyu.lines.bye, { who: 'nyu', keep: true }));
    }
  };
})();
