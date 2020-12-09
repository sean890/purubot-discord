const path = require('path');

module.exports = {
    name: 'genshin_infolist',
    description: "list out all keywords available for ~g info",
    execute(Discord, message) {

        var fs = require('fs');

        // compile keywords available in file: ./user-given-data/genshin_info_keywords.json
        // console.log('searching for json file');
        // let rawdata = fs.readFileSync(path.resolve(__dirname,"user-given-data","genshin_info_keywords.json"));
        // let genshin_info_keywords = JSON.parse(rawdata);
        // var keywords_string = "";
        // for (var i = 0; i < genshin_info_keywords.length; i++) {
        //     keywords_string += "ID: " + genshin_info_keywords[i].id + " - " + genshin_info_keywords[i].keyword+"\n";
        // }

        // compile keywords available in file: ./user-given-data/genshin_info_keywords.csv
        const parse = require('csv-parse');
        var parser = parse({ columns: true, delimiter: "|" }, function (err, genshin_info_keywords) {
            var keywords_string = "";
            for (var i = 0; i < genshin_info_keywords.length; i++) {
                keywords_string += "ID: " + genshin_info_keywords[i].id + " - " + genshin_info_keywords[i].keyword + "\n";
            }
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
                    name: "Full list of keywords available in paimon's database",
                    value: keywords_string + "\nType `~g info [ID]` to fetch the corresponding information."
                });

            message.channel.send(embed);
            return;
        });

        // execute parser function
        fs.createReadStream(path.resolve(__dirname, "user-given-data", "genshin_info_keywords.csv")).pipe(parser);
    }
}
