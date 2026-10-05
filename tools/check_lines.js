#!/usr/bin/env node
/* ニャーちゃんの セリフを たしかめる（要件定義書 2.3）
 *   node tools/check_lines.js
 * ・js/character.js の lines の すべての文が「ニャー」（＋ ！？…〜）で おわっているか
 * ・漢字が まざっていないか（ひらがな・カタカナだけにする：N-01）
 * ・プログラムが つかっている セリフ（L.xxx）が lines に そろっているか
 * まちがいが あれば 一覧を出して 1 で おわる。 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const ctx = { window: {} };
ctx.window.G = ctx.G = {};
vm.runInNewContext(fs.readFileSync(path.join(root, 'js/character.js'), 'utf8'), ctx);
const L = ctx.G.CHARACTER.lines;

const errors = [];
const END = /ニャー[！？…〜]*$/;
const KANJI = /[一-鿿]/;
for (const [key, val] of Object.entries(L)) {
  (Array.isArray(val) ? val : [val]).forEach((text, i) => {
    const name = Array.isArray(val) ? `${key}[${i}]` : key;
    if (!END.test(text)) errors.push(`${name}：さいごに「ニャー」が ない → ${text}`);
    if (KANJI.test(text)) errors.push(`${name}：漢字が ある → ${text}`);
  });
}

// プログラムで つかっている セリフの 名前（L.xxx と、data.js の hint: 'xxx'）
const used = new Set();
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return walk(p);
  if (!p.endsWith('.js') || p.endsWith('character.js')) return;
  const src = fs.readFileSync(p, 'utf8');
  for (const m of src.matchAll(/\bL\.([A-Za-z]\w*)/g)) used.add(m[1]);
  for (const m of src.matchAll(/\bhint:\s*'(\w+)'/g)) used.add(m[1]);
});
walk(path.join(root, 'js'));
['x', 'y'].forEach(k => used.delete(k)); // js/makeup.js の L は 目の いち（セリフではない）
for (const k of used) if (!(k in L)) errors.push(`${k}：プログラムで つかっているのに lines に ない`);
const unused = Object.keys(L).filter(k => !used.has(k));

if (unused.length) console.log('（名前で よばれていない セリフ。meter などから よぶものも ある：' + unused.join(', ') + '）');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`OK：セリフ ${Object.keys(L).length} しゅるい`);
