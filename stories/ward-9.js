/* NIGHTDOOR story: Signal from Ward 9
   A night security shift at Thornleigh General, shut since March 1974, a week before the demolition.
   An original creature: the Night Sister.
   Signature: a ward that breathes (rows of sheeted shapes breathing in perfect unison, and the silence when
   they stop), a torch beam sweeping the beds, a fob watch pinned upside down that ticks faster as she nears,
   gauze taped over every mouth, eyes that never close and shine back in torchlight, cold wet hands taking
   your pulse, an old pager that goes off at 03:03. Being caught means being "admitted": put to bed,
   taped, breathing with the rest.
   Built around timed action: countdowns, hold-your-breath, breathe-in-time, a sweeping torch to dodge,
   tap-to-break-free, a timed breaker code, plus a search, a door picker and a keypad.
   Endings: best, good, two bittersweet, two bad. */
window.NIGHTDOOR = window.NIGHTDOOR || { stories: {} };

(function () {
  /* Bed 14 choices are offered twice: once with her round coming, once after it has passed */
  const bedChoices = () => [
    { t: 'Wake him with the smelling salts', need: 'salts', next: 'dev_wakes',
      o: 'You crack the little brown bottle under the gauze. Ammonia hits the back of your own throat like a slap. For a second nothing. Then Dev’s whole body jerks against the sheet, and his eyes, which have been open all along, suddenly see you.',
      fail: { o: 'You shake his shoulder. You say his name into his ear. Nothing. His chest goes up and down with the others, perfectly in time, and his eyes stay fixed on the ceiling. You have nothing that will wake him. Not from in here.', next: 'bed14_choice' } },
    { t: 'Peel the gauze off his face', next: 'torn', scare: 's_sleeper', dmg: 1,
      o: 'The tape is old and yellow and it doesn’t want to come. It isn’t stuck to his skin. It’s stuck into it, the way a plaster gets stuck in a scab. You pull. The gauze comes away with a wet sound and Dev drags in one enormous, ragged breath of his own, out of time with the ward. Out of time. Every bed on Ward 9 goes silent at once.' },
    { t: 'Leave him. Get out while you can.', next: 'leave',
      o: 'You tell yourself you’ll come back with help. You tell yourself a lot of things, backing away down the side of his bed, and none of them is true, and you know it, and he watches you go without blinking.' }
  ];

  NIGHTDOOR.stories['ward-9'] = {
    id: 'ward-9',
    title: 'Signal from Ward 9',
    tagline: 'The hospital closed in 1974. The night nurse is still doing her rounds.',
    blurb: 'Night security at Thornleigh General, shut since 1974 and coming down on Monday. Your colleague Dev was meant to hand over at ten. His car is still in the car park. At 03:03 an old pager on the desk goes off, and a ward with no power lights up green.',
    cover: 'cover_ward9',
    lives: 3,
    start: 'start',
    frozen: '03:03$',
    death: {
      title: 'Admitted',
      text: 'Too many mistakes. Cold, wet fingers find your wrist and count. Gauze is pressed over your mouth and taped down at the corners, gently, the way you’d tuck in a child. Then you are breathing. In. Out. In time with everyone else. It is 03:03. It is always 03:03 on Ward 9.'
    },

    items: {
      torch:    { name: 'Your torch',         icon: '🔦', desc: 'Heavy, black, rubber-coated. The beam is good. It is also the brightest thing in the building that isn’t hers.' },
      pager:    { name: 'The pager',          icon: '📟', desc: 'A 1970s hospital bleep. Engraved on the back: DR R. PENNANT, HOUSE OFFICER. It has no battery. It still goes off.' },
      logbook:  { name: 'Dev’s logbook',      icon: '📓', desc: 'Dev’s last entries: “Found the old wiring drawings in the hut. Ward 9 lighting = circuit 27, plant room on the top landing. Light is the only thing she doesn’t like.”' },
      flask:    { name: 'Flask of tea',       icon: '☕', desc: 'Strong, sugary, still hot. Tap to drink: restores 1 life.', heal: 1 },
      biscuits: { name: 'Custard creams',     icon: '🍪', desc: 'From the Night Sister’s biscuit tin. Somehow fresh. Tap to eat: restores 1 life.', heal: 1 },
      barley:   { name: 'Barley sugars',      icon: '🍬', desc: 'A tin from the WRVS trolley, still sealed in cellophane from 1974. Tap to eat: restores 1 life.', heal: 1 },
      rules:    { name: 'Rules card',         icon: '🪧', desc: '“WARD 9 · NIGHT RULES. Lights out 3.03 a.m. Patients will remain in bed. Patients will breathe quietly, together. Visitors found on the ward after lights out will be admitted.” Stamped: CLOSED 14.03.74.' },
      diagram:  { name: 'Wiring diagram',     icon: '📐', desc: 'Torn from the office wall. TOP FLOOR LIGHTING. Ward 9 is circled in red pencil: CCT 27.' },
      salts:    { name: 'Smelling salts',     icon: '🧪', desc: 'A brown glass bottle: SAL VOLATILE. To revive the fainted. The seal has never been broken.' },
      dose:     { name: 'The night dose',     icon: '💉', desc: 'A glass syringe, already filled, on a kidney dish. The label is in her handwriting: For Sister. In case.' },
      dev:      { name: 'Dev, awake',         icon: '🧍', desc: 'Your colleague. Shaking, hoarse, leaning on you. He keeps looking back.' },
      police:   { hidden: true },
      lights:   { hidden: true },
      dosed:    { hidden: true },
      seen:     { hidden: true }
    },

    nodes: {

      /* ───────────── ACT I · THE PAGE ───────────── */

      start: {
        act: 'Act I · The Page', title: '03:03', time: 'MON 03:03', mood: 'night', img: 'w9_hut', sfx: 'pager',
        timer: 9, timerLabel: 'It’s screaming',
        timeout: { o: 'You sit frozen while it shrieks. Across the car park, every window on the top floor of the hospital turns green, one after another, left to right, like someone walking down a ward switching on bedside lamps. In the last window, something tall stops and turns its torch towards the hut. You grab your torch and go, because staying feels worse.', gain: 'torch', next: 'car_park' },
        text: 'Portakabin by the gate, Thornleigh General. Your first night shift alone. Dev was meant to hand over at ten; his car is still parked by the old maternity block, and he isn’t answering. Then, at 03:03 exactly, the thing in the lost-property tray goes off. An old hospital pager. It has no battery in it. It is screaming.',
        choices: [
          { t: 'Grab it and silence it', gain: ['torch', 'pager'], next: 'car_park',
            o: 'Your thumb finds the button. The noise stops. The little green screen keeps glowing. WARD 9. BED 14. COME NOW. Then, slowly, as if someone is typing with one finger: DEV.' },
          { t: 'Read Dev’s last log entry', gain: ['torch', 'logbook'], next: 'car_park',
            o: '02:58. Pager again. NOT answering it. 03:01. Found old wiring drawings. Ward 9 lights = circuit 27. Light is the only thing she doesn’t like. 03:03. Top floor lit up. Torch moving. 03:04. its paging ME. The last line goes off the edge of the page.' },
          { t: 'Ring Dev’s mobile', gain: ['torch', 'flask'], next: 'car_park',
            o: 'It rings. Faintly, across the car park, from somewhere high up in the hospital, you hear his ringtone. Someone answers. Breathing. Slow and deep, in, out, and behind it more breathing, dozens of people, all in time. Then a woman’s voice, very close to the phone: “He’s sleeping now. Visiting is over.”' }
        ]
      },

      car_park: {
        act: 'Act I · The Page', title: 'Thornleigh General', time: 'MON 03:06', mood: 'night', img: 'w9_carpark',
        text: 'Seven storeys of black windows, boarded up at the bottom, waiting for the wrecking ball. No power to any of it since 1974. And yet the whole top floor is lit a sick, watery green. As you watch, a torch beam moves along inside, window to window, slow and regular. It stops at each bed. It counts.',
        choices: [
          { t: 'In through the main doors', next: 'foyer',
            o: 'The chain on the main doors has been cut and laid neatly on the step. Dev’s bolt cutters are lying next to it. The door swings in on a smell of dust, damp, and something underneath them both: carbolic soap.' },
          { t: 'Straight up the fire escape', next: 'fire_escape',
            o: 'Seven floors of rusted iron zigzag up the side of the building. It’s the fastest way to the top. It’s also the only way that doesn’t take you through the dark inside.' },
          { t: 'Ring the police first', gain: 'police', next: 'foyer',
            o: '“Thornleigh General? That’s been shut since before I was born.” A pause. Typing. “There’s an old flag on that address. Hold on, love.” A longer pause. “Officers will attend. About forty minutes. Don’t go in.” You look up at the green windows. Forty minutes. You go in.' }
        ]
      },

      fire_escape: {
        act: 'Act I · The Page', title: 'The Fire Escape', time: 'MON 03:09', mood: 'night', img: 'w9_fireescape',
        text: 'Fifth floor. Sixth. The wind is pulling at your coat. Then the step under your foot gives with a crack like a gunshot and drops away into the dark, and you are hanging from the handrail by your fingers, and the rail is bending.',
        mash: {
          prompt: 'Haul yourself up', label: 'Pull', taps: 16, secs: 5,
          ok: { o: 'You get an elbow over the rail, then a knee, and roll onto the landing, sobbing for breath. Somewhere far below, the step hits the car park. The window in front of you is open. It leads straight onto the top-floor landing.', next: 'landing' },
          fail: { o: 'The rail folds. You drop a whole storey and hit the landing below hard enough to knock the air out of you. When you can stand again, you limp back down and go in through the front, like you should have done.', dmg: 1, next: 'foyer' }
        },
        choices: []
      },

      foyer: {
        act: 'Act I · The Page', title: 'Reception', time: 'MON 03:11', mood: 'night', img: 'w9_foyer', sfx: 'trolley',
        timer: 25, timerLabel: 'Lift coming down',
        timeout: { o: 'Ding. The lift doors open on their own. You hadn’t pressed anything.', next: 'lift_open' },
        text: 'Your torch shows you a reception frozen in 1974: orange plastic chairs, a tea trolley, a noticeboard. Above the lift, the old dial indicator, which cannot possibly have power, is moving. 7. 6. 5. Something is coming down to meet you. Somewhere above, a single trolley wheel squeaks.',
        search: {
          prompt: 'Quickly, before it arrives: tap the picture or pick a spot',
          spots: [
            { t: 'Noticeboard', x: 40, y: 90, w: 150, h: 120, o: 'Curled notices. Flu jabs, a staff dance, and one typed on hospital paper: “By order of the Board, WARD 9 is closed with effect from 14th March 1974, following the events of the night of 13th–14th.” Someone has written underneath in biro: SHE’S STILL UP THERE.' },
            { t: 'Tea trolley', x: 230, y: 220, w: 140, h: 100, gain: 'barley', o: 'Cups still upside down on their saucers. On the bottom shelf, a tin of barley sugars, still sealed in its cellophane. You take it. Your hands need something to do.' },
            { t: 'Wheelchair', x: 560, y: 230, w: 110, h: 110, o: 'An old wheelchair, facing the wall. As your torch touches it, it rolls an inch towards you. Just the floor sloping, you tell yourself. The seat is damp.', again: 'You don’t go near it again.' },
            { t: 'Lift indicator', x: 410, y: 40, w: 110, h: 70, o: 'The needle stops at 3. It stays there for a long moment, as if someone is getting in. Then it carries on down. 2.' }
          ]
        },
        choices: [
          { t: 'Take the stairs. Now.', next: 'stairs',
            o: 'You’re through the stairwell door before the lift arrives. Behind you, faintly, a ding. Then the squeak of a trolley being pushed out across reception. Then nothing.' },
          { t: 'Get in the lift when it comes', next: 'lift',
            o: 'Ding. The doors open on an empty steel box with a single fluorescent tube, flickering. It smells of carbolic. You step in and press 7 before you can change your mind.' },
          { t: 'Hide behind the desk and watch it open', next: 'lift_open',
            o: 'You crouch behind reception with your torch off and your heart going like a hammer. The needle reaches G. Ding.' }
        ]
      },

      lift: {
        act: 'Act I · The Page', title: 'Going Up', time: 'MON 03:13', mood: 'under', img: 'w9_lift', sfx: 'watch',
        timer: 6, timerLabel: 'Doors open',
        timeout: { o: 'You do nothing. The doors stay open on the dark for a long time. Then something cold and wet, like a hand just out of a basin, closes round your ankle, gently, and tugs. You kick and kick and the doors finally slide shut on it, and the lift drops to the top floor.', dmg: 1, scare: 's_hand', next: 'landing' },
        text: 'The lift goes up past 5, past 6, past 7. It stops at a floor marked 8. Thornleigh has seven floors. The doors open on total darkness and a sound like the sea: breathing, a great many people, all in time. And very close, just out of your torchlight, a watch ticking.',
        choices: [
          { t: 'Hammer the close button', next: 'landing',
            o: 'The doors grind shut, so slowly, and through the last inch of gap you see the torchlight catch two eyes, close, at the height of the top of the doors, that shine back green like a cat’s. The lift drops. When it opens again, it’s on 7, and you fall out onto the landing.' },
          { t: 'Shine your torch out into it', next: 'landing', scare: 's_torch', dmg: 1,
            o: 'Your beam finds beds. Rows of them, going on further than any room could, and in every bed a shape under a sheet, and every sheet rising and falling together. Then a second torch beam swings round and finds you, and the doors slam shut on their own, and the lift drops like a stone to 7.' },
          { t: 'Step out', fatal: true, next: 'start',
            o: 'You step out into the dark and the doors close behind you. A torch clicks on in your face. Cold fingers take your wrist and count your pulse, and you find that you are lying down, and the sheet is being drawn up, and you are breathing, in, out, in time. There was never a floor 8. There is now.' }
        ]
      },

      lift_open: {
        act: 'Act I · The Page', title: 'Ground Floor', time: 'MON 03:13', mood: 'night', img: 'w9_trolley', sfx: 'ward',
        text: 'The lift doors open on a hospital trolley. On the trolley, under a sheet, a shape. The sheet is going up and down. Slowly. Calmly. As if whoever is under it is fast asleep. Nobody pushed it here.',
        choices: [
          { t: 'Lift the corner of the sheet', gain: 'seen', scare: 's_sleeper', dmg: 1, next: 'stairs',
            o: 'An old man in a hospital gown. A square of yellow gauze is taped over his nose and mouth, and it sucks in and puffs out with every breath. His eyes are open. They have no lids, or the lids are gone. They roll slowly round to look at you. On his wrist band, in neat blue ink: 03:03. You run for the stairs.' },
          { t: 'Back away to the stairs', next: 'stairs',
            o: 'You back towards the stairwell door without taking your torch off it. The breathing never changes. As the stairwell door swings shut, you hear the lift doors close, and the indicator needle start to climb.' },
          { t: 'Check its wrist band', next: 'stairs',
            o: 'A grey arm lies outside the sheet. The wrist band says: WARD 9. ADMITTED 03:03. It’s cold, the cold of things kept in a fridge. As you let go, the fingers curl, slowly, round nothing. You go for the stairs, fast.' }
        ]
      },

      stairs: {
        act: 'Act I · The Page', title: 'The Stairwell', time: 'MON 03:16', mood: 'night', img: 'w9_stairs', sfx: 'watch',
        timer: 6, timerLabel: 'Someone’s coming',
        timeout: { o: 'You stand there in your own torchlight like an idiot. A beam comes round the turn of the stairs above and stops on your feet. Then slowly climbs up your body. You snap your torch off and flatten yourself into the corner.', dmg: 1, next: 'stairs_hold' },
        text: 'On the fifth-floor landing, the stairs up are blocked by old bed frames, jammed together into a barricade. Somebody built it in a hurry, from this side. On the wall, chalked big: DON’T LET HER COUNT YOU. There’s a gap underneath. And above, coming down, a watch ticking.',
        choices: [
          { t: 'Torch off. Into the corner.', next: 'stairs_hold',
            o: 'Dark. Total. You press your back into the angle of the wall so hard the plaster crumbles.' },
          { t: 'Squeeze under the barricade', next: 'stairs_hold',
            o: 'You get your head and shoulders through the gap between the bed springs. Then your coat snags. You’re stuck halfway, torch off, face down on the stairs, and the ticking is right above you.' },
          { t: 'Back down a flight and crouch', next: 'stairs_hold',
            o: 'You get halfway down the flight and crouch in the dark. Above you, through the bed frames, a torch beam spills down the steps, sweeping left, right, left.' }
        ]
      },

      stairs_hold: {
        act: 'Act I · The Page', title: 'Don’t Breathe', time: 'MON 03:17', mood: 'under', img: 'w9_stairs_dark', sfx: 'watchFast',
        text: 'She is on the other side of the bed frames. You can hear her uniform: starched cotton, rustling. You can hear the watch. And you can hear her listening, which is a sound you didn’t know existed. Whatever you do, don’t let her hear you breathe.',
        hold: {
          prompt: 'Hold your breath until she goes', label: 'Hold your breath', secs: 7, grace: 3,
          lines: ['The ticking stops above you.', 'A sniff. Long. Slow.', 'Something drips onto the back of your hand. Cold.', 'Her torch moves away.', 'Footsteps going back up.'],
          ok: { o: 'The footsteps climb away. A door sighs shut, high above. You let your breath out in pieces. On the back of your hand, the drip smells of carbolic soap. You climb.', next: 'landing' },
          fail: { o: 'Your lungs give out and you gasp, loud as a scream. A torch slams into your face through the bed frames and a long grey hand comes after it, fingers spread, reaching for your wrist. It touches. It’s wet. You tear free and go up the far side of the barricade on your hands and knees.', dmg: 1, scare: 's_hand', next: 'landing' },
          late: { o: 'You don’t stop breathing in time. Short, frightened breaths, loud in the stairwell. The ticking speeds up. A torch beam drops through the bed frames onto you, and a hand comes through after it. You throw yourself away from it and scramble upwards.', dmg: 1, scare: 's_hand', next: 'landing' }
        },
        choices: []
      },

      /* ───────────── ACT II · LIGHTS OUT ───────────── */

      landing: {
        act: 'Act II · Lights Out', title: 'Seventh Floor', time: 'MON 03:21', mood: 'under', img: 'w9_landing', sfx: 'ward',
        doors: true,
        text: 'The top landing is lit green from under the doors of Ward 9. Through them, the breathing: dozens of people, in, out, all together, like one enormous sleeper. Three doors. Every so often the breathing stops, all at once, for the length of a held breath. Then starts again. You don’t want to be out here when it stops for good.',
        choices: [
          { t: 'Sister’s office', next: 'office', door: { c: '#2c3a5a', sign: 'SISTER', glass: '#1a2a20' },
            o: 'The door has a frosted panel and a name card: SISTER A. MALLORY. NIGHT SISTER. Please knock. You don’t knock.' },
          { t: 'Ward 9', next: 'ward_door', door: { c: '#4a6a5a', sign: 'WARD 9', double: true, glass: '#7affb0', light: '#7affb0' },
            o: 'You put your hand flat on the door. It’s warm. It moves, very slightly, under your palm, in and out. In time.' },
          { t: 'Plant room', next: 'landing', door: { c: '#5a5a5a', sign: 'PLANT ROOM', steel: true, signC: '#e8c840' },
            o: 'Locked, and heavy. Through the wired glass you can see a grey board of breakers, forty of them, and a fire axe on brackets. A notice: KEY HELD BY NIGHT SISTER. You’ll have to come back. If you come back.' }
        ]
      },

      office: {
        act: 'Act II · Lights Out', title: 'Sister’s Office', time: 'MON 03:24', mood: 'night', img: 'w9_office', sfx: 'watch',
        text: 'A tidy little room that smells of polish and carbolic. A desk, a hard chair, a locked drugs cupboard on the wall. A navy cape on the coat stand. A framed photograph. And on the desk, the night report book, open, the ink on the last line still wet.',
        search: {
          prompt: 'Search her office: tap the picture or pick a spot',
          spots: [
            { t: 'Desk drawer', x: 300, y: 250, w: 140, h: 60, gain: 'rules', o: 'Pencils lined up, a box of new gauze squares, a roll of yellow tape. And a card, like the ones they hang on ward doors: WARD 9 NIGHT RULES. Across the bottom, a rubber stamp: CLOSED 14.03.74.' },
            { t: 'Wall chart', x: 560, y: 60, w: 150, h: 110, gain: 'diagram', o: 'Not a chart. A wiring drawing for the top floor, pinned up like a map of enemy territory. Ward 9 is circled in red pencil, hard enough to tear the paper: CCT 27. You tear it off the wall.' },
            { t: 'Photograph', x: 90, y: 70, w: 110, h: 110, o: 'Ward 9 staff, Christmas 1973. Nurses with tinsel round their caps. At the back, a head taller than anyone, a Sister in navy, unsmiling, a square of white over her mouth even in the photo. Her eyes have caught the flash and come out pale green, like a cat’s.' },
            { t: 'Biscuit tin', x: 440, y: 205, w: 90, h: 45, gain: 'biscuits', o: 'A Peek Freans tin of custard creams, the lid stiff. Inside, a fresh packet, crinkly, impossible. Next to the tin, a cup of tea, still steaming, and on the rim, not a lipstick mark, but the faint woven print of gauze. You take the biscuits. You don’t touch the tea.' },
            { t: 'The cape', x: 700, y: 120, w: 90, h: 200, scare: 's_face', o: 'You lift the cape off its hook. It’s heavy, and damp all down the inside, and warm, as if it’s only just been taken off. Under it on the hook there’s nothing. You put it back with your hands shaking. When you look again, it’s hanging the other way round.' }
          ]
        },
        choices: [
          { t: 'Try the drugs cupboard', next: 'cabinet',
            o: 'A grey steel cupboard with a red cross and a four-dial combination lock. A typed label: COMBINATION: THE NIGHT WE CLOSED (DAY, MONTH).' },
          { t: 'Read the night report book', next: 'nightbook',
            o: 'You turn the book round to face you. The handwriting is beautiful, upright, pressed hard into the paper.' },
          { t: 'Back out to the landing', next: 'landing',
            o: 'You slip back out. The breathing through the ward doors is a little faster now. Or you are.' }
        ]
      },

      nightbook: {
        act: 'Act II · Lights Out', title: 'Night Report', time: 'MON 03:26', mood: 'night', img: 'w9_book',
        text: '“13th/14th March 1974. 23 patients. All settled. All breathing well, together. Night dose given 03:03. Dr Pennant bleeped six times, did not attend.” The next entry is the same. And the next. Fifty years of nights, the same line. Then tonight’s date: “24 patients. 1 admitted, Bed 14, security, male. Bleeped security. Awaiting.”',
        timer: 8, timerLabel: 'The breathing stops',
        timeout: { o: 'The breathing through the wall stops. Dead silence. In it, behind you, very close, the office door handle creaks. You throw yourself behind the desk. When the breathing starts again, the door is open an inch, and a smell of carbolic is in the room, and the cape on the stand is swinging.', dmg: 1, scare: 's_torch', next: 'office' },
        choices: [
          { t: 'Turn back a page', next: 'office',
            o: 'Under yesterday’s entry, in the same perfect hand: “Bed 25 prepared.” You don’t want to think about who that’s for. You think about it anyway.' },
          { t: 'Rip tonight’s page out', next: 'office',
            o: 'It tears with a sound that’s much too loud. Through the wall, every patient on Ward 9 breathes in at once, sharp, like a gasp. Then out. Then carries on. The ink on the next page is already drying: “Bed 14. Awaiting.”' },
          { t: 'Close the book. Don’t read any more.', next: 'office',
            o: 'You close it. It doesn’t help. You know now what Bed 14 is, and who’s in it.' }
        ]
      },

      cabinet: {
        act: 'Act II · Lights Out', title: 'The Drugs Cupboard', time: 'MON 03:27', mood: 'night', img: 'w9_cabinet',
        text: 'Four brass dials, and the typed label: COMBINATION: THE NIGHT WE CLOSED (DAY, MONTH). Every click of the dials is loud. Every wrong one, the breathing next door stops to listen. If you’ve seen the date, it was on a notice in reception, and on the ward’s rules card.',
        code: {
          answer: '1403', len: 4, tries: 3, prompt: 'Day and month: four digits',
          clue: { need: 'rules', t: 'Your rules card: WARD 9 NIGHT RULES. Stamped across the bottom: CLOSED 14.03.74.' },
          ok: { o: 'The door swings open. Shelves of brown bottles and glass syringes, all from 1974. You take a bottle marked SAL VOLATILE: smelling salts, to wake the fainted. And on a kidney dish on its own, a syringe already filled, labelled in her handwriting: For Sister. In case.', gain: ['salts', 'dose'], next: 'office' },
          wrong: { o: 'Clack. The breathing next door stops. Ten seconds of silence. Then starts again.' },
          out: { o: 'The last wrong clack. The breathing stops, and this time it doesn’t start again. The ticking does, out on the landing, coming closer. You leave the cupboard, leave the office and press yourself flat beside the ward doors as her torch beam sweeps past the end of the landing.', dmg: 1, scare: 's_torch', next: 'landing' }
        },
        choices: [
          { t: 'Leave it. Back to the office.', next: 'office',
            o: 'You step back from the cupboard. It’s probably for the best. You don’t know what she keeps in there.' }
        ]
      },

      ward_door: {
        act: 'Act II · Lights Out', title: 'Ward 9', time: 'MON 03:30', mood: 'under', img: 'w9_ward_door', sfx: 'ward',
        text: 'You ease one door open a crack. A long Nightingale ward: twelve beds down each side, every one with a shape in it under a white sheet, every sheet rising and falling together. Bed 14 is near the far end. At the near end, her back to you, very tall, in a navy cape and a starched white cap: the Night Sister, with her torch, going bed to bed.',
        choices: [
          { t: 'Crawl down the aisle between her sweeps', next: 'ward_cross',
            o: 'You drop to your hands and knees on the cold lino and slip through the gap in the doors. The beds give you cover. The space between them doesn’t.' },
          { t: 'Get into an empty bed and breathe like them', next: 'ward_breathe',
            o: 'Bed 2, by the door, is empty, the sheet turned down neatly as if it’s been waiting. You slide in and pull the sheet up to your chin. It’s damp. Her torch is turning back up the ward, towards you.' },
          { t: 'Back to the landing', next: 'landing',
            o: 'You let the door close. Your hands are shaking so badly you have to hold them together. The breathing goes on and on.' }
        ]
      },

      ward_cross: {
        act: 'Act II · Lights Out', title: 'The Aisle', time: 'MON 03:32', mood: 'under', img: 'w9_ward', sfx: 'watch',
        text: 'Bed to bed, on your belly, in the gaps between the lockers. Her torch beam swings down the ward and back again, never quite the same rhythm twice. Wherever it lands, it lingers. Sometimes it stops altogether, and the ward stops breathing, and she listens.',
        sweep: {
          prompt: 'Cross to Bed 14 without being caught in her torch', label: 'Crawl', moves: 5, secs: 45, cover: 'BED', goal: '14',
          ok: { o: 'You roll under the end of Bed 14 and lie there with your cheek on the lino, shaking. Her torch moves away up the ward. Above you, the bed springs creak in time with the breathing.', next: 'bed14' },
          fail: { o: 'Halfway across the gap, the light swings back. It lands on you and stays there. You can’t see anything behind it. Then the torch tilts and you see her face above it, close, coming down, and her hand comes out of the light for your wrist.', dmg: 1, scare: 's_torch', next: 'grabbed' },
          late: { o: 'You wait too long. The breathing stops. In the silence, the ticking of her watch is right beside you, and a cold wet hand comes down on the back of your neck.', dmg: 1, scare: 's_hand', next: 'grabbed' }
        },
        choices: []
      },

      ward_breathe: {
        act: 'Act II · Lights Out', title: 'Bed 2', time: 'MON 03:32', mood: 'under', img: 'w9_inbed', sfx: 'watch',
        text: 'Lie still. Eyes open, like theirs. Breathe like they breathe: in, out, slow and deep, all together. She’s coming up the ward, bed by bed, taking pulses. When they hold their breath, hold yours. One breath out of time and she’ll know there’s a visitor on her ward.',
        breathe: {
          prompt: 'Breathe with the ward', label: 'Breathe', beats: 9, need: 7, period: 2.3, drift: .35, holds: [3, 6], tol: .2,
          ok: { o: 'Her torch is in your eyes. Fingers, cold and wet, take your wrist and count. Her face is above you, behind the light, and the gauze over her mouth puffs in and out with yours. She lets go. She moves on to Bed 3. When the torch is at the far end, you slide out and crawl to Bed 14.', next: 'bed14' },
          fail: { o: 'You breathe in when the whole ward has stopped. In the silence, it’s like a shout. Every head on Ward 9 turns on its pillow to look at you. Her torch comes down on your face and stays there.', dmg: 1, scare: 's_face', next: 'grabbed' }
        },
        choices: []
      },

      grabbed: {
        act: 'Act II · Lights Out', title: 'Visiting Is Over', time: 'MON 03:34', mood: 'blood', img: 'w9_grabbed', sfx: 'watchFast',
        text: 'She has your wrist. Her fingers go all the way round it, twice. She is counting your pulse under her breath, and with her other hand she is taking a square of gauze from her apron pocket, and a strip of yellow tape. Pull. PULL.',
        mash: {
          prompt: 'Tear your arm free', label: 'Pull free', taps: 20, secs: 5,
          ok: { o: 'Your arm tears out of her grip, skin burning where her fingers were. You throw yourself under the nearest bed and crawl, bed to bed, while her torch hunts back and forth above you. You come out at the far end, beside Bed 14.', dmg: 1, next: 'bed14' },
          fail: { o: 'Her grip doesn’t loosen. It doesn’t even notice you pulling.', next: 'end_admitted' }
        },
        choices: []
      },

      bed14: {
        act: 'Act II · Lights Out', title: 'Bed 14', time: 'MON 03:36', mood: 'under', img: 'w9_bed14', sfx: 'ward',
        timer: 12, timerLabel: 'Her round',
        timeout: { o: 'Her torch turns at the top of the ward and starts back down towards Bed 14, bed by bed. You have nowhere to go. You slide into the empty bed beside Dev, Bed 15, and pull the damp sheet up, and try to breathe like they do.', next: 'pulse' },
        text: 'It’s Dev. Flat on his back in his security fleece under the sheet. A square of yellowed gauze taped over his nose and mouth, puffing in and out in time with all the others. His eyes are open, wet, staring at the ceiling. A wrist band: ADMITTED 03:03. His fingers twitch when you say his name.',
        choices: bedChoices()
      },

      bed14_choice: {
        act: 'Act II · Lights Out', title: 'Bed 14', time: 'MON 03:39', mood: 'under', img: 'w9_bed14', sfx: 'ward',
        text: 'Her torch is at the far end of the ward. Dev lies there breathing with the others, eyes open, tears running sideways into his ears. You don’t have long. You never have long, here.',
        choices: bedChoices()
      },

      pulse: {
        act: 'Act II · Lights Out', title: 'Bed 15', time: 'MON 03:38', mood: 'under', img: 'w9_inbed', sfx: 'watch',
        text: 'Sheet to your chin. Eyes open. Beside you, Dev’s breathing. All round you, everyone’s breathing, and you have to breathe with them. The torch comes down the ward, bed by bed, and the watch ticks faster and faster as she comes. When they stop, you stop.',
        breathe: {
          prompt: 'Breathe with the ward', label: 'Breathe', beats: 10, need: 8, period: 2.1, drift: .45, holds: [2, 5, 8], tol: .19,
          ok: { o: 'Fingers on your wrist. Counting. Her face over you, the gauze over her mouth sucking deep into a hollow where a mouth should be, much deeper than a mouth. Then she lets you go, tucks your sheet in tighter, and moves on. Her torch dwindles up the ward.', next: 'bed14_choice' },
          fail: { o: 'You gasp. One breath, out of time. The ward goes silent, and every sheet stops moving, and her torch comes down onto your face like a hand.', dmg: 1, scare: 's_face', next: 'grabbed' }
        },
        choices: []
      },

      dev_wakes: {
        act: 'Act II · Lights Out', title: 'Dev', time: 'MON 03:40', mood: 'blood', img: 'w9_devwake',
        timer: 5, timerLabel: 'He’s going to scream',
        timeout: { o: 'Dev tears the gauze off his own face and screams. A raw, animal scream, fifty years of not screaming. Every patient on Ward 9 stops breathing at once.', gain: 'dev', next: 'sit_up' },
        text: 'Dev’s eyes find yours. He knows you. He doesn’t know where he is. His hands come up to his face and find the gauze and the tape, and you watch the understanding arrive in his eyes, and his chest heave, and his mouth open under the gauze to scream.',
        choices: [
          { t: 'Hand over his mouth', gain: 'dev', next: 'aisle_back',
            o: 'You clamp your hand over the gauze. He bucks under you, then goes still, staring at you, nodding, nodding. You peel the tape back for him, gently. Under it his lips are white and wrinkled, like he’s been in the bath too long. “She’s doing her round,” he whispers. “Don’t let her see you’re awake.”' },
          { t: 'Whisper: “Breathe with them. Like them.”', gain: 'dev', next: 'aisle_back',
            o: 'He hears you. He breathes, in, out, with the ward, and the scream goes back down inside him. Tears run into his ears. When the torch is at the far end, you ease the tape off, and help him roll out of bed onto the floor beside you.' },
          { t: 'Pull him straight out of bed', gain: 'dev', dmg: 1, next: 'sit_up',
            o: 'You drag him out by his fleece. He comes out of the bed with a howl, all elbows and legs, and the sheet goes with him, and the bed frame clangs against the next one. The breathing stops.' }
        ]
      },

      torn: {
        act: 'Act II · Lights Out', title: 'Out of Time', time: 'MON 03:40', mood: 'blood', img: 'w9_devwake',
        text: 'Dev is sobbing for breath, his own breath, out of time, and in the silence it is the loudest sound in the world. A bead of blood is welling on his top lip where the tape came off. He grabs your sleeve. “She’ll come,” he says. “She always comes when someone stops.”',
        choices: [
          { t: 'Get him on his feet', gain: 'dev', next: 'sit_up',
            o: 'He’s weak as a kitten. You get his arm round your shoulders and haul. His legs work, just.' },
          { t: 'Tell him to breathe with them', gain: 'dev', next: 'sit_up',
            o: 'He tries. He can’t. His body has forgotten how to fit back into the rhythm. All round you, in the silence, sheets are starting to move. Not breathing. Moving.' },
          { t: 'Look for her torch', gain: 'dev', scare: 's_torch', next: 'sit_up',
            o: 'It’s pointing straight at you, from the end of the ward. Not moving. Then the watch starts ticking, fast, and the light starts coming.' }
        ]
      },

      sit_up: {
        act: 'Act III · The Round', title: 'They Sit Up', time: 'MON 03:41', mood: 'blood', img: 'w9_sitting', sfx: 'watchFast', scare: 's_sleeper',
        timer: 6, timerLabel: 'RUN',
        timeout: { o: 'You stand frozen while twenty-two sheets slide off twenty-two grey faces and twenty-two pairs of lidless eyes turn towards you. Then her hand is on your shoulder.', dmg: 1, scare: 's_hand', next: 'grabbed2' },
        text: 'All down both sides of Ward 9, the patients sit up. All together, the same speed, the sheets sliding off them. Gauze over every mouth. Eyes like boiled eggs, lidless, turning to find you. They don’t get out of bed. They don’t need to. They point. Every arm on the ward, pointing at you, for her.',
        choices: [
          { t: 'Run for the doors', next: 'run',
            o: 'You run, dragging Dev, down the middle of the ward between two rows of pointing arms. Grey fingers brush your sleeves. Her torch swings after you. You hit the doors with your shoulder and you’re out on the landing.' },
          { t: 'Through the side door by the sluice', next: 'run',
            o: 'There’s a side door by Bed 14. You kick it open onto a back corridor. Behind you, the ward starts breathing again, all together, fast and hungry.' },
          { t: 'Throw your torch at her', lose: 'torch', next: 'run',
            o: 'It spins down the ward and hits her square in the chest, and she doesn’t even rock. But her torch beam jerks away for a second, and in that second you’re through the doors. You’ve no torch now. You have her light, behind you, to see by.' }
        ]
      },

      aisle_back: {
        act: 'Act III · The Round', title: 'The Long Way Back', time: 'MON 03:42', mood: 'under', img: 'w9_ward', sfx: 'watch',
        text: 'Dev can’t walk properly. You crawl together down the aisle, his arm over your back, slow, so slow. Her torch is between you and the doors, sweeping, pausing, listening. Two of you moving is twice as much noise, and twice as much to see.',
        sweep: {
          prompt: 'Get Dev back to the doors without being caught', label: 'Crawl', moves: 6, secs: 55, speed: .3, width: .12, cover: 'BED', goal: 'DOORS',
          ok: { o: 'You fall out through the doors onto the landing, the two of you in a heap. Behind you on the ward, the breathing goes on, calm and slow. She hasn’t noticed. Yet.', next: 'run' },
          fail: { o: 'Dev’s knee knocks a bed leg. Clang. The torch swings down and pins you both, and the ticking is suddenly fast, and coming. You haul Dev up and run.', dmg: 1, scare: 's_torch', next: 'grabbed2' },
          late: { o: 'You’re too slow. The ward’s breathing stops. In the silence, her torch turns round and comes straight down the aisle at you.', dmg: 1, scare: 's_torch', next: 'grabbed2' }
        },
        choices: []
      },

      leave: {
        act: 'Act III · The Round', title: 'Alone', time: 'MON 03:42', mood: 'under', img: 'w9_ward', sfx: 'watch',
        text: 'You crawl back the way you came, alone. It’s easier alone. You hate how much easier it is. Her torch sweeps the aisle behind you, pausing, listening, and every time it stops, so does your heart.',
        sweep: {
          prompt: 'Back to the doors without being caught', label: 'Crawl', moves: 4, secs: 40, cover: 'BED', goal: 'DOORS',
          ok: { o: 'You slither out through the doors onto the landing. Behind you, through the gap, Bed 14 is breathing with the others, in, out. You don’t look back. Then you do.', next: 'run' },
          fail: { o: 'The torch catches you between beds. It holds you, and the ticking quickens, and you run for the doors on your hands and feet like an animal.', dmg: 1, scare: 's_torch', next: 'grabbed2' },
          late: { o: 'The breathing stops. Her torch turns, slowly, and comes down the ward towards where you are lying.', dmg: 1, scare: 's_torch', next: 'grabbed2' }
        },
        choices: []
      },

      grabbed2: {
        act: 'Act III · The Round', title: 'Her Hand', time: 'MON 03:44', mood: 'blood', img: 'w9_grabbed', sfx: 'watchFast',
        text: 'Long grey fingers close round your arm from behind. They’re wet. She’s turning you round to face her, gently, the way nurses do, and you can hear the tape coming off the roll. Tear free. Now.',
        mash: {
          prompt: 'Tear free', label: 'Pull free', taps: 22, secs: 5,
          ok: { o: 'You rip free and stumble. There are four long red marks round your arm, already bruising, and they’re cold, and they stay cold.', dmg: 1, next: 'run' },
          fail: { o: 'She doesn’t even notice you pulling.', next: 'end_admitted' }
        },
        choices: []
      },

      run: {
        act: 'Act III · The Round', title: 'The Landing', time: 'MON 03:45', mood: 'blood', img: 'w9_corridor', sfx: 'watchFast',
        doors: true, timer: 10, timerLabel: 'She’s coming',
        timeout: { o: 'You dither on the landing too long. The ward doors swing open behind you and the torch comes through first.', dmg: 1, scare: 's_torch', next: 'grabbed2' },
        text: 'Ward 9’s doors are swinging. Her torch is coming down the ward towards them. The stairs are past the ward doors: you’d never make it. The plant room door is hanging open now, as if she left it that way. The linen cupboard. The sluice room. Choose.',
        choices: [
          { t: 'Plant room', next: 'fuse', door: { c: '#5a5a5a', sign: 'PLANT ROOM', steel: true, signC: '#e8c840', light: '#e8c840' },
            o: 'The heavy door is open a hand’s width. You squeeze through. Forty breakers in rows on a grey board, all off. Circuit 27. If you only knew which was 27. The labels have rotted off.' },
          { t: 'Linen cupboard', next: 'linen_hold', door: { c: '#8a8070', sign: 'LINEN' },
            o: 'Shelves of sheets, folded hospital-tight, and a gap at the bottom just big enough. You pull the door to behind you and curl up in the dark that smells of starch.' },
          { t: 'Sluice room', next: 'run', dmg: 1, door: { c: '#6a7a70', sign: 'SLUICE', mark: '#3a0a0a' },
            o: 'Steel sinks, bedpans, a drain in the floor that gurgles as you come in, like something swallowing. No other way out. You back out, and the ward doors are already opening.' }
        ]
      },

      fuse: {
        act: 'Act III · The Round', title: 'Circuit 27', time: 'MON 03:46', mood: 'blood', img: 'w9_fuse', sfx: 'watchFast',
        timer: 18, timerLabel: 'She’s at the door',
        timeout: { o: 'Too slow. Her torch fills the doorway. You duck under her arm, out, past her, and her fingers rake down your back like a comb.', dmg: 1, scare: 's_hand', next: 'finale' },
        text: 'Forty breakers, all off, the numbers rotted away, but there’s a dial on the board: CIRCUIT SELECT, two digits. Ward 9 is on its own circuit. If you saw the number written down tonight, now is the time to remember it. Her ticking is in the corridor.',
        code: {
          answer: '27', len: 2, tries: 2, prompt: 'Circuit number',
          clue: { need: 'diagram', t: 'The wiring drawing from her office: Ward 9 circled in red pencil. CCT 27.' },
          ok: { o: 'You slam the big lever down. A sound goes through the whole top floor like a gasp. Then light. Hard, white, fizzing fluorescent light, every tube on Ward 9 at once, for the first time since 1974. Through the walls, the breathing stops. And then, from the ward, a woman’s voice, high and furious: “WHO TURNED ON MY LIGHTS?”', gain: 'lights', next: 'finale' },
          wrong: { o: 'Wrong circuit. A bang in the ceiling and a smell of burning dust.', dmg: 1 },
          out: { o: 'The second wrong breaker blows with a flash that leaves you blind. When you can see again, her torch is in the doorway. You go under her arm, out onto the landing.', dmg: 1, scare: 's_torch', next: 'finale' }
        },
        choices: []
      },

      linen_hold: {
        act: 'Act III · The Round', title: 'Linen Cupboard', time: 'MON 03:46', mood: 'under', img: 'w9_linen', sfx: 'watchFast',
        text: 'Darkness, and the smell of starch. Under the door, a stripe of green light. The stripe darkens: feet. Two long, narrow shoes in black, stopped right outside. The ticking. She’s listening at the door.',
        hold: {
          prompt: 'Hold your breath. Don’t move.', label: 'Hold your breath', secs: 9, grace: 2.5,
          lines: ['The door handle turns a little.', 'Stops.', 'Something slides under the door. Her fingers. Feeling.', 'They touch your shoe.', 'They withdraw.', 'Her feet move away.'],
          ok: { o: 'The stripe of light under the door comes back. You count to a hundred. When you crawl out, the landing is empty and the ward doors are still. The stairs. Now. You run for them.', next: 'finale' },
          fail: { o: 'You breathe. Just once. The fingers under the door stop dead. Then the door is wrenched open and the torch is in your face.', dmg: 1, scare: 's_face', next: 'grabbed2' },
          late: { o: 'You can’t get your breath to stop. The door opens.', dmg: 1, scare: 's_face', next: 'grabbed2' }
        },
        choices: []
      },

      finale: { route: [ { need: 'lights', next: 'finale_lit' }, { next: 'finale_dark' } ] },

      finale_lit: {
        act: 'Act III · The Round', title: 'In the Light', time: 'MON 03:48', mood: 'blood', img: 'w9_finale_lit', scare: 's_face',
        timer: 9, timerLabel: 'She’s blind. For now.',
        timeout: { o: 'You wait too long. Her eyes adjust. She turns her head, slowly, and finds you.', dmg: 1, scare: 's_face', next: 'grabbed2' },
        text: 'She is between you and the stairs, in the full white glare. In the light she looks wrong: too tall, too thin, the cape threadbare, her skin the grey of a fish. The gauze over her mouth sucks in and in, into a hollow far too deep. Her lidless eyes are streaming, squinting, blind. Behind her, on the ward, nobody is breathing any more.',
        choices: [
          { t: 'Give her the night dose', need: 'dose', gain: 'dosed', next: 'escape',
            o: 'You walk right up to her. She can hear you; she can’t see you. Her hand comes out, palm up, the way it would for a patient’s wrist, and you put the needle into the back of it and press. Her own dose. For Sister. In case. She sways. She says, quite softly, “Lights out,” and folds down onto the lino like a dropped cape, and her watch stops.',
            fail: { o: 'You have nothing to give her. You edge along the wall instead, an inch at a time, and her blind hand sweeps out and grazes your face, cold and wet, before you’re past her.', dmg: 1, next: 'escape' } },
          { t: 'Edge past her along the wall', next: 'escape',
            o: 'Inch by inch, your back against the wall. Her head turns as you pass, following the sound. Her nostrils open. You are near enough to smell her: carbolic and something underneath. Then you’re past, and on the stairs, and running.' },
          { t: 'Shine your torch into her eyes', need: 'torch', next: 'escape', dmg: 1,
            o: 'Your beam hits her lidless eyes and she makes a sound you will hear for the rest of your life, a thin, high whistle through the gauze. She lashes out blind and catches your arm. You tear free and you’re on the stairs.',
            fail: { o: 'You have no torch. You just run at her, and past her, and her arm catches you across the chest like a bar, but you’re through.', dmg: 1, next: 'escape' } }
        ]
      },

      finale_dark: {
        act: 'Act III · The Round', title: 'The Top of the Stairs', time: 'MON 03:48', mood: 'blood', img: 'w9_finale_dark', scare: 's_face',
        timer: 6, timerLabel: 'She’s coming',
        timeout: { o: 'You don’t move. Neither does she. Then she does, much faster than anything that tall should move.', dmg: 1, scare: 's_hand', next: 'grabbed2' },
        text: 'She is standing at the top of the stairs, in the green dark, between you and the way out. Her torch is pointed at your chest. Behind it, two green coins of eyeshine, at the height of the door frame. The watch on her chest is ticking so fast it’s one long buzz. She holds out her hand, palm up. For your wrist.',
        choices: [
          { t: 'Give her the night dose', need: 'dose', gain: 'dosed', next: 'escape',
            o: 'You put your wrist in her hand, and as her fingers close round it, you drive the needle into the back of hers with the other. Her own dose. She looks at it. She looks at you. “Lights out,” she says, and folds down onto the stairs like a dropped cape, and her torch rolls away, and her watch stops.',
            fail: { o: 'You have nothing. You duck under her arm and her fingers close on your collar and you tear out of your coat and leave it in her hand and run.', dmg: 1, next: 'escape' } },
          { t: 'Torch straight in her eyes', need: 'torch', dmg: 1, next: 'escape',
            o: 'You hit her lidless eyes full beam and she whistles through the gauze and claps her long hands over them. You go past her, close enough to feel the cold coming off her, and she gets one hand in your hair and you rip it out at the roots, and you’re on the stairs.',
            fail: { o: 'No torch. You go for the gap under her arm. She takes your wrist, and counts, and you hit her with your whole weight, and somehow you’re past, on the stairs, falling down them.', dmg: 1, next: 'escape' } },
          { t: 'Back away into the dark ward', next: 'end_admitted',
            o: 'You back away from her, through the ward doors, into the green dark, where the beds are. Where the empty bed is. It’s been turned down for you.' }
        ]
      },

      escape: { route: [
        { need: ['dev', 'lights', 'dosed'], next: 'end_lightsout' },
        { need: ['lights', 'dosed'], next: 'end_quiet' },
        { need: 'dev', next: 'end_dawn' },
        { need: 'police', next: 'end_police' },
        { next: 'end_alone' }
      ] },

      /* ───────────── ENDINGS ───────────── */

      end_lightsout: {
        title: 'Lights Out', time: 'MON 03:51', mood: 'golden', img: 'w9_end_lights',
        text: 'You go back for one look, Dev holding your arm. Ward 9 is blazing white. Every bed is still. Every sheet is flat and quiet, and under the gauze, nobody is breathing, and for the first time in fifty years that is a mercy. On the landing, a heap of navy cloth and a white cap. No body under them. Every clock on the floor says 03:51. Down in the security hut, the old pager clicks once, and its little green screen goes dark, and stays dark. On Monday they knock it all down, and you and Dev stand at the fence with a flask of tea and watch the top floor go first.',
        end: { kind: 'best', label: 'The best ending' }
      },

      end_quiet: {
        title: 'All Quiet', time: 'MON 03:51', mood: 'night', img: 'w9_end_lights',
        text: 'Ward 9 is blazing white, and still. Her cape lies empty on the landing. You walk down the ward between the beds, and every one is quiet, every sheet flat, and you know before you get there. Bed 14. Dev’s eyes are closed now. Someone has closed them for him. The gauze has gone from his face. He looks like he’s sleeping. You did it. You stopped her. You were just too late for the one person you came up here for.',
        end: { kind: 'bittersweet', label: 'A bittersweet ending' }
      },

      end_dawn: {
        title: 'Handover', time: 'MON 06:12', mood: 'golden', img: 'w9_end_dawn',
        text: 'You come out of the main doors with Dev’s arm round your neck and the sky going grey over the car park. He doesn’t speak until you’re in the hut with the door locked and the heater on. Then he says: “She’ll want someone in Bed 14.” You both look out at the hospital. The top floor windows are dark. Then, one by one, left to right, they turn green. At 03:03 the next night, at home, something goes off in your coat pocket. An old pager you never picked up. WARD 9. BED 14. VACANT. It goes off every night after. You never answer. You throw it in the canal. It’s back in your pocket the next night.',
        end: { kind: 'good', label: 'A good ending' }
      },

      end_alone: {
        title: 'Bed 14', time: 'MON 05:58', mood: 'dusk', img: 'w9_end_alone',
        text: 'You don’t stop running until you’re in your car with the doors locked. You sit there till it gets light. Nobody believes you about Dev; there’s nobody in the building when they check, they say, nobody at all. On Monday, they knock Thornleigh down. You don’t go and watch. At 03:03 that night, in your flat ten miles away, the pager goes off on your bedside table. You never brought it home. WARD 9, it says. BED 14. COME NOW. Then, one finger at a time: DEV IS WAITING.',
        end: { kind: 'bittersweet', label: 'A bittersweet ending' }
      },

      end_police: {
        title: 'Officers Attended', time: 'MON 04:20', mood: 'night', img: 'w9_end_police',
        text: 'The patrol car arrives at twenty past four, blue lights turning across the car park. Two officers, young, bored, torches. You tell them not to go up. They laugh, kindly, and go up. You watch their torch beams climb the stairwell windows. Seventh floor. Then the top floor goes green, all along, and their torches go out, one, two. They don’t come down. The patrol car sits there till morning with its doors open and its radio asking for them. At 03:03 the next night, an old pager you never picked up goes off in your coat pocket: WARD 9. BEDS 25 AND 26. ADMITTED.',
        end: { kind: 'bad', label: 'A bad ending' }
      },

      end_admitted: {
        title: 'Admitted', time: 'MON 03:03', mood: 'under', img: 'w9_end_admitted',
        text: 'The sheet is cool and damp and pulled tight across your chest. The gauze over your mouth is tucked in at the corners with yellow tape, firmly, kindly. You can’t move. You can’t close your eyes. You can breathe, in, out, slow and deep, in time with everyone else, and after a while you find you don’t want to do anything else. Every so often a torch comes down the ward, and cold fingers count your pulse, and a voice says, “Settled.” Your wrist band says BED 25. It is 03:03. It will always be 03:03.',
        end: { kind: 'bad', label: 'A bad ending' }
      }
    }
  };
})();

