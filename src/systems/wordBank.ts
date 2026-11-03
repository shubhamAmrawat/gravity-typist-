// Grouped by rough length for reading only: words are sorted by their real length below.
const WORDS = `
  ant arc arm art ash axe bar bat bay bed bee bow box bud bug bus cab can cap cat cod cog cow cup
  dam den dew dig dim dip dog dot dry ear eel egg elf elm emu end era eye fan fig fin fir fly fog
  fox fur gap gas gel gem gum gym hat hay hen hop hum hut ice ink ion ivy jam jar jaw jet jog joy
  keg key kin kit lab lap law leg lid lip log map mat mop mud nap net nod nut oak oar oat oil orb
  ore owl pad pan paw pea pen pie pin pit pod ray rib rim rod row rug sap saw sea ski sky spa sun
  tab tar tea tin toe top tub two urn use van vat vet vow wax web wig wok yak yam yes yew zen zip
  zoo

  acid apex aqua arch atom band bark beam bird blue boat bolt buoy calm cart cave clay claw coal
  comb cork crab dart dawn deep dock dove drum dune dusk dust east echo edge envy fall fawn fern
  fire fish flag flux foam fork frog gate gear gift glow gold gust hail halo harp hawk haze hill
  hive horn idea inch iron isle jade jazz jolt jump kelp kiln king kite knot lake lamp leaf lime
  lion loop mars mass mesh mist moon moth neon nest node nova oath opal oven palm path peak pine
  plum pond quad quay quiz rail rain reef rice ring rust sail sand seal ship silk snow spin star
  swan tent tide tree tusk unit vale vine void volt wave wind wing wolf wren yard yarn yoke zero
  zest zinc zoom

  acorn alloy amber anvil arrow atlas badge beach birch blaze bloom brick cabin candy cedar chalk
  chord cliff cloud comet coral crane crown daisy dance delta dream drift eagle earth elbow ember
  fable fairy fiber flame flint flute force forge frost giant glass globe grain grape grove hatch
  haven heart honey house igloo inlet ivory jewel jolly juice karma kayak koala ladle laser lemon
  light llama lunar magma mango maple medal meter mirth noble north nymph oasis ocean olive orbit
  otter panda pearl piano plume prism pulse quail quartz quiet radar rainy raven ridge river robot
  rover salad shore solar sonic spark steam stone storm tempo tiger torch tulip ultra umber unity
  valve vapor vault vivid waltz water whale wheat xenon yacht yield young zebra zesty

  anchor artist aurora autumn bamboo banner basalt beacon breeze bridge bronze butter cactus candle
  canyon carbon castle cobalt copper cosmos dancer desert dragon dynamo engine fabric falcon fathom
  fennel flight flower forest gadget galaxy garden geyser ginger guitar hammer harbor helium hollow
  iguana impact island jasper jersey jigsaw jungle kernel kettle kitten knight ladder lagoon launch
  locket magnet marble meadow meteor mirror muffin nebula nectar nickel nimbus orange orchid oxygen
  palace parrot pepper photon planet puzzle quasar quiver rabbit ribbon rocket saddle salmon shadow
  signal silver spiral stream sunset temple thread timber tomato tundra tunnel turtle uplink utopia
  valley vector velvet violet voyage walnut walrus wander window wizard yellow yogurt zenith zephyr
  zipper zodiac

  acrobat antenna balance bicycle biscuit blanket brigade cabinet captain caramel cascade chariot
  chimney compass crystal cyclone diamond dolphin eclipse element emerald feather firefly fortune
  freedom furnace gallery glacier glimmer gondola gravity harmony harvest hickory horizon iceberg
  iridium jasmine journey jukebox justice kestrel kingdom lantern library lobster machine magenta
  mercury mineral monsoon mustang network neutron nucleus oatmeal octopus orchard pancake pelican
  penguin phoenix pilgrim pyramid quantum quarter raccoon rainbow reactor rhubarb saffron sailing
  science seaweed shuttle skyline sparrow tornado tractor trumpet unicorn uranium vanilla venture
  volcano voyager weather wetland whisper zealous

  airplane aluminum amethyst aquarium asteroid backpack baseball birdsong blizzard building
  calendar campfire ceremony cinnamon crescent daffodil daybreak daylight dinosaur drumbeat
  eggplant electric elephant fireball flagship flamingo fountain gemstone glowworm goldfish
  graphite hedgehog highland hologram hydrogen ignition infinity ironclad kangaroo keyboard
  kilowatt kinetics landmark lavender magnetic marigold meridian moonbeam mountain mushroom
  nautical neighbor nightjar notebook observer obsidian overcast parallel pendulum pinwheel
  platinum quadrant question reindeer rotation sapphire saturate seashore sequence snowfall
  starship stardust sunlight tangible tapestry thruster treasure triangle umbrella universe
  upstream velocity vertical vineyard waterbed waterway wildfire wishbone yachting yearbook
  zeppelin zucchini

  adventure alchemist astronaut astronomy avalanche barometer blackbird blueprint butterfly
  carnation carpenter cathedral celestial centrifuge chocolate cinematic crossword dandelion
  direction dragonfly dreamland eccentric evergreen fireplace frequency galvanize goldfinch
  gyroscope harmonica honeycomb hourglass hurricane imaginary intersect jellybean jellyfish
  juxtapose knowledge labyrinth limelight luminance magnitude marmalade moonlight moonstone
  navigator nightfall nightlife orchestra pineapple pinstripe quicksand quotation radiation
  raspberry rosewater sandstorm satellite snowflake snowstorm spaceship starlight sunflower
  supernova tangerine telescope thumbtack turquoise undertake underpass upheaval wallpaper
  waterfall wavefront wonderful xylophone yesterday youngster zoologist

  atmosphere basketball blackberry blacksmith brilliance calculator chandelier cloudburst
  cornflower daydreamer earthquake experiment flashlight generation geothermal greenhouse
  helicopter horizontal hyperdrive illuminate jackhammer journalist kingfisher laboratory
  lemongrass lighthouse microscope motorcycle navigation nightshade oscillator paintbrush
  peppermint perihelion playground powerhouse rainforest refraction revolution sandcastle
  skateboard spacecraft strawberry sunglasses tambourine trampoline typewriter underwater
  vibrations volleyball waterproof watermelon weightless wilderness woodpecker zoological

  accelerator afterburner anniversary archipelago butterflies candlelight cartography demonstrate
  dragonflies dragonfruit electricity engineering firecracker fluorescent gingerbread gravitation
  grasshopper hummingbird hydroponics imagination inspiration investigate lightweight luminescent
  marshmallow nanoseconds nightingale observatory orchestrate photosphere planetarium pomegranate
  quarterback quicksilver rattlesnake screwdriver seismograph skyscrapers spectacular switchboard
  temperature thunderbolt thunderclap thunderhead trailblazer ultraviolet ventilation wavelengths
  wheelbarrow windsurfing wintergreen woodworking yellowstone zooplankton

  acceleration astronomical astrophysics bioluminescent breakthrough chrysanthemum communication
  constellation counterpoint electromagnet electromagnetic extraordinary extraterrestrial
  gravitational hydroelectric intergalactic interplanetary interstellar kaleidoscope kaleidoscopic
  magnetosphere marshmallows mathematician meteorologist microgravity neighborhood oceanographer
  photographer photosynthesis radioactivity refrigerator revolutionary rollercoaster skateboarding
  spectacularly stratosphere stratospheric strawberries superconductor supermassive thermodynamics
  thunderclouds thunderstorm thunderstruck transformation trigonometry unforgettable weightlessness
  whippersnapper
`
  .trim()
  .split(/\s+/);

const WORDS_BY_LENGTH = new Map<number, string[]>();
for (const word of new Set(WORDS)) {
  const group = WORDS_BY_LENGTH.get(word.length);
  if (group) group.push(word);
  else WORDS_BY_LENGTH.set(word.length, [word]);
}

// Prefers a word whose first letter is free, so a typed letter rarely matches two words.
export function randomWord(
  minLength: number,
  maxLength: number,
  usedLetters: ReadonlySet<string>,
  lastText?: string,
): string {
  const inRange: string[] = [];
  for (let length = minLength; length <= maxLength; length++) {
    inRange.push(...(WORDS_BY_LENGTH.get(length) ?? []));
  }

  const fresh = inRange.filter((word) => word !== lastText && !usedLetters.has(word[0]));
  const options = fresh.length > 0 ? fresh : inRange;
  return options[Math.floor(Math.random() * options.length)];
}
