/* ゲームのデータ（メーター・ごはん・リボン・メイク・アクセサリー・シール・絵のファイル） */
window.G = window.G || {};

// げんきメーター（5.3）。rate = 1時間に下がる目盛りの数
G.METERS = [
  { id: 'hunger', label: 'おなか',   color: '#f2998c', care: 'food',  rate: 1.0 },
  { id: 'clean',  label: 'きれい',   color: '#79c4e6', care: 'bath',  rate: 0.5 },
  { id: 'fun',    label: 'たのしい', color: '#ef9cc4', care: 'play',  rate: 1.0 },
  { id: 'energy', label: 'げんき',   color: '#f1c74f', care: 'sleep', rate: 0.5 }
];

// お世話ボタン（5.2 F-12）
G.CARES = [
  { id: 'food',  label: 'ごはん',   icon: 'icon_food',  meter: 'hunger' },
  { id: 'bath',  label: 'おふろ',   icon: 'icon_bath',  meter: 'clean' },
  { id: 'play',  label: 'あそぶ',   icon: 'icon_play',  meter: 'fun' },
  { id: 'sleep', label: 'ねんね',   icon: 'icon_sleep', meter: 'energy' },
  { id: 'dress', label: 'おしゃれ', icon: 'icon_dress', meter: null }
];

// ごはん（5.4）。テーブルに 2だんで ならぶ（はじめの 5こが おくの だん、のこり 4こが てまえの だん）
// 名前の ふだが となりと かさならないように、ながい 名前どうしは となりに しない
G.FOODS = [
  { id: 'fish',       label: 'おさかな',       art: 'item_fish' },
  { id: 'water',      label: 'おみず',         art: 'item_water' },
  { id: 'croissant',  label: 'クロワッサン',   art: 'item_croissant' },
  { id: 'parfait',    label: 'パフェ',         art: 'item_parfait' },
  { id: 'macaron',    label: 'マカロン',       art: 'item_macaron' },
  { id: 'catfood',    label: 'キャットフード', art: 'item_catfood' },
  { id: 'pudding',    label: 'プリン',         art: 'item_pudding' },
  { id: 'softcream',  label: 'ソフトクリーム', art: 'item_softcream' },
  { id: 'shrimp',     label: 'エビ',           art: 'item_shrimp' }
];

// おふろの せっけん（5.5）。foam = あわの 色、edge = あわの ふちの 色、petal = こすると 舞う 花びら
G.SOAPS = [
  { id: 'lavender', label: 'ラベンダー', art: 'item_soap_lavender', petal: 'petal_lavender', foam: '#f1e8fc', edge: '#bba0e8' },
  { id: 'sakura',   label: 'さくら',     art: 'item_soap_sakura',   petal: 'petal_sakura',   foam: '#fdecf1', edge: '#f0a3bd' }
];
// おふろの おもちゃ（いつでも あそべる）
G.BATH_TOYS = [
  { id: 'duck', label: 'アヒルちゃん', art: 'toy_duck' },
  { id: 'boat', label: 'おふね',       art: 'toy_boat' },
  { id: 'can',  label: 'じょうろ',     art: 'toy_can' },
  { id: 'fish', label: 'おさかな',     art: 'toy_fish' }
];

// リボン（5.8）。unlock = あつめたハートの数で ふえる
// hue: 色相(度) sat/val: 彩度・明るさの倍率 pattern: もようの種類
G.RIBBONS = [
  { id: 'none',    label: 'なし',     unlock: 0,  swatch: 'none' }, // はじめは なにも つけていない（要件定義書 F-62）
  { id: 'pink',    label: 'ピンク',   unlock: 0,  swatch: '#f4a3b8', art: 'ribbon_pink' },
  { id: 'blue',    label: 'みずいろ', unlock: 0,  swatch: '#93c9ef', art: 'ribbon_blue',   hue: 205, sat: 1.15, val: 1.0 },
  { id: 'yellow',  label: 'きいろ',   unlock: 0,  swatch: '#f5d76a', art: 'ribbon_yellow', hue: 46,  sat: 1.65, val: 1.0 },
  { id: 'purple',  label: 'むらさき', unlock: 10, swatch: '#c3a3ec', hue: 272, sat: 1.05, val: 1.0 },
  { id: 'mint',    label: 'みどり',   unlock: 25, swatch: '#9fdcbc', hue: 150, sat: 1.0,  val: 0.97 },
  { id: 'polka',   label: 'みずたま', unlock: 40, swatch: '#f4a3b8', pattern: 'dots' },
  { id: 'gold',    label: 'きんいろ', unlock: 60, swatch: '#e9c35e', hue: 43,  sat: 1.9,  val: 0.93, pattern: 'glitter' },
  { id: 'rainbow', label: 'にじいろ', unlock: 80, swatch: 'rainbow', pattern: 'rainbow' }
];

