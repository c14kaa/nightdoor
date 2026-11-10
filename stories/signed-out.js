/* NIGHTDOOR story: Signed Out
   A school lockdown at 15:13 that slips into another world. An original creature: the Visitor.
   Signature: fingernails tapping on glass, door handles tried one by one down the corridor,
   a VISITOR lanyard, names written down, and the taken "signed out" in its spidery hand.
   First story to use puzzles: a countdown, picture search, a door picker, a keypad and a typed name.
   One good ending, one bittersweet, three bad. */
window.NIGHTDOOR = window.NIGHTDOOR || { stories: {} };

NIGHTDOOR.stories['signed-out'] = {
  id: 'signed-out',
  title: 'Signed Out',
  tagline: '15:13. Lockdown. Lights off, blinds down, stay away from the door. Something has signed in at reception.',
  blurb: 'Last lesson on a Friday, Room 14, Harrowfield School. Three long blasts of the alarm: a stranger on site. You hide in the dark with your class and wait for the all-clear. It never comes. Outside the window, the playing field has gone, and so has the world.',
  cover: 'cover_signedout',
  lives: 3,
  start: 'start',
  frozen: '15:13$',
  death: {
    title: 'Harrowfield keeps you',
    text: 'Too many wrong turns. A long grey hand writes your name in the visitor book, slowly, beautifully, in ink that is still wet. Then it writes the time: 15:13. It is always 15:13.'
  },

  items: {
    phone:    { name: 'Your phone',          icon: '📱', desc: 'No signal. The clock says 15:13 and won’t change. The torch still works.' },
    haribo:   { name: 'Haribo',              icon: '🍬', desc: 'A squashed bag from the bottom of your bag. Tap to eat: restores 1 life.', heal: 1 },
    cereal:   { name: 'Cereal bar',          icon: '🍫', desc: 'Mr Adebayo’s emergency cereal bar. Tap to eat: restores 1 life.', heal: 1 },
    note:     { name: 'Sticky note',         icon: '🟨', desc: 'Mr Adebayo’s writing: “Office keypad = the year we opened. It’s on the plaque by the stairs, if anyone ever looked up.”' },
    keys:     { name: 'Mr Adebayo’s keys',   icon: '🔑', desc: 'A heavy bunch on a lanyard. One small brass key has a tag: CABINET.' },
    clipping: { name: '1962 newspaper cutting', icon: '📰', desc: 'Harrowfield Gazette, 1962: “Opening day joy turns to fear as four pupils vanish. The new clock tower, gift of benefactor Mr Edmund Vane, stopped at 3.13pm.”' },
    seen:     { hidden: true },
    board:    { hidden: true },
    books:    { hidden: true },
    pegs:     { hidden: true }
  },

  nodes: {

    /* ───────────── ACT I · LOCKDOWN ───────────── */

    start: {
      act: 'Act I · Lockdown', title: 'Room 14', time: 'FRI 15:12', mood: 'golden', img: 'so_classroom',
      text: 'Last lesson on a Friday. Geography. Mr Adebayo is trying to explain glaciers to twenty-six people watching the clock. Jas is drawing a moustache on the volcano in your textbook. Kai is pretending to be asleep. Ellie, who sits on her own by the window, has actually been listening. Three minutes to the bell. Then the alarm goes. Not the fire bell. Three long, flat blasts. Everyone knows what three blasts means. Lockdown.',
      sfx: 'alarm',
      choices: [
        { t: 'Help Mr Adebayo lock the door', next: 'lockdown',
          o: 'Your hands are shaking but the key turns. Mr Adebayo yanks the blinds down over the narrow glass panel in the door. “It’s a drill,” he says, too fast. “It’s just a drill. Lights off. Away from the door. Phones on silent.” He doesn’t look like it’s a drill.' },
        { t: 'Look through the door window first', gain: 'seen', scare: 'v_window', next: 'lockdown',
          o: 'Down the corridor, at the far end, by the fire doors, someone very tall is stooping to come through them. Too tall. They have to fold, the way you’d fold a deckchair. Something white swings on a cord round their neck. Then Mr Adebayo pulls you back and slams the blind down.' },
        { t: 'Grab your phone to text Mum', gain: 'phone', next: 'lockdown',
          o: 'LOCKDOWN AT SCHOOL IM OK. You hit send. The little bar crawls halfway and stops. The signal drops to nothing, while you’re watching it. The time in the corner says 15:13.' }
      ]
    },

    lockdown: {
      act: 'Act I · Lockdown', title: 'Lights Off', time: 'FRI 15:13', mood: 'dusk', img: 'so_lockdown',
      timer: 10, timerLabel: 'Hide',
      timeout: { o: 'You freeze in the middle of the room like a rabbit. Footsteps stop right outside. Through the gap at the edge of the blind, something presses up close to the glass: a cracked white face with no eyes in it, just two holes, weeping ink. It looks straight at you. Then Jas drags you down behind the desks.', dmg: 1, scare: 'v_window', next: 'handle' },
      text: 'Lights off. Blinds down. Twenty-six people trying to breathe quietly at once. Out in the corridor: footsteps. Slow, uneven, heavy, like someone walking on stilts. They’re coming this way. You need to be out of sight of that little window in the door. Now.',
      choices: [
        { t: 'Under Mr Adebayo’s desk', next: 'handle',
          o: 'You fold yourself into the dark under the desk, between a bin and his bag. It smells of coffee and pencil shavings. Your knees are against your chin. You can see the bottom of the door from here, and the line of light under it.' },
        { t: 'Into the stock cupboard with Jas', next: 'handle',
          o: 'You and Jas squeeze in among the box files and the dusty globes and pull the door to. It doesn’t quite shut. Jas finds your hand in the dark and grips it hard enough to hurt.' },
        { t: 'Flat behind the back row of desks', next: 'handle',
          o: 'You lie flat on the floor between the chair legs. Old chewing gum, inches from your face. Kai is lying next to you. For once in his life, he isn’t making a joke.' }
      ]
    },

    handle: {
      act: 'Act I · Lockdown', title: 'The Handle', time: 'FRI 15:13', mood: 'dusk', img: 'so_door', sfx: 'handle',
      text: 'The footsteps stop outside Room 14. The door handle goes down. Slowly. It holds there. It comes back up. Then: tap. On the glass. Tap-tap. Fingernails, long ones, the way you’d tap on a fish tank. Through the gap at the edge of the blind, you can see a white plastic card swinging on a cord. It says VISITOR.',
      choices: [
        { t: 'Hold your breath and stay still', next: 'dark',
          o: 'You don’t breathe. Nobody does. After a long time, the card swings away. The footsteps go on down the corridor. You hear the next door handle go down, and hold, and come back up. Then the next. Then the next. It’s checking every room. It’s checking which ones are locked.' },
        { t: 'Peek through the gap in the blind', need: 'seen', scare: 'v_window', dmg: 1, next: 'dark',
          o: 'You already know how tall it is. This time you see its hand, flat on the glass. Seven fingers. Each one has too many joints, and they move one after another, like a wave, tap, tap, tap, tap, tap, tap, tap. You fall backwards into a chair and it scrapes. The tapping stops. Then, much later, it moves on.',
          fail: { o: 'You lean towards the gap. Mr Adebayo grabs your shoulder and shakes his head, very slowly. His face is grey. You stay where you are. The card swings away, and you hear the next handle go down along the corridor, and the next.', next: 'dark' } },
        { t: 'Text the family group chat', gain: 'phone', next: 'dark',
          o: 'Your thumbs won’t work properly. Not delivered. Not delivered. Not delivered. You switch to 999. It rings and rings. Nobody ever picks up. When you take the phone away from your ear, the screen shows the call has been going on for nine hours.' }
      ]
    },

    dark: {
      act: 'Act I · Lockdown', title: '15:13', time: 'FRI 15:13', mood: 'night', img: 'so_dark',
      text: 'You wait for the all-clear. It doesn’t come. You wait so long your legs go dead. Every phone in the room says 15:13. So does the clock on the wall, its second hand twitching in the same spot. But the light round the edges of the blinds has gone from afternoon gold, to orange, to grey, to nothing at all. It’s dark out there. Properly dark. In March, at a quarter past three.',
      choices: [
        { t: 'Lift the window blind an inch', next: 'window',
          o: 'Ellie is already at the window, two fingers holding a slat apart. She doesn’t say anything. She just moves aside so you can look.' },
        { t: 'Ask Mr Adebayo what’s happening', next: 'window',
          o: 'He’s trying the radio on his belt, the one that talks to reception. Static. Then, under the static, very faint, tapping. He switches it off quickly. “I don’t know,” he says. It’s the first time you’ve ever heard a teacher say that and mean it. “Ellie’s looking out. Go and look.”' },
        { t: 'Shine your phone torch round the room', need: 'phone', next: 'window',
          o: 'Twenty-five white faces in the beam. Someone’s crying very quietly. Kai is sitting with his back to the radiator, staring at the door. The light catches the window, and Ellie, standing there with the blind held open, and her face, which is wet. “Come and look,” she says.',
          fail: { o: 'You feel your way across the room in the dark, bumping desks. Ellie is at the window with the blind held open a crack. “Come and look,” she whispers.', next: 'window' } }
      ]
    },

    window: {
      act: 'Act I · Lockdown', title: 'Out of the Window', time: 'FRI 15:13', mood: 'under', img: 'so_underworld',
      text: 'There is no playing field. The grass stops six metres from the building, in a clean edge, like a cake on a plate, and after that there is nothing. Above, the sky is the colour of the inside of your eyelids. Huge pale things drift through it slowly, trailing long threads, like jellyfish the size of churches. Far away, other buildings float in the dark: a school, and another school, and another, every window lit, and faces at all of them.',
      choices: [
        { t: 'Look for anyone out there', scare: 'v_window', next: 'kai',
          o: 'Down on the edge of the grass, someone is walking away from the building, towards the drop. A boy in a blazer older than your dad. Then you see more of them, scattered across the dark, all walking, all wearing white cards on cords round their necks. None of them looks back. Behind you, Kai says, “No. No way. I’m going home,” and runs for the door.' },
        { t: 'Look up at the clock tower', next: 'kai',
          o: 'You crane your neck. The old clock tower on top of the main building, the one that’s been broken since forever, is lit up from inside. Its hands point to 3.13. You’ve walked under it every day for two years and never once looked at it properly. Behind you, a chair crashes over. Kai is running for the door.' },
        { t: 'Close the blind. Don’t look.', next: 'kai',
          o: 'You let the slat snap shut. Ellie doesn’t argue. You both stand there with your backs to the window, shaking. Then there’s a clatter: Kai has stood up. “I’m not staying here,” he says. “I’m going home.” He’s already at the door.' }
      ]
    },

    kai: {
      act: 'Act II · Out of Bounds', title: 'Kai', time: 'FRI 15:13', mood: 'blood', img: 'so_corridor_kai', sfx: 'tap',
      text: 'He has the door unlocked before Mr Adebayo can reach him. He’s out in the corridor in his football shirt, the one he wears under his jumper every Friday, with KAI 7 on the back. He gets four steps. Then the ceiling tiles above him lift, and something long and grey comes down out of the dark like a spider on a thread, and it reads the back of his shirt.',
      scare: 'v_ceiling',
      choices: [
        { t: 'Run out and grab him', dmg: 1, next: 'names',
          o: 'You get a fistful of his shirt. Its fingers are already round his shoulders, seven on each side. Kai has stopped struggling. He’s gone very calm. It takes a pen from its coat, opens a small black book, writes something, and you watch Kai’s shirt pull out of your hand like it’s being reeled in. Mr Adebayo drags you back inside and locks the door.' },
        { t: 'Shout his name', next: 'names',
          o: '“KAI!” He turns round. He looks at you like he’s never seen you before. Above him, a pen is moving across a small black book. KAI MENSAH. 15:13. A white card on a cord is round his neck now. It says VISITOR. He walks off down the corridor, quite calmly, towards the stairs. Mr Adebayo pulls you back and locks the door.' },
        { t: 'Slam the door. Lock it.', next: 'names',
          o: 'You do it before you can think. Through the glass you see it writing in a little black book, and Kai standing there with a white card round his neck, perfectly still. Then he walks away, towards the stairs, and down, and later, through the window, you see him out on the grass with the others, walking towards the edge.' }
      ]
    },

    names: {
      act: 'Act II · Out of Bounds', title: 'It Read His Name', time: 'FRI 15:13', mood: 'night', img: 'so_names',
      search: {
        prompt: 'Search the room: hide every name before it comes back',
        spots: [
          { t: 'The smartboard', x: 262, y: 54, w: 276, h: 140, gain: 'board',
            o: 'The register is still up on the board, glowing in the dark: twenty-six names, in alphabetical order, yours among them. You yank the plug out of the wall. The names fade slowly, like they don’t want to go.' },
          { t: 'Exercise books on the desks', x: 250, y: 286, w: 300, h: 74, gain: 'books',
            o: 'Every book has a name on the front in big marker pen. You and Jas go down the rows turning them face down. Some kids have written their names inside the covers too. You tear those pages out and stuff them in the bin.' },
          { t: 'The coat pegs', x: 20, y: 120, w: 190, h: 120, gain: 'pegs',
            o: 'Name labels above every peg, laminated, from Year 7. You rip them off one by one. Your own still has the sticker of a dinosaur you chose when you were eleven. It takes you a second longer than it should to tear it down.' },
          { t: 'Mr Adebayo’s desk drawer', x: 590, y: 246, w: 180, h: 80, gain: ['keys', 'note', 'cereal'],
            o: 'Board pens, a stapler, his keys on a lanyard, an emergency cereal bar, and a yellow sticky note stuck to the bottom of the drawer: “Office keypad = the year we opened. It’s on the plaque by the stairs, if anyone ever looked up.” He sees you take them and nods.' },
          { t: 'Your school bag', x: 60, y: 318, w: 150, h: 70, gain: ['phone', 'haribo'],
            o: 'Your phone, if it wasn’t already in your pocket, and a squashed bag of Haribo you forgot about on Tuesday. You also find your bus pass, with your name and your photo on it, and slide it under the radiator, face down.' }
        ]
      },
      text: '“It read his shirt,” Ellie whispers. “Did you see? It looked at his name, and it wrote it down, and then he was just… its.” Nobody argues. Somewhere along the corridor a handle goes down, and holds, and comes up again. It’s coming back round. Your name is written on things all over this room.',
      choices: [
        { t: 'That’s everything. Get down and wait.', next: 'checknames',
          o: 'You crouch in the dark with the others and listen to the handles. One. And the next. And the next. Getting closer.' },
        { t: 'Eat something. Breathe.', next: 'names',
          o: 'You make yourself breathe out slowly. Jas passes you half a biscuit she had in her blazer. You chew it without tasting it. Then you look round the room again. Have you got everything?' }
      ]
    },

    checknames: { route: [ { need: ['board', 'books', 'pegs'], next: 'safe' }, { next: 'ellie' } ] },

    safe: {
      act: 'Act II · Out of Bounds', title: 'Nothing to Read', time: 'FRI 15:13', mood: 'night', img: 'so_door', sfx: 'tap',
      text: 'The handle goes down. Holds. Tap on the glass, tap-tap. You can hear it breathing through the gap under the door, a slow wet sound, like someone sucking ink through a straw. It’s reading. It’s looking for a single letter. There’s nothing in here for it. After a long time, the handle comes up, and the footsteps go away, disappointed. Everybody in Room 14 is still here.',
      choices: [
        { t: 'Whisper: “We need a plan”', next: 'plan',
          o: 'Mr Adebayo is already nodding. “It came in through reception,” he says. “It signed in. Everyone who comes into this school signs in.” He looks at the door. “Which means somewhere there’s a way to sign it out.”' },
        { t: 'Hug Jas', next: 'plan',
          o: 'Jas hugs you back so hard your ribs creak. “We’re not staying here,” she says into your shoulder. “I’m not staying here at quarter past three for ever.” Mr Adebayo has heard. “No,” he says. “We’re not.”' },
        { t: 'Check on Ellie', next: 'plan',
          o: 'Ellie is writing in the back of her planner, fast, in tiny letters. “It signed in,” she says, without looking up. “Everybody signs in. And everybody has to sign out.” Mr Adebayo looks at her for a long moment. Then he says, “Reception.”' }
      ]
    },

    ellie: {
      act: 'Act II · Out of Bounds', title: 'Ellie', time: 'FRI 15:13', mood: 'blood', img: 'so_door', sfx: 'tap',
      text: 'The handle goes down. Holds. Then: tap-tap-tap, very fast, excited. Under the door, along the floor, a long grey finger slides in. Then another. It found something. Ellie’s face goes white in your phone light. Her planner. Her name is on the front of it, in silver gel pen, surrounded by stars.',
      scare: 'v_fingers',
      choices: [
        { t: 'Throw the planner out of the window', dmg: 1, next: 'plan',
          o: 'Too late. The fingers find her ankle, gently, almost politely. Ellie stops being frightened. She stands up, and unlocks the door herself, and steps out into the corridor, and a white card swings round her neck. VISITOR. The door closes. The fingers withdraw. Somewhere a pen scratches. ELLIE WOOD. 15:13.' },
        { t: 'Hold on to her', dmg: 1, next: 'plan',
          o: 'You both grab her, you and Jas. It doesn’t matter. She’s already gone calm. She pats your hand, kindly, the way you’d pat a dog, and pulls free, and opens the door, and steps out. You hear a pen scratch. When you look back at where she was sitting, her planner is gone too.' },
        { t: 'Hide your face and don’t watch', next: 'plan',
          o: 'You put your hands over your eyes like a little kid. You hear the lock click. You hear the door open and close. You hear a pen, scratching, very neat. When you look, Ellie’s chair is empty, and Mr Adebayo is standing by it with his fists clenched. “Right,” he says. “Right. Reception.”' }
      ]
    },

    plan: {
      act: 'Act II · Out of Bounds', title: 'The Plan', time: 'FRI 15:13', mood: 'night', img: 'so_dark',
      text: 'Mr Adebayo keeps his voice low. “It came in through reception. It signed in, so there’s a book with its name in it. The office is on the ground floor, through the staff door. Blue door, STAFF ONLY. The office code is…” he stops, and swears quietly. “It’s as old as the school. I’ll go the other way, to the science block, and make as much noise as I can. You two go to reception. Don’t touch any handles you don’t have to. And whatever you do, don’t write your names on anything.”',
      choices: [
        { t: 'Go with Jas. Let him draw it away.', next: 'corridor', gain: 'keys',
          o: 'He presses his keys into your hand. “Small brass one’s the cabinet in the office. I don’t know why I said that. Just take them.” Then he does something teachers never do: he puts a hand on each of your heads, like he’s blessing you, and goes out of the door, banging on every locker as he runs.' },
        { t: 'Refuse. Everyone stays together, here.', next: 'end_stay',
          o: 'You say no. You say it louder than you mean to. Mr Adebayo looks at you, and then at the rest of the class, terrified in the dark, and he nods slowly and sits back down. “Then we wait,” he says. “Somebody will come.” Nobody ever comes.' },
        { t: 'You be the distraction instead', fatal: true, scare: 'v_face',
          o: 'You’re out of the door before he can stop you, banging lockers, shouting, running for the science block. It works. It comes. It comes much faster than you thought anything that tall could come, folded nearly double, its fingers walking along the ceiling ahead of it. It reads the name on your PE bag as you run. You hear the pen before you feel the cold.' }
      ]
    },

    corridor: {
      act: 'Act II · Out of Bounds', title: 'The Humanities Corridor', time: 'FRI 15:13', mood: 'night', img: 'so_corridor',
      timer: 15, timerLabel: 'Run',
      timeout: { o: 'Too slow. At the far end, it unfolds out of a classroom doorway, and its face turns towards you. It hasn’t got eyes, but it sees you. You run for the stairs, but its hand is long enough to reach, and seven nails rake down your back as you take the steps four at a time.', dmg: 1, scare: 'v_ceiling', next: 'lobby' },
      text: 'The corridor is long, and dark, and it smells of floor polish and something underneath, like a cut finger. Far away, Mr Adebayo is banging lockers. And somewhere much closer, someone is trying the handles, one, and the next, and the next, coming this way. Ahead of you are the stairs. Above them, the old brass plaque that nobody ever reads: HARROWFIELD SCHOOL · OPENED 1962 · THE CLOCK TOWER WAS THE GIFT OF MR E. VANE.',
      choices: [
        { t: 'Sprint for the stairs', next: 'lobby',
          o: 'You and Jas take the stairs three at a time, holding the rail, not looking back. Behind you, a handle goes down, and holds, and comes back up. Closer than before. You don’t stop until you’re at the bottom.' },
        { t: 'Duck into the toilets till it passes', next: 'toilets',
          o: 'You shove the door with your shoulder, not the handle, and you and Jas fall into the boys’ toilets in the dark. It smells of bleach. A tap is dripping. The mirrors run all along one wall.' },
        { t: 'Lose your nerve. Back to Room 14.', next: 'end_stay',
          o: 'You can’t. You turn and run back and hammer on the door of Room 14 until someone lets you in. Jas comes with you. She doesn’t say anything. Nobody says anything, for a very long time.' }
      ]
    },

    toilets: {
      act: 'Act II · Out of Bounds', title: 'The Mirrors', time: 'FRI 15:13', mood: 'blood', img: 'so_toilets', sfx: 'tap',
      text: 'You crouch under the sinks, the two of you, hands over your mouths. The door doesn’t open. But the tapping starts anyway. On the mirrors. Tap. Tap-tap. From the other side of the glass. In every mirror along the wall, there’s a long grey shape, folded up small, looking out at you.',
      choices: [
        { t: 'Look at the mirrors', scare: 'v_face', dmg: 1, next: 'lobby',
          o: 'In every mirror, its face is right up against the glass, a crack running from crown to chin. The crack opens. It isn’t a crack. It’s a mouth, and it opens downwards, the long way, top to bottom, and inside it there are rows and rows of small grey teeth, and paper, and names. You and Jas run, and you don’t stop till the bottom of the stairs.' },
        { t: 'Keep your eyes on the floor and crawl out', next: 'lobby',
          o: 'You crawl on your hands and knees along the tiles, eyes down, Jas’s hand on your ankle. The tapping follows you along the mirrors, all the way to the door. Then you’re out, and down the stairs, and at the bottom.' },
        { t: 'Turn on all the taps to cover the sound', next: 'lobby',
          o: 'You spin every tap. The rush of water fills the room. The tapping stops, like it’s listening, confused. Under the noise, you and Jas slip out and down the stairs to the ground floor.' }
      ]
    },

    lobby: {
      act: 'Act III · Reception', title: 'The Ground Floor', time: 'FRI 15:13', mood: 'night', img: 'so_lobby', doors: true,
      text: 'The bottom of the stairs. Four doors. From behind the big double doors of the main hall comes the school song, sung very slowly, by a lot of children, all slightly out of time. Light leaks warm under the library door. The lift is open and waiting, which it never is. And there’s a blue door with a sign. Which way?',
      choices: [
        { t: 'Main Hall', door: { c: '#7a2a24', double: true, glass: true, sign: 'MAIN HALL' }, dmg: 1, scare: 'v_hall', next: 'lobby',
          o: 'Rows and rows of children sitting on the hall floor, cross-legged, for assembly. Some in blazers you’ve only seen in old photos. Kai is there. They all have white cards round their necks. They all turn round at once to look at you. You slam the doors and hold them shut till your arms shake. Nothing tries to come out. They’re waiting for someone to come in.' },
        { t: 'Library', door: { c: '#2f5a3a', glass: '#ffcf73', sign: 'LIBRARY', light: '#ffcf73' }, gain: 'clipping', next: 'lobby',
          o: 'Empty, and warm, and quiet. On the librarian’s desk, someone has left a display out for the school’s anniversary: old photos, and a newspaper cutting in a plastic sleeve. Harrowfield Gazette, 1962: opening day joy turns to fear as four pupils vanish. “The new clock tower, gift of benefactor Mr Edmund Vane, stopped at 3.13pm.” You take it. You go back out to the doors.' },
        { t: 'Staff Only', door: { c: '#2c4f8a', glass: true, sign: 'STAFF ONLY', signC: '#2c4f8a', signT: '#fff' }, next: 'office_door',
          o: 'The blue door, just like Mr Adebayo said. You push it with your shoulder rather than use the handle. A short corridor, a noticeboard, a fire extinguisher, and at the end, the office door, with a keypad.' },
        { t: 'Lift', door: { steel: true, c: '#8a8f96', sign: 'LIFT', light: '#9fe07a' }, fatal: true, scare: 'v_face',
          o: 'The doors close behind you. There are buttons for G and 1 and 2. There’s also one at the very bottom that’s just a small black hole, and the lift is already going there. It goes down for a long time. When the doors open, it’s standing there, waiting, holding its little black book. It has already written your name.' }
      ]
    },

    office_door: {
      act: 'Act III · Reception', title: 'The Keypad', time: 'FRI 15:13', mood: 'night', img: 'so_keypad',
      text: 'The office door has a keypad: four digits. Through the glass panel you can see reception, the sign-in screen glowing blue, and a fat paper visitor book open on the counter. Mr Adebayo said the code was as old as the school. Above you, somewhere, a handle goes down, and holds, and comes up again. Jas is watching the stairs.',
      code: {
        answer: '1962', len: 4, tries: 3, prompt: 'Staff office · enter code',
        clue: { need: 'note', t: 'Mr Adebayo’s sticky note: “Office keypad = the year we opened. It’s on the plaque by the stairs, if anyone ever looked up.”' },
        ok: { o: 'The lock clunks. The door swings open on to reception. Behind you, very faintly, from the stairs: tap. Tap-tap. You pull Jas in and shut the door.', next: 'office' },
        wrong: { o: 'The keypad gives an ugly buzz that echoes all the way up the stairwell. Up there, a handle stops halfway down.' },
        out: { o: 'The keypad locks with a long, loud buzz. Up on the stairs, the tapping starts again, and it isn’t slow any more. Something is coming down them, fast, on far too many fingers.', dmg: 1, scare: 'v_ceiling', next: 'caught' }
      },
      choices: [
        { t: 'Go back to the four doors', next: 'lobby',
          o: 'You back away from the keypad and slip back out to the bottom of the stairs, to think.' }
      ]
    },

    caught: {
      act: 'Act III · Reception', title: 'It Heard', time: 'FRI 15:13', mood: 'blood', img: 'so_lobby', sfx: 'handle',
      text: 'It comes down the stairwell head first, its long coat hanging down past its face, fingers walking it down the steps like a hand puppet. The white card swings. VISITOR. Its head turns slowly, from Jas, to you, reading. Your blazer. Your shoes. Your bag. Looking for a name.',
      choices: [
        { t: 'Rip the badge off your blazer and throw it', next: 'office_door',
          o: 'Your house badge has your initials embroidered on it. You tear it off and fling it down the corridor. It goes after it like a cat after string. You have about thirty seconds. Back to the keypad.' },
        { t: 'Hide in the stationery cupboard', dmg: 1, next: 'office_door',
          o: 'You cram in among the reams of paper. Its fingers come under the door and run over your trainers, slowly, feeling for laces, for writing, for anything. It finds nothing. They withdraw. One nail leaves a long thin cut across your ankle. When it’s gone, you creep back to the keypad.' },
        { t: 'Run back up to Room 14', next: 'end_stay',
          o: 'You run. You get back to Room 14 and hammer on the door and someone lets you in, and you lock it, and you sit down in the dark, and you decide you’re never going out there again.' }
      ]
    },

    office: {
      act: 'Act III · Reception', title: 'Reception', time: 'FRI 15:13', mood: 'under', img: 'so_office',
      text: 'The sign-in screen glows: VISITOR 15:13. Name: a squiggle, like a seismograph. Visiting: ALL OF THEM. The paper visitor book lies open beside it. In the Signed Out column, in a long, spidery, beautiful hand, a list of names in ink that’s still wet. KAI MENSAH, at the top, and more under it, the ink still glistening. And at the back of the office, in a locked glass cabinet, a much older visitor book, its leather cover cracked, with a label: 1962.',
      choices: [
        { t: 'Open the cabinet with the brass key', need: 'keys', next: 'oldbook',
          o: 'The small brass key turns sweetly, like it’s been waiting. You lift out the 1962 book. It’s heavy and cold and smells of damp. Jas holds the phone torch while you turn the pages.',
          fail: { o: 'You haven’t got a key. You smash the glass with the fire extinguisher. The noise goes through the whole building like a bell. Up above, every handle on every floor starts rattling at once. You grab the 1962 book and cut your hand on the glass doing it.', dmg: 1, next: 'oldbook' } },
        { t: 'Sign yourself out in today’s book', next: 'end_book',
          o: 'Maybe that’s all it takes. You pick up the pen on its little chain. In the Signed Out column, under Kai, in your neatest handwriting, you write your name, and the time: 15:13. Jas grabs for your arm, too late. The ink goes in like water into sand.' },
        { t: 'Check the sign-in screen', next: 'office',
          o: 'You tap the screen. A list of today’s visitors: a man about the boiler, a mum dropping off PE kit, and the squiggle. You tap the squiggle. ACCESS DENIED. Then, by itself, the screen types: HELLO. WHAT IS YOUR NAME? You switch it off at the wall.' }
      ]
    },

    oldbook: {
      act: 'Act III · Reception', title: 'The 1962 Book', time: 'FRI 15:13', mood: 'under', img: 'so_oldbook',
      text: 'Opening day, 1962. Pages of names: the Mayor, parents, a photographer. Four children’s names in a different, spidery hand, in the Signed Out column, at 3.13pm. And above them, one visitor who signed in and never signed out. The ink has run, as if it got wet. You can read the first letter, and a V, and the last two letters, N and E. Arrived: 3.13pm. Visiting: the children. Then the office door handle goes down. And holds.',
      choices: [
        { t: 'Grab a pen and get ready', next: 'final',
          o: 'You find a biro by the phone. You hold the old book open on the counter. The handle comes up. Goes down again. Jas is backed against the photocopier with both hands over her mouth.' },
        { t: 'Read the names of the four children', next: 'final',
          o: 'Four names, and the time, 3.13pm, written very beautifully. You think of the boy you saw from the window, in the blazer older than your dad, walking towards the edge. Sixty-odd years he’s been walking. The handle comes up. Goes down again.' },
        { t: 'Barricade the door with a chair', next: 'final',
          o: 'You jam the office chair under the handle. It won’t hold. It holds for exactly as long as it takes you to run back to the book, and then the chair slides away across the carpet all by itself.' }
      ]
    },

    final: {
      act: 'Act III · Reception', title: 'The Visitor', time: 'FRI 15:13', mood: 'blood', img: 'so_final', scare: 'v_face', sfx: 'tap',
      text: 'It folds itself into the doorway, a joint at a time. The cracked white head. The black holes where eyes should be, leaking ink down its face. The long coat. The card on its cord: VISITOR. It opens its little black book and looks at Jas, and its pen begins to move. You have the 1962 book open at its own entry. In the Signed Out column, the space next to its name has been empty for sixty years.',
      code: {
        kind: 'letters', answer: ['VANE', 'EVANE', 'MRVANE', 'MREVANE', 'EDMUNDVANE', 'MREDMUNDVANE'], tries: 2,
        prompt: 'Signed Out · write its name', button: 'Sign it out',
        clue: { need: 'clipping', t: 'The 1962 cutting: “…the new clock tower, gift of benefactor Mr Edmund Vane, stopped at 3.13pm.”' },
        ok: { o: 'You write it, and the time: 15:13. The pen drags like it’s writing through mud. The Visitor stops. Its pen stops. Its head turns to you, slowly, and for the first time it makes a sound, a long, dry sigh, like someone putting down something very heavy. The card on its cord goes blank. Then the alarm goes: one long blast, and silence. The all-clear.', next: 'end_best' },
        wrong: { o: 'The ink won’t take. It beads on the page and runs off like rain off glass. The Visitor turns its head towards you. It’s finished writing Jas.', dmg: 1 },
        out: { o: 'Wrong. The page drinks your ink and keeps it. Your handwriting. Written in its book. That’s all it needs.', scare: 'v_face', next: 'end_wrong' }
      },
      choices: [
        { t: 'Write your own name instead, so it lets Jas go', next: 'end_trade',
          o: 'You write your name in its book instead of hers, across the top of the page, big, so it can’t miss it. Its pen stops. It turns from Jas to you. It looks almost pleased. Jas screams your name. That’s fine. It already has it.' },
        { t: 'Grab Jas and run for the front doors', fatal: true, scare: 'v_ceiling',
          o: 'The front doors open easily. Too easily. Outside there’s six metres of grass and then nothing, and you’re running too fast to stop. You hold on to Jas’s hand all the way down. It’s a long way down. At the bottom, someone is waiting with a pen.' }
      ]
    },

    /* ───────────── ENDINGS ───────────── */

    end_best: {
      title: 'All Clear', time: 'FRI 15:14', mood: 'day', img: 'so_end_best',
      end: { kind: 'best', label: 'The best ending' },
      text: 'The clock on the wall clicks to 15:14. Sunlight slams in through the windows. Outside, the playing field is back, and there are police cars on it, and parents at the gates, and the alarm is still ringing all-clear. They find Mr Adebayo sitting on the floor of the science block, his hair gone white overnight in about two hours. Kai is on the field, and everyone else it took, holding blank white cards, not talking yet. And four more children nobody can explain, in blazers from 1962, still eleven years old, asking politely if they can go home now. Up on the clock tower, for the first time in sixty years, the hands start to move.'
    },

    end_trade: {
      title: 'Visiting Hours', time: 'FRI 15:13', mood: 'under', img: 'so_end_trade',
      end: { kind: 'bittersweet', label: 'A bittersweet ending' },
      text: 'Jas gets home. They find her on the field at 15:14 on a sunny Friday, with the police and the parents and the all-clear ringing, holding your blazer. She tells them everything. Nobody believes her except Mr Adebayo, who never comes back to teaching. Every year on the anniversary she goes back to Harrowfield and stands under the clock tower, and every year, at 3.13pm exactly, she hears it. Tap. On the glass of one of the high windows. Tap-tap. Like someone saying hello.'
    },

    end_wrong: {
      title: 'Wrong Name', time: 'FRI 15:13', mood: 'blood', img: 'so_end_signed',
      end: { kind: 'bad', label: 'A bad ending' },
      text: 'It closes its book. Very gently, it puts a white card on a cord round Jas’s neck, and then round yours. VISITOR. You aren’t frightened any more. You walk out of the front doors together and across the grass, towards the edge, with the others. It’s nice, walking. You could walk for sixty years. Behind you, at the high windows of another school, far away across the dark, faces are watching you go.'
    },

    end_book: {
      title: 'Home Time', time: 'FRI 15:13', mood: 'under', img: 'so_end_signed',
      end: { kind: 'bad', label: 'A bad ending' },
      text: 'You’re signed out. You’re allowed to go home. You walk out of the front doors in a dream, and nobody stops you, and you cross the grass towards the edge where the world used to be, and keep going, and it feels like walking home. There’s a white card round your neck now. Somewhere behind you, Jas is screaming your name. It doesn’t sound like a name you know.'
    },

    end_stay: {
      title: 'Still Here', time: 'FRI 15:13', mood: 'night', img: 'so_end_stay',
      end: { kind: 'bad', label: 'A bad ending' },
      text: 'You stay in Room 14 with the blinds down and the door locked, and you wait for the all-clear. The clock says 15:13. It always says 15:13. Nobody gets hungry. Nobody gets older. Every so often, a handle goes down outside, and holds, and comes back up, and every so often someone can’t bear it any more and goes to the door. There are fewer of you now. There are white cards hanging on the coat pegs where the names used to be. You’re still waiting. You’ll always be waiting. It’s nearly the bell.'
    }
  }
};

/* Decoys for the timed scenes: ordinary-looking choices shown first, with no clock running. Whichever the
   player picks, they're cut off by `interrupt`, and only then does the countdown start. */
(function () {
  const D = (id, decoys, interrupt) => Object.assign(NIGHTDOOR.stories['signed-out'].nodes[id], { decoys: decoys.map(t => ({ t })), interrupt });
  D('lockdown', ['Text your mum that you’re safe', 'Ask Mr Adebayo what’s happening', 'Peek through the gap in the blinds'],
    'Mr Adebayo’s hand clamps down on your shoulder. “Hide,” he breathes. The footsteps are three doors away. Two.');
  D('corridor', ['Read the plaque properly', 'Call out for Mr Adebayo', 'Check your phone for signal'],
    'A door handle rattles, much closer than before. Then the next one. It’s coming down the corridor. Go.');
})();
