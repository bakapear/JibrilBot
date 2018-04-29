let jimp = require("jimp");

module.exports = {
    name: ["leap", "l"],
    desc: "Basic image process actions.",
    permission: "",
    usage: "<url> <action(params);action(params);...>",
    args: 2,
    command: async function (msg, cmd, args) {
        let img = await jimp.read(args[0]);
        if (!img) { msg.channel.send("Invalid image URL!"); return; }
        args.splice(0, 1);
        if (args.join(" ").indexOf("(") == -1 || args.join(" ").indexOf(")") == -1) { msg.channel.send("Invalid action! (Don't forget the brackets)"); return; }
        let action = args.join(" ").substring(0, args.join(" ").indexOf("("));
        let params = args.join(" ").substring(args.join(" ").indexOf("(") + 1, args.join(" ").indexOf(")")).split(",");
        if (params[0] == "") params.pop();
        switch (action) {
            case "invert":
                img.invert();
                break;
            case "grey": case "gray":
                img.greyscale();
                break;
            case "text":
                if (params.length != 3) { msg.channel.send("Invalid parameters!"); return; }
                jimp.loadFont(jimp.FONT_SANS_16_WHITE).then(font => {
                    img.print(font, parseInt(params[0]), (params[1]), params[2]);
                    img.write(`./data/leap_${msg.author.id}.png`, () => {
                        msg.channel.send({ file: `./data/leap_${msg.author.id}.png` });
                    });
                });
                return;
            case "rot":
                if (params.length != 1) { msg.channel.send("Invalid parameters!"); return; }
                img.rotate(parseInt(params[0]));
                break;
            case "contain":
                if (params.length != 2) { msg.channel.send("Invalid parameters!"); return; }
                img.contain(parseInt(params[0]), parseInt(params[1]));
                break;
            case "cover":
                if (params.length != 2) { msg.channel.send("Invalid parameters!"); return; }
                img.cover(parseInt(params[0]), parseInt(params[1]));
                break;
            case "resize":
                if (params.length != 2) { msg.channel.send("Invalid parameters!"); return; }
                img.resize(parseInt(params[0]), parseInt(params[1]));
                break;
            case "scale":
                if (params.length != 1) { msg.channel.send("Invalid parameters!"); return; }
                img.scale(parseInt(params[0]));
                break;
            case "scaleToFit":
                if (params.length != 2) { msg.channel.send("Invalid parameters!"); return; }
                img.scaleToFit(parseInt(params[0]), parseInt(params[1]));
                break;
            case "brightness":
                if (params.length != 1) { msg.channel.send("Invalid parameters!"); return; }
                img.brightness(parseInt(params[0]));
                break;
            case "contrast":
                if (params.length != 1) { msg.channel.send("Invalid parameters!"); return; }
                img.contrast(parseInt(params[0]));
                break;
            case "help":
                msg.channel.send("https://i.imgur.com/MVRnpcD.png");
                return;
            default:
                msg.channel.send("Invalid action!");
                return;
        }
        img.write(`./data/leap_${msg.author.id}.png`, () => {
            msg.channel.send({ file: `./data/leap_${msg.author.id}.png` });
        });
    }
}