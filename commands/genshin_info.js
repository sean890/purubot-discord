const { ADDRCONFIG } = require('dns');
const { features, exitCode } = require('process');
const path = require('path');

// fuse.js
const FUSE_SCORE_THRESHOLD = 0.01; // a search result must be lower than this to be qualified
const Fuse = require('fuse.js');
// import data file for fuse
const genshin_info_keywords = require('./user-given-data/genshin_info_keywords.json');
// fuse instance
const fuse = new Fuse(genshin_info_keywords, {
    keys: [
        'keyword',
        'content'
    ],
    includeScore: true,
    findAllMatches: true,
    ignoreLocation: true
});

// miscellaneous emoji
const MIC_EMOJI = "purubooli";

// preparing help message for user
const HELP_MESSAGE = "paimon can't find anything, type `~g info` for the help manual and list of keywords";

module.exports = {
    name: 'genshin_info',
    description: "command for fetching genshin related information with an ID or keyword",
    execute(Discord, client, message, args) {

        // if args[1] is undefined means the user only typed "~g info" which means we display the help message
        if (typeof args[1] === 'undefined') {
            client.commands.get('genshin_info_help').execute(Discord, message);
            return;
        }

        // fetch miscellaneous emoji
        var puru_booli_emote = client.emojis.cache.find(emoji => emoji.name === MIC_EMOJI);

        // fetching the keyword entered by the user
        var input_keyword = "";
        // i starts at 1 because args[0] will be "info" in "~genshin info"
        for (var i = 1; i < args.length; i++) {
            input_keyword += args[i];
            if (i != args.length - 1) {
                input_keyword += " ";
            }
        }

        console.log('keyword fetched: ' + input_keyword);

        /* PHASE 1: Check if user entered a number, which would mean and ID */
        typeof input;

        try {
            input = parseInt(input_keyword);
            console.log(input);
        } catch {}

        console.log("input:"+input);

        // if input is number
        if (!isNaN(input)) {
            console.log('phase 1 occured');
            // compile keywords available in file: ./user-given-data/genshin_info_keywords.json
            var fs = require('fs');
            let rawdata = fs.readFileSync(path.resolve(__dirname, "user-given-data", "genshin_info_keywords.json"));
            let genshin_info_keywords = JSON.parse(rawdata);

            // boolean to check if something is found
            var id_match_found = false;

            /* Matching the input keyword with the database, if possible use a better matcher algorithm */
            for (var i = 0; i < genshin_info_keywords.length; i++) {
                if (genshin_info_keywords[i].id === input_keyword) {
                    id_output += genshin_info_keywords[i].id;
                    keyword_output += genshin_info_keywords[i].keyword;
                    content_output += genshin_info_keywords[i].content;
                    image_output += genshin_info_keywords[i].image;

                    id_match_found = true;
                    break;
                }
            }

            // if no such id exist
            if (id_match_found) {
                message.channel.send(`${HELP_MESSAGE} ${puru_booli_emote}`);
                return;
            }

            // prepare string for output
            var output_title = "ID: " + id_output + " - " + keyword_output;
            var output_value = content_output;
            var output_image_URL = image_output;

            // creating embed message for discord
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .setColor(0xffebfc)
                .setFooter("Made by puru", "https://cdn.discordapp.com/attachments/779164026461618196/779228200357855242/JPEG_20200817_214526.jpg")
                .setImage(output_image_URL)
                /*
                * Takes a Date object, defaults to current date.
                */
                .setTimestamp()
                .setURL("https://discord.js.org/#/docs/main/v12/class/MessageEmbed")
                .addFields({
                    name: output_title,
                    value: output_value
                });

            message.channel.send(embed);
            return;
        }
        /* END OF PHASE 1 */

        /* PHASE 2: If no ID is found, then search using fuse.js */
        console.log('phase 1 did not occur, thus phase 2 initiated');
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
            // variables to store the output data
            var id_output = fuse_results[fuse_results_qualified_pos[0]].item.id;
            var keyword_output = fuse_results[fuse_results_qualified_pos[0]].item.keyword;
            var content_output = fuse_results[fuse_results_qualified_pos[0]].item.content;
            var image_output = fuse_results[fuse_results_qualified_pos[0]].item.image;

            // prepare string for output
            var output_title = "ID: " + id_output + " - " + keyword_output;
            var output_value = content_output;
            var output_image_URL = image_output;

            // creating embed message for discord
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .setColor(0xffebfc)
                .setFooter("Made by puru", "https://cdn.discordapp.com/attachments/779164026461618196/779228200357855242/JPEG_20200817_214526.jpg")
                .setImage(output_image_URL)
                /*
                * Takes a Date object, defaults to current date.
                */
                .setTimestamp()
                .setURL("https://discord.js.org/#/docs/main/v12/class/MessageEmbed")
                .addFields({
                    name: output_title,
                    value: output_value
                });

            message.channel.send(embed);
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
