require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = '-';

const fs = require('fs');

const db = require('./models/index.js');

// temporary execute
// db.genshin_weapon.findOrCreate({where: {
//     name: "Skyward Harp", 
//     type: "Bow",
//     rarity: "5*",
//     atk: "674",
//     secondary: "CRIT Rate 22.1%",
//     effect: "Increases CRIT DMG by 20/25/30/35/40%. Hits have a 60/70/80/90/100% chance to inflict a small AoE attack, dealing 100% Physical ATK DMG. Can only occur once every 4s.",
//     obtain: "Gacha",
//     image: "https://cdn.discordapp.com/attachments/779649025392640000/786908332891832350/Weapon_Skyward_Blade.png"
// }});

client.commands = new Discord.Collection();

// reading from commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // console.log(file);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('paimon-prototype is online');
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
            client.commands.get('emote').execute(client, message, args, db);
        }
        /* command: ~genshin */
        else if (CMD_NAME === 'genshin' || CMD_NAME === 'g') {
            const genshin_args = args[0]; // fetch the argument after -genshin

            /* command: ~genshin ar */
            if(genshin_args === 'ar') {
                client.commands.get('genshin_ar_counter').execute(Discord, client, message, args);
            }
            // /* command: ~genshin info */
            // else if (genshin_args === 'info') {
            //     client.commands.get('genshin_info').execute(Discord, client, message, args);
            // }
            // /* command: ~genshin infolist */
            // else if (genshin_args === 'infolist') {
            //     client.commands.get('genshin_infolist').execute(Discord, message);
            // }
            // /* command: ~genshin add info */
            // else if (genshin_args === 'add' && args[1] === 'info') {
            //     client.commands.get('genshin_add_info').execute(Discord, client, message, args);
            // }
            /* command: ~genshin weapon */
            else if (genshin_args === 'weapon' || genshin_args === 'w') {
                client.commands.get('genshin_weapon').execute(Discord, client, message, args, db);
            }
            /* command: ~genshin add weapon */
            else if ((genshin_args === 'a' || genshin_args === 'add') && (args[1] === 'w' || args[1] === 'weapon')) {
                client.commands.get('genshin_add_weapon').execute(Discord, client, message, db);
            }
            /* command: ~genshin delete weapon */
            else if ((genshin_args === 'd' || genshin_args === 'delete') && (args[1] === 'w' || args[1] === 'weapon')) {
                client.commands.get('genshin_delete_weapon').execute(Discord, client, message, args, db);
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