/* NIGHTDOOR story: Leave It Open
   Isabel is ten. Every night the old wardrobe in her bedroom is open a little wider than she left it.
   An original creature: the Hanger.
   Signature: the gap. A wardrobe door that won't stay shut, a strip of black darker than the dark, and two
   eyes in it, bright as switched-on bulbs, that drink the light from the room (lamps dim, nightlights die,
   bulbs pop as they brighten). It hangs from the rail between the coats on a hook where its head should
   be, a flat cut-out of pure black with long, thin fingers. The creak of the door. Alarms that go off on
   their own when it moves: the smoke alarm, the burglar-alarm sensor blinking red in the corner of her
   room, and emergency alerts on Isabel's phone that nobody else ever gets, which start official and turn
   personal. The grown-ups never see it, and always have a reason: a test alert, a flat battery, a spider.
   It hates two things: real light, and being seen by a grown-up.
   Mechanics: phone emergency alerts, countdowns, hold-still, mash, a kitchen search, a landing door
   picker and the burglar-alarm keypad.
   Endings: best, good, bittersweet, and three bad. */
window.NIGHTDOOR = window.NIGHTDOOR || { stories: {} };

(function () {
  NIGHTDOOR.stories['leave-it-open'] = {
    id: 'leave-it-open',
    title: 'Leave It Open',
    tagline: 'Every night the wardrobe door is open a little wider. Every night it’s a little closer.',
    blurb: 'Isabel is ten, and she always shuts her wardrobe before bed. Always. But every night it creaks open again, just a crack, and in the crack there is a black that is blacker than the dark, and two eyes as bright as lightbulbs. Her phone keeps getting emergency alerts that nobody else gets. Mum and Dad say it’s nothing.',
    cover: 'cover_lio',
    lives: 3,
    start: 'start',
    startInv: ['phone', 'teddy'],
    frozen: '02:22$',
    death: {
      title: 'The Door Was Open',
      text: 'Too many mistakes. The nightlight dims, and dims, and goes out, and the only light left in the room is the two eyes coming across the carpet. On the bedside table, Isabel’s phone lights up one last time. EMERGENCY ALERT. Thank you for leaving it open.'
    },

    items: {
      phone:    { name: 'Isabel’s phone',     icon: '📱', desc: 'Mum’s old phone, no SIM, only works on the Wi-Fi. It shouldn’t be able to get emergency alerts. It gets them every night.' },
      teddy:    { name: 'Mr Buttons',         icon: '🧸', desc: 'A bear Gran made. One button eye, one sewn-on cross where the other button came off. He has slept next to you every night since you were born.' },
      photo:    { name: 'A photo of the gap', icon: '📸', desc: 'Black, black, black, and two white dots. It could be the flash bouncing off something. It isn’t.' },
      key:      { name: 'Wardrobe key',       icon: '🗝️', desc: 'Tiny, brass, warm from your hand. It fits the little lock on the wardrobe door.' },
      torch:    { name: 'Dad’s big torch',    icon: '🔦', desc: 'The heavy one from the kitchen drawer, for power cuts. It is the brightest thing in the house.' },
      biscuits: { name: 'Chocolate biscuits', icon: '🍪', desc: 'Smuggled from the tin. Tap to eat: restores 1 life.', heal: 1 },
      cocoa:    { name: 'Hot chocolate',      icon: '☕', desc: 'Mum made it to say sorry for not believing you. Tap to drink: restores 1 life.', heal: 1 },
      note:     { name: 'Note from the fridge', icon: '📝', desc: 'Dad’s handwriting: “NEW ALARM CODE = Izzy’s birthday. Day then month, 4 numbers. DON’T FORGET THIS TIME, MARK.”' },
      card:     { name: 'Gran’s birthday card', icon: '💌', desc: '“To my darling Isabel on your 10th birthday, 22nd of March. Lots of love, Gran xxx. P.S. Keep Mr Buttons close.”' },
      rule:     { name: 'Amara’s warning',    icon: '✏️', desc: 'Written on your hand in biro: LIGHTS. GROWN-UPS. It hates bright lights and it hates being SEEN by a grown-up.' },
      tape:     { hidden: true },
      filming:  { hidden: true },
      touched:  { hidden: true },
      armed:    { hidden: true },
      mumsaw:   { hidden: true }
    },

    nodes: {

      /* ───────────── ACT I · MONDAY NIGHT ───────────── */

      start: {
        act: 'Act I · Monday Night', title: 'The Gap', time: 'MON 23:47', mood: 'night', img: 'lio_crack', sfx: 'creak',
        alert: { kind: 'extreme', text: 'A hazard has been reported in your area. Stay indoors. Keep all doors closed.' },
        text: 'You shut the wardrobe before bed. You always do. But there it is: creeeak, and the door is open a finger’s width, and in the gap between your school coat and your dressing gown is a black that is blacker than the rest of the dark. Then two eyes switch on in it, like someone flicking on two bulbs. Your phone lights up on the bedside table.',
        choices: [
          { t: 'Pull the duvet over your head', next: 'duvet',
            o: 'You yank the duvet up and over and pull Mr Buttons in with you. In here it is hot and close and safe, the way it was when you were little. Out there, very slowly, the door creaks again.' },
          { t: 'Take a photo of it', gain: 'photo', next: 'mum_comes', scare: 's_lio_eyes',
            o: 'Your hands are shaking so much the first one is blurry. The second one flashes, and for one white instant you see it properly: no face, no body you can make sense of, just a flat black shape hanging between the coats, and the eyes, which do not blink at the flash. They get brighter. You scream for Mum.' },
          { t: 'Scream for Mum', next: 'mum_comes',
            o: 'You scream so loudly it hurts your throat. The eyes go out, click, click, like the lamp on the landing. On the landing, Mum’s feet thump out of bed.' }
        ]
      },

      duvet: {
        act: 'Act I · Monday Night', title: 'Under the Duvet', time: 'MON 23:49', mood: 'under', img: 'lio_duvet', sfx: 'creak',
        text: 'Under the duvet the only light is your phone, buzzing against your leg, and a thin line of yellow where the duvet doesn’t quite meet the mattress. Something blocks the yellow line. Something is standing by the bed. Don’t move. Don’t breathe. It can’t see you if you don’t move.',
        hold: {
          prompt: 'Keep completely still', label: 'Hold still', secs: 7, grace: 3,
          lines: ['Creeeak.', 'Something breathing that isn’t you.', 'The corner of the duvet lifts. Just a little.', 'Light. Bright light, leaking in at the corner.', 'The corner drops back down.', 'Creeeak. Click.'],
          ok: { o: 'The light goes. The wardrobe door clicks shut. You lie there, rigid, until your legs are shaking, and then you scream for Mum so loud the whole street must hear.', next: 'mum_comes' },
          fail: { o: 'You flinch. Just a twitch. The duvet is whipped back off your face and two blazing eyes are right there, an inch away, so bright you can feel them on your skin like sunburn. You scream. They’re gone.', dmg: 1, scare: 's_lio_peek', next: 'mum_comes' },
          late: { o: 'You can’t keep still. You’re shaking. The corner of the duvet lifts and the light pours in, bright, hot, getting closer. You scream for Mum and the light snaps off.', dmg: 1, scare: 's_lio_peek', next: 'mum_comes' }
        },
        choices: []
      },

      mum_comes: {
        act: 'Act I · Monday Night', title: 'It’s Just a Test', time: 'MON 23:52', mood: 'night', img: 'lio_room_lit',
        alert: { kind: 'test', text: 'This is a TEST of the emergency alert system. No action is required.' },
        text: 'The big light comes on. Mum’s in the doorway in her dressing gown, squinting. The wardrobe is shut. Just coats in there, she says. Then your phone goes again and she reads it over your shoulder. “See? It’s only a test. The government do them. Now go to sleep, Izzy, I’ve got work.”',
        choices: [
          { t: 'Make her look inside the wardrobe', next: 'night1',
            o: 'She sighs and opens it wide. School coat. Dressing gown. Your fairy costume from Year 3. Mum pushes them along the rail and the hangers clack. “Nothing. See?” She shuts it, firmly, and goes. She doesn’t notice what you notice: there is one more hanger on the rail than there should be, and it is swinging.' },
          { t: 'Show her the photo', need: 'photo', next: 'night1', gain: 'cocoa',
            o: '“That’s the flash bouncing off the mirror, sweetheart.” But she looks at it a beat too long. She goes downstairs and comes back with a hot chocolate, which she has never done on a school night. She leaves the landing light on.',
            fail: { o: 'You try to describe it. Black. Eyes. Bright. “You’ve been watching things on that phone again,” says Mum, and turns the big light off.', next: 'night1' } },
          { t: 'Beg to sleep in their bed', next: 'night1',
            o: '“You’re ten, Izzy. You’ve got your own lovely room.” She tucks you in, too tight, the way she did when you were small, kisses your forehead and switches the light off. In the dark, after she’s gone, the wardrobe creaks.' }
        ]
      },

      night1: {
        act: 'Act I · Monday Night', title: 'Wider', time: 'TUE 01:12', mood: 'night', img: 'lio_crack_wide', sfx: 'creakAlarm',
        timer: 9, timerLabel: 'It’s opening',
        timeout: { o: 'You’re too frightened to move. The door swings wider, slow as a yawn, and cold air rolls out over the carpet, and the eyes come closer to the gap. In the corner of the ceiling, the little red alarm light blinks and blinks and blinks. Then, at last, the door creaks shut again. You don’t sleep.', dmg: 1, scare: 's_lio_gap', next: 'morning' },
        text: 'Mum shut the wardrobe. You heard her. Now it’s open again, two fingers wide this time, and the eyes are back. In the corner of your ceiling, the little burglar-alarm sensor that has never once done anything starts blinking red, on, off, on, off, and downstairs the alarm box begins to beep.',
        choices: [
          { t: 'Jump out and slam it shut', next: 'slam',
            o: 'You’re out of bed before you can think about it. Three steps across the cold carpet. Your hands hit the wardrobe door and push.' },
          { t: 'Switch on your nightlight', next: 'morning', dmg: 1,
            o: 'The little moon-shaped nightlight glows. Then it dims. You watch the light drain out of it, slowly, the way water drains from a bath, and as it fades the eyes in the gap get brighter, and brighter, until the nightlight is dead and the eyes are blazing. It drank it. It drank the light. You stay awake until the sky goes grey.' },
          { t: 'Throw Mr Buttons at it', next: 'morning', lose: 'teddy',
            o: 'You throw him as hard as you can. He hits the door, the door bumps shut, and the eyes go out. It worked. You lie there, heart thumping, and wait for morning. In the morning Mr Buttons is not on the floor. He is not anywhere. When you open the wardrobe, there is a single brown button on the shelf.' }
        ]
      },

      slam: {
        act: 'Act I · Monday Night', title: 'Push', time: 'TUE 01:13', mood: 'blood', img: 'lio_push', sfx: 'alarm',
        text: 'The door is pushing back. Something on the other side is pushing back, not hard, almost playful, the way Dad does when you try to shut him out of the bathroom. Your feet are sliding on the carpet. The tiny key is in the lock, just under your hands. Push it shut and turn it.',
        mash: {
          prompt: 'Push the door shut', label: 'Push', taps: 18, secs: 5,
          ok: { o: 'The door thumps shut and you turn the little key, click, and pull it out and hold it so tight it digs into your palm. On the other side of the wood, something taps. Once. Twice. Then nothing. You take the key back to bed and hold it all night.', gain: 'key', next: 'morning' },
          fail: { o: 'Your feet slide out from under you. The door swings wide and something long and thin and black reaches out over your head, and the key falls out of the lock and away into the dark under the wardrobe. You scramble back into bed. The door creaks slowly back to a crack.', dmg: 1, scare: 's_lio_reach', next: 'morning' }
        },
        choices: []
      },

      /* ───────────── ACT II · TUESDAY ───────────── */

      morning: {
        act: 'Act II · Tuesday', title: 'Breakfast', time: 'TUE 07:41', mood: 'day', img: 'lio_kitchen',
        text: 'Dad’s cross because the burglar alarm went off at one in the morning. “Sensor in Izzy’s room,” he grumbles, “must be a spider.” He’s changed the alarm code AGAIN and stuck it on the fridge so he doesn’t forget. Look around the kitchen before school. There might be something here that helps tonight.',
        search: {
          prompt: 'Tap the kitchen to search it',
          spots: [
            { t: 'Note on the fridge', x: 64, y: 108, w: 92, h: 78, gain: 'note', o: 'Dad’s handwriting: NEW ALARM CODE = Izzy’s birthday. Day then month, 4 numbers. You pocket it. He’ll only lose it again.' },
            { t: 'The kitchen drawer', x: 246, y: 268, w: 128, h: 46, gain: 'torch', o: 'Under the takeaway menus and the batteries: Dad’s big black torch. It’s heavy, and when you test it, it makes a circle on the ceiling as bright as the sun.' },
            { t: 'Biscuit tin', x: 418, y: 196, w: 84, h: 62, gain: 'biscuits', o: 'Three chocolate biscuits go up your jumper. Emergency supplies.' },
            { t: 'Card on the windowsill', x: 548, y: 132, w: 66, h: 66, gain: 'card', o: 'Your birthday card from Gran, still up. To my darling Isabel on your 10th birthday, 22nd of March. P.S. Keep Mr Buttons close. Gran always knows things.' }
          ]
        },
        choices: [
          { t: 'Tell Dad about the eyes', next: 'school',
            o: '“Eyes,” says Dad, buttering toast. “In the wardrobe.” He points the butter knife at you. “That wardrobe was Gran’s. It’s a hundred years old. Old wood creaks, Izz. Old wood shifts.” He hasn’t looked at you once.' },
          { t: 'Check whether anyone else got the alerts', next: 'school',
            o: 'You ask Mum to check her phone. Nothing. Dad’s phone: nothing. You look it up: there have been no emergency alerts sent anywhere in the country this year. Your phone doesn’t even have a SIM card in it.' },
          { t: 'Ask Dad to take the wardrobe away', next: 'school',
            o: '“It’s your Gran’s, love. It’s worth a fortune.” Then, because you’re nearly crying: “Saturday. I’ll look at it Saturday.” It’s Tuesday.' }
        ]
      },

      school: {
        act: 'Act II · Tuesday', title: 'Silent Mode', time: 'TUE 11:20', mood: 'day', img: 'lio_school',
        alert: { kind: 'severe', text: 'ISABEL. Come home soon. We left it open for you.' },
        text: 'Maths. Your phone is meant to be off. It’s off. It goes off anyway, in your bag, loud enough that the whole class turns round, and Mrs Okafor holds out her hand for it. Before you give it up you read the screen. Amara, next to you, reads it too, and goes very quiet.',
        choices: [
          { t: 'Ask Amara what she knows', gain: 'rule', next: 'dusk',
            o: 'At break she pulls you behind the PE shed. Her cousin had one, she whispers. In a cupboard. “They hate bright light. Proper bright, not a little lamp, they just drink little lamps. And they hate being seen. By grown-ups. That’s why grown-ups never see them. They make sure.” She writes LIGHTS. GROWN-UPS. on your hand in biro.' },
          { t: 'Reply to the alert', next: 'dusk',
            o: 'Under the desk you type: WHO IS THIS. You hit send even though you can’t reply to emergency alerts. The phone buzzes straight back. EMERGENCY ALERT. You know who. Then Mrs Okafor takes it.' },
          { t: 'Hand it over and try to forget it', next: 'dusk',
            o: 'Mrs Okafor puts it in her drawer. All through the lesson it buzzes in there, every few minutes, until she takes it out, frowning, and switches it off properly. It keeps buzzing.' }
        ]
      },

      dusk: {
        act: 'Act II · Tuesday', title: 'Getting Ready', time: 'TUE 19:45', mood: 'dusk', img: 'lio_dusk',
        text: 'Bedtime’s coming, and the sky outside is going purple, and the wardrobe is just a wardrobe. Big, dark wood, a carved crown on top, the little brass lock. Mum and Dad are watching telly downstairs. You’ve got time to do one thing before lights out.',
        choices: [
          { t: 'Tape the wardrobe shut with Dad’s parcel tape', gain: 'tape', next: 'night2',
            o: 'Round and round, across the doors, over the handles, until it looks like a parcel. Half a roll. You stand back. Nothing is getting out of that.' },
          { t: 'Prop your phone up to film the wardrobe all night', gain: 'filming', next: 'night2',
            o: 'You wedge the phone between two books on your desk, pointed at the wardrobe, and press record. If it happens tonight, there’ll be proof. Proper proof.' },
          { t: 'Ask Dad to leave every light on', next: 'night2',
            o: '“Do you know what electricity costs, Izz?” He leaves the landing light on, which is something. At eleven you hear him come up and switch it off.' }
        ]
      },

      night2: {
        act: 'Act II · Tuesday Night', title: 'Don’t Look', time: 'TUE 23:59', mood: 'night', img: 'lio_night2', sfx: 'smoke',
        alert: [
          { kind: 'extreme', text: 'Do not look at the wardrobe.' },
          { kind: 'extreme', text: 'Isabel. Do not look at the wardrobe.' }
        ],
        text: 'The smoke alarm on the landing starts chirping. Then the burglar-alarm sensor is blinking red again. Then your phone, twice. And from the wardrobe, a tiny click: the little lock, turning from the inside. Don’t look. Squeeze your eyes shut and don’t look until it stops.',
        hold: {
          prompt: 'Keep your eyes shut', label: 'Don’t look', secs: 8, grace: 3,
          lines: ['Click.', 'Creeeak.', 'Light through your eyelids, orange, getting brighter.', 'It’s right by the bed.', 'Something cold touches your cheek, very gently. Like a finger.', 'Dad’s voice on the landing: “Bloody smoke alarm!”'],
          ok: { o: 'You keep your eyes shut so tight you see stars. Dad’s footsteps come thumping along the landing and the light behind your eyelids goes out like a switched-off lamp. Your door opens.', next: 'night2_dad' },
          fail: { o: 'You look. You can’t help it. It is right there, bending over the bed, flat and black as a hole cut in the night, and its eyes are so bright the whole room is lit up gold. Then Dad’s footsteps thump along the landing and it’s gone.', dmg: 1, scare: 's_lio_bedside', next: 'night2_dad' },
          late: { o: 'You can’t shut your eyes. You lie there staring as the wardrobe door swings open and the eyes come out. Then Dad’s footsteps thump along the landing, and the eyes go out, and your door opens.', dmg: 1, scare: 's_lio_bedside', next: 'night2_dad' }
        },
        choices: []
      },

      night2_dad: {
        act: 'Act II · Tuesday Night', title: 'Behind Dad', time: 'WED 00:06', mood: 'night', img: 'lio_dad',
        text: 'Dad stands in your doorway in his boxers, rubbing his eyes. “Smoke alarm’s gone mad. And the burglar alarm. Again.” He walks right up to the wardrobe and leans on it to reach the window catch. The wardrobe door is open behind him. And two long black hands, thin as coat hangers, are coming out of the gap and resting, very lightly, on Dad’s shoulders. He doesn’t notice.',
        choices: [
          { t: 'Say nothing. Don’t let it know you can see.', gain: 'touched', next: 'night2_after',
            o: 'You hold your breath. Dad yawns, pats the wardrobe, and the hands slide off his shoulders as he walks away. He says goodnight. On the landing wall, in the orange from the streetlight, his shadow goes past the door a second after he does.' },
          { t: 'Shine the torch in the gap', need: 'torch', next: 'night2_after', scare: 's_lio_eyes',
            o: 'You click it on and point. The beam hits the gap and something in there jerks back like it’s been burnt, and the hands snatch away from Dad. Dad spins round. “What? Izzy, what are you doing? Turn that off.” For half a second you think he saw. Then he rubs his eyes and goes back to bed.',
            fail: { o: 'You fumble for a light, any light, but your nightlight’s dead and you haven’t got a torch. Dad yawns and walks out, and the hands slide off his shoulders as he goes. Did they leave something on him? On the landing, his shadow goes past the door a second after he does.', gain: 'touched', next: 'night2_after' } },
          { t: 'Scream at him to get away from it', dmg: 1, next: 'night2_after', scare: 's_lio_gap',
            o: 'Dad jumps out of his skin and spins round to look. Nothing. The wardrobe’s shut. “What is WRONG with you tonight?” But the eyes were on you when you screamed, and they knew. Your head pounds with it. Dad stomps back to bed.' }
        ]
      },

      night2_after: {
        act: 'Act II · Tuesday Night', title: 'Fingers', time: 'WED 02:22', mood: 'blood', img: 'lio_fingers', sfx: 'creak',
        alert: { kind: 'extreme', text: 'LEAVE IT OPEN.' },
        timer: 9, timerLabel: 'It’s coming out',
        timeout: { o: 'You can’t move. The fingers pull the door wide and one long, thin black leg steps out onto the carpet, like someone testing cold water. The eyes look at you over the end of the bed. Then, as if it has changed its mind, it folds itself back into the wardrobe. Not tonight, the way it moves says. Tomorrow.', dmg: 1, scare: 's_lio_reach', next: 'wed_morning' },
        text: 'Your clock says 02:22, and it keeps saying 02:22 however long you watch it. The wardrobe is open a hand’s width now. Fingers curl round the edge of the door, black, far too long, too many knuckles, pulling it open, slowly, slowly.',
        choices: [
          { t: 'Lock it with the little key', need: 'key', next: 'wed_morning',
            o: 'You leap, slam it, turn the key. Click. The door shudders, and shudders, and then the eyes appear in the keyhole, two tiny blazing pinpricks, looking at you. You turn your back on it and pull your duvet over your head until it gets light.',
            fail: { o: 'You leap and slam it shut, but there’s no key in the lock any more. The fingers slide back round the edge. You hold it shut with both hands, shaking, all night, until the birds start.', dmg: 1, next: 'wed_morning' } },
          { t: 'Run for Mum and Dad', next: 'landing',
            o: 'You’re off the bed and out of the door before the fingers finish curling. The landing. It’s pitch black. Every door is shut.' },
          { t: 'Hide under the bed', next: 'wed_morning', dmg: 1, scare: 's_lio_under',
            o: 'You slide under the bed on your tummy, into the dust and the lost socks. It’s good under here. It’s small. Then, at the far end, by the wall, two eyes switch on at floor level. They were already under here. They were always under here. You don’t remember how you get back into bed.' }
        ]
      },

      landing: {
        act: 'Act II · Tuesday Night', title: 'The Landing', time: 'WED 02:22', mood: 'night', img: 'lio_landing', sfx: 'smoke', doors: true,
        text: 'Pitch black, and the smoke alarm chirping above you like a bird. Four doors. Behind you, your own bedroom door creaks, wider. Which one?',
        choices: [
          { t: 'Mum and Dad’s room', door: { c: '#2f5d8a', sign: 'M & D' }, next: 'wed_morning', gain: 'cocoa',
            o: 'You climb in between them. Mum’s warm. Dad snores. Neither of them really wakes up, but Mum puts her arm round you, and nothing comes. In the morning she makes you a hot chocolate and doesn’t tell you off. But you saw it as you climbed in: across the landing, your door, open, and two eyes, watching you choose.' },
          { t: 'The bathroom', door: { c: '#e8e2d4', glass: '#9fc4d8', sign: 'BATH', light: '#ffe9a8' }, next: 'wed_morning',
            o: 'You lock yourself in and sit in the empty bath with every light on: the big light, the mirror light, the extractor fan going. Lights. Lots of lights. Nothing comes. You fall asleep in the bath and Mum finds you there in the morning and doesn’t know whether to be cross or worried.' },
          { t: 'The airing cupboard', door: { c: '#6b4a2e', mark: '#111', sign: '' }, next: 'landing', dmg: 1, scare: 's_lio_eyes',
            o: 'Warm, dark, folded towels, and the boiler humming, and two eyes switching on between the sheets on the top shelf. It isn’t only the wardrobe. It’s anywhere with a door that doesn’t shut properly. You slam it and stagger back onto the landing.' },
          { t: 'Back to your room', door: { c: '#c9789a', sign: 'ISABEL', light: '#ffcc66' }, next: 'night2_after',
            o: 'You can’t leave your room on its own with it. You don’t know why. You go back in. The fingers are still there, still curling, as if they waited for you.' }
        ]
      },

      /* ───────────── ACT III · WEDNESDAY ───────────── */

      wed_morning: {
        act: 'Act III · Wednesday', title: 'The Last Day', time: 'WED 07:30', mood: 'day', img: 'lio_kitchen2',
        text: 'Mum is quiet at breakfast. She woke up at three, she says, and Dad wasn’t in bed. He was standing in your doorway, in the dark, just standing, and when she said his name he didn’t answer. Dad laughs and says he was sleepwalking. He has dark rings round his eyes. Tonight is the night. You can feel it. You need a plan.',
        choices: [
          { t: 'Show Mum the video', need: 'filming', gain: 'mumsaw', next: 'evening',
            o: 'Four hours of dark wardrobe. Then, at 02:22, the door opens on its own, and two lights come on in the gap, and the screen goes white. Mum watches it three times. She says it’s probably a fault on the phone. Her hands are shaking. She says tonight she’ll keep her phone by the bed, and you can call her. Any time.',
            fail: { o: 'You tell her everything, but you have nothing to show her. “Oh, Izzy,” she says, “you’re exhausted.” She feels your forehead and says no screens before bed.', next: 'evening' } },
          { t: 'Phone Gran', gain: 'key', next: 'evening',
            o: 'Gran goes quiet when you say the word wardrobe. Then: “There’s a spare key. In the sewing tin, in your mum’s cupboard, I sent it with the wardrobe. I kept it locked, my love, and the big light on, and I never, ever let it think nobody believed me. And happy birthday for March, I never forget the twenty-second.” She asks to speak to your mum. Mum takes the phone into the garden and doesn’t come back for a long time.' },
          { t: 'Pack a midnight kit', gain: ['torch', 'biscuits'], next: 'evening',
            o: 'Under the bed, in your school bag: Dad’s big torch from the kitchen drawer, fresh batteries, and the last of the chocolate biscuits. You check the torch three times. It’s so bright it leaves a green blob in your eyes.' }
        ]
      },

      evening: {
        act: 'Act III · Wednesday', title: 'Lights Out', time: 'WED 21:10', mood: 'dusk', img: 'lio_dusk2',
        text: 'The wardrobe is shut. Whatever you did to it last night has been undone, neatly, while you were at school. Dad has screwed a new bulb into your nightlight. Downstairs, the burglar alarm box by the front door has a big red button marked PANIC that turns every light in the house on, and you know because you pressed it when you were six. If the alarm is set, the sensor in your room is part of it.',
        choices: [
          { t: 'Sneak down and set the burglar alarm', next: 'panel',
            o: 'Mum and Dad are in the kitchen, arguing in whispers. About you. You creep down the stairs in your socks to the white box by the front door.' },
          { t: 'Wedge your chair under the wardrobe handle', next: 'night3',
            o: 'You jam the back of your desk chair under the handles and push the legs into the carpet. It looks strong. It looks like something in a film that never works.' },
          { t: 'Ask Mum to sit with you till you fall asleep', next: 'night3',
            o: 'She sits on the edge of the bed and strokes your hair. She keeps looking at the wardrobe. When she thinks you’re asleep she says, very quietly, “Is there someone there?” Nothing answers. She goes.' }
        ]
      },

      panel: {
        act: 'Act III · Wednesday', title: 'The Alarm Box', time: 'WED 21:18', mood: 'night', img: 'lio_panel',
        text: 'The little screen glows green: ENTER CODE TO SET. Dad’s new code. The note on the fridge said it was your birthday, day then month, four numbers. You do know your own birthday. Don’t you? It’s on Gran’s card, if your head’s gone blank.',
        code: {
          answer: '2203', len: 4, tries: 3, prompt: 'Burglar alarm · enter code', button: 'Set',
          clue: { need: 'card', t: 'Gran’s card: “on your 10th birthday, 22nd of March.” Day then month.' },
          ok: { o: 'BEEP. SYSTEM ARMED. The sensors are live, every one of them, including the little one in the corner of your bedroom. If anything moves in there tonight, the whole house is going to know about it. Every light. Every siren. You creep back up to bed.', gain: 'armed', next: 'night3' },
          wrong: { o: 'BUZZ. INCORRECT CODE. You freeze, but nobody comes.' },
          out: { o: 'BUZZ. BUZZ. BUZZ. LOCKED OUT. Dad comes thumping into the hall. “Izzy! What are you doing?” He punches in the code, too fast for you to see, and switches the whole thing off for the night. “Bed. Now.”', next: 'night3' }
        },
        choices: []
      },

      night3: {
        act: 'Act III · Wednesday Night', title: 'Every Alarm', time: 'WED 23:58', mood: 'night', img: 'lio_alarms', sfx: 'smoke',
        alert: [
          { kind: 'extreme', text: 'It is in the house.' },
          { kind: 'extreme', text: 'Do not wake your parents.' },
          { kind: 'extreme', head: 'Personal message', text: 'LEAVE IT OPEN, ISABEL. WE ARE COMING OUT TONIGHT.' }
        ],
        text: 'It starts all at once. Your phone, again and again. The smoke alarm. The carbon-monoxide alarm in the kitchen. A car alarm out in the street. The alarm clock you haven’t used since Year 4, ringing on its own in the bottom of your drawer. And across the landing, through it all, your mum and dad sleeping like they can’t hear any of it.',
        choices: [
          { t: 'Turn your phone off', next: 'opens',
            o: 'You hold the button down until it goes black. It lights up again in your hand. EMERGENCY ALERT. That won’t work, Isabel.' },
          { t: 'Read the newest alert', next: 'opens', dmg: 1, scare: 's_lio_bedside',
            o: 'IT IS NOT IN THE WARDROBE ANY MORE. You look up. The wardrobe is wide open, and empty, and at the foot of your bed, standing perfectly still, is a shape like a coat on a hanger, cut out of nothing, with eyes like car headlights. Then it’s back in the wardrobe, as if it was never out.' },
          { t: 'Phone Mum across the landing', next: 'opens',
            o: 'You hear her phone ringing through the wall. It rings and rings. Then it’s answered. Breathing. And then Mum’s voice, but too slow and too flat, like a recording: “Go to sleep, Isabel.” The line goes dead. Across the landing, Mum is still snoring.' }
        ]
      },

      opens: {
        act: 'Act III · Wednesday Night', title: 'Wide Open', time: 'THU 02:22', mood: 'blood', img: 'lio_open', sfx: 'creak',
        timer: 9, timerLabel: 'It’s stepping out',
        timeout: { o: 'It is out. All of it. It unfolds from the wardrobe, too tall for the room, bending under the ceiling, and comes across the carpet, and the eyes fill everything.', next: 'end_face' },
        text: '02:22. Every alarm stops at once. The silence is worse. The wardrobe door swings all the way open, slowly, the hinges groaning, and it lifts itself off the rail. It has a hook where its head should be. It is a hole in the shape of a person. Its eyes are the brightest things you have ever seen, and the room’s light is pouring into them: your nightlight, the streetlight, the stars.',
        choices: [
          { t: 'Torch. Straight in its eyes.', need: 'torch', next: 'beam',
            o: 'You click it on and the beam hits it right in the face, if it has a face. It flinches. The eyes flare, fighting the light, trying to drink it. Hold it there. Don’t let it move the beam.',
            fail: { o: 'You grab for a torch you don’t have. Your hands find the empty bedside table, your phone, a glass of water that goes flying. It is already halfway across the room.', dmg: 1, next: 'close' } },
          { t: 'Hold out Mr Buttons', need: 'teddy', next: 'end_trade',
            o: 'You don’t know why you do it. Gran’s card said keep him close. You hold him out at arm’s length, in both hands, like a present.',
            fail: { o: 'You reach for Mr Buttons, but he’s gone. You threw him at it on the first night, and it kept him. It reminds you, with something, a button, rolling across the carpet to your feet.', dmg: 1, next: 'close' } },
          { t: 'Run for the door', next: 'run',
            o: 'You fling off the duvet and run for your bedroom door.' }
        ]
      },

      run: {
        route: [
          { need: ['touched'], next: 'end_parents' },
          { next: 'run_slam' }
        ]
      },

      run_slam: {
        act: 'Act III · Wednesday Night', title: 'Slam', time: 'THU 02:23', mood: 'blood', img: 'lio_door', sfx: 'knock',
        text: 'Your bedroom door slams in your face before you reach it. The handle won’t turn. Behind you, slowly, the carpet creaks under something that weighs nothing at all. The light in the room is going, going, draining over your shoulder into two blazing eyes. Turn round.',
        choices: [
          { t: 'Turn round and fight it with the torch', need: 'torch', next: 'beam',
            o: 'You spin round with the torch already on, and the beam slams into it from three feet away. It reels. Hold it there.',
            fail: { o: 'You turn round with nothing in your hands but your fists.', dmg: 1, next: 'close' } },
          { t: 'Bang on the door and scream', next: 'close', dmg: 1,
            o: 'You hammer and scream until your hands hurt. Across the landing, not a sound. They can’t hear you. It won’t let them.' },
          { t: 'Hold out Mr Buttons', need: 'teddy', next: 'end_trade',
            o: 'You turn round and hold him out in both hands, like a present.',
            fail: { o: 'Mr Buttons is gone. It took him on the first night.', dmg: 1, next: 'close' } }
        ]
      },

      beam: {
        act: 'Act III · Wednesday Night', title: 'Light', time: 'THU 02:24', mood: 'night', img: 'lio_torch', sfx: 'growl',
        text: 'The torch beam is a white pole between you and it. Where the light touches it, it smokes, like a candle wick that’s just been blown out. But the torch is getting dimmer. Its eyes are drinking the beam. Hold it steady. Don’t let go.',
        hold: {
          prompt: 'Keep the beam on it', label: 'Hold the torch', secs: 7, grace: 3,
          lines: ['It leans into the light like walking into wind.', 'The torch flickers.', 'Smoke curls off its edges.', 'The beam is going yellow. Dimmer.', 'It’s going back. It’s going back!', 'It’s in the wardrobe.'],
          ok: { o: 'It folds backwards into the wardrobe, smoking, its eyes dimmed to two orange coals. The door is wide open. It won’t stay in there long. You have seconds. Now.', next: 'backed' },
          fail: { o: 'Your arm shakes and the beam slides off it, just for a moment, and that’s all it needs. The torch goes dark in your hand, drunk dry, and it comes on.', dmg: 1, scare: 's_lio_reach', next: 'close' },
          late: { o: 'You can’t get the torch pointed at it. The beam wobbles over the walls, the ceiling, and its eyes drink it down to nothing.', dmg: 1, next: 'close' }
        },
        choices: []
      },

      backed: {
        act: 'Act III · Wednesday Night', title: 'Seconds', time: 'THU 02:24', mood: 'blood', img: 'lio_backed', sfx: 'heart',
        timer: 8, timerLabel: 'It’s coming back',
        timeout: { o: 'Too slow. The coals in the wardrobe flare white again, and it comes out faster this time, much faster.', dmg: 1, next: 'close' },
        text: 'It’s in the wardrobe, crumpled up against the back, smoking, its eyes two dull orange coals that are already starting to glow brighter again. Your torch is nearly dead. Whatever you’re going to do, do it now.',
        choices: [
          { t: 'Slam the wardrobe and lock it', need: 'key', next: 'end_locked',
            o: 'You throw yourself at the door, slam it, and turn the little brass key. Click.',
            fail: { o: 'You slam it, but there’s no key. It swings straight back open.', dmg: 1, next: 'close' } },
          { t: 'Wave at the alarm sensor and scream', next: 'alarm_check',
            o: 'You jump up and down under the little sensor, waving your arms, screaming, moving as much as you possibly can.' },
          { t: 'Shout for Mum and Dad', next: 'shout_check',
            o: 'You scream for them. MUM. DAD. As loud as you have ever screamed anything.' }
        ]
      },

      alarm_check: {
        route: [
          { need: ['armed'], next: 'end_allclear' },
          { next: 'alarm_dead' }
        ]
      },

      alarm_dead: {
        act: 'Act III · Wednesday Night', title: 'Nothing', time: 'THU 02:25', mood: 'blood', img: 'lio_backed', sfx: 'growl',
        text: 'The sensor stays dark. The alarm isn’t set. Of course it isn’t. Nobody set it. In the wardrobe, the coals turn gold, then white, and it starts to unfold.',
        choices: [
          { t: 'Pull the duvet over your head', next: 'end_taken',
            o: 'You dive under the duvet, the way you did on the first night, when it worked.' },
          { t: 'Hold out Mr Buttons', need: 'teddy', next: 'end_trade',
            o: 'You hold him out in both hands, like a present.',
            fail: { o: 'Mr Buttons is gone. It took him on the first night.', next: 'end_face' } },
          { t: 'Stand your ground and stare it down', next: 'end_face',
            o: 'You stand there in your pyjamas with your fists clenched and stare straight into its eyes.' }
        ]
      },

      shout_check: {
        route: [
          { need: ['touched'], next: 'end_parents' },
          { need: ['mumsaw'], next: 'mum_runs' },
          { next: 'alarm_dead' }
        ]
      },

      mum_runs: {
        act: 'Act III · Wednesday Night', title: 'Mum', time: 'THU 02:25', mood: 'blood', img: 'lio_backed',
        text: 'And this time Mum hears. She was awake. She was waiting, with her phone in her hand, because she watched that video three times. Your bedroom door crashes open and Mum is there, and she looks past you into the wardrobe, and she sees it. You watch her see it. Her face goes white.',
        choices: [
          { t: '“The light, Mum! The big light!”', next: 'end_allclear',
            o: 'Mum slaps the big light on and screams for Dad, and Dad comes running and hits the landing light, and the bathroom light, and the alarm, and there it is in all that light, being SEEN.' },
          { t: 'Lock it in while she watches', need: 'key', next: 'end_locked',
            o: 'You slam the door and turn the key with Mum right behind you.',
            fail: { o: 'There’s no key. Mum grabs you instead and pulls you out of the room.', next: 'end_allclear' } },
          { t: 'Run to her', next: 'end_allclear',
            o: 'You run into her arms, and over your head she stares into the wardrobe and doesn’t look away, not for one second. She screams for Dad. Every light comes on.' }
        ]
      },

      close: {
        act: 'Act III · Wednesday Night', title: 'Closer', time: 'THU 02:26', mood: 'blood', img: 'lio_close', sfx: 'heart',
        text: 'It is over the bed now, bent under the ceiling, and the eyes are so bright you can’t see your room any more, only white, white, white, and two black dots where the light is coming from. It doesn’t have hands, quite. It has long fingers, and they are coming down.',
        choices: [
          { t: 'Pull the duvet over your head', next: 'end_taken',
            o: 'Under the duvet. It worked on the first night. It has to work.' },
          { t: 'Hold out Mr Buttons', need: 'teddy', next: 'end_trade',
            o: 'You push him up out of the duvet, both hands, like a present.',
            fail: { o: 'Mr Buttons is gone. It took him on the first night. It’s still got him.', next: 'end_taken' } },
          { t: 'Look straight into its eyes', next: 'end_face',
            o: 'You look into the light.' }
        ]
      },

      /* ───────────── ENDINGS ───────────── */

      end_allclear: {
        title: 'All Clear', time: 'THU 02:26', mood: 'day', img: 'lio_end_clear',
        text: 'Then every light in the house comes on at once: the big light, the landing, the hall, the floodlights in the garden, and the burglar alarm screaming its head off. And then Mum is in your doorway, and Dad behind her, and they see it. They both see it, a hole in the shape of a man, caught in all that light with nowhere dark to go. Mum screams. Dad doesn’t; he just grabs the torch off you and walks straight at it, holding the beam on it, and it shrinks, and smokes, and shrivels down to a thin black coat hanger that drops onto the wardrobe floor with a clack. Nobody sleeps. In the morning Dad burns the hanger in the garden and Mum holds you the whole time. Your phone buzzes one last time: EMERGENCY ALERT · ALL CLEAR. The threat has ended. Then it never buzzes again. Mum and Dad believe you now. About everything. Forever.',
        end: { kind: 'best', label: 'The excellent ending' }
      },

      end_locked: {
        title: 'Locked', time: 'THU 06:40', mood: 'golden', img: 'lio_end_locked',
        text: 'Click. It throws itself at the door so hard the whole wardrobe walks across the carpet, and that’s what wakes them, finally: the thumping. Mum and Dad burst in and stop dead. The wardrobe is shaking. The key is rattling in the lock. And in the keyhole, two pinpricks of blazing light are looking at them. Dad doesn’t say a word. He gets the ratchet straps from the garage and wraps the wardrobe up like a parcel, and at six in the morning he drives it to the tip in the back of the van with the windows down and the radio up loud. You never see it again. Nobody ever asks Gran for it back. Dad buys you a new wardrobe, white, with no doors at all.',
        end: { kind: 'good', label: 'The good ending' }
      },

      end_trade: {
        title: 'Mr Buttons', time: 'THU 02:24', mood: 'dusk', img: 'lio_end_trade',
        text: 'It stops. The eyes look at Mr Buttons for a long time, his one button eye and his sewn-on cross, the bear Gran made, the bear that has slept next to you every night of your life. Then a long black finger hooks him gently out of your hands, the way you’d take a sweet off a baby, and it folds itself back into the wardrobe, and the door creaks shut, all the way, click. It never opens on its own again. The alerts stop. In the morning Mum and Dad find you asleep on the floor with your hand on the wardrobe door, and when you tell them, they look at each other and, for the first time, they don’t say it was nothing. You’re safe. But you never get him back. And some nights, very late, you hear something in there, softly, playing with a button.',
        end: { kind: 'bittersweet', label: 'The bittersweet ending' }
      },

      end_taken: {
        title: 'Under the Duvet', time: 'THU 02:27', mood: 'blood', img: 'lio_end_taken',
        text: 'It worked on the first night. It doesn’t work now. It drops onto the bed all at once, like a coat falling off a hook, and the light comes in at the corners of the duvet, blinding, and then the duvet isn’t there any more, and then Isabel isn’t either. In the morning Mum comes in to wake Isabel for school and the bed is empty and cold, and the wardrobe is open, just a crack. On the bedside table, Isabel’s phone buzzes. EMERGENCY ALERT. Thank you for leaving it open. Mum reads it, and finally, far too late, she believes.',
        end: { kind: 'bad', label: 'Bad ending' }
      },

      end_parents: {
        title: 'Mum and Dad', time: 'THU 02:24', mood: 'blood', img: 'lio_end_parents',
        text: 'Your bedroom door opens before you get there. Mum and Dad are standing in the doorway, holding hands. Thank goodness, thank goodness. Except they are too dark. They are as dark as the gap in the wardrobe, two flat black shapes in the shape of your parents, and where their eyes should be there are four blazing lights. It put its hands on Dad’s shoulders on Tuesday night, and you said nothing, and it was in him, and it spread. “Back to bed, Isabel,” says Dad’s voice. “Leave it open,” says Mum’s. Behind you, the wardrobe creaks, and they finally understand everything, because now they’re part of it.',
        end: { kind: 'bad', label: 'Bad ending' }
      },

      end_face: {
        title: 'Too Close', time: 'THU 02:27', mood: 'blood', img: 'lio_end_face',
        text: 'It comes closer. And closer. You can’t move, you can’t look away; the eyes are a white so bright it’s like looking at the sun. The long black fingers come down, cold as the inside of a fridge, and close over your face, one by one, until the light is the only thing left. The last thing Isabel hears is her phone, buzzing and buzzing on the bedside table, an emergency alert that nobody will read until morning.',
        end: { kind: 'bad', label: 'Bad ending' }
      }
    }
  };
})();

