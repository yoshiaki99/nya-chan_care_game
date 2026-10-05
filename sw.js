/* オフラインでも遊べるようにする（https で開いたときだけ使われる）
 * ・はじめて開いたとき、ゲームに使うファイルを全部 端末の中に保存する。全部そろってから「準備完了」になる。
 * ・そのあとは保存したものだけで動くので、インターネットにつながっていなくても遊べる。
 * ・新しい版が公開されると、次に開いたときに、変わったファイルだけを受け取って入れかわる。
 * 下の VERSION と FILES は tools/build.py が自動で書きかえるので、手で直さなくてよい。 */
/* @@FILES-BEGIN */
const VERSION = '2e4a090dee';
const FILES = [
  ["index.html", "64d85ef77b"],
  ["assets/characters/nya_base.png", "4d2b1d5ae6"],
  ["css/style.css", "7d0af7a4b0"],
  ["icons/apple-touch-icon.png", "d8d1bbd691"],
  ["icons/icon-192.png", "b0cfaf3cb0"],
  ["icons/icon-512.png", "6dae5d97a6"],
  ["icons/og-image.png", "0d7edd464c"],
  ["js/accessory.js", "2eee7a2878"],
  ["js/art.js", "74bafbd9be"],
  ["js/art_play.js", "cead13697d"],
  ["js/assets.js", "49ffa77ec0"],
  ["js/audio.js", "056aadc0fd"],
  ["js/chara.js", "42a14ec2b7"],
  ["js/character.js", "2311eb1414"],
  ["js/data.js", "b4243796ee"],
  ["js/main.js", "bd6ab214bf"],
  ["js/makeup.js", "ca083a7c1f"],
  ["js/screens/accessory.js", "89c1a400d6"],
  ["js/screens/care.js", "c3fe810451"],
  ["js/screens/dress.js", "7d9d5b082b"],
  ["js/screens/main.js", "775b2074c0"],
  ["js/screens/makeup.js", "c070d18f7f"],
  ["js/screens/play.js", "6fba60aae5"],
  ["js/screens/play_cake.js", "f46947a39e"],
  ["js/screens/play_drawing.js", "60410be85a"],
  ["js/screens/play_hide.js", "8c795a2368"],
  ["js/screens/play_photo.js", "de17135257"],
  ["js/screens/play_tea.js", "eecabfcd90"],
  ["js/screens/play_teaser.js", "2e7e57902c"],
  ["js/state.js", "90ddaf3e20"],
  ["js/ui.js", "7b01161cdc"],
  ["js/voice.js", "0183298bd8"],
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
