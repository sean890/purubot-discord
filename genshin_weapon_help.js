const path = require('path');

module.exports = {
    name: 'genshin_weapon_help',
    description: "help manual for using ~g weapon commands",
    execute(Discord, message) {

        var fs = require('fs');

        // compile keywords available in file: ./user-given-data/genshin_info_keywords.csv
        const parse = require('csv-parse');
        var parser = parse({columns: true}, function (err, genshin_info_keywords) {
            
            // fetch help message string from file
            fs.readFile(path.resolve(__dirname, "genshin-data", "genshin_weapon_help.txt"), 'utf8', function(err, data) {
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
        });

        // execute parser function
        fs.createReadStream(path.resolve(__dirname, "user-given-data", "genshin_info_keywords.csv")).pipe(parser);

        
    }
}