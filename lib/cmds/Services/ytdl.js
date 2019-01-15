let crypto = require("crypto")
let got = require("got")

module.exports = {
    name: ["ytmp3", "ytmp4"],
    desc: "Convert youtube videos into mp3/mp4!",
    permission: "",
    usage: "<url>",
    args: 1,
    command: async function (msg, cmd, args) {
        let dl = await getDownloadLink(cmd.substr(2), args[0])
        if (!dl.success) {
            msg.channel.send("Something went wrong!")
            return
        }
        msg.channel.send({
            embed: {
                title: decodeURIComponent(dl.download.substr(dl.download.lastIndexOf("/") + 1)),
                description: "Size: " + dl.size_gb + "GB",
                url: dl.download,
                thumbnail: {
                    url: "https://img.youtube.com/vi/" + getVideoId(args[0]) + "/0.jpg"
                }
            }
        })
    }
}

async function getDownloadLink(type, link) {
    let opt = type === "mp4" ? 5 : 1
    try {
        let url = `https://dl2.ddownr.com/download/apiv2?url=${encodeURIComponent(link)}&format-option=${opt}&randy=${generateId(10)}&playlist=1&playliststart=1&playlistend=25&index=2&LB=https://www2.ddownr.com&rkey=&naming=1&email=`
        let body = (await got(url, { json: true })).body
        return body
    } catch (e) {
        return { success: false }
    }
}

function generateId(len) {
    return crypto.randomBytes(256).toString('hex').substr(0, len)
}

function getVideoId(url) {
    if (url.indexOf("youtu.be") >= 0) {
        return url.substr(url.lastIndexOf("/") + 1)
    }
    url = url.substr(url.indexOf("v=") + 2)
    url = url.substring(0, url.indexOf("&"))
    return url
}