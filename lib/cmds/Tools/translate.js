let got = require("got")
let link = require("url")

module.exports = {
    name: ["toen", "translate"],
    desc: "Translate anything! If only target lang given, source will be auto. If no langs given, it will translate anything to english.",
    permission: "",
    usage: "(target lang) (source lang) ; <text>",
    args: 1,
    command: async function (msg, cmd, args) {
        let target
        let source
        if (args[1] === ";") {
            target = args[0]
            source = "auto"
            args.splice(0, 2)
        }
        else if (args[2] === ";") {
            target = args[0]
            source = args[1]
            args.splice(0, 3)
        }
        else {
            target = "en"
            source = "auto"
        }
        let translated = await getTranslateData(args.join(" "), source, target)
        msg.channel.send({
            embed: {
                color: 7303167,
                title: `${translated.from.lang.toUpperCase()} to ${translated.to.lang.toUpperCase()}`,
                description: `From: \`${translated.from.text}\`\nTo: \`${translated.to.text}\``
            }
        })
    }
}

async function getTranslateData(text, source, target) {
    let url = "https://translate.google.com/translate_a/single" + link.format({
        query: {
            client: "t",
            sl: source || "auto",
            tl: target || "en",
            hl: target || "en",
            dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
            ie: 'UTF-8',
            oe: 'UTF-8',
            otf: 1,
            ssel: 0,
            tsel: 0,
            kc: 7,
            q: text
        }
    }) + await getKey(text)
    let body = (await got(url, { json: true })).body
    return {
        from: {
            lang: body[8][0][0],
            text: body[7] ? body[7][0].replace(/<b><i>/g, "[").replace(/<\/i><\/b>/g, "]") : body[0][0][1],
        },
        to: {
            lang: target || "en",
            text: body[0][0][0]
        }
    }
}

async function getKey(text) {
    let url = "https://translate.google.com/"
    let body = (await got(url)).body
    let token = body.match("TKK='(\\d+.\\d+)';")
    if (!token) return null
    return genToken(text, token[1])
}

function genToken(a, token) {
    let window = {
        TKK: token
    }
    let yr = null
    let wr = function (a) {
        return function () {
            return a
        }
    }
    let xr = function (a, b) {
        for (var c = 0; c < b.length - 2; c += 3) {
            var d = b.charAt(c + 2)
                , d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d)
                , d = "+" == b.charAt(c + 1) ? a >>> d : a << d
            a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d
        }
        return a
    }
    var b
    if (null !== yr)
        b = yr
    else {
        b = wr(String.fromCharCode(84))
        var c = wr(String.fromCharCode(75))
        b = [b(), b()]
        b[1] = c()
        b = (yr = window[b.join(c())] || "") || ""
    }
    var d = wr(String.fromCharCode(116))
        , c = wr(String.fromCharCode(107))
        , d = [d(), d()]
    d[1] = c()
    c = "&" + d.join("") + "="
    d = b.split(".")
    b = Number(d[0]) || 0
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var l = a.charCodeAt(g)
        128 > l ? e[f++] = l : (2048 > l ? e[f++] = l >> 6 | 192 : (55296 == (l & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023),
            e[f++] = l >> 18 | 240,
            e[f++] = l >> 12 & 63 | 128) : e[f++] = l >> 12 | 224,
            e[f++] = l >> 6 & 63 | 128),
            e[f++] = l & 63 | 128)
    }
    a = b
    for (f = 0; f < e.length; f++)
        a += e[f],
            a = xr(a, "+-a^+6")
    a = xr(a, "+-3^+b+-f")
    a ^= Number(d[1]) || 0
    0 > a && (a = (a & 2147483647) + 2147483648)
    a %= 1E6
    return c + (a.toString() + "." + (a ^ b))
}