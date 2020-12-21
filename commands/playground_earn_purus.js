const { ADDRCONFIG } = require('dns');
const { features, exitCode } = require('process');
const path = require('path');

// fuse.js
const FUSE_SCORE_THRESHOLD = 0.3; // a search result must be lower than this to be qualified
const Fuse = require('fuse.js');
var fs = require('fs');

var rub_msg = [
    "You rubbed paimon until paimon turns shiny.",
    "You rubbed paimon hard.",
    "You rub paimon, paimon is happy."
]

var shake_msg = [
    "You shake paimon, paimon feels dizzy.",
    "You shaked paimon hard and purus started dropping out.",
    "You desperately shake paimon in hope of purus coming out."
]

module.exports = {
    name: 'playground_earn_purus',
    description: "playground command: earn some purus",
    execute(Discord, client, message, args, db) {

        // if args[1] is undefined means the user only typed "p!earn" which means we display the help message
        if (typeof args[0] === 'undefined') {
            client.commands.get('playground_earn_help').execute(Discord, message);
            return;
        }
        
        var misc_message = "";

        if (args[0].toLowerCase() == "rub") {
            misc_message += "You rubbed paimon"
        }

        // parsing database table "playground_profile_purus"
        db.playground_profile_purus.findAll({
            where: {
                user_id: message.author.id
            }
        }).then(function (info) {

            var rawdata = JSON.stringify(info, null, 2);
            var profile_json_info = JSON.parse(rawdata);

            console.log(profile_json_info);
            console.log(profile_json_info[0]);

            var purus = 0;

            // if user isn't listed on database yet, counted as 0
            if (typeof profile_json_info[0] != 'undefined') {
                try {
                    purus += parseInt(profile_json_info[0].purus);
                    // console.log(input);
                } catch { }
            }

            // creating embed message for discord
            const embed = new Discord.MessageEmbed()
                .setColor(0xffebfc)
                /*
                * Takes a Date object, defaults to current date.
                */
                .setURL("https://discord.js.org/#/docs/main/v12/class/MessageEmbed")
                .setDescription(`You have **${purus}** purus.`)

            message.channel.send(embed);
            return;
        });
    }
}
