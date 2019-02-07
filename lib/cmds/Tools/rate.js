module.exports = {
  name: ['rate'],
  desc: 'Rates something.',
  permission: '',
  usage: '(something)',
  args: 0,
  command: async function (msg, cmd, args) {
    let rnd = Math.floor(random(args.join(' ')) * 11)
    let rate = `Rated **${rnd}/10**!`
    if (rnd === 10) rate += ' <3'
    msg.channel.send(rate)
  }
}

function random (word) {
  if (!word) return Math.random()
  let seed = word.split('').map(x => x.charCodeAt(0)).join('')
  let x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}
