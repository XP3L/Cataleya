module.exports = {
  name: "checkplayer",
  description: "Check if a profile is in good standing",
  args: true,
  usage: "<steam ID>",
  async execute(message, args) {
    const fetch = require("node-fetch");
    const Discord = require("discord.js");
    const { footer, icon, steamAPIKey } = require("../config.json");

    let steamId = args;

    try {
      const body = await fetch(
        "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=" +
          steamAPIKey +
          "&vanityurl=" +
          steamId
      )
        .then(response => response.json())
        .catch(error => console.error("Error:", error));

      if (body.response.success == 1) {
        //if vanity is resolved successfully
        await getProfileDetails(body.response.steamid);
      } else {
        //if it doesnt seem to be a vanity
        await getProfileDetails(steamId);
      }

      // console.log("reply is" + body.response.steamid);
      // message.channel.send(body);
    } catch (error) {
      console.error(error);
    }

    async function getProfileDetails(id) {
      const profileDetails = await fetch(
        "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" +
          steamAPIKey +
          "&steamids=" +
          id
      )
        .then(response => response.json())
        .catch(error => console.error("Error:", error));

      if (profileDetails.response.players.length == 0) {
        const result = new Discord.RichEmbed()
          .setColor("#0099ff")
          .setDescription("Could not find such a user 🤷‍");
        message.channel.send(result);
      } else {
        const banDetails = await fetch(
          "http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=" +
            steamAPIKey +
            "&steamids=" +
            id
        )
          .then(response => response.json())
          .catch(error => console.error("Error:", error));

        let createdDate = "Unavailable";
        if (
          profileDetails.response.players[0].timecreated != "" &&
          profileDetails.response.players[0].timecreated != undefined
        ) {
          var a = new Date(
            profileDetails.response.players[0].timecreated * 1000
          );

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
          createdDate = date + " " + month + " " + year;
        }

        const result = new Discord.RichEmbed()
          .setColor("#0099ff")
          .setTitle("Steam Profile Information")
          .setImage(profileDetails.response.players[0].avatarmedium)
          .addField(
            "Profile Name",
            profileDetails.response.players[0].personaname,
            true
          )
          .addField(
            "Real Name",
            profileDetails.response.players[0].realname == undefined
              ? "Unavailable"
              : profileDetails.response.players[0].realname,
            true
          )
          .addField(
            "Country",
            profileDetails.response.players[0].loccountrycode == undefined
              ? "Unavailable"
              : profileDetails.response.players[0].loccountrycode,
            true
          )
          .addField(
            "Profile Visbility",
            profileDetails.response.players[0].communityvisibilitystate == 3
              ? "Public"
              : "Private",
            true
          )
          .addField("Created Date", createdDate, true)
          .addField(
            "Community Profile",
            profileDetails.response.players[0].profilestate == 1
              ? "Available"
              : "Not Configured",
            true
          )
          .addBlankField()
          .addField(
            "VAC ban status",
            banDetails.players[0].VACBanned == true ? "Active" : "Not Active",
            true
          )
          .addField(
            "Community ban status",
            banDetails.players[0].CommunityBanned == true
              ? "Active"
              : "Not Active",
            true
          )
          .addField(
            "Economy ban status",
            banDetails.players[0].EconomyBan,
            true
          )
          .addField(
            "No. of VAC bans",
            banDetails.players[0].NumberOfVACBans,
            true
          )
          .addField(
            "No. of game bans",
            banDetails.players[0].NumberOfGameBans,
            true
          )
          .addField(
            "Days since last ban",
            banDetails.players[0].DaysSinceLastBan,
            true
          )
          .addBlankField()
          .addField("Link", profileDetails.response.players[0].profileurl, true)
          .setTimestamp()
          .setFooter(footer, icon);
        message.channel.send(result);
      }
    }
  }
};
