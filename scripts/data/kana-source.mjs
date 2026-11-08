// Hand-curated kana source table. build-kana.mjs turns this into public/data/kana.json.
// Mnemonics are original, written for an English-speaking beginner.
// [romaji, hiragana, katakana, hiragana mnemonic, katakana mnemonic]

export const BASIC_ROWS = [
  { row: "a", items: [
    ["a", "あ", "ア", "An apple with a stem, bitten: \"Aah!\"", "An axe head and its handle: A for axe."],
    ["i", "い", "イ", "Two eels swimming side by side: \"eee!\"", "A tall sword leaning on a wall: ee, it's sharp!"],
    ["u", "う", "ウ", "A tilted U with a little hat: \"ooh\"", "A hat sitting on top of a U: \"oo\", a UFO."],
    ["e", "え", "エ", "An exotic bird with spread wings: \"eh?\"", "An I-beam in a building: \"eh\", elevator shaft."],
    ["o", "お", "オ", "A golfer mid-swing after a hole-in-one: \"Oh!\"", "A cross with a drop falling from it: \"Oh\", an oar."],
  ]},
  { row: "k", items: [
    ["ka", "か", "カ", "A karate chop with a flying dot.", "A karate chop: this shape means \"power\" in kanji (力)."],
    ["ki", "き", "キ", "A KEY with two teeth.", "A KEY with two bars on the shaft."],
    ["ku", "く", "ク", "A cuckoo's open beak: \"ku-ku\".", "A cuckoo's beak, a bit more angular."],
    ["ke", "け", "ケ", "A KEG with a tap on the side.", "A K on its side, like a KEG with a K label."],
    ["ko", "こ", "コ", "Two koi fish, one above the other.", "A CORner: a square missing two sides."],
  ]},
  { row: "s", items: [
    ["sa", "さ", "サ", "A samurai's sash tied in a knot.", "A SAfety fence with three posts."],
    ["shi", "し", "シ", "A fishing hook: \"she\" caught a fish.", "A sideways smiling face: three strokes, \"she\". Dots point right and sweep up from the left."],
    ["su", "す", "ス", "A curl of noodles on a spoon: \"soo\".", "Superman's cape fluttering behind him."],
    ["se", "せ", "セ", "A mouth saying \"SAY\" with a tongue sticking out.", "A SEagull's wings, one longer than the other."],
    ["so", "そ", "ソ", "A zig-zag of sewing thread: \"sew\".", "A SEWing needle pointing down-left. Short stroke on top-left, long stroke sweeping down-left. Don't mix with ン."],
  ]},
  { row: "t", items: [
    ["ta", "た", "タ", "Looks like a 't' and an 'a' side by side: \"ta\".", "A TAble with a tail-gate: three strokes."],
    ["chi", "ち", "チ", "A number 5 on a stand: \"cheese\".", "A CHIcken with a pigtail."],
    ["tsu", "つ", "ツ", "A tsunami wave rolling over.", "TSUnami: two short strokes on top and one long, all pointing down. Short strokes lean down-right. Don't mix with シ."],
    ["te", "て", "テ", "A hand reaching out (\"te\" means hand).", "A golf TEE with a flat top."],
    ["to", "と", "ト", "A toe with a thorn stuck in it.", "A TOtem pole with one branch."],
  ]},
  { row: "n", items: [
    ["na", "な", "ナ", "A nun kneeling in prayer.", "A NAIL with a bent head."],
    ["ni", "に", "ニ", "A knee bent with two dashes beside it.", "Two lines: ニ means \"two\" (ni)."],
    ["nu", "ぬ", "ヌ", "Noodles tangled around chopsticks: \"nu\".", "Chopsticks lifting a bundle of noodles."],
    ["ne", "ね", "ネ", "A cat (neko) with a curled tail.", "A NEt held up by a pole."],
    ["no", "の", "ノ", "A \"no\" sign: one swirl.", "A single slash: NO."],
  ]},
  { row: "h", items: [
    ["ha", "は", "ハ", "A person laughing: \"HA!\"", "A HAT shape, or a person with legs apart."],
    ["hi", "ひ", "ヒ", "A smiling mouth: \"hee hee\".", "A HEEL of a shoe."],
    ["fu", "ふ", "フ", "Mount FUji with clouds on its sides.", "A FUrled flag or hook, one stroke."],
    ["he", "へ", "ヘ", "A hill: \"hey\", look at the hill. Hiragana and katakana look almost the same.", "A hill, same as へ but a touch sharper."],
    ["ho", "ほ", "ホ", "Like は with an extra bar: Ho-ho-ho!", "A HOly cross with two little arms (a person on a hill)."],
  ]},
  { row: "m", items: [
    ["ma", "ま", "マ", "A MAMA with a topknot, one stroke on top.", "A MAchete with its guard."],
    ["mi", "み", "ミ", "Looks like a 3 with a tail: mi sounds like mitsu (three).", "Three lines: \"mi\" means three (mitsu)."],
    ["mu", "む", "ム", "A cow's face going \"MOO\".", "A cow's horn: MOO."],
    ["me", "め", "メ", "An EYE with eyelash (\"me\" means eye).", "An X marks the spot: \"Me!\" Look, me!"],
    ["mo", "も", "モ", "A fishhook with two worms: \"more!\"", "A MOP head with a handle."],
  ]},
  { row: "y", items: [
    ["ya", "や", "ヤ", "A YAK with horns and a tail.", "A YAK with a horn: a bent head."],
    ["yu", "ゆ", "ユ", "A fish swimming in a U: \"you\".", "A U-shaped container with a lid: \"you\"."],
    ["yo", "よ", "ヨ", "A person doing a YOga pose.", "Three bars: like a mirrored E, for a YOgurt cup."],
  ]},
  { row: "r", items: [
    ["ra", "ら", "ラ", "A RABBIT with one long ear.", "A RAMP: one slope over another."],
    ["ri", "り", "リ", "Two reeds growing by a river.", "Two reeds by a RIver bank, two vertical strokes."],
    ["ru", "る", "ル", "A route with a loop at the end.", "RUnning legs: two strokes."],
    ["re", "れ", "レ", "A person relaxing, leaning back.", "A check mark: \"RE\"-ally good."],
    ["ro", "ろ", "ロ", "A winding ROad.", "A square ROom."],
  ]},
  { row: "w", items: [
    ["wa", "わ", "ワ", "Like れ but rounder: a person saying \"WAh!\"", "Like ウ without its hat: \"WAh\"."],
    ["wo", "を", "ヲ", "A person doing a \"WOah!\" pose. Only used as a particle (を, wo/o).", "Like ラ with an extra bar. Very rare: mostly for foreign loanwords."],
    ["n", "ん", "ン", "A slanted 'n' (and it IS the 'n' sound).", "Like ソ but the long stroke goes up-right: \"N\", nope. Don't mix with ソ."],
  ]},
];

