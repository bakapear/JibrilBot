let { doChecks, checks, voice } = global

module.exports = {
  name: ['join'],
  desc: 'Joins a voice channel.',
  permission: '',
  usage: '<channel name>',
  args: 1,
  command: async function (msg, cmd, args) {
    if (doChecks(checks, msg, 1)) return
    if (!voice[msg.guild.id].chan) {
      let chan = msg.guild.channels.find(x => x.name === args[0] && x.type === 'voice')
      if (chan) {
        voice[msg.guild.id].chan = chan
        voice[msg.guild.id].conn = await voice[msg.guild.id].chan.join()
      } else {
        msg.channel.send(`Couldn't find '${args[0]}' voice channel!`)
      }
    }
  }
}
