let { cfg } = global

module.exports = {
  name: ['prefixes'],
  desc: 'Shows all bot prefixes',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    msg.channel.send({ embed: {
      title: 'My Prefixes',
      description: `**first**: ${cfg.prefix.first}\n**random**: ${cfg.prefix.random}\n**hidden**: ${cfg.prefix.hidden}\n**mention**: ${cfg.prefix.mention}`,
      color: 14597321
    } })
  }
}
