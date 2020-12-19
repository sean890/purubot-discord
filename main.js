require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = 'protop';

const fs = require('fs');
const path = require('path');

const db = require('./models/index.js');

client.commands = new Discord.Collection();

// admin/contributor verification to use add/delete commands
function validPermissions(id) {
    let rawdata = fs.readFileSync(path.resolve(__dirname, "contributors-data", "contributors-id.json"));
    let id_json = JSON.parse(rawdata);

    for (var i = 0; i < id_json.length; i++) {
        if (id === id_json[i].id) {
            return true;
        }
    }
    return false;
}

// reading from commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // console.log(file);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('paimon-prototype is online');
});

client.on('message', message => {
    if (message.author.bot) return;

    if (message.content.startsWith(prefix)) {
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
        if (CMD_NAME === 'uru') {
            client.commands.get('emote').execute(client, message, args, db);
        }
        else if (CMD_NAME === '!id') {
            client.commands.get('display_user_id').execute(client, message, args, db);
        }
        /* command: ~genshin */
        else if (CMD_NAME === '!' || CMD_NAME === 'aimon!') {
            const genshin_args = args[0]; // fetch the argument after -genshin

            /* command: ~genshin ar */
            if (genshin_args === 'ar') {
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
            /* command: ~genshin character */
            else if (genshin_args === 'character' || genshin_args === 'c') {
                client.commands.get('genshin_character').execute(Discord, client, message, args, db);
            }
            /* command: ~genshin artifact */
            else if (genshin_args === 'artifact' || genshin_args === 'a') {
                client.commands.get('genshin_artifact').execute(Discord, client, message, args, db);
            }

            /* Admin and contributors only commands */
            else if (validPermissions(message.author.id)) {
                /* command: ~genshin add weapon */
                if ((genshin_args === 'add') && (args[1] === 'w' || args[1] === 'weapon')) {
                    client.commands.get('genshin_add_weapon').execute(Discord, client, message, db);
                }
                /* command: ~genshin delete weapon */
                else if ((genshin_args === 'delete') && (args[1] === 'w' || args[1] === 'weapon')) {
                    client.commands.get('genshin_delete_weapon').execute(Discord, client, message, args, db);
                }
                /* command: ~genshin add character */
                else if ((genshin_args === 'add') && (args[1] === 'c' || args[1] === 'character')) {
                    client.commands.get('genshin_add_character').execute(Discord, client, message, db);
                }
                /* command: ~genshin delete character */
                else if ((genshin_args === 'delete') && (args[1] === 'c' || args[1] === 'character')) {
                    client.commands.get('genshin_delete_character').execute(Discord, client, message, args, db);
                }
                /* command: ~genshin add character */
                else if ((genshin_args === 'add') && (args[1] === 'a' || args[1] === 'artifact')) {
                    client.commands.get('genshin_add_artifact').execute(Discord, client, message, db);
                }
                /* command: ~genshin delete character */
                else if ((genshin_args === 'delete') && (args[1] === 'a' || args[1] === 'artifact')) {
                    client.commands.get('genshin_delete_artifact').execute(Discord, client, message, args, db);
                }
            }

            /* help command for: ~genshin */
            else {
                client.commands.get('genshin_help').execute(Discord, message);
            }
        }
        else if (CMD_NAME === '!kiss' || CMD_NAME === '!hug' || CMD_NAME === '!lick' || CMD_NAME === '!pat') {
            client.commands.get('mic').execute(Discord, client, message, CMD_NAME, args);
        }
    }

});




//last line of the file
client.login(process.env.DISCORDJS_BOT_TOKEN);