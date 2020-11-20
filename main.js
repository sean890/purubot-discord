require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = '-';

const fs = require('fs');

client.commands = new Discord.Collection();

// reading from commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('puru bot is online');
});

client.on('message', message => {
    if(message.author.bot) return;

    if(message.content.startsWith(prefix)) {
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(prefix.length)
            .split(/ +/);
        console.log(CMD_NAME); // log
        console.log(args); // log

        if(CMD_NAME === 'p') {
            client.commands.get('emote').execute(client, message, args);
        }
        else if(CMD_NAME === 'wish') {
            client.commands.get('wish').execute(Discord, client, message, args);
        }
    }

});




//last line of the file
client.login(process.env.DISCORDJS_BOT_TOKEN);