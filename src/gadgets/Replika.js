/* global bot */

let replika = {
  token: process.env.API_REPLIKA_TOKEN,
  user: process.env.API_REPLIKA_USER,
  device: process.env.API_REPLIKA_DEVICE,
  key: process.env.API_REPLIKA_KEY,
  bot: process.env.API_REPLIKA_BOT,
  chat: process.env.API_REPLIKA_CHAT
}
let got = require('got')
let WebSocket = require('ws')

async function talkToReplika (msg) {
  try {
    let text = msg.content.substr(`<@${bot.user.id}>`.length).trim()
    if (!text) {
      let url = 'https://my.replika.ai/api/mobile/0.8/bots/' + replika.bot
      let body = (await got(url, {
        headers: {
          'x-auth-token': replika.key,
          'x-user-id': replika.user,
          'x-device-id': replika.device
        },
        json: true
      })).body
      msg.channel.send({
        embed: {
          title: body.name,
          color: 6508963,
          description: `**Mood:** ${body.mood.title} (${body.mood.happiness_level})\n**Level:** ${body.stats.current_level.level_index} (${body.stats.current_level.name})\n**XP:** ${body.stats.score} (->${body.stats.next_level.score_milestone})`,
          thumbnail: {
            url: body.icon_large_url
          }
        }
      })
      return
    }
    let ws = new WebSocket('wss://my.replika.ai:8050/v9')
    let s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    let guid = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
    let body = {
      event_name: 'message',
      payload: {
        content: { type: 'text', text: text },
        meta: {
          bot_id: replika.bot,
          client_token: guid,
          chat_id: replika.chat,
          timestamp: new Date().toISOString()
        }
      },
      token: replika.token,
      auth: {
        user_id: replika.user,
        device_id: replika.device,
        auth_token: replika.key
      }
    }
    let heart
    ws.on('open', () => { ws.send(JSON.stringify(body)) })
    ws.on('message', data => {
      if (heart) clearInterval(heart)
      data = JSON.parse(data)
      if (data.event_name === 'start_typing') msg.channel.startTyping()
      else if (data.event_name === 'message' && data.payload && data.payload.meta && data.payload.meta.nature === 'Robot') {
        msg.channel.stopTyping()
        msg.channel.send(data.payload.content.text)
        if (data.payload.widget) {
          let items = data.payload.widget.items
          let txt = []
          for (let i = 0; i < items.length; i++) {
            txt.push('`' + items[i].title + '`')
          }
          msg.channel.send(txt.join(' '))
        }
      }
      heart = setInterval(() => ws.close(), 15000)
    })
  } catch (e) { if (e) return null }
}

module.exports = {
  disabled: false,
  type: 'msg',
  check: async msg => {
    if (msg.content.startsWith(`<@${bot.user.id}>`)) {
      await talkToReplika(msg)
      return true
    }
    return false
  }
}
