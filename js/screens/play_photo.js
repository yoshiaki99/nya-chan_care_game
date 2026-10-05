/* あそぶ：しゃしん とろう（要件定義書 F-73 しゃしんアルバム）
 * ニャーちゃんが つぎつぎ ポーズを とるので、すきな ときに カメラの ボタンで パチリ。5まい とったら おしまい。
 * とった しゃしんは アルバムに のこる（あたらしい ものから G.PHOTO_MAX まい）。アルバムは この画面の「アルバム」から みる */
window.G = window.G || {};
G.Screens = G.Screens || {};

G.Screens.photo = {
  bg: 'bg_room', hud: true,
  enter(scr, sc) {
    const UI = G.UI, S = G.State, L = G.CHARACTER.lines;
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const TOTAL = 5;
    UI.backButton(scr, () => G.go('playmenu'));
    const meter = G.oneMeter(scr, 'fun');
    const setProg = G.progressRow(scr, TOTAL, () => G.Art.all.item_camera());

    // ファインダー（しゃしんに うつる ところ。4:3）
    const VF = { x: 200, y: 290, w: 780, h: 585 };
    const finder = UI.el('div', 'photo-finder', '<i class="pf-c tl"></i><i class="pf-c tr"></i><i class="pf-c bl"></i><i class="pf-c br"></i>');
    UI.pos(finder, VF.x, VF.y, VF.w, VF.h);
    scr.appendChild(finder);

    const chara = new G.Chara(scr, { x: VF.x + VF.w / 2, y: VF.y + VF.h - 50, h: 470 });
    chara.setMood('face_happy');
    chara.setPose('face_happy', 0);
    const bubble = new UI.Bubble(scr);
    const placeBubble = () => { const p = chara.topSpot(0.5, 0.02); bubble.place(p.x, p.y, p.side); };

    const shutter = UI.el('div', 'photo-shutter', `<div class="ps-art">${G.Art.all.item_camera()}</div><div class="ps-label">パチリ</div>`);
    UI.pos(shutter, 1040, 430, 270, 290);
    scr.appendChild(shutter);
    const albumBtn = UI.el('div', 'photo-album-btn', `<div class="pa-art">${G.Art.all.item_album()}</div><div class="pa-label">アルバム</div>`);
    UI.pos(albumBtn, 1085, 790, 180, 190);
    scr.appendChild(albumBtn);

    /* ---- ポーズ（character.js の photoPose と 同じ じゅん） ---- */
    const POSES = [
      { pose: 'face_happy', move: () => chara.hop(34) },
      { pose: 'face_prim', move: () => chara.tilt(6, 1800) },
      { pose: 'act_wave', move: () => chara.wiggle() },
      { pose: 'face_dreamy', move: () => chara.sway(1) }
    ];
    let poseI = 0, count = 0, lastSnap = 0, busy = false, done = false, albumOpen = false, hand = null;
    const shots = [];
    function nextPose(speak) {
      poseI = (poseI + 1 + Math.floor(Math.random() * (POSES.length - 1))) % POSES.length;
      const p = POSES[poseI];
      chara.face(Math.random() < 0.3 ? -1 : 1);
      chara.setPose(p.pose, 260);
      p.move();
      if (speak) { placeBubble(); bubble.say(L.photoPose[poseI], { hold: 300 }); }
    }
    sc.interval(() => {
      if (busy || done || albumOpen) return;
      nextPose(Date.now() - lastSnap > 2500);
    }, 3400);
    sc.on(chara.el, 'pointerdown', (e) => { // さわると ポーズを かえる
      if (busy || done || albumOpen) return;
      e.preventDefault();
      G.Sound.play('meow');
      nextPose(true);
    });

    /* ---- しゃしんを つくる ---- */
    function capture() {
      const OW = 480, OH = 360, k = OW / VF.w;
      const c = document.createElement('canvas');
      c.width = OW; c.height = OH;
      const g = c.getContext('2d');
      if (!g) return null;
      g.fillStyle = '#fbe6ea';
      g.fillRect(0, 0, OW, OH);
      // はいけい：画面と 同じ みえかた（#bg は 画面いっぱいに cover で ひろげている）
      const img = G.Assets.img('bg_room');
      if (img) {
        const vw = window.innerWidth, vh = window.innerHeight, sc0 = UI.getScale();
        const s = Math.max(vw / img.naturalWidth, vh / img.naturalHeight);
        const ox = (vw - img.naturalWidth * s) / 2, oy = (vh - img.naturalHeight * s) / 2;
        const st = document.querySelector('#stage').getBoundingClientRect();
        const sx = (st.left + VF.x * sc0 - ox) / s, sy = (st.top + VF.y * sc0 - oy) / s;
        g.drawImage(img, sx, sy, VF.w * sc0 / s, VF.h * sc0 / s, 0, 0, OW, OH);
      }
      // かげ
      const f = chara.feet();
      const grd = g.createRadialGradient((f.x - VF.x) * k, (f.y - VF.y + 4) * k, 2, (f.x - VF.x) * k, (f.y - VF.y + 4) * k, chara.w * 0.3 * k);
      grd.addColorStop(0, 'rgba(110,60,70,.22)'); grd.addColorStop(1, 'rgba(110,60,70,0)');
      g.save(); g.translate(0, (f.y - VF.y + 4) * k); g.scale(1, 0.18); g.fillStyle = grd;
      g.beginPath(); g.arc((f.x - VF.x) * k, 0, chara.w * 0.3 * k, 0, Math.PI * 2); g.fill(); g.restore();
      // ニャーちゃん（アクセサリーの うしろ → 絵 → アクセサリーの まえ）。
      // ジャンプ・かたむき・いき の 変形も 画面と おなじに かける（ぼうしや メガネが 顔から ずれないように）
      const lin = (el) => {
        try {
          const t = getComputedStyle(el).transform;
          if (!t || t === 'none') return [1, 0, 0, 1];
          const m = new DOMMatrix(t);
          return [m.a, m.b, m.c, m.d];
        } catch (e) { return [1, 0, 0, 1]; }
      };
      const J = lin(chara.jumper), A = lin(chara.actor), B = lin(chara.breather);
      const i = chara.front;
      [chara.accB[i], chara.layers[i], chara.accF[i]].forEach(cv => {
        if (!cv.width || cv.style.display === 'none') return;
        const r = UI.rectOf(cv);
        const w = cv.offsetWidth || r.w, h = cv.offsetHeight || r.h; // かたむいていても もとの 大きさで
        const cx = (r.cx - VF.x) * k, cy = (r.cy - VF.y) * k;
        g.save();
        g.translate(cx, cy);
        g.transform(J[0], J[1], J[2], J[3], 0, 0);
        if (chara.facing < 0) g.scale(-1, 1);
        g.transform(A[0], A[1], A[2], A[3], 0, 0);
        g.transform(B[0], B[1], B[2], B[3], 0, 0);
        g.drawImage(cv, -w * k / 2, -h * k / 2, w * k, h * k);
        g.restore();
      });
      // ひづけ（むかしの カメラみたいに）
      const d = new Date();
      g.font = 'bold 22px "Courier New", monospace';
      g.fillStyle = 'rgba(255,150,60,.92)';
      g.textAlign = 'right';
      g.fillText(`${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`, OW - 16, OH - 14);
      const url = c.toDataURL('image/jpeg', 0.82);
      G.freeCanvas(c); // しゃしんに したら canvas は もう いらない
      return url;
    }

    async function snap() {
      if (busy || done || albumOpen) return;
      busy = true;
      if (hand) { hand.remove(); hand = null; }
      bubble.hide();
      G.Sound.play('shutter');
      let data = null;
      try { data = capture(); } catch (e) { data = null; }
      if (!data) { busy = false; return; } // とれなかったら もう一度 おせるように
      S.addPhoto(data);
      shots.push(data);
      lastSnap = Date.now();
      const flash = UI.el('div', 'photo-flash');
      flash.style.opacity = '0'; // おわった しゅんかんに 白く もどらないように
      scr.appendChild(flash);
      flash.animate([{ opacity: 0.95 }, { opacity: 0 }], { duration: 450, easing: 'ease-out' }).onfinish = () => flash.remove();
      // ポラロイドが カメラから でてきて、アルバムへ とんでいく（ニャーちゃんに かさねない）
      const pol = UI.el('div', 'polaroid', `<img src="${data}" alt="">`);
      const sr = UI.rectOf(shutter), PW = 300, PH = 256;
      const px = Math.min(UI.W - 8 - PW / 2, sr.cx), py = sr.cy;
      UI.pos(pol, px - PW / 2, py - PH / 2, PW, PH);
      scr.appendChild(pol);
      const ar = UI.rectOf(albumBtn);
      const dx = ar.cx - px, dy = ar.cy - py;
      pol.animate([
        { transform: 'scale(.6) rotate(0)', opacity: 0 },
        { transform: 'scale(1.05) rotate(-4deg)', opacity: 1, offset: 0.2 },
        { transform: 'scale(1) rotate(-4deg)', opacity: 1, offset: 0.6 },
        { transform: `translate(${dx}px,${dy}px) scale(.25) rotate(12deg)`, opacity: 0.6 }
      ], { duration: 1900, easing: 'ease-in-out', fill: 'forwards' }).onfinish = () => {
        pol.remove();
        albumBtn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 300 });
        G.Sound.play('heart');
      };
      count++;
      setProg(count);
      await sc.wait(600);
      chara.flash('face_happy', 1500);
      chara.squish();
      if (count >= TOTAL) { finish(); return; }
      placeBubble();
      bubble.say(pick(L.photoSnap), { hold: 200 });
      await sc.wait(900);
      busy = false;
    }

    async function finish() {
      done = true;
      await sc.wait(1500);
      // ニャーちゃんは ひだりへ よけて、あいた ところに きょう とった しゃしんを ならべて みせる（かおに かさねない）
      chara.face(-1); // あるく ほうを むいて
      await sc.guard(chara.moveTo(320, chara.feet().y, 700));
      chara.face(1);  // ついたら しゃしんの ほうを むく
      const spread = UI.el('div', 'photo-spread');
      scr.appendChild(spread);
      const X0 = 540, X1 = UI.W - 20 - 240;
      const step = shots.length > 1 ? Math.min(170, (X1 - X0) / (shots.length - 1)) : 0;
      shots.forEach((d, n) => {
        const p = UI.el('div', 'polaroid small', `<img src="${d}" alt="">`);
        const x = X0 + n * step, rot = (n % 2 ? 6 : -6) + (n - 2) * 2;
        UI.pos(p, x, 330 + (n % 2) * 40, 240, 206);
        p.style.transform = `rotate(${rot}deg)`;
        spread.appendChild(p);
        p.animate([{ transform: `translateY(80px) rotate(${rot}deg) scale(.5)`, opacity: 0 }, { transform: `rotate(${rot}deg)`, opacity: 1 }], { duration: 400, delay: n * 120, fill: 'backwards', easing: 'ease-out' });
      });
      G.Sound.play('sparkle');
      await sc.wait(900);
      G.finishGame(sc, chara, bubble, placeBubble, L.photoDone, meter);
    }

    UI.tap(shutter, snap, { sound: false });
    UI.tap(albumBtn, () => { if (!busy && !done) openAlbum(); }, { say: 'アルバム' });

    /* ---- アルバム（この画面の上に ひらく） ---- */
    function openAlbum() {
      albumOpen = true;
      bubble.hide();
      if (hand) { hand.remove(); hand = null; }
      const list = S.photos().slice().reverse(); // あたらしい ものから
      const PER = 8;
      const pages = Math.max(1, Math.ceil(list.length / PER));
      let page = 0;
      const wrap = UI.el('div', 'album-wrap');
      const book = UI.el('div', 'book album-book');
      UI.pos(book, 168, 140, 1030, 700);
      wrap.appendChild(book);
      const close = UI.el('div', 'btn-big album-close', '<span>とじる</span>');
      wrap.appendChild(close);
      scr.appendChild(wrap);
      requestAnimationFrame(() => wrap.classList.add('show'));
      function render() {
        book.innerHTML = '';
        if (!list.length) {
          book.appendChild(UI.pos(UI.el('div', 'album-empty', L.albumEmpty), 0, 300, 1030, 80));
          return;
        }
        list.slice(page * PER, page * PER + PER).forEach((ph, n) => {
          const p = UI.el('div', 'polaroid small', `<img src="${ph.d}" alt="">`);
          const rot = ((page * PER + n) * 37 % 9) - 4;
          UI.pos(p, 46 + (n % 4) * 244, 40 + Math.floor(n / 4) * 290, 214, 186);
          p.style.transform = `rotate(${rot}deg)`;
          book.appendChild(p);
          UI.tap(p, () => zoom(ph.d), { sound: 'soft' });
        });
        if (pages > 1) {
          const fwd = page < pages - 1;
          const nx = UI.el('div', 'page-btn', fwd ? '▶' : '◀');
          UI.pos(nx, 450, 600, 130, 84);
          book.appendChild(nx);
          UI.tap(nx, () => { page = (page + 1) % pages; render(); }, { sound: 'whoosh', say: fwd ? 'つぎの ページ' : 'まえの ページ' });
        }
      }
      function zoom(src) {
        const z = UI.el('div', 'album-zoom', `<div class="polaroid big"><img src="${src}" alt=""></div>`);
        wrap.appendChild(z);
        G.Sound.play('sparkle');
        UI.tap(z, () => z.remove(), { sound: 'soft' });
      }
      render();
      if (!list.length) G.Voice.speak(L.albumEmpty, 'chara');
      UI.tap(close, () => {
        wrap.classList.remove('show');
        setTimeout(() => wrap.remove(), 250);
        albumOpen = false;
      }, { sound: 'back', say: 'とじる' });
    }

    sc.timeout(() => {
      placeBubble();
      bubble.say(L.photoIntro);
      const r = UI.rectOf(shutter);
      hand = UI.hand(scr, { x: r.cx + 30, y: r.cy });
    }, 500);
  }
};
