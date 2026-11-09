// N3 Scenarios (8 scenarios)
export const SCENARIOS_N3 = [
  {
    id: "n3-apartment",
    title: "Apartment Rental Inquiry",
    titleJa: "不動産屋での部屋探し",
    level: "N3",
    category: "Services",
    description: "Visit a real estate agency in Tokyo. Specify your rent budget, distance from station, and layout preferences.",
    keyPhrases: [
      { id: "phrase-apt-1", front: "家賃は管理費込みで8万円以内", reading: "やちんはかんりひこみではちまんえんいない", romaji: "yachin wa kanrihi-komi de hachiman-en inai", answer: "Rent within 80,000 yen including management fees.", notes: "Budget specification." },
      { id: "phrase-apt-2", front: "駅から徒歩10分以内が希望です", reading: "えきからとほじゅっぷんいないがきぼうです", romaji: "eki kara toho juppun inai ga kibou desu", answer: "Prefer within a 10-minute walk from the station.", notes: "Commute constraints." },
      { id: "phrase-apt-3", front: "内見は可能ですか？", reading: "ないけんはかのうですか？", romaji: "naiken wa kanou desu ka?", answer: "Is a room viewing possible?", notes: "Viewing an apartment in person." }
    ],
    lines: [
      {
        id: "ap1",
        speaker: "other",
        speakerName: "Agent",
        speakerNameJa: "不動産業者",
        ja: "いらっしゃいませ！本日のお部屋探しのご希望条件をお伺いできますか？",
        reading: "いらっしゃいませ！ほんじつのおへやさがしのごきぼうじょうけんをおうかがいできますか？",
        romaji: "Irasshaimase! Honjitsu no oheyasagashi no gokibou jouken o oukagai dekimasu ka?",
        en: "Welcome! May I hear your desired conditions for an apartment search today?",
        politeness: "keigo"
      },
      {
        id: "ap2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "家賃は管理費込みで8万円以内、駅から徒歩10分以内の1Kを探しています。",
        reading: "やちんはかんりひこみではちまんえんいない、えきからとほじゅっぷんいないのわんけーをさがしています。",
        romaji: "Yachin wa kanrihi-komi de hachiman-en inai, eki kara toho juppun inai no wan-kee o sagashiteimasu.",
        en: "I'm looking for a 1K within 80,000 yen including management fee, within 10 minutes walk from the station.",
        politeness: "polite",
        options: [
          {
            id: "opt-ap2-1",
            ja: "家賃は管理費込みで8万円以内、駅から徒歩10分以内の1Kを探しています。",
            reading: "やちんはかんりひこみではちまんえんいない、えきからとほじゅっぷんいないのわんけーをさがしています。",
            romaji: "Yachin wa kanrihi-komi de hachiman-en inai, eki kara toho juppun inai no wan-kee o sagashiteimasu.",
            en: "Looking for a 1K under 80k yen with management fee included, within 10 min walk.",
            politeness: "polite",
            isCorrect: true,
            explanation: "Natural N3 housing vocabulary: 管理費込み (fee included), 徒歩〜分以内 (within X min walk), 1K layout.",
            reaction: { speaker: "Agent", speakerJa: "不動産業者", ja: "かしこまりました。2階以上やオートロックなどの設備面はいかがですか？", reading: "かしこまりました。にかいいじょうやおーとろっくなどのせつびめんはいかがですか？", romaji: "Kashikomarimashita. Nikai ijou ya ootorokku nado no setsubimen wa ikaga desu ka?", en: "Understood. How about facilities like 2nd floor or above, and auto-locking entrance?" }
          }
        ]
      },
      {
        id: "ap3",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "防犯のために2階以上で、できればバストイレ別が良いです。今日内見できますか？",
        reading: "ぼうはんのためににかいいじょうで、できればばすといれべつがよいです。きょうないけんできますか？",
        romaji: "Bouhan no tame ni nikai ijou de, dekireba basu toire betsu ga yoi desu. Kyou naiken dekimasu ka?",
        en: "For safety, 2nd floor or higher, and separate bath and toilet if possible. Can I view it today?",
        politeness: "polite",
        options: [
          {
            id: "opt-ap3-1",
            ja: "防犯のために2階以上で、できればバストイレ別が良いです。今日内見できますか？",
            reading: "ぼうはんのためににかいいじょうで、できればばすといれべつがよいです。きょうないけんできますか？",
            romaji: "Bouhan no tame ni nikai ijou de, dekireba basu toire betsu ga yoi desu. Kyou naiken dekimasu ka?",
            en: "2nd floor for security, separate bath/toilet if possible. Can we do a viewing today?",
            politeness: "polite",
            isCorrect: true,
            explanation: "バストイレ別 (separate bath and toilet) and 内見 (apartment viewing) are standard real estate terms.",
            reaction: { speaker: "Agent", speakerJa: "不動産業者", ja: "ちょうど良い物件が2件ございます！今からすぐ車でご案内できますよ。", reading: "ちょうどよいぶっけんがにけんございます！いまからすぐくるまでごあんないできますよ。", romaji: "Choudo yoi bukken ga niken gozaimasu! Ima kara sugu kuruma de goannai dekimasu yo.", en: "We have two matching properties! I can take you by car to see them right away." }
          }
        ]
      }
    ]
  },
  {
    id: "n3-bank",
    title: "Opening a Bank Account",
    titleJa: "銀行口座の開設",
    level: "N3",
    category: "Services",
    description: "Open an ordinary savings account (普通預金口座) at a Japanese bank and register your inkan/signature.",
    keyPhrases: [
      { id: "phrase-bank-1", front: "普通預金口座を開設したいのですが", reading: "ふつうよきんこうざをかいせつしたいのですが", romaji: "futsuu yokin kouza o kaisetsu shitai no desu ga", answer: "I would like to open a standard savings account.", notes: "Official banking terms." },
      { id: "phrase-bank-2", front: "在留カードと印鑑はお持ちですか？", reading: "ざいりゅうかーどといんかんはおもちですか？", romaji: "zairyuu kaado to inkan wa omochi desu ka?", answer: "Do you have your Residence Card and seal?", notes: "Documentation verification." }
    ],
    lines: [
      {
        id: "bk1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "口座の開設をお願いしたいのですが、どのような手続きが必要ですか？",
        reading: "こうざのかいせつをおねがいしたいのですが、どのようなてつづきがひつようですか？",
        romaji: "Kouza no kaisetsu o onegai shitai no desu ga, dono you na tetsuzuki ga hitsuyou desu ka?",
        en: "I would like to open an account; what kind of procedure is required?",
        politeness: "polite",
        options: [
          {
            id: "opt-bk1-1",
            ja: "口座の開設をお願いしたいのですが、どのような手続きが必要ですか？",
            reading: "こうざのかいせつをおねがいしたいのですが、どのようなてつづきがひつようですか？",
            romaji: "Kouza no kaisetsu o onegai shitai no desu ga, dono you na tetsuzuki ga hitsuyou desu ka?",
            en: "I'd like to open an account; what procedures are needed?",
            politeness: "polite",
            isCorrect: true,
            explanation: "Clear, formal query about administrative procedures (手続き).",
            reaction: { speaker: "Bank Clerk", speakerJa: "銀行員", ja: "ご来店ありがとうございます。ご本人様確認書類とご印鑑、またはサインのご登録が必要となります。", reading: "ごらいてんありがとうございます。ごほんにんさまかくにんしょるいとごいんかん、またはさいんのごとうろくがひつようとなります。", romaji: "Goraiten arigatou gozaimasu. Gohonnin-sama kakunin shorui to go-inkan, mata wa sain no gotouroku ga hitsuyou to narimasu.", en: "Thank you for coming. Identity verification documents and your seal or signature registration will be required." }
          }
        ]
      },
      {
        id: "bk2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "在留カードとパスポートを持ってきました。キャッシュカードはいつ届きますか？",
        reading: "ざいりゅうかーどとぱすぽーとをもってきました。きゃっしゅかーどはいつとどきますか？",
        romaji: "Zairyuu kaado to pasupooto o motte kimashita. Kyasshu kaado wa itsu todokimasu ka?",
        en: "I brought my residence card and passport. When will the cash card arrive?",
        politeness: "polite",
        options: [
          {
            id: "opt-bk2-1",
            ja: "在留カードとパスポートを持ってきました。キャッシュカードはいつ届きますか？",
            reading: "ざいりゅうかーどとぱすぽーとをもってきました。きゃっしゅかーどはいつとどきますか？",
            romaji: "Zairyuu kaado to pasupooto o motte kimashita. Kyasshu kaado wa itsu todokimasu ka?",
            en: "I brought my residence card and passport. When will the ATM card arrive?",
            politeness: "polite",
            isCorrect: true,
            explanation: "Identifies documents brought and asks delivery timeframe for the キャッシュカード (cash card).",
            reaction: { speaker: "Bank Clerk", speakerJa: "銀行員", ja: "ありがとうございます。カードは約1週間から10日ほどでご自宅へ書留で郵送されます。", reading: "ありがとうございます。かーどは約いっしゅうかんからとおかほどでごじたくへかきとめでゆうそうされます。", romaji: "Arigatou gozaimasu. Kaado wa yaku isshuukan kara tooka hodo de gojitaku e kakitome de yuusou saremasu.", en: "Thank you. Your card will be sent to your home by registered mail in about a week to 10 days." }
          }
        ]
      }
    ]
  },
  {
    id: "n3-coworker-weekend",
    title: "Casual Chat with a Coworker",
    titleJa: "同僚との週末の雑談",
    level: "N3",
    category: "Social",
    description: "Chat with a coworker by the coffee machine on Monday morning about what you did over the weekend.",
    keyPhrases: [
      { id: "phrase-wknd-1", front: "週末はどう過ごされましたか？", reading: "しゅうまつはどうすごされましたか？", romaji: "shuumatsu wa dou sugosaremashita ka?", answer: "How did you spend your weekend?", notes: "Friendly office conversation starter." },
      { id: "phrase-wknd-2", front: "いい気分転換になりました", reading: "いいきぶんてんかんになりました", romaji: "ii kibun tenkan ni narimashita", answer: "It was a nice change of pace / refreshing.", notes: "Common Japanese idiom for relaxing." }
    ],
    lines: [
      {
        id: "cw1",
        speaker: "other",
        speakerName: "Tanaka",
        speakerNameJa: "田中",
        ja: "おはようございます！週末は天気が良かったですね。何かどこかへ出かけましたか？",
        reading: "おはようございます！しゅうまつはてんきがよかったですね。なにかどこかへでかけましたか？",
        romaji: "Ohayou gozaimasu! Shuumatsu wa tenki ga yokatta desu ne. Nanika dokoka e dekakemashita ka?",
        en: "Good morning! The weather was great this weekend. Did you head out anywhere?",
        politeness: "polite"
      },
      {
        id: "cw2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "鎌倉へ行ってきました。大仏を見て海沿いを散歩して、いい気分転換になりましたよ。",
        reading: "かまくらへいってきました。だいぶつをみてうみぞいをさんぽして、いいきぶんてんかんになりましたよ。",
        romaji: "Kamakura e itte kimashita. Daibutsu o mite umizoi o sanpo shite, ii kibun tenkan ni narimashita yo.",
        en: "I went to Kamakura. I saw the Great Buddha and strolled along the coast; it was a wonderful refresher.",
        politeness: "polite",
        options: [
          {
            id: "opt-cw2-1",
            ja: "鎌倉へ行ってきました。大仏を見て海沿いを散歩して、いい気分転換になりましたよ。",
            reading: "かまくらへいってきました。だいぶつをみてうみぞいをさんぽして、いいきぶんてんかんになりましたよ。",
            romaji: "Kamakura e itte kimashita. Daibutsu o mite umizoi o sanpo shite, ii kibun tenkan ni narimashita yo.",
            en: "I went to Kamakura, saw the Buddha, walked the coast—great refresher!",
            politeness: "polite",
            isCorrect: true,
            explanation: "Natural chaining of activities with 〜て and idiomatic 気分転換 (change of pace).",
            reaction: { speaker: "Tanaka", speakerJa: "田中", ja: "鎌倉いいですね！江ノ電にも乗りましたか？あそこのしらす丼、すごく美味しいですよね。", reading: "かまくらいいですね！えのでんにものりましたか？あそこのしらすどん、すごくおいしいですよね。", romaji: "Kamakura ii desu ne! Enoden ni mo norimashita ka? Asoko no shirasudon, sugoku oishii desu yo ne.", en: "Kamakura is lovely! Did you ride the Enoden train too? The whitebait rice bowls there are so good, right?" }
          }
        ]
      },
      {
        id: "cw3",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "はい、しらす丼を食べました！すごく新鮮で感動しました。田中さんは何をしていましたか？",
        reading: "はい、しらすどんをたべました！すごくしんせんでかんどうしました。たなかさんはなにをしていましたか？",
        romaji: "Hai, shirasudon o tabemashita! Sugoku shinsen de kandou shimashita. Tanaka-san wa nani o shiteimashita ka?",
        en: "Yes, I had the shirasu bowl! It was so fresh, I was impressed. What did you do, Tanaka-san?",
        politeness: "polite",
        options: [
          {
            id: "opt-cw3-1",
            ja: "はい、しらす丼を食べました！すごく新鮮で感動しました。田中さんは何をしていましたか？",
            reading: "はい、しらすどんをたべました！すごくしんせんでかんどうしました。たなかさんはなにをしていましたか？",
            romaji: "Hai, shirasudon o tabemashita! Sugoku shinsen de kandou shimashita. Tanaka-san wa nani o shiteimashita ka?",
            en: "Yes, ate the shirasu bowl! Deliciously fresh. What did you do, Tanaka-san?",
            politeness: "polite",
            isCorrect: true,
            explanation: "Shares the culinary reaction and politely returns the question to your conversational partner.",
            reaction: { speaker: "Tanaka", speakerJa: "田中", ja: "私は家でたまったドラマを一気見していました（笑）。また今週も頑張りましょう！", reading: "わたしはいえでたまったどらまをいっきみしていました（わら）。またこんしゅうもがんばりましょう！", romaji: "Watashi wa ie de tamatta dorama o ikkimi shiteimashita (wara). Mata konshuu mo gambarimashou!", en: "I was at home binge-watching dramas (laughs). Let's do our best again this week!" }
          }
        ]
      }
    ]
  },
  {
    id: "n3-travel-advice",
    title: "Asking for Travel Recommendations",
    titleJa: "旅行のおすすめを聞く",
    level: "N3",
    category: "Travel",
    description: "You're planning your first trip to Hokkaido in winter. Ask a travel agent or local friend for advice on sights and clothes.",
    keyPhrases: [
      { id: "phrase-rec-1", front: "おすすめの観光スポットはありますか？", reading: "おすすめのかんこうすぽっとはありますか？", romaji: "osusume no kankou supotto wa arimasu ka?", answer: "Are there any recommended sightseeing spots?", notes: "Asking for travel advice." },
      { id: "phrase-rec-2", front: "防寒対策をしっかりしてください", reading: "ぼうかんたいさくをしっかりしてください", romaji: "boukan taisaku o shikkari shite kudasai", answer: "Please make sure to dress very warmly for the cold.", notes: "Winter travel essential phrase." }
    ],
    lines: [
      {
        id: "ta1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "来月初めて北海道へ行くんですが、どこか外せない見どころはありますか？",
        reading: "らいげつはじめてほっかいどうへいくんですが、どこかはづせないみどころはありますか？",
        romaji: "Raigetsu hajimete Hokkaidou e iku n desu ga, dokoka hazusenai midokoro wa arimasu ka?",
        en: "I'm going to Hokkaido for the first time next month; are there any must-see sights I shouldn't miss?",
        politeness: "polite",
        options: [
          {
            id: "opt-ta1-1",
            ja: "来月初めて北海道へ行くんですが、どこか外せない見どころはありますか？",
            reading: "らいげつはじめてほっかいどうへいくんですが、どこかはづせないみどころはありますか？",
            romaji: "Raigetsu hajimete Hokkaidou e iku n desu ga, dokoka hazusenai midokoro wa arimasu ka?",
            en: "Going to Hokkaido for first time next month; any can't-miss highlights?",
            politeness: "polite",
            isCorrect: true,
            explanation: "外せない見どころ (hazusenai midokoro = highlights that cannot be missed) is natural N3 phrasing.",
            reaction: { speaker: "Advisor", speakerJa: "案内人", ja: "冬の北海道なら、小樽の雪あかりの路や、函館の夜景が本当に素晴らしいですよ！", reading: "ふゆのほっかいどうなら、おたるのゆきあかりのみちや、はこだてのやけいがほんとうにすばらしいですよ！", romaji: "Fuyu no Hokkaidou nara, Otaru no yukiakari no michi ya, Hakodate no yakei ga hontou ni subarashii desu yo!", en: "For winter Hokkaido, Otaru's snow light path and Hakodate's night view are truly magnificent!" }
          }
        ]
      },
      {
        id: "ta2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "函館の夜景、ぜひ見たいです！服装はどんなものを用意すればいいでしょうか？",
        reading: "はこだてのやけい、ぜひみたいです！ふくそうはどんなものをよういすればいいでしょうか？",
        romaji: "Hakodate no yakei, zehi mitai desu! Fukusou wa donna mono o youi sureba ii deshou ka?",
        en: "I definitely want to see Hakodate's night view! What clothing should I prepare?",
        politeness: "polite",
        options: [
          {
            id: "opt-ta2-1",
            ja: "函館の夜景、ぜひ見たいです！服装はどんなものを用意すればいいでしょうか？",
            reading: "はこだてのやけい、ぜひみたいです！ふくそうはどんなものをよういすればいいでしょうか？",
            romaji: "Hakodate no yakei, zehi mitai desu! Fukusou wa donna mono o youi sureba ii deshou ka?",
            en: "Definitely want to see Hakodate! What kind of clothing should I prepare?",
            politeness: "polite",
            isCorrect: true,
            explanation: "〜用意すればいいでしょうか asks for pragmatic preparation advice smoothly.",
            reaction: { speaker: "Advisor", speakerJa: "案内人", ja: "滑り止め付きの靴と、風を通さない厚手のダウンジャケットは必須です。手袋や耳あても忘れないでくださいね。", reading: "すべりどめつきのくつと、かぜをとおさないあつでのだうんじゃけっとはひっすです。てぶくろやみみあてもわすれないでくださいね。", romaji: "Suberidome-tsuki no kutsu to, kaze o toosanai atsude no daun jaketto wa hissu desu. Tebukuro ya mamiate mo wasurenaide kudasai ne.", en: "Anti-slip shoes and a windproof thick down jacket are essential. Don't forget gloves and earmuffs either." }
          }
        ]
      }
    ]
  },
  {
    id: "n3-omiyage",
    title: "Bringing Souvenirs to the Office",
    titleJa: "職場へのお土産配り",
    level: "N3",
    category: "Workplace",
    description: "Hand out omiyage (souvenirs) from your vacation to your team with proper office etiquette.",
    keyPhrases: [
      { id: "phrase-omi-1", front: "お休みをいただきありがとうございました", reading: "おやすみをいただきありがとうございました", romaji: "oyasumi o itadaki arigatou gozaimashita", answer: "Thank you for letting me take time off.", notes: "Crucial Japanese workplace gratitude after vacation." },
      { id: "phrase-omi-2", front: "皆さんで召し上がってください", reading: "みなさんでめしあがってください", romaji: "minasan de meshiagatte kudasai", answer: "Please enjoy eating this, everyone.", notes: "Polite invitation to share sweets." }
    ],
    lines: [
      {
        id: "om1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "課長、先週はお休みをいただきありがとうございました。京都のお土産を買ってきたので、皆さんで召し上がってください。",
        reading: "かちょう、せんしゅうはおやすみをいただきありがとうございました。きょうとのおみやげをかってきたので、みなさんでめしあがってください。",
        romaji: "Kachou, senshuu wa oyasumi o itadaki arigatou gozaimashita. Kyouto no omiyage o katte kita no de, minasan de meshiagatte kudasai.",
        en: "Manager, thank you for allowing me to take time off last week. I bought souvenirs from Kyoto, please enjoy them everyone.",
        politeness: "keigo",
        options: [
          {
            id: "opt-om1-1",
            ja: "課長、先週はお休みをいただきありがとうございました。京都のお土産を買ってきたので、皆さんで召し上がってください。",
            reading: "かちょう、せんしゅうはおやすみをいただきありがとうございました。きょうとのおみやげをかってきたので、みなさんでめしあがってください。",
            romaji: "Kachou, senshuu wa oyasumi o itadaki arigatou gozaimashita. Kyouto no omiyage o katte kita no de, minasan de meshiagatte kudasai.",
            en: "Manager, thanks for the time off last week. Bought Kyoto treats, please enjoy them!",
            politeness: "keigo",
            isCorrect: true,
            explanation: "Flawless workplace etiquette: thanks team for covering during your absence and uses polite 召し上がってください for others.",
            reaction: { speaker: "Section Chief", speakerJa: "課長", ja: "わざわざお気遣いありがとうございます！リフレッシュできましたか？", reading: "わざわざおきづかいありがとうございます！りふれっしゅできましたか？", romaji: "Wazawaza okidzukai arigatou gozaimasu! Rifuresshu dekimashita ka?", en: "Thank you for the thoughtful gesture! Were you able to refresh?" }
          }
        ]
      },
      {
        id: "om2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "はい、おかげさまでゆっくり休めました。今日からまたしっかり頑張ります！",
        reading: "はい、おかげさまでゆっくりやすめました。きょうからまたしっかりがんばります！",
        romaji: "Hai, okagesama de yukkuri yasumemashita. Kyou kara mata shikkari gambarimasu!",
        en: "Yes, thanks to your support I was able to rest well. I will work hard again starting today!",
        politeness: "polite",
        options: [
          {
            id: "opt-om2-1",
            ja: "はい、おかげさまでゆっくり休めました。今日からまたしっかり頑張ります！",
            reading: "はい、おかげさまでゆっくりやすめました。きょうからまたしっかりがんばります！",
            romaji: "Hai, okagesama de yukkuri yasumemashita. Kyou kara mata shikkari gambarimasu!",
            en: "Yes, rested well thanks to you. Ready to give my best from today!",
            politeness: "polite",
            isCorrect: true,
            explanation: "おかげさまで (thanks to you / fortunately) is the humble Japanese reaction to caring inquiries.",
            reaction: { speaker: "Section Chief", speakerJa: "課長", ja: "頼もしいですね！では今日の午後、定例ミーティングでお話ししましょう。", reading: "たのもしいですね！ではきょうのごご、ていれいみーてぃんぐでおはなししましょう。", romaji: "Tanomoshii desu ne! Dewa kyou no gogo, teirei miitingu de ohanashi shimashou.", en: "How reassuring! Let's talk in our regular team meeting this afternoon." }
          }
        ]
      }
    ]
  },
  {
    id: "n3-train-delay-cert",
    title: "Getting a Train Delay Certificate",
    titleJa: "駅で遅延証明書をもらう",
    level: "N3",
    category: "Services",
    description: "Your commuter train was delayed by 20 minutes due to signal trouble. Request a delay certificate for work.",
    keyPhrases: [
      { id: "phrase-delay-1", front: "遅延証明書をいただけますか？", reading: "ちえんしょうめいしょをいただけますか？", romaji: "chien shoumeisho o itadakemasu ka?", answer: "Could I have a train delay certificate?", notes: "Essential proof for Japanese employers/schools." },
      { id: "phrase-delay-2", front: "信号トラブルによる遅れ", reading: "しんごうとらぶるによるおくれ", romaji: "shingou toraburu ni yoru okure", answer: "Delay due to signal trouble.", notes: "Explaining the cause." }
    ],
    lines: [
      {
        id: "td1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "すみません、会社に提出したいので、遅延証明書を1枚いただけますか？",
        reading: "すみません、かいしゃにていしゅつしたいので、ちえんしょうめいしょをいちまいいただけますか？",
        romaji: "Sumimasen, kaisha ni teishutsu shitai no de, chien shoumeisho o ichimai itadakemasu ka?",
        en: "Excuse me, I need to submit it to my company; could I have a delay certificate?",
        politeness: "polite",
        options: [
          {
            id: "opt-td1-1",
            ja: "すみません、会社に提出したいので、遅延証明書を1枚いただけますか？",
            reading: "すみません、かいしゃにていしゅつしたいので、ちえんしょうめいしょをいちまいいただけますか？",
            romaji: "Sumimasen, kaisha ni teishutsu shitai no de, chien shoumeisho o ichimai itadakemasu ka?",
            en: "Excuse me, could I get a delay certificate to submit to my company?",
            politeness: "polite",
            isCorrect: true,
            explanation: "遅延証明書 (delay slip) + 〜をいただけますか (could I receive).",
            reaction: { speaker: "Station Staff", speakerJa: "駅員", ja: "大変ご迷惑をおかけいたしました。20分遅延の証明書になります。どうぞ。", reading: "たいへんごめいわくをおかけいたしました。にじゅっぷんちえんのしょうめいしょになります。どうぞ。", romaji: "Taihen gomeiwaku o okake itashimashita. Nijuppun chien no shoumeisho ni narimasu. Douzo.", en: "We apologize deeply for the inconvenience. Here is the 20-minute delay certificate." }
          }
        ]
      },
      {
        id: "td2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "ありがとうございます。ウェブサイトでも発行できますか？",
        reading: "ありがとうございます。うぇぶさいとでもはっこうできますか？",
        romaji: "Arigatou gozaimasu. Webusaito demo hakkou dekimasu ka?",
        en: "Thank you. Can this also be issued on your website?",
        politeness: "polite",
        options: [
          {
            id: "opt-td2-1",
            ja: "ありがとうございます。ウェブサイトでも発行できますか？",
            reading: "ありがとうございます。うぇぶさいとでもはっこうできますか？",
            romaji: "Arigatou gozaimasu. Webusaito demo hakkou dekimasu ka?",
            en: "Thank you. Can this be issued online on the website too?",
            politeness: "polite",
            isCorrect: true,
            explanation: "発行する (hakkou suru = to issue) is standard administrative vocabulary.",
            reaction: { speaker: "Station Staff", speakerJa: "駅員", ja: "はい、ホームページからも過去7日分の証明書が印刷いただけますよ。", reading: "はい、ほーむぺーじからもかこななにちぶんのしょうめいしょがいんさついただけますよ。", romaji: "Hai, hoomupeeji kara mo kako nananichibun no shoumeisho ga insatsu itadakemasu yo.", en: "Yes, certificates for the past 7 days can also be printed directly from our homepage." }
          }
        ]
      }
    ]
  },
  {
    id: "n3-task-progress",
    title: "Reporting Project Progress to Your Manager",
    titleJa: "上司への進捗報告",
    level: "N3",
    category: "Workplace",
    description: "Give a crisp status update on your assigned report and identify when you expect to complete it.",
    keyPhrases: [
      { id: "phrase-prog-1", front: "資料の進捗状況を報告いたします", reading: "しりょうのしんちょくじょうきょうをほうこくいたします", romaji: "shiryou no shinchoku joukyou o houkoku itashimasu", answer: "I will report the progress status of the materials.", notes: "Formal business reporting." },
      { id: "phrase-prog-2", front: "予定通り本日の夕方までに完了します", reading: "よていどおりほんじつのゆうがたまでにかんりょうします", romaji: "yoteidoori honjitsu no yuugata made ni kanryou shimasu", answer: "It will be completed by this evening as scheduled.", notes: "Deadline commitment." }
    ],
    lines: [
      {
        id: "pr1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "部長、ただいまお時間よろしいでしょうか？企画書の進捗についてご報告があります。",
        reading: "ぶちょう、ただいまおじかんよろしいでしょうか？きかくしょのしんちょくについてごほうこくがあります。",
        romaji: "Buchou, tadaima ojikan yoroshii deshou ka? Kikakusho no shinchoku ni tsuite gohoukoku ga arimasu.",
        en: "Director, do you have a moment right now? I have a progress report regarding the proposal.",
        politeness: "keigo",
        options: [
          {
            id: "opt-pr1-1",
            ja: "部長、ただいまお時間よろしいでしょうか？企画書の進捗についてご報告があります。",
            reading: "ぶちょう、ただいまおじかんよろしいでしょうか？きかくしょのしんちょくについてごほうこくがあります。",
            romaji: "Buchou, tadaima ojikan yoroshii deshou ka? Kikakusho no shinchoku ni tsuite gohoukoku ga arimasu.",
            en: "Director, is now a good moment? I have an update on the proposal progress.",
            politeness: "keigo",
            isCorrect: true,
            explanation: "Checking availability politely with お時間よろしいでしょうか before reporting is fundamental business manners.",
            reaction: { speaker: "Director", speakerJa: "部長", ja: "ええ、いいですよ。今どこまで進んでいますか？", reading: "ええ、いいですよ。いまどこまですすんでいますか？", romaji: "Ee, ii desu yo. Ima doko made susundeimasu ka?", en: "Yes, go ahead. How far along is it now?" }
          }
        ]
      },
      {
        id: "pr2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "ドラフトは8割方完成しておりまして、本日17時までに確認用データをお送りできます。",
        reading: "どらふとははちわりがたかんせいしておりまして、ほんじつじゅうしちじまでにかくにんようでーたをおおくりできます。",
        romaji: "Dorafuto wa hachiwarigata kansei shite orimashite, honjitsu juushichiji made ni kakunin-you deeta o o-okuri dekimasu.",
        en: "The draft is about 80% complete, and I can send you the review copy by 5:00 PM today.",
        politeness: "keigo",
        options: [
          {
            id: "opt-pr2-1",
            ja: "ドラフトは8割方完成しておりまして、本日17時までに確認用データをお送りできます。",
            reading: "どらふとははちわりがたかんせいしておりまして、ほんじつじゅうしちじまでにかくにんようでーたをおおくりできます。",
            romaji: "Dorafuto wa hachiwarigata kansei shite orimashite, honjitsu juushichiji made ni kakunin-you deeta o o-okuri dekimasu.",
            en: "Draft is around 80% done, will deliver review version by 17:00 today.",
            politeness: "keigo",
            isCorrect: true,
            explanation: "8割方 (about 80%) + modest form おりまして + お送りできます.",
            reaction: { speaker: "Director", speakerJa: "部長", ja: "順調ですね！楽しみにしています。届いたら目を通しておきますよ。", reading: "じゅんちょうですね！たのしみにしています。とどいたらめをとおしておきますよ。", romaji: "Junchou desu ne! Tanoshimi ni shiteimasu. Todoitara me o tooshite okimasu yo.", en: "Smooth progress! Looking forward to it. I will look over it once it arrives." }
          }
        ]
      }
    ]
  },
  {
    id: "n3-izakaya-kanpai",
    title: "Izakaya Toast and Splitting the Bill",
    titleJa: "居酒屋での乾杯と割り勘",
    level: "N3",
    category: "Dining",
    description: "Join your coworkers at an izakaya after work. Propose a toast (kanpai) and coordinate splitting the bill (割り勘).",
    keyPhrases: [
      { id: "phrase-iza-1", front: "今週もお疲れ様でした、乾杯！", reading: "こんしゅうもおつかれさまでした、かんぱい！", romaji: "konshuu mo otsukaresama deshita, kanpai!", answer: "Great work this week everyone, cheers!", notes: "Standard after-work toast." },
      { id: "phrase-iza-2", front: "お会計は別々でお願いします", reading: "おかいけいはべつべつでおねがいします", romaji: "okaikei wa betsubetsu de onegaishimasu", answer: "Separate checks, please.", notes: "Paying separately." },
      { id: "phrase-iza-3", front: "割り勘にしましょう", reading: "わりかんにしましょう", romaji: "warikan ni shimashou", answer: "Let's split the bill evenly.", notes: "Splitting evenly among friends." }
    ],
    lines: [
      {
        id: "iz1",
        speaker: "other",
        speakerName: "Suzuki",
        speakerNameJa: "鈴木",
        ja: "飲み物が揃いましたね！では、音頭をお願いできますか？",
        reading: "のみものがそろいましたね！では、おんどをおねがいできますか？",
        romaji: "Nomimono ga soroimashita ne! Dewa, ondo o onegai dekimasu ka?",
        en: "Everyone's drinks have arrived! Would you do the honors of leading the toast?",
        politeness: "polite"
      },
      {
        id: "iz2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "では皆さん、今週もお疲れ様でした！乾杯！",
        reading: "ではみなさん、こんしゅうもおつかれさまでした！かんぱい！",
        romaji: "Dewa minasan, konshuu mo otsukaresama deshita! Kanpai!",
        en: "Then everyone, wonderful work this week! Cheers!",
        politeness: "polite",
        options: [
          {
            id: "opt-iz2-1",
            ja: "では皆さん、今週もお疲れ様でした！乾杯！",
            reading: "ではみなさん、こんしゅうもおつかれさまでした！かんぱい！",
            romaji: "Dewa minasan, konshuu mo otsukaresama deshita! Kanpai!",
            en: "Everyone, great effort this week! Cheers!",
            politeness: "polite",
            isCorrect: true,
            explanation: "Warm and encouraging toast acknowledging everyone's hard work (お疲れ様でした).",
            reaction: { speaker: "Everyone", speakerJa: "全員", ja: "乾杯ー！！", reading: "かんぱーい！！", romaji: "Kanpaaaai!!", en: "Cheers!!" }
          }
        ]
      },
      {
        id: "iz3",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "ごちそうさまでした。今日は割り勘にしましょうか。一人いくらですか？",
        reading: "ごちそうさまでした。きょうはわりかんにしましょうか。ひとりいくらですか？",
        romaji: "Gochisousama deshita. Kyou wa warikan ni shimashou ka. Hitori ikura desu ka?",
        en: "Thank you for the meal. Shall we split the bill evenly today? How much per person?",
        politeness: "polite",
        options: [
          {
            id: "opt-iz3-1",
            ja: "ごちそうさまでした。今日は割り勘にしましょうか。一人いくらですか？",
            reading: "ごちそうさまでした。きょうはわりかんにしましょうか。ひとりいくらですか？",
            romaji: "Gochisousama deshita. Kyou wa warikan ni shimashou ka. Hitori ikura desu ka?",
            en: "Thanks for the meal. Shall we split it evenly? How much each?",
            politeness: "polite",
            isCorrect: true,
            explanation: "割り勘 (warikan) means splitting an izakaya check equally.",
            reaction: { speaker: "Suzuki", speakerJa: "鈴木", ja: "全部で12,000円だから、4人でちょうど3,000円ずつですね！", reading: "ぜんぶでいちまんにせんえんだから、よにんでちょうどさんぜんえんずつですね！", romaji: "Zenbu de ichiman nisen-en dakara, yonin de choudo sanzen-en zutsu desu ne!", en: "Total is 12,000 yen, so for 4 people that's exactly 3,000 yen each!" }
          }
        ]
      }
    ]
  }
];

