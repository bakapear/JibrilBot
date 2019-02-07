let { doChecks, checks, voice } = global

module.exports = {
  name: ['repeat'],
  desc: 'Put the queue on repeat.',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    if (doChecks(checks, msg, 6)) return
    if (voice[msg.guild.id].repeat) {
      voice[msg.guild.id].repeat = false
      msg.channel.send('Queue repeat is now off!')
    } else {
      voice[msg.guild.id].repeat = true
      msg.channel.send('Queue repeat is now on!')
    }
  }
}
