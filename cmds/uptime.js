module.exports = {
    name: ["up", "uptime"],
    desc: "Tells you how long I've been running for!",
    permission: "",
	usage: "",
	args: 0,
    command: function (boot, msg, cmd, args) {
        const uptime = new Date(Date.now() - boot);
		let time = [
			uptime.getMonth().toString(),
			(uptime.getDate() - 1).toString(),
			uptime.getHours().toString(),
			uptime.getMinutes().toString(),
			uptime.getSeconds().toString()
		];
		for (i = 0; i < time.length; i++) {
			if(time[i].length == 1) {
				time[i] = "0" + time[i];
			}
		}
		msg.channel.send(`**Uptime:** \`${time[0]}:${time[1]}:${time[2]}:${time[3]}:${time[4]}\``);
		if(time[3] == "13" && time[4] == "37") {
			msg.channel.send("Leet!");
		}
    }
}