/* NIGHTDOOR story: Good Boy
   Same node format as primrose-close.js. One survivor ending, four bad ones. */
window.NIGHTDOOR = window.NIGHTDOOR || { stories: {} };

NIGHTDOOR.stories['good-boy'] = {
  id: 'good-boy',
  title: 'Good Boy',
  tagline: 'Bramble ran into the woods on Saturday. On Sunday, at 3am, he came home.',
  blurb: 'A new-build estate, a family of four and the soppiest golden retriever alive. When Bramble comes back from Coldharbour Wood he’s wagging, muddy and so pleased to see you. He just doesn’t blink any more. Only one of you gets out of Willow Reach.',
  cover: 'cover_goodboy',
  lives: 3,
  start: 'start',
  frozen: '03:00$|02:13$',
  death: {
    title: 'Willow Reach keeps you',
    text: 'Too many wrong turns. Somewhere in the dark a good boy scratches at the back door, and someone wearing your face gets up to let him in.'
  },

  items: {
    walkie:    { name: 'Walkie-talkie',   icon: '📻', desc: 'Poppy has the other one. Channel 3.' },
    torch:     { name: 'Torch',           icon: '🔦', desc: 'Dad’s big yellow one. Things in the dark hate it.' },
    toast:     { name: 'Jam on toast',    icon: '🍞', desc: 'Tap to eat: restores 1 life.', heal: 1 },
    biscuits:  { name: 'Custard creams',  icon: '🍪', desc: 'Tap to eat: restores 1 life.', heal: 1 },
    collar:    { name: 'Bramble’s collar', icon: '🦴', desc: 'Red, with a bone-shaped tag. Found in the wood. Still wet.' },
    rules:     { name: 'Mrs Dunmore’s rules', icon: '📜', desc: '1. It can’t come in unless it’s let in. 2. It can’t cross running water. 3. Never answer your name in the dark. 4. Iron burns it. 5. You can’t bring them back. Don’t try.' },
    horseshoe: { name: 'Iron horseshoe',  icon: '🧲', desc: 'From over Mrs Dunmore’s door. Heavy, cold, old.' },
    keys:      { name: 'Car keys',        icon: '🔑', desc: 'Mum’s. The fob is a little plastic dog.' },
    seen:      { hidden: true },
    warned:    { hidden: true },
    answered:  { hidden: true }
  },

  nodes: {

    /* ───────────── ACT I · GOOD BOY ───────────── */

    start: {
      act: 'Act I · Good Boy', title: 'Pancake Saturday', time: 'SAT 09:10', mood: 'day', img: 'gb_kitchen',
      text: 'Number 7, Willow Reach. The newest house on the newest estate, right on the edge of Coldharbour Wood. Dad is flipping pancakes badly. Mum is pretending not to watch. Your little sister Poppy, seven, is in a dinosaur onesie, and Bramble, the soppiest golden retriever alive, has his chin on your knee and his eyes on your plate.',
      choices: [
        { t: 'Slip Bramble a pancake', next: 'walk',
          o: 'It’s gone before it touches the floor. He thumps his tail against the table leg, and Mum says “I saw that,” and Dad says “Saw what?” and flips the next pancake onto the ceiling. Everyone is laughing. Remember this bit. You’ll want it later.' },
        { t: 'Set up Poppy’s walkie-talkies', gain: 'walkie', next: 'walk',
          o: 'Her birthday present: two chunky orange walkie-talkies. “Channel 3,” she says, very serious. “That’s our secret channel. Over.” You clip the other one to your belt. She says “Over” after everything for the rest of the day.' },
        { t: 'Help Dad with the washing up', gain: 'toast', next: 'walk',
          o: 'Dad hands you a tea towel and a slice of toast with far too much jam. “Bribe,” he says. “Don’t tell your mother.” You wrap it in kitchen roll for later.' }
      ]
    },

    walk: {
      act: 'Act I · Good Boy', title: 'Coldharbour Wood', time: 'SAT 15:40', mood: 'golden', img: 'gb_woodedge',
      text: 'Afternoon walk along the back fence, where the estate ends and the wood begins. The trees are very old and very close together. Halfway along, Bramble stops dead. His hackles go up. He growls, a sound you’ve never heard him make. Between two trunks, deep in the shade, something is standing on two legs. It is very thin. It is far too tall. Then it isn’t there.',
      choices: [
        { t: 'Grab his lead before he bolts', dmg: 1, next: 'search',
          o: 'Too slow. The lead whips through your hand and takes the skin off your palm. Bramble is gone into the trees like he’s been called. You hear him barking, further and further away. Then you don’t.' },
        { t: 'Shout his name', gain: 'warned', next: 'search',
          o: '“BRAMBLE!” He’s already gone. A second later, from deep in the wood, someone shouts back. “BRAMBLE!” In your voice. Exactly your voice. Dad turns and looks at you, and you can see he heard it too.' },
        { t: 'Hold on to Poppy', gain: 'torch', next: 'search',
          o: 'You grab Poppy’s hood before she can run after him. Bramble crashes off into the trees. Dad goes in after him for twenty minutes and comes back white, with leaves in his hair. He hands you his torch. “Keep that,” he says. “Didn’t like it in there.”' }
      ]
    },

    search: {
      act: 'Act I · Good Boy', title: 'LOST DOG', time: 'SAT 19:20', mood: 'dusk', img: 'gb_posters',
      text: 'By dusk there are posters on every lamp post. LOST DOG. BRAMBLE. VERY FRIENDLY. Poppy drew the picture. Neighbours come out and say how sorry they are. Only old Mrs Dunmore at Number 1, in the farm cottage that was here before the estate, doesn’t say sorry. She stands at her gate in her coat, and watches the wood.',
      choices: [
        { t: 'Ask her if she’s seen him', gain: 'warned', next: 'scratch',
          o: 'She takes your wrist. Her hand is all bones. “If he comes home tonight,” she says, “you don’t open that door. Not to him. Not to anyone.” You ask why. “Come and see me tomorrow,” she says. “If you still can.”' },
        { t: 'Tape a poster to her gate', next: 'scratch',
          o: 'She watches you do it. Then she peels it off, folds it carefully, and hands it back. “He won’t need that,” she says. “He knows the way home. That’s the trouble.”' },
        { t: 'Go home for tea', gain: 'biscuits', next: 'scratch',
          o: 'Mum makes hot chocolate and puts a packet of custard creams in your hoodie pocket without saying anything, the way she does when things are bad. Poppy falls asleep on the sofa holding Bramble’s squeaky hedgehog.' }
      ]
    },

    scratch: {
      act: 'Act I · Good Boy', title: 'Three in the Morning', time: 'SUN 03:00', mood: 'night', img: 'gb_backdoor', sfx: 'scratch',
      text: 'Scratching. Slow, patient scratching, at the glass back door. You creep down in the dark. Through the glass, in the garden, there’s a dog-shaped shadow. Wagging. Muddy. It’s Bramble. He’s home. He sits, very nicely, the way he does for treats. He looks straight at you. He doesn’t bark. He doesn’t whine. He just waits for someone to let him in.',
      choices: [
        { t: 'Shine the torch through the glass', need: 'torch', gain: 'seen', scare: 'bramble', next: 'home_again',
          o: 'His eyes light up in the beam. Not green, like a dog’s. White. Flat white, like two coins. And for just one second, before he drops back down onto all fours, he is standing up. Then Mum is behind you in her dressing gown, crying with happiness, and she opens the door.',
          fail: { o: 'You have no light. You press your face to the cold glass. It presses its face to the other side. You hear Mum on the stairs, crying with happiness, and she pushes past you and opens the door.', next: 'home_again' } },
        { t: 'Wake Mum and Dad', next: 'home_again',
          o: 'Mum runs down in her dressing gown, sobbing “Oh, good boy, good boy,” and opens the door wide. You remember Mrs Dunmore’s bony hand on your wrist. You say “Mum, wait,” but she’s already on her knees in the doorway with her arms open.' },
        { t: 'Open the door yourself', dmg: 1, next: 'home_again',
          o: 'Your hand is on the handle before you think. The cold comes in with him, and a smell like the back of a butcher’s shop. He brushes past your legs. Something on his side catches your shin and opens it, neat as a paper cut. He didn’t used to have anything sharp there.' }
      ]
    },

    home_again: {
      act: 'Act I · Good Boy', title: 'Welcome Home', time: 'SUN 03:06', mood: 'night', img: 'gb_dog_in',
      text: 'Everyone’s up. Poppy is hugging him so hard. Dad is laughing. Mum is still crying. Bramble lets them. He stands very still in the middle of the kitchen and lets them, with his tail going, and going, and going, at exactly the same speed, like a metronome. He hasn’t got his collar on.',
      choices: [
        { t: 'Hug him', dmg: 1, next: 'sunday',
          o: 'He’s cold all the way through, like meat from the fridge. You put your ear to his chest, the way you did when you were small. There’s a heartbeat. It isn’t his. It’s far too slow, and every few beats it stops, and listens, and starts again.' },
        { t: 'Run your hand along his back', next: 'sunday',
          o: 'Under the fur, his spine is wrong. It goes on too long. Your fingers find a ridge, then a seam, like the zip on a coat. He turns his head all the way round to look at your hand. Not like a dog does. Like an owl does.' },
        { t: 'Watch his eyes', next: 'sunday',
          o: 'Everyone is fussing him and nobody notices but you. He doesn’t blink. Not once, the whole time. And his eyes aren’t on Mum, or Dad, or Poppy. They’re on you. Like he knows you’re the one who noticed.' }
      ]
    },

    /* ───────────── ACT II · NOT QUITE RIGHT ───────────── */

    sunday: {
      act: 'Act II · Not Quite Right', title: 'Sunday Morning', time: 'SUN 08:30', mood: 'day', img: 'gb_table',
      text: 'Sunshine. Cartoons on. Everyone says how lucky you are. Bramble won’t touch his dog food. He sits up on a kitchen chair, which he’s never been allowed to do, and watches you all eat. When Mum takes the mince out of the fridge for later, he follows her with his whole head, very slowly, like a sunflower following the sun.',
      choices: [
        { t: 'Ask him to give a paw', scare: 'bramble', next: 'sunday2',
          o: 'He gives you the paw. Then he gives you the other paw. Then, for a second, he gives you a third one, from somewhere under the fur, long and pale and jointed in the wrong places, with fingernails. Poppy claps. “Good boy!” she says. He opens his mouth to pant. He doesn’t need to pant. He just likes how it looks.' },
        { t: 'Squeak his favourite toy', next: 'sunday2',
          o: 'The squeaky hedgehog. He’s chewed it since he was a puppy. You squeak it. He looks at it for a long time, as if it’s a word in another language. Then he looks at you. Then, slowly, he squeaks. With his mouth. The exact same squeak.' },
        { t: 'Take a photo of him', gain: 'seen', next: 'sunday2',
          o: 'On the screen there’s the kitchen, the chair, the sunshine. On the chair, where Bramble is, there’s something sitting with its knees up by its ears, wearing him like a hoodie. You look up. It’s just Bramble, wagging. You look down. The photo has already been deleted.' }
      ]
    },

    sunday2: {
      act: 'Act II · Not Quite Right', title: 'Dad’s Hand', time: 'SUN 13:00', mood: 'day', img: 'gb_estate_day',
      text: 'Dad tried to give Bramble a bath. Now Dad has a tea towel wrapped round his hand and says it’s nothing, just a nip, silly dog. Bramble licks the blood off the bathroom floor until it’s spotless. Dad keeps saying he’s fine. He’s very pale. He keeps saying it.',
      choices: [
        { t: 'Go and look in the wood', next: 'woods',
          o: 'You tell Mum you’re going to the park. You don’t go to the park. You climb the back fence where Bramble went in.' },
        { t: 'Go to Mrs Dunmore’s', next: 'dunmore',
          o: 'You walk to Number 1. Every net curtain on the street twitches as you pass. At the end of the road, Mrs Dunmore’s door is already open, like she’s been waiting.' },
        { t: 'Stay home and watch Bramble', next: 'watch',
          o: 'Someone has to. You sit on the stairs with a book you’re not reading, and keep him in the corner of your eye.' }
      ]
    },

    woods: {
      act: 'Act II · Not Quite Right', title: 'Where He Went', time: 'SUN 14:00', mood: 'golden', img: 'gb_woods',
      text: 'Twenty steps in and the estate noise stops, like a door shutting. No birds. Fifty steps in, there’s a clearing, and in the middle of it there’s something red. Bramble’s collar, with his bone-shaped tag. Next to it, there’s a heap of golden fur. It’s not a dog. It’s just the outside of one, turned inside out, like a jumper pulled off in a hurry.',
      choices: [
        { t: 'Pick up the collar', gain: 'collar', next: 'dunmore',
          o: 'It’s wet. The tag says BRAMBLE and your phone number. Whatever came home last night didn’t need it. You don’t cry until you’re back over the fence. Then you can’t stop. You go straight to Number 1.' },
        { t: 'Look up', scare: 'walker', next: 'dunmore',
          o: 'The trees are full of coats. That’s what you think at first. Then you see the Patels’ cat. And a fox. And a badger. And a deer. All hung up neatly on the branches, empty, swaying. Something long and pale ducks out of sight behind a trunk. You run until your lungs burn, all the way to Number 1.' },
        { t: 'Follow the drag marks', dmg: 1, next: 'dunmore',
          o: 'They lead to a hole under an oak, and in the hole there are bones that have been sucked clean. Behind you a branch cracks. You turn. Nothing. You turn back, and the hole has teeth marks round the edge that weren’t there before. You fall twice running home, and the second time you hear it laughing in Poppy’s voice.' }
      ]
    },

    dunmore: {
      act: 'Act II · Not Quite Right', title: 'Number 1', time: 'SUN 15:30', mood: 'golden', img: 'gb_dunmore',
      text: 'Mrs Dunmore’s cottage smells of coal tar soap and old dog. There’s an iron horseshoe nailed over every door. “This was all Pryor’s Farm,” she says. “1987. Their collie went into that wood and came back. Then Mr Pryor. Then Mrs. Then the children. They lived on, all of them, for a whole summer, and their skins got looser every week. It wears what it eats. It wants a family. A home. Now it’s got yours.”',
      choices: [
        { t: 'Ask how to stop it', gain: 'rules', next: 'dinner',
          o: 'She tears a page out of a notebook. Five rules, in old handwriting. She taps the last one twice. “You can’t bring them back,” she says. “I know you’ll want to. I wanted to. My Arthur went in after the Pryor girl.” She doesn’t say what happened to Arthur. She looks at the wood.' },
        { t: 'Ask what keeps it out', gain: 'horseshoe', next: 'dinner',
          o: 'She stands on a chair, levers a horseshoe off the back door with a fork, and puts it in your hand. It’s heavy and cold and smells like a nosebleed. “Iron,” she says. “It can’t abide it. Don’t let it near your face. It’ll want your face.”' },
        { t: 'Show her the collar', need: 'collar', gain: ['rules', 'horseshoe'], next: 'dinner',
          o: 'She looks at it for a long time. Then she sits down hard. “Then it’s already in,” she says. She gives you everything she has: the horseshoe off her own back door and the page of rules. “Go home. Watch your dad. It always starts with whoever it’s bitten.”',
          fail: { o: 'You try to explain, but it all comes out wrong. She listens anyway. Then she gives you a page of rules in old, careful handwriting. “Go home,” she says. “Watch whoever it’s bitten.”', gain: 'rules', next: 'dinner' } }
      ]
    },

    watch: {
      act: 'Act II · Not Quite Right', title: 'The Landing', time: 'SUN 15:00', mood: 'golden', img: 'gb_hall',
      text: 'For two hours, he does nothing. He lies in the hall and watches the front door. Then Mum goes for a bath and Dad falls asleep on the sofa, and Bramble gets up. He goes upstairs. Not the way a dog goes up stairs. He goes up them like a person does. One foot after the other. On his back legs.',
      choices: [
        { t: 'Follow him up', scare: 'bramble', dmg: 1, next: 'dinner',
          o: 'He’s at the top, waiting. Standing. He’s as tall as you. His head tips to one side, and the skin of his face slips, just a little, like a mask that doesn’t fit, and behind it something wet blinks sideways. Then he drops onto four legs and trots past you, wagging, and bumps your hand with his nose.' },
        { t: 'Stay where you are', gain: 'seen', next: 'dinner',
          o: 'You don’t move. Above you, very quietly, Poppy’s bedroom door opens. You hear him sniffing her pillow. Her pyjamas. Her teddies. Learning her. Then the door closes, and he comes back down, wagging, and lies in the hall again as if nothing happened.' },
        { t: 'Wake Dad up', next: 'dinner',
          o: 'Dad opens his eyes slowly. “Leave him be,” he says. “He’s a good boy.” His voice is a bit thick, as if there’s something in his mouth. He scratches his bandaged hand. Scratches it. Scratches it. A strip of skin comes away under his nails, and he doesn’t notice.' }
      ]
    },

    dinner: {
      act: 'Act II · Not Quite Right', title: 'Sunday Roast', time: 'SUN 18:30', mood: 'dusk', img: 'gb_dinner',
      text: 'Roast chicken. Dad carves it with his good hand and eats with the other one, with his fingers, pulling the meat off pink. He laughs at something nobody said. Bramble sits under his chair. Mum says Dad’s just tired. Poppy says Daddy smells like the woods. Dad looks at her. His face hangs a little loose, as if it has slipped half an inch down his skull.',
      choices: [
        { t: 'Tell Mum everything', next: 'night2',
          o: 'You tell her about the collar, the wood, the photo, the steps. Mum puts her fork down and looks at you, and for a second she nearly believes you. Then Dad laughs, and says “Bad dreams,” and Mum sends you to bed for frightening your sister.' },
        { t: 'Ask Dad to take the bandage off', scare: 'dad', dmg: 1, next: 'night2',
          o: 'He unwinds it for you, panting a little. Underneath, the skin on his hand is loose, like a rubber glove that’s too big. He pinches it and pulls it out an inch from his knuckles, and lets it snap back. “See?” he says. “Fine.” Poppy screams. Mum doesn’t seem to see anything wrong at all.' },
        { t: 'Say nothing, and keep watch', gain: 'biscuits', next: 'night2',
          o: 'You eat. You nod. You watch. Under the table, Bramble’s tail and Dad’s foot tap at exactly the same speed. After pudding, Mum sneaks you some custard creams because you look so pale. You keep them. You might need the strength.' }
      ]
    },

    night2: {
      act: 'Act II · Not Quite Right', title: 'Can You Come Down a Sec?', time: 'MON 02:13', mood: 'night', img: 'gb_landing', sfx: 'heart',
      text: 'Dad’s voice, from the bottom of the stairs, perfectly normal. “Hey. You awake? Can you come down a sec? Need a hand with something.” Your door is open a crack. You can see across the landing into Mum and Dad’s room. Mum is asleep. Dad’s side of the bed is empty. The voice says your name. Then it says it again, exactly the same. Then again. Then again.',
      choices: [
        { t: 'Answer him', gain: 'answered', dmg: 1, next: 'dad_gone',
          o: '“Dad?” Silence. Then, from the bottom of the stairs, in your voice: “Dad?” And then, delighted, it says it over and over, trying it out, “Dad? Dad? DAD?”, getting it better each time, until it’s perfect. You put your hands over your ears. It goes on until dawn.' },
        { t: 'Go down to help', fatal: true, scare: 'walker',
          o: 'At the bottom of the stairs, in the dark, Dad is crouched over Bramble’s bowl with his back to you. His back goes up and up. Too long. His spine pokes through his T-shirt like knuckles. He turns round. He has Dad’s face on, but only just, the way you’d wear a mask on top of your head. “Thanks,” he says. “I needed a hand.” And he takes yours.' },
        { t: 'Stay silent. Torch under the door', need: 'torch', gain: 'seen', next: 'dad_gone',
          o: 'You slide the torch under the gap and switch it on. Down at the bottom of the stairs, two flat white coins light up. Then two more. Then the voice stops. Something climbs the stairs, slowly, on hands and feet, and stops outside your door, and sniffs along the gap, and goes away again.',
          fail: { o: 'You lie very still in the dark with your hand over your mouth. The voice stops. Something climbs the stairs on all fours and lies down outside your door. You can hear it breathing through the gap until the sun comes up. It breathes in time with you.', next: 'dad_gone' } }
      ]
    },

    dad_gone: {
      act: 'Act II · Not Quite Right', title: 'Dad', time: 'MON 07:30', mood: 'day', img: 'gb_dad',
      text: 'Dad is making breakfast, whistling. He’s never been so cheerful. He calls Mum “my love” and kisses her neck for a long time, with his eyes open, looking at you. He has taken the week off, he says. He’s going to stay home with Poppy and Bramble. Mum is pleased. Mum is laughing. Poppy isn’t. Poppy is holding your sleeve under the table, very tight.',
      choices: [
        { t: 'Give Poppy her walkie-talkie', need: 'walkie', next: 'estate',
          o: 'You press her orange walkie into her hands under the table. “Channel 3,” you whisper. “If anything’s wrong. Anything.” She nods. Dad watches you do it, and pants, once, like a dog, and says “Over,” in Poppy’s little voice.',
          fail: { o: 'You’ve got nothing to give her but a hug. She hangs on to you so hard. Dad watches. “Don’t be long,” he says to you, at the door. “We’ll be waiting.”', next: 'estate' } },
        { t: 'Fake being ill and stay home', dmg: 1, next: 'estate',
          o: 'Dad brings you soup in bed. He sits by the bed all morning, watching you eat it, not blinking. At noon he leans in and sniffs your hair, a long deep sniff, like a dog. By the afternoon you can’t take it, and you climb out of the window and run.' },
        { t: 'Call the police from school', next: 'estate',
          o: 'A nice officer goes round. Dad is charming. The house is spotless. Bramble does a trick. The officer rings your school back and tells you off for wasting police time. He sounds a bit distracted. He says he might pop back later, to see the dog again.' }
      ]
    },

    /* ───────────── ACT III · WILLOW REACH ───────────── */

    estate: {
      act: 'Act III · Willow Reach', title: 'Willow Reach', time: 'MON 16:30', mood: 'dusk', img: 'gb_estate_dusk', sfx: 'growl',
      text: 'Coming home, the estate is wrong. Every dog on Willow Reach has stopped barking. There are LOST CAT posters on top of your LOST DOG ones. Mr Ford at Number 4 is standing on his lawn in his slippers, watering it, though the hose isn’t on. The Patel twins are sitting on their wall, holding hands, mouths hanging open, panting at nothing. It isn’t only your house any more. It’s spreading.',
      choices: [
        { t: 'Go to Mrs Dunmore’s', next: 'dunmore_dark',
          o: 'Number 1 is dark. Her front door is open. The horseshoe over it has been pulled off and bent in half.' },
        { t: 'Knock at the Patels’ for help', scare: 'walker', dmg: 1, next: 'mum',
          o: 'Mr Patel opens the door. He has to stoop to get under the frame. He hasn’t had to before. “Hello,” he says, in Mrs Patel’s voice. You run, and something follows you all the way home, on the other side of the fences, keeping pace.' },
        { t: 'Go straight home', next: 'mum',
          o: 'You keep your head down. You don’t look at Mr Ford. You can feel him not looking at you. As you reach your gate, your phone buzzes. A text from Mum’s phone, typed by Poppy: dad is in the gardn. hes digging. hes been digging all day' }
      ]
    },

    dunmore_dark: {
      act: 'Act III · Willow Reach', title: 'Number 1, Again', time: 'MON 17:00', mood: 'night', img: 'gb_dunmore_dark',
      text: 'Mrs Dunmore is in her armchair, facing the window, with her back to you. The telly is on with no sound. Every horseshoe in the house has been pulled down and dropped in a heap by the door, except one, still nailed over the kitchen. Her notebook is on the side table. She hasn’t moved since you came in. She hasn’t breathed.',
      choices: [
        { t: 'Take the last horseshoe', gain: 'horseshoe', scare: 'dunmore', next: 'mum',
          o: 'You get it off the nail. Behind you, the armchair creaks. “Leave that, dear,” says Mrs Dunmore, in your mum’s voice. Her head turns round to look at you. Her body doesn’t. Her face is hanging loose on the front of it, and behind her eyeholes there are other eyes, further back, white as coins. You are out of the door before you hear yourself screaming.' },
        { t: 'Take her notebook', gain: 'rules', next: 'mum',
          o: 'You slide it off the table, inch by inch. In the last page, in shaking writing: IT CAME IN AS ARTHUR. I LET IT IN. I KNEW AND I STILL LET IT IN. Under that, in pencil, in a child’s handwriting, someone has drawn a dog with a man’s face.' },
        { t: 'Touch her shoulder', fatal: true, scare: 'dunmore',
          o: 'Her cardigan sinks under your fingers. There’s nothing in her. She’s empty, like a dropped coat. And then you hear it above you, in the ceiling: something long, shifting its weight, pleased. It comes down through the light fitting with her face in its teeth. It’s been waiting for a new one.' }
      ]
    },

    mum: {
      act: 'Act III · Willow Reach', title: 'Mum', time: 'MON 18:00', mood: 'night', img: 'gb_mum',
      text: 'Mum is in the kitchen with the lights off, holding a bread knife, shaking. She’s still Mum. You can tell. She’s crying. “I saw him,” she whispers. “Your dad. In the garden. He took his face off to scratch underneath it.” Out of the window, a long shape is digging by the shed. Bramble is helping. “We take Poppy,” Mum says. “We go. Now.”',
      choices: [
        { t: 'Show her the collar', need: 'collar', gain: 'keys', next: 'poppy_room',
          o: 'She holds it to her face and makes a noise you’ll never forget. Then she wipes her eyes, puts her car keys in your hand and closes your fingers round them. “Whatever happens,” she says, “you drive if you have to. You know how. Your dad taught you on the beach.”',
          fail: { o: 'There’s no time to prove anything and she doesn’t need it. She puts the car keys in your hand. “Whatever happens,” she says, “you get out.”', gain: 'keys', next: 'poppy_room' } },
        { t: 'Tell her about the rules', gain: 'keys', next: 'poppy_room',
          o: 'You tell her: it can’t come in unless it’s let in, it can’t cross running water. “The brook,” Mum breathes. “At the bottom of the estate.” She puts her car keys in your hand. “Get Poppy. Quietly.”' },
        { t: 'Grab the keys off the hook', gain: 'keys', next: 'poppy_room',
          o: 'You snatch them. The little plastic dog on the fob swings. Mum nods. Out in the garden, the digging stops. Both shapes stand up, together, and turn towards the house. “Go,” Mum says. “Get your sister.”' }
      ]
    },

    poppy_room: {
      act: 'Act III · Willow Reach', title: 'Poppy’s Room', time: 'MON 18:10', mood: 'night', img: 'gb_poppyroom', sfx: 'growl',
      text: 'Poppy is in bed with the duvet over her head and the walkie in her hand. Bramble is lying across the end of her bed, on her feet, so she can’t get out. He lifts his head. “Bramble says I’m going to be a good girl,” Poppy whispers from under the duvet. “He says it doesn’t hurt.”',
      choices: [
        { t: 'Hold up the horseshoe', need: 'horseshoe', next: 'car',
          o: 'He shrieks. Not a dog noise. A noise like a fox and a baby and a kettle all at once. His fur smokes where the iron points. He pours off the bed and up the wall and across the ceiling and out of the door. You pull Poppy out from under the duvet and run.',
          fail: { o: 'You’ve got nothing. You grab Poppy anyway. Bramble takes your arm in his mouth, gently, almost lovingly, and bites down until you feel it in your teeth. Then he lets go, and wags. You run with Poppy and your arm hanging.', dmg: 1, next: 'car' } },
        { t: 'Say “Good boy. Stay.”', dmg: 1, next: 'car',
          o: 'He tilts his head. “Good boy,” he says back, in Dad’s voice. “Stay.” Then he lunges. You get Poppy out from under him, but he gets your leg, and the bite is full of human teeth. You carry her down the stairs three at a time, bleeding.' },
        { t: 'Grab Poppy and run', scare: 'bramble', next: 'car',
          o: 'You rip the duvet off. Bramble’s face is right there, inches from yours, and it opens. All the way. The whole dog face splits up the middle like a hood, and something pale inside looks out. You scream and grab Poppy and run, and behind you on the landing it laughs, and laughs, and laughs.' }
      ]
    },

    car: {
      act: 'Act III · Willow Reach', title: 'The Only Road Out', time: 'MON 18:25', mood: 'night', img: 'gb_car',
      text: 'Mum drives with no lights. Willow Reach only has one road in and out. At the end of it, the whole street is standing in the road in their dressing gowns and slippers. Mr Ford. The Patels. The police officer from this morning. They’re holding hands across the road, heads up, sniffing the air. In the middle of the line, in the headlights, is Dad. He says Mum’s name. Gently. Lovingly.',
      choices: [
        { t: 'Shout “Drive through them!”', next: 'mum_taken',
          o: 'Mum puts her foot down and then she sees his face and she can’t, she can’t, she brakes. The car stops a foot from Dad. He puts his hand flat on the bonnet. “Come home, love,” he says, and Mum’s hand goes to the door. She looks at you. Her face changes. “The brook,” she says. “Take her to the brook. Don’t look back.” She gets out.' },
        { t: 'Lock all the doors', next: 'mum_taken',
          o: 'Click. Faces press against every window, mouths open, panting fog onto the glass. Dad taps on Mum’s window. “It’s me,” he says. “It’s only me. Let me in.” Mum is crying. Mum says, “I’m sorry. I love you. Take her to the brook.” And she unlocks her door, and gets out, to keep them busy.' },
        { t: 'Reverse! Reverse!', dmg: 1, next: 'mum_taken',
          o: 'Mum slams it into reverse and you hit the Patels’ garden wall hard enough to crack your head on the window. The car stalls. They walk towards you, not hurrying. Mum turns round. Blood on her face. “Out the back,” she says. “The brook. They can’t cross water. Go!” She gets out the front, and walks towards them, arms open.' }
      ]
    },

    mum_taken: {
      act: 'Act III · Willow Reach', title: 'Don’t Look Back', time: 'MON 18:30', mood: 'blood', img: 'gb_mum_taken', sfx: 'heart',
      text: 'You run with Poppy between the houses. Behind you Mum is screaming. Then she isn’t screaming. Then, after a while, her voice comes again, warm and calm and so close. “Darling? Where are you going? Come back, it’s all right now. It’s all right. It doesn’t hurt. Come back and see.”',
      choices: [
        { t: 'Look back', scare: 'mum', dmg: 1, next: 'cut',
          o: 'Mum is standing under the street light. Her face is hanging loose, like a mask with the string cut, and it is splitting, slowly, straight down the middle, from her hairline to her chin. Dad is behind her with his hands on her shoulders, helping her into it, like helping someone into a coat.' },
        { t: 'Keep running. Don’t answer.', next: 'cut',
          o: 'You don’t answer. You grit your teeth so hard your jaw cracks. She keeps calling, kind and patient, the voice she used when you had nightmares. “It’s only me. It’s only Mum.” You keep running.' },
        { t: 'Cover Poppy’s ears', next: 'cut',
          o: 'You press Poppy’s face into your chest and your hands over her ears and run like that, stumbling. She’s sobbing. “Was that Mummy? Was that Mummy?” You don’t answer. It isn’t, any more. It never will be again.' }
      ]
    },

    cut: {
      act: 'Act III · Willow Reach', title: 'The Cut-Through', time: 'MON 18:40', mood: 'night', img: 'gb_alley',
      text: 'The narrow alley between the back fences, down towards the brook. It’s pitch dark. Halfway along you trip, and fall, and Poppy’s hand comes out of yours. For three seconds you can’t find her. Then a little hand slides back into yours. “I’m here,” she says. Her hand is cold. Colder than it was.',
      choices: [
        { t: 'Shine the torch in her eyes', need: 'torch', next: 'two_poppies',
          o: 'Her eyes light up in the beam. White. Flat white, like two coins. She looks up at you, and doesn’t blink, and holds your hand tighter.',
          fail: { o: 'You can’t see her. You can only feel her hand. It’s very small and very cold, and it holds on very tight, and the fingers are just slightly too long.', next: 'two_poppies' } },
        { t: 'Ask her what Bramble’s middle name is', next: 'two_poppies',
          o: 'It’s a family joke. Bramble Wigglebum Sausage. Poppy chose it. There’s a pause in the dark. “Bramble,” she says. Pause. “Bramble Bramble.” Pause. “Good boy.” She giggles, and the giggle is Dad’s.' },
        { t: 'Hide in the Patels’ shed till morning', next: 'end_estate',
          o: 'You pull her into the shed and shut the door and sit in the dark among the paint tins, holding her. She’s very quiet. She doesn’t cry any more. She just holds you, and holds you, and waits for the morning with you.' }
      ]
    },

    two_poppies: {
      act: 'Act III · Willow Reach', title: 'Channel 3', time: 'MON 18:45', mood: 'blood', img: 'gb_two', sfx: 'heart',
      text: 'Somewhere close, a walkie-talkie crackles. Poppy’s orange one, lying in the alley where she fell. And out of it comes Poppy’s voice. Crying. Far away, in the wood. “Where are you? It’s dark. It took me in the wood and it put me in a tree. Please come and get me. Please. Over.” The Poppy holding your hand looks up at you, and shakes her head slowly. “That’s not me,” she says. “Don’t go in the wood. Stay with me.”',
      choices: [
        { t: 'Follow her voice into the wood', next: 'end_walkie',
          o: 'You let go of the cold hand. Behind you, the little girl in the alley doesn’t try to stop you. She just waves. You climb the fence into Coldharbour Wood, following the voice on Channel 3.' },
        { t: 'Pick her up. She’s your sister.', next: 'end_poppy',
          o: 'You pick her up. She weighs what Poppy weighs. She smells like Poppy’s shampoo. She puts her arms round your neck and her face in your shoulder. “Good,” she whispers. You run for the brook with her.' },
        { t: 'Let go of her hand', need: 'horseshoe', next: 'river',
          o: 'You press the horseshoe into the back of her little cold hand. It hisses like bacon. She opens her mouth to scream and keeps opening it, down past her chin, past her collarbone. You let go, and run. Behind you she’s on all fours, and so fast, and then she stops, and just watches you go. You were too late. You were always too late. She’s been gone since the cut-through.',
          fail: { o: 'You let go. She grabs on. Her grip is iron. You pull and pull and something in your wrist goes, and her fingers come away with a bit of your skin. She doesn’t chase you. She sits down in the alley, and puts your skin to her face, and breathes in. You were too late. You were always too late.', dmg: 1, next: 'river' } }
      ]
    },

    river: {
      act: 'Act III · Willow Reach', title: 'The Brook', time: 'MON 18:55', mood: 'night', img: 'gb_brook',
      text: 'The brook at the bottom of Willow Reach, swollen with a week of rain, black and fast and loud. Behind you, on the slope, they’re coming down between the houses. Not hurrying. Dad. Mum. Bramble. Mr Ford. The Patels. And Poppy, holding Mum’s hand, skipping. They stop at the top of the bank. They call your name. All of them, at once, in perfect voices.',
      choices: [
        { t: 'Wade in', next: 'cross',
          o: 'The cold takes your breath. The current shoves at your knees, then your waist. On the bank behind you, they all take one step forward, together. Then they stop at the edge of the water.' },
        { t: 'Answer Mum', gain: 'answered', dmg: 1, next: 'river',
          o: '“Mum?” It just comes out. On the bank, all of them lift their heads at once, like dogs hearing their name. And all of them say “Mum?” back, in your voice, your exact voice, and laugh, pleased, the way you laugh. Now they have it. Now they can call anyone they like with it. Never answer your name in the dark.' },
        { t: 'Go back to them', next: 'end_family',
          o: 'You’re so tired. You’re so cold. And Mum is holding her arms out, and Poppy is waving, and Bramble is wagging, and it all looks exactly like home. You walk back up the bank towards them.' }
      ]
    },

    cross: {
      act: 'Act III · Willow Reach', title: 'Running Water', time: 'MON 19:00', mood: 'blood', img: 'gb_crossing', sfx: 'growl',
      text: 'Halfway. Waist-deep. The water is roaring. Something grabs your ankle under the surface, a long cold hand, from the bank behind you, an arm stretched far too long to be an arm. It can’t cross. But it can reach. It pulls. On the bank, Dad’s face is hanging slack, and the arm is coming out of his sleeve, and out, and out.',
      choices: [
        { t: 'Strike it with the horseshoe', need: 'horseshoe', next: 'far_bank',
          o: 'You plunge the iron down onto the hand and the water around it boils. On the bank, Dad screams with Bramble’s voice and Mrs Dunmore’s voice and the Patels’ voices, all of them at once. The arm snaps back like a tape measure. You stagger on.',
          fail: { o: 'You’ve got nothing iron. You kick and kick. The fingers peel away from your ankle one by one, and take the skin with them. You stagger on, bleeding into the brook.', dmg: 1, next: 'far_bank' } },
        { t: 'Throw it the collar', need: 'collar', next: 'far_bank',
          o: 'You rip Bramble’s collar out of your pocket and throw it hard at the bank. The arm lets go of you and snatches it out of the air. On the bank, Dad holds it up to his face, and smells it, and makes a sound like crying. It wants what it had. It wants it all. You stagger on.',
          fail: { o: 'You’ve nothing to throw. You grab a rock from the riverbed and smash at the hand until it lets go. Your knuckles are split. You stagger on.', dmg: 1, next: 'far_bank' } },
        { t: 'Turn round and pull it in', fatal: true, scare: 'dad',
          o: 'You think if you can drag it into the running water, it’ll drown. You pull. It lets you. It comes off the bank all in one long pale movement, and it doesn’t drown, because it was never trying to cross. It just wanted you to turn round. It folds over you like a coat.' }
      ]
    },

    far_bank: {
      act: 'Act III · Willow Reach', title: 'The Other Side', time: 'MON 19:10', mood: 'night', img: 'gb_farbank',
      text: 'You drag yourself out onto the far bank and lie in the mud, shaking. Across the black water, your whole family stands at the edge, in a row, not blinking. Mum. Dad. Poppy in her dinosaur onesie. Bramble, sitting nicely, wagging. Poppy waves. “Please come back,” she says, in her real voice. “I’m scared without you. Please. Over.”',
      choices: [
        { t: 'Turn your back and walk away', next: 'end_river',
          o: 'It is the hardest thing you will ever do. You turn your back on all of them. You walk into the dark fields. Behind you, for a long time, they call your name, all of them, kindly, lovingly. You don’t answer. You don’t look back. Not once.' },
        { t: 'Answer her', gain: 'answered', dmg: 1, next: 'far_bank',
          o: '“Poppy?” Across the water, Poppy’s mouth drops open, and says “Poppy?” in your voice. Then all of them say it. Then they start saying other things in your voice, things you’ve never said, things you’d never say, and your stomach turns over. Never answer your name in the dark. You’ve only made it stronger.' },
        { t: 'Wade back for her', next: 'end_family',
          o: 'She’s seven. She’s your sister. You can’t. You can’t leave her. You step back into the water.' }
      ]
    },

    /* ───────────── ENDINGS ───────────── */

    end_river: {
      title: 'The Only One', time: 'TUE 05:40', mood: 'golden', img: 'gb_end_river',
      end: { kind: 'survivor', label: 'The only way out' },
      text: 'A milk lorry finds you on the A-road at dawn. The police go to Willow Reach that morning. Every house is neat. Every family is home. Every one of them looks at the officers without blinking, and says they’ve never heard of you. At Number 7 they find a dog bowl, licked clean, and nobody at all. You’re the only one left. Eleven months later, in your foster home across the county, you hear scratching at the back door at three in the morning. Then Mum’s voice, very softly: “Let us in, love. We’ve walked such a long way.” There’s a river between here and Willow Reach. There are also bridges.'
    },

    end_family: {
      title: 'Family Dinner', time: 'SUN 18:30', mood: 'blood', img: 'gb_end_family',
      end: { kind: 'bad', label: 'A bad ending' },
      text: 'Mum hugs you on the bank. It doesn’t hurt as much as you thought. Afterwards you all walk home together, holding hands, and Bramble trots ahead. Sunday roast, every day now. Everyone eats with their fingers. Nobody uses their own voice at the table any more. Your skin fits someone else these days, but it fits well. Next week a new family moves in at Number 12. They have a little boy, and a spaniel. You go round with a cake.'
    },

    end_poppy: {
      title: 'Carry Me', time: 'MON 18:58', mood: 'blood', img: 'gb_end_poppy',
      end: { kind: 'bad', label: 'A bad ending' },
      text: 'You wade into the brook with her in your arms. Halfway across she starts to get heavier. And longer. Her arms go round your neck once, and then twice, and then three times. “Good boy,” she whispers in Dad’s voice, and the water closes over both of you. It can’t cross running water. But it can make sure you don’t either. On the bank, the others sit down to wait. They’re very patient.'
    },

    end_walkie: {
      title: 'Over and Out', time: 'MON 19:30', mood: 'night', img: 'gb_end_walkie',
      end: { kind: 'bad', label: 'A bad ending' },
      text: 'You follow her voice for an hour, deeper and deeper. Finally you find the orange walkie-talkie, hanging from a branch, beside a dinosaur onesie hung up neatly like a coat. It’s empty. The walkie is still talking. “Channel 3. Where are you? Over.” But it isn’t Poppy’s voice now. It’s yours. Behind you, something unfolds itself from between two trees, and says, in Mum’s voice: “There you are.”'
    },

    end_estate: {
      title: 'Neighbourhood Watch', time: 'TUE 07:00', mood: 'day', img: 'gb_end_estate',
      end: { kind: 'bad', label: 'A bad ending' },
      text: 'Morning comes up pink and gold. You open the shed door. Willow Reach is beautiful. Lawns being mowed. Cars being washed. Everybody waves. Mum calls you in for breakfast. You go. Of course you go. Poppy is holding your hand, and you don’t remember when your hand stopped feeling cold to you. A sign has gone up at the bottom of the road: WILLOW REACH PHASE TWO. 40 NEW FAMILY HOMES. PETS WELCOME.'
    }
  }
};
