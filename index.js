//now rm jibril --yes ; now --public ; now alias

//kill me

require("http").createServer((req, res) => {
    res.write(t(process.uptime()))
    res.end()
}).listen(3000)

module.exports = require("./lib/core")

function t(s) {
    let d = Math.floor(s / (3600 * 24))
    let a = new Date(s * 1000).toISOString().substr(11, 8)
    return `${d} Days ${a}`
}