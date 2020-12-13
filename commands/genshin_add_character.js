const { ADDRCONFIG } = require('dns');
const { features, exitCode } = require('process');
const path = require('path');

// message for user
const ERROR_MESSAGE = "some fields are missing or add method incorrect";

// trim method
function trimChar2(string, charToRemove, charToRemove2) {
    while(string.charAt(0)==charToRemove || string.charAt(0)==charToRemove2) {
        string = string.substring(1).trim();
    }

    while(string.charAt(string.length-1)==charToRemove || string.charAt(string.length-1)==charToRemove2) {
        string = string.substring(0,string.length-1).trim();
    }

    return string;
}

module.exports = {
    name: 'genshin_add_character',
    description: "command for adding new character info into genshin_character",
    execute(Discord, client, message, db) {
        var [CMD_NAME, character_name, character_link] = message.content
            .trim()
            .split("|");

        if (typeof character_name == 'undefined' || typeof character_link == 'undefined') {
            message.channel.send(`${ERROR_MESSAGE}`);
            return;
        }

        character_name = trimChar2(character_name, '\n', " ");
        character_link = trimChar2(character_link, '\n', " ");

        db.genshin_character.findOrCreate({where: {
            name: character_name,
            link: character_link
        }});

        var user_message = "Success! Please double check if your info is correct, use the delete command if any mistakes are found:\n";
        user_message += "character_name: " + character_name + '\n';
        user_message += "character_link: " + character_link + '\n';

        message.channel.send(`${user_message}`);
        return;
        
    }
}
