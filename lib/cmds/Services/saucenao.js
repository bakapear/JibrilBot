let { cfg } = global
let got = require('got')
let apiSauce = process.env.API_SAUCE

module.exports = {
  name: ['sauce', 'saucenao'],
  desc: 'Get the source of an image/artwork.',
  permission: '',
  usage: '<url>',
  args: 1,
  command: async function (msg, cmd, args) {
    let body = await getSimilarImages(args.join(' '))
    if (!body) {
      msg.channel.send('Something went wrong!')
      return
    }
    if (!body.length) {
      msg.channel.send('Nothing found!')
      return
    }
    let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * body.length) : 0
    msg.channel.send({
      embed: {
        color: 7237740,
        title: body[mod].title,
        description: body[mod].desc,
        url: body[mod].url,
        image: { url: body[mod].img }
      }
    })
  }
}

async function getSimilarImages (input) {
  let url = 'https://saucenao.com/search.php'
  let body = (await got(url, {
    query: {
      db: 999,
      output_type: 2,
      numres: 16,
      api_key: apiSauce,
      url: input
    },
    json: true
  })).body
  let res = []
  for (let i = 0; i < body.results.length; i++) {
    res.push({
      title: body.results[i].data.title || body.results[i].header.index_name,
      img: body.results[i].header.thumbnail || '',
      url: body.results[i].data.ext_urls ? body.results[i].data.ext_urls[0] : '',
      desc: body.results[i].data.jp_name || body.results[i].data.eng_name || body.results[i].source
    })
  }
  return res
}
