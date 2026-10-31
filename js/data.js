// Game data: the same values as game_items.py in the Python version.

export const POWER = {
  EXTRA_TURN: "extra_turn",
  PEEK: "peek",
  STEAL: "steal",
  SHUFFLE: "shuffle",
};

// name: [attack, defence, happiness, description]
export const ITEMS = {
  archer: [1, 2, 0, "Archers are weak fighters but\n provide strong defense."],
  armyflag: [
    1,
    1,
    0,
    "Army flags provide discipline\n and motivation for the army.",
  ],
  axe: [
    0,
    0,
    1,
    "Axes are basic tools for woodcutters and\n have a positive contribution\n to the nation's economy.",
  ],
  assaultpipe: [
    2,
    -1,
    0,
    "Assault pipes provide\n a blitz attack but\n decrease defense power.",
  ],
  bagofgold: [
    0,
    0,
    3,
    "The nation has found\n new economic resources,\n and welfare has increased.",
  ],
  bard: [0, 0, 2, "Bards entertain people."],
  beer: [
    -1,
    -1,
    1,
    "Beer brings happiness but\n reduces soldiers' attack and defense.",
  ],
  bible: [0, 0, 2, "Religion increases\n people's morale and happiness."],
  car: [0, 0, 1, "Cars provide better\n transportation for people."],
  cart: [0, 1, 1, "Carts make quick\n weapon and ware transport."],
  castle: [1, 1, 0, "Castles provide better defense."],
  castlecity: [
    0,
    3,
    3,
    "Castles provide people\n with strong defense, creating happiness.",
  ],
  catapult: [4, 0, 0, "Catapults break castle walls."],
  clown: [0, 0, 1, "Clowns provide entertainment."],
  crown: [0, 0, 1, "Crowns provide safety for the folk."],
  deathrow: [0, 0, -1, "Death row represents punishment."],
  diplomaticletter: [
    0,
    0,
    1,
    "Diplomatic letters promote\n international peace.",
  ],
  doubleaxe: [
    1,
    0,
    0,
    "Double axes indicate that \ncivil people contribute to defense.",
  ],
  doubleswords: [2, 0, 0, "Double swords represent skilled swordsmen."],
  doubleswordshield: [
    2,
    2,
    0,
    "Double swords with\n shields represent a fortified army.",
  ],
  elitearcher: [2, 2, 0, "Elite archers are upgraded archers."],
  elixir: [0, 0, 1, "Elixirs provide \nhealth services for people."],
  executioner: [0, 0, -1, "Executioners demoralize people."],
  fullcastle: [0, 3, 1, "Full castles provide\n full defense and safety."],
  fullknight: [2, 2, 0, "Full knights are upgraded knights."],
  heavyshield: [0, 2, 0, "Heavy shields provide\n special armor protection."],
  helmet: [0, 1, 0, "Helmets provide \nbasic protection for soldiers."],
  helmetsword: [
    1,
    1,
    0,
    "Helmets and swords\n fulfill the basic needs of soldiers.",
  ],
  horse: [1, 0, 1, "Horses can be used \nfor transport and attack."],
  irondoor: [
    0,
    1,
    1,
    "Iron doors increase\n city defense and people's safety.",
  ],
  jousting: [
    1,
    0,
    1,
    "Jousting provides \nentertainment for people \nand trains soldiers.",
  ],
  kingdomflag: [0, 0, 1, "Kingdom flags represent\n prestige for the country."],
  kingorder: [0, 0, -1, "King orders restrict\n some citizen rights."],
  legion: [1, 1, 0, "Legions are balanced\n military powers."],
  lightknight: [1, 0, 0, "Light knights are not\n suitable for defense."],
  lock: [0, 0, 1, "Locks ensure safety \nfor the nation's treasury."],
  monk: [0, 0, 1, "Monks provide moral support \nfor people through religion."],
  morningstar: [
    3,
    -1,
    0,
    "Morning stars are heavy weapons\n that decrease defense power.",
  ],
  nationflag: [
    0,
    0,
    2,
    "People live in united states \nunder the nation's flag.",
  ],
  oldking: [
    0,
    1,
    1,
    "Old kings are wise, \nand people are happy to have\n a wise king who prioritizes defense.",
  ],
  ovalshield: [0, 1, 0, "Oval shields are ordinary metal shields."],
  peaceorder: [0, 0, 2, "Peace orders protect people's citizen rights."],
  princess: [0, 0, 1, "Young princesses give people new hope."],
  queen: [0, 0, 1, "Queens symbolize order and peace."],
  royalcoat: [0, 0, 0, "Royal coats have no special value."],
  ship: [1, 0, 1, "Ships provide better attack and transport capabilities."],
  soldiergrave: [0, -1, -1, "Soldier graves represent the death of soldiers."],
  swordaxe: [
    -1,
    -1,
    -1,
    "Sword axes represent \ncivil conflict between soldiers and folk.",
  ],
  throne: [
    -1,
    -1,
    -1,
    "The absence of a king \nleads to anarchy in the kingdom.",
  ],
  torch: [1, 1, 1, "Torches symbolize \nthe age of science and enlightenment."],
  treasure: [
    0,
    0,
    3,
    "The kingdom has discovered \nnew resources, leading to prosperity.",
  ],
  treasurekey: [
    0,
    0,
    1,
    "Treasure keys provide \nsafety for the kingdom's treasury.",
  ],
  wardragon: [
    5,
    0,
    -3,
    "War dragons are deadly weapons,\n but people must provide significant resources for them.",
  ],
  warehouse: [0, 0, 2, "Warehouses protect grains and food supplies."],
  watersupply: [0, 0, 3, "Clean water resources provide a healthy population."],
  windmill: [0, 0, 3, "Windmills produce flour from grains."],
  winecup: [
    -1,
    -1,
    1,
    "Taverns are good for entertainment,\n but soldiers tend to drink and become less effective.",
  ],
  youngking: [
    1,
    0,
    0,
    "Young kings are eager to capture\n new places, but people are skeptical.",
  ],
};

