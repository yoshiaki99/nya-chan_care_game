/* セーブデータ（N-30, N-31：自動で端末の中に保存する） */
window.G = window.G || {};

G.State = (function () {
  const KEY = 'nya-osewa-v1';
  const FULL = 4.5;      // これ以上なら「いっぱい」（ハート5つ）
  const PET_EVERY = 6;   // なでる 6回で ハート1つ
  const PET_MAX = 5;     // なでて もらえる ハートは 1日5つまで

  function today() {
    const t = new Date();
    return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate();
  }

  function defaults() {
    return {
      v: 1,
      meters: { hunger: 2, clean: 3.5, fun: 2.5, energy: 4.5 },
      hearts: 0,
      ribbon: 'none',
      makeup: { cheek: null, lip: null, eye: null, deco: [] },
      wear: { head: null, face: null, neck: null, back: null, tail: null, body: null }, // アクセサリー・ふく（body）
      clothColor: {}, // ふくの 色（ふくの id → colors の 何ばんめ）
      gifts: [],      // とどいた きせつの アクセサリー
      seenStickers: 0,
      seenUnlock: 0,
      seenAcc: 0,     // アクセサリーの おしらせは リボン・メイクと べつに かぞえる
      seenClothes: 0, // ふくの おしらせも べつに かぞえる
      lastTime: Date.now(),
      lastDay: null,
      play: { day: today(), sec: 0 },
      pet: { day: today(), count: 0, hearts: 0 },
      nyu: { lastDay: null, count: 0 }, // ニューちゃんが 遊びに来た日・回数（要件定義書 N-73）
      settings: { limit: 0, bgm: 0.6, sfx: 0.8, voice: true, decay: 'real', nyu: true }
    };
  }

  let d = defaults();
  let saveTimer = null;

  function merge(base, src) {
    Object.keys(src || {}).forEach(k => {
      if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) merge(base[k], src[k]);
      else base[k] = src[k];
    });
    return base;
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      d = raw ? merge(defaults(), JSON.parse(raw)) : defaults();
    } catch (e) { d = defaults(); }
    // こわれた シール（いちが わからない もの）は すてる。のこすと ニャーちゃんが 描けなくなる
    const m = d.makeup;
    if (!m || typeof m !== 'object') d.makeup = defaults().makeup;
    else m.deco = (Array.isArray(m.deco) ? m.deco : []).filter(s => s && Number.isFinite(s.u) && Number.isFinite(s.v) && Number.isFinite(s.rot));
    catchUp();
    applySettings();
  }
  function hasSave() { try { return !!localStorage.getItem(KEY); } catch (e) { return false; } }

  function saveNow() {
    clearTimeout(saveTimer); saveTimer = null;
    d.lastTime = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* 保存できなくても遊べる */ }
  }
  function save() { if (!saveTimer) saveTimer = setTimeout(saveNow, 400); }

  /* ゲームを閉じていたあいだの分。最低でも1目盛りは残す（F-21） */
  function catchUp() {
    const hrs = Math.max(0, (Date.now() - d.lastTime) / 3.6e6);
    if (d.settings.decay === 'real' && hrs > 0) {
      G.METERS.forEach(mt => {
        const v = d.meters[mt.id];
        d.meters[mt.id] = Math.max(1, v - mt.rate * hrs);
      });
    }
    d.lastTime = Date.now();
  }

  /* 遊んでいるあいだ、1秒ごとに呼ぶ */
  function tick(sec) {
    if (sec > 90) { catchUp(); return; } // 画面を閉じていたなど
    const mul = d.settings.decay === 'real' ? 1 : 6;
    G.METERS.forEach(mt => {
      d.meters[mt.id] = Math.max(0, d.meters[mt.id] - mt.rate * mul * sec / 3600);
    });
    if (d.play.day !== today()) d.play = { day: today(), sec: 0 };
    d.play.sec += sec;
    d.lastTime = Date.now();
    save();
  }

  /* ---- メーター ---- */
  const meter = (id) => d.meters[id];
  function setMeter(id, v) { d.meters[id] = Math.min(5, Math.max(0, v)); save(); }
  function addMeter(id, dv) { setMeter(id, d.meters[id] + dv); }
  function level(id) { const v = d.meters[id]; return v <= 0.05 ? 0 : Math.max(1, Math.min(5, Math.round(v))); }
  const isFull = (id) => d.meters[id] >= FULL;
  function lowest() {
    return G.METERS.slice().sort((a, b) => d.meters[a.id] - d.meters[b.id])[0];
  }

  /* ---- ハート・シール・リボン ---- */
  function addHearts(n) { d.hearts += n; save(); }
  const hearts = () => d.hearts;
  const stickerCount = () => Math.min(G.STICKERS.length, Math.floor(d.hearts / G.HEARTS_PER_STICKER));
  function takeNewStickers() {
    const out = [];
    for (let i = d.seenStickers; i < stickerCount(); i++) out.push(i);
    d.seenStickers = stickerCount(); save();
    return out;
  }
  /* あたらしく つかえるようになった リボン・メイク・アクセサリー。メイクは { cat, item } で返す */
  function takeNewUnlocks() {
    const isNew = (x) => x.unlock > d.seenUnlock && x.unlock <= d.hearts;
    const ribbons = G.RIBBONS.filter(isNew);
    const looks = [];
    G.MAKEUP.forEach(c => c.items.filter(isNew).forEach(it => looks.push({ cat: c, item: it })));
    const all = ribbons.concat(looks.map(m => m.item));
    if (all.length) { d.seenUnlock = Math.max.apply(null, all.map(x => x.unlock)); save(); }
    const acc = G.ACCESSORIES.filter(a => !a.season && a.unlock > d.seenAcc && a.unlock <= d.hearts);
    if (acc.length) { d.seenAcc = Math.max.apply(null, acc.map(a => a.unlock)); save(); }
    const clothes = G.CLOTHES.filter(c => !c.season && c.unlock > d.seenClothes && c.unlock <= d.hearts);
    if (clothes.length) { d.seenClothes = Math.max.apply(null, clothes.map(c => c.unlock)); save(); }
    return { ribbons, makeup: looks, acc, clothes };
  }
  const isUnlocked = (rb) => rb.unlock <= d.hearts;
  function heartsToNextSticker() {
    if (stickerCount() >= G.STICKERS.length) return 0;
    return G.HEARTS_PER_STICKER - (d.hearts % G.HEARTS_PER_STICKER);
  }

  const ribbon = () => d.ribbon;
  function setRibbon(id) { d.ribbon = id; save(); }

  /* ---- メイク ---- */
  const makeup = () => d.makeup;
  function setMakeup(cat, id) { d.makeup[cat] = id; save(); }
  function addDeco(s) {
    if (!s || !Number.isFinite(s.u) || !Number.isFinite(s.v) || !Number.isFinite(s.rot)) return;
    d.makeup.deco.push(s);
    while (d.makeup.deco.length > G.MAKEUP_DECO_MAX) d.makeup.deco.shift();
    save();
  }
  function hasMakeup() { const m = d.makeup; return !!(m.cheek || m.lip || m.eye || m.deco.length); }
  function clearMakeup() { d.makeup = { cheek: null, lip: null, eye: null, deco: [] }; save(); }

  /* ---- アクセサリー ---- */
  const wear = () => d.wear;
  function setWear(slot, id) { d.wear[slot] = id; save(); }
  const hasAcc = (a) => (a.season ? d.gifts.indexOf(a.id) >= 0 : a.unlock <= d.hearts);

  /* ---- ふく（着せ替え） ---- */
  const clothes = () => d.wear.body || null;
  function setClothes(id) { d.wear.body = id; save(); }
  const clothColorIndex = (id) => d.clothColor[id] || 0;
  function clothColor(id) {
    const c = G.CLOTHES.find(x => x.id === id);
    return c && c.colors ? c.colors[clothColorIndex(id) % c.colors.length] : null;
  }
  function setClothColor(id, i) { d.clothColor[id] = i; save(); }
  /* その月の きせつの アクセサリーを とどける（とどいたら ずっと つかえる） */
  function takeSeasonGifts() {
    const m = new Date().getMonth() + 1;
    const out = G.ACCESSORIES.concat(G.CLOTHES).filter(a => a.season && a.season.month === m && d.gifts.indexOf(a.id) < 0);
    if (out.length) { out.forEach(a => d.gifts.push(a.id)); save(); }
    return out;
  }

  /* ---- しゃしん・おえかき（絵は大きいので、ふだんのセーブとは べつの場所に しまう） ---- */
  const ALBUM_KEY = KEY + '-album', DRAWING_KEY = KEY + '-drawing';
  function photos() {
    try { const raw = localStorage.getItem(ALBUM_KEY); return raw ? JSON.parse(raw) : []; } catch (e) { return []; }
  }
  /* しゃしんを 1まい しまう。いっぱいの ときは 古いものから はずす */
  function addPhoto(dataUrl) {
    const list = photos();
    list.push({ d: dataUrl, t: Date.now() });
    while (list.length > G.PHOTO_MAX) list.shift();
    while (list.length) {
      try { localStorage.setItem(ALBUM_KEY, JSON.stringify(list)); return true; } catch (e) { list.shift(); }
    }
    return false;
  }
  function drawing() { try { return localStorage.getItem(DRAWING_KEY); } catch (e) { return null; } }
  function setDrawing(dataUrl) { try { localStorage.setItem(DRAWING_KEY, dataUrl); return true; } catch (e) { return false; } }

  /* ---- 毎日 ---- */
  const isNewDay = () => d.lastDay !== today();
  function markDay() { d.lastDay = today(); save(); }
  function favoriteFood() {
    const s = today().split('-').reduce((a, x) => a * 31 + parseInt(x, 10), 7);
    return G.FOODS[s % G.FOODS.length].id;
  }
  function pet() {
    if (d.pet.day !== today()) d.pet = { day: today(), count: 0, hearts: 0 };
    d.pet.count++;
    let heart = false;
    if (d.pet.count % PET_EVERY === 0 && d.pet.hearts < PET_MAX) { d.pet.hearts++; heart = true; }
    save();
    return heart;
  }

  /* ---- ニューちゃん（F-90：1日に 1回まで） ---- */
  const nyuCameToday = () => d.nyu.lastDay === today();
  const nyuVisits = () => d.nyu.count;
  function markNyuVisit() { d.nyu.lastDay = today(); d.nyu.count++; save(); }

  /* ---- プレイ時間（F-101） ---- */
  function playSecToday() { return d.play.day === today() ? d.play.sec : 0; }
  function overLimit() { return d.settings.limit > 0 && playSecToday() >= d.settings.limit * 60; }

  /* ---- 保護者の設定 ---- */
  const settings = () => d.settings;
  function setSetting(k, v) { d.settings[k] = v; applySettings(); saveNow(); }
  function applySettings() {
    const s = d.settings;
    G.Sound.setVolume(s.bgm, s.sfx);
    G.Voice.set({ enabled: s.voice });
  }
  function reset() {
    const keep = d.settings;
    d = defaults();
    d.settings = keep;
    saveNow();
  }

  return {
    load, save, saveNow, hasSave, tick, catchUp,
    meter, setMeter, addMeter, level, isFull, lowest,
    addHearts, hearts, stickerCount, takeNewStickers, takeNewUnlocks, isUnlocked, heartsToNextSticker,
    ribbon, setRibbon, makeup, setMakeup, addDeco, hasMakeup, clearMakeup,
    wear, setWear, hasAcc, takeSeasonGifts, clothes, setClothes, clothColor, clothColorIndex, setClothColor, photos, addPhoto, drawing, setDrawing, isNewDay, markDay, favoriteFood, pet,
    nyuCameToday, nyuVisits, markNyuVisit,
    playSecToday, overLimit, settings, setSetting, reset
  };
})();
