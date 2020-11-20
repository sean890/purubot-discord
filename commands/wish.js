module.exports = {
    name: 'wish',
    description: "genshin impact wish simulator",
    execute(Discord, client, message, args) {
        // gacha 5* result image url
        var gacha_image = "";

        // create discord embed message to be displayed to user
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL())
            .setColor(0xffebfc)
            .setFooter("Made by puru", "https://cdn.discordapp.com/attachments/779164026461618196/779228200357855242/JPEG_20200817_214526.jpg")
            .setImage("https://cdn.discordapp.com/attachments/779164026461618196/779232478954913802/Genshin_Impact_20201001085433.jpg")
            /*
             * Takes a Date object, defaults to current date.
             */
            .setTimestamp()
            .setURL("https://discord.js.org/#/docs/main/v12/class/MessageEmbed")
            .addFields({
                name: "Standard Wish | Wanderlust Invocation",
                value: ""
            })
            /*
             * Inline fields may not display as inline if the thumbnail and/or image is too big.
             */
            .addFields({ name: "Results", value: "test field.", inline: true })
            /*
             * Blank field, useful to create some space.
             */
            .addFields({ name: '\u200b', value: '\u200b' })
            .addFields({ name: "test title", value: "test field.", inline: true });

        message.channel.send(embed);
    }
}
