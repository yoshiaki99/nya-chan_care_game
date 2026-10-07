/*
 * キャラクター設定（要件定義書 2章）
 * 名前・絵・セリフをこのファイル1か所にまとめてある。
 * キャラクターの絵を差し替えるときは、このファイルと assets/characters の絵だけを替えればよい。
 */
window.G = window.G || {};

G.CHARACTER = {
  name: 'ニャーちゃん',
  title: 'ニャーちゃん おせわゲーム',
  // 保護者メニュー「このゲームについて」に出す 権利の表示
  credit: 'キャラクター「ニャーちゃん」の著作権は、作者に帰属します。',

  // ゲームで使うキャラクターの絵（背景透過PNG。1254×1254 の正方形に、足もとを下にそろえて置く）
  // 表情・動作の絵は tools/make_poses.js が 基準画 nya_base.png から 作る。まだ無い絵は fallbacks の絵で代わりに出す
  images: {
    base:        'assets/characters/nya_base.png',
    face_normal: 'assets/characters/nya_face_normal.png',
    face_happy:  'assets/characters/nya_face_happy.png',
    face_dreamy: 'assets/characters/nya_face_dreamy.png',
    face_prim:   'assets/characters/nya_face_prim.png',
    face_sleepy: 'assets/characters/nya_face_sleepy.png',
    face_lonely: 'assets/characters/nya_face_lonely.png',
    act_eat:     'assets/characters/nya_act_eat.png',
    act_foam:    'assets/characters/nya_act_bath_foam.png',
    act_fluffy:  'assets/characters/nya_act_bath_fluffy.png',
    act_yarn:    'assets/characters/nya_act_play_yarn.png',
    act_sleep:   'assets/characters/nya_act_sleep.png',
    act_wave:    'assets/characters/nya_act_wave.png',
    title:       'assets/characters/nya_act_wave.png' // タイトルは 手を ふる 絵
  },

  // 絵がまだ無いときに代わりに使う絵
  fallbacks: {
    face_normal: 'base', face_happy: 'base', face_dreamy: 'face_happy', face_prim: 'face_normal',
    face_sleepy: 'face_normal', face_lonely: 'face_normal',
    act_eat: 'face_happy', act_foam: 'face_happy', act_fluffy: 'face_happy',
    act_yarn: 'face_happy', act_sleep: 'face_sleepy', act_wave: 'face_happy',
    title: 'face_happy'
  },

  // 絵ごとの表示の大きさ（1 = 枠いっぱい）。横に なって ねる 絵は 小さめに
  poseScale: { act_sleep: 0.78 },

  // 絵ごとの横のずれの補正（高さに対する割合）
  poseShift: {},

  // 夜の場面でニャーちゃんに重ねる色（乗算）
  nightTint: 'rgb(222, 213, 242)',

  // リボンは 絵の色を ぬりかえない（ニャーちゃんは 耳・舌・ほっぺが ピンクなので）。
  // ribbonHue: { from, to } を書くと、その色相の部分を ぬりかえる しくみが はたらく（いまは 使わない）
  ribbonHue: null,

  // 口もと（ごはんを運ぶ場所）の位置。絵の外わくに対する割合
  mouth: { x: 0.49, y: 0.33 },

  // おふろで シャワーを もつ 手（手を ふる 絵 act_wave の あげた 手）の 位置。絵の外わくに対する割合
  showerPaw: { x: 0.175, y: 0.5 },

  // メイクを描く場所（元の絵のピクセル）。絵ごとに：
  //   eyes   = [左目, 右目]。それぞれ [x, y, 大きさ]（あいている目は黒目のまんなか、とじた目はまつげの線のまんなか）
  //   closed = 目をとじている絵 / cheeks = [左のほっぺ, 右のほっぺ] / mouth = [x, y, よこはば, たてはば]
  // ここに無い絵（おふろの あわ など）には メイクを描かない。絵を差し替えたら、ここも合わせる
  face: (function () {
    // 立っている 絵は みんな 基準画と 同じ 顔の いち（tools/make_poses.js で 目・口だけ かきかえている）
    const F = { eyes: [[518, 338, 46], [706, 320, 46]], cheeks: [[430, 413], [829, 391]], mouth: [617, 430, 124, 26] };
    const closed = Object.assign({}, F, { closed: true, eyes: [[518, 340, 46], [706, 322, 46]] });
    return {
      base: F, face_normal: F, face_prim: closed, face_lonely: Object.assign({}, F, { eyes: [[518, 346, 40], [706, 328, 40]] }),
      face_happy: closed, face_dreamy: closed, face_sleepy: closed,
      act_eat: closed, act_wave: closed, act_yarn: closed, act_fluffy: closed,
      // 横に なって ねる 絵（基準画を 右に 90° まわした 座標：x' = 1227 − y、y' = x + 165）
      act_sleep: { eyes: [[887, 683, 46], [905, 871, 46]], closed: true, cheeks: [[814, 595], [836, 994]], mouth: [797, 782, 26, 124] }
    };
  })(),

  // アクセサリーを つける場所。アクセサリー・ふく・みみの リボンの絵は、基準画の 座標で描いてある（js/accessory.js・js/clothes.js）。
  //   pivot = 絵の上の 目じるし（あたま=おでこの上、かお=目と目のあいだ、くび=くびの まんなか、しっぽ=しっぽの まんなか、
  //           せなか=せなか、body=からだ、bow=みみの リボンの 結び目）
  //   bowL・bowR = みみの リボンの 場所（画面で 見て ひだりの みみ・みぎの みみ。G.State.ribbonSide で えらぶ）
  //   poses = 絵ごとに、目じるしが来る場所 [x, y, 回転(度), 大きさ, オプション]。ほかの絵の名前を書くと その絵と同じ
  // ここに無い絵（おふろの あわ など）・書いていない場所には つけない。絵を差し替えたら、ここも合わせる
  accessory: (function () {
    // みみの リボンの 結び目（基準画の 座標）と かたむき（度）。ひだり = 画面で 見て ひだりの みみ
    const EAR_L = [400, 222, -24], EAR_R = [856, 198, 22];
    const pivot = { head: [615, 200], face: [612, 330], neck: [617, 604], tail: [930, 1045], back: [615, 760], body: [615, 880], bow: [0, 0] };
    const base = {};
    Object.keys(pivot).forEach(k => { if (k !== 'bow') base[k] = pivot[k].concat([0, 1]); });
    base.bowL = [EAR_L[0], EAR_L[1], EAR_L[2], 1];
    base.bowR = [EAR_R[0], EAR_R[1], EAR_R[2], 1];
    // ねる 絵は 基準画を 右に 90° まわした 座標（x' = 1227 − y、y' = x + 165）
    const lie = (e) => [1227 - e[1], e[0] + 165, e[2] + 90, 1];
    return {
      pivot,
      poses: {
        base,
        face_normal: 'base', face_happy: 'base', face_dreamy: 'base', face_prim: 'base', face_sleepy: 'base', face_lonely: 'base',
        act_eat: 'base', act_yarn: 'base', act_fluffy: 'base',
        // 手を あげている 絵：左の そでは 描かない
        act_wave: Object.assign({}, base, { body: [615, 880, 0, 1, { noL: true }] }),
        // ねる 絵（右に 90° まわした 絵）：もうふの 中は つけない（ぼうしと みみの リボンだけ。メガネも はずす）
        act_sleep: { head: [1027, 780, 90, 1], bowL: lie(EAR_L), bowR: lie(EAR_R) }
      }
    };
  })(),

  // あそぶ（毛糸玉）の絵の中の毛糸玉の位置。絵の外わくに対する割合（tools/make_poses.js の YARN）
  yarnBallInPose: { x: 0.287, y: 0.905 },

  // 鳴き声・声の高さ（読み上げ）
  voicePitch: 1.45,

  // セリフ（ひらがな・カタカナのみ）。配列のものはその中から1つ選ぶ
  // セリフの最後には いつも「ニャー」をつける（要件定義書 2.3。tools/check_lines.js で たしかめられる）
  lines: {
    greetDaily:  'にゃっほー！ きょうも あそびに きてくれた ニャー！',
    greetAgain:  ['おかえり！ また あえて うれしい ニャー', 'にゃっほー！ いっしょに あそぼ ニャー'],
    hungry:      'おなか ぺこぺこ ニャー…',
    dirty:       'からだを きれいに したい ニャー',
    bored:       'ねえねえ、 いっしょに あそぼ ニャー？',
    sleepy:      'ふぁ〜あ、 ねむく なっちゃった ニャー',
    lonely:      'さみしい ニャー…',
    content:     ['おひさま ぽかぽか ニャー', 'きょうも いい きもち ニャー！', 'わたし、 おさかなが だいすき ニャー', 'なでなで してくれる ニャー？', 'ピアノの おと、 すき ニャー'],
    pet:         ['ゴロゴロ ニャー…', 'きもちいい ニャー〜', 'うふふ、 くすぐったい ニャー'],

    fullFood:    'もう おなか いっぱい ニャー！',
    fullBath:    'まだ ぴかぴか ニャー！',
    fullSleep:   'まだ ねむくない。 げんき いっぱい ニャー！',

    foodIntro:   'どれを たべさせて くれる ニャー？',
    foodHint:    'ごはんを おくちに もってきて ニャー',
    foodEat:     'もぐもぐ ニャー',
    foodDone:    'ぺろり！ おいしかった ニャー！',
    foodFav:     'これ だいすき！ ありがとう ニャー！',

    bathIntro:   'どっちの せっけんで あらう ニャー？',
    bathFoam:    'あわあわ ニャー〜！',
    bathShower:  'じゃぐちを タッチして ニャー',
    bathRinse:   'あわを ゆびで ながして ニャー',
    bathToy:     'すきな おもちゃで あそんで ニャー',
    bathToyCheer: ['ぷかぷか ニャー！', 'たのしい ニャー〜！', 'もっと あそぼ ニャー！'],
    bathTowel:   'タオルで ふきふき して ニャー',
    bathDone:    'ぴかぴかで ふわふわ ニャー！',

    playIntro:   'なにして あそぶ ニャー？',
    yarnIntro:   'けいとだまを タッチして ニャー',
    yarnCheer:   ['まてまて ニャー〜！', 'えいっ ニャー！', 'つかまえた ニャー！', 'ころころ ニャー〜！'],
    yarnDone:    'すごい！ たのしかった ニャー！',
    mouseIntro:  'ネズミの おもちゃを タッチして ニャー',
    mouseCheer:  ['まてまて ニャー〜！', 'えいっ ニャー！', 'つかまえた ニャー！', 'すばしっこい ニャー！'],
    mouseDone:   'ネズミの おもちゃ、 たのしかった ニャー！',
    teaserIntro: 'ねこじゃらしを ゆびで うごかして ニャー',
    teaserCheer: ['にゃっ ニャー！', 'えいっ ニャー！', 'つかまえた ニャー！'],
    teaserDone:  'たのしかった！ ねこじゃらし だいすき ニャー',
    drawIntro:   'すきな いろで おえかき して ニャー',
    drawEmpty:   'なにか かいてみて ニャー',
    drawClear:   'もう いちど おすと ぜんぶ きえる ニャー',
    drawCheer:   ['じょうず ニャー！', 'すてきな いろ ニャー！', 'わあ、 なにかな ニャー？'],
    drawDone:    'すてきな え！ おへやに かざる ニャー',
    drawWall:    'かいてくれた え、 だいすき ニャー',
    photoIntro:  'しゃしんを とって くれるの？ カメラの ボタンを おして ニャー',
    // photoPose は js/screens/play_photo.js の ポーズと 同じ じゅん
    photoPose:   ['にっこり ニャー！', 'おすまし ニャー', 'バイバイ ニャー！', 'うっとり ニャー'],
    photoSnap:   ['かわいく とれた ニャー？', 'もう いちまい ニャー！', 'すてき ニャー！'],
    photoDone:   'しゃしんが いっぱい！ アルバムに しまった ニャー',
    albumEmpty:  'まだ しゃしんが ない ニャー',

    sleepIntro:  'ベッドを タッチして ニャー',
    sleepGo:     'おやすみなさい ニャー…',
    sleepWake:   'おはよう！ げんき いっぱい ニャー！',
    sleepNight:  'もう おやすみの じかん。 また あした ニャー',

    dressIntro:  'どの リボンに しようかな ニャー？',
    dressDone:   'じゃーん！ にあってる ニャー？',
    dressLocked: 'ハートを あつめると つけられる ニャー',

    clothesIntro: 'どの ふくを きようかな ニャー？',
    clothesDone:  ['じゃーん！ にあってる ニャー？', 'この ふく、 すき ニャー！', 'くるっと まわって… どう ニャー？'],
    clothesColor: 'この いろも すてき ニャー',
    clothesOff:   'ぬいだ ニャー',
    clothesNone:  'いまは なにも きて ない ニャー',

    accIntro:    'どれを つけて みる ニャー？',
    accDone:     ['じゃーん！ にあってる ニャー？', 'わあ、 かわいい！ ありがとう ニャー！', 'うふふ、 すてき ニャー？'],
    accOff:      'はずした ニャー',
    accNone:     'まだ なにも つけて ない ニャー',
    accSeason:   'に なったら プレゼントが とどく ニャー', // まえに「じゅうにがつ」などが つく

    makeupIntro:   'メイク して くれるの？ うれしい ニャー',
    makeupPick:    'すきな いろを えらんで ニャー',
    cheekHint:     'ほっぺを ポンポン して ニャー',
    lipHint:       'おくちに ぬりぬり して ニャー',
    eyeHint:       'めの うえを なでなで して ニャー',
    makeupDone:    ['すてき！ かわいく なった ニャー？', 'わあ、 おひめさまみたい ニャー！', 'ありがとう！ うれしい ニャー！'],
    makeupAgain:   'もう ついてる。 ほかの いろも ためしてみる ニャー？',
    makeupRemove:  'コットンで ふきふき して ニャー',
    makeupRemoved: 'さっぱり した ニャー！',
    makeupNone:    'まだ なにも ついて ない ニャー',
    makeupLocked:  'ハートを あつめると つかえる ニャー',

    // おでかけ（js/screens/outing.js）
    outfitIntro:   'おでかけの ふくを えらんで ニャー',
    outfitReady:   'じゅんび できたら チェックを おして ニャー',
    outfitNone:    'どの ふくで おでかけ する ニャー？',
    outfitGo:      'じゅんび ばっちり ニャー！',
    outingIntro:   'どこに おでかけ する ニャー？',
    outingHint:    'いろんな ところを タッチ して ニャー',
    outingHome:    'ただいま ニャー！',
    festivalHello:    'わあ、 おまつり！ ちょうちんが きれい ニャー',
    festivalYukata:   'ゆかたで おまつり、 うれしい ニャー！',
    festivalWatame:   'ふわふわ わたあめ、 あまい ニャー！',
    festivalTakoyaki: 'ふーふー！ たこやき あつあつ ニャー！',
    festivalPotato:   'ポテト、 ほくほく おいしい ニャー！',
    festivalRingo:    'りんごあめ、 つやつや あまい ニャー！',
    festivalKingyo:   'きんぎょ、 すくえた ニャー！',
    festivalTaiko:    'どん どん！ おどっちゃう ニャー！',
    festivalHanabi:   'たまやー！ はなび きれい ニャー！',
    festivalDone:     'おまつり、 たのしかった ニャー！',
    halloweenHello:   'ハロウィンパーティー！ ちょっと どきどき ニャー',
    halloweenCostume: 'かそう、 ばっちり ニャー！',
    halloweenPumpkin: 'かぼちゃが ひかった ニャー！',
    halloweenGhost:   'びっくり！ でも かわいい おばけ ニャー',
    halloweenCandy:   'トリック オア トリート！ おかし ありがとう ニャー！',
    halloweenBroom:   'ほうきが とんだ！ まほう みたい ニャー！',
    halloweenDone:    'ハロウィン、 たのしかった ニャー！',
    christmasHello:   'メリー クリスマス！ ツリーが おおきい ニャー',
    christmasSanta:   'サンタさんみたい ニャー？',
    christmasTree:    'ツリーが キラキラ ニャー！',
    christmasGift:    'プレゼント！ うれしい ニャー！',
    christmasCake:    'ケーキ、 あまくて おいしい ニャー！',
    christmasSnow:    'ゆきが ふってきた ニャー！',
    christmasDone:    'すてきな クリスマス だった ニャー！',
    nyuHomeHello:     'おじゃまします ニャー！',
    nyuHomeSnack:     'いっしょに たべると おいしい ニャー！',
    nyuHomeToys:      'おもちゃが いっぱい ニャー！',
    nyuHomeBall:      'とった！ ナイス パス ニャー！',
    nyuHomeBye:       'ニューちゃん、 また くる ニャー！',

    bye:         'また あそびに きてね ニャー！',

    // おりょうりゲーム（js/link.js）
    cookGo:      'キッチンで おりょうり して くる ニャー！',
    cookOffline: 'インターネットに つながって いるときに いこう ニャー',
    cookTogether: 'ニューちゃんと いっしょに たべて、 おなか いっぱい ニャー！',
    limit:       'きょうは ここまで。 また あした ニャー',

    // ニューちゃんが 遊びに来たとき（js/character_nyu.js・js/nyu.js）
    nyuWelcome:  'ニューちゃん、 いらっしゃい ニャー！',
    nyuIntro:    'わたしの いもうとの ニューちゃん ニャー！',
    nyuReply:    ['いいよ ニャー！', 'うふふ ニャー', 'ニューちゃん、 かわいい ニャー'],
    nyuThanks:   'ありがとう ニャー！',
    nyuShy:      'えへへ ニャー',
    nyuBye:      'また きてね ニャー！',

    stickerGet:  'シールを もらった ニャー！',
    unlockGet:   'あたらしい リボンが ふえた ニャー！',
    unlockMakeup: 'あたらしい メイクが ふえた ニャー！',
    unlockAcc:   'あたらしい アクセサリーが ふえた ニャー！',
    unlockClothes: 'あたらしい ふくが ふえた ニャー！',
    giftAcc:     'プレゼントが とどいた ニャー！',
    dailyHeart:  'きょうの ごあいさつ ニャー'
  }
};

// キャラクターごとの 設定（ニューちゃんは js/character_nyu.js）
G.CHARACTERS = G.CHARACTERS || {};
G.CHARACTERS.nya = G.CHARACTER;
