module.exports = {
    name: ["clear", "prune"],
    desc: "Deletes 100 Messages. Works only if you have the permission \`MANAGE_MESSAGES\`.",
    permission: "MANAGE_MESSAGES",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        msg.channel.fetchMessages().then(msgs => {
            msg.channel.bulkDelete(msgs);
        });
    }
}