// Special powers that trigger when a pair is taken
export const POWERS = {
  diplomaticletter: POWER.EXTRA_TURN,
  horse: POWER.EXTRA_TURN,
  ship: POWER.EXTRA_TURN,
  jousting: POWER.EXTRA_TURN,
  torch: POWER.PEEK,
  oldking: POWER.PEEK,
  youngking: POWER.STEAL,
  catapult: POWER.STEAL,
  throne: POWER.SHUFFLE,
  swordaxe: POWER.SHUFFLE,
};

export const POWER_TEXTS = {
  [POWER.EXTRA_TURN]: "Power: play again!",
  [POWER.PEEK]: "Power: four hidden cards are revealed for a moment!",
  [POWER.STEAL]: "Power: you capture your enemy's last pair!",
  [POWER.SHUFFLE]: "Power: anarchy! All hidden cards are shuffled.",
};

export const INTRO_TEXT = `PROLOGUE

In the mystical realm of memory,
an epic battle unfolds. The forces of
strategy and memory clash in a captivating
game that tests the wits of its players.
As ancient dragons soar through the skies
and enchanted creatures roam the lands,
players must harness their cognitive
abilities to uncover hidden cards and
match them in pairs.
The memory game, steeped in arcane lore,
demands tactical thinking and sharp
recollection.

Each turn presents a chance to unveil the
secrets of the cards, revealing mystical
symbols and captivating artwork.
But beware, for the path to victory is
treacherous,and the cards hold both hidden
rewards and cunning traps.

Strategically, players must plan their moves,
carefully memorizing the placement of each card.
With each successful match, their score soars,
unlocking formidable powers and arcane artifacts.
The battle intensifies as rival players strive to
outwit one another, employing cunning strategies
to secure victory.

As the game progresses, the atmosphere thickens
with anticipation. Will you harness the power
of the ancients and claim triumph? Or will the
secrets of the cards slip through your fingers,
leaving you at the mercy of fate?

Enter the realm of strategic memory, where fantasy
intertwines with the realm of the mind. Unleash your
cognitive prowess, navigate the labyrinth of memory,
and emerge as the victor in this extraordinary battle
of wits.The fate of the memory realm rests in your hands.



...GOOD LUCK

...Program Devrim Savas Yilmaz
...Design Devrim and Malin`;

