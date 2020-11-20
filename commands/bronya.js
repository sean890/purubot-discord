module.exports = {
    name: 'bronya',
    description: "this is a mock commmand",
    execute(message, args) {
        message.channel.send('https://cdn.discordapp.com/emojis/482225565361897502.gif?v=1');
    }
}