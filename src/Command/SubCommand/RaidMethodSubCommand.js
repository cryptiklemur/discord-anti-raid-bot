const AbstractSubCommand = require('./AbstractSubCommand');
const Helper             = require("../../Helper.js");

class RaidMethodSubCommand extends AbstractSubCommand {
    get name() {
        return 'method';
    }
    
    get configuration() {
        return {
            description:     "Gets or sets the method of handling bad users.",
            fullDescription: "Gets or sets the method of handling bad users. Kick, Ban, or Notify",
            caseInsensitive: true,
            guildOnly:       true,
            usage:           "[method]",
            requirements:    {
                roleNames: ["Raid Manager"]
            }
        };
    }
    
    async run(message, args) {
        if (args.length === 0) {
            await message.reply("Current raid mode method: " + (this.config.method || "kick"));
        
            return;
        }
    
        let stringMethod = args.join(" ").toLowerCase();
        if (['kick', 'ban', 'notify'].indexOf(stringMethod) === -1) {
            await message.reply("Invalid method.");
        
            return;
        }
    
        this.config.set('method', stringMethod);
        await this.config.save();
    
        await message.addReaction("👍🏻");
    }
}

module.exports = RaidMethodSubCommand;