// Dakuten rows: base kana (hiragana, katakana) + voiced version
export const DAKUTEN_ROWS = [
  { row: "g", group: "dakuten", pairs: [["ka","ga"],["ki","gi"],["ku","gu"],["ke","ge"],["ko","go"]] },
  { row: "z", group: "dakuten", pairs: [["sa","za"],["shi","ji"],["su","zu"],["se","ze"],["so","zo"]] },
  { row: "d", group: "dakuten", pairs: [["ta","da"],["chi","ji2"],["tsu","zu2"],["te","de"],["to","do"]] },
  { row: "b", group: "dakuten", pairs: [["ha","ba"],["hi","bi"],["fu","bu"],["he","be"],["ho","bo"]] },
  { row: "p", group: "handakuten", pairs: [["ha","pa"],["hi","pi"],["fu","pu"],["he","pe"],["ho","po"]] },
];

// Combo (yōon) rows: base i-kana + small ya/yu/yo
export const COMBO_ROWS = [
  { row: "ky", base: "ki", out: ["kya", "kyu", "kyo"] },
  { row: "sh", base: "shi", out: ["sha", "shu", "sho"] },
  { row: "ch", base: "chi", out: ["cha", "chu", "cho"] },
  { row: "ny", base: "ni", out: ["nya", "nyu", "nyo"] },
  { row: "hy", base: "hi", out: ["hya", "hyu", "hyo"] },
  { row: "my", base: "mi", out: ["mya", "myu", "myo"] },
  { row: "ry", base: "ri", out: ["rya", "ryu", "ryo"] },
  { row: "gy", base: "gi", out: ["gya", "gyu", "gyo"] },
  { row: "j", base: "ji", out: ["ja", "ju", "jo"] },
  { row: "by", base: "bi", out: ["bya", "byu", "byo"] },
  { row: "py", base: "pi", out: ["pya", "pyu", "pyo"] },
];

