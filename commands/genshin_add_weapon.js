const { ADDRCONFIG } = require('dns');
const { features, exitCode } = require('process');
const path = require('path');

// message for user
const ERROR_MESSAGE = "some fields are missing or add method incorrect";

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
    name: 'genshin_add_weapon',
    description: "command for adding new weapon info into genshin_weapon",
    execute(Discord, client, message, db) {

        // miscellaneous
        var puru_booli_emote = client.emojis.cache.find(emoji => emoji.name === "purubooli");

        var [CMD_NAME, weapon_name, weapon_type, weapon_rarity, weapon_atk, weapon_secondary, weapon_effect, weapon_obtain, weapon_image] = message.content
            .trim()
            .split("|");

        if (typeof weapon_name == 'undefined' || typeof weapon_type == 'undefined' || typeof weapon_rarity == 'undefined' || typeof weapon_atk == 'undefined' || typeof weapon_secondary == 'undefined' || typeof weapon_effect == 'undefined' || typeof weapon_obtain == 'undefined' || typeof weapon_image == 'undefined') {
            message.channel.send(`${ERROR_MESSAGE}`);
            return;
        }

        weapon_name = trimChar2(weapon_name, '\n', " ");
        weapon_type = trimChar2(weapon_type, '\n', " ");
        weapon_rarity = trimChar2(weapon_rarity, '\n', " ");
        weapon_atk = trimChar2(weapon_atk, '\n', " ");
        weapon_secondary = trimChar2(weapon_secondary, '\n', " ");
        weapon_effect = trimChar2(weapon_effect, '\n', " ");
        weapon_obtain = trimChar2(weapon_obtain, '\n', " ");
        weapon_image = trimChar2(weapon_image, '\n', " ");

        // console.log("weapon_name:--"+weapon_name+"--");
        // console.log("weapon_type:--"+weapon_type+"--");
        // console.log("weapon_rarity:--"+weapon_rarity+"--");
        // console.log("weapon_atk:--"+weapon_atk+"--");
        // console.log("weapon_secondary:--"+weapon_secondary+"--");
        // console.log("weapon_effect:--"+weapon_effect+"--");
        // console.log("weapon_obtain:--"+weapon_obtain+"--");
        // console.log("weapon_image:--"+weapon_image+"--");

        db.genshin_weapon.findOrCreate({where: {
            name: weapon_name, 
            type: weapon_type,
            rarity: weapon_rarity,
            atk: weapon_atk,
            secondary: weapon_secondary,
            effect: weapon_effect,
            obtain: weapon_obtain,
            image: weapon_image
        }});

        var user_message = "Success! Please double check if your info is correct, use the delete command if any mistakes are found:\n";
        user_message += "weapon_name: " + weapon_name + '\n';
        user_message += "weapon_type: " + weapon_type + '\n';
        user_message += "weapon_rarity: " + weapon_rarity + '\n';
        user_message += "weapon_atk: " + weapon_atk + '\n';
        user_message += "weapon_secondary: " + weapon_secondary + '\n';
        user_message += "weapon_effect: " + weapon_effect + '\n';
        user_message += "weapon_obtain: " + weapon_obtain + '\n';
        user_message += "weapon_image: " + weapon_image + '\n';

        message.channel.send(`${user_message}`);
        
        return;
        
    }
}
