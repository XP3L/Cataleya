module.exports = {
  name: "corona",
  description: "Retrieve local and global stats about COVID-19",
  args: false,
  async execute(message) {
    const fetch = require("node-fetch");
    const Discord = require("discord.js");
    const { footer, icon } = require("../config.json");

    try {
      const body = await fetch(
        "http://healthpromo.gov.lk/api/get-current-statistical"
      )
        .then(response => response.json())
        .catch(error => console.error("Error:", error));
      let lastUpdated = "Last updated: " + body.data.update_date_time;
      let local_cases = body.data.local_total_cases;
      let local_deaths = body.data.local_deaths;
      let local_recovered = body.data.local_recovered;
      let local_hospitalized =
        body.data.local_total_number_of_individuals_in_hospitals;
      let local_recoveryRate =
        (parseInt(local_recovered, 10) / parseInt(local_cases, 10)) * 100;
      local_recoveryRate = Math.round(local_recoveryRate * 100) / 100;

      let global_cases = body.data.global_total_cases;
      let global_recovered = body.data.global_recovered;
      let global_deaths = body.data.global_deaths;

      const reply = new Discord.RichEmbed()
        .setColor("#0099ff")
        .setTitle("COVID-19 Situation Report for :flag_lk:")
        .setDescription("Data from the Health Promotion Bureau of Sri Lanka")
        .addField("Total Cases :thermometer_face: ", local_cases, true)
        .addField("Deaths :skull: ", local_deaths, true)
        .addField(
          "Recovered :smiling_face_with_3_hearts: ",
          local_recovered,
          true
        )
        .addField("Hospitalizations :hospital: ", local_hospitalized, true)
        .addField("Recovery Rate :bar_chart: ", local_recoveryRate + "%", true)
        .addBlankField()
        .addField("Global Cases", numberWithCommas(global_cases), true)
        .addField("Global Deaths", numberWithCommas(global_deaths), true)
        .addField("Global Recovered", numberWithCommas(global_recovered), true)
        .setFooter(lastUpdated, icon);

      message.channel.send(reply);
    } catch (error) {
      console.error(error);
    }

    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
