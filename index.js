let server = require('server')
let { get, error } = server.router
let { json, status } = server.reply

server({ public: 'views' }, [
  get('/up', ctx => json(t(process.uptime()))),
  get('/store', ctx => json({})),
  get('/free', ctx => {
    let bark = {
      title: process.title,
      version: process.version,
      arch: process.arch,
      platform: process.platform,
      release: process.release,
      os: process.env.OS,
      uptime: process.uptime()
    }
    return json(bark)
  }),
  get('/favicon.ico', ctx => status(200)),
  get('/*', ctx => 'Why are you even here'),
  error(ctx => console.error(ctx.error))
])

if (!process.env.DEBUG) {
  setTimeout(() => require('child_process').exec(`now alias rm jibril --yes --token ${process.env.TOKEN} ; now alias --token ${process.env.TOKEN} ; now rm jibril --safe --yes --token ${process.env.TOKEN}`, (e, out, err) => {
    if (err) console.log(err)
    if (out) console.log(out)
  }), 10000)
}

function t (s) {
  let d = Math.floor(s / (3600 * 24))
  let a = new Date(s * 1000).toISOString().substr(11, 8)
  return `${d} Days ${a}`
}

module.exports = require('./src/core')
