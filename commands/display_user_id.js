module.exports = {
    name: 'display_user_id',
    description: "command for displaying user id",
    execute(client, message, args, db) {
        var id = message.author.id;
        // console.log(id);
        if (typeof id !== "undefined") {
            message.channel.send(`${id}`);
        }
    }
}
