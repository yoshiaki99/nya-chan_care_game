/* オフラインでも遊べるようにする（https で開いたときだけ使われる）
 * ・はじめて開いたとき、ゲームに使うファイルを全部 端末の中に保存する。全部そろってから「準備完了」になる。
 * ・そのあとは保存したものだけで動くので、インターネットにつながっていなくても遊べる。
 * ・新しい版が公開されると、次に開いたときに、変わったファイルだけを受け取って入れかわる。
 * 下の VERSION と FILES は tools/build.py が自動で書きかえるので、手で直さなくてよい。 */
/* @@FILES-BEGIN */
const VERSION = 'b5e81b19aa';
const FILES = [
  ["index.html", "77a1a9a885"],
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
  ["assets/voice/m_bathDone.m4a", "a1ba234311"],
  ["assets/voice/m_bathFoam.m4a", "5561f4952b"],
  ["assets/voice/m_bathIntro.m4a", "1677c02e57"],
  ["assets/voice/m_bathShower.m4a", "5971df2499"],
  ["assets/voice/m_bathTowel.m4a", "a9724002b2"],
  ["assets/voice/m_bored.m4a", "b7eee78677"],
  ["assets/voice/m_content_1.m4a", "c7f0456d1e"],
  ["assets/voice/m_content_2.m4a", "61a880c723"],
  ["assets/voice/m_content_3.m4a", "c82540c5ee"],
  ["assets/voice/m_content_4.m4a", "f36faf2d32"],
  ["assets/voice/m_content_5.m4a", "aea892d98b"],
  ["assets/voice/m_dirty.m4a", "3b3509fd90"],
  ["assets/voice/m_drawIntro.m4a", "ea18936257"],
  ["assets/voice/m_flyCheer_1.m4a", "f0e95514a0"],
  ["assets/voice/m_flyCheer_2.m4a", "d9f718cd51"],
  ["assets/voice/m_flyCheer_3.m4a", "a98e01c35c"],
  ["assets/voice/m_flyDone.m4a", "2678fe28cc"],
  ["assets/voice/m_flyIntro.m4a", "0786ac6f1c"],
  ["assets/voice/m_foodDone.m4a", "570e4b0512"],
  ["assets/voice/m_foodEat.m4a", "dbf2bf0d02"],
  ["assets/voice/m_foodFav.m4a", "b07a33d53a"],
  ["assets/voice/m_foodHint.m4a", "868c2037b3"],
  ["assets/voice/m_foodIntro.m4a", "918bae9d11"],
  ["assets/voice/m_fullBath.m4a", "f3194a6449"],
  ["assets/voice/m_fullFood.m4a", "b3915ef61b"],
  ["assets/voice/m_greetAgain_1.m4a", "969cf01010"],
  ["assets/voice/m_greetAgain_2.m4a", "9d4100320f"],
  ["assets/voice/m_greetDaily.m4a", "0184bc1e9b"],
  ["assets/voice/m_hideAsk.m4a", "e76c0c2182"],
  ["assets/voice/m_hideDone.m4a", "b0d371834d"],
  ["assets/voice/m_hideFound_1.m4a", "844abd3cdf"],
  ["assets/voice/m_hideFound_2.m4a", "dc1c62ac1a"],
  ["assets/voice/m_hideFound_3.m4a", "dfff198075"],
  ["assets/voice/m_hideIntro.m4a", "4a7c92dfdb"],
  ["assets/voice/m_hideMiss_1.m4a", "6d05672f51"],
  ["assets/voice/m_hideMiss_2.m4a", "98fa9489fe"],
  ["assets/voice/m_hideReady.m4a", "a75242dd9a"],
  ["assets/voice/m_pet_2.m4a", "718be50255"],
  ["assets/voice/m_pet_3.m4a", "7b2de7ce54"],
  ["assets/voice/m_pianoDone.m4a", "304980e16d"],
  ["assets/voice/m_pianoIntro.m4a", "275c75958b"],
  ["assets/voice/m_playIntro.m4a", "c923d5f916"],
  ["assets/voice/m_teaserCheer_1.m4a", "656f2b538e"],
  ["assets/voice/m_teaserDone.m4a", "46c9ae67d5"],
  ["assets/voice/m_teaserIntro.m4a", "729200531d"],
  ["assets/voice/m_yarnCheer_1.m4a", "fd724d352b"],
  ["assets/voice/m_yarnCheer_2.m4a", "10c32343f5"],
  ["assets/voice/m_yarnCheer_3.m4a", "9d49eda6f1"],
  ["assets/voice/m_yarnCheer_4.m4a", "3e67a307a3"],
  ["assets/voice/m_yarnDone.m4a", "ba5a0e1049"],
  ["assets/voice/m_yarnIntro.m4a", "eecdec1247"],
  ["assets/voice/n_arrive_1.m4a", "016e23ccdc"],
  ["assets/voice/n_arrive_2.m4a", "c221bcdc14"],
  ["assets/voice/n_bye.m4a", "2ffa2f48d7"],
  ["assets/voice/n_chat_1.m4a", "09a9cc947e"],
  ["assets/voice/n_chat_2.m4a", "6d66546f80"],
  ["assets/voice/n_chat_3.m4a", "4c8efb2df9"],
  ["assets/voice/n_chat_4.m4a", "557e078366"],
  ["assets/voice/n_gift.m4a", "a4fa138d50"],
  ["assets/voice/n_hello.m4a", "329b4f05b5"],
  ["assets/voice/n_leave.m4a", "635bfc53a7"],
  ["assets/voice/n_osoroi.m4a", "204377d062"],
  ["assets/voice/n_pet_1.m4a", "28512ffeec"],
  ["assets/voice/n_pet_2.m4a", "80a3228bca"],
  ["assets/voice/n_pet_3.m4a", "033df42af4"],
  ["assets/voice/n_praise.m4a", "6544ac32a0"],
  ["assets/voice/n_welcome.m4a", "7e72c91aab"],
  ["css/style.css", "e5c7b8545c"],
  ["icons/apple-touch-icon.png", "d8d1bbd691"],
  ["icons/icon-192.png", "b0cfaf3cb0"],
  ["icons/icon-512.png", "6dae5d97a6"],
  ["icons/og-image.png", "0d7edd464c"],
  ["js/accessory.js", "3e3518f9d9"],
  ["js/art.js", "370aad79f8"],
  ["js/art_play.js", "cead13697d"],
  ["js/asset_list.js", "826e6b4642"],
  ["js/assets.js", "44269b1a2d"],
  ["js/audio.js", "cb8e63ec45"],
  ["js/chara.js", "47379dcf34"],
  ["js/character.js", "5de1a216cd"],
  ["js/character_nyu.js", "7d336645e5"],
  ["js/clothes.js", "c1067d70e9"],
  ["js/data.js", "059fb53812"],
  ["js/main.js", "9ed33ed5cb"],
  ["js/makeup.js", "ca083a7c1f"],
  ["js/nyu.js", "0b6b3d6702"],
  ["js/screens/accessory.js", "89c1a400d6"],
  ["js/screens/care.js", "bac62d4c53"],
  ["js/screens/clothes.js", "592ecc5921"],
  ["js/screens/dress.js", "dc0307e8b6"],
  ["js/screens/main.js", "2c9f9b5823"],
  ["js/screens/makeup.js", "c070d18f7f"],
  ["js/screens/play.js", "00cb47668f"],
  ["js/screens/play_cake.js", "f46947a39e"],
  ["js/screens/play_drawing.js", "60410be85a"],
  ["js/screens/play_hide.js", "8c795a2368"],
  ["js/screens/play_photo.js", "90acb56418"],
  ["js/screens/play_tea.js", "eecabfcd90"],
  ["js/screens/play_teaser.js", "2e7e57902c"],
  ["js/state.js", "8f16b74f39"],
  ["js/ui.js", "7b01161cdc"],
  ["js/voice.js", "eafb619e48"],
  ["js/voice_clips.js", "6b7ce6af04"],
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
