/* オフラインでも遊べるようにする（https で開いたときだけ使われる）
 * ・はじめて開いたとき、ゲームに使うファイルを全部 端末の中に保存する。全部そろってから「準備完了」になる。
 * ・そのあとは保存したものだけで動くので、インターネットにつながっていなくても遊べる。
 * ・新しい版が公開されると、次に開いたときに、変わったファイルだけを受け取って入れかわる。
 * 下の VERSION と FILES は tools/build.py が自動で書きかえるので、手で直さなくてよい。 */
/* @@FILES-BEGIN */
const VERSION = '0b4962a2eb';
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
  ["assets/voice/g_album.m4a", "40a0fa3c1d"],
  ["assets/voice/g_album_close.m4a", "87f49e4e69"],
  ["assets/voice/g_draw_clear.m4a", "4d1f9a18cc"],
  ["assets/voice/g_draw_done.m4a", "7d8330fca4"],
  ["assets/voice/g_draw_eraser.m4a", "2236fbd0b4"],
  ["assets/voice/g_ribbon_prev.m4a", "a9ae4f1a33"],
  ["assets/voice/g_stickers_all.m4a", "df11e0df00"],
  ["assets/voice/m_accDone_2.m4a", "108cfd39b3"],
  ["assets/voice/m_accDone_3.m4a", "a1d75d042a"],
  ["assets/voice/m_accIntro.m4a", "46db62ea0d"],
  ["assets/voice/m_accNone.m4a", "7822a1bd80"],
  ["assets/voice/m_accOff.m4a", "27779228c5"],
  ["assets/voice/m_albumEmpty.m4a", "fc8aaa349b"],
  ["assets/voice/m_bathDone.m4a", "a1ba234311"],
  ["assets/voice/m_bathFoam.m4a", "5561f4952b"],
  ["assets/voice/m_bathIntro.m4a", "8119c46b75"],
  ["assets/voice/m_bathRinse.m4a", "8492a9e5ba"],
  ["assets/voice/m_bathShower.m4a", "ceeee21177"],
  ["assets/voice/m_bathTowel.m4a", "a9724002b2"],
  ["assets/voice/m_bathToy.m4a", "7b7338c894"],
  ["assets/voice/m_bathToyCheer_1.m4a", "a54718e13d"],
  ["assets/voice/m_bathToyCheer_2.m4a", "14fd12cd6e"],
  ["assets/voice/m_bathToyCheer_3.m4a", "343fc6374f"],
  ["assets/voice/m_bored.m4a", "b7eee78677"],
  ["assets/voice/m_bye.m4a", "7e83b8d29d"],
  ["assets/voice/m_cheekHint.m4a", "a4e323ec59"],
  ["assets/voice/m_clothesColor.m4a", "4359daa3a6"],
  ["assets/voice/m_clothesDone_2.m4a", "f630c13e8f"],
  ["assets/voice/m_clothesDone_3.m4a", "90d39cca26"],
  ["assets/voice/m_clothesIntro.m4a", "29434db4bb"],
  ["assets/voice/m_clothesNone.m4a", "f7770c70c5"],
  ["assets/voice/m_clothesOff.m4a", "3111c66537"],
  ["assets/voice/m_content_1.m4a", "c7f0456d1e"],
  ["assets/voice/m_content_2.m4a", "61a880c723"],
  ["assets/voice/m_content_3.m4a", "c82540c5ee"],
  ["assets/voice/m_content_4.m4a", "f36faf2d32"],
  ["assets/voice/m_content_5.m4a", "aea892d98b"],
  ["assets/voice/m_dailyHeart.m4a", "e3131c40d5"],
  ["assets/voice/m_dirty.m4a", "3b3509fd90"],
  ["assets/voice/m_drawCheer_1.m4a", "cae8b6d934"],
  ["assets/voice/m_drawCheer_2.m4a", "1001c0e562"],
  ["assets/voice/m_drawCheer_3.m4a", "31afb67be4"],
  ["assets/voice/m_drawClear.m4a", "46ea548e83"],
  ["assets/voice/m_drawDone.m4a", "1317558078"],
  ["assets/voice/m_drawEmpty.m4a", "3e3a8d78ba"],
  ["assets/voice/m_drawIntro.m4a", "ea18936257"],
  ["assets/voice/m_drawWall.m4a", "a69c1e361b"],
  ["assets/voice/m_dressDone.m4a", "74ad0d0224"],
  ["assets/voice/m_dressIntro.m4a", "ac304b527b"],
  ["assets/voice/m_dressLocked.m4a", "f3c4340e9f"],
  ["assets/voice/m_eyeHint.m4a", "8c2223a82f"],
  ["assets/voice/m_foodDone.m4a", "570e4b0512"],
  ["assets/voice/m_foodEat.m4a", "dbf2bf0d02"],
  ["assets/voice/m_foodFav.m4a", "b07a33d53a"],
  ["assets/voice/m_foodHint.m4a", "868c2037b3"],
  ["assets/voice/m_foodIntro.m4a", "918bae9d11"],
  ["assets/voice/m_fullBath.m4a", "f3194a6449"],
  ["assets/voice/m_fullFood.m4a", "b3915ef61b"],
  ["assets/voice/m_fullSleep.m4a", "8acadd921f"],
  ["assets/voice/m_get_sticker_01.m4a", "22632a6144"],
  ["assets/voice/m_get_sticker_02.m4a", "15f045fa88"],
  ["assets/voice/m_get_sticker_03.m4a", "a88c802312"],
  ["assets/voice/m_get_sticker_04.m4a", "0cc8c717a4"],
  ["assets/voice/m_get_sticker_05.m4a", "85b9384ab3"],
  ["assets/voice/m_get_sticker_06.m4a", "97bb540970"],
  ["assets/voice/m_get_sticker_07.m4a", "47f086e10b"],
  ["assets/voice/m_get_sticker_08.m4a", "fc0696de20"],
  ["assets/voice/m_get_sticker_09.m4a", "721de0a864"],
  ["assets/voice/m_get_sticker_10.m4a", "d483989571"],
  ["assets/voice/m_get_sticker_11.m4a", "26b2c472da"],
  ["assets/voice/m_get_sticker_12.m4a", "5df2daaf57"],
  ["assets/voice/m_get_sticker_13.m4a", "c622da5ebb"],
  ["assets/voice/m_get_sticker_14.m4a", "2f1ee1637b"],
  ["assets/voice/m_get_sticker_15.m4a", "9bd9516fdb"],
  ["assets/voice/m_get_sticker_16.m4a", "4ceee75aed"],
  ["assets/voice/m_greetAgain_1.m4a", "969cf01010"],
  ["assets/voice/m_greetAgain_2.m4a", "9d4100320f"],
  ["assets/voice/m_greetDaily.m4a", "0184bc1e9b"],
  ["assets/voice/m_hungry.m4a", "d026fcbf06"],
  ["assets/voice/m_limit.m4a", "e45c2c58e9"],
  ["assets/voice/m_lipHint.m4a", "04d5b94a67"],
  ["assets/voice/m_lonely.m4a", "f981c82433"],
  ["assets/voice/m_makeupAgain.m4a", "3fc53195f1"],
  ["assets/voice/m_makeupDone_1.m4a", "78df1eca93"],
  ["assets/voice/m_makeupDone_2.m4a", "05690f25e7"],
  ["assets/voice/m_makeupDone_3.m4a", "c6eeaa3962"],
  ["assets/voice/m_makeupIntro.m4a", "c03061b244"],
  ["assets/voice/m_makeupLocked.m4a", "78a4331748"],
  ["assets/voice/m_makeupNone.m4a", "445c557a6d"],
  ["assets/voice/m_makeupPick.m4a", "2195dd254f"],
  ["assets/voice/m_makeupRemove.m4a", "ef8b458f7e"],
  ["assets/voice/m_makeupRemoved.m4a", "064571a7bd"],
  ["assets/voice/m_mouseCheer_4.m4a", "d85f2f449a"],
  ["assets/voice/m_mouseDone.m4a", "226a656f14"],
  ["assets/voice/m_mouseIntro.m4a", "37d14e3665"],
  ["assets/voice/m_nyuBye.m4a", "cce452a121"],
  ["assets/voice/m_nyuIntro.m4a", "e0fe7ed150"],
  ["assets/voice/m_nyuReply_1.m4a", "50a1ccc0ab"],
  ["assets/voice/m_nyuReply_2.m4a", "0c7fb38097"],
  ["assets/voice/m_nyuReply_3.m4a", "883aea86e9"],
  ["assets/voice/m_nyuShy.m4a", "c55040181b"],
  ["assets/voice/m_nyuThanks.m4a", "3828a5c2fc"],
  ["assets/voice/m_pet_1.m4a", "72514bb987"],
  ["assets/voice/m_pet_2.m4a", "718be50255"],
  ["assets/voice/m_pet_3.m4a", "7b2de7ce54"],
  ["assets/voice/m_photoDone.m4a", "0b3980002d"],
  ["assets/voice/m_photoIntro.m4a", "f0cba4f1cb"],
  ["assets/voice/m_photoPose_1.m4a", "3281d2649c"],
  ["assets/voice/m_photoPose_2.m4a", "b40b98a372"],
  ["assets/voice/m_photoPose_3.m4a", "a6238e15ca"],
  ["assets/voice/m_photoPose_4.m4a", "199535afd6"],
  ["assets/voice/m_photoSnap_1.m4a", "f05bc7be2f"],
  ["assets/voice/m_photoSnap_2.m4a", "f75dbc83f5"],
  ["assets/voice/m_photoSnap_3.m4a", "03901fb877"],
  ["assets/voice/m_playIntro.m4a", "c923d5f916"],
  ["assets/voice/m_sleepIntro.m4a", "eb9135d6b2"],
  ["assets/voice/m_sleepNight.m4a", "6f611adf5f"],
  ["assets/voice/m_sleepWake.m4a", "a48f5f503b"],
  ["assets/voice/m_sleepy.m4a", "c454b63da1"],
  ["assets/voice/m_stickerGet.m4a", "6e66fa8c72"],
  ["assets/voice/m_teaserCheer_1.m4a", "656f2b538e"],
  ["assets/voice/m_teaserDone.m4a", "46c9ae67d5"],
  ["assets/voice/m_teaserIntro.m4a", "729200531d"],
  ["assets/voice/m_unlockGet.m4a", "6e82a352e6"],
  ["assets/voice/m_yarnCheer_1.m4a", "fd724d352b"],
  ["assets/voice/m_yarnCheer_2.m4a", "10c32343f5"],
  ["assets/voice/m_yarnCheer_3.m4a", "9d49eda6f1"],
  ["assets/voice/m_yarnCheer_4.m4a", "3e67a307a3"],
  ["assets/voice/m_yarnDone.m4a", "ba5a0e1049"],
  ["assets/voice/m_yarnIntro.m4a", "eecdec1247"],
  ["assets/voice/n_arrive_1.m4a", "d6b1f8c7c4"],
  ["assets/voice/n_arrive_2.m4a", "6f61370907"],
  ["assets/voice/n_bye.m4a", "2ffa2f48d7"],
  ["assets/voice/n_chat_1.m4a", "09a9cc947e"],
  ["assets/voice/n_chat_2.m4a", "6d66546f80"],
  ["assets/voice/n_chat_3.m4a", "4c8efb2df9"],
  ["assets/voice/n_chat_4.m4a", "557e078366"],
  ["assets/voice/n_gift.m4a", "a4fa138d50"],
  ["assets/voice/n_hello.m4a", "bffa5815eb"],
  ["assets/voice/n_leave.m4a", "635bfc53a7"],
  ["assets/voice/n_osoroi.m4a", "204377d062"],
  ["assets/voice/n_pet_1.m4a", "f93b39b8b9"],
  ["assets/voice/n_pet_2.m4a", "80a3228bca"],
  ["assets/voice/n_pet_3.m4a", "033df42af4"],
  ["assets/voice/n_praise.m4a", "6544ac32a0"],
  ["assets/voice/n_welcome.m4a", "7e72c91aab"],
  ["css/style.css", "ec91786029"],
  ["icons/apple-touch-icon.png", "d8d1bbd691"],
  ["icons/icon-192.png", "b0cfaf3cb0"],
  ["icons/icon-512.png", "6dae5d97a6"],
  ["icons/og-image.png", "0d7edd464c"],
  ["js/accessory.js", "c46238ffec"],
  ["js/art.js", "142c4f87e9"],
  ["js/art_play.js", "7136fc5da4"],
  ["js/asset_list.js", "deabaee934"],
  ["js/assets.js", "44269b1a2d"],
  ["js/audio.js", "aa3c0b86e6"],
  ["js/chara.js", "47379dcf34"],
  ["js/character.js", "6d8bba1beb"],
  ["js/character_nyu.js", "7d336645e5"],
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
  ["js/voice.js", "eafb619e48"],
  ["js/voice_clips.js", "7cacdbcc82"],
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
