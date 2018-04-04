const got = require("got");
const bin_secret = process.env.BIN_SECRET;
const id = "5ac486f8656b6e0b857c3800";

module.exports = {
    name: ["db"],
    desc: "Gotta git get~",
    permission: "",
    usage: "<folder> | <folder> <create/delete> <name> | <folder> <add/rem> <stuff/index>",
    args: 0,
    command: async function (msg, cmd, args) {
        if (!args[0]) {
            msg.channel.send(await getFromFolder(msg.author.id));
            return;
        }
        if (!args[1]) {
            msg.channel.send(await getFromFolder(msg.author.id, args[0]));
            return;
        }
        if (args[1] == "create") {
            if (!args[2]) { msg.channel.send("Please give a folder name"); return; }
            msg.channel.send(await createFolder(msg.author.id, args[2]));
            return;
        }
        if (args[1] == "delete") {
            if (!args[2]) { msg.channel.send("Please give a folder name"); return; }
            msg.channel.send(await deleteFolder(msg.author.id, args[2]));
            return;
        }
        if (args[1] == "add") {
            if (!args[2]) { msg.channel.send("Please give something to add"); return; }
            msg.channel.send(await addToFolder(msg.author.id, args[0], args[2]));
            return;
        }
        if (args[1] == "rem") {
            if (!args[2] || isNaN(args[2])) { msg.channel.send("Please give a valid index to remove"); return; }
            msg.channel.send(await addToFolder(msg.author.id, args[0], parseInt(args[2])));
            return;
        }
        if(args[0] == "DEBUG") {
            msg.channel.send(await fetchDatabase());
            return;
        }
    }
}

async function fetchDatabase() {
    var url = `https://api.jsonbin.io/b/${id}/latest`;
    var body = (await got(url, {
        json: true,
        headers: {
            "secret-key": bin_secret
        }
    })).body;
    return body;
}

async function updateDatabase(data) {
    var url = `https://api.jsonbin.io/b/${id}/`;
    await got.put(url, {
        json: true,
        headers: {
            "secret-key": bin_secret,
            "content-type": "application/json"
        },
        body: data
    });
}

async function createFolder(user, folder) {
    var body = await fetchDatabase();
    if (!body) body = {};
    if (!body.hasOwnProperty(user)) body[user] = {};
    if (body[user].hasOwnProperty(folder)) return false;
    body[user][folder] = [];
    await updateDatabase(body);
    return true;
}

async function deleteFolder(user, folder) {
    var body = await fetchDatabase();
    if (!body) body = {};
    if (!body.hasOwnProperty(user)) body[user] = {};
    if (!body[user].hasOwnProperty(folder)) return false;
    delete body[user][folder];
    await updateDatabase(body);
    return true;
}

async function addToFolder(user, folder, stuff) {
    var body = await fetchDatabase();
    if (!body) body = {};
    if (!body.hasOwnProperty(user)) body[user] = {};
    if (!body[user].hasOwnProperty(folder)) return false;
    body[user][folder].push(stuff);
    await updateDatabase(body);
    return true;
}

async function removeFromFolder(user, folder, index) {
    var body = await fetchDatabase();
    if (!body) body = {};
    if (!body.hasOwnProperty(user)) body[user] = {};
    if (!body[user].hasOwnProperty(folder)) return false;
    if (index < 0 || index >= body[user][folder].length) return -1;
    body[user][folder].splice(index, 1);
    await updateDatabase(body);
    return true;
}

async function getFromFolder(user, folder, index) {
    var body = await fetchDatabase();
    if (!body) body = {};
    if (!body.hasOwnProperty(user)) body[user] = {};
    var folder = folder || Object.keys(body[user])[Math.floor(Math.random() * body[user].length)];
    if (!body[user].hasOwnProperty(folder)) return false;
    var index = index || Math.floor(Math.random() * body[user][folder].length);
    if (index < 0 || index >= body[user][folder].length) return -1;
    return body[user][folder][index];
}

