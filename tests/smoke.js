// RAÏ NOIR release check: every menu, story scene and level is driven headless.
// Usage: node tests/smoke.js [url]   (exit code 1 when anything fails)
const { chromium } = require('playwright');
const URL = process.argv[2] || 'http://localhost:8777/index.html';
const STAGES = ['stage1','stage2','stage3','stage7','stage4','stage6','stage8','stage9','stage5'];
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required','--mute-audio'] });
  const p = await b.newPage({ viewport: { width: 768, height: 448 } });
  let errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 160)));
  await p.goto(URL + '?t=' + Date.now()); await p.waitForTimeout(2500);
  const results = []; const check = (name, ok, info = '') => { results.push({ name, ok: ok && errs.length === 0, info: info + (errs.length ? ' ERR: ' + errs.join(' | ') : '') }); errs = []; };
  const run = async (fn, arg) => { try { return await p.evaluate(fn, arg); } catch (e) { errs.push(String(e.message).slice(0, 160)); return null; } };

  for (const lang of ['en', 'fr', 'ar']) {
    await run(l => { __rr.setLang(l); }, lang);
    // menus
    for (const sc of ['boot', 'title', 'stagesel', 'sound', 'k7', 'opts', 'cheats', 'credits']) {
      const ok = await run(sc => { __rr.newRun(0); __rr.go(__rr.SC[sc]); __rr.step(240, 20); return true; }, sc);
      check(`[${lang}] menu ${sc}`, !!ok);
    }
    // every story scene (cine) — tap through
    const cines = await run(() => Object.keys(__rr.SC).filter(k => __rr.SC[k].isCine && k !== 'tape'));
    for (const c of cines || []) {
      const ok = await run(c => { __rr.newRun(0); __rr.go(__rr.SC[c]); for (let i = 0; i < 40; i++) { __rr.step(25, 25); __rr.press('a'); } return true; }, c);
      check(`[${lang}] scene ${c}`, !!ok);
    }
    if (lang !== 'en') continue;
    // every level: walk right, clear waves, must reach STAGE CLEAR
    for (const st of STAGES) {
      const r = await run(st => { __rr.newRun(0); __rr.G.story = true; __rr.go(__rr.SC[st]); __rr.step(60, 30); __rr.skipSkits(); __rr.setState('play');
        let n = 0; for (; n < 340 && __rr.stageState !== 'clear' && __rr.scene === __rr.SC[st]; n++) { __rr.held = { right: true }; __rr.killAll(); __rr.step(30, 30); if (__rr.player && __rr.player.dead) { __rr.player.dead = false; __rr.player.hp = 100; } }
        __rr.held = { right: false }; const cleared = __rr.stageState === 'clear' || __rr.scene !== __rr.SC[st]; __rr.step(600, 60);
        return { cleared, steps: n * 30, scene: Object.keys(__rr.SC).find(k => __rr.SC[k] === __rr.scene) }; }, st);
      check(`level ${st}`, r && r.cleared, r ? `${r.cleared ? 'cleared' : 'NOT CLEARED'} after ${r.steps} frames → next: ${r.scene}` : '');
    }
    // the server farm (bullet time): shoot everything, must reach Adieu
    const py = await run(() => { __rr.newRun(0); __rr.go(__rr.SC.payne); const P = __rr.SC.payne; let n = 0;
      for (; n < 400 && __rr.scene === P; n++) { __rr.held = { right: true }; for (const e of P.en) if (!e.dead) { e.hp = 0; e.state = 'down'; e.t = 99; } if (P.boss && P.boss.hp > 0 && n > 100) P.boss.hp = 1; __rr.press('a'); if (n % 50 === 0) __rr.press('b'); if (n % 70 === 0) __rr.press('c'); __rr.step(20, 20); P.p.hp = 100; }
      __rr.held = { right: false }; return { done: __rr.scene !== P, n }; });
    check('server farm', py && py.done, py ? (py.done ? 'reached ' : 'STUCK ') + py.n * 20 + ' frames' : '');
    // the boat shooter
    const sh = await run(() => { __rr.newRun(0); __rr.go(__rr.SC.shoot); for (let i = 0; i < 30; i++) { __rr.step(20, 20); __rr.press('a'); } return true; });
    check('shooter', !!sh);
  }
  const bad = results.filter(r => !r.ok);
  for (const r of results) console.log((r.ok ? '  ok  ' : ' FAIL ') + r.name + (r.info ? '  ' + r.info : ''));
  console.log(`\n${results.length - bad.length}/${results.length} passed`);
  await b.close(); process.exit(bad.length ? 1 : 0);
})();
