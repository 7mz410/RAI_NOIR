# RAÏ NOIR: rebuild brief

You are rebuilding the browser beat 'em up **RAÏ NOIR** from a clean slate, as an experiment next to the current game.

## Branches and testing

- The current, working game stays on `main`. It is the fallback, so never break it.
- Build on a new branch, `rebuild/fable`.
- The finished rebuild must be playable as one page, like `index.html` today, so it can be published as a play-test artifact.
- Lennart plays both versions. The better one wins.

## People

- **Lennart Thienpont aka Lamartine Ponch** (idea, story, direction). Credit him exactly like that.
- **Hamza Abu Ayyash** (el.7mz): art, code, his own AI agents. GitHub `7mz410`; repo `7mz410/RAI_NOIR`.
- **Bader Shashit**: art direction, together with Hamza and Lamartine Ponch.

## How Lennart works

- Talk straight, German-style, with humor. Coach him; don't just say yes.
- After you show him a design, or ask him a design question, wait for his explicit "go" before you build it.
- Sub-agents run on **Haiku**.
- He plays on a **phone in landscape**. That is the main target. Desktop keyboard is second.

---

## 1. What the game is

- A 16-bit beat 'em up (Streets of Rage feel) about **Cheb GPT**, an A.I. raï singer from Sawna Records.
- Tone: an epic cult classic, full of humour, culture critique and *bled*.
- Short attention spans: fight within seconds, little text, story told by art, decor and characters.

**The thread:** Mama is god and Plaiboy Aldi is the devil. Both are just Cheb's training data. Put this on screen once, near the end: *"MAMA AND ALDI WERE JUST WHAT HE WAS TRAINED ON. THIS TIME HE PICKED WHO TO LISTEN TO."*

## 2. Hard rules

- **No real brand logos** (Nike swoosh, Versace Medusa, LV…). No real politicians' faces.
- **Satire targets clubs, funders and platforms, never identities.** No jokes about queer people, pronouns or "safe spaces". The muralist (Hamza) was paid well, so no "paid in visibility" joke about the artist.
- Real people only with consent. These have agreed:
  - Retro Cassetta (parked for now)
  - Wililah and 3phaz
  - the real Cheb GPT (YouTube @chebgpt, Morocco)
  - Mo Gawdat as **Bro Gawdat**
- **No Pokémon or other known characters.** The one-time joke enemy is **DUCK.EXE**, an original glitchy rubber duck in Marseille.
- **You always play Cheb.**
  - Unc K7 (Oran) and Aicha (Marseille, "his little sister") are characters in the story. They unlock once you have met them.
  - **Call a friend = the family only** (Unc K7, Aicha).
  - Yalla Soundsystem (Khalil, Bader, 5amaseen, Acid Ponch, Fatih) appear only as characters in the Marseille club and on the boat. They are never helpers.
- Cheb is mocked as an "A.I. artist" in Oran, **but not on the first screen.** Screen one is pure brawling; jokes start from screen two.

## 3. Flow and story, beat by beat

