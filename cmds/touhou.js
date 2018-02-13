const fs = require('fs');
let config = "./data/touhou.cfg";
module.exports = {
    name: ["touhou", "th"],
    desc: "For Ahmad. Add Pics: .touhou add <url> | Remove Pics: .touhou rem <num/clear> | List of all Pics: .touhou list",
    permission: "",
    usage: "(add/rem/list) (url/[num/clear])",
    args: 0,
    command: function (msg, cmd, args) {
        let touhou = [];
        fs.readFile(config, 'utf8', function (err, data) {
            if (err) { console.log(err); return; }
            let content = data.split("\r\n");
            content.forEach(item => { touhou.push(item); });
            if (args[0] == "add") {
                if (args.length < 2) { msg.channel.send("Pls give url."); return; }
                let stats = fs.statSync(config);
                let prefix = "\r\n";
                if (stats.size == 0) { prefix = "" }
                fs.appendFile(config, prefix + args.join("").slice(3), function (err) {
                    if (err) { console.log(err); return; }
                    msg.channel.send("Added that to ya list! JUST HOPE ITS A VALID IMAGE FILE!");
                });
                return;
            }
            if (touhou.length < 1 || touhou[0] == "") {
                msg.channel.send("No touhou stuff found! Add them with .touhou add <image url>")
                return;
            }
            if (args[0] == "rem") {
                if (args.length < 2) { msg.channel.send("Pls give num."); return; }
                if (args[1] == "clear") {
                    fs.writeFile(config, "", function (err) {
                        if (err) { console.log(err); return; }
                    });
                }
                else if (isNaN(args[1])) msg.channel.send("I said number!");
                else {
                    var darray = data.split('\n');
                    var removed = darray.splice(parseInt(args[1]), 1);
                    var newdata = darray.join('\n');
                    fs.writeFile(config, newdata, function (err) {
                        if (err) { console.log(err); return; }
                    });
                }
                return;
            }
            if (args[0] == "list") {
                let stuff = [];
                touhou.forEach((item, num) => {
                    stuff.push(`${num}. \`${item}\`\n`);
                });
                msg.channel.send({
                    embed: {
                        color: 14506163,
                        title: "List",
                        description: stuff.join("").substring(0, 2045)
                    }
                });
                return;
            }
            const rnd = Math.floor(Math.random() * touhou.length);
            msg.channel.send({
                embed: {
                    image: {
                        url: touhou[rnd]
                    }
                },
            });
        });
    }
}