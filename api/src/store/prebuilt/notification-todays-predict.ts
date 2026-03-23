import BuiltinAnswer, { BuiltinAnswerKeys } from '../models/builtin-answer';

const prebuilt = [
  [
    {
      id: '334593389401997312',
      language: 'en',
      content:
        'Dear user, come and see your fortune and lottery! Luck is right in front of you, opportunities belong to those who are prepared. Take part in lottery now, you may win big prize!',
    },
    {
      id: '334593389401997313',
      language: 'zh',
      content: '亲爱的用户,快来看看您的运势和抽奖吧!运气就在眼前,机会属于有准备的人。现在抽奖,说不定就能中大奖呢!',
    },
    {
      id: '334593389401997314',
      language: 'zh-Hant',
      content: '親愛的用戶,快來看看您的運勢和抽獎吧!運氣就在眼前,機會屬於有準備的人。現在抽獎,說不定就能中大獎呢!',
    },
    {
      id: '334593389401997315',
      language: 'ja',
      content:
        '親愛なユーザー、運勢と抽選をチェックしてください!運が目の前にある、機会は準備のある人のもの。今すぐ抽選に参加して、大当たりするかもしれません!',
    },
  ],
  [
    {
      id: '334593389401997316',
      language: 'en',
      content:
        "It's time to check your fortune again! What is your luck index today? Don't forget to join the lottery, maybe a little surprise is waiting for you! Don't miss it!",
    },
    {
      id: '334593389401997317',
      language: 'zh',
      content: '又到了看运势的时候!今天的运气指数是多少呢?别忘了参加抽奖,说不定小惊喜就在等待您!别错过哦!',
    },
    {
      id: '334593389401997318',
      language: 'zh-Hant',
      content: '又到了看運勢的時候!今天的運氣指數是多少呢?別忘了參加抽獎,說不定小驚喜就在等待您!別錯過哦!',
    },
    {
      id: '334593389401997319',
      language: 'ja',
      content:
        'また運勢をチェックする時間です!今日の運の指数はいくつでしょうか?抽選に応募するのを忘れずに、小さなサプライズが待っているかもしれません!逃さないで!',
    },
  ],
  [
    {
      id: '334593389401997320',
      language: 'en',
      content:
        "Double luck of fortune and lottery is coming! Will today's fortune open your good luck? Come and see! Also don't forget to start the lottery, opportunities are right in front of you!",
    },
    {
      id: '334593389401997321',
      language: 'zh',
      content: '运势抽奖双重幸运日来袭!今天的运势会开启您的好运吗?赶紧来看看吧!同时别忘记启动抽奖,机会就在眼前!',
    },
    {
      id: '334593389401997322',
      language: 'zh-Hant',
      content: '運勢抽獎雙重幸運日來襲!今天的運勢會開啟您的好運嗎?趕緊來看看吧!同時別忘記啟動抽獎,機會就在眼前!',
    },
    {
      id: '334593389401997323',
      language: 'ja',
      content:
        '運勢と抽選のダブルラッキーDAYの到来!今日の運勢があなたの幸運を開くでしょうか?さあ見てください!同時に抽選の開始を忘れずに、チャンスが目の前にあります!',
    },
  ],
  [
    {
      id: '334593389401997324',
      language: 'en',
      content:
        "Dear, your fortune has been released! Come and check today's fortune to see if there will be any surprises in wealth, career and love! Don't forget the lottery, maybe the gift is yours!",
    },
    {
      id: '334593389401997325',
      language: 'zh',
      content:
        '亲爱的,您的运势已经出炉了!快来查看今日运势,看看财运、事业、爱情会有什么惊喜!别忘了抽奖哦,说不定小礼物就是您的!',
    },
    {
      id: '334593389401997326',
      language: 'zh-Hant',
      content:
        '親愛的,您的運勢已經出爐了!快來查看今日運勢,看看財運、事業、愛情會有什麼驚喜!別忘了抽獎哦,說不定小禮物就是您的!',
    },
    {
      id: '334593389401997327',
      language: 'ja',
      content:
        '大切なあなた、あなたの運勢が出ました!今日の運勢をチェックして、財運、仕事、愛情にサプライズがあるか確認してください!抽選を忘れないで、プレゼントはあなたのかもしれません!',
    },
  ],
  [
    {
      id: '334593389401997328',
      language: 'en',
      content:
        'Open the lottery, unlock the fortune, you will have good luck today! Will the fortune prediction bring you surprise? Will the lottery gift be your favorite? Come and check, wish you great luck!',
    },
    {
      id: '334593389401997329',
      language: 'zh',
      content:
        '开启抽奖,打开运势,今天您将迎来好运!运势预测会给您带来惊喜吗?抽奖礼品会是您心仪的吗?来看看吧,祝您吉星高照!',
    },
    {
      id: '334593389401997330',
      language: 'zh-Hant',
      content:
        '開啟抽獎,打開運勢,今天您將迎來好運!運勢預測會給您帶來驚喜嗎?抽獎禮品會是您心儀的嗎?來看看吧,祝您吉星高照!',
    },
    {
      id: '334593389401997331',
      language: 'ja',
      content:
        '抽選を開始し、運勢をチェックして、今日は幸運の日です!運勢の予想がサプライズをもたらすでしょうか?抽選のプレゼントはあなたの欲しいもの?さあ確認して、幸運の星が照らすことを祈ります!',
    },
  ],
  [
    {
      id: '334593389401997332',
      language: 'en',
      content:
        'Ding dong~ Fortune and lottery reminder is here! Check the fortune prediction no matter good or bad, and try the lottery by yourself to see if you win! Surprise is waiting for you!',
    },
    {
      id: '334593389401997333',
      language: 'zh',
      content: '今日运势抽奖提醒来啦!运势预测好不好都要来看看,抽奖是否中奖更要亲自尝试!这边有惊喜在等您!',
    },
    {
      id: '334593389401997334',
      language: 'zh-Hant',
      content: '今日運勢抽獎提醒來啦!運勢預測好不好都要來看看,抽獎是否中獎更要親自嘗試!這邊有驚喜在等您!',
    },
    {
      id: '334593389401997335',
      language: 'ja',
      content:
        '今日の運勢と抽選のリマインダーが来ました!運勢の予想が良くても悪くてもチェックし、抽選で当選したか自分で試してください!サプライズが待っています!',
    },
  ],
  [
    {
      id: '334593389401997336',
      language: 'en',
      content:
        "Dear, seize the day, luck is right in front of you! Check today's fortune to predict wealth, love and career! Then hurry to the lottery, maybe the gift is yours!",
    },
    {
      id: '334593389401997337',
      language: 'zh',
      content: '亲爱的,把握当下,运气就在眼前!来看今日运势,预测财运、爱情和事业!然后快快抽奖,说不定小礼物就是属于您的!',
    },
    {
      id: '334593389401997338',
      language: 'zh-Hant',
      content: '親愛的,把握當下,運氣就在眼前!來看今日運勢,預測財運、愛情和事業!然後快快抽獎,說不定小禮物就是屬於您的!',
    },
    {
      id: '334593389401997339',
      language: 'ja',
      content:
        '大切なあなた、今を掴み取って、運が目の前にあります!今日の運勢を見て、財運、愛情、仕事を予想してください!そして抽選に応募し、プレゼントはあなたのかもしれません!',
    },
  ],
  [
    {
      id: '334593389401997340',
      language: 'en',
      content:
        "It's lottery time again! Today's fortune has been released, is it good for you? Will the lottery have surprise? Come and explore your own good luck!",
    },
    {
      id: '334593389401997341',
      language: 'zh',
      content: '又到了抽奖时间!今日运势已经出炉,是否对您有利呢?抽奖是否会有惊喜呢?快来发掘属于自己的好运吧!',
    },
    {
      id: '334593389401997342',
      language: 'zh-Hant',
      content: '又到了抽獎時間!今日運勢已經出爐,是否對您有利呢?抽獎是否會有驚喜呢?快來發掘屬於自己的好運吧!',
    },
    {
      id: '334593389401997343',
      language: 'ja',
      content:
        'また抽選の時間です!今日の運勢は出ています、あなたにとって良いでしょうか?抽選にサプライズはあるでしょうか?自分の幸運を掘り起こしてください!',
    },
  ],
  [
    {
      id: '334593389401997344',
      language: 'en',
      content:
        "Open the lottery, look for surprises, analyze the fortune, see your destiny clearly. What inspiration will today's fortune bring you? What will the lottery give you? Come and reveal your fate!",
    },
    {
      id: '334593389401997345',
      language: 'zh',
      content:
        '开启抽奖,寻找惊喜,解析运势,看清运程。今日运势会给您带来什么启示?抽奖又会有什么收获?快来揭晓属于您的命运吧!',
    },
    {
      id: '334593389401997346',
      language: 'zh-Hant',
      content:
        '開啟抽獎,尋找驚喜,解析運勢,看清運程。今日運勢會給您帶來什麼啟示?抽獎又會有什麼收穫?快來揭曉屬於您的命運吧!',
    },
    {
      id: '334593389401997347',
      language: 'ja',
      content:
        '抽選を開始して、サプライズを探し、運勢を解析し、運命を明確にしてください。今日の運勢はあなたにどんな示唆を与えてくれるでしょうか?抽選ではどんな収穫があるでしょうか?さあ、あなたの運命を明らかにしましょう!',
    },
  ],
  [
    {
      id: '334593389401997348',
      language: 'en',
      content:
        "Dear, it's another beautiful day! Fortune and lottery double benefits are waiting for you now! Fortune predicts today's luck, lottery gives you surprise gifts! Come and dig your good luck!",
    },
    {
      id: '334593389401997349',
      language: 'zh',
      content:
        '亲爱的,又是美好的一天!运势抽奖双重好礼在此刻等待您!运势预测今日运气,抽奖给您惊喜礼物!快来挖掘自己的好运吧!',
    },
    {
      id: '334593389401997350',
      language: 'zh-Hant',
      content:
        '親愛的,又是美好的一天!運勢抽獎雙重好禮在此刻等待您!運勢預測今日運氣,抽獎給您驚喜禮物!快來挖掘自己的好運吧!',
    },
    {
      id: '334593389401997351',
      language: 'ja',
      content:
        '大切なあなた、また美しい1日です!運勢と抽選のダブル幸運が今この瞬間あなたを待っています!運勢が今日の運を予想し、抽選がサプライズプレゼントを提供します!自分の幸運を掘り起こしましょう!',
    },
  ],
];

export async function migrate() {
  await Promise.all(
    prebuilt.flatMap((group) =>
      group.map(async (item) => {
        await BuiltinAnswer.upsert({ key: BuiltinAnswerKeys.NotificationTodaysPredict, ...item });
      }),
    ),
  );
}
