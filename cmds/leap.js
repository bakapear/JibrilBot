let jimp = require("jimp");

module.exports = {
    name: ["thot"],
    desc: "Just to showcase why.",
    permission: "",
    usage: "<url>",
    args: 1,
    command: async function (msg, cmd, args) {
        let img = await jimp.read(args[0]);
        if (!img) { msg.channel.send("Invalid image URL!"); return; }

        img.write(`./data/thot_${msg.author.id}.png`, () => {
            msg.channel.send({ file: `./data/thot_${msg.author.id}.png` });
        });
    }
}