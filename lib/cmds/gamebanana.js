let got = require("got");

module.exports = {
    name: ["gb", "gamebanana"],
    desc: "Shows a submission on gamebanana.",
    permission: "",
    usage: "map/spray/sound/member <query>",
    args: 2,
    command: async function (msg, cmd, args) {
        let types = ["map", "spray", "sound", "member"];
        if (!types.includes(args[0])) { msg.channel.send("Invalid type!"); return; }
        args[0] = args[0].charAt(0).toUpperCase() + args[0].slice(1);
        let body = [];
        let id = 0;
        if (isNaN(args[1])) {
            body = (await got(`https://api.gamebanana.com/Core/List/Like?itemtype=${args[0]}&field=name&match=${encodeURIComponent(args.slice(1).join(" ")).trim()}`, { json: true })).body;
            if (body.length < 1) { msg.channel.send("Nothing found!"); return; }
            let mod = 0;
            if (msg.content.startsWith(".")) mod = Math.floor(Math.random() * body.length);
            id = body[mod].id;
        }
        else {
            id = parseInt(args[1]);
        }
        let fields = "";
        switch (args[0]) {
            case "Map": {
                fields = "name,description,Files().aFiles(),screenshots,Game().name";
                break;
            }
            case "Spray": {
                fields = "name,description,Files().aFiles(),screenshots,Game().name";
                break;
            }
            case "Sound": {
                fields = "name,description,Files().aFiles(),Game().name";
                break;
            }
            case "Member": {
                fields = "name,user_title,Url().sGetAvatarUrl(),postcount";
                break;
            }
        }
        body = (await got(`https://api.gamebanana.com/Core/Item/Data?itemtype=${args[0]}&itemid=${id}&fields=${encodeURIComponent(fields)}`, { json: true })).body;
        if (body.error) { msg.channel.send("ID not found!"); return; }
        let title; let url; let desc; let thumbnail; let footer;
        switch (args[0]) {
            case "Map": {
                if (body[3].length < 20) { msg.channel.send("No information about that submission!"); return; }
                let dlid = Object.keys(body[2])[0];
                body[3] = JSON.parse(body[3]);
                title = body[0];
                url = "https://gamebanana.com/maps/" + id;
                desc = body[1] + `\n\nDownload: [${body[2][dlid]._sFile}](${body[2][dlid]._sDownloadUrl})`;
                thumbnail = "https://files.gamebanana.com/" + body[3][0]._sRelativeImageDir + "/" + body[3][0]._sFile;
                footer = body[4];
                break;
            }
            case "Spray": {
                if (body[3].length < 20) { msg.channel.send("No information about that submission!"); return; }
                let dlid = Object.keys(body[2])[0];
                body[3] = JSON.parse(body[3]);
                title = body[0];
                url = "https://gamebanana.com/sprays/" + id;
                desc = body[1] + `\n\nDownload: [${body[2][dlid]._sFile}](${body[2][dlid]._sDownloadUrl})`;
                thumbnail = "https://files.gamebanana.com/" + body[3][0]._sRelativeImageDir + "/" + body[3][0]._sFile;
                footer = body[4];
                break;
            }
            case "Sound": {
                let dlid = Object.keys(body[2])[0];
                title = body[0];
                url = "https://gamebanana.com/sounds/" + id;
                desc = body[1] + `\n\nDownload: [${body[2][dlid]._sFile}](${body[2][dlid]._sDownloadUrl})`;
                thumbnail = "";
                footer = body[3];
                break;
            }
            case "Member": {
                title = body[0];
                url = "https://gamebanana.com/members/" + id;
                desc = body[1];
                thumbnail = body[2];
                footer = body[3] + " posts in total";
                break;
            }
        }
        msg.channel.send({
            embed: {
                title: title,
                url: url,
                color: 16777060,
                description: desc,
                thumbnail: {
                    url: thumbnail
                },
                footer: {
                    text: footer
                }
            },
        });
    }
}