const AbstractSubCommand = require('./AbstractSubCommand');

class RaidWhitelistSubCommand extends AbstractSubCommand {
    get name() {
        return 'whitelist';
    }
    
    get configuration() {
        return {
            description:     "Updates the whitelist.",
            fullDescription: "Toggles whether or not a user is whitelisted",
            caseInsensitive: true,
            guildOnly:       true,
            usage:           "[user id]",
            requirements:    {
                roleNames: ["Raid Manager"]
            }
        };
    }
    
    async run(message, args) {
        if (args.length === 0) {
            if (!this.config.whitelist || this.config.whitelist.length === 0) {
                return await message.reply("Current Whitelist: None");
            }
            
            await this.bot.createPaste(message.channel.id, "Current Whitelist: ", {
                name:     "Current Whitelist",
                contents: this.config.whitelist.join("\n"),
                privacy:  1
            });
            
            return;
        }
        
        let whitelist = this.config.whitelist;
        let index = whitelist.findIndex(x => x.toString() === args[0]);
        if (index >= 0) {
            whitelist.splice(index, 1);
        } else {
            whitelist.push(Long.fromString(args[0]));
        }
        
        this.config.set('whitelist', whitelist);
        await this.config.save();
        
        await message.addReaction("👍🏻");
    }
}

module.exports = RaidWhitelistSubCommand;