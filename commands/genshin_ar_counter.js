module.exports = {
    name: 'genshin_ar_counter',
    description: "command for calculating dates of higher achieving ARs (adventure rank) for genshin impact",
    execute(Discord, message, args) {
        typeof ar; // user's AR (adventure rank)
        typeof exp; // user's current exp
        try {
            ar = args[1];
            exp = args[2];
        } catch {}
        console.log("ar="+ar);
        console.log("exp="+exp);
        
        if (typeof ar === 'undefined') {
            console.log('ar is undefined');
            return;
        }

        // read in json data for AR information
        const fs = require('fs');
        let rawdata = fs.readFileSync(__dirname+"\\"+"genshin-data"+"\\"+"ar_levels.json");
        let levels = JSON.parse(rawdata);
        console.log(levels);
        console.log(levels[0]);
        console.log(levels[0].exp);

        // if exp === 'undefined', just calculate assuming exp = 0
        if (typeof exp === 'undefined') {
            console.log('exp is undefined, but its okay!');

            // calculation logic here
            let days = new Array(5);
            var level = parseInt(ar);
            var exp_counter = parseInt(levels[level-1].total); // accumulative exp
            var day_counter = 0; // accumulative days
            var array_pos = 0; // array position for days array
            var exp
            while(array_pos != 5) {
                exp_counter += 2480;
                day_counter += 1;
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
                name: "Days to hit the corresponding AR levels",
                value: "Assuming you do all commissions, spend resin, and 10 weis\nar1\nar2"
            });

            message.channel.send(embed);
            return;
        }
        

        
    }
}
