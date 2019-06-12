module.exports = {
  name: "whodis",
  description: "who dat sexy young thang",
  args: false,
  async execute(message, args) {
    const fetch = require("node-fetch");
    const Discord = require("discord.js");
    const { footer, icon } = require("../config.json");

    let randomPage = Math.floor(Math.random() * 100);

    try {
      const body = await fetch(
        "https://api.redtube.com/?data=redtube.Stars.getStarDetailedList&output=json&page=" +
          randomPage
      )
        .then(response => response.json())
        .catch(error => console.error("Error:", error));

      let resultPerPage = body.stars.length;
      let randomStar = Math.floor(Math.random() * resultPerPage);
      let answer = body.stars[randomStar].star.toLowerCase();

      const serverInfoEmbed = new Discord.RichEmbed()
        .setColor("#0099ff")
        .setTitle("Guess the star")
        .setImage(body.stars[randomStar].star_thumb)
        .setTimestamp()
        .setFooter(footer, icon);

      message.channel.send(serverInfoEmbed);

      const filter = m => m.author.id === message.author.id;
      const collector = message.channel.createMessageCollector(filter, {
        max: 1
      });
      let userAnswer = "";

      collector.on("collect", m => {
        userAnswer = m.content;
      });

      collector.on("end", collected => {
        if (userAnswer.toLowerCase() == answer) {
          const result = new Discord.RichEmbed()
            .setColor("#0099ff")
            .setDescription("YAY! you guessed right 🎉");
          message.channel.send(result);
        } else {
          const result = new Discord.RichEmbed()
            .setColor("#0099ff")
            .setDescription("😞 It was actually " + answer);
          message.channel.send(result);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
};
