# RAÏ NOIR — Project Index

Read this first every session. At session end, update **Status**, **Open** and **Next**, and add one line to **Log**. Keep this file under ~200 lines: when the Log grows, collapse old entries into one line each.

## 1. What it is
RAÏ NOIR is a single-file browser arcade game (a side-scrolling beat 'em up) themed on Raï music and Algeria/Oran, and a companion to the *RAÏ NOIR* album. It runs in a 384×224 canvas inside an arcade-cabinet frame, with touch controls on phones and gamepad support, in three languages (en / fr / ar).

- Live: https://7mz410.github.io/RAI_NOIR/ (GitHub Pages from `main`)
- Repo: https://github.com/7mz410/RAI_NOIR (public; GitHub doesn't allow "Ï" in repo names)
- Made for Hamza's friend Lennart in Belgium, who also contributes.

## 2. Commands
- `npm run serve`: serves the game at http://localhost:8777/index.html. Port 8766 is taken by Creative Studio.
- `npm test`: runs `tests/smoke.js` (Playwright, default Chromium), or `node tests/smoke.js [url]`. Exit code 1 means a failure. Last result: 104/104 green (2026-10-21).
- `sh tools/fetch_hf_art.sh`: vendors Higgsfield art into assets/ (already done on gta-oran-vendor).

## 3. Layout
- `index.html` (~645 KB): the whole game: CSS, engine, scenes, sprites, audio and i18n. There is no build step. The only external dependency is Google Fonts (Bungee, Press Start 2P, Noto Kufi Arabic).
- `gta.html`: redirect to `index.html?demo=gta` (the GRAND THEFT AUTOTUNE: ORAN demo).
- `tests/smoke.js`: the release check. It drives every menu and story scene in all 3 languages and clears every level, the server farm, the boat shooter and HELL.EXE.
- `audio/`: one track per level/scene (all level-matched to -12 LUFS), `vv01–08` voice lines, `pads/`.
- `assets/`: bg, spr (sprite atlases), chars, portraits, covers, story, intro, fmv, video (mp4 + webm pairs), ui, shots, art, plus scene folders (amor, adieu, mumya).
- `docs/`: character sheets, marketing art, sprite-gen pose references. Not loaded by the game.
- `sprites_backup/`: originals, then `after_magenta/` and `after_repack/` snapshots. Don't delete it.
- `Emails/`: saved GitHub/PR emails (untracked).
- `../RAÏ NOIR.zip` (85 MB): old backup. Don't delete it.

## 4. Engine map (inside index.html)
- Scenes live in `SC`: `boot, title, select, stagesel, sound, k7, tape, opts, cheats, credits, cont, gift, stinger, sawna`; levels `stage1–stage8`; `payne` (server farm, bullet time); `shoot` (boat shooter). Cine scenes are flagged `isCine`.
- Story order: 7 stages. Oran, Cairo, Amor Haram, server farm (takes stage4's slot), Marseille, the dream, boat (shooter then deck), then STAGE 7 · FINALE = hell + lift + jannah (`part:1` levels: no poster, KEEP GOING between parts), credits, stinger, gift, title.
- Start: Sawna logo, title, START = fighting in Oran. The intro is in the menu (STORY SO FAR · INTRO). Save: `saveProgress` at every stage start (`rainoir-save`); title asks CONTINUE / NEW GAME.
- Hero: always Cheb. K7 and Aicha are NPCs that unlock on the title when met (`metChar`, `rainoir-met`).
- Nokia: `sms(from,txt,{call})` queues a 3310 text (`PHONE`, `phoneUpdate`, `drawNokia`). SKITS entries with `sms:1` go there; max one story popup per level.
- Side quests: SKITS entries with `stop:'id'` (retro, spider, tata, nadia) stand in the level; walk up + A (`stopsUpdate`, `drawStops`, `STOPSHOUT`).
- Navigation: `go(scene)` / `fadeTo`. Runs: `newRun()`. Levels: `startLevel`, `spawnEnemy`, `bossIntro`, `updateWaves`. Skits: `SKITS`, `checkSkits`, `skitDraw`.
- Language: `setLang`, `tr`, `frIt`; strings in `FR_T` / `AR_T`. For Arabic, `text()`/`wrapText()` set `ctx.direction`. Cine scenes show the Arabic as a subtitle above the English line.
- Persistence (localStorage): `saveColl`, `saveOpt`, `saveCheat`, `unlockCrew`, `unlockDecks`.
- Audio: `playMusic`, `musicURL`, `sfx`, `tone`, `noise`; cassettes `mkTape` / `tapePlay`.
- Backgrounds: `buildFromImages` (176 px eased cross-fades at seams).
- Test hook `window.__rr` exposes `SC, G, go, step, press, held, killAll, skipSkits, setState, setLang, newRun, player, scene, stageState`. The smoke test depends on it, so keep it.
- Theme: one dark arcade look by design. Tokens are in `:root` (`--void --cab --bezel --chrome --neon --mint --dim --pixel`).

## 5. Rules
- Smallest diff that works. Fix the root cause, and grep every caller first.
- Run `npm test` before saying "done", look at screenshots, and say plainly what wasn't checked.
- Hamza approves every delete, push and deploy. Lennart may change Hamza's audio tracks freely; mention it, don't flag it.
- No Google Drive desktop app. Upload through the Drive MCP, or ask Hamza.
- Story writing: max one popup per level; the rest goes on the Nokia or in the decor. Cutscenes use the longer "Sunday" wording (Lennart's call, Oct 20). No jokes about queer people. Every changed line needs FR and AR.
- Real people: only with consent (Retro Cassetta, Wililah and 3phaz said yes). No real politician's face. The credits carry a parody disclaimer.

## 6. Team
- **Hamza** (director / owner): vision, story, art, music, copy and assets; playtests on real devices; approves what ships.
- **Lennart**: co-builder; opens PRs (Oct 18 mega-branch, PR #3) and owns audio mastering.
- **Claude** (lead engineer + QA): reads this file, builds, tests and keeps this file current. Haiku workers do sweeps (the "أحمد التبّاع" agents).
- **Workflow:** goal, then a 1–3 line plan, then Hamza's yes, then build, smoke test and screenshots, then Hamza playtests, then commit, then update this file.

## 7. Skills
- Always: `conductor` (voice, build, design, crew rules). `hamza` is the older equivalent.
- Per task: `replica-test` (test plans, extending smoke.js), `code-review` / `simplify` (after change sets), `animate` (hit feel, transitions), `impeccable` / `ui-ux-pro-max` (menus, HUD, touch UX), `banner-design` / `design` (promo art), `run` (drive the game locally).
- Skip: threejs, gsap, scroll-reveal, modern-web-design, replica-recon/architect/brand.

## 8. Story canon (short)
- Intro: Mama (the motherboard) makes Cheb; Vocoder Versace flops; Aldi's fake streams; Cheb goes home to Oran for three months in the real world.
- Oran: K7 shows Cheb around; fixers attack; they hide in Sawna Rec (Retro, the haggle, the rare-K7 hunt against the hipster from Brussels). Currency: dinar (DA).
- Cairo: no Aicha yet. Mama's signal is weak, because every like costs her power.
- Marseille / Le Décolonial: Aicha (Cheb's sister) is introduced; Khalil prompts Cheb into the club for wedding music; Nadia gives the Carte de Séjour tape. A police raid follows, and Cheb has no passport (he is a prompt), so the crew gets him out on the boat.
- Thread: Mama = god, Plaiboy Aldi = the devil, both Cheb's training data. Side quests: Retro (end of Oran), Hoodie Man, Tata, Nadia. Bro Gawdat runs the Cyber Cairo net café.
- Boat: Benghazi to Oran, one stage (flare-gun shooter, then the deck). Then the FINALE: HELL.EXE: PLAIBOY ALDI becomes SHAYTAN.EXE on the drop at 1:23 or at 30% hp. Beating him starts the Adieu piano, which plays on through Jannah (no fights), the ending and the credits.
- Amor Haram: the song is the clock. When it ends, the cabaret closes and ending B plays, unless the love phone was beaten.
- Every stage clear builds a 9:16 share poster. A hit-chain counter shows hype words at 5–80 hits.

## 9. Status (2026-10-21)
- Playable end to end: 8 levels, server farm, boat shooter, menus, cassettes, cheats and credits, in 3 languages. `main` has PR #5 (Streamline) merged; issue #4 settled by it.
- Untracked, waiting for Hamza: `assets/N001–N005`, `assets/chars/N/` (N atlas, a "Pixel Devil Businessman" sheet; possibly the SHAYTAN design) and `Emails/`.
- Many stale local branches (ahmad-1..4, integ, pr3, pr-3, gta-oran-vendor, a worktree branch). Prune only with Hamza's ok.

## 10. Open
**Decisions for Hamza and Lennart**
- Server farm (`SC.payne`): there is no game over at 0 lives.
- Shooter (`SC.shoot`): unlimited free continues; it never reaches `SC.cont`.
- In story mode the server farm takes stage4's slot, so ZIDANE is playable only from stage select. Is that intended?
- RESET SAVE keeps options and language. Is that intended?
- The SHAYTAN.EXE design.

**Known bugs / polish**
- Heavy media: unlockDecks loads yalla.mp3 into both decks, unlockAudio primes every tape video on the first tap, and kick() bypasses MBLOB for rainoir.
- FR: the Rick Rumi talk, the Tata skit and the hellIntro body are still English (stale FR_T keys). The continue-screen coin animation overlaps the long stage-9 subtitle.
- `assets/video/bloopers.mp4` is missing, so the reel is skipped.
- Portrait with the D-pad: the pause button overlaps the bottom-right key.
- Haggle HUD: "HIS HONOUR" touches its bar.
- PR #5 lines need FR/AR. Draft from tata 01/02 (Oran darija, not reviewed) is in the 2026-10-21 session scratchpad as pr5_i18n_v2.json; Hamza reviews before it goes in. Check: "جوج" should be "زوج", "UNC K7" = "عمي K7"?
- Nokia LCD at 4px: line 2 of a long text looked overprinted in a screenshot; check on a phone.
- Bro Gawdat now has a speaking role: confirm consent.
- Arabic needs a native-speaker pass. Lines changed in the Oct 19 flow pass still need FR/AR.
- Won't fix: Press Start 2P draws small accents on capitals (É).

## 11. Next
1. Hamza and Lennart playtest on real phones.
2. Settle the Decisions above.
3. Fix the Known bugs list, then a performance pass on low-end phones (media first).
4. Native Arabic pass and the FR catch-up.

## 12. Log (one line per session)
- 10-16: git init, package.json, smoke test; GitHub Pages live; bug sweep 1 (9 fixes); 558 darija strings; sprite pass 1 (magenta cleanup, 2px repack).
- 10-17: sprite pass 2 (165 leftover pieces cleared); camel redrawn by Hamza.
- 10-18: HELL.EXE final level (Matrix intro, Neo dodge); Amor Haram clock; story continuity pass; share posters and hit chain; Higgsfield art vendored.
- 10-19: flow pass (story text ~1,900 to ~1,150 words; duplicate `cairo:` skit key fixed); PR #3 merged (audio at -12 LUFS); sweep 2 (44px targets, overlaps, stageDraw crash, 200 AR strings).
- 10-20: PROJECT.md restructured. Lennart's PR #5 (fight first, Nokia, side quests, save, one boat stage, 7-stage finale).
- 10-21: PR #5 merged by Hamza; dead code removed (oranDetails, STORYCAST lookup in startLevel); AR stage list ends in الفينال; smoke 104/104.
