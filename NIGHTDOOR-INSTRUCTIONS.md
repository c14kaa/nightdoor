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
- js/art-<story>.js: each later story's own art module (art-hollowmere.js, art-goodboy.js, art-cairn.js, art-signedout.js, art-ward9.js, art-leaveitopen.js). Scare keys are shared across all stories, so prefix new ones (e.g. s_lio_eyes).
- stories/<story-id>.js: one file per story

Script order in index.html: art.js → primrose-close.js → each story's art file then its story file → engine.js last.

## Current stories
Each story has its own fear signature, which no other story may borrow:
1. Primrose Close: a perfect neighbourhood with a sinister landlord. Signature: everyone smiling, a too-perfect street, doors.
2. The Bell at Hollowmere: demonic possession on a hill farm with a ruined chapel. Signature: sound and stillness. The possessed go grey, keep their eyes shut, tilt their heads as if listening, hum the bell's note, and count down under their breath. The man in grey has a smooth, mouthless face, and the demon has a cracked bell where its face should be.
3. Good Boy: skinwalkers; the family dog comes back wrong from the woods on a new-build estate. Signature: skin that doesn't fit. Faces hang loose and split down the middle, people pant and sniff like dogs, eyes are flat white coins that never blink, and the voices mimic yours.
4. Cairn: five friends lost on a camping trip in a Highland forest; an original creature, the Cairnman. Signature: cairns that appear overnight, the clack of stone on stone in the dark, paths that loop back on themselves, the taken left as cairns wearing their things. Opens cold and grey in fog. Always original creatures: never use characters someone else created (e.g. Sirenhead, Slender Man), since the game will be public.
5. Signed Out: a school lockdown at 15:13 that drops Harrowfield School into another world; an original creature, the Visitor. Signature: fingernails tapping on glass, door handles tried one by one down a corridor, a VISITOR lanyard, names written down (it takes anyone whose name it can read), the taken "signed out" in its spidery hand and walking off across a black-red void wearing blank lanyards, the clock stuck at 15:13. The Visitor: far too tall, folds at every joint, cracked white porcelain head, black eye holes weeping ink, a mouth that opens top to bottom, seven-fingered hands. Never use Momo or any other real creature/artwork. First story built around puzzles.
6. Signal from Ward 9: night security at Thornleigh General (closed after the night of 13–14 March 1974), a week before demolition; an original creature, the Night Sister. Signature: a ward that breathes (rows of sheeted shapes breathing in perfect unison, and the silence when they stop), a torch beam sweeping bed to bed, an upside-down fob watch that ticks faster as she nears, yellowed gauze taped over every mouth, lidless eyes that shine green in torchlight, cold wet hands taking your pulse, an old pager that goes off at 03:03. Being caught means being "admitted": put to bed, taped, breathing with the rest. The Sister: far too tall, navy dress and cape, starched cap, grey skin, gauze that sucks into a hollow far deeper than a mouth. No split or zipped faces. Built around timed action.
7. Leave It Open: Isabel, ten, over three nights in her own bedroom, with an original creature, the Hanger, in her Gran's old wardrobe. Signature: the gap (a wardrobe door that won't stay shut and opens a little wider each night, with the creak), a black blacker than the dark, and two eyes as bright as switched-on bulbs that drink the light out of the room (nightlights dim, torches fade, light drains into them). The Hanger hangs from the rail on a hook where its head should be: a flat cut-out of pure black, coat-hanger shoulders, a body like a long coat, thin arms with too many knuckles. Alarms go off on their own when it moves (smoke alarm, the red burglar-alarm sensor, a clock frozen at 02:22), and phone emergency alerts that only Isabel gets, official at first and then personal ("LEAVE IT OPEN"). Grown-ups never see it and always have an excuse; it hates bright light and being seen by a grown-up. Being touched by it spreads to people. Built around emergency alerts, hold-still, a kitchen search and the alarm keypad.
Coming soon, already on the shelf as a placeholder: The Keeper of Gull Rock (lighthouse)

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
- startInv: optional list of items the player starts with (e.g. ['phone', 'teddy'])
- nodes: { id: { act, title, time, mood, img, sfx?, text, choices: [...] } }
  - mood: day | golden | dusk | night | under | blood | fog
  - sfx: van | vanSlow | knock | heart | bell | thunder | scratch | growl | stones | alarm | tap | handle | pager | ward | watch | watchFast | trolley | creak | alert | smoke | creakAlarm (new sounds are added in engine.js)
  - choice: { t: label, o: outcome text, next, gain?, lose?, dmg?, fatal?, scare?: jump-scare key, need?: item(s), fail?: { o, dmg, next } used when the needed item is missing }
  - routing node: { route: [ { need: [...], next }, …, { next: fallback } ] } picks an ending from the items/flags held
  - ending node: { title, time, mood, img, text, end: { kind: 'best' | 'good' | 'survivor' | 'bittersweet' | 'bad', label } }

## Puzzles and interactions (engine-supported; use them in new stories)
Not every scene has to be three text choices. Add these to a node; they can be combined with its choices:
- Countdown: `timer: 10, timerLabel: 'Hide', timeout: { o, dmg, next, scare }` — a draining bar; if the player hasn't chosen in time, `timeout` happens instead.
- Door picker: `doors: true` on the node, and each choice gets `door: { c: colour, sign: 'LIBRARY', glass: true|colour, double: true, steel: true, light: colour (glow under the door), mark: colour (scratches), signC, signT }`. Choices render as drawn doors. A choice with `next` equal to its own node lets the player try another door.
- Picture search: `search: { prompt, spots: [ { t: label, x, y, w, h (in the scene's 800x400 coordinates), o, gain, dmg, scare, again } ] }` — tap places in the scene image (or the chips under the text) to find items and clues. Draw the scene so the objects sit inside those boxes. Each spot pays out once.
- Keypad / typed answer: `code: { answer: '1962' | ['VANE', 'MRVANE', …], kind: 'letters' (else digits), len, tries, prompt, button, clue: { need: item, t: text shown if held }, ok: {o,next,gain}, wrong: {o,dmg}, out: {o,next|fatal,scare} }`. Answers ignore case, spaces and punctuation. Tries reset when the player arrives from another scene.
- Hold: `hold: { prompt, label, secs, grace, lines: [text shown as it fills], ok, fail, late }` — press and hold the button (or Space) for `secs`; letting go early is `fail`, not starting within `grace` seconds is `late`.
- Breathe (rhythm): `breathe: { prompt, label, beats, need, period, drift, holds: [beat indexes], tol, ok, fail }` — tap at the top of each breath; on a held beat, don't tap. Fails as soon as too many beats are missed.
- Sweep (dodge the light): `sweep: { prompt, label, moves, secs, speed, width, cover, goal, ok, fail, late }` — move cover to cover only while the beam is elsewhere; it reverses, speeds up and pauses at random.
- Mash: `mash: { prompt, label, taps, secs, drain, ok, fail }` — tap fast to fill a draining bar before time runs out.
- Emergency alert: `alert: { kind: 'extreme' | 'severe' | 'test' | 'clear', text, head? }` or an array of them — phone-style alert cards drop over the scene picture with the two-tone alert sound and a vibration, one after another; tap to dismiss. Keep the texts short.
- Action nodes take `choices: []` when the action is the whole scene. A countdown `timer` can sit on the same node as a `code` for a timed puzzle.
- Plan puzzles so the answers come from things the player has seen (scene text, the artwork, items). Text should tell a player who missed the clue roughly where to look; the best ending should usually need a puzzle solved.

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
