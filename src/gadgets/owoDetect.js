module.exports = {
  disabled: false,
  type: 'msg',
  check: async msg => {
    if (msg.content.indexOf('owo') >= 0) {
      msg.channel.send(`Oh noe, did <@${msg.author.id}> just do the forbidden OWO?!`)
    }
    if (msg.content.indexOf('uwu') >= 0) {
      msg.channel.send(`Oh frick, did <@${msg.author.id}> just do the naughty UWU?!`)
    }
    return false
  }
}
