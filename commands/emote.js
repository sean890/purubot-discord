module.exports = {
    name: 'emote',
    description: "command for using free emotes!",
    execute(client, message, args, db) {
        db.genshin_info.findAll()
            .then(function(info) {
                var rawdata = JSON.stringify(info, null, 2);
                var json_info = JSON.parse(rawdata);
                console.log(json_info[0].id);
                console.log(json_info[0].keyword);
                console.log(json_info[0].content);
            });

            
        var emote = client.emojis.cache.find(emoji => emoji.name === args[0]);
        if (String(emote) !== "undefined") {
            message.channel.send(`${emote}`);
        }

        
        // try {
        //     message.delete();
        // } catch(error) {
        //     // console.error("WARNING: Error occured when trying to delete user's message: "+error)
        // }
    }
}
