// 引用 linebot 套件
import linebot from 'linebot'
// 引用 dotenv 套件
import dotenv from 'dotenv'
// 引用 request 套件
import rp from 'request-promise'

// 讀取 .env 檔
dotenv.config()

// 宣告機器人資訊
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// 書卷縮寫資料
const bookList = [
  { num: '1', ens: 'Gen', en: 'Genesis', cns: '創', cn: '創世記', sens: 'Ge' },
  { num: '2', ens: 'Ex', en: 'Exodus', cns: '出', cn: '出埃及記', sens: 'Ex' },
  { num: '3', ens: 'Lev', en: 'Leviticus', cns: '利', cn: '利未記', sens: 'Le' },
  { num: '4', ens: 'Num', en: 'Numbers', cns: '民', cn: '民數記', sens: 'Nu' },
  { num: '5', ens: 'Deut', en: 'Deuteronomy', cns: '申', cn: '申命記', sens: 'De' },
  { num: '6', ens: 'Josh', en: 'Joshua', cns: '書', cn: '約書亞記', sens: 'Jos' },
  { num: '7', ens: 'Judg', en: 'Judges', cns: '士', cn: '士師記', sens: 'Jud' },
  { num: '8', ens: 'Ruth', en: 'Ruth', cns: '得', cn: '路得記', sens: 'Ru' },
  { num: '9', ens: '1 Sam', en: 'First Samuel', cns: '撒上', cn: '撒母耳記上', sens: '1Sa' },
  { num: '10', ens: '2 Sam', en: 'Second Samuel', cns: '撒下', cn: '撒母耳記下', sens: '2Sa' },
  { num: '11', ens: '1 Kin', en: 'First Kings', cns: '王上', cn: '列王紀上', sens: '1Ki' },
  { num: '12', ens: '2 Kin', en: 'Second Kings', cns: '王下', cn: '列王紀下', sens: '2Ki' },
  { num: '13', ens: '1 Chr', en: 'First Chronicles', cns: '代上', cn: '歷代志上', sens: '1Ch' },
  { num: '14', ens: '2 Chr', en: 'Second Chronicles', cns: '代下', cn: '歷代志下', sens: '2Ch' },
  { num: '15', ens: 'Ezra', en: 'Ezra', cns: '拉', cn: '以斯拉記', sens: 'Ezr' },
  { num: '16', ens: 'Neh', en: 'Nehemiah', cns: '尼', cn: '尼希米記', sens: 'Ne' },
  { num: '17', ens: 'Esth', en: 'Esther', cns: '斯', cn: '以斯帖記', sens: 'Es' },
  { num: '18', ens: 'Job', en: 'Job', cns: '伯', cn: '約伯記', sens: 'Job' },
  { num: '19', ens: 'Ps', en: 'Psalms', cns: '詩', cn: '詩篇', sens: 'Ps' },
  { num: '20', ens: 'Prov', en: 'Proverbs', cns: '箴', cn: '箴言', sens: 'Pr' },
  { num: '21', ens: 'Eccl', en: 'Ecclesiastes', cns: '傳', cn: '傳道書', sens: 'Ec' },
  { num: '22', ens: 'Song', en: 'Song of Solomon', cns: '歌', cn: '雅歌', sens: 'So' },
  { num: '23', ens: 'Is', en: 'Isaiah', cns: '賽', cn: '以賽亞書', sens: 'Isa' },
  { num: '24', ens: 'Jer', en: 'Jeremiah', cns: '耶', cn: '耶利米書', sens: 'Jer' },
  { num: '25', ens: 'Lam', en: 'Lamentations', cns: '哀', cn: '耶利米哀歌', sens: 'La' },
  { num: '26', ens: 'Ezek', en: 'Ezekiel', cns: '結', cn: '以西結書', sens: 'Eze' },
  { num: '27', ens: 'Dan', en: 'Daniel', cns: '但', cn: '但以理書', sens: 'Da' },
  { num: '28', ens: 'Hos', en: 'Hosea', cns: '何', cn: '何西阿書', sens: 'Ho' },
  { num: '29', ens: 'Joel', en: 'Joel', cns: '珥', cn: '約珥書', sens: 'Joe' },
  { num: '30', ens: 'Amos', en: 'Amos', cns: '摩', cn: '阿摩司書', sens: 'Am' },
  { num: '31', ens: 'Obad', en: 'Obadiah', cns: '俄', cn: '俄巴底亞書', sens: 'Ob' },
  { num: '32', ens: 'Jon', en: 'Jonah', cns: '拿', cn: '約拿書', sens: 'Jon' },
  { num: '33', ens: 'Mic', en: 'Micah', cns: '彌', cn: '彌迦書', sens: 'Mic' },
  { num: '34', ens: 'Nah', en: 'Nahum', cns: '鴻', cn: '那鴻書', sens: 'Na' },
  { num: '35', ens: 'Hab', en: 'Habakkuk', cns: '哈', cn: '哈巴谷書', sens: 'Hab' },
  { num: '36', ens: 'Zeph', en: 'Zephaniah', cns: '番', cn: '西番雅書', sens: 'Zep' },
  { num: '37', ens: 'Hag', en: 'Haggai', cns: '該', cn: '哈該書', sens: 'Hag' },
  { num: '38', ens: 'Zech', en: 'Zechariah', cns: '亞', cn: '撒迦利亞書', sens: 'Zec' },
  { num: '39', ens: 'Mal', en: 'Malachi', cns: '瑪', cn: '瑪拉基書', sens: 'Mal' },
  { num: '40', ens: 'Matt', en: 'Matthew', cns: '太', cn: '馬太福音', sens: 'Mt' },
  { num: '41', ens: 'Mark', en: 'Mark', cns: '可', cn: '馬可福音', sens: 'Mr' },
  { num: '42', ens: 'Luke', en: 'Luke', cns: '路', cn: '路加福音', sens: 'Lu' },
  { num: '43', ens: 'John', en: 'John', cns: '約', cn: '約翰福音', sens: 'Joh' },
  { num: '44', ens: 'Acts', en: 'Acts', cns: '徒', cn: '使徒行傳', sens: 'Ac' },
  { num: '45', ens: 'Rom', en: 'Romans', cns: '羅', cn: '羅馬書', sens: 'Ro' },
  { num: '46', ens: '1 Cor', en: 'First Corinthians', cns: '林前', cn: '哥林多前書', sens: '1Co' },
  { num: '47', ens: '2 Cor', en: 'Second Corinthians', cns: '林後', cn: '哥林多後書', sens: '2Co' },
  { num: '48', ens: 'Gal', en: 'Galatians', cns: '加', cn: '加拉太書', sens: 'Ga' },
  { num: '49', ens: 'Eph', en: 'Ephesians', cns: '弗', cn: '以弗所書', sens: 'Eph' },
  { num: '50', ens: 'Phil', en: 'Philippians', cns: '腓', cn: '腓立比書', sens: 'Php' },
  { num: '51', ens: 'Col', en: 'Colossians', cns: '西', cn: '歌羅西書', sens: 'Col' },
  { num: '52', ens: '1 Thess', en: 'First Thessalonians', cns: '帖前', cn: '帖撒羅尼迦前書', sens: '1Th' },
  { num: '53', ens: '2 Thess', en: 'Second Thessalonians', cns: '帖後', cn: '帖撒羅尼迦後書', sens: '2Th' },
  { num: '54', ens: '1 Tim', en: 'First Timothy', cns: '提前', cn: '提摩太前書', sens: '1Ti' },
  { num: '55', ens: '2 Tim', en: 'Second Timothy', cns: '提後', cn: '提摩太後書', sens: '2Ti' },
  { num: '56', ens: 'Titus', en: 'Titus', cns: '多', cn: '提多書', sens: 'Tit' },
  { num: '57', ens: 'Philem', en: 'Philemon', cns: '門', cn: '腓利門書', sens: 'Phm' },
  { num: '58', ens: 'Heb', en: 'Hebrews', cns: '來', cn: '希伯來書', sens: 'Heb' },
  { num: '59', ens: 'James', en: 'James', cns: '雅', cn: '雅各書', sens: 'Jas' },
  { num: '60', ens: '1 Pet', en: 'First Peter', cns: '彼前', cn: '彼得前書', sens: '1Pe' },
  { num: '61', ens: '2 Pet', en: 'Second Peter', cns: '彼後', cn: '彼得後書', sens: '2Pe' },
  { num: '62', ens: '1 John', en: 'First John', cns: '約一', cn: '約翰一書', sens: '1Jo' },
  { num: '63', ens: '2 John', en: 'second John', cns: '約二', cn: '約翰二書', sens: '2Jo' },
  { num: '64', ens: '3 John', en: 'Third John', cns: '約三', cn: '約翰三書', sens: '3Jo' },
  { num: '65', ens: 'Jude', en: 'Jude', cns: '猶', cn: '猶大書', sens: 'Jude' },
  { num: '66', ens: 'Rev', en: 'Revelation', cns: '啟', cn: '啟示錄', sens: 'Re' }
]

