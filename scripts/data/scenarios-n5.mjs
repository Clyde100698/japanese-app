// N5 Scenarios (10 scenarios)
export const SCENARIOS_N5 = [
  {
    id: "n5-ramen",
    title: "Ordering at a Ramen Shop",
    titleJa: "ラーメン屋での注文",
    level: "N5",
    category: "Dining",
    description: "You enter a cozy ramen shop in Tokyo. Buy your ticket from the machine or tell the chef what you want, specify noodles, and ask for water.",
    keyPhrases: [
      { id: "phrase-ramen-1", front: "しょうゆラーメンをください", reading: "しょうゆらーめんをください", romaji: "shouyu raamen o kudasai", answer: "Soy sauce ramen, please.", notes: "The classic 〜をください ordering formula." },
      { id: "phrase-ramen-2", front: "お水をお願いします", reading: "おみずをおねがいします", romaji: "omizu o onegaishimasu", answer: "Water, please.", notes: "Polite request for water." },
      { id: "phrase-ramen-3", front: "ごちそうさまでした", reading: "ごちそうさまでした", romaji: "gochisousama deshita", answer: "Thank you for the meal.", notes: "Said after finishing a meal." }
    ],
    lines: [
      {
        id: "r1",
        speaker: "other",
        speakerName: "Chef",
        speakerNameJa: "店主",
        ja: "いらっしゃい！何名様ですか？",
        reading: "いらっしゃい！なんめいさまですか？",
        romaji: "Irasshai! Nanmei-sama desu ka?",
        en: "Welcome! How many people in your party?",
        politeness: "polite"
      },
      {
        id: "r2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "一人です。",
        reading: "ひとりです。",
        romaji: "Hitori desu.",
        en: "Just one person.",
        politeness: "polite",
        options: [
          {
            id: "opt-r2-1",
            ja: "一人です。",
            reading: "ひとりです。",
            romaji: "Hitori desu.",
            en: "One person.",
            politeness: "polite",
            isCorrect: true,
            explanation: "Natural and polite counter for one person (ひとり).",
            reaction: { speaker: "Chef", speakerJa: "店主", ja: "カウンターへどうぞ！", reading: "かうんたーへどうぞ！", romaji: "Kauntaa e douzo!", en: "Right this way to the counter!" }
          },
          {
            id: "opt-r2-2",
            ja: "一つです。",
            reading: "ひとつです。",
            romaji: "Hitotsu desu.",
            en: "One piece.",
            politeness: "casual",
            isCorrect: false,
            explanation: "一つ (hitotsu) is for inanimate items, not people. Use ひとり (hitori) for one person."
          },
          {
            id: "opt-r2-3",
            ja: "一人！",
            reading: "ひとり！",
            romaji: "Hitori!",
            en: "One!",
            politeness: "casual",
            isCorrect: false,
            explanation: "A bit too abrupt when talking to shop staff. Adding です softens it politely."
          }
        ]
      },
      {
        id: "r3",
        speaker: "other",
        speakerName: "Chef",
        speakerNameJa: "店主",
        ja: "ご注文はお決まりですか？",
        reading: "ごちゅうもんはおきまりですか？",
        romaji: "Gochuumon wa okimari desu ka?",
        en: "Have you decided on your order?",
        politeness: "keigo"
      },
      {
        id: "r4",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "しょうゆラーメンを一つお願いします。",
        reading: "しょうゆらーめんをひとつおねがいします。",
        romaji: "Shouyu raamen o hitotsu onegaishimasu.",
        en: "One soy sauce ramen, please.",
        politeness: "polite",
        options: [
          {
            id: "opt-r4-1",
            ja: "しょうゆラーメンを一つお願いします。",
            reading: "しょうゆらーめんをひとつおねがいします。",
            romaji: "Shouyu raamen o hitotsu onegaishimasu.",
            en: "One soy sauce ramen, please.",
            politeness: "polite",
            isCorrect: true,
            explanation: "Perfect customer phrasing: [item] + を + [quantity] + お願いします.",
            reaction: { speaker: "Chef", speakerJa: "店主", ja: "はい！しょうゆラーメン一丁！麺の硬さはどうしますか？", reading: "はい！しょうゆらーめんいっちょう！めんのかたさはどうしますか？", romaji: "Hai! Shouyu raamen itchou! Men no katasa wa dou shimasu ka?", en: "Got it! One soy ramen! How would you like your noodles cooked?" }
          },
          {
            id: "opt-r4-2",
            ja: "ラーメンを食べる！",
            reading: "らーめんをたべる！",
            romaji: "Raamen o taberu!",
            en: "I'll eat ramen!",
            politeness: "casual",
            isCorrect: false,
            explanation: "Grammatically plain verb statement; too childish and blunt for an order."
          }
        ]
      },
      {
        id: "r5",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "普通でお願いします。",
        reading: "ふつうでおねがいします。",
        romaji: "Futsuu de onegaishimasu.",
        en: "Regular (normal hardness), please.",
        politeness: "polite",
        options: [
          {
            id: "opt-r5-1",
            ja: "普通でお願いします。",
            reading: "ふつうでおねがいします。",
            romaji: "Futsuu de onegaishimasu.",
            en: "Regular, please.",
            politeness: "polite",
            isCorrect: true,
            explanation: "普通 (futsuu = regular/normal) is the standard reply when asked about noodle firmness or broth richness.",
            reaction: { speaker: "Chef", speakerJa: "店主", ja: "かしこまりました。少々お待ちください！", reading: "かしこまりました。しょうしょうおまちください！", romaji: "Kashikomarimashita. Shoushou omachi kudasai!", en: "Understood. Please wait a moment!" }
          },
          {
            id: "opt-r5-2",
            ja: "硬い！",
            reading: "かたい！",
            romaji: "Katai!",
            en: "Hard!",
            politeness: "casual",
            isCorrect: false,
            explanation: "If you want firm noodles, say '硬めでお願いします' (katame de onegaishimasu)."
          }
        ]
      }
    ]
  },
  {
    id: "n5-konbini",
    title: "Convenience Store Checkout",
    titleJa: "コンビニのレジ会計",
    level: "N5",
    category: "Shopping",
    description: "At the convenience store (konbini) checkout counter, answer questions about plastic bags, heating up your bento, and payment method.",
    keyPhrases: [
      { id: "phrase-konbini-1", front: "袋は大丈夫です", reading: "ふくろはだいじょうぶです", romaji: "fukuro wa daijoubu desu", answer: "I don't need a bag (no bag is fine).", notes: "Standard way to decline a plastic shopping bag." },
      { id: "phrase-konbini-2", front: "温めてください", reading: "あたたためてください", romaji: "atatamete kudasai", answer: "Please heat it up.", notes: "Asking the clerk to microwave your food." },
      { id: "phrase-konbini-3", front: "Suicaでお願いします", reading: "すいかでおねがいします", romaji: "Suica de onegaishimasu", answer: "By Suica, please.", notes: "Paying with an IC transit card." }
    ],
    lines: [
      {
        id: "k1",
        speaker: "other",
        speakerName: "Clerk",
        speakerNameJa: "店員",
        ja: "いらっしゃいませ。レジ袋はご利用ですか？",
        reading: "いらっしゃいませ。れじぶくろはごりようですか？",
        romaji: "Irasshaimase. Rejibukuro wa goriyou desu ka?",
        en: "Welcome. Would you like a plastic shopping bag?",
        politeness: "keigo"
      },
      {
        id: "k2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "いいえ、大丈夫です。",
        reading: "いいえ、だいじょうぶです。",
        romaji: "Iie, daijoubu desu.",
        en: "No, I'm fine without one.",
        politeness: "polite",
        options: [
          {
            id: "opt-k2-1",
            ja: "いいえ、大丈夫です。",
            reading: "いいえ、だいじょうぶです。",
            romaji: "Iie, daijoubu desu.",
            en: "No, I'm fine without one.",
            politeness: "polite",
            isCorrect: true,
            explanation: "Natural, polite way to decline a bag. '大丈夫です' means 'I'm good/no thank you.'",
            reaction: { speaker: "Clerk", speakerJa: "店員", ja: "かしこまりました。お弁当は温めますか？", reading: "かしこまりました。おべんとうはあたためますか？", romaji: "Kashikomarimashita. Obentou wa atatamemasu ka?", en: "Understood. Shall I heat up your bento?" }
          },
          {
            id: "opt-k2-2",
            ja: "袋を要らない！",
            reading: "ふくろをいらない！",
            romaji: "Fukuro o iranai!",
            en: "Don't need bag!",
            politeness: "casual",
            isCorrect: false,
            explanation: "Grammatically awkward and rude. Use 袋は大丈夫です or 袋は要りません."
          }
        ]
      },
      {
        id: "k3",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "はい、お願いします。",
        reading: "はい、おねがいします。",
        romaji: "Hai, onegaishimasu.",
        en: "Yes, please.",
        politeness: "polite",
        options: [
          {
            id: "opt-k3-1",
            ja: "はい、お願いします。",
            reading: "はい、おねがいします。",
            romaji: "Hai, onegaishimasu.",
            en: "Yes, please.",
            politeness: "polite",
            isCorrect: true,
            explanation: "Clean and polite acceptance of heating service.",
            reaction: { speaker: "Clerk", speakerJa: "店員", ja: "少々お待ちください。合計で750円になります。", reading: "しょうしょうおまちください。ごうけいでななひゃくごじゅうえんになります。", romaji: "Shoushou omachi kudasai. Goukei de nanahyaku gojuu-en ni narimasu.", en: "Just a moment please. The total comes to 750 yen." }
          },
          {
            id: "opt-k3-2",
            ja: "熱くして！",
            reading: "あつくして！",
            romaji: "Atsuku shite!",
            en: "Make it hot!",
            politeness: "casual",
            isCorrect: false,
            explanation: "Too demanding and casual. Say 温めてください or はい、お願いします."
          }
        ]
      },
      {
        id: "k4",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "Suicaで支払います。",
        reading: "すいかでしはらいます。",
        romaji: "Suica de shiharaimasu.",
        en: "I will pay with Suica.",
        politeness: "polite",
        options: [
          {
            id: "opt-k4-1",
            ja: "Suicaでお願いします。",
            reading: "すいかでおねがいします。",
            romaji: "Suica de onegaishimasu.",
            en: "By Suica, please.",
            politeness: "polite",
            isCorrect: true,
            explanation: "[Payment method] + でお願いします is the most universal and polite way to state how you're paying.",
            reaction: { speaker: "Clerk", speakerJa: "店員", ja: "はい、端末にタッチしてください。ありがとうございました！", reading: "はい、たんまつにタッチしてください。ありがとうございました！", romaji: "Hai, tanmatsu ni tacchi shite kudasai. Arigatou gozaimashita!", en: "Please tap your card on the terminal. Thank you very much!" }
          },
          {
            id: "opt-k4-2",
            ja: "お金はない。",
            reading: "おかねはない。",
            romaji: "Okane wa nai.",
            en: "I don't have money.",
            politeness: "casual",
            isCorrect: false,
            explanation: "Saying you don't have money will stop the transaction! Specify your payment method."
          }
        ]
      }
    ]
  },
  {
    id: "n5-directions",
    title: "Asking for Train Directions",
    titleJa: "駅で道を尋ねる",
    level: "N5",
    category: "Travel",
    description: "You are inside Shinjuku station trying to locate the Yamanote Line platform. Ask a station attendant for help.",
    keyPhrases: [
      { id: "phrase-dir-1", front: "すみません、山手線はどこですか？", reading: "すみません、やまのてせんはどこですか？", romaji: "sumimasen, yamanotesen wa doko desu ka?", answer: "Excuse me, where is the Yamanote Line?", notes: "Basic question for finding places." },
      { id: "phrase-dir-2", front: "あちらです", reading: "あちらです", romaji: "achira desu", answer: "It is over that way.", notes: "Polite direction word for that direction over there." },
      { id: "phrase-dir-3", front: "どうもありがとうございます", reading: "どうもありがとうございます", romaji: "doumo arigatou gozaimasu", answer: "Thank you very much.", notes: "Warm, respectful thanks." }
    ],
    lines: [
      {
        id: "d1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "すみません、山手線の乗り場はどこですか？",
        reading: "すみません、やまのてせんののりばはどこですか？",
        romaji: "Sumimasen, Yamanotesen no noriba wa doko desu ka?",
        en: "Excuse me, where is the Yamanote Line boarding platform?",
        politeness: "polite",
        options: [
          {
            id: "opt-d1-1",
            ja: "すみません、山手線の乗り場はどこですか？",
            reading: "すみません、やまのてせんののりばはどこですか？",
            romaji: "Sumimasen, Yamanotesen no noriba wa doko desu ka?",
            en: "Excuse me, where is the Yamanote Line platform?",
            politeness: "polite",
            isCorrect: true,
            explanation: "Starts with the essential attention-getter 'すみません' and asks location politely with 'どこですか'.",
            reaction: { speaker: "Attendant", speakerJa: "駅員", ja: "山手線ですね。この通路をまっすぐ行って、右側の階段を上がってください。", reading: "やまのてせんですね。このつうろをまっすぐいって、みぎがわのかいだんをあがってください。", romaji: "Yamanotesen desu ne. Kono tsuuro o massugu itte, migigawa no kaidan o agatte kudasai.", en: "Yamanote Line? Go straight down this corridor and go up the stairs on the right." }
          },
          {
            id: "opt-d1-2",
            ja: "おい！電車はどこ？",
            reading: "おい！でんしゃはどこ？",
            romaji: "Oi! Densha wa doko?",
            en: "Hey! Where's the train?",
            politeness: "casual",
            isCorrect: false,
            explanation: "Never use 'おい' (oi = hey) with strangers or staff. It sounds very rude and confrontational."
          }
        ]
      },
      {
        id: "d2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "右の階段ですね。何番線ですか？",
        reading: "みぎのかいだんですね。なんばんせんですか？",
        romaji: "Migi no kaidan desu ne. Nanbansen desu ka?",
        en: "The right stairs, got it. Which track/platform number is it?",
        politeness: "polite",
        options: [
          {
            id: "opt-d2-1",
            ja: "右の階段ですね。何番線ですか？",
            reading: "みぎのかいだんですね。なんばんせんですか？",
            romaji: "Migi no kaidan desu ne. Nanbansen desu ka?",
            en: "The right stairs, got it. Which track number is it?",
            politeness: "polite",
            isCorrect: true,
            explanation: "Confirms the direction politely and asks for the specific track number using 何番線 (nanbansen).",
            reaction: { speaker: "Attendant", speakerJa: "駅員", ja: "渋谷方面なら14番線、池袋方面なら15番線です。", reading: "しぶやほうめんならじゅうよんばんせん、いけぶくろほうめんならじゅうごばんせんです。", romaji: "Shibuya houmen nara juuyonbansen, Ikebukuro houmen nara juugobansen desu.", en: "If heading toward Shibuya it's track 14; toward Ikebukuro it's track 15." }
          },
          {
            id: "opt-d2-2",
            ja: "番号を教えて。",
            reading: "ばんごうをおしえて。",
            romaji: "Bangou o oshiete.",
            en: "Tell me the number.",
            politeness: "casual",
            isCorrect: false,
            explanation: "Too demanding and missing politeness markers. Use 何番線ですか (nanbansen desu ka)."
          }
        ]
      },
      {
        id: "d3",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "よく分かりました。ありがとうございます！",
        reading: "よくわかりました。ありがとうございます！",
        romaji: "Yoku wakarimashita. Arigatou gozaimasu!",
        en: "I understand well now. Thank you very much!",
        politeness: "polite",
        options: [
          {
            id: "opt-d3-1",
            ja: "よく分かりました。ありがとうございます！",
            reading: "よくわかりました。ありがとうございます！",
            romaji: "Yoku wakarimashita. Arigatou gozaimasu!",
            en: "I understand now. Thank you very much!",
            politeness: "polite",
            isCorrect: true,
            explanation: "Polite acknowledgement of understanding and gratitude.",
            reaction: { speaker: "Attendant", speakerJa: "駅員", ja: "いってらっしゃい！お気をつけて。", reading: "いってらっしゃい！おきをつけて。", romaji: "Itterasshai! Oki o tsukete.", en: "Have a safe trip! Take care." }
          }
        ]
      }
    ]
  },
  {
    id: "n5-hotel-checkin",
    title: "Hotel Front Desk Check-in",
    titleJa: "ホテルのチェックイン",
    level: "N5",
    category: "Travel",
    description: "Check into your hotel room in Kyoto, give your reservation name, and ask about breakfast hours.",
    keyPhrases: [
      { id: "phrase-hotel-1", front: "チェックインをお願いします", reading: "ちぇっくいんをおねがいします", romaji: "chekkuin o onegaishimasu", answer: "Check-in, please.", notes: "The go-to phrase at a hotel front desk." },
      { id: "phrase-hotel-2", front: "予約したスミスです", reading: "よやくしたすみすです", romaji: "yoyaku shita Sumisu desu", answer: "I'm Smith, I have a reservation.", notes: "Stating your reservation name." },
      { id: "phrase-hotel-3", front: "朝食は何時からですか？", reading: "ちょうしょくはなんじからですか？", romaji: "choushoku wa nanji kara desu ka?", answer: "What time does breakfast start?", notes: "Asking about starting times." }
    ],
    lines: [
      {
        id: "h1",
        speaker: "other",
        speakerName: "Front Desk",
        speakerNameJa: "フロント",
        ja: "いらっしゃいませ。チェックインでございますか？",
        reading: "いらっしゃいませ。ちぇっくいんでございますか？",
        romaji: "Irasshaimase. Chekkuin de gozaimasu ka?",
        en: "Welcome. Are you checking in?",
        politeness: "keigo"
      },
      {
        id: "h2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "はい、チェックインをお願いします。予約した田中です。",
        reading: "はい、ちぇっくいんをおねがいします。よやくしたたなかです。",
        romaji: "Hai, chekkuin o onegaishimasu. Yoyaku shita Tanaka desu.",
        en: "Yes, check-in please. I'm Tanaka, I have a reservation.",
        politeness: "polite",
        options: [
          {
            id: "opt-h2-1",
            ja: "はい、チェックインをお願いします。予約した田中です。",
            reading: "はい、ちぇっくいんをおねがいします。よやくしたたなかです。",
            romaji: "Hai, chekkuin o onegaishimasu. Yoyaku shita Tanaka desu.",
            en: "Yes, check-in please. I'm Tanaka, I have a reservation.",
            politeness: "polite",
            isCorrect: true,
            explanation: "Gives clear affirmative, request, and your reservation name politely.",
            reaction: { speaker: "Front Desk", speakerJa: "フロント", ja: "田中様ですね。ご予約を確認いたしました。パスポートを拝見できますか？", reading: "たなかさまですね。ごよやくをかくにんいたしました。ぱすぽーとをはいけんできますか？", romaji: "Tanaka-sama desu ne. Goyoyaku o kakunin itashimashita. Pasupooto o haiken dekimasu ka?", en: "Mr./Ms. Tanaka, yes. I have confirmed your reservation. May I see your passport?" }
          },
          {
            id: "opt-h2-2",
            ja: "部屋をくれ！",
            reading: "へやをくれ！",
            romaji: "Heya o kure!",
            en: "Give me the room!",
            politeness: "casual",
            isCorrect: false,
            explanation: "Very abrasive imperative. Always use polite requests with service staff."
          }
        ]
      },
      {
        id: "h3",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "はい、どうぞ。朝食は何時からですか？",
        reading: "はい、どうぞ。ちょうしょくはなんじからですか？",
        romaji: "Hai, douzo. Choushoku wa nanji kara desu ka?",
        en: "Here you are. What time is breakfast?",
        politeness: "polite",
        options: [
          {
            id: "opt-h3-1",
            ja: "はい、どうぞ。朝食は何時からですか？",
            reading: "はい、どうぞ。ちょうしょくはなんじからですか？",
            romaji: "Hai, douzo. Choushoku wa nanji kara desu ka?",
            en: "Here you go. What time is breakfast from?",
            politeness: "polite",
            isCorrect: true,
            explanation: "'はい、どうぞ' hands the passport over courteously; '何時からですか' asks the schedule smoothly.",
            reaction: { speaker: "Front Desk", speakerJa: "フロント", ja: "ありがとうございます。朝食は朝7時から9時半まで、2階のレストランでございます。こちらがルームキーです。", reading: "ありがとうございます。ちょうしょくはあさしちじからくじはんまで、にかいのれすとらんでございます。こちらがるーむきーです。", romaji: "Arigatou gozaimasu. Choushoku wa asa shichiji kara kujihan made, nikai no resutoran de gozaimasu. Kochira ga ruumukii desu.", en: "Thank you. Breakfast is from 7:00 AM to 9:30 AM at the 2nd-floor restaurant. Here is your room key." }
          }
        ]
      }
    ]
  },
  {
    id: "n5-cafe",
    title: "Ordering at a Café",
    titleJa: "カフェでの注文",
    level: "N5",
    category: "Dining",
    description: "Order an iced latte, specify whether it's for here or to go, and choose your cup size.",
    keyPhrases: [
      { id: "phrase-cafe-1", front: "アイスラテのMサイズ", reading: "あいすらてのえむさいず", romaji: "aisu rate no emu saizu", answer: "Medium iced latte", notes: "Drink + size pairing." },
      { id: "phrase-cafe-2", front: "店内で飲みます", reading: "てんないでのみます", romaji: "tennai de nomimasu", answer: "I will drink it inside the shop.", notes: "Specifying 'for here'." },
      { id: "phrase-cafe-3", front: "持ち帰りでお願いします", reading: "もちかえりでおねがいします", romaji: "mochikaeri de onegaishimasu", answer: "To go (takeout), please.", notes: "Specifying takeout." }
    ],
    lines: [
      {
        id: "c1",
        speaker: "other",
        speakerName: "Barista",
        speakerNameJa: "店員",
        ja: "こんにちは！店内でお召し上がりですか？",
        reading: "こんにちは！てんないでおめしあがりですか？",
        romaji: "Konnichiwa! Tennai de omeshagari desu ka?",
        en: "Hello! Will you be having that in the café?",
        politeness: "keigo"
      },
      {
        id: "c2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "持ち帰りでお願いします。",
        reading: "もちかえりでおねがいします。",
        romaji: "Mochikaeri de onegaishimasu.",
        en: "To go, please.",
        politeness: "polite",
        options: [
          {
            id: "opt-c2-1",
            ja: "持ち帰りでお願いします。",
            reading: "もちかえりでおねがいします。",
            romaji: "Mochikaeri de onegaishimasu.",
            en: "To go, please.",
            politeness: "polite",
            isCorrect: true,
            explanation: "持ち帰り (mochikaeri = takeout) is the standard term in Japanese cafes and fast-food shops.",
            reaction: { speaker: "Barista", speakerJa: "店員", ja: "テイクアウトですね。ご注文をどうぞ！", reading: "ていくあうとですね。ごちゅうもんをどうぞ！", romaji: "Teikuauto desu ne. Gochuumon o douzo!", en: "Takeout, certainly. What can I get for you?" }
          },
          {
            id: "opt-c2-2",
            ja: "店内でお召し上がりです。",
            reading: "てんないでおめしあがりです。",
            romaji: "Tennai de omeshagari desu.",
            en: "I am having it inside (using honorific toward myself).",
            politeness: "keigo",
            isCorrect: false,
            explanation: "お召し上がり is an honorific verb reserved for others. For yourself, say 店内で飲みます (tennai de nomimasu) or ここで食べます."
          }
        ]
      },
      {
        id: "c3",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "アイスラテを一つ、Mサイズでください。",
        reading: "あいすらてをひとつ、えむさいずでください。",
        romaji: "Aisu rate o hitotsu, emu saizu de kudasai.",
        en: "One iced latte, in medium size please.",
        politeness: "polite",
        options: [
          {
            id: "opt-c3-1",
            ja: "アイスラテを一つ、Mサイズでください。",
            reading: "あいすらてをひとつ、えむさいずでください。",
            romaji: "Aisu rate o hitotsu, emu saizu de kudasai.",
            en: "One iced latte, medium size please.",
            politeness: "polite",
            isCorrect: true,
            explanation: "Clear, natural specification of beverage, quantity, and size.",
            reaction: { speaker: "Barista", speakerJa: "店員", ja: "アイスラテのMがおひとつですね。480円です。", reading: "あいすらてのえむがおひとつですね。よんひゃくはちじゅうえんです。", romaji: "Aisu rate no emu ga ohitotsu desu ne. Yonhyaku hachijuu-en desu.", en: "One medium iced latte. That will be 480 yen." }
          }
        ]
      }
    ]
  },
  {
    id: "n5-ticket",
    title: "Buying a Shinkansen Ticket",
    titleJa: "新幹線切符の購入",
    level: "N5",
    category: "Travel",
    description: "At the JR ticket counter (みどりの窓口), purchase a bullet train ticket from Tokyo to Kyoto for tomorrow morning.",
    keyPhrases: [
      { id: "phrase-ticket-1", front: "京都までの切符", reading: "きょうとまでのきっぷ", romaji: "Kyouto made no kippu", answer: "A ticket to Kyoto", notes: "Destination + までの切符." },
      { id: "phrase-ticket-2", front: "指定席でお願いします", reading: "していせきでおねがいします", romaji: "shiteiseki de onegaishimasu", answer: "Reserved seat, please.", notes: "Designating reserved seating." },
      { id: "phrase-ticket-3", front: "窓側の席はありますか？", reading: "まどがわのせきはありますか？", romaji: "madogawa no seki wa arimasu ka?", answer: "Is there a window seat available?", notes: "Window seat preference." }
    ],
    lines: [
      {
        id: "tk1",
        speaker: "other",
        speakerName: "JR Agent",
        speakerNameJa: "駅員",
        ja: "いらっしゃいませ。どちらまでですか？",
        reading: "いらっしゃいませ。どちらまでですか？",
        romaji: "Irasshaimase. Dochira made desu ka?",
        en: "Welcome. Where are you traveling to?",
        politeness: "keigo"
      },
      {
        id: "tk2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "明日の京都まで一枚お願いします。",
        reading: "あしたのきょうとまでいちまいおねがいします。",
        romaji: "Ashita no Kyouto made ichimai onegaishimasu.",
        en: "One ticket to Kyoto for tomorrow, please.",
        politeness: "polite",
        options: [
          {
            id: "opt-tk2-1",
            ja: "明日の京都まで一枚お願いします。",
            reading: "あしたのきょうとまでいちまいおねがいします。",
            romaji: "Ashita no Kyouto made ichimai onegaishimasu.",
            en: "One ticket to Kyoto for tomorrow, please.",
            politeness: "polite",
            isCorrect: true,
            explanation: "一枚 (ichimai) is the correct flat-object counter for paper tickets.",
            reaction: { speaker: "JR Agent", speakerJa: "駅員", ja: "明日の京都ですね。指定席と自由席、どちらになさいますか？", reading: "あしたのきょうとですね。していせきとじゆうせき、どちらになさいますか？", romaji: "Ashita no Kyouto desu ne. Shiteiseki to jiyuuseki, dochira ni nasaimasu ka?", en: "Kyoto tomorrow. Would you prefer a reserved seat or unreserved seat?" }
          },
          {
            id: "opt-tk2-2",
            ja: "京都を一つ！",
            reading: "きょうとをひとつ！",
            romaji: "Kyouto o hitotsu!",
            en: "One Kyoto!",
            politeness: "casual",
            isCorrect: false,
            explanation: "Tickets take the flat counter 〜枚 (mai), not 〜つ (tsu), and state the destination with まで."
          }
        ]
      },
      {
        id: "tk3",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "指定席でお願いします。窓側の席は空いていますか？",
        reading: "していせきでおねがいします。まどがわのせきはあいていますか？",
        romaji: "Shiteiseki de onegaishimasu. Madogawa no seki wa aiteimasu ka?",
        en: "Reserved seat, please. Is a window seat open?",
        politeness: "polite",
        options: [
          {
            id: "opt-tk3-1",
            ja: "指定席でお願いします。窓側の席は空いていますか？",
            reading: "していせきでおねがいします。まどがわのせきはあいていますか？",
            romaji: "Shiteiseki de onegaishimasu. Madogawa no seki wa aiteimasu ka?",
            en: "Reserved seat, please. Is a window seat open?",
            politeness: "polite",
            isCorrect: true,
            explanation: "Specifies 指定席 and asks for 窓側 (madogawa = window side) seat.",
            reaction: { speaker: "JR Agent", speakerJa: "駅員", ja: "午前9時発ののぞみ号で、窓側のお席がお取りできます。", reading: "ごぜんくじはつののぞみごうで、まどがわのおせきがおとりできます。", romaji: "Gozen kuji hatsu no Nozomi-gou de, madogawa no oseki ga otori dekimasu.", en: "On the 9:00 AM Nozomi departure, we can reserve a window seat for you." }
          }
        ]
      }
    ]
  },
  {
    id: "n5-restroom",
    title: "Asking for the Restroom",
    titleJa: "トイレの場所を尋ねる",
    level: "N5",
    category: "Daily Life",
    description: "In a shopping mall or restaurant, ask where the restroom is located.",
    keyPhrases: [
      { id: "phrase-restroom-1", front: "お手洗いはどこですか？", reading: "おてあらいはどこですか？", romaji: "otearai wa doko desu ka?", answer: "Where is the restroom?", notes: "Politer word for toilet/bathroom." },
      { id: "phrase-restroom-2", front: "突き当たりを右です", reading: "つきあたりをみぎです", romaji: "tsukiatari o migi desu", answer: "Turn right at the end of the hallway.", notes: "突き当たり = dead end / end of corridor." }
    ],
    lines: [
      {
        id: "w1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "すみません、お手洗いはどちらですか？",
        reading: "すみません、おてあらいはどちらですか？",
        romaji: "Sumimasen, otearai wa dochira desu ka?",
        en: "Excuse me, which way is the restroom?",
        politeness: "polite",
        options: [
          {
            id: "opt-w1-1",
            ja: "すみません、お手洗いはどちらですか？",
            reading: "すみません、おてあらいはどちらですか？",
            romaji: "Sumimasen, otearai wa dochira desu ka?",
            en: "Excuse me, which way is the restroom?",
            politeness: "polite",
            isCorrect: true,
            explanation: "'お手洗い' (otearai) and 'どちら' (dochira) are both polite, pleasant phrasing for asking for the restroom.",
            reaction: { speaker: "Staff", speakerJa: "店員", ja: "お手洗いはこの通路の突き当たりを左に曲がったところにございます。", reading: "おてあらいはこのつうろのつきあたりをひだりにまがったところにございます。", romaji: "Otearai wa kono tsuuro no tsukiatari o hidari ni magatta tokoro ni gozaimasu.", en: "The restroom is at the end of this hallway, around the corner to the left." }
          },
          {
            id: "opt-w1-2",
            ja: "便所はどこ？",
            reading: "べんじょはどこ？",
            romaji: "Benjo wa doko?",
            en: "Where's the crapper?",
            politeness: "casual",
            isCorrect: false,
            explanation: "便所 (benjo) is considered coarse and unrefined. Always use お手洗い (otearai) or トイレ (toire)."
          }
        ]
      },
      {
        id: "w2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "突き当たりを左ですね。ありがとうございます。",
        reading: "つきあたりをひだりですね。ありがとうございます。",
        romaji: "Tsukiatari o hidari desu ne. Arigatou gozaimasu.",
        en: "End of the hallway and to the left. Thank you.",
        politeness: "polite",
        options: [
          {
            id: "opt-w2-1",
            ja: "突き当たりを左ですね。ありがとうございます。",
            reading: "つきあたりをひだりですね。ありがとうございます。",
            romaji: "Tsukiatari o hidari desu ne. Arigatou gozaimasu.",
            en: "End of the hallway and to the left. Thank you.",
            politeness: "polite",
            isCorrect: true,
            explanation: "Repeating the direction confirms you heard correctly before saying thank you.",
            reaction: { speaker: "Staff", speakerJa: "店員", ja: "どういたしまして。", reading: "どういたしまして。", romaji: "Dou itashimashite.", en: "You are very welcome." }
          }
        ]
      }
    ]
  },
  {
    id: "n5-self-intro",
    title: "Basic Self-Introduction",
    titleJa: "はじめての自己紹介",
    level: "N5",
    category: "Social",
    description: "Introduce yourself to a new Japanese study group or language exchange partner.",
    keyPhrases: [
      { id: "phrase-intro-1", front: "はじめまして", reading: "はじめまして", romaji: "hajimemashite", answer: "Nice to meet you (for the first time).", notes: "The greeting when meeting someone new." },
      { id: "phrase-intro-2", front: "どうぞよろしくお願いします", reading: "どうぞよろしくおねがいします", romaji: "douzo yoroshiku onegaishimasu", answer: "Please treat me favorably / Nice to work with you.", notes: "Essential closing for self-introductions." }
    ],
    lines: [
      {
        id: "si1",
        speaker: "other",
        speakerName: "Ken",
        speakerNameJa: "健",
        ja: "はじめまして！健と申します。日本語の勉強会へようこそ！",
        reading: "はじめまして！けんともうします。にほんごのべんきょうかいへようこそ！",
        romaji: "Hajimemashite! Ken to moushimasu. Nihongo no benkyoukai e youkoso!",
        en: "Nice to meet you! My name is Ken. Welcome to the Japanese study group!",
        politeness: "polite"
      },
      {
        id: "si2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "はじめまして、マイクです。アメリカから来ました。",
        reading: "はじめまして、まいくです。あめりかからきました。",
        romaji: "Hajimemashite, Maiku desu. Amerika kara kimashita.",
        en: "Nice to meet you, I'm Mike. I came from America.",
        politeness: "polite",
        options: [
          {
            id: "opt-si2-1",
            ja: "はじめまして、マイクです。アメリカから来ました。",
            reading: "はじめまして、まいくです。あめりかからきました。",
            romaji: "Hajimemashite, Maiku desu. Amerika kara kimashita.",
            en: "Nice to meet you, I'm Mike. I came from America.",
            politeness: "polite",
            isCorrect: true,
            explanation: "Standard N5 introduction formula: はじめまして + name です + country から来ました.",
            reaction: { speaker: "Ken", speakerJa: "健", ja: "マイクさん、よろしくお願いします！日本へは旅行ですか？", reading: "まいくさん、よろしくおねがいします！にほんへはりょこうですか？", romaji: "Maiku-san, yoroshiku onegaishimasu! Nihon e wa ryokou desu ka?", en: "Nice to meet you Mike! Are you traveling in Japan?" }
          },
          {
            id: "opt-si2-2",
            ja: "俺はマイクだぜ！",
            reading: "おれはまいくだぜ！",
            romaji: "Ore wa Maiku daze!",
            en: "I'm Mike, yo!",
            politeness: "casual",
            isCorrect: false,
            explanation: "Too slangy and aggressive for a friendly first meeting. Use 私 (watashi) or just state your name + です."
          }
        ]
      },
      {
        id: "si3",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "はい、旅行です。どうぞよろしくお願いします。",
        reading: "はい、りょこうです。どうぞよろしくおねがいします。",
        romaji: "Hai, ryokou desu. Douzo yoroshiku onegaishimasu.",
        en: "Yes, I am traveling. Nice to meet you and please treat me well.",
        politeness: "polite",
        options: [
          {
            id: "opt-si3-1",
            ja: "はい、旅行です。どうぞよろしくお願いします。",
            reading: "はい、りょこうです。どうぞよろしくおねがいします。",
            romaji: "Hai, ryokou desu. Douzo yoroshiku onegaishimasu.",
            en: "Yes, I'm traveling. Pleasure to meet you.",
            politeness: "polite",
            isCorrect: true,
            explanation: "Ends the self-introduction with the quintessential Japanese courteous phrase.",
            reaction: { speaker: "Ken", speakerJa: "健", ja: "こちらこそ、よろしくお願いします！楽しんでいってくださいね。", reading: "こちらこそ、よろしくおねがいします！たのしんでいってくださいね。", romaji: "Kochira koso, yoroshiku onegaishimasu! Tanoshinde itte kudasai ne.", en: "Likewise, pleasure to meet you! Please enjoy your stay." }
          }
        ]
      }
    ]
  },
  {
    id: "n5-wifi",
    title: "Asking for Wi-Fi",
    titleJa: "Wi-Fiのパスワードを尋ねる",
    level: "N5",
    category: "Services",
    description: "Ask a café staff member if they have free Wi-Fi and what the password is.",
    keyPhrases: [
      { id: "phrase-wifi-1", front: "Wi-Fiはありますか？", reading: "わいふぁいはありますか？", romaji: "waifai wa arimasu ka?", answer: "Is there Wi-Fi?", notes: "Asking if an item exists or is available." },
      { id: "phrase-wifi-2", front: "パスワードを教えてください", reading: "ぱすわーどをおしえてください", romaji: "pasuwaado o oshiete kudasai", answer: "Please tell me the password.", notes: "Polite request for information." }
    ],
    lines: [
      {
        id: "wf1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "すみません、ここはWi-Fiがありますか？",
        reading: "すみません、ここはわいふぁいがありますか？",
        romaji: "Sumimasen, koko wa waifai ga arimasu ka?",
        en: "Excuse me, is there Wi-Fi here?",
        politeness: "polite",
        options: [
          {
            id: "opt-wf1-1",
            ja: "すみません、ここはWi-Fiがありますか？",
            reading: "すみません、ここはわいふぁいがありますか？",
            romaji: "Sumimasen, koko wa waifai ga arimasu ka?",
            en: "Excuse me, is there Wi-Fi here?",
            politeness: "polite",
            isCorrect: true,
            explanation: "Simple and polite question using 〜がありますか.",
            reaction: { speaker: "Staff", speakerJa: "店員", ja: "はい、無料のWi-Fiがございます。", reading: "はい、むりょうのわいふぁいがございます。", romaji: "Hai, muryou no waifai ga gozaimasu.", en: "Yes, we have free Wi-Fi." }
          }
        ]
      },
      {
        id: "wf2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "パスワードを教えていただけますか？",
        reading: "ぱすわーどをおしえていただけますか？",
        romaji: "Pasuwaado o oshiete itadakemasu ka?",
        en: "Could you tell me the password?",
        politeness: "polite",
        options: [
          {
            id: "opt-wf2-1",
            ja: "パスワードを教えていただけますか？",
            reading: "ぱすわーどをおしえていただけますか？",
            romaji: "Pasuwaado o oshiete itadakemasu ka?",
            en: "Could you please tell me the password?",
            politeness: "polite",
            isCorrect: true,
            explanation: "〜ていただけますか is a very polite and natural way to ask someone to do something for you.",
            reaction: { speaker: "Staff", speakerJa: "店員", ja: "レシートの一番下に書いてありますので、ご確認ください。", reading: "れしーとのいちばんしたにかいてありますので、ごかくにんください。", romaji: "Reshiito no ichiban shita ni kaite arimasu no de, gokakunin kudasai.", en: "It is printed at the very bottom of your receipt, please check there." }
          }
        ]
      }
    ]
  },
  {
    id: "n5-souvenir",
    title: "Buying a Souvenir",
    titleJa: "お土産屋での買い物",
    level: "N5",
    category: "Shopping",
    description: "Shop for traditional sweets in Asakusa, ask how much it costs, and ask for gift wrapping.",
    keyPhrases: [
      { id: "phrase-souvenir-1", front: "これはいくらですか？", reading: "これはいくらですか？", romaji: "kore wa ikura desu ka?", answer: "How much is this?", notes: "Classic price inquiry." },
      { id: "phrase-souvenir-2", front: "プレゼント用に包んでください", reading: "ぷれぜんとようにつつんでください", romaji: "purezento-you ni tsutsunde kudasai", answer: "Please wrap it as a gift.", notes: "Asking for gift wrapping." }
    ],
    lines: [
      {
        id: "sv1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "すみません、このお菓子はいくらですか？",
        reading: "すみません、このおかしはいくらですか？",
        romaji: "Sumimasen, kono okashi wa ikura desu ka?",
        en: "Excuse me, how much are these sweets?",
        politeness: "polite",
        options: [
          {
            id: "opt-sv1-1",
            ja: "すみません、このお菓子はいくらですか？",
            reading: "すみません、このおかしはいくらですか？",
            romaji: "Sumimasen, kono okashi wa ikura desu ka?",
            en: "Excuse me, how much are these sweets?",
            politeness: "polite",
            isCorrect: true,
            explanation: "Polite inquiry using kono [noun] wa ikura desu ka.",
            reaction: { speaker: "Clerk", speakerJa: "店員", ja: "そちらは1箱1,200円でございます。", reading: "そちらはひとはこせんにひゃくえんでございます。", romaji: "Sochira wa hitohako sen nihyaku-en de gozaimasu.", en: "That box is 1,200 yen per box." }
          }
        ]
      },
      {
        id: "sv2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "これを二つください。プレゼント用に包んでいただけますか？",
        reading: "これをふたつください。ぷれぜんとようにつつんでいただけますか？",
        romaji: "Kore o futatsu kudasai. Purezento-you ni tsutsunde itadakemasu ka?",
        en: "Two of these please. Could you wrap them as a gift?",
        politeness: "polite",
        options: [
          {
            id: "opt-sv2-1",
            ja: "これを二つください。プレゼント用に包んでいただけますか？",
            reading: "これをふたつください。ぷれぜんとようにつつんでいただけますか？",
            romaji: "Kore o futatsu kudasai. Purezento-you ni tsutsunde itadakemasu ka?",
            en: "Two of these please. Could you wrap them as a gift?",
            politeness: "polite",
            isCorrect: true,
            explanation: "二つ (futatsu) is two items; プレゼント用に包む means to wrap as a gift.",
            reaction: { speaker: "Clerk", speakerJa: "店員", ja: "かしこまりました！リボンをお付けしますね。", reading: "かしこまりました！りぼんをおつけしますね。", romaji: "Kashikomarimashita! Ribon o otsuke shimasu ne.", en: "Certainly! I will add a ribbon for you." }
          }
        ]
      }
    ]
  }
];
