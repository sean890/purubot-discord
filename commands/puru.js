module.exports = {
    name: 'puru',
    description: "this is a mock commmand",
    execute(message, args) {
        message.channel.send("puru puru uwu");
    }
}