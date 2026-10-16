# RAÏ NOIR — Project Index

Read this first at the start of every session. Update the "Status" and "Next" sections at the end of every session.

## What it is
RAÏ NOIR is a single-file browser arcade game (side-scrolling beat 'em up) themed around Raï music and Algeria/Oran, built as a companion to the *RAÏ NOIR* album. It runs in a 384×224 pixel canvas inside an arcade-cabinet frame, with touch controls on phones and gamepad support. It is available in three languages (en / fr / ar).

## Layout
- `index.html` (~420 KB): the whole game: CSS, engine, scenes, sprites, audio and i18n. No build step and no dependencies except Google Fonts (Bungee, Press Start 2P, Noto Kufi Arabic).
- `tests/smoke.js`: Playwright release check. It drives every menu and story scene in all 3 languages, clears every level, the server farm (bullet time) and the boat shooter. Run it with `node tests/smoke.js [url]` (default `http://localhost:8777/index.html`). Exit code 1 means a failure.
- `audio/`: one music track per level/scene (zidane, zizou, warda, mumya, voodoo, adieu, amorharam, yalla…), plus `vv01–08` voice lines and `pads/`.
- `assets/`: bg, spr (sprite atlases), portraits, covers, story, intro, fmv + video (mp4 + webm pairs), ui, shots, and scene-specific folders (amor, adieu, mumya).
- `RAI_NOIR_album_cover.jpg`: album art.
- `../RAÏ NOIR.zip` (85 MB): backup of the project. Don't delete it.

## Engine map (inside index.html)
- Scenes live in the `SC` object: `boot, title, select, stagesel, sound, k7, tape, opts, cheats, credits, cont, gift, stinger, sawna`, levels `stage1–stage7` (story order: 1,2,3,7,4,6,5), `payne` (server farm / bullet time) and `shoot` (boat shooter). Cine scenes are flagged `isCine`.
- Navigation uses `go(scene)` / `fadeTo`. `newRun()` resets a run. `startLevel` / `spawnEnemy` / `bossIntro` handle levels, and `checkSkits` / `skitDraw` handle comic skits.
- Language: `setLang`, `tr`, `frIt`. Persistence: `saveColl`, `saveOpt`, `saveCheat`, `unlockCrew`, `unlockDecks` (localStorage).
- Audio: `playMusic`, `musicURL`, `sfx`, `tone`, `noise`, and the cassette system `mkTape`/`tapePlay`.
- Test hook: `window.__rr` exposes `SC, G, go, step, press, held, killAll, skipSkits, setState, setLang, newRun, player, scene, stageState`. Keep it, because the smoke test depends on it.
- Theme: a single dark arcade look by design. Tokens are in `:root` (`--void --cab --bezel --chrome --neon --mint --dim --pixel`).

## Status (2026-10-16)
- The game is playable end to end: 7 levels, server farm, boat shooter, menus, cassettes, cheats and credits, in 3 languages.
- Done 2026-10-16: removed the artifact-wrapper line from index.html, ran git init with a first commit, added package.json (`npm run serve` serves on port 8777, `npm test` runs the smoke test), and the smoke test now uses the default Playwright Chromium. Result: smoke 99/99 green.
- Port 8766 is taken by another local app (Creative Studio), which is why the game now uses 8777.
- Live on GitHub Pages: repo https://github.com/7mz410/RAI_NOIR (public), game at https://7mz410.github.io/RAI_NOIR/ (made for Hamza's friend Lennart in Belgium). GitHub doesn't allow "Ï" in repo names, which is why the repo is called RAI_NOIR.
- Bug sweep 1 done 2026-10-16 (3 Haiku QA agents). Fixed:
  - stage2's FEED boss was skipped, because the wave cleared on the frame the boss spawned (`updateWaves`);
  - the server-farm boss spawned off screen, and the player could walk past it;
  - the portrait pause button was off screen (it is now 44px);
  - the weapon hint overlapped "WOKE UP" in the HUD;
  - the server farm had no pause menu;
  - the shooter hint overlapped the RELOAD button and the captain's line;
  - the boss banner overlapped the caption panel;
  - the "NEXT ▶" hint overlapped the story text (removed; the bottom bar already shows A NEXT);
  - the `willReadFrequently` warning.
- Arabic: 558 new darija strings were added to `AR_T`, and `text()`/`wrapText()` now set `ctx.direction` for Arabic so mixed text is in the right order. Cine scenes show the Arabic as a subtitle above the English line, which is the original design.

### FLAG: design questions, parked until Hamza/Lennart decide
- The server farm (`SC.payne`) has no game over: lives reach 0 and the run continues.
- The shooter (`SC.shoot`) gives unlimited free continues and never reaches `SC.cont`.
- In story mode the server farm takes stage4's slot (`G.level=3`, then exits to mahramOut), so stage4 (ZIDANE) can only be played from stage select. Is that intended?

### Known, not fixed
- 85 MB of media. Some files are requested twice or aborted (zizou, rainoir, the intro videos). Lazy-load them per level.
- Touch targets under 44px: PLAY PORTRAIT ANYWAY, YALLA (30px high), the landscape D-pad (36px).
- The SOUND ROOM title sits under the BACK button. The EN/FR/عربي selector and the OPTIONS button touch the logo on the title screen.
- The Press Start 2P font lacks some accented capitals (Ê renders as a glyph box in fr, e.g. "RÊVE").
- RESET SAVE keeps the options and language. Confirm that this is intended.
- Unconfirmed: the nightIntro cutscene once replayed over the shooter (a `setTimeout` in marseilleOut's next callback).
- Arabic was only spot-checked on 4 screens. A native-speaker pass is still needed.

## Next (proposed order)
1. ~~Housekeeping~~ done.
2. ~~Bug sweep 1~~ done. Next: Hamza and Lennart playtest on real phones.
3. Polish: the "Known, not fixed" list above, then a performance pass on low-end phones.
4. Decide the FLAG questions.

## Team roles
**Hamza (director / owner)**
- Decides on vision, story, art and music direction, and what ships.
- Supplies the assets (art, audio, video) and the copy.
- Playtests on real devices and reports what feels wrong.
- Approves before any delete, push or deploy.

**Claude (lead engineer + QA)**
- Reads this file first, and changes code with the smallest diff that works (ponytail ladder).
- Fixes the root cause, never the symptom. Greps every caller first.
- Runs `tests/smoke.js` before saying "done", and says plainly what wasn't checked.
- Updates the Status and Next sections of this file at the end of each session.

**Workflow per task**
1. Hamza states the goal.
2. Claude reads this file and the relevant code, then proposes a plan in 1–3 lines.
3. Hamza says yes or adjusts.
4. Claude builds.
5. Claude runs the smoke test and looks at screenshots.
6. Hamza playtests.
7. Commit.
8. Update this file.

## Skills to use
Always on: `hamza` (it includes the caveman voice and ponytail build rules, so invoking `hamza` covers both).

Use per task:
- `replica-test`: Playwright test plans and bug reports. Use it for the bug sweep and to extend `smoke.js`.
- `code-review` / `simplify`: run them after each change set, once git exists.
- `animate`, `review-animations`-style motion work: hit feel and transitions.
- `impeccable` / `ui-ux-pro-max`: menus, HUD and touch-control UX polish.
- `replica-deploy`: the release step (host, domain, DNS).
- `banner-design` / `design`: store and social promo art for the launch.
- `run`: launch and drive the game locally.

Skip: threejs-webgl, gsap-scrolltrigger, scroll-reveal-libraries and modern-web-design (wrong fit for a canvas game), and replica-recon/architect/brand (this isn't a clone).
