/* NIGHTDOOR story: Cairn
   Five friends lost in a Highland forest. An original creature: the Cairnman.
   Signature: cairns that appear overnight, the clack of stone on stone in the dark,
   paths that loop, the taken left behind as cairns wearing their things.
   One survivor ending, five bad ones (one disguised as a rescue). */
window.NIGHTDOOR = window.NIGHTDOOR || { stories: {} };

NIGHTDOOR.stories['cairn'] = {
  id: 'cairn',
  title: 'Cairn',
  tagline: 'Every morning there’s a new pile of stones. Every night there’s one less of you.',
  blurb: 'Five friends, one night’s wild camping in Drumdubh Forest, and a shortcut that doesn’t go anywhere. The paths keep bringing you back to the same clearing. The food is running out. And every night, out in the trees, something is stacking stones.',
  cover: 'cover_cairn',
  lives: 3,
  start: 'start',
  frozen: '03:33$|04:12$',
  death: {
    title: 'Drumdubh keeps you',
    text: 'Too many wrong turns. Your torch rolls away across the moss and goes out. Somewhere close, careful and patient, something sets one stone on top of another. Then another. It’s going to be a tall one.'
  },

  items: {
    map:       { name: 'Dev’s map',        icon: '🗺️', desc: 'Ordnance Survey, laminated. The paths on it don’t match the paths under your feet.' },
    compass:   { name: 'Compass',          icon: '🧭', desc: 'The needle won’t settle. Whichever way you turn, it points at the trees.' },
    lighter:   { name: 'Storm lighter',    icon: '🔥', desc: 'Windproof. Half full. The most important thing you own.' },
    oatcakes:  { name: 'Oatcakes',         icon: '🍘', desc: 'Tap to eat: restores 1 life.', heal: 1 },
    jelly:     { name: 'Jelly babies',     icon: '🍬', desc: 'A sticky handful. Tap to eat: restores 1 life.', heal: 1 },
    trailmix:  { name: 'Trail mix',        icon: '🥜', desc: 'Mostly raisins. Tap to eat: restores 1 life.', heal: 1 },
    beans:     { name: 'Tin of beans',     icon: '🥫', desc: 'Cold, eaten off a penknife. Tap to eat: restores 1 life.', heal: 1 },
    pills:     { name: 'Priya’s painkillers', icon: '💊', desc: 'The last two. Tap to take: restores 1 life.', heal: 1 },
    hat:       { name: 'Kenzie’s hat',     icon: '🧶', desc: 'Red, with a bobble. It still smells of her shampoo.' },
    camera:    { name: 'Ollie’s camera',   icon: '📷', desc: 'Every photo since the car park has a cairn in it somewhere. Each one a little closer.' },
    logbook:   { name: 'Forestry logbook', icon: '📓', desc: 'Drumdubh, 1971. The last page, in a shaking hand: 1. Never add to its stones. 2. Keep a fire till first light. It won’t come into the light. 3. Paths bend here. Firebreaks don’t. 4. Don’t signal at night. It sees lights too. 5. Don’t look back at the last cairn.' },
    flare:     { name: 'Distress flare',   icon: '🧨', desc: 'One red hand flare in a rusty tin. Best before 1979.' },
    marked:    { hidden: true },
    firelit:   { hidden: true }
  },

  nodes: {

    /* ───────────── ACT I · THE WRONG PATH ───────────── */

    start: {
      act: 'Act I · The Wrong Path', title: 'Glen Corrach Car Park', time: 'FRI 08:50', mood: 'fog', img: 'cn_carpark',
      text: 'Fog so thick the minibus disappears ten steps behind you. No signal since the last village. Five of you: Dev with the map and the plan, Kenzie with the snacks, Ollie with his camera, Priya with the first-aid kit, and you. On the noticeboard, under a soggy bus timetable, there’s a faded poster: MISSING. Two forestry workers, October 1971. Someone has balanced three flat stones on top of the board.',
      choices: [
        { t: 'Read the old poster properly', next: 'trail',
          o: 'Alasdair Ross and Iain Munro, last seen walking the north firebreak in Drumdubh Forest. The photos have faded to two pale ovals. Somebody has scratched something under them with a key: STAY ON THE STRAIGHT. Kenzie drags you away by your rucksack. “Cheery,” she says.' },
        { t: 'Help Kenzie pack the food', gain: 'oatcakes', next: 'trail',
          o: '“Snack mule,” says Kenzie, and stuffs a packet of oatcakes into your side pocket. “One night, one tent each, one bag of marshmallows. Dev’s got it all on a spreadsheet.” Dev does. It’s laminated.' },
        { t: 'Take the spare kit Dev hands round', gain: 'lighter', next: 'trail',
          o: 'A storm lighter, a foil blanket, a whistle you lose within the hour. “Just in case,” Dev says. He says it like nothing has ever happened to him just in case.' }
      ]
    },

    trail: {
      act: 'Act I · The Wrong Path', title: 'The Blue Posts', time: 'FRI 10:30', mood: 'fog', img: 'cn_trail',
      text: 'You follow blue-topped marker posts into Drumdubh Forest. Spruce, packed tight, all the same age, all the same height. It’s very quiet. No birds at all. After an hour the posts stop. The last one has been snapped off at the base and laid down neatly across the path, pointing back the way you came.',
      choices: [
        { t: 'Back Dev up: keep going', next: 'cairn1',
          o: '“Forestry work,” Dev says. “Path’s obvious.” It isn’t obvious, but it’s there, and you’re all cold, and nobody wants to be the one who says turn round. So you don’t turn round.' },
        { t: 'Say you should go back', next: 'cairn1',
          o: 'You get outvoted four to one. Kenzie does a slow clap. Behind you, the snapped post lies in the path, pointing at the car park, and you keep looking back at it until the fog swallows it up.' },
        { t: 'Ask to see the map', gain: 'map', next: 'cairn1',
          o: '“You navigate, then,” Dev says, and hands it over. The map shows the blue trail looping round a loch. There’s no loch. There’s no anything. Just trees, and a path the map doesn’t know about.' }
      ]
    },

    cairn1: {
      act: 'Act I · The Wrong Path', title: 'The Cairn', time: 'FRI 12:10', mood: 'fog', img: 'cn_cairn',
      text: 'On a rise where the trees thin out, there’s a cairn: a heap of grey stones, taller than Ollie. Hill tradition, Priya says. You add a stone for luck. Kenzie already has one in her hand. Below you the fog tears open for a moment, and you see a whole valley of forest. No road. No roof. No end to it.',
      choices: [
        { t: 'Add a stone for luck', gain: 'marked', next: 'fence',
          o: 'You find a nice flat one and set it on top. Clack. It sits perfectly, as if there was a space there waiting for it. It feels good. Like signing a visitors’ book. Kenzie adds hers and says, “Make a wish.” You wish for chips.' },
        { t: 'Get a group photo at the cairn', next: 'fence',
          o: 'Ollie sets the timer and runs to join you. Five of you, pulling faces, the cairn behind. When he checks the screen, he frowns, zooms in, says “Huh,” and won’t say why.' },
        { t: 'Look at it, don’t touch it', next: 'fence',
          o: 'Something about it bothers you. It takes a while to see what. The stones at the bottom are clean and new. The ones at the top are old, green with moss. It looks as if it was built from the top down.' }
      ]
    },

    fence: {
      act: 'Act I · The Wrong Path', title: 'The Fence', time: 'FRI 14:40', mood: 'fog', img: 'cn_fence',
      text: 'A high deer fence, with a new metal sign: CORRACH REWILDING ESTATE. WOLVES PRESENT. DO NOT ENTER. “Wolves?” says Kenzie. “In Scotland?” “It’s a trial,” Dev says. “They’re miles inside.” On the other side of the wire, something long and grey trots along beside you, keeping pace, then slips into the bracken and is gone.',
      choices: [
        { t: 'Follow the fence: it must reach a road', next: 'loop',
          o: 'The fence goes on and on, mile after mile, perfectly straight. Then it turns a corner into the forest and you lose it, and when you go back to find it, it isn’t there. Just trees. A fence can’t move. It isn’t there.' },
        { t: 'Rattle the wire to see what comes', dmg: 1, scare: 'cn_wolf', next: 'loop',
          o: 'A grey shape hits the fence right in front of your face, teeth first, and the whole wire booms. You fall back into the brambles and rip both hands open. It stands there, yellow-eyed, panting steam, watching you go.' },
        { t: 'Head uphill to get a view', gain: 'jelly', next: 'loop',
          o: 'Kenzie hands round jelly babies to keep everyone going and you pocket a sticky handful. At the top there’s no view, only more trees. But far off, very faint, you hear something: clack. Clack. Like two stones knocked together.' }
      ]
    },

    loop: {
      act: 'Act I · The Wrong Path', title: 'The Same Tree', time: 'FRI 16:55', mood: 'dusk', img: 'cn_loop',
      text: 'Six hours of walking. The light’s going. Then Priya stops dead. A fallen spruce across the path, and carved into it: D · K · O · P, and your initials. Kenzie carved them at lunchtime, miles behind you. You’ve walked in a circle. Except nobody has turned round once. Nobody.',
      choices: [
        { t: 'Borrow Dev’s compass', gain: 'compass', next: 'camp1',
          o: 'The needle swings slowly round and round, like it’s looking for something. Then it settles, pointing into the trees. You turn. It swings round to point into the trees again. Dev takes it back, then gives it you. He doesn’t want it any more.' },
        { t: 'Climb a tree to see out', dmg: 1, next: 'camp1',
          o: 'From the top: forest, in every direction, under a lid of fog. In a clearing not far below there’s a cairn, taller than the one on the rise. The branch you’re standing on snaps, and you fall two branches before you catch one, and the bark tears the skin off your arm.' },
        { t: 'Shout for help', next: 'camp1',
          o: 'You all shout, as loud as you can. Your voices just stop in the trees, like shouting into a pillow. No echo at all. Then, from somewhere out there, an answer. Not a voice. Clack. Clack. Clack.' }
      ]
    },

    camp1: {
      act: 'Act I · The Wrong Path', title: 'The Clearing', time: 'FRI 19:30', mood: 'dusk', img: 'cn_camp',
      text: 'Nobody says the word lost. Dev says, “We camp. We walk out in daylight.” You find a clearing, perfectly round, perfectly flat, ringed with grey boulders. It’s too round. Nobody mentions that either. Two tents for the four of them, the little one-man tent for you.',
      choices: [
        { t: 'Build the fire up high', need: 'lighter', next: 'night1',
          o: 'The storm lighter catches first time. The fire goes up bright and loud and for an hour it’s nearly a holiday: noodles, marshmallows, Kenzie’s terrible playlist on one bar of battery. The trees stay politely back at the edge of the light.',
          fail: { o: 'Twenty damp matches. Dev finally gets a sulky little fire going, more smoke than flame. The trees stand very close all round it, listening.', next: 'night1' } },
        { t: 'Pitch your tent on the flat stones', gain: 'marked', next: 'night1',
          o: 'In the middle of the clearing there’s a patch of big flat stones, dry, smooth, almost warm, as if someone’s been sitting on them all day. Your tent fits on them exactly. It’s the best night’s sleep you’ll get.' },
        { t: 'Fetch water from the burn', next: 'night1',
          o: 'The water’s brown as tea. On the far bank, right at the edge of your torchlight, there’s a cairn. You’re sure there wasn’t one there when you came down. You fill the bottles very fast and walk back without running.' }
      ]
    },

    night1: {
      act: 'Act I · The Wrong Path', title: 'The First Night', time: 'SAT 02:40', mood: 'night', img: 'cn_tent', sfx: 'stones',
      text: 'You wake in the dark. Out in the trees, a long way off: clack. A pause. Clack. Stone on stone, slow and careful, like somebody building something. It goes on for an hour. Then it stops. And in the silence there’s a heavy, grinding step. Then another. Closer.',
      choices: [
        { t: 'Unzip the tent and look', dmg: 1, scare: 'cn_face', next: 'morning1',
          o: 'Your torch finds the trees. Something between them is taller than the trees. It doesn’t move when the light hits it, the way a heap of stones doesn’t move. Then it does. You zip the tent up with shaking hands and lie there till dawn.' },
        { t: 'Whisper to Priya next door', next: 'morning1',
          o: '“You hear it too?” she whispers back. She’s been awake for an hour. You reach out and find her hand through two layers of nylon, and you hold on like that until it gets light.' },
        { t: 'Lie still and wait', next: 'morning1',
          o: 'You lie very still. The steps come all the way to the edge of the clearing, and stop. Something breathes, slow, like wind through a gap in a wall. At about four it goes away. You don’t sleep again.' }
      ]
    },

    /* ───────────── ACT II · RATIONS ───────────── */

    morning1: {
      act: 'Act II · Rations', title: 'Saturday', time: 'SAT 07:15', mood: 'fog', img: 'cn_morning',
      text: 'Fog again. Between your tent and the trees, there’s a cairn. Waist high. It was not there last night. Dev says one of you is having a laugh. Nobody is laughing. The stones are wet with dew, all except the top one, which is dry and almost warm.',
      choices: [
        { t: 'Kick it over', next: 'rations',
          o: 'Kenzie cheers. The stones roll away into the grass. Underneath, the grass is flattened in a long shape, like something big lay curled up there all night, watching the tents.' },
        { t: 'Ask Ollie to photograph it', next: 'rations',
          o: 'He takes three. In all three, if you zoom in, there’s a second cairn behind this one, back in the trees. You look up. There’s nothing there. Ollie deletes the photos, then looks like he wishes he hadn’t.' },
        { t: 'Put back the stone that’s rolled off', gain: 'marked', next: 'rations',
          o: 'One stone has slipped off the top into the grass. You pick it up without thinking and set it back. Clack. It fits perfectly. You feel strangely better. Tidier. Kenzie gives you a very funny look.' }
      ]
    },

    rations: {
      act: 'Act II · Rations', title: 'Counting the Food', time: 'SAT 08:00', mood: 'fog', img: 'cn_rations',
      text: 'Kenzie tips everything onto the groundsheet. Eight oatcakes. Two packets of noodles. One tin of beans. Half a bag of jelly babies. One Mars bar. One bag of trail mix. “Planned for one night,” Dev says quietly. Five of you. Priya splits it into piles: today, tomorrow, the day after. Nobody says “and after that”.',
      choices: [
        { t: 'Take your share and save it', gain: 'trailmix', next: 'burn',
          o: 'You get the trail mix. It’s mostly raisins. You zip it into your chest pocket and promise yourself you won’t touch it till tomorrow. Your stomach makes a noise about that.' },
        { t: 'Give your oatcakes to Kenzie', lose: 'oatcakes', next: 'burn',
          o: 'She’s shivering, and she hasn’t said a joke all morning, which is how you know it’s bad. She takes them, and hugs you, hard. “When we get out,” she says, “chips. On me. A massive bag.”' },
        { t: 'Take charge of the beans', gain: 'beans', next: 'burn',
          o: '“You hold the beans,” Priya says. “Nobody trusts Kenzie with the beans.” Kenzie is too hungry to argue. You put the tin in your rucksack, and you feel the weight of it every step.' }
      ]
    },

    burn: {
      act: 'Act II · Rations', title: 'Follow the Water', time: 'SAT 13:00', mood: 'fog', img: 'cn_burn',
      text: 'Dev’s new plan: follow the burn downhill. Burns run into rivers, rivers run past roads. You follow it for four hours. It goes into a pipe under a bank. You climb over the bank, and on the other side is the clearing. Your tents. And the cairn, built back up again, waist high.',
      choices: [
        { t: 'Scream at the trees', next: 'night2',
          o: 'You scream until your throat hurts. Out in the forest, something clacks back twice, politely, like an answer. Priya puts her arm round you and walks you back to the tents.' },
        { t: 'Make everyone sit and eat something', next: 'night2',
          o: 'Half an oatcake each. Kenzie licks the crumbs off the packet. Nobody talks about the burn. Dev sits apart with the map, folding and refolding it, until the creases go through.' },
        { t: 'Go through Ollie’s photos with him', next: 'night2',
          o: 'He scrolls back, slowly. The car park. The posts. The cairn on the rise. In every single photo there’s a cairn somewhere in the background. In every one, it’s a bit closer to the camera. In the first one, at the car park, it’s already standing in the fog behind the minibus.' }
      ]
    },

    night2: {
      act: 'Act II · Rations', title: 'The Second Night', time: 'SUN 03:33', mood: 'night', img: 'cn_fire', sfx: 'stones',
      text: 'You keep the fire going in shifts. On your shift, the clacking starts close: just past the edge of the light, stone being set on stone, all the way round the clearing. Then Kenzie’s tent unzips. “Need a wee,” she whispers. “Don’t look.” She goes out past the fire, into the dark, with her torch.',
      choices: [
        { t: 'Go after her', dmg: 1, next: 'morning2',
          o: 'Three steps into the trees and her torch is lying on the moss, still switched on, pointing at nothing. Something heavy shifts beside you, close enough to touch, and the cold off it is like opening a freezer. You run back to the fire and fall into it, nearly, and burn your hand.' },
        { t: 'Shout and wake everyone', next: 'morning2',
          o: 'Everyone’s up in seconds, torches waving. You find her torch on the moss, still switched on. You call her name all night. The forest takes your voices and gives nothing back except, once, near dawn, a single soft clack.' },
        { t: 'Throw everything on the fire', next: 'morning2',
          o: 'The fire roars up. For one second, at the very edge of the light, something huge and grey stands quite still among the trees, and Kenzie’s torch beam is shining up at it from the ground. Then the fire sinks, and the dark comes back, and her torch goes out.' }
      ]
    },

    morning2: {
      act: 'Act II · Rations', title: 'Kenzie', time: 'SUN 07:40', mood: 'fog', img: 'cn_kenzie',
      text: 'At the edge of the clearing there’s a new cairn, as tall as a person. On top of it, neat as anything, sits Kenzie’s red bobble hat. Her trainers are side by side at the bottom, laces tucked in, the way she never, ever does them.',
      choices: [
        { t: 'Pull the stones apart to find her', dmg: 1, scare: 'cn_kenzie', next: 'bothy',
          o: 'You tear at it with your hands. The stones in the middle are warm. Right at the centre there’s a stone the exact grey shape of a face. Her face. Mouth open, full of grit. You fall back. When you look again it’s only a stone.' },
        { t: 'Take her hat', gain: 'hat', next: 'bothy',
          o: 'You lift it off the top of the cairn. It still smells of her shampoo. You put it in your pocket so you can give it back to her. You keep telling yourself that. So you can give it back.' },
        { t: 'Rebuild it neatly, like a grave', gain: 'marked', next: 'bothy',
          o: 'Priya helps. You straighten every stone until it stands tall and tidy. It feels right. It feels like something you’ve done before, a long time ago, many times. Your hands are grey with stone dust and it won’t wash off.' }
      ]
    },

    bothy: {
      act: 'Act II · Rations', title: 'The Bothy', time: 'SUN 12:20', mood: 'fog', img: 'cn_bothy',
      text: 'Dev finds a real track: old cart ruts, straight for once. It leads to a bothy, a stone hut with no door and half a roof. Inside: a fireplace, an iron bed frame, a table. On the table, swollen with damp, a forestry logbook. DRUMDUBH. 1971.',
      choices: [
        { t: 'Read the logbook', gain: 'logbook', next: 'night3',
          o: 'Tree counts, weather, tea breaks. Then the entries get shorter. Iain’s gone. Stones round the hut. Then, on the last page, in a different, shaking hand, five rules. You read them twice. You wish you’d read them on Friday.' },
        { t: 'Search the shelves', gain: 'flare', next: 'night3',
          o: 'Behind a stack of rotten sacks, a rusty tin. Inside: one red hand flare. Best before 1979. Ollie says it’ll never work. Priya says that’s what they said about Ollie.' },
        { t: 'Look out of the window', next: 'night3',
          o: 'Out among the trees, all round the bothy, there are cairns. Dozens. Old ones, furred with moss. On top of each one, something: a flat cap. A boot. A plastic thermos, orange, very 1970s. A child’s welly. Nobody else goes to the window after that.' }
      ]
    },

    /* ───────────── ACT III · NIGHT BY NIGHT ───────────── */

    night3: {
      act: 'Act III · Night by Night', title: 'The Third Night', time: 'MON 01:10', mood: 'night', img: 'cn_wall', sfx: 'stones',
      text: 'You stay in the bothy. Stone walls, a fire in the grate, Dev and Ollie taking turns at the empty doorway. At midnight the clacking comes right up against the outside wall. Then the wall itself starts to move. A stone grinds slowly out of place, and then another. Through the gap: dark. And something in the dark, looking in.',
      choices: [
        { t: 'Ram the stone back in', dmg: 1, scare: 'cn_face', next: 'ollie',
          o: 'You throw your weight against it. For one second, through the gap, you see it up close: a face that’s only a hole where stones should be, and roots coming out of it like fingers. The stone slams back in. Your shoulder will never be right again.' },
        { t: 'Shine your torch through the gap', next: 'ollie',
          o: 'The beam goes into the gap and doesn’t light anything. It doesn’t hit the trees, or the ground, or the other side. “Where’s the other side?” says Ollie, very quietly. You switch the torch off.' },
        { t: 'Feed the fire, as high as it goes', next: 'ollie',
          o: 'You burn the table. Whenever the fire roars, the grinding stops. Whenever it sinks, it starts again. Rule two, Priya says. It won’t come into the light. You feed it until your arms ache and the sky goes grey.' }
      ]
    },

    ollie: {
      act: 'Act III · Night by Night', title: 'Ollie', time: 'MON 06:50', mood: 'fog', img: 'cn_ollie',
      text: 'At first light Ollie isn’t at the door. His camera is on the doorstep, strap coiled up neatly. Outside there’s a new cairn, Ollie’s height exactly, with his glasses folded on top. The last photo on the camera was taken at 4:12. The flash has lit up the trees, and in the middle of them, something tall and grey is bending down towards the lens.',
      choices: [
        { t: 'Keep the camera', gain: 'camera', next: 'dev',
          o: 'You hang it round your neck. It’s still warm. You don’t look at the last photo again. You don’t need to. You can see it when you close your eyes.' },
        { t: 'Look at the last photo properly', scare: 'cn_photo', gain: 'camera', next: 'dev',
          o: 'You zoom in. It isn’t bending down to the lens. It’s bending down to Ollie, gently, the way you’d pick up something you’d dropped. And there’s something on its shoulder, one stone that isn’t grey. It’s red. It’s wool. It has a bobble.' },
        { t: 'Shout for him, just in case', next: 'dev',
          o: 'You shout his name till you’re hoarse. Dev stops you in the end, by holding on to you. Out in the forest, a stone settles onto another stone with a small, satisfied clack.' }
      ]
    },

    dev: {
      act: 'Act III · Night by Night', title: 'Dev Goes for Help', time: 'MON 09:00', mood: 'fog', img: 'cn_moss',
      text: 'Three of you now. Dev hasn’t spoken since dawn. Then: “This is my fault. I’m getting help.” North of the trees there’s the moss: miles of flat, open bog. “A straight line,” he says. “It can’t bend a straight line.” Priya begs him. He goes anyway.',
      choices: [
        { t: 'Go with him', dmg: 1, next: 'priya',
          o: 'Ten steps out and you go in up to your waist, black and cold and sucking. Dev hauls you out by your rucksack. “Look after Priya,” he says, and walks on alone. You watch his orange jacket get smaller, and smaller, and then you blink, and it isn’t there.' },
        { t: 'Give him your food for the walk', next: 'priya',
          o: 'He doesn’t want to take it, then he does. He waves from far out on the moss. The fog drifts across him. When it clears there’s no Dev. There’s a cairn, out in the middle of the bog, where no stones should be.' },
        { t: 'Ask for the logbook before he goes', gain: 'logbook', next: 'priya',
          o: 'He’s been reading it all night. He presses it into your hands. “Rule three,” he says, tapping it. “Firebreaks don’t bend. The moss is flat. Same thing.” It isn’t the same thing. You know it isn’t. He goes.' }
      ]
    },

    priya: {
      act: 'Act III · Night by Night', title: 'Two Left', time: 'MON 15:00', mood: 'dusk', img: 'cn_two',
      text: 'Every path brings you back to the clearing now. There are four new cairns round the edge of it. Priya counts them, then sits down hard. “It’s not killing us,” she says. “It’s collecting us.” She looks at you. “Two left. Whatever happens tonight, you get out. Promise.”',
      choices: [
        { t: 'Let Priya check your wounds', gain: 'pills', next: 'night4',
          o: 'She cleans the cuts on your hands with the last of the antiseptic, very gently, and presses two painkillers into your palm. “Save them,” she says. “For when it’s worse.” You both pretend it could get worse.' },
        { t: 'Search Dev’s rucksack', gain: 'lighter', next: 'night4',
          o: 'Spare socks, the laminated plan, a photo of his little brother. And his storm lighter, nearly full. You take it. It feels like stealing, and it feels like he meant you to.' },
        { t: 'Promise her. Hold her hand', next: 'night4',
          o: 'You promise. She holds on so tight her nails dig in. Neither of you says the other half: if one of you gets out, it means the other one doesn’t.' }
      ]
    },

    night4: {
      act: 'Act III · Night by Night', title: 'The Fourth Night', time: 'TUE 02:00', mood: 'night', img: 'cn_tents', sfx: 'stones',
      text: 'The clacking starts at dusk and doesn’t stop: all the way round, right at the edge of the firelight, building. Priya’s tent is pitched against yours. Her torch glows through the canvas. Between one breath and the next, the glow goes out. “Priya?” Nothing. Then, from inside her tent, slowly: clack. Clack.',
      choices: [
        { t: 'Rip her tent open', dmg: 1, scare: 'cn_hand', next: 'alone',
          o: 'Her sleeping bag is still zipped. Inside it, curled up like someone asleep, is a neat heap of grey stones. They’re warm. A hand of stacked stone comes in through the back of the tent, very slowly, and takes the top one away.' },
        { t: 'Call her name, over and over', next: 'alone',
          o: 'You call until your voice cracks. Her tent stays dark and quiet. In the morning you’ll find it zipped shut from the inside, and a cairn beside it, with her first-aid kit on top.' },
        { t: 'Stay by the fire. You promised', next: 'alone',
          o: 'Every part of you wants to go to her. You don’t. You sit by the fire and cry and keep feeding it, because you promised. It is the worst thing you have ever done, and it might be the only right one.' }
      ]
    },

    alone: {
      act: 'Act III · Night by Night', title: 'The Last One', time: 'TUE 03:33', mood: 'blood', img: 'cn_alone', sfx: 'stones',
      text: 'You’re the only one left. Round the clearing stand the cairns: Kenzie’s, Ollie’s, Dev’s, which has walked back from the moss, and Priya’s. Off to one side, a fifth. Unfinished. Waist high. Waiting. The clacking stops. At the very edge of the firelight something enormous settles down, quite still, to wait for morning.',
      choices: [
        { t: 'Keep the fire going until first light', need: 'lighter', gain: 'firelit', next: 'dawn',
          o: 'Every time it sinks, you feed it: branches, your spare socks, the map, the laminated plan. The thing at the edge of the light doesn’t move any closer. It doesn’t have to. It’s very patient.',
          fail: { dmg: 1, next: 'dawn',
            o: 'Nothing to relight it with. At four the fire dies to a red glow, then nothing. In the dark something leans over you, and stones press, cold and heavy, on your chest, one at a time. Then grey light, and it’s gone, and you can breathe again. Just.' } },
        { t: 'Zip yourself into your tent and hide', next: 'end_taken',
          o: 'You zip the tent right up and curl into a ball in your sleeping bag. Outside, very close, the clacking starts again.' },
        { t: 'Fire the flare into the sky', need: 'flare', next: 'end_rescue',
          o: 'It works. A red star goes up over the forest and hangs there, beautiful, lighting up every tree. Far off, so far you might be dreaming, you hear a helicopter.',
          fail: { dmg: 1, next: 'alone',
            o: 'You’ve got nothing to signal with. You wave your torch at the sky until the battery dies, and something at the edge of the dark watches the light the whole time.' } }
      ]
    },

    dawn: {
      act: 'Act III · Night by Night', title: 'First Light', time: 'TUE 05:50', mood: 'fog', img: 'cn_dawn',
      text: 'Grey light. The thing at the edge of the clearing is gone. The fifth cairn is a little taller than it was. Three ways out. North: the moss, flat and open, the way Dev went. East: the deer fence, and far off inside the estate, a farmhouse with a light on. West: if you push through the spruce, the long straight scar of the old firebreak.',
      choices: [
        { t: 'Cross the moss, like Dev', next: 'end_bog',
          o: 'Flat and open. No trees to bend you round. You can see for miles. You set off, following the faint line of Dev’s footprints in the peat.' },
        { t: 'Climb the fence and run for the farmhouse', next: 'end_wolves',
          o: 'A light means people. You get over the wire and drop down into the heather on the other side and run. The light doesn’t get any closer. Behind you, something howls.' },
        { t: 'Push through to the firebreak', next: 'firebreak',
          o: 'The spruce is so tight you go through it on your hands and knees, needles in your hair, your face, your mouth. Then, suddenly, open sky.' }
      ]
    },

    firebreak: {
      act: 'Act III · Night by Night', title: 'The Firebreak', time: 'TUE 06:40', mood: 'golden', img: 'cn_firebreak',
      text: 'A dead-straight corridor cut through the forest, a mile long, heather and grass and the sun just coming up at the far end. And at the far end, a gate. A real metal gate, and a forestry road. You start walking. Behind you, very softly, as if trying not to disturb you: clack.',
      choices: [
        { t: 'Keep walking. Don’t look back', next: 'ending',
          o: 'You keep your eyes on the gate. Clack, behind you. Clack. It doesn’t get closer. It doesn’t get further away. The gate gets bigger, step by step, and you don’t look back. You do not look back.' },
        { t: 'Run for the gate', dmg: 1, next: 'ending',
          o: 'You run. Your legs have had four days of half an oatcake and they fold under you in the heather, and you go down hard on a stone, and get up, and walk.' },
        { t: 'Look back at the clearing', gain: 'marked', scare: 'cn_face', next: 'ending',
          o: 'You can’t help it. You look. At the far end of the firebreak, the fifth cairn is standing in the trees, finished now, and it’s exactly your height. It looks back at you. Something in your chest goes heavy, and cold, and stays that way.' }
      ]
    },

    ending: {
      route: [
        { need: ['marked'], next: 'end_stone' },
        { need: ['logbook', 'firelit'], next: 'end_out' },
        { next: 'end_rescue' }
      ]
    },

    /* ───────────── ENDINGS ───────────── */

    end_out: {
      title: 'The Straight Line', time: 'TUE 07:15', mood: 'golden', img: 'cn_end_out',
      end: { kind: 'survivor', label: 'The only way out' },
      text: 'You climb the gate. A timber lorry comes round the bend, sees you, and stops so hard it slides. The driver wraps you in his coat and doesn’t ask anything. The search goes on for three weeks. They find the minibus, and the bothy, and nothing else. There’s no round clearing in Drumdubh, the rangers say. No cairns. You don’t argue. Every year, on the last Friday in October, there’s a small flat stone on your doorstep. You never pick it up. You never, ever add it to anything.'
    },

    end_stone: {
      title: 'Out of the Trees', time: 'TUE 07:15', mood: 'golden', img: 'cn_end_stone',
      end: { kind: 'bad', label: 'A bad ending' },
      text: 'You made it. The gate, the road, and a car coming, headlights on in the morning mist. It stops. A woman gets out and you stumble towards her, crying, and try to say thank you. It comes out as a sound like two stones knocked together. She starts to scream. In the car’s wing mirror you can see what’s walking towards her: tall, grey, stone on stone, with a red bobble hat on top. You turn round to see it. There’s nothing behind you. There hasn’t been anything behind you for a long time.'
    },

    end_rescue: {
      title: 'So Close', time: 'TUE 06:58', mood: 'blood', img: 'cn_end_rescue',
      end: { kind: 'bad', label: 'A bad ending' },
      text: 'Lights through the trees. Voices calling your name. Orange jackets: Mountain Rescue, forty metres away, then thirty. A woman opens her arms and shouts, “We’ve got you, we’ve got you!” Twenty metres. Ten. Under your foot the ground goes clack. A hand of stacked stone closes round your ankle, very gently, and pulls. The last thing you see is her torch beam swinging across the place you were standing, where there’s now a cairn, your height, with your rucksack on top.'
    },

    end_taken: {
      title: 'Lights Out', time: 'TUE 04:12', mood: 'night', img: 'cn_end_taken',
      end: { kind: 'bad', label: 'A bad ending' },
      text: 'The clacking comes right up to the tent. Then onto it. Stones settle on the canvas one by one, carefully, gently, until the roof sags down onto your face and the walls press in on both sides. It isn’t in a hurry. It never was. It builds until there’s no gap left for the light. In the morning there are five cairns round the clearing, and they’re all finished.'
    },

    end_wolves: {
      title: 'The Pack', time: 'TUE 06:20', mood: 'dusk', img: 'cn_end_wolves',
      end: { kind: 'bad', label: 'A bad ending' },
      text: 'The farmhouse light never gets any closer. The howl comes again, then another answers it, then another, all around you in the heather. Grey shapes, low and quick, closing in a ring. You stop running. So do they. They’re not looking at you, though. They’re looking past you, at the fence, ears flat, whining. Then the lead wolf looks at you, and decides you’re the easier option.'
    },

    end_bog: {
      title: 'The Moss', time: 'TUE 06:30', mood: 'fog', img: 'cn_end_bog',
      end: { kind: 'bad', label: 'A bad ending' },
      text: 'Dev’s footprints go on ahead of you, deeper and deeper into the peat. Then they stop. You go in to your knees, then your waist. The more you struggle, the more the moss holds on. Something under the surface takes hold of your boot, and you feel the shape of it: a hand. An orange sleeve. Then the cold black water is at your chin, and the last thing you see, out on the flat, is a cairn. Waiting.'
    }
  }
};
