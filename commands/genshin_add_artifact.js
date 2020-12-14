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
    name: 'genshin_add_artifact',
    description: "command for adding new artifact info into genshin_artifact",
    execute(Discord, client, message, db) {
        var [CMD_NAME, artifact_name, artifact_effect, artifact_image] = message.content
            .trim()
            .split("|");

        if (typeof artifact_name == 'undefined' || typeof artifact_effect == 'undefined' || typeof artifact_image == 'undefined') {
            message.channel.send(`${ERROR_MESSAGE}`);
            return;
        }

        artifact_name = trimChar2(artifact_name, '\n', " ");
        artifact_effect = trimChar2(artifact_effect, '\n', " ");
        artifact_image = trimChar2(artifact_image, '\n', " ");

        db.genshin_artifact.findOrCreate({where: {
            name: artifact_name,
            effect: artifact_effect,
            image: artifact_image
        }});

        var user_message = "Success! Please double check if your info is correct, use the delete command if any mistakes are found:\n";
        user_message += "artifact_name: " + artifact_name + '\n';
        user_message += "artifact_effect: " + artifact_effect + '\n';
        user_message += "artifact_image: " + artifact_image + '\n';

        message.channel.send(`${user_message}`);
        return;
        
    }
}
