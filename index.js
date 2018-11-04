let http = require("http")
let child = require("child_process")

child.exec(`now alias jibril --remove-old --token ${process.env.TOKEN}`)
child.exec(`now rm jibril --safe --yes --token ${process.env.TOKEN}`)
http.createServer((req, res) => {
    res.write(t(process.uptime()))
    res.end()
}).listen(3000)

module.exports = require("./lib/core")

function t(s) {
    let d = Math.floor(s / (3600 * 24))
    let a = new Date(s * 1000).toISOString().substr(11, 8)
    return `${d} Days ${a}`
}