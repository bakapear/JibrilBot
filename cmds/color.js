const request = require("request");

module.exports = {
    name: ["color"],
    desc: "Displays a color.",
    permission: "",
    usage: "(color)",
    needargs: false,
    command: function (boot, msg, cmd, args) {
        let link = `http://www.colourlovers.com/api/colors?format=json&keywords=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`;
        if (args == "") {
            link = `http://www.colourlovers.com/api/colors/random?format=json`
        }
        request({
            url: link,
            json: true
        }, function (error, response, body) {
            if (body.length < 1) {
                msg.channel.send("Nothing found!");
                return;
            }
            let mod = 0;
            if (msg.content.startsWith(".")) mod = Math.floor(Math.random() * body.length);
            let colorint = (body[mod].rgb.red << 16) + (body[mod].rgb.green << 8) + (body[mod].rgb.blue);
            msg.channel.send({
                embed: {
                    color: colorint,
                    title: body[mod].title,
                    description: `**Hex** #${body[mod].hex}\n**R** ${body[mod].rgb.red} **G** ${body[mod].rgb.green} **B** ${body[mod].rgb.blue}\n**H** ${body[mod].hsv.hue} **S** ${body[mod].hsv.saturation} **V** ${body[mod].hsv.value}`,
                    image: {
                        url: body[mod].imageUrl
                    }
                }
            });
        });
    }
}