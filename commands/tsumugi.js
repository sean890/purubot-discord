module.exports = {
    name: 'tsumugi',
    description: "this is a mock commmand",
    execute(client, message, args) {
        // const emote = client.emojis.cache.get('779194670848147457');
        const emote = client.emojis.cache.find(emoji => emoji.name === 'tsumugi');
        message.channel.send(`${emote}`);
    }
}
