module.exports = {
  name: "startchat",
  description: "start a new chat",
  args: false,
  async execute(message, args) {
    //check if user is in another chat and if so prompt disconnection
    //purge chat
    //generate unique chat code
    //enter pool
    //connect to stranger
    const Discord = require("discord.js");
    const client = new Discord.Client();

    message.author.send('Hi!');

    client.on("message", message => {
        message.author.send('Hello again!');
        
      });


  }
};
