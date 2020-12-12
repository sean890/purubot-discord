const { ADDRCONFIG } = require('dns');
const { features, exitCode } = require('process');
const path = require('path');

// message for user
const ERROR_MESSAGE = "some fields are missing or delete method incorrect";

// trim method
// function trimChar(string, charToRemove) {
//     while(string.charAt(0)==charToRemove) {
//         string = string.substring(1).trim();
//     }

//     while(string.charAt(string.length-1)==charToRemove) {
//         string = string.substring(0,string.length-1).trim();
//     }

//     return string;
// }

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
    name: 'genshin_delete_weapon',
    description: "command for deleting a weapon in genshin_weapon",
    execute(Discord, client, message, args, db) {

        var [CMD_NAME, weapon_id, weapon_name] = message.content
            .trim()
            .split("|");

        if (typeof weapon_name == 'undefined' || typeof weapon_id == 'undefined') {
            message.channel.send(`${ERROR_MESSAGE}`);
            return;
        }

        weapon_id = trimChar2(weapon_id, '\n', " ");
        weapon_name = trimChar2(weapon_name, '\n', " ");

        db.genshin_weapon.destroy({where: {
            id: weapon_id,
            name: weapon_name
        }});

        var user_message = "You have deleted the weapon with weapon ID: " + weapon_id + " and weapon name: " + weapon_name + ". Take note that if the ID and name is not entered exactly the same nothing would be deleted, please double check if the weapon has been deleted thanks!";

        message.channel.send(`${user_message}`);
        
        return;
        
    }
}
