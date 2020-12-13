const { ADDRCONFIG } = require('dns');
const { features, exitCode } = require('process');
const path = require('path');

// fuse.js
// const FUSE_SCORE_THRESHOLD = 0.2; // a search result must be lower than this to be qualified
const Fuse = require('fuse.js');
var fs = require('fs');

// miscellaneous emoji
const MIC_EMOJI = "purubooli";

// preparing help message for user
const HELP_MESSAGE = "paimon can't find anything, type `~g character/~g c` for the help manual";

function sendDiscordMessage(message, character_name, character_info_link) {
    // prepare string for output
    var output_value = "Infomation for " + character_name + ": " + character_info_link;

    message.channel.send(`${output_value}`);
}

module.exports = {
    name: 'genshin_character',
    description: "command for fetching character information in genshin",
    execute(Discord, client, message, args, db) {

        // if args[1] is undefined means the user only typed "~g character" which means we display the help message
        if (typeof args[1] === 'undefined') {
            client.commands.get('genshin_character_help').execute(Discord, message);
            return;
        }

        // fetch miscellaneous emoji
        var puru_booli_emote = client.emojis.cache.find(emoji => emoji.name === MIC_EMOJI);

        // fetching the keyword entered by the user
        var input_keyword = "";
        // i starts at 1 because args[0] will be "character" in "~genshin character"
        for (var i = 1; i < args.length; i++) {
            input_keyword += args[i];
            if (i != args.length - 1) {
                input_keyword += " ";
            }
        }

        // console.log('keyword fetched: ' + input_keyword);

        // parsing database table "genshin_character" into a json string variable
        db.genshin_character.findAll().then(function (info) {

            var rawdata = JSON.stringify(info, null, 2);
            var character_json_info = JSON.parse(rawdata);

            // fuse instance
            const fuse = new Fuse(character_json_info, {
                keys: [
                    'name'
                ],
                includeScore: true,
                findAllMatches: true,
                ignoreLocation: true
            });

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
            // const fuse_results_qualified_pos = [];
            // for (var i = 0; i < fuse_results.length; i++) {
            //     if (fuse_results[i].score <= FUSE_SCORE_THRESHOLD) {
            //         fuse_results_qualified_pos.push(i);
            //     }
            // }

            //debug
            // console.log("array pos:" + fuse_results_qualified_pos);


            // if (!keyword_match_found) {
            //     message.channel.send(`${HELP_MESSAGE} ${puru_booli_emote}`);
            //     return;
            // }

            // if there is no match, send help message
            if (fuse_results_qualified_pos.length === 0) {
                message.channel.send(`${HELP_MESSAGE} ${puru_booli_emote}`);
                return;
            }
            // if there is only 1 match, display the info directly
            else {

                // character variables to store the output data
                var character_name = fuse_results[fuse_results[0]].item.name;
                var character_link = fuse_results[fuse_results[0]].item.link;

                // send message
                sendDiscordMessage(message, character_name, character_link);
                return
            }
        });
    }
}
