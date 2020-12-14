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
    name: 'genshin_delete_artifact',
    description: "command for deleting an artifact in genshin_artifact",
    execute(Discord, client, message, args, db) {

        var [CMD_NAME, artifact_id, artifact_name] = message.content
            .trim()
            .split("|");

        if (typeof artifact_id == 'undefined' || typeof artifact_name == 'undefined') {
            message.channel.send(`${ERROR_MESSAGE}`);
            return;
        }

        artifact_id = trimChar2(artifact_name, '\n', " ");
        artifact_name = trimChar2(artifact_name, '\n', " ");

        db.genshin_artifact.destroy({
            where: {
                id: artifact_id,
                name: artifact_name
            }
        });

        var user_message = "You have deleted the artifact with artifact_id: " + artifact_id + " and artifact_name:" + artifact_name + ". Take note that if the name is not entered exactly the same nothing would be deleted, please double check if the artifact has been deleted thanks!";

        message.channel.send(`${user_message}`);

        return;

    }
}
