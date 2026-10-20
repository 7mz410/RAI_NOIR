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

- Sprite pass done 2026-10-16:
  - Magenta key leftovers were removed with tlween (magic wand plus colour range) from atlas, atlas3, atlas4, atlas5, atlas8 and atlas10.
  - All sheets except atlas6, atlas7, atlas9 and props were repacked with 2px padding. Art pieces that had been sliced into a neighbouring frame went back to their own frame, and leftovers of other poses that were cut by the frame's side edge were dropped. Each frame keeps its bottom-centre pivot.
  - Backups: `sprites_backup/` holds the originals; `sprites_backup/after_magenta/` holds the state before the repack.
  - Not fixed: the riderless camel (atlas9 `camelx_*`) was redrawn by Hamza on 2026-10-17. The k7 down pose (`k7_8_0`) was rebuilt as one frame because it had been split in two. A few small side-cut pieces were kept on purpose (cheb_5 shoe, oran_4 feet). cheb_6, aicha_3, boss_7_1, boss_7_3, jnoun_3 and atlas8 k7_3 sit 1-4px higher because a returned piece reaches below the old bottom.

- Sprite pass 2 (2026-10-17): every loose piece in every frame was reviewed by eye. 165 leftover pieces (neighbour limbs, slivers, specks under 8px at the frame side) were cleared in tlween, and the magenta edge fringe was removed from atlas14, atlas (k7), atlas4 (mother) and atlas2 (khamaseen). Kept on purpose: effects, sparks, smoke, sound waves, props and cords. The backup before this pass is `sprites_backup/after_repack/`.

### FLAG: design questions, parked until Hamza/Lennart decide
- The server farm (`SC.payne`) has no game over: lives reach 0 and the run continues.
- The shooter (`SC.shoot`) gives unlimited free continues and never reaches `SC.cont`.
- In story mode the server farm takes stage4's slot (`G.level=3`, then exits to mahramOut), so stage4 (ZIDANE) can only be played from stage select. Is that intended?

