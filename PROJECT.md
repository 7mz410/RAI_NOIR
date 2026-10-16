# RAÏ NOIR — Project Index

Read this first at the start of every session. Update the "Status" and "Next" sections at the end of every session.

## What it is
RAÏ NOIR is a single-file browser arcade game (side-scrolling beat 'em up) themed around Raï music and Algeria/Oran, built as a companion to the *RAÏ NOIR* album. It runs in a 384×224 pixel canvas inside an arcade-cabinet frame, with touch controls on phones and gamepad support. It is available in three languages (en / fr / ar).

## Layout
- `index.html` (~420 KB): the whole game: CSS, engine, scenes, sprites, audio and i18n. No build step and no dependencies except Google Fonts (Bungee, Press Start 2P, Noto Kufi Arabic).
- `tests/smoke.js`: Playwright release check. It drives every menu and story scene in all 3 languages, clears every level, the server farm (bullet time) and the boat shooter. Run it with `node tests/smoke.js [url]` (default `http://localhost:8766/index.html`). Exit code 1 means a failure.
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
- Known issues to check:
  - `index.html` contains **two `<!doctype>`**. The first line is an artifact-viewer wrapper (white `body` style) that came from downloading a published page. Strip that wrapper line so the file starts at the real `<!doctype html>`.
  - The folder is **not a git repo**. Run `git init` and make a first commit before any big change.
  - `smoke.js` hard-codes `executablePath: '/opt/pw-browsers/chromium'`, which doesn't exist on this Mac. Use the default Playwright Chromium (`npx playwright install chromium`) or an env var.
  - 85 MB of media: check the load time and mobile data cost (lazy-load music and FMV per level).

## Next (proposed order)
1. Housekeeping: strip the wrapper, `git init`, fix the smoke test path, and get the smoke test green locally (`python3 -m http.server 8766`).
2. Bug sweep: run the smoke test, play through on desktop and phone, and log the bugs here.
3. Polish: Arabic/RTL text in menus and skits, touch controls, performance on low-end phones.
4. Release: choose a host (static: Netlify / Cloudflare Pages / GitHub Pages), choose a domain, and decide how it links from the album.

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
