const got = require("got");
const bin_secret = process.env.BIN_SECRET;

module.exports = {
    name: ["db"],
    desc: "Add your own images to storage and display 'em randomly or by index.",
    permission: "",
    usage: "add <imageurl> | rem <index> | clear | list | <index>",
    args: 0,
    command: async function (msg, cmd, args) {
        if (args[0] == "add") {
            if (!args[1]) { msg.channel.send("Please give an imageurl."); return; }
            var length = await addImage(msg.author.id, args[1]);
            msg.channel.send("Added to your storage @ " + (length - 1));
            return;
        }
        if (args[0] == "list") {
            var body = await getImages(msg.author.id);
            if (!body.length) { msg.channel.send("Your storage is empty!"); return; }
            var list = "";
            for (var i = 0; i < body.length; i++) {
                list += `${i}. ${body[i]}\n`
            }
            msg.channel.send({
                embed: {
                    color: 9052163,
                    title: msg.author.username + "'s Storage",
                    description: list.substring(0, 2045)
                }
            });
            return;
        }
        if (args[0] == "rem") {
            if (!args[1] || isNaN(args[1])) { msg.channel.send("Please give a valid index."); return; }
            if (await removeImage(msg.author.id, parseInt(args[1]))) {
                msg.channel.send("Removed @ " + parseInt(args[1]));
            }
            else {
                msg.channel.send("Invalid index!");
            }
            return;
        }
        if (args[0] == "clear") {
            await clearImages(msg.author.id);
            msg.channel.send("Cleared your storage!");
            return;
        }
        if (!isNaN(args[0])) {
            var body = await getImages(msg.author.id);
            if (!body.length) { msg.channel.send("Your storage is empty!"); return; }
            if (parseInt(args[0]) < 0 || parseInt(args[0]) >= body.length) { msg.channel.send("Invalid index!"); return; }
            msg.channel.send({
                embed: {
                    image: {
                        url: body[parseInt(args[0])]
                    },
                    footer: {
                        text: `${msg.author.username} @ ${parseInt(args[0])}`
                    }
                }
            });
        }
        else {
            var body = await getImages(msg.author.id);
            if (!body.length) { msg.channel.send("Your storage is empty!"); return; }
            const mod = Math.floor(Math.random() * body.length);
            msg.channel.send({
                embed: {
                    image: {
                        url: body[mod]
                    },
                    footer: {
                        text: `${msg.author.username} @ ${mod}`
                    }
                }
            });
        }
    }
}

async function addImage(user, data) {
    var body = await fetchStorage();
    if (!body.hasOwnProperty(user)) body[user] = [];
    body[user].push(data);
    updateStorage(body);
    return body[user].length;
}

async function removeImage(user, index) {
    var body = await fetchStorage();
    if (index < 0 || index >= body[user].length) return false;
    if (!body.hasOwnProperty(user)) body[user] = [];
    body[user].splice(index, 1);
    updateStorage(body);
    return true;
}

async function clearImages(user) {
    var body = await fetchStorage();
    if (!body.hasOwnProperty(user)) body[user] = [];
    body[user] = [];
    updateStorage(body);
}

async function getImages(user) {
    var body = await fetchStorage();
    if (!body.hasOwnProperty(user)) body[user] = [];
    return body[user];
}

async function fetchStorage() {
    var url = "http://api.jsonbin.io/b/5ac32d45656b6e0b857c1a57";
    var body = (await got(url + "/latest", {
        json: true,
        headers: {
            "secret-key": bin_secret
        }
    })).body;
    return body;
}

async function updateStorage(data) {
    var url = "http://api.jsonbin.io/b/5ac32d45656b6e0b857c1a57";
    got.put(url, {
        json: true,
        headers: {
            "secret-key": bin_secret
        },
        body: data
    });
}