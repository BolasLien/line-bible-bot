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

const findChap = (str) => {
  const s = str.split(' ')
  console.log(s)

  const json = {
    chineses: s[0],
    chap: s[1],
    version: 'nstrunv',
    sec: s.length === 3 ? s[2] : 0,
    gb: 0
  }

  console.log(json)
  return json
}

// 當收到訊息時
bot.on('message', async (event) => {
  console.log(event.message.text)

  let msg = ''
  try {
    const data = await rp({
      uri: 'https://bible.fhl.net/json/qb.php',
      qs: findChap(event.message.text),
      json: true
    })
    msg = data.record[0].bible_text
  } catch (error) {
    msg = '發生錯誤' + error
  }
  event.reply(msg)
})

// 在 port 啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
