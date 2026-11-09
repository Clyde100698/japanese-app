// N2 and N1 Scenarios (7 N2 + 6 N1 = 13 scenarios)
export const SCENARIOS_N2_N1 = [
  // --- N2 Scenarios (7) ---
  {
    id: "n2-interview",
    title: "Job Interview: Strengths & Motivation",
    titleJa: "採用面接：志望動機と自己PR",
    level: "N2",
    category: "Workplace",
    description: "In a formal Japanese job interview, explain your career background, reason for applying (志望動機), and how your skills contribute.",
    keyPhrases: [
      { id: "phrase-int-1", front: "これまでの経験を活かし、貢献したいと考えております", reading: "これまでのけいけんをいかし、こうけんしたいとかんがえております", romaji: "koremade no keiken o ikashi, kouken shitai to kangaete orimasu", answer: "I wish to contribute by utilizing my past experience.", notes: "Formal business interview phrasing." },
      { id: "phrase-int-2", front: "御社の事業理念に深く共感いたしました", reading: "おんしゃのじぎょうりねんにふかくきょうかんいたしました", romaji: "onsha no jigyou rinen ni fukaku kyoukan itashimashita", answer: "I deeply resonated with your company's business philosophy.", notes: "Respectful company reference (御社)." }
    ],
    lines: [
      {
        id: "int1",
        speaker: "other",
        speakerName: "Interviewer",
        speakerNameJa: "面接官",
        ja: "それでは、弊社の求人にご応募いただいた志望動機をお聞かせいただけますか？",
        reading: "それでは、へいしゃのきゅうじんにごおうぼいただいたしぼうどうきをおきかせいただけますか？",
        romaji: "Soredewa, heisha no kyuujin ni go-oubo itadaita shibou douki o okikase itadakemasu ka?",
        en: "Now then, could you tell us your reasons for applying to our company?",
        politeness: "keigo"
      },
      {
        id: "int2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "御社の国際的な事業展開と技術革新に深く惹かれ、これまで培ったITスキルを活かして貢献したいと考え、志望いたしました。",
        reading: "おんしゃのこくさいてきなじぎょうてんかいとぎじゅつかくしんにふかくひかれ、これまでつちかったあいてぃーすきるをいかしてこうけんしたいとかんがえ、しぼういたしました。",
        romaji: "Onsha no kokusaiteki na jigyou tenkai to gijutsu kakushin ni fukaku hikare, koremade tsuchikatta aitii sukiru o ikashite kouken shitai to kangae, shibou itashimashita.",
        en: "I was deeply drawn to your company's global expansion and technological innovation, and applied wishing to contribute through the IT skills I have cultivated.",
        politeness: "keigo",
        options: [
          {
            id: "opt-int2-1",
            ja: "御社の国際的な事業展開と技術革新に深く惹かれ、これまで培ったITスキルを活かして貢献したいと考え、志望いたしました。",
            reading: "おんしゃのこくさいてきなじぎょうてんかいとぎじゅつかくしんにふかくひかれ、これまでつちかったあいてぃーすきるをいかしてこうけんしたいとかんがえ、しぼういたしました。",
            romaji: "Onsha no kokusaiteki na jigyou tenkai to gijutsu kakushin ni fukaku hikare, koremade tsuchikatta aitii sukiru o ikashite kouken shitai to kangae, shibou itashimashita.",
            en: "Deeply drawn to your company's innovation; eager to contribute cultivated IT skills.",
            politeness: "keigo",
            isCorrect: true,
            explanation: "Exemplary N2 interview keigo: uses 御社 (onsha) for applicant, 培った (cultivated), and 貢献したいと考え (wishing to contribute).",
            reaction: { speaker: "Interviewer", speakerJa: "面接官", ja: "ありがとうございます。前職で直面した最も大きな困難と、それをどのように乗り越えたかも教えてください。", reading: "ありがとうございます。ぜんしょくでちょくめんしたもっともおおきなこんなんと、それをどのようにのりこえたかもおしえてください。", romaji: "Arigatou gozaimasu. Zenshoku de chokumen shita mottomo ookina konnan to, sore o dono you ni norikoeta ka mo oshiete kudasai.", en: "Thank you. Please also tell us about the biggest obstacle you faced in your previous position and how you overcame it." }
          }
        ]
      }
    ]
  },
  {
    id: "n2-deadline-negotiation",
    title: "Negotiating a Project Deadline",
    titleJa: "納期の調整交渉",
    level: "N2",
    category: "Workplace",
    description: "Due to additional client requirements, negotiate a 3-day extension with the project director without harming the relationship.",
    keyPhrases: [
      { id: "phrase-dead-1", front: "品質を担保するため、納期を3日延ばしていただけないでしょうか", reading: "ひんしつをたんぽするため、のうきをみっかのばしていただけないでしょうか", romaji: "hinshitsu o tanpo suru tame, nouki o mikka nobashite itadakenai deshou ka", answer: "To ensure quality, could we extend the deadline by 3 days?", notes: "Business deadline negotiation." },
      { id: "phrase-dead-2", front: "ご負担をおかけして誠に恐縮ですが", reading: "ごふたんをおかけしてまことにきょうしゅくですが", romaji: "gofutan o okake shite makoto ni kyoushuku desu ga", answer: "I am truly remorseful for causing you this burden...", notes: "Polite buffer phrase (クッション言葉)." }
    ],
    lines: [
      {
        id: "dn0",
        speaker: "other",
        speakerName: "Director",
        speakerNameJa: "部長",
        ja: "例のプロジェクトの進捗はいかがですか？予定通り今週中に納品できそうですか？",
        reading: "れいのぷろじぇくとのしんちょくはいかがですか？よていどおりこんしゅうちゅうにのうひんできそうですか？",
        romaji: "Rei no purojekuto no shinchoku wa ikaga desu ka? Yoteidoori konshuuchuu ni nouhin dekisou desu ka?",
        en: "How is the progress on that project? Does it look like delivery can be made within this week as planned?",
        politeness: "keigo"
      },
      {
        id: "dn1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "部長、昨日の仕様変更に伴い、品質を担保するために納期の猶予を3日ほどいただくことは可能でしょうか？",
        reading: "ぶちょう、きのうのしようへんこうにともない、ひんしつをたんぽするためにのうきのゆうよをみっかほどいただくことはかのうでしょうか？",
        romaji: "Buchou, kinou no shiyou henkou ni tomonai, hinshitsu o tanpo suru tame ni nouki no yuuyo o mikka hodo itadaku koto wa kanou deshou ka?",
        en: "Director, with yesterday's specification changes, would it be possible to obtain a grace period of about 3 days on the deadline to ensure quality?",
        politeness: "keigo",
        options: [
          {
            id: "opt-dn1-1",
            ja: "部長、昨日の仕様変更に伴い、品質を担保するために納期の猶予を3日ほどいただくことは可能でしょうか？",
            reading: "ぶちょう、きのうのしようへんこうにともない、ひんしつをたんぽするためにのうきのゆうよをみっかほどいただくことはかのうでしょうか？",
            romaji: "Buchou, kinou no shiyou henkou ni tomonai, hinshitsu o tanpo suru tame ni nouki no yuuyo o mikka hodo itadaku koto wa kanou deshou ka?",
            en: "Director, given spec changes, would a 3-day extension be possible to guarantee quality?",
            politeness: "keigo",
            isCorrect: true,
            explanation: "Couples the cause (仕様変更に伴い) with the company value (品質を担保するため) and requests a grace period (猶予) deferentially.",
            reaction: { speaker: "Director", speakerJa: "部長", ja: "クライアントとの兼ね合いもあるが、手戻りが出るよりは確実に仕上げた方がいいな。金曜日の15時までなら調整しよう。", reading: "くらいあんととのかねあいもあるが、てもどりがでるよりはかくじつにしあげたほうがいいな。きんようびのじゅうごじまでならちょうせいしよう。", romaji: "Kuraianto to no kaneai mo aru ga, temodori ga deru yori wa kakujitsu ni shiageta hou ga ii na. Kinyoubi no juugoji made nara chousei shiyou.", en: "There is the client balance to consider, but a solid finish is better than rework. I will adjust it until 3:00 PM Friday." }
          }
        ]
      }
    ]
  },
  {
    id: "n2-complaint-handling",
    title: "Handling a Customer Complaint",
    titleJa: "顧客からのクレーム対応",
    level: "N2",
    category: "Workplace",
    description: "An upset client calls because a shipment was delayed. De-escalate with formal keigo, validate their concern, and provide a solution.",
    keyPhrases: [
      { id: "phrase-comp-1", front: "ご不快な思いをおかけし、心よりお詫び申し上げます", reading: "ごふかいなおもいをおかけし、こころよりおわびもうしあげます", romaji: "gofukai na omoi o okake shi, kokoro yori owabi moushiagemasu", answer: "I sincerely apologize for causing you such displeasure.", notes: "Highest-grade commercial apology." },
      { id: "phrase-comp-2", front: "再発防止に向けて原因を究明いたします", reading: "さいはつぼうしにむけてげんいんをきゅうめいいたします", romaji: "saihatsu boushi ni mukete gen'in o kyuumei itashimasu", answer: "We will investigate the cause to prevent recurrence.", notes: "Commitment to future prevention." }
    ],
    lines: [
      {
        id: "cm1",
        speaker: "other",
        speakerName: "Client",
        speakerNameJa: "顧客",
        ja: "注文した商品が今日届くはずだったのにまだ来ていません！明日のイベントで使うのにどうしてくれるんですか？！",
        reading: "ちゅうもんしたしょうひんがきょうとどくはずだったのにまだきていません！あしたのいべんとでつかうのにどうしてくれるんですか？！",
        romaji: "Chuumon shita shouhin ga kyou todoku hazu datta no ni mada kite imasen! Ashita no ibento de tsukau no ni dou shite kureru n desu ka?!",
        en: "The items I ordered were supposed to arrive today but still haven't! What are you going to do about our event tomorrow?!",
        politeness: "casual"
      },
      {
        id: "cm2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "大変なご迷惑をおかけして誠に申し訳ございません。至急配送状況を確認し、本日中に代替品をお届けできるよう手配いたします。",
        reading: "たいへんなごめいわくをおかけしてまことにもうしわけございません。しきゅうはいそうじょうきょうをかくにんし、ほんじつちゅうにだいたいひんをおとどけできるようてはいいいたします。",
        romaji: "Taihen na gomeiwaku o okake shite makoto ni moushiwake gozaimasen. Shikyuu haisou joukyou o kakunin shi, honjitsuchuu ni daitaihin o otodoke dekiru you tehai itashimasu.",
        en: "We sincerely apologize for the immense inconvenience. I will check delivery status immediately and arrange for a replacement to be delivered today.",
        politeness: "keigo",
        options: [
          {
            id: "opt-cm2-1",
            ja: "大変なご迷惑をおかけして誠に申し訳ございません。至急配送状況を確認し、本日中に代替品をお届けできるよう手配いたします。",
            reading: "たいへんなごめいわくをおかけしてまことにもうしわけございません。しきゅうはいそうじょうきょうをかくにんし、ほんじつちゅうにだいたいひんをおとどけできるようてはいいいたします。",
            romaji: "Taihen na gomeiwaku o okake shite makoto ni moushiwake gozaimasen. Shikyuu haisou joukyou o kakunin shi, honjitsuchuu ni daitaihin o otodoke dekiru you tehai itashimasu.",
            en: "Deepest apologies. I will verify shipment immediately and arrange same-day alternative delivery.",
            politeness: "keigo",
            isCorrect: true,
            explanation: "Immediate unconditional apology + prompt solution (至急...手配いたします) turns anger into trust.",
            reaction: { speaker: "Client", speakerJa: "顧客", ja: "本日中に届くなら助かります。確実にお願いしますよ！", reading: "ほんじつちゅうにとどくならたすかります。かくじつにおねがいしますよ！", romaji: "Honjitsuchuu ni todoku nara tasukarimasu. Kakujitsu ni onegaishimasu yo!", en: "If it arrives today that saves us. Please ensure it happens without fail!" }
          }
        ]
      }
    ]
  },
  {
    id: "n2-climate-discussion",
    title: "Discussing Climate and Energy Policy",
    titleJa: "環境問題と再生可能エネルギーの議論",
    level: "N2",
    category: "Social",
    description: "Exchange opinions in a seminar on carbon neutrality, renewable energy, and economic trade-offs.",
    keyPhrases: [
      { id: "phrase-env-1", front: "脱炭素社会の実現に向けて", reading: "だつたんそしゃかいのじつげんにむけて", romaji: "datsutanso shakai no jitsugen ni mukete", answer: "Toward realizing a decarbonized society", notes: "Socio-economic discourse term." },
      { id: "phrase-env-2", front: "長期的な視点に立つ必要があります", reading: "ちょうきてきなしてんにたつひつようがあります", romaji: "choukiteki na shiten ni tatsu hitsuyou ga arimasu", answer: "It is necessary to adopt a long-term perspective.", notes: "Analytical reasoning phrase." }
    ],
    lines: [
      {
        id: "env1",
        speaker: "other",
        speakerName: "Moderator",
        speakerNameJa: "司会",
        ja: "再生可能エネルギーの普及について、コスト面での課題をどのように捉えていますか？",
        reading: "さいせいかのうえねるぎーのふきゅうについて、こすとめんでのかだいをどのようにとらえていますか？",
        romaji: "Saisei kanou enerugii no fukyuu ni tsuite, kosuto-men de no kadai o dono you ni toraeteimasu ka?",
        en: "Regarding the spread of renewable energy, how do you perceive the cost challenges?",
        politeness: "polite"
      },
      {
        id: "env2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "初期投資は大きいものの、環境負荷の低減と将来的な持続可能性を考慮すれば、長期的な費用対効果は十分にあると考えます。",
        reading: "しょきとうしはおおきいものの、かんきょうふかのていげんとしょうらいてきなじぞくかのうせいをこうりょすれば、ちょうきてきなひようたいこうかはじゅうぶんにあるとかんがえます。",
        romaji: "Shoki toushi wa ookii mono no, kankyou fuka no teigen to shouraiteki na jizokukanousei o kouryo sureba, choukiteki na hiyoutaikouka wa juubun ni aru to kangaemasu.",
        en: "Although initial investment is substantial, considering environmental impact reduction and future sustainability, I believe there is ample long-term cost-effectiveness.",
        politeness: "polite",
        options: [
          {
            id: "opt-env2-1",
            ja: "初期投資は大きいものの、環境負荷の低減と将来的な持続可能性を考慮すれば、長期的な費用対効果は十分にあると考えます。",
            reading: "しょきとうしはおおきいものの、かんきょうふかのていげんとしょうらいてきなじぞくかのうせいをこうりょすれば、ちょうきてきなひようたいこうかはじゅうぶんにあるとかんがえます。",
            romaji: "Shoki toushi wa ookii mono no, kankyou fuka no teigen to shouraiteki na jizokukanousei o kouryo sureba, choukiteki na hiyoutaikouka wa juubun ni aru to kangaemasu.",
            en: "While initial investment is large, long-term ROI is strong given sustainability and emission cuts.",
            politeness: "polite",
            isCorrect: true,
            explanation: "〜ものの (although) + 費用対効果 (cost-effectiveness) + と考えます fits N2 academic/opinion registers.",
            reaction: { speaker: "Moderator", speakerJa: "司会", ja: "まさに多面的な評価が不可欠ですね。貴重なご意見ありがとうございます。", reading: "まさにためんてきなひょうかがふかけつですね。きちょうなごいけんありがとうございます。", romaji: "Masa ni tamenteki na hyouka ga fukaketsu desu ne. Kichou na go-iken arigatou gozaimasu.", en: "Indeed, a multifaceted evaluation is indispensable. Thank you for your valuable insight." }
          }
        ]
      }
    ]
  },
  {
    id: "n2-lease-renewal",
    title: "Lease Contract Renewal Negotiation",
    titleJa: "賃貸契約の更新手続きと相談",
    level: "N2",
    category: "Services",
    description: "Contact your apartment building management company to discuss contract renewal conditions and insurance updates.",
    keyPhrases: [
      { id: "phrase-lease-1", front: "賃貸借契約の更新手続きについて伺いたいのですが", reading: "ちんたいしゃくけいやくのこうしんてつづきについてうかがいたいのですが", romaji: "chintaishaku keiyaku no koushin tetsuzuki ni tsuite ukagaitai no desu ga", answer: "I'd like to ask regarding the lease contract renewal process.", notes: "Official tenancy vocabulary." },
      { id: "phrase-lease-2", front: "火災保険の継続加入", reading: "かさいほけんのけいぞくかにゅう", romaji: "kasai hoken no keizoku kanyuu", answer: "Continued fire insurance enrollment", notes: "Mandatory rental requirement." }
    ],
    lines: [
      {
        id: "ls0",
        speaker: "other",
        speakerName: "Property Manager",
        speakerNameJa: "管理会社",
        ja: "お電話ありがとうございます。グランドパレス管理事務局でございます。",
        reading: "おでんわありがとうございます。ぐらんどぱれすかんりじむきょくでございます。",
        romaji: "Odenwa arigatou gozaimasu. Gurando Paresu kanri jimukyoku de gozaimasu.",
        en: "Thank you for calling. This is the Grand Palace Property Management Office.",
        politeness: "keigo"
      },
      {
        id: "ls1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "お世話になっております。来月満期を迎える契約更新の書類が届いたのですが、更新料の支払い期日を確認させていただけますか？",
        reading: "おせわになっております。らいげつまんきをむかえるけいやくこうしんのしょるいがとどいたのですが、こうしんりょうのしはらいきじつをかくにんさせていただけますか？",
        romaji: "Osewa ni natte orimasu. Raigetsu manki o mukaeru keiyaku koushin no shorui ga todoita no desu ga, koushinryou no shiharai kijitsu o kakunin sasete itadakemasu ka?",
        en: "Hello, thank you for your ongoing support. I received the renewal documents expiring next month; could I confirm the payment deadline for the renewal fee?",
        politeness: "keigo",
        options: [
          {
            id: "opt-ls1-1",
            ja: "お世話になっております。来月満期を迎える契約更新の書類が届いたのですが、更新料の支払い期日を確認させていただけますか？",
            reading: "おせわになっております。らいげつまんきをむかえるけいやくこうしんのしょるいがとどいたのですが、こうしんりょうのしはらいきじつをかくにんさせていただけますか？",
            romaji: "Osewa ni natte orimasu. Raigetsu manki o mukaeru keiyaku koushin no shorui ga todoita no desu ga, koushinryou no shiharai kijitsu o kakunin sasete itadakemasu ka?",
            en: "Greeting + received contract expiring next month; may I verify renewal fee deadline?",
            politeness: "keigo",
            isCorrect: true,
            explanation: "満期を迎える (reaching expiration) and 確認させていただけますか (allow me to confirm).",
            reaction: { speaker: "Property Manager", speakerJa: "管理会社", ja: "ご連絡ありがとうございます。更新料のお振込は、契約満了日の2週間前までにお願いしております。", reading: "ごれんらくありがとうございます。こうしんりょうのおふりこみは、けいやくまんりょうびのにしゅうかんまえまでにおねがいしております。", romaji: "Gorenraku arigatou gozaimasu. Koushinryou no ofurikomi wa, keiyaku manryoubi no nishuukan mae made ni onegai shite orimasu.", en: "Thank you for contacting us. The bank transfer for renewal fee is requested by 2 weeks prior to expiration date." }
          }
        ]
      }
    ]
  },
  {
    id: "n2-wedding-speech",
    title: "Wedding Congratulatory Speech",
    titleJa: "結婚披露宴での友人代表スピーチ",
    level: "N2",
    category: "Social",
    description: "Deliver a warm, respectful speech at a friend's Japanese wedding reception without using taboo words (忌み言葉).",
    keyPhrases: [
      { id: "phrase-wed-1", front: "ご結婚を心よりお祝い申し上げます", reading: "ごけっこんをこころよりおいわいもうしあげます", romaji: "gokekkon o kokoro yori oiwai moushiagemasu", answer: "I offer my heartiest congratulations on your marriage.", notes: "Standard formal wedding opening." },
      { id: "phrase-wed-2", front: "末永いお幸せをお祈りしております", reading: "すえながいおしあわせをおいのりしております", romaji: "suenagai oshiawase o oinori shite orimasu", answer: "I pray for your everlasting happiness.", notes: "Formal wedding blessing." }
    ],
    lines: [
      {
        id: "ws0",
        speaker: "other",
        speakerName: "MC",
        speakerNameJa: "司会",
        ja: "続きまして、新郎のご友人よりご祝辞を頂戴いたします。よろしくお願いいたします。",
        reading: "つづきまして、しんろうのごゆうじんよりごしゅくじをちょうだいいたします。よろしくおねがいいたします。",
        romaji: "Tsuzukimashite, shinrou no goyuujin yori goshukuji o choudai itashimasu. Yoroshiku onegai itashimasu.",
        en: "Next, we will receive congratulatory remarks from a friend of the groom. Please go ahead.",
        politeness: "keigo"
      },
      {
        id: "ws1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "新郎新婦ならびにご両家の皆様、本日は誠におめでとうございます。二人の末永いお幸せを心よりお祈り申し上げます。",
        reading: "しんろうしんぷならびにごりょうけのみなさま、ほんじつまことにごおめでとうございます。ふたりのすえながいおしあわせをこころよりおいわいもうしあげます。",
        romaji: "Shinrou shinpu narabi ni goryouke no minasama, honjitsu wa makoto ni omedetou gozaimasu. Futari no suenagai oshiawase o kokoro yori oinori moushiagemasu.",
        en: "To the bride and groom, and both families, heartiest congratulations today. I pray from the bottom of my heart for your everlasting happiness.",
        politeness: "keigo",
        options: [
          {
            id: "opt-ws1-1",
            ja: "新郎新婦ならびにご両家の皆様、本日は誠におめでとうございます。二人の末永いお幸せを心よりお祈り申し上げます。",
            reading: "しんろうしんぷならびにごりょうけのみなさま、ほんじつまことにごおめでとうございます。ふたりのすえながいおしあわせをこころよりおいわいもうしあげます。",
            romaji: "Shinrou shinpu narabi ni goryouke no minasama, honjitsu wa makoto ni omedetou gozaimasu. Futari no suenagai oshiawase o kokoro yori oinori moushiagemasu.",
            en: "To the bride and groom and families, warmest congratulations. I pray for your eternal happiness.",
            politeness: "keigo",
            isCorrect: true,
            explanation: "Addresses 新郎新婦 (bride & groom) and ご両家 (both families) with flawless ceremonial keigo.",
            reaction: { speaker: "Guests", speakerJa: "列席者", ja: "拍手（パチパチパチパチ！）", reading: "はくしゅ（ぱちぱちぱちぱち！）", romaji: "Hakushu (pachi pachi pachi pachi!)", en: "Warm applause from all guests!" }
          }
        ]
      }
    ]
  },
  {
    id: "n2-condolences",
    title: "Expressing Formal Condolences",
    titleJa: "弔問とお悔やみの言葉",
    level: "N2",
    category: "Social",
    description: "Express respectful condolences to a colleague or acquaintance who has suffered a bereavement.",
    keyPhrases: [
      { id: "phrase-cond-1", front: "この度は誠にご愁傷様でございます", reading: "このたびはまことにごしゅうしょうさまでございます", romaji: "konotabi wa makoto ni goshuushousama de gozaimasu", answer: "Please accept my most heartfelt condolences at this time.", notes: "Quintessential formal Japanese condolence." },
      { id: "phrase-cond-2", front: "心よりご冥福をお祈りいたします", reading: "こころよりごめいふくをおいのりいたします", romaji: "kokoro yori gomeifuku o oinori itashimasu", answer: "I pray from the bottom of my heart for their peaceful rest.", notes: "Formal prayer for the deceased." }
    ],
    lines: [
      {
        id: "cd0",
        speaker: "other",
        speakerName: "Bereaved Colleague",
        speakerNameJa: "同僚",
        ja: "本日はご多忙の折、遠方よりお運びいただき恐縮でございます。",
        reading: "ほんじつはごたぼうのおり、えんぽうよりおはこびいただききょうしゅくでございます。",
        romaji: "Honjitsu wa gotabou no ori, empou yori o-hakobi itadaki kyoushuku de gozaimasu.",
        en: "Thank you so much for traveling from afar to attend today despite your busy schedule.",
        politeness: "keigo"
      },
      {
        id: "cd1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "この度は思いがけないご不幸で、誠にご愁傷様でございます。心よりご冥福をお祈り申し上げます。",
        reading: "このたびはおもいがけないごふこうで、まことにごしゅうしょうさまでございます。こころよりごめいふくをおいのりもうしあげます。",
        romaji: "Kono tabi wa omoigakenai gofukou de, makoto ni goshuushousama de gozaimasu. Kokoro yori gomeifuku o oinori moushiagemasu.",
        en: "Please accept my deepest condolences on this unexpected bereavement. I pray from my heart for their peaceful soul.",
        politeness: "keigo",
        options: [
          {
            id: "opt-cd1-1",
            ja: "この度は思いがけないご不幸で、誠にご愁傷様でございます。心よりご冥福をお祈り申し上げます。",
            reading: "このたびはおもいがけないごふこうで、まことにごしゅうしょうさまでございます。こころよりごめいふくをおいのりもうしあげます。",
            romaji: "Kono tabi wa omoigakenai gofukou de, makoto ni goshuushousama de gozaimasu. Kokoro yori gomeifuku o oinori moushiagemasu.",
            en: "Deepest condolences on this unexpected bereavement. Praying for their soul's rest.",
            politeness: "keigo",
            isCorrect: true,
            explanation: "ご愁傷様 (goshuushousama) and ご冥福 (gomeifuku) are the strict ceremonial Japanese phrases required for condolences.",
            reaction: { speaker: "Bereaved", speakerJa: "遺族", ja: "温かいお心遣いをいただき、痛み入ります。", reading: "あたたかいおこころづかいをいただき、いたみいります。", romaji: "Atatakai okokorodzukai o itadaki, itami-irimasu.", en: "I am deeply humbled and grateful for your warm thoughts." }
          }
        ]
      }
    ]
  },

  // --- N1 Scenarios (6) ---
  {
    id: "n1-business-negotiation",
    title: "High-Stakes Business Alliance Negotiation",
    titleJa: "業務提携に向けたトップ交渉",
    level: "N1",
    category: "Workplace",
    description: "Represent your corporation in a strategic partnership meeting using consummate sonkeigo and kenjougo.",
    keyPhrases: [
      { id: "phrase-neg-1", front: "双方の強みを融合させ、相乗効果を創出する所存です", reading: "そうほうのつよみをゆうごうさせ、そうじょうこうかをそうしゅつするしょぞんです", romaji: "souhou no tsuyomi o yuugou sase, soujou kouka o soushutsu suru shozon desu", answer: "We intend to merge both our strengths and create synergy.", notes: "Executive N1 terminology (所存 = intend)." },
      { id: "phrase-neg-2", front: "前向きにご検討いただけますと幸甚に存じます", reading: "まえむきにごけんとういただけますとこうじんにぞんじます", romaji: "maemuki ni gokentou itadakemasu to koujin ni zonjimasu", answer: "We would be extremely delighted if you could consider this favorably.", notes: "Supreme formal business grace (幸甚に存じます)." }
    ],
    lines: [
      {
        id: "bn1",
        speaker: "other",
        speakerName: "Managing Director",
        speakerNameJa: "専務",
        ja: "本日のご提案、拝見いたしました。技術共有におけるリスク管理について、御社のお考えをお聞かせ願えますか？",
        reading: "ほんじつのごていあん、はいけんいたしました。ぎじゅつきょうゆうにおけるりすくかんりについて、おんしゃのおかんがえをおきかせねがえますか？",
        romaji: "Honjitsu no goteian, haiken itashimashita. Gijutsu kyouyuu ni okeru risuku kanri ni tsuite, onsha no okangae o okikase negaemasu ka?",
        en: "I have reviewed today's proposal. Could we hear your thoughts regarding risk management in technical sharing?",
        politeness: "keigo"
      },
      {
        id: "bn2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "知財保護と情報ガバナンスを最優先事項と位置づけ、厳格な権限管理体制を敷く所存でございます。ご懸念の点につきましては、逐次ご報告申し上げます。",
        reading: "ちざいほごとじょうほうがばなんすをさいゆうせんじこうといちづけ、げんかくなけんげんかんりたいせいをしくしょぞんでございます。ごけねんのてんにつきましては、ちくじごほうこくもうしあげます。",
        romaji: "Chizai hogo to jouhou gabanansu o saiyuusen jikou to ichidzuke, genkaku na kengen kanri taisei o shiku shozon de gozaimasu. Gokenen no ten ni tsukimashite wa, chikuji gohoukoku moushiagemasu.",
        en: "Positioning intellectual property protection and information governance as top priorities, we intend to establish a strict authority management regime, and will report sequentially on any points of concern.",
        politeness: "keigo",
        options: [
          {
            id: "opt-bn2-1",
            ja: "知財保護と情報ガバナンスを最優先事項と位置づけ、厳格な権限管理体制を敷く所存でございます。ご懸念の点につきましては、逐次ご報告申し上げます。",
            reading: "ちざいほごとじょうほうがばなんすをさいゆうせんじこうといちづけ、げんかくなけんげんかんりたいせいをしくしょぞんでございます。ごけねんのてんにつきましては、ちくじごほうこくもうしあげます。",
            romaji: "Chizai hogo to jouhou gabanansu o saiyuusen jikou to ichidzuke, genkaku na kengen kanri taisei o shiku shozon de gozaimasu. Gokenen no ten ni tsukimashite wa, chikuji gohoukoku moushiagemasu.",
            en: "We will establish strict governance and report sequentially on all concerns.",
            politeness: "keigo",
            isCorrect: true,
            explanation: "Exemplary N1 corporate lexicon: 〜所存でございます, 逐次 (step-by-step/sequentially), 権限管理体制を敷く.",
            reaction: { speaker: "Managing Director", speakerJa: "専務", ja: "誠に心強いご説明です。では前向きに社内審議へと進めさせていただきます。", reading: "まことにこころづよいごせつめいです。ではまえむきにしゃないしんぎへとすすめさせていただきます。", romaji: "Makoto ni kokorodzuyoi gosetsumei desu. Dewa maemuki ni shanai shingi e to susumesasete itadakimasu.", en: "That is truly reassuring. We shall proceed favorably to internal committee review." }
          }
        ]
      }
    ]
  },
  {
    id: "n1-press-conference",
    title: "Press Conference Q&A",
    titleJa: "記者会見での鋭い質疑応答",
    level: "N1",
    category: "Workplace",
    description: "Address incisive questions from journalists regarding financial results and corporate restructuring.",
    keyPhrases: [
      { id: "phrase-press-1", front: "透明性をもって速やかに開示いたします", reading: "とうめいせいをもってすみやかにかいじいたします", romaji: "toumeisei o motte sumiyaka ni kaiji itashimasu", answer: "We will disclose information promptly with full transparency.", notes: "Corporate governance standard response." },
      { id: "phrase-press-2", front: "市場の動向を注視しつつ、適切に対処してまいります", reading: "しじょうのどうこうをちゅうししつつ、てきせつにたいしょしてまいります", romaji: "shijou no doukou o chuushi shi-tsutsu, tekisetsu ni taisho shite mairimasu", answer: "While closely monitoring market trends, we will respond appropriately.", notes: "Prudent executive commentary." }
    ],
    lines: [
      {
        id: "pc1",
        speaker: "other",
        speakerName: "Journalist",
        speakerNameJa: "記者",
        ja: "今期の営業利益の下振れについて、為替の影響のみならず事業戦略の遅れが指摘されていますが、代表としての見解をお聞かせください。",
        reading: "こんきのえいぎょうりえきのしたぶれについて、かわせのえいきょうのみならずじぎょうせんりゃくのおくれがしてきされていますが、だいひょうとしてのかんかいをおきかせください。",
        romaji: "Konki no eigyou rieki no shitabure ni tsuite, kawase no eikyou nomi narazu jigyou senryaku no okure ga shiteki sareteimasu ga, daihyou to shite no kenkai o okikase kudasai.",
        en: "Regarding the downward revision in operating profit this term, delays in business strategy have been pointed out in addition to currency effects. What is your perspective as CEO?",
        politeness: "keigo"
      },
      {
        id: "pc2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "厳しいご指摘を真摯に受け止めております。不採算事業の抜本的な構造改革に着手し、次期における収益性の改善に全力を期す覚悟です。",
        reading: "きびしいごしてきをしんしにうけとめております。ふさいさんじぎょうのばっぽんてきなこうぞうかいかくにちゃくしゅし、じきにおけるしゅうえきせいのかいぜんにぜんりょくをきすかくごです。",
        romaji: "Kibishii goshiteki o shinshi ni uketomete orimasu. Fusaisan jigyou no bapponteki na kouzou kaikaku ni chakushu shi, jiki ni okeru shuuekisei no kaizen ni zenryoku o kisu kakugo desu.",
        en: "We accept these rigorous critiques with utmost sincerity. We have initiated fundamental structural reforms on unprofitable operations and are determined to devote our all to restoring profitability next term.",
        politeness: "keigo",
        options: [
          {
            id: "opt-pc2-1",
            ja: "厳しいご指摘を真摯に受け止めております。不採算事業の抜本的な構造改革に着手し、次期における収益性の改善に全力を期す覚悟です。",
            reading: "きびしいごしてきをしんしにうけとめております。ふさいさんじぎょうのばっぽんてきなこうぞうかいかくにちゃくしゅし、じきにおけるしゅうえきせいのかいぜんにぜんりょくをきすかくごです。",
            romaji: "Kibishii goshiteki o shinshi ni uketomete orimasu. Fusaisan jigyou no bapponteki na kouzou kaikaku ni chakushu shi, jiki ni okeru shuuekisei no kaizen ni zenryoku o kisu kakugo desu.",
            en: "We sincerely accept critiques; launching fundamental reforms to restore next-term profits.",
            politeness: "keigo",
            isCorrect: true,
            explanation: "Sophisticated executive accountability vocabulary: 真摯に受け止める, 抜本的な構造改革 (fundamental restructuring), 全力を期す覚悟 (firm resolve).",
            reaction: { speaker: "Journalist", speakerJa: "記者", ja: "具体的なタイムラインについては改めて開示を期待します。", reading: "ぐたいてきなたいむらいんについてはあらためてかいじをきたいします。", romaji: "Gutaiteki na taimurain ni tsuite wa aratamete kaiji o kitai shimasu.", en: "We look forward to subsequent disclosure regarding concrete timelines." }
          }
        ]
      }
    ]
  },
  {
    id: "n1-academic-symposium",
    title: "Academic Symposium on AI and Ethics",
    titleJa: "学術シンポジウム：AIと倫理の対話",
    level: "N1",
    category: "Social",
    description: "Participate in an intellectual debate regarding the philosophical implications of artificial consciousness and human autonomy.",
    keyPhrases: [
      { id: "phrase-ai-1", front: "技術の進展と倫理的規範の調和を図る", reading: "ぎじゅつのしんてんとりんりてききはんのちょうわをはかる", romaji: "gijutsu no shinten to rinriteki kihan no chouwa o hakaru", answer: "Seek harmony between technological progress and ethical norms.", notes: "Philosophical scholarly debate." },
      { id: "phrase-ai-2", front: "人間の主体性を損なう懸念を払拭できない", reading: "にんげんのしゅたいせいをそこなうけねんをふっしょくできない", romaji: "ningen no shutaisei o sokonau kenen o fusshoku dekinai", answer: "Cannot dispel concerns of impairing human agency.", notes: "Advanced abstract formulation." }
    ],
    lines: [
      {
        id: "as1",
        speaker: "other",
        speakerName: "Professor",
        speakerNameJa: "教授",
        ja: "自律的意思決定アルゴリズムの台頭は、近代的人間像における自由意志の概念にいかなる揺さぶりをかけるとお考えですか？",
        reading: "じりつてきいしけっていあるごりずむのたいとうは、きんだいてきにんげんぞうにおけるじゆういしのがいねんにいかなるゆさぶりをかけるとおかんがえですか？",
        romaji: "Jiritsuteki ishi kettei arugorizumu no taitou wa, kindaiteki ningen-zou ni okeru jiyuu ishi no gainen ni ikanaru yusaburi o kakeru to okangae desu ka?",
        en: "What manner of upheaval do you believe the rise of autonomous decision-making algorithms exerts upon the concept of free will in the modern conception of humanity?",
        politeness: "keigo"
      },
      {
        id: "as2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "道具としての利便性を享受する一方で、自己決定の根幹が暗黙裡に外部委託される危機感を孕んでいると認識しております。",
        reading: "どうぐとしてのりべんせいをきょうじゅするいっぽうで、じこけっていのかんかんがあんもくりにがいぶいたくされるききかんをはらんでいるとにんしきしております。",
        romaji: "Dougu to shite no ribensei o kyouju suru ippou de, jiko kettei no konkan ga anmokuri ni gaibu itaku sareru kikikan o harande iru to ninshiki shite orimasu.",
        en: "While enjoying utility as tools, I recognize that it harbors the alarming hazard that the very foundation of self-determination is tacitly outsourced to the exterior.",
        politeness: "keigo",
        options: [
          {
            id: "opt-as2-1",
            ja: "道具としての利便性を享受する一方で、自己決定の根幹が暗黙裡に外部委託される危機感を孕んでいると認識しております。",
            reading: "どうぐとしてのりべんせいをきょうじゅするいっぽうで、じこけっていのかんかんがあんもくりにがいぶいたくされるききかんをはらんでいるとにんしきしております。",
            romaji: "Dougu to shite no ribensei o kyouju suru ippou de, jiko kettei no konkan ga anmokuri ni gaibu itaku sareru kikikan o harande iru to ninshiki shite orimasu.",
            en: "While enjoying utility, it bears the risk that self-determination is tacitly outsourced.",
            politeness: "keigo",
            isCorrect: true,
            explanation: "Elite N1 academic prose: 享受する (enjoy benefits), 根幹 (core foundation), 暗黙裡に (tacitly/silently), 危機感を孕む (harbor crisis).",
            reaction: { speaker: "Professor", speakerJa: "教授", ja: "極めて示唆に富むご指摘です。まさに人間性の再定義が問われていますね。", reading: "きわめてしさにとむごしてきです。まさににんげんせいのさいていぎがとわれていますね。", romaji: "Kiwamete shisa ni tomu goshiteki desu. Masa ni ningensei no saiteigi ga towareteimasu ne.", en: "An exceedingly thought-provoking point. The very redefinition of humanity is being questioned." }
          }
        ]
      }
    ]
  },
  {
    id: "n1-outage-apology",
    title: "Executive Apology for System Outage",
    titleJa: "基幹システム障害の緊急謝罪会見",
    level: "N1",
    category: "Workplace",
    description: "Issue a formal corporate apology and disclose technical remedial measures following a nationwide cloud infrastructure failure.",
    keyPhrases: [
      { id: "phrase-out-1", front: "多大なるご迷惑とご不便をおかけしましたことを痛惜の念をもって陳謝いたします", reading: "ただいなるごめいわくとごふべんをおかけしましたことをつうせきのねんをもってちんしゃいたします", romaji: "tadai naru gomeiwaku to gofuben o okake shimashita koto o tsuuseki no nen o motte chinsha itashimasu", answer: "We express profound apology with deep remorse for the immense trouble caused.", notes: "Apex level formal apology (痛惜の念をもって陳謝)." },
      { id: "phrase-out-2", front: "二度とこのような事態を招かぬよう、信頼回復に努めます", reading: "にどとこのようなじたいをまねかぬよう、しんらいかいふくにつとめます", romaji: "nidoto kono you na jitai o manekanu you, shinrai kaifuku ni tsutomemasu", answer: "We will strive to restore trust so as never to invite such an incident again.", notes: "Solemn institutional commitment." }
    ],
    lines: [
      {
        id: "oa0",
        speaker: "other",
        speakerName: "Moderator",
        speakerNameJa: "司会",
        ja: "定刻となりましたので、本日未明に発生いたしましたシステム障害に関する緊急記者会見を開始いたします。",
        reading: "ていこくとなりましたので、ほんじつみめいにはっせいいたしましたしすてむしょうがいにかんするきんきゅうきしゃかいけんをかいしいたします。",
        romaji: "Teikoku to narimashita no de, honjitsu mimei ni hassei itashimashita shisutemu shougai ni kansuru kinkyuu kisha kaiken o kaishi itashimasu.",
        en: "As the scheduled time has arrived, we will now commence the emergency press conference regarding the system outage that occurred early this morning.",
        politeness: "keigo"
      },
      {
        id: "oa1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "この度の基幹システム障害により、皆様に多大なるご迷惑とご心痛をおかけいたしましたことを、痛惜の念をもって深く陳謝申し上げます。",
        reading: "このたびのきかんしすてむしょうがいにより、みなさまにただいなるごめいわくとごしんつうをおかけいたしましたことを、つうせきのねんをもってふかくちんしゃもうしあげます。",
        romaji: "Konotabi no kikan shisutemu shougai ni yori, minasama ni tadai naru gomeiwaku to goshintsuu o okake itashimashita koto o, tsuuseki no nen o motte fukaku chinsha moushiagemasu.",
        en: "We offer our deepest apologies with profound grief and remorse for causing everyone enormous trouble and heartache due to this core infrastructure outage.",
        politeness: "keigo",
        options: [
          {
            id: "opt-oa1-1",
            ja: "この度の基幹システム障害により、皆様に多大なるご迷惑とご心痛をおかけいたしましたことを、痛惜の念をもって深く陳謝申し上げます。",
            reading: "このたびのきかんしすてむしょうがいにより、みなさまにただいなるごめいわくとごしんつうをおかけいたしましたことを、つうせきのねんをもってふかくちんしゃもうしあげます。",
            romaji: "Konotabi no kikan shisutemu shougai ni yori, minasama ni tadai naru gomeiwaku to goshintsuu o okake itashimashita koto o, tsuuseki no nen o motte fukaku chinsha moushiagemasu.",
            en: "Profound apologies with deep grief for the immense trouble caused by the system outage.",
            politeness: "keigo",
            isCorrect: true,
            explanation: "Gold standard N1 formal executive apology: 多大なるご心痛, 痛惜の念 (sorrowful grief), 陳謝申し上げます (beg forgiveness).",
            reaction: { speaker: "Media", speakerJa: "報道陣", ja: "（厳粛な沈黙ののち、役員一同の深々としたお辞儀）", reading: "（げんしゅくなちんもくののち、やくいんいちどうのふかぶかとしたおじぎ）", romaji: "(Genshuku na chinmoku no nochi, yakuin ichidou no fukabuka to shita ojigi)", en: "(Solemn silence followed by a deep, synchronized bow from the executive board)" }
          }
        ]
      }
    ]
  },
  {
    id: "n1-cultural-discourse",
    title: "Discourse on Japanese Aesthetic Philosophy",
    titleJa: "「侘び寂び」と無常観の美学対談",
    level: "N1",
    category: "Social",
    description: "Discuss the classical concepts of 'wabi-sabi' and 'mono no aware' and their relevance to contemporary human transience.",
    keyPhrases: [
      { id: "phrase-wabi-1", front: "不完全さや移ろいにこそ宿る美意識", reading: "ふかんぜんさやうつろいにこそやどるびいしき", romaji: "fukanzen-sa ya utsuroi ni koso yadoru biishiki", answer: "An aesthetic consciousness residing precisely within imperfection and transience.", notes: "Classical Japanese aesthetics." },
      { id: "phrase-wabi-2", front: "万物流転の無常観を肯定的に昇華させる", reading: "ばんぶつるてんのむじょうかんをこうていてきにしょうかさせる", romaji: "banbutsu ruten no mujoukan o kouteiteki ni shouka saseru", answer: "Positively sublimating the impermanent view that all creation is in flux.", notes: "Philosophical contemplation." }
    ],
    lines: [
      {
        id: "cdsc1",
        speaker: "other",
        speakerName: "Scholar",
        speakerNameJa: "文芸評論家",
        ja: "近代西洋の対称美や永続性の希求に対し、日本の伝統的美意識が「朽ちゆくもの」に美を見出した背景には、何があるとお考えですか？",
        reading: "きんだいせいようのたいしょうびやえいぞくせいのききゅうにたいし、にほんのでんとうてきびいしきが「くちゆくもの」にびをみいだしたはいけいには、なにがあるとおかんがえですか？",
        romaji: "Kindai seiyou no taishoubi ya eizokusei no kikyuu ni taishi, Nihon no dentouteki biishiki ga 'kuchiyuku mono' ni bi o miidashita haikei ni wa, nani ga aru to okangae desu ka?",
        en: "In contrast to modern Western symmetry and yearning for permanence, what lies behind traditional Japanese aesthetics finding beauty in things that decay?",
        politeness: "keigo"
      },
      {
        id: "cdsc2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "四季の移ろいや天災と対峙する中で培われた「諸行無常」の観念が、有限な瞬間に現れる生の尊さを照らし出しているからではないでしょうか。",
        reading: "しきのうつろいやてんさいとたいじするなかでつちかわれた「しょぎょうむじょう」のかんねんが、ゆうげんなしゅんかんにあらわれるせいのとうとさをてらしだしているからではないでしょうか。",
        romaji: "Shiki no utsuroi ya tensai to taiji suru naka de tsuchikawareta 'shogyou mujou' no kannen ga, yuugen na shunkan ni arawareru sei no toutosa o terashidashite iru kara dewa nai deshou ka.",
        en: "Perhaps it is because the notion of universal impermanence—cultivated while confronting seasonal shifts and natural perils—illuminates the sacredness of life manifest in finite moments.",
        politeness: "keigo",
        options: [
          {
            id: "opt-cdsc2-1",
            ja: "四季の移ろいや天災と対峙する中で培われた「諸行無常」の観念が、有限な瞬間に現れる生の尊さを照らし出しているからではないでしょうか。",
            reading: "しきのうつろいやてんさいとたいじするなかでつちかわれた「しょぎょうむじょう」のかんねんが、ゆうげんなしゅんかんにあらわれるせいのとうとさをてらしだしているからではないでしょうか。",
            romaji: "Shiki no utsuroi ya tensai to taiji suru naka de tsuchikawareta 'shogyou mujou' no kannen ga, yuugen na shunkan ni arawareru sei no toutosa o terashidashite iru kara dewa nai deshou ka.",
            en: "The concept of impermanence forged amid nature illuminates life's sacredness in finite moments.",
            politeness: "keigo",
            isCorrect: true,
            explanation: "Poetic N1 philosophical discourse: 諸行無常 (shogyou mujou = universal impermanence), 有限な瞬間 (finite moments), 生の尊さ (sanctity of life).",
            reaction: { speaker: "Scholar", speakerJa: "文芸評論家", ja: "卓見ですね。まさに寂びの本質を見事に言い当てておられます。", reading: "たっけんですね。まさにさびのほんしつをみごとにいいあてておられます。", romaji: "Takken desu ne. Masa ni sabi no honshitsu o migoto ni iiatete oraremasu.", en: "A profound discernment. You have struck right at the essence of 'sabi'." }
          }
        ]
      }
    ]
  },
  {
    id: "n1-board-meeting",
    title: "Board of Directors Presentation on M&A Strategy",
    titleJa: "取締役会での企業買収（M&A）戦略答弁",
    level: "N1",
    category: "Workplace",
    description: "Present the strategic rationale for a cross-border acquisition to the board of directors and answer questions on valuation.",
    keyPhrases: [
      { id: "phrase-board-1", front: "企業価値の最大化と市場占有率の拡大を企図しております", reading: "きぎょうかちのさいだいかとしじょうせんゆうりつのかくだいをきとしております", romaji: "kigyou kachi no saidaika to shijou sen'yuuritsu no kakudai o kito shite orimasu", answer: "We aim for corporate value maximization and market share expansion.", notes: "High finance corporate strategic intent." },
      { id: "phrase-board-2", front: "デューデリジェンスの精査を経て、買収価格の妥当性を検証いたしました", reading: "でゅーでりじぇんすのせいさをへて、ばいしゅうかかくのだとうせいをけんしょういたしました", romaji: "dyuuderijensu no seisa o hete, baishuu kakaku no datousei o kenshou itashimashita", answer: "Through careful due diligence scrutiny, we validated the acquisition valuation.", notes: "M&A governance vocabulary." }
    ],
    lines: [
      {
        id: "bm1",
        speaker: "other",
        speakerName: "External Director",
        speakerNameJa: "社外取締役",
        ja: "買収対価におけるのれん代の償却リスクと、PMI（買収後統合）の実行確度について、取締役会としての担保を問いたい。",
        reading: "ばいしゅうたいかにおけるのれんだいのしょうきゃくりすくと、ぴーえむあい（ばいしゅうごとうごう）のじっこうかくどについて、とりしまりやくかいとしてのたんぽをといたい。",
        romaji: "Baishuu taika ni okeru norendai no shoukyaku risuku to, Pii-Emu-Ai (baishuugo tougou) no jikkou kakudo ni tsuite, torishimariyakukai to shite no tanpo o toitai.",
        en: "I wish to question the safeguards of the board regarding goodwill amortization impairment risk in the purchase price, and the execution certainty of post-merger integration (PMI).",
        politeness: "keigo"
      },
      {
        id: "bm2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "のれんの減損リスクに関しましては保守的な割引率を用いた感度分析を実施済みであり、PMI専任タスクフォースを即時稼働させ、シナジー創出を盤石なものとする所存です。",
        reading: "のれんのげんそんりすくにかんしましてはほしゅてきなわりびきりつをもちいたかんどぶんせきをじっしずみであり、ぴーえむあいせんにんたすくふぉーすをそくじかどうさせ、しなじーそうしゅつをばんじゃくなものとするしょぞんです。",
        romaji: "Noren no genson risuku ni kanshimashite wa hoshuteki na waribikiritsu o mochiita kando bunseki o jisshizumi de ari, Pii-Emu-Ai sennin tasukufoosu o sokuji kadou sase, shinajii soushutsu o banjaku na mono to suru shozon desu.",
        en: "Regarding goodwill impairment risk, sensitivity analysis applying conservative discount rates has already been executed; by immediately mobilizing a dedicated PMI taskforce, we intend to make synergy creation rock-solid.",
        politeness: "keigo",
        options: [
          {
            id: "opt-bm2-1",
            ja: "のれんの減損リスクに関しましては保守的な割引率を用いた感度分析を実施済みであり、PMI専任タスクフォースを即時稼働させ、シナジー創出を盤石なものとする所存です。",
            reading: "のれんのげんそんりすくにかんしましてはほしゅてきなわりびきりつをもちいたかんどぶんせきをじっしずみであり、ぴーえむあいせんにんたすくふぉーすをそくじかどうさせ、しなじーそうしゅつをばんじゃくなものとするしょぞんです。",
            romaji: "Noren no genson risuku ni kanshimashite wa hoshuteki na waribikiritsu o mochiita kando bunseki o jisshizumi de ari, Pii-Emu-Ai sennin tasukufoosu o sokuji kadou sase, shinajii soushutsu o banjaku na mono to suru shozon desu.",
            en: "Impairment sensitivity analysis is complete; dedicated PMI taskforce guarantees synergies.",
            politeness: "keigo",
            isCorrect: true,
            explanation: "Inarguable N1 corporate governance eloquence: 減損リスク (impairment risk), 感度分析 (sensitivity analysis), 盤石なものとする (make rock-solid).",
            reaction: { speaker: "External Director", speakerJa: "社外取締役", ja: "極めて周到な計画と評価します。議案の採決に賛成いたします。", reading: "きわめてしゅうとうなけいかくとひょうかします。ぎあんのさいけつにさんせいいいたします。", romaji: "Kiwamete shuutou na keikaku to hyouka shimasu. Gian no saiketsu ni sansei itashimasu.", en: "I evaluate this as an exceedingly meticulous plan. I vote in favor of adopting the measure." }
          }
        ]
      }
    ]
  }
];
