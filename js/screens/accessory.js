/* アクセサリー（おしゃれ）：あたま・かお・くび・せなか・しっぽ に 1つずつ */
window.G = window.G || {};
G.Screens = G.Screens || {};

G.Screens.accessory = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, S = G.State, L = G.CHARACTER.lines;
    const pick = (a) => Array.isArray(a) ? a[Math.floor(Math.random() * a.length)] : a;
    UI.backButton(scr, () => G.go('home'));
    G.dressTabs(scr, 'accessory');

    scr.appendChild(UI.pos(UI.el('div', 'spotlight'), 120, 700, 620, 240));
    const chara = new G.Chara(scr, { x: 430, y: 880, h: 620 });
    chara.setMood('face_prim');
    chara.setPose('face_prim', 0);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.point(0.9, 0.08); bubble.place(Math.min(p.x, 720), p.y - 12, 'right'); };
    const say = (text) => { placeBubble(); return bubble.say(text); };
    G.petting(chara, sc);

    /* ---- 右のパネル ---- */
    const panel = UI.el('div', 'dress-panel');
    UI.pos(panel, 790, 310, 540, 680);
    scr.appendChild(panel);

    // つける場所
    const slotBtns = {};
    G.ACCESSORY_SLOTS.forEach((s, i) => {
      const b = UI.el('div', 'acc-slot', `<div class="as-icon"></div><div class="as-label">${s.label}</div><div class="as-dot">${G.Art.heart()}</div>`);
      b.firstChild.appendChild(G.Accessory.swatch(s.icon));
      UI.pos(b, 12 + i * 102, 14, 98, 128);
      panel.appendChild(b);
      slotBtns[s.id] = b;
      UI.tap(b, () => setSlot(s.id), { sound: 'tap', say: s.label });
    });
    const itemBox = UI.el('div', 'acc-items');
    panel.appendChild(itemBox);
    const off = UI.el('div', 'acc-off', '<div class="ao-icon"></div><div class="ao-label">はずす</div>');
    UI.pos(off, 120, 530, 300, 120);
    panel.appendChild(off);
    UI.tap(off, takeOff, { sound: 'tap', say: 'はずす' });

    let slot = G.lastAccSlot || 'head';
    let cells = [];
    let gotHeart = false;

    function setSlot(id) {
      slot = G.lastAccSlot = id;
      itemBox.innerHTML = '';
      cells = G.ACCESSORIES.filter(a => a.slot === id).map((a, i) => {
        const open = S.hasAcc(a);
        const e = UI.el('div', 'acc-sw' + (open ? '' : ' locked'));
        UI.pos(e, 18 + (i % 3) * 168, 166 + Math.floor(i / 3) * 178, 150, 158);
        const art = UI.el('div', 'aw-art');
        art.appendChild(G.Accessory.swatch(a.id));
        e.appendChild(art);
        if (open) e.appendChild(UI.el('div', 'aw-label', a.label));
        else if (a.season) e.appendChild(UI.el('div', 'aw-lock', `<span class="aw-gift">🎁</span><span class="aw-month">${a.season.month}がつ</span>`));
        else e.appendChild(UI.el('div', 'aw-lock', `<div class="sl-heart">${G.Art.heart()}</div><div class="sl-num">${a.unlock}</div>`));
        e.appendChild(UI.el('div', 'aw-on', G.Art.heart()));
        itemBox.appendChild(e);
        UI.tap(e, () => choose(a, e), { sound: open ? 'tap' : 'lock', say: open ? a.label : null });
        return { a, e };
      });
      refresh();
    }
    /* つけている しるし */
    function refresh() {
      const w = S.wear();
      Object.entries(slotBtns).forEach(([k, b]) => {
        b.classList.toggle('on', k === slot);
        b.classList.toggle('worn', !!w[k]);
      });
      cells.forEach(({ a, e }) => e.classList.toggle('on', w[slot] === a.id));
      const icon = off.firstChild;
      icon.innerHTML = '';
      if (w[slot]) icon.appendChild(G.Accessory.swatch(w[slot]));
      off.classList.toggle('empty', !w[slot]);
    }
    /* キラキラを出す場所（つけた ところ） */
    function sparkleAt(s) {
      const p = { head: [0.45, 0.1], face: [0.62, 0.36], neck: [0.68, 0.6], back: [0.2, 0.5], tail: [0.18, 0.78] }[s];
      return chara.point(p[0], p[1]);
    }

    function choose(a, e) {
      if (!S.hasAcc(a)) {
        e.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(0)' }], { duration: 380 });
        chara.flash('face_prim', 2400);
        say(a.season ? a.season.when + L.accSeason : L.dressLocked);
        return;
      }
      if (S.wear()[a.slot] === a.id) { chara.flash('face_happy', 1500); chara.squish(); return; }
      S.setWear(a.slot, a.id);
      chara.redraw();
      chara.flash('face_happy', 2600);
      chara.hop(30);
      G.Sound.play('sparkle');
      const p = sparkleAt(a.slot);
      UI.sparkles(p.x, p.y, 8, 110);
      refresh();
      if (!gotHeart) { gotHeart = true; UI.giveHearts(1, p.x, p.y); }
      say(pick(L.accDone));
    }

    function takeOff() {
      if (!S.wear()[slot]) { chara.flash('face_prim', 2000); say(L.accNone); return; }
      S.setWear(slot, null);
      chara.redraw();
      chara.squish();
      G.Sound.play('whoosh');
      refresh();
      say(L.accOff);
    }

    setSlot(slot);
    sc.timeout(() => say(L.accIntro), 500);
  }
};
