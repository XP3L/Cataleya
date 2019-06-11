const fs = require("fs");
const Discord = require("discord.js");
//reading values from the config.json file
const { prefix, token, commandError } = require("./config.json");

const client = new Discord.Client();
//collection to hold the commands
client.commands = new Discord.Collection();

//get the list of command files in that /commands directory
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

// set a new item in the Collection
// with the key as the command name and the value as the exported module
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("message", message => {
  //ignore unwanted messages
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  //return if command is not recognized
  if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName);

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }
    return message.channel.send(reply);
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply(commandError);
  }

});

client.login(token);
