const { ADDRCONFIG } = require('dns');
const { features, exitCode } = require('process');

// preparing help message for user
const HELP_MESSAGE = "too complex for paimon, type `~genshin ar` for help manual";
const AR_OVER_MESSAGE = "high and gay AR, no calculations available for you";

const NUMBER_OF_COM_PER_DAY = 4; // number of commissions a day
const RESIN_EXP_PER_DAY = 800 // 160 resin a day = 800 exp

// exp per commission, vary with AR
const EXP_PER_COM_AR12to15 = 175;
const EXP_PER_COM_AR16to24 = 200;
const EXP_PER_COM_AR25to34 = 225;
const EXP_PER_COM_AR35to55 = 250;

const WEI_EXP = 18; // exp given by each wei hilichurl

const MAX_LEVEL = 53; // max level available in the JSON database
const NUM_LEVELS_COUNTED = 10; // program will only count 10 levels ahead for now

module.exports = {
    name: 'genshin_ar_counter',
    description: "command for calculating dates of higher achieving ARs (adventure rank) for genshin impact",
    execute(Discord, client, message, args) {

        // miscellaneous
        var puru_booli_emote = client.emojis.cache.find(emoji => emoji.name === "purubooli");

        // console.log("args[1]="+args[1]);
        // console.log("args[2]="+args[2]);
        // console.log("args[3]="+args[3]);

        // first check if the args fields are registered one by one
        var ar_registered = false;
        var exp_registered = false;
        var num_weis_registered = false;

        if (typeof args[1] !== 'undefined') {
            ar_registered = true;
        }
        if (typeof args[2] !== 'undefined') {
            exp_registered = true;
        }
        if (typeof args[3] !== 'undefined') {
            num_weis_registered = true;
        }
        // console.log("ar_registered="+ar_registered);
        // console.log("exp_registered="+exp_registered);
        // console.log("num_weis_registered="+num_weis_registered);

        // fetching the values into local variables
        typeof ar; // user's AR (adventure rank)
        typeof exp; // user's current exp
        typeof num_weis; // number of weis done a day

        try {
            ar = parseInt(args[1]);
            exp = parseInt(args[2]);
            num_weis = parseInt(args[3]);
        } catch {}
        // console.log("ar="+ar);
        // console.log("exp="+exp);
        // console.log("num_weis="+num_weis);

        /* Input validity check & print help message*/
        // send help manual if no argument inputs registered
        if (!ar_registered) {
            client.commands.get('genshin_ar_counter_help').execute(Discord, message);
            return;
        }
        // if ar input is given but NaN
        else if (ar_registered && Number.isNaN(ar)) {
            console.log('ar input is given but NaN');
            message.channel.send(`${HELP_MESSAGE} ${puru_booli_emote}`);
            return;
        }
        // if exp input is given but NaN
        else if (exp_registered && Number.isNaN(exp)) {
            console.log('exp input is given but NaN');
            message.channel.send(`${HELP_MESSAGE} ${puru_booli_emote}`);
            return;
        }
        // if num_wei input is given but NaN
        else if (num_weis_registered && Number.isNaN(num_weis)) {
            console.log('num_wei input is given but NaN');
            message.channel.send(`${HELP_MESSAGE} ${puru_booli_emote}`);
            return;
        }
        // if ar input is over the max level available in database
        else if (ar >= MAX_LEVEL) {
            // console.log('ar input is more than max AR');
            message.channel.send(`${AR_OVER_MESSAGE} ${puru_booli_emote}`);
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
        var wei_exp_daily = 0; // amount of exp earned daily from wei hilichurl

        // if exp is NaN, calculate assuming exp = 0
        if (Number.isNaN(exp)) {
            // console.log('exp = 0');
            exp = 0;
        } 
        // else if exp is given, calculate with current exp given
        else {
            // console.log('else hit');
            // if the current exp given exceed the cap of the exp of the current level, it's an invalid exp and abort
            if (exp >= parseInt(ar_levels_json[ar-1].exp)) {
                // console.log('exp invalid');
                return;
            }
            curr_total_exp += exp;
        }

        // if num_weis has a valid number input, then change the wei_exp_daily amount accordingly, else leave it at 0
        if (!Number.isNaN(num_weis)) {
            wei_exp_daily += num_weis * WEI_EXP;
        }
        else {
            num_weis = 0;
        }

        // make sure to stop also if ar level exceeds what is stored in database
        while(pos != NUM_LEVELS_COUNTED && curr_level < MAX_LEVEL) {

            var exp_per_com = 0;
            
            // no commission exp if below AR 12
            if (curr_level < 12) {
                exp_per_com = 0;
            }
            else if (curr_level < 16) {
                exp_per_com = EXP_PER_COM_AR12to15;
            }
            else if (curr_level < 25) {
                exp_per_com = EXP_PER_COM_AR16to24;
            }
            else if (curr_level < 35) {
                exp_per_com = EXP_PER_COM_AR25to34;
            }
            else if (curr_level < 55) {
                exp_per_com = EXP_PER_COM_AR35to55;
            }

            var total_exp_daily = RESIN_EXP_PER_DAY + (exp_per_com * NUMBER_OF_COM_PER_DAY) + wei_exp_daily;

            curr_total_exp += total_exp_daily;
            // console.log('adding ' + total_exp_daily);
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
            value: "Calculating starting from AR "+ ar + " - " + exp + "/" + ar_levels_json[ar-1].exp +" and " + num_weis + " weis hunted daily" + "\n\n" + info_string + "\nCalculations only includes EXP gained from commissions, resin and weis\nDoes not include EXP gained from story, events and chests, thus actual progress might differ.\n\nType `~genshin ar` for more info about the command!"
        });

        message.channel.send(embed);
        return;
        
    }
}
