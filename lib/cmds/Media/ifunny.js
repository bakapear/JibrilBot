let got = require('got')
let key = 'Basic QkQ3N0FBMjA5QkRCRUVERjI2MEZDRTA2Mjg2N0JFQUYzRUY1QkRFM0U4MzQyQzI2MTJGQjMwN0IxNDgxQTkzNV9Nc09JSjM5UTI4OjRiNWYzNzJkODUyN2QzZDExNTc1YTI1YjRjMTYyNmMzMDViZjUyNjM='
let isFunction = (fn) => fn && {}.toString.call(fn) === '[object Function]'

module.exports = {
  name: ['fun', 'ifunny'],
  desc: 'Displays a random ifunny picture.',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    let num = args[0] || 20
    let body = await ifunny({ limit: num })
    let rnd = Math.floor(Math.random() * body.data.content.items.length)
    if (body.data.content.items[rnd].url.substr(-3) === 'mp4') msg.channel.send('https' + body.data.content.items[rnd].url.substr(4))
    else if (body.data.content.items[rnd].url.substr(-3) === 'jpg' || body.data.content.items[rnd].url.substr(-3) === 'ebp') {
      msg.channel.send({
        embed: {
          image: {
            url: 'https://imageproxy.ifcdn.com/crop:x-20/images/' + body.data.content.items[rnd].url.substr(28)
          }
        }
      })
    } else if (body.data.content.items[rnd].url.substr(-3) === 'gif') {
      msg.channel.send({
        embed: {
          image: {
            url: 'https' + body.data.content.items[rnd].url.substr(4)
          }
        }
      })
    }
  }
}

async function ifunny (options, callback) {
  let next
  let type = 'featured'
  let limit = 30
  if (isFunction(options) || !options) { next = options } else {
    if (options.type) type = options.type
    if (options.limit) limit = options.limit
    next = callback
  }
  let url = 'https://api.ifunny.mobi/v4/feeds/' + type + '?limit=' + limit
  let opts = { headers: { Authorization: key }, json: true }
  if (type === 'collective') opts.method = 'POST'
  try {
    let res = (await got(url, opts)).body
    if (next) { next(null, res) } else { return res }
  } catch (e) {
    if (next) { next(e.response.body, null) } else { return e.response.body }
  }
}
