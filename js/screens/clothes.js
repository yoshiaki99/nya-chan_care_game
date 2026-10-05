/* 着せ替え（ふく。要件定義書 5.6.1）：1着ずつ着る。色も えらべる */
window.G = window.G || {};
G.Screens = G.Screens || {};

G.Screens.clothes = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, S = G.State, L = G.CHARACTER.lines;
    const pick = (a) => Array.isArray(a) ? a[Math.floor(Math.random() * a.length)] : a;
    UI.backButton(scr, () => G.go('home'));
    G.dressTabs(scr, 'clothes');

    scr.appendChild(UI.pos(UI.el('div', 'spotlight'), 120, 700, 620, 240));
    const chara = new G.Chara(scr, { x: 430, y: 880, h: 620 });
    chara.setMood('face_prim');
    chara.setPose('face_prim', 0);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.point(0.9, 0.08); bubble.place(Math.min(p.x, 720), p.y - 12, 'right'); };
    const say = (text) => { placeBubble(); return bubble.say(text); };
    G.petting(chara, sc);

    const panel = UI.el('div', 'dress-panel');
    UI.pos(panel, 790, 310, 540, 680);
    scr.appendChild(panel);

    const PER = 6;
    const pages = Math.ceil(G.CLOTHES.length / PER);
    let page = Math.max(0, Math.floor(G.CLOTHES.findIndex(c => c.id === S.clothes()) / PER));
    let gotHeart = false;
    const owned = (c) => S.hasAcc(c); // ハートの数・きせつの プレゼントは アクセサリーと 同じ きまり

    function render() {
      panel.innerHTML = '';
      const now = S.clothes();
      G.CLOTHES.slice(page * PER, page * PER + PER).forEach((c, i) => {
        const open = owned(c);
        const e = UI.el('div', 'acc-sw cl-sw' + (open ? '' : ' locked') + (now === c.id ? ' on' : ''));
        UI.pos(e, 18 + (i % 3) * 168, 18 + Math.floor(i / 3) * 178, 150, 158);
        const art = UI.el('div', 'aw-art');
        art.appendChild(G.Accessory.swatch(c.id));
        e.appendChild(art);
        if (open) e.appendChild(UI.el('div', 'aw-label', c.label));
        else if (c.season) e.appendChild(UI.el('div', 'aw-lock', `<span class="aw-gift">🎁</span><span class="aw-month">${c.season.month}がつ</span>`));
        else e.appendChild(UI.el('div', 'aw-lock', `<div class="sl-heart">${G.Art.heart()}</div><div class="sl-num">${c.unlock}</div>`));
        e.appendChild(UI.el('div', 'aw-on', G.Art.heart()));
        panel.appendChild(e);
        UI.tap(e, () => choose(c, e), { sound: open ? 'tap' : 'lock', say: open ? c.label : null });
      });

      // いま 着ている 服の 色
      const cur = G.CLOTHES.find(c => c.id === now);
      if (cur && cur.colors) {
        cur.colors.forEach((col, i) => {
          const dot = UI.el('div', 'cl-color' + (S.clothColorIndex(cur.id) % cur.colors.length === i ? ' on' : ''));
          dot.style.background = col;
          UI.pos(dot, 70 + i * 140, 384, 110, 110);
          panel.appendChild(dot);
          UI.tap(dot, () => recolor(cur, i), { sound: 'tap', say: 'いろ' });
        });
      }

      const off = UI.el('div', 'acc-off' + (now ? '' : ' empty'), '<div class="ao-icon"></div><div class="ao-label">ぬぐ</div>');
      if (now) off.firstChild.appendChild(G.Accessory.swatch(now));
      UI.pos(off, 18, 540, 300, 120);
      panel.appendChild(off);
      UI.tap(off, takeOff, { sound: 'tap', say: 'ぬぐ' });

      if (pages > 1) {
        const fwd = page < pages - 1;
        const nx = UI.el('div', 'page-btn', fwd ? '▶' : '◀');
        UI.pos(nx, 360, 552, 130, 96);
        panel.appendChild(nx);
        UI.tap(nx, () => { page = (page + 1) % pages; render(); }, { sound: 'whoosh', say: fwd ? 'つぎの ふく' : 'まえの ふく' });
      }
    }

    function celebrate() {
      chara.redraw();
      chara.flash('face_happy', 2600);
      chara.hop(30);
      G.Sound.play('sparkle');
      const p = chara.point(0.5, 0.66);
      UI.sparkles(p.x, p.y, 10, 140);
      if (!gotHeart) { gotHeart = true; UI.giveHearts(1, p.x, p.y); }
    }

    function choose(c, e) {
      if (!owned(c)) {
        e.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(0)' }], { duration: 380 });
        chara.flash('face_prim', 2400);
        say(c.season ? c.season.when + L.accSeason : L.dressLocked);
        return;
      }
      if (S.clothes() === c.id) { chara.flash('face_happy', 1500); chara.squish(); return; }
      S.setClothes(c.id);
      celebrate();
      render();
      say(pick(L.clothesDone));
    }

    function recolor(c, i) {
      if (S.clothColorIndex(c.id) % c.colors.length === i) { chara.squish(); return; }
      S.setClothColor(c.id, i);
      celebrate();
      render();
      say(L.clothesColor);
    }

    function takeOff() {
      if (!S.clothes()) { chara.flash('face_prim', 2000); say(L.clothesNone); return; }
      S.setClothes(null);
      chara.redraw();
      chara.squish();
      G.Sound.play('whoosh');
      render();
      say(L.clothesOff);
    }

    render();
    sc.timeout(() => say(L.clothesIntro), 500);
  }
};
