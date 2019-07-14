let http = require('http')
let server = require('server')
let { get, error } = server.router
let { json, status } = server.reply

server({ port: process.env.PORT, public: 'views' }, [
  get('/up', ctx => json(t(process.uptime()))),
  get('/store', ctx => json({})),
  get('/favicon.ico', ctx => status(200)),
  get('/*', ctx => 'Why are you even here'),
  error(ctx => console.error(ctx.error))
])

if (!process.env.DEBUG) setInterval(() => http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`, 280000))

function t (s) {
  let d = Math.floor(s / (3600 * 24))
  let a = new Date(s * 1000).toISOString().substr(11, 8)
  return `${d} Days ${a}`
}

module.exports = require('./lib/core')
