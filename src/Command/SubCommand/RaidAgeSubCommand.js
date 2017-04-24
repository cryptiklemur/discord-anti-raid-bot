const AbstractSubCommand = require('./AbstractSubCommand');
const Helper             = require("../../Helper.js");

class RaidAgeSubCommand extends AbstractSubCommand {
    get name() {
        return 'age';
    }
    
    get configuration() {
        return {
            description:     "Gets or sets the age threshold.",
            fullDescription: "Gets or sets the age threshold for the raid mode. Accounts less than this old, will be considered bad.",
            caseInsensitive: true,
            guildOnly:       true,
            usage:           "[age]",
            requirements:    {
                roleNames: ["Raid Manager"]
            }
        };
    }
    
    async run(message, args) {
        if (args.length === 0) {
            await message.reply("Current raid mode age threshold: " + (this.config.age || "24h"));
            
            return;
        }
        
        let duration = args.join(" ").toLowerCase();
        if (duration !== 'all') {
            try {
                duration = Helper.ParseDuration(duration);
            } catch (error) {
                await message.reply("Invalid duration. Format is `0d 0h0m0s`. Leading periods are optional.");
        
                return;
            }
        }
    
        this.config.set('age', duration);
        await this.config.save();
        
        await message.addReaction("👍🏻");
    }
}

module.exports = RaidAgeSubCommand;