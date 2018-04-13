let got = require("got");

module.exports = {
    name: ["color"],
    desc: "Displays a color. If no color is given, a random one will be chosen. If you put a # infront it will convert it to RGB and if you put 3 numbers it will give you the hex value of those.",
    permission: "",
    usage: "(color/#hex/r g b)",
    args: 0,
    command: async function (msg, cmd, args) {
        let link = `http://www.colourlovers.com/api/colors?format=json&keywords=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`;
        if (args == "") {
            link = `http://www.colourlovers.com/api/colors/random?format=json`
        }
        else if (args[0].startsWith("#")) {
            if (hexToRgb(args[0].substring(1)) == null) { msg.channel.send("Invalid hex!"); return; }
            msg.channel.send(`RGB: ${hexToRgb(args[0].substring(1)).r},${hexToRgb(args[0].substring(1)).g},${hexToRgb(args[0].substring(1)).b}`);
            return;
        }
        else if (!isNaN(args[0]) && !isNaN(args[1]) && !isNaN(args[2])) {
            msg.channel.send(`HEX: ${rgbToHex(parseInt(args[0]), parseInt(args[1]), parseInt(args[2]))}`);
            return;
        }
        let body = (await got(link, { json: true })).body;
        if (body.length < 1) { msg.channel.send("Nothing found!"); return; }
        let mod = 0;
        if (msg.content.startsWith(".")) mod = Math.floor(Math.random() * body.length);
        msg.channel.send({
            embed: {
                color: (body[mod].rgb.red << 16) + (body[mod].rgb.green << 8) + (body[mod].rgb.blue),
                title: body[mod].title,
                description: `**Hex** #${body[mod].hex}\n**R** ${body[mod].rgb.red} **G** ${body[mod].rgb.green} **B** ${body[mod].rgb.blue}\n**H** ${body[mod].hsv.hue} **S** ${body[mod].hsv.saturation} **V** ${body[mod].hsv.value}`,
                image: {
                    url: body[mod].imageUrl
                }
            }
        });
    }
}
function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}