/* global bot */

let got = require('got')
let WebSocket = require('ws')
let keys = {
  token: process.env.API_REPLIKA_TOKEN,
  device: process.env.API_REPLIKA_DEVICE,
  user: process.env.API_REPLIKA_USER,
  bot: process.env.API_REPLIKA_BOT,
  chat: process.env.API_REPLIKA_CHAT
}

let s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
let guid = () => s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()

async function talkToReplika (msg) {
  try {
    let text = msg.content.split(' ').slice(1).join(' ')
    if (text) {
      let ws = new WebSocket('wss://my.replika.ai:8050/v15')
      let body = {
        event_name: 'message',
        payload: {
          content: { type: 'text', text: text },
          meta: {
            bot_id: keys.bot,
            client_token: guid(),
            chat_id: keys.chat,
            timestamp: new Date().toISOString()
          }
        },
        token: keys.token,
        auth: {
          user_id: keys.user,
          device_id: keys.device,
          auth_token: keys.token
        }
      }
      let heart
      ws.on('open', () => { ws.send(JSON.stringify(body)) })
      ws.on('message', data => {
        if (heart) clearInterval(heart)
        data = JSON.parse(data)
        if (data.event_name === 'start_typing') msg.channel.startTyping()
        else if (data.event_name === 'message' && data.payload.meta.nature === 'Robot') {
          msg.channel.stopTyping(true)
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
    } else {
      let url = 'https://my.replika.ai/api/mobile/1.3/personal_bot'
      let { body } = await got(url, {
        headers: {
          'x-auth-token': keys.token,
          'x-device-id': keys.device,
          'x-user-id': keys.user
        },
        json: true
      })
      msg.channel.send({
        embed: {
          title: body.name,
          color: 6508963,
          description: `**Mood:** ${body.mood.title} (${body.mood.happiness_level})\n**Level:** ${body.stats.current_level.level_index} (${body.stats.current_level.name})\n**XP:** ${body.stats.score} (->${body.stats.next_level.score_milestone})`,
          thumbnail: { url: body.icon_url }
        }
      })
    }
  } catch (e) { if (e) return null }
}

module.exports = {
  disabled: false,
  type: 'msg',
  check: async msg => {
    if (msg.content.startsWith(`<@!${bot.user.id}>`)) {
      await talkToReplika(msg)
      return true
    }
    return false
  }
}
