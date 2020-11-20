module.exports = {
    name: 'emote',
    description: "command for using free emotes!",
    execute(client, message, args) {
        const emote = client.emojis.cache.find(emoji => emoji.name === args);
        message.channel.send(`${emote}`);
    }
}