| # | Scene | Music (`audio/`) | What happens | Popups (max 1) and other text |
|---|---|---|---|---|
| 0 | Sawna logo → **title** | `zizou` | Close-up of the three heroes (Cheb, Aicha, Unc K7) under the logo. Small "HOW IT STARTED" button (plays the Vocoder Versace intro). PRESS START. Nothing else; keep it clean. | |
| 0b | **Level select** | `zizou` | Scroll through the stage **covers** (`assets/covers/*`). The covers carry the big letters: place + track. FULL GAME first. A save preselects your last stage. | |
| 1 | **Oran**, "Zizou" | `zizou` | Opens with the old Oran VHS (`assets/video/oran_tape.*`, 5 s, skippable, caption "HOME. OFFLINE. AND LOVING IT. / UNTIL ORAN FINDS OUT HE IS AN A.I."). Three months home, offline. Unc K7 shows him around. Boss: DJ Playbak. | Popup: Mama from the balcony ("YOU'RE THIN. EAT. AND BE A DOCTOR." / "AFTER, MAMA."). Texts: nephew Yacine ("ARE YOU REAL??"). |
| → | Phone dies; the only outlet is Mama; he goes online again (2 short panels) → Mumya telenovela reel | `mumya` | | |
| 2 | **Cairo**, "Zomby" | `zomby`, then `voodoo` | Starts with the car ride (Mercedes W123). Zombies with phones. Zomby plays almost to its end. Just before the boss, the Hoodie Man / TIRIRIRI popup (`story/spider_vendor` + clip; Y = buy the hoodie). Boss **El M3alim** on Voodoo from **62 s** (where the little voice starts; the drop is at 69 s), then his rottweilers. | Mama texts: "YOU WENT ONLINE THROUGH ME. EVERY LIKE YOU GET, I PAY." Aldi: "SMILE, YOU'RE TRENDING!" |
| → | Card: Mama is running low, he wants to go home, Bro Gawdat's net café sells tickets "AND OTHER THINGS" | | | |
| 3 | **Cyber Cairo**, "Amor Haram" | `amorharam` | Corniche → **walk into the internet café** (keep this: Lennart hated the door version) → street → cabaret. **Bro Gawdat** stands behind the counter: *"YA BASHA, EL AI DA EBNAK. RABBEEH KWAYYES."* PC 7 = the "Samia from Lisbon" love chat (optional). Boss **WIGGZ.AI** ("THE CATFISH FARM · SAMIA WAS A PROMPT"). Never the Feed/Algo Riddim boss twice. | Two endings (climax / tears). |
| 4 | **Marseille**, "Zidane" | `warda`, then `zidane`, then `jump` | Yalla Soundsystem is sold out. The promoter wants oriental wedding music, so Khalil prompts Cheb in, "INSTEAD OF HOME". Aicha is there. Club **Le Décolonial**: el.7mz mural (`assets/art/mural_7mz.png`), the booker (red jeans), DJ Checkbox, DJ Nepotism, tote-bag hipsters. Cheb answers KOs in **darija** (Algerian, Latin letters). DUCK.EXE once. When the boss falls, Habibi's **"Jump"** starts. | Popup: the booker at the mural. Mama's Cheba Warda call on the Nokia. |
| → | Police raid, no passport, run to the port, Khalil's uncle's fishing boat | `jump` | | |
| 5 | **Ghorba**, the boat | `jump`, then `mama` | Flare-gun shooter (FMV, `assets/fmv/*`) on Jump. Three missed shots = the captain takes it. Then the **deck fight** on "Mama". | Popup: the fisherman ("YOU ARE THE FIRST I TAKE HOME"). |
| → | He falls asleep on the nets, Oran on the horizon | | | |
| → | **The dream** (short, not a level) | `helm7ram` | Four panels:<br>- The red thread crawls out of his phone.<br>- The real Cheb GPT passes by: "THE SONG IS BIGGER THAN BOTH OF US. NOW WAKE UP."<br>- Aldi: "I'M THE HALF OF YOU THAT PRESSED SEND."<br>- Mama: "AND I AM THE HALF THAT WAITS." The thread becomes her cable.<br>Then the music **slides** (about 4 s crossfade) into Poète maudit. | |
| 6 | **Finale: HELL.EXE**, Aldi's datacentre | `poete` | Agents with guns. Jump before a bullet = dodge. SPECIAL = **bullet time** when the slo-mo bar is full. Aldi's last entrance and the turn into **SHAYTAN.EXE** are big letterboxed full-screen moments. | Aldi popup: "I AM THE TERMS AND CONDITIONS." / Cheb: "THEN I DON'T ACCEPT." |
| 6b | **Finale part 2: JANNAH.EXE** | `adieu` | Angels, then Mama (the Motherboard). Hold her hand. | |
| → | Ending | `adieu` | He unplugs. Then the thesis line. He **wakes up on the nets in Oran's port**: "WLIDI? THE HARIRA IS WARM." "A DREAM? THE CLOUD? MAKTOUB." Heaven and hell stay ambiguous. | |
| → | Credits | | Lennart Thienpont aka Lamartine Ponch; Hamza Abu Ayyash; art direction Bader Shashit · Hamza Abu Ayyash · Lamartine Ponch; cameos; Bro Gawdat's word. | |

**Cut for now; don't reference them:** the lift, Rick Rumi, Tata/Timbaiand, Retro Cassetta's stall, Nadia, Benghazi, the "comeback" panels, the offline track after Oran, and the dream as a playable level.

## 4. Systems to keep (proven in the current build)

