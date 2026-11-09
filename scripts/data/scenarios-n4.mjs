// N4 Scenarios (10 scenarios)
export const SCENARIOS_N4 = [
  {
    id: "n4-clinic",
    title: "Visiting a Clinic",
    titleJa: "病院での問診",
    level: "N4",
    category: "Health",
    description: "You have caught a cold. Describe your symptoms (fever, sore throat, headache) to the doctor and ask about medication.",
    keyPhrases: [
      { id: "phrase-clinic-1", front: "熱があって、頭が痛いです", reading: "ねつがあって、あたまがいたいです", romaji: "netsu ga atte, atama ga itai desu", answer: "I have a fever and my head hurts.", notes: "Describing multiple symptoms using 〜て form." },
      { id: "phrase-clinic-2", front: "一昨日から喉が痛みます", reading: "おとといからのどがいたみます", romaji: "ototoi kara nodo ga itamimasu", answer: "My throat has hurt since the day before yesterday.", notes: "Specifying when symptoms started." },
      { id: "phrase-clinic-3", front: "食後に飲んでください", reading: "しょくごにのんでください", romaji: "shokugo ni nonde kudasai", answer: "Please take it after meals.", notes: "Crucial medical instruction." }
    ],
    lines: [
      {
        id: "cl1",
        speaker: "other",
        speakerName: "Doctor",
        speakerNameJa: "医師",
        ja: "今日はどうされましたか？どこか具合が悪いですか？",
        reading: "きょうはどうされましたか？どこかぐあいがわるいですか？",
        romaji: "Kyou wa dou saremashita ka? Doko ka guai ga warui desu ka?",
        en: "What brings you in today? Where are you not feeling well?",
        politeness: "keigo"
      },
      {
        id: "cl2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "昨日から熱があって、喉がとても痛いんです。",
        reading: "きのうからねつがあって、のどがとてもいたいんです。",
        romaji: "Kinou kara netsu ga atte, nodo ga totemo itai n desu.",
        en: "Since yesterday I have a fever, and my throat really hurts.",
        politeness: "polite",
        options: [
          {
            id: "opt-cl2-1",
            ja: "昨日から熱があって、喉がとても痛いんです。",
            reading: "きのうからねつがあって、のどがとてもいたいんです。",
            romaji: "Kinou kara netsu ga atte, nodo ga totemo itai n desu.",
            en: "Since yesterday I have a fever, and my throat really hurts.",
            politeness: "polite",
            isCorrect: true,
            explanation: "Using 〜んです explains background circumstances naturally when talking to a doctor.",
            reaction: { speaker: "Doctor", speakerJa: "医師", ja: "そうですか。咳や鼻水は出ますか？アレルギーはありますか？", reading: "そうですか。せきやはなみずはでますか？あれるぎーはありますか？", romaji: "Sou desu ka. Seki ya hanamizu wa demasu ka? Arerugii wa arimasu ka?", en: "I see. Do you have a cough or runny nose? Any allergies?" }
          },
          {
            id: "opt-cl2-2",
            ja: "病気だ！助けて！",
            reading: "びょうきだ！たすけて！",
            romaji: "Byouki da! Tasukete!",
            en: "I'm sick! Help me!",
            politeness: "casual",
            isCorrect: false,
            explanation: "Overdramatic and plain-form. The doctor needs specific symptoms like 熱 (fever) or 喉 (throat)."
          }
        ]
      },
      {
        id: "cl3",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "少し咳が出ます。薬のアレルギーはありません。",
        reading: "すこしせきがでます。くすりのあれるぎーはありません。",
        romaji: "Sukoshi seki ga demasu. Kusuri no arerugii wa arimasen.",
        en: "I have a mild cough. I have no drug allergies.",
        politeness: "polite",
        options: [
          {
            id: "opt-cl3-1",
            ja: "少し咳が出ます。薬のアレルギーはありません。",
            reading: "すこしせきがでます。くすりのあれるぎーはありません。",
            romaji: "Sukoshi seki ga demasu. Kusuri no arerugii wa arimasen.",
            en: "I have a slight cough. I don't have allergies to medicine.",
            politeness: "polite",
            isCorrect: true,
            explanation: "Answers both medical questions accurately and clearly.",
            reaction: { speaker: "Doctor", speakerJa: "医師", ja: "分かりました。風邪の薬を3日分出しておきますね。1日3回、食後に飲んでください。", reading: "わかりました。かぜのくすりをみっかぶんだしておきますね。いちにちさんかい、しょくごにのんでください。", romaji: "Wakarimashita. Kaze no kusuri o mikkabun dashite okimasu ne. Ichinichi sankai, shokugo ni nonde kudasai.", en: "Understood. I will prescribe 3 days of cold medication. Please take it 3 times a day after meals." }
          }
        ]
      }
    ]
  },
  {
    id: "n4-return",
    title: "Exchanging an Item at a Store",
    titleJa: "商品の交換・返品",
    level: "N4",
    category: "Shopping",
    description: "You bought a sweater yesterday, but the size doesn't fit. Request an exchange with your receipt.",
    keyPhrases: [
      { id: "phrase-return-1", front: "サイズを交換していただけますか？", reading: "さいずをこうかんしていただけますか？", romaji: "saizu o koukan shite itadakemasu ka?", answer: "Could you exchange the size for me?", notes: "Polite request for exchange." },
      { id: "phrase-return-2", front: "レシートをお持ちですか？", reading: "れしーとをおもちですか？", romaji: "reshiito o omochi desu ka?", answer: "Do you have your receipt?", notes: "Store policy check." }
    ],
    lines: [
      {
        id: "rt1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "すみません、昨日ここで買ったセーターのサイズを交換したいのですが。",
        reading: "すみません、きのうここでかったせーたーのさいずをこうかんしたいのですが。",
        romaji: "Sumimasen, kinou koko de katta seetaa no saizu o koukan shitai no desu ga.",
        en: "Excuse me, I bought this sweater here yesterday and I would like to exchange the size.",
        politeness: "polite",
        options: [
          {
            id: "opt-rt1-1",
            ja: "すみません、昨日ここで買ったセーターのサイズを交換したいのですが。",
            reading: "すみません、きのうここでかったせーたーのさいずをこうかんしたいのですが。",
            romaji: "Sumimasen, kinou koko de katta seetaa no saizu o koukan shitai no desu ga.",
            en: "Excuse me, I would like to exchange the size of the sweater I bought here yesterday.",
            politeness: "polite",
            isCorrect: true,
            explanation: "Ending with 〜のですが softens the request naturally when explaining your situation.",
            reaction: { speaker: "Clerk", speakerJa: "店員", ja: "かしこまりました。レシートとタグはお持ちでしょうか？", reading: "かしこまりました。れしーととたぐはおもちでしょうか？", romaji: "Kashikomarimashita. Reshiito to tagu wa omochi deshou ka?", en: "Certainly. Do you have the receipt and tag with you?" }
          }
        ]
      },
      {
        id: "rt2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "はい、こちらです。MサイズからLサイズに変えられますか？",
        reading: "はい、こちらです。えむさいずからえるさいずにかえられますか？",
        romaji: "Hai, kochira desu. Emu saizu kara eru saizu ni kaeraremasu ka?",
        en: "Yes, here they are. Can I change from size M to size L?",
        politeness: "polite",
        options: [
          {
            id: "opt-rt2-1",
            ja: "はい、こちらです。MサイズからLサイズに変えられますか？",
            reading: "はい、こちらです。えむさいずからえるさいずにかえられますか？",
            romaji: "Hai, kochira desu. Emu saizu kara eru saizu ni kaeraremasu ka?",
            en: "Yes, here they are. Can I change from size M to size L?",
            politeness: "polite",
            isCorrect: true,
            explanation: "Uses potential verb 変えられる (kaerareru) to ask if an exchange is possible.",
            reaction: { speaker: "Clerk", speakerJa: "店員", ja: "確認いたしますね。はい、Lサイズの在庫がございますので、交換いたします！", reading: "かくにんいたしますね。はい、えるさいずのざいこがございますので、こうかんいたします！", romaji: "Kakunin itashimasu ne. Hai, eru saizu no zaiko ga gozaimasu no de, koukan itashimasu!", en: "Let me check. Yes, we have size L in stock, so I will exchange it for you!" }
          }
        ]
      }
    ]
  },
  {
    id: "n4-neighbor",
    title: "Asking a Neighbor About Trash Sorting",
    titleJa: "近所の人にごみ出しのルールを聞く",
    level: "N4",
    category: "Daily Life",
    description: "You recently moved into an apartment in Japan. Ask your neighbor which day burnable trash is collected.",
    keyPhrases: [
      { id: "phrase-trash-1", front: "燃えるごみの日はいつですか？", reading: "もえるごみのひはいつですか？", romaji: "moeru gomi no hi wa itsu desu ka?", answer: "When is the burnable trash day?", notes: "Essential neighborhood vocabulary." },
      { id: "phrase-trash-2", front: "火曜日と金曜日の朝です", reading: "かようびときんようびのあさです", romaji: "kayoubi to kinyoubi no asa desu", answer: "It is Tuesday and Friday mornings.", notes: "Days of the week collection schedule." }
    ],
    lines: [
      {
        id: "nb1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "すみません、隣に引っ越してきた者ですが、ごみの捨て方を教えていただけますか？",
        reading: "すみません、となりにひっこしてきたものですが、ごみのすてかたをおしえていただけますか？",
        romaji: "Sumimasen, tonari ni hikkoshite kita mono desu ga, gomi no sutekata o oshiete itadakemasu ka?",
        en: "Excuse me, I just moved in next door. Could you teach me how trash disposal works here?",
        politeness: "polite",
        options: [
          {
            id: "opt-nb1-1",
            ja: "すみません、隣に引っ越してきた者ですが、ごみの捨て方を教えていただけますか？",
            reading: "すみません、となりにひっこしてきたものですが、ごみのすてかたをおしえていただけますか？",
            romaji: "Sumimasen, tonari ni hikkoshite kita mono desu ga, gomi no sutekata o oshiete itadakemasu ka?",
            en: "Excuse me, I just moved in next door. Could you teach me how to dispose of trash?",
            politeness: "polite",
            isCorrect: true,
            explanation: "Introduces yourself modestly (引っ越してきた者) and asks politely using 〜方 (way of doing).",
            reaction: { speaker: "Neighbor", speakerJa: "隣人", ja: "ああ、いらっしゃい！燃えるごみは火曜日と金曜日の朝8時までに出すんですよ。", reading: "ああ、いらっしゃい！もえるごみはかようびときんようびのあさはちじまでにだすんですよ。", romaji: "Aa, irasshai! Moeru gomi wa kayoubi to kinyoubi no asa hachiji made ni dasu n desu yo.", en: "Ah, welcome! Burnable trash goes out by 8:00 AM on Tuesdays and Fridays." }
          }
        ]
      },
      {
        id: "nb2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "火曜日と金曜日ですね。ペットボトルはどうすればいいですか？",
        reading: "かようびときんようびですね。ぺっとぼとるはどうすればいいですか？",
        romaji: "Kayoubi to kinyoubi desu ne. Pettobotoru wa dou sureba ii desu ka?",
        en: "Tuesday and Friday, got it. What should I do with plastic bottles?",
        politeness: "polite",
        options: [
          {
            id: "opt-nb2-1",
            ja: "火曜日と金曜日ですね。ペットボトルはどうすればいいですか？",
            reading: "かようびときんようびですね。ぺっとぼとるはどうすればいいですか？",
            romaji: "Kayoubi to kinyoubi desu ne. Pettobotoru wa dou sureba ii desu ka?",
            en: "Tuesday and Friday, got it. What should I do with plastic PET bottles?",
            politeness: "polite",
            isCorrect: true,
            explanation: "〜どうすればいいですか is the ideal N4 pattern for asking what action should be taken.",
            reaction: { speaker: "Neighbor", speakerJa: "隣人", ja: "ラベルとキャップを外して、水曜日に洗って出してくださいね。", reading: "らべるときゃっぷをはずして、すいようびにあらってだしてくださいね。", romaji: "Raberu to kyappu o hazushite, suiyoubi ni aratte dashite kudasai ne.", en: "Remove the label and cap, rinse them, and put them out on Wednesdays." }
          }
        ]
      }
    ]
  },
  {
    id: "n4-invite",
    title: "Inviting a Friend to Dinner",
    titleJa: "友達をご飯に誘う",
    level: "N4",
    category: "Social",
    description: "Invite a classmate or colleague to go get sushi together this Friday evening.",
    keyPhrases: [
      { id: "phrase-invite-1", front: "今週の金曜日、空いていますか？", reading: "こんしゅうのきんようび、あいていますか？", romaji: "konshuu no kinyoubi, aiteimasu ka?", answer: "Are you free this Friday?", notes: "Checking someone's schedule politely." },
      { id: "phrase-invite-2", front: "一緒にお寿司を食べに行きませんか？", reading: "いっしょにおすしをたべにいきませんか？", romaji: "issho ni osushi o tabe ni ikimasen ka?", answer: "Would you like to go eat sushi together?", notes: "〜に行きませんか invitation pattern." }
    ],
    lines: [
      {
        id: "iv1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "佐藤さん、今週の金曜日の夜は時間がありますか？",
        reading: "さとうさん、こんしゅうのきんようびのよるはじかんがありますか？",
        romaji: "Satou-san, konshuu no kinyoubi no yoru wa jikan ga arimasu ka?",
        en: "Sato-san, do you have time this Friday evening?",
        politeness: "polite",
        options: [
          {
            id: "opt-iv1-1",
            ja: "佐藤さん、今週の金曜日の夜は時間がありますか？",
            reading: "さとうさん、こんしゅうのきんようびのよるはじかんがありますか？",
            romaji: "Satou-san, konshuu no kinyoubi no yoru wa jikan ga arimasu ka?",
            en: "Sato-san, do you have time this Friday night?",
            politeness: "polite",
            isCorrect: true,
            explanation: "Checking schedule first before springing an invitation is considerate Japanese etiquette.",
            reaction: { speaker: "Sato", speakerJa: "佐藤", ja: "金曜日の夜ですか？ええ、特に予定はありませんよ。何かありますか？", reading: "きんようびのよるですか？ええ、とくによていはありませんよ。なにかありますか？", romaji: "Kinyoubi no yoru desu ka? Ee, toku ni yotei wa arimasen yo. Nanika arimasu ka?", en: "Friday night? Yes, I don't have any particular plans. What's up?" }
          }
        ]
      },
      {
        id: "iv2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "駅前に新しい回転寿司ができたので、一緒に行きませんか？",
        reading: "えきまえにあたらしいかいてんずしができたので、いっしょにいきませんか？",
        romaji: "Ekimae ni atarashii kaitenzushi ga dekita no de, issho ni ikimasen ka?",
        en: "A new conveyor belt sushi opened in front of the station, would you like to go together?",
        politeness: "polite",
        options: [
          {
            id: "opt-iv2-1",
            ja: "駅前に新しい回転寿司ができたので、一緒に行きませんか？",
            reading: "えきまえにあたらしいかいてんずしができたので、いっしょにいきませんか？",
            romaji: "Ekimae ni atarashii kaitenzushi ga dekita no de, issho ni ikimasen ka?",
            en: "Since a new conveyor sushi opened in front of the station, won't you go with me?",
            politeness: "polite",
            isCorrect: true,
            explanation: "Gives a compelling reason with 〜ので, followed by the classic invitation 〜ませんか.",
            reaction: { speaker: "Sato", speakerJa: "佐藤", ja: "いいですね！お寿司大好きです。ぜひ行きましょう！7時でどうですか？", reading: "いいですね！おすしだいすきです。ぜひいきましょう！しちじでどうですか？", romaji: "Ii desu ne! Osushi daisuki desu. Zehi ikimashou! Shichiji de dou desu ka?", en: "Sounds great! I love sushi. Let's definitely go! How about 7:00 PM?" }
          }
        ]
      }
    ]
  },
  {
    id: "n4-koban",
    title: "Reporting Lost Property at a Police Box",
    titleJa: "交番で落とし物の届出",
    level: "N4",
    category: "Services",
    description: "You forgot your wallet on the train or at a bench. File a lost item report at the neighborhood kōban.",
    keyPhrases: [
      { id: "phrase-koban-1", front: "財布を落としてしまいました", reading: "さいふをおとしてしまいました", romaji: "saifu o otoshite shimaimashita", answer: "I accidentally dropped/lost my wallet.", notes: "〜てしまう expressing regretful mishap." },
      { id: "phrase-koban-2", front: "中にクレジットカードが入っています", reading: "なかにつれじっとかーどがはいっています", romaji: "naka ni kurejitto kaado ga haitteimasu", answer: "Inside there is a credit card.", notes: "Describing state with 〜が入っています." }
    ],
    lines: [
      {
        id: "kb1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "すみません、財布を落としてしまったのですが、届いていませんか？",
        reading: "すみません、さいふをおとしてしまったのですが、とどいていませんか？",
        romaji: "Sumimasen, saifu o otoshite shimatta no desu ga, todoiteimasen ka?",
        en: "Excuse me, I lost my wallet, has it been turned in here?",
        politeness: "polite",
        options: [
          {
            id: "opt-kb1-1",
            ja: "すみません、財布を落としてしまったのですが、届いていませんか？",
            reading: "すみません、さいふをおとしてしまったのですが、とどいていませんか？",
            romaji: "Sumimasen, saifu o otoshite shimatta no desu ga, todoiteimasen ka?",
            en: "Excuse me, I've lost my wallet, has one been handed in?",
            politeness: "polite",
            isCorrect: true,
            explanation: "Natural N4 phrasing: 落としてしまった (regrettable accident) + 届いていませんか (has it reached you).",
            reaction: { speaker: "Police Officer", speakerJa: "警察官", ja: "財布ですね。いつ頃、どこでなくしましたか？どんな色や形ですか？", reading: "さいふですね。いつごろ、どこでなくしましたか？どんないろやかたちですか？", romaji: "Saifu desu ne. Itsu goro, doko de nakushimashita ka? Donna iro ya katachi desu ka?", en: "A wallet. Around when and where did you lose it? What color and shape is it?" }
          }
        ]
      },
      {
        id: "kb2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "1時間ほど前に駅のベンチでなくしました。黒い革の二つ折り財布です。",
        reading: "いちじかんほどまえにえきのべんちでなくしました。くろいかわのふたつおりさいふです。",
        romaji: "Ichijikan hodo mae ni eki no benchi de nakushimashita. Kuroi kawa no futatsuori saifu desu.",
        en: "About an hour ago at the station bench. It's a black leather bi-fold wallet.",
        politeness: "polite",
        options: [
          {
            id: "opt-kb2-1",
            ja: "1時間ほど前に駅のベンチでなくしました。黒い革の二つ折り財布です。",
            reading: "いちじかんほどまえにえきのべんちでなくしました。くろいかわのふたつおりさいふです。",
            romaji: "Ichijikan hodo mae ni eki no benchi de nakushimashita. Kuroi kawa no futatsuori saifu desu.",
            en: "About an hour ago at a station bench. It's a black leather bi-fold wallet.",
            politeness: "polite",
            isCorrect: true,
            explanation: "Gives time (〜ほど前に), location, color (黒い), material (革), and style (二つ折り).",
            reaction: { speaker: "Police Officer", speakerJa: "警察官", ja: "確認しますね…あ、先ほど駅員さんから届けられた財布と一致します！身分証明書を見せていただけますか？", reading: "かくにんしますね…あ、さきほどえきいんさんからとどけられたさいふといっちします！みぶんしょうめいしょをみせていただけますか？", romaji: "Kakunin shimasu ne... A, sakihodo ekiin-san kara todokerareta saifu to itchi shimasu! Mibun shoumeisho o misete itadakemasu ka?", en: "Let me check... Ah, it matches a wallet brought in by station staff just a moment ago! May I see your ID?" }
          }
        ]
      }
    ]
  },
  {
    id: "n4-clothing",
    title: "Trying on Clothes at a Boutique",
    titleJa: "服屋での試着とサイズ相談",
    level: "N4",
    category: "Shopping",
    description: "Try on a jacket in the fitting room and ask if they have another color or size.",
    keyPhrases: [
      { id: "phrase-cloth-1", front: "試着してもいいですか？", reading: "しちゃくしてもいいですか？", romaji: "shichaku shite mo ii desu ka?", answer: "May I try this on?", notes: "〜てもいいですか asking permission." },
      { id: "phrase-cloth-2", front: "別の色はありますか？", reading: "べつのいろはありますか？", romaji: "betsu no iro wa arimasu ka?", answer: "Do you have another color?", notes: "Asking for variations." }
    ],
    lines: [
      {
        id: "ct1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "すみません、このジャケットを試着してもいいですか？",
        reading: "すみません、このじゃけっとをしちゃくしてもいいですか？",
        romaji: "Sumimasen, kono jaketto o shichaku shite mo ii desu ka?",
        en: "Excuse me, may I try on this jacket?",
        politeness: "polite",
        options: [
          {
            id: "opt-ct1-1",
            ja: "すみません、このジャケットを試着してもいいですか？",
            reading: "すみません、このじゃけっとをしちゃくしてもいいですか？",
            romaji: "Sumimasen, kono jaketto o shichaku shite mo ii desu ka?",
            en: "Excuse me, may I try on this jacket?",
            politeness: "polite",
            isCorrect: true,
            explanation: "試着 (shichaku = trying on clothes) + 〜てもいいですか (may I).",
            reaction: { speaker: "Clerk", speakerJa: "店員", ja: "もちろんです！試着室はあちらになります。ご案内いたします。", reading: "もちろんです！しちゃくしつはあちらになります。ごあんないいたします。", romaji: "Mochiron desu! Shichakushitsu wa achira ni narimasu. Goannai itashimasu.", en: "Of course! The fitting rooms are over that way. Allow me to guide you." }
          }
        ]
      },
      {
        id: "ct2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "少し小さいようです。もう一つ大きいサイズはありますか？",
        reading: "すこしちいさいようです。もうひとつおおきいさいずはありますか？",
        romaji: "Sukoshi chiisai you desu. Mou hitotsu ookii saizu wa arimasu ka?",
        en: "It seems a bit small. Do you have one size larger?",
        politeness: "polite",
        options: [
          {
            id: "opt-ct2-1",
            ja: "少し小さいようです。もう一つ大きいサイズはありますか？",
            reading: "すこしちいさいようです。もうひとつおおきいさいずはありますか？",
            romaji: "Sukoshi chiisai you desu. Mou hitotsu ookii saizu wa arimasu ka?",
            en: "It appears a bit small. Do you have one size larger?",
            politeness: "polite",
            isCorrect: true,
            explanation: "〜ようです expresses modest observation; もう一つ大きい asks for one size larger.",
            reaction: { speaker: "Clerk", speakerJa: "店員", ja: "かしこまりました。ワンサイズ上のLサイズをお持ちいたしますね。", reading: "かしこまりました。わんさいずうえのえるさいずをおもちいたしますね。", romaji: "Kashikomarimashita. Wansaizu ue no eru saizu o omochi itashimasu ne.", en: "Certainly. I will bring you one size up (L)." }
          }
        ]
      }
    ]
  },
  {
    id: "n4-takeout-phone",
    title: "Ordering Takeout on the Phone",
    titleJa: "電話でのテイクアウト注文",
    level: "N4",
    category: "Dining",
    description: "Call a local pizza or bento shop, place your takeout order, and agree on a pickup time.",
    keyPhrases: [
      { id: "phrase-phone-1", front: "持ち帰りの予約をしたいのですが", reading: "もちかえりのよやくをしたいのですが", romaji: "mochikaeri no yoyaku o shitai no desu ga", answer: "I would like to place a takeout order...", notes: "Opening telephone request." },
      { id: "phrase-phone-2", front: "何時頃に取りに来られますか？", reading: "なんじごろにとりにこられますか？", romaji: "nanji goro ni tori ni koraremasu ka?", answer: "Around what time can you come pick it up?", notes: "Pickup coordination." }
    ],
    lines: [
      {
        id: "tp1",
        speaker: "other",
        speakerName: "Pizzeria Staff",
        speakerNameJa: "店員",
        ja: "お電話ありがとうございます！ピッツァ・ローマでございます。",
        reading: "おでんわありがとうございます！ぴっつぁ・ろーまでございます。",
        romaji: "Odenwa arigatou gozaimasu! Pittsa Rooma de gozaimasu.",
        en: "Thank you for calling! This is Pizza Roma.",
        politeness: "keigo"
      },
      {
        id: "tp2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "もしもし、テイクアウトの注文をお願いしたいのですが。",
        reading: "もしもし、ていくあうとのちゅうもんをおねがいしたいのですが。",
        romaji: "Moshimoshi, teikuauto no chuumon o onegai shitai no desu ga.",
        en: "Hello, I would like to place an order for takeout.",
        politeness: "polite",
        options: [
          {
            id: "opt-tp2-1",
            ja: "もしもし、テイクアウトの注文をお願いしたいのですが。",
            reading: "もしもし、ていくあうとのちゅうもんをおねがいしたいのですが。",
            romaji: "Moshimoshi, teikuauto no chuumon o onegai shitai no desu ga.",
            en: "Hello, I would like to make a takeout order.",
            politeness: "polite",
            isCorrect: true,
            explanation: "もしもし opens phone calls; 〜をお願いしたいのですが states the goal politely.",
            reaction: { speaker: "Pizzeria Staff", speakerJa: "店員", ja: "ご注文ありがとうございます！ご注文の品をお伺いいたします。", reading: "ごちゅうもんありがとうございます！ごちゅうもんのしなをおうかがいいたします。", romaji: "Gochuumon arigatou gozaimasu! Gochuumon no shina o oukagai itashimasu.", en: "Thank you! May I take your order items?" }
          }
        ]
      },
      {
        id: "tp3",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "マルゲリータピザを1枚お願いします。30分後に取りに行きます。",
        reading: "まるげりーたぴざをいちまいおねがいします。さんじっぷんごにとりにいきます。",
        romaji: "Marugeriita piza o ichimai onegaishimasu. Sanjippun go ni tori ni ikimasu.",
        en: "One Margherita pizza, please. I will come pick it up in 30 minutes.",
        politeness: "polite",
        options: [
          {
            id: "opt-tp3-1",
            ja: "マルゲリータピザを1枚お願いします。30分後に取りに行きます。",
            reading: "まるげりーたぴざをいちまいおねがいします。さんじっぷんごにとりにいきます。",
            romaji: "Marugeriita piza o ichimai onegaishimasu. Sanjippun go ni tori ni ikimasu.",
            en: "One Margherita pizza please. I'll pick it up in 30 minutes.",
            politeness: "polite",
            isCorrect: true,
            explanation: "取りに行く (go to pick up) + 〜分後 (in X minutes).",
            reaction: { speaker: "Pizzeria Staff", speakerJa: "店員", ja: "かしこまりました。30分後に焼き立てをご用意してお待ちしております！お名前とお電話番号をどうぞ。", reading: "かしこまりました。さんじっぷんごにやきたてをごよういしておまちしております！おなまえとおでんわばんごうをどうぞ。", romaji: "Kashikomarimashita. Sanjippun go ni yakitate o goyoui shite omachi shite orimasu! Onamae to odenwa bangou o douzo.", en: "Understood. We will have it freshly baked for you in 30 minutes! May I have your name and phone number?" }
          }
        ]
      }
    ]
  },
  {
    id: "n4-haircut",
    title: "Getting a Haircut at a Salon",
    titleJa: "美容室でのオーダー",
    level: "N4",
    category: "Services",
    description: "Explain how short you want your hair cut and whether you want your bangs trimmed.",
    keyPhrases: [
      { id: "phrase-hair-1", front: "全体的に少し短くしてください", reading: "ぜんたいてきにすこしみじかくしてください", romaji: "zentaiteki ni sukoshi mijikaku shite kudasai", answer: "Please make it a bit shorter all over.", notes: "Specifying overall haircut length." },
      { id: "phrase-hair-2", front: "前髪は眉毛くらいで", reading: "まえがみはまゆげくらいで", romaji: "maegami wa mayuge kurai de", answer: "Bangs around eyebrow level.", notes: "Reference points on face for styling." }
    ],
    lines: [
      {
        id: "hc1",
        speaker: "other",
        speakerName: "Stylist",
        speakerNameJa: "美容師",
        ja: "こんにちは！今日はどのような髪型になさいますか？",
        reading: "こんにちは！きょうはどのようなかみがたになさいますか？",
        romaji: "Konnichiwa! Kyou wa dono you na kamigata ni nasaimasu ka?",
        en: "Hello! What kind of hairstyle would you like today?",
        politeness: "keigo"
      },
      {
        id: "hc2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "全体的に3センチくらい切って、すいて軽くしてください。",
        reading: "ぜんたいてきにさんせんちくらいきって、すいてかるくしてください。",
        romaji: "Zentaiteki ni san-senchi kurai kitte, suite karuku shite kudasai.",
        en: "Cut about 3 centimeters all over, and thin it out to make it lighter.",
        politeness: "polite",
        options: [
          {
            id: "opt-hc2-1",
            ja: "全体的に3センチくらい切って、すいて軽くしてください。",
            reading: "ぜんたいてきにさんせんちくらいきって、すいてかるくしてください。",
            romaji: "Zentaiteki ni san-senchi kurai kitte, suite karuku shite kudasai.",
            en: "Cut about 3 cm all over, and thin it out to lighten it.",
            politeness: "polite",
            isCorrect: true,
            explanation: "すく (suku = to thin hair) and 軽くする (make lighter) are authentic Japanese salon requests.",
            reaction: { speaker: "Stylist", speakerJa: "美容師", ja: "分かりました！前髪の長さはどうしましょうか？", reading: "わかりました！まえがみのながさはどうしましょうか？", romaji: "Wakarimashita! Maegami no nagasa wa dou shimashou ka?", en: "Got it! How about the length of your bangs?" }
          }
        ]
      },
      {
        id: "hc3",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "前髪は目にかからないくらいでお願いします。",
        reading: "まえがみはめにかからないくらいでおねがいします。",
        romaji: "Maegami wa me ni kakaranai kurai de onegaishimasu.",
        en: "Just above the eyes so they don't cover my eyes, please.",
        politeness: "polite",
        options: [
          {
            id: "opt-hc3-1",
            ja: "前髪は目にかからないくらいでお願いします。",
            reading: "まえがみはめにかからないくらいでおねがいします。",
            romaji: "Maegami wa me ni kakaranai kurai de onegaishimasu.",
            en: "Not covering my eyes, please.",
            politeness: "polite",
            isCorrect: true,
            explanation: "Negative potential form かからない specifies boundary cleanly.",
            reaction: { speaker: "Stylist", speakerJa: "美容師", ja: "かしこまりました。ではシャンプー台へどうぞ！", reading: "かしこまりました。ではしゃんぷーだいへどうぞ！", romaji: "Kashikomarimashita. Dewa shanpuu-dai e douzo!", en: "Understood. Then right this way to the shampoo basin!" }
          }
        ]
      }
    ]
  },
  {
    id: "n4-apology-late",
    title: "Apologizing for Being Late",
    titleJa: "待ち合わせに遅刻する連絡",
    level: "N4",
    category: "Workplace",
    description: "The train was delayed due to an accident. Call or text your colleague to apologize and give your estimated arrival time.",
    keyPhrases: [
      { id: "phrase-late-1", front: "電車が遅れていて、遅れそうです", reading: "でんしゃがおくれていて、おくれそうです", romaji: "densha ga okurete ite, okuresou desu", answer: "The train is delayed, so I'm likely to be late.", notes: "〜そうです expressing likelihood." },
      { id: "phrase-late-2", front: "申し訳ありません", reading: "もうしわけありません", romaji: "moushiwake arimasen", answer: "I am deeply sorry / there is no excuse.", notes: "Formal apology." }
    ],
    lines: [
      {
        id: "al1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "もしもし山田さん、大変申し訳ありません。電車が事故で止まってしまいました。",
        reading: "もしもしやまださん、たいへんもうしわけありません。でんしゃがじこでとまってしまいました。",
        romaji: "Moshimoshi Yamada-san, taihen moushiwake arimasen. Densha ga jiko de tomatte shimaimashita.",
        en: "Hello Yamada-san, I am very sorry. The train has stopped due to an accident.",
        politeness: "polite",
        options: [
          {
            id: "opt-al1-1",
            ja: "もしもし山田さん、大変申し訳ありません。電車が事故で止まってしまいました。",
            reading: "もしもしやまださん、たいへんもうしわけありません。でんしゃがじこでとまってしまいました。",
            romaji: "Moshimoshi Yamada-san, taihen moushiwake arimasen. Densha ga jiko de tomatte shimaimashita.",
            en: "Hello Yamada-san, I'm very sorry. My train stopped due to an accident.",
            politeness: "polite",
            isCorrect: true,
            explanation: "States apology upfront (大変申し訳ありません) and explains the uncontrollable cause.",
            reaction: { speaker: "Yamada", speakerJa: "山田", ja: "そうなんですね、大丈夫ですよ！どれくらい遅れそうですか？", reading: "そうなんですね、だいじょうぶですよ！どれくらいおくれそうですか？", romaji: "Sou nan desu ne, daijoubu desu yo! Dore kurai okuresou desu ka?", en: "Is that so, don't worry! About how late do you think you will be?" }
          }
        ]
      },
      {
        id: "al2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "15分ほど遅れそうです。急いで向かいます。",
        reading: "じゅうごふんほどおくれそうです。いそいでむかいます。",
        romaji: "Juugofun hodo okuresou desu. Isoide mukaimasu.",
        en: "I look to be about 15 minutes late. I will head over as quickly as I can.",
        politeness: "polite",
        options: [
          {
            id: "opt-al2-1",
            ja: "15分ほど遅れそうです。急いで向かいます。",
            reading: "じゅうごふんほどおくれそうです。いそいでむかいます。",
            romaji: "Juugofun hodo okuresou desu. Isoide mukaimasu.",
            en: "I'll be about 15 minutes late. I will hurry over.",
            politeness: "polite",
            isCorrect: true,
            explanation: "〜そうです shows estimate; 急いで向かいます shows diligence and respect for the other person's time.",
            reaction: { speaker: "Yamada", speakerJa: "山田", ja: "焦らなくていいですからね。気をつけて来てください。", reading: "あせらなくていいですからね。きをつけてきてください。", romaji: "Aseranakute ii desu kara ne. Ki o tsukete kite kudasai.", en: "No need to rush. Please come safely." }
          }
        ]
      }
    ]
  },
  {
    id: "n4-repeat-slow",
    title: "Asking Someone to Speak Slower",
    titleJa: "ゆっくり話してもらうお願い",
    level: "N4",
    category: "Daily Life",
    description: "When Japanese is spoken too fast, ask politely to slow down and clarify a word.",
    keyPhrases: [
      { id: "phrase-slow-1", front: "もう少しゆっくり話していただけますか？", reading: "もうすこしゆっくりはなしていただけますか？", romaji: "mou sukoshi yukkuri hanashite itadakemasu ka?", answer: "Could you speak a little slower?", notes: "Essential learner survival request." },
      { id: "phrase-slow-2", front: "それはどういう意味ですか？", reading: "それはどういういみですか？", romaji: "sore wa dou iu imi desu ka?", answer: "What does that mean?", notes: "Asking for meaning/definition." }
    ],
    lines: [
      {
        id: "rs1",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "すみません、日本語を勉強中なので、もう少しゆっくり話していただけますか？",
        reading: "すみません、にほんごをべんきょうちゅうなので、もうすこしゆっくりはなしていただけますか？",
        romaji: "Sumimasen, nihongo o benkyouchuu na no de, mou sukoshi yukkuri hanashite itadakemasu ka?",
        en: "Excuse me, I am currently studying Japanese, so could you speak a little more slowly?",
        politeness: "polite",
        options: [
          {
            id: "opt-rs1-1",
            ja: "すみません、日本語を勉強中なので、もう少しゆっくり話していただけますか？",
            reading: "すみません、にほんごをべんきょうちゅうなので、もうすこしゆっくりはなしていただけますか？",
            romaji: "Sumimasen, nihongo o benkyouchuu na no de, mou sukoshi yukkuri hanashite itadakemasu ka?",
            en: "Excuse me, since I am learning Japanese, could you speak a bit slower?",
            politeness: "polite",
            isCorrect: true,
            explanation: "Explains you are studying (勉強中なので) so the speaker gladly adjusts their pacing.",
            reaction: { speaker: "Native Speaker", speakerJa: "日本人", ja: "あ、ごめんなさい！早口でしたね。これで分かりますか？", reading: "あ、ごめんなさい！はやくちでしたね。これでわかりますか？", romaji: "A, gomen nasai! Hayakuchi deshita ne. Kore de wakarimasu ka?", en: "Oh, I'm sorry! I was speaking fast. Is this pacing better?" }
          }
        ]
      },
      {
        id: "rs2",
        speaker: "learner",
        speakerName: "You",
        speakerNameJa: "あなた",
        ja: "はい、よく分かります。ありがとうございます！",
        reading: "はい、よくわかります。ありがとうございます！",
        romaji: "Hai, yoku wakarimasu. Arigatou gozaimasu!",
        en: "Yes, I understand well now. Thank you!",
        politeness: "polite",
        options: [
          {
            id: "opt-rs2-1",
            ja: "はい、よく分かります。ありがとうございます！",
            reading: "はい、よくわかります。ありがとうございます！",
            romaji: "Hai, yoku wakarimasu. Arigatou gozaimasu!",
            en: "Yes, I understand well. Thank you!",
            politeness: "polite",
            isCorrect: true,
            explanation: "Expresses cheerful appreciation.",
            reaction: { speaker: "Native Speaker", speakerJa: "日本人", ja: "分からない言葉があったら、いつでも何でも聞いてくださいね！", reading: "わからないことばがあったら、いつでもなんでもきいてくださいね！", romaji: "Wakaranai kotoba ga attara, itsudemo nandemo kiite kudasai ne!", en: "If there's any word you don't know, ask me anything anytime!" }
          }
        ]
      }
    ]
  }
];

