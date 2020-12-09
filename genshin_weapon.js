const { ADDRCONFIG } = require('dns');
const { features, exitCode } = require('process');
const path = require('path');

// fuse.js
const FUSE_SCORE_THRESHOLD = 0.2; // a search result must be lower than this to be qualified
const Fuse = require('fuse.js');
// import data file for fuse
// compile keywords available in file: ./user-given-data/genshin_info_keywords.csv
var fs = require('fs');
const parse = require('csv-parse/lib/sync');
var genshin_info_keywords = parse(fs.readFileSync(path.resolve(__dirname, "user-given-data", "genshin_weapons.csv")), {
    delimiter: "|",
    columns: true,
    skip_empty_lines: true
})
// const genshin_info_keywords = require('./user-given-data/genshin_info_keywords.json');
// fuse instance
const fuse = new Fuse(genshin_info_keywords, {
    keys: [
        'name',
        'type',
        'rarity',
        'secondary',
        'effect',
        'obtain'
    ],
    includeScore: true,
    findAllMatches: true,
    ignoreLocation: true
});

// miscellaneous emoji
const MIC_EMOJI = "purubooli";

// preparing help message for user
const HELP_MESSAGE = "paimon can't find anything, type `~g weapon/~g w` for the help manual";

module.exports = {
    name: 'genshin_weapon',
    description: "command for fetching weapons information in genshin",
    execute(Discord, client, message, args) {

        // if args[1] is undefined means the user only typed "~g weapon" which means we display the help message
        if (typeof args[1] === 'undefined') {
            client.commands.get('genshin_weapon_help').execute(Discord, message);
            return;
        }

        // fetch miscellaneous emoji
        var puru_booli_emote = client.emojis.cache.find(emoji => emoji.name === MIC_EMOJI);

        // fetching the keyword entered by the user
        var input_keyword = "";
        // i starts at 1 because args[0] will be "weapon" in "~genshin weapon"
        for (var i = 1; i < args.length; i++) {
            input_keyword += args[i];
            if (i != args.length - 1) {
                input_keyword += " ";
            }
        }

        console.log('keyword fetched: ' + input_keyword);

        // fuse search algorithm
        const fuse_results = fuse.search(input_keyword);

        // debug
        // console.log("fuse_results");
        // console.log(fuse_results);
        // console.log("fuse_results[0]");
        // console.log(fuse_results[0]);
        // console.log("fuse_results[0].item.keyword");
        // console.log(fuse_results[0].item.keyword);
        // console.log("fuse_results[0].score");
        // console.log(fuse_results[0].score);
        // console.log("fuse_results.length");
        // console.log(fuse_results.length);

        // array to store all qualified positions of results in fuse_results which has a score lower than FUSE_SCORE_THRESHOLD
        const fuse_results_qualified_pos = [];
        for (var i = 0; i < fuse_results.length; i++) {
            if (fuse_results[i].score <= FUSE_SCORE_THRESHOLD) {
                fuse_results_qualified_pos.push(i);
            }
        }

        //debug
        console.log("array pos:" + fuse_results_qualified_pos);


        // if (!keyword_match_found) {
        //     message.channel.send(`${HELP_MESSAGE} ${puru_booli_emote}`);
        //     return;
        // }

        // if there is no match, send help message
        if (fuse_results_qualified_pos.length === 0) {
            console.log('0 search results');
            message.channel.send(`${HELP_MESSAGE} ${puru_booli_emote}`);
            return;
        }
        // if there is only 1 match, display the info directly
        else if (fuse_results_qualified_pos.length === 1) {
            console.log('1 search result');

            // weapon variables to store the output data
            var weapon_name = fuse_results[fuse_results_qualified_pos[0]].item.name;
            var weapon_type = fuse_results[fuse_results_qualified_pos[0]].item.type;
            var weapon_rarity = fuse_results[fuse_results_qualified_pos[0]].item.rarity;
            var weapon_atk = fuse_results[fuse_results_qualified_pos[0]].item.atk;
            var weapon_secondary = fuse_results[fuse_results_qualified_pos[0]].item.secondary;
            var weapon_effect = fuse_results[fuse_results_qualified_pos[0]].item.effect;
            var weapon_obtain = fuse_results[fuse_results_qualified_pos[0]].item.obtain;

            // prepare string for output
            var output_title = "ID: " + id_output + " - " + keyword_output;
            var output_value = content_output;

            var final_output = "**" + output_title + "**" + "\n" + output_value;

            // creating message for discord
            message.channel.send(final_output);
            return;
        }
        // if there is more than 1 search result, display their ID and keywords like in genshin_info_help instead
        else if (fuse_results_qualified_pos.length > 1) {
            console.log('multiple search results');
            // preparing the search_results_string
            var search_results_string = "";

            for (var i = 0; i < fuse_results_qualified_pos.length; i++) {

                var id_output = fuse_results[fuse_results_qualified_pos[i]].item.id;
                var keyword_output = fuse_results[fuse_results_qualified_pos[i]].item.keyword;

                search_results_string += "ID: " + id_output + " - " + keyword_output + "\n";
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
                    name: "Search results for '" + input_keyword + "'",
                    value: search_results_string + "\n\nType `~g info [ID]` to fetch the corresponding information."
                });

            message.channel.send(embed);
            return;
        }
        /* END OF PHASE 2 */
    }

}
