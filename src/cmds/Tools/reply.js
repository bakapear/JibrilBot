module.exports = {
  name: ['re', 'reply'],
  desc: 'Reply to a message!',
  permission: '',
  usage: '<message id> <reply>',
  args: 2,
  command: async function (msg, cmd, args) {
    if (isNaN(args[0])) {
      msg.channel.send('Invalid message ID!')
      return
    }
    msg.channel.fetchMessage(args[0]).then(async m => {
      await msg.delete()
      msg.channel.fetchWebhooks().then(async hooks => {
        let hook = hooks.find(x => x.name === 'Jibs - Reply Hook')
        if (hook === null) {
          hook = await msg.channel.createWebhook('Jibs - Reply Hook')
        }
        await hook.edit(msg.author.username, msg.author.avatarURL)
        await hook.sendSlackMessage({
          attachments: [{
            pretext: m.content,
            footer_icon: m.author.avatarURL,
            footer: m.author.username,
            ts: m.createdAt / 1000
          }]
        })
        await hook.send(args.splice(1, args.length).join(' '))
        await hook.edit('Jibs - Reply Hook', '')
      })
    }).catch(e => {
      msg.channel.send('Invalid message ID!')
    })
  }
}
