let got = require("got");
let file = require("./file.js");
let bin_secret = process.env.BIN_SECRET;

module.exports = {
    name: ["c", "custom"],
    desc: "Add n' remove stuff from your folders n' files. (Ya know the drill!)",
    permission: "",
    usage: "(folder) | (folder) list | <folder> <create/delete/rename/add/rem> <stuff/index>",
    args: 0,
    command: async function (msg, cmd, args) {
        if (!args[0]) {
            let body = await getFromFolder(msg.author.id);
            if (!body) { msg.reply("Folder does not exist!"); return; }
            if (body == -3) { msg.reply("You currently have no folders with content!"); return; }
            if (body == -2) { msg.reply("Folder is empty!"); return; }
            if (body == -1) { msg.reply("Invalid index!"); return; }
            if (body.data.startsWith("http://") || body.data.startsWith("https://")) {
                if (body.data.endsWith(".ogg") || body.data.endsWith(".wav") || body.data.endsWith(".mp3")) {
                    file.command(msg, cmd, [body.data]);
                    return;
                }
                msg.channel.send({
                    embed: {
                        color: 4212432,
                        image: {
                            url: body.data
                        }
                    }
                });
                return;
            }
            msg.reply(body.data);
            return;
        }
        if (args[0] == "list") {
            let body = await getFolders(msg.author.id);
            let folders = "";
            for (let i = 0; i < Object.keys(body).length; i++) {
                folders += `${i}. \`${Object.keys(body)[i]}: ${body[Object.keys(body)[i]]}\`\n`;
            }
            msg.channel.send({
                embed: {
                    color: 4212432,
                    title: msg.author.username + "'s folders",
                    description: folders.substring(0, 2045)
                }
            });
            return;
        }
        if (!args[1] || !isNaN(args[1])) {
            let body = await getFromFolder(msg.author.id, args[0], !isNaN(args[1]) ? parseInt(args[1]) : undefined);
            if (!body) { msg.reply("Folder does not exist!"); return; }
            if (body == -3) { msg.reply("You currently have no folders with content!"); return; }
            if (body == -2) { msg.reply("Folder is empty!"); return; }
            if (body == -1) { msg.reply("Invalid index!"); return; }
            if (body.data.startsWith("http://") || body.data.startsWith("https://")) {
                if (body.data.endsWith(".ogg") || body.data.endsWith(".wav") || body.data.endsWith(".mp3")) {
                    file.command(msg, cmd, [body.data], body.index);
                    return;
                }
                msg.channel.send({
                    embed: {
                        color: 4212432,
                        image: {
                            url: body.data
                        }
                    }
                });
                return;
            }
            msg.reply(body.data);
            return;
        }
        if (args[1] == "list") {
            let body = await getFolderFiles(msg.author.id, args[0]);
            if (!body) { msg.reply("Folder does not exist!"); return; }
            let files = "";
            for (let i = 0; i < body.length; i++) {
                files += `${i}. \`${body[i]}\`\n`;
            }
            if (!files) { msg.reply("Folder is empty!"); return; }
            msg.channel.send({
                embed: {
                    color: 4212432,
                    title: msg.author.username + "'s files in " + args[0],
                    description: files.substring(0, 2045)
                }
            });
            return;
        }
        if (args[1] == "create") {
            let body = await createFolder(msg.author.id, args[0]);
            if (!body) { msg.reply("Folder already exists!"); return; }
            msg.reply("Created " + args[0] + "!");
            return;
        }
        if (args[1] == "delete") {
            let body = await deleteFolder(msg.author.id, args[0]);
            if (!body) { msg.reply("Folder does not exist!"); return; }
            msg.reply("Deleted " + args[0] + "!");
            return;
        }
        if (args[1] == "rename") {
            if (!args[2]) { msg.reply("Please give a new name for the folder"); return; }
            let body = await renameFolder(msg.author.id, args[0], args[2]);
            if (!body) { msg.reply("Folder does not exist!"); return; }
            msg.reply("Renamed " + args[0] + " to " + body + "!");
            return;
        }
        if (args[1] == "add") {
            if (!args[2]) { msg.reply("Please give something to add"); return; }
            let folder = args[0];
            args.splice(0, 2);
            let body = await addToFolder(msg.author.id, folder, args.join(" "));
            if (!body) { msg.reply("Folder does not exist!"); return; }
            msg.reply("Added " + (body - 1) + ". to " + folder + "!");
            return;
        }
        if (args[1] == "rem") {
            if (!args[2] || isNaN(args[2])) { msg.reply("Please give a valid index to remove"); return; }
            let body = await removeFromFolder(msg.author.id, args[0], parseInt(args[2]));
            if (!body) { msg.reply("Folder does not exist!"); return; }
            if (body == -2) { msg.reply("Folder is empty!"); return; }
            if (body == -1) { msg.reply("Invalid index!"); return; }
            msg.reply("Removed " + parseInt(args[2]) + ". from " + args[0] + "!");
            return;
        }
    }
}

