setTimeout(() => require('child_process').exec(`now alias rm jibril --yes --token ${process.env.TOKEN} ; now alias --token ${process.env.TOKEN} ; now rm jibril --safe --yes --token ${process.env.TOKEN}`, (e, out, err) => {
  if (err) console.log(err)
  if (out) console.log(out)
}), 10000)

require('http').createServer((req, res) => {
  res.write(t(process.uptime()))
  res.end()
}).listen(3000)

module.exports = require('./lib/core')

function t (s) {
  let d = Math.floor(s / (3600 * 24))
  let a = new Date(s * 1000).toISOString().substr(11, 8)
  return `${d} Days ${a}`
}
