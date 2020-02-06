let got = require('got')

module.exports = {
  name: ['math', 'm'],
  desc: 'Gives you the ability to do math stuff!',
  permission: '',
  usage: '<math stuff>',
  args: 1,
  command: async function (msg, cmd, args) {
    let body = await doMath(args.join(' '))
    msg.channel.send(body)
  }
}

async function doMath (expression) {
  let url = 'http://api.mathjs.org/v4/'
  let body = await got(url, {
    query: { expr: expression },
    json: true
  }).catch(e => e.response)
  return body.body
}