// メイク（おしゃれ）。unlock = あつめたハートの数で ふえる（リボンと同じ）
// color: ぬる色 shape: ほっぺ・シールの形 glitter: きらきら
G.MAKEUP = [
  { id: 'cheek', label: 'ほっぺ', hint: 'cheekHint', items: [
    { id: 'pink',   label: 'ピンク', unlock: 0,  color: '#f98bb0' },
    { id: 'peach',  label: 'もも',   unlock: 0,  color: '#ffa286' },
    { id: 'berry',  label: 'いちご', unlock: 0,  color: '#f2577e' },
    { id: 'heart',  label: 'ハート', unlock: 15, color: '#f77aa5', shape: 'heart' }
  ] },
  { id: 'lip', label: 'くちべに', hint: 'lipHint', items: [
    { id: 'pink',   label: 'ピンク',   unlock: 0,  color: '#f2588f' },
    { id: 'red',    label: 'あか',     unlock: 0,  color: '#e0263f' },
    { id: 'orange', label: 'オレンジ', unlock: 0,  color: '#f77b45' },
    { id: 'glitter', label: 'キラキラ', unlock: 30, color: '#f0679d', glitter: true }
  ] },
  { id: 'eye', label: 'アイシャドウ', hint: 'eyeHint', items: [
    { id: 'pink',   label: 'ピンク',   unlock: 0,  color: '#f59cc2' },
    { id: 'purple', label: 'むらさき', unlock: 0,  color: '#b597ec' },
    { id: 'blue',   label: 'みずいろ', unlock: 0,  color: '#86c3f0' },
    { id: 'gold',   label: 'きんいろ', unlock: 50, color: '#f0c45a', glitter: true }
  ] },
  { id: 'deco', label: 'シール', hint: 'decoHint', items: [
    { id: 'star',   label: 'ほし',   unlock: 0,  color: '#ffd24d', shape: 'star' },
    { id: 'heart',  label: 'ハート', unlock: 0,  color: '#f8679a', shape: 'heart' },
    { id: 'flower', label: 'おはな', unlock: 0,  color: '#f7a8c8', shape: 'flower' },
    { id: 'gem',    label: 'ダイヤ', unlock: 70, color: '#8fd3f5', shape: 'gem' }
  ] }
];
G.MAKEUP_DECO_MAX = 5; // シールは 5まいまで（ふえると いちばん古いのが はがれる）

