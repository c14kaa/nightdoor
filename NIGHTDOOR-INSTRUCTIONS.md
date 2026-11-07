# Nightdoor: project instructions

## What this is
Nightdoor is a browser-based, choose-your-path horror game: a homepage "shelf" of stories, each played one illustrated scene at a time. It runs offline from index.html and is live at https://nightdoor.vercel.app.

## Where the files live
- The master copy is always on my computer at: C:\claude\creative\nightdoor\nightdoor
- Read the current files from that folder before changing anything, and save every change back to it. Never work from an older copy or from memory.
- The published preview link (https://claude.ai/code/artifact/cec3ad63-f5a8-4cfa-96aa-c8b71dcbaeda) should be republished after changes so it matches the folder.
- If my computer isn't reachable, say so, and send me a zip of the full updated folder to drop in.

## Folder layout
- index.html: homepage and player layout and styles; loads every script in order
- js/engine.js: game engine (shelf, player, lives, items, sound, saves, jump scares). The SHELF list at the top is the story catalogue.
- js/art.js: shared art toolkit plus Primrose Close art (SVG drawn in code, scenes 800x400, jump scares 600x600)
- js/art-<story>.js: each later story's own art module (art-hollowmere.js, art-goodboy.js, art-cairn.js)
- stories/<story-id>.js: one file per story

Script order in index.html: art.js → primrose-close.js → each story's art file then its story file → engine.js last.

## Current stories
Each story has its own fear signature, which no other story may borrow:
1. Primrose Close: a perfect neighbourhood with a sinister landlord. Signature: everyone smiling, a too-perfect street, doors.
2. The Bell at Hollowmere: demonic possession on a hill farm with a ruined chapel. Signature: sound and stillness. The possessed go grey, keep their eyes shut, tilt their heads as if listening, hum the bell's note, and count down under their breath. The man in grey has a smooth, mouthless face, and the demon has a cracked bell where its face should be.
3. Good Boy: skinwalkers; the family dog comes back wrong from the woods on a new-build estate. Signature: skin that doesn't fit. Faces hang loose and split down the middle, people pant and sniff like dogs, eyes are flat white coins that never blink, and the voices mimic yours.
4. Cairn: five friends lost on a camping trip in a Highland forest; an original creature, the Cairnman. Signature: cairns that appear overnight, the clack of stone on stone in the dark, paths that loop back on themselves, the taken left as cairns wearing their things. Opens cold and grey in fog. Always original creatures: never use characters someone else created (e.g. Sirenhead, Slender Man), since the game will be public.
Coming soon, already on the shelf as placeholders: The Keeper of Gull Rock (lighthouse), Signal from Ward 9 (abandoned hospital)

## Game rules every story follows
- Each scene: short readable text (a few sentences) and exactly three choices
- Lives shown as three candles; bad choices cost a life; losing all three restarts the story
- Items go into pockets; some choices need an item, some items heal (food), some are hidden flags that track what the player did
- Some choices are fatal and end the story immediately
- Jump-scare monster images at key moments, with synthesised sound
- Several endings per story (usually five), tracked on the ending screen

## Tone and style
- The art style is shared (picture-book SVG art), and the stories are pitched at YA/adult readers.
- Every story sets its own premise and opening. Don't default to "bright and cosy, then it turns dark". The first three all open that way, so new stories should open differently: cold opens in the middle of the danger, already-at-night starts, isolation from the first scene, an ordinary job that's wrong from minute one, a found recording or logbook, starting after the disaster, and so on. Pick the opening mood, pacing and act structure to suit the story; the mood palette (day, golden, dusk, night, under, blood, fog) can be used in any order.
- British settings, voice and spelling
- Every story must feel distinct, because one reader will likely play several back to back. Before writing a new story, define its fear signature: its monster, how the infected or haunted look and behave, its key images, sounds and rules. Check it against every existing story's signature above, then add it to that list. No grins or smiles outside Primrose Close.
- Vary the endings too: not every story needs exactly five endings or one survivor.

## Story file format (stories/<id>.js)
Each story registers itself as NIGHTDOOR.stories['<id>'] with:
- id, title, tagline, blurb, cover (art key), lives: 3, start (first node id)
- frozen: regex of clock times that glitch (e.g. '03:00$')
- death: { title, text } shown when the candles run out
- items: { key: { name, icon, desc, heal?: 1 } }; use { hidden: true } for flags
- nodes: { id: { act, title, time, mood, img, sfx?, text, choices: [...] } }
  - mood: day | golden | dusk | night | under | blood | fog
  - sfx: van | vanSlow | knock | heart | bell | thunder | scratch | growl | stones (new sounds are added in engine.js)
  - choice: { t: label, o: outcome text, next, gain?, lose?, dmg?, fatal?, scare?: jump-scare key, need?: item(s), fail?: { o, dmg, next } used when the needed item is missing }
  - routing node: { route: [ { need: [...], next }, …, { next: fallback } ] } picks an ending from the items/flags held
  - ending node: { title, time, mood, img, text, end: { kind: 'best' | 'good' | 'survivor' | 'bad', label } }

## Hosting (live)
- Live site: https://nightdoor.vercel.app (Vercel project "nightdoor" in the Hollyend Vercel account, Hobby plan)
- Code: GitHub repo c14kaa/nightdoor (public), branch main. Vercel redeploys automatically on every push to main, usually within a minute.
- After any change: save it to the folder on my computer AND commit and push it to c14kaa/nightdoor main, so the folder, the repo and the live site always match. Republish the preview link too.
- Static site, no build step (Vercel preset "Other", root ./). vercel.json sets clean URLs and stops browsers caching old story files.
- Keep it server-ready:
  - Plain static files only (HTML, JS, no server code)
  - Relative paths only (js/…, stories/…); never absolute paths or file:// links
  - Lower-case, hyphenated file names with no spaces (the server is case-sensitive)
  - External links to Google Fonts only; everything else self-contained
  - Progress saves in the browser's localStorage, so it must always fail safely
- index.html has a proper <head>: title, description, share (og:) tags and a door favicon. Still to do when wanted: share images and per-story links.

## Adding a new story
1. Write stories/<id>.js in the format above, plus js/art-<id>.js for its scenes, cover and jump scares (built from the shared toolkit in ART.lib)
2. Add both script tags to index.html, before engine.js
3. Add or replace its entry in SHELF in engine.js (remove "soon" if it was a placeholder)
4. Check it before calling it done:
   - every node is reachable, every next/need/gain/img/scare reference exists, no dead ends
   - the art renders, and a quick gallery of scenes looks right
   - automated random playthroughs in a browser throw no errors, and a scripted run reaches every ending
   - text never assumes the player picked up an item they might not have
5. Save to the folder, push to GitHub (which updates the live site), republish the preview link, and give me a short summary of the story, items, endings and scares
