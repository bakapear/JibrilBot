module.exports = {
  name: ['up', 'uptime'],
  desc: "Tells you how long I've been running for!",
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    msg.channel.send(`**Uptime:** \`${t(process.uptime())}\``)
  }
}

function t (s) {
  let d = Math.floor(s / (3600 * 24))
  let a = new Date(s * 1000).toISOString().substr(11, 8)
  return `${d} Days ${a}`
}
