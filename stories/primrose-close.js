/* NIGHTDOOR story: Primrose Close
   Node format
     act, title, time, mood (day|golden|dusk|night|under|blood), img (art key), sfx, scare (on arrival)
     text
     choices: [{ t: label, o: outcome text, next, gain, lose, dmg, fatal, scare,
                 need: 'item' | ['a','b'], fail: { o, next, gain, dmg, fatal, scare } }]
     route: [{ need, next }]       -> silent branch, first match wins
     end:   { kind, label }        -> ending screen
*/
window.NIGHTDOOR = window.NIGHTDOOR || { stories: {} };

NIGHTDOOR.stories['primrose-close'] = {
  id: 'primrose-close',
  title: 'Primrose Close',
  tagline: 'Lovely neighbours. Lovely gardens. Lovely, lovely smiles.',
  blurb: 'You have just moved into Number 13, the nicest house on the nicest street in England. Everyone is so welcoming. Everyone is so happy. Just be inside by 8:13.',
  cover: 'cover_primrose',
  lives: 3,
  start: 'start',

  items: {
    torch:     { name: 'Torch',          icon: '🔦', desc: 'Batteries still good.' },
    key:       { name: 'Brass key',      icon: '🗝️', desc: 'Tag reads: CELLAR, DO NOT…' },
    nail:      { name: 'Iron nail',      icon: '🔩', desc: 'Old, rusty, iron. Lucky?' },
    salt:      { name: 'Salt',           icon: '🧂', desc: 'For your doorstep, dear.' },
    cake:      { name: 'Lemon cake',     icon: '🍰', desc: 'Tap to eat: restores 1 life.', heal: 1 },
    lighter:   { name: 'Lighter',        icon: '🔥', desc: 'Every home needs fire.' },
    photo:     { name: 'Old photograph', icon: '📷', desc: 'Ellie, 1987. Don’t let Daddy smile.' },
    musicbox:  { name: 'Music box',      icon: '🎵', desc: 'Plays the ice cream van’s song.' },
    lease:     { name: 'Lease pages',    icon: '📜', desc: 'Your page, and Ellie’s. Torn from the ledger.' },
    biscuit:   { name: 'Biscuit',        icon: '🐕', desc: 'Your dog. Sticky, but safe.' },
    ellieTrust:  { hidden: true },
    harrowFreed: { hidden: true },
    stunned:     { hidden: true },
    burned:      { hidden: true },
    locked:      { hidden: true }
  },

  nodes: {

    /* ───────────── ACT I · A LOVELY DAY ───────────── */

    start: {
      act: 'Act I · A Lovely Day', title: 'Moving Day', time: 'SAT 10:02', mood: 'day', img: 'street_day',
      text: 'The removal van rumbles away and there it is: Number 13, Primrose Close. Red door, roses round the porch, a gnome grinning on the lawn. Up and down the close, neighbours wash their cars and wave. Your dog, Biscuit, wags so hard his whole back end wiggles. You’ve never seen a nicer street.',
      choices: [
        { t: 'Unpack the boxes', gain: 'torch', next: 'abernathy',
          o: 'Under a stack of saucepans, in a box marked MISC, you find your old torch. The batteries still work. You slip it into your pocket, just in case.' },
        { t: 'Wave back at the neighbours', next: 'abernathy',
          o: 'Everybody waves back. Every single person. A lady in a lilac cardigan is already walking up your path, carrying a cake.' },
        { t: 'Explore the back garden', next: 'garden',
          o: 'Biscuit races ahead of you round the side of the house, nose to the ground.' }
      ]
    },

    garden: {
      act: 'Act I · A Lovely Day', title: 'The Back Garden', time: 'SAT 10:20', mood: 'day', img: 'garden',
      text: 'The back garden is wild and lovely: foxgloves, a crooked shed, an old swing hanging from the apple tree. A second stone gnome stands by the back door. It’s facing the house, not the garden. As if it’s keeping an eye on the windows.',
      choices: [
        { t: 'Lift the gnome', gain: 'key', next: 'abernathy',
          o: 'It’s heavier than it looks. Pressed into the soil underneath is a small brass key on a paper tag. The tag says CELLAR, DO NOT, and the rest has rotted away. Then the doorbell rings.' },
        { t: 'Give the swing a push', next: 'abernathy',
          o: 'The chain is ice cold. As the seat swings back, a little girl giggles right next to your ear. Biscuit whimpers and won’t go near the tree. Then the doorbell rings.' },
        { t: 'Look inside the shed', gain: 'nail', next: 'abernathy',
          o: 'Cobwebs, rusty tools, and tally marks scratched all over one wall, in groups of thirteen. A loose iron nail drops from the door frame into your hand. You keep it, for luck. Then the doorbell rings.' }
      ]
    },

    abernathy: {
      act: 'Act I · A Lovely Day', title: 'Mrs Abernathy', time: 'SAT 10:41', mood: 'day', img: 'abernathy',
      text: '“Welcome, welcome!” Mrs Abernathy from Number 11 hands you a lemon drizzle cake and a twist of paper full of salt. “For your doorstep, dear. Old Primrose tradition.” Her smile is lovely. It stays on her face a little too long. “You know about the curfew? Everyone inside by 8:13. Just a community thing.”',
      choices: [
        { t: 'Thank her and take both', gain: ['cake', 'salt'], next: 'party',
          o: '“Such good manners,” she beams. “You’ll fit right in. Everyone does, in the end.”' },
        { t: 'Ask why 8:13, exactly', gain: 'salt', next: 'party',
          o: '“Oh, tradition,” she says. Her smile doesn’t move at all, not even while she talks. She presses the salt into your hand anyway, and squeezes. Hard.' },
        { t: 'Joke that you’re a night owl', gain: 'cake', next: 'party',
          o: 'For a moment her smile switches off, like a light. Then it’s back. “No, dear. You won’t be.” She leaves the cake on your step and takes the salt home with her.' }
      ]
    },

    party: {
      act: 'Act I · A Lovely Day', title: 'The Street Party', time: 'SAT 13:15', mood: 'day', img: 'party', sfx: 'van',
      text: 'Bunting zig-zags across the close. There are trestle tables, sausage rolls and a tombola. Mr Okafor from Number 9 is burning burgers and telling dreadful jokes. Twins chalk on the pavement, and an ice cream van plays its jolly tune. Everyone keeps saying how glad they are you’ve come.',
      choices: [
        { t: 'Help Mr Okafor at the barbecue', gain: 'lighter', next: 'twins',
          o: '“Why did the sausage roll? It saw the burger flip!” He hands you his spare lighter. “Every home needs fire.” Then, very quietly, not smiling at all: “Whatever knocks tonight, don’t open the door.”' },
        { t: 'Get an ice cream from the van', next: 'twins',
          o: 'Sunny Dan, the ice cream man, hands you a cone with a chocolate flake. “On the house for Number 13,” he says, the way people say sorry for your loss. It’s the best ice cream you’ve ever tasted.' },
        { t: 'Play fetch with Biscuit', next: 'twins',
          o: 'You throw his ball down the close. Biscuit brings back a different ball. It’s soft, and damp, and someone has drawn a smile on it in red felt tip.' }
      ]
    },

    twins: {
      act: 'Act I · A Lovely Day', title: 'Chalk', time: 'SAT 14:30', mood: 'day', img: 'chalk',
      text: 'The twins, Poppy and Pip, have chalked your house on the pavement. But in their drawing there’s a second door underneath it, deep in the ground. Beside it stands a very tall man with a very wide smile. “That’s Mr Harrow,” says Poppy. “He used to live in your house.” “He still does,” says Pip.',
      choices: [
        { t: 'Ask who Mr Harrow is', next: 'afternoon',
          o: '“He smiles all the time,” says Pip. “His girl Ellie didn’t want to smile. So she went downstairs.” Their mum calls them inside. Sharply. She isn’t smiling either.' },
        { t: 'Rub it out with your shoe', next: 'afternoon',
          o: 'The chalk won’t smudge. It’s warm, like skin. When you lift your foot, a smell of burnt sugar follows you all the way home.' },
        { t: 'Draw a happy dog next to it', next: 'afternoon',
          o: 'The twins giggle and clap. Then Poppy takes the chalk and gives your dog a smile. A long one. All the way round its head.' }
      ]
    },

    afternoon: {
      act: 'Act I · A Lovely Day', title: 'Settling In', time: 'SAT 17:40', mood: 'golden', img: 'garden_golden',
      text: 'The party packs up early. Very early. By late afternoon the close is silent and the sun turns everything gold. You’re unpacking mugs when you hear it: a music box, tinkling somewhere above you. You haven’t unpacked a music box. You don’t own a music box.',
      choices: [
        { t: 'Follow the music to the loft', next: 'loft',
          o: 'The loft hatch is already open. The ladder is already down.' },
        { t: 'Take Biscuit round the close', next: 'walk',
          o: 'Fresh air. That’s what you need. Biscuit agrees.' },
        { t: 'Turn the radio up and ignore it', next: 'dusk',
          o: 'The radio only finds one station. It’s playing the ice cream van’s song. You switch it off. Upstairs, the music box stops too, as if it’s listening. You lose track of time.' }
      ]
    },

    loft: {
      act: 'Act I · A Lovely Day', title: 'The Loft', time: 'SAT 17:52', mood: 'golden', img: 'loft',
      text: 'Dust hangs in a slice of sunlight. There’s a child’s tartan suitcase, a rocking horse, and a music box on the floorboards, its tiny ballerina turning. The far corner of the loft is completely dark. Too dark, for a sunny day.',
      choices: [
        { t: 'Open the little suitcase', gain: 'photo', next: 'dusk',
          o: 'Under folded jumpers is a photo of a girl in a yellow raincoat. On the back, in careful handwriting: Ellie, 1987. Don’t let Daddy smile. You sit with it for a long time. Too long.' },
        { t: 'Pick up the music box', gain: 'musicbox', next: 'dusk',
          o: 'Its tune is the ice cream van’s song, only slower and sadder. The moment you touch it, it stops. You pocket it. It feels like it wants to come with you.' },
        { t: 'Look into the dark corner', need: 'torch', next: 'dusk',
          o: 'Your torch finds the word UNDER scratched into the rafters, over and over, and something small scuttling away from the light.',
          fail: { dmg: 1, next: 'dusk',
            o: 'You’ve no light, so you reach in blindly. Something cold takes hold of your fingers and squeezes. You tear free and fall down the ladder, knuckles bleeding.' } }
      ]
    },

    walk: {
      act: 'Act I · A Lovely Day', title: 'Round the Close', time: 'SAT 18:10', mood: 'golden', img: 'street_watchers',
      text: 'Every house has the same flowerpots. Every porch has a neighbour sitting on it, watching you go by. At the end of the close the ice cream van is parked with its engine off, still playing its tune. Biscuit’s tail goes down between his legs.',
      choices: [
        { t: 'Wave at the neighbours', next: 'dusk',
          o: 'They all wave back at exactly the same time. They all stop at exactly the same time. Not one of them blinks.' },
        { t: 'Peek inside the ice cream van', next: 'dusk',
          o: 'Nobody is in the driver’s seat. The freezer lid is up. It’s full of children’s shoes, frosted white. Dozens of them. You back away very slowly.' },
        { t: 'Read the residents’ noticeboard', next: 'dusk',
          o: 'PRIMROSE CLOSE RESIDENTS. Rule 1: Inside by 8:13. Rule 2: Do not answer the Smiling Man. Rule 3: Welcome the new tenant. Pinned underneath is a card with your name on it.' }
      ]
    },

    /* ───────────── ACT II · CURFEW ───────────── */

    dusk: {
      act: 'Act II · Curfew', title: 'Eight Minutes to Curfew', time: 'SAT 20:05', mood: 'dusk', img: 'street_dusk', sfx: 'vanSlow',
      text: 'The sky goes the colour of a bruise. Doors slam all along the close and curtains snap shut, one, two, three. Biscuit slips his collar and bolts down the road, barking at something you can’t see. The van’s song starts up again. Slower now. Wrong.',
      choices: [
        { t: 'Chase after Biscuit', next: 'chase',
          o: 'You sprint after him. Behind you, the last curtain closes.' },
        { t: 'Call him from the doorstep', next: 'doorstep',
          o: 'You shout his name until your throat hurts. The barking gets further away. Then it stops.' },
        { t: 'Go inside. He always comes back.', next: 'house_night',
          o: 'You shut the door and lean against it. Through the letterbox, you hear Biscuit stop barking. Mid-bark. Then the clock in the hall ticks over to 8:13.' }
      ]
    },

    chase: {
      act: 'Act II · Curfew', title: 'The Van', time: 'SAT 20:09', mood: 'dusk', img: 'van_dusk',
      text: 'The street lamps flicker on, then off. Biscuit’s barking leads you to the ice cream van. Its headlights are dead. Its tune is slow and warped, like a toy running down. The back hatch hangs open, glowing a soft freezer-blue.',
      choices: [
        { t: 'Look underneath the van', dmg: 1, scare: 'crawler', next: 'doorstep',
          o: 'Biscuit’s collar lies in a puddle. Then long white fingers, with far too many knuckles, slide out of the dark and wrap round your wrist. You rip free and run for home.' },
        { t: 'Bang on Number 9 for help', next: 'doorstep',
          o: 'Mr Okafor’s curtain twitches. A note slides out under his door: TOO LATE. GO HOME. SALT YOUR STEP.' },
        { t: 'Climb into the van', next: 'van_inside',
          o: 'You haul yourself up through the hatch. The van is much, much bigger inside than out.' }
      ]
    },

    van_inside: {
      act: 'Act II · Curfew', title: 'Sunny Dan', time: 'SAT 20:11', mood: 'night', img: 'van_inside',
      text: 'Freezers stretch away into the dark like a corridor. Sunny Dan sits in the driver’s seat with his back to you, humming along with his tune. “One more for the Landlord,” he says cheerfully. “Rent’s due tonight.”',
      choices: [
        { t: 'Ask him where your dog is', dmg: 1, scare: 'dan', next: 'doorstep',
          o: 'He turns round. His head is a melting swirl of soft-serve with a smile carved into it. “Downstairs,” it gurgles. “Everybody goes downstairs.” You fall out of the van and run.' },
        { t: 'Open the nearest freezer', fatal: true, scare: 'dan',
          o: 'Frost pours out. So does a hand. It pulls you in, gently, and the lid comes down, and the tune plays on. Sunny Dan has a new flavour.' },
        { t: 'Back out quietly', next: 'doorstep',
          o: 'You don’t take your eyes off him. He doesn’t turn round. He just hums louder as you go.' }
      ]
    },

    doorstep: {
      act: 'Act II · Curfew', title: 'One Minute to Curfew', time: 'SAT 20:12', mood: 'dusk', img: 'street_figure',
      text: 'You’re on your doorstep. Your phone says 20:12. Every street lamp in the close goes out at once. At the far end of the road, under a dead lamp, stands a very tall man in a bowler hat. He wasn’t there a second ago. He’s smiling. You can see the smile from here.',
      choices: [
        { t: 'Salt the step and get inside', need: 'salt', next: 'house_night',
          o: 'You pour a thick white line and slam the door. Something outside snuffles along the salt, then hisses like a kettle. It won’t cross. Not yet.',
          fail: { dmg: 1, next: 'house_night',
            o: 'You’ve got no salt. You slam the door, but something slams it back, hard, into your face. You throw your whole weight against it until the latch clicks.' } },
        { t: 'Stare back at him', dmg: 1, scare: 'grin', next: 'house_night',
          o: 'He’s taller. He’s closer. Then he’s at your gate, all teeth, and the air smells of burnt sugar. You stumble inside, bleeding from a cut you never felt.' },
        { t: 'Shout for Biscuit one last time', next: 'house_night',
          o: 'A bark answers. It comes from inside your house. Directly behind you.' }
      ]
    },

    house_night: {
      act: 'Act II · Curfew', title: 'Eight Thirteen', time: 'SAT 20:13', mood: 'night', img: 'door_glass', sfx: 'knock',
      text: 'The power dies. Through the frosted glass of your front door, a tall shape leans close, a wide white smile pressed flat against the pane. Knock. Knock. Knock. A warm, friendly voice: “Hello, neighbour! I’ve found your little dog!”',
      choices: [
        { t: 'Open the door', fatal: true, scare: 'grin',
          o: 'Mr Harrow is so very pleased to meet you. He holds out his hand. When you take it, your mouth begins to stretch, wider and wider. You’ll be smiling for ever now. Everyone on Primrose Close is.' },
        { t: 'Back away. Silently.', next: 'hallway',
          o: 'You hold your breath. The smile slides slowly down the glass and is gone. The knocking stops.' },
        { t: 'Ask him to prove it', dmg: 1, next: 'hallway',
          o: '“Of course!” Biscuit’s collar drops through the letterbox. Then a long grey arm follows it, reaching, reaching, and grabs your ankle. You kick free and scramble back.' }
      ]
    },

    /* ───────────── ACT III · NUMBER 13 ───────────── */

    hallway: {
      act: 'Act III · Number 13', title: 'The Hallway', time: 'SAT 20:13', mood: 'night', img: 'hallway',
      text: 'Pitch black. The knocking starts again, but not at the front door. It’s coming from the little door under the stairs. The cellar door. The one that was painted shut this morning.',
      choices: [
        { t: 'Switch on your torch', need: 'torch', next: 'ellie_meet',
          o: 'The beam shows a trail of small, wet, bare footprints. They lead from the cellar door right up to your feet. And stop.',
          fail: { dmg: 1, next: 'ellie_meet',
            o: 'No light. You feel along the wall, trip over a box and crack your head on the banister. When your eyes clear, there’s a faint glow by the cellar door.' } },
        { t: 'Hide in the cupboard under the stairs', next: 'ellie_meet',
          o: 'You squeeze in among the coats. Something small is already in there. It’s cold, and wet, and it takes hold of your hand.' },
        { t: 'Run upstairs', next: 'upstairs',
          o: 'You take the stairs two at a time and lock yourself in the bathroom.' }
      ]
    },

    upstairs: {
      act: 'Act III · Number 13', title: 'The Mirror', time: 'SAT 20:13', mood: 'night', img: 'mirror',
      text: 'In the bathroom mirror, your reflection moves a second too late. You raise your hand. It raises its hand. Then, slowly, while your own face stays frozen with fear, your reflection begins to smile.',
      choices: [
        { t: 'Smash the mirror', dmg: 1, next: 'ellie_meet',
          o: 'Glass everywhere. Your hand is cut. In every shard on the floor, a tiny Mr Harrow waves up at you. You stagger back downstairs.' },
        { t: 'Throw a towel over it', next: 'ellie_meet',
          o: 'Good thinking. Under the towel, something knocks politely on the glass. You creep back downstairs. Someone is waiting for you.' },
        { t: 'Smile back', fatal: true, scare: 'grin',
          o: 'It feels nice to smile. Your cheeks stretch. They keep stretching. You can’t stop. Your reflection climbs out of the mirror, and you climb in.' }
      ]
    },

    ellie_meet: {
      act: 'Act III · Number 13', title: 'Ellie', time: 'SAT 20:13', mood: 'night', img: 'ellie', scare: 'ellie',
      text: 'A girl in a yellow raincoat stands dripping in the hall. You can see the wallpaper through her. Her hair hides her face. “He’s got your dog,” she whispers. “He takes everyone downstairs, to the Landlord. I can show you the way. But you have to be brave.”',
      choices: [
        { t: 'Show her the photograph', need: 'photo', gain: 'ellieTrust', next: 'cellar_door',
          o: 'She touches the photo. For a second she’s solid and warm and real. “That’s me,” she says. “Before.” She pushes back her hair and gives you a small, ordinary smile. She trusts you now.',
          fail: { next: 'cellar_door',
            o: 'You’ve got nothing to show her. She tilts her head. “You’re not like him… are you?” She doesn’t sound sure.' } },
        { t: 'Ask what happened to her', next: 'cellar_door',
          o: '“Everyone on the close signs the Landlord’s lease. Once a year it gets a new tenant. In 1987, Daddy gave it me.” Her voice cracks. “Then it took him too, and made him smile.”' },
        { t: 'Scream and run for the front door', next: 'cellar_door',
          o: 'The front door isn’t there any more. Just wallpaper, growing over the place it used to be. Ellie waits until you’ve finished.' }
      ]
    },

    cellar_door: {
      act: 'Act III · Number 13', title: 'The Cellar Door', time: 'SAT 20:13', mood: 'night', img: 'cellar',
      text: 'The cellar door is old and swollen, with a brass lock. Thirteen tally marks are scratched into the wood at the height of a child. From the other side comes a slow, deep sound. Like breathing.',
      choices: [
        { t: 'Try the brass key', need: 'key', next: 'stairs',
          o: 'Click. The door swings open onto steps that go down much, much further than any cellar should.',
          fail: { next: 'stairs',
            o: 'It’s locked, and you have no key. Ellie pushes her arm through the wood and unlocks it from the inside. It costs her: she flickers like a dying bulb. “Don’t make me do that again.”' } },
        { t: 'Shoulder it open', dmg: 1, next: 'stairs',
          o: 'The door gives. So does your shoulder.' },
        { t: 'Press your ear to the wood', next: 'cellar_door',
          o: 'The breathing is enormous. The whole house rises and falls with it. Then a voice speaks inside your own head, with no mouth to say it: WELCOME, TENANT.' }
      ]
    },

    /* ───────────── ACT IV · THE UNDERCLOSE ───────────── */

    stairs: {
      act: 'Act IV · The Underclose', title: 'The Stairs Down', time: '20:13', mood: 'under', img: 'stairs',
      text: 'You count 113 steps. The walls change from brick, to soil, to something soft that pulses under your fingers. Halfway down there’s a landing with a door marked 13, upside down. The stairs carry on into green fog. Ellie stays close.',
      choices: [
        { t: 'Keep going down', next: 'underclose',
          o: 'Down, and down, until down becomes up, and you step out under a sky made of earth.' },
        { t: 'Open the upside-down door', next: 'mirror_house',
          o: 'The handle is warm. The door opens onto your own hallway, hanging the wrong way up.' },
        { t: 'Wind the music box', need: 'musicbox', next: 'underclose',
          o: 'Its tune drifts down the stairwell. Far below, something gigantic pauses, then sighs, soothed. “It likes that song,” Ellie whispers. “Keep it safe.”',
          fail: { dmg: 1, scare: 'crawler', next: 'underclose',
            o: 'You’ve nothing to wind, so you hum the van’s tune to keep your nerve. From below, something hums it back. Much louder. Much closer. Then it’s on the stairs with you.' } }
      ]
    },

    mirror_house: {
      act: 'Act IV · The Underclose', title: 'The Other Number 13', time: '20:13', mood: 'under', img: 'mirror_house',
      text: 'It’s your house, upside down. Lamps stand on the ceiling. On the sofa sits someone wearing your clothes and your face, watching a television with no picture. They’re smiling. They haven’t noticed you. Yet.',
      choices: [
        { t: 'Say hello to the other you', fatal: true, scare: 'grin',
          o: 'It turns, stands, and takes your hand, kindly. “I’ll go upstairs and live your life,” it says. “You stay here.” And you do. For ever.' },
        { t: 'Sneak past to the back door', next: 'underclose',
          o: 'Floorboard by floorboard, holding your breath. The back door opens onto the strangest street you’ve ever seen.' },
        { t: 'Grab the photo on the mantelpiece', gain: 'photo', dmg: 1, next: 'underclose',
          o: 'It’s Ellie in her yellow raincoat. You snatch it. On the sofa, the other you turns its head all the way round to look at you. You run, and something sharp catches your arm.' }
      ]
    },

    underclose: {
      act: 'Act IV · The Underclose', title: 'The Underclose', time: '20:13', mood: 'under', img: 'underclose',
      text: 'Primrose Close again, but hanging upside down from a sky of soil and roots. Houses drip. Green fog rolls along the gutters. Neighbours wander about in dressing gowns, eyes completely black, smiles completely wide. Somewhere, a dog barks.',
      choices: [
        { t: 'Follow the barking', next: 'hollow_street',
          o: 'You walk down the middle of the street. Every black-eyed head turns to follow you.' },
        { t: 'Creep through the back gardens', next: 'gardens',
          o: 'Over a fence, through a hedge, into the back gardens.' },
        { t: 'Ask Ellie for the safest way', next: 'ellie_path',
          o: '“There isn’t a safe way,” says Ellie. “But there’s a less bad one.”' }
      ]
    },

    hollow_street: {
      act: 'Act IV · The Underclose', title: 'The Hollow Neighbours', time: '20:13', mood: 'under', img: 'hollows',
      text: 'The hollow neighbours shuffle towards you, all at once. Mrs Abernathy is at the front, still in her lilac cardigan. Her smile reaches right up to her ears. “Out after curfew, dear?” she says. “Naughty, naughty.”',
      choices: [
        { t: 'Throw salt at them', need: 'salt', next: 'postoffice',
          o: 'They shriek and scatter like pigeons, smoking wherever the salt touched. The way ahead is clear: a little post office, hanging upside down.',
          fail: { dmg: 1, scare: 'hollows', next: 'postoffice',
            o: 'You’ve no salt. Cold hands grab at you from every side. You fight your way through to a little post office, but not before something bites.' } },
        { t: 'Thank her for the cake', next: 'postoffice',
          o: '“Oh, such manners!” For a moment her black eyes clear and she’s just Mrs Abernathy again. “Quickly, dear. The Landlord keeps its ledger in the post office. Tear out your page.” Then her eyes go dark.' },
        { t: 'Run for it', next: 'okafor_house',
          o: 'You dodge round a postbox and run straight into Mr Okafor. He’s grey down one side, but his eyes are still his own. “In here. Quickly!”' }
      ]
    },

    okafor_house: {
      act: 'Act IV · The Underclose', title: 'Mr Okafor', time: '20:13', mood: 'under', img: 'okafor',
      text: 'Inside, his house is the right way up and smells of barbecue smoke. Half of Mr Okafor’s face has turned grey. “I signed their lease in 1994,” he says. “Didn’t read the small print. Nobody ever does. Listen. I haven’t got long.”',
      choices: [
        { t: 'Ask how to beat the Landlord', next: 'postoffice',
          o: '“It’s a contract, and contracts can be broken. Burn your page from its ledger in the post office. Lock Door 13 behind you on the way out. And if you’ve got a song it likes, play it.”' },
        { t: 'Ask where Biscuit is', next: 'gardens',
          o: '“The Long Lodger took him to the greenhouses. Big fella. Lives on the ceiling. Watch above you, and take something iron.”' },
        { t: 'Ask for anything that might help', gain: 'lighter', next: 'postoffice',
          o: 'He presses his barbecue lighter into your palm. “Every home needs fire,” he says, and smiles. A real smile. The last one he has.' }
      ]
    },

    gardens: {
      act: 'Act IV · The Underclose', title: 'The Greenhouses', time: '20:13', mood: 'under', img: 'gardens',
      text: 'The back gardens are full of gnomes, hundreds of them, all turned to watch you. A long greenhouse has grey cocoons hanging from its roof, gently swaying. One of them is dog-shaped. It whines when you get close.',
      choices: [
        { t: 'Cut open the dog-shaped cocoon', need: 'nail', gain: 'biscuit', next: 'crawler_chase',
          o: 'You slit the grey stuff with the iron nail. It peels like wet paper, and out tumbles Biscuit: sticky, dazed, and licking your face like mad! Then something above you creaks.',
          fail: { dmg: 1, next: 'gardens',
            o: 'Your fingers can’t tear it. It tightens round your hand like a mouth and you have to wrench yourself free. If only you had something sharp. Something iron.' } },
        { t: 'Kick over the gnomes', next: 'crawler_chase',
          o: 'Every gnome you kick screams. Every single one. The noise brings something down from above.' },
        { t: 'Look inside the biggest cocoon', next: 'crawler_chase',
          o: 'It’s a person, half-finished, grey and smiling. It’s wearing your clothes. A luggage label is pinned to it: NO. 13. NEXT. Something above you creaks.' }
      ]
    },

    crawler_chase: {
      act: 'Act IV · The Underclose', title: 'The Long Lodger', time: '20:13', mood: 'under', img: 'crawler', scare: 'crawler',
      text: 'Something unfolds from the underside of the street above. Arms like stepladders. Fingers like pale candles. A face with no eyes at all, just a long mouth full of teeth like piano keys. The Long Lodger drops to the ground in front of you.',
      choices: [
        { t: 'Shine your torch in its face', need: 'torch', next: 'postoffice',
          o: 'It shrieks. Light burns it! It scuttles backwards up a drainpipe and folds itself away into the dark. You run, and find yourself outside the post office.',
          fail: { dmg: 1, next: 'postoffice',
            o: 'No torch. It lunges, and its piano-key teeth play a horrible chord down your arm. You run until you reach the post office.' } },
        { t: 'Dive into a wheelie bin', next: 'postoffice',
          o: 'Lid shut. Stinking dark. Long fingers tap, tap, tap along the top of the bin, then move on. You climb out smelling awful but alive, and sneak to the post office.' },
        { t: 'Fight it with your bare hands', fatal: true,
          o: 'Brave. Very brave. Also very, very short.' }
      ]
    },

    ellie_path: {
      act: 'Act IV · The Underclose', title: 'The Less Bad Way', time: '20:13', mood: 'under', img: 'ellie_under',
      text: 'Ellie leads you along the gutters. “The Landlord keeps everybody’s lease in a big ledger,” she says. “Burn your page and it can’t keep you. Then get through Door 13 and lock it behind you.” She stops at a fork. “Which way?”',
      choices: [
        { t: 'The old post office', next: 'postoffice',
          o: '“That’s where the ledger is,” says Ellie. “Be very quiet in there.”' },
        { t: 'The storm drain', next: 'drain',
          o: '“Shortcut,” says Ellie. “A wet one.”' },
        { t: 'The church with no doors', next: 'church',
          o: 'Ellie goes very quiet. “Daddy’s in there.”' }
      ]
    },

    drain: {
      act: 'Act IV · The Underclose', title: 'The Storm Drain', time: '20:13', mood: 'under', img: 'drain',
      text: 'Knee-deep black water. Shoes float past you, lots of them. Voices whisper out of the pipes, saying your name, saying your old address, saying the day you were born.',
      choices: [
        { t: 'Wade straight through', dmg: 1, next: 'postoffice',
          o: 'Halfway across, hands come up out of the water and try to pull you under. You make it out the other side, soaked and shaking, right under the post office.' },
        { t: 'Wind the music box', need: 'musicbox', next: 'postoffice',
          o: 'The whispers turn into humming, and the humming fades into sleep. You walk through without a ripple and climb out beneath the post office.',
          fail: { dmg: 1, next: 'postoffice',
            o: 'You’ve nothing to soothe them. The whispers turn to screams and the water churns. You crawl out, half drowned, beneath the post office.' } },
        { t: 'Take the dry pipe instead', next: 'church',
          o: 'The dry pipe winds upwards and comes out under the floor of a church.' }
      ]
    },

    church: {
      act: 'Act IV · The Underclose', title: 'The Church With No Doors', time: '20:13', mood: 'under', img: 'church',
      text: 'You step through the wall. Every pew is full of smiling neighbours. At the pulpit, preaching about rent and rules and the lease, stands a tall man in a bowler hat. Ellie grips your sleeve. “That’s Daddy.”',
      choices: [
        { t: 'Show Mr Harrow the photo of Ellie', need: 'photo', gain: 'harrowFreed', next: 'postoffice',
          o: 'He stops mid-sentence. The smile wobbles. “Ellie?” For one moment he’s just a dad again. Then he tears his smile off like a mask. “Go! The post office! I’ll hold them!” He turns to face the congregation.',
          fail: { dmg: 1, scare: 'grin', next: 'postoffice',
            o: 'You’ve nothing to show him. He spots you. “A NEW TENANT!” he booms, and the whole church turns, and grins, and reaches. You escape through the vestry to the post office.' } },
        { t: 'Creep along the side aisle', next: 'postoffice',
          o: 'Head down, shoulders hunched. Nobody looks. Behind the vestry curtain is a passage to the post office.' },
        { t: 'Join in with the hymn', fatal: true,
          o: 'It’s a lovely hymn. Everyone sings it together, mouths opening wider and wider, and so does yours, until there’s no you left. Just the smile.' }
      ]
    },

    postoffice: {
      act: 'Act IV · The Underclose', title: 'The Ledger', time: '20:13', mood: 'under', img: 'ledger',
      text: 'The upside-down post office. On the counter lies an enormous ledger, full of signatures in rusty brown ink. The newest page has your name on it, in your own handwriting, though you never signed it. Ellie’s page is pinned beside it. Under your feet, the floor begins to breathe.',
      choices: [
        { t: 'Tear out your page and Ellie’s', gain: 'lease', next: 'descent',
          o: 'Rrrrip. The ledger howls like an animal. You stuff both pages in your pocket. Then the floor splits open beneath you, and you fall.' },
        { t: 'Read the small print', next: 'postoffice',
          o: 'Clause 13: The Tenant may leave only if the Landlord is soothed or stunned, the Tenant’s page is burned, and Door 13 is locked behind them.' },
        { t: 'Sign it again, to keep the peace', next: 'end_tenant',
          o: 'You pick up the pen. It’s warm. Your hand writes your name all by itself, and the floor stops breathing. It sounds pleased.' }
      ]
    },

    /* ───────────── ACT V · RENT DAY ───────────── */

    descent: {
      act: 'Act V · Rent Day', title: 'The Landlord', time: '20:13', mood: 'blood', img: 'landlord', scare: 'landlord', sfx: 'heart',
      text: 'You land in a cave beneath the whole close. Roots from every house hang down like veins. In the middle squats the Landlord: a mountain of grey flesh wearing thirteen front doors as a crown, with a thousand smiling mouths. It speaks in every neighbour’s voice at once. “RENT. IS. DUE.”',
      choices: [
        { t: 'Wind the music box', need: 'musicbox', gain: 'stunned', next: 'final',
          o: 'The van’s tune fills the cave. The Landlord’s thousand mouths go slack and start to hum along, dreamy and dazed. It’s soothed. For now.',
          fail: { dmg: 1, next: 'final',
            o: 'You’ve got nothing to calm it. It roars, and the roar alone throws you into the roots.' } },
        { t: 'Throw the iron nail at it', need: 'nail', gain: 'stunned', next: 'final',
          o: 'Iron! The nail sinks into its hide and the Landlord shrieks, every door on its crown rattling. It’s stunned.',
          fail: { dmg: 1, next: 'final',
            o: 'You’ve nothing made of iron, so you hurl a handful of soil. The Landlord laughs with a thousand mouths and swats you aside.' } },
        { t: 'Offer to pay the rent', next: 'end_tenant',
          o: '“WONDERFUL,” says the Landlord, with every mouth at once.' }
      ]
    },

    final: {
      act: 'Act V · Rent Day', title: 'Rent Is Due', time: '20:13', mood: 'blood', img: 'landlord_door',
      text: 'At the far end of the cave glows a door, the right way up, with a brass 13 on it. The way home. Between you and it, the Landlord heaves itself up. Ellie grips your hand. “Now,” she says. “It has to be now.”',
      choices: [
        { t: 'Burn the lease pages', need: ['lighter', 'lease'], gain: 'burned', next: 'final2',
          o: 'The pages catch. Your name curls and blackens, then Ellie’s. The Landlord screams with every voice on Primrose Close. Ellie begins to glow, gold and bright.',
          fail: { dmg: 1, next: 'final',
            o: 'You need fire, and you need your page from the ledger. You haven’t got both. The Landlord’s hand comes down.' } },
        { t: 'Make a run for the door', need: 'stunned', next: 'door13',
          o: 'It’s still dazed. You sprint past its swaying bulk and reach the door.',
          fail: { dmg: 1, next: 'door13',
            o: 'It’s wide awake. A huge grey hand sweeps across the cave and catches you on the way past.' } },
        { t: 'Push Ellie towards it as bait', fatal: true,
          o: 'Ellie looks at you. She doesn’t cry. She just lets go of your hand. Without her glow the cave goes dark, and in the dark the Landlord finds you easily.' }
      ]
    },

    final2: {
      act: 'Act V · Rent Day', title: 'Ashes', time: '20:13', mood: 'blood', img: 'landlord_door',
      text: 'Ash drifts down like snow. Your name is gone from the ledger. The Landlord thrashes, furious, blind with pain, and the whole cave shakes. Door 13 glows at the far end. Ellie is pulling at your sleeve.',
      choices: [
        { t: 'Run for the door', next: 'door13',
          o: 'You run. Roots whip past your face. You make it.' },
        { t: 'Grab Ellie’s hand and run', next: 'door13',
          o: 'Her hand is warm now. Properly warm. You run together.' },
        { t: 'Shout one last insult at it', dmg: 1, next: 'door13',
          o: '“YOUR HOUSES ARE DAMP!” you scream. It hears you. A root lashes across your back as you sprint for the door.' }
      ]
    },

    door13: {
      act: 'Act V · Rent Day', title: 'Door Number 13', time: '20:13', mood: 'blood', img: 'door13',
      text: 'The door is locked. Behind you, the Landlord drags itself closer, doors clattering on its crown. Ellie whispers, “Lock it behind us. Whatever happens, it has to be locked.”',
      choices: [
        { t: 'Use the brass key', need: 'key', gain: 'locked', next: 'ending',
          o: 'The key turns. You pull Ellie through and lock the door behind you. On the other side, a thousand voices howl. Then silence.',
          fail: { dmg: 1, next: 'door13',
            o: 'You’ve no key. You rattle the handle, and the Landlord’s breath rolls hot down the back of your neck.' } },
        { t: 'Kick it down', next: 'ending',
          o: 'Third kick, it bursts off its hinges. You make it through. But a broken door can’t be locked, can it?' },
        { t: 'Let Ellie open it', need: 'ellieTrust', gain: 'locked', next: 'ending',
          o: 'She steps through the wood and unlocks it from the other side. “Come on!” You dive through, and she locks it behind you with a click.',
          fail: { dmg: 1, next: 'door13',
            o: 'Ellie hesitates. She isn’t sure she can trust you, and that one second is all the Landlord needs.' } }
      ]
    },

    ending: {
      route: [
        { need: ['burned', 'locked', 'harrowFreed'], next: 'end_free' },
        { need: ['burned', 'locked', 'biscuit'], next: 'end_home' },
        { need: ['burned', 'locked'], next: 'end_smile' },
        { next: 'end_knock' }
      ]
    },

    /* ───────────── ENDINGS ───────────── */

    end_free: {
      title: 'Vacant Possession', time: 'SUN 06:12', mood: 'day', img: 'dawn',
      end: { kind: 'best', label: 'The best ending' },
      text: 'You climb out of the cellar into a pink, ordinary dawn. All along Primrose Close, doors open, and neighbours step out blinking. Frightened. Normal. Mr Okafor is laughing. Mrs Abernathy is crying. Biscuit comes bounding up the road. At the far end stands a tall man in a bowler hat, holding a little girl’s hand. Ellie waves. Then the two of them fade into the sunrise, together. The lease is broken. Primrose Close is free.'
    },

    end_home: {
      title: 'Home Sweet Home', time: 'SUN 06:12', mood: 'day', img: 'dawn',
      end: { kind: 'good', label: 'A good ending' },
      text: 'Dawn. Birdsong. You and Biscuit stumble up out of the cellar into your own ordinary kitchen. Ellie stands in the sunlight by the back door, gold at the edges. “Thank you,” she says, and then she isn’t there any more. Your lease is ash. You put the house up for sale that same morning. The estate agent says it’s a lovely street.'
    },

    end_smile: {
      title: 'Good Boy', time: 'SUN 06:12', mood: 'golden', img: 'dawn',
      end: { kind: 'bittersweet', label: 'A bittersweet ending' },
      text: 'You climb out into the dawn. Ellie fades into the sunlight, smiling. You’re free. You sit on the step and cry for Biscuit. Then, from the far end of the close, a dog comes trotting towards you, tail wagging. It’s him! He jumps into your arms and licks your face. He’s smiling. Dogs don’t smile like that.'
    },

    end_knock: {
      title: 'Rent Day', time: 'SUN 20:13', mood: 'night', img: 'door_glass',
      end: { kind: 'bad', label: 'A bad ending' },
      text: 'You made it home. You must have. You wake in your own bed and the sun is shining, and it was all a dream. All day the neighbours wave, and you wave back. But your lease still stands, and somewhere far below, a door was left unlocked. At 8:13 that night, there is a knock at the door.'
    },

    end_tenant: {
      title: 'The New Tenant', time: 'SAT 10:02', mood: 'day', img: 'abernathy_you',
      end: { kind: 'bad', label: 'A bad ending' },
      text: 'One year later, you’re on your porch in a lilac cardigan, waving at a removal van pulling into Primrose Close. A nice young family. You’ll bake them a cake. You’ll bring them some salt. You’re smiling. You can’t stop smiling. You haven’t stopped for a year.'
    }
  }
};