/* Decoys for the timed scenes: ordinary-looking choices shown first, with no clock running. Whichever the
   player picks, they're cut off by `interrupt`, and only then does the countdown or action start. */
(function () {
  const D = (id, decoys, interrupt) => Object.assign(NIGHTDOOR.stories['ward-9'].nodes[id], { decoys: decoys.map(t => ({ t })), interrupt });
  D('start', ['Pour a cup of tea and think', 'Check the gate CCTV', 'Radio the control room'],
    'You don’t get that far. The pager’s scream climbs higher, and across the car park the top-floor windows start lighting up green, one by one. Do something.');
  D('fire_escape', ['Shout for help', 'Look down', 'Try to swing to the next landing'],
    'The rail bends another inch with a groan. There’s no one to hear you and no time to think. Pull.');
  D('foyer', ['Read the noticeboard', 'Check the reception desk for keys', 'Call Dev’s name'],
    'Ding. The indicator has reached 2. Then 1. The cables in the shaft are humming. It’s nearly here.');
  D('lift', ['Call out to whoever’s breathing', 'Check your phone', 'Press the button for the ground floor'],
    'The ticking steps closer, just outside your torchlight. Whatever you’re going to do, do it now.');
  D('stairs', ['Read the rest of the chalk on the wall', 'Shout up the stairwell for Dev', 'Test the barricade'],
    'The ticking turns the corner of the stairs above you. A torch beam spills down the wall. Move.');
  D('stairs_hold', ['Ask who’s there', 'Back away down the stairs', 'Switch your torch on'],
    'Something above you sniffs, long and slow. She’s right on the other side of the bed frames. Don’t breathe.');
  D('nightbook', ['Read the whole book from the beginning', 'Photograph the page', 'Check the drug cabinet'],
    'Through the wall, the breathing stops. All of it, all at once. Behind you, the office door clicks.');
  D('ward_cross', ['Stand up and call for Dev', 'Wait for her to leave the ward', 'Try the light switch by the door'],
    'Her torch beam swings your way before you can move. Get down, and go between the sweeps.');
  D('ward_breathe', ['Hold completely still', 'Slip out of the bed and run', 'Close your eyes'],
    'The bed next to yours has started breathing louder, deliberately, for you to copy. Her torch is two beds away. Breathe with them.');
  D('grabbed', ['Say you’re security, not a patient', 'Go limp', 'Scream for Dev'],
    'Her grip tightens and the tape squeals off the roll. She isn’t listening. Pull.');
  D('bed14', ['Check his pulse', 'Read his chart', 'Say his name again'],
    'At the top of the ward, her torch has turned round. It’s coming back down towards Bed 14.');
  D('pulse', ['Reach for Dev’s hand', 'Sit up and look for the doors', 'Shut your eyes'],
    'The watch is ticking right at the end of your bed. Too late to move. Breathe like them.');
  D('dev_wakes', ['Tell him it’s you', 'Ask him what happened', 'Check the doors'],
    'His chest heaves. He’s about to scream. You’ve got a second, maybe less.');
  D('sit_up', ['Look for Dev', 'Freeze and hope they lie back down', 'Shout for help'],
    'Every pointing arm swings with you as you move. At the end of the ward, her torch turns. Go.');
  D('aisle_back', ['Carry Dev on your back', 'Leave him and go for help', 'Wait for her to finish her round'],
    'Dev’s grip on your arm tightens. Her beam is coming back down the aisle. Move between the sweeps.');
  D('leave', ['Look back at Dev', 'Get up and run', 'Turn your torch on'],
    'Her beam sweeps over the bed right beside you. Stay low. Go between the sweeps.');
  D('grabbed2', ['Say Dev’s name', 'Go still and let her look at you', 'Grab her torch'],
    'The tape squeals off the roll, right by your ear. Tear free. Now.');
  D('run', ['Make for the stairs anyway', 'Hide behind the ward doors', 'Phone the police again'],
    'Her torch comes through the ward doors’ windows, bright and close. No time. Choose.');
  D('fuse', ['Throw every breaker you can reach', 'Shine your torch over the labels', 'Look for a fuse list'],
    'Her ticking stops right outside the plant room door. Remember the circuit. Fast.');
  D('linen_hold', ['Feel for a light switch', 'Push the door to check it shuts', 'Whisper for Dev'],
    'The stripe of light under the door goes dark. Feet. She’s right outside. Don’t make a sound.');
  D('finale_lit', ['Run for the stairs', 'Shout at her to let you go', 'Look away from her face'],
    'She turns her face towards you, blinking, and her eyes are already adjusting. Now, while she can’t see.');
  D('finale_dark', ['Ask her to let you go', 'Put your hands up', 'Look for another way down'],
    'She takes one long step closer, and her hand is still held out for your wrist. Decide.');
})();
