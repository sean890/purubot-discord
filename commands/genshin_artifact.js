const { ADDRCONFIG } = require('dns');
const { features, exitCode } = require('process');
const path = require('path');

// fuse.js
const FUSE_SCORE_THRESHOLD = 0.35; // a search result must be lower than this to be qualified
const Fuse = require('fuse.js');
// import data file for fuse
// compile keywords available in file: ./user-given-data/genshin_info_keywords.csv
var fs = require('fs');
// const parse = require('csv-parse/lib/sync');
// var genshin_info_keywords = parse(fs.readFileSync(path.resolve(__dirname, "user-given-data", "genshin_artifacts.csv")), {
//     delimiter: "|",
//     columns: true,
//     skip_empty_lines: true
// })

// miscellaneous emoji
const MIC_EMOJI = "purubooli";

// preparing help message for user
const HELP_MESSAGE = "paimon can't find anything, type `paimon! artifact/p! a` for the help manual";

function sendDiscordEmbedMessage(Discord, message, artifact_id, artifact_name, artifact_effect, artifact_image) {
    // prepare string for output
    var output_title = artifact_id + " - " + artifact_name + " set";
    var output_value = artifact_effect;

    // creating embed message for discord
    const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setColor(0xffebfc)
        .setFooter("Made by puru", "https://cdn.discordapp.com/attachments/779164026461618196/779228200357855242/JPEG_20200817_214526.jpg")
        /*
        * Takes a Date object, defaults to current date.
        */
        .setThumbnail(artifact_image)
        .setTimestamp()
        .setURL("https://discord.js.org/#/docs/main/v12/class/MessageEmbed")
        .addFields({
            name: output_title,
            value: output_value
        });

    message.channel.send(embed);
}

module.exports = {
    name: 'genshin_artifact',
    description: "command for fetching artifacts information in genshin",
    execute(Discord, client, message, args, db) {

        // if args[1] is undefined means the user only typed "[!] artifact" which means we display the help message
        if (typeof args[1] === 'undefined') {
            client.commands.get('genshin_artifact_help').execute(Discord, message);
            return;
        }

        // fetch miscellaneous emoji
        var puru_booli_emote = client.emojis.cache.find(emoji => emoji.name === MIC_EMOJI);

        // fetching the keyword entered by the user
        var input_keyword = "";
        // i starts at 1 because args[0] will be "artifact" in "p! artifact"
        for (var i = 1; i < args.length; i++) {
            input_keyword += args[i];
            if (i != args.length - 1) {
                input_keyword += " ";
            }
        }

        // console.log('keyword fetched: ' + input_keyword);

        // parsing database table "genshin_artifact" into a json string variable
        db.genshin_artifact.findAll().then(function (info) {

            var rawdata = JSON.stringify(info, null, 2);
            var artifact_json_info = JSON.parse(rawdata);
            // console.log("start of findAll()");
            // console.log(artifact_json_info[0].id);
            // console.log(artifact_json_info[0].name);
            // console.log(artifact_json_info[0].atk);

            /* SCENARIO 1: Check if user entered a number, which would mean and ID */
            typeof input;
            try {
                input = parseInt(input_keyword);
                // console.log(input);
            } catch { }

            // if input is number
            if (!isNaN(input)) {
                // boolean to check if something is found
                var id_match_found = false;

                // output variables
                var artifact_id = "";
                var artifact_name = "";
                var artifact_effect = "";
                var artifact_image = "";

                /* Matching the input keyword with the database, if possible use a better matcher algorithm */
                for (var i = 0; i < artifact_json_info.length; i++) {
                    // console.log(artifact_json_info[i].id + " vs " + input_keyword);
                    if (parseInt(artifact_json_info[i].id) === input) {
                        // console.log("found");
                        artifact_id += artifact_json_info[i].id;
                        artifact_name += artifact_json_info[i].name;
                        artifact_effect += artifact_json_info[i].effect;
                        artifact_image += artifact_json_info[i].image;

                        id_match_found = true;
                        break;
                    }
                }

            // if no such id exist
            if (!id_match_found) {
                message.channel.send(`${HELP_MESSAGE} ${puru_booli_emote}`);
                return;
            }

            // send message
            sendDiscordEmbedMessage(Discord, message, artifact_id, artifact_name, artifact_effect, artifact_image);

            }
            /* SCENARIO 2 */
            else {
                // fuse instance
                const fuse = new Fuse(artifact_json_info, {
                    keys: [
                        'name',
                        'effect'
                    ],
                    includeScore: true,
                    findAllMatches: true,
                    ignoreLocation: true
                });

                // fuse search algorithm
                const fuse_results = fuse.search(input_keyword);

                // debug
                console.log("fuse_results");
                console.log(fuse_results);
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
                // console.log("array pos:" + fuse_results_qualified_pos);


                // if (!keyword_match_found) {
                //     message.channel.send(`${HELP_MESSAGE} ${puru_booli_emote}`);
                //     return;
                // }

                // if there is no match, send help message
                if (fuse_results_qualified_pos.length === 0) {
                    // console.log('0 search results');
                    message.channel.send(`${HELP_MESSAGE} ${puru_booli_emote}`);
                    return;
                }
                // if there is only 1 match, display the info directly
                else if (fuse_results_qualified_pos.length === 1) {
                    // console.log('1 search result');

                    // artifact variables to store the output data
                    var artifact_id = fuse_results[fuse_results_qualified_pos[0]].item.id;
                    var artifact_name = fuse_results[fuse_results_qualified_pos[0]].item.name;
                    var artifact_effect = fuse_results[fuse_results_qualified_pos[0]].item.effect;
                    var artifact_image = fuse_results[fuse_results_qualified_pos[0]].item.image;

                    // send message
                    sendDiscordEmbedMessage(Discord, message, artifact_id, artifact_name, artifact_effect, artifact_image)
                }
                // if there is more than 1 search result, display their ID and keywords like in genshin_info_help instead
                else if (fuse_results_qualified_pos.length > 1) {
                    // console.log('multiple search results');
                    // preparing the search_results_string
                    var search_results_string = "";

                    for (var i = 0; i < fuse_results_qualified_pos.length; i++) {

                        var id_output = fuse_results[fuse_results_qualified_pos[i]].item.id;
                        var keyword_output = fuse_results[fuse_results_qualified_pos[i]].item.name;

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
                            value: search_results_string + "\n\nType `p! a [ID]` to fetch the corresponding information."
                        });

                    message.channel.send(embed);
                    return;
                }
            }
            /* END OF SCENARIO 2 */



        });


    }
}
