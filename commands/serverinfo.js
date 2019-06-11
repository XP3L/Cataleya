module.exports = {
	name: 'serverinfo',
    description: 'get information about the current server',
    args:false,
	execute(message, args) {
        const Discord = require("discord.js");
        const { footer, icon } = require("../config.json");

        const serverInfoEmbed = new Discord.RichEmbed()
		.setColor('#0099ff')
		.setTitle('Server Information')
		.setAuthor('Cataleya', 'https://i.imgur.com/giku2RZ.png', 'https://github.com/XP3L/Cataleya')
		.addField('Server Name', message.guild.name, true)
		.addField('Server Owner', message.guild.owner, true)
		.addField('Total Members', message.guild.memberCount, true)
		.addField('Created Date', message.guild.createdAt, true)
		.addField('Server Region', message.guild.region, true)
		.addField('AFK Channel', message.guild.afkChannel)
		.addField('Verified Server?', message.guild.verified)
		.addField('Verification Level', message.guild.verificationLevel)
		.setImage(message.guild.iconURL)
		.setTimestamp()
		.setFooter(footer, icon);

		message.channel.send(serverInfoEmbed);
	},
};