// アクセサリー（おしゃれ）。slot = つける場所（1か所に 1つ）。絵は js/accessory.js
// unlock = あつめたハートの数で ふえる（リボン・メイクと かさならない数にしてある）
// season = その月に なると プレゼントで とどく（とどいたら ずっと つかえる）。when = セリフで言う月
G.ACCESSORY_SLOTS = [
  { id: 'head', label: 'あたま', icon: 'beret' },
  { id: 'face', label: 'かお',   icon: 'glasses' },
  { id: 'neck', label: 'くび',   icon: 'pearl' },
  { id: 'back', label: 'せなか', icon: 'wings' },
  { id: 'tail', label: 'しっぽ', icon: 'tailbow' }
];
G.ACCESSORIES = [
  { id: 'tiara',        slot: 'head', label: 'ティアラ',             unlock: 90 },
  { id: 'flowers',      slot: 'head', label: 'はなかんむり',         unlock: 20 },
  { id: 'beret',        slot: 'head', label: 'ベレーぼう',           unlock: 45 },
  { id: 'witch',        slot: 'head', label: 'まじょの ぼうし',       season: { month: 10, name: 'ハロウィン', when: 'じゅうがつ' } },
  { id: 'santa',        slot: 'head', label: 'サンタの ぼうし',       season: { month: 12, name: 'クリスマス', when: 'じゅうにがつ' } },
  { id: 'glasses',      slot: 'face', label: 'まるメガネ',           unlock: 5 },
  { id: 'heartglasses', slot: 'face', label: 'ハートの サングラス',   unlock: 65 },
  { id: 'starglasses',  slot: 'face', label: 'おほしさま メガネ',     unlock: 110 },
  { id: 'pearl',        slot: 'neck', label: 'しんじゅの ネックレス', unlock: 35 },
  { id: 'bell',         slot: 'neck', label: 'きんの すず',          unlock: 55 },
  { id: 'locket',       slot: 'neck', label: 'ハートの ペンダント',   unlock: 100 },
  { id: 'wings',        slot: 'back', label: 'ようせいの はね',       unlock: 120 },
  { id: 'tailbow',      slot: 'tail', label: 'しっぽの リボン',       unlock: 75 }
];

// 着せ替え（ふく。要件定義書 5.6.1）。絵は js/clothes.js。1着ずつ着る（slot = body）
// colors = えらべる色（はじめの色が さいしょ）。unlock・season は アクセサリーと同じ
G.CLOTHES = [
  { id: 'tshirt',   label: 'Tシャツ',          unlock: 0, colors: ['#f47c7c', '#f6d860', '#8fc9ef'] },
  { id: 'onepiece', label: 'ワンピース',        unlock: 0, colors: ['#f6a8c8', '#c9b3ee', '#a9dfc0'] },
  { id: 'overall',  label: 'オーバーオール',    unlock: 0 },
  { id: 'pajama',   label: 'パジャマ',          unlock: 8 },
  { id: 'raincoat', label: 'レインコート',      unlock: 12 },
  { id: 'sailor',   label: 'セーラーふく',      unlock: 28 },
  { id: 'yukata',   label: 'ゆかた',            unlock: 48 },
  { id: 'tutu',     label: 'バレエの ふく',      unlock: 68 },
  { id: 'gown',     label: 'ドレス',            unlock: 85, colors: ['#c9a8ec', '#f6a8c8', '#9fd0f0'] },
  { id: 'cape',     label: 'おばけの マント',    season: { month: 10, name: 'ハロウィン', when: 'じゅうがつ' } },
  { id: 'santasuit', label: 'サンタの ふく',      season: { month: 12, name: 'クリスマス', when: 'じゅうにがつ' } }
];
G.CLOTHES_SLEEP = 'pajama'; // ねんねの ときに 着る服（もっていなくても ねんねの ときだけ 着る）

// ごほうびシール（5.9）。ハート10こで1まい
G.HEARTS_PER_STICKER = 10;
G.STICKERS = [
  { e: '🥐', label: 'クロワッサン' }, { e: '🎀', label: 'リボン' },     { e: '🐟', label: 'おさかな' },
  { e: '🎹', label: 'ピアノ' },       { e: '🥛', label: 'ミルク' },       { e: '🧁', label: 'カップケーキ' },
  { e: '🦋', label: 'ちょうちょ' },   { e: '⭐', label: 'おほしさま' }, { e: '🌙', label: 'おつきさま' },
  { e: '🍰', label: 'ケーキ' },       { e: '🧶', label: 'けいとだま' }, { e: '👑', label: 'かんむり' },
  { e: '🌈', label: 'にじ' },         { e: '🌸', label: 'おはな' },     { e: '🐾', label: 'あしあと' },
  { e: '🎵', label: 'おんぷ' },       { e: '💎', label: 'ほうせき' },   { e: '🍓', label: 'いちご' },
  { e: '🫖', label: 'ティーポット' }, { e: '☀️', label: 'おひさま' }
];

