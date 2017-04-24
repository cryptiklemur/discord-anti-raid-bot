const AbstractCommand = require('./AbstractCommand');

class PrefixCommand extends AbstractCommand {
    get name() { return 'prefix'};
    
    get configuration() {
        return {
            description:     "Updates the prefix.",
            fullDescription: `Updates the prefix for your server.`,
            usage:           '<prefix>',
            caseInsensitive: true,
            guildOnly:       true,
            requirements:    {
                roleNames: ["Raid Manager"]
            }
        };
    }
    
    async run(message, args) {
        this.config.set('prefix', args.join(" ")[0]);
        await this.config.save();
        this.bot.registerGuildPrefix(message.channel.guild.id, args.join(" ")[0]);
    
        await message.addReaction("👍🏻");
    }
}

module.exports = PrefixCommand;
