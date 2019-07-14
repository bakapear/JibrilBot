/* global bot */

module.exports = {
  disabled: false,
  type: 'msg',
  check: async msg => {
    if (msg.content.startsWith('https://discordapp.com/channels')) {
      let arg = msg.content.split(' ')[0]
      let parts = arg.substr(msg.content.indexOf('/channels/') + 10).split('/')
      if (parts.length === 3) {
        let channel = bot.channels.find(x => x.id === parts[1])
        channel.fetchMessage(parts[2]).then(m => {
          msg.channel.send({
            embed: {
              description: m.content,
              image: {
                url: m.attachments.first() ? m.attachments.first().url : null
              },
              footer: {
                text: m.author.username,
                icon_url: m.author.avatarURL
              },
              timestamp: m.createdAt
            }
          })
        })
        return true
      }
    }
    return false
  }
}
