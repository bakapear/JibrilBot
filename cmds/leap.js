const got = require("got");
const api_leap = process.env.API_LEAP;
const api_imgur = process.env.API_IMGUR;

module.exports = {
    name: ["leap"],
    desc: "Get screenshot from website",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        const img = (await got(`https://apileap.com/api/screenshot/v1/urltoimage?access_key=${api_leap}&url=${args[0]}`, { encoding: null })).body;
        try {
            const body = (await got("https://api.imgur.com/3/image", { method: "POST", headers: { "Authorization": `Client-ID ${api_imgur}` }, json: true, body: { image: img, type: "file" } })).body;
        } catch (error) {
            console.log(error.response.body);
        }
        console.log(body);
    }
}