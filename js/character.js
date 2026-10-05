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
  // まだ無い絵は fallbacks の絵で代わりに出す（いまは基準画 nya_base.png だけ）
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
    title:       'assets/title/title_nya.png'
  },

  // 絵がまだ無いときに代わりに使う絵
  fallbacks: {
    face_normal: 'base', face_happy: 'base', face_dreamy: 'face_happy', face_prim: 'face_normal',
    face_sleepy: 'face_normal', face_lonely: 'face_normal',
    act_eat: 'face_happy', act_foam: 'face_happy', act_fluffy: 'face_happy',
    act_yarn: 'face_happy', act_sleep: 'face_sleepy', act_wave: 'face_happy',
    title: 'face_happy'
  },

  // 絵ごとの表示の大きさ（1 = 枠いっぱい）。丸くなって眠る絵（よこ長）などを描いたら ここで合わせる
  poseScale: {},

  // 絵ごとの横のずれの補正（高さに対する割合）
  poseShift: {},

  // 夜の場面でニャーちゃんに重ねる色（乗算）
  nightTint: 'rgb(222, 213, 242)',

  // リボンは 絵の色を ぬりかえない（ニャーちゃんは 耳・舌・ほっぺが ピンクなので）。
  // ribbonHue: { from, to } を書くと、その色相の部分を ぬりかえる しくみが はたらく（いまは 使わない）
  ribbonHue: null,

  // 口もと（ごはんを運ぶ場所）の位置。絵の外わくに対する割合
  mouth: { x: 0.49, y: 0.33 },

  // メイクを描く場所（元の絵のピクセル）。絵ごとに：
  //   eyes   = [左目, 右目]。それぞれ [x, y, 大きさ]（あいている目は黒目のまんなか、とじた目はまつげの線のまんなか）
  //   closed = 目をとじている絵 / cheeks = [左のほっぺ, 右のほっぺ] / mouth = [x, y, よこはば, たてはば]
  // ここに無い絵（おふろの あわ など）には メイクを描かない。絵を差し替えたら、ここも合わせる
  face: {
    base: { eyes: [[518, 338, 46], [706, 320, 46]], cheeks: [[430, 413], [829, 391]], mouth: [615, 392, 112, 30] }
  },
  // シールを はれる顔のはんい（目と目を むすぶ線を 1 としたときの、だ円）
  decoArea: { u: 0.55, v: 0.05, ru: 0.95, rv: 0.62 },

  // アクセサリーを つける場所。アクセサリーの絵は js/accessory.js の 座標で描いてある。
  //   pivot = アクセサリーの絵の 目じるし（あたま=おでこ、かお=目と目のあいだ、くび=くびの まんなか、
  //           しっぽ=しっぽのまんなか、せなか=せなか）
  //   poses = 絵ごとに、目じるしが来る場所 [x, y, 回転(度), 大きさ]。ほかの絵の名前を書くと その絵と同じ
  // ここに無い絵（おふろの あわ など）・書いていない場所には つけない。絵を差し替えたら、ここも合わせる
  accessory: {
    pivot: { head: [700, 300], face: [756, 498], neck: [843, 760], tail: [300, 952], back: [550, 800] },
    poses: {
      base: { head: [700, 222, 12, 1.0], face: [612, 330, 12, 0.76], neck: [660, 600, 4, 0.9], tail: [985, 965, -20, 0.8], back: [615, 820, 0, 0.9] }
    }
  },

  // あそぶ（毛糸玉）の絵の中の毛糸玉の位置。絵の外わくに対する割合
  yarnBallInPose: { x: 0.70, y: 0.87 },

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
    content:     ['おひさま ぽかぽか ニャー', 'きょうも いい きもち ニャー！', 'ぼく、 おさかなが だいすき ニャー', 'なでなで してくれる ニャー？', 'ピアノの おと、 すき ニャー'],
    pet:         ['ゴロゴロ ニャー…', 'きもちいい ニャー〜', 'うふふ、 くすぐったい ニャー'],

    fullFood:    'もう おなか いっぱい ニャー！',
    fullBath:    'まだ ぴかぴか ニャー！',
    fullSleep:   'まだ ねむくない。 げんき いっぱい ニャー！',

    foodIntro:   'どれを たべさせて くれる ニャー？',
    foodHint:    'ごはんを おくちに もってきて ニャー',
    foodEat:     'もぐもぐ ニャー',
    foodDone:    'ぺろり！ おいしかった ニャー！',
    foodFav:     'これ だいすき！ ありがとう ニャー！',

    bathIntro:   'スポンジで あわあわ して ニャー',
    bathFoam:    'あわあわ ニャー〜！',
    bathShower:  'シャワーで あわを ながして ニャー',
    bathTowel:   'タオルで ふきふき して ニャー',
    bathDone:    'ぴかぴかで ふわふわ ニャー！',

    playIntro:   'なにして あそぶ ニャー？',
    yarnIntro:   'けいとだまを タッチして ニャー',
    yarnCheer:   ['まてまて ニャー〜！', 'えいっ ニャー！', 'つかまえた ニャー！', 'ころころ ニャー〜！'],
    yarnDone:    'すごい！ たのしかった ニャー！',
    pianoIntro:  'ひかった けんばんを おして。 いっしょに うたお ニャー',
    pianoDone:   'じょうず！ すてきな うただった ニャー',
    flyIntro:    'ちょうちょを タッチして ニャー',
    flyCheer:    ['ちょうちょさん、 まって ニャー〜！', 'ぴょーん ニャー！', 'きれいな はね ニャー！'],
    flyDone:     'じょうず！ ちょうちょと なかよし ニャー',
    teaserIntro: 'ねこじゃらしを ゆびで うごかして ニャー',
    teaserCheer: ['にゃっ ニャー！', 'えいっ ニャー！', 'つかまえた ニャー！'],
    teaserDone:  'たのしかった！ ねこじゃらし だいすき ニャー',
    hideIntro:   'かくれんぼ しよ！ ぼくを さがして ニャー',
    hideAsk:     'もういいかい ニャー？',
    hideReady:   'もういいよ ニャー！',
    hideMiss:    ['ここには いない ニャー', 'うふふ、 どこかな ニャー？'],
    hideFound:   ['みつかっちゃった ニャー！', 'あたり！ みつけてくれた ニャー', 'わあ、 すごい ニャー！'],
    hideDone:    'かくれんぼ たのしかった ニャー！',
    drawIntro:   'すきな いろで おえかき して ニャー',
    drawEmpty:   'なにか かいてみて ニャー',
    drawClear:   'もう いちど おすと ぜんぶ きえる ニャー',
    drawCheer:   ['じょうず ニャー！', 'すてきな いろ ニャー！', 'わあ、 なにかな ニャー？'],
    drawDone:    'すてきな え！ おへやに かざる ニャー',
    drawWall:    'かいてくれた え、 だいすき ニャー',
    cakeIntro:   'ケーキを つくろう！ すきな クリームを えらんで ニャー',
    cakeTop:     'すきな ものを ケーキに のせて ニャー',
    cakeCheer:   ['おいしそう ニャー！', 'かわいい ニャー！', 'すてき ニャー！'],
    cakeCandle:  'さいごに ろうそくを たてて ニャー',
    cakeBlow:    'ふーっ ニャー！',
    cakeEat:     'できあがり！ いただきます ニャー！',
    cakeDone:    'とっても おいしかった！ ありがとう ニャー！',
    teaIntro:    'おちゃかいの じゅんびを しよう。 カップを テーブルに おいて ニャー',
    teaPour:     'ポットで こうちゃを いれて ニャー',
    teaSugar:    'おさとうを ふたつ いれて ニャー',
    teaSweets:   'おかしを えらんで ニャー',
    teaSip:      'ふーふー… いい かおり ニャー',
    teaYum:      'ぺろり！ おかしも おいしい ニャー',
    teaDone:     'たのしい おちゃかい だった。 ありがとう ニャー！',
    photoIntro:  'しゃしんを とって くれる ニャー？ カメラの ボタンを おして ニャー',
    // photoPose は js/screens/play_photo.js の ポーズと 同じ じゅん
    photoPose:   ['にっこり ニャー！', 'おすまし ニャー', 'バイバイ ニャー！', 'うっとり ニャー'],
    photoSnap:   ['かわいく とれた ニャー？', 'もう いちまい ニャー！', 'すてき ニャー！'],
    photoDone:   'しゃしんが いっぱい！ アルバムに しまった ニャー',
    albumEmpty:  'まだ しゃしんが ない ニャー',

    sleepIntro:  'クッションを タッチして ニャー',
    sleepGo:     'おやすみなさい ニャー…',
    sleepWake:   'おはよう！ げんき いっぱい ニャー！',
    sleepNight:  'もう おやすみの じかん。 また あした ニャー',

    dressIntro:  'どの リボンに しようかな ニャー？',
    dressDone:   'じゃーん！ にあってる ニャー？',
    dressLocked: 'ハートを あつめると つけられる ニャー',

    accIntro:    'どれを つけて みる ニャー？',
    accDone:     ['じゃーん！ にあってる ニャー？', 'わあ、 かわいい！ ありがとう ニャー！', 'うふふ、 かっこいい ニャー？'],
    accOff:      'はずした ニャー',
    accNone:     'まだ なにも つけて ない ニャー',
    accSeason:   'に なったら プレゼントが とどく ニャー', // まえに「じゅうにがつ」などが つく

    makeupIntro:   'メイク して くれる ニャー？ うれしい ニャー',
    makeupPick:    'すきな いろを えらんで ニャー',
    cheekHint:     'ほっぺを ポンポン して ニャー',
    lipHint:       'おくちに ぬりぬり して ニャー',
    eyeHint:       'めの うえを なでなで して ニャー',
    decoHint:      'かおの すきな ところに はって ニャー',
    makeupDone:    ['すてき！ かわいく なった ニャー？', 'わあ、 おひめさまみたい ニャー！', 'ありがとう！ うれしい ニャー！'],
    decoDone:      ['キラキラ！ かわいい ニャー！', 'すてきな シール ニャー！', 'うふふ、 にあう ニャー？'],
    makeupAgain:   'もう ついてる。 ほかの いろも ためしてみる ニャー？',
    makeupRemove:  'コットンで ふきふき して ニャー',
    makeupRemoved: 'さっぱり した ニャー！',
    makeupNone:    'まだ なにも ついて ない ニャー',
    makeupLocked:  'ハートを あつめると つかえる ニャー',

    bye:         'また あそびに きてね ニャー！',
    limit:       'きょうは ここまで。 また あした ニャー',

    stickerGet:  'シールを もらった ニャー！',
    unlockGet:   'あたらしい リボンが ふえた ニャー！',
    unlockMakeup: 'あたらしい メイクが ふえた ニャー！',
    unlockAcc:   'あたらしい アクセサリーが ふえた ニャー！',
    giftAcc:     'プレゼントが とどいた ニャー！',
    dailyHeart:  'きょうの ごあいさつ ニャー'
  }
};
