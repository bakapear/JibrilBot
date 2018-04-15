let gis = require('g-i-s');

module.exports = {
    name: ["image", "img", "i"],
    desc: "Displays an image from Google.",
    permission: "",
    usage: "<query>",
    args: 1,
    command: function (msg, cmd, args) {
        let opts = {
            searchTerm: msg.content.slice(cmd.length + 1),
            queryStringAddition: '&safe=off'
        };
        gis(opts, function (error, results) {
            if (error) { console.log(error); return; }
            let mod = 0;
            if (msg.content.startsWith(".")) mod = Math.floor(Math.random() * results.length);
            msg.channel.send({
                embed: {
                    image: {
                        url: results[mod].url
                    }
                }
            });
        });
    }
}