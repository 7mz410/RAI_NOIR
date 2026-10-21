# SHAYTAN.EXE: design sheet

Final boss, phase 2 of HELL.EXE (stage 8 in code, `LEVELS[7]`, id `hell`).
PLAIBOY ALDI turns into SHAYTAN.EXE on the drop of *Poète maudit du bled* (`POETE_DROP=83`, so 1:23) or when he falls to 30% hp (`shaytanReveal` in index.html).

## What the game does now

- Phase 1 `aldiboss` uses the `aldi` sprites (`e_aldi_0..10`, atlas3) at scale 1.18: a tanned playboy in an open robe with a phone in his hand.
- Phase 2 `shaytan` uses the **same sprites**, with the colours turned (`hue:150, sat:1.5, light:-.06`) and the scale raised to 1.5. Stats: hp 170, spd .92, reach 30, dmg 12.
- The reveal: white flash, screen shake 20, hitstop 36, boom and boss sfx, a red tint over the screen (`G.hellRed`), 46 debris bits in `#ff3d5a #ffb347 #1a0006 #f4e7c8`, the float text "THE MASK CRACKS" and the banner "SHAYTAN.EXE / THE PLAYBOY WAS THE MASK. THE DEVIL WAS THE PLATFORM."
- Attack: `hellfire`, fire pillars under the player every 170 frames (110 below 40% hp), with taunts such as "ACCEPT ALL COOKIES".
- Result: SHAYTAN reads as "Aldi, bigger and recoloured". There are no horns and no new outline, so the transform is all in the effects.

## Concept

The playboy was a skin and the platform wears it. SHAYTAN.EXE is **what is left when the feed drops the mask**: Aldi's own body, but the robe has become a server-rack coat, the phone has grown into the hand, and the face is a cracked screen showing a loading spinner where the eyes should be. He is not a real person and he has no human face. He is the algorithm in a body.

## Palette (existing game tokens only)

| Role | Hex | Used in game as |
|---|---|---|
| Body / coat shadow | `#1a0006` | hell debris |
| Coat mid (rack panels) | `#1c2e6b` | Aldi's suit, kept as the "he was always this" link |
| Status LEDs / cable glow | `#3a8ad8` | Aldi's head trim |
| Hellfire core, eye spinner | `#ff3d5a` | hell debris, taunt text |
| Danger flash, eyes on wind-up | `#ff2a4a` | shadow-enemy eyes |
| Fire edge, horns (cable stubs) | `#ff5a2a` | embers |
| Hot highlight | `#ffb347` | debris |
| Tell flash / "MASK CRACKS" | `#ffe066` | float text, embers |
| Teeth / screen glare | `#f4e7c8` | debris |

## Silhouette

- About 1.5x Aldi's height. Shoulders wider than the hips, with a **flat-topped head** (a monitor) and **two short cable stubs** standing up like horns, glowing `#ff5a2a` at the tips.
- The coat hangs to the knees and splits into 3 to 4 trailing cables that drag on the floor. This reads at 384x224 even when he is drawn black (the shadow pass).
- One arm ends in a phone-slab claw (Aldi's phone, grown in). The other arm is a bare fist.
- From the side he must not look like any of the human enemies. The flat head, the horns and the cable tail are the three shapes that do that.

## Attack tells (all 12 to 22 frames, readable without sound)

| Attack | Tell | What it does |
|---|---|---|
| Slab swipe (melee, reach 30) | Phone-claw raised; the screen face flashes `#ff2a4a` 2x | Wide horizontal hit, knocks the player down |
| Hellfire (`hellfire`) | Floor circle under the player goes `#ffe066` then `#ff3d5a`; taunt text comes up first | 2 pillars (3 below 40% hp) |
| Cable lash (new, optional) | Cables lift and the LEDs run `#3a8ad8` to `#ff5a2a` from back to front | Low sweep. Jump it. |
| Buffer (stun window) | The spinner face freezes, white and grey | 40 frames when he can be hit for free after 3 hellfire casts |

## How the transform should look (on the drop, 1:23)

1. Freeze for 6 frames: the music hits, hitstop. Aldi's sprite goes to `e_aldi_9` (the arms-out pose).
2. Glitch for 12 frames: his sprite is cut into horizontal bands that slide side to side, `#ff3d5a` and `#3a8ad8` (RGB split). The phone flies up into his hand.
3. Crack: a white flash, "THE MASK CRACKS", and the debris burst we already have. The robe pieces fly off as debris in `#1c2e6b`.
4. Reveal: SHAYTAN at scale 1.5 in the red-tinted room, the cable horns lighting up last. Banner as now.
Steps 1, 3 and 4 already run in `shaytanReveal`. Only the glitch bands (2) and the new sprite are missing.

## Art status: the N atlas is not used

The untracked candidate art (`assets/N001.jpg`, `N002`–`N005.png`, `assets/chars/N/`, the "Pixel Devil Businessman" sheet) is technically a drop-in. `N_atlas.json` uses the game's `{key:[x,y,w,h]}` format, and its frames `n_0..n_10` line up one to one with `e_aldi_0..10`. **But the reference photos and the pixel character are a recognisable real head of state, with horns added.** The project rule is no real politician faces, so it is **not wired**, and it should not ship in any form. To use the same pipeline, draw a new sheet from the silhouette above (monitor head, no human face) and export it as `assets/chars/shaytan/shaytan_atlas.{png,json}` with the same 11 frame keys. Then hook it up the way atlas3 is loaded: map `n_k` to `e_shaytan_k`, add a `SPRMAP3.shaytan` entry, and set `ETYPES.shaytan.base='shaytan'` only after the image loads, so the old recoloured Aldi stays as the fallback.
