const good_pull = [
    'All your luck is gone for the year',
    'Filthy lucksack',
    'owo so lucky'
]

five_star_pool = [
    'Diluc', 'Jean', 'Keqing', 'Klee', 'Mona', 'Qiqi', 'Tartaglia', 'Venti', 'Xiao', 'Zhongli', 'Ganyu', 'Albedo',
    'Aquila Favonia', 'Skyward Blade', 'Skyward Pride', 'Wolf\'s Gravestone', 'Skyward Spine', 'Primordial Jade Winged-Spear', 'Skyward Harp', 'Amos\' Bow', 'Lost Prayer to the Sacred Winds', 'Skyward Atlas'
]

four_star_pool = [
    'Amber', 'Barbara', 'Beidou', 'Bennett', 'Chongyun', 'Fischl', 'Kaeya', 'Lisa', 'Ningguang', 'Noelle', 'Razor', 'Sucrose', 'Xiangling', 'Xingqiu', 'Diona', 'Xinyan',
    'Favonius Codex', 'Sacrificial Fragments', 'The Widsith', 'Eye of Perception', 'Favonius Sword', 'Lion\'s Roar', 'Sacrificial Sword', 'The Flute', 'Favonius Greatsword', 'Rainslasher', 'The Bell', 'Sacrificial Greatsword', 'Dragon\'s Bane', 'Favonius Lance', 'The Stringless', 'Favonius Warbow', 'Rust', 'Sacrificial Bow'
]

const FIVE_STAR_CHANCE = 0.006;
const FOUR_STAR_CHANCE = 0.051;

const TEN_PULLS = 10;
const HUNDRED_PULLS = 100;

module.exports = {
    name: 'playground_genshin_gacha',
    description: "command for genshin gacha simulation",
    execute(Discord, client, message, args) {

        var NUMBER_OF_PULLS = TEN_PULLS;

        try {
            if (parseInt(args[0]) <= HUNDRED_PULLS && parseInt(args[0]) >= TEN_PULLS) {
                NUMBER_OF_PULLS = parseInt(args[0]);
            }
            else if (parseInt(args[0]) > HUNDRED_PULLS) {
                NUMBER_OF_PULLS = HUNDRED_PULLS;
            }
        } catch {console.log('error brr')}

        // the output gacha result received by user
        var output_result = "";
        var lucky_pull = false;
        var pity_needed = true;

        for (var i = 1; i < NUMBER_OF_PULLS+1; i++) {
            var result = Math.random(); // probability result

            // 5* chance success
            if (result < FIVE_STAR_CHANCE) {
                output_result += "**" + five_star_pool[Math.floor(Math.random() * five_star_pool.length)] + "**" + " :star:  :star: :star: :star: :star: " + '\n';
                lucky_pull = true;
                pity_needed = false;
            }
            // 4* chance success
            else if (result < FIVE_STAR_CHANCE + FOUR_STAR_CHANCE) {
                output_result += four_star_pool[Math.floor(Math.random() * four_star_pool.length)] + " :star: :star: :star: :star: " + '\n';
                pity_needed = false;
            }
            // 4* pity
            else if (i % TEN_PULLS == 0 && pity_needed == true) {
                output_result += four_star_pool[Math.floor(Math.random() * four_star_pool.length)] + " :star: :star: :star: :star: " + '\n';
            }
            
            // reset pity
            if (i % TEN_PULLS == 0) {
                pity_needed = true;
            }
        }

        if (lucky_pull) {
            var extra_text = "\n" + good_pull[Math.floor(Math.random() * good_pull.length)];
            output_result += extra_text;
        }
        

        // creating embed message for discord
        const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setColor(0xffebfc)
        .setFooter("Made by puru", "https://cdn.discordapp.com/attachments/779164026461618196/779228200357855242/JPEG_20200817_214526.jpg")
        /*
         * Takes a Date object, defaults to current date.
         */
        .setTimestamp()
        .setURL("https://discord.js.org/#/docs/main/v12/class/MessageEmbed")
        .addFields({
            name: "Your gacha result for " + NUMBER_OF_PULLS + " pulls",
            value: output_result
        });

        message.channel.send(embed);
        return;
    }
}
