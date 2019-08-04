module.exports = {
  name: "dotalb",
  description: "Retrieve DOTA 2 Leaderboard by Region and Country",
  args: true,
  usage: "<region>",
  async execute(message, args) {
    const fetch = require("node-fetch");
    const Discord = require("discord.js");
    const client = new Discord.Client();

    let region = args;

    try {
      const body = await fetch(
        "http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=" +
          region
      )
        .then(response => response.json())
        .catch(error => console.error("Error:", error));

      //console.log(body.leaderboard);

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

        //time conversions and some data beautification
        let nextUpdate = convertTime(body.next_scheduled_post_time);
        let lastUpdated = convertTime(body.time_posted);
        let currentServerTime = convertTime(body.server_time);
        let richTitle = "These are the top players in :flag_"+ country.toLowerCase()+":";

        let results = [];
        body.leaderboard.forEach(element => {
          if (element.country == country.toLowerCase()) {
            //console.log(element.name);
            results.push(element.rank + " - " + element.name);
          }
        });
        if (!Array.isArray(results) || !results.length) {
          const reply = new Discord.RichEmbed()
            .setColor("#0099ff")
            .setDescription("I couldn't find that country 😞");
          message.channel.send(reply);
        } else {
          const reply = new Discord.RichEmbed()
            .setColor("#0099ff")
            .setTitle(richTitle)
            .addField("Last Updated", lastUpdated, true)
            .addField("Next Update", nextUpdate, true)
            .addField("Current Time", currentServerTime, true)
            .setDescription(results);
          message.channel.send(reply);
        }
      });
    } catch (error) {
      console.error(error);
    }

    //unix time stamp converter
    function convertTime(unixStamp) {
      if (unixStamp != "" && unixStamp != undefined) {
        var a = new Date(unixStamp * 1000);

        var months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        return date + " " + month + " " + year + " " + hour + ":" + min;
      } else {
        return "Unavailable";
      }
    }
  }
};
