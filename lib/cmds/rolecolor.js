module.exports = {
    name: ["rolecolor", "rc"],
    desc: "Change your role color! Needs CHANGE NICKNAME permission.",
    permission: "CHANGE_NICKNAME",
    usage: "<color hex/clear>",
    args: 1,
    command: async function (msg, cmd, args) {
        if (args[0] == "clear") {
            await removeColorRoles(msg);
            return;
        }
        await deleteEmptyRoles(msg);
        let hex = hexToRgb(args[0].substring(1));
        if (hex == null) { msg.channel.send("Invalid hex!"); return; }
        let role = await msg.guild.roles.find("name", args[0].toUpperCase());
        if (role == null) {
            await msg.guild.createRole({ name: args[0].toUpperCase(), color: [hex.r, hex.g, hex.b], permissions: 0, position: 4, mentionable: false, hoist: false }, `RoleColor: created by ${msg.author.username}!`);
            role = await msg.guild.roles.find("name", args[0].toUpperCase());
        }
        if (!msg.member.roles.has(role.id)) {
            await removeColorRoles(msg);
            await msg.member.addRole(role.id).catch(console.error);
        }
    }
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

async function deleteEmptyRoles(msg) {
    msg.guild.roles.forEach((role) => {
        if (role.name.startsWith("#")) {
            if (role.members.size == 0) {
                role.delete("RoleColor: no members!");
            }
        }
    });
}

async function removeColorRoles(msg) {
    msg.member.roles.forEach(async (role) => {
        if (role.name.startsWith("#")) {
            await role.delete("RoleColor: user switched!");
        }
    });
}