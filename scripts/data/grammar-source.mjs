// Hand-curated Grammar dataset from N5 through N1 with explanation, 3 examples, and common mistakes.
export const GRAMMAR = [
  // ==========================================
  // JLPT N5
  // ==========================================
  {
    id: "n5-desu",
    level: "N5",
    pattern: "〜です / 〜ではありません",
    meaning: "To be (am / is / are) / is not",
    explanation: "Affirms or negates the identity, state, or attribute of a noun or na-adjective politely. Past tense is でした / ではありませんでした (or じゃありませんでした).",
    examples: [
      { ja: "私は学生です。", romaji: "Watashi wa gakusei desu.", en: "I am a student." },
      { ja: "彼は先生ではありません。", romaji: "Kare wa sensei dewa arimasen.", en: "He is not a teacher." },
      { ja: "昨日は日曜日でした。", romaji: "Kinou wa nichiyoubi deshita.", en: "Yesterday was Sunday." }
    ],
    mistakes: [
      "Do not attach です directly after a plain verb (e.g. 食べるです is incorrect; use 食べます).",
      "For i-adjectives, the negative is 〜くないです, not 〜ではありません (e.g. 寒くないです, not 寒いではありません)."
    ]
  },
  {
    id: "n5-masu",
    level: "N5",
    pattern: "動詞[ます形] (〜ます / 〜ません / 〜ました)",
    meaning: "Polite verb form (present / negative / past)",
    explanation: "The standard polite way to state actions. 〜ます expresses present habitual action or future intent; 〜ません is negative; 〜ました is past.",
    examples: [
      { ja: "毎朝コーヒーを飲みます。", romaji: "Maiasa koohii o nomimasu.", en: "I drink coffee every morning." },
      { ja: "肉は食べません。", romaji: "Niku wa tabemasen.", en: "I don't eat meat." },
      { ja: "昨日日本語を勉強しました。", romaji: "Kinou nihongo o benkyou shimashita.", en: "I studied Japanese yesterday." }
    ],
    mistakes: [
      "Mixing polite endings with plain verbs inside sub-clauses (e.g. 買うます instead of 買います).",
      "Using 〜ます for existing states of non-living things (use あります, not ありま)."
    ]
  },
  {
    id: "n5-te-kudasai",
    level: "N5",
    pattern: "動詞[て形] + ください",
    meaning: "Please do ...",
    explanation: "Used to politely ask or instruct someone to perform an action. Built using the verb's te-form.",
    examples: [
      { ja: "ここに名前を書いてください。", romaji: "Koko ni namae o kaite kudasai.", en: "Please write your name here." },
      { ja: "日本語で話してください。", romaji: "Nihongo de hanashite kudasai.", en: "Please speak in Japanese." },
      { ja: "ちょっと待ってください。", romaji: "Chotto matte kudasai.", en: "Please wait a moment." }
    ]
  },
  {
    id: "n5-te-iru",
    level: "N5",
    pattern: "動詞[て形] + います",
    meaning: "Is doing ... (ongoing action) / Resulting state",
    explanation: "Expresses either continuous action in progress (drinking, reading) or an ongoing resulting state (living, knowing, married).",
    examples: [
      { ja: "今本を読んでいます。", romaji: "Ima hon o yonde imasu.", en: "I am reading a book right now." },
      { ja: "東京に住んでいます。", romaji: "Toukyou ni sunde imasu.", en: "I live in Tokyo (state)." },
      { ja: "田中さんを知っていますか。", romaji: "Tanaka-san o shitte imasu ka.", en: "Do you know Mr. Tanaka?" }
    ],
    mistakes: [
      "Saying 知っていません for 'I don't know' (the correct negative is 知りません).",
      "Confusing action in progress with simple future (e.g. 食べます vs 食べています)."
    ]
  },
  {
    id: "n5-tai",
    level: "N5",
    pattern: "動詞[ます形語幹] + たいです",
    meaning: "Want to do ...",
    explanation: "Expresses the speaker's own desire to do an action. The object can be marked with either を or が. Conjugates like an i-adjective (たくない / たかった).",
    examples: [
      { ja: "日本へ行きたいです。", romaji: "Nihon e ikitai desu.", en: "I want to go to Japan." },
      { ja: "水を飲みたいです。", romaji: "Mizu o nomitai desu.", en: "I want to drink water." },
      { ja: "今日は何もしたくないです。", romaji: "Kyou wa nani mo shitakunai desu.", en: "I don't want to do anything today." }
    ],
    mistakes: [
      "Directly asking a superior what they want to do using 〜たいですか (this is considered too direct; use いかがですか or 〜なさいますか)."
    ]
  },

  // ==========================================
  // JLPT N4
  // ==========================================
  {
    id: "n4-te-mo-ii",
    level: "N4",
    pattern: "動詞[て形] + もいいです (か)",
    meaning: "May I ...? / You may ... (Permission)",
    explanation: "Asks for or grants permission to do something. The negative form 〜てはいけません means 'must not do'.",
    examples: [
      { ja: "写真を撮ってもいいですか。", romaji: "Shashin o totte mo ii desu ka.", en: "May I take a photo?" },
      { ja: "ここでタバコを吸ってはいけません。", romaji: "Koko de tabako o sutte wa ikemasen.", en: "You must not smoke here." },
      { ja: "入ってもいいですよ。", romaji: "Haitte mo ii desu yo.", en: "You may come in." }
    ],
    mistakes: [
      "Using 〜てもいいです when giving permission to a social superior (too patronizing)."
    ]
  },
  {
    id: "n4-nakereba-naranai",
    level: "N4",
    pattern: "動詞[ない形] + なければなりません",
    meaning: "Must do / Have to do",
    explanation: "Expresses necessity or obligation: 'if you do not do X, it won't do'. Informally contracted to なきゃ or なくちゃ.",
    examples: [
      { ja: "明日早く起きなければなりません。", romaji: "Ashita hayaku okinakereba narimasen.", en: "I have to wake up early tomorrow." },
      { ja: "薬を飲まなければなりません。", romaji: "Kusuri o nomanakereba narimasen.", en: "I must take my medicine." },
      { ja: "宿題を出さなきゃいけない。", romaji: "Shukudai o dasanakya ikenai.", en: "I've got to turn in my homework." }
    ],
    mistakes: [
      "Forgetting to drop the final い from the ない form before adding ければ."
    ]
  },
  {
    id: "n4-hou-ga-ii",
    level: "N4",
    pattern: "動詞[た形 / ない形] + ほうがいいです",
    meaning: "It is better to ... / Had better (Advice)",
    explanation: "Gives advice or recommendations. Positive advice uses the past (た) form; negative advice uses the plain negative (ない) form.",
    examples: [
      { ja: "病院に行ったほうがいいですよ。", romaji: "Byouin ni itta hou ga ii desu yo.", en: "You'd better go to the hospital." },
      { ja: "無理をしないほうがいいです。", romaji: "Muri o shinai hou ga ii desu.", en: "It's better not to overdo it." },
      { ja: "傘を持って行ったほうがいいです。", romaji: "Kasa o motte itta hou ga ii desu.", en: "You should take an umbrella with you." }
    ],
    mistakes: [
      "Using the dictionary form instead of the past form for positive advice (e.g. 行くほうがいい is less natural than 行ったほうがいい)."
    ]
  },
  {
    id: "n4-koto-ga-dekiru",
    level: "N4",
    pattern: "動詞辞書形 + ことができる",
    meaning: "Can do ... / Able to do",
    explanation: "Nominalizes a verb using こと and attaches ができる to state capability or possibility. Equivalent to the potential verb form.",
    examples: [
      { ja: "漢字を読むことができます。", romaji: "Kanji o yomu koto ga dekimasu.", en: "I can read kanji." },
      { ja: "ピアノを弾くことができますか。", romaji: "Piano o hiku koto ga dekimasu ka.", en: "Can you play the piano?" },
      { ja: "クレジットカードを使うことができます。", romaji: "Kurejitto kaado o tsukau koto ga dekimasu.", en: "You can use credit cards." }
    ]
  },

  // ==========================================
  // JLPT N3
  // ==========================================
  {
    id: "n3-wake-de-wa-nai",
    level: "N3",
    pattern: "普通形 + わけではない",
    meaning: "It doesn't mean that ... / Not necessarily",
    explanation: "Used for partial negation: clarifying that although something might seem to be the case, it is not entirely true.",
    examples: [
      { ja: "嫌いなわけではありませんが、今は食べたくないです。", romaji: "Kirai na wake dewa arimasen ga, ima wa tabetakunai desu.", en: "It's not that I dislike it, but I don't want to eat right now." },
      { ja: "暇なわけではない。", romaji: "Hima na wake dewa nai.", en: "It's not like I have free time." },
      { ja: "全部知っているわけではない。", romaji: "Zenbu shitte iru wake dewa nai.", en: "It doesn't mean I know everything." }
    ],
    mistakes: [
      "Confusing わけではない (partial denial) with わけがない (strong impossibility: 'there's no way')."
    ]
  },
  {
    id: "n3-ni-taishite",
    level: "N3",
    pattern: "名詞 + に対して / に対する + 名詞",
    meaning: "Towards / Regarding / In contrast to",
    explanation: "Indicates an attitude, action directed at a target, or draws a direct contrast between two opposite situations.",
    examples: [
      { ja: "お客様に対して丁寧に話します。", romaji: "Okyakusama ni taishite teinei ni hanashimasu.", en: "Speak politely towards customers." },
      { ja: "兄は社交的なのに対して、弟は物静かだ。", romaji: "Ani wa shakouteki na no ni taishite, otouto wa monoshizuka da.", en: "While the older brother is outgoing, the younger is quiet." },
      { ja: "質問に対する答えを教えてください。", romaji: "Shitsumon ni taisuru kotae o oshiete kudasai.", en: "Please give me the answer to the question." }
    ]
  },
  {
    id: "n3-toshite",
    level: "N3",
    pattern: "名詞 + として",
    meaning: "As / In the capacity or role of",
    explanation: "Specifies a role, capacity, qualification, or status under which someone acts or something is viewed.",
    examples: [
      { ja: "留学生として日本に来ました。", romaji: "Ryuugakusei to shite Nihon ni kimashita.", en: "I came to Japan as an international student." },
      { ja: "趣味として写真を撮っています。", romaji: "Shumi to shite shashin o totte imasu.", en: "I take photos as a hobby." },
      { ja: "彼はリーダーとしてみんなを引っ張っている。", romaji: "Kare wa riidaa to shite minna o hippatte iru.", en: "He is leading everyone in his role as leader." }
    ]
  },

  // ==========================================
  // JLPT N2
  // ==========================================
  {
    id: "n2-wake-ni-wa-ikanai",
    level: "N2",
    pattern: "動詞辞書形 / ない形 + わけにはいかない",
    meaning: "Cannot afford to ... / Must (have no choice but to)",
    explanation: "Expresses that one cannot do an action due to social conventions, morals, or common sense. With negative verbs (〜ないわけにはいかない), it means one cannot avoid doing it.",
    examples: [
      { ja: "大切な会議だから休むわけにはいかない。", romaji: "Taisetsu na kaigi da kara yasumu wake ni wa ikanai.", en: "It's an important meeting, so I cannot afford to take the day off." },
      { ja: "約束したからには、行かないわけにはいかない。", romaji: "Yakusoku shita kara ni wa, ikanai wake ni wa ikanai.", en: "Since I promised, I simply must go." },
      { ja: "秘密だから誰にも話すわけにはいかない。", romaji: "Himitsu da kara dare ni mo hanasu wake ni wa ikanai.", en: "It's a secret, so I can't possibly tell anyone." }
    ],
    mistakes: [
      "Using this for physical inability (use potential form できない instead; わけにはいかない is about ethical/social inhibition)."
    ]
  },
  {
    id: "n2-zaru-o-enai",
    level: "N2",
    pattern: "動詞[ない形語幹] + ざるを得ない (する -> せざるを得ない)",
    meaning: "Cannot help but ... / Forced to do",
    explanation: "Expresses being compelled to do something against one's wishes due to unavoidable circumstances.",
    examples: [
      { ja: "台風のため、旅行は中止せざるを得ない。", romaji: "Taifuu no tame, ryokou wa chuushi sezaru o enai.", en: "Due to the typhoon, we have no choice but to cancel the trip." },
      { ja: "証拠がある以上、事実を認めざるを得ない。", romaji: "Shouko ga aru ijou, jijitsu o mitomezaru o enai.", en: "With evidence present, I cannot help but admit the facts." },
      { ja: "計画を変更せざるを得なくなった。", romaji: "Keikaku o henkou sezaru o enakunatta.", en: "We were forced to alter the plan." }
    ],
    mistakes: [
      "Conjugating する as しざるを得ない (the irregular correct form is せざるを得ない)."
    ]
  },
  {
    id: "n2-saichuu-ni",
    level: "N2",
    pattern: "動詞[ている] / 名詞の + 最中に",
    meaning: "Right in the middle of ... (unexpected interruption)",
    explanation: "Indicates that an unexpected event occurs precisely in the middle of an ongoing action, interrupting it.",
    examples: [
      { ja: "食事の最中に電話がかかってきた。", romaji: "Shokuji no saichuu ni denwa ga kakatte kita.", en: "A phone call came right in the middle of our meal." },
      { ja: "スピーチをしている最中に停電になった。", romaji: "Supiichi o shite iru saichuu ni teiden ni natta.", en: "The power went out right while he was giving his speech." },
      { ja: "考えている最中だから静かにしてください。", romaji: "Kangaete iru saichuu da kara shizuka ni shite kudasai.", en: "I am in the middle of thinking, so please be quiet." }
    ]
  },

  // ==========================================
  // JLPT N1
  // ==========================================
  {
    id: "n1-o-kawa-kiri-ni",
    level: "N1",
    pattern: "名詞 + を皮切りに (して) / を皮切りとして",
    meaning: "Starting with ... / Sparked by ...",
    explanation: "Denotes that a particular event kicks off a succession of similar actions or events that expand consecutively.",
    examples: [
      { ja: "東京公演を皮切りに、全国ツアーが始まる。", romaji: "Toukyou kouen o kawakiri ni, zenkoku tsuaa ga hajimaru.", en: "Starting with the Tokyo concert, the nationwide tour commences." },
      { ja: "あの発言を皮切りにして激しい論争が巻き起こった。", romaji: "Ano hatsugen o kawakiri ni shite hageshii ronsou ga makiokotta.", en: "Sparked by that remark, a fierce debate erupted." },
      { ja: "新製品の発売を皮切りに、大型キャンペーンを展開する。", romaji: "Shinseihin no hatsubai o kawakiri ni, oogata kyanpeen o tenkai suru.", en: "Beginning with the release of the new product, a major campaign will be rolled out." }
    ]
  },
  {
    id: "n1-kiwami",
    level: "N1",
    pattern: "名詞 / な形容詞 + の極み (きわみ)",
    meaning: "The height of ... / The ultimate ...",
    explanation: "Formal, literary expression denoting the absolute peak or extreme degree of an emotional or evaluative state (e.g. pain, regret, luxury).",
    examples: [
      { ja: "このような賞をいただき、光栄の極みです。", romaji: "Kono you na shou o itadaki, kouei no kiwami desu.", en: "Receiving such an award is the height of honor." },
      { ja: "危険極まりない行為だ。", romaji: "Kiken kiwamarinai koui da.", en: "It is an act of extreme danger." },
      { ja: "若気の至りとはいえ、無礼の極みであった。", romaji: "Wakage no itari to wa ie, burei no kiwami de atta.", en: "Though born of youthful indiscretion, it was the ultimate in rudeness." }
    ]
  },
  {
    id: "n1-yogi-naku-sareru",
    level: "N1",
    pattern: "名詞 + を余儀なくされる / を余儀なくさせる",
    meaning: "To be forced into ... / Compels someone to ...",
    explanation: "Written, formal pattern indicating that unforeseen external circumstances force a difficult decision or outcome (cancellation, postponement, retreat).",
    examples: [
      { ja: "大雨により、イベントは延期を余儀なくされた。", romaji: "Ooame ni yori, ibento wa enki o yogi naku sareta.", en: "Due to heavy rains, the event was forced to be postponed." },
      { ja: "怪我のため、引退を余儀なくされた。", romaji: "Kega no tame, intai o yogi naku sareta.", en: "Owing to injury, he was forced into retirement." },
      { ja: "不況が多くの企業に方針の変更を余儀なくさせた。", romaji: "Fukyou ga ooku no kigyou ni houshin no henkou o yogi naku saseta.", en: "The recession forced many corporations to change their policies." }
    ]
  }
];

