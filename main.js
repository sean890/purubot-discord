require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = '-';

const fs = require('fs');

const db = require('./models/index.js');

// db.genshin_info.findOrCreate({where: {keyword: "paimon", content: "paimon ichiban kawaii owo"}});

db.genshin_info.findAll()
    .then(function(info) {
        var rawdata = JSON.stringify(info, null, 2);
        var json_info = JSON.parse(rawdata);
        console.log(json_info[0].id);
        console.log(json_info[0].keyword);
        console.log(json_info[0].content);
    });



client.commands = new Discord.Collection();

// reading from commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // console.log(file);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('puru-testing-bot is online');
});

client.on('message', message => {
    if(message.author.bot) return;

    if(message.content.startsWith(prefix)) {
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(prefix.length)
            .split(/ +/);
        // console.log(CMD_NAME); // log
        // console.log(args); // log

        // input validator
        // const REGEX = /^[0-9a-zA-Z]+$/;
        // if (!CMD_NAME.match(REGEX)) {
        //     // console.log('CMD_NAME is invalid');
        //     return;
        // }
        // for (var i = 0; i < args.length; i++) {
        //     if (!args[i].match(REGEX)) {
        //         // console.log('args[' + i + '] is invalid');
        //         return;
        //     }
        // }

        /* command: ~p */
        if(CMD_NAME === 'p') {
            client.commands.get('emote').execute(client, message, args);
        }
        /* command: ~genshin */
        else if (CMD_NAME === 'genshin' || CMD_NAME === 'g') {
            const genshin_args = args[0]; // fetch the argument after -genshin

            /* command: ~genshin ar */
            if(genshin_args === 'ar') {
                client.commands.get('genshin_ar_counter').execute(Discord, client, message, args);
            }
            /* command: ~genshin info */
            else if (genshin_args === 'info') {
                client.commands.get('genshin_info').execute(Discord, client, message, args);
            }
            /* command: ~genshin infolist */
            else if (genshin_args === 'infolist') {
                client.commands.get('genshin_infolist').execute(Discord, message);
            }
            /* command: ~genshin add info */
            else if (genshin_args === 'add' && args[1] === 'info') {
                client.commands.get('genshin_add_info').execute(Discord, client, message, args);
            }
            /* command: ~genshin weapon */
            else if (genshin_args === 'weapon' || genshin_args === 'w') {
                client.commands.get('genshin_weapon').execute(Discord, client, message, args);
            }
            /* help command for: ~genshin */
            else {
                client.commands.get('genshin_help').execute(Discord, message);
            }
        }
    }

});




//last line of the file
client.login(process.env.DISCORDJS_BOT_TOKEN);