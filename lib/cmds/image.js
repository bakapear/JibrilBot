let got = require("got")
let cheerio = require("cheerio")

module.exports = {
    name: ["image", "img", "i"],
    desc: "Displays an image from Google.",
    permission: "",
    usage: "<query>",
    args: 1,
    command: async function (msg, cmd, args) {
        let images = await collectImages()
        let rnd = Math.floor(Math.random() * images.length)
        msg.channel.send({
            embed: {
                image: {
                    url: images[rnd].original.url
                }
            }
        })
    }
}

async function collectImages(query) {
    let url = "http://images.google.com/search?tbm=isch&safe=off&q=" + encodeURIComponent(query)
    let body = (await got(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
        }
    })).body
    let $ = cheerio.load(body)
    let meta = $(".rg_meta")
    let result = []
    for (let i = 0; i < meta.length; i++) {
        let data = JSON.parse(meta[i].children[0].data)
        let item = {
            original: {
                url: data.ou,
                width: data.ow,
                height: data.oh
            },
            thumbnail: {
                url: data.tu,
                width: data.tw,
                height: data.th
            }
        }
        result.push(item)
    }
    return result
}