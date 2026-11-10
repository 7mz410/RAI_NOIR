# RAÏ NOIR: how the game was built (branch archive)

Every old branch is kept as a tag `archive/<branch>`. Branches can be deleted; the tag keeps the commits.
Restore one with `git switch -c <name> archive/<name>`. List them with `git tag -l 'archive/*'`.

## The process
1. Hamza + Lennart agree a goal, Claude writes a 1–3 line plan, Hamza says yes.
2. Work on a short branch (often by Haiku "agent" workers in git worktrees), then `npm test` (smoke 104/104) and screenshots.
3. Pull request on GitHub, Hamza merges, GitHub Pages deploys `main`.
4. Playtest on real phones; Lennart's playtest passes come back as PRs from `claude/gta-oran`.
5. `PROJECT.md` is updated at the end of every session.

## Timeline (branch · date · what)
| branch | date | what | status |
|---|---|---|---|
| claude/final-level-hell | 10-18 | HELL.EXE final boss, Matrix intro, Amor Haram song clock (PR #1) | merged |
| claude/quick-wins | 10-18 | Cheb-only start, INSERT 1 DINAR continue, credits (PR #2) | merged |
| pr-3 | 10-18 | Cult pass: instant start, share posters, hit chains (PR #3) | merged |
| claude/enemy-cards | 10-18 | Enemy card images for the Drive enemy bible | NOT merged |
| worktree-agent-a32f… | 10-17 | Playtest feedback: walk bounds, track lengths | merged |
| pr3, ahmad-1..4, integ, gta-oran-vendor | 10-19 | Hamza's mural, title fixes, AR/FR translations (327 AR, 196 FR), boot preload, sweep 2 | merged |
| worktree-agent-a2bb…, a939…, acc4… | 10-22 | SHAYTAN.EXE: N atlas, reveal glitch, design sheet | merged |
| worktree-agent-a5aa…, a8f8… | 10-22 | Pause/D-pad overlap, stale FR strings | merged |
| worktree-agent-af75… / fix/cairo-drive-loop | 10-22 | Seamless Cairo drive loop (PR #7) | merged |
| claude/gta-oran | 10-20 → 11-09 | Lennart's playtest passes (PRs #5, #6, #8, #10) | merged |
| lolly08-title / art/title-heroes | 10-23 | Text-free title hero art (PR #9) | merged |
| rebuild/fable | 10-22/23 | Lennart's clean-slate engine + Oran vertical slice (`fable/`) | NOT merged, remote only |

## Releases
Release = merged PR on `main`. Tag it `v<N>` after smoke passes, e.g. `git tag v-pr10 main`.
