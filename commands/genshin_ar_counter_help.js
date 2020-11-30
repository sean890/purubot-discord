const path = require('path');

module.exports = {
    name: 'genshin_ar_counter_help',
    description: "help manual for using ~genshin ar commands",
    execute(Discord, message) {

        // fetch help message string from file
        var fs = require('fs');
        fs.readFile(path.resolve(__dirname, "genshin-data", "genshin_ar_counter_help.txt"), 'utf8', function(err, data) {
            // creating embed message for discord
            const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL())
            .setColor(0xffebfc)
            .setFooter("Made by puru", "https://cdn.discordapp.com/attachments/779164026461618196/779228200357855242/JPEG_20200817_214526.jpg")
            /*
            * Takes a Date object, defaults to current date.
            */
            .setTimestamp()
            .setURL("https://discord.js.org/#/docs/main/v12/class/MessageEmbed")
            .addFields({
                name: "Help manual",
                value: String(data)
            });

            message.channel.send(embed);
            return;
        });
    }
}
