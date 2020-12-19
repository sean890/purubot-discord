const extra_texts = [
    'How lewddd.',
    'owo',
    '>///<',
    'How horny.'
]

const kiss_gifs = [
    'https://cdn.discordapp.com/attachments/779164026461618196/789802851635036190/maxresdefault.jpg',
    'https://cdn.discordapp.com/attachments/779164026461618196/789809812610744340/tenor_1.gif',
    'https://cdn.discordapp.com/attachments/779164026461618196/789810099656327168/tenor_3.gif',
    'https://cdn.discordapp.com/attachments/779164026461618196/789813792389201930/tumblr_nuj0k5ZyYC1qcsnnso1_500.gif',
    'https://cdn.discordapp.com/attachments/779164026461618196/789814001001299968/4037e6ae03275bd33b3e5df50acda41a.gif',
    'https://cdn.discordapp.com/attachments/779164026461618196/789814797343391754/tenor_4.gif'
]

const lick_gifs = [
    'https://cdn.discordapp.com/attachments/779164026461618196/789809902263992340/tenor_2.gif',
    'https://cdn.discordapp.com/attachments/779164026461618196/789815107119087646/tenor_5.gif'

]

const hug_gifs = [
    'https://cdn.discordapp.com/attachments/779164026461618196/789815107119087646/tenor_5.gif',
    'https://cdn.discordapp.com/attachments/779164026461618196/789815821022134292/tenor_8.gif'
]

const pat_gifs = [
    'https://cdn.discordapp.com/attachments/779164026461618196/789815580010086430/tenor_7.gif',
    'https://cdn.discordapp.com/attachments/779164026461618196/789816574520852490/tenor_10.gif',
    'https://cdn.discordapp.com/attachments/779164026461618196/789816575065718784/tenor_9.gif',
    'https://cdn.discordapp.com/attachments/779164026461618196/789816889336528906/tenor_11.gif'
]

module.exports = {
    name: 'mic',
    description: "command for using micellanous gifs",
    execute(Discord, client, message, CMD_NAME, args) {
        // db.mic.findAll()
        //     .then(function(info) {
        //         var rawdata = JSON.stringify(info, null, 2);
        //         var json_info = JSON.parse(rawdata);
        //         console.log(json_info[0].id);
        //         console.log(json_info[0].keyword);
        //         console.log(json_info[0].content);
        //     });
        var target_user = args[0];
        var action_name = "";
        var link = "";
        var extra_text = ""

        if (CMD_NAME === '!kiss') {
            action_name += "kissing";
            link += kiss_gifs[Math.floor(Math.random() * kiss_gifs.length)];
        }
        else if (CMD_NAME === '!lick') {
            action_name += "licking";
            link += lick_gifs[Math.floor(Math.random() * lick_gifs.length)];
        }
        else if (CMD_NAME === '!hug') {
            action_name += "hugging";
            link += hug_gifs[Math.floor(Math.random() * hug_gifs.length)];
        }
        else if (CMD_NAME === '!pat') {
            action_name += "patting";
            link += pat_gifs[Math.floor(Math.random() * pat_gifs.length)];
        }

        extra_text = extra_texts[Math.floor(Math.random() * extra_texts.length)]

        // creating embed message for discord
        const embed = new Discord.MessageEmbed()
        .setColor(0xffebfc)
        /*
        * Takes a Date object, defaults to current date.
        */
        .setURL("https://discord.js.org/#/docs/main/v12/class/MessageEmbed")
        .setImage(link)
        .setDescription(`<@${message.author.id}> is ${action_name} ${target_user}. ${extra_text}`)

        message.channel.send(embed);
        return;
    }
}
