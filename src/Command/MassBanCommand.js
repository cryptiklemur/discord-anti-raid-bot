const AbstractCommand = require('./AbstractCommand');
const BanQueue        = require('../Queue/BanQueue.js');

class MassBanCommand extends AbstractCommand {
    get name() {
        return 'massban';
    }
    
    get configuration() {
        return {
            description:     "Mass bans either a list of id's or a pastebin of ids.",
            fullDescription: "Mass bans either a list of id's or a pastebin of ids.",
            caseInsensitive: true,
            guildOnly:       true,
            usage:           "<...ids or pastebin url>",
            requirements:    {
                roleNames: ["Raid Manager"]
            }
        };
    }
    
    async run(message, args) {
        const guild = message.channel.guild;
        
        if (args[0].indexOf('http') === 0) {
            let reply = await message.reply("Downloading list.");
            paste.login(process.env.PASTEBIN_USERNAME, process.env.PASTEBIN_PASSWORD, async (success, data) => {
                await reply.edit("List downloaded. Adding to bans queue");
                
                data.split("\n").filter(x => !isNaN(x)).forEach(x => {
                    if (!this.bot.banQueues[guild.id]) {
                        this.bot.banQueues[guild.id] = new BanQueue(this.bot, guild);
                    }
                    
                    this.bot.banQueues[guild.id].push({id: x});
                });
                
                await reply.edit("Bans added to queue.");
            });
            
            return;
        }
        
        let reply = await message.reply("Adding to bans queue");
        if (!this.bot.banQueues[guild.id]) {
            this.bot.banQueues[guild.id] = new BanQueue(this.bot, guild);
        }
        
        for (let x of args) {
            this.bot.banQueues[guild.id].push({id: x});
        }
        
        await reply.edit("Bans added to queue.");
    }
}

module.exports = MassBanCommand;