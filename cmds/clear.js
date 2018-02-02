module.exports = {
    name: ["clear"],
    desc: "Deletes 100 Messages. Works only if you have the permission \`MANAGE_MESSAGES\`.",
    permission: "MANAGE_MESSAGES",
    usage: "",
    needargs: false,
    command: function (boot, msg, cmd, args) {
        msg.channel.fetchMessages().then(msgs => {
            msg.channel.bulkDelete(msgs);
        });
    }
}