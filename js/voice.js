/* 読み上げ（N-02：文字はすべて音声でも読み上げる）
 * 録音した声（assets/voice、一覧は js/voice_clips.js）がある文はそれを鳴らし、無い文はブラウザの読み上げ機能で読む */
window.G = window.G || {};

G.Voice = (function () {
  const synth = window.speechSynthesis;
  let voice = null, enabled = true, volume = 1, token = 0;

  function pickVoice() {
    if (!synth) return;
    const vs = synth.getVoices().filter(v => /^ja(-|_|$)/i.test(v.lang));
    if (!vs.length) return;
    const prefer = ['Kyoko', 'O-Ren', 'Siri', 'Nanami', 'Google 日本語', 'Haruka', 'Ayumi'];
    voice = prefer.map(n => vs.find(v => v.name.indexOf(n) >= 0)).find(Boolean) || vs[0];
  }
  if (synth) {
    pickVoice();
    if (synth.addEventListener) synth.addEventListener('voiceschanged', pickVoice);
  }

  function clean(text) {
    return String(text).replace(/〜/g, 'ー').replace(/[♪★☆]/g, '').replace(/…/g, '、').trim();
  }

  /* ---- 録音した声 ---- */
  // 空白のちがいは気にせずに、文と音声ファイルを対応させる
  const norm = (text) => String(text).replace(/\s+/g, '').replace(/〜/g, 'ー');
  const clips = {};
  Object.keys(G.VOICE_CLIPS || {}).forEach(k => { clips[norm(k)] = G.VOICE_CLIPS[k]; });
  const decoded = new Map(); // ファイル → 音のデータと 大きさを そろえる 倍率（最近使ったものだけ取っておく）
  const KEEP = 24;
  let current = null; // いま鳴っている録音

  /* 声の大きさをそろえる倍率。
   * ファイルは「全体の平均」で そろえてあるが、笑い声などが 一部だけ 大きい 文は、そのほかの ところが 小さく なり、
   * 文によって 聞こえる 大きさが 最大 9dB ほど ちがっていた。耳の 感じ方に 近い 重み（K特性）を かけて、
   * 話している ところの ふつうの 大きさ（0.4秒ごとの 大きさの まん中）が おなじに なるように する */
  const LEVEL = -20; // そろえる 大きさ（dB）。いまの 声の 平均くらい
  function kWeight(x, sr) {
    const y = new Float32Array(x.length);
    // 高い音を 少し 強く（ハイシェルフ）→ とても 低い音を けずる（ハイパス）
    let K = Math.tan(Math.PI * 1681.974450955533 / sr);
    const Vh = Math.pow(10, 3.999843853973347 / 20), Vb = Math.pow(Vh, 0.4996667741545416), Q1 = 0.7071752369554196;
    let a0 = 1 + K / Q1 + K * K;
    const s1 = [(Vh + Vb * K / Q1 + K * K) / a0, 2 * (K * K - Vh) / a0, (Vh - Vb * K / Q1 + K * K) / a0, 2 * (K * K - 1) / a0, (1 - K / Q1 + K * K) / a0];
    K = Math.tan(Math.PI * 38.13547087602444 / sr);
    const Q2 = 0.5003270373238773;
    a0 = 1 + K / Q2 + K * K;
    const s2 = [1, -2, 1, 2 * (K * K - 1) / a0, (1 - K / Q2 + K * K) / a0];
    [s1, s2].forEach(([b0, b1, b2, a1, a2], n) => {
      const src = n ? y : x;
      let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
      for (let i = 0; i < src.length; i++) {
        const v = src[i], o = b0 * v + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
        x2 = x1; x1 = v; y2 = y1; y1 = o; y[i] = o;
      }
    });
    return y;
  }
  function levelGain(buf) {
    const x = buf.getChannelData(0), sr = buf.sampleRate;
    const y = kWeight(x, sr);
    const sum = new Float64Array(y.length + 1); // 2乗の 累積（区間の 大きさを すぐ 出すため）
    let peak = 0;
    for (let i = 0; i < y.length; i++) { sum[i + 1] = sum[i] + y[i] * y[i]; peak = Math.max(peak, Math.abs(x[i])); }
    const w = Math.min(y.length, Math.round(sr * 0.4)), h = Math.round(sr * 0.1);
    if (!w || !peak) return 1;
    const db = [];
    for (let i = 0; i + w <= y.length; i += h) db.push(10 * Math.log10((sum[i + w] - sum[i]) / w + 1e-12));
    const top = Math.max.apply(null, db);
    const act = db.filter(d => d > top - 20).sort((a, b) => a - b); // 話している ところ（いちばん 大きい ところから 20dB 以内）
    const mid = act.length % 2 ? act[act.length >> 1] : (act[act.length / 2 - 1] + act[act.length / 2]) / 2;
    return Math.min(Math.pow(10, (LEVEL - mid) / 20), 1 / peak); // 上げすぎて 音が われないように
  }

  function load(src) {
    let p = decoded.get(src);
    if (p) { decoded.delete(src); decoded.set(src, p); return p; }
    const ctx = G.Sound.context();
    p = fetch(src)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then(buf => new Promise((res, rej) => ctx.decodeAudioData(buf, res, rej)))
      .then(buf => ({ buf, gain: levelGain(buf) }));
    p.catch(() => decoded.delete(src)); // 読めなかったものは次にもう一度ためす
    decoded.set(src, p);
    while (decoded.size > KEEP) decoded.delete(decoded.keys().next().value);
    return p;
  }

  function playClip(src, my) {
    return load(src).then(({ buf, gain }) => new Promise((resolve) => {
      if (my !== token) return resolve();
      const ctx = G.Sound.context();
      const s = ctx.createBufferSource();
      const g = ctx.createGain();
      s.buffer = buf; g.gain.value = volume * gain;
      s.connect(g); g.connect(G.Sound.voiceOut());
      let done = false;
      const fin = () => {
        if (done) return; done = true;
        if (current && current.s === s) current = null;
        if (my === token) G.Sound.duck(false);
        resolve();
      };
      s.onended = fin;
      setTimeout(fin, buf.duration * 1000 + 1500); // 止まってしまったときの保険（画面を閉じたときなど）
      current = { s, fin };
      G.Sound.duck(true);
      s.start();
    }));
  }

  /* 鳴っている声を止める */
  function halt() {
    if (current) { const c = current; current = null; try { c.s.stop(); } catch (e) { /* なし */ } c.fin(); }
    if (synth && (synth.speaking || synth.pending)) synth.cancel();
  }

  /* iOS では最初の読み上げをタップの中で行う必要がある（録音した声は G.Sound.init で使えるようになる） */
  function unlock() {
    if (!synth) return;
    try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } catch (e) { /* なし */ }
  }

  function synthSpeak(text, who, my, fallbackMs) {
    if (!synth) return new Promise(r => setTimeout(r, fallbackMs));
    return new Promise((resolve) => {
      const go = () => {
        if (my !== token) return resolve();
        const u = new SpeechSynthesisUtterance(clean(text));
        u.lang = 'ja-JP';
        if (voice) u.voice = voice;
        const ch = who === 'chara' ? G.CHARACTER : (G.CHARACTERS && G.CHARACTERS[who]);
        u.pitch = ch ? ch.voicePitch : 1.15;
        u.rate = who === 'chara' ? 1.0 : 1.05;
        u.volume = volume;
        let done = false;
        const fin = () => { if (done) return; done = true; if (my === token) G.Sound.duck(false); resolve(); };
        u.onend = fin; u.onerror = fin;
        setTimeout(fin, fallbackMs + 1500); // 読み上げが止まったときの保険
        G.Sound.duck(true);
        synth.speak(u);
      };
      if (synth.speaking || synth.pending) { synth.cancel(); setTimeout(go, 60); } else go();
    });
  }

  /**
   * 読み上げる。終わったら（または読み上げなしのときは目安の時間で）resolve する
   * who: 'chara'（ニャーちゃんの声）| 'nyu'（ニューちゃんの声）| 'guide'（ボタンの名前など）
   */
  function speak(text, who = 'chara') {
    const my = ++token;
    halt();
    const fallbackMs = 900 + String(text).length * 120;
    if (!enabled || volume <= 0) return new Promise(r => setTimeout(r, fallbackMs));
    // ニューちゃんの声は「nyu:」をつけた文で さがす（ニャーちゃんと 同じ文でも、べつの声で 鳴らすため）
    const src = clips[norm((who === 'nyu' ? 'nyu:' : '') + text)];
    if (src && G.Sound.context()) {
      // 音が いっとき 止まっているだけ（ほかの アプリから もどった すぐ あとなど）なら、動かしてから 録音を 鳴らす。
      // すぐに ブラウザの読み上げに 切りかえると、声も 大きさも ちがうので、声が 急に 大きく／小さく なったように 聞こえる
      // 録音が読めなかったとき（ファイルが無いなど）や 音を 動かせないときだけ、ブラウザの読み上げに切りかえる
      return G.Sound.wake()
        .then(ok => { if (!ok) throw new Error('suspended'); return my === token ? playClip(src, my) : undefined; })
        .catch(() => (my === token ? synthSpeak(text, who, my, fallbackMs) : undefined));
    }
    return synthSpeak(text, who, my, fallbackMs);
  }

  function stop() { token++; halt(); G.Sound.duck(false); }

  function set(opts) {
    if (opts.enabled != null) enabled = opts.enabled;
    if (opts.volume != null) volume = opts.volume;
    if (!enabled) stop();
  }

  return { speak, stop, unlock, set, available: () => !!synth || Object.keys(clips).length > 0 };
})();