### Known, not fixed
- Sweep 2 (2026-10-19, the أحمد التبّاع agents 1-4, after PR #3 merged). Fixed:
  - touch targets are now 44px;
  - the SOUND ROOM and title-screen overlaps;
  - the duplicate boot music preload;
  - vault rows hidden under the prize panel;
  - the stageDraw crash with no level loaded;
  - the bloopers 404;
  - 200 new Arabic strings.
- Media is still heavy. unlockDecks loads yalla.mp3 into both decks, unlockAudio primes every tape video on the first tap, and kick() bypasses MBLOB for rainoir.
- French: the Rick Rumi talk, the Tata skit and the hellIntro body lines are still English, because their FR_T keys use the old wording. In FR, the continue-screen coin animation overlaps the long stage-9 subtitle.
- assets/video/bloopers.mp4 is missing, so the bloopers reel is skipped. Add the file to bring it back.
- Press Start 2P draws accented capitals with small accents (É looks like é). This is the font's design, so it is left as is.
- In portrait with the D-pad on, the pause button overlaps the bottom-right D-pad key.
- The haggle HUD: "HIS HONOUR" touches its bar.
- RESET SAVE keeps the options and language. Confirm that this is intended.
- Content call for Hamza and Lennart: some lines are put in real people's mouths (TimbAIand, Rick Rumi, Bro Gawdat). The credits carry a disclaimer.
- Arabic still needs a native-speaker pass.

### Branch claude/final-level-hell (2026-10-18, Lennart's request)
- New final boss level HELL.EXE (LEVELS[7], SC.stage8): Aldi's datacentre after the boat, on Poète maudit du bled (audio/poete.mp3). Story: boatOut → hellIntro → stage8 → adieuIntro → stage5 (Jannah).
- Boss: PLAIBOY ALDI (`aldiboss`). On the drop at 1:23 (`POETE_DROP`) or at 30% hp his mask cracks and he becomes SHAYTAN.EXE (`shaytan`, red recolor, hellfire pillars). Beating him starts the Adieu piano, which then keeps playing through Jannah, the ending and the credits.
- Jannah.exe is now fight-free (Aldi is gone from it). The outro tape is no longer between Adieu and the credits, so the piano never cuts.
- After Mama's last message (stinger) a bloopers video plays if assets/video/bloopers.mp4 exists; otherwise straight to the gift screen.
- Fixed: Aldi showed DJ Playbak's boss subtitle. Smoke test now includes stage8: 103/103 green.
- Round 2 (same branch): Matrix intro for HELL.EXE (green Arabic-calligraphy code rain over Higgsfield panels, `drawArabicRain`); AGENT.EXE gunmen; Neo dodge = jump just before a bullet hits → 110 frames of bullet time (world at 1/3 speed, song at 0.45 playbackRate, green grade). New hell backgrounds bg/hell_a + bg/hell_b.
- Higgsfield art loads from assets/*.webp if present, else from the Higgsfield CDN. Run `sh tools/fetch_hf_art.sh` once and commit the files to drop the CDN dependency.
- Amor Haram: the song is the clock. "LAST SONG 0:45" countdown; when amorharam ends the cabaret closes (`cabaretCloses`) → ending B (tears) unless the love phone was beaten.
- 7elm 7ram: cracks removed, gun in hand in every pose (Max Payne poses), fast dive (no slow-mo), Yung Jnoun 260-frame build-up from red smoke, hshouma words floating through the dream.
- Background seams: 176 px eased cross-fades plus a blurred blend at every open seam (`buildFromImages`).

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

## Story continuity (Oct 18 pass)
- Intro: Mama (motherboard) makes Cheb; Vocoder Versace flops; Aldi's fake streams; he goes home to Oran for three months in the real world.
- Oran: K7 shows Cheb around, Oran mocks the A.I. artist, the fixers attack, they hide in Sawna Rec (Retro, haggle, the rare K7 hunt vs the hipster from Brussels), they come out to more fixers. Vocoder Versace sits in a -90% bin by the door (background only).
- Currency: Oran = dinar (DA). Cairo vendors joke about it.
- Cairo: no Aicha yet. Mama's weak signal warns him (every like costs her power).
- Marseille: Yalla Soundsystem is sold out but the promoter wants more oriental wedding music, so Khalil prompts Cheb into the club. Aicha (his sister, lives in Marseille) is introduced here. Police raid; Cheb has no passport (he is a prompt), so the crew gets him out on the boat.
- Marseille (Le Décolonial): el.7mz mural at the entrance (drop the real file at assets/art/mural_7mz.png), booker in red jeans, Nadia's last shift at the staff exit gives the Carte de Séjour tape. Hipster one-liners only play in Marseille.
- Boat: Benghazi → Oran, only the crew aboard.
- Credits: CAMEOS section lists every real artist/parody; fates include Retro, the man from Brussels, Le Décolonial and Nadia.
- Consent: Retro Cassetta said yes (Oct 18). Wililah and 3phaz said yes earlier. SHAYTAN.EXE design: Hamza decides (no real politician's face).

## Short-attention-span pass (Oct 18)
- Instant start: tap → Sawna logo (~2s) → title. The intro videos/cutscene still play on title idle (40s).
- Every stage clear builds a 9:16 poster (hero sprite, RAÏ NOIR chrome type, the line of the level, score, hit chain). Y or tap = share (native share sheet, or save-image fallback).
- Hit chain counter + hype words at 5/10/15/20/30/50/80 hits (WALLAH! YA SALAM! SAHHA! MABROUK! 3ASSAL! LEGEND, KHOYA! MAMA SAW THAT.) with hit-stop and shake.

## Flow pass (Oct 19): the Sunday text, fewer popups, 7 stages
- Wording: the Sunday-evening (6d8ff20) sentences are back. Lennart liked them better than the trimmed Monday rewrite. The popup cuts are kept: kiosk, El M3alim taunt, robot-camel line, couscous radio, volunteer door, YSS mic skit, Aldi solidarity, Aldi in hell #1, boat radio #1, intro REWIND/FAMOUS, 'authentic diaspora'/Edward Said, Mama phone after the raid, meta chat, Khalil's Benghazi panel, voicemail replay, 'seven billion users'.
- Kept on purpose: Mama's Cheba Warda radio call in Marseille ("too good to let go").
- Optional stops: Retro Cassetta (Oran, haggle), Tata (Cairo) and Nadia (Cyber Cairo, Carte de Séjour tape) no longer pop up. They stand in the level with a cassette/♪ icon; walk up and press A to talk, or walk past (one short shout). Code: `stop:` field on SKITS, `startSkit`, `stopsUpdate`, `drawStops`.
- Club Le Décolonial: no jokes about queer people. The line-up checkbox poster is now an "Authentic Diaspora Night / fee: exposure" poster; DJ Checkbox says "I filled in 14 forms to play one set." Satire targets the club and funders, never identities.
- Stages 9 → 7: Hell.exe, the lift and Jannah.exe are one STAGE 7 · FINALE (`part:1` levels: no poster, a short KEEP GOING beat between parts). The lift has 4 floors instead of 6. Hell and Jannah are ~20% shorter; the dream (7elm 7ram) is ~25% shorter.
- Fixed: SKITS had two `cairo:` keys, so the Spiderman/TIRIRIRI skit never played. Merged.
- Changed lines still need FR/AR (Hamza).
