/* NIGHTDOOR story: The Bell at Hollowmere
   Same node format as primrose-close.js. */
window.NIGHTDOOR = window.NIGHTDOOR || { stories: {} };

NIGHTDOOR.stories['hollowmere'] = {
  id: 'hollowmere',
  title: 'The Bell at Hollowmere',
  tagline: 'Half term on the farm. Lambs, flapjacks, and one little bell you must never ring.',
  blurb: 'A week at Hollowmere Farm with Aunt Ros, Uncle Gareth and your cousin Tilly. Fresh air, a car boot sale on the green, a collie called Shep. Then Tilly buys a brass bell from a man in grey, and something answers it.',
  cover: 'cover_hollowmere',
  lives: 3,
  start: 'start',
  frozen: '03:03$',
  death: {
    title: 'Hollowmere keeps you',
    text: 'Too many wrong turns. The dark folds over you, and somewhere up on the hill a little bell rings, once, twice, three times.'
  },

  items: {
    torch:    { name: 'Torch',          icon: '🔦', desc: 'Uncle Gareth’s. Heavy, and very bright.' },
    flapjack: { name: 'Flapjack',       icon: '🍪', desc: 'Tap to eat: restores 1 life.', heal: 1 },
    scone:    { name: 'Jam scone',      icon: '🥮', desc: 'Tap to eat: restores 1 life.', heal: 1 },
    medal:    { name: 'St Wenna medal', icon: '🏅', desc: 'A little silver saint on a chain. Warm to the touch.' },
    mirror:   { name: 'Hand mirror',    icon: '🪞', desc: '10p from the car boot. It shows things as they really are.' },
    water:    { name: 'Holy water',     icon: '💧', desc: 'From the font at St Wenna’s, in a jam jar.' },
    candle:   { name: 'Church candle',  icon: '🕯️', desc: 'Beeswax. Blessed, the Reverend says.' },
    journal:  { name: 'Ashby’s journal', icon: '📓', desc: 'Rev. T. Ashby, 1923. Half the pages are burnt.' },
    bell:     { name: 'The brass bell', icon: '🔔', desc: 'Ice cold. It hums when you aren’t looking at it.' },
    name:     { name: 'Its true name',  icon: '✒️', desc: 'VASSHAEL. Don’t say it lightly.' },
    shep:     { name: 'Shep',           icon: '🐕', desc: 'Border collie. Knows exactly what’s what.' },
    warned:   { hidden: true }
  },

  nodes: {

    /* ───────────── ACT I · HALF TERM ───────────── */

    start: {
      act: 'Act I · Half Term', title: 'The 16:15 to Hollowmere', time: 'FRI 16:15', mood: 'day', img: 'station',
      text: 'The little train rattles off and leaves you on a platform full of hanging baskets. Fields in every direction. Sheep. A cow, staring. Aunt Ros is waving from the gate in her wellies, with a flask of tea and a hug ready. A whole week of half term on the farm. No phone signal. Brilliant.',
      choices: [
        { t: 'Run and hug Aunt Ros', next: 'farm',
          o: 'She smells of flour and woodsmoke, exactly like you remember. “Look at the size of you!” she says. “Tilly’s been counting the days. She’s made you a sign.”' },
        { t: 'Buy a comic from the kiosk', next: 'farm',
          o: 'The kiosk lady peers at you over her glasses. “Hollowmere Farm? Lovely. Mind the bells up there, duck.” You ask what bells. She just goes quiet, tilts her head as if she’s listening for something, and gives you your change.' },
        { t: 'Help carry the shopping', gain: 'flapjack', next: 'farm',
          o: 'There’s a tin on top of the bags. “Flapjacks,” says Aunt Ros. “One’s yours. Don’t tell Tilly.” You tuck it into your pocket for later.' }
      ]
    },

    farm: {
      act: 'Act I · Half Term', title: 'Hollowmere Farm', time: 'FRI 17:02', mood: 'day', img: 'farmyard',
      text: 'The Land Rover bumps into the yard. There’s the old stone farmhouse, a red barn, chickens everywhere, and a hand-painted sign on the gate: WELCOME COUSIN!!! Tilly flies out of the door with Shep the collie at her heels. She’s eleven, talks at a hundred miles an hour, and has already named every lamb.',
      choices: [
        { t: 'Bottle-feed the lambs with Tilly', next: 'kitchen',
          o: 'The lambs nearly knock you over. Tilly introduces them all: Pickle, Duchess, Mr Biscuits, Steve. “Steve’s my favourite,” she says. “Steve is the worst.” You’re both laughing so hard you can’t breathe.' },
        { t: 'Help Uncle Gareth in the barn', gain: 'torch', next: 'kitchen',
          o: 'Uncle Gareth hands you a heavy rubber torch. “Keep that in your room. Lights go out a lot round here.” You say it must be the old wiring. He doesn’t answer. He just goes back to his tractor.' },
        { t: 'Throw a ball for Shep', next: 'kitchen',
          o: 'Shep is the best dog in the world, and he knows it. On the sixth throw he doesn’t fetch. He stands stock still, staring up at the burnt-out ruin on the hill, with every hair on his back standing up.' }
      ]
    },

    kitchen: {
      act: 'Act I · Half Term', title: 'Supper', time: 'FRI 19:30', mood: 'golden', img: 'kitchen',
      text: 'Shepherd’s pie, the Aga ticking, the radio on low. Uncle Gareth tells terrible jokes and Tilly groans at every one. Above the back door, on a nail, hangs a little silver medal on a chain. “St Wenna,” says Aunt Ros. “Patron saint of Hollowmere. Every house has one. Old tradition.”',
      choices: [
        { t: 'Ask about the medal', gain: 'medal', next: 'bedfri',
          o: '“Your great-gran’s,” Aunt Ros says. She lifts it off the nail and hangs it round your neck. “You’re family. Keep it on.” Uncle Gareth stops chewing. For a second nobody says anything at all.' },
        { t: 'Ask about the ruin on the hill', next: 'bedfri',
          o: '“Old chapel,” says Uncle Gareth. “Burned down in 1923. The floor’s rotten, so keep off it.” Then he asks who wants pudding, a bit too loudly, and Aunt Ros starts clearing plates.' },
        { t: 'Have seconds, and thirds', gain: 'scone', next: 'bedfri',
          o: '“Good appetite,” says Uncle Gareth, approvingly. Aunt Ros wraps a jam scone in a napkin and slips it to you. “For midnight,” she winks. “Everyone gets peckish at Hollowmere.”' }
      ]
    },

    bedfri: {
      act: 'Act I · Half Term', title: 'The Spare Room', time: 'FRI 22:10', mood: 'golden', img: 'bedroom',
      text: 'The spare room is all patchwork quilt and sloping ceiling, with a window that looks up at the hill. Tilly’s room is next door. She’s left a walkie-talkie on your pillow with a note: CHANNEL 3. OVER AND OUT!!',
      choices: [
        { t: 'Chat to Tilly on the walkie-talkie', next: 'carboot',
          o: '“Cousin, come in, cousin. Over.” You talk rubbish for ages, until she yawns. Just before you switch off, through the static, a man’s voice says “over” in a low, pleased sort of way. Probably a lorry driver on the same channel.' },
        { t: 'Read until you fall asleep', next: 'carboot',
          o: 'You sleep like a log. Country air, Aunt Ros says in the morning. Nothing like it.' },
        { t: 'Look out at the hill', next: 'carboot',
          o: 'Moonlight on the fields. Up in the black ruin of the chapel, a tiny light flickers, like a single candle. You blink, and it’s gone. Somebody walking a dog, probably. At eleven at night. Up a hill.' }
      ]
    },

    carboot: {
      act: 'Act I · Half Term', title: 'Car Boot on the Green', time: 'SAT 09:40', mood: 'day', img: 'carboot',
      text: 'Saturday is the car boot sale on the village green. Bunting, a brass band, a hundred car boots full of old jigsaws and lamps and lawnmowers. Tilly has five pounds and is going to spend every penny. At the very end of the row, on a grey blanket, an old man sits beside one single thing: a small brass bell.',
      choices: [
        { t: 'Rummage through the bric-a-brac', gain: 'mirror', next: 'greyman',
          o: 'You find a pretty hand mirror with a silver back. Ten pence. “That came out of the old vicarage,” the lady says. “Lovely glass. Shows you as you really are.” When you turn round, Tilly’s already run off to the man in grey.' },
        { t: 'Head for the cake stall', gain: 'scone', next: 'greyman',
          o: 'The WI ladies load you up with a jam scone the size of your fist. While you’re paying, you lose sight of Tilly. Then you spot her, kneeling at the grey blanket.' },
        { t: 'Follow Tilly to the man in grey', next: 'greyman',
          o: 'Tilly makes a beeline for him, like she’s being pulled on a string.' }
      ]
    },

    greyman: {
      act: 'Act I · Half Term', title: 'The Man in Grey', time: 'SAT 10:05', mood: 'day', img: 'greyman',
      text: 'He is very tall and very polite: grey suit, grey hat, grey gloves. His face is smooth and grey and very still, like a face in an old photograph. He has no mouth that you can see, but you hear every word. Tilly is already holding the bell in both hands. “Fifty pence, young lady,” he says. “It’s very old. It only wants to be rung.”',
      choices: [
        { t: 'Tell Tilly not to buy it', next: 'village',
          o: 'Tilly sulks. The man just tilts his head, as if listening to something far away, and folds her fingers round the bell. “Then it’s a gift.” You look down for one second, at your shoes. When you look back up, the blanket is empty, and he’s gone.' },
        { t: 'Ask him where it came from', next: 'village',
          o: '“From up on the hill,” he says. “It’s been waiting a very long time. Like me.” He leans down close to you. His breath smells of struck matches.' },
        { t: 'Pay for it yourself, for Tilly', next: 'village',
          o: 'Tilly hugs you so hard she nearly knocks you over. The man takes your coin and gives you back a different one as change. It’s hot. Burning hot. You drop it in the grass, and when you look for it, it’s gone.' }
      ]
    },

    village: {
      act: 'Act I · Half Term', title: 'Hollowmere Village', time: 'SAT 11:30', mood: 'day', img: 'village',
      text: 'Hollowmere is chocolate-box pretty: a duck pond, a pub with hanging baskets, and the old church of St Wenna’s behind its lychgate. The vicar, Reverend Pryce, wobbles past on a bicycle and rings her bike bell at you. Then she sees what Tilly is holding, and brakes so hard she nearly comes off.',
      choices: [
        { t: 'Show the Reverend the bell', gain: 'warned', next: 'evening',
          o: 'All the colour leaves her face. “Where did you get that?” She looks up at the hill. “Listen to me. Never ring it. Not three times. Promise.” She writes her number on the back of a church leaflet and presses it into your hand.' },
        { t: 'Feed the ducks with Tilly', next: 'evening',
          o: 'You throw bread. Tilly throws bread. Every duck on the pond turns at once and swims as far away from her as it can get. “Rude,” says Tilly, and laughs. You laugh too. Sort of.' },
        { t: 'Have a look inside the church', gain: 'candle', next: 'evening',
          o: 'Cool, quiet, smelling of old hymn books. There’s a box of beeswax candles by the door: TAKE ONE, LIGHT ONE. You take one and forget to light it. On the wall is a list of vicars. One name has been scratched out: REV. T. ASHBY, 1919–1923.' }
      ]
    },

    evening: {
      act: 'Act I · Half Term', title: 'Bedtime', time: 'SAT 21:00', mood: 'dusk', img: 'tilly_bell',
      text: 'Tilly has put the bell on her bedside table, between her nightlight and a photo of Shep. She’s in her pyjamas and very pleased with herself. “Watch,” she says. “It’s a dinner bell. For the fairies.” She lifts it up by its little black handle.',
      choices: [
        { t: 'Grab it before she rings it', next: 'night1',
          o: 'Too slow. Ding. One clear note that goes on far, far too long. You take it off her and put it on top of her wardrobe. Tilly huffs and turns over. In the kitchen below, Shep starts to whine.' },
        { t: 'Let her. What’s the harm?', next: 'night1',
          o: 'Ding. Ding. Ding. Three bright notes. The nightlight flickers. Somewhere very far off, up on the hill, a much bigger bell answers. Once. Twice. Three times. “Ooh,” says Tilly sleepily. “An echo.”' },
        { t: 'Ring it once yourself, for a joke', next: 'night1',
          o: 'You ring it. The note goes into your teeth, into your bones. Every light in the house dims at once. Shep howls from the kitchen like he’s been stepped on. Tilly giggles. “Now it knows you too,” she says. You don’t know why she’d say that.' }
      ]
    },

    /* ───────────── ACT II · SOMETHING IN THE HOUSE ───────────── */

    night1: {
      act: 'Act II · Something in the House', title: '3:03', time: 'SUN 03:03', mood: 'night', img: 'foot_of_bed', sfx: 'bell',
      text: 'You wake up all at once. Your watch says 3:03. Somewhere in the house, a little bell is ringing. Then it stops. Tilly is standing at the foot of your bed in her nightie, with her back to you, facing the wall. She is whispering. It sounds like counting, but the numbers are wrong.',
      choices: [
        { t: 'Say her name, softly', next: 'breakfast',
          o: 'The whispering stops. Slowly, Tilly turns round. Her eyes are open, but not looking at anything. “He’s come for tea,” she says, in a voice much too deep for her. Then she yawns like a normal sleepy kid, and pads back to her room.' },
        { t: 'Pull the covers over your head', next: 'breakfast',
          o: 'You count to a hundred. When you dare to peek, she’s gone. There are small damp footprints on the carpet, leading to the wall. And then up the wall. And across the ceiling. You don’t sleep again.' },
        { t: 'Follow her when she walks out', next: 'breakfast',
          o: 'She walks downstairs, unbolts the back door, and stands barefoot in the yard, staring up at the chapel ruin. Shep is under the kitchen table, shaking. You lead her back to bed. Her hand is as cold as a tap.' }
      ]
    },

    breakfast: {
      act: 'Act II · Something in the House', title: 'Off Colour', time: 'SUN 08:30', mood: 'golden', img: 'breakfast',
      text: 'Breakfast is almost normal. Bacon, toast, Radio 2. But the milk has gone sour in the jug overnight, and the flies on the window are all dead. Tilly comes down last. She doesn’t eat a thing. She calls Aunt Ros “the woman”, and stares at you the whole time, humming one low note under her breath.',
      choices: [
        { t: 'Tell Aunt Ros about last night', next: 'sunday',
          o: '“Oh, she’s always sleepwalked,” says Aunt Ros, buttering toast. But when you mention the bell, she goes very quiet. She takes it from Tilly’s room and shuts it in the dresser drawer. Later, you see it back on Tilly’s bedside table.' },
        { t: 'Sit down next to Tilly', dmg: 1, next: 'sunday',
          o: '“Ten,” she says, very quietly. “Nine. Eight.” She digs her nails into your wrist until it bleeds, counting all the way down to one. Then she blinks, and asks you to pass the jam, like nothing happened at all.' },
        { t: 'Check on Shep in the yard', gain: 'shep', next: 'sunday',
          o: 'Shep won’t come back in the house. He presses himself against your legs and whimpers. When you go back inside, he follows you, glued to your side, and growls at Tilly’s door. From now on, he won’t leave you.' }
      ]
    },

    sunday: {
      act: 'Act II · Something in the House', title: 'Alone', time: 'SUN 11:00', mood: 'dusk', img: 'farm_grey',
      text: 'The phone rings. A neighbour’s ewe is in trouble, and Uncle Gareth will be gone all night. Then Aunt Ros says her head is splitting, and goes upstairs to lie down. Upstairs, Tilly is singing a hymn. Backwards. You need answers before dark. You need the Reverend.',
      choices: [
        { t: 'Cycle down the lane to the church', next: 'church',
          o: 'Wind in your face, hedges flashing by. In every field you pass, every sheep has stopped eating. Every single one has turned its head to watch you go.' },
        { t: 'Take the shortcut over the hill', next: 'ruin',
          o: 'The path up the hill goes right past the chapel ruin. It’s broad daylight, you tell yourself. Nothing happens in daylight.' },
        { t: 'Phone the Reverend', need: 'warned', next: 'church',
          o: 'She answers on the first ring, as if she was waiting. “It’s been rung, hasn’t it,” she says. It isn’t a question. “Come now. Quickly.”',
          fail: { o: 'You don’t have her number. You don’t even know her name. You’ll have to cycle down there.', next: 'church' } }
      ]
    },

    ruin: {
      act: 'Act II · Something in the House', title: 'The Ruin on the Hill', time: 'SUN 11:40', mood: 'dusk', img: 'ruin_day',
      text: 'Blackened walls with no roof. Nettles taller than you. In the stumpy tower is an empty wooden frame where a bell used to hang. A stone font full of rainwater. And in the middle of the scorched floor, carved deep into the stone, a perfect circle.',
      choices: [
        { t: 'Look up at the empty bell frame', next: 'church',
          o: 'A plaque, green with age: BELL OF ST WENNA. SILENCED 1923. LET NONE RING IT. The wooden frame is covered in scratches. Long ones. They’re on the inside, as if something was trying to get out.' },
        { t: 'Dip your hand in the font', dmg: 1, next: 'church',
          o: 'The rainwater hisses against your skin, hot as a kettle. You yank your hand out, red raw. The water in the font is rippling, although there isn’t any wind.' },
        { t: 'Step into the carved circle', scare: 'grey', next: 'church',
          o: 'The second your foot touches it, the birds stop singing. And he is there, in the doorway: the man in grey, perfectly still, his head tilted as if he’s listening to your heart. You run. You don’t stop running until you reach the church.' }
      ]
    },

    church: {
      act: 'Act II · Something in the House', title: 'St Wenna’s', time: 'SUN 12:30', mood: 'dusk', img: 'church_in',
      text: 'Reverend Pryce locks the church door behind you. “In 1923,” she says, “a girl at Hollowmere Farm rang that bell three times, and something came through. The vicar, Reverend Ashby, trapped it inside the bell using its own true name. That same night the chapel burned. If the bell’s been rung again, it’s out. And it’s inside Tilly.”',
      choices: [
        { t: 'Fill a jar from the font', gain: 'water', next: 'attic',
          o: '“Holy water,” she says, screwing the lid on tight. “It won’t kill it, but it hates it. And you need Ashby’s journal. All his things went to the farm attic when the vicarage was cleared. Find its name. Go before dark.”' },
        { t: 'Take a blessed candle', gain: 'candle', next: 'attic',
          o: 'She blesses it with her hand flat on top. “Light it, and it can’t stand near you for long. And you need Ashby’s journal. His things went up in the farm attic. Find its name. Go before dark.”' },
        { t: 'Beg her to come back with you', gain: 'medal', next: 'attic',
          o: 'She tries. Her car won’t start. Nobody’s car in the village will start. So she takes the little silver medal from her own neck and puts it over your head. “St Wenna will look after you. Ashby’s journal is in your attic. Find the name. Go.”' }
      ]
    },

    attic: {
      act: 'Act II · Something in the House', title: 'The Attic', time: 'SUN 15:30', mood: 'night', img: 'attic',
      text: 'The house is silent. Aunt Ros is asleep, so deeply asleep that you can’t wake her. You pull down the attic ladder. Up here it’s pitch black and freezing: old suitcases, a rocking horse, and three wooden trunks stencilled VICARAGE.',
      choices: [
        { t: 'Search with the torch', need: 'torch', gain: 'journal', next: 'ros',
          o: 'The beam picks out the trunks one by one. In the bottom of the last one, wrapped in an altar cloth, is a scorched leather journal: Rev. T. Ashby. On one page, in shaky ink: “Its name is VASS—” and the rest is burnt away. Underneath: “It hides its name in the bell. Read the bell in a glass.”',
          fail: { o: 'You can’t see a thing. You crack your head on a beam and see stars instead. You’ll have to feel around for it.', dmg: 1, next: 'attic' } },
        { t: 'Feel around in the dark', gain: 'journal', dmg: 1, next: 'ros',
          o: 'Your fingers find a leather book in a trunk. Then something finds your fingers. Small, cold, and very definitely a hand. It holds on for a long moment. Then it lets go. You fall down the ladder, clutching the journal.' },
        { t: 'Leave it. Check on Tilly first', next: 'ros',
          o: 'You back down the ladder. Up in the dark behind you, the rocking horse begins to rock. Creak. Creak. Creak.' }
      ]
    },

    ros: {
      act: 'Act II · Something in the House', title: 'Aunt Ros', time: 'SUN 17:10', mood: 'night', img: 'ros_asleep',
      text: 'You look in on Aunt Ros. She’s lying perfectly straight on top of the covers, hands folded on her chest, still in her apron. She is breathing, very slowly. And she is humming. One low, steady note, the note the bell makes. It isn’t her voice at all.',
      choices: [
        { t: 'Shake her and shout', dmg: 1, next: 'tillydoor',
          o: 'Her eyes stay shut. Her hand shoots up and grips your wrist, hard as a vice. “Go to bed,” she says, in the man’s voice. “The guest is resting.” She lets go, and is still again.' },
        { t: 'Take the torch from her bedside', gain: 'torch', next: 'tillydoor',
          o: 'There’s a torch by the bed, for power cuts. You lift it very carefully. The humming stops. Her head turns towards you, eyes still shut. She knows you took it. She doesn’t seem to mind.' },
        { t: 'Tuck her in and creep out', next: 'tillydoor',
          o: 'You pull the blanket over her. “Thank you, dear,” she whispers, in her own voice, very small and very far away. A tear runs down the side of her face. Then the humming starts again.' }
      ]
    },

    tillydoor: {
      act: 'Act II · Something in the House', title: 'Tilly’s Door', time: 'SUN 18:00', mood: 'dusk', img: 'door_tilly',
      text: 'The light outside is going. Behind Tilly’s door, someone is humming the brass band tune from the car boot sale. Under that, a slow scratching, like nails on wood. A drawing slides out under the door. It’s you, in crayon. You haven’t got a face.',
      choices: [
        { t: 'Knock and say her name', next: 'tillytalk',
          o: '“Come in, cousin,” says a sweet voice. “We’ve been expecting you.” We. The door swings open on its own.' },
        { t: 'Go straight in', scare: 'tilly', dmg: 1, next: 'tillytalk',
          o: 'She’s right behind the door. Face to face, so close your noses touch. Her eyes are wide open, but she’s fast asleep, and she’s humming the bell’s note so low that the hinges rattle. Then she screams in your face. It is not a little girl’s scream.' },
        { t: 'Slide the medal under the door', need: 'medal', next: 'tillytalk',
          o: 'The scratching stops. A small, real, frightened voice whispers: “Cousin? It’s cold in here. He’s sitting on me. He keeps the bell under my pillow.” Then the medal comes shooting back out, red hot. You hang it back round your neck.',
          fail: { o: 'You’ve got nothing to slide under. The humming gets louder and happier. The door opens on its own.', next: 'tillytalk' } }
      ]
    },

    tillytalk: {
      act: 'Act II · Something in the House', title: 'The Guest', time: 'SUN 18:20', mood: 'under', img: 'tilly_guest',
      text: 'Tilly sits on her bed with her hands folded, just like her mum. Grey skin. Eyes shut, but her face turns to follow you wherever you move. Her head is tilted, listening. “Hello again,” it says, very politely. “I am the guest. I am staying. The woman won’t wake until I say so, and the man won’t come home tonight. Shall we be friends?”',
      choices: [
        { t: 'Ask what it wants', next: 'storm',
          o: '“A bigger house,” it says, and looks you up and down, slowly, like you’re a coat in a shop window. “This one is too small. You’ll do nicely.”' },
        { t: 'Order it to leave her alone', dmg: 1, next: 'storm',
          o: 'It laughs in five voices at once. Tilly’s nose starts to bleed. Then yours does. Every picture on the walls falls down. The door slams in your face and won’t open again.' },
        { t: 'Splash it with holy water', need: 'water', next: 'storm',
          o: 'It shrieks and claws at its face, and for one second it’s just Tilly, terrified: “Help me! It’s in the bell! Break the bell!” Then the door throws you out onto the landing and slams shut.',
          fail: { o: 'You reach into your pocket for something, anything. Nothing. It hums one low note. “Oh dear,” it says, and the door slams in your face.', dmg: 1, next: 'storm' } }
      ]
    },

    /* ───────────── ACT III · THE GUEST ───────────── */

    storm: {
      act: 'Act III · The Guest', title: 'The Power Goes', time: 'SUN 22:00', mood: 'night', img: 'storm', sfx: 'thunder',
      text: 'The storm rolls in after dark. At ten o’clock every light in the house goes out. The phone is dead. The radio hisses. Upstairs, the little bell starts to ring. Then it stops. And Tilly’s voice calls down the stairs, sweet as anything: “Cousin… come up and play.”',
      choices: [
        { t: 'Go up with the torch', need: 'torch', next: 'landing',
          o: 'The beam shakes. Every step creaks your name. You keep going.',
          fail: { o: 'You go up in total darkness, one hand on the wall. Halfway, something on the stairs grabs your ankle and pulls. You hit the steps hard. It giggles and lets go.', dmg: 1, next: 'landing' } },
        { t: 'Light the church candle', need: 'candle', next: 'landing',
          o: 'The flame is small and steady and very gold. Upstairs, the giggling stops. Something in the dark doesn’t like it. Good.',
          fail: { o: 'You fumble for a candle you don’t have. In the dark, something laughs at you. You go up blind, and bark your shins on every stair.', dmg: 1, next: 'landing' } },
        { t: 'Run out of the house', next: 'lane',
          o: 'You yank open the front door and run out into the rain.' }
      ]
    },

    lane: {
      act: 'Act III · The Guest', title: 'The Lane', time: 'SUN 22:09', mood: 'night', img: 'lane',
      text: 'Rain like gravel. Mud to your ankles. Behind you, every window in the farmhouse is lit, even though the power is off. In front of you, at the end of the lane, standing under the dripping trees, is a tall figure in grey. Holding its hat politely in both hands.',
      choices: [
        { t: 'Climb the fence and run for the village', next: 'end_lane',
          o: 'You run across the fields in the dark until your lungs burn, and you don’t look back. Not once.' },
        { t: 'Turn round. Go back for Tilly', dmg: 1, next: 'landing',
          o: 'You slip in the mud and come down hard on your knee. But you get up, and go back in, and up the stairs, because she’s your cousin.' },
        { t: 'Walk up and talk to him', fatal: true, scare: 'grey',
          o: 'He tips his hat back as you come close. There is no face under the hat at all. Just the dark inside of a bell, swinging slowly, ringing very faintly. “Thank you for coming,” it says. “I was hoping it would be you.”' }
      ]
    },

    landing: {
      act: 'Act III · The Guest', title: 'The Landing', time: 'SUN 22:13', mood: 'night', img: 'landing',
      text: 'Wet footprints go up the wallpaper and across the ceiling. Every family photo on the landing has been turned round to face the wall. Tilly’s door is wide open. Her room is dark. From somewhere above your head, there’s a soft, wet clicking.',
      choices: [
        { t: 'Turn the photos back round', next: 'ceiling',
          o: 'In every photo, Tilly’s face has been scratched out with a pin. All except one. It’s a photo of you, standing in this landing, grey-skinned, eyes shut, head tilted, listening. You have never seen this photo. It hasn’t been taken yet.' },
        { t: 'Follow the footprints with your light', next: 'ceiling',
          o: 'Up the wall. Across the ceiling. Towards the light fitting. And stopping. Right. Above. You.' },
        { t: 'Call for Aunt Ros', dmg: 1, next: 'ceiling',
          o: 'Aunt Ros’s door opens a crack. She is standing behind it, eyes shut, still humming. “Shhh,” she says, and pushes her finger very hard against your lips. Then she shuts the door. Your lip is bleeding.' }
      ]
    },

    ceiling: {
      act: 'Act III · The Guest', title: 'Up There', time: 'SUN 22:20', mood: 'blood', img: 'ceiling', scare: 'ceiling',
      text: 'Tilly is on the ceiling. Flat against it, upside down, fingers and toes spread like a spider, her long hair hanging down to brush your face. Her head turns. All the way round. “Found you,” she says.',
      choices: [
        { t: 'Hold up the St Wenna medal', need: 'medal', next: 'tillyroom',
          o: 'The medal flares white. The thing drops off the ceiling like a sack and scuttles backwards into Tilly’s room, hissing like a cat. For a second you hear Tilly’s real voice: “The bell! Under my pillow!”',
          fail: { o: 'You have nothing to hold up. It drops onto you. Cold hands, cold breath, a mouth at your ear counting backwards. Then it laughs and skitters off into the bedroom.', dmg: 1, next: 'tillyroom' } },
        { t: 'Stand still. Don’t look up', dmg: 1, next: 'tillyroom',
          o: 'It drops right in front of you, nose to nose, and breathes in your face. It smells of struck matches. It licks your cheek, and laughs, and crawls away into Tilly’s room on all fours.' },
        { t: 'Shout for Shep', need: 'shep', next: 'tillyroom',
          o: 'Shep comes up the stairs like a rocket, barking his head off. The thing hisses and skitters backwards into the bedroom. Shep plants himself between you and the door. Good boy. Best boy.',
          fail: { o: 'You shout for the dog. No dog comes. Something else comes instead, down off the ceiling, very fast.', fatal: true, scare: 'demon' } }
      ]
    },

    tillyroom: {
      act: 'Act III · The Guest', title: 'Tilly’s Room', time: 'SUN 22:31', mood: 'blood', img: 'tillyroom',
      text: 'The room is wrecked. HUSH HUSH HUSH is scrawled all over the walls in crayon. Tilly crouches in the corner, rocking. The bell sits on her pillow, glowing faintly, humming. “Let’s make a deal, cousin,” it purrs. “Ring my bell once more, and I’ll leave the girl alone. I’ll go into the woman downstairs instead. Fair?”',
      choices: [
        { t: 'Snatch the bell off the pillow', gain: 'bell', dmg: 1, next: 'reflect',
          o: 'It’s so cold it burns. Your skin sticks to the brass. Tilly screams like you’ve torn off her arm. Every window in the room cracks at once.' },
        { t: 'Accept the deal and ring it', next: 'end_rung',
          o: 'Just once. To save Tilly. You lift the bell. Ding. And the thing in the corner opens its eyes for the very first time. “Thank you,” it says. “That was the invitation.”' },
        { t: 'Pour holy water on the bell first', need: 'water', gain: 'bell', next: 'reflect',
          o: 'The bell spits and smokes and goes quiet. When you pick it up, it’s only cold, not burning. Tilly slumps over. The thing inside her howls in pain.',
          fail: { o: 'You have nothing to pour. You grab the bell barehanded. It burns like dry ice.', gain: 'bell', dmg: 1, next: 'reflect' } }
      ]
    },

    reflect: {
      act: 'Act III · The Guest', title: 'Back to Front', time: 'SUN 22:40', mood: 'under', img: 'bell_close',
      text: 'Inside the rim of the bell, letters are scratched into the brass. But they’re back to front, like mirror writing, and they wriggle when you try to read them. Behind you, the thing that is wearing Tilly is getting up off the floor.',
      choices: [
        { t: 'Read it in the hand mirror', need: 'mirror', gain: 'name', next: 'hill',
          o: 'In the little mirror, the letters stop wriggling and line up neatly. V-A-S-S-H-A-E-L. In the glass, behind your shoulder, you glimpse what is really in the room with you. You don’t look again. You run, with the bell and the name.',
          fail: { o: 'You don’t have a mirror. The letters squirm away from your eyes. The thing is standing up now. You run.', next: 'hill' } },
        { t: 'Read it in the black window', gain: 'name', dmg: 1, scare: 'reflection', next: 'hill',
          o: 'Your reflection reads the name out to you, slowly: Vasshael. Then your reflection’s mouth falls open, wide and round, and a bell tolls from somewhere deep inside it, and the window cracks right across your face. You run, with the bell and the name.' },
        { t: 'Forget the writing. Just run', next: 'hill',
          o: 'Down the stairs, out the door, into the storm, the bell clutched to your chest. The chapel. Ashby trapped it at the chapel. You have to get to the chapel.' }
      ]
    },

    hill: {
      act: 'Act III · The Guest', title: 'The Hill', time: 'SUN 23:40', mood: 'night', img: 'hill', sfx: 'thunder',
      text: 'Lightning. The chapel ruin flashes white at the top of the hill. You climb with the bell under your coat. Behind you, down in the yard, the back door bangs open. Something comes out on all fours, fast and low, and starts up the hill after you.',
      choices: [
        { t: 'Sprint straight up the path', dmg: 1, next: 'chapel',
          o: 'You fall three times. The third time, hands grab your coat from behind and you tear free, leaving it behind. You reach the top shaking and bleeding.' },
        { t: 'Go through the sheep field', next: 'chapel',
          o: 'All the sheep are standing in a ring, in the rain, staring. They close up behind you, shoulder to shoulder. The thing behind you shrieks with rage. It can’t get through. Thank you, Steve.' },
        { t: 'Let Shep lead the way', need: 'shep', next: 'chapel',
          o: 'Shep knows every inch of this hill. He takes you up a hidden sheep track in the dark, and you reach the top long before the thing does.',
          fail: { o: 'You whistle for a dog you haven’t got. Nothing comes, except the thing behind you. You run for it, and it catches your heel.', dmg: 1, next: 'chapel' } }
      ]
    },

    chapel: {
      act: 'Act III · The Guest', title: 'Hollowmere Chapel', time: 'SUN 23:59', mood: 'blood', img: 'chapel_night', sfx: 'bell',
      text: 'The ruin, at midnight. Rain hissing on the scorched stone. The old font, full to the brim. The carved circle, glowing faintly red. Tilly crawls in over the broken wall and stands up, too tall, jerked upright like a puppet. Behind her, the shadow on the wall is not a little girl’s shadow at all.',
      choices: [
        { t: 'Say its true name', need: 'name', next: 'finale',
          o: '“VASSHAEL.” The word comes out of you like a shout in church. The rain stops in mid-air. Tilly falls down in a heap. And the shadow on the wall peels itself off the stone, and stands up.',
          fail: { o: 'You open your mouth, but you don’t know its name. “I know yours,” it says, and it says your name, and you feel it like a hand on your heart, squeezing.', dmg: 1, next: 'chapel' } },
        { t: 'Seal the bell with holy water and wax', need: ['water', 'candle'], next: 'end_bound',
          o: 'You fill the bell with holy water, and drip candle wax over its mouth until it’s sealed shut. The thing in Tilly screams and screams as it’s pulled, kicking, back inside the brass. Then it’s quiet.',
          fail: { o: 'You don’t have what you need. You try anyway, scooping rainwater into the bell with your hands. It just laughs, and the water boils away.', dmg: 1, next: 'chapel' } },
        { t: 'Offer yourself instead of Tilly', next: 'end_guest',
          o: '“Let her go,” you say. “Take me.” It stops. It tilts Tilly’s head. And it hums, pleased. “Gladly,” it says. “You have such a nice face.”' }
      ]
    },

    finale: {
      act: 'Act III · The Guest', title: 'Vasshael', time: 'MON 00:00', mood: 'blood', img: 'demon', scare: 'demon',
      text: 'It fills the ruin. Horns like a ram. A grey suit stretched over something huge. Where its face should be, a great cracked bell, swinging, and above it eyes, far too many eyes. “Who told you my name?” it roars. It isn’t polite any more. It reaches for you with long grey fingers.',
      choices: [
        { t: 'Do what Ashby wrote: smash the bell on the font', need: 'journal', next: 'end_hush',
          o: 'You remember the burnt page: break the bell where it was blessed. You swing the bell down onto the edge of the stone font with everything you’ve got. CRACK. The bell splits in two. A sound like every bell in the world ringing at once.',
          fail: { o: 'You smash the bell on the stones, again and again. It doesn’t even dent. You don’t know how it’s meant to be done. It laughs, and its fingers close round your arm.', dmg: 1, next: 'finale' } },
        { t: 'Light the candle and say its name three times', need: 'candle', next: 'end_bound',
          o: '“Vasshael. Vasshael. Vasshael.” The candle flame stretches up, tall and white. The demon shrinks, roaring, twisting, pulled down like water down a plughole, back into the little brass bell. The bell drops into the grass. Silence.',
          fail: { o: 'You have no light to hold up against it. You say its name three times anyway, into the dark. It just says yours back.', dmg: 1, next: 'finale' } },
        { t: 'Grab Tilly and run', fatal: true, scare: 'demon',
          o: 'You get three steps. Then the grey fingers close around both of you, and the ruin fills with the sound of a little brass bell, ringing and ringing and ringing.' }
      ]
    },

    /* ───────────── ENDINGS ───────────── */

    end_hush: {
      title: 'The Bell Breaks', time: 'MON 06:10', mood: 'day', img: 'dawn_farm',
      end: { kind: 'best', label: 'The best ending' },
      text: 'You wake in the ruin as the sun comes up, with Tilly asleep on your shoulder, her own face pink and normal and snoring. Two halves of a brass bell lie in the font. Shep is licking your ear. Down in the yard, Aunt Ros is running up the hill in her apron, shouting your names, and crying, and laughing. Uncle Gareth’s Land Rover comes bumping through the gate. The birds are singing. Up here, for the first time in a hundred years, it’s just a ruin.'
    },

    end_bound: {
      title: 'Sealed Again', time: 'MON 05:50', mood: 'golden', img: 'buried_bell',
      end: { kind: 'good', label: 'A good ending' },
      text: 'Tilly wakes up at dawn and asks why she’s on a hill. You don’t tell her. You and Reverend Pryce bury the bell six feet under the chapel floor, wrapped in an altar cloth. Half term ends. You go home. Every so often, when the house is very quiet, you think you hear something. A little bell, far away, very patiently, waiting.'
    },

    end_lane: {
      title: 'The Long Way Round', time: 'MON 01:30', mood: 'dusk', img: 'lane_dawn',
      end: { kind: 'bittersweet', label: 'A bittersweet ending' },
      text: 'You hammer on the vicarage door at half past one in the morning. By dawn, Reverend Pryce and half the village have marched up to the farm with torches. Tilly is found asleep in her bed, perfectly fine. She waves at you over breakfast. Everyone says she’s back to her old self. But she hums that tune now. Always the same one. And sometimes, when she thinks nobody is looking, she tilts her head and listens, to something you can’t hear.'
    },

    end_guest: {
      title: 'The New Guest', time: 'MON 00:13', mood: 'night', img: 'guest_you',
      end: { kind: 'bad', label: 'A bad ending' },
      text: 'Tilly is fine. Everybody says so. She’s back to herself by breakfast. You go home at the end of half term, and your mum says the country air has done you good, you look so well, you’re so calm now, so still. You are. You hum while you do your homework, the same low note, over and over. At night you stand at the foot of your little brother’s bed, and count, and the numbers are all wrong.'
    },

    end_rung: {
      title: 'Ring Once More', time: 'SUN 22:33', mood: 'night', img: 'rung',
      end: { kind: 'bad', label: 'A bad ending' },
      text: 'It leaves Tilly, just like it promised. It always keeps its promises, exactly. It doesn’t go into Aunt Ros. You rang the bell, after all. You were the one who invited it. The next morning, Tilly finds the bell back on her bedside table, and a note in your handwriting: Ring me any time, cousin. I’ll come.'
    }
  }
};