- **Fight first.** Max **one popup per level**.
- **The Nokia:** Mama, Aldi, nephew Yacine and Khalil text you on a 3310 in the corner while you keep fighting. Status bar with the battery = Mama's power, "1 NEW MESSAGE", sender icon. Mama's Warda call is a phone call.
- **Levels end with their song.** The boss is cued shortly before the track ends. If you arrive early, the DJ pulls the track up to the drop. If you're slow, the boss comes to you.
- **Difficulty ramps up every stage**; the finale is the hardest.
- **Noob helpers:**
  - Punching with an enemy only behind you turns you around.
  - Enemies never camp off-screen during a wave lock.
  - No grab loop.
  - Popups wait until the fight around you is over and ignore button mashing.
- **Save/continue** (last stage). Continue resumes the song where it was.
- **Stage-clear share poster** and hit-chain hype words: keep them, but keep them small.
- **Walk bounds:** no walking on buildings (Cairo and hell need a higher top edge).
- **Translations:** FR/AR exist for the old text. New lines may stay English for now; Lennart wants the version good first.

## 5. Assets: pick only the best

**Reuse the existing assets.** Lennart's instruction: **only pick the best shots from Google Drive and Higgsfield.** Curate; don't use everything. Weak, off-model or text-cluttered images stay out.

What's in the repo now:

- **Music** (`audio/`): `zizou` `mumya` `zomby` `voodoo` `amorharam` `warda` `zidane` `jump` `mama` `helm7ram` `poete` `adieu` `rainoir`, plus `vv01–08` (Vocoder Versace EP) and `sawna_boot`. All are mastered to about -12 LUFS. Song lengths matter for pacing: zizou 100 s, zomby 129 s, amorharam 199 s, warda 215 s, mama 275 s, poete 199 s, adieu 151 s, jump 185 s.
- **Stage covers** (`assets/covers/`): the letters are baked in. Some show old stage numbers: Ghorba says "STAGE 6", 7elm 7ram "STAGE 5", Server Farm "STAGE 7". Re-letter them or regenerate them.
- **Story art** (`assets/story/`, `assets/intro/`, `assets/adieu/`, `assets/amor/`, `assets/mumya/`, `assets/shots/`): pick the best per beat.
- **Sprites** (`assets/spr/atlas*.png/.json`, `props`): the fighter and enemy atlases. `atlas15` holds the newer enemies (nepo, checkbox, wiggz, alien). The current `index.html` shows the frame naming and pose mapping.
- **Character art** (`assets/chars/`): `gawdat_idle.png` (waist-up, behind a counter), `retro_74.png`, booker, the N atlas (SHAYTAN.EXE). Sheets are in `docs/characters/`.
- **Logo:** `assets/ui/logo_v3.png`, the exact colours. Draw it over text-free art; never let a model re-draw the letters.
- **Video:** `assets/video/` (oran_tape, intro_cheb, intro_amor, outro, tiririri), `assets/fmv/` (boat shooter).
- **Cutscene direction:** mostly real video skits (like the Amor Haram intro) or photos (like the intro), with the best pixel art in between.

Technical notes:

- Higgsfield's CDN can't be downloaded from the cloud container. Lennart downloads the picks and drops them into the chat, or you import them via a public GitHub raw URL.
- Google Drive is reachable through the Drive connector, if it's connected.

## 6. Still open

- **Cairo backgrounds:** the seams glitch into each other. Hamza's agents opened PR #7 for a seamless car-ride loop.
- **Title hero art:** Lennart redoes it himself. Close-up torsos of the three heroes in fighting stance, no text in the image; the logo is overlaid in code.
- **Modern zombie sheets:** hood up and hood down, still to come.

## 7. Done means

- Phone landscape first.
- From the title to the credits with no soft-locks.
- Every level ends with its song.
- At most one popup per level.
- First screen is quiet.
- Family-only help.
- All rules in section 2 respected.

Test it the way the current build is tested:

- A headless Playwright smoke test of every menu, scene and level (`tests/smoke.js`).
- A full title-to-credits run with a music log.
- **The Sawna crowd**, Haiku persona testers:
  - Noob Nesrine (phone, fun, distractions)
  - Speedrun Sofiane (full run, soft-locks, pace)
  - Khalti Karima (story, continuity, darija, joke density)
  - DJ Glitch (visual seams and overlaps)

Then send Lennart one play link and a short report.
