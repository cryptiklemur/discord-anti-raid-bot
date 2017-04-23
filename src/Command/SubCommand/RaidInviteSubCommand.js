const AbstractSubCommand = require('./AbstractSubCommand');
const Helper             = require("../../Helper.js");

class RaidInviteSubCommand extends AbstractSubCommand {
    get name() {
        return 'invite';
    }
    
    get configuration() {
        return {
            description:     "Updates the invite code to send.",
            fullDescription: "Updates the invite code to give to users matching the filter. If `unset` is used. will remove the invite.",
            caseInsensitive: true,
            guildOnly:       true,
            usage:           "[invite]",
            requirements:    {
                permissions: {
                    "manageGuild": true
                }
            }
        };
    }
    
    async run(message, args) {
        if (args.length === 0) {
            await message.reply("Current invite: " + (this.config.invite || "No invite defined"));
        
            return;
        }
    
    
        this.config.set('invite', args[0] === 'unset' ? undefined : args.join(" "));
        await this.config.save();
    
        await message.addReaction("👍🏻");
    }
}

module.exports = RaidInviteSubCommand;