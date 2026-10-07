/* おりょうりゲームとの 行き来（要件定義書 5.11 F-B0〜F-B6。おりょうりゲームの 要件定義書 5.14・6.7 と 同じ きまり）
 * 2つの ゲームは 同じ サイト（yoshiaki99.github.io）に あるので、ページを 切りかえて 行き来する。
 * おりょうりゲームで ためた ハートは、端末の 中の「わたしばこ」（nya-link-v1）に 入って とどく。サーバーは つかわない。
 *
 * わたしばこ = { v: 1,
 *   box:   [{ id, hearts, together, t }],   … とどけもの。おりょうりゲームが 足して、こちらが 受けとって 消す
 *   play:  { day, sec },                     … 2つの ゲームで あわせた 今日の プレイ時間
 *   limit: { osewa: 分, ryouri: 分 } }       … それぞれの 保護者メニューの 上限（0 = なし）。みじかい ほうを つかう
 * こわれていたり 知らない 版だったり したら、何も しない
 */
window.G = window.G || {};

G.Link = (function () {
  const KEY = 'nya-link-v1';
  const COOK_URL = '../nya-chan_cooking_game/'; // おなじ サイトの おりょうりゲーム
  const ME = 'osewa';
  const fromCooking = new URLSearchParams(location.search).get('from') === 'ryouri';
  // アドレスの しるしは 読んだら けす（読みこみなおしたときに また タイトルを とばさないように）
  if (fromCooking && history.replaceState) { try { history.replaceState(null, '', location.pathname); } catch (e) { /* なし */ } }

  const today = () => { const t = new Date(); return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate(); };
  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { v: 1, box: [], play: { day: today(), sec: 0 }, limit: {} };
      const d = JSON.parse(raw);
      if (!d || d.v !== 1 || !Array.isArray(d.box)) return null; // 知らない 版・こわれている
      if (!d.play || d.play.day !== today()) d.play = { day: today(), sec: 0 };
      if (!d.limit || typeof d.limit !== 'object') d.limit = {};
      return d;
    } catch (e) { return null; }
  }
  function write(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); return true; } catch (e) { return false; } }

  /* とどいた ハートを 受けとる。同じ とどけもの（id）は 2回 受けとらない（2つの タブで ひらいていても ふえすぎない）。
   * かえすもの：{ hearts, together } */
  function receive() {
    const d = read();
    const out = { hearts: 0, together: 0 };
    if (!d || !d.box.length) return out;
    const S = G.State;
    d.box.forEach(it => {
      if (!it || typeof it.id !== 'string' || S.linkSeen(it.id)) return;
      const h = Math.max(0, Math.min(500, Math.floor(+it.hearts || 0)));      // へんな 数は つかわない
      const t = Math.max(0, Math.min(20, Math.floor(+it.together || 0)));
      out.hearts += h; out.together += t;
      S.markLinkSeen(it.id);
    });
    d.box = [];
    write(d);
    return out;
  }

  /* プレイ時間を あわせて かぞえる。G.State.tick から */
  let pend = 0;
  function addPlay(sec) {
    pend += sec;
    if (pend < 5) return; // 5びょうごとに まとめて 書く
    const d = read();
    if (!d) return;
    d.play.sec += pend; pend = 0;
    write(d);
  }
  function playSecToday() { const d = read(); return d ? d.play.sec + pend : 0; }
  function setLimit(min) { const d = read(); if (!d) return; d.limit[ME] = min || 0; write(d); }
  function limitMin() {
    const d = read();
    const all = d ? Object.values(d.limit).filter(v => v > 0) : [];
    return all.length ? Math.min.apply(null, all) : 0;
  }

  /* おりょうりゲームが この 端末で ひらける か（インターネットに つながっていないのに、まだ 保存されて いないと ひらけない） */
  async function cookingReachable() {
    if (navigator.onLine !== false) return true;
    try { return (await caches.keys()).some(k => k.indexOf('nya-ryouri-') === 0); } catch (e) { return false; }
  }
  function goCooking() {
    G.State.saveNow();
    location.href = COOK_URL + '?from=osewa';
  }

  return { fromCooking, receive, addPlay, playSecToday, setLimit, limitMin, cookingReachable, goCooking };
})();
