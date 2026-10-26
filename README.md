# Pixel Fighter

An 8-bit pixel-art fighting game that runs entirely in the browser — no build
step, no external assets, no network requests. Two original fighters battle
best-of-3 rounds on a 960×540 landscape stage.

## The fighters

- **Ember** (you) — fire theme, orange/red palette.
- **Frost** (computer) — ice theme, blue/white palette.

Both are original characters drawn in code as pixel maps. No Street Fighter
characters, names, or sprites are used.

## How to play

- Best of 3 rounds, 60-second round timer.
- Reduce your opponent's health bar to zero to win a round (K.O.), or have
  more health left when the timer runs out.
- First to 2 rounds wins the match. Hit **REMATCH** (or Enter) to go again.

## Controls

### Keyboard

| Key | Action |
| --- | ------ |
| A / D or ← / → | Move (toward your opponent) |
| W or ↑ | Jump |
| S or ↓ | Crouch |
| J | Punch |
| K | Kick |
| L | Fireball (short cooldown, can't be spammed) |
| Hold the direction AWAY from your opponent (or the BLOCK button) | Block — blocked hits deal small chip damage and no knockback |
| M | Mute / unmute |
| Enter | Start / rematch |

### Touch (mobile)

On-screen buttons for Left, Right, Jump, Block, Punch, Kick, and Fire drive
the exact same input state as the keyboard. On portrait phones/tablets a
"rotate for full screen" hint appears over the game — the stage is landscape.

## The computer opponent

Frost closes distance when far away, mixes punches and kicks up close, blocks
some of the time when you attack, throws fireballs from long range on
cooldown, and jumps occasionally. Its decisions run on a short reaction
delay, so it is beatable — it is not frame-perfect and it does not read
your inputs.

## Sound

Retro WebAudio oscillator bleeps for punches, kicks, fireballs, jumps, K.O.,
and round wins. Audio only starts after your first tap or keypress (browsers
block autoplay), and the 🔊 button top-right mutes everything.

## Deploy on GitHub Pages

The game is static (index.html + game.js + style.css), so Pages can deploy
it straight from the main branch — no build step, no workflow file:

1. Push these files to the `main` branch of the repository.
2. On GitHub: **Settings → Pages → Build and deployment → Source:
   Deploy from a branch → Branch: main → Folder: / (root) → Save.**
3. After a minute or two the game is live at
   `https://<owner>.github.io/<repo>/`.

## Files

- `index.html` — canvas + HUD shell, loads game.js and style.css.
- `game.js` — all game logic: sprites, combat, AI, sound, touch.
- `style.css` — page, HUD, and touch-control styling.
