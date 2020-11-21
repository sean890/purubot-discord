const EXP_PER_DAY = 2480;
const MAX_LEVEL = 53;
const NUM_LEVELS_COUNTED = 10;

module.exports = {
    name: 'genshin_ar_counter',
    description: "command for calculating dates of higher achieving ARs (adventure rank) for genshin impact",
    execute(Discord, client, message, args) {
        typeof ar; // user's AR (adventure rank)
        typeof exp; // user's current exp
        try {
            ar = parseInt(args[1]);
            exp = parseInt(args[2]);
        } catch {}
        console.log("ar="+ar);
        console.log("exp="+exp);

        // if ar input is not an integer, abort
        if (!Number.isInteger(ar)) {
            console.log('abort ar');
            return;
        }
        // if exp input is given and not an integer, abort
        else if (!Number.isNaN(exp) && !Number.isInteger(exp)) {
            console.log('abort exp');
            return;
        }
        // if ar input is over the max level available in database
        else if (ar >= MAX_LEVEL) {
            console.log('ar input is more than max AR');
            return;
        }

        // read in json data for AR information
        const fs = require('fs');
        let rawdata = fs.readFileSync(__dirname+"\\"+"genshin-data"+"\\"+"ar_levels.json");
        let ar_levels_json = JSON.parse(rawdata);

        // calculation logic here
        let output_levels = new Array(NUM_LEVELS_COUNTED); // array for user output
        let output_days = new Array(NUM_LEVELS_COUNTED); // array for user output

        // variables for iteration
        var curr_level = ar; // current level being iterated
        var curr_total_exp = parseInt(ar_levels_json[curr_level-1].total); // current accumulative exp
        var next_total_exp = parseInt(ar_levels_json[curr_level].total); // accumulative exp needed to hit next level
        var day_counter = 0; // accumulative days
        var pos = 0; // array position for days array

        // scenario 1: exp === 'undefined', calculate assuming exp = 0
        if (Number.isNaN(exp)) {
            console.log('exp = 0');
            exp = 0;
        }
        // scenario 2: exp is given, calculate with current exp given
        else {
            console.log('else hit');
            // if the current exp given exceed the cap of the exp of the current level, it's an invalid exp and abort
            if (exp >= parseInt(ar_levels_json[ar-1].exp)) {
                console.log('exp invalid');
                return;
            }
            curr_total_exp += exp;
        }

        // make sure to stop also if ar level exceeds what is stored in database
        while(pos != NUM_LEVELS_COUNTED && curr_level < MAX_LEVEL) {
            curr_total_exp += EXP_PER_DAY;
            day_counter += 1;

            // a level up occured
            if (curr_total_exp >= next_total_exp) {
                // updating variables
                // add ar level & day counter into the output arrays
                curr_level += 1;
                output_levels[pos] = curr_level;
                output_days[pos] = day_counter;
                pos += 1;
                
                if (curr_level < MAX_LEVEL) {
                    curr_total_exp = parseInt(ar_levels_json[curr_level-1].total);
                    next_total_exp = parseInt(ar_levels_json[curr_level].total);
                }
            }
        }

        // prepare string with ar info
        var info_string = "";
        var i;
        for (i = 0; i < pos; i++) {
            info_string += "AR " + output_levels[i] + " - " + output_days[i] + " days\n";
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
            value: "Calculating starting from AR "+ ar + " - " + exp + "/" + ar_levels_json[ar-1].exp +"\n\n" + info_string + "\nCalculations are exp gained purely from daily commissions, resin and 10 wei hilichurls, and assuming you do all of them."
        });

        message.channel.send(embed);
        return;
        
    }
}
