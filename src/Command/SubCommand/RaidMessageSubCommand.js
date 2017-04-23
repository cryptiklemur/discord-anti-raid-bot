const AbstractSubCommand = require('./AbstractSubCommand');
const Helper             = require("../../Helper.js");

class RaidMessageSubCommand extends AbstractSubCommand {
    get name() {
        return 'message';
    }
    
    get configuration() {
        return {
            description:     "Gets or sets the message sent to users.",
            fullDescription: "Gets or sets the message sent to users matching the filters",
            caseInsensitive: true,
            guildOnly:       true,
            usage:           "[method]",
            requirements:    {
                permissions: {
                    "manageGuild": true
                }
            }
        };
    }
    
    async run(message, args) {
        if (args.length === 0) {
            await message.reply(
                "Current raid mode message: ```"
                + (this.config.message || "Sorry, this server is currently under anti-raid mode.")
                + "```"
            );
        
            return;
        }
    
        this.config.set('message', args.join(" "));
        await this.config.save();
    
        await message.addReaction("👍🏻");
    }
}

module.exports = RaidMessageSubCommand;