// あそぶ（5.6）。えらぶ画面に 3こ・2こで ならぶ
G.GAMES = [
  { id: 'yarn',    label: 'けいとだま ころころ',   art: 'item_yarn' },
  { id: 'teaser',  label: 'ねこじゃらし ふりふり', art: 'icon_teaser' },
  { id: 'mouse',   label: 'ネズミの おもちゃ',     art: 'icon_mouse' },
  { id: 'drawing', label: 'おえかき',             art: 'icon_drawing' },
  { id: 'photo',   label: 'しゃしん とろう',       art: 'icon_photo' }
];

// おえかきの クレヨン
G.CRAYONS = [
  { id: 'red',    label: 'あか',     color: '#e8504f' },
  { id: 'pink',   label: 'ピンク',   color: '#f47fa8' },
  { id: 'orange', label: 'オレンジ', color: '#f59a3e' },
  { id: 'yellow', label: 'きいろ',   color: '#f2cb2e' },
  { id: 'green',  label: 'みどり',   color: '#5dbb6e' },
  { id: 'blue',   label: 'みずいろ', color: '#58a8e6' },
  { id: 'purple', label: 'むらさき', color: '#9b7be0' },
  { id: 'brown',  label: 'ちゃいろ', color: '#9a6b4f' },
  { id: 'black',  label: 'くろ',     color: '#4a3f46' }
];
// おえかきの スタンプ（メイクの シールと 同じ形）
G.DRAW_STAMPS = [
  { id: 'heart',  label: 'ハート', shape: 'heart',  color: '#f8679a' },
  { id: 'star',   label: 'ほし',   shape: 'star',   color: '#ffd24d' },
  { id: 'flower', label: 'おはな', shape: 'flower', color: '#f7a8c8' }
];

// しゃしんの アルバム（あたらしい ものから これだけ のこす）
G.PHOTO_MAX = 30;

// キャラクター以外の絵。ファイルが無いあいだは、ゲームの中で描いた絵（js/art.js）を代わりに使う
G.ART_FILES = {
  bg_room:       'assets/backgrounds/bg_room_day.png',
  bg_bath:       'assets/backgrounds/bg_bath.png',
  bg_room_night: 'assets/backgrounds/bg_room_night.png',

  item_fish:     'assets/items/item_fish.png',
  item_water:    'assets/items/item_water.png',
  item_croissant: 'assets/items/item_croissant.png',
  item_parfait:  'assets/items/item_parfait.png',
  item_macaron:  'assets/items/item_macaron.png',
  item_pudding:  'assets/items/item_pudding.png',
  item_shrimp:   'assets/items/item_shrimp.png',
  item_catfood:  'assets/items/item_catfood.png',
  item_softcream: 'assets/items/item_softcream.png',
  item_shower:   'assets/items/item_shower.png',
  item_towel:    'assets/items/item_towel.png',
  item_soap_lavender: 'assets/items/item_soap_lavender.png',
  item_soap_sakura:   'assets/items/item_soap_sakura.png',
  bath_tub_back:  'assets/items/bath_tub_back.png',
  bath_tub_front: 'assets/items/bath_tub_front.png',
  bath_faucet:    'assets/items/bath_faucet.png',
  toy_duck:      'assets/items/toy_duck.png',
  toy_boat:      'assets/items/toy_boat.png',
  toy_can:       'assets/items/toy_can.png',
  toy_fish:      'assets/items/toy_fish.png',
  toy_mouse:     'assets/items/toy_mouse.png',
  item_yarn:     'assets/items/item_yarn.png',
  item_bed:      'assets/items/item_bed.png',

  ribbon_pink:   'assets/dressup/ribbon_pink.png',
  ribbon_blue:   'assets/dressup/ribbon_blue.png',
  ribbon_yellow: 'assets/dressup/ribbon_yellow.png',

  icon_food:     'assets/icons/icon_food.png',
  icon_bath:     'assets/icons/icon_bath.png',
  icon_play:     'assets/icons/icon_play.png',
  icon_sleep:    'assets/icons/icon_sleep.png',
  icon_dress:    'assets/icons/icon_dress.png',
  icon_bye:      'assets/icons/icon_bye.png'
};
