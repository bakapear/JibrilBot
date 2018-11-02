let got = require("got")
let link = require("url")

module.exports = {
    name: ["tts", "ftts"],
    desc: "Make the bot say something in Text-To-Speech!",
    permission: "",
    usage: "(language) (speed) ; <message>",
    args: 1,
    command: async function (msg, cmd, args) {
        if (doChecks(checks, msg, 3)) return
        if (!voice[msg.guild.id].chan) {
            voice[msg.guild.id].chan = msg.member.voiceChannel
            voice[msg.guild.id].conn = await voice[msg.guild.id].chan.join()
        }
        if (voice[msg.guild.id].queue && voice[msg.guild.id].queue.length) {
            let last = 1
            if (cmd === "ftts") voice[msg.guild.id].queue.splice(1, 0, await getTTSUrl(args))
            else {
                voice[msg.guild.id].queue.push(await getTTSUrl(args))
                last = voice[msg.guild.id].queue.length - 1
            }
            showPlayMessage(msg, "Added to Queue", voice[msg.guild.id].queue[last].name, voice[msg.guild.id].queue[last].link, voice[msg.guild.id].queue[last].img)
        }
        else {
            voice[msg.guild.id].queue = []
            voice[msg.guild.id].queue.push(await getTTSUrl(args))
            voice[msg.guild.id].msg = msg
            playQueue(msg)
        }
    }
}

async function getTTSUrl(args) {
    let lang
    let speed
    if (args[1] === ";") {
        lang = args[0]
        speed = 1
        args.splice(0, 2)
    }
    else if (args[2] === ";") {
        lang = args[0]
        speed = args[1]
        args.splice(0, 3)
    }
    else {
        lang = "en"
        speed = 1
    }
    let url = await TTS(args.join(" "), lang, speed)
    return {
        type: "tts",
        link: url,
        name: args.join(" ")
    }
}

async function TTS(txt, lang, speed) {
    txt = txt.substr(0, 200)
    let url = "https://translate.google.com/translate_tts" + link.format({
        query: {
            ie: "UTF-8",
            q: txt,
            tl: lang || "en",
            total: 1,
            idx: 0,
            textlen: txt.length,
            tk: await getKey(txt),
            client: "t",
            prev: "input",
            ttsspeed: speed || 1
        }
    })
    return url
}

async function getKey(text) {
    let url = "https://translate.google.com/"
    let body = (await got(url)).body
    let token = body.match("TKK='(\\d+.\\d+)';")
    if (!token) return null
    return genToken(text, token[1])
}

function genToken(text, key) {
    let XL = (a, b) => {
        for (var c = 0; c < b.length - 2; c += 3) {
            var d = b.charAt(c + 2)
            d = d >= 'a' ? d.charCodeAt(0) - 87 : Number(d)
            d = b.charAt(c + 1) == '+' ? a >>> d : a << d
            a = b.charAt(c) == '+' ? a + d & 4294967295 : a ^ d
        }
        return a
    }
    var a = text, b = key, d = b.split('.')
    b = Number(d[0]) || 0
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var m = a.charCodeAt(g)
        128 > m ? e[f++] = m : (2048 > m ? e[f++] = m >> 6 | 192 : (55296 == (m & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (m = 65536 + ((m & 1023) << 10) + (a.charCodeAt(++g) & 1023),
            e[f++] = m >> 18 | 240,
            e[f++] = m >> 12 & 63 | 128) : e[f++] = m >> 12 | 224,
            e[f++] = m >> 6 & 63 | 128),
            e[f++] = m & 63 | 128)
    }
    a = b
    for (f = 0; f < e.length; f++) {
        a += e[f]
        a = XL(a, '+-a^+6')
    }
    a = XL(a, '+-3^+b+-f')
    a ^= Number(d[1]) || 0
    0 > a && (a = (a & 2147483647) + 2147483648)
    a = a % 1E6
    return a.toString() + '.' + (a ^ b)
}