/* Decoys for the timed scenes: ordinary-looking choices shown first, with no clock running. Whichever the
   player picks, they're cut off by `interrupt`, and only then does the countdown or action start. */
(function () {
  const D = (id, decoys, interrupt) => Object.assign(NIGHTDOOR.stories['leave-it-open'].nodes[id], { decoys: decoys.map(t => ({ t })), interrupt });
  D('duvet', ['Peek out at the wardrobe', 'Text Mum under the covers', 'Make a dash for the door'],
    'You don’t get the chance. The yellow line under the duvet goes dark, right next to your face. It’s here. Don’t move.');
  D('night1', ['Call for Mum again', 'Hide your head under the pillow', 'Count to ten and hope it goes'],
    'Before you can open your mouth, the door creaks again: wider, and wider. It isn’t waiting. Do something. Now.');
  D('slam', ['Shout for Dad', 'Let go and run back to bed', 'Grab the key out of the lock'],
    'The door shoves back so hard your feet slide on the carpet. If you let go now it’s coming out. PUSH.');
  D('night2', ['Peek, just for a second', 'Pull the duvet over your head', 'Reach for your phone'],
    'Something cold touches your cheek before you can move, and the light on the other side of your eyelids blazes up. Keep them shut.');
  D('night2_after', ['Wake Mum with your phone', 'Pull the duvet up and wait', 'Shout at it to go away'],
    'Your phone is dead in your hand. The fingers pull, and the door swings wider. You’ve got seconds.');
  D('opens', ['Scream for Mum and Dad', 'Hide under the duvet', 'Shut your eyes and pretend it’s a dream'],
    'No sound comes out. Your eyes won’t shut. It takes its first step out onto the carpet. MOVE.');
  D('beam', ['Shout for Dad while it’s blinded', 'Make a run for the door', 'Throw the torch at it'],
    'It lunges into the light the moment you think about moving. If the beam leaves it for a second, it’s over. Hold it there.');
  D('backed', ['Catch your breath', 'Shine the torch in after it', 'Check it’s really stopped moving'],
    'The coals in the dark flare gold. It’s already getting back up. Now. Do it now.');
})();
