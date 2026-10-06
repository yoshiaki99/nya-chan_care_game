/* オフラインでも遊べるようにする（https で開いたときだけ使われる）
 * ・はじめて開いたとき、ゲームに使うファイルを全部 端末の中に保存する。全部そろってから「準備完了」になる。
 * ・そのあとは保存したものだけで動くので、インターネットにつながっていなくても遊べる。
 * ・新しい版が公開されると、次に開いたときに、変わったファイルだけを受け取って入れかわる。
 * 下の VERSION と FILES は tools/build.py が自動で書きかえるので、手で直さなくてよい。 */
/* @@FILES-BEGIN */
const VERSION = 'dd6e95dc2b';
const FILES = [
  ["index.html", "10450c3dc3"],
  ["assets/characters/nya_act_bath_fluffy.png", "81401cdcec"],
  ["assets/characters/nya_act_bath_foam.png", "fdbed4afb1"],
  ["assets/characters/nya_act_eat.png", "f029eafb01"],
  ["assets/characters/nya_act_play_yarn.png", "3f6380a2da"],
  ["assets/characters/nya_act_sleep.png", "f03dcdeb39"],
  ["assets/characters/nya_act_wave.png", "a6d137a608"],
  ["assets/characters/nya_base.png", "4d2b1d5ae6"],
  ["assets/characters/nya_face_dreamy.png", "be6987c530"],
  ["assets/characters/nya_face_happy.png", "ea1641a05f"],
  ["assets/characters/nya_face_lonely.png", "94b995b1f7"],
  ["assets/characters/nya_face_normal.png", "4f1e1e4813"],
  ["assets/characters/nya_face_prim.png", "84a42f9573"],
  ["assets/characters/nya_face_sleepy.png", "bcce724536"],
  ["assets/characters/nyu_act_wave.png", "2e2839f778"],
  ["assets/characters/nyu_base.png", "123b0e4a49"],
  ["assets/characters/nyu_face_dreamy.png", "ef8f9b193a"],
  ["assets/characters/nyu_face_happy.png", "0d77fd75bc"],
  ["css/style.css", "ec91786029"],
  ["icons/apple-touch-icon.png", "d8d1bbd691"],
  ["icons/icon-192.png", "b0cfaf3cb0"],
  ["icons/icon-512.png", "6dae5d97a6"],
  ["icons/og-image.png", "0d7edd464c"],
  ["js/accessory.js", "c46238ffec"],
  ["js/art.js", "142c4f87e9"],
  ["js/art_play.js", "7136fc5da4"],
  ["js/asset_list.js", "d42ae4a261"],
  ["js/assets.js", "44269b1a2d"],
  ["js/audio.js", "aa3c0b86e6"],
  ["js/chara.js", "47379dcf34"],
  ["js/character.js", "6d8bba1beb"],
  ["js/character_nyu.js", "be4f6ef6bc"],
  ["js/clothes.js", "390de31321"],
  ["js/data.js", "f16030b14a"],
  ["js/main.js", "9ed33ed5cb"],
  ["js/makeup.js", "1cb014dcba"],
  ["js/nyu.js", "0b6b3d6702"],
  ["js/screens/accessory.js", "89c1a400d6"],
  ["js/screens/care.js", "fb249798ed"],
  ["js/screens/clothes.js", "592ecc5921"],
  ["js/screens/dress.js", "6a3586f264"],
  ["js/screens/main.js", "2c9f9b5823"],
  ["js/screens/makeup.js", "6f805b7eb4"],
  ["js/screens/play.js", "276240b224"],
  ["js/screens/play_drawing.js", "60410be85a"],
  ["js/screens/play_photo.js", "90acb56418"],
  ["js/screens/play_teaser.js", "2e7e57902c"],
  ["js/state.js", "ddc1f7358d"],
  ["js/ui.js", "7b01161cdc"],
  ["js/voice.js", "9ad75d9369"],
  ["js/voice_clips.js", "a0f27ea36a"],
  ["manifest.webmanifest", "f1f4bae15a"]
];
/* @@FILES-END */

const PREFIX = 'nya-osewa-';
const CACHE = PREFIX + VERSION;
const SCOPE = new URL(self.registration.scope);
const REV = new Map(FILES);
const keyOf = (path, rev) => new URL(path + '?rev=' + rev, SCOPE).href;

async function tell(msg) {
  const list = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  list.forEach(c => c.postMessage(msg));
}

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const queue = FILES.slice();
    let done = 0;
    const worker = async () => {
      while (queue.length) {
        const [path, rev] = queue.shift();
        const key = keyOf(path, rev);
        let res = await caches.match(key); // 前の版と同じファイルは、取りなおさない
        if (!res) {
          res = await fetch(new URL(path, SCOPE).href, { cache: 'reload' });
          if (!res.ok) throw new Error(path + ' ' + res.status);
        }
        await cache.put(key, res);
        done++;
        tell({ type: 'offline-progress', done, total: FILES.length });
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
    tell({ type: 'offline-version', version: VERSION, total: FILES.length });
  })());
});

self.addEventListener('message', (e) => {
  if (e.data === 'offline-version' && e.source) e.source.postMessage({ type: 'offline-version', version: VERSION, total: FILES.length });
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== SCOPE.origin || !url.pathname.startsWith(SCOPE.pathname)) return;
  let path = decodeURIComponent(url.pathname.slice(SCOPE.pathname.length));
  if (path === '') path = 'index.html';
  const rev = REV.get(path);
  if (rev) {
    e.respondWith(caches.open(CACHE)
      .then(c => c.match(keyOf(path, rev)))
      .then(hit => hit || fetch(req)));
    return;
  }
  if (path.startsWith('assets/')) {
    // まだ無い絵は、すぐ「無い」と返す（ゲームが描いた仮の絵になる）
    e.respondWith(new Response('', { status: 404 }));
  }
  // それ以外は、ふつうにサーバーから受け取る
});
