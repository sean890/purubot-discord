const { ADDRCONFIG } = require('dns');
const { features, exitCode } = require('process');
const path = require('path');

module.exports = {
    name: 'playground_profile_purus',
    description: "playground command: check your amount of purus you have",
    execute(Discord, client, message, args, db) {

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
