const { ADDRCONFIG } = require('dns');
const { features, exitCode } = require('process');
const path = require('path');

// message for user
const ERROR_MESSAGE = "some fields are missing or delete method incorrect";

function trimChar2(string, charToRemove, charToRemove2) {
    while (string.charAt(0) == charToRemove || string.charAt(0) == charToRemove2) {
        string = string.substring(1).trim();
    }

    while (string.charAt(string.length - 1) == charToRemove || string.charAt(string.length - 1) == charToRemove2) {
        string = string.substring(0, string.length - 1).trim();
    }

    return string;
}

module.exports = {
    name: 'genshin_delete_character',
    description: "command for deleting a character in genshin_character",
    execute(Discord, client, message, args, db) {

        var [CMD_NAME, character_name] = message.content
            .trim()
            .split("|");

        if (typeof character_name == 'undefined') {
            message.channel.send(`${ERROR_MESSAGE}`);
            return;
        }

        character_name = trimChar2(character_name, '\n', " ");

        db.genshin_character.destroy({
            where: {
                name: character_name
            }
        });

        var user_message = "You have deleted the character with character_name: " + character_name + ". Take note that if the name is not entered exactly the same nothing would be deleted, please double check if the character has been deleted thanks!";

        message.channel.send(`${user_message}`);

        return;

    }
}
