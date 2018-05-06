let got = require("got");
let api_bit = process.env.API_BIT;
let api_imgur = process.env.API_IMGUR;

module.exports = {
    name: ["scale"],
    desc: "Image processing!",
    permission: "",
    usage: "<image url>",
    args: 1,
    command: async function (msg, cmd, args) {
        let data = await scaleImage(args[0]);
        if (data == -1) { msg.channel.send("Invalid url!"); return; }
        data = JSON.parse(data);
        let body = (await got("https://api.imgur.com/3/image", { method: "POST", headers: { "Authorization": `Client-ID ${api_imgur}` }, json: true, body: { image: data.results.images[0].s3_url, type: "url" } })).body;
        msg.channel.send({
            embed: {
                image: {
                    url: body.data.link
                }
            }
        });
    }
}

async function scaleImage(url) {
    let data = {
        "application_id": api_bit,
        "src": url,
        "functions": [
            {
                "name": "scale",
                "params": {
                    "width": 150,
                    "height": 150
                },
                "save": { "image_identifier": "MY_CLIENT_ID" }
            }
        ]
    };
    return (await getBitResponse(data));
}
async function getBitResponse(data) {
    let url = "http://api.blitline.com/job"
    try {
        let body = (await got.post(url, { body: "json=" + JSON.stringify(data) })).body;
        return body;
    } catch (e) { return -1; }
}