export const RULES_TEXT = `Welcome, O great leader! Here, we lay out the tools you can make use of to build
and rule your kingdom. Choose wisely and balance your decisions for prosperity and victory.
Each item comes with unique properties, affecting your nation in Attack Power, Defense Power,
and the Happiness of your people.

HOW TO PLAY

1. Find all the pairs as fast as you can. The clock starts when you turn over your first card
   and stops when the last pair is found.

2. Every pair you find adds its Attack, Defence and Happiness to your kingdom.

3. Torch and Old King have a special power: four hidden cards are revealed for a moment.
   Remember them well!

4. Your best time is saved on this device. Beat it to set a new record.

THE ITEMS

Archer: They may seem weak on the offensive, but never underestimate their defensive prowess.

Army Flag: An emblem of unity, fostering discipline and motivation within your ranks.

Axe: A humble tool that boosts your nation's economy, vital for the woodcutters.

Assault Pipe: While it can be effective in surprise attacks, be aware of the decreased defense power.

Bag of Gold: With newfound economic resources, your nation's welfare will see a significant increase.

Beer: A mug of joy brings happiness to the common folk, but beware, it weakens your soldiers.

Bible: A source of spiritual sustenance that uplifts the morale and happiness of your people.

Car & Cart: Efficient transportation to improve everyday life and to deliver weapons and supplies swiftly.

Castle City: A mighty fortress that guarantees defense and fosters happiness among your people.

Catapult: Perfect for castle sieges, tearing down the stoutest walls.

Clown & Jousting: Entertainment is crucial for your people's happiness.

Crown: Safety and a sense of identity for your nation.

Death Row & Executioner: Punishment methods which might demoralize your people.

Diplomatic Letter: A means to establish peace internationally.

Double Axe & Double Sword: Boost your defense and offensive capabilities respectively.

Double Sword Shield & Heavy Shield: Bolster your army's defenses.

Elite Archer & Full Knight: Upgraded units enhancing your military capabilities.

Elixir: Ensuring the health of your people.

Full Castle: Complete defense and a sense of safety for your nation.

Helmet & Helmet Sword: Essential equipment for your soldiers.

Horse: Useful for transportation and launching swift attacks.

Iron Door: Sturdy protection for your city, creating a feeling of safety.

Kingdom Flag: A symbol of prestige and unity for your nation.

King Order & Throne: Be careful, these can lead to unrest and anarchy in your kingdom.

Legion: Balanced military power at your disposal.

Light Knight: Quick and agile, but not so good for defense.

Lock: Protects your nation's treasury.

Monk: Religious figures providing moral support.

Morning Star: Powerful but heavy, lowering defense for whoever wields it.

Nation Flag: A testament to the unity of your people.

Old King: A wise leader who prioritizes defense and people's happiness.

Oval Shield: A sturdy metal shield for your soldiers.

Peace and Order: Maintain citizen rights for a happy populace.

Princess & Queen: Symbols of hope, order, and peace.

Royal Coat: Holds no significant value.

Ship: Enables better transport and sea attacks.

Soldier Grave: The reminder of brave soldiers who gave their lives.

Sword and Axe: Be cautious, can lead to civil conflicts.

Torch: An era of science and enlightenment awaits.

Treasure & Treasure Key: Uncover new resources and keep them secure.

War Dragon: A deadly force of destruction that requires a lot of resources.

Warehouse & Water Supply: Protects your food supplies and ensures clean water for your people.

Windmill: Flour production from grains, crucial for feeding your kingdom.

Wine Cup: An ambiance of joy but can cause unruly soldiers.

Young King: Full of energy and ambition, but his plans can stir skepticism among the people.

Remember, great leader, the fate of your nation rests in your hands. Choose wisely and lead them to glory!`;

export const ABOUT_TEXT = `ABOUT GAME

This game brings some strategic features to the classic memory game.
While I was planning the game,
I actually planned a standard algorithm for beginners to show how to make
an easy memory game. But while i was writing my codes, i wanted to add some new
strategy elements to have fun. The hardest part was to find drawings and edit them
with photoshop.

First, I decide pre-made
characters in photoshop to prepare the cards. I designed the playing cards. However,
i did not like them and suddenly i thought i might use medieval theme and elements 
I edited the graphics that I found on the
internet with photoshop add color etc. The game is still not finished,

I did some programming and graphics tricks because Python's tkinter interface is
not very
flexible and not ideal for gaming. However, as a result, i really enjoyed while i
was writing my codes. 

In memory of the Amiga game "Turn it" that I saw in the first computer magazine I bought at the end of May 1990.

Devrim Savas Yilmaz
Program :Devrim Savas Yilmaz
Design and Graphic: Devrim Savas Yilmaz & Malin Nilsen
        `;
