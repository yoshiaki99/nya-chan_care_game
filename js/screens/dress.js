/* おしゃれ（5.8）・シールちょう（5.9） */
window.G = window.G || {};
G.Screens = G.Screens || {};

/* おしゃれの上の「リボン｜メイク｜アクセサリー」きりかえ */
G.dressTabs = function (scr, active) {
  const UI = G.UI;
  const box = UI.el('div', 'dress-tabs');
  UI.pos(box, 287, 20);
  [['dress', 'リボン', G.Art.all.icon_dress()], ['makeup', 'メイク', G.Art.all.icon_makeup()], ['accessory', 'アクセサリー', '']].forEach(([id, label, art]) => {
    const long = label.length > 4;
    const t = UI.el('div', 'dtab' + (long ? ' long' : '') + (id === active ? ' on' : ''), `<div class="dt-icon">${art}</div><div class="dt-label">${label}</div>`);
    if (id === 'accessory') t.firstChild.appendChild(G.Accessory.swatch('tiara'));
    box.appendChild(t);
    UI.tap(t, () => { if (id !== active) { G.lastDressTab = id; G.go(id); } }, { sound: id === active ? 'soft' : 'whoosh', say: label });
  });
  scr.appendChild(box);
  return box;
};

/* ================= おしゃれ ================= */
G.Screens.dress = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, S = G.State, L = G.CHARACTER.lines;
    UI.backButton(scr, () => G.go('home'));
    G.dressTabs(scr, 'dress');

    scr.appendChild(UI.pos(UI.el('div', 'spotlight'), 120, 700, 620, 240));
    const chara = new G.Chara(scr, { x: 430, y: 880, h: 620 });
    chara.setMood('face_prim');
    chara.setPose('face_prim', 0);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.point(0.9, 0.08); bubble.place(Math.min(p.x, 720), p.y - 12, 'right'); };
    G.petting(chara, sc);

    const panel = UI.el('div', 'dress-panel');
    UI.pos(panel, 790, 336, 540, 650);
    scr.appendChild(panel);

    const PER = 5;
    const pages = Math.ceil(G.RIBBONS.length / PER);
    let page = Math.max(0, Math.floor(G.RIBBONS.findIndex(r => r.id === S.ribbon()) / PER));
    let gotHeart = false;
    const SLOTS = [[50, 44], [205, 44], [360, 44], [127, 262], [282, 262]];

    function swatchArt(r) {
      if (r.art && G.Assets.has(r.art)) return G.Assets.node(r.art, 'sw-art');
      const d = UI.el('div', 'sw-art art-svg', G.Art.bow(r.swatch, r.pattern));
      return d;
    }

    function render() {
      panel.innerHTML = '';
      G.RIBBONS.slice(page * PER, page * PER + PER).forEach((r, i) => {
        const open = S.isUnlocked(r);
        const sw = UI.el('div', 'swatch' + (open ? '' : ' locked') + (S.ribbon() === r.id ? ' sel' : ''));
        UI.pos(sw, SLOTS[i][0], SLOTS[i][1], 130, 130);
        sw.appendChild(swatchArt(r));
        if (open) sw.appendChild(UI.el('div', 'sw-label', r.label));
        else sw.appendChild(UI.el('div', 'sw-lock', `<div class="sl-heart">${G.Art.heart()}</div><div class="sl-num">${r.unlock}</div>`));
        panel.appendChild(sw);
        UI.tap(sw, () => choose(r, sw), { sound: open ? 'tap' : 'lock', say: open ? r.label : null });
      });
      if (pages > 1) {
        const fwd = page < pages - 1;
        const nx = UI.el('div', 'page-btn', fwd ? '▶' : '◀');
        UI.pos(nx, 205, 478, 130, 96);
        panel.appendChild(nx);
        UI.tap(nx, () => { page = (page + 1) % pages; render(); }, { sound: 'whoosh', say: fwd ? 'つぎの リボン' : 'まえの リボン' });
        const dots = UI.el('div', 'page-dots', Array.from({ length: pages }, (_, i) => `<i class="${i === page ? 'on' : ''}"></i>`).join(''));
        UI.pos(dots, 0, 598, 540, 30);
        panel.appendChild(dots);
      }
    }
    render();

    async function choose(r, sw) {
      if (!S.isUnlocked(r)) {
        sw.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(0)' }], { duration: 380 });
        chara.flash('face_prim', 2400);
        placeBubble();
        bubble.say(L.dressLocked);
        return;
      }
      if (S.ribbon() === r.id) { chara.flash('face_happy', 1500); chara.squish(); return; }
      S.setRibbon(r.id);
      chara.redraw();
      chara.flash('face_happy', 2600);
      chara.hop(30);
      G.Sound.play('sparkle');
      const h = chara.point(0.45, 0.1), n = chara.point(0.7, 0.6);
      UI.sparkles(h.x, h.y, 8, 110);
      UI.sparkles(n.x, n.y, 5, 80);
      render();
      if (!gotHeart) { gotHeart = true; UI.giveHearts(1, h.x, h.y); }
      G.CharaArt.warm(r.id);
      placeBubble();
      bubble.say(L.dressDone);
    }

    sc.timeout(() => { placeBubble(); bubble.say(L.dressIntro); }, 500);
  }
};

/* ================= シールちょう ================= */
G.Screens.stickers = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, S = G.State;
    UI.backButton(scr, () => G.go('home'));
    const book = UI.el('div', 'book');
    UI.pos(book, 170, 150, 1030, 690);
    scr.appendChild(book);
    const have = S.stickerCount();
    G.STICKERS.forEach((s, i) => {
      const col = i % 5, row = Math.floor(i / 5);
      const x = 64 + col * 190;
      const slot = UI.el('div', i < have ? 'sticker' : 'slot', i < have ? `<span>${s.e}</span>` : '?');
      UI.pos(slot, x, 34 + row * 160, 140, 140);
      if (i < have) {
        slot.style.transform = `rotate(${((i * 37) % 17) - 8}deg)`;
        UI.tap(slot, () => {
          slot.animate([{ transform: 'scale(1) rotate(0)' }, { transform: 'scale(1.25) rotate(-10deg)' }, { transform: 'scale(1) rotate(0)' }], { duration: 450 });
          const r = UI.rectOf(slot);
          UI.sparkles(r.cx, r.cy, 6, 90);
          G.Voice.speak(s.label, 'guide');
        }, { sound: 'sparkle' });
      }
      book.appendChild(slot);
    });

    // つぎの シールまで
    const prog = UI.el('div', 'book-progress');
    if (have >= G.STICKERS.length) {
      prog.innerHTML = '<span class="bp-crown">👑</span><span class="bp-text">ぜんぶ あつめたよ！</span>';
    } else {
      const left = S.heartsToNextSticker(), got = G.HEARTS_PER_STICKER - left;
      let h = '';
      for (let i = 0; i < G.HEARTS_PER_STICKER; i++) h += `<div class="bp-h">${i < got ? G.Art.heart() : G.Art.heartEmpty('#f37d9b')}</div>`;
      prog.innerHTML = '<div class="bp-label">つぎの シールまで</div>' + h + '<div class="bp-next">?</div>';
    }
    UI.pos(prog, 133, 880, 1100, 100);
    scr.appendChild(prog);
    sc.timeout(() => G.Voice.speak(have >= G.STICKERS.length ? 'ぜんぶ あつめたよ！' : 'シールちょう。 つぎの シールまで ハート あと ' + S.heartsToNextSticker() + 'こ', 'guide'), 400);
  }
};