const strProcessing = (str) => {
  // 把輸入的文字拆成一個 Array
  const strArr = str.split('')

  // 把 strArr 分類為 中文字串 及 非中文字串
  let chineseStr = ''
  let otherStr = ''
  for (let i = 0; i < strArr.length; i++) {
    if (/[\u4e00-\u9fa5]/.test(strArr[i])) {
      chineseStr += strArr[i]
    } else {
      otherStr += strArr[i]
    }
  }

  // 利用 chineseStr 處理書卷編號 => 輸出內容是1~66
  for (let i = 0; i < bookList.length; i++) {
    if (bookList[i].cn.includes(chineseStr) || bookList[i].cns.includes(chineseStr)) {
      chineseStr = bookList[i].num
      break
    }
  }

  // 利用 otherStr 處理章節編號 => 輸出 :1 或 :1:1

  // 把不是數字的 String 當作切割點，切割成 Array
  let temp = otherStr.split(/[^0-9]/)

  // 找到是數字的元素，元素前面加':'，並且合併 Array 為 String
  temp = temp.map((e) => {
    return e.replace(/[0-9]+/, ':' + e)
  })
  otherStr = temp.join('')

  const result = chineseStr + otherStr
  return result
}

const getData = async (str) => {
  let msg = ''
  try {
    const data = await rp({
      uri: `https://bibletool.konline.org/retrieve/UCV:${strProcessing(str)}`,
      json: true
    })

    msg = '搜尋「' + str + '」\n' + data[0].book + '\n'
    for (let i = 0; i < data[0].verses.length; i++) {
      let content = data[0].verses[i].content

      // 過濾掉網頁的標籤
      if (content.includes('<span class=\'browse-verse-red\' style=\'color: red;\'>')) {
        let ct = content.replace('<span class=\'browse-verse-red\' style=\'color: red;\'>', '')
        ct = ct.replace('</span>', '')
        content = ct
      }

      msg += data[0].verses[i].chapter + ':' + data[0].verses[i].verse + '  ' + content + '\n'
    }
  } catch (error) {
    msg = '發生錯誤 ' + error

    // if (error.type = 'Cannot read property \'book\' of undefined') {
    //   msg = '輸入的內容有問題'
    // }

    // if (error.type = '')
  }
  console.log(msg)
  return msg
}

// 機器人收到訊息
bot.on('message', async (event) => {
  console.log(event.message.text)
  event.reply(await getData(event.message.text))
})

// 在 port 啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