// Voiced kana map: romaji -> [hiragana, katakana]
export const VOICED = {
  ga: ["が","ガ"], gi: ["ぎ","ギ"], gu: ["ぐ","グ"], ge: ["げ","ゲ"], go: ["ご","ゴ"],
  za: ["ざ","ザ"], ji: ["じ","ジ"], zu: ["ず","ズ"], ze: ["ぜ","ゼ"], zo: ["ぞ","ゾ"],
  da: ["だ","ダ"], ji2: ["ぢ","ヂ"], zu2: ["づ","ヅ"], de: ["で","デ"], do: ["ど","ド"],
  ba: ["ば","バ"], bi: ["び","ビ"], bu: ["ぶ","ブ"], be: ["べ","ベ"], bo: ["ぼ","ボ"],
  pa: ["ぱ","パ"], pi: ["ぴ","ピ"], pu: ["ぷ","プ"], pe: ["ぺ","ペ"], po: ["ぽ","ポ"],
};

export const SMALL_YA = { ya: ["ゃ","ャ"], yu: ["ゅ","ュ"], yo: ["ょ","ョ"] };

// Romaji display overrides (ji2 / zu2 are the rare ぢ / づ)
export const ROMAJI_DISPLAY = { ji2: "ji", zu2: "zu" };

export const SPECIAL = [
  { id: "hira-sokuon", script: "hiragana", kana: "っ", romaji: "(pause)", row: "special",
    mnemonic: "A tiny tsu is a speed bump: it doubles the next consonant. きって = kit-te, a quick stop before the 't'." },
  { id: "kata-sokuon", script: "katakana", kana: "ッ", romaji: "(pause)", row: "special",
    mnemonic: "Tiny ツ works the same as っ: ベッド = bed-do. The pause doubles the next consonant." },
  { id: "kata-choon", script: "katakana", kana: "ー", romaji: "(long)", row: "special",
    mnemonic: "A stretch line in katakana: it lengthens the previous vowel. コーヒー = koohii (coffee)." },
];

// Long-vowel hints shown on the special page (hiragana spells them with extra vowels)
export const LONG_VOWEL_NOTES = [
  "In hiragana, long vowels add an extra vowel kana: おかあさん (okaasan), おにいさん (oniisan), くうき (kuuki).",
  "A long お is usually spelled with う: とうきょう (tookyoo), or sometimes お: おおきい (ookii).",
  "A long え is usually spelled with い: せんせい (sensee).",
  "In katakana, the ー mark is used instead: ラーメン (raamen), スーパー (suupaa).",
];

// Confusable pairs (shown as warnings in Learn mode)
export const CONFUSABLES = {
  "シ": ["ツ"], "ツ": ["シ"], "ソ": ["ン"], "ン": ["ソ"],
  "ぬ": ["め"], "め": ["ぬ"], "ね": ["れ", "わ"], "れ": ["ね", "わ"], "わ": ["ね", "れ"],
  "は": ["ほ"], "ほ": ["は"], "る": ["ろ"], "ろ": ["る"],
  "さ": ["ち"], "ち": ["さ"], "ク": ["ケ", "タ"], "ケ": ["ク"], "タ": ["ク"],
  "ウ": ["ワ"], "ワ": ["ウ"], "コ": ["ユ"], "ユ": ["コ"], "ア": ["マ"], "マ": ["ア"],
};

