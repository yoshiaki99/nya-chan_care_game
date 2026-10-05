/* あそぶ：おちゃかい ごっこ
 * ① カップを 2つ テーブルに おく（ニャーちゃんと あなたの ぶん）→ ② ポットで こうちゃを いれる → ③ おさとうを 2こ →
 * ④ おかしを えらぶ → ニャーちゃんが ふーふー して いただく。どうぐの どこを さわっても すすむ（救済） */
window.G = window.G || {};
G.Screens = G.Screens || {};

G.Screens.tea = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, L = G.CHARACTER.lines, PA = G.PlayArt;
    UI.backButton(scr, () => G.go('playmenu'));
    const meter = G.oneMeter(scr, 'fun');

    /* ---- テーブル ---- */
    const table = UI.el('div', 'tea-table');
    UI.pos(table, 262, 566, 760, 330);
    table.appendChild(G.Assets.node('tea_table', 'tt-art'));
    scr.appendChild(table);
    // カップを おく ところ（おさらの 下の まんなか）。0 = ニャーちゃん、1 = あなた
    const SPOTS = [{ x: 900, y: 704 }, { x: 470, y: 740 }];
    const marks = SPOTS.map(s => {
      const m = UI.el('div', 'tea-mark');
      UI.pos(m, s.x - 78, s.y - 34, 156, 44);
      scr.appendChild(m);
      return m;
    });

    const chara = new G.Chara(scr, { x: 1160, y: 900, h: 450 });
    chara.setMood('face_prim');
    chara.setPose('face_prim', 0);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.topSpot(0.5, 0.02); bubble.place(p.x, p.y, p.side); };
    const say = (t, o) => { placeBubble(); return bubble.say(t, o); };

    /* ---- ひだりの どうぐ ---- */
    const TOOLS = [
      { id: 'cup', label: 'カップ', art: 'item_teacup' },
      { id: 'pot', label: 'ポット', art: 'item_teapot' },
      { id: 'sugar', label: 'おさとう', art: 'item_sugarbowl' },
      { id: 'sweets', label: 'おかし', art: 'item_macaron' }
    ];
    const tools = TOOLS.map((t, i) => {
      const e = UI.el('div', 'tool tea-tool');
      e.dataset.i = i;
      UI.pos(e, 34, 168 + i * 206, 180, 190);
      e.appendChild(G.Assets.node(t.art, 't-art'));
      e.appendChild(UI.el('div', 't-label', t.label));
      scr.appendChild(e);
      return e;
    });

    let step = -1, busy = false, hand = null, cupsPut = 0, sugar = 0, sweet = null;
    const cups = [];
    const LINES = [L.teaIntro, L.teaPour, L.teaSugar, L.teaSweets];
    function setStep(n) {
      step = n;
      tools.forEach((t, i) => { t.classList.toggle('active', i === n); t.classList.toggle('done', i < n); });
      if (hand) { hand.remove(); hand = null; }
      const r = UI.rectOf(tools[n]);
      hand = UI.hand(scr, { x: r.cx + 20, y: r.cy });
      say(LINES[n]);
    }
    const clearHand = () => { if (hand) { hand.remove(); hand = null; } };
    const fly = (el, from, to, dur = 600, lift = 120) => el.animate([
      { transform: `translate(${from.x - to.x}px,${from.y - to.y}px) scale(.8)` },
      { transform: `translate(${(from.x - to.x) / 2}px,${(from.y - to.y) / 2 - lift}px) scale(1.05)`, offset: 0.5 },
      { transform: 'translate(0,0) scale(1)' }
    ], { duration: dur, easing: 'ease-in-out' }).finished.catch(() => { });
    const rim = (c) => ({ x: c.x, y: c.y - 122 + 41 }); // カップの ふちの まんなか

    /* ① カップ */
    async function putCup() {
      busy = true;
      clearHand();
      const s = SPOTS[cupsPut];
      const cup = UI.el('div', 'teacup', G.Art.all.item_teacup());
      UI.pos(cup, s.x - 75, s.y - 122, 150, 122);
      cup.style.zIndex = String(3 + cupsPut);
      scr.appendChild(cup);
      const r = UI.rectOf(tools[0]);
      await sc.guard(fly(cup, { x: r.cx, y: r.cy }, { x: s.x, y: s.y - 61 }));
      marks[cupsPut].remove();
      G.Sound.play('clink');
      UI.sparkles(s.x, s.y - 50, 4, 60);
      cups.push({ el: cup, x: s.x, y: s.y });
      cupsPut++;
      if (cupsPut === 1) { chara.flash('face_happy', 1500); chara.squish(); }
      busy = false;
      if (cupsPut >= 2) { await sc.wait(400); setStep(1); }
    }

    /* ② こうちゃ */
    async function pour() {
      busy = true;
      clearHand();
      bubble.hide();
      tools[1].classList.remove('active');
      const pot = UI.el('div', 'teapot', G.Art.all.item_teapot());
      scr.appendChild(pot);
      const K = 200 / 220, CX = 110 * K, CY = 100 * K;
      for (let i = 0; i < 2; i++) {
        const c = cups[i], rr = rim(c);
        // かたむけた ポットの そそぎ口が カップの 上に くるように おく
        const sx = PA.TEAPOT_SPOUT.x * K - CX, sy = PA.TEAPOT_SPOUT.y * K - CY;
        const a = -35 * Math.PI / 180;
        const tx = sx * Math.cos(a) - sy * Math.sin(a), ty = sx * Math.sin(a) + sy * Math.cos(a);
        const px = rr.x - 6 - tx, py = rr.y - 150 - ty;
        UI.pos(pot, px - CX, py - CY, 200, 164);
        if (i === 0) {
          const r = UI.rectOf(tools[1]);
          await sc.guard(fly(pot, { x: r.cx, y: r.cy }, { x: px, y: py }, 700, 80));
        } else {
          await sc.guard(pot.animate([{ transform: `translate(${cups[0].x - cups[1].x}px,0)` }, { transform: 'translate(0,-40px)', offset: 0.5 }, { transform: 'translate(0,0)' }], { duration: 650, easing: 'ease-in-out' }).finished.catch(() => { }));
        }
        await sc.guard(pot.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-35deg)' }], { duration: 400, easing: 'ease-out', fill: 'forwards' }).finished.catch(() => { }));
        const stream = UI.el('div', 'tea-stream');
        UI.pos(stream, rr.x - 6 - 5, rr.y - 150, 10, 150);
        scr.appendChild(stream);
        stream.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 250, fill: 'forwards' });
        G.Sound.play('pour');
        c.el.classList.add('filled');
        if (i === 0) chara.flash('face_dreamy', 1800);
        await sc.wait(1300);
        stream.remove();
        pot.getAnimations().forEach(an => an.cancel());
        await sc.wait(150);
      }
      pot.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-60px)' }], { duration: 400, fill: 'forwards' }).onfinish = () => pot.remove();
      await sc.wait(450);
      busy = false;
      setStep(2);
    }

    /* ③ おさとう */
    async function dropSugar() {
      busy = true;
      clearHand();
      const c = cups[0], rr = rim(c);
      const cube = UI.el('div', 'sugar-cube', G.Art.all.item_sugar());
      UI.pos(cube, rr.x - 20, rr.y - 30, 40, 40);
      scr.appendChild(cube);
      const r = UI.rectOf(tools[2]);
      await sc.guard(fly(cube, { x: r.cx, y: r.cy }, { x: rr.x, y: rr.y - 10 }, 650, 180));
      cube.remove();
      G.Sound.play('plop');
      const rp = UI.el('div', 'tea-ripple');
      UI.pos(rp, rr.x - 40, rr.y - 8, 80, 18);
      scr.appendChild(rp);
      rp.animate([{ transform: 'scale(.3)', opacity: 1 }, { transform: 'scale(1)', opacity: 0 }], { duration: 600, fill: 'forwards' }).onfinish = () => rp.remove();
      sugar++;
      UI.word(String(sugar), rr.x + 40, rr.y - 60, '#e2b04a', 64);
      chara.flash('face_happy', 1200);
      chara.squish();
      busy = false;
      if (sugar >= 2) { await sc.wait(500); setStep(3); }
    }

    /* ④ おかし */
    let choices = [];
    function showSweets() {
      if (choices.length) return;
      clearHand();
      tools[3].classList.remove('active');
      choices = G.TEA_SWEETS.map((id, i) => {
        const f = G.FOODS.find(x => x.id === id);
        const e = UI.el('div', 'food-item tea-sweet');
        UI.pos(e, 330 + i * 200, 800, 150, 150);
        e.appendChild(G.Assets.node(f.art, 'fi-art'));
        e.appendChild(UI.el('div', 'fi-label', f.label));
        scr.appendChild(e);
        e.animate([{ transform: 'translateY(60px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 350, delay: i * 90, fill: 'backwards', easing: 'ease-out' });
        UI.tap(e, () => serve(f, e), { say: f.label });
        return e;
      });
      hand = UI.hand(scr, { x: 600, y: 930 });
    }
    async function serve(f, e) {
      if (sweet || busy) return;
      busy = true;
      clearHand();
      const r = UI.rectOf(e);
      sweet = G.Assets.node(f.art, 'tea-sweet-on');
      UI.pos(sweet, 695, 600, 150, 150);
      scr.appendChild(sweet);
      choices.forEach(c => c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }));
      sc.timeout(() => choices.forEach(c => c.remove()), 320);
      await sc.guard(fly(sweet, { x: r.cx, y: r.cy }, { x: 770, y: 675 }, 600, 100));
      G.Sound.play('place');
      tools[3].classList.add('done');
      await sc.wait(300);
      party();
    }

    /* ニャーちゃんが いただく */
    async function party() {
      const c = cups[0];
      const m = chara.mouth();
      // カップを くちもとへ
      c.el.style.transition = 'transform .7s ease-in-out';
      c.el.style.zIndex = '7';
      c.el.style.transform = `translate(${m.x - 40 - c.x}px,${m.y + 30 - c.y}px) scale(.85)`;
      await sc.wait(700);
      chara.setPose('face_dreamy');
      G.Sound.play('clink');
      UI.sparkles(m.x, m.y, 4, 60);
      await sc.guard(say(L.teaSip, { hold: 400 }));
      c.el.style.transform = '';
      await sc.wait(700);
      c.el.style.zIndex = '3';
      // おかしも ひとくち
      sweet.style.transition = 'transform .5s ease-in-out';
      sweet.style.transform = `translate(${m.x - 770}px,${m.y - 675}px) scale(.7)`;
      await sc.wait(500);
      chara.setPose('act_eat');
      for (let i = 0; i < 3; i++) {
        G.Sound.play('munch');
        chara.squish();
        sweet.style.transform = `translate(${m.x - 770}px,${m.y - 675}px) scale(${0.7 - (i + 1) * 0.22})`;
        await sc.wait(550);
      }
      sweet.remove();
      chara.setPose('face_prim');
      chara.tilt(5, 1600);
      UI.hearts(m.x, m.y - 40, 3);
      await sc.guard(say(L.teaYum, { hold: 300 }));
      G.finishGame(sc, chara, bubble, placeBubble, L.teaDone, meter, { fed: true });
    }

    function act() {
      if (busy) return;
      if (step === 0 && cupsPut < 2) putCup();
      else if (step === 1) pour();
      else if (step === 2 && sugar < 2) dropSugar();
      else if (step === 3) showSweets();
    }
    sc.on(scr, 'pointerdown', (e) => {
      if (e.target.closest('.btn-back, .bubble, .tea-sweet')) return;
      const te = e.target.closest('.tea-tool');
      if (te) {
        G.Sound.play('press');
        te.animate([{ transform: 'scale(1)' }, { transform: 'scale(.9)' }, { transform: 'scale(1)' }], { duration: 200 });
        const i = parseInt(te.dataset.i, 10);
        if (i !== step) { if (step >= 0 && step <= 3 && !busy) say(LINES[step]); return; }
      }
      e.preventDefault();
      act(); // どこを さわっても すすむ
    });

    sc.timeout(() => setStep(0), 500);
  }
};
