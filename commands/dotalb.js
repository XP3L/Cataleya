module.exports = {
  name: "dotalb",
  description: "Retrieve DOTA 2 Leaderboard by Region and Country",
  args: true,
  usage: "<region>",
  async execute(message, args) {
    const fetch = require("node-fetch");
    const Discord = require("discord.js");
    const { footer, icon } = require("../config.json");

    let region = args;

    try {
      const body = await fetch(
        "http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=" +
          region
      )
        .then(response => response.json())
        .catch(error => console.error("Error:", error));

      console.log(body.leaderboard);

      const countryRequest = new Discord.RichEmbed()
        .setColor("#0099ff")
        .setDescription("What Country do you want me to retrieve?");

      message.channel.send(countryRequest);

      const filter = m => m.author.id === message.author.id;
      const collector = message.channel.createMessageCollector(filter, {
        max: 1
      });
      let country = "";

      collector.on("collect", m => {
        country = m.content;
      });

      collector.on("end", collected => {
        body.leaderboard.forEach(element => {
          if (element.country == country.toLowerCase()) {
            console.log(element.name);
            const reply = new Discord.RichEmbed()
              .setColor("#0099ff")
              .setDescription("Success");
              message.channel.send(reply);
          } else {
            const reply = new Discord.RichEmbed()
              .setColor("#0099ff")
              .setDescription("I couldn't find that country 😞");
              message.channel.send(reply);
          }
        });
      });
    } catch (error) {
      console.error(error);
    }
  }
};