async function fetchDatabase() {
    let url = bin_secret;
    let body = (await got(url, {
        json: true
    })).body;
    return body;
}

async function updateDatabase(data) {
    let url = bin_secret;
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
    let body = await fetchDatabase();
    if (!body) body = {};
    if (!body.hasOwnProperty(user)) body[user] = {};
    if (body[user].hasOwnProperty(folder)) return false;
    body[user][folder] = [];
    await updateDatabase(body);
    return true;
}

async function deleteFolder(user, folder) {
    let body = await fetchDatabase();
    if (!body) body = {};
    if (!body.hasOwnProperty(user)) body[user] = {};
    if (!body[user].hasOwnProperty(folder)) return false;
    delete body[user][folder];
    await updateDatabase(body);
    return true;
}

async function renameFolder(user, folder, name) {
    let body = await fetchDatabase();
    if (!body) body = {};
    if (!body.hasOwnProperty(user)) body[user] = {};
    if (!body[user].hasOwnProperty(folder)) return false;
    body[user][name] = body[user][folder];
    delete body[user][folder];
    await updateDatabase(body);
    return name;
}

async function addToFolder(user, folder, stuff) {
    let body = await fetchDatabase();
    if (!body) body = {};
    if (!body.hasOwnProperty(user)) body[user] = {};
    if (!body[user].hasOwnProperty(folder)) return false;
    body[user][folder].push(stuff);
    await updateDatabase(body);
    return body[user][folder].length;
}

async function removeFromFolder(user, folder, index) {
    let body = await fetchDatabase();
    if (!body) body = {};
    if (!body.hasOwnProperty(user)) body[user] = {};
    if (!body[user].hasOwnProperty(folder)) return false;
    if (!body[user][folder].length) return -2;
    if (index < 0 || index >= body[user][folder].length) return -1;
    body[user][folder].splice(index, 1);
    await updateDatabase(body);
    return true;
}

async function getFromFolder(user, folder, index) {
    let body = await fetchDatabase();
    if (!body) body = {};
    if (!body.hasOwnProperty(user)) body[user] = {};
    if (!folder) {
        let folders = [];
        for (let i = 0; i < Object.keys(body[user]).length; i++) {
            if (body[user].hasOwnProperty(Object.keys(body[user])[i]) && body[user][Object.keys(body[user])[i]].length)
                folders.push(Object.keys(body[user])[i]);
        }
        if (!folders.length) return -3;
        folder = folders[Math.floor(Math.random() * folders.length)];
    }
    if (!body[user].hasOwnProperty(folder)) return false;
    if (!body[user][folder].length) return -2;
    if (index == undefined) index = Math.floor(Math.random() * body[user][folder].length);
    if (index < 0 || index >= body[user][folder].length) return -1;
    return { data: body[user][folder][index], index: index };
}

async function getFolders(user) {
    let body = await fetchDatabase();
    if (!body) body = {};
    if (!body.hasOwnProperty(user)) body[user] = {};
    let output = {};
    for (let i = 0; i < Object.keys(body[user]).length; i++) {
        output[Object.keys(body[user])[i]] = body[user][Object.keys(body[user])[i]].length;
    }
    return output;
}

async function getFolderFiles(user, folder) {
    let body = await fetchDatabase();
    if (!body) body = {};
    if (!body.hasOwnProperty(user)) body[user] = {};
    if (!body[user].hasOwnProperty(folder)) return false;
    return body[user][folder];
}